"use client";

import { waLink } from "@/lib/site";
import Marquee from "./Marquee";
import Embers from "./Embers";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: "660px", backgroundColor: "var(--ink)" }}>
      {/* Background photo — burning wood, slow zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/fire-logs.jpg" alt="" className="kenburns w-full h-full object-cover" style={{ opacity: 0.5 }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, rgba(24,22,19,0.32) 0%, rgba(24,22,19,0.72) 70%), linear-gradient(to bottom, rgba(24,22,19,0.7) 0%, rgba(24,22,19,0.2) 45%, rgba(24,22,19,0.95) 100%)",
          }}
        />
        {/* vignette */}
        <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 200px 60px rgba(24,22,19,0.7)" }} />
        {/* Living firelight + rising embers ON TOP of the darkening (pure CSS, no video) */}
        <div className="fire-glow" />
        <div className="fire-glow fire-glow--2" />
        <Embers count={24} />
      </div>

      {/* Editorial side labels */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-10 -rotate-90 origin-left">
        <span className="eyebrow" style={{ color: "rgba(243,238,227,0.5)", fontSize: "0.62rem" }}>Est. MMXXVI</span>
      </div>
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 rotate-90 origin-right">
        <span className="eyebrow" style={{ color: "rgba(243,238,227,0.5)", fontSize: "0.62rem" }}>38°59′N · 1°31′E</span>
      </div>

      {/* Content — the provided logo is the hero */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* The real brand logo, larger */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-mark-white.png"
          alt="La Cantina de San Carlos"
          className="hero-in w-[320px] sm:w-[440px] md:w-[560px] object-contain"
          style={{ animationDelay: "0.05s" }}
        />

        {/* One short line — same cream colour as everything else */}
        <div className="hero-in flex items-center gap-3 mt-10" style={{ color: "var(--paper)", animationDelay: "0.3s" }}>
          <span className="h-px w-6" style={{ backgroundColor: "currentColor", opacity: 0.5 }} />
          <span className="eyebrow" style={{ fontSize: "0.64rem" }}>Cocina de fuego · San Carlos, Ibiza</span>
          <span className="h-px w-6" style={{ backgroundColor: "currentColor", opacity: 0.5 }} />
        </div>

        <div className="hero-in mt-9 flex flex-col sm:flex-row items-center gap-4" style={{ animationDelay: "0.5s" }}>
          <a
            href="#carta"
            className="group inline-flex items-center gap-3 px-8 py-4 text-xs tracking-widest uppercase font-body font-bold transition-opacity hover:opacity-85"
            style={{ backgroundColor: "var(--paper)", color: "var(--ink)", letterSpacing: "0.18em" }}
          >
            Ver la carta
            <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 text-xs tracking-widest uppercase font-body font-bold transition-colors"
            style={{ border: "1px solid rgba(243,238,227,0.45)", color: "var(--paper)", letterSpacing: "0.18em" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--paper)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(243,238,227,0.45)")}
          >
            Reservar mesa
          </a>
        </div>
      </div>

      {/* Bottom marquee strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 py-4" style={{ borderTop: "1px solid rgba(243,238,227,0.15)" }}>
        <Marquee
          items={["Horno de barro", "Cocina de leña", "Producto de temporada", "San Carlos · Ibiza", "Fuego real"]}
          duration={34}
          className="font-display uppercase"
          style={{ color: "rgba(243,238,227,0.6)", fontSize: "0.8rem", letterSpacing: "0.15em" }}
        />
      </div>
    </section>
  );
}
