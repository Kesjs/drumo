import Link from "next/link";
import {
  ArrowUpRightIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { getCurrentUser } from "@/lib/data/store";
import { LEGAL_ENTITY } from "@/lib/config";
import { btnGhostDark } from "@/lib/ui";

export const metadata = { title: "Contact" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main>
        <PageHero
          title="Suport direct în limba română."
          subtitle="Pentru întrebări despre cont, plăți în tranșe, verificarea identității (KYC), rambursări sau atestate emise, echipa noastră îți răspunde pe e-mail."
          image={{
            src: "/media/otopeni-intrare.webp",
            alt: "Panouri rutiere de direcție pe DN1 spre Aeroportul Henri Coandă Otopeni",
            objectPosition: "object-[50%_55%]",
          }}
          actions={
            <Link href="/intrebari-frecvente" className={btnGhostDark}>
              Consultă întrebările frecvente
            </Link>
          }
        />

        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-6">
            <div>
              <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt">Canale directe</h2>
              <p className="mt-2 text-sm text-mute sm:text-base">
                Selectează subiectul potrivit în formular sau scrie-ne direct la adresele oficiale de mai jos.
              </p>
            </div>

            <div className="divide-y divide-line rounded-xl border border-line bg-white">
              <div className="flex items-start gap-3.5 p-5">
                <EnvelopeIcon className="mt-0.5 h-5 w-5 shrink-0 text-sign" aria-hidden="true" />
                <div>
                  <div className="text-xs text-mute">Suport general și plăți</div>
                  <div className="mt-0.5 font-mono text-sm font-semibold text-asphalt">{LEGAL_ENTITY.contactEmail}</div>
                </div>
              </div>
              <div className="flex items-start gap-3.5 p-5">
                <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-ok" aria-hidden="true" />
                <div>
                  <div className="text-xs text-mute">Protecția datelor (GDPR / KYC)</div>
                  <div className="mt-0.5 font-mono text-sm font-semibold text-asphalt">{LEGAL_ENTITY.dpoEmail}</div>
                </div>
              </div>
              <div className="flex items-start gap-3.5 p-5">
                <BuildingOffice2Icon className="mt-0.5 h-5 w-5 shrink-0 text-asphalt" aria-hidden="true" />
                <div>
                  <div className="text-xs text-mute">Operator platformă</div>
                  <div className="mt-0.5 text-sm font-semibold text-asphalt">{LEGAL_ENTITY.companyPlaceholder}</div>
                  <div className="mt-0.5 text-xs text-mute">{LEGAL_ENTITY.addressPlaceholder}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <Link
                href="/rambursari"
                className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                <span>Politica de rambursări</span>
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/verificare"
                className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                <span>Verificare atestat QR</span>
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <ContactForm />
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
