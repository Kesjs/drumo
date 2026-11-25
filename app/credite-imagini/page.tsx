import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { IMAGE_CREDITS } from "@/lib/data/credits";
import { SIGNS_TO_PHOTOGRAPH } from "@/lib/data/seed-content";
import { getCurrentUser } from "@/lib/data/store";

export const metadata = { title: "Credite imagini" };
export const dynamic = "force-dynamic";

export default async function ImageCreditsPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">
          Credite imagini și licențe publice
        </h1>
        <p className="mt-4 max-w-[65ch] text-mute">
          Toate fotografiile rutiere de pe PermiStart sunt găzduite local (WebP și AVIF), provin exclusiv din surse cu
          licență verificată și respectă obligațiile de atribuire.
        </p>
        <p className="mt-3 max-w-[65ch] text-sm text-mute">
          Imaginea de fundal din partea de sus a primei pagini este o imagine generată cu inteligență artificială, nu
          o fotografie reală.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {IMAGE_CREDITS.map((img) => (
            <article key={img.slug} className="overflow-hidden rounded-lg border border-line bg-surface">
              <div className="aspect-[4/3] bg-chalk">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.file} alt={img.alt_ro} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="space-y-1.5 p-4 text-xs">
                <p className="font-semibold text-asphalt">{img.alt_ro}</p>
                <p className="text-mute">
                  Autor: <span className="text-asphalt">{img.author}</span>
                </p>
                <p className="text-mute">
                  Licență: <span className="font-mono text-asphalt">{img.license}</span> · Sursă: {img.source}
                </p>
                <a
                  href={img.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block font-semibold text-sign underline underline-offset-4"
                >
                  Fișa originală Wikimedia Commons
                </a>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-14 rounded-lg border-2 border-asphalt bg-surface p-6">
          <h2 className="font-cond text-2xl font-bold">Indicatoare de fotografiat pentru extinderea băncii</h2>
          <p className="mt-2 max-w-[65ch] text-sm text-mute">
            Pentru a evita desenele vectoriale sau imaginile cu licență neclară, următoarele indicatoare reale din
            România urmează să fie fotografiate pe teren:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {SIGNS_TO_PHOTOGRAPH.map((item) => (
              <li key={item.name} className="rounded border border-line bg-chalk px-4 py-3">
                <strong className="text-asphalt">{item.name}</strong> — <span className="text-mute">{item.why}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
