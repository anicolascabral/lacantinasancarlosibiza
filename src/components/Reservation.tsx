"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { CasitaIcon, InstagramIcon } from "./Icons";
import { INSTAGRAM, PHONE, PHONE_TEL, EMAIL } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export default function Reservation() {
  const { t, lang } = useI18n();
  const r = t.reservation;
  const f = r.form;
  const [sent, setSent] = useState(false);

  const ph =
    lang === "es"
      ? { name: "Tu nombre", email: "tu@correo.com", phone: "+34 600 000 000", message: "Alergias, celebración especial…" }
      : { name: "Your name", email: "you@email.com", phone: "+34 600 000 000", message: "Allergies, special occasion…" };
  const successMsg = lang === "es" ? "¡Gracias! Hemos abierto tu correo para enviar la reserva." : "Thank you! We've opened your email to send the request.";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("company")) return; // honeypot — bot filled the hidden field
    const get = (k: string) => (data.get(k) as string)?.trim() || "—";
    const subject = `Reserva · La Cantina de San Carlos`;
    const body =
      `${f.name}: ${get("name")}\n` +
      `${f.email}: ${get("email")}\n` +
      `${f.phone}: ${get("phone")}\n` +
      `${f.date}: ${get("date")}\n` +
      `${f.time}: ${get("time")}\n` +
      `${f.guests}: ${get("guests")}\n\n` +
      `${f.message}:\n${get("message")}\n`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
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
          <form className="mt-12 grid grid-cols-2 gap-5" onSubmit={handleSubmit} noValidate>
            {/* Honeypot — hidden from humans, traps bots */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            <div className="field-group col-span-2">
              <label className="field-label">{f.name}</label>
              <input name="name" type="text" required placeholder={ph.name} className="field" />
            </div>
            <div className="field-group col-span-2 sm:col-span-1">
              <label className="field-label">{f.email}</label>
              <input name="email" type="email" required placeholder={ph.email} className="field" />
            </div>
            <div className="field-group col-span-2 sm:col-span-1">
              <label className="field-label">{f.phone}</label>
              <input name="phone" type="tel" placeholder={ph.phone} className="field" />
            </div>
            <div className="field-group col-span-2 sm:col-span-1">
              <label className="field-label">{f.date}</label>
              <input name="date" type="date" className="field" />
            </div>
            <div className="field-group col-span-1">
              <label className="field-label">{f.time}</label>
              <input name="time" type="time" className="field" />
            </div>
            <div className="field-group col-span-1">
              <label className="field-label">{f.guests}</label>
              <select name="guests" defaultValue="2" className="field">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? f.unit1 : f.unitN}</option>
                ))}
                <option value={f.more}>{f.more}</option>
              </select>
            </div>
            <div className="field-group col-span-2">
              <label className="field-label">{f.message}</label>
              <textarea name="message" rows={3} placeholder={ph.message} className="field resize-none" />
            </div>

            <button
              type="submit"
              className="group col-span-2 mt-1 inline-flex items-center justify-center gap-3 py-4 text-xs tracking-widest uppercase font-body font-bold transition-all hover:gap-4"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)", letterSpacing: "0.2em" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              {f.send}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
            </button>

            <p className="col-span-2 mt-1 text-center transition-colors" style={{ color: sent ? "var(--ink)" : "var(--muted)" }}>
              {sent ? (
                <span className="font-body text-sm">{successMsg}</span>
              ) : (
                <span className="eyebrow" style={{ fontSize: "0.58rem" }}>{r.quick}</span>
              )}
            </p>
          </form>
        </Reveal>

        {/* Contact strip */}
        <Reveal delay={120}>
          <div className="mt-16 grid sm:grid-cols-3 gap-8 text-center" style={{ borderTop: "1px solid var(--line)", paddingTop: "3rem" }}>
            <div>
              <p className="text-[11px] tracking-widest uppercase font-body font-bold mb-2" style={{ color: "var(--muted)", letterSpacing: "0.18em" }}>{r.addressLabel}</p>
              <p className="font-body text-sm whitespace-pre-line" style={{ color: "var(--ink)", lineHeight: 1.7 }}>{r.address}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-widest uppercase font-body font-bold mb-2" style={{ color: "var(--muted)", letterSpacing: "0.18em" }}>{r.hoursLabel}</p>
              <p className="font-body text-sm whitespace-pre-line" style={{ color: "var(--ink)", lineHeight: 1.7 }}>{r.hours}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-widest uppercase font-body font-bold mb-2" style={{ color: "var(--muted)", letterSpacing: "0.18em" }}>{r.contactLabel}</p>
              <a href={`mailto:${EMAIL}`} className="font-body text-sm block hover:opacity-60 transition-opacity break-all" style={{ color: "var(--ink)" }}>{EMAIL}</a>
              <a href={PHONE_TEL} className="font-body text-sm block hover:opacity-60 transition-opacity" style={{ color: "var(--ink)" }}>{PHONE}</a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="font-body text-sm inline-flex items-center justify-center gap-2 hover:opacity-60 transition-opacity" style={{ color: "var(--ink)" }}>
                <InstagramIcon size={15} /> @lacantinadesancarlos
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
