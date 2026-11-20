import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { getCurrentUser } from "@/lib/data/store";
import { LEGAL_ENTITY } from "@/lib/config";

export const metadata = { title: "Despre noi" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-3xl space-y-8 px-5 py-16">
        <div>
          <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">Despre Drumo</h1>
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-mute">
            Drumo este o platformă educațională de pregătire teoretică și evaluare supravegheată pentru legislația rutieră
            din România și Uniunea Europeană, construită cu reguli transparente de plată, conținut bazat pe Codul rutier
            (OUG 195/2002 și HG 1391/2006) și fotografii reale de pe drumurile din România.
          </p>
        </div>

        <section className="space-y-4 rounded-lg border-2 border-asphalt bg-surface p-6">
          <h2 className="font-cond text-2xl font-bold">Principiile noastre</h2>
          <ul className="divide-y divide-line border-y border-line text-sm text-mute">
            <li className="py-3">
              <strong className="text-asphalt">Fără abonamente ascunse:</strong> plătești o singură taxă pentru
              categoria aleasă (AM, A1, A2, A, B1, B, BE, C, CE, D), integral sau în 2–3 tranșe.
            </li>
            <li className="py-3">
              <strong className="text-asphalt">Pregătire reală înainte de examen:</strong> motorul adaptiv insistă pe
              capitolele la care mai greșești, iar accesul la examen se deblochează după evaluarea globală.
            </li>
            <li className="py-3">
              <strong className="text-asphalt">Onestitate juridică:</strong> atestatul de reușită Drumo confirmă
              pregătirea pe platformă și nu este prezentat drept permis oficial de conducere.
            </li>
            <li className="py-3">
              <strong className="text-asphalt">Protecția datelor (GDPR):</strong> documentele de identitate sunt
              criptate și șterse automat la maximum 30 de zile.
            </li>
          </ul>
        </section>

        <section className="space-y-2 border-t border-line pt-6 text-sm text-mute">
          <h2 className="font-cond text-2xl font-bold text-asphalt">Operator și date de identificare</h2>
          <p>
            <strong className="text-asphalt">{LEGAL_ENTITY.companyPlaceholder}</strong> · CUI {LEGAL_ENTITY.cuiPlaceholder} ·{" "}
            {LEGAL_ENTITY.regComPlaceholder}
          </p>
          <p>{LEGAL_ENTITY.addressPlaceholder}</p>
          <p className="font-mono text-xs text-asphalt">
            {LEGAL_ENTITY.contactEmail} · {LEGAL_ENTITY.phonePlaceholder}
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/inscriere"
            className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-5 py-2.5 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
          >
            Începe înscrierea
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-surface px-5 py-2.5 text-sm font-semibold text-asphalt hover:bg-chalk"
          >
            Contactează-ne
          </Link>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
