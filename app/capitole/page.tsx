import Link from "next/link";
import { Lock } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { RealPhoto } from "@/components/real-photo";
import { NoticeBox, Panel, ProgressMeter, StatusTag } from "@/components/ui/primitives";
import { requireCandidateSnapshot } from "@/lib/data/require-user";
import { listChapters } from "@/lib/data/store";
import { accuracy } from "@/lib/domain/adaptive";

export const metadata = { title: "Capitole" };
export const dynamic = "force-dynamic";

export default async function ChaptersIndexPage() {
  const snap = await requireCandidateSnapshot("/capitole");
  const chapters = await listChapters(snap.category.code);

  return (
    <AppShell
      userName={`${snap.user.first_name} ${snap.user.last_name}`}
      categoryCode={snap.category.code}
      role={snap.user.role}
      coursesUnlocked={snap.access.coursesUnlocked}
      examUnlocked={snap.access.examUnlocked}
    >
      <div className="space-y-6">
        <div>
          <h1 className="font-cond text-3xl font-bold md:text-4xl">Cursuri pe capitole ({snap.category.code})</h1>
          <p className="mt-1 text-sm text-mute">
            Fiecare capitol conține rezumat, lecție detaliată cu imagini reale și audio („Ascultă lecția”), apoi testul
            capitolului.
          </p>
        </div>

        {!snap.access.coursesUnlocked ? (
          <NoticeBox tone="warning" title="Cursurile sunt blocate">
            <p>
              Efectuează prima plată (integral sau prima tranșă) pentru a debloca toate capitolele și evaluările.
            </p>
            <Link
              href="/plata"
              className="mt-3 inline-flex min-h-[40px] items-center rounded border-2 border-asphalt bg-signal px-4 py-1.5 text-xs font-semibold text-asphalt"
            >
              Mergi la plată
            </Link>
          </NoticeBox>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          {chapters.map((ch, idx) => {
            const prog = snap.progress.find((p) => p.chapter_id === ch.id);
            const m = snap.mastery.find((x) => x.chapterId === ch.id);
            const pct = m ? Math.round(accuracy(m) * 100) : 0;

            return (
              <Panel key={ch.id} className="overflow-hidden p-0">
                <RealPhoto slug={ch.cover_media_slug} className="aspect-[16/9] rounded-none border-0 border-b border-line" />
                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-sign">Capitolul {idx + 1} · ~{ch.minutes} min</span>
                    {prog?.lesson_completed_at ? (
                      <StatusTag tone="ok">Lecție parcursă</StatusTag>
                    ) : !snap.access.coursesUnlocked ? (
                      <StatusTag tone="neutral">
                        <Lock className="h-3 w-3" /> Blocat
                      </StatusTag>
                    ) : null}
                  </div>
                  <h2 className="font-cond text-2xl font-bold">{ch.title_ro}</h2>
                  <p className="text-sm text-mute">{ch.summary_ro}</p>
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-mute">
                      <span>Stăpânire capitol</span>
                      <span className="font-mono tabular-nums">{pct}%</span>
                    </div>
                    <ProgressMeter value={pct} tone={pct >= 75 ? "ok" : "signal"} />
                  </div>
                  {snap.access.coursesUnlocked ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link
                        href={`/capitole/${ch.slug}`}
                        className="inline-flex min-h-[40px] items-center rounded border border-asphalt bg-chalk px-3.5 text-xs font-semibold text-asphalt hover:bg-white"
                      >
                        Rezumat
                      </Link>
                      <Link
                        href={`/capitole/${ch.slug}/lectie`}
                        className="inline-flex min-h-[40px] items-center rounded border-2 border-asphalt bg-signal px-3.5 text-xs font-semibold text-asphalt hover:bg-[#e0a900]"
                      >
                        Deschide lecția
                      </Link>
                      <Link
                        href={`/capitole/${ch.slug}/test`}
                        className="inline-flex min-h-[40px] items-center rounded border border-asphalt bg-asphalt px-3.5 text-xs font-semibold text-white hover:bg-[#263140]"
                      >
                        Test capitol
                      </Link>
                    </div>
                  ) : null}
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
