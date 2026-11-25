"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  animate,
  motion,
  useInView,
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
  ClockIcon,
  ChartBarIcon,
  VideoCameraIcon,
  DocumentCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
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

import { Reveal, Pic, Parallax, DashLine, SplitWords, Magnetic, Tilt } from "./motion-kit";
import { EASE_OUT, CTA_HREF, btn, btnPrimary, btnGhostDark, btnGhostLight, card } from "@/lib/ui";
import { TESTIMONIALS } from "@/lib/testimonials";

/* ---------- hero ---------- */

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const a = (d: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: d, ease: EASE_OUT },
        };

  return (
    <section ref={ref} className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-asphalt text-white">
      {/* Photo plein cadre : couvre tout le hero, le texte est posé dessus. */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: bgY, scale: bgScale }}
        className="absolute inset-0 -z-10"
      >
        <Pic src="/media/autostrada-sibiu.webp" alt="" eager className="object-[50%_60%]" />
      </motion.div>
      {/* Voile sombre léger pour garder le texte lisible, la photo reste bien visible. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-asphalt/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-asphalt/85 via-asphalt/10 to-asphalt/40"
      />

      <motion.div
        style={reduce ? undefined : { y: textY }}
        className="mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:pb-24"
      >
        <motion.div
          {...a(0)}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-asphalt/75 px-3.5 py-1.5 text-xs font-medium tracking-wide text-chalk backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
          <span>Examen auto online · 100% în limba română</span>
        </motion.div>
        <h1 className="max-w-[20ch] font-cond text-4xl font-bold leading-[1.06] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
          <SplitWords text="Înveți. Dai testul. Primești atestatul." />
        </h1>
        <motion.p {...a(0.18)} className="mt-4 max-w-[46ch] text-base text-white/90 sm:text-lg">
          Cursuri pe capitole, evaluare adaptivă și test supravegheat, de acasă. O singură taxă, fără abonament.
        </motion.p>
        <motion.div {...a(0.3)} className="mt-7 flex flex-wrap gap-3">
          <Magnetic>
            <Link href={CTA_HREF} className={btnPrimary}>
              Începe înscrierea
            </Link>
          </Magnetic>
          <a href="#cum-functioneaza" className={btnGhostDark}>
            Vezi cum funcționează
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------- marquee of real signs ---------- */

const MARQUEE = [
  ["/media/stop-axente-sever.webp", "Oprire (STOP)"],
  ["/media/cedeaza-popa-tatu.webp", "Cedează trecerea"],
  ["/media/oprire-interzisa-bistrita.webp", "Oprirea interzisă"],
  ["/media/sens-giratoriu-timisoara.webp", "Sens giratoriu"],
  ["/media/copii-fagaras.webp", "Atenție, copii"],
  ["/media/lucrari-transfagarasan.webp", "Lucrări temporare"],
  ["/media/chisineu-cris.webp", "Direcții pe drum"],
  ["/media/marcaje-apold.webp", "Marcaje rutiere"],
] as const;

export function SignsMarquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <section aria-label="Indicatoare reale din România" className="overflow-hidden bg-asphalt py-6">
      <div className="marquee flex w-max">
        {items.map(([src, t], i) => (
          <figure
            key={`${src}-${i}`}
            aria-hidden={i >= MARQUEE.length}
            className="relative mr-4 h-28 w-44 shrink-0 overflow-hidden rounded"
          >
            <Pic src={src} alt={i < MARQUEE.length ? t : ""} />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-asphalt/85 to-transparent p-2 text-xs font-semibold text-chalk">
              {t}
            </figcaption>
          </figure>
        ))}
      </div>
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

// Imagine pentru secțiunea „Cine suntem”. Înlocuiește cu fotografia ta (persoană cu telefonul / atestatul).
const ABOUT_IMAGE = {
  src: "/media/calea-victoriei.webp",
  alt: "Trafic urban și indicator de trecere pentru pietoni pe Calea Victoriei din București",
};

export function About() {
  const principles = [
    ["Fără costuri ascunse", "O singură taxă pe categorie, plătită integral sau în tranșe. O vezi înainte de plată."],
    [
      "Pregătire reală",
      "Evaluarea adaptivă revine la ce ai greșit, iar examenul se deblochează doar după evaluarea globală.",
    ],
    [
      "Onestitate juridică",
      "Atestatul PermisStart confirmă pregătirea pe platformă. Nu este permis de conducere și nu înlocuiește examenul oficial.",
    ],
    ["Date protejate", "Actele de identitate sunt stocate criptat și șterse automat după 30 de zile."],
  ];
  return (
    <section id="despre-noi" className="bg-chalk py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <Parallax
            src={ABOUT_IMAGE.src}
            alt={ABOUT_IMAGE.alt}
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
              PermisStart este o platformă de pregătire teoretică și evaluare supravegheată pentru legislația rutieră din
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
              Despre PermisStart, pe larg
              <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- benefits ---------- */

export function Benefits() {
  const items = [
    { Icon: ClockIcon, t: "În ritmul tău", d: "Înveți și dai testul când vrei, de acasă, de pe telefon sau calculator." },
    { Icon: ChartBarIcon, t: "Evaluare adaptivă", d: "Întrebările revin exact pe temele la care greșești, nu la întâmplare." },
    { Icon: VideoCameraIcon, t: "Examen supravegheat", d: "Cameră activă, cronometru pe întrebare și raport complet la final." },
    { Icon: DocumentCheckIcon, t: "Atestat verificabil", d: "Serie unică și cod QR, pe care oricine le poate verifica public." },
  ];
  return (
    <section id="avantaje" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">De ce PermisStart</h2>
          <p className="mt-3 max-w-[58ch] text-lg text-mute">
            Tot ce ai nevoie ca să ajungi pregătit la examen, fără drumuri, fără cozi și fără abonament.
          </p>
        </Reveal>
        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, t, d }, i) => (
            <li key={t}>
              <Reveal delay={i * 0.07} className="group">
                <span className="grid h-16 w-16 place-items-center rounded border border-line bg-chalk transition-all duration-300 group-hover:-translate-y-1 group-hover:border-signal group-hover:bg-signal/20 group-hover:shadow-card">
                  <Icon className="h-8 w-8 text-asphalt" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-cond text-2xl font-bold">{t}</h3>
                <p className="mt-2 text-mute">{d}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- categories (short version, full list on /categorii) ---------- */

const BRIEF = [
  { codes: "AM", t: "Mopede și scutere ușoare", href: "/categorii/am", Icon: Bike },
  { codes: "A1 · A2 · A", t: "Motociclete", href: "/categorii/a", Icon: Bike },
  { codes: "B · B1", t: "Autoturisme", href: "/categorii/b", Icon: Car },
  { codes: "BE", t: "Autoturism cu remorcă", href: "/categorii/be", Icon: Caravan },
  { codes: "C · CE", t: "Camioane", href: "/categorii/c", Icon: Truck },
  { codes: "D", t: "Autobuze și microbuze", href: "/categorii/d", Icon: Bus },
];

export function Categories() {
  return (
    <section id="categorii" className="bg-chalk py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Reveal>
            <h2 className="font-cond text-4xl font-bold leading-[1.05] tracking-[-0.015em] md:text-5xl">
              Toate categoriile, într-un singur loc.
            </h2>
            <p className="mt-4 max-w-[52ch] text-lg text-mute">
              Capitolele, întrebările de examen și taxa depind de categorie. Alege-o pe a ta și vezi totul, înainte să
              plătești ceva.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Parallax
              src="/media/autostrada-sibiu.webp"
              alt="Autostrada A1 lângă Sibiu cu panou rutier de distanțe"
              className="mt-8 aspect-[4/3] rounded shadow-lift"
            />
          </Reveal>
          <Reveal delay={0.12}>
            <Link href="/categorii" className={`${btnPrimary} mt-8`}>
              Vezi toate categoriile
            </Link>
          </Reveal>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {BRIEF.map(({ codes, t, href, Icon }, i) => (
            <li key={codes}>
              <Reveal delay={i * 0.05}>
                <Link
                  href={href}
                  className="group flex items-center gap-4 px-2 py-5 transition-colors hover:bg-white sm:px-4"
                >
                  <span className="w-32 shrink-0 font-cond text-3xl font-bold text-asphalt">{codes}</span>
                  <span className="flex-1 text-mute group-hover:text-asphalt">{t}</span>
                  <Icon className="hidden h-6 w-6 text-asphalt/50 sm:block" aria-hidden="true" />
                  <ArrowUpRightIcon
                    className="h-5 w-5 text-sign transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
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
                <Tilt>
                  <div className={`${card} p-6 transition-shadow hover:shadow-lift`}>
                    <p className="font-cond text-2xl font-bold">{t}</p>
                    <p className="mt-2 text-mute">{d}</p>
                    <p className="mt-4 inline-block rounded-sm bg-signal/25 px-2.5 py-1 text-sm font-semibold">{tag}</p>
                  </div>
                </Tilt>
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
              <Tilt max={3}>
              <figure>
                <Parallax src={s.src} alt={s.alt} className="aspect-[16/10] rounded shadow-card">
                  <div className="absolute inset-0 bg-gradient-to-t from-asphalt/70 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-3 left-4 right-4 text-sm font-semibold text-chalk">
                    {s.title}
                  </figcaption>
                </Parallax>
              </figure>
              </Tilt>
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
              Atestatul PermisStart confirmă rezultatul obținut pe platformă. Nu este permis de conducere și nu înlocuiește
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
    "De ce să mă pregătesc și să dau examenul pe PermisStart?",
    "PermisStart îți oferă o pregătire completă, structurată pe capitole, cu fotografii reale ale indicatoarelor din România, lecții audio și un motor adaptiv care insistă exact pe temele la care mai greșești. Când ajungi la evaluarea oficială a autorităților, cunoști deja fiecare regulă și ai trecut printr-un examen supravegheat în condiții reale — fără surprize și fără emoții inutile.",
  ],
  [
    "La ce îmi folosește atestatul de reușită PermisStart?",
    "Atestatul de reușită PermisStart (PDF cu serie unică și cod QR verificabil public) certifică oficial pe platformă faptul că ai parcurs programa categoriei tale și ai promovat testul teoretic supravegheat. Îl primești pe e-mail în maximum 3 zile și îl poți prezenta instructorului, școlii de șoferi sau angajatorului ca dovadă clară a nivelului tău. Documentul confirmă pregătirea pe PermisStart și nu înlocuiește permisul de conducere eliberat de autorități.",
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
    "Pentru ca atestatul tău PermisStart să aibă valoare reală și credibilitate la verificare, confirmăm că persoana înscrisă este cea care susține examenul. Documentele sunt stocate criptat și șterse automat după 30 de zile (conform GDPR).",
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
            Echipa PermisStart răspunde în limba română pentru întrebări legate de categorii, plata în tranșe, verificarea
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
            <Magnetic>
              <Link href={CTA_HREF} className={`${btn} bg-asphalt text-chalk shadow-lift hover:bg-ink`}>
                Începe înscrierea
              </Link>
            </Magnetic>
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


/* ---------- stats band (real product facts only) ---------- */

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) {
      setN(to);
      return;
    }
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: EASE_OUT, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, to]);
  return <span ref={ref}>{n}</span>;
}

export function StatsBand() {
  const facts = [
    { n: 10, l: "categorii de permis acoperite" },
    { n: 7, l: "pași, de la înscriere la atestat" },
    { n: 3, l: "zile, cel mult, până primești atestatul" },
    { n: 26, l: "întrebări la examenul pentru categoria B" },
  ];
  return (
    <section className="relative isolate overflow-hidden text-chalk">
      <div className="absolute inset-0 -z-10">
        <Parallax src="/media/dn7-brezoi.webp" alt="" className="h-full" />
      </div>
      <div className="absolute inset-0 -z-10 bg-asphalt/85" />
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">PermisStart, concret</h2>
        </Reveal>
        <dl className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.l} delay={i * 0.08}>
              <div className="border-t border-chalk/25 pt-5">
                <dt className="font-cond text-6xl font-bold text-signal sm:text-7xl">
                  <CountUp to={f.n} />
                </dt>
                <dd className="mt-2 max-w-[22ch] text-chalk/80">{f.l}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------- testimonials (hidden until real ones exist in lib/testimonials.ts) ---------- */

export function Testimonials() {
  const items = TESTIMONIALS;
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || hover || items.length < 2) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % items.length), 7000);
    return () => window.clearInterval(id);
  }, [reduce, hover, items.length]);

  if (items.length === 0) return null;
  const t = items[i % items.length];
  const go = (d: number) => setI((p) => (p + d + items.length) % items.length);

  return (
    <section id="marturii" className="bg-asphalt py-24 text-chalk">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">Ce spun candidații</h2>
        </Reveal>
        <div
          className="mt-10"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="grid items-center gap-8 md:grid-cols-[14rem_1fr]"
            >
              {t.photo ? (
                <div className="aspect-square w-40 overflow-hidden rounded md:w-full">
                  <Pic src={t.photo} alt={`Fotografie ${t.name}`} />
                </div>
              ) : (
                <div className="hidden md:block" />
              )}
              <div>
                <blockquote className="font-cond text-2xl leading-snug sm:text-3xl">{t.quote}</blockquote>
                <figcaption className="mt-6">
                  <p className="text-lg font-semibold">{t.name}</p>
                  {t.role ? <p className="text-chalk/70">{t.role}</p> : null}
                  {t.rating ? (
                    <p className="mt-2 flex gap-1" aria-label={`${t.rating} din 5 stele`}>
                      {Array.from({ length: 5 }).map((_, k) => (
                        <StarIcon
                          key={k}
                          className={`h-5 w-5 ${k < (t.rating ?? 0) ? "text-signal" : "text-chalk/25"}`}
                          aria-hidden="true"
                        />
                      ))}
                    </p>
                  ) : null}
                </figcaption>
              </div>
            </motion.figure>
          </AnimatePresence>
          {items.length > 1 ? (
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Mărturia anterioară"
                className="grid h-11 w-11 place-items-center rounded border border-chalk/40 hover:bg-chalk/10"
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Mărturia următoare"
                className="grid h-11 w-11 place-items-center rounded border border-chalk/40 hover:bg-chalk/10"
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <span className="ml-2 text-sm text-chalk/60">
                {i + 1} / {items.length}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
