"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Car, Bike, Truck, Bus, Caravan } from "lucide-react";
import {
  ChevronDownIcon,
  ArrowUpRightIcon,
  PlayIcon,
  PauseIcon,
  CheckIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  GlobeEuropeAfricaIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { ContactForm } from "./contact-form";
import { LEGAL_ENTITY } from "@/lib/config";
import {
  SignupStepMock,
  KycStepMock,
  PayMock,
  ChapterMock,
  AdaptiveMock,
  GlobalEvalMock,
  ExamMock,
  CertMock,
} from "./mockups";

const CTA_HREF = "/inscriere";
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const btn =
  "inline-flex min-h-[48px] items-center justify-center rounded px-6 py-3 font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0";
const btnPrimary = `${btn} bg-signal text-asphalt shadow-card hover:bg-signal-deep`;
const btnGhostDark = `${btn} border border-chalk/50 text-chalk hover:bg-chalk/10`;
const btnGhostLight = `${btn} border border-asphalt text-asphalt hover:bg-asphalt hover:text-chalk`;
const card = "rounded border border-line bg-white shadow-card";

/* ---------- primitives ---------- */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

function Pic({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const avif = src.replace(/\.webp$/, ".avif");
  return (
    <picture className="block h-full w-full">
      <source srcSet={avif} type="image/avif" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}

/** Photo that drifts slowly against the scroll. The frame clips it. */
function Parallax({
  src,
  alt,
  className = "",
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} className={`relative overflow-hidden bg-asphalt ${className}`}>
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-x-0 -top-[10%] h-[120%]">
        <Pic src={src} alt={alt} />
      </motion.div>
      {children}
    </div>
  );
}

function DashLine({ color = "#18202b" }: { color?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className="h-1 w-full"
      style={{ backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 22px, transparent 22px 40px)` }}
      animate={reduce ? undefined : { backgroundPositionX: ["0px", "-40px"] }}
      transition={reduce ? undefined : { duration: 1.4, ease: "linear", repeat: Infinity }}
    />
  );
}

/* ---------- hero ---------- */

const ROAD = "M-40 190 C 220 110, 480 230, 780 150 S 1260 70, 1480 130";

function HeroRoad() {
  const reduce = useReducedMotion();
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 240"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full sm:h-56"
    >
      <path d={ROAD} fill="none" stroke="#f5f6f3" strokeOpacity="0.55" strokeWidth="78" />
      <path id="hero-road-path" d={ROAD} fill="none" stroke="#0f151d" strokeWidth="72" />
      <path d={ROAD} fill="none" stroke="#f2b705" strokeWidth="3" className="road-flow" />
      <g transform={reduce ? "translate(260 150)" : undefined}>
        <g transform="translate(-26 -13)">
          <rect x="6" y="-2" width="12" height="4" rx="1" fill="#0f151d" />
          <rect x="32" y="-2" width="12" height="4" rx="1" fill="#0f151d" />
          <rect x="6" y="24" width="12" height="4" rx="1" fill="#0f151d" />
          <rect x="32" y="24" width="12" height="4" rx="1" fill="#0f151d" />
          <rect width="52" height="26" rx="4" fill="#f2b705" />
          <rect x="30" y="4" width="12" height="18" rx="2" fill="#18202b" />
          <rect x="8" y="5" width="9" height="16" rx="2" fill="#18202b" fillOpacity="0.6" />
        </g>
        {!reduce && (
          <animateMotion dur="16s" repeatCount="indefinite" rotate="auto">
            <mpath href="#hero-road-path" />
          </animateMotion>
        )}
      </g>
    </svg>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const a = (d: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: d, ease: EASE_OUT },
        };

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink text-chalk">
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: bgY, scale: bgScale }}
        className="absolute inset-0 -z-10"
      >
        <Pic
          src="/media/transfagarasan.webp"
          alt=""
          eager
        />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-transparent to-ink/50" />

      <motion.div
        style={reduce ? undefined : { y: textY }}
        className="mx-auto w-full max-w-6xl px-5 pb-48 pt-32 sm:pb-56"
      >
        <motion.h1
          {...a(0.05)}
          className="max-w-[16ch] font-cond text-5xl font-bold leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-7xl"
        >
          Înveți regulile drumului. Dai testul online. Primești atestatul.
        </motion.h1>
        <motion.p {...a(0.18)} className="mt-6 max-w-[54ch] text-lg text-chalk/85 sm:text-xl">
          Cursuri pe capitole cu fotografii reale din România, o evaluare care se adaptează la greșelile tale și un test
          supravegheat, din confortul casei. O singură taxă, fără abonament.
        </motion.p>
        <motion.div {...a(0.3)} className="mt-8 flex flex-wrap gap-3">
          <Link href={CTA_HREF} className={btnPrimary}>
            Începe înscrierea
          </Link>
          <a href="#cum-functioneaza" className={btnGhostDark}>
            Vezi cum funcționează
          </a>
        </motion.div>
        <motion.ul
          {...a(0.42)}
          className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-chalk/20 pt-5 text-sm text-chalk/80"
        >
          <li className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-signal" aria-hidden="true" />
            Fără abonament
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-signal" aria-hidden="true" />
            Plată integrală sau în tranșe
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-signal" aria-hidden="true" />
            Atestat pe e-mail în maximum 3 zile
          </li>
        </motion.ul>
      </motion.div>

      <HeroRoad />
    </section>
  );
}

/* ---------- trust ---------- */

export function Trust() {
  const items = [
    { Icon: CreditCardIcon, t: "Plată securizată prin Stripe" },
    { Icon: ShieldCheckIcon, t: "Date personale conform GDPR" },
    { Icon: GlobeEuropeAfricaIcon, t: "Servere în Uniunea Europeană" },
    { Icon: QrCodeIcon, t: "Atestat cu cod QR verificabil" },
  ];
  return (
    <div className="border-b border-line bg-white">
      <ul className="mx-auto grid max-w-6xl gap-5 px-5 py-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, t }, i) => (
          <Reveal key={t} delay={i * 0.06}>
            <li className="flex items-center gap-3 text-asphalt">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-signal/20 text-asphalt">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              {t}
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/* ---------- about ---------- */

export function About() {
  const principles = [
    ["Fără costuri ascunse", "O singură taxă pe categorie, plătită integral sau în tranșe. O vezi înainte de plată."],
    [
      "Pregătire reală",
      "Evaluarea adaptivă revine la ce ai greșit, iar examenul se deblochează doar după evaluarea globală.",
    ],
    [
      "Onestitate juridică",
      "Atestatul Drumo confirmă pregătirea pe platformă. Nu este permis de conducere și nu înlocuiește examenul oficial.",
    ],
    ["Date protejate", "Actele de identitate sunt stocate criptat și șterse automat după 30 de zile."],
  ];
  return (
    <section id="despre-noi" className="bg-chalk py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <Parallax
            src="/media/bucuresti-ploaie.webp"
            alt="Bulevard din București după ploaie, cu lucrări și limitare de viteză"
            className="aspect-[4/5] rounded shadow-lift"
          >
            <div className="absolute bottom-4 left-4 right-4 rounded bg-white p-4 text-sm text-asphalt shadow-card sm:right-auto sm:max-w-[16rem]">
              Toate fotografiile din cursuri sunt reale, făcute pe drumurile din România.
            </div>
          </Parallax>
        </Reveal>
        <div>
          <Reveal>
            <h2 className="font-cond text-4xl font-bold leading-[1.05] tracking-[-0.015em] md:text-5xl">
              Făcut pentru cei care vor să înțeleagă regulile, nu doar să le memoreze.
            </h2>
            <p className="mt-5 max-w-[60ch] text-lg text-mute">
              Drumo este o platformă de pregătire teoretică și evaluare supravegheată pentru legislația rutieră din
              România. Lecțiile pornesc de la Codul rutier (OUG 195/2002 și HG 1391/2006) și de la situații reale de pe
              drum, nu din desene generice.
            </p>
          </Reveal>
          <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {principles.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="border-l-2 border-signal pl-4">
                  <dt className="font-semibold text-asphalt">{t}</dt>
                  <dd className="mt-1 text-sm text-mute">{d}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
          <Reveal delay={0.2}>
            <Link
              href="/despre-noi"
              className="mt-8 inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
            >
              Despre Drumo, pe larg
              <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- categories ---------- */

const tileBase =
  "group flex h-full flex-col overflow-hidden rounded border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift";

function CatTile({
  img,
  alt,
  tag,
  title,
  text,
  meta,
  href,
  cta,
  Icon,
  delay,
}: {
  img: string;
  alt: string;
  tag: string;
  title: string;
  text: string;
  meta?: string;
  href: string;
  cta: string;
  Icon: typeof Car;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="md:col-span-4">
      <Link href={href} className={tileBase}>
        <Parallax src={img} alt={alt} className="aspect-[16/10]">
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt/70 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-sm bg-signal px-2 py-1 text-xs font-semibold text-asphalt">
            {tag}
          </span>
        </Parallax>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-cond text-2xl font-bold">{title}</h3>
            <Icon className="h-6 w-6 text-asphalt/70 transition-colors group-hover:text-signal-deep" aria-hidden="true" />
          </div>
          <p className="mt-2 flex-1 text-sm text-mute">{text}</p>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-sm">
            <span className="text-mute">{meta}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-sign group-hover:text-asphalt">
              {cta}
              <ArrowUpRightIcon
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function Categories() {
  return (
    <section id="categorii" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
            Alegi categoria. Restul se adaptează.
          </h2>
          <p className="mt-3 max-w-[60ch] text-lg text-mute">
            Capitolele, întrebările și taxa depind de categoria de permis. Suma exactă o vezi la înscriere, înainte să
            plătești.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12">
          <Reveal className="md:col-span-12">
            <Link href="/categorii/b" className={`${tileBase} md:flex-row`}>
              <Parallax
                src="/media/autostrada-sibiu.webp"
                alt="Autostrada A1 lângă Sibiu cu panou rutier de distanțe"
                className="aspect-[16/9] md:aspect-auto md:min-h-[22rem] md:w-3/5"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-asphalt/60 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-sm bg-signal px-2.5 py-1 text-xs font-semibold text-asphalt">
                  Cea mai aleasă
                </span>
              </Parallax>
              <div className="flex flex-1 flex-col justify-center p-6 md:p-10">
                <div className="flex items-center gap-3">
                  <Car className="h-7 w-7 text-signal-deep" aria-hidden="true" />
                  <p className="text-sm font-semibold text-mute">Autoturisme până la 3.500 kg</p>
                </div>
                <h3 className="mt-2 font-cond text-4xl font-bold sm:text-5xl">Categoria B · B1</h3>
                <p className="mt-4 text-mute">
                  Autovehicule cu cel mult 8 locuri în afara conducătorului și masă totală maximă autorizată de până la
                  3.500 kg (inclusiv cvadricicluri B1 de la 16 ani).
                </p>
                <ul className="mt-5 space-y-2 text-sm text-asphalt">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-ok" aria-hidden="true" />
                    26 de întrebări, minimum 22 corecte, de la 18 ani
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-ok" aria-hidden="true" />6 capitole complete și simulare de 26
                    de întrebări
                  </li>
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-sign group-hover:text-asphalt">
                  Vezi capitolele categoriei B
                  <ArrowUpRightIcon
                    className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </Reveal>

          <CatTile
            delay={0}
            img="/media/transfagarasan.webp"
            alt="Serpentinele drumului Transfăgărășan"
            tag="De la 16 ani"
            title="Categoria A1 · A2 · A"
            text="Motociclete ușoare (125 cm³), medii (≤ 35 kW) și fără limită de putere, cu reguli dedicate pentru două roți."
            meta="20 de întrebări, minimum 17"
            href="/categorii/a"
            cta="Vezi categoria"
            Icon={Bike}
          />
          <CatTile
            delay={0.06}
            img="/media/nadlac-frontiera.webp"
            alt="Panouri de semnalizare și benzi dedicate pentru camioane la punctul rutier Nădlac"
            tag="Transport marfă"
            title="Categoria C · CE"
            text="Camioane și ansambluri articulate: mase maxime, timpi de conducere, tahograf și limite diferențiate."
            meta="26 de întrebări · 21+ ani"
            href="/categorii/c"
            cta="Vezi categoria"
            Icon={Truck}
          />
          <CatTile
            delay={0.12}
            img="/media/calea-victoriei.webp"
            alt="Trafic urban și indicator de trecere pentru pietoni pe Calea Victoriei din București"
            tag="De la 16 ani"
            title="Categoria AM"
            text="Mopede și scutere ușoare (max. 45 km/h, ≤ 50 cm³ sau 4 kW). Chestionar de 20 de întrebări."
            href="/categorii/am"
            cta="Vezi categoria"
            Icon={Bike}
          />
          <CatTile
            delay={0.06}
            img="/media/dn7-brezoi.webp"
            alt="Drumul național DN7 (Valea Oltului) lângă Brezoi cu marcaje și indicatoare"
            tag="Remorcă 750–3.500 kg"
            title="Categoria BE"
            text="Autoturism categoria B cu remorcă grea: cuplare, repartizarea sarcinii și distanțe de oprire."
            href="/categorii/be"
            cta="Vezi categoria"
            Icon={Caravan}
          />
          <CatTile
            delay={0.12}
            img="/media/marcaje-apold.webp"
            alt="Marcaje rutiere de bandă dedicată autobuzelor și trecere de pietoni în Apold"
            tag="Transport persoane"
            title="Categoria D"
            text="Autobuze și microbuze cu peste 8+1 locuri: prioritatea la ieșirea din alveole și siguranța pasagerilor."
            href="/categorii/d"
            cta="Vezi categoria"
            Icon={Bus}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- how it works (3 phases) ---------- */

const phases = [
  {
    t: "Alegi categoria și te înscrii",
    d: "Spui ce categorie vrei, îți confirmi identitatea cu un act și un selfie și plătești taxa, integral sau în tranșe. Cursurile se deschid de la prima plată.",
    img: "/media/chisineu-cris.webp",
    alt: "Panou rutier de presemnalizare a direcțiilor spre Oradea și Arad",
  },
  {
    t: "Înveți și te evaluezi",
    d: "Capitole cu text, fotografii reale și audio, urmate de un test. Evaluarea adaptivă revine la ce ai greșit, iar evaluarea globală îți spune sincer dacă ești pregătit.",
    img: "/media/copii-fagaras.webp",
    alt: "Indicatorul de avertizare Copii în Făgăraș",
  },
  {
    t: "Dai testul și primești atestatul",
    d: "Când taxa este achitată integral și evaluarea e trecută, deschizi sala de examen. Rezultatul apare imediat, iar atestatul ajunge pe e-mail în maximum 3 zile.",
    img: "/media/drum-dn7a.webp",
    alt: "Drumul DN7A de-a lungul unei văi împădurite din județul Vâlcea",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section id="cum-functioneaza" className="bg-asphalt py-24 text-chalk">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2 className="font-cond text-4xl font-bold leading-[1.05] tracking-[-0.015em] md:text-5xl">
              Cum funcționează, în trei etape.
            </h2>
            <p className="mt-5 max-w-[44ch] text-lg text-chalk/75">
              Un singur traseu, de la înscriere până la atestat. Fiecare etapă se deblochează pe rând, ca să ajungi la
              examen cu adevărat pregătit.
            </p>
            <a href="#parcurs" className={`${btnPrimary} mt-8`}>
              Vezi cei 7 pași în detaliu
            </a>
          </Reveal>
        </div>

        <ol ref={ref} className="relative space-y-16 pl-14 sm:pl-16">
          <span aria-hidden="true" className="absolute bottom-2 left-[19px] top-2 w-0.5 bg-chalk/15 sm:left-[23px]" />
          <motion.span
            aria-hidden="true"
            style={reduce ? { scaleY: 1 } : { scaleY }}
            className="absolute bottom-2 left-[19px] top-2 w-0.5 origin-top bg-signal sm:left-[23px]"
          />
          {phases.map((p, i) => (
            <li key={p.t} className="relative">
              <span className="absolute -left-14 top-0 grid h-10 w-10 place-items-center rounded bg-signal font-cond text-xl font-bold text-asphalt sm:-left-16 sm:h-12 sm:w-12 sm:text-2xl">
                {i + 1}
              </span>
              <Reveal>
                <h3 className="font-cond text-3xl font-bold sm:text-4xl">{p.t}</h3>
                <p className="mt-3 max-w-[56ch] text-chalk/75">{p.d}</p>
                <Parallax src={p.img} alt={p.alt} className="mt-6 aspect-[16/9] rounded shadow-lift" />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- detailed journey (7 steps) ---------- */

const steps = [
  { t: "Înscriere", d: "Nume, contact, țara și categoria de permis.", v: <SignupStepMock /> },
  {
    t: "Verificare identitate",
    d: "Fotografie a actului și un selfie rapid, ca să știm că tu dai examenul.",
    v: <KycStepMock />,
  },
  { t: "Plată", d: "Integral sau în tranșe. Cursurile se deblochează de la prima plată.", v: <PayMock /> },
  {
    t: "Cursuri pe capitole",
    d: "Rezumat, curs detaliat cu imagini reale și audio, apoi testul capitolului.",
    v: <ChapterMock />,
  },
  { t: "Evaluare adaptivă", d: "Întrebările următoare se aleg după greșelile tale.", v: <AdaptiveMock /> },
  {
    t: "Evaluare globală",
    d: "Toate capitolele la un loc. Îți arată dacă ești pregătit pentru examen.",
    v: <GlobalEvalMock />,
  },
  {
    t: "Examen și atestat",
    d: "Dai testul când vrei, după plata integrală. Atestatul vine pe e-mail în maximum 3 zile.",
    v: <ExamMock />,
  },
];

export function Journey() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !auto) return;
    const id = window.setInterval(() => setI((prev) => (prev + 1) % steps.length), 5200);
    return () => window.clearInterval(id);
  }, [auto, reduce]);

  const selectStep = (index: number) => {
    setI(index);
    setAuto(false);
  };

  return (
    <section id="parcurs" className="bg-chalk py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
              Șapte pași, de la înscriere la atestat
            </h2>
            {!reduce && (
              <button
                type="button"
                onClick={() => setAuto((v) => !v)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded border border-line bg-white px-3 text-sm font-medium text-mute hover:border-asphalt hover:text-asphalt"
              >
                {auto ? <PauseIcon className="h-4 w-4" aria-hidden="true" /> : <PlayIcon className="h-4 w-4" aria-hidden="true" />}
                {auto ? "Redare automată" : "Alege un pas"}
              </button>
            )}
          </div>

          <LayoutGroup id="journey-steps">
            <ol className="mt-8 space-y-2">
              {steps.map((s, k) => {
                const active = i === k;
                return (
                  <li key={s.t} className="relative">
                    {active && (
                      <motion.span
                        layoutId="journey-active-rail"
                        transition={{ duration: 0.32, ease: EASE_OUT }}
                        className="absolute inset-y-0 left-0 w-1 rounded-sm bg-signal"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => selectStep(k)}
                      aria-current={active ? "step" : undefined}
                      className={`flex w-full items-start justify-between gap-3 rounded py-3 pl-5 pr-3 text-left transition-colors ${
                        active ? "bg-white shadow-card" : "hover:bg-white/60"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-medium text-mute">
                          Pasul {k + 1} din {steps.length}
                        </span>
                        <h3
                          className={`font-cond text-2xl font-bold transition-colors ${
                            active ? "text-asphalt" : "text-asphalt/70"
                          }`}
                        >
                          {s.t}
                        </h3>
                        <p className={`mt-1 text-sm text-mute transition-all ${active ? "block" : "hidden sm:block"}`}>
                          {s.d}
                        </p>
                      </div>
                      <span
                        className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-sm font-cond text-sm font-bold transition-colors ${
                          active ? "bg-signal text-asphalt" : "bg-line text-mute"
                        }`}
                      >
                        {k + 1}
                      </span>
                    </button>
                    {active ? <div className="mt-3 lg:hidden">{s.v}</div> : null}
                  </li>
                );
              })}
            </ol>
          </LayoutGroup>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-28">
            <div className="mb-3 flex items-center justify-between text-sm text-mute">
              <span>
                Pasul {i + 1} din {steps.length}: {steps[i].t}
              </span>
              <div className="flex items-center gap-1.5">
                {steps.map((s, idx) => (
                  <button
                    key={s.t}
                    type="button"
                    aria-label={`Pasul ${idx + 1}: ${s.t}`}
                    onClick={() => selectStep(idx)}
                    className={`h-2 rounded-sm transition-all duration-300 ${
                      idx === i ? "w-6 bg-asphalt" : "w-2 bg-line hover:bg-mute"
                    }`}
                  />
                ))}
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.34, ease: EASE_OUT }}
              >
                {steps[i].v}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- payment ---------- */

export function Payment() {
  const opts = [
    ["Plătești tot acum", "Cursurile și examenul sunt deblocate imediat. Faci totul în ritmul tău.", "Cursuri și examen"],
    [
      "Plătești în tranșe",
      "Prima parte deblochează cursurile. Examenul se deblochează când taxa categoriei este achitată integral.",
      "Cursuri acum, examen după",
    ],
  ];
  const methods = [
    [CreditCardIcon, "Card bancar (Visa / Mastercard)"],
    [DevicePhoneMobileIcon, "Apple Pay și Google Pay"],
    [BuildingLibraryIcon, "Transfer instant (RON și EUR)"],
    [EnvelopeIcon, "Chitanță pe e-mail"],
  ] as const;
  return (
    <section id="plata" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
            O singură taxă, plătită cum îți convine
          </h2>
          <p className="mt-3 max-w-[60ch] text-lg text-mute">
            Fără abonament și fără pachete. Taxa depinde de categorie și o vezi înainte de plată. Primești chitanță pe
            e-mail după fiecare plată.
          </p>
        </Reveal>
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            {opts.map(([t, d, tag], k) => (
              <Reveal key={t} delay={k * 0.07}>
                <div className={`${card} p-6 transition-shadow hover:shadow-lift`}>
                  <p className="font-cond text-2xl font-bold">{t}</p>
                  <p className="mt-2 text-mute">{d}</p>
                  <p className="mt-4 inline-block rounded-sm bg-signal/25 px-2.5 py-1 text-sm font-semibold">{tag}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.14}>
              <ul className="grid gap-3 rounded border border-line bg-chalk p-5 text-sm sm:grid-cols-2">
                {methods.map(([Icon, label]) => (
                  <li key={label} className="flex items-center gap-2.5">
                    <Icon className="h-5 w-5 shrink-0 text-sign" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-mute">
                <Link href="/rambursari" className="font-semibold text-sign underline underline-offset-4 hover:text-asphalt">
                  Vezi politica de rambursare
                </Link>
                .
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.08}>
            <PayMock />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- exam ---------- */

export function Exam() {
  const f = [
    ["Cronometru pe fiecare întrebare", "Trece automat la următoarea, fără întoarcere."],
    ["Audio automat", "Întrebările se citesc automat (Reascultă / Fără sunet)."],
    ["Cameră activă", "Rămâne pornită pe toată durata testului."],
    ["Ieșirea din pagină", "Se înregistrează cu oră exactă și apare în raport."],
    ["Întrebări aleatorii", "Fiecare candidat primește alt set securizat."],
    ["Rezultat imediat", "Scor, Admis / Respins, alerte și explicații."],
  ];
  return (
    <section id="examen" className="bg-ink py-24 text-chalk">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal>
          <ExamMock />
        </Reveal>
        <div>
          <Reveal>
            <h2 className="font-cond text-4xl font-bold leading-[1.05] tracking-[-0.015em] md:text-5xl">
              Un examen în condiții reale
            </h2>
            <p className="mt-4 max-w-[56ch] text-lg text-chalk/75">
              Testul se deblochează când taxa este plătită integral, identitatea este aprobată și evaluarea globală
              arată că ești pregătit. Tu alegi momentul.
            </p>
          </Reveal>
          <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {f.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05}>
                <div className="flex gap-3">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold">{t}</dt>
                    <dd className="mt-0.5 text-sm text-chalk/70">{d}</dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------- real signs ---------- */

const FEATURED_SIGNS = [
  {
    src: "/media/stop-axente-sever.webp",
    alt: "Indicatorul Oprire (Stop) în Axente Sever",
    title: "Oprire (STOP) · Axente Sever",
    span: "md:col-span-7",
  },
  {
    src: "/media/oprire-interzisa-bistrita.webp",
    alt: "Indicatorul Oprirea interzisă pe o stradă din Bistrița",
    title: "Oprirea interzisă · Bistrița",
    span: "md:col-span-5",
  },
  {
    src: "/media/sens-giratoriu-timisoara.webp",
    alt: "Sens giratoriu în Piața Ionel I. C. Brătianu din Timișoara",
    title: "Sens giratoriu · Timișoara",
    span: "md:col-span-5",
  },
  {
    src: "/media/lucrari-transfagarasan.webp",
    alt: "Panou galben de avertizare Pericol de accidente pentru lucrări pe Transfăgărășan",
    title: "Lucrări temporare · Transfăgărășan",
    span: "md:col-span-7",
  },
];

export function Signs() {
  return (
    <section className="bg-chalk py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
            Indicatoare reale, nu desene
          </h2>
          <p className="mt-3 max-w-[62ch] text-lg text-mute">
            Lecțiile și întrebările folosesc fotografii reale ale indicatoarelor din România și situații de drum.{" "}
            <Link
              href="/credite-imagini"
              className="font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
            >
              Sursa și licența fiecărei imagini
            </Link>{" "}
            sunt publice.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-12">
          {FEATURED_SIGNS.map((s, idx) => (
            <Reveal key={s.src} delay={(idx % 2) * 0.08} className={s.span}>
              <figure>
                <Parallax src={s.src} alt={s.alt} className="aspect-[16/10] rounded shadow-card">
                  <div className="absolute inset-0 bg-gradient-to-t from-asphalt/70 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-3 left-4 right-4 text-sm font-semibold text-chalk">
                    {s.title}
                  </figcaption>
                </Parallax>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- certificate ---------- */

export function Certificate() {
  const facts = ["Număr unic de serie", "Cod QR pe document", "Verificare publică, fără cont", "Pe e-mail în maximum 3 zile"];
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <h2 className="font-cond text-4xl font-bold leading-[1.05] tracking-[-0.015em] md:text-5xl">
              Atestatul ajunge pe e-mail
            </h2>
            <p className="mt-4 max-w-[56ch] text-lg text-mute">
              După examen, atestatul de reușită este trimis automat pe e-mail în maximum 3 zile. Are număr unic și cod
              QR, iar oricine poate verifica autenticitatea pe{" "}
              <Link
                href="/verificare"
                className="font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                pagina publică de verificare
              </Link>
              .
            </p>
          </Reveal>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {facts.map((t, i) => (
              <Reveal key={t} delay={i * 0.05}>
                <li className="flex items-center gap-2.5 text-asphalt">
                  <CheckIcon className="h-5 w-5 shrink-0 text-ok" aria-hidden="true" />
                  {t}
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.2}>
            <p className="mt-6 rounded border-l-4 border-signal bg-chalk p-4 text-sm text-mute">
              Atestatul Drumo confirmă rezultatul obținut pe platformă. Nu este permis de conducere și nu înlocuiește
              examenul oficial organizat de autorități.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.08}>
          <CertMock />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- faq ---------- */

const faq = [
  [
    "De ce să mă pregătesc și să dau examenul pe Drumo?",
    "Drumo îți oferă o pregătire completă, structurată pe capitole, cu fotografii reale ale indicatoarelor din România, lecții audio și un motor adaptiv care insistă exact pe temele la care mai greșești. Când ajungi la evaluarea oficială a autorităților, cunoști deja fiecare regulă și ai trecut printr-un examen supravegheat în condiții reale — fără surprize și fără emoții inutile.",
  ],
  [
    "La ce îmi folosește atestatul de reușită Drumo?",
    "Atestatul de reușită Drumo (PDF cu serie unică și cod QR verificabil public) certifică oficial pe platformă faptul că ai parcurs programa categoriei tale și ai promovat testul teoretic supravegheat. Îl primești pe e-mail în maximum 3 zile și îl poți prezenta instructorului, școlii de șoferi sau angajatorului ca dovadă clară a nivelului tău. Documentul confirmă pregătirea pe Drumo și nu înlocuiește permisul de conducere eliberat de autorități.",
  ],
  [
    "Pot plăti în tranșe?",
    "Da. Prima plată deblochează imediat toate cursurile pe capitole, lecțiile audio și evaluările adaptive. Restul taxei se achită în maximum 2–3 tranșe, înainte de a intra în sala de examen.",
  ],
  [
    "Cât costă și există abonament?",
    "Nu există abonament lunar sau costuri ascunse. Plătești o singură taxă pentru categoria aleasă, afișată clar la înscriere (în RON sau EUR), înainte de orice plată.",
  ],
  [
    "Ce se întâmplă dacă nu trec din prima?",
    "Primești pe loc scorul, analiza fiecărei întrebări și explicația juridică a răspunsului corect, iar motorul adaptiv îți pregătește un plan de recapitulare pe capitolele slabe. Condițiile pentru o nouă încercare sunt afișate transparent înainte de plată.",
  ],
  [
    "De ce cereți act de identitate și selfie?",
    "Pentru ca atestatul tău Drumo să aibă valoare reală și credibilitate la verificare, confirmăm că persoana înscrisă este cea care susține examenul. Documentele sunt stocate criptat și șterse automat după 30 de zile (conform GDPR).",
  ],
];

export function Faq() {
  return (
    <section id="faq" className="bg-chalk py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <Reveal>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">Întrebări frecvente</h2>
          <p className="mt-3 text-mute">
            Nu găsești răspunsul?{" "}
            <a href="#contact" className="font-semibold text-sign underline underline-offset-4 hover:text-asphalt">
              Scrie-ne direct
            </a>
            .
          </p>
        </Reveal>
        <div className="space-y-3">
          {faq.map(([q, a], i) => (
            <Reveal key={q} delay={i * 0.04}>
              <details className={`group ${card} open:shadow-lift`}>
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                  <span>{q}</span>
                  <ChevronDownIcon
                    className="h-5 w-5 shrink-0 text-mute transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="border-t border-line px-5 py-4 text-mute">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- contact ---------- */

export function ContactSection() {
  const rows = [
    [EnvelopeIcon, "E-mail suport", LEGAL_ENTITY.contactEmail],
    [PhoneIcon, "Telefon", LEGAL_ENTITY.phonePlaceholder],
    [MapPinIcon, "Sediu", LEGAL_ENTITY.addressPlaceholder],
  ] as const;
  return (
    <section id="contact" className="bg-white py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
            Ai o întrebare? Scrie-ne direct.
          </h2>
          <p className="mt-3 max-w-[56ch] text-lg text-mute">
            Echipa Drumo răspunde în limba română pentru întrebări legate de categorii, plata în tranșe, verificarea
            identității (KYC) sau atestatul QR.
          </p>
          <dl className="mt-8 space-y-5">
            {rows.map(([Icon, label, value]) => (
              <div key={label} className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded bg-signal/25">
                  <Icon className="h-5 w-5 text-asphalt" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-sm text-mute">{label}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- final call to action ---------- */

export function FinalCta() {
  return (
    <section id="inscriere" className="relative overflow-hidden bg-signal py-24 text-asphalt">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="max-w-[18ch] font-cond text-5xl font-bold leading-[1.02] tracking-[-0.02em] sm:text-6xl">
            Alege categoria și începe azi.
          </h2>
          <p className="mt-4 max-w-[48ch] text-lg text-asphalt/80">
            Înscrierea durează câteva minute. Vezi taxa înainte să plătești.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={CTA_HREF}
              className={`${btn} bg-asphalt text-chalk shadow-lift hover:bg-ink`}
            >
              Începe înscrierea
            </Link>
            <a href="#categorii" className={btnGhostLight}>
              Vezi categoriile
            </a>
          </div>
        </Reveal>
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <DashLine />
      </div>
    </section>
  );
}
