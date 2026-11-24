// Mărturii reale ale candidaților. Adaugă aici DOAR opinii reale, cu acordul scris al persoanei.
// Cât timp lista este goală, secțiunea „Ce spun candidații” nu apare pe prima pagină.
export interface Testimonial {
  name: string;
  role?: string; // ex. „Candidat categoria B”
  quote: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  photo?: string; // ex. "/media/testimonials/ana.webp" (doar cu acord)
}

export const TESTIMONIALS: Testimonial[] = [];
