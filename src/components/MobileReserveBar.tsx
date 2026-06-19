"use client";

import { useEffect, useState } from "react";
import { PHONE_TEL } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

/**
 * Persistent reserve/call bar — mobile only. Anchored to the bottom so the
 * primary action (booking) is always one tap away while scrolling. Slides out
 * of the way once the reservation form itself is on screen, so it never doubles
 * up with the form's own submit button. Respects the iOS home-indicator inset.
 */
export default function MobileReserveBar() {
  const { t, lang } = useI18n();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = document.getElementById("reservas");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const call = lang === "es" ? "Llamar" : "Call";

  return (
    <div
      className="md:hidden fixed left-0 right-0 bottom-0 z-40 transition-transform duration-500"
      style={{
        transform: hidden ? "translateY(130%)" : "translateY(0)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 0.6rem)",
        paddingTop: "1.4rem",
        paddingLeft: "0.8rem",
        paddingRight: "0.8rem",
        background: "linear-gradient(to top, rgba(24,22,19,0.96) 55%, rgba(24,22,19,0))",
      }}
    >
      <div className="flex gap-2.5">
        <a
          href="#reservas"
          className="flex-1 inline-flex items-center justify-center py-3.5 text-xs tracking-widest uppercase font-body font-bold rounded-sm transition-opacity active:opacity-80"
          style={{ backgroundColor: "var(--paper)", color: "var(--ink)", letterSpacing: "0.16em" }}
        >
          {t.nav.reserve}
        </a>
        <a
          href={PHONE_TEL}
          aria-label={call}
          className="inline-flex items-center justify-center gap-2 py-3.5 px-5 text-xs tracking-widest uppercase font-body font-bold rounded-sm transition-colors active:opacity-80"
          style={{ border: "1px solid rgba(243,238,227,0.45)", color: "var(--paper)", letterSpacing: "0.16em" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
          </svg>
          {call}
        </a>
      </div>
    </div>
  );
}
