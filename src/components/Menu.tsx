"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { HornoIcon } from "./Icons";
import { useI18n } from "@/lib/i18n";

export default function Menu() {
  const { t } = useI18n();
  const m = t.menu;
  const [active, setActive] = useState("horno");
  const current = m.categories.find((c) => c.id === active) ?? m.categories[0];

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

        {/* Category tabs — underline style */}
        <Reveal delay={140}>
          <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3" style={{ borderBottom: "1px solid var(--line)" }}>
            {m.categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className="relative pb-4 text-xs tracking-widest uppercase font-body font-bold transition-opacity"
                style={{ letterSpacing: "0.14em", color: active === c.id ? "var(--ink)" : "var(--muted)", opacity: active === c.id ? 1 : 0.7 }}
              >
                {c.label}
                <span className="absolute left-0 right-0 bottom-0 h-0.5 transition-transform duration-300" style={{ backgroundColor: "var(--ink)", transform: active === c.id ? "scaleX(1)" : "scaleX(0)" }} />
              </button>
            ))}
          </div>
        </Reveal>

        {/* Image + dish list */}
        <div className="mt-14 grid md:grid-cols-5 gap-10 lg:gap-16 items-start">
          <div className="md:col-span-2 md:sticky md:top-28">
            <figure className="img-zoom w-full rounded-sm relative aspect-[16/10] md:aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={current.image} src={current.image} alt={current.label} className="w-full h-full object-cover" />
              {current.tag && (
                <span className="absolute top-4 left-4 eyebrow px-3 py-1.5" style={{ backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: "0.55rem" }}>
                  {current.tag}
                </span>
              )}
              <figcaption className="absolute bottom-4 left-4 font-script" style={{ color: "var(--paper)", fontSize: "1.3rem", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}>
                {current.label}
              </figcaption>
            </figure>
          </div>

          <div className="md:col-span-3">
            {current.items.map((dish, i) => (
              <Reveal key={dish.name} delay={i * 40}>
                <div className="group py-5" style={{ borderBottom: "1px solid var(--line)" }}>
                  <div className="flex items-baseline">
                    <h4 className="font-display uppercase text-base md:text-lg transition-colors" style={{ color: "var(--ink)", letterSpacing: "0.02em" }}>{dish.name}</h4>
                    <span className="leader" />
                    <span className="flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "var(--ink)" }}>↗</span>
                  </div>
                  <p className="mt-1.5 font-body text-sm" style={{ color: "var(--muted)", lineHeight: 1.6 }}>{dish.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <p className="mt-16 text-center font-body text-xs tracking-wider mx-auto" style={{ color: "var(--muted)", letterSpacing: "0.1em", lineHeight: 1.9, maxWidth: "52ch" }}>
          {m.note}
        </p>
      </div>
    </section>
  );
}
