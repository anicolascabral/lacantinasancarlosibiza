import { addClosure, listClosures, removeClosure } from "@/lib/closures";
import { dashboardUnauthorizedResponse, isDashboardAuthorized } from "@/lib/dashboardAuth";

export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  if (!isDashboardAuthorized(request)) return dashboardUnauthorizedResponse();
  return Response.json({ dates: await listClosures() });
}

export async function POST(request: Request) {
  if (!isDashboardAuthorized(request)) return dashboardUnauthorizedResponse();
  const body = await request.json().catch(() => null);
  const date = (body?.date || "").trim();
  if (!DATE_RE.test(date)) return Response.json({ ok: false, error: "bad_date" }, { status: 400 });
  return Response.json({ ok: true, dates: await addClosure(date) });
}

export async function DELETE(request: Request) {
  if (!isDashboardAuthorized(request)) return dashboardUnauthorizedResponse();
  const body = await request.json().catch(() => null);
  const date = (body?.date || "").trim();
  if (!DATE_RE.test(date)) return Response.json({ ok: false, error: "bad_date" }, { status: 400 });
  return Response.json({ ok: true, dates: await removeClosure(date) });
}
