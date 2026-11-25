export interface Testimonial {
  name: string;
  location: string;
  category: string;
  score: string;
  quote: string;
  rating: 5;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Andrei M.",
    location: "Cluj-Napoca",
    category: "Categoria B",
    score: "25 / 26",
    rating: 5,
    quote:
      "Fotografiile făcute pe drumuri reale din România ajută mult mai mult decât schemele clasice. Evaluarea adaptivă m-a pus să repet exact regulile de prioritate unde mai greșeam.",
  },
  {
    name: "Elena D.",
    location: "Milano (Diaspora)",
    category: "Categoria B",
    score: "24 / 26",
    rating: 5,
    quote:
      "Faptul că am putut plăti în tranșe și că am avut toate capitolele deschise din prima seară mi-a permis să învăț după program, în română, și să dau examenul de acasă.",
  },
  {
    name: "Radu P.",
    location: "Timișoara",
    category: "Categoria C",
    score: "24 / 26",
    rating: 5,
    quote:
      "Totul e clar înainte să plătești: vezi taxa categoriei, capitolele dedicate pentru camioane și primești rapid pe e-mail atestatul cu cod QR verificabil.",
  },
];
