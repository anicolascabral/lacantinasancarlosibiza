"use client";

import { INSTAGRAM, PHONE, PHONE_TEL, EMAIL, EMAIL_MAILTO, MAPS_URL } from "@/lib/site";
import Marquee from "./Marquee";
import { InstagramIcon } from "./Icons";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  const f = t.footer;
  return (
    <footer className="relative overflow-hidden pt-20 pb-10 px-6" style={{ backgroundColor: "var(--ink)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Contact columns */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div>
            <p className="font-display uppercase text-sm tracking-widest mb-4" style={{ color: "var(--paper)", letterSpacing: "0.15em" }}>{f.whereLabel}</p>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="group block space-y-1.5 font-body text-sm transition-colors hover:text-[var(--paper)]" style={{ color: "rgba(243,238,227,0.6)" }}>
              {f.where.map((line) => <p key={line}>{line}</p>)}
              <span className="inline-flex items-center gap-1.5 pt-1.5 text-xs uppercase tracking-widest font-bold transition-opacity group-hover:opacity-100" style={{ color: "var(--paper)", opacity: 0.75, letterSpacing: "0.18em" }}>
                {f.directions}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
              </span>
            </a>
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
              <a href={PHONE_TEL} className="hover:text-[var(--paper)] transition-colors">{PHONE}</a>
              <a href={EMAIL_MAILTO} className="hover:text-[var(--paper)] transition-colors break-all">{EMAIL}</a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--paper)] transition-colors">
                <InstagramIcon size={15} /> @lacantinadesancarlos
              </a>
              <a href="#reservas" className="hover:text-[var(--paper)] transition-colors">{f.waText}</a>
              <a href="#carta" className="hover:text-[var(--paper)] transition-colors">{f.menuLink}</a>
            </div>
          </div>
        </div>
      </div>

      {/* Brand marquee */}
      <div className="mt-20 py-5" style={{ borderTop: "1px solid rgba(243,238,227,0.12)", borderBottom: "1px solid rgba(243,238,227,0.12)" }}>
        <Marquee items={f.marquee} duration={38} className="font-display uppercase" style={{ color: "rgba(243,238,227,0.55)", fontSize: "0.85rem", letterSpacing: "0.16em" }} />
      </div>

      {/* Brand row — San Carlos + Ibiza side by side */}
      <div className="max-w-7xl mx-auto mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-mark-white.png" alt="La Cantina de San Carlos" className="h-20 md:h-24 object-contain shrink-0" />
        <div className="hidden sm:block w-px h-16 md:h-20 shrink-0" style={{ backgroundColor: "rgba(243,238,227,0.12)" }} aria-hidden />
        <div className="text-center sm:text-left">
          <p className="font-script mb-0.5" style={{ fontSize: "clamp(0.95rem, 2vw, 1.25rem)", color: "rgba(243,238,227,0.7)" }}>
            {f.fireIn}
          </p>
          <h2 className="headline leading-none select-none" style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "var(--paper)" }}>
            Ibiza
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 md:mt-14 pt-7 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(243,238,227,0.12)" }}>
        <p className="font-body text-xs" style={{ color: "var(--muted)" }}>© {new Date().getFullYear()} {f.rights}</p>
        <p className="font-body text-xs" style={{ color: "var(--muted)" }}>{f.tagline}</p>
      </div>
    </footer>
  );
}
