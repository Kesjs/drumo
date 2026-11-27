export interface Testimonial {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  location: string;
  category: string;
  score: string;
  quote: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "andrei-b",
    name: "Andrei M.",
    initials: "AM",
    avatar: "/media/testimonial-andrei.jpg",
    location: "Cluj-Napoca",
    category: "Categoria B",
    score: "25 / 26",
    rating: 5,
    quote:
      "Fotografiile făcute pe drumuri reale din România ajută mult mai mult decât schemele clasice. Evaluarea adaptivă m-a pus să repet exact regulile de prioritate unde mai greșeam.",
  },
  {
    id: "elena-b",
    name: "Elena D.",
    initials: "ED",
    avatar: "/media/testimonial-elena.jpg",
    location: "Milano (Diaspora)",
    category: "Categoria B",
    score: "24 / 26",
    rating: 4.5,
    quote:
      "Faptul că am putut plăti în tranșe și că am avut toate capitolele deschise din prima seară mi-a permis să învăț după program, în română, și să dau examenul de acasă.",
  },
  {
    id: "radu-c",
    name: "Radu P.",
    initials: "RP",
    avatar: "/media/testimonial-radu.jpg",
    location: "Timișoara",
    category: "Categoria C",
    score: "24 / 26",
    rating: 4,
    quote:
      "Totul e clar înainte să plătești: vezi taxa categoriei, capitolele dedicate pentru camioane și primești rapid pe e-mail atestatul cu cod QR verificabil.",
  },
  {
    id: "ioana-a2",
    name: "Ioana S.",
    initials: "IS",
    avatar: "/media/testimonial-ioana.jpg",
    location: "București",
    category: "Categoria A2",
    score: "19 / 20",
    rating: 5,
    quote:
      "Citirea audio m-a ajutat să parcurg lecțiile în drum spre birou, iar examenul cu cronometru de 60 de secunde te obișnuiește exact cu ritmul real al sălii.",
  },
  {
    id: "mihai-ce",
    name: "Mihai V.",
    initials: "MV",
    avatar: "/media/testimonial-mihai.jpg",
    location: "Brașov",
    category: "Categoria CE",
    score: "25 / 26",
    rating: 4.5,
    quote:
      "Explicațiile legale de după fiecare întrebare fac diferența: înțelegi de ce o variantă e corectă, nu doar o memorezi pentru chestionar.",
  },
  {
    id: "cristina-b",
    name: "Cristina L.",
    initials: "CL",
    avatar: "/media/testimonial-cristina.jpg",
    location: "Londra (Diaspora)",
    category: "Categoria B",
    score: "23 / 26",
    rating: 4,
    quote:
      "Verificarea KYC a fost simplă, iar faptul că documentele se șterg automat după 30 de zile mi-a dat încredere de la început.",
  },
  {
    id: "vlad-d",
    name: "Vlad T.",
    initials: "VT",
    avatar: "/media/testimonial-vlad.png",
    location: "Iași",
    category: "Categoria D",
    score: "24 / 26",
    rating: 5,
    quote:
      "Am prezentat atestatul cu cod QR la evaluarea internă a angajatorului; verificarea online a durat câteva secunde, fără cont.",
  },
];
