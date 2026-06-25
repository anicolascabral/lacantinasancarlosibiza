"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { MalletIcon } from "./Icons";
import { useI18n } from "@/lib/i18n";

export default function Events() {
  const { t } = useI18n();
  const e = t.events;
  return (
    <section className="py-28 md:py-40 px-6" style={{ backgroundColor: "var(--white)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="flex items-center gap-3 mb-6" style={{ color: "var(--muted)" }}>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
              <span className="eyebrow">{e.eyebrow}</span>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
            </div>
          </Reveal>
          <Reveal delay={60}><MalletIcon size={36} className="mb-4" /></Reveal>
          <Reveal delay={100}>
            <span className="font-script" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--ink)" }}>{e.script}</span>
          </Reveal>
          <Reveal delay={140}>
            <h2 className="headline mt-3" style={{ fontSize: "clamp(2.2rem,7vw,5.5rem)", color: "var(--ink)" }}>{e.title}</h2>
          </Reveal>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {e.items.map((ev, i) => (
            <Reveal key={ev.title} delay={i * 90}>
              <div className="group h-full flex flex-col transition-transform duration-500 hover:-translate-y-1.5" style={{ backgroundColor: "var(--paper)" }}>
                <figure className="img-zoom img-duo w-full relative" style={{ aspectRatio: "4/3" }}>
                  <Image src={ev.img} alt={ev.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  <span className="absolute top-4 left-4 font-display" style={{ color: "var(--paper)", fontSize: "1.6rem", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}>{ev.n}</span>
                </figure>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="font-display uppercase text-lg" style={{ color: "var(--ink)" }}>{ev.title}</h3>
                    <span className="eyebrow whitespace-nowrap" style={{ color: "var(--muted)", fontSize: "0.55rem" }}>{ev.date}</span>
                  </div>
                  <p className="font-body text-sm" style={{ color: "var(--muted)", lineHeight: 1.7 }}>{ev.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
