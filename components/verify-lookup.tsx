"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, FieldInput, FieldLabel } from "@/components/ui/primitives";

export function VerifyLookup() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = code.trim().toUpperCase();
    if (!/^DR-[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(cleaned)) {
      setError("Introdu un cod valid în formatul DR-XXXX-XXXX.");
      return;
    }
    setError(null);
    router.push(`/verificare/${encodeURIComponent(cleaned)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-line bg-white p-6 sm:p-8">
      <div>
        <FieldLabel htmlFor="cert-code">Cod atestat</FieldLabel>
        <FieldInput
          id="cert-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ex. DR-XXXX-XXXX"
          className="mt-1.5 font-mono uppercase"
          autoComplete="off"
        />
        {error ? <p className="mt-2 text-xs font-medium text-danger">{error}</p> : null}
      </div>
      <Button type="submit">Verifică atestatul</Button>
    </form>
  );
}
