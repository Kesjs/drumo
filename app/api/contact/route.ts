import { NextResponse } from "next/server";
import { z } from "zod";
import { saveContactMessage } from "@/lib/data/store";

const Schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  topic: z.string().min(2).max(120),
  message: z.string().min(10).max(2000),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Completează toate câmpurile (mesaj minim 10 caractere)." }, { status: 400 });
  }
  const saved = await saveContactMessage(parsed.data);
  return NextResponse.json({ ok: true, id: saved.id });
}
