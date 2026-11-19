"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, FieldInput, FieldLabel, NoticeBox } from "@/components/ui/primitives";

export function LoginForm({ nextPath, localTestHint }: { nextPath: string; localTestHint: boolean }) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Autentificare eșuată.");
      } else {
        const dest = data.user?.role === "admin" && nextPath === "/tablou-de-bord" ? "/admin" : nextPath;
        router.push(dest);
        router.refresh();
      }
    } catch {
      setError("Eroare de rețea.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border-2 border-asphalt bg-surface p-6">
      {error ? <NoticeBox tone="error">{error}</NoticeBox> : null}

      <div>
        <FieldLabel htmlFor="l-id">E-mail sau telefon</FieldLabel>
        <FieldInput
          id="l-id"
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="nume@exemplu.ro"
          className="mt-1.5"
        />
      </div>

      <div>
        <FieldLabel htmlFor="l-pw">Parolă</FieldLabel>
        <FieldInput
          id="l-pw"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Se verifică..." : "Intră în cont"}
      </Button>

      {localTestHint ? (
        <div className="border-t border-line pt-4 text-xs text-mute">
          <p className="font-semibold text-asphalt">Conturi locale de testare:</p>
          <p className="mt-1">
            Candidat: <span className="font-mono text-asphalt">candidat@drumo.ro</span> /{" "}
            <span className="font-mono text-asphalt">Candidat2026!</span>
          </p>
          <p>
            Admin: <span className="font-mono text-asphalt">admin@drumo.ro</span> /{" "}
            <span className="font-mono text-asphalt">AdminDrumo2026!</span>
          </p>
        </div>
      ) : null}
    </form>
  );
}
