import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next 16 renamed `middleware` → `proxy`. This runs before routes render and
// sends locale-less URLs (e.g. "/" or "/carta") to the right language prefix so
// every page lives under an indexable /es or /en path.
const LOCALES = ["es", "en"] as const;
const DEFAULT_LOCALE = "es";

function detectLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language") || "";
  // First language tag wins; we only care about the base language (es/en).
  const preferred = header.split(",")[0]?.trim().slice(0, 2).toLowerCase();
  return LOCALES.includes(preferred as (typeof LOCALES)[number]) ? preferred : DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, the API, and anything with a file extension
  // (sitemap.xml, robots.txt, og.jpg, icons, /images, /fonts, …).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
