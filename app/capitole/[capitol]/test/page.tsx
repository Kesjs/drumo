import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PracticeRunner } from "@/components/practice-runner";
import { requireCandidateSnapshot } from "@/lib/data/require-user";
import { getChapterBySlug } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ capitol: string }> }) {
  const { capitol } = await params;
  const ch = await getChapterBySlug(capitol);
  return { title: ch ? `Test · ${ch.title_ro}` : "Test capitol" };
}

export default async function ChapterTestPage({ params }: { params: Promise<{ capitol: string }> }) {
  const { capitol } = await params;
  const [snap, chapter] = await Promise.all([
    requireCandidateSnapshot(`/capitole/${capitol}/test`),
    getChapterBySlug(capitol),
  ]);
  if (!chapter) notFound();
  if (!snap.access.coursesUnlocked) redirect("/plata");

  return (
    <AppShell
      userName={`${snap.user.first_name} ${snap.user.last_name}`}
      categoryCode={snap.category.code}
      role={snap.user.role}
      coursesUnlocked={snap.access.coursesUnlocked}
      examUnlocked={snap.access.examUnlocked}
    >
      <div className="max-w-3xl space-y-4">
        <Link href={`/capitole/${chapter.slug}`} className="text-sm font-semibold text-sign underline underline-offset-4">
          ← Înapoi la capitol
        </Link>
        <PracticeRunner
          kind="chapter"
          chapterSlug={chapter.slug}
          title={`Test capitol · ${chapter.title_ro}`}
          subtitle="Primești explicația completă după fiecare răspuns."
        />
      </div>
    </AppShell>
  );
}
