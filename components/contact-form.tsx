"use client";

import { useState } from "react";
import { Button, FieldInput, FieldLabel, FieldSelect, FieldTextarea, NoticeBox } from "@/components/ui/primitives";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Întrebare generală");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "err", text: data.error || "Trimiterea nu a reușit." });
      } else {
        setStatus({ type: "ok", text: "Mesajul a fost înregistrat. Îți răspundem pe e-mail în cel mai scurt timp." });
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch {
      setStatus({ type: "err", text: "Eroare de rețea. Încearcă din nou." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border-2 border-asphalt bg-surface p-6">
      {status ? (
        <NoticeBox tone={status.type === "ok" ? "success" : "error"}>{status.text}</NoticeBox>
      ) : null}

      <div>
        <FieldLabel htmlFor="c-name">Nume și prenume</FieldLabel>
        <FieldInput id="c-name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
      </div>

      <div>
        <FieldLabel htmlFor="c-email">Adresă de e-mail</FieldLabel>
        <FieldInput
          id="c-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <FieldLabel htmlFor="c-topic">Subiect</FieldLabel>
        <FieldSelect id="c-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1.5">
          <option value="Întrebare generală">Întrebare generală</option>
          <option value="Plată și tranșe">Plată și tranșe</option>
          <option value="Verificare identitate (KYC)">Verificare identitate (KYC)</option>
          <option value="Rambursare">Rambursare</option>
          <option value="Atestat și verificare QR">Atestat și verificare QR</option>
        </FieldSelect>
      </div>

      <div>
        <FieldLabel htmlFor="c-msg">Mesaj</FieldLabel>
        <FieldTextarea
          id="c-msg"
          required
          minLength={10}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Se trimite..." : "Trimite mesajul"}
      </Button>
    </form>
  );
}
