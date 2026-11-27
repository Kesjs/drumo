"use client";
import { ReactNode } from "react";
import {
  SpeakerWaveIcon,
  CameraIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  CreditCardIcon,
  LockClosedIcon,
  DocumentCheckIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { LogoMark } from "./logo";

export function Frame({
  children,
  className = "",
}: {
  children: ReactNode;
  title?: string;
  hideHeader?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded border border-line bg-white text-asphalt shadow-lift ${className}`}
    >
      {children}
    </div>
  );
}

export function Bar({ value, color = "bg-signal" }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-line">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function SignSlot({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded border border-line bg-chalk ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
}

export function DashboardMock() {
  return (
    <Frame hideHeader>
      <div className="text-sm">
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-asphalt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/cedeaza-popa-tatu.webp"
            alt="Indicatoarele Cedează trecerea și Interzis virajul la stânga la o intersecție din București"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt/90 via-asphalt/25 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-signal px-2 py-0.5 font-mono text-xs font-bold text-asphalt">
              CAT. B · CAPITOLUL 2
            </span>
            <span className="rounded bg-asphalt/85 px-2 py-0.5 font-mono text-xs text-chalk">
              București · Str. Popa Tatu
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-chalk">
            <div>
              <p className="font-mono text-xs text-signal">Priorități în intersecții dirijate</p>
              <p className="font-cond text-xl font-bold leading-tight">
                Cedează trecerea + Interzis virajul la stânga
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded bg-chalk px-2.5 py-1 text-xs font-semibold text-asphalt">
              <SpeakerWaveIcon className="h-3.5 w-3.5 text-sign" aria-hidden="true" />
              Ascultă lecția
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="p-3">
            <p className="font-mono text-xs text-mute">01 · Indicator</p>
            <p className="mt-0.5 font-semibold text-asphalt">Triunghi roșu inversat</p>
            <p className="text-xs text-mute">Pierzi prioritatea față de drumul transversal.</p>
          </div>
          <div className="p-3">
            <p className="font-mono text-xs text-mute">02 · Restricție</p>
            <p className="mt-0.5 font-semibold text-asphalt">Viraj stânga interzis</p>
            <p className="text-xs text-mute">Poți continua doar înainte sau la dreapta.</p>
          </div>
          <div className="bg-chalk/60 p-3">
            <p className="font-mono text-xs text-sign">03 · Verificare</p>
            <p className="mt-0.5 font-semibold text-asphalt">14 situații reale</p>
            <p className="text-xs text-mute">Explicații pas cu pas după fiecare răspuns.</p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function SignupStepMock() {
  return (
    <Frame title="permistart.ro/inscriere">
      <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr]">
        <div className="relative min-h-[210px] overflow-hidden border-b border-line bg-asphalt sm:border-b-0 sm:border-r">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/e79-baile-felix.webp"
            alt="Drumul european E79 la intrarea în Băile Felix cu indicator de direcție spre Oradea"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt/90 via-asphalt/30 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-chalk">
            <span className="rounded bg-signal px-2 py-0.5 font-mono text-xs font-bold text-asphalt">
              PASUL 1 · ÎNSCRIERE
            </span>
            <p className="mt-1.5 font-cond text-lg font-bold leading-snug">
              Program adaptat categoriei alese
            </p>
            <p className="text-xs text-chalk/80">15 categorii europene · RO &amp; UE</p>
          </div>
        </div>
        <div className="p-4 text-xs">
          <p className="font-mono text-xs text-mute">DOSAR CANDIDAT</p>
          <p className="mt-1 font-cond text-lg font-bold text-asphalt">Categoria B — Autoturisme</p>
          <dl className="mt-3 space-y-2 border-t border-line pt-3">
            <div className="flex justify-between">
              <dt className="text-mute">Rezidență</dt>
              <dd className="font-mono font-semibold text-asphalt">România (UE)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mute">Chestionar oficial</dt>
              <dd className="font-mono font-semibold text-asphalt">26 întrebări · min. 22</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mute">Plată în</dt>
              <dd className="font-mono font-semibold text-asphalt">RON sau EUR</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-mute">Cont creat</dt>
              <dd className="inline-flex items-center gap-1 font-semibold text-ok">
                <CheckCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                Instantaneu
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Frame>
  );
}

export function KycStepMock() {
  return (
    <Frame title="permistart.ro/verificare-identitate">
      <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_1fr]">
        <div className="relative min-h-[210px] overflow-hidden border-b border-line bg-asphalt sm:border-b-0 sm:border-r">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/otopeni-intrare.webp"
            alt="Panouri rutiere și benzi de circulație pe DN1 spre Aeroportul Henri Coandă Otopeni"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt/90 via-asphalt/35 to-transparent" />
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1 rounded bg-asphalt/85 px-2 py-0.5 font-mono text-xs text-signal">
              <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Criptat AES-256 · GDPR
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 text-chalk">
            <p className="font-cond text-lg font-bold">Identitate verificată înainte de examen</p>
            <p className="text-xs text-chalk/80">Ștergere automată a fișierelor după 30 de zile.</p>
          </div>
        </div>
        <div className="p-4 text-xs">
          <p className="font-mono text-xs text-mute">PASUL 2 · VERIFICARE KYC</p>
          <div className="mt-2.5 space-y-2">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="flex items-center gap-1.5 font-semibold text-asphalt">
                <DocumentCheckIcon className="h-4 w-4 text-sign" aria-hidden="true" />
                Act de identitate (CI / Pașaport)
              </span>
              <span className="font-mono text-ok">Încărcat</span>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="flex items-center gap-1.5 font-semibold text-asphalt">
                <CameraIcon className="h-4 w-4 text-sign" aria-hidden="true" />
                Selfie de confirmare
              </span>
              <span className="font-mono text-ok">Validat</span>
            </div>
          </div>
          <p className="mt-3 text-mute">
            Confirmă că titularul înscris este aceeași persoană care susține examenul și primește atestatul nominal.
          </p>
        </div>
      </div>
    </Frame>
  );
}

export function PayMock() {
  const methods = [
    { label: "Card (Visa / Mastercard)", Icon: CreditCardIcon },
    { label: "Apple Pay", Icon: DevicePhoneMobileIcon },
    { label: "Google Pay", Icon: DevicePhoneMobileIcon },
    { label: "Transfer instant", Icon: BuildingLibraryIcon },
    { label: "Chitanță e-mail", Icon: EnvelopeIcon },
  ];
  return (
    <Frame>
      <div className="p-5 text-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-cond text-xl font-bold">Taxa categoriei alese</p>
            <p className="text-xs text-mute">Fără abonament · Plată integrală sau în 2–3 tranșe.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded border border-line bg-chalk px-2.5 py-1 font-mono text-xs font-semibold text-asphalt">
            <CreditCardIcon className="h-4 w-4 text-sign" aria-hidden="true" />
            RON / EUR
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 border-y border-line py-3.5 text-xs sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden="true" />
            <div>
              <p className="font-semibold text-asphalt">Tranșa 1 · Cursuri și teste</p>
              <p className="text-mute">Deblocate imediat după prima plată</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <LockClosedIcon className="mt-0.5 h-4 w-4 shrink-0 text-sign" aria-hidden="true" />
            <div>
              <p className="font-semibold text-asphalt">Sold final · Sala de examen</p>
              <p className="text-mute">Deblocat la achitarea integrală</p>
            </div>
          </div>
        </div>
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          {methods.map(({ label, Icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded border border-line bg-chalk px-2.5 py-1 text-xs font-medium text-asphalt"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-sign" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </Frame>
  );
}

export function ChapterMock() {
  return (
    <Frame title="permistart.ro/capitole/prioritati">
      <div className="p-4 text-sm">
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded bg-chalk px-2 py-1 text-mute">Rezumat</span>
          <span className="rounded bg-chalk px-2 py-1 text-mute">Curs</span>
          <span className="rounded bg-asphalt px-2 py-1 text-white">Test de capitol</span>
          <span className="ml-auto rounded border border-line px-2 py-1 text-mute">Ascultă lecția</span>
        </div>
        <p className="mb-2 font-semibold">Ce obligație îți impune acest indicator?</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[120px_1fr]">
          <SignSlot
            src="/media/cedeaza-helesteului.webp"
            alt="Indicatorul Cedează trecerea pe strada Heleșteului din București"
            className="aspect-[16/10] sm:aspect-square"
          />
          <div className="divide-y divide-line border-y border-line text-xs">
            {[
              "Să oprești întotdeauna",
              "Să acorzi prioritate vehiculelor din intersecție",
              "Să circuli cu prioritate",
            ].map((a, i) => (
              <div key={a} className={`px-2 py-2 ${i === 1 ? "bg-ok/10 font-semibold text-asphalt" : "text-mute"}`}>
                {a}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 border-t border-line pt-2.5 text-xs text-mute">
          Explicație: indicatorul cere să acorzi prioritate, nu neapărat să oprești dacă drumul este liber.
        </p>
      </div>
    </Frame>
  );
}

export function AdaptiveMock() {
  return (
    <Frame title="permistart.ro/evaluare-adaptiva">
      <div className="grid grid-cols-1 text-sm sm:grid-cols-[1.05fr_1fr]">
        <div className="relative min-h-[220px] overflow-hidden border-b border-line bg-asphalt sm:border-b-0 sm:border-r">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/bucuresti-ploaie.webp"
            alt="Bulevard din București după ploaie cu limitare de viteză 40 km/h și drum alunecos"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt/90 via-asphalt/25 to-transparent" />
          <div className="absolute left-3 top-3">
            <span className="rounded bg-signal px-2 py-0.5 font-mono text-xs font-bold text-asphalt">
              CAPITOL RECOMANDAT
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 text-chalk">
            <p className="font-mono text-xs text-signal">Viteză și condiții meteo</p>
            <p className="font-cond text-lg font-bold leading-snug">
              Carosabil umed + limitare temporară 40 km/h
            </p>
          </div>
        </div>
        <div className="p-4 text-xs">
          <p className="font-mono text-xs text-sign">REPETIȚIE SPAȚIATĂ</p>
          <p className="mt-1 font-cond text-lg font-bold text-asphalt">
            Întrebările se aleg după greșelile tale
          </p>
          <p className="mt-1.5 text-mute">
            Dacă ai ezitat la distanța de frânare pe ploaie sau la priorități în sensul giratoriu, motorul readuce
            situații similare până le stăpânești.
          </p>
          <div className="mt-3 space-y-1.5 border-t border-line pt-2.5">
            <div className="flex items-center justify-between">
              <span className="text-mute">Temă selectată</span>
              <span className="font-mono font-semibold text-asphalt">Aderență &amp; polei</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mute">Dificultate</span>
              <span className="font-mono font-semibold text-asphalt">Nivel 2 → 3</span>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function GlobalEvalMock() {
  return (
    <Frame title="permistart.ro/evaluare-globala">
      <div className="grid grid-cols-1 text-sm sm:grid-cols-[1.05fr_1fr]">
        <div className="relative min-h-[220px] overflow-hidden border-b border-line bg-asphalt sm:border-b-0 sm:border-r">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/chisineu-cris.webp"
            alt="Panou rutier de presemnalizare a direcțiilor în sensul giratoriu din Chișineu-Criș"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt/90 via-asphalt/25 to-transparent" />
          <div className="absolute left-3 top-3">
            <span className="rounded bg-ok px-2 py-0.5 font-mono text-xs font-bold text-chalk">
              SIMULARE COMPLETĂ
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 text-chalk">
            <p className="font-mono text-xs text-signal">Toate cele 6 capitole</p>
            <p className="font-cond text-lg font-bold leading-snug">
              26 de întrebări extrase din toată materia categoriei
            </p>
          </div>
        </div>
        <div className="p-4 text-xs">
          <p className="font-mono text-xs text-mute">PRAG DE DEBLOCARE EXAMEN</p>
          <p className="mt-1 font-cond text-lg font-bold text-asphalt">Pregătit pentru sala de examen</p>
          <dl className="mt-3 space-y-2 border-t border-line pt-2.5">
            <div className="flex justify-between">
              <dt className="text-mute">Scor simulare</dt>
              <dd className="font-mono font-semibold text-ok">24 / 26 corecte</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mute">Identitate KYC</dt>
              <dd className="font-mono font-semibold text-ok">Aprobată</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mute">Taxă categorie</dt>
              <dd className="font-mono font-semibold text-ok">Achitată integral</dd>
            </div>
          </dl>
        </div>
      </div>
    </Frame>
  );
}

export function ExamMock() {
  return (
    <div className="overflow-hidden rounded-lg border border-chalk/20 bg-[#10161f] text-chalk shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
      {/* Proctoring telemetry bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-chalk/15 bg-asphalt px-5 py-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-ok" aria-hidden="true" />
          <span className="font-mono font-semibold text-chalk">Cameră activă</span>
          <span className="text-chalk/40">·</span>
          <span className="font-mono text-chalk/75">Întrebarea 07 / 26</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded bg-chalk/10 px-2.5 py-1 font-mono text-xs text-chalk/90">
            <SpeakerWaveIcon className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            Audio activ
          </span>
          <span className="rounded bg-signal px-2.5 py-0.5 font-mono text-sm font-bold tabular-nums text-asphalt">
            00:18
          </span>
        </div>
      </div>

      {/* Per-question strict progress bar */}
      <div className="h-1 w-full bg-chalk/10">
        <div className="h-full w-[70%] bg-signal" />
      </div>

      {/* Question workspace */}
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-[155px_1fr]">
        <div className="overflow-hidden rounded border border-chalk/20 bg-asphalt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/stop-panoramio.webp"
            alt="Indicatorul Oprire (Stop) la marginea unui drum din România"
            loading="lazy"
            className="aspect-[4/3] h-full w-full object-cover sm:aspect-square"
          />
        </div>
        <div className="space-y-3">
          <p className="font-cond text-xl font-bold leading-snug text-chalk">
            Cum procedezi la această intersecție?
          </p>
          <div className="space-y-2 text-xs">
            {[
              "Oprești complet și acorzi prioritate",
              "Continui deplasarea fără să oprești",
              "Claxonezi și pătrunzi în intersecție",
            ].map((a, idx) => {
              const selected = idx === 0;
              return (
                <div
                  key={a}
                  className={`flex items-center gap-3 rounded border px-3 py-2.5 ${
                    selected
                      ? "border-signal bg-signal/15 font-semibold text-chalk"
                      : "border-chalk/15 bg-chalk/[0.03] text-chalk/75"
                  }`}
                >
                  <span
                    className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm font-mono text-xs font-bold ${
                      selected ? "bg-signal text-asphalt" : "bg-chalk/10 text-chalk/70"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{a}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Anti-cheat footer strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-chalk/15 bg-asphalt/70 px-5 py-2.5 font-mono text-xs text-chalk/65">
        <span>Fără întoarcere la întrebarea anterioară</span>
        <span className="text-signal/90">Ieșirea din filă se jurnalizează</span>
      </div>
    </div>
  );
}

export function CertMock() {
  return (
    <div className="relative overflow-hidden rounded border-2 border-asphalt bg-[#faf8f2] p-2.5 text-asphalt shadow-[0_18px_40px_rgba(24,32,43,0.14)]">
      {/* Subtle diagonal archival SPECIMEN watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid select-none place-items-center -rotate-12 font-cond text-6xl font-bold tracking-[0.22em] text-asphalt/[0.04]"
      >
        SPECIMEN
      </span>

      <div className="relative border border-asphalt/30 bg-[#fcfbf7]">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-asphalt bg-asphalt px-5 py-4 text-chalk">
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9 shrink-0" />
            <div>
              <p className="font-mono text-xs tracking-wider text-signal">REGISTRU DIGITAL · COD QR</p>
              <p className="font-cond text-xl font-bold leading-none text-chalk">ATESTAT DE REUȘITĂ</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-chalk/70">SERIE VERIFICABILĂ</p>
            <p className="font-mono text-sm font-bold tracking-wider text-signal">DR-CC7W-J5F7</p>
          </div>
        </div>

        {/* Certificate document body */}
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <p className="font-mono text-xs uppercase tracking-wider text-mute">Se certifică faptul că</p>
          <p className="mt-1 font-cond text-3xl font-bold tracking-tight text-asphalt sm:text-4xl">Andrei Popescu</p>
          <p className="mt-1.5 max-w-[48ch] text-xs leading-relaxed text-asphalt/85 sm:text-sm">
            a parcurs pregătirea teoretică pe capitole și a promovat examenul online supravegheat pentru{" "}
            <strong className="font-semibold text-asphalt">Categoria B — Autoturisme</strong>.
          </p>

          <dl className="mt-5 grid grid-cols-3 divide-x divide-asphalt/15 border-y border-asphalt/20 py-3 text-xs">
            <div className="pr-2 sm:pr-3">
              <dt className="text-mute">Scor obținut</dt>
              <dd className="mt-0.5 font-mono text-sm font-bold tabular-nums text-ok sm:text-base">24 / 26</dd>
            </div>
            <div className="px-2 sm:px-3">
              <dt className="text-mute">Rezultat</dt>
              <dd className="mt-0.5 font-mono text-xs font-bold text-asphalt sm:text-sm">ADMIS</dd>
            </div>
            <div className="pl-2 sm:pl-3">
              <dt className="text-mute">Data emiterii</dt>
              <dd className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-asphalt sm:text-sm">19.11.2026</dd>
            </div>
          </dl>

          {/* Bottom validation strip: Seal + Signature + Real scannable QR */}
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Official stamp/seal */}
              <svg viewBox="0 0 72 72" className="h-16 w-16 shrink-0 text-sign" aria-hidden="true">
                <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
                <circle cx="36" cy="36" r="25" fill="none" stroke="currentColor" strokeWidth="1.25" />
                <text x="36" y="31" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor" fontFamily="monospace">
                  PERMISTART
                </text>
                <line x1="16" y1="36" x2="56" y2="36" stroke="currentColor" strokeWidth="1" />
                <text x="36" y="46" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="currentColor" fontFamily="monospace">
                  VERIFICAT
                </text>
              </svg>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-asphalt">Emitere automată PDF · Semnătură digitală</p>
                <p className="max-w-[30ch] text-mute">
                  Document de pregătire PermiStart. Nu înlocuiește permisul de conducere oficial.
                </p>
              </div>
            </div>

            {/* Authentic scannable QR code pointing to https://permistart.ro/verificare/DR-CC7W-J5F7 */}
            <div className="shrink-0 text-center">
              <div className="inline-block rounded border border-asphalt/30 bg-white p-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 35 35"
                  shapeRendering="crispEdges"
                  className="h-20 w-20"
                  role="img"
                  aria-label="Cod QR verificare atestat DR-CC7W-J5F7"
                >
                  <path fill="#ffffff" d="M0 0h35v35H0z" />
                  <path
                    stroke="#18202b"
                    d="M1 1.5h7m5 0h1m1 0h2m2 0h3m2 0h1m2 0h7M1 2.5h1m5 0h1m2 0h1m1 0h2m2 0h1m1 0h1m2 0h5m1 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m2 0h4m1 0h4m1 0h2m2 0h2m1 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m3 0h1m4 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m2 0h5m2 0h2m1 0h1m2 0h1m3 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m1 0h7m2 0h2m1 0h1m2 0h1m2 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 8.5h4m1 0h1m2 0h5m2 0h1M1 9.5h1m2 0h1m1 0h2m1 0h1m1 0h1m2 0h4m2 0h1m1 0h1m2 0h2m1 0h1M1 10.5h1m1 0h1m1 0h1m2 0h4m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h4m3 0h2M2 11.5h1m1 0h1m1 0h3m2 0h3m3 0h2m1 0h4m4 0h2m1 0h1m1 0h1M1 12.5h1m2 0h3m2 0h1m2 0h1m2 0h2m1 0h1m2 0h1m3 0h1m1 0h1m1 0h2m1 0h2M1 13.5h1m2 0h1m1 0h5m5 0h1m7 0h3m3 0h1m2 0h1M2 14.5h1m1 0h1m3 0h3m2 0h1m2 0h3m3 0h3m1 0h3m2 0h3M1 15.5h1m1 0h1m1 0h1m1 0h2m1 0h1m1 0h4m5 0h1m2 0h4m1 0h1m2 0h1M4 16.5h3m2 0h2m2 0h1m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h2m1 0h3M2 17.5h2m1 0h1m1 0h3m3 0h3m2 0h1m1 0h1m1 0h4m1 0h1m1 0h4M1 18.5h2m1 0h2m4 0h1m6 0h1m4 0h1m1 0h2m2 0h1m1 0h1m1 0h1M3 19.5h2m2 0h3m1 0h1m2 0h2m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m3 0h1m1 0h1M1 20.5h1m3 0h2m2 0h7m2 0h5m5 0h1m3 0h1M1 21.5h1m1 0h1m3 0h1m5 0h1m3 0h4m2 0h2m2 0h1m4 0h1M2 22.5h1m1 0h3m4 0h1m1 0h1m2 0h8m2 0h1m1 0h2m1 0h3M1 23.5h3m2 0h2m2 0h2m4 0h1m4 0h1m3 0h3m3 0h1m1 0h1M2 24.5h3m1 0h1m2 0h1m1 0h1m3 0h1m1 0h1m1 0h1m2 0h2m2 0h4m1 0h3M1 25.5h1m1 0h2m1 0h3m1 0h1m2 0h6m1 0h3m2 0h7m1 0h1M9 26.5h2m3 0h1m4 0h2m4 0h1m3 0h2m2 0h1M1 27.5h7m2 0h2m1 0h3m6 0h1m2 0h1m1 0h1m1 0h4M1 28.5h1m5 0h1m1 0h4m2 0h2m3 0h2m3 0h1m3 0h1m2 0h2M1 29.5h1m1 0h3m1 0h1m3 0h1m3 0h3m2 0h1m2 0h1m1 0h6m1 0h2M1 30.5h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h1m1 0h1m3 0h3m1 0h1m2 0h1m1 0h4M1 31.5h1m1 0h3m1 0h1m5 0h1m1 0h1m2 0h2m2 0h4m3 0h3m1 0h1M1 32.5h1m5 0h1m5 0h2m1 0h3m3 0h4m4 0h1M1 33.5h7m1 0h2m1 0h3m2 0h1m3 0h2m3 0h1m2 0h4"
                  />
                </svg>
              </div>
              <p className="mt-1 font-mono text-xs text-mute">Scanează pentru verificare</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

