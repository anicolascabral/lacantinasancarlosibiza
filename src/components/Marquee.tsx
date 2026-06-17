"use client";

import { ReactNode } from "react";

export default function Marquee({
  items,
  duration = 36,
  separator = "·",
  className = "",
  style,
}: {
  items: string[];
  duration?: number;
  separator?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const group = (
    <div className="marquee__track" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
      {[...items, ...items].map((it, i) => (
        <span key={i} className="inline-flex items-center">
          <span>{it}</span>
          <span className="mx-6 opacity-50">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${className}`} style={style} aria-hidden>
      {group}
    </div>
  );
}
