import { AdminShell } from "@/components/admin-shell";
import { Panel, StatusTag } from "@/components/ui/primitives";
import { requireStaffUser } from "@/lib/data/require-user";
import { getAdminOverview } from "@/lib/data/store";
import { formatMoney } from "@/lib/domain/money";

export const metadata = { title: "Admin · Candidați" };
export const dynamic = "force-dynamic";

export default async function AdminCandidatesPage() {
  const [user, data] = await Promise.all([requireStaffUser(), getAdminOverview()]);
  return (
    <AdminShell userName={`${user.first_name} ${user.last_name}`}>
      <div className="space-y-6">
        <h1 className="font-cond text-3xl font-bold">Candidați ({data.candidates.length})</h1>
        <Panel className="overflow-x-auto p-0">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-chalk text-mute">
              <tr>
                <th className="px-4 py-3">Nume</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Țară</th>
                <th className="px-4 py-3">KYC</th>
                <th className="px-4 py-3">Plată</th>
                <th className="px-4 py-3">Pregătire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.candidates.map((row) => (
                <tr key={row.profile.id}>
                  <td className="px-4 py-3 font-semibold">
                    {row.profile.first_name} {row.profile.last_name}
                  </td>
                  <td className="px-4 py-3">{row.profile.email || row.profile.phone}</td>
                  <td className="px-4 py-3 font-mono">{row.profile.country}</td>
                  <td className="px-4 py-3">
                    <StatusTag tone={row.kyc?.status === "approved" ? "ok" : "neutral"}>
                      {row.kyc?.status ?? "not_started"}
                    </StatusTag>
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {row.enrollment
                      ? `${formatMoney(row.enrollment.total_paid, row.enrollment.currency)} / ${formatMoney(row.enrollment.total_due, row.enrollment.currency)}`
                      : "Neachitat"}
                  </td>
                  <td className="px-4 py-3 font-mono">{row.readiness !== null ? `${row.readiness}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </AdminShell>
  );
}
