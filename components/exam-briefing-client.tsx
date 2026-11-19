"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, NoticeBox, Panel } from "@/components/ui/primitives";
import { Camera, ShieldCheck } from "lucide-react";

export function ExamBriefingClient({
  eligible,
  questionCount,
  passMark,
  secondsPerQuestion,
}: {
  eligible: boolean;
  questionCount: number;
  passMark: number;
  secondsPerQuestion: number;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraOk, setCameraOk] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function testCamera() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOk(true);
    } catch {
      setCameraOk(false);
      setCameraError("Nu am putut porni camera. Permite accesul camerei în browser pentru a susține examenul.");
    }
  }

  async function startExam() {
    setStarting(true);
    setError(null);
    try {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());

      const res = await fetch("/api/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cameraGranted: cameraOk }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Examenul nu a putut fi pornit.");
      } else {
        router.push(`/examen/sala/${data.sessionId}`);
      }
    } catch {
      setError("Eroare de rețea.");
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Panel strong className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-sign" />
          <h2 className="font-cond text-2xl font-bold">Reguli înainte de începerea examenului</h2>
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm text-mute">
          <li>
            Format: <strong>{questionCount} întrebări</strong> extrase aleatoriu · prag admis{" "}
            <strong>{passMark} corecte</strong> · <strong>{secondsPerQuestion} secunde</strong> pe întrebare.
          </li>
          <li>
            La expirarea timpului, sistemul trece automat la întrebarea următoare. Nu este permisă întoarcerea la o
            întrebare anterioară.
          </li>
          <li>
            Întrebările sunt citite automat audio; ai butoane dedicate pentru <strong>Reascultă</strong> și{" "}
            <strong>Fără sunet</strong>.
          </li>
          <li>
            Camera rămâne activă pe toată durata probei. Părăsirea filei, pierderea focusului sau copierea sunt
            înregistrate cu oră exactă în raportul de integritate.
          </li>
        </ul>
      </Panel>

      <Panel className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-cond text-xl font-bold">1. Verificare cameră web</h3>
            <p className="text-xs text-mute">Asigură-te că fața este bine luminată și încadrată.</p>
          </div>
          <Button type="button" variant="secondary" onClick={testCamera} disabled={!eligible}>
            <Camera className="h-4 w-4" />
            <span>{cameraOk ? "Cameră verificată" : "Pornește camera"}</span>
          </Button>
        </div>

        {cameraError ? <NoticeBox tone="error">{cameraError}</NoticeBox> : null}

        <div className="aspect-video max-w-sm overflow-hidden rounded-lg border border-line bg-asphalt">
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        </div>
      </Panel>

      {error ? <NoticeBox tone="error">{error}</NoticeBox> : null}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" size="lg" onClick={startExam} disabled={!eligible || !cameraOk || starting}>
          {starting ? "Se inițializează sala..." : "Începe examenul acum"}
        </Button>
        {!eligible ? (
          <p className="text-xs text-danger">Îndeplinește mai întâi toate condițiile de eligibilitate.</p>
        ) : !cameraOk ? (
          <p className="text-xs text-mute">Pornește camera pentru a activa butonul de start.</p>
        ) : null}
      </div>
    </div>
  );
}
