import { NextResponse } from "next/server";
import { processDueCertificates } from "@/lib/data/store";
import { generateCertificatePdf } from "@/lib/pdf/certificate";
import { sendCertificateEmail } from "@/lib/email";
import { certificateLabel } from "@/lib/domain/certificate";

function authorizedCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorizedCron(req)) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

  const processed = await processDueCertificates(async (cert, labelConfig, email) => {
    const pdfBytes = await generateCertificatePdf({
      publicCode: cert.public_code,
      holderName: cert.holder_name,
      categoryCode: cert.category_code,
      score: cert.score,
      total: cert.total,
      issuedAt: cert.issued_at,
      labelConfig,
    });
    if (email) {
      await sendCertificateEmail({
        to: email,
        holderName: cert.holder_name,
        categoryCode: cert.category_code,
        publicCode: cert.public_code,
        label: certificateLabel(labelConfig),
        pdfBytes,
      });
    }
  });

  return NextResponse.json({ ok: true, processedCount: processed.length, processed });
}
