export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const DEFAULT_LOCALE = "ro";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export const LEGAL_ENTITY = {
  brandName: "Drumo",
  companyPlaceholder: "[Denumire societate S.R.L. — de completat înainte de publicare]",
  cuiPlaceholder: "[CUI — de completat]",
  regComPlaceholder: "[Nr. reg. com. — de completat]",
  addressPlaceholder: "[Adresă sediu social, România — de completat]",
  contactEmail: "contact@drumo.ro",
  dpoEmail: "datepersonale@drumo.ro",
  phonePlaceholder: "[Telefon contact — de completat]",
} as const;

export const EU_COUNTRIES = [
  { code: "RO", name: "România" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgia" },
  { code: "BG", name: "Bulgaria" },
  { code: "CY", name: "Cipru" },
  { code: "HR", name: "Croația" },
  { code: "DK", name: "Danemarca" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finlanda" },
  { code: "FR", name: "Franța" },
  { code: "DE", name: "Germania" },
  { code: "GR", name: "Grecia" },
  { code: "IE", name: "Irlanda" },
  { code: "IT", name: "Italia" },
  { code: "LV", name: "Letonia" },
  { code: "LT", name: "Lituania" },
  { code: "LU", name: "Luxemburg" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Țările de Jos" },
  { code: "PL", name: "Polonia" },
  { code: "PT", name: "Portugalia" },
  { code: "CZ", name: "Cehia" },
  { code: "SK", name: "Slovacia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spania" },
  { code: "SE", name: "Suedia" },
  { code: "HU", name: "Ungaria" },
] as const;
