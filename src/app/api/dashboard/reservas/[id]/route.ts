import {
  markConfirmationSent,
  updateReservationStatus,
  type Reservation,
  type ReservationStatus,
} from "@/lib/reservations";
import { dashboardUnauthorizedResponse, isDashboardAuthorized } from "@/lib/dashboardAuth";
import { sendConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";

const hasEmail = (r: Reservation) => !!r.email && r.email !== "—" && r.email.includes("@");

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDashboardAuthorized(request)) return dashboardUnauthorizedResponse();
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status as ReservationStatus | undefined;
  if (status !== "accepted" && status !== "rejected" && status !== "pending") {
    return Response.json({ ok: false, error: "bad_status" }, { status: 400 });
  }
  let updated = await updateReservationStatus(id, status);
  if (!updated) return Response.json({ ok: false, error: "not_found" }, { status: 404 });

  // Accepting a booking mails the customer their confirmation. Deliberately
  // only on accept: turning someone down is better done personally, so the
  // rejection path stays manual.
  //
  // The status change is the restaurant's source of truth and must stick even
  // if the mail fails — so a send failure is reported back (`emailSent:
  // false`) for the dashboard to surface, never thrown.
  let emailSent: boolean | undefined;
  let emailError: string | undefined;

  if (status === "accepted") {
    if (!hasEmail(updated)) {
      emailSent = false;
      emailError = "no_email"; // phone/walk-in booking — staff will call instead
    } else if (updated.confirmationSentAt) {
      emailSent = false;
      emailError = "already_sent"; // don't mail the same customer twice
    } else {
      try {
        await sendConfirmationEmail({
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          date: updated.date,
          time: updated.time,
          guests: updated.guests,
          message: updated.message,
          lang: updated.lang,
        });
        emailSent = true;
        updated = (await markConfirmationSent(id)) ?? updated;
      } catch (err) {
        emailSent = false;
        emailError = String(err).slice(0, 200);
        console.error("Failed to send confirmation email:", err);
      }
    }
  }

  return Response.json({ ok: true, reservation: updated, emailSent, emailError });
}
