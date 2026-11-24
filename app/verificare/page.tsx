import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { VerifyLookup } from "@/components/verify-lookup";
import { getCurrentUser } from "@/lib/data/store";

export const metadata = { title: "Verificare atestat" };
export const dynamic = "force-dynamic";

export default async function VerifyIndexPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
          Verificare atestat de reușită PermisStart
        </h1>
        <p className="mt-4 text-mute">
          Introdu codul unic de pe document (format <span className="font-mono text-asphalt">DR-XXXX-XXXX</span>) sau
          scanează codul QR de pe PDF pentru a confirma autenticitatea.
        </p>
        <div className="mt-8">
          <VerifyLookup />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
