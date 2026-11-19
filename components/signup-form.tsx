"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, FieldCheckbox, FieldInput, FieldLabel, FieldSelect, NoticeBox } from "@/components/ui/primitives";
import { EU_COUNTRIES } from "@/lib/config";
import type { SeedCategory } from "@/lib/data/seed-content";
import { feeFor, formatMoney, suggestedSchedule, type Currency } from "@/lib/domain/money";

export function SignupForm({
  categories,
  initialCategoryCode,
}: {
  categories: SeedCategory[];
  initialCategoryCode?: string;
}) {
  const router = useRouter();
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

  const selectedCat = categories.find((c) => c.code === categoryCode) ?? categories[0];
  const fees = feeFor(selectedCat, currency);
  const schedule = suggestedSchedule(selectedCat, currency);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: contactMode === "email" ? email : "",
          phone: contactMode === "phone" ? phone : "",
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
        setError(data.error || "Înscrierea nu a reușit.");
      } else {
        router.push("/verificare-identitate");
        router.refresh();
      }
    } catch {
      setError("Eroare de rețea. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr]">
      <form onSubmit={onSubmit} className="space-y-5 rounded-lg border-2 border-asphalt bg-surface p-6">
        {error ? <NoticeBox tone="error">{error}</NoticeBox> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="s-last">Nume de familie</FieldLabel>
            <FieldInput id="s-last" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <FieldLabel htmlFor="s-first">Prenume</FieldLabel>
            <FieldInput id="s-first" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1.5" />
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-asphalt">Metodă de contact principală</span>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setContactMode("email")}
              className={`min-h-[40px] rounded border px-3.5 text-sm font-semibold ${
                contactMode === "email" ? "border-asphalt bg-asphalt text-white" : "border-line bg-chalk text-asphalt"
              }`}
            >
              E-mail
            </button>
            <button
              type="button"
              onClick={() => setContactMode("phone")}
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nume@exemplu.ro"
                className="mt-1.5"
              />
            </div>
          ) : (
            <div className="mt-3">
              <FieldLabel htmlFor="s-phone">Număr de telefon</FieldLabel>
              <FieldInput
                id="s-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+40 7XX XXX XXX"
                className="mt-1.5"
              />
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
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
            />
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

        <fieldset className="space-y-3 border-t border-line pt-4 text-xs">
          <legend className="font-semibold text-asphalt">Consimțăminte obligatorii (GDPR)</legend>
          <label className="flex cursor-pointer items-start gap-2.5">
            <FieldCheckbox checked={consentTerms} onCheckedChange={setConsentTerms} required />
            <span>
              Am citit{" "}
              <Link href="/termeni" target="_blank" className="font-semibold text-sign underline">
                Termenii și condițiile
              </Link>{" "}
              și{" "}
              <Link href="/rambursari" target="_blank" className="font-semibold text-sign underline">
                Politica de rambursare
              </Link>
              . Înțeleg că documentul emis este un <strong>atestat de reușită Drumo</strong>, nu permis de
              conducere oficial.
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2.5">
            <FieldCheckbox checked={consentPrivacy} onCheckedChange={setConsentPrivacy} required />
            <span>
              Accept prelucrarea datelor conform{" "}
              <Link href="/confidentialitate" target="_blank" className="font-semibold text-sign underline">
                Politicii de confidențialitate
              </Link>
              .
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2.5">
            <FieldCheckbox checked={consentBiometric} onCheckedChange={setConsentBiometric} required />
            <span>
              Consimțământ explicit (art. 9 GDPR) pentru prelucrarea fotografiei actului de identitate și a selfie-ului
              în scopul verificării identității la examen (păstrare scurtă, ștergere automată).
            </span>
          </label>
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
