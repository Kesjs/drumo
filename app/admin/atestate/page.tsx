import { AdminShell } from "@/components/admin-shell";
import { AdminCertificateButtons } from "@/components/admin-actions";
import { Panel, StatusTag } from "@/components/ui/primitives";
import { requireStaffUser } from "@/lib/data/require-user";
import { getAdminOverview } from "@/lib/data/store";
import { formatRoDateTime } from "@/lib/i18n";

export const metadata = { title: "Admin · Coadă atestate" };
export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const [user, data] = await Promise.all([requireStaffUser(), getAdminOverview()]);
  return (
    <AdminShell userName={`${user.first_name} ${user.last_name}`}>
      <div className="space-y-6">
        <div>
          <h1 className="font-cond text-3xl font-bold">Coadă trimitere atestate (termen max. 3 zile)</h1>
          <p className="mt-1 text-sm text-mute">
            Atestatele reținute („held”) nu sunt trimise automat de jobul programat până la deblocare.
          </p>
        </div>
        <div className="space-y-3">
          {data.certificates.map((c) => (
            <Panel key={c.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-sign">{c.public_code}</p>
                  <p className="font-semibold">
                    {c.holder_name} · Categoria {c.category_code} ({c.score}/{c.total})
                  </p>
                  <p className="text-xs text-mute">
                    Programat trimitere: {formatRoDateTime(c.scheduled_send_at)}
                    {c.sent_at ? ` · Trimis la ${formatRoDateTime(c.sent_at)}` : ""}
                  </p>
                </div>
                <StatusTag
                  tone={c.status === "sent" ? "ok" : c.status === "held" || c.status === "revoked" ? "danger" : "signal"}
                >
                  {c.status}
                </StatusTag>
              </div>
              {c.hold_reason ? <p className="text-xs text-danger">Motiv: {c.hold_reason}</p> : null}
              <AdminCertificateButtons certId={c.id} status={c.status} />
            </Panel>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
