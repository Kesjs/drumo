"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, FieldCheckbox, FieldInput, FieldLabel, FieldSelect, NoticeBox } from "@/components/ui/primitives";
import type { SeedCategory, SeedChapter } from "@/lib/data/seed-content";

export function AdminKycButtons({ kycId }: { kycId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function decide(decision: "approved" | "rejected" | "manual_review") {
    setBusy(true);
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "kyc", id: kycId, decision, note }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Notă revizuire (opțional)"
        className="min-h-[38px] rounded border border-line bg-surface px-2.5 text-xs"
      />
      <Button type="button" size="sm" onClick={() => decide("approved")} disabled={busy}>
        Aprobă
      </Button>
      <Button type="button" size="sm" variant="secondary" onClick={() => decide("manual_review")} disabled={busy}>
        Revizuire
      </Button>
      <Button type="button" size="sm" variant="danger" onClick={() => decide("rejected")} disabled={busy}>
        Respinge
      </Button>
    </div>
  );
}

export function AdminCertificateButtons({ certId, status }: { certId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "hold" | "release" | "revoked" | "send_now") {
    setBusy(true);
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "certificate",
        id: certId,
        action,
        reason: action === "hold" ? "Blocat pentru verificare antifraudă" : undefined,
      }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "held" && status !== "revoked" ? (
        <Button type="button" size="sm" variant="danger" onClick={() => act("hold")} disabled={busy}>
          Blochează trimiterea
        </Button>
      ) : null}
      {status === "held" ? (
        <Button type="button" size="sm" variant="secondary" onClick={() => act("release")} disabled={busy}>
          Deblochează în coadă
        </Button>
      ) : null}
      {status === "queued" || status === "held" ? (
        <Button type="button" size="sm" onClick={() => act("send_now")} disabled={busy}>
          Marchează trimis acum
        </Button>
      ) : null}
    </div>
  );
}

export function AdminCategoryRowEditor({ category }: { category: SeedCategory }) {
  const router = useRouter();
  const [feeRon, setFeeRon] = useState(String(category.fee_ron / 100));
  const [minFirstRon, setMinFirstRon] = useState(String(category.min_first_installment_ron / 100));
  const [feeEur, setFeeEur] = useState(String(category.fee_eur / 100));
  const [minFirstEur, setMinFirstEur] = useState(String(category.min_first_installment_eur / 100));
  const [maxInst, setMaxInst] = useState(String(category.max_installments));
  const [threshold, setThreshold] = useState(String(category.readiness_threshold));
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "category",
        id: category.id,
        fee_ron: Math.round(Number(feeRon) * 100),
        fee_eur: Math.round(Number(feeEur) * 100),
        min_first_installment_ron: Math.round(Number(minFirstRon) * 100),
        min_first_installment_eur: Math.round(Number(minFirstEur) * 100),
        max_installments: Number(maxInst),
        readiness_threshold: Number(threshold),
        active: category.active,
      }),
    });
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={save} className="grid items-end gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-7">
      <div>
        <span className="font-cond text-2xl font-bold">{category.code}</span>
        <p className="text-xs text-mute">{category.name_ro.replace(/^Categoria\s+\w+\s+—\s+/, "")}</p>
      </div>
      <div>
        <FieldLabel className="text-xs">Taxă RON</FieldLabel>
        <FieldInput type="number" value={feeRon} onChange={(e) => setFeeRon(e.target.value)} className="mt-1 font-mono" />
      </div>
      <div>
        <FieldLabel className="text-xs">Tranșă 1 RON</FieldLabel>
        <FieldInput type="number" value={minFirstRon} onChange={(e) => setMinFirstRon(e.target.value)} className="mt-1 font-mono" />
      </div>
      <div>
        <FieldLabel className="text-xs">Taxă EUR</FieldLabel>
        <FieldInput type="number" value={feeEur} onChange={(e) => setFeeEur(e.target.value)} className="mt-1 font-mono" />
      </div>
      <div>
        <FieldLabel className="text-xs">Tranșă 1 EUR</FieldLabel>
        <FieldInput type="number" value={minFirstEur} onChange={(e) => setMinFirstEur(e.target.value)} className="mt-1 font-mono" />
      </div>
      <div>
        <FieldLabel className="text-xs">Tranșe / Prag %</FieldLabel>
        <div className="mt-1 flex gap-1.5">
          <FieldInput type="number" min={1} max={6} value={maxInst} onChange={(e) => setMaxInst(e.target.value)} className="font-mono" />
          <FieldInput type="number" min={50} max={100} value={threshold} onChange={(e) => setThreshold(e.target.value)} className="font-mono" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm">
          {saved ? "Salvat" : "Salvează"}
        </Button>
      </div>
    </form>
  );
}

export function AdminConfigForm({
  initialLabel,
  initialAccredited,
  initialDelayHours,
}: {
  initialLabel: string;
  initialAccredited: boolean;
  initialDelayHours: number;
}) {
  const router = useRouter();
  const [label, setLabel] = useState(initialLabel);
  const [accredited, setAccredited] = useState(initialAccredited);
  const [delayHours, setDelayHours] = useState(String(initialDelayHours));
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "config",
        certificate_label: label,
        accredited,
        certificate_send_delay_hours: Number(delayHours),
      }),
    });
    if (res.ok) {
      setMsg("Configurația legală și de trimitere a fost actualizată.");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border-2 border-asphalt bg-surface p-5">
      <h2 className="font-cond text-2xl font-bold">Configurație legală atestat și coadă 3 zile</h2>
      {msg ? <NoticeBox tone="success">{msg}</NoticeBox> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="cfg-label">Denumire document</FieldLabel>
          <FieldInput id="cfg-label" value={label} onChange={(e) => setLabel(e.target.value)} className="mt-1" />
          <p className="mt-1 text-xs text-mute">
            Cât timp agrementul oficial este inactiv, serverul refuză automat orice formulare de tip „permis de conducere”.
          </p>
        </div>
        <div>
          <FieldLabel htmlFor="cfg-delay">Termen trimitere automată (ore, max. 72)</FieldLabel>
          <FieldInput
            id="cfg-delay"
            type="number"
            min={1}
            max={72}
            value={delayHours}
            onChange={(e) => setDelayHours(e.target.value)}
            className="mt-1 font-mono"
          />
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm">
        <FieldCheckbox checked={accredited} onCheckedChange={setAccredited} />
        <span>Platformă cu agrement oficial activ</span>
      </label>
      <Button type="submit" size="sm">
        Salvează configurația
      </Button>
    </form>
  );
}

export function AdminAddQuestionForm({ chapters }: { chapters: SeedChapter[] }) {
  const router = useRouter();
  const [chapterSlug, setChapterSlug] = useState(chapters[0]?.slug ?? "semne-de-circulatie");
  const [difficulty, setDifficulty] = useState("2");
  const [stem, setStem] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [correct, setCorrect] = useState<"A" | "B" | "C">("A");
  const [explanation, setExplanation] = useState("");
  const [legalRef, setLegalRef] = useState("OUG 195/2002");
  const [examPool, setExamPool] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ch = chapters.find((c) => c.slug === chapterSlug)!;
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "question",
        chapter_id: ch.id,
        chapter_slug: ch.slug,
        difficulty: Number(difficulty),
        stem_ro: stem,
        explanation_ro: explanation,
        legal_ref: legalRef,
        exam_pool: examPool,
        multi: false,
        category_codes: ch.category_codes,
        options: [
          { label: "A", body_ro: optA, is_correct: correct === "A" },
          { label: "B", body_ro: optB, is_correct: correct === "B" },
          { label: "C", body_ro: optC, is_correct: correct === "C" },
        ],
      }),
    });
    if (res.ok) {
      setMsg("Întrebarea a fost adăugată în bancă.");
      setStem("");
      setOptA("");
      setOptB("");
      setOptC("");
      setExplanation("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border-2 border-asphalt bg-surface p-5">
      <h2 className="font-cond text-2xl font-bold">Adaugă întrebare nouă</h2>
      {msg ? <NoticeBox tone="success">{msg}</NoticeBox> : null}
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <FieldLabel>Capitol</FieldLabel>
          <FieldSelect value={chapterSlug} onChange={(e) => setChapterSlug(e.target.value)} className="mt-1">
            {chapters.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.title_ro}
              </option>
            ))}
          </FieldSelect>
        </div>
        <div>
          <FieldLabel>Dificultate (1–5)</FieldLabel>
          <FieldSelect value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mt-1">
            {["1", "2", "3", "4", "5"].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </FieldSelect>
        </div>
        <div>
          <FieldLabel>Varianta corectă</FieldLabel>
          <FieldSelect value={correct} onChange={(e) => setCorrect(e.target.value as "A" | "B" | "C")} className="mt-1">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </FieldSelect>
        </div>
      </div>

      <div>
        <FieldLabel>Enunț întrebare</FieldLabel>
        <FieldInput required minLength={8} value={stem} onChange={(e) => setStem(e.target.value)} className="mt-1" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <FieldLabel>Varianta A</FieldLabel>
          <FieldInput required value={optA} onChange={(e) => setOptA(e.target.value)} className="mt-1" />
        </div>
        <div>
          <FieldLabel>Varianta B</FieldLabel>
          <FieldInput required value={optB} onChange={(e) => setOptB(e.target.value)} className="mt-1" />
        </div>
        <div>
          <FieldLabel>Varianta C</FieldLabel>
          <FieldInput required value={optC} onChange={(e) => setOptC(e.target.value)} className="mt-1" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>Explicație răspuns</FieldLabel>
          <FieldInput required minLength={8} value={explanation} onChange={(e) => setExplanation(e.target.value)} className="mt-1" />
        </div>
        <div>
          <FieldLabel>Referință legală</FieldLabel>
          <FieldInput required value={legalRef} onChange={(e) => setLegalRef(e.target.value)} className="mt-1" />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-xs">
        <FieldCheckbox checked={examPool} onCheckedChange={setExamPool} />
        <span>Rezervată pentru banca de examen</span>
      </label>

      <Button type="submit" size="sm">
        Salvează întrebarea
      </Button>
    </form>
  );
}

export function AdminRefundButtons({ refundId }: { refundId: string }) {
  const router = useRouter();
  async function decide(status: "approved" | "rejected") {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "refund", id: refundId, status }),
    });
    router.refresh();
  }
  return (
    <div className="flex gap-2">
      <Button type="button" size="sm" onClick={() => decide("approved")}>
        Aprobă
      </Button>
      <Button type="button" size="sm" variant="danger" onClick={() => decide("rejected")}>
        Respinge
      </Button>
    </div>
  );
}
