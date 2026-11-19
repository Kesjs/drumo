import { NextResponse } from "next/server";
import { LOCAL_SESSION_COOKIE } from "@/lib/auth-session";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

export async function POST() {
  if (isSupabaseConfigured()) {
    const sb = await createSupabaseServer();
    await sb?.auth.signOut();
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(LOCAL_SESSION_COOKIE);
  return res;
}
