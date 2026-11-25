"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, FieldCheckbox, FieldInput, FieldLabel, FieldSelect, NoticeBox } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { EU_COUNTRIES } from "@/lib/config";
import type { SeedCategory } from "@/lib/data/seed-content";
import { feeFor, formatMoney, suggestedSchedule, type Currency } from "@/lib/domain/money";

type FieldKey = "lastName" | "firstName" | "email" | "phone" | "password" | "consents";

export function SignupForm({
  categories,
  initialCategoryCode,
}: {
  categories: SeedCategory[];
  initialCategoryCode?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactMode, setContactMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("RO");
  const [categoryCode, setCategoryCode] = useState(
    categories.find((c) => c.code === initialCategoryCode)?.code ?? "B",
  );
  const [currency, setCurrency] = useState<Currency>("RON");
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentBiometric, setConsentBiometric] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const selectedCat = categories.find((c) => c.code === categoryCode) ?? categories[0];
  const fees = feeFor(selectedCat, currency);
  const schedule = suggestedSchedule(selectedCat, currency);

  function clearFieldError(key: FieldKey) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validateFields(): Partial<Record<FieldKey, string>> {
    const errs: Partial<Record<FieldKey, string>> = {};
    const last = lastName.trim();
    const first = firstName.trim();
    const nameRe = /^[\p{L}\s'-]{2,60}$/u;

    if (last.length < 2 || !nameRe.test(last)) {
      errs.lastName = "Introdu un nume de familie valid (minim 2 litere).";
    }
    if (first.length < 2 || !nameRe.test(first)) {
      errs.firstName = "Introdu un prenume valid (minim 2 litere).";
    }
    if (contactMode === "email") {
      const emailTrim = email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailTrim)) {
        errs.email = "Introdu o adresă de e-mail validă (ex. nume@exemplu.ro).";
      }
    } else {
      const digits = phone.replace(/[^0-9]/g, "");
      if (digits.length < 8 || digits.length > 15) {
        errs.phone = "Introdu un număr de telefon valid (minim 8 cifre, ex. +40 722 000 000).";
      }
    }
    if (password.length < 8) {
      errs.password = "Parola trebuie să aibă cel puțin 8 caractere.";
    }
    if (!consentTerms || !consentPrivacy || !consentBiometric) {
      errs.consents = "Bifează toate cele 3 acorduri obligatorii pentru a continua.";
    }
    return errs;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const errs = validateFields();
    setFieldErrors(errs);

    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0] as FieldKey;
      const msg = errs[firstKey] || "Verifică datele introduse.";
      toast.error(msg, "Date incomplete sau invalide");
      const idMap: Record<FieldKey, string> = {
        lastName: "s-last",
        firstName: "s-first",
        email: "s-email",
        phone: "s-phone",
        password: "s-pass",
        consents: "s-consents",
      };
      document.getElementById(idMap[firstKey])?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: contactMode === "email" ? email.trim() : "",
          phone: contactMode === "phone" ? phone.trim() : "",
          password,
          country,
          categoryCode,
          currency,
          consentTerms,
          consentPrivacy,
          consentBiometric,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error || "Înscrierea nu a reușit.";
        setError(msg);
        toast.error(msg, "Eroare la înscriere");
      } else {
        toast.success("Contul a fost creat. Continuă cu verificarea identității.", "Înscriere reușită");
        router.push("/verificare-identitate");
        router.refresh();
      }
    } catch {
      const msg = "Eroare de rețea. Verifică conexiunea și încearcă din nou.";
      setError(msg);
      toast.error(msg, "Conexiune întreruptă");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr]">
      <form noValidate onSubmit={onSubmit} className="space-y-5 rounded-lg border-2 border-asphalt bg-surface p-6">
        {error ? <NoticeBox tone="error">{error}</NoticeBox> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="s-last">Nume de familie</FieldLabel>
            <FieldInput
              id="s-last"
              value={lastName}
              aria-invalid={Boolean(fieldErrors.lastName)}
              onChange={(e) => {
                setLastName(e.target.value);
                clearFieldError("lastName");
              }}
              placeholder="ex. Popescu"
              className="mt-1.5"
            />
            {fieldErrors.lastName ? <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.lastName}</p> : null}
          </div>
          <div>
            <FieldLabel htmlFor="s-first">Prenume</FieldLabel>
            <FieldInput
              id="s-first"
              value={firstName}
              aria-invalid={Boolean(fieldErrors.firstName)}
              onChange={(e) => {
                setFirstName(e.target.value);
                clearFieldError("firstName");
              }}
              placeholder="ex. Andrei"
              className="mt-1.5"
            />
            {fieldErrors.firstName ? <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.firstName}</p> : null}
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-asphalt">Metodă de contact principală</span>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setContactMode("email");
                clearFieldError("phone");
              }}
              className={`min-h-[40px] rounded border px-3.5 text-sm font-semibold ${
                contactMode === "email" ? "border-asphalt bg-asphalt text-white" : "border-line bg-chalk text-asphalt"
              }`}
            >
              E-mail
            </button>
            <button
              type="button"
              onClick={() => {
                setContactMode("phone");
                clearFieldError("email");
              }}
              className={`min-h-[40px] rounded border px-3.5 text-sm font-semibold ${
                contactMode === "phone" ? "border-asphalt bg-asphalt text-white" : "border-line bg-chalk text-asphalt"
              }`}
            >
              Telefon
            </button>
          </div>
          {contactMode === "email" ? (
            <div className="mt-3">
              <FieldLabel htmlFor="s-email">Adresă de e-mail</FieldLabel>
              <FieldInput
                id="s-email"
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
          ) : (
            <div className="mt-3">
              <FieldLabel htmlFor="s-phone">Număr de telefon</FieldLabel>
              <FieldInput
                id="s-phone"
                type="tel"
                value={phone}
                aria-invalid={Boolean(fieldErrors.phone)}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearFieldError("phone");
                }}
                placeholder="+40 7XX XXX XXX"
                className="mt-1.5"
              />
              {fieldErrors.phone ? <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.phone}</p> : null}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="s-country">Țară (Uniunea Europeană)</FieldLabel>
            <FieldSelect id="s-country" value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1.5">
              {EU_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel htmlFor="s-cat">Categoria de permis</FieldLabel>
            <FieldSelect
              id="s-cat"
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
              className="mt-1.5"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.code} · {c.name_ro.replace(/^Categoria\s+\w+\s+[—·]\s+/, "")}
                </option>
              ))}
            </FieldSelect>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="s-pass">Parolă (minim 8 caractere)</FieldLabel>
            <FieldInput
              id="s-pass"
              type="password"
              value={password}
              aria-invalid={Boolean(fieldErrors.password)}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              placeholder="Minim 8 caractere"
              className="mt-1.5"
            />
            {fieldErrors.password ? <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.password}</p> : null}
          </div>
          <div>
            <FieldLabel htmlFor="s-curr">Monedă afișare și plată</FieldLabel>
            <FieldSelect
              id="s-curr"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="mt-1.5"
            >
              <option value="RON">RON (Lei)</option>
              <option value="EUR">EUR (Euro)</option>
            </FieldSelect>
          </div>
        </div>

        <fieldset id="s-consents" tabIndex={-1} className="space-y-3 border-t border-line pt-4 text-xs focus:outline-none">
          <legend className="font-semibold text-asphalt">Consimțăminte obligatorii (GDPR)</legend>
          <label className="flex cursor-pointer items-start gap-2.5">
            <FieldCheckbox
              checked={consentTerms}
              onCheckedChange={(v) => {
                setConsentTerms(v);
                clearFieldError("consents");
              }}
            />
            <span>
              Am citit{" "}
              <Link href="/termeni" target="_blank" className="font-semibold text-sign underline">
                Termenii și condițiile
              </Link>{" "}
              și{" "}
              <Link href="/rambursari" target="_blank" className="font-semibold text-sign underline">
                Politica de rambursare
              </Link>
              . Înțeleg că documentul emis este un <strong>atestat de reușită PermiStart</strong>, nu permis de
              conducere oficial.
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2.5">
            <FieldCheckbox
              checked={consentPrivacy}
              onCheckedChange={(v) => {
                setConsentPrivacy(v);
                clearFieldError("consents");
              }}
            />
            <span>
              Accept prelucrarea datelor conform{" "}
              <Link href="/confidentialitate" target="_blank" className="font-semibold text-sign underline">
                Politicii de confidențialitate
              </Link>
              .
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2.5">
            <FieldCheckbox
              checked={consentBiometric}
              onCheckedChange={(v) => {
                setConsentBiometric(v);
                clearFieldError("consents");
              }}
            />
            <span>
              Consimțământ explicit (art. 9 GDPR) pentru prelucrarea fotografiei actului de identitate și a selfie-ului
              în scopul verificării identității la examen (păstrare scurtă, ștergere automată).
            </span>
          </label>
          {fieldErrors.consents ? <p className="text-xs font-medium text-danger">{fieldErrors.consents}</p> : null}
        </fieldset>

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Se creează contul..." : "Creează contul și continuă"}
        </Button>
      </form>

      <aside className="space-y-4">
        <div className="rounded-lg border-2 border-asphalt bg-surface p-6">
          <p className="font-mono text-xs text-sign">TAXĂ CATEGORIE · FĂRĂ ABONAMENT</p>
          <h2 className="mt-1 font-cond text-3xl font-bold">{selectedCat.name_ro.replace(" — ", " · ")}</h2>
          <p className="mt-2 text-sm text-mute">{selectedCat.short_ro}</p>

          <dl className="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-mute">Taxă unică totală</dt>
              <dd className="font-mono text-lg font-bold tabular-nums text-asphalt">
                {formatMoney(fees.total, currency)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mute">Sau prima tranșă minimă (deblochează cursurile)</dt>
              <dd className="font-mono font-semibold tabular-nums text-asphalt">
                {formatMoney(fees.minFirst, currency)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mute">Tranșe maxime permise</dt>
              <dd className="font-mono tabular-nums">{selectedCat.max_installments}</dd>
            </div>
          </dl>

          <div className="mt-4 border-t border-line pt-3 text-xs text-mute">
            <p className="font-semibold text-asphalt">Exemplu eșalonare ({selectedCat.max_installments} tranșe):</p>
            <p className="mt-1 font-mono tabular-nums">
              {schedule.map((amt, idx) => `${idx + 1}: ${formatMoney(amt, currency)}`).join(" · ")}
            </p>
          </div>
        </div>

        <NoticeBox tone="info" title="Ce plătești și când se deblochează">
          <ul className="list-disc space-y-1 pl-4 text-xs">
            <li>Cursurile și evaluările se deblochează la prima plată.</li>
            <li>Examenul se deblochează după plata integrală, KYC aprobat și evaluarea globală ≥ {selectedCat.readiness_threshold}%.</li>
            <li>Rambursare 14 zile dacă nu ai început cursurile.</li>
          </ul>
        </NoticeBox>
      </aside>
    </div>
  );
}
