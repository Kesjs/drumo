import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { NoticeBox, Panel, StatusTag } from "@/components/ui/primitives";
import { requireCandidateSnapshot } from "@/lib/data/require-user";
import { getExamResultView } from "@/lib/data/store";
import { CheckCircle2, XCircle } from "lucide-react";

export const metadata = { title: "Rezultat examen" };
export const dynamic = "force-dynamic";

export default async function ExamResultPage({ params }: { params: Promise<{ sesiune: string }> }) {
  const { sesiune } = await params;
  const snap = await requireCandidateSnapshot(`/examen/rezultat/${sesiune}`);
  const result = await getExamResultView(snap.user.id, sesiune);
  if (!result) notFound();

  const { session, certificate, integrity, breakdown } = result;
  const passed = Boolean(session.passed);

  return (
    <AppShell
      userName={`${snap.user.first_name} ${snap.user.last_name}`}
      categoryCode={snap.category.code}
      role={snap.user.role}
      coursesUnlocked={snap.access.coursesUnlocked}
      examUnlocked={snap.access.examUnlocked}
    >
      <div className="max-w-3xl space-y-6">
        <Panel strong>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-mute">REZULTAT IMEDIAT · CATEGORIA {snap.category.code}</p>
              <h1 className="mt-1 font-cond text-4xl font-bold">
                {passed ? "Admis" : "Respins"} —{" "}
                <span className="font-mono tabular-nums">
                  {session.score} / {session.question_ids.length}
                </span>
              </h1>
              <p className="mt-1 text-xs text-mute">Prag minim: {session.pass_mark} răspunsuri corecte.</p>
            </div>
            <StatusTag tone={passed ? "ok" : "danger"}>{passed ? "ADMIS" : "RESPINS"}</StatusTag>
          </div>

          {certificate ? (
            <div className="mt-5 rounded border border-asphalt bg-chalk p-4 text-sm">
              <p className="font-semibold text-asphalt">
                Atestat programat: <span className="font-mono">{certificate.public_code}</span>
              </p>
              <p className="mt-1 text-xs text-mute">
                {certificate.status === "held"
                  ? "Trimiterea este reținută temporar pentru verificare de securitate."
                  : "Va fi trimis automat pe e-mail în cel mult 3 zile."}
              </p>
              <Link
                href="/atestat"
                className="mt-3 inline-flex min-h-[40px] items-center rounded border-2 border-asphalt bg-signal px-4 text-xs font-semibold text-asphalt"
              >
                Vezi atestatul și codul QR
              </Link>
            </div>
          ) : null}
        </Panel>

        <Panel>
          <h2 className="font-cond text-2xl font-bold">Raport integritate și alerte de securitate</h2>
          {integrity.alerts.length === 0 ? (
            <p className="mt-2 text-sm text-ok">Nicio alertă înregistrată pe durata sesiunii.</p>
          ) : (
            <NoticeBox tone={integrity.holdCertificate ? "error" : "warning"} className="mt-3">
              <ul className="list-disc space-y-1 pl-4 text-xs">
                {integrity.alerts.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </NoticeBox>
          )}
        </Panel>

        <section className="space-y-4">
          <h2 className="font-cond text-2xl font-bold">Bilanț întrebare cu întrebare</h2>
          {breakdown.map((item) => (
            <Panel key={item.idx} className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">
                  {item.idx + 1}. {item.stem_ro}
                </p>
                {item.correct ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-ok" />
                ) : (
                  <XCircle className="h-5 w-5 shrink-0 text-danger" />
                )}
              </div>
              <p className="text-xs text-mute">
                Răspunsul tău:{" "}
                <strong className="font-mono text-asphalt">
                  {item.chosen.length ? item.chosen.join(", ") : item.timed_out ? "Timp expirat" : "—"}
                </strong>{" "}
                · Corect: <strong className="font-mono text-ok">{item.correctLabels.join(", ")}</strong>
              </p>
              <p className="rounded bg-chalk p-3 text-xs text-asphalt">{item.explanation_ro}</p>
            </Panel>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
