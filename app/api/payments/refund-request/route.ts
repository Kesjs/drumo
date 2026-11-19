import { NextResponse } from "next/server";
import { z } from "zod";
import { createRefundRequest, getCurrentUser } from "@/lib/data/store";

const Schema = z.object({
  reason: z.string().min(10).max(1000),
  paymentId: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Autentificare necesară." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Descrie motivul cererii (minimum 10 caractere)." }, { status: 400 });
  }

  const reqRecord = await createRefundRequest(user.id, parsed.data.reason, parsed.data.paymentId);
  return NextResponse.json({ ok: true, refundRequest: reqRecord });
}
