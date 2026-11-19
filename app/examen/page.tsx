import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { ExamMock } from "@/components/mockups";
import { getCurrentUser } from "@/lib/data/store";

export const metadata = { title: "Examen online" };
export const dynamic = "force-dynamic";

export default async function PublicExamPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
              Examen teoretic în condiții controlate
            </h1>
            <p className="mt-4 max-w-[60ch] text-mute">
              Tu alegi momentul în care intri în sala de examen, dar regulile sunt fixe și verificate pe server.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="rounded-lg border border-line bg-surface p-4">
                <strong>3 condiții de deblocare:</strong> identitate aprobată (KYC), taxa categoriei plătită integral și
                scorul de pregătire atins la evaluarea globală.
              </li>
              <li className="rounded-lg border border-line bg-surface p-4">
                <strong>Cronometru strict și trecere automată:</strong> fiecare întrebare are timp limită măsurat pe
                server; nu există întoarcere la întrebarea anterioară.
              </li>
              <li className="rounded-lg border border-line bg-surface p-4">
                <strong>Cameră și jurnal antifraudă:</strong> camera rămâne activă, iar pierderea focusului sau ieșirea
                din filă se înregistrează cu marcaj temporal.
              </li>
            </ul>
            <div className="mt-8">
              <Link
                href={user ? "/examen/briefing" : "/inscriere"}
                className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-6 py-3 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
              >
                {user ? "Verifică eligibilitatea" : "Începe înscrierea"}
              </Link>
            </div>
          </div>
          <ExamMock />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
