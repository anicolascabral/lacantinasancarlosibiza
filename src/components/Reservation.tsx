"use client";

import { useState, useRef, useEffect } from "react";
import Reveal from "./Reveal";
import { CasitaIcon } from "./Icons";
import { EMAIL } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

type Status = "idle" | "sending" | "ok" | "error";

// Cloudflare Turnstile (invisible CAPTCHA). Public site key, set in Vercel as a
// NEXT_PUBLIC var. When empty, the widget isn't rendered and the server skips
// verification — so the form keeps working until the keys are added.
const TURNSTILE_SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export default function Reservation() {
  const { t, lang } = useI18n();
  const r = t.reservation;
  const f = r.form;
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");
  const es = lang === "es";
  const mountedAt = useRef(Date.now());

  // Dinner-only service, every day except Wednesday. Offer 15-min slots from
  // 19:30 to the last seating at 23:00 (kitchen closes 23:30).
  const TIME_SLOTS: string[] = [];
  for (let m = 19 * 60 + 30; m <= 23 * 60; m += 15) {
    TIME_SLOTS.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }

  // Load the Turnstile script once (only if a site key is configured).
  useEffect(() => {
    if (!TURNSTILE_SITEKEY || document.querySelector("script[data-cf-turnstile]")) return;
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.setAttribute("data-cf-turnstile", "1");
    document.head.appendChild(s);
  }, []);

  const ph = es
    ? { name: "Tu nombre", email: "tu@correo.com", phone: "+34 600 000 000", message: "Alergias, celebración especial…" }
    : { name: "Your name", email: "you@email.com", phone: "+34 600 000 000", message: "Allergies, special occasion…" };

  const msg = {
    sending: es ? "Enviando tu reserva…" : "Sending your request…",
    ok: es
      ? "¡Gracias! Hemos recibido tu solicitud. Te confirmamos en breve."
      : "Thank you! We've received your request and will confirm shortly.",
    error: es
      ? `No se pudo enviar. Escríbenos a ${EMAIL} o inténtalo de nuevo.`
      : `Couldn't send. Please email ${EMAIL} or try again.`,
    closedWed: es
      ? "Los miércoles cerramos. Elige otro día, por favor."
      : "We're closed on Wednesdays. Please pick another day.",
    pastDay: es
      ? "Esa fecha ya pasó. Elige un día a partir de hoy."
      : "That date has passed. Please pick today or later.",
  };

  function mailtoFallback(get: (k: string) => string) {
    const subject = `Reserva · La Cantina de San Carlos`;
    const body =
      `${f.name}: ${get("name")}\n${f.email}: ${get("email")}\n${f.phone}: ${get("phone")}\n` +
      `${f.date}: ${get("date")}\n${f.time}: ${get("time")}\n${f.guests}: ${get("guests")}\n\n` +
      `${f.message}:\n${get("message")}\n`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // Returns an error message for an invalid booking date (past / Wednesday), or "".
  function dateError(dateStr: string): string {
    if (!dateStr) return "";
    const [yy, mm, dd] = dateStr.split("-").map(Number);
    const picked = new Date(yy, mm - 1, dd);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (picked < today) return msg.pastDay;
    if (picked.getDay() === 3) return msg.closedWed; // Wednesday — closed
    return "";
  }

  // Reject an invalid day the moment it's picked (the native picker can't hide
  // Wednesdays), clearing the field so it can't be submitted.
  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const err = dateError(e.target.value);
    if (err) {
      e.target.value = "";
      setErrMsg(err);
      setStatus("error");
    } else {
      setErrMsg("");
      setStatus((s) => (s === "error" ? "idle" : s));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("company")) return; // honeypot — bot filled the hidden field
    if (Date.now() - mountedAt.current < 2500) return; // filled impossibly fast → bot
    const get = (k: string) => (data.get(k) as string)?.trim() || "—";
    const raw = (k: string) => (data.get(k) as string)?.trim() || "";

    // Date guard (no past days, closed on Wednesdays) — safety net for submit.
    const dErr = dateError(raw("date"));
    if (dErr) {
      setErrMsg(dErr);
      setStatus("error");
      return;
    }

    setErrMsg("");
    setStatus("sending");
    try {
      const res = await fetch("/api/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: (data.get("company") as string) || "",
          turnstileToken: (data.get("cf-turnstile-response") as string) || "",
          name: raw("name"),
          email: raw("email"),
          phone: raw("phone"),
          date: raw("date"),
          time: raw("time"),
          guests: raw("guests"),
          message: raw("message"),
          lang,
        }),
      });
      const json = await res.json().catch(() => ({ ok: false }));
      if (json.ok) {
        setStatus("ok");
        form.reset();
        return;
      }
      // Not configured yet / upstream failed → open the mail app so the booking
      // is never lost.
      mailtoFallback(get);
      setStatus("ok");
    } catch {
      mailtoFallback(get);
      setStatus("ok");
    }
  }

  return (
    <section id="reservas" className="py-24 md:py-36 px-6 paper-texture">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="flex items-center gap-3 mb-6" style={{ color: "var(--muted)" }}>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
              <span className="eyebrow">{r.eyebrow}</span>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
            </div>
          </Reveal>
          <Reveal delay={60}><CasitaIcon size={38} className="mb-4" /></Reveal>
          <Reveal delay={100}>
            <span className="font-script" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--ink)" }}>{r.script}</span>
          </Reveal>
          <Reveal delay={140}>
            <h2 className="headline mt-3" style={{ fontSize: "clamp(2.2rem,7vw,5.5rem)", color: "var(--ink)" }}>{r.title}</h2>
          </Reveal>
        </div>
        <Reveal delay={140}>
          <p className="mt-6 text-center font-body text-sm md:text-base mx-auto" style={{ color: "var(--ink-soft)", maxWidth: "46ch", lineHeight: 1.8 }}>
            {r.intro}
          </p>
        </Reveal>

        {/* Premium reservation form — sends an email to info@ */}
        <Reveal delay={180}>
          <form className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5" onSubmit={handleSubmit} noValidate>
            {/* Honeypot — hidden from humans, traps bots */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            <div className="field-group sm:col-span-2">
              <label className="field-label">{f.name}</label>
              <input name="name" type="text" required autoComplete="name" autoCapitalize="words" placeholder={ph.name} className="field" />
            </div>
            <div className="field-group">
              <label className="field-label">{f.email}</label>
              <input name="email" type="email" required inputMode="email" autoComplete="email" autoCapitalize="off" spellCheck={false} placeholder={ph.email} className="field" />
            </div>
            <div className="field-group">
              <label className="field-label">{f.phone}</label>
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={ph.phone} className="field" />
            </div>
            <div className="field-group sm:col-span-2">
              <label className="field-label">{f.date}</label>
              <input name="date" type="date" className="field" onChange={handleDateChange} />
            </div>
            <div className="field-group">
              <label className="field-label">{f.time}</label>
              <select name="time" defaultValue="" className="field">
                <option value="" disabled>{es ? "Elige hora" : "Pick a time"}</option>
                {TIME_SLOTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">{f.guests}</label>
              <select name="guests" defaultValue="2" className="field">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? f.unit1 : f.unitN}</option>
                ))}
                <option value={f.more}>{f.more}</option>
              </select>
            </div>
            <div className="field-group sm:col-span-2">
              <label className="field-label">{f.message}</label>
              <textarea name="message" rows={3} placeholder={ph.message} className="field resize-none" />
            </div>

            {TURNSTILE_SITEKEY && (
              <div className="sm:col-span-2 flex justify-center">
                <div className="cf-turnstile" data-sitekey={TURNSTILE_SITEKEY} data-theme="light" data-size="flexible" />
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending" || status === "ok"}
              className="group sm:col-span-2 mt-1 inline-flex items-center justify-center gap-3 py-4 text-xs tracking-widest uppercase font-body font-bold transition-all hover:gap-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:gap-3"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)", letterSpacing: "0.2em" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              {status === "sending" ? msg.sending : status === "ok" ? msg.ok : f.send}
              {status === "idle" && <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>}
            </button>

            <p className="sm:col-span-2 mt-1 text-center transition-colors" aria-live="polite" style={{ color: status === "ok" ? "var(--ink)" : status === "error" ? "#a23" : "var(--muted)" }}>
              {status === "ok" ? (
                <span className="font-body text-sm">{msg.ok}</span>
              ) : status === "error" ? (
                <span className="font-body text-sm">{errMsg || msg.error}</span>
              ) : (
                <span className="eyebrow" style={{ fontSize: "0.58rem" }}>{r.quick}</span>
              )}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
