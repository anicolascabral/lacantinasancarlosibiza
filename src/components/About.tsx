"use client";

import Reveal from "./Reveal";
import { CasitaIcon } from "./Icons";
import { useI18n } from "@/lib/i18n";

export default function About() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <section id="historia" className="py-28 md:py-40 px-6 paper-texture">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="flex items-center gap-3 mb-6" style={{ color: "var(--muted)" }}>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
              <span className="eyebrow">{a.eyebrow}</span>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
            </div>
          </Reveal>
          <Reveal delay={60}>
            <CasitaIcon size={38} className="mb-4" />
          </Reveal>
          <Reveal delay={100}>
            <span className="font-script" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--ink)" }}>{a.script}</span>
          </Reveal>
          <Reveal delay={160}>
            <h2 className="headline mt-3 mx-auto" style={{ fontSize: "clamp(1.9rem, 5.2vw, 4.2rem)", color: "var(--ink)", maxWidth: "18ch" }}>
              {a.title}
            </h2>
          </Reveal>
        </div>

        {/* Editorial: image + text */}
        <div className="mt-20 grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          <Reveal delay={120} className="md:col-span-7">
            <figure className="img-zoom img-duo w-full rounded-sm relative" style={{ aspectRatio: "16/11" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/chef.jpg" alt={a.caption} className="w-full h-full object-cover" />
              <figcaption className="absolute bottom-4 left-4 eyebrow" style={{ color: "var(--paper)", fontSize: "0.6rem", textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>
                {a.caption}
              </figcaption>
            </figure>
          </Reveal>

          <div className="md:col-span-5">
            <Reveal delay={160}>
              <p className="font-script mb-6" style={{ fontSize: "clamp(1.3rem,2.5vw,1.7rem)", color: "var(--ink)", lineHeight: 1.4 }}>
                {a.quote}
              </p>
            </Reveal>
            <Reveal delay={210}>
              <p className="font-body text-sm md:text-base" style={{ color: "var(--ink-soft)", lineHeight: 1.9 }}>
                {a.p1}
              </p>
            </Reveal>
          </div>
        </div>

        {/* Stats band */}
        <Reveal delay={120}>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
            {a.stats.map((s, i) => (
              <div key={s.l} className="py-9 text-center" style={{ borderLeft: i % 4 === 0 ? "none" : "1px solid var(--line)" }}>
                <p className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "var(--ink)", lineHeight: 1 }}>{s.n}</p>
                <p className="mt-2 eyebrow" style={{ color: "var(--muted)", fontSize: "0.6rem" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
