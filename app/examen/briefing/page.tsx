import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ExamBriefingClient } from "@/components/exam-briefing-client";
import { NoticeBox, Panel, StatusTag } from "@/components/ui/primitives";
import { requireCandidateSnapshot } from "@/lib/data/require-user";

export const metadata = { title: "Briefing examen" };
export const dynamic = "force-dynamic";

export default async function ExamBriefingPage() {
  const snap = await requireCandidateSnapshot("/examen/briefing");

  const kycOk = snap.kyc?.status === "approved";
  const paidOk = snap.access.feeFullyPaid;
  const readyOk = (snap.readinessScore ?? 0) >= snap.category.readiness_threshold;

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
          <h1 className="font-cond text-3xl font-bold md:text-4xl">
            Briefing examen · Categoria {snap.category.code}
          </h1>
          <p className="mt-1 text-sm text-mute">
            Tu alegi când susții testul teoretic, după verificarea condițiilor de acces.
          </p>
        </div>

        <Panel>
          <h2 className="font-cond text-xl font-bold">Verificare eligibilitate</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded border border-line bg-chalk p-3">
              <div className="flex items-center justify-between gap-2">
                <span>Identitate (KYC)</span>
                <StatusTag tone={kycOk ? "ok" : "danger"}>{kycOk ? "OK" : "Lipsă"}</StatusTag>
              </div>
              {!kycOk ? (
                <Link href="/verificare-identitate" className="mt-2 inline-block text-xs font-semibold text-sign underline">
                  Finalizează KYC
                </Link>
              ) : null}
            </div>

            <div className="rounded border border-line bg-chalk p-3">
              <div className="flex items-center justify-between gap-2">
                <span>Taxă integrală</span>
                <StatusTag tone={paidOk ? "ok" : "danger"}>{paidOk ? "OK" : "Rest de plată"}</StatusTag>
              </div>
              {!paidOk ? (
                <Link href="/plata" className="mt-2 inline-block text-xs font-semibold text-sign underline">
                  Achită diferența
                </Link>
              ) : null}
            </div>

            <div className="rounded border border-line bg-chalk p-3">
              <div className="flex items-center justify-between gap-2">
                <span>Pregătire ≥ {snap.category.readiness_threshold}%</span>
                <StatusTag tone={readyOk ? "ok" : "danger"}>
                  {snap.readinessScore !== null ? `${snap.readinessScore}%` : "0%"}
                </StatusTag>
              </div>
              {!readyOk ? (
                <Link href="/evaluare-globala" className="mt-2 inline-block text-xs font-semibold text-sign underline">
                  Susține evaluarea globală
                </Link>
              ) : null}
            </div>
          </div>
        </Panel>

        {!snap.access.examUnlocked ? (
          <NoticeBox tone="warning">
            Examenul este blocat pe server până când toate cele trei condiții de mai sus sunt îndeplinite.
          </NoticeBox>
        ) : null}

        <ExamBriefingClient
          eligible={snap.access.examUnlocked}
          questionCount={snap.category.exam_question_count}
          passMark={snap.category.exam_pass_mark}
          secondsPerQuestion={snap.category.seconds_per_question}
        />
      </div>
    </AppShell>
  );
}
