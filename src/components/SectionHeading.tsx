"use client";

import { ReactNode } from "react";
import Reveal from "./Reveal";

type Variant = "ink" | "paper";

export default function SectionHeading({
  icon,
  script,
  title,
  kicker,
  variant = "ink",
  align = "center",
}: {
  icon?: ReactNode;
  script: string;
  title: ReactNode;
  kicker?: string;
  variant?: Variant;
  align?: "center" | "left";
}) {
  const isPaper = variant === "paper";
  const titleColor = isPaper ? "var(--paper)" : "var(--ink)";
  const scriptColor = isPaper ? "rgba(243,238,227,0.92)" : "var(--ink)";
  const kickerColor = isPaper ? "rgba(243,238,227,0.55)" : "var(--muted)";
  const items = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${items}`}>
      {kicker && (
        <Reveal>
          <div className="flex items-center gap-3 mb-6" style={{ color: kickerColor }}>
            <span className="h-px w-6" style={{ backgroundColor: "currentColor", opacity: 0.6 }} />
            <span className="eyebrow">{kicker}</span>
            <span className="h-px w-6" style={{ backgroundColor: "currentColor", opacity: 0.6 }} />
          </div>
        </Reveal>
      )}
      {icon && (
        <Reveal delay={40}>
          <div className="mb-4" style={{ color: titleColor }}>
            {icon}
          </div>
        </Reveal>
      )}
      <Reveal delay={80}>
        <span className="font-script" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: scriptColor }}>
          {script}
        </span>
      </Reveal>
      <Reveal delay={140}>
        <h2 className="headline mt-3" style={{ fontSize: "clamp(2.2rem, 7vw, 5.5rem)", color: titleColor }}>
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
