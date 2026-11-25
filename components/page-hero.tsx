"use client";

import type { ReactNode } from "react";
import { Pic, SplitWords } from "@/components/motion-kit";

export function PageHero({
  title,
  subtitle,
  image,
  actions,
  aside,
}: {
  title: string;
  subtitle: string;
  image: { src: string; alt: string; objectPosition?: string };
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative isolate flex min-h-[56svh] items-end overflow-hidden bg-asphalt text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Pic src={image.src} alt={image.alt} eager className={image.objectPosition ?? "object-center"} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-asphalt/55" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-asphalt via-asphalt/45 to-asphalt/60"
      />

      <div className="mx-auto w-full max-w-6xl px-5 pb-12 pt-28 sm:pb-14">
        <div className={aside ? "grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]" : "max-w-3xl"}>
          <div>
            <h1 className="max-w-[20ch] font-cond text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
              <SplitWords text={title} />
            </h1>
            <p className="mt-4 max-w-[56ch] text-base text-white/90 sm:text-lg">{subtitle}</p>
            {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {aside ? <div>{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
