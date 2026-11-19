"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, NoticeBox, Panel, ProgressMeter, StatusTag } from "@/components/ui/primitives";
import { RealPhoto } from "@/components/real-photo";
import { CheckCircle2, XCircle } from "lucide-react";

interface SanitizedQuestion {
  id: string;
  chapter_id: string;
  chapter_title: string;
  difficulty: number;
  stem_ro: string;
  media_slug?: string;
  multi: boolean;
  options: Array<{ label: "A" | "B" | "C" | "D"; body_ro: string }>;
}

interface AnswerFeedback {
  correct: boolean;
  correctLabels: string[];
  explanation_ro: string;
  legal_ref?: string;
  finished: boolean;
  score: number | null;
  total: number;
  readiness: number | null;
}

export function PracticeRunner({
  kind,
  chapterSlug,
  title,
  subtitle,
  readinessThreshold,
}: {
  kind: "chapter" | "adaptive" | "global";
  chapterSlug?: string;
  title: string;
  subtitle: string;
  readinessThreshold?: number;
}) {
  const router = useRouter();
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<SanitizedQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  async function startNew() {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setChosen([]);
    setIdx(0);
    setCorrectCount(0);
    try {
      const res = await fetch("/api/practice/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, chapterSlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Nu am putut porni evaluarea.");
      } else {
        setAttemptId(data.attempt.id);
        setQuestions(data.questions);
        questionStartRef.current = Date.now();
      }
    } catch {
      setError("Eroare de rețea.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    startNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, chapterSlug]);

  const current = questions[idx];

  function toggleOption(label: string) {
    if (feedback) return;
    if (!current?.multi) {
      setChosen([label]);
    } else {
      setChosen((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));
    }
  }

  async function submitAnswer() {
    if (!attemptId || !current || chosen.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/practice/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          questionId: current.id,
          chosen,
          msTaken: Date.now() - questionStartRef.current,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Răspunsul nu a putut fi verificat.");
      } else {
        if (data.correct) setCorrectCount((c) => c + 1);
        setFeedback(data);
        if (data.finished) router.refresh();
      }
    } catch {
      setError("Eroare de rețea.");
    } finally {
      setSubmitting(false);
    }
  }

  function nextQuestion() {
    setIdx((i) => i + 1);
    setChosen([]);
    setFeedback(null);
    questionStartRef.current = Date.now();
  }

  if (loading) {
    return (
      <Panel>
        <p className="text-sm text-mute">Se pregătesc întrebările...</p>
      </Panel>
    );
  }

  if (error) {
    return <NoticeBox tone="error">{error}</NoticeBox>;
  }

  if (!current) {
    return (
      <Panel>
        <p className="text-sm text-mute">Nu există întrebări disponibile pentru acest filtru.</p>
      </Panel>
    );
  }

  const finished = Boolean(feedback?.finished);
  const progressPct = Math.round(((idx + (feedback ? 1 : 0)) / questions.length) * 100);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="font-cond text-3xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-mute">{subtitle}</p>
        </div>
        <span className="font-mono text-sm font-medium tabular-nums">
          Întrebarea {idx + 1} / {questions.length}
        </span>
      </div>

      <ProgressMeter value={progressPct} label="Progres test" />

      <Panel strong className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-mute">
          <span>{current.chapter_title}</span>
          <span className="font-mono">
            Dificultate {current.difficulty}/5 · {current.multi ? "Răspuns multiplu" : "Un singur răspuns"}
          </span>
        </div>

        <p className="text-lg font-semibold leading-snug text-asphalt">{current.stem_ro}</p>

        {current.media_slug ? <RealPhoto slug={current.media_slug} className="max-w-md aspect-[4/3]" /> : null}

        <div className="space-y-2.5">
          {current.options.map((opt) => {
            const isSelected = chosen.includes(opt.label);
            const isRight = feedback?.correctLabels.includes(opt.label);
            const stateClass = feedback
              ? isRight
                ? "border-ok bg-ok/10"
                : isSelected
                  ? "border-danger bg-danger/10"
                  : "border-line bg-surface"
              : isSelected
                ? "border-asphalt bg-signal/20"
                : "border-line bg-surface hover:border-asphalt/50";

            return (
              <button
                key={opt.label}
                type="button"
                disabled={Boolean(feedback)}
                onClick={() => toggleOption(opt.label)}
                className={`flex min-h-[48px] w-full items-start gap-3 rounded border-2 px-4 py-3 text-left text-sm transition-colors ${stateClass}`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-asphalt font-mono text-xs font-bold">
                  {opt.label}
                </span>
                <span className="flex-1">{opt.body_ro}</span>
              </button>
            );
          })}
        </div>

        {feedback ? (
          <div className="space-y-4 rounded-lg border border-asphalt bg-chalk p-4">
            <div className="flex items-center gap-2 font-semibold">
              {feedback.correct ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-ok" />
                  <span className="text-ok">Răspuns corect</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-danger" />
                  <span className="text-danger">
                    Răspuns incorect (varianta corectă: {feedback.correctLabels.join(", ")})
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-asphalt">{feedback.explanation_ro}</p>
            {feedback.legal_ref ? <p className="font-mono text-xs text-mute">Bază legală: {feedback.legal_ref}</p> : null}
          </div>
        ) : null}

        {!feedback ? (
          <Button type="button" onClick={submitAnswer} disabled={chosen.length === 0 || submitting}>
            {submitting ? "Se verifică..." : "Verifică răspunsul"}
          </Button>
        ) : !finished ? (
          <Button type="button" onClick={nextQuestion}>
            Întrebarea următoare →
          </Button>
        ) : (
          <div className="space-y-4 border-t border-line pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-cond text-2xl font-bold">
                  Sesiune finalizată: {feedback.score ?? correctCount} / {feedback.total}
                </p>
                {feedback.readiness !== null ? (
                  <p className="mt-1 text-sm text-mute">
                    Scor de pregătire calculat:{" "}
                    <strong className="font-mono text-asphalt">{feedback.readiness}%</strong>{" "}
                    {readinessThreshold ? `(prag necesar examen: ${readinessThreshold}%)` : ""}
                  </p>
                ) : null}
              </div>
              {feedback.readiness !== null && readinessThreshold ? (
                <StatusTag tone={feedback.readiness >= readinessThreshold ? "ok" : "signal"}>
                  {feedback.readiness >= readinessThreshold ? "Pregătire atinsă" : "Continuă exersarea"}
                </StatusTag>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={startNew}>
                Generează o sesiune nouă
              </Button>
              <Link
                href="/tablou-de-bord"
                className="inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-5 text-sm font-semibold text-asphalt"
              >
                Înapoi la tabloul de bord
              </Link>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
