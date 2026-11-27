"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export type Locale = "ro" | "fr" | "en" | "es";

export const SUPPORTED_LANGUAGES: ReadonlyArray<{
  code: Locale;
  short: string;
  label: string;
}> = [
  { code: "ro", short: "RO", label: "Română" },
  { code: "fr", short: "FR", label: "Français" },
  { code: "en", short: "EN", label: "English" },
  { code: "es", short: "ES", label: "Español" },
];

const STORAGE_KEY = "permistart_lang";
const CHANGE_EVENT = "permistart:lang-change";

function isLocale(value: string | null | undefined): value is Locale {
  return value === "ro" || value === "fr" || value === "en" || value === "es";
}

function LanguageFlag({ code }: { code: Locale }) {
  if (code === "ro") {
    return (
      <svg viewBox="0 0 24 16" className="h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-black/15" aria-hidden="true">
        <rect width="8" height="16" x="0" fill="#002B7F" />
        <rect width="8" height="16" x="8" fill="#FCD116" />
        <rect width="8" height="16" x="16" fill="#CE1126" />
      </svg>
    );
  }
  if (code === "fr") {
    return (
      <svg viewBox="0 0 24 16" className="h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-black/15" aria-hidden="true">
        <rect width="8" height="16" x="0" fill="#0055A4" />
        <rect width="8" height="16" x="8" fill="#FFFFFF" />
        <rect width="8" height="16" x="16" fill="#EF4135" />
      </svg>
    );
  }
  if (code === "es") {
    return (
      <svg viewBox="0 0 24 16" className="h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-black/15" aria-hidden="true">
        <rect width="24" height="4" y="0" fill="#AA151B" />
        <rect width="24" height="8" y="4" fill="#F1BF00" />
        <rect width="24" height="4" y="12" fill="#AA151B" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 16" className="h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-black/15" aria-hidden="true">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0L24 16M24 0L0 16" stroke="#FFFFFF" strokeWidth="3.2" />
      <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M12 0V16M0 8H24" stroke="#FFFFFF" strokeWidth="4.8" />
      <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="2.8" />
    </svg>
  );
}

export function LanguageSwitcher({
  onDarkOverlay = false,
}: {
  onDarkOverlay?: boolean;
}) {
  const [lang, setLang] = useState<Locale>("ro");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(saved)) {
        setLang(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // Ignore storage failures in restricted contexts
    }

    function onSync(event: Event) {
      const next = (event as CustomEvent<Locale>).detail;
      if (isLocale(next)) setLang(next);
    }

    window.addEventListener(CHANGE_EVENT, onSync);
    return () => window.removeEventListener(CHANGE_EVENT, onSync);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDocDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function selectLanguage(next: Locale) {
    setLang(next);
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = next;
    } catch {
      // Ignore storage failures
    }
    window.dispatchEvent(new CustomEvent<Locale>(CHANGE_EVENT, { detail: next }));
  }

  const current = SUPPORTED_LANGUAGES.find((item) => item.code === lang) ?? SUPPORTED_LANGUAGES[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Limbă selectată: ${current.label}`}
        className={cn(
          "inline-flex min-h-[40px] items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-semibold transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-1",
          onDarkOverlay
            ? "border-white/25 bg-asphalt/55 text-white hover:border-white/50 hover:bg-asphalt/80"
            : "border-line bg-surface text-asphalt hover:border-asphalt/40 hover:bg-chalk",
        )}
      >
        <LanguageFlag code={current.code} />
        <span className="font-mono">{current.short}</span>
        <ChevronDownIcon
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180 text-signal")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Selectează limba"
          className="absolute right-0 top-full z-50 mt-2 w-44 rounded-lg border-2 border-asphalt bg-surface p-1.5 text-asphalt shadow-[0_14px_30px_rgba(24,32,43,0.18)]"
        >
          {SUPPORTED_LANGUAGES.map((item) => {
            const active = item.code === lang;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => selectLanguage(item.code)}
                className={cn(
                  "flex min-h-[40px] w-full items-center justify-between gap-2 rounded px-2.5 py-2 text-left text-sm transition-colors",
                  active ? "bg-chalk font-semibold text-asphalt" : "font-medium text-asphalt hover:bg-chalk/70",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <LanguageFlag code={item.code} />
                  <span>{item.label}</span>
                </span>
                {active ? <Check className="h-4 w-4 shrink-0 text-sign" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
