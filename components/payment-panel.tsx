"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
}: {
  category: SeedCategory;
  initialCurrency: Currency;
  enrollment: EnrollmentRecord | null;
  payments: PaymentRecord[];
  refundRequests: RefundRequestRecord[];
  checkoutStatus?: string;
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
  const paidCount = payments.filter((p) => p.status === "succeeded").length;
  const schedule = suggestedSchedule(category, currency);
  const defaultNext =
    mode === "full"
      ? remaining
      : paidCount === 0
        ? fees.minFirst
        : Math.min(remaining, schedule[paidCount] ?? remaining);

  const [amountMajor, setAmountMajor] = useState(String((defaultNext / 100).toFixed(0)));
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundMsg, setRefundMsg] = useState<string | null>(null);

  function switchCurrency(c: Currency) {
    if (lockedCurrency) return;
    setCurrency(c);
    const f = feeFor(category, c);
    setAmountMajor(String(((mode === "full" ? f.total : f.minFirst) / 100).toFixed(0)));
  }

  function switchMode(m: PaymentMode) {
    setMode(m);
    const f = feeFor(category, currency);
    const rem = totalPaid === 0 ? f.total : remaining;
    const nextVal = m === "full" ? rem : paidCount === 0 ? f.minFirst : Math.min(rem, schedule[paidCount] ?? rem);
    setAmountMajor(String((nextVal / 100).toFixed(0)));
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptedPolicy) {
      setError("Confirmă că ai citit politica de rambursare și natura atestatului Drumo înainte de plată.");
      return;
    }
    const parsedMajor = Number(amountMajor.replace(",", "."));
    const amountMinor = Math.round(parsedMajor * 100);
    setLoading(true);
    setError(null);

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

  return (
    <div className="space-y-6">
      {checkoutStatus === "succes" ? (
        <NoticeBox tone="success" title="Plată confirmată">
          Plata a fost înregistrată și chitanța a fost trimisă pe e-mail.
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
            {remaining === 0 ? "Achitat integral" : totalPaid > 0 ? "Cursuri deblocate" : "Neachitat"}
          </StatusTag>
        </div>
        <div className="mt-3">
          <ProgressMeter value={paidPct} tone={remaining === 0 ? "ok" : "sign"} label="Progres plată taxă" />
        </div>
        <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
          <div className="rounded border border-line bg-chalk p-3">
            <strong>Cursuri și evaluări:</strong> {totalPaid > 0 ? "Deblocate" : "Se deblochează la prima plată"}
          </div>
          <div className="rounded border border-line bg-chalk p-3">
            <strong>Examen teoretic:</strong>{" "}
            {remaining === 0 ? "Taxa este achitată integral" : `Mai sunt de achitat ${formatMoney(remaining, currency)}`}
          </div>
        </div>
      </Panel>

      {remaining > 0 ? (
        <form onSubmit={handlePay} className="space-y-5 rounded-lg border-2 border-asphalt bg-surface p-6">
          <h2 className="font-cond text-2xl font-bold">Efectuează o plată</h2>

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
              <p className="font-cond text-xl font-bold">Plată integrală</p>
              <p className="mt-1 font-mono text-sm font-semibold tabular-nums">{formatMoney(remaining, currency)}</p>
              <p className="mt-1 text-xs text-mute">Deblochează cursurile și acoperă integral taxa de examen.</p>
            </button>

            <button
              type="button"
              onClick={() => switchMode("installments")}
              className={`rounded-lg border-2 p-4 text-left ${
                mode === "installments" ? "border-asphalt bg-signal/15" : "border-line bg-chalk"
              }`}
            >
              <p className="font-cond text-xl font-bold">Plată în tranșe</p>
              <p className="mt-1 font-mono text-sm font-semibold tabular-nums">
                Minim prima tranșă: {formatMoney(fees.minFirst, currency)}
              </p>
              <p className="mt-1 text-xs text-mute">
                Deblochează cursurile imediat; examenul rămâne blocat până la plata integrală.
              </p>
            </button>
          </div>

          {mode === "installments" ? (
            <div>
              <FieldLabel htmlFor="pay-amount">Sumă de plată acum ({currency})</FieldLabel>
              <input
                id="pay-amount"
                type="number"
                step="1"
                min={paidCount === 0 ? fees.minFirst / 100 : 1}
                max={remaining / 100}
                value={amountMajor}
                onChange={(e) => setAmountMajor(e.target.value)}
                className="mt-1.5 flex min-h-[44px] w-full max-w-xs rounded border-[1.5px] border-asphalt bg-surface px-3.5 py-2 font-mono text-base font-medium tabular-nums"
              />
              <p className="mt-1 text-xs text-mute">
                Tranșe maxime pentru {category.code}: {category.max_installments}. Rest actual:{" "}
                {formatMoney(remaining, currency)}.
              </p>
            </div>
          ) : null}

          <div>
            <span className="block text-sm font-semibold">Metodă de plată</span>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {[
                ["card", "Card bancar (Visa / Mastercard)"],
                ["apple_google_pay", "Apple Pay / Google Pay"],
                ["instant_transfer", "Transfer bancar instant / SEPA"],
              ].map(([val, lbl]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMethod(val as typeof method)}
                  className={`min-h-[44px] rounded border px-3 py-2 text-left text-xs font-semibold ${
                    method === val ? "border-asphalt bg-asphalt text-white" : "border-line bg-chalk text-asphalt"
                  }`}
                >
                  {lbl}
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
              • Documentul eliberat la promovare este un <strong>atestat de reușită Drumo</strong>, nu permis de
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
