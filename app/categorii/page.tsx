import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { getCurrentUser, listCategories } from "@/lib/data/store";

export const metadata = { title: "Categorii de permis" };
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [user, categories] = await Promise.all([getCurrentUser(), listCategories()]);

  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
          Categorii de permis disponibile
        </h1>
        <p className="mt-4 max-w-[65ch] text-mute">
          Fiecare categorie are propriul set de capitole, numărul de întrebări de examen și taxa aferentă. Suma exactă
          se afișează la înscriere, înainte de orice plată.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {categories.map((c) => (
            <article key={c.id} className="flex flex-col justify-between rounded-lg border-2 border-asphalt bg-surface p-6">
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-cond text-4xl font-bold text-asphalt">{c.code}</span>
                  <span className="font-mono text-xs text-mute">Vârstă minimă: {c.min_age} ani</span>
                </div>
                <h2 className="mt-2 font-cond text-2xl font-bold text-asphalt">
                  {c.name_ro.replace(" — ", " · ")}
                </h2>
                <p className="mt-2 text-sm text-mute">{c.short_ro}</p>
                <p className="mt-3 text-xs text-mute">
                  Examen: {c.exam_question_count} întrebări · prag admis {c.exam_pass_mark}/{c.exam_question_count} ·{" "}
                  {c.seconds_per_question}s / întrebare
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/categorii/${c.slug}`}
                  className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-chalk px-4 py-2 text-sm font-semibold text-asphalt hover:bg-white"
                >
                  Detalii și capitole
                </Link>
                <Link
                  href={`/inscriere?cat=${c.code}`}
                  className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-4 py-2 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
                >
                  Alege categoria {c.code}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
