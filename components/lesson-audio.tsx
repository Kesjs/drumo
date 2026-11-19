"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";

/**
 * Plays a recorded human audio file when `audioPath` is present; otherwise uses
 * Romanian Web Speech API (`ro-RO`) as a live audio fallback so every lesson
 * has working "Ascultă lecția" playback right away.
 */
export function LessonAudioPlayer({
  audioPath,
  scriptRo,
  label = "Ascultă lecția",
}: {
  audioPath: string | null;
  scriptRo: string;
  label?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [supportedTts, setSupportedTts] = useState(true);

  useEffect(() => {
    setSupportedTts(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [scriptRo]);

  function startPlayback() {
    if (audioPath && audioRef.current) {
      audioRef.current.muted = muted;
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      return;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(scriptRo);
      utter.lang = "ro-RO";
      utter.rate = 0.96;
      utter.volume = muted ? 0 : 1;
      const voices = window.speechSynthesis.getVoices();
      const roVoice = voices.find((v) => v.lang.toLowerCase().startsWith("ro"));
      if (roVoice) utter.voice = roVoice;
      utter.onend = () => setPlaying(false);
      utter.onerror = () => setPlaying(false);
      window.speechSynthesis.speak(utter);
      setPlaying(true);
    }
  }

  function stopPlayback() {
    if (audioPath && audioRef.current) {
      audioRef.current.pause();
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
  }

  function replay() {
    if (audioPath && audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    startPlayback();
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    if (audioPath && audioRef.current) audioRef.current.muted = next;
    if (!audioPath && playing) {
      stopPlayback();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-asphalt/20 bg-surface px-4 py-3">
      {audioPath ? <audio ref={audioRef} src={audioPath} onEnded={() => setPlaying(false)} preload="metadata" /> : null}
      <button
        type="button"
        onClick={playing ? stopPlayback : startPlayback}
        disabled={!audioPath && !supportedTts}
        className="inline-flex min-h-[40px] items-center gap-2 rounded border-2 border-asphalt bg-signal px-3.5 py-1.5 text-sm font-semibold text-asphalt hover:bg-[#e0a900] disabled:opacity-50"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        <span>{playing ? "Oprește" : label}</span>
      </button>

      <button
        type="button"
        onClick={replay}
        aria-label="Reascultă de la început"
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded border border-line bg-chalk px-3 py-1.5 text-xs font-semibold text-asphalt hover:bg-white"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Reascultă</span>
      </button>

      <button
        type="button"
        onClick={toggleMute}
        aria-pressed={muted}
        aria-label={muted ? "Activează sunetul" : "Dezactivează sunetul"}
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded border border-line bg-chalk px-3 py-1.5 text-xs font-semibold text-asphalt hover:bg-white"
      >
        {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        <span>{muted ? "Fără sunet" : "Sunet activ"}</span>
      </button>

      <span className="ml-auto text-xs text-mute">
        {audioPath ? "Înregistrare vocală" : "Sinteză vocală ro-RO"}
      </span>
    </div>
  );
}
