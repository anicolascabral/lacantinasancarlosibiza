"use client";

import { useEffect, useState } from "react";

type Ember = {
  key: number;
  left: string;
  size: string;
  dur: string;
  delay: string;
  rise: string;
  drift: string;
  opacity: number;
};

// Lightweight CSS-only rising embers. No video, no images — just animated dots.
// Generated on the client only (after mount) to avoid SSR hydration mismatch.
export default function Embers({ count = 22 }: { count?: number }) {
  const [embers, setEmbers] = useState<Ember[]>([]);

  useEffect(() => {
    setEmbers(
      Array.from({ length: count }).map((_, i) => {
        const size = 2 + Math.random() * 4;
        return {
          key: i,
          left: `${Math.random() * 100}%`,
          size: `${size}px`,
          dur: `${4.5 + Math.random() * 5}s`,
          delay: `${Math.random() * 6}s`,
          rise: `${-(260 + Math.random() * 260)}px`,
          drift: `${(Math.random() - 0.5) * 90}px`,
          opacity: 0.5 + Math.random() * 0.5,
        };
      })
    );
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {embers.map((e) => (
        <span
          key={e.key}
          className="ember"
          style={
            {
              left: e.left,
              opacity: e.opacity,
              ["--size"]: e.size,
              ["--dur"]: e.dur,
              ["--delay"]: e.delay,
              ["--rise"]: e.rise,
              ["--drift"]: e.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
