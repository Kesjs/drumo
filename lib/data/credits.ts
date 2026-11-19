import creditsData from "@/credits.json";

export interface ImageCredit {
  file: string;
  slug: string;
  alt_ro: string;
  width: number;
  height: number;
  source: string;
  title: string;
  source_url: string;
  author: string;
  license: string;
  license_url: string | null;
  original_date: string | null;
  retrieved_at: string;
  flagged: boolean;
}

export const IMAGE_CREDITS: ImageCredit[] = creditsData as ImageCredit[];

export function getImageBySlug(slug?: string): ImageCredit | undefined {
  if (!slug) return undefined;
  return IMAGE_CREDITS.find((c) => c.slug === slug);
}
