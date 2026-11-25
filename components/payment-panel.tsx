"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircleIcon,
  LockClosedIcon,
  ArrowRightIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { Button, FieldCheckbox, FieldLabel, FieldTextarea, NoticeBox, Panel, ProgressMeter, StatusTag } from "@/components/ui/primitives";
import type { SeedCategory } from "@/lib/data/seed-content";
import type { EnrollmentRecord, PaymentRecord, RefundRequestRecord } from "@/lib/data/store";
import { feeFor, formatMoney, suggestedSchedule, type Currency, type PaymentMode } from "@/lib/domain/money";
import { formatRoDateTime } from "@/lib/i18n";

export function PaymentPanel({
  category,
  initialCurrency,
  enrollment,
  payments,
  refundRequests,
  checkoutStatus,
  examUnlocked = false,
}: {
  category: SeedCategory;
  initialCurrency: Currency;
  enrollment: EnrollmentRecord | null;
  payments: PaymentRecord[];
  refundRequests: RefundRequestRecord[];
  checkoutStatus?: string;
  examUnlocked?: boolean;
}) {
  const router = useRouter();
  const lockedCurrency = enrollment && enrollment.total_paid > 0 ? enrollment.currency : null;
  const [currency, setCurrency] = useState<Currency>(lockedCurrency ?? initialCurrency);
  const [mode, setMode] = useState<PaymentMode>(enrollment?.mode ?? "installments");
  const [method, setMethod] = useState<"card" | "apple_google_pay" | "instant_transfer">("card");

  const fees = feeFor(category, currency);
  const totalDue = enrollment?.total_due ?? fees.total;
  const totalPaid = enrollment?.total_paid ?? 0;
  const remaining = Math.max(0, totalDue - totalPaid);
  const succeededPayments = [...payments]
    .filter((p) => p.status === "succeeded")
    .sort((a, b) => a.installment_no - b.installment_no);
  const paidCount = succeededPayments.length;
  const maxInst = Math.max(1, category.max_installments);
  const nextInstNo = paidCount + 1;
  const isLastAllowedInstallment = nextInstNo >= maxInst;
  const schedule = suggestedSchedule(category, currency);

  // Compute recommended next installment amount respecting remaining balance and last-installment rule
  const computeSuggestedNext = (targetMode: PaymentMode, targetCurrency: Currency) => {
    const f = feeFor(category, targetCurrency);
    const rem = totalPaid === 0 ? f.total : Math.max(0, (enrollment?.total_due ?? f.total) - totalPaid);
    if (rem <= 0) return 0;
    if (targetMode === "full" || isLastAllowedInstallment) return rem;
    if (paidCount === 0) return f.minFirst;
    const leftoverSlots = Math.max(1, maxInst - paidCount);
    const evenSplit = Math.floor(rem / leftoverSlots / 100) * 100;
    const minLeave = Math.ceil(f.total * 0.1);
    if (rem - evenSplit > 0 && rem - evenSplit < minLeave) return rem;
    return Math.max(minLeave, Math.min(rem, evenSplit));
  };

  const defaultNext = computeSuggestedNext(mode, currency);
  const [amountMajor, setAmountMajor] = useState(String((defaultNext / 100).toFixed(0)));
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justPaidMsg, setJustPaidMsg] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundMsg, setRefundMsg] = useState<string | null>(null);

  // Sync suggested amount whenever server props (totalPaid, paidCount, remaining) update after a payment
  useEffect(() => {
    const nextMinor = computeSuggestedNext(mode, currency);
    setAmountMajor(String((nextMinor / 100).toFixed(0)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPaid, paidCount, remaining, category.id]);

  function switchCurrency(c: Currency) {
    if (lockedCurrency) return;
    setCurrency(c);
    const nextMinor = computeSuggestedNext(mode, c);
    setAmountMajor(String((nextMinor / 100).toFixed(0)));
  }

  function switchMode(m: PaymentMode) {
    setMode(m);
    const nextMinor = computeSuggestedNext(m, currency);
    setAmountMajor(String((nextMinor / 100).toFixed(0)));
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptedPolicy) {
      setError("Confirmă că ai citit politica de rambursare și natura atestatului PermiStart înainte de plată.");
      return;
    }
    const parsedMajor = Number(amountMajor.replace(",", "."));
    const amountMinor = mode === "full" || isLastAllowedInstallment ? remaining : Math.round(parsedMajor * 100);
    setLoading(true);
    setError(null);
    setJustPaidMsg(null);

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, currency, amountMinor, method }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Plata nu a putut fi inițiată.");
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        const willSettle = totalPaid + amountMinor >= totalDue;
        setJustPaidMsg(
          willSettle
            ? "Taxa categoriei a fost achitată integral! Cursurile și sala de examen sunt acum deblocate din punct de vedere financiar."
            : `Tranșa #${nextInstNo} (${formatMoney(amountMinor, currency)}) a fost înregistrată! Cursurile și evaluările sunt acum deblocate.`,
        );
        router.refresh();
      }
    } catch {
      setError("Eroare de rețea.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefund(e: React.FormEvent) {
    e.preventDefault();
    setRefundMsg(null);
    const res = await fetch("/api/payments/refund-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: refundReason }),
    });
    const data = await res.json();
    if (res.ok) {
      setRefundMsg("Cererea de rambursare a fost înregistrată.");
      setRefundReason("");
      router.refresh();
    } else {
      setRefundMsg(data.error || "Eroare la trimitere.");
    }
  }

  const paidPct = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;

  // Build dynamic installment schedule breakdown (paid + remaining planned slots)
  const installmentRows = Array.from({ length: maxInst }, (_, idx) => {
    const slotNo = idx + 1;
    const paidRecord = succeededPayments[idx];
    if (paidRecord) {
      return {
        slotNo,
        status: "paid" as const,
        amount: paidRecord.amount,
        paidAt: paidRecord.paid_at ?? paidRecord.created_at,
        unlocks:
          slotNo === 1
            ? "Deblochează toate cursurile pe capitole și evaluările"
            : slotNo === maxInst
              ? "Achită soldul final pentru sala de examen"
              : "Reduce soldul rămas către examen",
      };
    }
    if (remaining === 0) {
      return null;
    }
    const unpaidSlotsCount = Math.max(1, maxInst - paidCount);
    const unpaidOrder = idx - paidCount;
    let plannedAmount = schedule[idx] ?? 0;
    if (paidCount > 0) {
      const even = Math.floor(remaining / unpaidSlotsCount / 100) * 100;
      plannedAmount =
        unpaidOrder === unpaidSlotsCount - 1
          ? remaining - even * (unpaidSlotsCount - 1)
          : even;
    }
    return {
      slotNo,
      status: slotNo === nextInstNo ? ("next" as const) : ("upcoming" as const),
      amount: plannedAmount,
      paidAt: null,
      unlocks:
        slotNo === 1
          ? "Deblochează imediat cursurile, audio și testele de capitol"
          : idx === maxInst - 1 || plannedAmount >= remaining
            ? "Achită soldul final și deblochează financiar sala de examen"
            : `Tranșa ${slotNo} din ${maxInst} (reduce soldul rămas)`,
    };
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      {checkoutStatus === "succes" || justPaidMsg ? (
        <NoticeBox tone="success" title="Plată confirmată">
          <p>{justPaidMsg ?? "Plata a fost înregistrată și chitanța a fost trimisă pe e-mail."}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {totalPaid > 0 ? (
              <Link
                href="/capitole"
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-asphalt bg-asphalt px-3.5 py-1.5 text-xs font-semibold text-chalk hover:bg-asphalt/90"
              >
                Mergi la cursuri și capitole
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            ) : null}
            {remaining === 0 ? (
              <Link
                href={examUnlocked ? "/examen/briefing" : "/evaluare-globala"}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-asphalt bg-signal px-3.5 py-1.5 text-xs font-semibold text-asphalt hover:bg-[#e0a900]"
              >
                {examUnlocked ? "Intră în sala de examen" : "Verifică pregătirea pentru examen"}
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
        </NoticeBox>
      ) : null}
      {checkoutStatus === "anulat" ? (
        <NoticeBox tone="warning">Plata a fost anulată înainte de finalizare. Poți relua oricând.</NoticeBox>
      ) : null}

      <Panel strong>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-sign">TAXĂ UNICĂ · CATEGORIA {category.code}</p>
            <h2 className="mt-1 font-cond text-2xl font-bold">
              Achitat {formatMoney(totalPaid, currency)} din {formatMoney(totalDue, currency)}
            </h2>
          </div>
          <StatusTag tone={remaining === 0 ? "ok" : totalPaid > 0 ? "signal" : "neutral"}>
            {remaining === 0
              ? "Achitat integral"
              : totalPaid > 0
                ? `Tranșa ${paidCount}/${maxInst} achitată · Cursuri deblocate`
                : "Neachitat"}
          </StatusTag>
        </div>
        <div className="mt-3">
          <ProgressMeter value={paidPct} tone={remaining === 0 ? "ok" : "sign"} label="Progres plată taxă" />
        </div>

        {/* Step-by-step access milestones: Step 1 Formation -> Step 2 Exam Composition */}
        <div className="mt-4 grid gap-3 border-t border-line pt-4 text-xs sm:grid-cols-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              {totalPaid > 0 ? (
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
              ) : (
                <LockClosedIcon className="mt-0.5 h-4 w-4 shrink-0 text-mute" />
              )}
              <div>
                <p className="font-semibold text-asphalt">Etapa 1 · Acces la formare (Cursuri &amp; QCM)</p>
                <p className="mt-0.5 text-mute">
                  {totalPaid > 0
                    ? "Deblocat — ai acces complet la toate capitolele, audio și evaluările adaptive."
                    : `Se deblochează imediat la plata primei tranșe (minim ${formatMoney(fees.minFirst, currency)}).`}
                </p>
              </div>
            </div>
            {totalPaid > 0 ? (
              <Link href="/capitole" className="shrink-0 font-semibold text-sign underline underline-offset-4">
                Deschide
              </Link>
            ) : null}
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              {remaining === 0 ? (
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
              ) : (
                <LockClosedIcon className="mt-0.5 h-4 w-4 shrink-0 text-sign" />
              )}
              <div>
                <p className="font-semibold text-asphalt">Etapa 2 · Acces la susținerea examenului</p>
                <p className="mt-0.5 text-mute">
                  {remaining === 0
                    ? "Taxa este achitată 100%. Poți susține examenul imediat ce KYC și pragul de pregătire sunt îndeplinite."
                    : `Se deblochează la achitarea soldului rămas de ${formatMoney(remaining, currency)}.`}
                </p>
              </div>
            </div>
            {remaining === 0 ? (
              <Link
                href={examUnlocked ? "/examen/briefing" : "/tablou-de-bord"}
                className="shrink-0 font-semibold text-sign underline underline-offset-4"
              >
                {examUnlocked ? "Examen" : "Stare"}
              </Link>
            ) : null}
          </div>
        </div>

        {/* Visual Installment Schedule Breakdown */}
        <div className="mt-4 border-t border-line pt-4">
          <p className="font-mono text-xs font-semibold text-asphalt">
            PLANIFICARE TRANȘE (MAXIM {maxInst} TRANȘE PENTRU CATEGORIA {category.code})
          </p>
          <div className="mt-2.5 divide-y divide-line border-y border-line text-xs">
            {installmentRows.map((row) =>
              row ? (
                <div key={row.slotNo} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-bold ${
                        row.status === "paid"
                          ? "bg-ok text-chalk"
                          : row.status === "next"
                            ? "bg-signal text-asphalt"
                            : "bg-chalk text-mute"
                      }`}
                    >
                      {row.slotNo}
                    </span>
                    <div>
                      <p className="font-semibold text-asphalt">
                        Tranșa #{row.slotNo} ·{" "}
                        <span className="font-mono tabular-nums">{formatMoney(row.amount, currency)}</span>
                      </p>
                      <p className="text-mute">{row.unlocks}</p>
                    </div>
                  </div>
                  <div className="font-mono text-xs">
                    {row.status === "paid" ? (
                      <span className="font-semibold text-ok">
                        Achitată ({formatRoDateTime(row.paidAt!)})
                      </span>
                    ) : row.status === "next" ? (
                      <span className="font-semibold text-sign">Următoarea tranșă la plată</span>
                    ) : (
                      <span className="text-mute">Ulterior</span>
                    )}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </div>
      </Panel>

      {remaining > 0 ? (
        <form onSubmit={handlePay} className="space-y-5 rounded-lg border-2 border-asphalt bg-surface p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-cond text-2xl font-bold">
              {paidCount === 0
                ? "Pasul 1: Achită integral sau prima tranșă"
                : `Continuă plata — Tranșa #${nextInstNo} din ${maxInst}`}
            </h2>
            <span className="font-mono text-xs text-mute">
              Sold rămas: {formatMoney(remaining, currency)}
            </span>
          </div>

          {error ? <NoticeBox tone="error">{error}</NoticeBox> : null}

          {!lockedCurrency ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">Monedă:</span>
              {(["RON", "EUR"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => switchCurrency(c)}
                  className={`min-h-[40px] rounded border px-4 text-sm font-semibold ${
                    currency === c ? "border-asphalt bg-asphalt text-white" : "border-line bg-chalk text-asphalt"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => switchMode("full")}
              className={`rounded-lg border-2 p-4 text-left ${
                mode === "full" ? "border-asphalt bg-signal/15" : "border-line bg-chalk"
              }`}
            >
              <p className="font-cond text-xl font-bold">
                {paidCount === 0 ? "Plată integrală (100%)" : "Achită tot soldul rămas acum"}
              </p>
              <p className="mt-1 font-mono text-sm font-semibold tabular-nums">{formatMoney(remaining, currency)}</p>
              <p className="mt-1 text-xs text-mute">
                {paidCount === 0
                  ? "Deblochează imediat cursurile și acoperă integral taxa pentru examen."
                  : "Închide taxa categoriei și deblochează financiar sala de examen."}
              </p>
            </button>

            <button
              type="button"
              onClick={() => switchMode("installments")}
              className={`rounded-lg border-2 p-4 text-left ${
                mode === "installments" ? "border-asphalt bg-signal/15" : "border-line bg-chalk"
              }`}
            >
              <p className="font-cond text-xl font-bold">
                {paidCount === 0
                  ? `Plată în tranșe (până la ${maxInst} tranșe)`
                  : isLastAllowedInstallment
                    ? `Ultima tranșă (#${nextInstNo}/${maxInst})`
                    : `Plătește tranșa #${nextInstNo} din ${maxInst}`}
              </p>
              <p className="mt-1 font-mono text-sm font-semibold tabular-nums">
                {paidCount === 0
                  ? `Minim prima tranșă: ${formatMoney(fees.minFirst, currency)}`
                  : isLastAllowedInstallment
                    ? `Sold final obligatoriu: ${formatMoney(remaining, currency)}`
                    : `Recomandat acum: ${formatMoney(computeSuggestedNext("installments", currency), currency)}`}
              </p>
              <p className="mt-1 text-xs text-mute">
                {paidCount === 0
                  ? "Deblochează cursurile imediat; examenul rămâne blocat până la plata integrală."
                  : isLastAllowedInstallment
                    ? "Ultima tranșă permisă stinge integral taxa și deblochează examenul."
                    : "Poți achita tranșa intermediară sau o sumă mai mare."}
              </p>
            </button>
          </div>

          {mode === "installments" ? (
            <div>
              <FieldLabel htmlFor="pay-amount">
                Sumă de plată pentru tranșa #{nextInstNo} ({currency})
              </FieldLabel>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <input
                  id="pay-amount"
                  type="number"
                  step="1"
                  readOnly={isLastAllowedInstallment}
                  min={paidCount === 0 ? fees.minFirst / 100 : isLastAllowedInstallment ? remaining / 100 : 1}
                  max={remaining / 100}
                  value={isLastAllowedInstallment ? String((remaining / 100).toFixed(0)) : amountMajor}
                  onChange={(e) => setAmountMajor(e.target.value)}
                  className="flex min-h-[44px] w-full max-w-xs rounded border-[1.5px] border-asphalt bg-surface px-3.5 py-2 font-mono text-base font-medium tabular-nums"
                />
                {!isLastAllowedInstallment && computeSuggestedNext("installments", currency) < remaining ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setAmountMajor(String((computeSuggestedNext("installments", currency) / 100).toFixed(0)))
                      }
                      className="min-h-[38px] rounded border border-line bg-chalk px-3 py-1.5 font-mono text-xs font-semibold text-asphalt hover:border-asphalt"
                    >
                      Tranșă sugerată ({formatMoney(computeSuggestedNext("installments", currency), currency)})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmountMajor(String((remaining / 100).toFixed(0)))}
                      className="min-h-[38px] rounded border border-line bg-chalk px-3 py-1.5 font-mono text-xs font-semibold text-asphalt hover:border-asphalt"
                    >
                      Tot restul ({formatMoney(remaining, currency)})
                    </button>
                  </>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-mute">
                {isLastAllowedInstallment
                  ? `Aceasta este ultima tranșă (#${nextInstNo} din ${maxInst}) și trebuie să acopere soldul rămas de ${formatMoney(remaining, currency)}.`
                  : `Tranșe permise pentru ${category.code}: ${maxInst}. Sold rămas: ${formatMoney(remaining, currency)}.`}
              </p>
            </div>
          ) : null}

          <div>
            <span className="block text-sm font-semibold">Metodă de plată</span>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {[
                { val: "card", lbl: "Card bancar (Visa / Mastercard)", Icon: CreditCardIcon },
                { val: "apple_google_pay", lbl: "Apple Pay / Google Pay", Icon: DevicePhoneMobileIcon },
                { val: "instant_transfer", lbl: "Transfer bancar instant / SEPA", Icon: BuildingLibraryIcon },
              ].map(({ val, lbl, Icon }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMethod(val as typeof method)}
                  className={`flex min-h-[44px] items-center gap-2 rounded border px-3 py-2 text-left text-xs font-semibold ${
                    method === val ? "border-asphalt bg-asphalt text-white" : "border-line bg-chalk text-asphalt"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${method === val ? "text-signal" : "text-sign"}`} aria-hidden="true" />
                  <span>{lbl}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-line pt-4 text-xs text-asphalt">
            <p className="font-semibold">Politica de rambursare și statut juridic (afișate înainte de plată):</p>
            <p>
              • Rambursare integrală în 14 zile calendaristice dacă nu ai început cursurile sau testele.{" "}
              <Link href="/rambursari" className="font-semibold text-sign underline">
                Citește politica completă
              </Link>
              .
            </p>
            <p>
              • Documentul eliberat la promovare este un <strong>atestat de reușită PermiStart</strong>, nu permis de
              conducere oficial.
            </p>
            <label className="mt-2 flex cursor-pointer items-start gap-2.5 pt-1 font-medium">
              <FieldCheckbox checked={acceptedPolicy} onCheckedChange={setAcceptedPolicy} />
              <span>Confirm că am luat cunoștință de politica de rambursare și primesc chitanță automată pe e-mail.</span>
            </label>
          </div>

          <Button type="submit" size="lg" disabled={loading}>
            {loading
              ? "Se procesează..."
              : `Plătește ${formatMoney(Math.round(Number(amountMajor || 0) * 100), currency)}`}
          </Button>
        </form>
      ) : null}

      <Panel>
        <h2 className="font-cond text-2xl font-bold">Istoric plăți și chitanțe</h2>
        {payments.length === 0 ? (
          <p className="mt-3 text-sm text-mute">Nu există încă plăți înregistrate pe acest cont.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line text-mute">
                <tr>
                  <th className="py-2 pr-4">Data</th>
                  <th className="py-2 pr-4">Tranșă</th>
                  <th className="py-2 pr-4">Metodă</th>
                  <th className="py-2 pr-4">Sumă</th>
                  <th className="py-2">Stare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 pr-4 font-mono">{formatRoDateTime(p.created_at)}</td>
                    <td className="py-2.5 pr-4 font-mono">#{p.installment_no}</td>
                    <td className="py-2.5 pr-4">{p.method}</td>
                    <td className="py-2.5 pr-4 font-mono font-semibold tabular-nums">
                      {formatMoney(p.amount, p.currency)}
                    </td>
                    <td className="py-2.5">
                      <StatusTag tone={p.status === "succeeded" ? "ok" : "neutral"}>{p.status}</StatusTag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {payments.length > 0 ? (
        <Panel>
          <h2 className="font-cond text-2xl font-bold">Solicitare rambursare</h2>
          <form onSubmit={handleRefund} className="mt-3 space-y-3">
            {refundMsg ? <NoticeBox tone="info">{refundMsg}</NoticeBox> : null}
            <FieldTextarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Descrie motivul solicitării..."
              required
              minLength={10}
            />
            <Button type="submit" variant="secondary">
              Trimite cerere de rambursare
            </Button>
          </form>
          {refundRequests.length > 0 ? (
            <ul className="mt-4 space-y-2 text-xs">
              {refundRequests.map((r) => (
                <li key={r.id} className="flex justify-between rounded border border-line bg-chalk px-3 py-2">
                  <span>{r.reason}</span>
                  <span className="font-mono font-semibold uppercase">{r.status}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      ) : null}
    </div>
  );
}
