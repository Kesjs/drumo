import { AdminShell } from "@/components/admin-shell";
import { Panel, StatusTag } from "@/components/ui/primitives";
import { requireStaffUser } from "@/lib/data/require-user";
import { getAdminOverview } from "@/lib/data/store";
import { formatRoDateTime } from "@/lib/i18n";

export const metadata = { title: "Admin · Rapoarte antifraudă" };
export const dynamic = "force-dynamic";

export default async function AdminAntifraudPage() {
  const [user, data] = await Promise.all([requireStaffUser(), getAdminOverview()]);
  return (
    <AdminShell userName={`${user.first_name} ${user.last_name}`}>
      <div className="space-y-6">
        <h1 className="font-cond text-3xl font-bold">Rapoarte antifraudă examen</h1>
        {data.examReports.length === 0 ? (
          <Panel>
            <p className="text-sm text-mute">Nu există încă sesiuni de examen finalizate.</p>
          </Panel>
        ) : (
          <div className="space-y-4">
            {data.examReports.map(({ session, candidate, integrity }) => (
              <Panel key={session.id} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      {candidate ? `${candidate.first_name} ${candidate.last_name}` : session.user_id}
                    </p>
                    <p className="text-xs text-mute">
                      Scor: {session.score}/{session.question_ids.length} · Finalizat la{" "}
                      {session.finished_at ? formatRoDateTime(session.finished_at) : "—"}
                    </p>
                  </div>
                  <StatusTag
                    tone={
                      integrity.level === "high"
                        ? "danger"
                        : integrity.level === "medium"
                          ? "signal"
                          : "ok"
                    }
                  >
                    Risc: {integrity.level} (scor {integrity.score})
                  </StatusTag>
                </div>
                {integrity.alerts.length > 0 ? (
                  <ul className="list-disc pl-5 text-xs text-danger">
                    {integrity.alerts.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-ok">Sesiune fără incidente.</p>
                )}
              </Panel>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
