import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { recordSucceededPayment } from "@/lib/data/store";
import { sendPaymentReceiptEmail } from "@/lib/email";
import type { Currency, PaymentMode } from "@/lib/domain/money";

export async function POST(req: Request) {
  const stripe = getStripeClient();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !whSecret) {
    return NextResponse.json({ error: "Stripe webhook neconfigurat." }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Lipsă semnătură Stripe." }, { status: 400 });

  const payload = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, whSecret);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Semnătură invalidă." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const m = session.metadata ?? {};
    if (session.payment_status === "paid" && m.user_id && m.category_id) {
      const recorded = await recordSucceededPayment({
        userId: m.user_id,
        categoryId: m.category_id,
        mode: (m.mode as PaymentMode) || "full",
        currency: (m.currency as Currency) || "RON",
        amountMinor: Number(m.amount_minor || session.amount_total || 0),
        installmentNo: Number(m.installment_no || 1),
        method: session.payment_method_types?.[0] ?? "card",
        stripeSessionId: session.id,
        stripeEventId: event.id,
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
    }
  }

  return NextResponse.json({ received: true });
}
