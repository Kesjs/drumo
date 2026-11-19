import { NextResponse } from "next/server";
import { z } from "zod";
import { registerCandidate } from "@/lib/data/store";
import { LOCAL_SESSION_COOKIE, signSessionToken } from "@/lib/auth-session";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

const Schema = z.object({
  firstName: z.string().min(2).max(80),
  lastName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7).max(25).optional().or(z.literal("")),
  password: z.string().min(8).max(120),
  country: z.string().length(2),
  categoryCode: z.string().min(1).max(6),
  currency: z.enum(["RON", "EUR"]),
  consentTerms: z.literal(true),
  consentPrivacy: z.literal(true),
  consentBiometric: z.literal(true),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Verifică datele introduse și consimțămintele obligatorii." },
      { status: 400 },
    );
  }

  const res = await registerCandidate({
    ...parsed.data,
    email: parsed.data.email || undefined,
    phone: parsed.data.phone || undefined,
  });
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: res.error }, { status: 400 });
  }

  if (isSupabaseConfigured() && parsed.data.email) {
    const sb = await createSupabaseServer();
    await sb?.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
    return NextResponse.json({ ok: true, user: res.user });
  }

  const response = NextResponse.json({ ok: true, user: res.user });
  response.cookies.set(LOCAL_SESSION_COOKIE, signSessionToken(res.user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
