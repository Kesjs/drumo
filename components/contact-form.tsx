"use client";

import { useState } from "react";
import { Button, FieldInput, FieldLabel, FieldSelect, FieldTextarea, NoticeBox } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";

type ContactField = "name" | "email" | "message";

export function ContactForm() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Întrebare generală");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ContactField, string>>>({});

  function clearFieldError(k: ContactField) {
    setFieldErrors((prev) => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  }

  function validate(): Partial<Record<ContactField, string>> {
    const errs: Partial<Record<ContactField, string>> = {};
    if (name.trim().length < 2) errs.name = "Introdu numele și prenumele (minim 2 caractere).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errs.email = "Introdu o adresă de e-mail validă.";
    if (message.trim().length < 10) errs.message = "Mesajul trebuie să conțină cel puțin 10 caractere.";
    return errs;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0] as ContactField;
      toast.error(errs[firstKey] || "Verifică datele formularului.", "Câmpuri incomplete");
      const idMap: Record<ContactField, string> = { name: "c-name", email: "c-email", message: "c-msg" };
      document.getElementById(idMap[firstKey])?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), topic, message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error || "Trimiterea nu a reușit.";
        setStatus({ type: "err", text: msg });
        toast.error(msg, "Eroare la trimitere");
      } else {
        const okMsg = "Mesajul a fost înregistrat. Îți răspundem pe e-mail în cel mai scurt timp.";
        setStatus({ type: "ok", text: okMsg });
        toast.success(okMsg, "Mesaj trimis");
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch {
      const msg = "Eroare de rețea. Încearcă din nou.";
      setStatus({ type: "err", text: msg });
      toast.error(msg, "Conexiune întreruptă");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-4 rounded-lg border-2 border-asphalt bg-surface p-6">
      {status ? (
        <NoticeBox tone={status.type === "ok" ? "success" : "error"}>{status.text}</NoticeBox>
      ) : null}

      <div>
        <FieldLabel htmlFor="c-name">Nume și prenume</FieldLabel>
        <FieldInput
          id="c-name"
          value={name}
          aria-invalid={Boolean(fieldErrors.name)}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          placeholder="ex. Andrei Popescu"
          className="mt-1.5"
        />
        {fieldErrors.name ? <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.name}</p> : null}
      </div>

      <div>
        <FieldLabel htmlFor="c-email">Adresă de e-mail</FieldLabel>
        <FieldInput
          id="c-email"
          type="email"
          value={email}
          aria-invalid={Boolean(fieldErrors.email)}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError("email");
          }}
          placeholder="nume@exemplu.ro"
          className="mt-1.5"
        />
        {fieldErrors.email ? <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.email}</p> : null}
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
          value={message}
          aria-invalid={Boolean(fieldErrors.message)}
          onChange={(e) => {
            setMessage(e.target.value);
            clearFieldError("message");
          }}
          placeholder="Scrie-ne întrebarea ta..."
          className="mt-1.5"
        />
        {fieldErrors.message ? <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.message}</p> : null}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Se trimite..." : "Trimite mesajul"}
      </Button>
    </form>
  );
}
