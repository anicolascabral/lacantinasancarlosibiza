import {
  deleteReservation,
  getReservation,
  markGuestMailSent,
  updateReservationStatus,
  type Reservation,
  type ReservationStatus,
} from "@/lib/reservations";
import { dashboardUnauthorizedResponse, isDashboardAuthorized } from "@/lib/dashboardAuth";
import { sendConfirmationEmail, sendRejectionEmail } from "@/lib/email";

export const runtime = "nodejs";

const hasEmail = (r: Reservation) => !!r.email && r.email !== "—" && r.email.includes("@");

/**
 * Mails the guest about their booking. The status change is the restaurant's
 * source of truth and must stick even when the mail fails, so this never
 * throws — it reports what happened for the dashboard to surface, because a
 * silent failure would leave a guest never hearing back.
 */
async function mailGuest(
  r: Reservation,
  kind: "confirmation" | "rejection",
): Promise<{ emailSent: boolean; emailError?: string; updated?: Reservation }> {
  if (!hasEmail(r)) return { emailSent: false, emailError: "no_email" };
  if (kind === "confirmation" && r.confirmationSentAt) {
    return { emailSent: false, emailError: "already_sent" };
  }
  if (kind === "rejection" && r.rejectionSentAt) {
    return { emailSent: false, emailError: "already_sent" };
  }

  const target = {
    name: r.name,
    email: r.email,
    phone: r.phone,
    date: r.date,
    time: r.time,
    guests: r.guests,
    message: r.message,
    lang: r.lang,
  };

  try {
    if (kind === "confirmation") await sendConfirmationEmail(target);
    else await sendRejectionEmail(target);
    const updated = (await markGuestMailSent(r.id, kind)) ?? undefined;
    return { emailSent: true, updated };
  } catch (err) {
    console.error(`Failed to send ${kind} email:`, err);
    return { emailSent: false, emailError: String(err).slice(0, 200) };
  }
}

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

  // Accepting always mails the confirmation. Rejecting only mails when staff
  // explicitly ask (`notify: true` — the "Rechazar y avisar" action), since
  // turning someone down is often already handled by phone.
  let mail: Awaited<ReturnType<typeof mailGuest>> | undefined;
  if (status === "accepted") {
    mail = await mailGuest(updated, "confirmation");
  } else if (status === "rejected" && body?.notify === true) {
    mail = await mailGuest(updated, "rejection");
  }
  if (mail?.updated) updated = mail.updated;

  return Response.json({
    ok: true,
    reservation: updated,
    emailSent: mail?.emailSent,
    emailError: mail?.emailError,
  });
}

/**
 * Permanent deletion, for cancelled bookings as well as test rows and
 * duplicates. `?notify=1` mails the guest that their booking is off first.
 *
 * If that mail was asked for and fails, the booking is NOT deleted: destroying
 * the record when the guest was never told would lose the only trace staff
 * have to follow up on. They can retry, or delete without notifying and call
 * instead.
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDashboardAuthorized(request)) return dashboardUnauthorizedResponse();
  const { id } = await params;
  const notify = new URL(request.url).searchParams.get("notify") === "1";

  const existing = await getReservation(id);
  if (!existing) return Response.json({ ok: false, error: "not_found" }, { status: 404 });

  let mail: Awaited<ReturnType<typeof mailGuest>> | undefined;
  if (notify) {
    mail = await mailGuest(existing, "rejection");
    const hardFailure = !mail.emailSent && mail.emailError !== "no_email" && mail.emailError !== "already_sent";
    if (hardFailure) {
      return Response.json(
        { ok: false, error: "email_failed", emailError: mail.emailError, reservation: existing },
        { status: 502 },
      );
    }
  }

  const removed = await deleteReservation(id);
  if (!removed) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  return Response.json({
    ok: true,
    reservation: removed,
    emailSent: mail?.emailSent,
    emailError: mail?.emailError,
  });
}
