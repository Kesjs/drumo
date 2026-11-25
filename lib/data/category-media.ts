export type CategoryGroupKey = "moto" | "auto" | "pro";

export interface CategoryMediaMeta {
  src: string;
  alt_ro: string;
  group: CategoryGroupKey;
  groupLabel_ro: string;
}

export const CATEGORY_GROUPS: Array<{ key: CategoryGroupKey; label_ro: string; description_ro: string }> = [
  {
    key: "moto",
    label_ro: "Mopede și motociclete",
    description_ro: "De la mopede de 50 cm³ (de la 16 ani) până la motociclete fără limită de putere.",
  },
  {
    key: "auto",
    label_ro: "Autoturisme și remorci",
    description_ro: "Cvadricicluri ușoare, autoturisme până la 3.500 kg și ansambluri cu remorcă grea.",
  },
  {
    key: "pro",
    label_ro: "Transport marfă și persoane",
    description_ro: "Camioane, ansambluri grele TIR cu semiremorcă și autobuze pentru transport persoane.",
  },
];

export const CATEGORY_MEDIA: Record<string, CategoryMediaMeta> = {
  AM: {
    src: "/media/cat-am.jpg",
    alt_ro: "Scuter Vespa Primavera alb parcat într-o piață urbană — categoria AM",
    group: "moto",
    groupLabel_ro: "Mopede și motociclete",
  },
  A1: {
    src: "/media/cat-a1.jpg",
    alt_ro: "Motocicletă ușoară Yamaha YZF-R125 (125 cm³) — categoria A1",
    group: "moto",
    groupLabel_ro: "Mopede și motociclete",
  },
  A2: {
    src: "/media/cat-a2.jpg",
    alt_ro: "Motocicletă medie Honda CB500F (≤ 35 kW) — categoria A2",
    group: "moto",
    groupLabel_ro: "Mopede și motociclete",
  },
  A: {
    src: "/media/cat-a.jpg",
    alt_ro: "Motocicletă de mare capacitate BMW R1250 GS Trophy — categoria A",
    group: "moto",
    groupLabel_ro: "Mopede și motociclete",
  },
  B1: {
    src: "/media/cat-b1.jpg",
    alt_ro: "Cvadriciclu ușor Citroën Ami în trafic urban — categoria B1",
    group: "auto",
    groupLabel_ro: "Autoturisme și remorci",
  },
  B: {
    src: "/media/cat-b.jpg",
    alt_ro: "Autoturism Dacia Sandero III parcat — categoria B",
    group: "auto",
    groupLabel_ro: "Autoturisme și remorci",
  },
  BE: {
    src: "/media/cat-be.jpg",
    alt_ro: "Autovehicul cu remorcă rulând pe autostradă — categoria BE",
    group: "auto",
    groupLabel_ro: "Autoturisme și remorci",
  },
  C: {
    src: "/media/cat-c.jpg",
    alt_ro: "Camion rigid Mercedes-Benz Atego pentru marfă — categoria C",
    group: "pro",
    groupLabel_ro: "Transport marfă și persoane",
  },
  CE: {
    src: "/media/cat-ce.jpg",
    alt_ro: "Ansamblu greu Scania G410 cu semiremorcă — categoria CE",
    group: "pro",
    groupLabel_ro: "Transport marfă și persoane",
  },
  D: {
    src: "/media/cat-d.jpg",
    alt_ro: "Autobuz urban Mercedes-Benz Citaro pe linia 336 în București — categoria D",
    group: "pro",
    groupLabel_ro: "Transport marfă și persoane",
  },
};

export function getCategoryMedia(code: string): CategoryMediaMeta {
  return (
    CATEGORY_MEDIA[code] ?? {
      src: "/media/cat-b.jpg",
      alt_ro: `Vehicul reprezentativ pentru categoria ${code}`,
      group: "auto",
      groupLabel_ro: "Autoturisme și remorci",
    }
  );
}
