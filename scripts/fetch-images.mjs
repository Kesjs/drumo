// Downloads selected Wikimedia Commons images, converts them to WebP + AVIF,
// and writes credits.json. Run: node scripts/fetch-images.mjs  (needs network)
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const UA = "DrumoBot/0.1 (contact@drumo.ro)";
const OUT = "public/media";

// slug -> [Commons file title, Romanian alt text, crop hint]
const IMAGES = {
  "stop-axente-sever": ["ROM Axente Sever, Principala 0020.jpg", "Indicatorul „Oprire” la o intersecție pe strada principală din Axente Sever"],
  "stop-panoramio": ["Stop - panoramio.jpg", "Indicator „Oprire” la marginea unui drum din România"],
  "cedeaza-popa-tatu": ["Popa Tatu Street.jpg", "Indicatoarele „Cedează trecerea” și „Interzis virajul la stânga” la o intersecție din București, lângă o trecere de pietoni"],
  "cedeaza-helesteului": ["Bucharest - Strada Heleșteului sign.jpg", "Indicator „Cedează trecerea” pe strada Heleșteului din București"],
  "oprire-interzisa-bistrita": ["Bistrița verkeersbord.jpg", "Indicatoarele „Accesul interzis vehiculelor cu tracțiune animală” și „Oprirea interzisă” pe o stradă din Bistrița"],
  "intrare-brasov-dn1": ["Southern entry into Braşov on DN1 (E60) (5948254805).jpg", "Indicatoare la ieșirea din Timișul de Sus și intrarea în Brașov pe DN1: limitare 80 km/h în localitate, lucrări 60 km/h și sfârșit de restricții"],
  "copii-fagaras": ["Warning Sign \"Children\" in Făgăraș (AP4L2467 1PSP) (20807278995).jpg", "Indicatorul de avertizare „Copii” în Făgăraș"],
  "lucrari-transfagarasan": ["ROM Cârțișoara Transfăgărășan 22.jpg", "Panou galben de avertizare „Pericol de accidente” pentru lucrări și semafoare la 400 m, pe Transfăgărășan"],
  "cadere-pietre-dn10": ["RO BZ DN10 rockfall.jpg", "Indicator „Drum alunecos” și panouri de semnalizare a lucrărilor pe DN10, județul Buzău"],
  "sens-giratoriu-timisoara": ["ROM Timișoara, Piața Ionel I. C. Brătianu 0001.jpg", "Sens giratoriu cu mai multe benzi în Piața Ionel I. C. Brătianu din Timișoara"],
  "drum-dn7a": ["RO VL DN7A road 33.jpg", "Drumul DN7A de-a lungul unei văi împădurite din județul Vâlcea, cu parapet și indicatorul unui pârâu"],
  "autostrada-sibiu": ["Autostrada Sibiu 02.jpg", "Autostrada lângă Sibiu, văzută din mașină, cu panou de distanțe spre Sebeș, Cluj-Napoca, Arad și Nădlac"],
  "transfagarasan": ["RO SB Transfagarasan 69.jpg", "Serpentinele drumului Transfăgărășan"],
  "bucuresti-ploaie": ["Bucharest after the rain.JPG", "Bulevard din București după ploaie, cu lucrări, limitare de viteză 40 și avertizare de drum alunecos"],
  "marcaje-apold": ["ROM Apold, Strada Principala 0001.jpg", "Marcaje rutiere de trecere pentru pietoni, bandă de autobuz și linie continuă în localitatea Apold"],
};

async function meta(title) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  Object.entries({ action: "query", titles: `File:${title}`, prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "1600", format: "json" })
    .forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u, { headers: { "User-Agent": UA } }).then((x) => x.json());
  const page = Object.values(r.query.pages)[0];
  if (!page.imageinfo) throw new Error(`Missing: ${title}`);
  const ii = page.imageinfo[0];
  const m = ii.extmetadata;
  const strip = (s = "") => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return {
    thumb: ii.thumburl,
    source_url: ii.descriptionurl,
    author: strip(m.Artist?.value),
    license: strip(m.LicenseShortName?.value),
    license_url: m.LicenseUrl?.value ?? null,
    date: strip(m.DateTimeOriginal?.value) || null,
  };
}

await fs.mkdir(OUT, { recursive: true });
const credits = [];
for (const [slug, [title, alt]] of Object.entries(IMAGES)) {
  const m = await meta(title);
  const buf = Buffer.from(await fetch(m.thumb, { headers: { "User-Agent": UA } }).then((r) => r.arrayBuffer()));
  const img = sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true });
  await img.clone().webp({ quality: 78 }).toFile(path.join(OUT, `${slug}.webp`));
  await img.clone().avif({ quality: 55 }).toFile(path.join(OUT, `${slug}.avif`));
  const { width, height } = await sharp(path.join(OUT, `${slug}.webp`)).metadata();
  credits.push({
    file: `/media/${slug}.webp`, slug, alt_ro: alt, width, height,
    source: "Wikimedia Commons", title, source_url: m.source_url,
    author: m.author, license: m.license, license_url: m.license_url,
    original_date: m.date, retrieved_at: new Date().toISOString().slice(0, 10), flagged: false,
  });
  console.log("ok", slug, m.license);
}
await fs.writeFile("credits.json", JSON.stringify(credits, null, 2) + "\n");
