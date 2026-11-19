import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { LessonAudioPlayer } from "@/components/lesson-audio";
import { RealPhoto } from "@/components/real-photo";
import { Panel } from "@/components/ui/primitives";
import { requireCandidateSnapshot } from "@/lib/data/require-user";
import { getChapterBySlug, markChapterProgress } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ capitol: string }> }) {
  const { capitol } = await params;
  const ch = await getChapterBySlug(capitol);
  return { title: ch ? ch.title_ro : "Capitol" };
}

export default async function ChapterSummaryPage({ params }: { params: Promise<{ capitol: string }> }) {
  const { capitol } = await params;
  const [snap, chapter] = await Promise.all([
    requireCandidateSnapshot(`/capitole/${capitol}`),
    getChapterBySlug(capitol),
  ]);
  if (!chapter) notFound();
  if (!snap.access.coursesUnlocked) redirect("/plata");

  await markChapterProgress(snap.user.id, chapter.slug, "summary");

  return (
    <AppShell
      userName={`${snap.user.first_name} ${snap.user.last_name}`}
      categoryCode={snap.category.code}
      role={snap.user.role}
      coursesUnlocked={snap.access.coursesUnlocked}
      examUnlocked={snap.access.examUnlocked}
    >
      <div className="max-w-3xl space-y-6">
        <Link href="/capitole" className="text-sm font-semibold text-sign underline underline-offset-4">
          ← Toate capitolele
        </Link>

        <div>
          <span className="font-mono text-xs text-sign">REZUMAT CAPITOL · ~{chapter.minutes} MIN</span>
          <h1 className="mt-1 font-cond text-3xl font-bold md:text-4xl">{chapter.title_ro}</h1>
          <p className="mt-2 text-base text-mute">{chapter.summary_ro}</p>
        </div>

        <LessonAudioPlayer audioPath={chapter.audio_path} scriptRo={chapter.audio_script_ro} />

        <RealPhoto slug={chapter.cover_media_slug} className="aspect-[16/9]" showCredit />

        <Panel strong>
          <h2 className="font-cond text-2xl font-bold">Idei esențiale de reținut</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {chapter.key_points_ro.map((pt) => (
              <li key={pt} className="rounded border border-line bg-chalk px-4 py-3">
                {pt}
              </li>
            ))}
          </ul>
        </Panel>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/capitole/${chapter.slug}/lectie`}
            className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-5 py-2.5 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
          >
            Citește lecția detaliată →
          </Link>
          <Link
            href={`/capitole/${chapter.slug}/test`}
            className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-surface px-5 py-2.5 text-sm font-semibold text-asphalt hover:bg-chalk"
          >
            Mergi la testul capitolului
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
