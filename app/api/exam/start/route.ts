import { NextResponse } from "next/server";
import { z } from "zod";
import { beginExamSession, createOrResumeExamBriefing, getCurrentUser } from "@/lib/data/store";

const Schema = z.object({
  cameraGranted: z.boolean(),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Autentificare necesară." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Cerere invalidă." }, { status: 400 });

  const briefing = await createOrResumeExamBriefing(user.id);
  if (!briefing.ok) return NextResponse.json(briefing, { status: 403 });

  const started = await beginExamSession(user.id, briefing.session.id, parsed.data.cameraGranted);
  if (!started.ok) return NextResponse.json(started, { status: 403 });

  return NextResponse.json({ ok: true, sessionId: started.session.id });
}
