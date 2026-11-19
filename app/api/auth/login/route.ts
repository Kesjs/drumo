import { NextResponse } from "next/server";
import { z } from "zod";
import { loginCandidate } from "@/lib/data/store";
import { LOCAL_SESSION_COOKIE, signSessionToken } from "@/lib/auth-session";
import { isSupabaseConfigured } from "@/lib/config";

const Schema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(4),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Completează e-mailul/telefonul și parola." }, { status: 400 });
  }

  const res = await loginCandidate(parsed.data.identifier, parsed.data.password);
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: res.error }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, user: res.user });
  if (!isSupabaseConfigured()) {
    response.cookies.set(LOCAL_SESSION_COOKIE, signSessionToken(res.user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 14,
    });
  }
  return response;
}
