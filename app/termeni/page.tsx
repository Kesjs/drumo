import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { getCurrentUser } from "@/lib/data/store";
import { LEGAL_ENTITY } from "@/lib/config";

export const metadata = { title: "Termeni și condiții" };
export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-3xl px-5 py-16 space-y-6 text-sm leading-relaxed text-mute">
        <h1 className="font-cond text-4xl font-bold text-asphalt">Termeni și condiții</h1>
        <p className="rounded border border-asphalt bg-surface p-4 text-asphalt">
          Operator: {LEGAL_ENTITY.companyPlaceholder} · {LEGAL_ENTITY.cuiPlaceholder} · {LEGAL_ENTITY.addressPlaceholder}.
        </p>

        <section className="space-y-2">
          <h2 className="font-cond text-2xl font-bold text-asphalt">1. Natura serviciului și statut legal</h2>
          <p>
            PermisStart oferă pregătire teoretică online pe capitole, evaluări adaptive și un test teoretic supravegheat.
            La promovare se emite un <strong>atestat de reușită PermisStart</strong>. Acest document confirmă rezultatul
            obținut pe platformă, nu este permis de conducere și nu înlocuiește examenul oficial organizat de
            autoritățile din România, în lipsa unui agrement oficial.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-cond text-2xl font-bold text-asphalt">2. Taxa pe categorie și plata în tranșe</h2>
          <p>
            Platforma nu funcționează pe bază de abonament. Candidatul achită o taxă unică aferentă categoriei alese,
            integral sau în tranșe. Prima tranșă deblochează cursurile și evaluările; examenul final rămâne blocat până
            la achitarea integrală a taxei categoriei și îndeplinirea pragului de pregătire și a verificării KYC.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-cond text-2xl font-bold text-asphalt">3. Reguli de integritate în examen</h2>
          <p>
            În timpul examenului sunt obligatorii camera activă, păstrarea ferestrei în prim-plan și respectarea
            cronometrului per întrebare. Evenimentele suspecte sunt înregistrate în jurnal și pot duce la reținerea
            atestatului pentru verificare sau anularea sesiunii.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-cond text-2xl font-bold text-asphalt">4. Eliberarea atestatului și verificare QR</h2>
          <p>
            După promovarea examenului și în absența alertelor de integritate, <strong>atestatul de reușită PermisStart</strong>{" "}
            (PDF cu număr unic și cod QR) este programat pentru trimitere automată pe e-mail în cel mult 3 zile (72 de ore).
            Autenticitatea poate fi verificată oricând pe pagina publică de verificare.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-cond text-2xl font-bold text-asphalt">5. Drept de retragere și rambursări</h2>
          <p>
            Condițiile de rambursare în termen de 14 zile calendaristice (pentru acces neutilizat) sunt detaliate în
            Politica de rambursare, afișată înainte de fiecare plată. Pentru asistență ne poți contacta la{" "}
            <span className="font-mono text-asphalt">{LEGAL_ENTITY.contactEmail}</span>.
          </p>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
