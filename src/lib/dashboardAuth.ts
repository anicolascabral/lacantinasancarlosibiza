// Shared Basic Auth check for the internal reservations dashboard. Used from
// two places on purpose (defense in depth): src/proxy.ts (blocks the request
// early, shows the browser's native login prompt) AND directly inside each
// /api/dashboard/* route handler, since a Next.js proxy/middleware auth
// bypass affecting Turbopack apps (CVE-2026-64642, fixed in 16.2.11) showed
// relying on proxy alone isn't enough — Next's own advisory recommends
// re-checking authorization in the route's data path too.

// Returns credentials to check against, or null when the dashboard must
// refuse all access (production with no real credentials configured).
function credentials(): { user: string; pass: string } | null {
  const user = process.env.DASHBOARD_USER;
  const pass = process.env.DASHBOARD_PASS;
  if (user && pass) return { user, pass };
  // No real credentials set. Never fall back to a guessable default outside
  // local dev — VERCEL is set on every Vercel deployment (prod & preview).
  if (process.env.VERCEL) return null;
  return { user: "admin", pass: "admin" };
}

export function isDashboardAuthorized(request: Request): boolean {
  const creds = credentials();
  if (!creds) return false;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  const decoded = atob(header.slice(6));
  const sep = decoded.indexOf(":");
  return decoded.slice(0, sep) === creds.user && decoded.slice(sep + 1) === creds.pass;
}

export function dashboardUnauthorizedResponse(): Response {
  return new Response("Autenticación requerida", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Dashboard", charset="UTF-8"' },
  });
}
