// Server-side reservation endpoint. The browser POSTs the form here and THIS
// function (running on Vercel, never in the public bundle) forwards the email
// to info@ using a secret stored as a Vercel Environment Variable —
// WEB3FORMS_KEY. Nothing sensitive is committed to the (public) repo.
//
// Set it in Vercel → Project → Settings → Environment Variables:
//   WEB3FORMS_KEY = <your free key from web3forms.com, verified with info@>
// Until it's set, the route reports "not_configured" and the form falls back
// to opening the visitor's mail app, so reservations are never lost.

type Payload = {
  company?: string; // honeypot
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
  message?: string;
  labels?: Record<string, string>;
};

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot — a bot filled the hidden field. Pretend success, send nothing.
  if (data.company) return Response.json({ ok: true });

  const key = process.env.WEB3FORMS_KEY;
  if (!key) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });

  const L = data.labels ?? {};
  const dash = (v?: string) => (v && v.trim()) || "—";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: "Reserva · La Cantina de San Carlos",
        from_name: "Reservas · lacantinasancarlosibiza.com",
        replyto: data.email?.trim() || undefined,
        [L.name || "Nombre"]: dash(data.name),
        [L.email || "Correo"]: dash(data.email),
        [L.phone || "Teléfono"]: dash(data.phone),
        [L.date || "Día"]: dash(data.date),
        [L.time || "Hora"]: dash(data.time),
        [L.guests || "Personas"]: dash(data.guests),
        [L.message || "Mensaje"]: dash(data.message),
      }),
    });
    const json = await res.json().catch(() => ({ success: false }));
    return Response.json({ ok: !!json.success });
  } catch {
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
