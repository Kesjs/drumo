import { NextResponse } from "next/server";
import { getCandidateSnapshot, getCurrentUser } from "@/lib/data/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const snapshot = await getCandidateSnapshot(user.id);
  return NextResponse.json({ ok: true, snapshot });
}
