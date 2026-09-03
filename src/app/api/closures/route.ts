// Public, read-only: the booking form (src/components/Reservation.tsx) checks
// this to know which days staff has manually closed from the dashboard. Just
// a list of dates, no PII — safe to expose without auth.
import { listClosures } from "@/lib/closures";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ dates: await listClosures() });
}
