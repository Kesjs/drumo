"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, NoticeBox, Panel } from "@/components/ui/primitives";
import { RealPhoto } from "@/components/real-photo";
import { AlertTriangle, Camera, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface ExamQuestionView {
  id: string;
  chapter_title: string;
  stem_ro: string;
  media_slug?: string;
  multi: boolean;
  options: Array<{ label: "A" | "B" | "C" | "D"; body_ro: string }>;
}

interface ExamStatePayload {
  session: {
    id: string;
    status: "briefing" | "in_progress" | "finished" | "aborted";
    current_index: number;
    total_questions: number;
    question_deadline: number | null;
    seconds_per_question: number;
    security_count: number;
  };
  question: ExamQuestionView | null;
  serverNow: number;
}

export function ExamRoomClient({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<ExamStatePayload | null>(null);
  const [chosen, setChosen] = useState<string[]>([]);
  const [remainingSec, setRemainingSec] = useState<number>(60);
  const [muted, setMuted] = useState(false);
  const [securityBanner, setSecurityBanner] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const blurStartRef = useRef<number | null>(null);
  const deadlineRef = useRef<number | null>(null);
  const autoSubmittedIdxRef = useRef<number>(-1);
  const currentIdxRef = useRef<number>(0);

  const logEvent = useCallback(
    async (type: string, durationMs?: number) => {
      try {
        await fetch(`/api/exam/${encodeURIComponent(sessionId)}/event`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            questionIndex: currentIdxRef.current,
            durationMs,
          }),
        });
      } catch {
        // best-effort logging
      }
    },
    [sessionId],
  );

  const speakQuestion = useCallback(
    (q: ExamQuestionView | null, isMuted: boolean) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      if (!q || isMuted) return;
      const text = `${q.stem_ro}. ${q.options.map((o) => `Varianta ${o.label}: ${o.body_ro}`).join(". ")}`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ro-RO";
      utter.rate = 0.96;
      const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("ro"));
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    },
    [],
  );

  const loadRoom = useCallback(async () => {
    const res = await fetch(`/api/exam/${encodeURIComponent(sessionId)}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { ok: boolean } & ExamStatePayload;
    if (data.session.status === "finished") {
      router.replace(`/examen/rezultat/${sessionId}`);
      return;
    }
    const offset = data.serverNow - Date.now();
    deadlineRef.current = data.session.question_deadline ? data.session.question_deadline - offset : null;
    currentIdxRef.current = data.session.current_index;
    setState(data);
    setChosen([]);
    speakQuestion(data.question, muted);
  }, [sessionId, router, muted, speakQuestion]);

  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  // Continuous camera stream + monitor track ending
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
        setCameraActive(true);
        const track = s.getVideoTracks()[0];
        track?.addEventListener("ended", () => {
          setCameraActive(false);
          setSecurityBanner("Camera a fost întreruptă. Evenimentul a fost înregistrat.");
          logEvent("camera_lost");
        });
      })
      .catch(() => {
        setCameraActive(false);
        setSecurityBanner("Accesul la cameră este oprit. Evenimentul a fost înregistrat.");
        logEvent("camera_lost");
      });

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [logEvent]);

  // Focus / tab-visibility / copy-paste anti-cheat listeners
  useEffect(() => {
    function onVisChange() {
      if (document.hidden) {
        blurStartRef.current = Date.now();
        setSecurityBanner("Ai părăsit fila examenului. Ieșirea este înregistrată în jurnal.");
      } else if (blurStartRef.current) {
        logEvent("tab_hidden", Date.now() - blurStartRef.current);
        blurStartRef.current = null;
      }
    }
    function onBlur() {
      if (!blurStartRef.current) blurStartRef.current = Date.now();
      setSecurityBanner("Fereastra a pierdut focusul. Ieșirea este înregistrată.");
    }
    function onFocus() {
      if (blurStartRef.current && !document.hidden) {
        logEvent("blur", Date.now() - blurStartRef.current);
        blurStartRef.current = null;
      }
    }
    function onCopy(e: ClipboardEvent) {
      e.preventDefault();
      setSecurityBanner("Copierea nu este permisă în timpul examenului.");
      logEvent("copy");
    }
    function onContext(e: MouseEvent) {
      e.preventDefault();
      logEvent("context_menu");
    }

    document.addEventListener("visibilitychange", onVisChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("copy", onCopy);
    document.addEventListener("contextmenu", onContext);

    return () => {
      document.removeEventListener("visibilitychange", onVisChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("contextmenu", onContext);
    };
  }, [logEvent]);

  const submitCurrent = useCallback(
    async (answersToSend: string[]) => {
      if (!state || submitting) return;
      setSubmitting(true);
      try {
        const res = await fetch(`/api/exam/${encodeURIComponent(sessionId)}/answer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ index: state.session.current_index, chosen: answersToSend }),
        });
        const data = await res.json();
        if (data.finished) {
          router.replace(`/examen/rezultat/${sessionId}`);
          return;
        }
        await loadRoom();
      } finally {
        setSubmitting(false);
      }
    },
    [state, submitting, sessionId, router, loadRoom],
  );

  // Strict per-question countdown & auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      if (!deadlineRef.current || !state) return;
      const ms = Math.max(0, deadlineRef.current - Date.now());
      const sec = Math.ceil(ms / 1000);
      setRemainingSec(sec);
      if (ms <= 0 && autoSubmittedIdxRef.current !== state.session.current_index) {
        autoSubmittedIdxRef.current = state.session.current_index;
        submitCurrent(chosen);
      }
    }, 250);
    return () => clearInterval(id);
  }, [state, chosen, submitCurrent]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    if (next && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    } else if (!next && state?.question) {
      speakQuestion(state.question, false);
    }
  }

  function toggleOption(label: string) {
    if (!state?.question) return;
    if (!state.question.multi) setChosen([label]);
    else setChosen((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));
  }

  if (!state || !state.question) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <Panel>
          <p className="text-sm text-mute">Se încarcă sala de examen...</p>
        </Panel>
      </div>
    );
  }

  const { session, question } = state;
  const pctTime = Math.max(0, Math.min(100, Math.round((remainingSec / session.seconds_per_question) * 100)));

  return (
    <div className="min-h-screen bg-chalk text-asphalt">
      <header className="border-b-2 border-asphalt bg-surface">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm font-semibold tabular-nums">
              Întrebarea {session.current_index + 1} / {session.total_questions}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-0.5 text-xs font-semibold ${
                cameraActive ? "border-ok/40 bg-ok/10 text-ok" : "border-danger bg-danger/10 text-danger"
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>{cameraActive ? "Cameră activă" : "Cameră întreruptă"}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => speakQuestion(question, false)}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-line bg-chalk px-3 text-xs font-semibold hover:bg-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reascultă</span>
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-line bg-chalk px-3 text-xs font-semibold hover:bg-white"
            >
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span>{muted ? "Fără sunet" : "Audio"}</span>
            </button>
            <span
              aria-live="polite"
              className={`ml-2 font-mono text-2xl font-bold tabular-nums ${
                remainingSec <= 10 ? "text-danger" : "text-asphalt"
              }`}
            >
              {remainingSec}s
            </span>
          </div>
        </div>
        <div className="h-2 w-full bg-line">
          <div
            className={`h-full transition-[width] duration-200 ${remainingSec <= 10 ? "bg-danger" : "bg-signal"}`}
            style={{ width: `${pctTime}%` }}
          />
        </div>
      </header>

      <main className="mx-auto grid max-w-4xl gap-6 px-5 py-8 lg:grid-cols-[1fr_200px]">
        <div className="space-y-5">
          {securityBanner ? (
            <NoticeBox tone="error">
              <span className="inline-flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {securityBanner}
              </span>
            </NoticeBox>
          ) : null}

          <Panel strong className="space-y-5">
            <p className="font-mono text-xs text-mute">
              {question.chapter_title} · {question.multi ? "Alege una sau mai multe variante" : "Un singur răspuns"}
            </p>
            <h1 className="text-xl font-semibold leading-snug text-asphalt">{question.stem_ro}</h1>

            {question.media_slug ? <RealPhoto slug={question.media_slug} className="max-w-md aspect-[4/3]" priority /> : null}

            <div className="space-y-2.5">
              {question.options.map((opt) => {
                const selected = chosen.includes(opt.label);
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => toggleOption(opt.label)}
                    className={`flex min-h-[52px] w-full items-start gap-3 rounded border-2 px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? "border-asphalt bg-signal/25 font-medium"
                        : "border-line bg-surface hover:border-asphalt/50"
                    }`}
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-asphalt font-mono text-xs font-bold">
                      {opt.label}
                    </span>
                    <span className="flex-1">{opt.body_ro}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="text-xs text-mute">Fără întoarcere la întrebarea anterioară.</p>
              <Button type="button" size="lg" onClick={() => submitCurrent(chosen)} disabled={chosen.length === 0 || submitting}>
                {submitting
                  ? "Se trimite..."
                  : session.current_index + 1 >= session.total_questions
                    ? "Finalizează examenul"
                    : "Confirmă și mergi mai departe →"}
              </Button>
            </div>
          </Panel>
        </div>

        <aside className="space-y-3">
          <div className="overflow-hidden rounded-lg border-2 border-asphalt bg-asphalt">
            <video ref={videoRef} autoPlay playsInline muted className="aspect-[4/3] w-full object-cover" />
            <p className="px-2.5 py-1.5 font-mono text-xs text-chalk/80">Supraveghere activă</p>
          </div>
          <p className="text-xs text-mute">
            La expirarea timpului, răspunsul selectat se trimite automat.
          </p>
        </aside>
      </main>
    </div>
  );
}
