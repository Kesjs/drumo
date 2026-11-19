import { NextResponse } from "next/server";
import { verifyCertificatePublic } from "@/lib/data/store";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await verifyCertificatePublic(code);
  if (!data) {
    return NextResponse.json({ ok: false, error: "Nu am găsit niciun atestat cu acest cod." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, certificate: data });
}
