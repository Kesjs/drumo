import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { getCurrentUser } from "@/lib/data/store";
import { ChevronDown } from "lucide-react";

export const metadata = { title: "Întrebări frecvente" };
export const dynamic = "force-dynamic";

const ALL_FAQ = [
  {
    q: "De ce să mă pregătesc și să dau examenul pe PermisStart?",
    a: "PermisStart transformă pregătirea teoretică într-un parcurs clar: lecții pe capitole cu fotografii reale ale indicatoarelor din România, audio integral, repetiție spațiată pe capitolele slabe și un examen supravegheat în condiții identice cu sala oficială. Ajungi la proba autorităților pregătit să promovezi din prima încercare.",
  },
  {
    q: "Ce reprezintă atestatul de reușită PermisStart și cum se verifică?",
    a: "Atestatul de reușită PermisStart (PDF cu serie unică și cod QR verificabil public pe permisstart.ro/verificare) confirmă parcurgerea pregătirii și promovarea testului supravegheat pe platformă. Îl poți prezenta instructorului sau angajatorului ca dovadă a pregătirii tale. Nu este permis de conducere și nu înlocuiește examenul oficial organizat de autorități, decât dacă și când va exista un agrement oficial în acest sens.",
  },
  {
    q: "De ce nu există un tabel public de prețuri sau abonamente?",
    a: "PermisStart nu este un abonament recurent. Fiecare candidat achită o singură taxă stabilită în funcție de categoria de permis aleasă (AM, A1, A2, A, B1, B, BE, C, CE, D). Suma exactă în RON sau EUR apare la înscriere, înainte de orice plată.",
  },
  {
    q: "Cum funcționează plata în tranșe?",
    a: "Prima tranșă (minimul configurat pentru categoria ta) deblochează imediat accesul la toate cursurile pe capitole, testele de capitol și evaluările adaptive/globale. Examenul teoretic final rămâne blocat până când taxa categoriei este achitată integral.",
  },
  {
    q: "Ce se întâmplă în sala de examen?",
    a: "Întrebările sunt extrase aleatoriu dintr-o bancă securizată. Fiecare întrebare se citește automat audio (cu opțiuni Reascultă și Fără sunet) și are un cronometru strict măsurat pe server. Trecerea la întrebarea următoare este automată, fără posibilitate de întoarcere. Camera rămâne activă, iar ieșirile din filă sau pierderea focusului se înregistrează.",
  },
  {
    q: "În cât timp primesc atestatul după ce sunt admis?",
    a: "Atestatul de reușită PermisStart (PDF cu număr unic și cod QR verificabil public) este programat spre trimitere automată pe e-mail în cel mult 3 zile (72 de ore) de la finalizarea examenului. Dacă există alerte de integritate, administratorul poate reține temporar trimiterea pentru verificare.",
  },
  {
    q: "Ce faceți cu fotografia actului de identitate și selfie-ul?",
    a: "Le folosim exclusiv pentru a verifica faptul că persoana înscrisă este cea care susține examenul. Documentele sunt stocate criptat într-un spațiu privat cu acces restricționat și sunt șterse automat după expirarea termenului scurt de retenție.",
  },
  {
    q: "Cum pot solicita rambursarea?",
    a: "Politica de rambursare este afișată înainte de fiecare plată și disponibilă permanent în pagina Rambursări. Poți depune o cerere direct din secțiunea Plată a contului tău.",
  },
];

export default async function FaqPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">Întrebări frecvente</h1>
        <p className="mt-4 text-mute">
          Răspunsuri directe despre pregătire, plata pe categorii, examen și valabilitatea atestatului.
        </p>
        <div className="mt-8">
          {ALL_FAQ.map((item) => (
            <details key={item.q} className="group border-t border-line py-4 last:border-b">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                <span>{item.q}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-mute transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 max-w-[65ch] text-sm text-mute">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-10 text-sm text-mute">
          Ai o întrebare punctuală?{" "}
          <Link href="/contact" className="font-semibold text-sign underline underline-offset-4">
            Scrie-ne prin formularul de contact
          </Link>
          .
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
