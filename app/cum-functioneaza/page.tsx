import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { getCurrentUser } from "@/lib/data/store";

export const metadata = { title: "Cum funcționează" };
export const dynamic = "force-dynamic";

const STEPS = [
  {
    n: "1",
    t: "Înscrierea și alegerea categoriei",
    d: "Completezi numele, datele de contact, țara din Uniunea Europeană și categoria de permis. Vezi taxa exactă a categoriei înainte de orice plată.",
  },
  {
    n: "2",
    t: "Verificarea identității (KYC)",
    d: "Încarci o fotografie a actului de identitate și un selfie. Cazurile neclare intră în revizuire manuală. Documentele se păstrează criptat și se șterg automat după expirarea termenului scurt de retenție.",
  },
  {
    n: "3",
    t: "Plata integrală sau în tranșe",
    d: "Niciun abonament. Poți achita integral sau în tranșe: prima plată deblochează toate cursurile și testele de pregătire. Examenul rămâne blocat până la achitarea integrală.",
  },
  {
    n: "4",
    t: "Studiu pe capitole cu imagini reale și audio",
    d: "Fiecare capitol are rezumat, lecție completă cu fotografii reale ale indicatoarelor din România, redare audio („Ascultă lecția”) și test cu explicații pentru fiecare variantă.",
  },
  {
    n: "5",
    t: "Evaluare adaptivă și evaluare globală",
    d: "Motorul adaptiv selectează întrebările următoare în funcție de capitolele și dificultățile unde ai greșit. Evaluarea globală calculează scorul de pregătire necesar deblocării examenului.",
  },
  {
    n: "6",
    t: "Sala de examen supravegheată",
    d: "Compui când ești pregătit: citire audio automată, cronometru strict pe întrebare fără întoarcere, cameră activă și jurnalizare orară a ieșirilor din fereastră.",
  },
  {
    n: "7",
    t: "Rezultat imediat și atestat cu QR",
    d: "Primești imediat scorul și analiza întrebare cu întrebare. Dacă ești admis, atestatul de reușită Drumo (PDF cu cod QR verificabil) este trimis automat pe e-mail în maximum 3 zile.",
  },
];

export default async function HowItWorksPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-4xl px-5 py-16">
        <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
          Cum funcționează Drumo
        </h1>
        <p className="mt-4 max-w-[65ch] text-mute">
          De la înscriere până la atestatul verificabil, fiecare etapă este clară și urmărită pe server.
        </p>

        <ol className="mt-10 space-y-4">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-lg border border-line bg-surface p-6">
              <span className="font-mono text-xs font-medium text-sign">Pasul {s.n}</span>
              <h2 className="mt-1 font-cond text-2xl font-bold">{s.t}</h2>
              <p className="mt-2 max-w-[65ch] text-sm text-mute">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/inscriere"
            className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-6 py-3 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
          >
            Începe înscrierea
          </Link>
          <Link
            href="/categorii"
            className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-surface px-6 py-3 text-sm font-semibold text-asphalt hover:bg-chalk"
          >
            Vezi categoriile
          </Link>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
