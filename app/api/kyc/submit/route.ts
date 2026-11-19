import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, submitKyc } from "@/lib/data/store";

const Schema = z.object({
  documentType: z.enum(["ci", "passport", "eu_id"]),
  idFileName: z.string().min(1).max(160),
  selfieFileName: z.string().min(1).max(160),
  flagManualReview: z.boolean().optional(),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Autentificare necesară." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Încarcă actul de identitate și selfie-ul." }, { status: 400 });
  }

  const record = await submitKyc({
    userId: user.id,
    ...parsed.data,
  });
  return NextResponse.json({ ok: true, kyc: record });
}
