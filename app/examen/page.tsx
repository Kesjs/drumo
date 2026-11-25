import Link from "next/link";
import {
  ClockIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { PageHero } from "@/components/page-hero";
import { ExamMock } from "@/components/mockups";
import { getCurrentUser } from "@/lib/data/store";
import { btnPrimary, btnGhostDark } from "@/lib/ui";

export const metadata = { title: "Examen online supravegheat" };
export const dynamic = "force-dynamic";

const EXAM_RULES = [
  {
    Icon: ClockIcon,
    title: "60 secunde pe întrebare, fără întoarcere",
    body: "Fiecare întrebare are cronometru măsurat pe server. La expirarea timpului, sesiunea avansează automat către următoarea întrebare.",
  },
  {
    Icon: VideoCameraIcon,
    title: "Cameră activă și jurnalizare antifraudă",
    body: "Camera rămâne activă pe durata examenului, iar părăsirea filei sau pierderea focusului se înregistrează automat cu oră exactă.",
  },
  {
    Icon: DocumentCheckIcon,
    title: "Extragere aleatorie și rezultat instant",
    body: "Primești un set unic de întrebări, citire audio opțională, scor imediat la finalizare și atestat QR trimis pe e-mail în max. 3 zile.",
  },
];

const UNLOCK_GATES = [
  {
    title: "Identitate verificată (KYC)",
    detail: "Actul de identitate și selfie-ul sunt aprobate pentru sesiunea curentă.",
  },
  {
    title: "Taxă achitată integral",
    detail: "Toate tranșele pentru categoria aleasă sunt finalizate fără restanțe.",
  },
  {
    title: "Evaluare globală trecută",
    detail: "Ai atins pragul minim de pregătire stabilit pentru categoria ta.",
  },
];

export default async function PublicExamPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main>
        <PageHero
          title="Condiții reale de examen, supravegheate cap-coadă."
          subtitle="Tu alegi momentul în care intri în sala de examen, însă cronometrul, selecția întrebărilor și monitorizarea integrității sunt aplicate strict pe server."
          image={{
            src: "/media/sens-giratoriu-timisoara.webp",
            alt: "Sens giratoriu cu mai multe benzi de circulație în Timișoara",
            objectPosition: "object-[50%_55%]",
          }}
          actions={
            <>
              <Link href={user ? "/examen/briefing" : "/inscriere"} className={btnPrimary}>
                {user ? "Verifică eligibilitatea" : "Începe înscrierea"}
              </Link>
              <Link href="/categorii" className={btnGhostDark}>
                Vezi structura pe categorii
              </Link>
            </>
          }
          aside={
            <div className="rounded-xl border border-white/20 bg-asphalt/90 p-5">
              <div className="space-y-3 divide-y divide-white/15 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/75">Întrebări examen</span>
                  <span className="font-mono font-semibold text-white">20 (AM/A) · 26 (B/C/D)</span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-3">
                  <span className="text-white/75">Timp pe întrebare</span>
                  <span className="font-mono font-semibold text-signal">60 secunde · fix</span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-3">
                  <span className="text-white/75">Rezultat și explicații</span>
                  <span className="font-mono font-semibold text-white">Afișate pe loc</span>
                </div>
              </div>
            </div>
          }
        />

        {/* Dark proctoring console spotlight */}
        <section className="bg-ink py-16 text-chalk sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr]">
            <ExamMock />

            <div>
              <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-white sm:text-4xl">
                Regulile sălii de examen
              </h2>
              <p className="mt-3 max-w-[54ch] text-base text-chalk/75">
                Interfața elimină orice element care distrage atenția și aplică aceleași reguli de timp și ordine ca într-un
                examen oficial.
              </p>

              <ul className="mt-8 divide-y divide-chalk/15 border-y border-chalk/15">
                {EXAM_RULES.map(({ Icon, title, body }) => (
                  <li key={title} className="flex items-start gap-4 py-5">
                    <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-chalk/20 bg-[#10161f] text-signal">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-cond text-xl font-bold text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-chalk/75">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Unlock prerequisites */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
            <div>
              <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl">
                Cele 3 condiții de deblocare
              </h2>
              <p className="mt-3 text-base text-mute">
                Nu intri în examen la întâmplare: sistemul verifică automat că ești pregătit și că profilul tău este
                validat complet.
              </p>
              <div className="mt-6">
                <Link href={user ? "/examen/briefing" : "/inscriere"} className={btnPrimary}>
                  {user ? "Deschide briefing-ul examenului" : "Începe pregătirea"}
                </Link>
              </div>
            </div>

            <div className="divide-y divide-line rounded-xl border border-line bg-white">
              {UNLOCK_GATES.map((g, i) => (
                <div key={g.title} className="flex items-start gap-4 p-6">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-chalk font-mono text-sm font-bold text-asphalt">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-cond text-xl font-bold text-asphalt">{g.title}</h3>
                    <p className="mt-1 text-sm text-mute">{g.detail}</p>
                  </div>
                  <ShieldCheckIcon className="ml-auto h-5 w-5 shrink-0 text-ok" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
