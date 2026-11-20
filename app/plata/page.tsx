import { AppShell } from "@/components/app-shell";
import { PaymentPanel } from "@/components/payment-panel";
import { requireCandidateSnapshot } from "@/lib/data/require-user";
import { getStripeClient } from "@/lib/stripe";
import { recordSucceededPayment } from "@/lib/data/store";
import { sendPaymentReceiptEmail } from "@/lib/email";
import type { Currency, PaymentMode } from "@/lib/domain/money";

export const metadata = { title: "Plată" };
export const dynamic = "force-dynamic";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; session_id?: string }>;
}) {
  const { status, session_id } = await searchParams;
  let snap = await requireCandidateSnapshot("/plata");

  // Reconcile Stripe Checkout return immediately if webhook hasn't arrived yet
  if (status === "succes" && session_id) {
    const stripe = getStripeClient();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const m = session.metadata ?? {};
        if (session.payment_status === "paid" && m.user_id === snap.user.id && m.category_id) {
          const recorded = await recordSucceededPayment({
            userId: m.user_id,
            categoryId: m.category_id,
            mode: (m.mode as PaymentMode) || "installments",
            currency: (m.currency as Currency) || snap.user.currency,
            amountMinor: Number(m.amount_minor || session.amount_total || 0),
            installmentNo: Number(m.installment_no || 1),
            method: session.payment_method_types?.[0] ?? "card",
            stripeSessionId: session.id,
            stripeEventId: `checkout_return_${session.id}`,
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
          snap = await requireCandidateSnapshot("/plata");
        }
      } catch {
        // Ignore reconciliation error and render current snapshot
      }
    }
  }

  return (
    <AppShell
      userName={`${snap.user.first_name} ${snap.user.last_name}`}
      categoryCode={snap.category.code}
      role={snap.user.role}
      coursesUnlocked={snap.access.coursesUnlocked}
      examUnlocked={snap.access.examUnlocked}
    >
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-cond text-3xl font-bold md:text-4xl">Plată taxă categorie</h1>
          <p className="mt-1 text-sm text-mute">
            Fără abonament. Prima tranșă deblochează cursurile; plata integrală deblochează examenul.
          </p>
        </div>
        <PaymentPanel
          category={snap.category}
          initialCurrency={snap.user.currency}
          enrollment={snap.enrollment}
          payments={snap.payments}
          refundRequests={snap.refundRequests}
          checkoutStatus={status}
          examUnlocked={snap.access.examUnlocked}
        />
      </div>
    </AppShell>
  );
}
