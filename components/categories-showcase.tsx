"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  VideoCameraIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import type { SeedCategory } from "@/lib/data/seed-content";
import { CATEGORY_GROUPS, getCategoryMedia, type CategoryGroupKey } from "@/lib/data/category-media";
import { formatMoney, type Currency } from "@/lib/domain/money";
import { Pic, Reveal, SplitWords, Magnetic } from "@/components/motion-kit";
import { btnPrimary, btnGhostDark, btnGhostLight } from "@/lib/ui";

type FilterValue = "all" | CategoryGroupKey;

function priceParts(c: SeedCategory, currency: Currency) {
  const total = currency === "RON" ? c.fee_ron : c.fee_eur;
  const first = currency === "RON" ? c.min_first_installment_ron : c.min_first_installment_eur;
  const secondary = currency === "RON" ? formatMoney(c.fee_eur, "EUR") : formatMoney(c.fee_ron, "RON");
  return {
    totalFormatted: formatMoney(total, currency),
    firstFormatted: formatMoney(first, currency),
    secondaryFormatted: secondary,
  };
}

function cleanCategoryTitle(nameRo: string) {
  return nameRo.replace(/^Categoria [A-Z0-9]+ — /, "");
}

export function CategoriesShowcase({ categories }: { categories: SeedCategory[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [currency, setCurrency] = useState<Currency>("RON");

  const catB = categories.find((c) => c.code === "B");
  const catBPrices = catB ? priceParts(catB, currency) : null;

  const filtered = categories.filter((c) => {
    if (filter === "all") return true;
    return getCategoryMedia(c.code).group === filter;
  });

  const spotlight = (filter === "all" || filter === "auto") && catB ? catB : null;

  const groupedToRender = CATEGORY_GROUPS.map((grp) => ({
    ...grp,
    items: filtered.filter((c) => getCategoryMedia(c.code).group === grp.key && c.code !== spotlight?.code),
  })).filter((g) => g.items.length > 0);

  const countFor = (key: FilterValue) =>
    key === "all"
      ? categories.length
      : categories.filter((c) => getCategoryMedia(c.code).group === key).length;

  const minPriceFor = (groups: CategoryGroupKey[]) => {
    const matches = categories.filter((c) => groups.includes(getCategoryMedia(c.code).group));
    if (matches.length === 0) return "";
    const minVal = Math.min(...matches.map((c) => (currency === "RON" ? c.fee_ron : c.fee_eur)));
    return `de la ${formatMoney(minVal, currency)}`;
  };

  const includedPerFee = [
    { Icon: BookOpenIcon, t: "Toate capitolele cu fotografii reale și redare audio" },
    { Icon: ShieldCheckIcon, t: "Evaluare adaptivă nelimitată + evaluare globală de pregătire" },
    { Icon: VideoCameraIcon, t: "Sesiune de examen online supravegheat cu rezultat imediat" },
    { Icon: QrCodeIcon, t: "Atestat de reușită PermiStart PDF cu cod QR verificabil" },
  ];

  return (
    <>
      {/* Full-bleed photographic Hero */}
      <section className="relative isolate flex min-h-[68svh] items-end overflow-hidden bg-asphalt text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Pic
            src="/media/nadlac-frontiera.webp"
            alt="Autostrada Nădlac cu benzi separate pentru autoturisme, autobuze și camioane"
            eager
            className="object-[50%_45%]"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-asphalt/55" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-asphalt via-asphalt/45 to-asphalt/60"
        />

        <div className="mx-auto w-full max-w-6xl px-5 pb-12 pt-28 sm:pb-16">
          <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="max-w-[18ch] font-cond text-4xl font-bold leading-[1.04] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
                <SplitWords text="Alege categoria. Vezi taxa din start." />
              </h1>
              <p className="mt-4 max-w-[54ch] text-base text-white/90 sm:text-lg">
                Toate cele 15 categorii europene de permis cu cursuri dedicate, evaluare adaptivă și examen supravegheat.
                O singură taxă per categorie — plătită integral sau în tranșe, fără abonament.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Magnetic>
                  <Link href="/inscriere?cat=B" className={btnPrimary}>
                    Începe cu Categoria B · {catBPrices ? catBPrices.totalFormatted : "5.750 lei"}
                  </Link>
                </Magnetic>
                <a href="#lista-categorii" className={btnGhostDark}>
                  <span>Compară toate categoriile</span>
                  <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 divide-y divide-white/15 rounded-xl border border-white/20 bg-asphalt/90 p-4 sm:grid-cols-3 sm:gap-3 sm:divide-x sm:divide-y-0">
              <div className="pb-3 sm:pb-0 sm:pr-3">
                <div className="font-mono text-xs text-white/70">Două roți</div>
                <div className="mt-1 font-cond text-2xl font-bold tabular-nums text-white">
                  {minPriceFor(["moto"])}
                </div>
                <div className="mt-0.5 text-xs text-white/75">AM · A1 · A2 · A</div>
              </div>
              <div className="py-3 sm:px-3 sm:py-0">
                <div className="font-mono text-xs text-white/70">Autoturisme</div>
                <div className="mt-1 font-cond text-2xl font-bold tabular-nums text-signal">
                  {minPriceFor(["auto"])}
                </div>
                <div className="mt-0.5 text-xs text-white/75">B1 · B · BE</div>
              </div>
              <div className="pt-3 sm:pl-3 sm:pt-0">
                <div className="font-mono text-xs text-white/70">Camioane &amp; Autobuze</div>
                <div className="mt-1 font-cond text-2xl font-bold tabular-nums text-white">
                  {minPriceFor(["camioane", "autobuze"])}
                </div>
                <div className="mt-0.5 text-xs text-white/75">C1 · C · CE · D1 · D · DE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & currency switcher bar */}
      <div id="lista-categorii" className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrează după tipul vehiculului">
            {(
              [
                ["all", `Toate (${countFor("all")})`],
                ["moto", `Mopede & Moto (${countFor("moto")})`],
                ["auto", `Autoturisme (${countFor("auto")})`],
                ["camioane", `Camioane (${countFor("camioane")})`],
                ["autobuze", `Autobuze (${countFor("autobuze")})`],
              ] as Array<[FilterValue, string]>
            ).map(([key, label]) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  aria-pressed={active}
                  className={`inline-flex min-h-[44px] items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-asphalt text-chalk"
                      : "border border-line bg-chalk text-asphalt hover:border-asphalt hover:bg-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div
            className="inline-flex items-center rounded-lg border border-line bg-chalk p-1"
            role="group"
            aria-label="Moneda de afișare a prețurilor"
          >
            {(["RON", "EUR"] as Currency[]).map((cur) => {
              const active = currency === cur;
              return (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setCurrency(cur)}
                  aria-pressed={active}
                  className={`min-h-[38px] rounded-md px-3.5 py-1.5 font-mono text-xs font-semibold transition-colors ${
                    active ? "bg-asphalt text-chalk" : "text-mute hover:text-asphalt"
                  }`}
                >
                  {cur === "RON" ? "RON (lei)" : "EUR (€)"}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main catalog showcase */}
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        {/* Featured spotlight for Category B */}
        {spotlight && catBPrices && (
          <Reveal>
            <article className="mb-16 overflow-hidden rounded-xl border border-line bg-white lg:grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative aspect-[16/10] bg-asphalt lg:aspect-auto lg:min-h-[380px]">
                <Pic src={getCategoryMedia(spotlight.code).src} alt={getCategoryMedia(spotlight.code).alt_ro} eager />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md bg-asphalt/90 px-3.5 py-1.5 text-white">
                  <span className="font-cond text-2xl font-bold leading-none">Categoria {spotlight.code}</span>
                </div>
                <div className="absolute bottom-4 right-4 rounded-md bg-asphalt/90 px-3 py-1 font-mono text-xs text-white">
                  Vârstă minimă: {spotlight.min_age} ani
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl">
                      {cleanCategoryTitle(spotlight.name_ro)}
                    </h2>
                    <span className="inline-flex items-center rounded-md bg-sign/10 px-2.5 py-1 text-xs font-semibold text-sign">
                      Cea mai aleasă
                    </span>
                  </div>
                  <p className="mt-3 text-base text-mute">{spotlight.description_ro}</p>

                  {/* Highlighted pricing plate */}
                  <div className="mt-6 rounded-xl border border-line bg-chalk p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <div>
                        <div className="text-xs font-medium text-mute">Taxă unică completă</div>
                        <div className="mt-0.5 flex items-baseline gap-2.5">
                          <span className="font-cond text-4xl font-bold tabular-nums text-asphalt">
                            {catBPrices.totalFormatted}
                          </span>
                          <span className="font-mono text-xs text-mute">({catBPrices.secondaryFormatted})</span>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-ok">
                          <CreditCardIcon className="h-4 w-4" aria-hidden="true" />
                          <span>Sau de la {catBPrices.firstFormatted} / prima tranșă</span>
                        </div>
                        <div className="mt-0.5 text-xs text-mute">
                          Până la {spotlight.max_installments} tranșe · cursurile pornesc imediat
                        </div>
                      </div>
                    </div>
                  </div>

                  <dl className="mt-5 grid grid-cols-3 divide-x divide-line border-y border-line py-3 text-sm">
                    <div className="pr-3">
                      <dt className="text-xs text-mute">Examen</dt>
                      <dd className="font-mono font-semibold text-asphalt">
                        {spotlight.exam_question_count} întrebări
                      </dd>
                    </div>
                    <div className="px-3">
                      <dt className="text-xs text-mute">Prag admis</dt>
                      <dd className="font-mono font-semibold text-asphalt">
                        {spotlight.exam_pass_mark}/{spotlight.exam_question_count}
                      </dd>
                    </div>
                    <div className="pl-3">
                      <dt className="text-xs text-mute">Timp / întrebare</dt>
                      <dd className="font-mono font-semibold text-asphalt">{spotlight.seconds_per_question} sec</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href={`/inscriere?cat=${spotlight.code}`} className={btnPrimary}>
                    Alege Categoria {spotlight.code} · {catBPrices.totalFormatted}
                  </Link>
                  <Link href={`/categorii/${spotlight.slug}`} className={btnGhostLight}>
                    Detalii și capitole
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        )}

        {/* Categorised photo + pricing showcase */}
        <div className="space-y-16">
          {groupedToRender.map((group) => (
            <section key={group.key} aria-labelledby={`heading-${group.key}`}>
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
                <div>
                  <h2
                    id={`heading-${group.key}`}
                    className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt sm:text-4xl"
                  >
                    {group.label_ro}
                  </h2>
                  <p className="mt-1.5 max-w-[60ch] text-sm text-mute sm:text-base">{group.description_ro}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-7 md:grid-cols-2">
                {group.items.map((c, idx) => {
                  const media = getCategoryMedia(c.code);
                  const prices = priceParts(c, currency);
                  return (
                    <Reveal key={c.id} delay={idx * 0.04}>
                      <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white">
                        {/* Real vehicle photo */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-asphalt">
                          <Pic
                            src={media.src}
                            alt={media.alt_ro}
                            className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          />
                          <div className="absolute left-3.5 top-3.5 rounded-md bg-asphalt/90 px-3 py-1 font-cond text-2xl font-bold leading-none text-white">
                            {c.code}
                          </div>
                          <div className="absolute bottom-3.5 right-3.5 rounded-md bg-asphalt/90 px-2.5 py-1 font-mono text-xs text-white">
                            {c.min_age}+ ani
                          </div>
                        </div>

                        {/* Content & price highlight */}
                        <div className="flex flex-1 flex-col justify-between p-6">
                          <div>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-cond text-2xl font-bold leading-tight text-asphalt">
                                  {cleanCategoryTitle(c.name_ro)}
                                </h3>
                                <p className="mt-1.5 text-sm text-mute">{c.short_ro}</p>
                              </div>
                              <div className="shrink-0 text-right">
                                <div className="font-cond text-3xl font-bold leading-none tabular-nums text-asphalt">
                                  {prices.totalFormatted}
                                </div>
                                <div className="mt-1 font-mono text-xs text-mute">({prices.secondaryFormatted})</div>
                              </div>
                            </div>

                            {/* Installment callout */}
                            <div className="mt-4 flex items-center justify-between rounded-lg bg-chalk px-3.5 py-2.5 text-xs">
                              <span className="font-semibold text-asphalt">
                                Prima tranșă de la {prices.firstFormatted}
                              </span>
                              <span className="font-mono text-mute">Max. {c.max_installments} tranșe</span>
                            </div>

                            {/* Specs row */}
                            <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-y border-line py-3 text-xs text-mute">
                              <div>
                                <dt className="sr-only">Întrebări examen</dt>
                                <dd className="font-medium text-asphalt">{c.exam_question_count} întrebări</dd>
                              </div>
                              <span aria-hidden="true" className="text-line">
                                ·
                              </span>
                              <div>
                                <dt className="sr-only">Prag admis</dt>
                                <dd>
                                  Prag admis <strong className="text-asphalt">{c.exam_pass_mark}/{c.exam_question_count}</strong>
                                </dd>
                              </div>
                              <span aria-hidden="true" className="text-line">
                                ·
                              </span>
                              <div>
                                <dt className="sr-only">Timp per întrebare</dt>
                                <dd>{c.seconds_per_question}s / întrebare</dd>
                              </div>
                            </dl>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <Link
                              href={`/categorii/${c.slug}`}
                              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
                            >
                              <span>Detalii și capitole</span>
                              <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
                            </Link>
                            <Link
                              href={`/inscriere?cat=${c.code}`}
                              className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-4 py-2 text-sm font-semibold text-asphalt transition-colors hover:bg-[#e0a900]"
                            >
                              Alege {c.code} · {prices.totalFormatted}
                            </Link>
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Transitional lead note before inclusion block */}
        <div className="mt-16 border-t border-line pt-10">
          <p className="max-w-[65ch] text-base font-medium text-asphalt sm:text-lg">
            Indiferent de categoria aleasă, achiți o singură taxă — fără abonamente lunare sau pachete suplimentare.
          </p>
          <p className="mt-2 max-w-[65ch] text-sm text-mute sm:text-base">
            Poți verifica suma exactă în RON sau EUR la înscriere, înainte de orice plată, și poți porni pregătirea cu
            prima tranșă în câteva minute.
          </p>
        </div>

        {/* Bottom value & payment inclusion band */}
        <section className="mt-8 rounded-xl border border-line bg-white p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <h2 className="font-cond text-3xl font-bold tracking-[-0.015em] text-asphalt">
                Ce include orice taxă de categorie
              </h2>
              <p className="mt-3 max-w-[52ch] text-sm text-mute sm:text-base">
                Plătești o singură dată pentru categoria aleasă. Cursurile se deschid imediat după prima tranșă, iar
                examenul supravegheat devine accesibil după achitarea integrală și promovarea evaluării globale.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/inscriere" className={btnPrimary}>
                  Începe înscrierea
                </Link>
                <Link
                  href="/cum-functioneaza"
                  className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-sign underline underline-offset-4 hover:text-asphalt"
                >
                  <span>Vezi toate etapele</span>
                  <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <ul className="divide-y divide-line border-y border-line">
              {includedPerFee.map(({ Icon, t }) => (
                <li key={t} className="flex items-center gap-3.5 py-3.5 text-sm font-medium text-asphalt">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-chalk text-asphalt">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1">{t}</span>
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-ok" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
