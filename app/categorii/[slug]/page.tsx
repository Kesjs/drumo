import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { Pic } from "@/components/motion-kit";
import { getCategoryMedia } from "@/lib/data/category-media";
import { formatMoney } from "@/lib/domain/money";
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

  const [chapters, media] = await Promise.all([listChapters(cat.code), Promise.resolve(getCategoryMedia(cat.code))]);

  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <Link
          href="/categorii"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          <span>Toate categoriile</span>
        </Link>

        <section className="mt-6 overflow-hidden rounded-xl border border-line bg-white lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative aspect-[16/10] bg-asphalt lg:aspect-auto lg:min-h-[340px]">
            <Pic src={media.src} alt={media.alt_ro} eager />
            <div className="absolute left-4 top-4 rounded-md bg-asphalt/90 px-3.5 py-1.5 font-cond text-2xl font-bold leading-none text-white">
              {cat.code}
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <h1 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl">
                {cat.name_ro}
              </h1>
              <p className="mt-3 max-w-[65ch] text-base text-mute">{cat.description_ro}</p>

              <div className="mt-6 rounded-xl border border-line bg-chalk p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-mute">Taxă unică de categorie</div>
                    <div className="mt-0.5 flex items-baseline gap-2">
                      <span className="font-cond text-4xl font-bold tabular-nums text-asphalt">
                        {formatMoney(cat.fee_ron, "RON")}
                      </span>
                      <span className="font-mono text-xs text-mute">({formatMoney(cat.fee_eur, "EUR")})</span>
                    </div>
                  </div>
                  <div className="text-xs text-mute sm:text-right">
                    <div className="font-semibold text-asphalt">
                      Prima tranșă de la {formatMoney(cat.min_first_installment_ron, "RON")}
                    </div>
                    <div>
                      ({formatMoney(cat.min_first_installment_eur, "EUR")}) · max. {cat.max_installments} tranșe
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/inscriere?cat=${cat.code}`}
                className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-6 py-2.5 text-sm font-semibold text-asphalt transition-colors hover:bg-[#e0a900]"
              >
                Înscrie-te pentru {cat.code} · {formatMoney(cat.fee_ron, "RON")}
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="font-cond text-2xl font-bold text-asphalt">Vehicule încadrate</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-mute">
              {cat.vehicles_ro.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="font-cond text-2xl font-bold text-asphalt">Structura examenului pe platformă</h2>
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
          <h2 className="font-cond text-3xl font-bold text-asphalt">Capitole incluse în pregătire ({chapters.length})</h2>
          <p className="mt-2 max-w-[65ch] text-sm text-mute">
            Fiecare capitol conține rezumat, curs detaliat cu fotografii reale și audio („Ascultă lecția”), urmat de
            testul de capitol.
          </p>
          <ol className="mt-6 space-y-3">
            {chapters.map((ch, idx) => (
              <li key={ch.id} className="rounded-xl border border-line bg-white p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-cond text-xl font-bold text-asphalt">
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
