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

import { ADDRESS, MAPS_URL } from "@/lib/site";
import { addReservation } from "@/lib/reservations";
import {
  BRAND,
  INK,
  bookingRows,
  createTransporter,
  detailsTable,
  esc,
  formatBookingDate,
  normalizePhone,
  sendWithRetry,
  shell,
} from "@/lib/email";

export const runtime = "nodejs";

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

// Verify the Cloudflare Turnstile token server-side — OPPORTUNISTICALLY. We only
// reject when a token is present AND fails verification. If no token arrives (the
// widget didn't render — e.g. the public site key wasn't baked into the build, or
// it was blocked on the visitor's device) we do NOT block: a misconfigured captcha
// must never reject real bookings. The honeypot + time-trap remain as anti-spam.
async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // feature off
  const t = (token || "").trim();
  if (!t) return true; // no token → can't enforce; let honeypot/time-trap guard
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: t }),
    });
    const json = (await res.json()) as { success?: boolean };
    return !!json.success;
  } catch {
    return true; // Cloudflare unreachable → don't block the booking
  }
}

const pad = (n: number) => String(n).padStart(2, "0");

// Build an iCalendar INVITE (1h30) for a booking, anchored to Europe/Madrid so the
// restaurant's calendar shows the right local time regardless of where it's read.
// Sent as METHOD:REQUEST (customer = organizer, restaurant `attendee` = invitee) so
// the mail client renders it as a real event card with the booking details and an
// "Accept" that drops it into the calendar — not just a file attachment.
// Returns null when the booking has no usable date/time (nothing to schedule).
function bookingIcs(opts: {
  date?: string;
  time?: string;
  name: string;
  guests: string;
  phone: string;
  email: string;
  message: string;
  attendee: string; // restaurant mailbox (info@) that receives the invite
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

  // The customer "organizes" the request; the restaurant mailbox is the invitee.
  const organizerMail = has(opts.email) && opts.email.includes("@") ? opts.email.trim() : opts.attendee;
  const organizerCN = (organizerMail === opts.attendee ? BRAND : opts.name).replace(/"/g, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//La Cantina de San Carlos//Reservas//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
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
    `ORGANIZER;CN="${organizerCN}":mailto:${organizerMail}`,
    `ATTENDEE;CN="${BRAND}";ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${opts.attendee}`,
    `SUMMARY:${fold(summary)}`,
    `DESCRIPTION:${fold(descLines.join("\n"))}`,
    `LOCATION:${fold(ADDRESS)}`,
    "SEQUENCE:0",
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
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

  const es = d.lang !== "en";
  const v = (s?: string) => (s && s.trim()) || "—";
  const name = v(d.name);
  const email = (d.email || "").trim();
  const phone = normalizePhone(v(d.phone));

  // Save to the dashboard's own store first — so a booking is never lost to
  // a spam folder or a broken SMTP send. Best-effort: never blocks or fails
  // the booking response.
  try {
    await addReservation({
      name,
      email: v(d.email),
      phone,
      date: v(d.date),
      time: v(d.time),
      guests: v(d.guests),
      message: v(d.message),
      lang: es ? "es" : "en",
    });
  } catch (err) {
    console.error("Failed to persist reservation:", err);
  }

  const smtp = createTransporter();
  if (!smtp) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  const { transporter, user } = smtp;

  const booking = {
    name,
    email: v(d.email),
    phone,
    date: v(d.date),
    time: v(d.time),
    guests: v(d.guests),
    message: v(d.message),
  };

  // Internal notification keeps the raw ISO date so the mail stays
  // machine-parseable (the dashboard's backfill importer reads these).
  const rows = bookingRows(booking, es);
  const rowsHtml = detailsTable(rows);
  const tableText = rows.map(([k, val]) => `${k}: ${val}`).join("\n");

  // The guest gets the date spelled out instead.
  const customerRows = bookingRows({ ...booking, date: formatBookingDate(booking.date, es) }, es);
  const customerRowsHtml = detailsTable(customerRows);
  const customerTableText = customerRows.map(([k, val]) => `${k}: ${val}`).join("\n");

  try {
    // 1) Notification to the restaurant — reply-to the customer.
    const notifLead = es
      ? `Acabas de recibir una solicitud de reserva desde la web. Responde a este correo para contestar directamente a <strong style="color:${INK}">${esc(name)}</strong>.`
      : `A new booking request just came in from the website. Reply to this email to answer <strong style="color:${INK}">${esc(name)}</strong> directly.`;
    // Calendar invite (1h30) for the restaurant — only when we have a date & time.
    // Sent as a REQUEST so it arrives as a real event card with the booking data
    // and an "Accept" that lands it in the calendar (not a file attachment).
    const ics = bookingIcs({
      date: d.date,
      time: d.time,
      name,
      guests: v(d.guests),
      phone,
      email: v(d.email),
      message: v(d.message),
      attendee: user,
      es,
    });
    // This one is critical — retry it. If it ultimately fails we report
    // send_failed so the form can fall back.
    await sendWithRetry(transporter, {
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
        ? { icalEvent: { method: "REQUEST", filename: "reserva.ics", content: ics } }
        : {}),
    });

    // 2) Confirmation to the customer — BEST EFFORT. Its failure must never fail
    // the booking (the restaurant already got it above), so it's caught here.
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
      try {
        await sendWithRetry(transporter, {
          from: `"${BRAND}" <${user}>`,
          to: email,
          replyTo: user,
          subject: es ? `Hemos recibido tu reserva · ${BRAND}` : `We've received your booking · ${BRAND}`,
          text: `${es ? `Hola ${name},` : `Hi ${name},`}\n\n${lead}\n\n${es ? "Tu solicitud" : "Your request"}:\n${customerTableText}\n\n📍 ${directionsLabel}: ${MAPS_URL}\n\n${aside}\n\n${BRAND} · Ibiza`,
          html: shell({
            es,
            heading: es ? `Hola ${name},` : `Hi ${name},`,
            lead,
            rowsHtml: customerRowsHtml,
            aside: asideHtml,
          }),
        }, 2);
      } catch {
        // ignore — the restaurant already received the booking
      }
    }

    transporter.close();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: "send_failed", detail: String(err).slice(0, 200) }, { status: 502 });
  }
}
