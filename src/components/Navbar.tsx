"use client";

import { useState, useEffect } from "react";
import { waLink } from "@/lib/site";
import { useI18n, Lang } from "@/lib/i18n";

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fg = scrolled ? "var(--ink)" : "var(--paper)";

  const LangToggle = ({ color }: { color: string }) => (
    <div className="flex items-center gap-1.5 text-xs font-body font-bold" style={{ color, letterSpacing: "0.1em" }}>
      {(["es", "en"] as Lang[]).map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i === 1 && <span style={{ opacity: 0.4 }}>/</span>}
          <button
            onClick={() => setLang(l)}
            className="uppercase transition-opacity"
            style={{ opacity: lang === l ? 1 : 0.45 }}
            aria-label={l === "es" ? "Español" : "English"}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(236,229,214,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      {/* Thin announcement bar — collapses on scroll */}
      <div
        className="overflow-hidden transition-all duration-500"
        style={{
          maxHeight: scrolled ? 0 : 40,
          opacity: scrolled ? 0 : 1,
          borderBottom: scrolled ? "none" : "1px solid rgba(243,238,227,0.18)",
        }}
      >
        <div className="flex items-center justify-center gap-3 py-2.5 px-6">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--paper)" }} />
          <span className="eyebrow" style={{ color: "var(--paper)", fontSize: "0.6rem", letterSpacing: "0.28em" }}>
            {t.nav.announce}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center px-6 md:px-10 py-4">
        {/* Left — language toggle + reserve */}
        <div className="flex items-center gap-5">
          <LangToggle color={fg} />
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline text-xs tracking-widest uppercase font-body font-bold transition-opacity hover:opacity-60"
            style={{ color: fg, letterSpacing: "0.18em" }}
          >
            {t.nav.reserve}
          </a>
        </div>

        {/* Center — logo appears only after scroll */}
        <div className="flex justify-center">
          <a
            href="#"
            aria-label="La Cantina de San Carlos"
            className="transition-opacity duration-300"
            style={{ opacity: scrolled ? 1 : 0, pointerEvents: scrolled ? "auto" : "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-mark-black.png" alt="La Cantina de San Carlos" className="object-contain" style={{ height: "44px" }} />
          </a>
        </div>

        {/* Right — menu toggle */}
        <div className="flex justify-end items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 text-xs tracking-widest uppercase font-body font-bold"
            style={{ color: fg, letterSpacing: "0.18em" }}
            aria-label={t.nav.menu}
          >
            <span className="hidden sm:inline">{t.nav.menu}</span>
            <span className="flex flex-col gap-1">
              <span className="block w-5 h-0.5 transition-all" style={{ backgroundColor: fg, transform: menuOpen ? "rotate(45deg) translate(2px,2px)" : "none" }} />
              <span className="block w-5 h-0.5 transition-all" style={{ backgroundColor: fg, opacity: menuOpen ? 0 : 1 }} />
              <span className="block w-5 h-0.5 transition-all" style={{ backgroundColor: fg, transform: menuOpen ? "rotate(-45deg) translate(2px,-2px)" : "none" }} />
            </span>
          </button>
        </div>
      </div>

      {/* Fullscreen overlay menu */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 transition-all duration-500"
        style={{ backgroundColor: "var(--ink)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-icon-white.png" alt="" className="h-20 object-contain mb-4 opacity-90" />
        {t.nav.links.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="headline text-4xl md:text-6xl transition-all duration-300 hover:opacity-60"
            style={{ color: "var(--paper)", transform: menuOpen ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 60}ms` }}
          >
            {link.label}
          </a>
        ))}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
          className="mt-4 px-8 py-4 text-xs tracking-widest uppercase font-body font-bold transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--paper)", color: "var(--ink)", letterSpacing: "0.2em" }}
        >
          {t.nav.bookTable}
        </a>
        <div className="mt-2"><LangToggle color="var(--paper)" /></div>
      </div>
    </header>
  );
}
