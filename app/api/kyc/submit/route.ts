import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, submitKyc } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/server";

const JsonSchema = z.object({
  documentType: z.enum(["ci", "passport", "eu_id"]),
  idFileName: z.string().min(1).max(160),
  selfieFileName: z.string().min(1).max(160),
  flagManualReview: z.boolean().optional(),
});

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB per document

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Autentificare necesară." }, { status: 401 });

  const contentType = req.headers.get("content-type") || "";

  let documentType: "ci" | "passport" | "eu_id" = "ci";
  let idFileName = "";
  let selfieFileName = "";
  let flagManualReview = false;

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ ok: false, error: "Formular invalid." }, { status: 400 });
    }
    const rawType = String(form.get("documentType") || "ci");
    if (rawType === "ci" || rawType === "passport" || rawType === "eu_id") {
      documentType = rawType;
    }
    flagManualReview = form.get("flagManualReview") === "true";

    const idFile = form.get("idFile");
    const selfieFile = form.get("selfieFile");
    if (!(idFile instanceof File) || !(selfieFile instanceof File) || idFile.size === 0 || selfieFile.size === 0) {
      return NextResponse.json({ ok: false, error: "Încarcă actul de identitate și selfie-ul." }, { status: 400 });
    }
    if (idFile.size > MAX_BYTES || selfieFile.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Fiecare fișier trebuie să aibă cel mult 10 MB." }, { status: 400 });
    }

    idFileName = idFile.name.slice(0, 140);
    selfieFileName = selfieFile.name.slice(0, 140);

    if (isSupabaseConfigured()) {
      const svc = createSupabaseService();
      if (svc) {
        const ts = Date.now();
        const idPath = `${user.id}/${ts}-doc-${idFileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const selfiePath = `${user.id}/${ts}-selfie-${selfieFileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const [idBuf, selfieBuf] = await Promise.all([idFile.arrayBuffer(), selfieFile.arrayBuffer()]);
        await Promise.all([
          svc.storage.from("kyc-private").upload(idPath, idBuf, {
            contentType: idFile.type || "application/octet-stream",
            upsert: true,
          }),
          svc.storage.from("kyc-private").upload(selfiePath, selfieBuf, {
            contentType: selfieFile.type || "image/jpeg",
            upsert: true,
          }),
        ]).catch(() => null);
        idFileName = idPath;
        selfieFileName = selfiePath;
      }
    }
  } else {
    const body = await req.json().catch(() => null);
    const parsed = JsonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Încarcă actul de identitate și selfie-ul." }, { status: 400 });
    }
    documentType = parsed.data.documentType;
    idFileName = parsed.data.idFileName;
    selfieFileName = parsed.data.selfieFileName;
    flagManualReview = Boolean(parsed.data.flagManualReview);
  }

  const record = await submitKyc({
    userId: user.id,
    documentType,
    idFileName,
    selfieFileName,
    flagManualReview,
  });
  return NextResponse.json({ ok: true, kyc: record });
}
