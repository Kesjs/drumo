// Money and instalment rules. Amounts are integers in minor units (bani / cents).
export type Currency = "RON" | "EUR";
export type PaymentMode = "full" | "installments";

export interface CategoryFees {
  fee_ron: number;
  fee_eur: number;
  min_first_installment_ron: number;
  min_first_installment_eur: number;
  max_installments: number;
}

export function feeFor(cat: CategoryFees, currency: Currency) {
  return currency === "RON"
    ? { total: cat.fee_ron, minFirst: cat.min_first_installment_ron }
    : { total: cat.fee_eur, minFirst: cat.min_first_installment_eur };
}

export function formatMoney(minor: number, currency: Currency, locale = "ro-RO") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: minor % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}

export interface InstallmentState {
  total: number;
  paid: number;
  paymentsMade: number;
}

export type AmountCheck = { ok: true; amount: number } | { ok: false; reason: string };

/**
 * Validates the amount of the NEXT payment, server-side, before creating a
 * Stripe Checkout session. Never trust an amount coming from the client
 * without passing through this function.
 */
export function validateNextPayment(
  cat: CategoryFees,
  currency: Currency,
  mode: PaymentMode,
  state: InstallmentState,
  requested: number,
): AmountCheck {
  const { total, minFirst } = feeFor(cat, currency);
  if (state.total !== total) return { ok: false, reason: "fee_mismatch" };
  const remaining = total - state.paid;
  if (remaining <= 0) return { ok: false, reason: "already_paid" };
  if (!Number.isInteger(requested) || requested <= 0) return { ok: false, reason: "invalid_amount" };
  if (requested > remaining) return { ok: false, reason: "exceeds_remaining" };

  if (mode === "full") {
    return requested === remaining ? { ok: true, amount: requested } : { ok: false, reason: "full_requires_remaining" };
  }

  const isFirst = state.paymentsMade === 0;
  if (isFirst && requested < minFirst) return { ok: false, reason: "below_min_first" };

  // The last allowed instalment must settle the balance.
  const left = cat.max_installments - state.paymentsMade;
  if (left <= 1 && requested !== remaining) return { ok: false, reason: "last_installment_must_settle" };

  // Avoid dust: a payment cannot leave less than 10% of the fee outstanding.
  const after = remaining - requested;
  if (after > 0 && after < Math.ceil(total * 0.1)) return { ok: false, reason: "leaves_dust" };

  return { ok: true, amount: requested };
}

/** Suggested instalment schedule shown in the UI (the user may still pay more). */
export function suggestedSchedule(cat: CategoryFees, currency: Currency): number[] {
  const { total, minFirst } = feeFor(cat, currency);
  const n = Math.max(1, cat.max_installments);
  if (n === 1) return [total];
  const rest = total - minFirst;
  const each = Math.floor(rest / (n - 1) / 100) * 100;
  const parts = [minFirst, ...Array(n - 2).fill(each)];
  parts.push(total - parts.reduce((a, b) => a + b, 0));
  return parts;
}
