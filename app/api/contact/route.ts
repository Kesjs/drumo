import { NextResponse } from "next/server";
import { z } from "zod";
import { saveContactMessage } from "@/lib/data/store";

const Schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  topic: z.string().min(2).max(160),
  message: z.string().min(10).max(2500),
  phone: z.string().max(40).optional(),
  country: z.string().max(60).optional(),
  address: z.string().max(200).optional(),
  profession: z.string().max(120).optional(),
  categoryCode: z.string().max(10).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Completează câmpurile obligatorii (mesaj minim 10 caractere)." },
      { status: 400 },
    );
  }

  const { name, email, topic, message, phone, country, address, profession, categoryCode } = parsed.data;
  const metaLines = [
    categoryCode ? `Categorie: ${categoryCode}` : null,
    phone ? `Telefon: ${phone}` : null,
    country ? `Țară: ${country}` : null,
    address ? `Adresă: ${address}` : null,
    profession ? `Profesie: ${profession}` : null,
  ].filter(Boolean);

  const enrichedMessage = metaLines.length > 0 ? `${metaLines.join(" | ")}\n\n${message}` : message;
  const saved = await saveContactMessage({ name, email, topic, message: enrichedMessage });
  return NextResponse.json({ ok: true, id: saved.id });
}
