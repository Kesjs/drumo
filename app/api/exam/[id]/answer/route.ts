import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, submitExamQuestionAnswer } from "@/lib/data/store";

const Schema = z.object({
  index: z.number().int().nonnegative(),
  chosen: z.array(z.enum(["A", "B", "C", "D"])),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Autentificare necesară." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Răspuns invalid." }, { status: 400 });

  const res = await submitExamQuestionAnswer({
    userId: user.id,
    sessionId: id,
    index: parsed.data.index,
    chosen: parsed.data.chosen,
  });
  if (!res.ok) return NextResponse.json(res, { status: 409 });
  return NextResponse.json(res);
}
