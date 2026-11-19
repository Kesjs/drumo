import { getImageBySlug } from "@/lib/data/credits";
import { cn } from "@/lib/utils";

export function RealPhoto({
  slug,
  className = "",
  imgClassName = "object-cover",
  showCredit = false,
  priority = false,
}: {
  slug: string;
  className?: string;
  imgClassName?: string;
  showCredit?: boolean;
  priority?: boolean;
}) {
  const credit = getImageBySlug(slug);
  if (!credit) return null;

  const avif = credit.file.replace(/\.webp$/, ".avif");

  return (
    <figure className={cn("overflow-hidden rounded-lg border border-line bg-surface", className)}>
      <picture>
        <source srcSet={avif} type="image/avif" />
        <img
          src={credit.file}
          alt={credit.alt_ro}
          width={credit.width}
          height={credit.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn("h-full w-full", imgClassName)}
        />
      </picture>
      {showCredit ? (
        <figcaption className="border-t border-line bg-chalk px-3 py-2 text-xs text-mute">
          <span>{credit.alt_ro}</span>
          <span className="mt-0.5 block text-xs">
            Foto: {credit.author} · {credit.license} ({credit.source})
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
