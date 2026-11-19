import { NextResponse } from "next/server";
import { getCertificateForPdf, getCurrentUser } from "@/lib/data/store";
import { generateCertificatePdf } from "@/lib/pdf/certificate";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Autentificare necesară." }, { status: 401 });

  const { code } = await params;
  const found = await getCertificateForPdf(code);
  if (!found) return NextResponse.json({ error: "Atestat inexistent." }, { status: 404 });

  if (found.cert.user_id !== user.id && user.role !== "admin" && user.role !== "reviewer") {
    return NextResponse.json({ error: "Acces interzis." }, { status: 403 });
  }
  if (found.cert.status === "held" && user.role === "candidate") {
    return NextResponse.json(
      { error: "Atestatul este reținut temporar pentru verificare de securitate." },
      { status: 403 },
    );
  }
  if (found.cert.status === "revoked") {
    return NextResponse.json({ error: "Atestatul a fost revocat." }, { status: 403 });
  }

  const pdfBytes = await generateCertificatePdf({
    publicCode: found.cert.public_code,
    holderName: found.cert.holder_name,
    categoryCode: found.cert.category_code,
    score: found.cert.score,
    total: found.cert.total,
    issuedAt: found.cert.issued_at,
    labelConfig: {
      label: found.config.certificate_label,
      accredited: found.config.accredited,
    },
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${found.cert.public_code}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
