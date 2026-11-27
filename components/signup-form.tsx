"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Button, FieldCheckbox, FieldInput, FieldLabel, FieldSelect, NoticeBox } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { EU_COUNTRIES } from "@/lib/config";
import type { SeedCategory } from "@/lib/data/seed-content";
import { feeFor, formatMoney, suggestedSchedule, type Currency } from "@/lib/domain/money";

type FieldKey = "fullName" | "email" | "phone" | "address" | "profession" | "message" | "consent";

const REQUEST_TOPICS = [
  "Înscriere pregătire teoretică + evaluare online",
  "Pregătire completă în limba română (Diaspora)",
  "Informații plată în 2–3 tranșe și acces capitole",
  "Altă solicitare privind categoriile AM–DE",
];

export function SignupForm({
  categories,
  initialCategoryCode,
}: {
  categories: SeedCategory[];
  initialCategoryCode?: string;
}) {
  const toast = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("RO");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState("");
  const [categoryCode, setCategoryCode] = useState(
    categories.find((c) => c.code === initialCategoryCode)?.code ?? "B",
  );
  const [topic, setTopic] = useState(REQUEST_TOPICS[0]);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const selectedCat = categories.find((c) => c.code === categoryCode) ?? categories[0];
  const fees = feeFor(selectedCat, currency);
  const schedule = suggestedSchedule(selectedCat, currency);
  const countryLabel = EU_COUNTRIES.find((c) => c.code === country)?.name ?? country;

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
    if (fullName.trim().length < 3) {
      errs.fullName = "Introdu numele complet (minim 3 caractere).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      errs.email = "Introdu o adresă de e-mail validă (ex. nume@exemplu.ro).";
    }
    const digits = phone.replace(/[^0-9]/g, "");
    if (digits.length < 8 || digits.length > 15) {
      errs.phone = "Introdu un număr de telefon valid (ex. +40 722 000 000).";
    }
    if (address.trim().length < 4) {
      errs.address = "Introdu orașul sau adresa de domiciliu.";
    }
    if (profession.trim().length < 2) {
      errs.profession = "Introdu profesia sau domeniul tău.";
    }
    if (message.trim().length < 10) {
      errs.message = "Scrie câteva detalii despre cererea ta (minim 10 caractere).";
    }
    if (!consent) {
      errs.consent = "Bifează acordul pentru Termeni și Politica de confidențialitate.";
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
      toast.error(msg, "Date incomplete");
      document.getElementById(`in-${firstKey}`)?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          country: countryLabel,
          address: address.trim(),
          profession: profession.trim(),
          categoryCode,
          topic: `[Cerere ${categoryCode}] ${topic}`,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error || "Trimiterea cererii nu a reușit.";
        setError(msg);
        toast.error(msg, "Eroare la trimitere");
      } else {
        setSubmittedId(data.id);
        toast.success("Cererea ta de înscriere a fost înregistrată.", "Cerere trimisă");
      }
    } catch {
      const msg = "Eroare de rețea. Verifică conexiunea și încearcă din nou.";
      setError(msg);
      toast.error(msg, "Conexiune întreruptă");
    } finally {
      setLoading(false);
    }
  }

  if (submittedId) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border-2 border-asphalt bg-surface p-8 text-asphalt shadow-card">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-signal text-asphalt">
            <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-cond text-3xl font-bold">Cerere înregistrată cu succes</h2>
            <p className="font-mono text-xs text-mute">Referință: {submittedId}</p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-mute sm:text-base">
          Mulțumim, <strong className="font-semibold text-asphalt">{fullName}</strong>. Solicitarea ta pentru{" "}
          <strong className="font-semibold text-asphalt">{selectedCat.name_ro}</strong> ({countryLabel}) a ajuns la
          echipa PermiStart. Vei primi un răspuns pe <span className="font-mono text-asphalt">{email}</span> sau la{" "}
          <span className="font-mono text-asphalt">{phone}</span> în cel mult 24 de ore lucrătoare cu pașii de acces și
          opțiunile de plată în tranșe — fără nicio taxă percepută acum.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/categorii"
            className="inline-flex min-h-[44px] items-center rounded bg-asphalt px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink"
          >
            Înapoi la categorii
          </Link>
          <button
            type="button"
            onClick={() => {
              setSubmittedId(null);
              setMessage("");
            }}
            className="inline-flex min-h-[44px] items-center rounded border border-line bg-chalk px-5 py-2.5 text-sm font-semibold text-asphalt hover:bg-white"
          >
            Trimite o altă cerere
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
      <form noValidate onSubmit={onSubmit} className="space-y-5 rounded-xl border border-line bg-surface p-6 sm:p-8">
        {error ? <NoticeBox tone="error">{error}</NoticeBox> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="in-fullName">Nume complet</FieldLabel>
            <FieldInput
              id="in-fullName"
              value={fullName}
              aria-invalid={Boolean(fieldErrors.fullName)}
              onChange={(e) => {
                setFullName(e.target.value);
                clearFieldError("fullName");
              }}
              placeholder="ex. Andrei Popescu"
              className="mt-1.5"
            />
            {fieldErrors.fullName ? <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.fullName}</p> : null}
          </div>

          <div>
            <FieldLabel htmlFor="in-email">Adresă de e-mail</FieldLabel>
            <FieldInput
              id="in-email"
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="in-phone">Telefon</FieldLabel>
            <FieldInput
              id="in-phone"
              type="tel"
              value={phone}
              aria-invalid={Boolean(fieldErrors.phone)}
              onChange={(e) => {
                setPhone(e.target.value);
                clearFieldError("phone");
              }}
              placeholder="ex. +40 722 000 000"
              className="mt-1.5"
            />
            {fieldErrors.phone ? <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.phone}</p> : null}
          </div>

          <div>
            <FieldLabel htmlFor="in-country">Țara de reședință</FieldLabel>
            <FieldSelect
              id="in-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1.5"
            >
              {EU_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </FieldSelect>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="in-address">Adresă de domiciliu</FieldLabel>
            <FieldInput
              id="in-address"
              value={address}
              aria-invalid={Boolean(fieldErrors.address)}
              onChange={(e) => {
                setAddress(e.target.value);
                clearFieldError("address");
              }}
              placeholder="Oraș, stradă sau țară"
              className="mt-1.5"
            />
            {fieldErrors.address ? <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.address}</p> : null}
          </div>

          <div>
            <FieldLabel htmlFor="in-profession">Profesie</FieldLabel>
            <FieldInput
              id="in-profession"
              value={profession}
              aria-invalid={Boolean(fieldErrors.profession)}
              onChange={(e) => {
                setProfession(e.target.value);
                clearFieldError("profession");
              }}
              placeholder="ex. Șofer, student, tehnician"
              className="mt-1.5"
            />
            {fieldErrors.profession ? (
              <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.profession}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="in-category">Categoria de permis dorită</FieldLabel>
            <FieldSelect
              id="in-category"
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
              className="mt-1.5"
            >
              {categories.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.name_ro} ({formatMoney(currency === "RON" ? cat.fee_ron : cat.fee_eur, currency)})
                </option>
              ))}
            </FieldSelect>
          </div>

          <div>
            <FieldLabel htmlFor="in-topic">Obiectul cererii</FieldLabel>
            <FieldSelect id="in-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1.5">
              {REQUEST_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </FieldSelect>
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="in-message">Mesaj și detalii suplimentare</FieldLabel>
          <textarea
            id="in-message"
            rows={4}
            value={message}
            aria-invalid={Boolean(fieldErrors.message)}
            onChange={(e) => {
              setMessage(e.target.value);
              clearFieldError("message");
            }}
            placeholder="Scrie categoria vizată, dacă preferi plata în tranșe sau programul tău de studiu..."
            className="mt-1.5 w-full rounded border border-line bg-white px-3 py-2 text-sm text-asphalt transition-colors focus:border-asphalt focus:outline-none"
          />
          {fieldErrors.message ? <p className="mt-1 text-xs font-medium text-danger">{fieldErrors.message}</p> : null}
        </div>

        <div className="rounded-lg border border-line bg-chalk p-4">
          <label htmlFor="in-consent" className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-asphalt">
            <FieldCheckbox
              id="in-consent"
              checked={consent}
              onCheckedChange={(checked) => {
                setConsent(checked);
                clearFieldError("consent");
              }}
              className="mt-0.5"
            />
            <span>
              Am citit și accept{" "}
              <Link href="/termeni" className="font-semibold text-sign underline underline-offset-2">
                Termenii și condițiile
              </Link>{" "}
              și{" "}
              <Link href="/confidentialitate" className="font-semibold text-sign underline underline-offset-2">
                Politica de confidențialitate (GDPR)
              </Link>
              .
            </span>
          </label>
          {fieldErrors.consent ? <p className="mt-1.5 text-xs font-medium text-danger">{fieldErrors.consent}</p> : null}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Se trimite cererea..." : "Trimite cererea de înscriere"}
        </Button>
      </form>

      {/* Transparent tariff & pre-registration summary */}
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-line bg-asphalt p-6 text-white">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-semibold text-signal">Rezumat tarif</span>
            <div className="inline-flex rounded border border-white/20 p-0.5 text-xs">
              {(["EUR", "RON"] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`rounded px-2.5 py-1 font-mono font-semibold transition-colors ${
                    currency === curr ? "bg-signal text-asphalt" : "text-white/80 hover:text-white"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <h2 className="mt-4 font-cond text-2xl font-bold text-white">{selectedCat.name_ro}</h2>
          <p className="mt-1 text-sm text-white/75">{selectedCat.short_ro}</p>

          <dl className="mt-5 space-y-3 border-t border-white/15 pt-4 text-sm">
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-white/75">Taxă totală pregătire</dt>
              <dd className="font-cond text-3xl font-bold tabular-nums text-signal">
                {formatMoney(fees.total, currency)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <dt className="text-white/70">Sau în {schedule.length} tranșe, de la</dt>
              <dd className="font-mono font-semibold text-white">{formatMoney(fees.minFirst, currency)} prima tranșă</dd>
            </div>
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <dt className="text-white/70">Examen teoretic online</dt>
              <dd className="font-mono text-white">
                {selectedCat.exam_question_count} întrebări · prag {selectedCat.exam_pass_mark}/
                {selectedCat.exam_question_count}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-line bg-white p-5 text-xs leading-relaxed text-mute">
          <div className="flex items-center gap-2 font-semibold text-asphalt">
            <ShieldCheckIcon className="h-5 w-5 text-sign" aria-hidden="true" />
            <span>Fără plată online obligatorie la înscriere</span>
          </div>
          <p className="mt-2">
            Acest formular trimite cererea ta de înscriere către echipa PermiStart. Confirmăm eligibilitatea și
            modalitatea de plată dorită înainte de activarea accesului.
          </p>
        </div>
      </aside>
    </div>
  );
}
