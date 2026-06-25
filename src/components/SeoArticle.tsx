import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import type { Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { seoPages, SEO_SLUGS, type SeoSlug } from "@/lib/seoPages";

// Server-rendered content page shared by every SEO landing route. The header
// band is dark so the cream navbar stays readable at the top (the rest is cream,
// matching the brand). Includes BreadcrumbList JSON-LD and internal links.
export default function SeoArticle({ lang, slug }: { lang: Lang; slug: SeoSlug }) {
  const c = seoPages[slug][lang];
  const home = `/${lang}`;
  const ctaHref = `${home}#reservas`;
  const others = SEO_SLUGS.filter((s) => s !== slug);

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "La Cantina de San Carlos", item: `${SITE_URL}/${lang}` },
      { "@type": "ListItem", position: 2, name: c.h1, item: `${SITE_URL}/${lang}/${slug}` },
    ],
  };

  return (
    <>
      <Navbar />

      {/* Dark header band — keeps the cream navbar readable, echoes the hero */}
      <header
        className="relative w-full"
        style={{ backgroundColor: "var(--ink)", paddingTop: "calc(env(safe-area-inset-top) + 8rem)" }}
      >
        <div className="max-w-3xl mx-auto px-6 pb-20 text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-3 mb-6" style={{ color: "rgba(243,238,227,0.55)" }}>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor", opacity: 0.6 }} />
              <span className="eyebrow">{c.eyebrow}</span>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor", opacity: 0.6 }} />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <span className="font-script" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "rgba(243,238,227,0.92)" }}>
              {c.script}
            </span>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="headline mt-3" style={{ fontSize: "clamp(2rem, 6vw, 4.4rem)", color: "var(--paper)" }}>
              {c.h1}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-7 mx-auto font-body" style={{ color: "rgba(243,238,227,0.75)", maxWidth: "44ch", lineHeight: 1.7 }}>
              {c.intro}
            </p>
          </Reveal>
        </div>
      </header>

      {/* Content */}
      <main style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
          {c.sections.map((s, i) => (
            <Reveal key={i} delay={i * 60} className="mb-14 last:mb-0">
              <h2 className="headline" style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)", color: "var(--ink)" }}>
                {s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="mt-4 font-body" style={{ color: "var(--ink)", opacity: 0.85, lineHeight: 1.8 }}>
                  {p}
                </p>
              ))}
            </Reveal>
          ))}

          {/* Primary CTA */}
          <Reveal className="mt-16">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-3 px-8 py-4 text-xs tracking-widest uppercase font-body font-bold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)", letterSpacing: "0.18em" }}
            >
              {c.ctaLabel}
              <span aria-hidden>↗</span>
            </Link>
          </Reveal>

          {/* Internal links to sibling pages */}
          <nav className="mt-16 pt-10" style={{ borderTop: "1px solid var(--line)" }} aria-label={lang === "en" ? "More" : "Más"}>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              <li>
                <Link href={home} className="link-underline eyebrow" style={{ color: "var(--ink)" }}>
                  {lang === "en" ? "Home" : "Inicio"}
                </Link>
              </li>
              {others.map((s) => (
                <li key={s}>
                  <Link href={`/${lang}/${s}`} className="link-underline eyebrow" style={{ color: "var(--ink)" }}>
                    {seoPages[s][lang].script}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
