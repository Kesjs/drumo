import Link from "next/link";
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  ClockIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { PageHero } from "@/components/page-hero";
import { RealPhoto } from "@/components/real-photo";
import { Reveal } from "@/components/motion-kit";
import { getCurrentUser, listChapters } from "@/lib/data/store";
import { btnPrimary, btnGhostDark, btnGhostLight } from "@/lib/ui";

export const metadata = { title: "Cursuri pe capitole" };
export const dynamic = "force-dynamic";

export default async function PublicCoursesPage() {
  const [user, chapters] = await Promise.all([getCurrentUser(), listChapters()]);
  const totalMinutes = chapters.reduce((acc, ch) => acc + ch.minutes, 0);

  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main>
        <PageHero
          title="Lecții reale, nu desene schematice."
          subtitle="Programa completă este redactată după OUG 195/2002 și HG 1391/2006, ilustrată cu fotografii reale din România și însoțită de redare audio la fiecare lecție."
          image={{
            src: "/media/bucuresti-ploaie.webp",
            alt: "Bulevard din București cu indicatoare rutiere, semafoare și semnalizare de lucrări",
            objectPosition: "object-[50%_55%]",
          }}
          actions={
            <>
              <Link href={user ? "/capitole" : "/inscriere"} className={btnPrimary}>
                {user ? "Deschide capitolele" : "Începe pregătirea"}
              </Link>
              <Link href="/categorii" className={btnGhostDark}>
                Alege categoria potrivită
              </Link>
            </>
          }
          aside={
            <div className="rounded-xl border border-white/20 bg-asphalt/90 p-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="border-r border-white/15 pr-3">
                  <div className="font-mono text-xs text-white/70">Capitole active</div>
                  <div className="mt-1 font-cond text-3xl font-bold tabular-nums text-white">{chapters.length}</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-white/70">Durată studiu</div>
                  <div className="mt-1 font-cond text-3xl font-bold tabular-nums text-signal">~{totalMinutes} min</div>
                </div>
              </div>
              <div className="mt-4 border-t border-white/15 pt-3 text-xs text-white/80">
                Include rezumat, lecție completă audio și test explicat la fiecare capitol.
              </div>
            </div>
          }
        />

        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <div>
              <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl">
                Programa cursurilor pe capitole
              </h2>
              <p className="mt-2 max-w-[62ch] text-base text-mute">
                După achitarea primei tranșe, toate capitolele și testele aferente categoriei tale se deblochează
                automat.
              </p>
            </div>
            <Link
              href="/cum-functioneaza"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
            >
              <span>Cum funcționează evaluarea adaptivă</span>
              <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 space-y-8">
            {chapters.map((ch, idx) => (
              <Reveal key={ch.id} delay={idx * 0.03}>
                <article className="overflow-hidden rounded-xl border border-line bg-white lg:grid lg:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative aspect-[16/10] bg-asphalt lg:aspect-auto lg:min-h-[260px]">
                    <RealPhoto slug={ch.cover_media_slug} className="h-full w-full rounded-none border-0" />
                    <div className="absolute left-3.5 top-3.5 rounded-md bg-asphalt/90 px-3 py-1 font-mono text-xs font-semibold text-white">
                      Capitolul {idx + 1}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-6 sm:p-8">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-cond text-2xl font-bold text-asphalt sm:text-3xl">{ch.title_ro}</h3>
                        <div className="flex items-center gap-3 font-mono text-xs text-mute">
                          <span className="inline-flex items-center gap-1">
                            <ClockIcon className="h-4 w-4 text-asphalt" aria-hidden="true" />
                            <span>~{ch.minutes} min</span>
                          </span>
                          <span className="inline-flex items-center gap-1 rounded bg-chalk px-2 py-1 text-asphalt">
                            <SpeakerWaveIcon className="h-3.5 w-3.5 text-sign" aria-hidden="true" />
                            <span>Audio</span>
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-mute sm:text-base">
                        {ch.summary_ro}
                      </p>

                      <ul className="mt-5 grid gap-2 sm:grid-cols-1">
                        {ch.key_points_ro.map((kp) => (
                          <li key={kp} className="flex items-start gap-2.5 text-sm text-asphalt">
                            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden="true" />
                            <span>{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-line bg-white p-8">
            <div>
              <h2 className="font-cond text-2xl font-bold text-asphalt sm:text-3xl">
                Acces complet la lecții, audio și teste de capitol
              </h2>
              <p className="mt-2 max-w-[60ch] text-sm text-mute sm:text-base">
                Alege categoria de permis și deblochează programa completă imediat după confirmarea primei plăți.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={user ? "/capitole" : "/inscriere"} className={btnPrimary}>
                {user ? "Deschide capitolele" : "Înscrie-te acum"}
              </Link>
              <Link href="/categorii" className={btnGhostLight}>
                Vezi categoriile și prețurile
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
