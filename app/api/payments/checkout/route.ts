import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, preparePayment, recordSucceededPayment } from "@/lib/data/store";
import { createStripeCheckoutSession } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/config";
import { sendPaymentReceiptEmail } from "@/lib/email";

const Schema = z.object({
  mode: z.enum(["full", "installments"]),
  currency: z.enum(["RON", "EUR"]),
  amountMinor: z.number().int().positive(),
  method: z.enum(["card", "apple_google_pay", "instant_transfer"]).default("card"),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Autentificare necesară." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Date de plată invalide." }, { status: 400 });
  }

  const prep = await preparePayment({
    userId: user.id,
    mode: parsed.data.mode,
    currency: parsed.data.currency,
    requestedAmountMinor: parsed.data.amountMinor,
  });
  if (!prep.ok) {
    return NextResponse.json({ ok: false, error: prep.error }, { status: 400 });
  }

  if (isStripeConfigured()) {
    const session = await createStripeCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      categoryId: prep.snapshot.category.id,
      categoryCode: prep.snapshot.category.code,
      currency: prep.currency,
      mode: parsed.data.mode,
      amountMinor: prep.amountMinor,
      installmentNo: prep.installmentNo,
    });
    if (session?.url) {
      return NextResponse.json({ ok: true, checkoutUrl: session.url });
    }
  }

  // Local test checkout simulation when Stripe keys are not yet configured
  const recorded = await recordSucceededPayment({
    userId: user.id,
    categoryId: prep.snapshot.category.id,
    mode: parsed.data.mode,
    currency: prep.currency,
    amountMinor: prep.amountMinor,
    installmentNo: prep.installmentNo,
    method: parsed.data.method,
  });

  if (!recorded.duplicate && recorded.user?.email) {
    await sendPaymentReceiptEmail({
      to: recorded.user.email,
      holderName: `${recorded.user.first_name} ${recorded.user.last_name}`,
      categoryCode: recorded.category.code,
      amountMinor: recorded.payment.amount,
      currency: recorded.payment.currency,
      totalPaidMinor: recorded.enrollment.total_paid,
      totalDueMinor: recorded.enrollment.total_due,
      coursesUnlocked: recorded.enrollment.courses_unlocked,
      feeFullyPaid: recorded.enrollment.fee_fully_paid,
      installmentNo: recorded.payment.installment_no,
    });
  }

  return NextResponse.json({ ok: true, simulated: true });
}
