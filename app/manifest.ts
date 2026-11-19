import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Drumo — Pregătire și test teoretic auto",
    short_name: "Drumo",
    description:
      "Platformă de pregătire și testare teoretică auto pentru România. Fără abonament, taxă unică pe categorie.",
    start_url: "/tablou-de-bord",
    display: "standalone",
    background_color: "#f5f6f3",
    theme_color: "#18202b",
    lang: "ro-RO",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
