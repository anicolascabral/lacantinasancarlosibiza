// Shared email plumbing for the restaurant's Zoho mailbox: the branded HTML
// shell, the details table, phone normalisation, and the SMTP transport with
// retries. Used by /api/reserva (booking received) and by the dashboard when
// staff accept a booking (booking confirmed) — so both mails look identical
// and there's a single place to change the branding.
//
// Secrets live in Vercel → Settings → Environment Variables (Production):
//   ZOHO_USER = info@lacantinasancarlosibiza.com
//   ZOHO_PASS = <Zoho App Password>   (NOT the normal password)
//   ZOHO_HOST = smtppro.zoho.eu       (optional — default; org/Workplace
//                                       accounts use the "pro" host)

import nodemailer from "nodemailer";
import { ADDRESS, PHONE, INSTAGRAM, EMAIL, MAPS_URL } from "@/lib/site";

export const BRAND = "La Cantina de San Carlos";
const SITE = "https://www.lacantinasancarlosibiza.com";
const LOGO = `${SITE}/images/logo-mark-white.png`;

// Brand palette (mirrors the site)
export const INK = "#181613";
const PAPER = "#ECE5D6";
const CARD = "#F3EEE3";
const WHITE = "#FBF9F4";
const SOFT = "#4A453E";
const MUTED = "#8C857A";
const LINE = "#e2dac9";

export const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

// Keep an international dialling prefix on the phone. iOS autofill often drops the
// country code (it knows the device region) so a bare national number arrives
// without it — default those to Spain (+34), where the restaurant is. Numbers that
// already carry a prefix (+… or 00…) are left exactly as the customer entered them.
export function normalizePhone(p: string): string {
  const t = p.trim();
  if (!t || t === "—") return t;
  if (t.startsWith("+")) return t;
  if (t.startsWith("00")) return `+${t.slice(2).trim()}`;
  return /\d/.test(t) ? `+34 ${t}` : t;
}

// Returns null when SMTP isn't configured, so callers can degrade gracefully
// instead of throwing.
export function createTransporter(): { transporter: nodemailer.Transporter; user: string } | null {
  const user = process.env.ZOHO_USER;
  const pass = process.env.ZOHO_PASS;
  if (!user || !pass) return null;
  const host = process.env.ZOHO_HOST || "smtppro.zoho.eu";
  // 465 (implicit SSL) by default; ZOHO_PORT=587 switches to STARTTLS, in case
  // a network ever blocks 465.
  const port = Number(process.env.ZOHO_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    pool: true, // reuse one connection for both emails (faster, fewer handshakes)
    maxConnections: 1,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
  return { transporter, user };
}

// Send with a few retries — Zoho SMTP over Vercel serverless occasionally times
// out (cold starts), and a single failure shouldn't drop a booking.
export async function sendWithRetry(
  transporter: nodemailer.Transporter,
  message: Parameters<nodemailer.Transporter["sendMail"]>[0],
  tries = 3,
): Promise<void> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      await transporter.sendMail(message);
      return;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw lastErr;
}

export function detailsTable(rows: [string, string][]) {
  const body = rows
    .map(
      ([k, val], i) =>
        `<tr>` +
        `<td style="padding:11px 16px;border-top:${i === 0 ? "0" : `1px solid ${LINE}`};color:${MUTED};font:700 11px/1.4 Arial,sans-serif;text-transform:uppercase;letter-spacing:.1em;white-space:nowrap;vertical-align:top">${esc(k)}</td>` +
        `<td style="padding:11px 16px 11px 0;border-top:${i === 0 ? "0" : `1px solid ${LINE}`};color:${INK};font:600 15px/1.55 Arial,Helvetica,sans-serif">${esc(val)}</td>` +
        `</tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:6px;border-collapse:separate">${body}</table>`;
}

export function shell(opts: { heading: string; lead: string; rowsHtml: string; aside: string; es: boolean }) {
  const tagline = opts.es ? "Cocina mediterránea al fuego · Ibiza" : "Mediterranean fire cooking · Ibiza";
  const hours = opts.es ? "Cada día excepto miércoles · 19:30 – 23:30" : "Every day except Wednesday · 19:30 – 23:30";
  const ig = INSTAGRAM.replace("https://instagram.com/", "@");
  return `<!doctype html><html><body style="margin:0;padding:0;background:${PAPER}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER}">
    <tr><td align="center" style="padding:28px 14px">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
        <!-- Header -->
        <tr><td style="background:${INK};padding:30px 32px 22px;text-align:center;border-radius:6px 6px 0 0">
          <img src="${LOGO}" alt="${BRAND}" width="138" style="display:inline-block;width:138px;height:auto;border:0">
          <div style="margin-top:12px;color:#E9E1D1;font:700 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase">${esc(tagline)}</div>
        </td></tr>
        <!-- Body -->
        <tr><td style="background:${WHITE};padding:34px 32px;border-left:1px solid ${LINE};border-right:1px solid ${LINE}">
          <h1 style="margin:0 0 14px;color:${INK};font:700 22px/1.3 Arial,Helvetica,sans-serif">${esc(opts.heading)}</h1>
          <p style="margin:0 0 24px;color:${SOFT};font:15px/1.7 Arial,sans-serif">${opts.lead}</p>
          ${opts.rowsHtml}
          <p style="margin:22px 0 0;color:${SOFT};font:14px/1.7 Arial,sans-serif">${opts.aside}</p>
        </td></tr>
        <!-- Footer (light, high-contrast) -->
        <tr><td style="background:${CARD};padding:22px 32px;border:1px solid ${LINE};border-top:1px solid ${LINE};border-radius:0 0 6px 6px">
          <p style="margin:0 0 6px;color:${INK};font:700 12px/1.5 Arial,sans-serif;letter-spacing:.04em">${esc(BRAND)}</p>
          <p style="margin:0;color:${SOFT};font:12px/1.85 Arial,sans-serif">
            <a href="${MAPS_URL}" style="color:${INK};text-decoration:none;font-weight:bold">${esc(ADDRESS)}</a><br>
            ${esc(hours)}<br>
            <a href="tel:${PHONE.replace(/\s/g, "")}" style="color:${INK};text-decoration:none;font-weight:bold">${esc(PHONE)}</a>
            &nbsp;·&nbsp;
            <a href="${INSTAGRAM}" style="color:${INK};text-decoration:none;font-weight:bold">${esc(ig)}</a>
            &nbsp;·&nbsp;
            <a href="mailto:${EMAIL}" style="color:${INK};text-decoration:none;font-weight:bold">${esc(EMAIL)}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

/**
 * "2026-09-05" → "sábado, 5 de septiembre de 2026" for customer-facing mail.
 * Anything that isn't a plain ISO date (e.g. "—") passes through untouched.
 *
 * Only for mails the guest reads: the notification to info@ keeps the raw ISO
 * date so it stays machine-parseable (the dashboard's backfill importer reads
 * those mails).
 */
export function formatBookingDate(dateStr: string, es: boolean): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(es ? "es-ES" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Rows describing a booking, in the customer's language.
export function bookingRows(
  d: { name: string; email: string; phone: string; date: string; time: string; guests: string; message: string },
  es: boolean,
): [string, string][] {
  return es
    ? [
        ["Nombre", d.name],
        ["Correo", d.email],
        ["Teléfono", d.phone],
        ["Día", d.date],
        ["Hora", d.time],
        ["Personas", d.guests],
        ["Mensaje", d.message],
      ]
    : [
        ["Name", d.name],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Date", d.date],
        ["Time", d.time],
        ["Guests", d.guests],
        ["Message", d.message],
      ];
}

export type ConfirmationTarget = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string;
  lang: "es" | "en";
};

/**
 * "Your booking is confirmed" — sent to the customer when staff hit Aceptar in
 * the dashboard. Wording matches the Zoho template the restaurant approved
 * (email-confirmacion-reserva.html), wrapped in the same branded shell as the
 * other mails.
 *
 * Throws on failure so the caller can tell staff the mail didn't go out (the
 * booking's status change must still stick either way).
 */
export async function sendConfirmationEmail(r: ConfirmationTarget): Promise<void> {
  const smtp = createTransporter();
  if (!smtp) throw new Error("not_configured");
  const { transporter, user } = smtp;

  const es = r.lang !== "en";
  const rows = bookingRows({ ...r, date: formatBookingDate(r.date, es) }, es);
  const rowsHtml = detailsTable(rows);
  const tableText = rows.map(([k, val]) => `${k}: ${val}`).join("\n");

  const lead = es
    ? `Gracias por tu interés en <strong style="color:${INK}">${esc(BRAND)} Ibiza</strong>.<br>Tu reserva está <strong style="color:${INK}">confirmada</strong>.<br><span style="color:${INK};font-weight:bold">¡Mil gracias!</span>&nbsp;🔥`
    : `Thank you for choosing <strong style="color:${INK}">${esc(BRAND)} Ibiza</strong>.<br>Your booking is <strong style="color:${INK}">confirmed</strong>.<br><span style="color:${INK};font-weight:bold">Thank you!</span>&nbsp;🔥`;
  const directionsLabel = es ? "Cómo llegar" : "Get directions";
  const asideText = es
    ? "¿Necesitas cambiar algo? Solo responde a este correo y te echamos una mano. Nos vemos junto al fuego."
    : "Need to change anything? Just reply to this email and we'll help. See you by the fire.";
  const asideHtml = `📍 <a href="${MAPS_URL}" style="color:${INK};font-weight:bold;text-decoration:underline">${directionsLabel}</a> · ${asideText}`;

  try {
    await sendWithRetry(
      transporter,
      {
        from: `"${BRAND}" <${user}>`,
        to: r.email,
        replyTo: user,
        subject: es ? `Reserva confirmada · ${BRAND}` : `Booking confirmed · ${BRAND}`,
        text:
          `${es ? `Hola ${r.name},` : `Hi ${r.name},`}\n\n` +
          `${es ? `Gracias por tu interés en ${BRAND} Ibiza. Tu reserva está confirmada. ¡Mil gracias! 🔥` : `Thank you for choosing ${BRAND} Ibiza. Your booking is confirmed. Thank you! 🔥`}\n\n` +
          `${es ? "Tu reserva" : "Your booking"}:\n${tableText}\n\n` +
          `📍 ${directionsLabel}: ${MAPS_URL}\n\n${asideText}\n\n${BRAND} · Ibiza`,
        html: shell({
          es,
          heading: es ? `Hola ${r.name},` : `Hi ${r.name},`,
          lead,
          rowsHtml,
          aside: asideHtml,
        }),
      },
      2,
    );
  } finally {
    transporter.close();
  }
}
