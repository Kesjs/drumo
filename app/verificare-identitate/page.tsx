import { AppShell } from "@/components/app-shell";
import { KycPanel } from "@/components/kyc-panel";
import { requireCandidateSnapshot } from "@/lib/data/require-user";

export const metadata = { title: "Verificare identitate" };
export const dynamic = "force-dynamic";

export default async function KycPage() {
  const snap = await requireCandidateSnapshot("/verificare-identitate");

  return (
    <AppShell
      userName={`${snap.user.first_name} ${snap.user.last_name}`}
      categoryCode={snap.category.code}
      role={snap.user.role}
      coursesUnlocked={snap.access.coursesUnlocked}
      examUnlocked={snap.access.examUnlocked}
    >
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-cond text-3xl font-bold md:text-4xl">Verificare identitate (KYC)</h1>
          <p className="mt-1 text-sm text-mute">
            Confirmă că persoana înscrisă este cea care va susține examenul teoretic.
          </p>
        </div>
        <KycPanel kyc={snap.kyc} />
      </div>
    </AppShell>
  );
}
