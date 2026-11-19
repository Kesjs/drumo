import ro from "@/messages/ro.json";

export type Locale = "ro";

const DICTIONARIES: Record<Locale, typeof ro> = { ro };

export function getMessages(locale: Locale = "ro") {
  return DICTIONARIES[locale] ?? ro;
}

export function formatRoDate(isoOrMs: string | number | Date): string {
  const d = isoOrMs instanceof Date ? isoOrMs : new Date(isoOrMs);
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatRoDateTime(isoOrMs: string | number | Date): string {
  const d = isoOrMs instanceof Date ? isoOrMs : new Date(isoOrMs);
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
