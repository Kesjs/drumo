"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/primitives";
import { CheckCircle2 } from "lucide-react";

export function LessonCompleteButton({ slug, alreadyDone }: { slug: string; alreadyDone: boolean }) {
  const router = useRouter();
  const [done, setDone] = useState(alreadyDone);
  const [loading, setLoading] = useState(false);

  async function markDone() {
    setLoading(true);
    try {
      const res = await fetch(`/api/chapters/${encodeURIComponent(slug)}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "lesson" }),
      });
      if (res.ok) {
        setDone(true);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <span className="inline-flex min-h-[44px] items-center gap-2 rounded border border-ok bg-ok/10 px-4 py-2 text-sm font-semibold text-ok">
        <CheckCircle2 className="h-4 w-4" />
        Lecție marcată ca parcursă
      </span>
    );
  }

  return (
    <Button type="button" variant="secondary" onClick={markDone} disabled={loading}>
      {loading ? "Se salvează..." : "Marchează lecția ca parcursă"}
    </Button>
  );
}
