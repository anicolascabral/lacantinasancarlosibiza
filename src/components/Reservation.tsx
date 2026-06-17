"use client";

import Reveal from "./Reveal";
import { CasitaIcon } from "./Icons";
import { waLink } from "@/lib/site";

export default function Reservation() {
  return (
    <section id="reservas" className="py-24 md:py-36 px-6 paper-texture">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="flex items-center gap-3 mb-6" style={{ color: "var(--muted)" }}>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
              <span className="eyebrow">Reservas</span>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
            </div>
          </Reveal>
          <Reveal delay={60}><CasitaIcon size={38} className="mb-4" /></Reveal>
          <Reveal delay={100}>
            <span className="font-script" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--ink)" }}>tu mesa te espera</span>
          </Reveal>
          <Reveal delay={140}>
            <h2 className="headline mt-3" style={{ fontSize: "clamp(2.2rem,7vw,5.5rem)", color: "var(--ink)" }}>Reserva tu mesa</h2>
          </Reveal>
        </div>
        <Reveal delay={140}>
          <p className="mt-6 text-center font-body text-sm md:text-base mx-auto" style={{ color: "var(--ink-soft)", maxWidth: "46ch", lineHeight: 1.8 }}>
            Escríbenos por WhatsApp y te confirmamos al momento. Cuéntanos día, hora y número de personas — del resto nos encargamos nosotros.
          </p>
        </Reveal>

        {/* Premium CTA — no image, monochrome button */}
        <Reveal delay={180}>
          <div className="mt-14 flex flex-col items-center">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-5 text-xs sm:text-sm tracking-widest uppercase font-body font-bold transition-colors"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)", letterSpacing: "0.2em" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2A2622")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--ink)")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.46A10 10 0 1012 2z" />
              </svg>
              Reservar por WhatsApp
              <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
            </a>
            <p className="mt-5 eyebrow" style={{ color: "var(--muted)", fontSize: "0.6rem" }}>
              Respuesta rápida · Sant Carles, Ibiza
            </p>
          </div>
        </Reveal>

        {/* Contact strip */}
        <Reveal delay={120}>
          <div className="mt-14 grid sm:grid-cols-3 gap-8 text-center" style={{ borderTop: "1px solid var(--line)", paddingTop: "3rem" }}>
            <div>
              <p className="text-[11px] tracking-widest uppercase font-body font-bold mb-2" style={{ color: "var(--muted)", letterSpacing: "0.18em" }}>Dirección</p>
              <p className="font-body text-sm" style={{ color: "var(--ink)", lineHeight: 1.7 }}>Plaça de la Iglesia, bajos 4<br />07850 Sant Carles, Ibiza</p>
            </div>
            <div>
              <p className="text-[11px] tracking-widest uppercase font-body font-bold mb-2" style={{ color: "var(--muted)", letterSpacing: "0.18em" }}>Horario</p>
              <p className="font-body text-sm" style={{ color: "var(--ink)", lineHeight: 1.7 }}>Martes — Domingo<br />13:00 — 16:00 · 19:30 — 23:30</p>
            </div>
            <div>
              <p className="text-[11px] tracking-widest uppercase font-body font-bold mb-2" style={{ color: "var(--muted)", letterSpacing: "0.18em" }}>Contacto</p>
              <a href="https://instagram.com/lacantinadesancarlos" target="_blank" rel="noopener noreferrer" className="font-body text-sm block hover:opacity-60 transition-opacity" style={{ color: "var(--ink)" }}>@lacantinadesancarlos</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
