// Reservation endpoint — runs on Vercel's server (never in the browser bundle,
// never in the public repo). It sends TWO emails through the restaurant's own
// Zoho mailbox:
//   1) Notification to info@  (reply-to = the customer, so staff reply straight
//      back to whoever booked).
//   2) Confirmation to the customer ("hemos recibido tu reserva").
//
// Secrets live in Vercel → Settings → Environment Variables (Production):
//   ZOHO_USER = info@lacantinasancarlosibiza.com
//   ZOHO_PASS = <Zoho App Password>   (NOT the normal password)
//   ZOHO_HOST = smtp.zoho.eu          (optional — default; use smtp.zoho.com if
//                                       your Zoho account is on the US data center)
// Until they're set the route reports "not_configured" and the form falls back
// to opening the visitor's mail app, so a booking is never lost.

import nodemailer from "nodemailer";

export const runtime = "nodejs";

const BRAND = "La Cantina de San Carlos";

type Payload = {
  company?: string; // honeypot
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
  message?: string;
  lang?: "es" | "en";
};

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

export async function POST(request: Request) {
  let d: Payload;
  try {
    d = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  if (d.company) return Response.json({ ok: true }); // honeypot — silently drop

  const user = process.env.ZOHO_USER;
  const pass = process.env.ZOHO_PASS;
  if (!user || !pass) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });

  const host = process.env.ZOHO_HOST || "smtp.zoho.eu";
  const es = d.lang !== "en";
  const v = (s?: string) => (s && s.trim()) || "—";
  const name = v(d.name);
  const email = (d.email || "").trim();

  const rows: [string, string][] = es
    ? [["Nombre", name], ["Correo", v(d.email)], ["Teléfono", v(d.phone)], ["Día", v(d.date)], ["Hora", v(d.time)], ["Personas", v(d.guests)], ["Mensaje", v(d.message)]]
    : [["Name", name], ["Email", v(d.email)], ["Phone", v(d.phone)], ["Date", v(d.date)], ["Time", v(d.time)], ["Guests", v(d.guests)], ["Message", v(d.message)]];

  const tableHtml = rows
    .map(([k, val]) => `<tr><td style="padding:6px 14px 6px 0;color:#8C857A;font:600 12px/1.5 Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#181613;font:14px/1.6 Arial,sans-serif">${esc(val)}</td></tr>`)
    .join("");
  const tableText = rows.map(([k, val]) => `${k}: ${val}`).join("\n");

  const transporter = nodemailer.createTransport({
    host,
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  try {
    // 1) Notification to the restaurant — reply-to the customer.
    await transporter.sendMail({
      from: `"${BRAND} · Reservas" <${user}>`,
      to: user,
      replyTo: email || undefined,
      subject: `Nueva reserva · ${name}`,
      text: `Nueva solicitud de reserva desde la web:\n\n${tableText}\n`,
      html: `<div style="max-width:560px;margin:auto"><h2 style="font:700 18px Arial,sans-serif;color:#181613;margin:0 0 14px">Nueva reserva desde la web</h2><table style="border-collapse:collapse">${tableHtml}</table></div>`,
    });

    // 2) Confirmation to the customer (best effort — only if they gave an email).
    if (email) {
      const subject = es ? `Hemos recibido tu reserva · ${BRAND}` : `We've received your booking · ${BRAND}`;
      const greeting = es ? `Hola ${name},` : `Hi ${name},`;
      const intro = es
        ? "¡Gracias por escribirnos! Hemos recibido tu solicitud de reserva y te confirmaremos en breve por este mismo correo."
        : "Thank you! We've received your booking request and will confirm shortly by email.";
      const yourReq = es ? "Tu solicitud:" : "Your request:";
      const signoff = es ? "Un saludo,\nLa Cantina de San Carlos · Ibiza" : "Warm regards,\nLa Cantina de San Carlos · Ibiza";

      await transporter.sendMail({
        from: `"${BRAND}" <${user}>`,
        to: email,
        replyTo: user,
        subject,
        text: `${greeting}\n\n${intro}\n\n${yourReq}\n${tableText}\n\n${signoff}`,
        html: `<div style="max-width:560px;margin:auto;font:14px/1.7 Arial,sans-serif;color:#181613">
          <p style="margin:0 0 4px">${esc(greeting)}</p>
          <p style="margin:0 0 18px;color:#4A453E">${esc(intro)}</p>
          <p style="margin:0 0 8px;color:#8C857A;font:600 12px/1.5 Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em">${esc(yourReq)}</p>
          <table style="border-collapse:collapse;margin-bottom:20px">${tableHtml}</table>
          <p style="margin:0;color:#4A453E;white-space:pre-line">${esc(signoff)}</p>
        </div>`,
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: "send_failed", detail: String(err).slice(0, 200) }, { status: 502 });
  }
}
