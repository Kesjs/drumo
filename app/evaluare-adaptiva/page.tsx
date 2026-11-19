import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PracticeRunner } from "@/components/practice-runner";
import { NoticeBox, Panel, ProgressMeter } from "@/components/ui/primitives";
import { requireCandidateSnapshot } from "@/lib/data/require-user";
import { listChapters } from "@/lib/data/store";
import { accuracy } from "@/lib/domain/adaptive";

export const metadata = { title: "Evaluare adaptivă" };
export const dynamic = "force-dynamic";

export default async function AdaptiveEvaluationPage() {
  const [snap, chapters] = await Promise.all([requireCandidateSnapshot("/evaluare-adaptiva"), listChapters()]);

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
            <p>Achită prima tranșă pentru a debloca evaluarea adaptivă.</p>
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
              <h2 className="font-cond text-xl font-bold">Nivel actual pe capitole (repetiție spațiată)</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {chapters.map((ch) => {
                  const m = snap.mastery.find((x) => x.chapterId === ch.id);
                  const pct = m ? Math.round(accuracy(m) * 100) : 0;
                  return (
                    <div key={ch.id} className="text-xs">
                      <div className="mb-1 flex justify-between">
                        <span className="truncate pr-2">{ch.title_ro}</span>
                        <span className="font-mono tabular-nums">{pct}%</span>
                      </div>
                      <ProgressMeter value={pct} tone={pct < 60 ? "signal" : "ok"} />
                    </div>
                  );
                })}
              </div>
            </Panel>

            <PracticeRunner
              kind="adaptive"
              title="Evaluare adaptivă în timp real"
              subtitle="Motorul alege automat capitolele slabe și dificultatea potrivită nivelului tău."
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
