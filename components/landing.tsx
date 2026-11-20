"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Car, Bike, Truck, Bus, Caravan } from "lucide-react";
import {
  ChevronDownIcon,
  ArrowUpRightIcon,
  PlayIcon,
  PauseIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import {
  DashboardMock,
  SignupStepMock,
  KycStepMock,
  PayMock,
  ChapterMock,
  AdaptiveMock,
  GlobalEvalMock,
  ExamMock,
  CertMock,
  SignSlot,
} from "./mockups";

const CTA_HREF = "/inscriere";
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const btn =
  "inline-flex min-h-[44px] items-center justify-center rounded border-2 border-asphalt px-6 py-3 font-semibold transition-all duration-200 active:translate-y-px";

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
      initial={reduce ? false : { opacity: 1, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.42, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const a = (d: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay: d, ease: EASE_OUT },
        };
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-[1fr_1.08fr] lg:py-14">
      <div>
        <motion.h1
          {...a(0)}
          className="font-cond text-4xl font-bold leading-[1.04] tracking-[-0.02em] sm:text-5xl lg:text-6xl"
        >
          Pregătirea și testul teoretic auto, într-un singur loc.
        </motion.h1>
        <motion.p {...a(0.1)} className="mt-4 max-w-[52ch] text-lg text-mute">
          Plătești taxa categoriei tale, înveți capitol cu capitol, te evaluezi pe măsură ce înaintezi și dai testul când
          ești pregătit. Atestatul ajunge pe e-mail în maximum 3 zile.
        </motion.p>
        <motion.div {...a(0.18)} className="mt-6 flex flex-wrap gap-3">
          <Link
            href={CTA_HREF}
            className={`${btn} bg-signal text-asphalt hover:-translate-y-0.5 hover:bg-[#e0a900]`}
          >
            Începe înscrierea
          </Link>
          <a href="#parcurs" className={`${btn} bg-transparent text-asphalt hover:-translate-y-0.5 hover:bg-surface`}>
            Vezi parcursul
          </a>
        </motion.div>
        <motion.p {...a(0.26)} className="mt-4 text-sm text-mute">
          Fără abonament. Plătești o singură taxă, în funcție de categorie.
        </motion.p>
      </div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.16, ease: EASE_OUT }}
      >
        <DashboardMock />
      </motion.div>
    </section>
  );
}

export function Trust() {
  const items = [
    "Plată securizată prin Stripe",
    "Date personale conform GDPR",
    "Servere în Uniunea Europeană",
    "Atestat cu cod QR verificabil",
  ];
  return (
    <div className="bg-asphalt text-chalk">
      <ul className="mx-auto grid max-w-6xl gap-4 px-5 py-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {items.map((t) => (
          <li key={t} className="border-l-4 border-signal pl-3">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

const bentoCard =
  "flex h-full flex-col justify-between overflow-hidden rounded-lg border-2 border-asphalt bg-white transition-all duration-300 ease-out group-hover:-translate-y-1";

export function Categories() {
  return (
    <section id="categorii" className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
          Alegi categoria. Restul se adaptează.
        </h2>
        <p className="mt-3 max-w-[60ch] text-mute">
          Capitolele, întrebările și taxa depind de categoria de permis. Suma exactă o vezi la înscriere, înainte să
          plătești.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Featured tile: Category B (7 cols, 2 rows) */}
        <Reveal className="group md:col-span-7 md:row-span-2">
          <div className={bentoCard}>
            <div className="relative aspect-[16/9] w-full overflow-hidden border-b-2 border-asphalt bg-asphalt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/autostrada-sibiu.webp"
                alt="Autostrada A1 lângă Sibiu cu panou rutier de distanțe"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-asphalt/85 via-asphalt/20 to-transparent" />
              <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                <span className="rounded bg-signal px-2.5 py-1 font-mono text-xs font-bold text-asphalt">
                  CEA MAI ALEASĂ
                </span>
                <span className="rounded bg-asphalt/85 px-2.5 py-1 font-mono text-xs text-chalk">
                  26 întrebări · min. 22 corecte · 18+ ani
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-chalk">
                <div>
                  <p className="font-mono text-xs text-signal">AUTOTURISME ≤ 3.500 KG</p>
                  <p className="font-cond text-3xl font-bold sm:text-4xl">Categoria B · B1</p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded border border-chalk/30 bg-asphalt/80 text-signal transition-colors duration-200 group-hover:border-signal group-hover:bg-signal group-hover:text-asphalt">
                  <Car className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <p className="text-mute">
                Autovehicule cu cel mult 8 locuri în afara conducătorului și masă totală maximă autorizată de până la
                3.500 kg (inclusiv cvadricicluri B1 de la 16 ani).
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <span className="font-mono text-xs text-mute">6 capitole complete + simulare 26 întrebări</span>
                <Link
                  href="/categorii/b"
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
                >
                  Vezi capitolele categoriei B
                  <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Tile 2: Motorcycles A1 / A2 / A (5 cols) */}
        <Reveal delay={0.05} className="group md:col-span-5">
          <div className={bentoCard}>
            <div className="grid grid-cols-[120px_1fr] border-b border-line sm:grid-cols-[140px_1fr]">
              <div className="relative min-h-[135px] overflow-hidden border-r border-line bg-asphalt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/transfagarasan.webp"
                  alt="Serpentinele drumului Transfăgărășan"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-sign">20 ÎNTREBĂRI · MIN. 17</span>
                  <Bike className="h-5 w-5 text-asphalt transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
                <p className="mt-1 font-cond text-2xl font-bold">A1 · A2 · A</p>
                <p className="mt-1 text-xs text-mute">
                  Motociclete ușoare (125 cm³), medii (≤ 35 kW) și fără limită de putere, cu reguli dedicate pentru două
                  roți.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="font-mono text-xs text-mute">Vârsta min. 16 – 24 ani</span>
              <Link
                href="/categorii/a"
                className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                Categoria A1 · A2 · A
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Tile 3: Trucks C / CE (5 cols) */}
        <Reveal delay={0.1} className="group md:col-span-5">
          <div className={bentoCard}>
            <div className="grid grid-cols-[120px_1fr] border-b border-line sm:grid-cols-[140px_1fr]">
              <div className="relative min-h-[135px] overflow-hidden border-r border-line bg-asphalt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/nadlac-frontiera.webp"
                  alt="Panouri de semnalizare și benzi dedicate pentru camioane la punctul rutier Nădlac"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-sign">TRANSPORT MARFĂ &gt; 3,5 T</span>
                  <Truck className="h-5 w-5 text-asphalt transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
                <p className="mt-1 font-cond text-2xl font-bold">C · CE</p>
                <p className="mt-1 text-xs text-mute">
                  Camioane și ansambluri articulate: mase maxime, timpi de conducere, tahograf și limite diferențiate.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="font-mono text-xs text-mute">26 întrebări · 21+ ani</span>
              <Link
                href="/categorii/c"
                className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                Categoria C · CE
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Bottom row of Bento Grid: AM (4 cols), BE (4 cols), D (4 cols) */}
        <Reveal delay={0.14} className="group md:col-span-4">
          <div className={bentoCard}>
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-line bg-asphalt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/calea-victoriei.webp"
                  alt="Trafic urban și indicator de trecere pentru pietoni pe Calea Victoriei din București"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
                <span className="absolute left-3 top-3 rounded bg-asphalt/85 px-2 py-0.5 font-mono text-xs text-signal">
                  DE LA 16 ANI
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-cond text-2xl font-bold">Categoria AM</p>
                  <Bike className="h-5 w-5 text-mute transition-colors group-hover:text-asphalt" aria-hidden="true" />
                </div>
                <p className="mt-1.5 text-sm text-mute">
                  Mopede și scutere ușoare (max. 45 km/h, ≤ 50 cm³ sau 4 kW). Chestionar de 20 de întrebări.
                </p>
              </div>
            </div>
            <div className="border-t border-line px-5 py-2.5">
              <Link
                href="/categorii/am"
                className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                Vezi categoria AM
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18} className="group md:col-span-4">
          <div className={bentoCard}>
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-line bg-asphalt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/dn7-brezoi.webp"
                  alt="Drumul național DN7 (Valea Oltului) lângă Brezoi cu marcaje și indicatoare"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
                <span className="absolute left-3 top-3 rounded bg-asphalt/85 px-2 py-0.5 font-mono text-xs text-chalk">
                  REMORCĂ 750–3.500 KG
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-cond text-2xl font-bold">Categoria BE</p>
                  <Caravan className="h-5 w-5 text-mute transition-colors group-hover:text-asphalt" aria-hidden="true" />
                </div>
                <p className="mt-1.5 text-sm text-mute">
                  Autoturism categoria B cu remorcă grea: cuplare, repartizarea sarcinii și distanțe de oprire.
                </p>
              </div>
            </div>
            <div className="border-t border-line px-5 py-2.5">
              <Link
                href="/categorii/be"
                className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                Vezi categoria BE
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.22} className="group md:col-span-4">
          <div className={bentoCard}>
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-line bg-asphalt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/marcaje-apold.webp"
                  alt="Marcaje rutiere de bandă dedicată autobuzelor și trecere de pietoni în Apold"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
                <span className="absolute left-3 top-3 rounded bg-asphalt/85 px-2 py-0.5 font-mono text-xs text-chalk">
                  TRANSPORT PERSOANE
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-cond text-2xl font-bold">Categoria D</p>
                  <Bus className="h-5 w-5 text-mute transition-colors group-hover:text-asphalt" aria-hidden="true" />
                </div>
                <p className="mt-1.5 text-sm text-mute">
                  Autobuze și microbuze cu peste 8+1 locuri: prioritatea la ieșirea din alveole și siguranța pasagerilor.
                </p>
              </div>
            </div>
            <div className="border-t border-line px-5 py-2.5">
              <Link
                href="/categorii/d"
                className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
              >
                Vezi categoria D
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

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
    const id = window.setInterval(() => {
      setI((prev) => (prev + 1) % steps.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [auto, reduce]);

  const selectStep = (index: number) => {
    setI(index);
    setAuto(false);
  };

  return (
    <section
      id="parcurs"
      className="border-y border-line bg-white py-20"
      onMouseEnter={() => setAuto(false)}
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.12fr]">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
              Șapte pași, de la înscriere la atestat
            </h2>
            {!reduce && (
              <button
                type="button"
                onClick={() => setAuto((v) => !v)}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded border border-line bg-chalk px-2.5 py-1 font-mono text-xs text-asphalt hover:border-asphalt"
              >
                {auto ? <PauseIcon className="h-3.5 w-3.5 text-sign" /> : <PlayIcon className="h-3.5 w-3.5 text-sign" />}
                {auto ? "Redare automată" : " Alege un pas"}
              </button>
            )}
          </div>
          <LayoutGroup id="journey-steps">
            <ol className="mt-8">
              {steps.map((s, k) => {
                const active = i === k;
                return (
                  <motion.li
                    key={s.t}
                    onViewportEnter={() => {
                      if (!auto) setI(k);
                    }}
                    viewport={{ margin: "-45% 0px -45% 0px" }}
                    className="relative border-l-4 border-line py-5 pl-6"
                  >
                    {active && (
                      <motion.span
                        layoutId="journey-active-rail"
                        className="absolute -left-[4px] bottom-0 top-0 w-1 bg-signal"
                        transition={{ duration: 0.32, ease: EASE_OUT }}
                      />
                    )}
                    <button
                      type="button"
                      className="group flex min-h-[44px] w-full items-center justify-between text-left"
                      onClick={() => selectStep(k)}
                      aria-current={active ? "step" : undefined}
                    >
                      <div>
                        <span className={`font-mono text-xs ${active ? "font-bold text-sign" : "text-mute"}`}>
                          Pasul {k + 1} din {steps.length}
                        </span>
                        <h3
                          className={`font-cond text-2xl font-bold transition-colors ${
                            active ? "text-asphalt" : "text-asphalt/75 group-hover:text-asphalt"
                          }`}
                        >
                          {s.t}
                        </h3>
                      </div>
                      <span
                        className={`ml-3 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono text-xs transition-colors ${
                          active
                            ? "border border-asphalt bg-signal font-bold text-asphalt"
                            : "border border-line bg-chalk text-mute group-hover:border-asphalt"
                        }`}
                      >
                        {k + 1}
                      </span>
                    </button>
                    <p className={`mt-1 max-w-[46ch] text-sm transition-colors duration-200 ${active ? "text-asphalt" : "text-mute"}`}>
                      {s.d}
                    </p>
                    <div className="mt-5 lg:hidden">{s.v}</div>
                  </motion.li>
                );
              })}
            </ol>
          </LayoutGroup>
        </div>
        <div className="relative hidden lg:block">
          <div className="sticky top-28 space-y-3">
            <div className="flex items-center justify-between rounded border border-line bg-chalk px-3 py-2 text-xs">
              <span className="font-mono font-semibold text-sign">
                PASUL {i + 1} / {steps.length} · {steps[i].t.toUpperCase()}
              </span>
              <div className="flex items-center gap-1.5">
                {steps.map((s, idx) => (
                  <button
                    key={s.t}
                    type="button"
                    aria-label={`Pasul ${idx + 1}: ${s.t}`}
                    onClick={() => selectStep(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === i ? "w-6 bg-asphalt" : "w-2.5 bg-line hover:bg-mute"
                    }`}
                  />
                ))}
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985, filter: "blur(3px)" }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99, filter: "blur(2px)" }}
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

export function Payment() {
  const opts = [
    [
      "Plătești tot acum",
      "Cursurile și examenul sunt deblocate imediat. Faci totul în ritmul tău.",
      "Cursuri + examen",
    ],
    [
      "Plătești în tranșe",
      "Prima parte deblochează cursurile. Examenul se deblochează când taxa categoriei este achitată integral.",
      "Cursuri acum, examen după",
    ],
  ];
  return (
    <section id="plata" className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
          O singură taxă, plătită cum îți convine
        </h2>
        <p className="mt-3 max-w-[60ch] text-mute">
          Fără abonament și fără pachete. Taxa depinde de categorie și o vezi înainte de plată. Primești chitanță pe
          e-mail după fiecare plată.
        </p>
      </Reveal>
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {opts.map(([t, d, tag], k) => (
            <Reveal key={t} delay={k * 0.06}>
              <div className="rounded-lg border-2 border-asphalt bg-white p-6">
                <p className="font-cond text-2xl font-bold">{t}</p>
                <p className="mt-2 text-mute">{d}</p>
                <p className="mt-3 inline-block rounded border border-asphalt/30 bg-signal/25 px-2.5 py-0.5 text-sm font-semibold text-asphalt">
                  {tag}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-asphalt">
              <span className="inline-flex items-center gap-1.5 rounded border border-line bg-white px-2.5 py-1">
                <CreditCardIcon className="h-4 w-4 text-sign" aria-hidden="true" />
                Card bancar (Visa / Mastercard)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded border border-line bg-white px-2.5 py-1">
                <DevicePhoneMobileIcon className="h-4 w-4 text-sign" aria-hidden="true" />
                Apple Pay &amp; Google Pay
              </span>
              <span className="inline-flex items-center gap-1.5 rounded border border-line bg-white px-2.5 py-1">
                <BuildingLibraryIcon className="h-4 w-4 text-sign" aria-hidden="true" />
                Transfer instant (RON &amp; EUR)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded border border-line bg-white px-2.5 py-1">
                <EnvelopeIcon className="h-4 w-4 text-sign" aria-hidden="true" />
                Chitanță pe e-mail
              </span>
            </div>
            <p className="text-sm text-mute">
              <Link href="/rambursari" className="font-semibold text-sign underline underline-offset-4">
                Vezi politica de rambursare
              </Link>
              .
            </p>
          </div>
        </div>
        <Reveal delay={0.08}>
          <PayMock />
        </Reveal>
      </div>
    </section>
  );
}

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
    <section id="examen" className="border-y border-line bg-white py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
        <Reveal>
          <ExamMock />
        </Reveal>
        <div>
          <Reveal>
            <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
              Un examen în condiții reale
            </h2>
            <p className="mt-3 text-mute">
              Testul se deblochează când taxa este plătită integral, identitatea este aprobată și evaluarea globală
              arată că ești pregătit. Tu alegi momentul.
            </p>
          </Reveal>
          <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {f.map(([t, d]) => (
              <div key={t} className="border-t-2 border-asphalt pt-3">
                <dt className="font-semibold">{t}</dt>
                <dd className="text-sm text-mute">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

const FEATURED_SIGNS = [
  {
    src: "/media/stop-axente-sever.webp",
    alt: "Indicatorul Oprire (Stop) în Axente Sever",
    title: "Oprire (STOP) · Axente Sever",
  },
  {
    src: "/media/oprire-interzisa-bistrita.webp",
    alt: "Indicatorul Oprirea interzisă pe o stradă din Bistrița",
    title: "Oprirea interzisă · Bistrița",
  },
  {
    src: "/media/sens-giratoriu-timisoara.webp",
    alt: "Sens giratoriu în Piața Ionel I. C. Brătianu din Timișoara",
    title: "Sens giratoriu · Timișoara",
  },
  {
    src: "/media/lucrari-transfagarasan.webp",
    alt: "Panou galben de avertizare Pericol de accidente pentru lucrări pe Transfăgărășan",
    title: "Lucrări temporare · Transfăgărășan",
  },
];

export function Signs() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
          Indicatoare reale, nu desene
        </h2>
        <p className="mt-3 max-w-[60ch] text-mute">
          Lecțiile și întrebările folosesc fotografii reale ale indicatoarelor din România și situații de drum.{" "}
          <Link href="/credite-imagini" className="font-semibold text-sign underline underline-offset-4">
            Sursa și licența fiecărei imagini
          </Link>{" "}
          sunt publice.
        </p>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {FEATURED_SIGNS.map((s, idx) => (
          <Reveal key={s.src} delay={idx * 0.05} className="group">
            <figure className="overflow-hidden rounded-lg border-2 border-asphalt bg-surface transition-transform duration-300 ease-out group-hover:-translate-y-1">
              <div className="aspect-square overflow-hidden bg-asphalt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              </div>
              <figcaption className="border-t border-line bg-white px-3 py-2.5 text-xs font-semibold text-asphalt">
                {s.title}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Certificate() {
  return (
    <section className="border-y border-line bg-white py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
        <div>
          <Reveal>
            <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
              Atestatul ajunge pe e-mail
            </h2>
            <p className="mt-3 max-w-[56ch] text-mute">
              După examen, atestatul de reușită este trimis automat pe e-mail în maximum 3 zile. Are număr unic și cod
              QR, iar oricine poate verifica autenticitatea pe{" "}
              <Link href="/verificare" className="font-semibold text-sign underline underline-offset-4">
                pagina publică de verificare
              </Link>
              .
            </p>
            <p className="mt-4 max-w-[56ch] rounded border border-asphalt bg-chalk p-4 text-sm text-asphalt">
              Atestatul Drumo confirmă rezultatul obținut pe platformă. Nu este permis de conducere și nu
              înlocuiește examenul oficial organizat de autorități.
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
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
      <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">Întrebări frecvente</h2>
      <div className="mt-8">
        {faq.map(([q, a]) => (
          <details key={q} className="group border-t border-line py-4 last:border-b">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
              <span>{q}</span>
              <ChevronDownIcon className="h-5 w-5 shrink-0 text-mute transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 max-w-[65ch] text-mute">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section id="inscriere" className="bg-asphalt py-20 text-chalk">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-6xl">
            Alege categoria și începe azi.
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-chalk/80">
            Înscrierea durează câteva minute. Vezi taxa înainte să plătești.
          </p>
          <Link href={CTA_HREF} className={`${btn} mt-8 border-signal bg-signal text-asphalt hover:bg-[#e0a900]`}>
            Începe înscrierea
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
