"use client";
import { ReactNode } from "react";
import { QrCode } from "lucide-react";

export function Frame({
  children,
  title = "drumo.ro/tablou-de-bord",
  className = "",
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div
      data-impeccable-ignore="hard-offset-shadow"
      className={`overflow-hidden rounded-lg border-2 border-asphalt bg-white shadow-[8px_8px_0_#f2b705] ${className}`}
    >
      <div className="flex items-center gap-2 border-b-2 border-asphalt bg-chalk px-3 py-2">
        <span className="inline-flex h-5 items-center rounded-sm bg-asphalt px-1.5 font-cond text-xs font-bold text-signal">
          DR
        </span>
        <span className="truncate font-mono text-xs text-asphalt">{title}</span>
        <span className="ml-auto font-mono text-xs text-mute">exemplu</span>
      </div>
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

const chapters = [
  { n: "Semne de circulație", p: 100 },
  { n: "Priorități", p: 72 },
  { n: "Viteză și condiții meteo", p: 35 },
  { n: "Distanțe de siguranță", p: 0 },
  { n: "Prim ajutor", p: 0 },
];

export function DashboardMock() {
  return (
    <Frame>
      <div className="grid grid-cols-1 text-sm sm:grid-cols-[175px_1fr]">
        <aside className="border-b border-line bg-chalk p-3 sm:border-b-0 sm:border-r">
          <p className="mb-2 font-mono text-xs text-mute">Categoria B</p>
          {chapters.map((c, i) => (
            <div
              key={c.n}
              className={`mb-1 rounded px-2 py-1.5 text-xs ${i === 1 ? "bg-asphalt text-white" : "text-mute"}`}
            >
              {c.n}
            </div>
          ))}
          <div className="mt-3 rounded border border-line bg-white px-2 py-1.5 text-xs text-mute">
            Evaluare globală
          </div>
          <div className="mt-1 rounded border border-line bg-white px-2 py-1.5 text-xs text-mute">
            Examen <span className="ml-1 rounded bg-line px-1 text-xs">blocat</span>
          </div>
        </aside>
        <div className="p-4">
          <p className="font-cond text-lg font-bold">Capitolul 2 · Priorități</p>
          <p className="mb-3 text-xs text-mute">Rezumat · Curs · Test de capitol</p>
          <div className="mb-3 border-y border-line py-2.5">
            <p className="mb-1 text-xs font-semibold">Pregătirea ta</p>
            <Bar value={58} />
            <p className="mt-1 text-xs text-mute">Îți recomandăm încă 8 întrebări din acest capitol.</p>
          </div>
          <div className="grid grid-cols-[1fr_92px] gap-3">
            <div className="space-y-2">
              {chapters.slice(0, 3).map((c) => (
                <div key={c.n}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{c.n}</span>
                    <span className="font-mono tabular-nums">{c.p}%</span>
                  </div>
                  <Bar value={c.p} color={c.p === 100 ? "bg-ok" : "bg-signal"} />
                </div>
              ))}
            </div>
            <SignSlot
              src="/media/cedeaza-popa-tatu.webp"
              alt="Indicatorul Cedează trecerea pe strada Popa Tatu din București"
              className="aspect-square"
            />
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function PayMock() {
  return (
    <Frame title="drumo.ro/plata">
      <div className="p-4 text-sm">
        <p className="font-cond text-lg font-bold">Taxa categoriei alese</p>
        <p className="mb-3 text-xs text-mute">Plătești integral sau în tranșe.</p>
        <Bar value={60} color="bg-sign" />
        <div className="mt-2 flex justify-between text-xs tabular-nums">
          <span>Plătit 60% (exemplu)</span>
          <span className="text-mute">Rest 40% (exemplu)</span>
        </div>
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between rounded bg-chalk px-2 py-1.5">
            <span>Cursuri și teste</span>
            <span className="font-semibold text-ok">Deblocate</span>
          </div>
          <div className="flex items-center justify-between rounded bg-chalk px-2 py-1.5">
            <span>Examen</span>
            <span className="font-semibold text-mute">După plata integrală</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function ChapterMock() {
  return (
    <Frame title="drumo.ro/capitole/prioritati">
      <div className="p-4 text-sm">
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded bg-chalk px-2 py-1 text-mute">Rezumat</span>
          <span className="rounded bg-chalk px-2 py-1 text-mute">Curs</span>
          <span className="rounded bg-asphalt px-2 py-1 text-white">Test de capitol</span>
          <span className="ml-auto rounded border border-line px-2 py-1 text-mute">Ascultă lecția</span>
        </div>
        <p className="mb-2 font-semibold">Ce obligație îți impune acest indicator?</p>
        <div className="grid grid-cols-[110px_1fr] gap-3">
          <SignSlot
            src="/media/cedeaza-popa-tatu.webp"
            alt="Indicatorul Cedează trecerea"
            className="aspect-square"
          />
          <div className="space-y-1.5 text-xs">
            {[
              "Să oprești întotdeauna",
              "Să acorzi prioritate vehiculelor din intersecție",
              "Să circuli cu prioritate",
            ].map((a, i) => (
              <div key={a} className={`rounded border px-2 py-1.5 ${i === 1 ? "border-ok bg-ok/10" : "border-line"}`}>
                {a}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 rounded bg-chalk p-2 text-xs text-mute">
          Explicație: indicatorul cere să acorzi prioritate, nu neapărat să oprești dacă drumul este liber.
        </p>
      </div>
    </Frame>
  );
}

export function AdaptiveMock() {
  const rows = [
    ["Semne de circulație", 92],
    ["Priorități", 58],
    ["Viteză și condiții meteo", 41],
    ["Prim ajutor", 77],
  ] as const;
  return (
    <Frame title="drumo.ro/evaluare-adaptiva">
      <div className="p-4 text-sm">
        <p className="font-cond text-lg font-bold">Evaluare adaptivă</p>
        <p className="mb-3 text-xs text-mute">Următoarele întrebări se aleg după greșelile tale.</p>
        <div className="space-y-2">
          {rows.map(([n, v]) => (
            <div key={n}>
              <div className="mb-1 flex justify-between text-xs">
                <span>{n}</span>
                <span className="font-mono tabular-nums">{v}%</span>
              </div>
              <Bar value={v} color={v < 60 ? "bg-signal" : "bg-ok"} />
            </div>
          ))}
        </div>
        <p className="mt-3 rounded bg-signal/20 p-2 text-xs">
          Următorul set: Viteză și condiții meteo (8 întrebări).
        </p>
      </div>
    </Frame>
  );
}

export function ExamMock() {
  return (
    <Frame title="drumo.ro/examen/sala">
      <div className="text-sm">
        <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs">
          <span>Întrebarea 7 din 26</span>
          <span className="rounded bg-ok/15 px-2 py-0.5 font-semibold text-ok">Cameră activă</span>
          <span className="font-mono text-2xl font-medium tabular-nums">18</span>
        </div>
        <div className="h-1.5 bg-line">
          <div className="h-full w-[72%] bg-signal" />
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-3 p-4">
          <SignSlot src="/media/stop-axente-sever.webp" alt="Indicatorul Stop în Axente Sever" className="aspect-square" />
          <div className="space-y-1.5 text-xs">
            <p className="font-semibold">Cum procedezi la această intersecție?</p>
            {["Oprești și acorzi prioritate", "Continui fără să oprești", "Claxonezi și treci"].map((a) => (
              <div key={a} className="rounded border border-line px-2 py-1.5">
                {a}
              </div>
            ))}
          </div>
        </div>
        <p className="mx-4 mb-4 rounded bg-chalk p-2 text-xs text-mute">
          Fără întoarcere la întrebarea anterioară. Ieșirea din pagină se înregistrează.
        </p>
      </div>
    </Frame>
  );
}

export function CertMock() {
  return (
    <Frame title="drumo.ro/verificare/DR-0000-0000">
      <div className="relative p-4 text-sm">
        <p className="font-cond text-lg font-bold">Atestat de reușită Drumo</p>
        <dl className="mt-2 grid grid-cols-[90px_1fr] gap-y-1 text-xs">
          <dt className="text-mute">Candidat</dt>
          <dd className="font-mono">Andrei P.</dd>
          <dt className="text-mute">Categorie</dt>
          <dd className="font-mono">B</dd>
          <dt className="text-mute">Scor</dt>
          <dd className="font-mono tabular-nums">24 / 26</dd>
          <dt className="text-mute">Nr.</dt>
          <dd className="font-mono">DR-0000-0000</dd>
        </dl>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="max-w-[60%] text-xs text-mute">
            Trimis automat pe e-mail în maximum 3 zile de la examen.
          </p>
          <div className="grid h-16 w-16 place-items-center rounded border border-asphalt/30 bg-chalk text-asphalt">
            <QrCode className="h-10 w-10" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Frame>
  );
}
