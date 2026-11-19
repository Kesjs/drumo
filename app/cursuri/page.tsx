import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { RealPhoto } from "@/components/real-photo";
import { getCurrentUser, listChapters } from "@/lib/data/store";

export const metadata = { title: "Cursuri" };
export const dynamic = "force-dynamic";

export default async function PublicCoursesPage() {
  const [user, chapters] = await Promise.all([getCurrentUser(), listChapters()]);
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
          Programa cursurilor pe capitole
        </h1>
        <p className="mt-4 max-w-[65ch] text-mute">
          Cursurile sunt redactate după legislația rutieră din România (OUG 195/2002 și HG 1391/2006), cu imagini reale
          și suport audio („Ascultă lecția”). Se deblochează automat după prima plată.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {chapters.map((ch, idx) => (
            <article key={ch.id} className="overflow-hidden rounded-lg border border-line bg-surface">
              <RealPhoto slug={ch.cover_media_slug} className="aspect-[16/9] rounded-none border-0" />
              <div className="p-6">
                <span className="font-mono text-xs text-sign">Capitolul {idx + 1} · ~{ch.minutes} min</span>
                <h2 className="mt-1 font-cond text-2xl font-bold">{ch.title_ro}</h2>
                <p className="mt-2 text-sm text-mute">{ch.summary_ro}</p>
                <ul className="mt-4 space-y-1.5 text-xs text-asphalt">
                  {ch.key_points_ro.map((kp) => (
                    <li key={kp} className="rounded bg-chalk px-3 py-2">
                      {kp}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-lg border-2 border-asphalt bg-surface p-6">
          <h2 className="font-cond text-2xl font-bold">Acces complet la lecții și teste</h2>
          <p className="mt-2 max-w-[65ch] text-sm text-mute">
            După înscriere și achitarea primei tranșe (sau a taxei integrale), toate capitolele, testele și evaluarea
            adaptivă devin active în tabloul tău de bord.
          </p>
          <Link
            href={user ? "/capitole" : "/inscriere"}
            className="mt-4 inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-5 py-2.5 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
          >
            {user ? "Deschide capitolele" : "Înscrie-te acum"}
          </Link>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
