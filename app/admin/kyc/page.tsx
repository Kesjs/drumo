import { AdminShell } from "@/components/admin-shell";
import { AdminKycButtons } from "@/components/admin-actions";
import { Panel, StatusTag } from "@/components/ui/primitives";
import { requireStaffUser } from "@/lib/data/require-user";
import { getAdminOverview } from "@/lib/data/store";
import { formatRoDateTime } from "@/lib/i18n";

export const metadata = { title: "Admin · Revizuire KYC" };
export const dynamic = "force-dynamic";

export default async function AdminKycPage() {
  const [user, data] = await Promise.all([requireStaffUser(), getAdminOverview()]);
  return (
    <AdminShell userName={`${user.first_name} ${user.last_name}`}>
      <div className="space-y-6">
        <h1 className="font-cond text-3xl font-bold">Revizuire identitate (KYC)</h1>
        <div className="space-y-4">
          {data.kycSubmissions.map((k) => (
            <Panel key={k.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {k.candidate ? `${k.candidate.first_name} ${k.candidate.last_name}` : k.user_id}
                  </p>
                  <p className="text-xs text-mute">
                    Document: <span className="font-mono uppercase">{k.document_type}</span> · Depus la{" "}
                    {formatRoDateTime(k.submitted_at)}
                  </p>
                </div>
                <StatusTag
                  tone={k.status === "approved" ? "ok" : k.status === "rejected" ? "danger" : "signal"}
                >
                  {k.status}
                </StatusTag>
              </div>
              <p className="text-xs text-mute">
                Fișiere: <span className="font-mono">{k.id_document_name ?? "șters GDPR"}</span> ·{" "}
                <span className="font-mono">{k.selfie_name ?? "șters GDPR"}</span>
              </p>
              <AdminKycButtons kycId={k.id} />
            </Panel>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
