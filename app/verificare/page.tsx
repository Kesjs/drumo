import Link from "next/link";
import { CheckCircleIcon, ExclamationTriangleIcon, QrCodeIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { PageHero } from "@/components/page-hero";
import { VerifyLookup } from "@/components/verify-lookup";
import { CertMock } from "@/components/mockups";
import { getCurrentUser } from "@/lib/data/store";
import { btnGhostDark } from "@/lib/ui";

export const metadata = { title: "Verificare atestat" };
export const dynamic = "force-dynamic";

const OUTCOMES = [
  {
    Icon: CheckCircleIcon,
    tone: "text-ok",
    title: "Valid / Admis",
    body: "Afișează numele titularului, categoria de permis pregătită, scorul obținut și data emiterii din registrul public.",
  },
  {
    Icon: ExclamationTriangleIcon,
    tone: "text-sign",
    title: "Reținut sau Revocat",
    body: "Semnalează clar că documentul este suspendat temporar pentru verificare antifraudă sau a fost invalidat.",
  },
  {
    Icon: XCircleIcon,
    tone: "text-danger",
    title: "Cod inexistent",
    body: "Confirmă imediat că seria introdusă nu corespunde niciunui atestat emis de platforma PermiStart.",
  },
];

export default async function VerifyIndexPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main>
        <PageHero
          title="Verificare publică a atestatului PermiStart."
          subtitle="Oricine — instructor, școală de șoferi sau angajator — poate verifica gratuit autenticitatea unui atestat folosind codul unic DR-XXXX-XXXX sau codul QR de pe document."
          image={{
            src: "/media/calea-victoriei.webp",
            alt: "Trafic urban și semnalizare rutieră pe Calea Victoriei din București",
            objectPosition: "object-[50%_55%]",
          }}
          actions={
            <Link href="/categorii" className={btnGhostDark}>
              Vezi categoriile disponibile
            </Link>
          }
          aside={
            <div className="rounded-xl border border-white/20 bg-asphalt/90 p-5 text-sm">
              <div className="flex items-center gap-3 font-semibold text-white">
                <QrCodeIcon className="h-5 w-5 text-signal" aria-hidden="true" />
                <span>Verificare instantanee, fără cont</span>
              </div>
              <p className="mt-2 text-white/80">
                Nu este necesară autentificarea. Rezultatul interoghează direct registrul de atestate emise pe
                permistart.ro.
              </p>
            </div>
          }
        />

        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-8">
              <div>
                <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl">
                  Introdu codul de pe document
                </h2>
                <p className="mt-2 max-w-[54ch] text-base text-mute">
                  Codul are formatul <span className="font-mono font-medium text-asphalt">DR-XXXX-XXXX</span> și apare în
                  colțul din dreapta sus al fișierului PDF sau sub codul QR.
                </p>
              </div>

              <VerifyLookup />

              <div className="divide-y divide-line rounded-xl border border-line bg-white">
                {OUTCOMES.map(({ Icon, tone, title, body }) => (
                  <div key={title} className="flex items-start gap-3.5 p-5">
                    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone}`} aria-hidden="true" />
                    <div>
                      <h3 className="font-cond text-lg font-bold text-asphalt">{title}</h3>
                      <p className="mt-0.5 text-sm text-mute">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <CertMock />
              <p className="text-xs leading-relaxed text-mute">
                Specimen ilustrativ. Atestatul de reușită PermiStart confirmă pregătirea teoretică și promovarea
                examenului supravegheat pe platformă; nu este permis de conducere și nu înlocuiește examenul oficial al
                autorităților.
              </p>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
