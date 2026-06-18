"use client";

import Reveal from "./Reveal";
import { HornoIcon, MalletIcon, PalmIcon, CasitaIcon } from "./Icons";
import { useI18n } from "@/lib/i18n";

const ICONS = [HornoIcon, MalletIcon, PalmIcon, CasitaIcon];

export default function Oven() {
  const { t } = useI18n();
  const o = t.oven;
  return (
    <section id="horno" className="relative py-28 md:py-40 px-6 overflow-hidden" style={{ backgroundColor: "var(--ink)" }}>
      {/* faint fire backdrop */}
      <div className="absolute inset-0 z-0" style={{ opacity: 0.16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/fire-logs.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(24,22,19,0.55)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="flex items-center gap-3 mb-6" style={{ color: "rgba(243,238,227,0.55)" }}>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
              <span className="eyebrow">{o.eyebrow}</span>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
            </div>
          </Reveal>
          <Reveal delay={60}><HornoIcon size={46} className="mb-4" variant="paper" /></Reveal>
          <Reveal delay={100}>
            <span className="font-script" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "rgba(243,238,227,0.9)" }}>{o.script}</span>
          </Reveal>
          <Reveal delay={140}>
            <h2 className="headline mt-3" style={{ fontSize: "clamp(2.2rem,7vw,5.5rem)", color: "var(--paper)" }}>{o.title}</h2>
          </Reveal>
        </div>

        {/* Big pull quote */}
        <Reveal delay={140}>
          <p className="mt-12 mx-auto text-center font-script" style={{ fontSize: "clamp(1.5rem,3.6vw,2.4rem)", color: "rgba(243,238,227,0.85)", maxWidth: "22ch", lineHeight: 1.35 }}>
            {o.quote}
          </p>
        </Reveal>

        {/* Image + text */}
        <div className="mt-20 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal delay={120}>
            <figure className="img-zoom img-duo w-full rounded-sm relative" style={{ aspectRatio: "4/3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/venue-oven.jpg" alt={o.caption} className="w-full h-full object-cover" />
              <figcaption className="absolute bottom-4 left-4 eyebrow" style={{ color: "var(--paper)", fontSize: "0.6rem", textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>
                {o.caption}
              </figcaption>
            </figure>
          </Reveal>
          <div className="space-y-6">
            <Reveal delay={160}>
              <p className="font-body text-sm md:text-base" style={{ color: "rgba(243,238,227,0.72)", lineHeight: 1.95 }}>{o.p1}</p>
            </Reveal>
            <Reveal delay={210}>
              <p className="font-body text-sm md:text-base" style={{ color: "rgba(243,238,227,0.72)", lineHeight: 1.95 }}>{o.p2}</p>
            </Reveal>
          </div>
        </div>

        {/* Four pillars */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4">
          {o.pillars.map((p, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={p.t} delay={i * 80}>
                <div className="px-6 py-10 text-center flex flex-col items-center h-full" style={{ borderLeft: i % 4 === 0 ? "none" : "1px solid rgba(243,238,227,0.12)" }}>
                  <span className="eyebrow mb-5" style={{ color: "rgba(243,238,227,0.4)", fontSize: "0.6rem" }}>{p.n}</span>
                  <Icon size={42} className="mb-4" variant="paper" />
                  <p className="font-display uppercase text-sm tracking-widest" style={{ color: "var(--paper)", letterSpacing: "0.15em" }}>{p.t}</p>
                  <p className="mt-1.5 font-body text-xs" style={{ color: "var(--muted)" }}>{p.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
