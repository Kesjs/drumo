import Link from "next/link";
import { ArrowUpRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { PageHero } from "@/components/page-hero";
import { getCurrentUser } from "@/lib/data/store";
import { btnPrimary, btnGhostDark } from "@/lib/ui";

export const metadata = { title: "Întrebări frecvente" };
export const dynamic = "force-dynamic";

const FAQ_GROUPS = [
  {
    id: "categorii-taxe",
    title: "Categorii, prețuri și plată în tranșe",
    items: [
      {
        q: "Cum sunt stabilite taxele și de ce nu există abonament lunar?",
        a: "PermiStart funcționează cu o singură taxă per categorie de permis (AM, A1, A2, A, B1, B, BE, C, CE, D), fără costuri recurente. Poți consulta toate sumele în RON și EUR direct în pagina Categorii înainte de a crea un cont.",
      },
      {
        q: "Cum funcționează plata în tranșe?",
        a: "Prima tranșă (minimul afișat pentru categoria ta, de exemplu de la 300 lei pentru AM sau 550 lei pentru B) deblochează imediat toate cursurile pe capitole, testele și evaluarea adaptivă. Examenul teoretic final devine accesibil odată ce taxa este achitată integral.",
      },
      {
        q: "Cum pot solicita rambursarea?",
        a: "Politica completă de rambursare este afișată înainte de fiecare plată și în pagina Rambursări. Poți depune o cerere direct din secțiunea Plată a contului tău.",
      },
    ],
  },
  {
    id: "cursuri-examen",
    title: "Pregătire și sala de examen supravegheată",
    items: [
      {
        q: "De ce să mă pregătesc și să dau testul pe PermiStart?",
        a: "Parcursul combină lecții bazate pe legislația rutieră din România cu fotografii reale, audio integral, evaluare adaptivă pe capitolele unde mai greșești și un examen supravegheat în condiții similare sălii oficiale.",
      },
      {
        q: "Ce se întâmplă în sala de examen?",
        a: "Întrebările sunt extrase aleatoriu dintr-o bancă securizată. Fiecare întrebare poate fi citită automat audio, are cronometru strict măsurat pe server (60s) și trece automat mai departe fără întoarcere. Camera rămâne activă, iar ieșirile din filă se jurnalizează.",
      },
    ],
  },
  {
    id: "atestat-gdpr",
    title: "Atestat cu cod QR și protecția datelor (GDPR)",
    items: [
      {
        q: "Ce reprezintă atestatul de reușită PermiStart și cum se verifică?",
        a: "Atestatul de reușită PermiStart (PDF cu serie unică DR-XXXX-XXXX și cod QR verificabil public) confirmă finalizarea pregătirii și promovarea testului supravegheat pe platformă. Nu este permis de conducere și nu înlocuiește examenul oficial organizat de autorități.",
      },
      {
        q: "În cât timp primesc atestatul după ce sunt admis?",
        a: "Atestatul este programat automat pentru livrare pe e-mail în cel mult 3 zile (72 de ore) de la finalizarea examenului. În cazul unor alerte de integritate, echipa de revizuire poate verifica sesiunea înainte de trimitere.",
      },
      {
        q: "Ce faceți cu fotografia actului de identitate și selfie-ul?",
        a: "Sunt utilizate exclusiv pentru confirmarea identității candidatului (KYC) înaintea examenului. Documentele sunt stocate criptat și sunt șterse automat la cel mult 30 de zile.",
      },
    ],
  },
];

export default async function FaqPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main>
        <PageHero
          title="Întrebări frecvente, răspunsuri directe."
          subtitle="Tot ce trebuie să știi despre taxele unice pe categorii, plata în tranșe, examenul supravegheat și verificarea publică a atestatului."
          image={{
            src: "/media/marcaje-apold.webp",
            alt: "Marcaje rutiere de trecere pentru pietoni și bandă dedicată în Apold",
            objectPosition: "object-[50%_55%]",
          }}
          actions={
            <>
              <Link href="/categorii" className={btnPrimary}>
                Vezi categoriile și prețurile
              </Link>
              <Link href="/contact" className={btnGhostDark}>
                Pune o întrebare directă
              </Link>
            </>
          }
        />

        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
            <aside className="rounded-xl border border-line bg-white p-6 lg:sticky lg:top-24">
              <h2 className="font-cond text-2xl font-bold text-asphalt">Capitole</h2>
              <nav aria-label="Categorii de întrebări" className="mt-4 flex flex-col divide-y divide-line border-y border-line">
                {FAQ_GROUPS.map((g) => (
                  <a
                    key={g.id}
                    href={`#${g.id}`}
                    className="flex min-h-[44px] items-center justify-between gap-2 py-2.5 text-sm font-medium text-asphalt hover:text-sign"
                  >
                    <span>{g.title}</span>
                    <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-mute" aria-hidden="true" />
                  </a>
                ))}
              </nav>
              <p className="mt-5 text-xs text-mute">
                Nu ai găsit răspunsul căutat?{" "}
                <Link href="/contact" className="font-semibold text-sign underline underline-offset-4">
                  Scrie-ne prin formularul de contact
                </Link>
                .
              </p>
            </aside>

            <div className="space-y-12">
              {FAQ_GROUPS.map((group) => (
                <section key={group.id} id={group.id} className="scroll-mt-24">
                  <h2 className="font-cond text-2xl font-bold text-asphalt sm:text-3xl">{group.title}</h2>
                  <div className="mt-4 rounded-xl border border-line bg-white px-6">
                    {group.items.map((item) => (
                      <details key={item.q} className="group border-b border-line py-4 last:border-b-0">
                        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-asphalt sm:text-lg">
                          <span>{item.q}</span>
                          <ChevronDownIcon
                            className="h-5 w-5 shrink-0 text-mute transition-transform group-open:rotate-180"
                            aria-hidden="true"
                          />
                        </summary>
                        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-mute sm:text-base">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
