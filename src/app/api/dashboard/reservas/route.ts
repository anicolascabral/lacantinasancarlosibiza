import { addReservation, listReservations } from "@/lib/reservations";
import { dashboardUnauthorizedResponse, isDashboardAuthorized } from "@/lib/dashboardAuth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isDashboardAuthorized(request)) return dashboardUnauthorizedResponse();
  const reservations = await listReservations();
  return Response.json({ reservations });
}

// Manual entry — staff logging a phone/walk-in booking, or backfilling one
// they already handled by email before the dashboard existed.
export async function POST(request: Request) {
  if (!isDashboardAuthorized(request)) return dashboardUnauthorizedResponse();

  const body = await request.json().catch(() => null);
  const name = (body?.name || "").trim();
  if (!name) return Response.json({ ok: false, error: "name_required" }, { status: 400 });

  const reservation = await addReservation({
    name,
    email: (body?.email || "").trim() || "—",
    phone: (body?.phone || "").trim() || "—",
    date: (body?.date || "").trim() || "—",
    time: (body?.time || "").trim() || "—",
    guests: (body?.guests || "").trim() || "—",
    message: (body?.message || "").trim() || "—",
    lang: "es",
  });
  return Response.json({ ok: true, reservation });
}
