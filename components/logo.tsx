// Logo PermiStart: litera P din IBM Plex Sans Condensed Bold, cu marcajul axial al drumului în ea.
// Culoarea numelui urmează `currentColor` (asphalt pe fundal deschis, chalk pe fundal închis).

function MarkShapes() {
  return (
    <>
      <rect width="64" height="64" rx="6" fill="#F2B705" />
      <path d="M19.97 49V15H34.68Q39.26 15 41.64 17.92Q44.03 20.85 44.03 25.72Q44.03 30.59 41.64 33.51Q39.26 36.43 34.68 36.43H26.93V49ZM26.93 30.34H33.8Q35.21 30.34 36.02 29.61Q36.82 28.88 36.82 27.18V24.26Q36.82 22.55 36.02 21.82Q35.21 21.09 33.8 21.09H26.93Z" fill="#18202B" />
      <rect x="22.41" y="24.6" width="2.09" height="4.2" rx="0.6" fill="#F2B705" />
      <rect x="22.41" y="32" width="2.09" height="4.2" rx="0.6" fill="#F2B705" />
      <rect x="22.41" y="39.4" width="2.09" height="4.2" rx="0.6" fill="#F2B705" />
    </>
  );
}

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="PermiStart">
      <MarkShapes />
    </svg>
  );
}

export function Logo({ className = "h-10", tagline = true }: { className?: string; tagline?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} role="img" aria-label="PermiStart, examen auto online">
      <LogoMark className="h-full w-auto shrink-0" />
      <span className="flex flex-col justify-center leading-none">
        <span className="font-cond text-2xl font-bold tracking-tight text-current">PermiStart</span>
        {tagline ? <span className="mt-0.5 text-xs font-medium text-current/70">examen auto online</span> : null}
      </span>
    </span>
  );
}
