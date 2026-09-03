/**
 * Backfill the reservations dashboard from a Zoho Calendar CSV export.
 *
 * The calendar events were created by our own /api/reserva route (it mails
 * info@ an .ics invite per booking), so SUMMARY/DESCRIPTION follow a known
 * shape and parse deterministically:
 *
 *   SUMMARY:     "Reserva · <nombre> · <n> pers. · <teléfono>"
 *   DESCRIPTION: "Nombre: …\nPersonas: …\nTeléfono: …\nCorreo: …\nMensaje: …"
 *                (English exports use Name/Guests/Phone/Email/Message)
 *   DTSTART:     "2026-08-15 20:00:00"  (+ TIMEZONE column)
 *
 * Imported bookings land as `accepted` with `confirmationSentAt` already set —
 * they're historical records that were handled long ago, so they must never
 * show up as pending work, and must never trigger a confirmation email to a
 * guest who dined months ago.
 *
 * Usage:
 *   npx tsx scripts/import-calendar-csv.ts [path/to/export.csv] [--dry-run]
 *
 * Writes to whichever store is configured (see src/lib/redis.ts): the local
 * .data JSON file, or Upstash when its credentials are present — run
 * `vercel env pull .env.local --environment=production` first for that.
 * Safe to re-run — rows already imported (matched on calendar UID) are
 * skipped, so you can run it locally now and again against Upstash later.
 */

import { readFileSync } from "fs";
import { loadEnvConfig } from "@next/env";
import { addReservationsBulk, type Reservation } from "../src/lib/reservations";
import { storeBackendName } from "../src/lib/redis";

const DEFAULT_CSV = ".data/import/info.csv";

// ---------- CSV parsing (quoted fields, embedded commas/newlines) ----------

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** Zoho escapes non-ASCII as \uXXXX and keeps iCalendar's \n , ; escapes. */
function unescapeText(s: string): string {
  if (!s) return "";
  return s
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

// ---------- Field extraction ----------

const FIELD_ALIASES: Record<string, string[]> = {
  name: ["Nombre", "Name"],
  guests: ["Personas", "Guests"],
  phone: ["Teléfono", "Telefono", "Phone"],
  email: ["Correo", "Email"],
  message: ["Mensaje", "Message"],
};

function parseDescription(desc: string): Record<string, string> {
  const found: Record<string, string> = {};
  for (const line of desc.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      if (aliases.includes(key)) found[field] = value;
    }
  }
  return found;
}

/** "2026-08-15 20:00:00" → { date: "2026-08-15", time: "20:00" } */
function parseStart(dtstart: string): { date: string; time: string } | null {
  const m = dtstart.trim().match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})/);
  if (!m) return null;
  return { date: m[1], time: `${m[2]}:${m[3]}` };
}

type ImportRow = Omit<Reservation, "id"> & { createdAt: string };

function buildRows(csvText: string): { rows: ImportRow[]; skipped: string[] } {
  const table = parseCsv(csvText.replace(/^﻿/, ""));
  const header = table[0].map((h) => h.trim());
  const col = (name: string) => header.indexOf(name);

  const iSummary = col("SUMMARY");
  const iDesc = col("DESCRIPTION");
  const iStart = col("DTSTART");
  const iUid = col("UID");
  const iCreated = col("CREATED");

  const rows: ImportRow[] = [];
  const skipped: string[] = [];

  for (const raw of table.slice(1)) {
    if (raw.length <= 1) continue; // blank line
    const summary = unescapeText(raw[iSummary] ?? "");
    const desc = unescapeText(raw[iDesc] ?? "");
    const start = parseStart(raw[iStart] ?? "");

    if (!start) {
      skipped.push(`sin fecha usable: ${summary.slice(0, 60)}`);
      continue;
    }

    const f = parseDescription(desc);
    // Fall back to the name in the SUMMARY ("Reserva · <nombre> · …").
    const summaryName = summary.split("·")[1]?.trim();
    const name = f.name || summaryName || "";
    if (!name) {
      skipped.push(`sin nombre: ${summary.slice(0, 60)}`);
      continue;
    }

    // English exports say "Booking · …" / use Name/Guests/… keys.
    const isEnglish = /^Booking\b/.test(summary) || /(^|\n)Name:/.test(desc);
    const blank = (s: string | undefined) => (s && s.trim() ? s.trim() : "—");
    const uid = (raw[iUid] ?? "").trim();
    const created = (raw[iCreated] ?? "").trim();
    const createdAt = parseStart(created)
      ? new Date(created.replace(" ", "T")).toISOString()
      : new Date(`${start.date}T${start.time}:00`).toISOString();

    rows.push({
      name,
      email: blank(f.email),
      phone: blank(f.phone),
      date: start.date,
      time: start.time,
      guests: blank(f.guests),
      message: blank(f.message),
      lang: isEnglish ? "en" : "es",
      // Historical: already handled, and must never re-mail the guest.
      status: "accepted",
      confirmationSentAt: createdAt,
      sourceUid: uid || undefined,
      createdAt,
    });
  }

  return { rows, skipped };
}

// ---------- Entry point ----------

async function main() {
  // A standalone script doesn't get .env.local for free the way `next` does.
  // Loading it here (before any store call — the backend is chosen per
  // operation, at call time) makes `vercel env pull .env.local` enough to
  // import straight into Upstash instead of the local JSON file.
  loadEnvConfig(process.cwd());

  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const path = args.find((a) => !a.startsWith("--")) ?? DEFAULT_CSV;

  const { rows, skipped } = buildRows(readFileSync(path, "utf8"));

  const backend = storeBackendName();
  console.log(`Archivo:  ${path}`);
  console.log(`Destino:  ${backend}`);
  console.log(`Reservas legibles: ${rows.length}`);
  if (skipped.length) {
    console.log(`Filas salteadas:   ${skipped.length}`);
    skipped.slice(0, 10).forEach((s) => console.log(`   - ${s}`));
  }

  const withEmail = rows.filter((r) => r.email !== "—").length;
  const dates = rows.map((r) => r.date).sort();
  console.log(`Con correo: ${withEmail} / ${rows.length}`);
  if (dates.length) console.log(`Rango de fechas: ${dates[0]} → ${dates[dates.length - 1]}`);

  if (dryRun) {
    console.log("\n--dry-run: no se escribió nada.");
    return;
  }

  const { added, skipped: dupes } = await addReservationsBulk(rows);
  console.log(`\nImportadas: ${added}   Ya estaban (duplicadas): ${dupes}`);
}

main().catch((err) => {
  console.error("Falló la importación:", err);
  process.exit(1);
});
