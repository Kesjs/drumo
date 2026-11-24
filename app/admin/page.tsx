import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { AdminConfigForm } from "@/components/admin-actions";
import { Panel } from "@/components/ui/primitives";
import { requireStaffUser } from "@/lib/data/require-user";
import { getAdminOverview } from "@/lib/data/store";

export const metadata = { title: "Admin · Prezentare generală" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [user, data] = await Promise.all([requireStaffUser(), getAdminOverview()]);
  const pendingKyc = data.kycSubmissions.filter((k) => k.status === "pending" || k.status === "manual_review").length;
  const queuedCerts = data.certificates.filter((c) => c.status === "queued" || c.status === "held").length;

  return (
    <AdminShell userName={`${user.first_name} ${user.last_name}`}>
      <div className="space-y-6">
        <h1 className="font-cond text-3xl font-bold md:text-4xl">Panou de administrare PermisStart</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Panel>
            <p className="text-xs text-mute">Candidați înscriși</p>
            <p className="mt-1 font-mono text-3xl font-bold tabular-nums">{data.candidates.length}</p>
            <Link href="/admin/candidati" className="mt-2 inline-block text-xs font-semibold text-sign underline">
              Vezi candidații
            </Link>
          </Panel>
          <Panel>
            <p className="text-xs text-mute">KYC în așteptare</p>
            <p className="mt-1 font-mono text-3xl font-bold tabular-nums">{pendingKyc}</p>
            <Link href="/admin/kyc" className="mt-2 inline-block text-xs font-semibold text-sign underline">
              Revizuiește KYC
            </Link>
          </Panel>
          <Panel>
            <p className="text-xs text-mute">Plăți înregistrate</p>
            <p className="mt-1 font-mono text-3xl font-bold tabular-nums">{data.payments.length}</p>
            <Link href="/admin/plati" className="mt-2 inline-block text-xs font-semibold text-sign underline">
              Vezi plățile
            </Link>
          </Panel>
          <Panel>
            <p className="text-xs text-mute">Atestate în coadă / reținute</p>
            <p className="mt-1 font-mono text-3xl font-bold tabular-nums">{queuedCerts}</p>
            <Link href="/admin/atestate" className="mt-2 inline-block text-xs font-semibold text-sign underline">
              Gestionează coada
            </Link>
          </Panel>
        </div>

        <AdminConfigForm
          initialLabel={data.config.certificate_label}
          initialAccredited={data.config.accredited}
          initialDelayHours={data.config.certificate_send_delay_hours}
        />
      </div>
    </AdminShell>
  );
}
