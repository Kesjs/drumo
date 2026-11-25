import { Resend } from "resend";
import { isResendConfigured, SITE_URL } from "@/lib/config";
import { formatMoney, type Currency } from "@/lib/domain/money";

export interface EmailLogEntry {
  id: string;
  to: string;
  subject: string;
  kind: "welcome" | "receipt" | "kyc" | "certificate" | "contact";
  sentAt: string;
  deliveredVia: "resend" | "local_outbox";
  previewText: string;
}

const localOutbox: EmailLogEntry[] = [];

export function getLocalEmailOutbox(): EmailLogEntry[] {
  return [...localOutbox];
}

function getResendClient(): Resend | null {
  if (!isResendConfigured()) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = process.env.EMAIL_FROM || "PermiStart <noreply@permistart.ro>";

async function deliverEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  kind: EmailLogEntry["kind"];
  attachments?: Array<{ filename: string; content: Buffer }>;
}) {
  const client = getResendClient();
  if (client) {
    await client.emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      attachments: params.attachments,
    });
  }

  localOutbox.unshift({
    id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    to: params.to,
    subject: params.subject,
    kind: params.kind,
    sentAt: new Date().toISOString(),
    deliveredVia: client ? "resend" : "local_outbox",
    previewText: params.text.slice(0, 180),
  });
  if (localOutbox.length > 50) localOutbox.length = 50;
}

function wrapHtml(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="ro">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:24px;background:#f5f6f3;font-family:'IBM Plex Sans',Arial,sans-serif;color:#18202b;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:2px solid #18202b;border-radius:8px;overflow:hidden;">
    <div style="background:#18202b;color:#ffffff;padding:18px 24px;border-bottom:4px solid #f2b705;">
      <strong style="font-size:18px;letter-spacing:0.02em;">PermiStart</strong>
    </div>
    <div style="padding:24px;line-height:1.6;font-size:15px;">
      ${bodyHtml}
      <hr style="border:none;border-top:1px solid #d9dcd6;margin:24px 0 16px;" />
      <p style="font-size:12px;color:#4a5461;margin:0;">
        PermiStart · Pregătire și testare teoretică online.<br />
        Atestatul de reușită PermiStart nu este permis de conducere și nu înlocuiește examenul oficial organizat de autorități.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendPaymentReceiptEmail(input: {
  to: string;
  holderName: string;
  categoryCode: string;
  amountMinor: number;
  currency: Currency;
  totalPaidMinor: number;
  totalDueMinor: number;
  coursesUnlocked: boolean;
  feeFullyPaid: boolean;
  installmentNo: number;
}) {
  const paidStr = formatMoney(input.amountMinor, input.currency);
  const totalPaidStr = formatMoney(input.totalPaidMinor, input.currency);
  const totalDueStr = formatMoney(input.totalDueMinor, input.currency);
  const subject = `Chitanță plată PermiStart — ${paidStr} (Categoria ${input.categoryCode})`;
  const text = `Bună, ${input.holderName}. Confirmăm plata de ${paidStr} (tranșa ${input.installmentNo}) pentru categoria ${input.categoryCode}. Total achitat: ${totalPaidStr} din ${totalDueStr}. Cursuri: ${input.coursesUnlocked ? "deblocate" : "blocate"}. Examen: ${input.feeFullyPaid ? "taxa achitată integral" : "se deblochează după achitarea integrală și evaluarea globală"}.`;

  const html = wrapHtml(
    subject,
    `<h1 style="margin:0 0 12px;font-size:20px;">Confirmare și chitanță de plată</h1>
     <p>Bună, <strong>${input.holderName}</strong>,</p>
     <p>Îți confirmăm primirea plății pentru categoria <strong>${input.categoryCode}</strong>.</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
       <tr><td style="padding:8px 0;border-bottom:1px solid #d9dcd6;color:#4a5461;">Sumă achitată acum</td><td style="padding:8px 0;border-bottom:1px solid #d9dcd6;text-align:right;font-weight:600;">${paidStr}</td></tr>
       <tr><td style="padding:8px 0;border-bottom:1px solid #d9dcd6;color:#4a5461;">Total achitat până acum</td><td style="padding:8px 0;border-bottom:1px solid #d9dcd6;text-align:right;font-weight:600;">${totalPaidStr} / ${totalDueStr}</td></tr>
       <tr><td style="padding:8px 0;border-bottom:1px solid #d9dcd6;color:#4a5461;">Cursuri și teste pe capitole</td><td style="padding:8px 0;border-bottom:1px solid #d9dcd6;text-align:right;">${input.coursesUnlocked ? "Deblocate" : "Blocate"}</td></tr>
       <tr><td style="padding:8px 0;color:#4a5461;">Taxă examen teoretic</td><td style="padding:8px 0;text-align:right;">${input.feeFullyPaid ? "Achitată integral" : "Rămâne diferență de plată"}</td></tr>
     </table>
     <p><a href="${SITE_URL}/tablou-de-bord" style="display:inline-block;background:#f2b705;color:#18202b;border:2px solid #18202b;padding:10px 18px;border-radius:4px;text-decoration:none;font-weight:600;">Mergi la tabloul de bord</a></p>`,
  );

  await deliverEmail({ to: input.to, subject, html, text, kind: "receipt" });
}

export async function sendCertificateEmail(input: {
  to: string;
  holderName: string;
  categoryCode: string;
  publicCode: string;
  label: string;
  pdfBytes: Uint8Array;
}) {
  const verifyUrl = `${SITE_URL}/verificare/${encodeURIComponent(input.publicCode)}`;
  const subject = `Documentul tău: ${input.label} (${input.publicCode})`;
  const text = `Bună, ${input.holderName}. Atașat găsești ${input.label} pentru categoria ${input.categoryCode} (cod ${input.publicCode}). Verificare publică: ${verifyUrl}. Notă: acest atestat nu este permis de conducere și nu înlocuiește examenul oficial.`;

  const html = wrapHtml(
    subject,
    `<h1 style="margin:0 0 12px;font-size:20px;">${input.label}</h1>
     <p>Bună, <strong>${input.holderName}</strong>,</p>
     <p>Găsești atașat în format PDF documentul <strong>${input.label}</strong> pentru categoria <strong>${input.categoryCode}</strong>.</p>
     <p>Cod unic de verificare: <strong style="font-family:monospace;">${input.publicCode}</strong></p>
     <p><a href="${verifyUrl}" style="display:inline-block;background:#f2b705;color:#18202b;border:2px solid #18202b;padding:10px 18px;border-radius:4px;text-decoration:none;font-weight:600;">Verifică autenticitatea online</a></p>
     <p style="margin-top:16px;padding:12px;background:#f5f6f3;border:1px solid #d9dcd6;font-size:13px;">
       Atestatul de reușită PermiStart confirmă rezultatul obținut pe platformă. Nu este permis de conducere și nu înlocuiește examenul oficial organizat de autorități.
     </p>`,
  );

  await deliverEmail({
    to: input.to,
    subject,
    html,
    text,
    kind: "certificate",
    attachments: [
      {
        filename: `${input.publicCode}.pdf`,
        content: Buffer.from(input.pdfBytes),
      },
    ],
  });
}
