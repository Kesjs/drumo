import { AdminShell } from "@/components/admin-shell";
import { AdminAddQuestionForm } from "@/components/admin-actions";
import { Panel, StatusTag } from "@/components/ui/primitives";
import { requireStaffUser } from "@/lib/data/require-user";
import { getAdminOverview } from "@/lib/data/store";

export const metadata = { title: "Admin · Banca de întrebări" };
export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  const [user, data] = await Promise.all([requireStaffUser(), getAdminOverview()]);
  return (
    <AdminShell userName={`${user.first_name} ${user.last_name}`}>
      <div className="space-y-6">
        <h1 className="font-cond text-3xl font-bold">Banca de întrebări ({data.questions.length})</h1>

        <AdminAddQuestionForm chapters={data.chapters} />

        <div className="space-y-3">
          {data.questions.map((q) => (
            <Panel key={q.id} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono text-mute">
                  {q.chapter_slug} · Dif. {q.difficulty}/5 · {q.legal_ref}
                </span>
                <div className="flex gap-2">
                  {q.exam_pool ? <StatusTag tone="sign">Examen</StatusTag> : <StatusTag tone="neutral">Pregătire</StatusTag>}
                </div>
              </div>
              <p className="text-sm font-semibold">{q.stem_ro}</p>
              <ul className="grid gap-1 text-xs text-mute sm:grid-cols-3">
                {q.options.map((o) => (
                  <li key={o.label} className={o.is_correct ? "font-semibold text-ok" : ""}>
                    {o.label}. {o.body_ro}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
