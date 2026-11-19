"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { DashboardMock, PayMock, ChapterMock, AdaptiveMock, ExamMock, CertMock, SignSlot } from "./mockups";

const CTA_HREF = "/inscriere";
const btn =
  "inline-flex min-h-[44px] items-center justify-center rounded border-2 border-asphalt px-6 py-3 font-semibold transition-transform active:translate-y-px";

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
      initial={reduce ? false : { opacity: 1, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] as const }}
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
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] as const },
        };
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-14 lg:grid-cols-[1fr_1.05fr]">
      <div>
        <motion.h1
          {...a(0)}
          className="font-cond text-4xl font-bold leading-[1.04] tracking-[-0.02em] sm:text-5xl lg:text-6xl"
        >
          Pregătirea și testul teoretic auto, într-un singur loc.
        </motion.h1>
        <motion.p {...a(0.1)} className="mt-5 max-w-[52ch] text-lg text-mute">
          Plătești taxa categoriei tale, înveți capitol cu capitol, te evaluezi pe măsură ce înaintezi și dai testul când
          ești pregătit. Atestatul ajunge pe e-mail în maximum 3 zile.
        </motion.p>
        <motion.div {...a(0.2)} className="mt-7 flex flex-wrap gap-3">
          <Link href={CTA_HREF} className={`${btn} bg-signal text-asphalt hover:bg-[#e0a900]`}>
            Începe înscrierea
          </Link>
          <a href="#parcurs" className={`${btn} bg-transparent text-asphalt hover:bg-surface`}>
            Vezi parcursul
          </a>
        </motion.div>
        <motion.p {...a(0.28)} className="mt-5 text-sm text-mute">
          Fără abonament. Plătești o singură taxă, în funcție de categorie.
        </motion.p>
      </div>
      <motion.div {...a(0.22)} className="space-y-4">
        <DashboardMock />
        <div className="sm:ml-auto sm:w-[72%]">
          <PayMock />
        </div>
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

const cats = [
  { code: "AM", slug: "am", desc: "Mopede și scutere ușoare" },
  { code: "A1 · A2 · A", slug: "a", desc: "Motociclete, în funcție de putere" },
  { code: "B", slug: "b", desc: "Autoturisme, cea mai căutată categorie" },
  { code: "BE", slug: "be", desc: "Autoturism cu remorcă" },
  { code: "C · CE", slug: "c", desc: "Camioane și ansambluri de vehicule" },
  { code: "D", slug: "d", desc: "Autobuze și microbuze" },
];

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
      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border-2 border-asphalt bg-asphalt sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((c, i) => (
          <Reveal key={c.code} delay={i * 0.04} className="bg-white p-6">
            <p className="font-cond text-4xl font-bold">{c.code}</p>
            <p className="mt-2 text-mute">{c.desc}</p>
            <Link
              href={`/categorii/${c.slug}`}
              className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
            >
              Vezi capitolele categoriei {c.code}
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const steps = [
  { t: "Înscriere", d: "Nume, contact, țara și categoria de permis.", v: <DashboardMock /> },
  {
    t: "Verificare identitate",
    d: "Fotografie a actului și un selfie rapid, ca să știm că tu dai examenul.",
    v: <CertMock />,
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
    v: <AdaptiveMock />,
  },
  {
    t: "Examen și atestat",
    d: "Dai testul când vrei, după plata integrală. Atestatul vine pe e-mail în maximum 3 zile.",
    v: <ExamMock />,
  },
];

export function Journey() {
  const [i, setI] = useState(0);
  return (
    <section id="parcurs" className="border-y border-line bg-white py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
            Șapte pași, de la înscriere la atestat
          </h2>
          <ol className="mt-8">
            {steps.map((s, k) => (
              <motion.li
                key={s.t}
                onViewportEnter={() => setI(k)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                className={`border-l-4 py-7 pl-6 transition-colors ${i === k ? "border-signal" : "border-line"}`}
              >
                <button type="button" className="min-h-[44px] text-left" onClick={() => setI(k)}>
                  <span className="font-mono text-sm text-sign">Pasul {k + 1}</span>
                  <h3 className="font-cond text-2xl font-bold">{s.t}</h3>
                </button>
                <p className={`mt-1 max-w-[44ch] transition-opacity ${i === k ? "opacity-100" : "opacity-65"}`}>
                  {s.d}
                </p>
                <div className="mt-5 lg:hidden">{s.v}</div>
              </motion.li>
            ))}
          </ol>
        </div>
        <div className="relative hidden lg:block">
          <div className="sticky top-28">
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {steps[i].v}
            </motion.div>
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
          <p className="text-sm text-mute">
            Metode de plată: card bancar, Apple Pay, Google Pay, transfer instant (RON și EUR).{" "}
            <Link href="/rambursari" className="font-semibold text-sign underline underline-offset-4">
              Vezi politica de rambursare
            </Link>
            .
          </p>
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
    src: "/media/cedeaza-popa-tatu.webp",
    alt: "Indicatorul Cedează trecerea și Interzis virajul la stânga în București",
    title: "Cedează trecerea · București",
  },
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
        {FEATURED_SIGNS.map((s) => (
          <figure key={s.src} className="overflow-hidden rounded-lg border border-line bg-surface">
            <SignSlot src={s.src} alt={s.alt} className="aspect-square rounded-none border-0" />
            <figcaption className="border-t border-line px-3 py-2 text-xs font-medium text-asphalt">
              {s.title}
            </figcaption>
          </figure>
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
    "Este valabil oficial?",
    "Nu înlocuiește examenul oficial organizat de autoritățile din România, decât dacă și când va exista un acord sau un agrement în acest sens. Ți-o spunem clar înainte de plată.",
  ],
  [
    "Primesc permisul de conducere pe e-mail?",
    "Nu. Permisul de conducere este eliberat doar de autorități. Tu primești atestatul de reușită Drumo, în maximum 3 zile de la examen.",
  ],
  [
    "Pot plăti în tranșe?",
    "Da. Prima plată deblochează cursurile, iar examenul se deblochează după achitarea integrală a taxei categoriei tale.",
  ],
  [
    "Cât costă?",
    "Taxa depinde de categoria de permis și o vezi la înscriere, înainte de plată. Nu există abonament.",
  ],
  [
    "Ce se întâmplă dacă nu trec?",
    "Vezi scorul, răspunsurile corecte și explicațiile. Condițiile pentru o nouă încercare sunt afișate înainte de plată.",
  ],
  [
    "De ce cereți act de identitate și selfie?",
    "Ca să ne asigurăm că persoana care dă examenul este cea înscrisă. Datele se păstrează criptat, o perioadă scurtă, apoi se șterg automat.",
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
              <ChevronDown className="h-5 w-5 shrink-0 text-mute transition-transform group-open:rotate-180" />
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
