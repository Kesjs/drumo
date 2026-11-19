import { NextResponse } from "next/server";
import { z } from "zod";
import {
  adminAddQuestion,
  adminDecideRefund,
  adminReviewKyc,
  adminUpdateCategory,
  adminUpdateCertificate,
  adminUpdateConfig,
  getCurrentUser,
} from "@/lib/data/store";

const ActionSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("kyc"),
    id: z.string(),
    decision: z.enum(["approved", "rejected", "manual_review"]),
    note: z.string().optional(),
  }),
  z.object({
    kind: z.literal("certificate"),
    id: z.string(),
    action: z.enum(["hold", "release", "revoked", "send_now"]),
    reason: z.string().optional(),
  }),
  z.object({
    kind: z.literal("category"),
    id: z.string(),
    fee_ron: z.number().int().positive(),
    fee_eur: z.number().int().positive(),
    min_first_installment_ron: z.number().int().positive(),
    min_first_installment_eur: z.number().int().positive(),
    max_installments: z.number().int().min(1).max(6),
    readiness_threshold: z.number().int().min(50).max(100),
    active: z.boolean(),
  }),
  z.object({
    kind: z.literal("refund"),
    id: z.string(),
    status: z.enum(["approved", "rejected"]),
  }),
  z.object({
    kind: z.literal("config"),
    certificate_label: z.string().min(3),
    accredited: z.boolean(),
    certificate_send_delay_hours: z.number().int().min(1).max(72),
  }),
  z.object({
    kind: z.literal("question"),
    chapter_id: z.string(),
    chapter_slug: z.string(),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    stem_ro: z.string().min(8),
    explanation_ro: z.string().min(8),
    legal_ref: z.string().min(2),
    exam_pool: z.boolean(),
    multi: z.boolean(),
    category_codes: z.array(z.string()).min(1),
    options: z.array(
      z.object({
        label: z.enum(["A", "B", "C", "D"]),
        body_ro: z.string().min(1),
        is_correct: z.boolean(),
      }),
    ).min(2),
  }),
]);

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "reviewer")) {
    return NextResponse.json({ ok: false, error: "Acces rezervat personalului autorizat." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Parametri invalizi." }, { status: 400 });
  }

  const p = parsed.data;
  if (p.kind === "kyc") {
    const updated = await adminReviewKyc(user.id, p.id, p.decision, p.note);
    return NextResponse.json({ ok: Boolean(updated), kyc: updated });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Doar administratorul poate modifica aceste date." }, { status: 403 });
  }

  if (p.kind === "certificate") {
    const cert = await adminUpdateCertificate(user.id, p.id, p.action, p.reason);
    return NextResponse.json({ ok: Boolean(cert), cert });
  }
  if (p.kind === "category") {
    const { kind: _k, id, ...patch } = p;
    const cat = await adminUpdateCategory(user.id, id, patch);
    return NextResponse.json({ ok: Boolean(cat), category: cat });
  }
  if (p.kind === "refund") {
    const ref = await adminDecideRefund(user.id, p.id, p.status);
    return NextResponse.json({ ok: Boolean(ref), refund: ref });
  }
  if (p.kind === "config") {
    const { kind: _k, ...patch } = p;
    const cfg = await adminUpdateConfig(user.id, patch);
    return NextResponse.json({ ok: true, config: cfg });
  }
  if (p.kind === "question") {
    const { kind: _k, ...q } = p;
    const created = await adminAddQuestion(user.id, q);
    return NextResponse.json({ ok: true, question: created });
  }
  return NextResponse.json({ ok: false }, { status: 400 });
}
