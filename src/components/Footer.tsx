"use client";

import { waLink, INSTAGRAM } from "@/lib/site";
import Marquee from "./Marquee";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  const f = t.footer;
  return (
    <footer className="relative overflow-hidden pt-20 pb-10 px-6" style={{ backgroundColor: "var(--ink)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-mark-white.png" alt="La Cantina de San Carlos" className="h-24 md:h-28 object-contain" />
        </div>

        {/* Contact columns */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div>
            <p className="font-display uppercase text-sm tracking-widest mb-4" style={{ color: "var(--paper)", letterSpacing: "0.15em" }}>{f.whereLabel}</p>
            <div className="space-y-1.5 font-body text-sm" style={{ color: "rgba(243,238,227,0.6)" }}>
              {f.where.map((line) => <p key={line}>{line}</p>)}
            </div>
          </div>

          <div>
            <p className="font-display uppercase text-sm tracking-widest mb-4" style={{ color: "var(--paper)", letterSpacing: "0.15em" }}>{f.hoursLabel}</p>
            <div className="space-y-1.5 font-body text-sm" style={{ color: "rgba(243,238,227,0.6)" }}>
              {f.hours.map((line, i) => <p key={line} style={i === 2 ? { color: "var(--muted)" } : undefined}>{line}</p>)}
            </div>
          </div>

          <div>
            <p className="font-display uppercase text-sm tracking-widest mb-4" style={{ color: "var(--paper)", letterSpacing: "0.15em" }}>{f.followLabel}</p>
            <div className="flex flex-col gap-1.5 font-body text-sm" style={{ color: "rgba(243,238,227,0.6)" }}>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--paper)] transition-colors">@lacantinadesancarlos</a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--paper)] transition-colors">{f.waText}</a>
              <a href="#carta" className="hover:text-[var(--paper)] transition-colors">{f.menuLink}</a>
            </div>
          </div>
        </div>
      </div>

      {/* Brand marquee */}
      <div className="mt-20 py-5" style={{ borderTop: "1px solid rgba(243,238,227,0.12)", borderBottom: "1px solid rgba(243,238,227,0.12)" }}>
        <Marquee items={f.marquee} duration={38} className="font-display uppercase" style={{ color: "rgba(243,238,227,0.55)", fontSize: "0.85rem", letterSpacing: "0.16em" }} />
      </div>

      {/* IBIZA wordmark — the bottom statement (smaller) */}
      <div className="max-w-7xl mx-auto mt-16">
        <p className="text-center font-script mb-1" style={{ fontSize: "clamp(1rem,2.4vw,1.4rem)", color: "rgba(243,238,227,0.7)" }}>
          {f.fireIn}
        </p>
        <h2 className="headline text-center leading-none select-none" style={{ fontSize: "clamp(2.6rem, 11vw, 8rem)", color: "var(--paper)" }}>
          Ibiza
        </h2>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-7 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(243,238,227,0.12)" }}>
        <p className="font-body text-xs" style={{ color: "var(--muted)" }}>© {new Date().getFullYear()} {f.rights}</p>
        <p className="font-body text-xs" style={{ color: "var(--muted)" }}>{f.tagline}</p>
      </div>
    </footer>
  );
}
