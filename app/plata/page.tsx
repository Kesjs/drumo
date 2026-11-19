import { AppShell } from "@/components/app-shell";
import { PaymentPanel } from "@/components/payment-panel";
import { requireCandidateSnapshot } from "@/lib/data/require-user";

export const metadata = { title: "Plată" };
export const dynamic = "force-dynamic";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const [{ status }, snap] = await Promise.all([searchParams, requireCandidateSnapshot("/plata")]);

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
          <h1 className="font-cond text-3xl font-bold md:text-4xl">Plată taxă categorie</h1>
          <p className="mt-1 text-sm text-mute">
            Fără abonament. Prima tranșă deblochează cursurile; plata integrală deblochează examenul.
          </p>
        </div>
        <PaymentPanel
          category={snap.category}
          initialCurrency={snap.user.currency}
          enrollment={snap.enrollment}
          payments={snap.payments}
          refundRequests={snap.refundRequests}
          checkoutStatus={status}
        />
      </div>
    </AppShell>
  );
}
