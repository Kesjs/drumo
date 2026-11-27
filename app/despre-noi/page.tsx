import Link from "next/link";
import {
  ArrowUpRightIcon,
  BanknotesIcon,
  BookOpenIcon,
  CheckBadgeIcon,
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

const TEAM_MEMBERS = [
  {
    name: "Irina Ionescu",
    role: "Director general",
    photo: "/media/team-irina.jpg",
    bio: "Coordonează direcția educațională PermiStart, standardul editorial pe capitole și calitatea evaluărilor teoretice.",
  },
  {
    name: "Ing. Radu Dumitrescu",
    role: "Formator principal legislație rutieră",
    photo: "/media/team-radu.jpg",
    bio: "Elaborează structura lecțiilor, explicațiile juridice și scenariile foto reale pentru toate cele 15 categorii europene.",
  },
  {
    name: "Av. Gabriela Marinescu",
    role: "Consilier juridic & Conformitate GDPR",
    photo: "/media/team-gabriela.jpg",
    bio: "Supraveghează alinierea la OUG 195/2002, transparența plăților și ștergerea automată a actelor KYC la 30 de zile.",
  },
  {
    name: "Elena Stănescu",
    role: "Secretar general & Suport candidați",
    photo: "/media/team-elena.jpg",
    bio: "Gestionează comunicarea directă în limba română cu candidații din țară și din diaspora, de la înscriere până la atestat.",
  },
];

const KEY_FIGURES = [
  { value: "15", label: "Categorii europene (AM – DE) acoperite integral" },
  { value: "100%", label: "Aliniere la OUG 195/2002 și HG 1391/2006" },
  { value: "72h", label: "Termen maxim de emitere pentru atestatul cu cod QR" },
  { value: "30 zile", label: "Retenție maximă KYC criptat înainte de ștergere" },
];

const PRINCIPLES = [
  {
    Icon: BanknotesIcon,
    title: "Fără abonamente ascunse",
    body: "Plătești o singură taxă stabilită în funcție de categoria aleasă (toate cele 15 categorii europene: AM, A1, A2, A, B1, B, BE, C1, C1E, C, CE, D1, D1E, D, DE), integral sau în 2–3 tranșe. Vezi suma exactă înainte de plată.",
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

        {/* Editorial narrative & founder statement */}
        <section className="border-b border-line bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-5">
            <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl">
              O experiență de pregătire clară, gândită de la zero pentru învățare reală
            </h2>

            <blockquote className="mt-8 rounded-xl border border-line bg-chalk p-6 sm:p-8">
              <p aria-hidden="true" className="font-cond text-4xl font-bold leading-none text-sign">
                „
              </p>
              <p className="mt-2 text-base font-medium leading-relaxed text-asphalt sm:text-lg">
                Codul rutier nu se stăpânește memorând mecanic variante izolate. Am construit PermiStart ca fiecare
                candidat — fie că învață din România sau din diaspora — să parcurgă materia ordonat pe capitole, să
                primească explicația articolului de lege și să intre în examen sigur pe deciziile lui.”
              </p>
              <footer className="mt-4 flex flex-wrap items-center gap-2 text-sm text-mute">
                <strong className="font-semibold text-asphalt">Irina Ionescu</strong>
                <span>· Director general PermiStart</span>
              </footer>
            </blockquote>

            <div className="mt-8 grid gap-6 text-base leading-relaxed text-mute sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-cond text-xl font-bold text-asphalt">
                  Progres structurat, fără presiunea abonamentelor
                </h3>
                <p className="text-sm leading-relaxed sm:text-base">
                  În comparație cu aplicațiile clasice de chestionare, am reunit cursurile scrise și audio, indicatoarele
                  fotografiate pe drumuri reale și evaluarea finală într-un singur parcurs. Din prima seară după prima
                  tranșă ai acces complet la capitolele categoriei tale, de pe telefon sau desktop.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-cond text-xl font-bold text-asphalt">
                  Evaluare adaptivă și trasabilitate completă
                </h3>
                <p className="text-sm leading-relaxed sm:text-base">
                  Testarea adaptivă identifică subiectele unde mai apar ezitări și revine punctual asupra lor înaintea
                  examenului final supravegheat. La final, primești un atestat electronic cu cod QR pe care angajatorii
                  sau partenerii îl pot verifica instant online.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key metrics band */}
        <section className="bg-asphalt py-14 text-white sm:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-wrap items-center gap-3">
              <CheckBadgeIcon className="h-7 w-7 text-signal" aria-hidden="true" />
              <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-white sm:text-4xl">
                Reperele platformei PermiStart
              </h2>
            </div>
            <dl className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {KEY_FIGURES.map((item) => (
                <div key={item.label} className="border-t border-white/20 pt-5">
                  <dt className="font-cond text-4xl font-bold tabular-nums text-signal sm:text-5xl">{item.value}</dt>
                  <dd className="mt-2 max-w-[26ch] text-sm text-white/85">{item.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Leadership team */}
        <section className="border-b border-line bg-chalk py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-2xl">
              <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl">
                Membrii echipei
              </h2>
              <p className="mt-3 text-base text-mute">
                Echipa de conducere, formare și conformitate care supraveghează structura cursurilor, verificările de
                examen și asistența candidaților.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM_MEMBERS.map((member) => (
                <article
                  key={member.name}
                  className="group overflow-hidden rounded-xl border border-line bg-white shadow-card transition-shadow hover:shadow-lift"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-chalk">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.photo}
                      alt={`${member.name} — ${member.role}`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-cond text-xl font-bold text-asphalt">{member.name}</h3>
                    <p className="mt-0.5 font-mono text-xs font-semibold text-sign">{member.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-mute">{member.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

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
