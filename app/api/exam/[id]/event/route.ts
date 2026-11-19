import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, logExamSecurityEvent } from "@/lib/data/store";

const Schema = z.object({
  type: z.enum([
    "blur",
    "tab_hidden",
    "fullscreen_exit",
    "camera_lost",
    "camera_denied",
    "copy",
    "paste",
    "context_menu",
    "devtools",
    "multiple_faces",
    "no_face",
    "network_lost",
  ]),
  questionIndex: z.number().int().nonnegative().optional(),
  durationMs: z.number().int().nonnegative().optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const res = await logExamSecurityEvent({ userId: user.id, sessionId: id, ...parsed.data });
  return NextResponse.json(res);
}
