"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Car, Bike, Truck, Bus } from "lucide-react";
import {
  ChevronDownIcon,
  ArrowUpRightIcon,
  PlayIcon,
  PauseIcon,
  CheckIcon,
  CreditCardIcon,
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
} from "@heroicons/react/24/outline";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { PaymentMethodBadges } from "./payment-badges";
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
import { EASE_OUT, CTA_HREF, btn, btnPrimary, btnGhostLight, card } from "@/lib/ui";
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
        <h1 className="max-w-[22ch] font-cond text-4xl font-bold leading-[1.06] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
          <SplitWords text="Învață codul rutier și susține examenul teoretic de acasă." />
        </h1>
        <motion.p {...a(0.18)} className="mt-4 max-w-[54ch] text-base text-white/90 sm:text-lg">
          Cursuri structurate pe capitole cu fotografii reale din România, lecții audio, evaluare adaptivă și examen
          supravegheat. O singură taxă per categorie, fără abonament — cu atestat verificabil prin cod QR.
        </motion.p>
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
      "Atestatul PermiStart confirmă pregătirea pe platformă. Nu este permis de conducere și nu înlocuiește examenul oficial.",
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
              PermiStart este o platformă de pregătire teoretică și evaluare supravegheată pentru legislația rutieră din
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
              Despre PermiStart, pe larg
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
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">De ce PermiStart</h2>
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

/* ---------- service value clarity (who & why PermiStart, not random QCM) ---------- */

export function ServiceForWho() {
  const audiences = [
    {
      tag: "Primul permis · România",
      title: "Înțelegi regulile, nu doar memorezi grile",
      body: "În loc să ghicești răspunsuri la întâmplare, parcurgi lecțiile din Codul rutier cu fotografii reale din intersecții din România, audio și explicații juridice la fiecare întrebare.",
    },
    {
      tag: "Diaspora · Uniunea Europeană",
      title: "Pregătire 100% în limba română, de oriunde",
      body: "Studiezi de acasă după program, de pe telefon sau laptop, cu plată transparentă în EUR sau RON (integral sau în tranșe) și fără abonamente lunare.",
    },
    {
      tag: "Profesioniști C1–DE · Școli",
      title: "Toate categoriile europene și atestat cu QR",
      body: "De la mopede (AM) până la camioane grele și autocare (C1–CE, D1–DE), susții examenul supravegheat cu cameră și primești atestat nominal verificabil public prin cod QR.",
    },
  ];

  return (
    <section className="border-b border-line bg-white py-20 text-asphalt">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <h2 className="max-w-[24ch] font-cond text-3xl font-bold leading-[1.06] tracking-[-0.015em] text-asphalt sm:text-4xl md:text-5xl">
              Pregătire completă de acasă, nu doar chestionare la întâmplare.
            </h2>
            <p className="max-w-[54ch] text-base leading-relaxed text-mute sm:text-lg">
              PermiStart combină cursul structurat pe capitole cu evaluarea adaptivă pe punctele tale slabe și cu un
              examen teoretic supravegheat, ca să știi sigur când ești pregătit.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid divide-y divide-line overflow-hidden rounded-xl border border-line bg-chalk md:grid-cols-3 md:divide-x md:divide-y-0">
          {audiences.map((item, idx) => (
            <Reveal key={item.tag} delay={idx * 0.05} className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <p className="font-mono text-xs font-semibold text-sign">{item.tag}</p>
                <h3 className="mt-2 font-cond text-2xl font-bold leading-snug text-asphalt">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute sm:text-base">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- categories (all 15 EU categories without prices; prices live on /categorii) ---------- */

const BRIEF = [
  { codes: "AM", t: "Mopede și cvadricicluri ușoare · 20 întrebări", href: "/categorii/am", Icon: Bike },
  { codes: "A1 · A2 · A", t: "Motociclete, după cilindree și putere · 20 întrebări", href: "/categorii/a", Icon: Bike },
  { codes: "B1 · B · BE", t: "Autoturisme ≤ 3.500 kg și remorci · 26 întrebări", href: "/categorii/b", Icon: Car },
  { codes: "C1 · C1E · C · CE", t: "Camioane medii, grele și TIR-uri · 26 întrebări", href: "/categorii/c", Icon: Truck },
  { codes: "D1 · D1E · D · DE", t: "Microbuze, autobuze și autocare · 26 întrebări", href: "/categorii/d", Icon: Bus },
];

export function Categories() {
  return (
    <section id="categorii" className="bg-chalk py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
        <div>
          <Reveal>
            <h2 className="font-cond text-4xl font-bold leading-[1.05] tracking-[-0.015em] md:text-5xl">
              Toate categoriile europene, într-un singur loc.
            </h2>
            <p className="mt-4 max-w-[52ch] text-lg text-mute">
              Acoperim toate cele 15 categorii europene, de la mopede (AM) până la camioane și autobuze cu remorcă.
              Alege categoria ta și consultă prețurile și opțiunile în tranșe.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Parallax
              src="/media/hero-permisstart.webp"
              alt="Punct rutier cu autoturisme, vehicule grele și indicatoare de circulație din România"
              className="mt-8 aspect-[4/3] rounded shadow-lift"
            />
          </Reveal>
          <Reveal delay={0.12}>
            <Link href="/categorii" className={`${btnPrimary} mt-8`}>
              Vezi categoriile și prețurile
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
                  <span className="w-40 shrink-0 font-cond text-xl font-bold leading-tight text-asphalt sm:w-48 sm:text-2xl">
                    {codes}
                  </span>
                  <span className="flex-1 text-sm text-mute group-hover:text-asphalt sm:text-base">{t}</span>
                  <Icon className="hidden h-6 w-6 shrink-0 text-asphalt/50 sm:block" aria-hidden="true" />
                  <ArrowUpRightIcon
                    className="h-5 w-5 shrink-0 text-sign transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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

/* ---------- condensed 4-stage product journey ---------- */

const steps = [
  {
    short: "Înscriere și KYC",
    t: "Alegi categoria, verifici identitatea și deblochezi cursurile",
    d: "Selectezi categoria dorită, încarci actul de identitate și un selfie securizat, iar prima plată (integrală sau în tranșe) deschide imediat toate lecțiile.",
    points: [
      "Prețul exact în RON sau EUR este vizibil dinainte de plată",
      "Documentele KYC sunt criptate și șterse automat la 30 de zile",
      "Acces instantaneu la capitole încă de la prima tranșă",
    ],
    ctaLabel: "Începe înscrierea",
    ctaHref: "/inscriere",
    v: <SignupStepMock />,
  },
  {
    short: "Cursuri și audio",
    t: "Înveți pe capitole cu fotografii reale și audio integral",
    d: "Fiecare capitol conține rezumat clar, lecție ilustrată cu situații reale din trafic, citire audio („Ascultă lecția”) și test explicat pe articole de lege.",
    points: [
      "Redare audio completă pentru studiu de pe telefon sau desktop",
      "Fotografii autentice de pe drumurile naționale și orașe din România",
      "Explicații juridice la fiecare întrebare greșită sau corectă",
    ],
    ctaLabel: "Explorează capitolele",
    ctaHref: "/cursuri",
    v: <ChapterMock />,
  },
  {
    short: "Evaluare adaptivă",
    t: "Repeți exact capitolele unde greșești și îți măsori nivelul",
    d: "Motorul adaptiv revine pe temele slabe până când le stăpânești, iar evaluarea globală îți arată transparent dacă ai atins pragul necesar pentru examen.",
    points: [
      "Fără grile repetate la întâmplare fără progres real",
      "Procent de pregătire afișat transparent în tabloul de bord",
      "Poți exersa oricât înainte să intri în sala de examen",
    ],
    ctaLabel: "Vezi cum funcționează",
    ctaHref: "/cum-functioneaza",
    v: <AdaptiveMock />,
  },
  {
    short: "Examen și atestat QR",
    t: "Susții examenul supravegheat și primești atestatul pe e-mail",
    d: "Când soldul e achitat integral și evaluarea e trecută, intri când dorești în examen: cronometru pe întrebare, cameră activă și rezultat afișat imediat.",
    points: [
      "20 sau 26 de întrebări aleatorii cu 60 secunde pe întrebare",
      "Scor afișat pe loc, cu analiza răspunsurilor la final",
      "Atestat de reușită PDF cu cod QR verificabil în max. 3 zile",
    ],
    ctaLabel: "Vezi regulile examenului",
    ctaHref: "/examen",
    v: <ExamMock />,
  },
];

export function Journey() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !auto) return;
    const id = window.setInterval(() => setI((prev) => (prev + 1) % steps.length), 6000);
    return () => window.clearInterval(id);
  }, [auto, reduce]);

  const selectStep = (index: number) => {
    setI(index);
    setAuto(false);
  };

  return (
    <section id="parcurs" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] text-asphalt md:text-5xl">
              Patru etape, de la înscriere la atestat
            </h2>
            <p className="mt-2 text-base text-mute">
              <Link
                href="/cum-functioneaza"
                className="inline-flex min-h-[36px] items-center gap-1 font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                <span>Vezi ghidul complet pas cu pas</span>
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </p>
          </div>
          {!reduce && (
            <button
              type="button"
              onClick={() => setAuto((v) => !v)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-chalk px-3.5 text-sm font-medium text-mute transition-colors hover:border-asphalt hover:text-asphalt"
            >
              {auto ? <PauseIcon className="h-4 w-4" aria-hidden="true" /> : <PlayIcon className="h-4 w-4" aria-hidden="true" />}
              <span hidden={!auto}>Redare automată</span>
              <span hidden={auto}>Alege etapa</span>
            </button>
          )}
        </div>

        {/* Horizontal 4-step tab bar (2x2 on mobile, 4-col on desktop) */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4" role="tablist" aria-label="Etapele platformei">
          {steps.map((s, k) => {
            const active = i === k;
            return (
              <button
                key={s.short}
                id={`journey-tab-${k}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`journey-panel-${k}`}
                onClick={() => selectStep(k)}
                className={`flex min-h-[52px] items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors sm:min-h-[56px] sm:gap-3 sm:px-4 sm:py-3 ${
                  active
                    ? "border-asphalt bg-asphalt text-white"
                    : "border-line bg-chalk text-asphalt hover:border-asphalt hover:bg-white"
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md font-cond text-xs font-bold sm:h-7 sm:w-7 sm:text-sm ${
                    active ? "bg-signal text-asphalt" : "border border-line bg-white text-asphalt"
                  }`}
                >
                  {k + 1}
                </span>
                <span className="font-cond text-base font-bold leading-tight sm:text-xl">{s.short}</span>
              </button>
            );
          })}
        </div>

        {/* Keep all 4 panels mounted using hidden so browser translation mutations never break DOM unmount */}
        <div className="mt-6 overflow-hidden rounded-xl border border-line bg-chalk p-6 sm:p-8 lg:p-10">
          {steps.map((step, idx) => {
            const active = i === idx;
            return (
              <div
                key={step.short}
                id={`journey-panel-${idx}`}
                role="tabpanel"
                aria-labelledby={`journey-tab-${idx}`}
                hidden={!active}
                className={active ? "grid items-center gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12" : "hidden"}
              >
                <div>
                  <h3 className="font-cond text-3xl font-bold leading-tight text-asphalt sm:text-4xl">{step.t}</h3>
                  <p className="mt-3 max-w-[54ch] text-base leading-relaxed text-mute">{step.d}</p>

                  <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm text-asphalt">
                    {step.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden="true" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Link
                      href={step.ctaHref}
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
                    >
                      <span>{step.ctaLabel}</span>
                      <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div className="w-full">{step.v}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- payment (clean 2-column architectural comparison, no redundant widget) ---------- */

export function Payment() {
  const plans = [
    {
      title: "Plată integrală (100%)",
      badge: "Cursuri + Examen deblocate imediat",
      desc: "Achită o singură dată taxa categoriei alese și parcurge pregătirea și examenul în ritmul tău.",
      points: [
        "Acces instantaneu la toate capitolele, audio și teste",
        "Eligibilitate financiară imediată pentru sala de examen",
        "Chitanță fiscală automată trimisă pe e-mail",
      ],
    },
    {
      title: "Plată în 2–3 tranșe",
      badge: "Începi cursurile cu prima tranșă",
      desc: "Împarte taxa în tranșe flexibile fără dobândă. Examenul se activează imediat ce soldul este achitat integral.",
      points: [
        "Prima tranșă deblochează toate cursurile și evaluările adaptive",
        "Achiți restul în 1–2 tranșe, direct din cont, când ești pregătit",
        "Blocare transparentă a examenului până la plata 100%",
      ],
    },
  ];
  return (
    <section id="plata" className="bg-chalk py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
                O singură taxă, plătită cum îți convine
              </h2>
              <p className="mt-3 max-w-[60ch] text-lg text-mute">
                Fără abonament lunar și fără pachete ascunse. Vezi suma exactă a categoriei tale la înscriere, înainte de
                orice plată.
              </p>
            </div>
            <Link
              href="/rambursari"
              className="text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
            >
              Vezi politica de rambursare (14 zile) →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid overflow-hidden rounded border-2 border-asphalt bg-white lg:grid-cols-2 lg:divide-x lg:divide-line">
          {plans.map((p, k) => (
            <Reveal key={p.title} delay={k * 0.07} className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-cond text-3xl font-bold text-asphalt">{p.title}</h3>
                <span className="rounded-sm bg-signal/25 px-2.5 py-1 text-xs font-semibold text-asphalt">
                  {p.badge}
                </span>
              </div>
              <p className="mt-3 text-mute">{p.desc}</p>
              <ul className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm text-asphalt">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden="true" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.14}>
          <PaymentMethodBadges />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- exam ---------- */

export function Exam() {
  const rules = [
    {
      Icon: ClockIcon,
      title: "Cronometru strict & citire audio automată",
      desc: "Fiecare întrebare este citită automat în limba română (cu opțiuni Reascultă sau Fără sunet) și trece automat la expirarea timpului, fără întoarcere.",
    },
    {
      Icon: VideoCameraIcon,
      title: "Cameră activă & jurnal de integritate",
      desc: "Camera rămâne pornită continuu pe durata probei, iar ieșirile din pagină sau pierderea focusului se înregistrează cu oră exactă în raport.",
    },
    {
      Icon: DocumentCheckIcon,
      title: "Set aleatoriu securizat & bilanț imediat",
      desc: "Primești o extragere unică din banca de întrebări, scor instant (Admis / Respins), explicațiile juridice și statusul eliberării atestatului.",
    },
  ];
  return (
    <section id="examen" className="bg-ink py-24 text-chalk">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <Reveal>
          <ExamMock />
        </Reveal>
        <div>
          <Reveal>
            <h2 className="font-cond text-4xl font-bold leading-[1.05] tracking-[-0.015em] md:text-5xl">
              Un examen în condiții reale
            </h2>
            <p className="mt-4 max-w-[54ch] text-base text-chalk/80 sm:text-lg">
              Sala de examen se deblochează atunci când taxa este achitată integral, identitatea KYC este aprobată și
              evaluarea globală confirmă pregătirea. Tu alegi când susții proba.
            </p>
          </Reveal>

          <ul className="mt-8 divide-y divide-chalk/15 border-y border-chalk/15">
            {rules.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <li className="flex items-start gap-4 py-5">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded border border-chalk/20 bg-asphalt text-signal">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-cond text-xl font-bold text-chalk">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-chalk/75">{desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <Link
              href="/examen"
              className="mt-7 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-signal underline underline-offset-4 hover:text-white"
            >
              Vezi toate regulile sălii de examen
              <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
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
            <p className="mt-6 rounded border border-asphalt/20 bg-chalk p-4 text-sm text-asphalt">
              Atestatul PermiStart confirmă rezultatul obținut pe platformă. Nu este permis de conducere și nu înlocuiește
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
    "De ce să mă pregătesc și să dau examenul pe PermiStart?",
    "PermiStart îți oferă o pregătire completă, structurată pe capitole, cu fotografii reale ale indicatoarelor din România, lecții audio și un motor adaptiv care insistă exact pe temele la care mai greșești. Când ajungi la evaluarea oficială a autorităților, cunoști deja fiecare regulă și ai trecut printr-un examen supravegheat în condiții reale.",
  ],
  [
    "La ce îmi folosește atestatul de reușită PermiStart?",
    "Atestatul de reușită PermiStart (PDF cu serie unică și cod QR verificabil public) confirmă pe platformă că ai parcurs programa categoriei tale și ai promovat testul teoretic supravegheat. Îl primești pe e-mail în cel mult 3 zile și îl poți prezenta instructorului sau angajatorului ca dovadă a pregătirii tale. Nu înlocuiește permisul de conducere eliberat de autorități.",
  ],
  [
    "Pot plăti în tranșe și există abonament?",
    "Nu există abonament lunar. Plătești o singură taxă pentru categoria aleasă, afișată clar înainte de plată. Prima tranșă deblochează imediat cursurile și testele, iar examenul final se deblochează după achitarea integrală.",
  ],
  [
    "De ce cereți act de identitate și selfie?",
    "Pentru ca atestatul tău să aibă credibilitate la verificare, confirmăm că persoana înscrisă este cea care susține examenul. Documentele sunt stocate criptat și șterse automat după 30 de zile (conform GDPR).",
  ],
];

export function Faq() {
  return (
    <section id="faq" className="bg-chalk py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <Reveal>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">Întrebări frecvente</h2>
          <p className="mt-3 text-mute">
            Nu găsești răspunsul? Consultă{" "}
            <Link href="/intrebari-frecvente" className="font-semibold text-sign underline underline-offset-4 hover:text-asphalt">
              toate întrebările
            </Link>{" "}
            sau{" "}
            <Link href="/contact" className="font-semibold text-sign underline underline-offset-4 hover:text-asphalt">
              scrie-ne direct
            </Link>
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
            Echipa PermiStart răspunde în limba română pentru întrebări legate de categorii, plata în tranșe, verificarea
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
          <h2 className="max-w-[20ch] font-cond text-5xl font-bold leading-[1.02] tracking-[-0.02em] sm:text-6xl">
            Alege categoria și începe pregătirea azi.
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg text-asphalt/85">
            Înscrierea durează câteva minute. Vezi taxa exactă înainte să plătești și deblochezi cursurile imediat.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Link href={CTA_HREF} className={`${btn} bg-asphalt text-chalk shadow-lift hover:bg-ink`}>
                Alege categoria și începe
              </Link>
            </Magnetic>
            <Link href="/categorii" className={btnGhostLight}>
              Vezi taxele pe categorii
            </Link>
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
    { n: 100, suffix: "%", l: "Aliniat la Codul Rutier (OUG 195/2002 și HG 1391/2006)" },
    { n: 15, suffix: "", l: "Categorii europene acoperite complet (AM – DE)" },
    { n: 72, suffix: "h", l: "Termen maxim pentru trimiterea atestatului cu cod QR" },
    { n: 30, suffix: " zile", l: "Retenție maximă KYC criptat, apoi ștergere automată GDPR" },
  ];
  return (
    <section className="relative isolate overflow-hidden text-chalk">
      <div className="absolute inset-0 -z-10">
        <Parallax src="/media/dn7-brezoi.webp" alt="" className="h-full" />
      </div>
      <div className="absolute inset-0 -z-10 bg-asphalt/88" />
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
            Garanții măsurabile, de la lege la protecția datelor
          </h2>
        </Reveal>
        <dl className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.l} delay={i * 0.08}>
              <div className="border-t border-chalk/25 pt-5">
                <dt className="font-cond text-5xl font-bold tabular-nums text-signal sm:text-6xl">
                  <CountUp to={f.n} />
                  {f.suffix}
                </dt>
                <dd className="mt-2 max-w-[26ch] text-sm text-chalk/85 sm:text-base">{f.l}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------- testimonials (staggered deck on white background) ---------- */

export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section id="marturii" className="scroll-mt-20 border-t border-line bg-white py-20 text-asphalt">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <div>
              <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] text-asphalt md:text-5xl">
                Experiențe ale candidaților
              </h2>
              <p className="mt-2 max-w-[58ch] text-base text-mute">
                Pregătire în ritm propriu, atât din țară, cât și din diaspora, cu progres urmărit pe capitole.
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
        </Reveal>
      </div>

      <div className="mt-8">
        <StaggerTestimonials items={TESTIMONIALS} />
      </div>
    </section>
  );
}
