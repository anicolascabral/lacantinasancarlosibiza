// Reservation endpoint — runs on Vercel's server (never in the browser bundle,
// never in the public repo). It sends TWO branded emails through the
// restaurant's own Zoho mailbox:
//   1) Notification to info@  (reply-to = the customer, so staff reply straight
//      back to whoever booked).
//   2) Confirmation to the customer ("hemos recibido tu reserva").
//
// Secrets live in Vercel → Settings → Environment Variables (Production):
//   ZOHO_USER = info@lacantinasancarlosibiza.com
//   ZOHO_PASS = <Zoho App Password>   (NOT the normal password)
//   ZOHO_HOST = smtppro.zoho.eu       (optional — default; org/Workplace accounts
//                                       use the "pro" host. US: smtppro.zoho.com)
// Until they're set the route reports "not_configured" and the form falls back
// to opening the visitor's mail app, so a booking is never lost.

import nodemailer from "nodemailer";
import { ADDRESS, PHONE, INSTAGRAM, EMAIL, MAPS_URL } from "@/lib/site";

export const runtime = "nodejs";

const BRAND = "La Cantina de San Carlos";
const SITE = "https://www.lacantinasancarlosibiza.com";
const LOGO = `${SITE}/images/logo-mark-white.png`;

// Brand palette (mirrors the site)
const INK = "#181613";
const PAPER = "#ECE5D6";
const CARD = "#F3EEE3";
const WHITE = "#FBF9F4";
const SOFT = "#4A453E";
const MUTED = "#8C857A";
const LINE = "#e2dac9";

type Payload = {
  company?: string; // honeypot
  turnstileToken?: string; // Cloudflare Turnstile
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
  message?: string;
  lang?: "es" | "en";
};

// Verify the Cloudflare Turnstile token server-side. Only enforced when BOTH the
// secret AND the public site key are configured — if the public key is missing the
// browser widget never renders (so no token exists) and enforcing the secret would
// reject every real booking. In that case we skip, keeping the form working.
async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!secret || !siteKey) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const json = (await res.json()) as { success?: boolean };
    return !!json.success;
  } catch {
    return false;
  }
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

function detailsTable(rows: [string, string][]) {
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

const pad = (n: number) => String(n).padStart(2, "0");

// Build an iCalendar event (1h30) for a booking, anchored to Europe/Madrid so the
// restaurant's calendar shows the right local time regardless of where it's read.
// Attached (METHOD:PUBLISH) to the single branded notification email so the body
// keeps its layout; tapping the .ics adds the event (details in the title).
// Returns null when the booking has no usable date/time (nothing to schedule).
function bookingIcs(opts: {
  date?: string;
  time?: string;
  name: string;
  guests: string;
  phone: string;
  email: string;
  message: string;
  es: boolean;
}): string | null {
  const date = (opts.date || "").trim(); // YYYY-MM-DD (from <input type="date">)
  const time = (opts.time || "").trim(); // HH:MM    (from <input type="time">)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{1,2}:\d{2}/.test(time)) return null;

  const [y, mo, da] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  // Treat the wall-clock components as UTC purely for +90min arithmetic, so the
  // rollover past midnight is correct on Vercel (which runs in UTC).
  const startMs = Date.UTC(y, mo - 1, da, h, mi);
  const end = new Date(startMs + 90 * 60000);
  const local = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00`;
  const dtStart = `${date.replace(/-/g, "")}T${pad(h)}${pad(mi)}00`;
  const dtEnd = local(end);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const uid = `${dtStart}-${(opts.email || opts.phone || "anon").replace(/[^a-z0-9]/gi, "")}-${Math.random().toString(36).slice(2, 8)}@lacantinasancarlosibiza.com`;

  const fold = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const has = (s: string) => s && s.trim() && s.trim() !== "—";

  // Title carries the key details at a glance: name · guests · phone.
  const titleParts = [opts.name];
  if (has(opts.guests)) titleParts.push(`${opts.guests}${opts.es ? " pers." : " guests"}`);
  if (has(opts.phone)) titleParts.push(opts.phone);
  const summary = `${opts.es ? "Reserva" : "Booking"} · ${titleParts.join(" · ")}`;

  const descLines = opts.es
    ? [`Nombre: ${opts.name}`, `Personas: ${opts.guests}`, `Teléfono: ${opts.phone}`, `Correo: ${opts.email}`, `Mensaje: ${opts.message}`]
    : [`Name: ${opts.name}`, `Guests: ${opts.guests}`, `Phone: ${opts.phone}`, `Email: ${opts.email}`, `Message: ${opts.message}`];

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//La Cantina de San Carlos//Reservas//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Europe/Madrid",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:+0100",
    "TZOFFSETTO:+0200",
    "TZNAME:CEST",
    "DTSTART:19700329T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0100",
    "TZNAME:CET",
    "DTSTART:19701025T030000",
    "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Madrid:${dtStart}`,
    `DTEND;TZID=Europe/Madrid:${dtEnd}`,
    `SUMMARY:${fold(summary)}`,
    `DESCRIPTION:${fold(descLines.join("\n"))}`,
    `LOCATION:${fold(ADDRESS)}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function shell(opts: { heading: string; lead: string; rowsHtml: string; aside: string; es: boolean }) {
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

export async function POST(request: Request) {
  let d: Payload;
  try {
    d = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  if (d.company) return Response.json({ ok: true }); // honeypot — silently drop

  // Bot gate — reject submissions that fail the CAPTCHA (when configured).
  if (!(await verifyTurnstile(d.turnstileToken))) {
    return Response.json({ ok: false, error: "captcha" }, { status: 400 });
  }

  const user = process.env.ZOHO_USER;
  const pass = process.env.ZOHO_PASS;
  if (!user || !pass) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });

  const host = process.env.ZOHO_HOST || "smtppro.zoho.eu";
  const es = d.lang !== "en";
  const v = (s?: string) => (s && s.trim()) || "—";
  const name = v(d.name);
  const email = (d.email || "").trim();

  const rows: [string, string][] = es
    ? [["Nombre", name], ["Correo", v(d.email)], ["Teléfono", v(d.phone)], ["Día", v(d.date)], ["Hora", v(d.time)], ["Personas", v(d.guests)], ["Mensaje", v(d.message)]]
    : [["Name", name], ["Email", v(d.email)], ["Phone", v(d.phone)], ["Date", v(d.date)], ["Time", v(d.time)], ["Guests", v(d.guests)], ["Message", v(d.message)]];
  const rowsHtml = detailsTable(rows);
  const tableText = rows.map(([k, val]) => `${k}: ${val}`).join("\n");

  const transporter = nodemailer.createTransport({ host, port: 465, secure: true, auth: { user, pass } });

  try {
    // 1) Notification to the restaurant — reply-to the customer.
    const notifLead = es
      ? `Acabas de recibir una solicitud de reserva desde la web. Responde a este correo para contestar directamente a <strong style="color:${INK}">${esc(name)}</strong>.`
      : `A new booking request just came in from the website. Reply to this email to answer <strong style="color:${INK}">${esc(name)}</strong> directly.`;
    // Calendar event (1h30) for the restaurant — only when we have a date & time.
    // Attached as a .ics file so the branded email keeps its layout; tap it to
    // add the booking (with all details in the title) to the calendar.
    const ics = bookingIcs({
      date: d.date,
      time: d.time,
      name,
      guests: v(d.guests),
      phone: v(d.phone),
      email: v(d.email),
      message: v(d.message),
      es,
    });
    await transporter.sendMail({
      from: `"${BRAND} · Reservas" <${user}>`,
      to: user,
      // Reply / Reply-All from info@ goes straight to whoever booked.
      replyTo: email ? { name, address: email } : undefined,
      subject: es ? `Nueva reserva · ${name}` : `New booking · ${name}`,
      text: `${es ? "Nueva solicitud de reserva desde la web" : "New booking request from the website"}:\n\n${tableText}\n`,
      html: shell({
        es,
        heading: es ? "Nueva reserva" : "New booking",
        lead: notifLead,
        rowsHtml,
        aside: es ? "Datos recibidos a través de lacantinasancarlosibiza.com" : "Received via lacantinasancarlosibiza.com",
      }),
      ...(ics
        ? { attachments: [{ filename: "reserva.ics", content: ics, contentType: "text/calendar; charset=utf-8; method=PUBLISH" }] }
        : {}),
    });

    // 2) Confirmation to the customer (best effort — only if they gave an email).
    if (email) {
      const lead = es
        ? "¡Gracias por pensar en nosotros! Hemos recibido tu solicitud de reserva y te confirmaremos en muy poco por este mismo correo."
        : "Thank you for thinking of us! We've received your booking request and will confirm shortly by email.";
      const aside = es
        ? "¿Necesitas cambiar algo? Solo responde a este correo y te echamos una mano. Nos vemos junto al fuego. 🔥"
        : "Need to change anything? Just reply to this email and we'll help. See you by the fire. 🔥";
      const directionsLabel = es ? "Cómo llegar" : "Get directions";
      // Quick directions link so the customer has it handy.
      const asideHtml = `📍 <a href="${MAPS_URL}" style="color:${INK};font-weight:bold;text-decoration:underline">${directionsLabel}</a> · ${aside}`;
      await transporter.sendMail({
        from: `"${BRAND}" <${user}>`,
        to: email,
        replyTo: user,
        subject: es ? `Hemos recibido tu reserva · ${BRAND}` : `We've received your booking · ${BRAND}`,
        text: `${es ? `Hola ${name},` : `Hi ${name},`}\n\n${lead}\n\n${es ? "Tu solicitud" : "Your request"}:\n${tableText}\n\n📍 ${directionsLabel}: ${MAPS_URL}\n\n${aside}\n\n${BRAND} · Ibiza`,
        html: shell({
          es,
          heading: es ? `Hola ${name},` : `Hi ${name},`,
          lead,
          rowsHtml,
          aside: asideHtml,
        }),
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: "send_failed", detail: String(err).slice(0, 200) }, { status: 502 });
  }
}
