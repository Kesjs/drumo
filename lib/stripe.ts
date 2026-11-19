import Stripe from "stripe";
import { isStripeConfigured, SITE_URL } from "@/lib/config";
import type { Currency, PaymentMode } from "@/lib/domain/money";

export function getStripeClient(): Stripe | null {
  if (!isStripeConfigured()) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover" as Stripe.LatestApiVersion,
  });
}

export async function createStripeCheckoutSession(params: {
  userId: string;
  userEmail: string | null;
  categoryId: string;
  categoryCode: string;
  currency: Currency;
  mode: PaymentMode;
  amountMinor: number;
  installmentNo: number;
}) {
  const stripe = getStripeClient();
  if (!stripe) return null;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.userEmail ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: params.currency.toLowerCase(),
          unit_amount: params.amountMinor,
          product_data: {
            name: `Drumo — Taxă categoria ${params.categoryCode}`,
            description:
              params.mode === "full"
                ? "Plată integrală (cursuri + examen teoretic)"
                : `Plată în tranșe — tranșa ${params.installmentNo}`,
          },
        },
      },
    ],
    metadata: {
      user_id: params.userId,
      category_id: params.categoryId,
      category_code: params.categoryCode,
      mode: params.mode,
      installment_no: String(params.installmentNo),
      currency: params.currency,
      amount_minor: String(params.amountMinor),
    },
    success_url: `${SITE_URL}/plata?status=succes&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/plata?status=anulat`,
  });

  return session;
}
