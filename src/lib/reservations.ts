// Reservation storage for the internal dashboard.
//
// Two backends behind the same three functions below:
//   - Upstash Redis, used automatically when its credentials are present —
//     connect it via Vercel → Storage → Marketplace → Upstash, which injects
//     the env vars for you (see src/lib/redis.ts for the names accepted).
//   - A local JSON file (.data/reservations.json), used otherwise — handy for
//     `npm run dev` / `next start` on a machine, but does NOT work on Vercel
//     (serverless functions don't share a persistent filesystem), so
//     production must have the Redis env vars set.
//
// Booking volume for a single restaurant is tiny, so the whole list is kept
// as one JSON blob (one Redis key / one file) and read-modify-written on
// every change — simple, and plenty fast at this scale.

import { promises as fs } from "fs";
import path from "path";
import { redisClient } from "@/lib/redis";

export type ReservationStatus = "pending" | "accepted" | "rejected";

export type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: string;
  message: string;
  lang: "es" | "en";
  status: ReservationStatus;
  createdAt: string; // ISO timestamp
  // Set once the "your booking is confirmed" mail actually went out, so
  // accepting again (or after an undo) never re-mails the customer.
  confirmationSentAt?: string; // ISO timestamp
  // Calendar UID for bookings backfilled from the Zoho Calendar export, so
  // re-running the importer never creates duplicates.
  sourceUid?: string;
};

const REDIS_KEY = "reservations:v1";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "reservations.json");

async function readAllFile(): Promise<Reservation[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as Reservation[];
  } catch {
    return [];
  }
}

async function writeAllFile(list: Reservation[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
}

async function readAll(): Promise<Reservation[]> {
  const redis = redisClient();
  if (!redis) return readAllFile();
  const list = await redis.get<Reservation[]>(REDIS_KEY);
  return list ?? [];
}

async function writeAll(list: Reservation[]): Promise<void> {
  const redis = redisClient();
  if (!redis) return writeAllFile(list);
  await redis.set(REDIS_KEY, list);
}

export async function addReservation(
  data: Omit<Reservation, "id" | "status" | "createdAt"> & { status?: ReservationStatus },
): Promise<Reservation> {
  const list = await readAll();
  const { status, ...rest } = data;
  const reservation: Reservation = {
    ...rest,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: status ?? "pending",
    createdAt: new Date().toISOString(),
  };
  list.push(reservation);
  await writeAll(list);
  return reservation;
}

/**
 * Backfill many bookings at once (the Zoho Calendar CSV import). Reads and
 * writes the store once instead of per row — 297 rows would otherwise be ~600
 * Redis commands. Rows whose `sourceUid` is already stored are skipped, so the
 * importer is safe to re-run (e.g. once locally, then again against Upstash).
 */
export async function addReservationsBulk(
  items: (Omit<Reservation, "id" | "createdAt"> & { createdAt?: string })[],
): Promise<{ added: number; skipped: number }> {
  const list = await readAll();
  const seen = new Set(list.map((r) => r.sourceUid).filter(Boolean));
  let added = 0;
  let skipped = 0;

  items.forEach((item, i) => {
    if (item.sourceUid && seen.has(item.sourceUid)) {
      skipped++;
      return;
    }
    if (item.sourceUid) seen.add(item.sourceUid);
    list.push({
      ...item,
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: item.createdAt ?? new Date().toISOString(),
    });
    added++;
  });

  if (added > 0) await writeAll(list);
  return { added, skipped };
}

export async function listReservations(): Promise<Reservation[]> {
  const list = await readAll();
  // Newest first.
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<Reservation | null> {
  const list = await readAll();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], status };
  await writeAll(list);
  return list[idx];
}

export async function markConfirmationSent(id: string): Promise<Reservation | null> {
  const list = await readAll();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], confirmationSentAt: new Date().toISOString() };
  await writeAll(list);
  return list[idx];
}
