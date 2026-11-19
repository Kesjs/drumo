import fs from "node:fs/promises";
import sharp from "sharp";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#18202b"/>
  <rect x="44" y="44" width="424" height="424" rx="64" fill="none" stroke="#f5f6f3" stroke-width="18"/>
  <rect x="96" y="160" width="320" height="192" rx="16" fill="#f2b705"/>
  <path d="M144 304V208h54c34 0 56 18 56 48s-22 48-56 48h-54zm32-26h20c16 0 26-8 26-22s-10-22-26-22h-20v44zm96 26V208h58c24 0 38 12 38 30 0 14-8 24-22 28l24 38h-34l-20-34h-12v34h-32zm32-56h22c9 0 14-4 14-10s-5-10-14-10h-22v20z" fill="#18202b"/>
</svg>`;

await fs.mkdir("public/icons", { recursive: true });
await fs.writeFile("public/icon.svg", svg);
await sharp(Buffer.from(svg)).resize(192, 192).png().toFile("public/icons/icon-192.png");
await sharp(Buffer.from(svg)).resize(512, 512).png().toFile("public/icons/icon-512.png");
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile("public/icons/apple-touch-icon.png");
console.log("Drumo PWA icons generated");
