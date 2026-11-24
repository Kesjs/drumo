// Shared class strings and constants (plain module, safe for server and client components).
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const CTA_HREF = "/inscriere";

export const btn =
  "inline-flex min-h-[48px] items-center justify-center rounded px-6 py-3 font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0";
export const btnPrimary = `${btn} bg-signal text-asphalt shadow-card hover:bg-signal-deep`;
export const btnGhostDark = `${btn} border border-chalk/50 text-chalk hover:bg-chalk/10`;
export const btnGhostLight = `${btn} border border-asphalt text-asphalt hover:bg-asphalt hover:text-chalk`;
export const card = "rounded border border-line bg-white shadow-card";
