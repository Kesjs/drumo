import { AdminShell } from "@/components/admin-shell";
import { AdminRefundButtons } from "@/components/admin-actions";
import { Panel, StatusTag } from "@/components/ui/primitives";
import { requireStaffUser } from "@/lib/data/require-user";
import { getAdminOverview } from "@/lib/data/store";
import { formatMoney } from "@/lib/domain/money";
import { formatRoDateTime } from "@/lib/i18n";

export const metadata = { title: "Admin · Plăți și tranșe" };
export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const [user, data] = await Promise.all([requireStaffUser(), getAdminOverview()]);
  return (
    <AdminShell userName={`${user.first_name} ${user.last_name}`}>
      <div className="space-y-6">
        <h1 className="font-cond text-3xl font-bold">Plăți, tranșe și rambursări</h1>

        <Panel className="overflow-x-auto p-0">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-chalk text-mute">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Candidat</th>
                <th className="px-4 py-3">Mod / Tranșă</th>
                <th className="px-4 py-3">Metodă</th>
                <th className="px-4 py-3">Sumă</th>
                <th className="px-4 py-3">Stare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.payments.map((p) => {
                const cand = data.candidates.find((c) => c.profile.id === p.user_id)?.profile;
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-mono">{formatRoDateTime(p.created_at)}</td>
                    <td className="px-4 py-3">{cand ? `${cand.first_name} ${cand.last_name}` : p.user_id}</td>
                    <td className="px-4 py-3 font-mono">
                      {p.mode} #{p.installment_no}
                    </td>
                    <td className="px-4 py-3">{p.method}</td>
                    <td className="px-4 py-3 font-mono font-semibold tabular-nums">
                      {formatMoney(p.amount, p.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusTag tone={p.status === "succeeded" ? "ok" : "neutral"}>{p.status}</StatusTag>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        <Panel className="space-y-3">
          <h2 className="font-cond text-2xl font-bold">Cereri de rambursare ({data.refundRequests.length})</h2>
          {data.refundRequests.length === 0 ? (
            <p className="text-sm text-mute">Nicio cerere deschisă.</p>
          ) : (
            data.refundRequests.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-line bg-chalk p-3 text-xs">
                <div>
                  <p className="font-semibold">{r.reason}</p>
                  <p className="text-mute">Stare: {r.status}</p>
                </div>
                {r.status === "open" ? <AdminRefundButtons refundId={r.id} /> : null}
              </div>
            ))
          )}
        </Panel>
      </div>
    </AdminShell>
  );
}
