import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { getCurrentUser } from "@/lib/data/store";
import { LEGAL_ENTITY } from "@/lib/config";

export const metadata = { title: "Confidențialitate (GDPR)" };
export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-3xl px-5 py-16 space-y-6 text-sm leading-relaxed text-mute">
        <h1 className="font-cond text-4xl font-bold text-asphalt">Politica de confidențialitate (GDPR)</h1>
        <p>
          Operator de date: {LEGAL_ENTITY.companyPlaceholder}. Contact protecția datelor:{" "}
          <span className="font-mono text-asphalt">{LEGAL_ENTITY.dpoEmail}</span>.
        </p>

        <section className="space-y-2">
          <h2 className="font-cond text-2xl font-bold text-asphalt">1. Date colectate și scop</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Date de cont (nume, prenume, e-mail/telefon, țară UE, categorie): executarea contractului (art. 6 alin. 1 lit. b GDPR).</li>
            <li>Act de identitate și selfie (verificare KYC): prevenirea fraudei la examen, pe baza consimțământului explicit (art. 9 alin. 2 lit. a GDPR).</li>
            <li>Jurnal de securitate în examen și flux video local: verificarea integrității testului.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-cond text-2xl font-bold text-asphalt">2. Păstrare scurtă, criptare și ștergere automată</h2>
          <p>
            Documentele de identitate și selfie-urile sunt încărcate în spațiu de stocare privat criptat, accesibil strict
            persoanelor autorizate pentru revizuire, și sunt șterse automat la maximum 30 de zile de la depunere (sau mai
            devreme la solicitare, după finalizarea verificării).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-cond text-2xl font-bold text-asphalt">3. Drepturile tale</h2>
          <p>
            Ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate, retragere a consimțământului și
            plângere către ANSPDCP (România).
          </p>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
