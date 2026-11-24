import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { getCurrentUser } from "@/lib/data/store";

export const metadata = { title: "Politica de rambursare" };
export const dynamic = "force-dynamic";

export default async function RefundsPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-3xl px-5 py-16 space-y-6 text-sm leading-relaxed text-mute">
        <h1 className="font-cond text-4xl font-bold text-asphalt">Politica de rambursare</h1>
        <p className="rounded-lg border-2 border-asphalt bg-surface p-5 text-asphalt">
          Această politică este afișată integral înainte de orice plată pe PermisStart.
        </p>

        <section className="space-y-2">
          <h2 className="font-cond text-2xl font-bold text-asphalt">1. Rambursare integrală în 14 zile (neutilizat)</h2>
          <p>
            Dacă ai achitat integral sau prima tranșă și nu ai accesat lecțiile și nu ai început niciun test de capitol,
            poți solicita rambursarea integrală în termen de 14 zile calendaristice de la plată.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-cond text-2xl font-bold text-asphalt">2. După deblocarea și parcurgerea cursurilor</h2>
          <p>
            Dacă ai început studiul pe capitole sau testele, prima tranșă aferentă accesului la cursuri nu mai este
            rambursabilă integral; eventualele tranșe suplimentare achitate pentru examen pot fi rambursate înainte de
            începerea sesiunii de examen, cu excepția cazurilor de fraudă dovedită.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-cond text-2xl font-bold text-asphalt">3. Cum soliciți rambursarea</h2>
          <p>
            Din contul tău, în pagina{" "}
            <Link href="/plata" className="font-semibold text-sign underline underline-offset-4">
              Plată
            </Link>
            , sau prin{" "}
            <Link href="/contact" className="font-semibold text-sign underline underline-offset-4">
              formularul de contact
            </Link>
            . Solicitările aprobate se restituie pe același instrument de plată în 5–10 zile lucrătoare.
          </p>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
