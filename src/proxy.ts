import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dashboardUnauthorizedResponse, isDashboardAuthorized } from "@/lib/dashboardAuth";

// Next 16 renamed `middleware` → `proxy`. Only one proxy.ts is allowed per
// project, so this file does two unrelated jobs:
//   1) Locale routing — send locale-less URLs (e.g. "/" or "/carta") to the
//      right language prefix so every public page lives under an indexable
//      /es or /en path.
//   2) Basic Auth on the internal /dashboard reservations panel (shows
//      customer PII, must not be public). See src/lib/dashboardAuth.ts — the
//      same check also runs inside each /api/dashboard/* route handler as
//      defense in depth (a known Next/Turbopack proxy-auth-bypass CVE means
//      this file alone isn't a guaranteed gate).
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

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname.startsWith("/api/dashboard")) {
    return isDashboardAuthorized(request) ? NextResponse.next() : dashboardUnauthorizedResponse();
  }

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
  // Skip Next internals and anything with a file extension for the locale
  // redirect; /api is excluded too except /api/dashboard, re-added below so
  // its Basic Auth check still runs (other /api/* routes must never be
  // locale-redirected).
  matcher: ["/((?!_next|api|.*\\..*).*)", "/api/dashboard/:path*"],
};
