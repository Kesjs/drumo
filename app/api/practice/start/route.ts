import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, startPracticeAttempt } from "@/lib/data/store";

const Schema = z.object({
  kind: z.enum(["chapter", "adaptive", "global"]),
  chapterSlug: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Autentificare necesară." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Tip de evaluare invalid." }, { status: 400 });

  const res = await startPracticeAttempt({ userId: user.id, ...parsed.data });
  if (!res.ok) return NextResponse.json(res, { status: 403 });
  return NextResponse.json(res);
}
