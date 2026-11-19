import { NextResponse } from "next/server";
import { getCurrentUser, getExamRoomView } from "@/lib/data/store";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Autentificare necesară." }, { status: 401 });

  const { id } = await params;
  const view = await getExamRoomView(user.id, id);
  if (!view) return NextResponse.json({ ok: false, error: "Sesiune inexistentă." }, { status: 404 });

  return NextResponse.json({ ok: true, ...view });
}
