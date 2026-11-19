import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { getCurrentUser } from "@/lib/data/store";

export const metadata = { title: "Despre noi" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-3xl px-5 py-16 space-y-6">
        <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">Despre Drumo</h1>
        <p className="max-w-[65ch] text-base text-mute">
          Drumo este o platformă de pregătire teoretică și evaluare structurată pentru legislația rutieră din
          România, construită cu reguli transparente de plată, conținut bazat pe Codul rutier (OUG 195/2002 și HG
          1391/2006) și fotografii reale de pe drumurile din România.
        </p>
        <section className="rounded-lg border border-line bg-surface p-6 space-y-3">
          <h2 className="font-cond text-2xl font-bold">Principiile noastre</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-mute">
            <li>Fără abonamente ascunse: o singură taxă pentru categoria aleasă, cu opțiune de plată în tranșe.</li>
            <li>Evaluare reală înainte de examen: accesul la examen depinde de pregătirea demonstrată, nu doar de plată.</li>
            <li>Onestitate juridică: atestatul de reușită Drumo nu este prezentat drept permis oficial de conducere.</li>
            <li>Protecția datelor: verificarea identității are retenție scurtă și ștergere automată.</li>
          </ul>
        </section>
        <Link
          href="/inscriere"
          className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-5 py-2.5 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
        >
          Începe înscrierea
        </Link>
      </main>
      <PublicFooter />
    </>
  );
}
