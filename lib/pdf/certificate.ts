import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";
import { certificateLabel } from "@/lib/domain/certificate";
import { SITE_URL } from "@/lib/config";
import { formatRoDate } from "@/lib/i18n";

export interface CertificatePdfInput {
  publicCode: string;
  holderName: string;
  categoryCode: string;
  score: number;
  total: number;
  issuedAt: string;
  labelConfig: { label: string; accredited: boolean };
}

export async function generateCertificatePdf(input: CertificatePdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const fontDir = path.join(process.cwd(), "lib", "pdf", "fonts");
  const [regBytes, boldBytes, monoBytes] = await Promise.all([
    fs.readFile(path.join(fontDir, "IBMPlexSans-Regular.ttf")),
    fs.readFile(path.join(fontDir, "IBMPlexSans-Bold.ttf")),
    fs.readFile(path.join(fontDir, "IBMPlexMono-Medium.ttf")),
  ]);

  const fontReg = await doc.embedFont(regBytes);
  const fontBold = await doc.embedFont(boldBytes);
  const fontMono = await doc.embedFont(monoBytes);

  // A4 Landscape: 841.89 x 595.28
  const page = doc.addPage([841.89, 595.28]);
  const { width, height } = page.getSize();

  const asphalt = rgb(0.094, 0.125, 0.169);
  const chalk = rgb(0.961, 0.965, 0.953);
  const signal = rgb(0.949, 0.718, 0.02);
  const signBlue = rgb(0.043, 0.306, 0.635);
  const mute = rgb(0.29, 0.329, 0.38);
  const line = rgb(0.851, 0.863, 0.839);

  // Background chalk + frame
  page.drawRectangle({ x: 0, y: 0, width, height, color: chalk });
  page.drawRectangle({ x: 28, y: 28, width: width - 56, height: height - 56, color: rgb(1, 1, 1), borderColor: asphalt, borderWidth: 2 });
  page.drawRectangle({ x: 28, y: height - 92, width: width - 56, height: 64, color: asphalt });
  page.drawRectangle({ x: 28, y: height - 98, width: width - 56, height: 6, color: signal });

  // Brand mark
  page.drawText("DRUMO", { x: 56, y: height - 67, size: 18, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText(`NR. ${input.publicCode}`, { x: width - 230, y: height - 66, size: 13, font: fontMono, color: signal });

  const safeTitle = certificateLabel(input.labelConfig);
  const displayTitle = safeTitle.charAt(0).toUpperCase() + safeTitle.slice(1);

  page.drawText(displayTitle, { x: 56, y: height - 154, size: 28, font: fontBold, color: asphalt });
  page.drawText("Confirmare oficială de parcurgere a pregătirii și a testului teoretic pe platforma Drumo", {
    x: 56,
    y: height - 182,
    size: 11.5,
    font: fontReg,
    color: mute,
  });

  // Holder dossier block
  page.drawLine({ start: { x: 56, y: height - 208 }, end: { x: width - 56, y: height - 208 }, thickness: 1, color: line });

  const fields: Array<[string, string]> = [
    ["CANDIDAT", input.holderName],
    ["CATEGORIE", input.categoryCode],
    ["SCOR OBȚINUT", `${input.score} / ${input.total} răspunsuri corecte`],
    ["DATA EMITERII", formatRoDate(input.issuedAt)],
    ["COD VERIFICARE", input.publicCode],
  ];

  let y = height - 246;
  for (const [k, v] of fields) {
    page.drawText(k, { x: 56, y, size: 9.5, font: fontBold, color: mute });
    page.drawText(v, { x: 210, y: y - 1, size: 13.5, font: k === "COD VERIFICARE" ? fontMono : fontBold, color: asphalt });
    y -= 36;
  }

  // QR Code pointing to public verification page
  const verifyUrl = `${SITE_URL}/verificare/${encodeURIComponent(input.publicCode)}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 240,
    margin: 1,
    color: { dark: "#18202b", light: "#ffffff" },
  });
  const qrBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await doc.embedPng(qrBytes);
  const qrSize = 132;
  const qrX = width - 56 - qrSize;
  const qrY = 148;
  page.drawRectangle({ x: qrX - 8, y: qrY - 8, width: qrSize + 16, height: qrSize + 16, borderColor: line, borderWidth: 1, color: rgb(1, 1, 1) });
  page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });
  page.drawText("Verificare publică QR", { x: qrX + 8, y: qrY - 24, size: 9.5, font: fontBold, color: signBlue });

  // Mandatory legal disclaimer while unaccredited
  if (!input.labelConfig.accredited) {
    page.drawRectangle({ x: 56, y: 52, width: width - 112, height: 62, color: chalk, borderColor: signal, borderWidth: 1.5 });
    page.drawText("MENȚIUNE LEGALĂ OBLIGATORIE", { x: 70, y: 95, size: 8.5, font: fontBold, color: asphalt });
    page.drawText(
      "Acest atestat de reușită Drumo confirmă rezultatul obținut pe platformă. Nu este permis de conducere și nu înlocuiește examenul oficial organizat de autoritățile competente.",
      { x: 70, y: 78, size: 9.5, font: fontReg, color: asphalt, maxWidth: width - 140, lineHeight: 13 },
    );
  }

  return await doc.save();
}
