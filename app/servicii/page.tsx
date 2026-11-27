import Link from "next/link";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { PageHero } from "@/components/page-hero";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { getCurrentUser } from "@/lib/data/store";
import { WHATSAPP } from "@/lib/config";
import { TESTIMONIALS } from "@/lib/testimonials";
import { btnPrimary, btnGhostDark } from "@/lib/ui";

export const metadata = {
  title: "Servicii",
  description:
    "Servicii complete de pregătire teoretică auto pentru toate cele 15 categorii europene, examen supravegheat online și atestat cu cod QR.",
};
export const dynamic = "force-dynamic";

const SERVICE_BLOCKS = [
  {
    id: "pregatire-teoretica",
    title: "Pregătire teoretică structurată pentru 15 categorii europene",
    body: "Parcurgi legislația rutieră din România (OUG 195/2002 și HG 1391/2006) pe capitole organizate logic, ilustrate cu fotografii reale de pe șoselele naționale. Fiecare lecție include citire audio și test de antrenament cu explicația articolului de lege.",
    image: "/media/calea-victoriei.webp",
    alt: "Trafic urban și indicatoare rutiere reale pe Calea Victoriei din București",
    ctaLabel: "Vezi categoriile și prețurile",
    ctaHref: "/categorii",
    imageLeft: false,
  },
  {
    id: "formare-diaspora",
    title: "Formare online flexibilă pentru candidații din țară și diaspora",
    body: "Studiezi în limba română din orice țară europeană, de pe telefon sau desktop, fără program fix. Taxa unică per categorie se poate achita integral sau în 2–3 tranșe transparente, iar accesul complet la capitole se deschide din prima zi.",
    image: "/media/cat-b.jpg",
    alt: "Autoturism pregătit pentru cursanții categoriei B",
    ctaLabel: "Începe înscrierea",
    ctaHref: "/inscriere",
    imageLeft: true,
  },
  {
    id: "examen-si-atestat",
    title: "Evaluare adaptivă, examen supravegheat și atestat QR",
    body: "Motorul adaptiv revine asupra capitolelor unde apar ezitări înainte de examenul final cronometrat la 60 secunde pe întrebare. După promovare primești automat pe e-mail atestatul PDF cu serie unică și cod QR verificabil instant online.",
    image: "/media/cat-ce.jpg",
    alt: "Ansamblu greu de transport rutier ilustrativ pentru categoriile profesionale",
    ctaLabel: "Verifică un atestat QR",
    ctaHref: "/verificare",
    imageLeft: false,
  },
];

export default async function ServicesPage() {
  const user = await getCurrentUser();
  const whatsappHref = `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(WHATSAPP.message)}`;

  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main>
        <PageHero
          title="Servicii construite pentru pregătire clară, de la primul capitol până la atestat."
          subtitle="Tot ce ai nevoie pentru pregătirea teoretică auto în limba română: cursuri foto și audio, evaluare adaptivă, examen supravegheat și verificare instantanee prin cod QR."
          image={{
            src: "/media/autostrada-sibiu.webp",
            alt: "Autostradă modernă din România, fotografie reală PermiStart",
            objectPosition: "object-[50%_55%]",
          }}
          actions={
            <>
              <Link href="/categorii" className={btnPrimary}>
                Alege categoria
              </Link>
              <Link href="/contact" className={btnGhostDark}>
                Contactează echipa
              </Link>
            </>
          }
        />

        {/* Alternating service showcase cards */}
        <section className="bg-chalk py-16 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-10 px-5">
            {SERVICE_BLOCKS.map((item) => (
              <article
                key={item.id}
                id={item.id}
                className="grid overflow-hidden rounded-xl border border-line bg-white shadow-card lg:grid-cols-2"
              >
                <div
                  className={`flex flex-col justify-center p-7 sm:p-10 lg:p-12 ${
                    item.imageLeft ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <h2 className="font-cond text-3xl font-bold leading-[1.1] tracking-[-0.015em] text-asphalt sm:text-4xl">
                    {item.title}
                  </h2>
                  <p className="mt-4 max-w-[54ch] text-sm leading-relaxed text-mute sm:text-base">{item.body}</p>
                  <div className="mt-7">
                    <Link
                      href={item.ctaHref}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded bg-asphalt px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink"
                    >
                      <span>{item.ctaLabel}</span>
                      <ArrowRightIcon className="h-4 w-4 text-signal" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div
                  className={`relative aspect-[16/10] bg-asphalt lg:aspect-auto lg:min-h-[340px] ${
                    item.imageLeft ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Quick support strip */}
        <section className="border-y border-line bg-white py-14 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-3">
            <div className="flex flex-col justify-between">
              <div>
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-chalk text-asphalt">
                  <AcademicCapIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-cond text-2xl font-bold text-asphalt">Înscriere pe categorie</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Consultă tarifele reale pentru toate cele 15 categorii europene (AM – DE) și alege plata integrală sau
                  în tranșe.
                </p>
              </div>
              <Link
                href="/categorii"
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                <span>Vezi categoriile și prețurile</span>
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-chalk text-asphalt">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-cond text-2xl font-bold text-asphalt">Discută cu echipa</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Ai nelămuriri legate de capitole, verificarea KYC, facturare sau regulile examenului supravegheat?
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                <span>Trimite un mesaj echipei</span>
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-chalk text-asphalt">
                  <DevicePhoneMobileIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-cond text-2xl font-bold text-asphalt">Asistență WhatsApp</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Echipa noastră de suport răspunde candidaților din România și din diaspora pentru îndrumare tehnică și
                  administrativă.
                </p>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                <span>Deschide conversația WhatsApp</span>
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* Testimonials showcase */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
              <div>
                <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] text-asphalt md:text-5xl">
                  Experiențe ale candidaților
                </h2>
                <p className="mt-2 max-w-[58ch] text-base text-mute">
                  Recenzii reale despre pregătirea pe capitole, plata în tranșe și atestatul verificabil cu cod QR.
                </p>
              </div>
              <Link
                href="/verificare"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                <span>Verifică un atestat QR</span>
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <StaggerTestimonials items={TESTIMONIALS} />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
