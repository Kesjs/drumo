import { describe, expect, it } from "vitest";
import { validateNextPayment, suggestedSchedule, formatMoney, type CategoryFees } from "@/lib/domain/money";
import { computeAccess } from "@/lib/domain/access";

const B: CategoryFees = {
  fee_ron: 150_000, fee_eur: 30_000,
  min_first_installment_ron: 50_000, min_first_installment_eur: 10_000,
  max_installments: 3,
};

describe("instalment payments", () => {
  const fresh = { total: 150_000, paid: 0, paymentsMade: 0 };

  it("full mode requires the whole remaining amount", () => {
    expect(validateNextPayment(B, "RON", "full", fresh, 150_000)).toEqual({ ok: true, amount: 150_000 });
    expect(validateNextPayment(B, "RON", "full", fresh, 50_000)).toMatchObject({ ok: false, reason: "full_requires_remaining" });
  });

  it("first instalment must reach the category minimum", () => {
    expect(validateNextPayment(B, "RON", "installments", fresh, 49_999)).toMatchObject({ ok: false, reason: "below_min_first" });
    expect(validateNextPayment(B, "RON", "installments", fresh, 50_000)).toMatchObject({ ok: true });
  });

  it("uses the currency-specific minimum", () => {
    const eur = { total: 30_000, paid: 0, paymentsMade: 0 };
    expect(validateNextPayment(B, "EUR", "installments", eur, 9_999)).toMatchObject({ ok: false });
    expect(validateNextPayment(B, "EUR", "installments", eur, 10_000)).toMatchObject({ ok: true });
  });

  it("rejects a state that does not match the configured fee (tampering)", () => {
    expect(validateNextPayment(B, "RON", "installments", { ...fresh, total: 1 }, 1)).toMatchObject({ ok: false, reason: "fee_mismatch" });
  });

  it("cannot overpay or pay after settlement", () => {
    const mid = { total: 150_000, paid: 100_000, paymentsMade: 1 };
    expect(validateNextPayment(B, "RON", "installments", mid, 60_000)).toMatchObject({ ok: false, reason: "exceeds_remaining" });
    expect(validateNextPayment(B, "RON", "installments", { ...mid, paid: 150_000 }, 1)).toMatchObject({ ok: false, reason: "already_paid" });
  });

  it("last allowed instalment must settle the balance", () => {
    const two = { total: 150_000, paid: 100_000, paymentsMade: 2 };
    expect(validateNextPayment(B, "RON", "installments", two, 30_000)).toMatchObject({ ok: false, reason: "last_installment_must_settle" });
    expect(validateNextPayment(B, "RON", "installments", two, 50_000)).toMatchObject({ ok: true });
  });

  it("refuses dust balances under 10 %", () => {
    expect(validateNextPayment(B, "RON", "installments", fresh, 140_000)).toMatchObject({ ok: false, reason: "leaves_dust" });
  });

  it("rejects non-integer and negative amounts", () => {
    expect(validateNextPayment(B, "RON", "installments", fresh, 50_000.5)).toMatchObject({ ok: false, reason: "invalid_amount" });
    expect(validateNextPayment(B, "RON", "installments", fresh, -1)).toMatchObject({ ok: false });
  });

  it("suggested schedule sums to the fee and starts at the minimum", () => {
    const s = suggestedSchedule(B, "RON");
    expect(s).toHaveLength(3);
    expect(s[0]).toBe(50_000);
    expect(s.reduce((a, b) => a + b, 0)).toBe(150_000);
  });

  it("formats Romanian currency", () => {
    expect(formatMoney(150_000, "RON")).toMatch(/1\.500\s?RON/);
  });
});

describe("access locks", () => {
  const base = { totalDue: 150_000, totalPaid: 0, kyc: "approved" as const, readiness: 90, readinessThreshold: 80 };

  it("nothing unlocked before any payment", () => {
    const a = computeAccess(base);
    expect(a.coursesUnlocked).toBe(false);
    expect(a.examUnlocked).toBe(false);
    expect(a.blockers).toContain("payment_none");
  });

  it("first instalment unlocks courses but not the exam", () => {
    const a = computeAccess({ ...base, totalPaid: 50_000 });
    expect(a.coursesUnlocked).toBe(true);
    expect(a.examUnlocked).toBe(false);
    expect(a.blockers).toEqual(["payment_partial"]);
  });

  it("full payment without readiness keeps the exam locked", () => {
    const a = computeAccess({ ...base, totalPaid: 150_000, readiness: 79 });
    expect(a.examUnlocked).toBe(false);
    expect(a.blockers).toEqual(["readiness"]);
  });

  it("KYC must be approved", () => {
    expect(computeAccess({ ...base, totalPaid: 150_000, kyc: "manual_review" }).blockers).toEqual(["kyc"]);
  });

  it("exam unlocks only with full payment, KYC and readiness", () => {
    expect(computeAccess({ ...base, totalPaid: 150_000 }).examUnlocked).toBe(true);
  });

  it("no enrollment means nothing is unlocked even with a paid amount", () => {
    expect(computeAccess({ ...base, totalDue: null, totalPaid: 10 }).coursesUnlocked).toBe(false);
  });
});
