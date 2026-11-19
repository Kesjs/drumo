import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { LessonAudioPlayer } from "@/components/lesson-audio";
import { LessonCompleteButton } from "@/components/lesson-complete-btn";
import { RealPhoto } from "@/components/real-photo";
import { NoticeBox, Panel } from "@/components/ui/primitives";
import { requireCandidateSnapshot } from "@/lib/data/require-user";
import { getChapterBySlug } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ capitol: string }> }) {
  const { capitol } = await params;
  const ch = await getChapterBySlug(capitol);
  return { title: ch ? `Lecție · ${ch.title_ro}` : "Lecție" };
}

export default async function ChapterLessonPage({ params }: { params: Promise<{ capitol: string }> }) {
  const { capitol } = await params;
  const [snap, chapter] = await Promise.all([
    requireCandidateSnapshot(`/capitole/${capitol}/lectie`),
    getChapterBySlug(capitol),
  ]);
  if (!chapter) notFound();
  if (!snap.access.coursesUnlocked) redirect("/plata");

  const prog = snap.progress.find((p) => p.chapter_id === chapter.id);

  return (
    <AppShell
      userName={`${snap.user.first_name} ${snap.user.last_name}`}
      categoryCode={snap.category.code}
      role={snap.user.role}
      coursesUnlocked={snap.access.coursesUnlocked}
      examUnlocked={snap.access.examUnlocked}
    >
      <article className="max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href={`/capitole/${chapter.slug}`} className="font-semibold text-sign underline underline-offset-4">
            ← Rezumat capitol
          </Link>
          <span className="text-mute">/</span>
          <span className="text-mute">Lecție detaliată</span>
        </div>

        <h1 className="font-cond text-3xl font-bold md:text-4xl">{chapter.title_ro}</h1>

        <LessonAudioPlayer audioPath={chapter.audio_path} scriptRo={chapter.audio_script_ro} />

        <div className="space-y-5">
          {chapter.blocks.map((block) => {
            if (block.kind === "heading") {
              return (
                <h2 key={block.id} className="pt-2 font-cond text-2xl font-bold text-asphalt">
                  {block.body_ro}
                </h2>
              );
            }
            if (block.kind === "image" && block.media_slug) {
              return (
                <div key={block.id} className="space-y-2">
                  <RealPhoto slug={block.media_slug} className="aspect-[4/3]" showCredit />
                  <p className="max-w-[65ch] text-sm text-mute">{block.body_ro}</p>
                </div>
              );
            }
            if (block.kind === "rule") {
              return (
                <Panel key={block.id} strong className="bg-surface">
                  <p className="font-mono text-xs font-medium text-sign">
                    REGULĂ RUTIERĂ{block.legal_ref ? ` · ${block.legal_ref}` : ""}
                  </p>
                  <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-asphalt">{block.body_ro}</p>
                </Panel>
              );
            }
            if (block.kind === "warning") {
              return (
                <NoticeBox
                  key={block.id}
                  tone="warning"
                  title={`Atenție${block.legal_ref ? ` · ${block.legal_ref}` : ""}`}
                >
                  <p className="max-w-[65ch]">{block.body_ro}</p>
                </NoticeBox>
              );
            }
            if (block.kind === "example") {
              return (
                <NoticeBox key={block.id} tone="info" title="Exemplu practic">
                  <p className="max-w-[65ch]">{block.body_ro}</p>
                </NoticeBox>
              );
            }
            return (
              <p key={block.id} className="max-w-[65ch] text-base leading-relaxed text-asphalt">
                {block.body_ro}
              </p>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <LessonCompleteButton slug={chapter.slug} alreadyDone={Boolean(prog?.lesson_completed_at)} />
          <Link
            href={`/capitole/${chapter.slug}/test`}
            className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-5 py-2.5 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
          >
            Continuă la testul capitolului →
          </Link>
        </div>
      </article>
    </AppShell>
  );
}
