"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { HornoIcon } from "./Icons";
import { useI18n } from "@/lib/i18n";

export default function Menu() {
  const { t } = useI18n();
  const m = t.menu;

  return (
    <section id="carta" className="py-24 md:py-36 px-6" style={{ backgroundColor: "var(--white)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="flex items-center gap-3 mb-6" style={{ color: "var(--muted)" }}>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
              <span className="eyebrow">{m.eyebrow}</span>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
            </div>
          </Reveal>
          <Reveal delay={60}><HornoIcon size={40} className="mb-4" /></Reveal>
          <Reveal delay={100}>
            <span className="font-script" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--ink)" }}>{m.script}</span>
          </Reveal>
          <Reveal delay={140}>
            <h2 className="headline mt-3" style={{ fontSize: "clamp(2.2rem,7vw,5.5rem)", color: "var(--ink)" }}>{m.title}</h2>
          </Reveal>
        </div>

        {/* Image + general description */}
        <div className="mt-16 grid md:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Authentic oven image */}
          <div className="md:col-span-2 md:sticky md:top-28">
            <figure className="img-zoom img-duo w-full rounded-sm relative aspect-[16/10] md:aspect-[4/5]">
              <Image src={m.image} alt={m.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              <figcaption className="absolute bottom-4 left-4 font-script" style={{ color: "var(--paper)", fontSize: "1.3rem", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}>
                El horno
              </figcaption>
            </figure>
          </div>

          {/* Intro + product families */}
          <div className="md:col-span-3">
            <Reveal>
              <p className="font-body text-base md:text-lg" style={{ color: "var(--ink-soft)", lineHeight: 1.9 }}>
                {m.intro}
              </p>
            </Reveal>

            <div className="mt-10">
              {m.families.map((fam, i) => (
                <Reveal key={fam.name} delay={i * 50}>
                  <div className="group flex items-baseline gap-5 py-5" style={{ borderBottom: "1px solid var(--line)" }}>
                    <span className="font-script flex-shrink-0" style={{ fontSize: "1.1rem", color: "var(--muted)", width: "2rem" }}>{fam.n}</span>
                    <div className="flex-1">
                      <h4 className="font-display uppercase text-base md:text-lg" style={{ color: "var(--ink)", letterSpacing: "0.02em" }}>{fam.name}</h4>
                      <p className="mt-1 font-body text-sm" style={{ color: "var(--muted)", lineHeight: 1.6 }}>{fam.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-14 text-center font-body text-xs tracking-wider mx-auto" style={{ color: "var(--muted)", letterSpacing: "0.1em", lineHeight: 1.9, maxWidth: "56ch" }}>
          {m.note}
        </p>
      </div>
    </section>
  );
}
