import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, markChapterProgress } from "@/lib/data/store";

const Schema = z.object({ kind: z.enum(["summary", "lesson"]) });

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Autentificare necesară." }, { status: 401 });

  const { slug } = await params;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Cerere invalidă." }, { status: 400 });

  const res = await markChapterProgress(user.id, slug, parsed.data.kind);
  if (!res.ok) return NextResponse.json(res, { status: 403 });
  return NextResponse.json(res);
}
