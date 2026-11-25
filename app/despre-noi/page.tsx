import Link from "next/link";
import {
  ArrowUpRightIcon,
  BanknotesIcon,
  BookOpenIcon,
  LockClosedIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { PageHero } from "@/components/page-hero";
import { getCurrentUser } from "@/lib/data/store";
import { LEGAL_ENTITY } from "@/lib/config";
import { btnPrimary, btnGhostDark, btnGhostLight } from "@/lib/ui";

export const metadata = { title: "Despre noi" };
export const dynamic = "force-dynamic";

const PRINCIPLES = [
  {
    Icon: BanknotesIcon,
    title: "Fără abonamente ascunse",
    body: "Plătești o singură taxă stabilită în funcție de categoria aleasă (AM, A1, A2, A, B1, B, BE, C, CE, D), integral sau în 2–3 tranșe. Vezi suma exactă înainte de plată.",
  },
  {
    Icon: BookOpenIcon,
    title: "Pregătire reală, nu memorare mecanică",
    body: "Motorul adaptiv revine asupra capitolelor unde apar greșeli, iar sala de examen devine accesibilă abia după promovarea evaluării globale.",
  },
  {
    Icon: ScaleIcon,
    title: "Onestitate juridică totală",
    body: "Atestatul de reușită PermiStart confirmă pregătirea și evaluarea pe platformă; nu este prezentat drept permis de conducere și nu înlocuiește examenul oficial.",
  },
  {
    Icon: LockClosedIcon,
    title: "Protecția datelor conform GDPR",
    body: "Documentele de identitate încărcate pentru verificarea KYC sunt stocate criptat cu acces restricționat și șterse automat la cel mult 30 de zile.",
  },
];

export default async function AboutPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main>
        <PageHero
          title="Construit pentru candidații care vor să înțeleagă drumul."
          subtitle="PermiStart combină lecții structurate după Codul rutier din România (OUG 195/2002 și HG 1391/2006) cu fotografii reale de pe șoselele naționale și examen supravegheat."
          image={{
            src: "/media/intrare-brasov-dn1.webp",
            alt: "Indicatoare rutiere reale pe DN1 la intrarea în Brașov",
            objectPosition: "object-[50%_45%]",
          }}
          actions={
            <>
              <Link href="/categorii" className={btnPrimary}>
                Vezi categoriile și prețurile
              </Link>
              <Link href="/contact" className={btnGhostDark}>
                Contactează echipa
              </Link>
            </>
          }
        />

        {/* Principles */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl">
              Principiile după care funcționăm
            </h2>
            <p className="mt-3 text-base text-mute">
              Fiecare regulă de acces, de plată și de confidențialitate este transparentă dinaintea înscrierii și aplicată
              strict pe server.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
            {PRINCIPLES.map(({ Icon, title, body }) => (
              <div key={title} className="bg-white p-6 sm:p-8">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-chalk text-asphalt">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-cond text-2xl font-bold text-asphalt">{title}</h3>
                <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-mute sm:text-base">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Operator dossier */}
        <section className="border-t border-line bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.55fr_0.45fr] lg:items-center">
            <div>
              <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl">
                Operator și transparență juridică
              </h2>
              <p className="mt-3 max-w-[58ch] text-base text-mute">
                Platforma este operată din Uniunea Europeană, cu procesarea plăților securizată prin Stripe și
                stocarea datelor conform legislației europene privind protecția datelor.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/inscriere" className={btnPrimary}>
                  Începe înscrierea
                </Link>
                <Link href="/confidentialitate" className={btnGhostLight}>
                  <span>Politica de confidențialitate</span>
                  <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <dl className="divide-y divide-line rounded-xl border border-line bg-chalk px-6 py-2 text-sm">
              <div className="py-4">
                <dt className="text-xs text-mute">Entitate operatoare</dt>
                <dd className="mt-1 font-semibold text-asphalt">{LEGAL_ENTITY.companyPlaceholder}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <dt className="text-xs text-mute">Cod unic (CUI)</dt>
                  <dd className="mt-1 font-mono text-asphalt">{LEGAL_ENTITY.cuiPlaceholder}</dd>
                </div>
                <div>
                  <dt className="text-xs text-mute">Reg. Comerțului</dt>
                  <dd className="mt-1 font-mono text-asphalt">{LEGAL_ENTITY.regComPlaceholder}</dd>
                </div>
              </div>
              <div className="py-4">
                <dt className="text-xs text-mute">Sediu</dt>
                <dd className="mt-1 text-asphalt">{LEGAL_ENTITY.addressPlaceholder}</dd>
              </div>
              <div className="py-4">
                <dt className="text-xs text-mute">Contact direct</dt>
                <dd className="mt-1 font-mono text-xs text-asphalt">
                  {LEGAL_ENTITY.contactEmail} · {LEGAL_ENTITY.phonePlaceholder}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
