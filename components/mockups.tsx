"use client";
import { ReactNode } from "react";
import {
  QrCodeIcon,
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
      className={`overflow-hidden rounded border border-line bg-white shadow-lift ${className}`}
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
    <Frame title="permisstart.ro/inscriere">
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
            <p className="text-xs text-chalk/80">10 categorii disponibile · RO &amp; UE</p>
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
              <dt className="text-mute">Monedă plată</dt>
              <dd className="font-mono font-semibold text-asphalt">RON sau EUR</dd>
            </div>
          </dl>
            <div className="flex items-center justify-between">
              <dt className="text-mute">Cont creat</dt>
              <dd className="inline-flex items-center gap-1 font-semibold text-ok">
                <CheckCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                Instantaneu
              </dd>
            </div>
        </div>
      </div>
    </Frame>
  );
}

export function KycStepMock() {
  return (
    <Frame title="permisstart.ro/verificare-identitate">
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
    <Frame title="permisstart.ro/capitole/prioritati">
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
    <Frame title="permisstart.ro/evaluare-adaptiva">
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
    <Frame title="permisstart.ro/evaluare-globala">
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
    <Frame title="permisstart.ro/examen/sala">
      <div className="text-sm">
        <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs">
          <span>Întrebarea 7 din 26</span>
          <span className="rounded bg-ok/15 px-2 py-0.5 font-semibold text-ok">Cameră activă</span>
          <span className="font-mono text-2xl font-medium tabular-nums">18</span>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-[120px_1fr]">
          <SignSlot src="/media/stop-panoramio.webp" alt="Indicatorul Oprire (Stop) la marginea unui drum din România" className="aspect-[16/10] sm:aspect-square" />
          <div className="space-y-1.5 text-xs">
            <p className="font-semibold">Cum procedezi la această intersecție?</p>
            <div className="divide-y divide-line border-y border-line">
              {["Oprești și acorzi prioritate", "Continui fără să oprești", "Claxonezi și treci"].map((a) => (
                <div key={a} className="px-2 py-2 text-asphalt">
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mx-4 mb-4 border-t border-line pt-2.5 text-xs text-mute">
          Fără întoarcere la întrebarea anterioară. Ieșirea din pagină se înregistrează.
        </p>
      </div>
    </Frame>
  );
}

export function CertMock() {
  return (
    <Frame>
      <div className="bg-[#fcfcf9] text-sm">
        {/* Official paper certificate header */}
        <div className="flex items-center justify-between gap-3 border-b-2 border-asphalt bg-asphalt px-5 py-3.5 text-chalk">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-7 items-center rounded-sm bg-signal px-2 font-cond text-sm font-bold tracking-tight text-asphalt">
              PermisStart
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-signal">Document verificabil QR</p>
              <p className="font-cond text-lg font-bold leading-none text-chalk">ATESTAT DE REUȘITĂ</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-chalk/70">SERIE UNICĂ</p>
            <p className="font-mono text-xs font-bold tracking-wider text-signal">DR-0000-0000</p>
          </div>
        </div>

        {/* Paper body */}
        <div className="px-5 py-5">
          <p className="text-xs text-mute">Se confirmă prin prezentul document că</p>
          <p className="mt-1 font-cond text-3xl font-bold tracking-tight text-asphalt">Andrei Popescu</p>
          <p className="mt-1 text-xs leading-relaxed text-asphalt">
            a finalizat pregătirea teoretică și a promovat examenul supravegheat pentru{" "}
            <strong className="font-semibold">Categoria B — Autoturisme</strong>.
          </p>

          {/* Key verification metrics */}
          <dl className="mt-4 grid grid-cols-3 divide-x divide-line border-y border-line py-3 text-xs">
            <div className="pr-3">
              <dt className="text-mute">Scor obținut</dt>
              <dd className="mt-0.5 font-mono text-base font-bold tabular-nums text-ok">24 / 26</dd>
            </div>
            <div className="px-3">
              <dt className="text-mute">Rezultat</dt>
              <dd className="mt-0.5 font-mono text-sm font-bold text-asphalt">ADMIS</dd>
            </div>
            <div className="pl-3">
              <dt className="text-mute">Emis la</dt>
              <dd className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-asphalt">19.11.2026</dd>
            </div>
          </dl>

          {/* Footer: Seal + legal status + QR */}
          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 64 64"
                className="h-14 w-14 shrink-0 text-sign"
                aria-hidden="true"
              >
                <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
                <circle cx="32" cy="32" r="23" fill="none" stroke="currentColor" strokeWidth="1.25" />
                <text x="32" y="29" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="currentColor" fontFamily="monospace">
                  DRUMO
                </text>
                <text x="32" y="40" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="currentColor" fontFamily="monospace">
                  VERIFICAT
                </text>
              </svg>
              <div className="space-y-1 text-xs leading-snug text-mute">
                <p className="font-semibold text-asphalt">Semnătură electronică &amp; registru public</p>
                <p>Atestat de reușită PermisStart · Nu este permis de conducere oficial.</p>
              </div>
            </div>

            <div className="shrink-0 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded border border-asphalt bg-white p-1.5 text-asphalt">
                <QrCodeIcon className="h-12 w-12" aria-hidden="true" />
              </div>
              <p className="mt-1 font-mono text-xs text-mute">permisstart.ro/verificare</p>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

