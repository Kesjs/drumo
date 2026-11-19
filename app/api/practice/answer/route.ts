import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, submitPracticeAnswer } from "@/lib/data/store";

const Schema = z.object({
  attemptId: z.string().min(1),
  questionId: z.string().min(1),
  chosen: z.array(z.enum(["A", "B", "C", "D"])).min(1),
  msTaken: z.number().int().nonnegative().default(0),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Autentificare necesară." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Selectează cel puțin o variantă." }, { status: 400 });

  const res = await submitPracticeAnswer({ userId: user.id, ...parsed.data });
  if (!res.ok) return NextResponse.json(res, { status: 400 });
  return NextResponse.json(res);
}
