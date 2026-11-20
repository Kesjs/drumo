import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { NoticeBox, Panel, ProgressMeter, StatusTag } from "@/components/ui/primitives";
import { requireCandidateSnapshot } from "@/lib/data/require-user";
import { listChapters } from "@/lib/data/store";
import { formatMoney } from "@/lib/domain/money";
import { accuracy } from "@/lib/domain/adaptive";

export const metadata = { title: "Tablou de bord" };
export const dynamic = "force-dynamic";

const KYC_LABELS: Record<string, { text: string; tone: "neutral" | "signal" | "ok" | "danger" }> = {
  not_started: { text: "Netrimis", tone: "neutral" },
  pending: { text: "În curs de verificare", tone: "signal" },
  manual_review: { text: "Revizuire manuală", tone: "signal" },
  approved: { text: "Aprobat", tone: "ok" },
  rejected: { text: "Respins — reîncarcă", tone: "danger" },
};

export default async function DashboardPage() {
  const snap = await requireCandidateSnapshot("/tablou-de-bord");
  const chapters = await listChapters(snap.category.code);
  const kycStatus = snap.kyc?.status ?? "not_started";
  const kycBadge = KYC_LABELS[kycStatus] ?? KYC_LABELS.not_started;

  const totalDue = snap.enrollment?.total_due ?? (snap.user.currency === "RON" ? snap.category.fee_ron : snap.category.fee_eur);
  const totalPaid = snap.enrollment?.total_paid ?? 0;
  const currency = snap.enrollment?.currency ?? snap.user.currency;
  const paidPct = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;

  return (
    <AppShell
      userName={`${snap.user.first_name} ${snap.user.last_name}`}
      categoryCode={snap.category.code}
      role={snap.user.role}
      coursesUnlocked={snap.access.coursesUnlocked}
      examUnlocked={snap.access.examUnlocked}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h1 className="font-cond text-3xl font-bold md:text-4xl">
              Bun venit, {snap.user.first_name}
            </h1>
            <p className="mt-1 text-sm text-mute">{snap.category.name_ro}</p>
          </div>
          <Link
            href={snap.access.examUnlocked ? "/examen/briefing" : "/plata"}
            className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-5 py-2 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
          >
            {snap.access.examUnlocked
              ? "Mergi la examen"
              : !snap.access.coursesUnlocked
                ? "Achită prima tranșă"
                : !snap.access.feeFullyPaid
                  ? "Achită restul taxei"
                  : "Continuă pregătirea"}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Panel>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-mute">1. Verificare identitate</h2>
              <StatusTag tone={kycBadge.tone}>{kycBadge.text}</StatusTag>
            </div>
            <p className="mt-3 text-xs text-mute">
              Act de identitate + selfie necesare înainte de examen.
            </p>
            <Link
              href="/verificare-identitate"
              className="mt-4 inline-block text-sm font-semibold text-sign underline underline-offset-4"
            >
              {kycStatus === "approved" ? "Vezi confirmarea" : "Trimite / verifică documentele"}
            </Link>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-mute">2. Taxa categoriei {snap.category.code}</h2>
              <StatusTag tone={snap.access.feeFullyPaid ? "ok" : snap.access.coursesUnlocked ? "signal" : "neutral"}>
                {snap.access.feeFullyPaid
                  ? "Plătită integral"
                  : snap.access.coursesUnlocked
                    ? `Tranșa ${snap.payments.filter((p) => p.status === "succeeded").length}/${snap.category.max_installments} · Cursuri`
                    : "Neplătită"}
              </StatusTag>
            </div>
            <p className="mt-2 font-mono text-lg font-bold tabular-nums">
              {formatMoney(totalPaid, currency)} / {formatMoney(totalDue, currency)}
            </p>
            <div className="mt-2">
              <ProgressMeter value={paidPct} tone={snap.access.feeFullyPaid ? "ok" : "sign"} label="Progres plată" />
            </div>
            <p className="mt-2 text-xs text-mute">
              {snap.access.feeFullyPaid
                ? "Cursuri și examen deblocate financiar."
                : snap.access.coursesUnlocked
                  ? `Cursuri deblocate · Rest examen: ${formatMoney(Math.max(0, totalDue - totalPaid), currency)}`
                  : "Prima tranșă deblochează toate cursurile."}
            </p>
            <Link href="/plata" className="mt-3 inline-block text-sm font-semibold text-sign underline underline-offset-4">
              {snap.access.feeFullyPaid
                ? "Vezi chitanțele"
                : snap.access.coursesUnlocked
                  ? "Achită următoarea tranșă"
                  : "Achită prima tranșă"}
            </Link>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-mute">3. Scor de pregătire</h2>
              <StatusTag
                tone={
                  snap.readinessScore !== null && snap.readinessScore >= snap.category.readiness_threshold
                    ? "ok"
                    : "neutral"
                }
              >
                Prag: {snap.category.readiness_threshold}%
              </StatusTag>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold tabular-nums">
              {snap.readinessScore === null ? "—" : `${snap.readinessScore}%`}
            </p>
            <p className="mt-1 text-xs text-mute">
              Calculat din evaluarea globală pe toate capitolele.
            </p>
            <Link
              href={snap.access.coursesUnlocked ? "/evaluare-globala" : "/plata"}
              className="mt-3 inline-block text-sm font-semibold text-sign underline underline-offset-4"
            >
              {snap.access.coursesUnlocked ? "Pornește evaluarea globală" : "Deblochează întâi cursurile"}
            </Link>
          </Panel>
        </div>

        {!snap.access.examUnlocked ? (
          <NoticeBox tone="warning" title="Condiții rămase pentru deblocarea examenului teoretic">
            <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
              {snap.access.blockers.includes("kyc") ? (
                <li>Verificarea identității (KYC) trebuie să fie aprobată.</li>
              ) : null}
              {snap.access.blockers.includes("payment_none") ? (
                <li>Nu ai efectuat încă nicio plată. Prima tranșă deblochează cursurile.</li>
              ) : null}
              {snap.access.blockers.includes("payment_partial") ? (
                <li>Cursurile sunt deblocate, dar examenul se activează după achitarea integrală a taxei.</li>
              ) : null}
              {snap.access.blockers.includes("readiness") ? (
                <li>
                  Susține evaluarea globală și atinge pragul de pregătire de {snap.category.readiness_threshold}%.
                </li>
              ) : null}
            </ul>
          </NoticeBox>
        ) : (
          <NoticeBox tone="success" title="Ești eligibil pentru examen">
            Toate condițiile sunt îndeplinite. Poți intra în sala de examen oricând dorești din pagina de briefing.
          </NoticeBox>
        )}

        <Panel>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-cond text-2xl font-bold">Progres pe capitole</h2>
            <Link href="/capitole" className="text-sm font-semibold text-sign underline underline-offset-4">
              Toate capitolele →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {chapters.map((ch, idx) => {
              const m = snap.mastery.find((x) => x.chapterId === ch.id);
              const pct = m ? Math.round(accuracy(m) * 100) : 0;
              return (
                <div key={ch.id} className="rounded border border-line bg-chalk p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <Link
                      href={snap.access.coursesUnlocked ? `/capitole/${ch.slug}` : "/plata"}
                      className="font-semibold text-asphalt hover:text-sign"
                    >
                      Capitolul {idx + 1} · {ch.title_ro}
                    </Link>
                    <span className="font-mono text-xs tabular-nums text-mute">
                      {m ? `Stăpânire estimată: ${pct}%` : "Neînceput"}
                    </span>
                  </div>
                  <div className="mt-2">
                    <ProgressMeter value={pct} tone={pct >= 75 ? "ok" : "signal"} label={ch.title_ro} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
