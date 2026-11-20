"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle2 } from "lucide-react";
import { Button, FieldCheckbox, FieldLabel, FieldSelect, NoticeBox, Panel, StatusTag } from "@/components/ui/primitives";
import type { KycRecord } from "@/lib/data/store";
import { formatRoDate } from "@/lib/i18n";

export function KycPanel({ kyc }: { kyc: KycRecord | null }) {
  const router = useRouter();
  const idInputRef = useRef<HTMLInputElement | null>(null);
  const selfieInputRef = useRef<HTMLInputElement | null>(null);
  const [documentType, setDocumentType] = useState<"ci" | "passport" | "eu_id">("ci");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [idFileName, setIdFileName] = useState("");
  const [selfieFileName, setSelfieFileName] = useState("");
  const [flagManualReview, setFlagManualReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idFile || !selfieFile) {
      setMsg({ tone: "error", text: "Selectează fotografia actului și fotografia tip selfie." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const form = new FormData();
      form.append("documentType", documentType);
      form.append("idFile", idFile);
      form.append("selfieFile", selfieFile);
      form.append("flagManualReview", String(flagManualReview));

      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ tone: "error", text: data.error || "Trimiterea nu a reușit." });
      } else {
        setMsg({
          tone: "success",
          text: "Documentele au fost încărcate criptat și trimise spre verificare.",
        });
        router.refresh();
      }
    } catch {
      setMsg({ tone: "error", text: "Eroare de rețea." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {kyc ? (
        <Panel strong>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-cond text-2xl font-bold">Starea verificării curente</h2>
            <StatusTag
              tone={
                kyc.status === "approved"
                  ? "ok"
                  : kyc.status === "rejected"
                    ? "danger"
                    : "signal"
              }
            >
              {kyc.status === "approved"
                ? "Identitate aprobată"
                : kyc.status === "rejected"
                  ? "Respins"
                  : kyc.status === "manual_review"
                    ? "În revizuire manuală"
                    : "În curs de verificare"}
            </StatusTag>
          </div>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-mute">Tip document</dt>
              <dd className="font-mono uppercase">{kyc.document_type}</dd>
            </div>
            <div>
              <dt className="text-xs text-mute">Ștergere automată GDPR</dt>
              <dd className="font-mono">{formatRoDate(kyc.purge_after)}</dd>
            </div>
          </dl>
          {kyc.reviewer_note ? (
            <p className="mt-3 border-t border-line pt-3 text-xs text-asphalt">
              Notă evaluator: {kyc.reviewer_note}
            </p>
          ) : null}
        </Panel>
      ) : null}

      {kyc?.status !== "approved" ? (
        <form onSubmit={onSubmit} className="space-y-5 rounded-lg border-2 border-asphalt bg-surface p-6">
          <div>
            <h2 className="font-cond text-2xl font-bold">Încarcă actul de identitate și selfie</h2>
            <p className="mt-1 text-sm text-mute">
              Imaginile sunt stocate criptat în spațiu privat și se șterg automat după 30 de zile.
            </p>
          </div>

          {msg ? <NoticeBox tone={msg.tone}>{msg.text}</NoticeBox> : null}

          <div>
            <FieldLabel htmlFor="kyc-type">Tip document acceptat (UE)</FieldLabel>
            <FieldSelect
              id="kyc-type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as "ci" | "passport" | "eu_id")}
              className="mt-1.5"
            >
              <option value="ci">Carte de identitate (România)</option>
              <option value="eu_id">Carte de identitate națională (UE)</option>
              <option value="passport">Pașaport</option>
            </FieldSelect>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="kyc-doc">Fotografie act de identitate</FieldLabel>
              <input
                ref={idInputRef}
                id="kyc-doc"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setIdFile(f);
                  setIdFileName(f?.name || "");
                }}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => idInputRef.current?.click()}
                className="mt-1.5 flex min-h-[88px] w-full flex-col items-center justify-center gap-1.5 rounded border-2 border-dashed border-asphalt bg-chalk px-4 py-3 text-center text-xs transition-colors hover:bg-white"
              >
                {idFileName ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-ok" />
                    <span className="font-mono font-semibold text-asphalt">{idFileName}</span>
                    <span className="text-mute">Apasă pentru a înlocui fișierul</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-sign" />
                    <span className="font-semibold text-asphalt">Selectează fotografia actului</span>
                    <span className="text-mute">JPG, PNG sau PDF</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <FieldLabel htmlFor="kyc-selfie">Selfie clar cu fața vizibilă</FieldLabel>
              <input
                ref={selfieInputRef}
                id="kyc-selfie"
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setSelfieFile(f);
                  setSelfieFileName(f?.name || "");
                }}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => selfieInputRef.current?.click()}
                className="mt-1.5 flex min-h-[88px] w-full flex-col items-center justify-center gap-1.5 rounded border-2 border-dashed border-asphalt bg-chalk px-4 py-3 text-center text-xs transition-colors hover:bg-white"
              >
                {selfieFileName ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-ok" />
                    <span className="font-mono font-semibold text-asphalt">{selfieFileName}</span>
                    <span className="text-mute">Apasă pentru a reface fotografia</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-sign" />
                    <span className="font-semibold text-asphalt">Fă sau încarcă un selfie</span>
                    <span className="text-mute">Fața vizibilă, fără ochelari de soare</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-xs text-mute">
            <FieldCheckbox checked={flagManualReview} onCheckedChange={setFlagManualReview} />
            <span>Solicită verificare manuală (ex. document deteriorat sau lumină slabă)</span>
          </label>

          <Button type="submit" disabled={loading}>
            {loading ? "Se încarcă criptat..." : "Trimite documentele spre verificare"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
