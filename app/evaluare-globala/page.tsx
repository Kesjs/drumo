import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PracticeRunner } from "@/components/practice-runner";
import { NoticeBox, Panel } from "@/components/ui/primitives";
import { requireCandidateSnapshot } from "@/lib/data/require-user";

export const metadata = { title: "Evaluare globală" };
export const dynamic = "force-dynamic";

export default async function GlobalEvaluationPage() {
  const snap = await requireCandidateSnapshot("/evaluare-globala");

  return (
    <AppShell
      userName={`${snap.user.first_name} ${snap.user.last_name}`}
      categoryCode={snap.category.code}
      role={snap.user.role}
      coursesUnlocked={snap.access.coursesUnlocked}
      examUnlocked={snap.access.examUnlocked}
    >
      <div className="max-w-3xl space-y-6">
        {!snap.access.coursesUnlocked ? (
          <NoticeBox tone="warning" title="Acces blocat până la prima plată">
            <p>Achită prima tranșă pentru a susține evaluarea globală.</p>
            <Link
              href="/plata"
              className="mt-3 inline-flex min-h-[40px] items-center rounded border-2 border-asphalt bg-signal px-4 text-xs font-semibold text-asphalt"
            >
              Mergi la plată
            </Link>
          </NoticeBox>
        ) : (
          <>
            <Panel>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  Scor curent de pregătire:{" "}
                  <strong className="font-mono text-lg">
                    {snap.readinessScore === null ? "Neefectuat" : `${snap.readinessScore}%`}
                  </strong>
                </span>
                <span className="font-mono text-xs text-mute">
                  Prag necesar pentru examen: {snap.category.readiness_threshold}%
                </span>
              </div>
            </Panel>

            <PracticeRunner
              kind="global"
              title="Evaluare globală pe toate capitolele"
              subtitle="Calculează scorul de pregătire necesar pentru deblocarea examenului teoretic."
              readinessThreshold={snap.category.readiness_threshold}
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
