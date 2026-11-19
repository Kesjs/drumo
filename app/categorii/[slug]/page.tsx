import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { getCategoryBySlug, getCurrentUser, listChapters } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  return { title: cat ? cat.name_ro : "Categorie" };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [user, cat] = await Promise.all([getCurrentUser(), getCategoryBySlug(slug)]);
  if (!cat) notFound();

  const chapters = await listChapters(cat.code);

  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-5xl px-5 py-16">
        <Link href="/categorii" className="text-sm font-semibold text-sign underline underline-offset-4">
          ← Toate categoriile
        </Link>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-6">
          <div>
            <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">{cat.name_ro}</h1>
            <p className="mt-3 max-w-[65ch] text-base text-mute">{cat.description_ro}</p>
          </div>
          <Link
            href={`/inscriere?cat=${cat.code}`}
            className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-5 py-2.5 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
          >
            Înscrie-te pentru {cat.code}
          </Link>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-surface p-6">
            <h2 className="font-cond text-2xl font-bold">Vehicule încadrate</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-mute">
              {cat.vehicles_ro.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-line bg-surface p-6">
            <h2 className="font-cond text-2xl font-bold">Structura examenului pe platformă</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between border-b border-line pb-1.5">
                <dt className="text-mute">Vârstă minimă legală</dt>
                <dd className="font-mono font-medium">{cat.min_age} ani</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-1.5">
                <dt className="text-mute">Număr întrebări examen</dt>
                <dd className="font-mono font-medium">{cat.exam_question_count}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-1.5">
                <dt className="text-mute">Prag minim admis</dt>
                <dd className="font-mono font-medium">{cat.exam_pass_mark} corecte</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mute">Timp per întrebare</dt>
                <dd className="font-mono font-medium">{cat.seconds_per_question} secunde</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-cond text-3xl font-bold">Capitole incluse în pregătire ({chapters.length})</h2>
          <p className="mt-2 max-w-[65ch] text-sm text-mute">
            Fiecare capitol conține rezumat, curs detaliat cu fotografii reale și audio („Ascultă lecția”), urmat de
            testul de capitol. Taxa categoriei se afișează la pasul de înscriere.
          </p>
          <ol className="mt-6 space-y-3">
            {chapters.map((ch, idx) => (
              <li key={ch.id} className="rounded-lg border border-line bg-surface p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-cond text-xl font-bold">
                    Capitolul {idx + 1} · {ch.title_ro}
                  </h3>
                  <span className="font-mono text-xs text-mute">~{ch.minutes} min</span>
                </div>
                <p className="mt-1.5 max-w-[65ch] text-sm text-mute">{ch.summary_ro}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
