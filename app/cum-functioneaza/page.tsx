import Link from "next/link";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  CheckCircleIcon,
  CreditCardIcon,
  IdentificationIcon,
  LockOpenIcon,
  QrCodeIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion-kit";
import { getCurrentUser } from "@/lib/data/store";
import { btnPrimary, btnGhostDark, btnGhostLight } from "@/lib/ui";

export const metadata = { title: "Cum funcționează" };
export const dynamic = "force-dynamic";

const STAGES = [
  {
    Icon: CreditCardIcon,
    phase: "Înscriere și plată",
    title: "Alegi categoria, confirmi datele și deblochezi cursurile",
    detail:
      "Selectezi categoria dorită (AM, A1, A2, A, B1, B, BE, C, CE sau D) și vezi imediat suma exactă în RON sau EUR. Poți plăti integral sau în 2–3 tranșe: prima tranșă deblochează pe loc toate lecțiile și testele.",
    gate: "Acces imediat la capitole după prima tranșă",
  },
  {
    Icon: IdentificationIcon,
    phase: "Verificare KYC",
    title: "Încarci actul de identitate și un selfie",
    detail:
      "Verificarea confirmă că persoana înscrisă este cea care susține examenul final. Fotografiile se păstrează criptat, cazurile neclare primesc revizuire manuală și fișierele sunt șterse automat la 30 de zile.",
    gate: "Obligatorie înainte de intrarea în sala de examen",
  },
  {
    Icon: BookOpenIcon,
    phase: "Studiu și evaluare",
    title: "Capitole cu poze reale, audio și motor adaptiv",
    detail:
      "Fiecare capitol conține rezumat, lecție completă cu fotografii reale de pe drumurile din România, redare audio („Ascultă lecția”) și test. Evaluarea adaptivă revine pe capitolele unde mai greșești, iar evaluarea globală îți calculează nivelul real.",
    gate: "Prag de pregătire necesar pentru deblocarea examenului",
  },
  {
    Icon: VideoCameraIcon,
    phase: "Examen și atestat",
    title: "Examen supravegheat, rezultat pe loc și atestat cu QR",
    detail:
      "Cu taxa achitată integral, KYC aprobat și evaluarea trecută, intri când dorești în sala de examen: 60s per întrebare, fără întoarcere, cameră activă și jurnalizare. Dacă ești admis, atestatul PDF cu QR verificabil ajunge pe e-mail în cel mult 3 zile.",
    gate: "Atestat verificabil public cu serie unică DR-XXXX-XXXX",
  },
];

const UNLOCKS = [
  {
    title: "După prima tranșă",
    badge: "Deblocat imediat",
    items: [
      "Toate lecțiile pe capitole pentru categoria aleasă",
      "Fotografii reale din trafic și redare audio integrală",
      "Teste de capitol cu explicații legale pentru fiecare variantă",
      "Evaluare adaptivă și evaluare globală de pregătire",
    ],
  },
  {
    title: "După sold achitat, KYC și evaluare",
    badge: "Acces complet examen",
    items: [
      "Deblocarea sălii de examen teoretic supravegheat",
      "Extragere aleatorie din banca securizată de întrebări",
      "Scor afișat imediat și analiză completă pe întrebări",
      "Emitere atestat de reușită PermiStart cu cod QR în max. 3 zile",
    ],
  },
];

export default async function HowItWorksPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main>
        <PageHero
          title="De la înscriere la atestat, fără surprize."
          subtitle="Un singur parcurs verificat pe server: plătești o singură taxă pentru categoria aleasă, înveți în ritmul tău și susții examenul supravegheat când ești pregătit."
          image={{
            src: "/media/e79-baile-felix.webp",
            alt: "Drumul european E79 la Băile Felix cu indicatoare rutiere și marcaje",
            objectPosition: "object-[50%_55%]",
          }}
          actions={
            <>
              <Link href="/inscriere" className={btnPrimary}>
                Începe înscrierea
              </Link>
              <Link href="/categorii" className={btnGhostDark}>
                Vezi categoriile și prețurile
              </Link>
            </>
          }
          aside={
            <div className="rounded-xl border border-white/20 bg-asphalt/90 p-5">
              <div className="space-y-3 divide-y divide-white/15 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/75">Deblocare cursuri</span>
                  <span className="font-mono font-semibold text-signal">De la prima tranșă</span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-3">
                  <span className="text-white/75">Deblocare examen</span>
                  <span className="font-mono font-semibold text-white">Sold + KYC + Evaluare</span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-3">
                  <span className="text-white/75">Livrare atestat QR</span>
                  <span className="font-mono font-semibold text-white">Maximum 3 zile</span>
                </div>
              </div>
            </div>
          }
        />

        {/* Structured progression */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl">
              Cele 4 etape ale parcursului
            </h2>
            <p className="mt-3 text-base text-mute">
              Fiecare prag este calculat automat pe server, astfel încât să știi exact unde te afli și ce mai lipsește
              până la examen.
            </p>
          </div>

          <ol className="mt-10 divide-y divide-line border-y border-line">
            {STAGES.map(({ Icon, phase, title, detail, gate }) => (
              <li key={phase} className="py-8">
                <Reveal>
                  <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
                    <div className="flex items-center gap-3.5">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-white text-asphalt">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="font-mono text-xs font-semibold text-sign">{phase}</div>
                        <div className="mt-0.5 text-sm font-medium text-mute">{gate}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-cond text-2xl font-bold text-asphalt sm:text-3xl">{title}</h3>
                      <p className="mt-2.5 max-w-[65ch] text-base text-mute">{detail}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        {/* Two-column unlock comparison */}
        <section className="border-t border-line bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl">
                  Ce se deblochează și când
                </h2>
                <p className="mt-2 max-w-[60ch] text-base text-mute">
                  Plătești integral sau în tranșe, fără abonament lunar. Iată exact accesul oferit la fiecare prag.
                </p>
              </div>
              <Link
                href="/verificare"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                <QrCodeIcon className="h-4 w-4" aria-hidden="true" />
                <span>Verifică un atestat emis</span>
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-10 grid gap-7 md:grid-cols-2">
              {UNLOCKS.map((block, idx) => (
                <div
                  key={block.title}
                  className={`rounded-xl border p-6 sm:p-8 ${
                    idx === 1 ? "border-asphalt bg-ink text-chalk" : "border-line bg-chalk text-asphalt"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-current/15 pb-4">
                    <h3 className="font-cond text-2xl font-bold">{block.title}</h3>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-xs font-semibold ${
                        idx === 1 ? "bg-signal text-asphalt" : "bg-white text-asphalt border border-line"
                      }`}
                    >
                      <LockOpenIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{block.badge}</span>
                    </span>
                  </div>
                  <ul className="mt-5 space-y-3.5 text-sm">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircleIcon
                          className={`mt-0.5 h-5 w-5 shrink-0 ${idx === 1 ? "text-signal" : "text-ok"}`}
                          aria-hidden="true"
                        />
                        <span className={idx === 1 ? "text-chalk/90" : "text-asphalt"}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/categorii" className={btnPrimary}>
                Alege categoria
              </Link>
              <Link href="/cursuri" className={btnGhostLight}>
                Explorează capitolele de curs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
