import { AdminShell } from "@/components/admin-shell";
import { Panel } from "@/components/ui/primitives";
import { requireStaffUser } from "@/lib/data/require-user";
import { getAdminOverview } from "@/lib/data/store";
import { formatRoDateTime } from "@/lib/i18n";

export const metadata = { title: "Admin · Jurnal de audit" };
export const dynamic = "force-dynamic";

export default async function AdminAuditLogPage() {
  const [user, data] = await Promise.all([requireStaffUser(), getAdminOverview()]);
  return (
    <AdminShell userName={`${user.first_name} ${user.last_name}`}>
      <div className="space-y-6">
        <h1 className="font-cond text-3xl font-bold">Jurnal de audit (append-only)</h1>
        <Panel className="overflow-x-auto p-0">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-chalk text-mute">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Acțiune</th>
                <th className="px-4 py-3">Entitate</th>
                <th className="px-4 py-3">Detalii</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.auditLog.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-2.5 font-mono">{e.id}</td>
                  <td className="px-4 py-2.5 font-mono">{formatRoDateTime(e.at)}</td>
                  <td className="px-4 py-2.5 font-semibold">{e.action}</td>
                  <td className="px-4 py-2.5 font-mono">
                    {e.entity} {e.entity_id ? `(${e.entity_id.slice(0, 8)})` : ""}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-mute">
                    {e.diff ? JSON.stringify(e.diff) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </AdminShell>
  );
}
