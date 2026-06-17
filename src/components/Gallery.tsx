"use client";

import Reveal from "./Reveal";
import { PalmIcon } from "./Icons";
import Marquee from "./Marquee";
import { useI18n } from "@/lib/i18n";

export default function Gallery() {
  const { t } = useI18n();
  const g = t.gallery;
  return (
    <section className="py-28 md:py-40 paper-texture">
      <div className="px-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="flex items-center gap-3 mb-6" style={{ color: "var(--muted)" }}>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
              <span className="eyebrow">{g.eyebrow}</span>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
            </div>
          </Reveal>
          <Reveal delay={60}><PalmIcon size={38} className="mb-4" /></Reveal>
          <Reveal delay={100}>
            <span className="font-script" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--ink)" }}>{g.script}</span>
          </Reveal>
          <Reveal delay={140}>
            <h2 className="headline mt-3" style={{ fontSize: "clamp(2.2rem,7vw,5.5rem)", color: "var(--ink)" }}>{g.title}</h2>
          </Reveal>
        </div>

        <div className="mt-16 columns-2 md:columns-3 gap-4 [&>*]:mb-4">
          {g.tiles.map((tile, i) => (
            <Reveal key={i} delay={(i % 3) * 70}>
              <figure className="img-zoom img-duo relative w-full rounded-sm group" style={{ aspectRatio: tile.h === "tall" ? "3/4" : "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tile.src} alt={tile.hint} className="w-full h-full object-cover" />
                <figcaption className="absolute inset-0 flex items-end p-4" style={{ background: "linear-gradient(to top, rgba(24,22,19,0.6), transparent 50%)" }}>
                  <span className="eyebrow translate-y-1 group-hover:translate-y-0 transition-transform duration-500" style={{ color: "var(--paper)", fontSize: "0.6rem" }}>{tile.hint}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Marquee divider */}
      <div className="mt-20 py-5" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <Marquee items={g.marquee} duration={40} className="font-display uppercase" style={{ color: "var(--ink)", fontSize: "0.85rem", letterSpacing: "0.14em", opacity: 0.85 }} />
      </div>
    </section>
  );
}
