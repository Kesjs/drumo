// Exam integrity: classify the timestamped security journal and decide
// whether the certificate must be held for human review.
export type SecurityEventType =
  | "blur" | "tab_hidden" | "fullscreen_exit" | "camera_lost" | "camera_denied"
  | "copy" | "paste" | "context_menu" | "devtools" | "multiple_faces" | "no_face" | "network_lost";

export interface SecurityEvent {
  type: SecurityEventType;
  at: number;              // server epoch ms
  questionIndex?: number | null;
  durationMs?: number;     // for blur/tab_hidden, filled when focus comes back
}

const WEIGHTS: Record<SecurityEventType, number> = {
  blur: 1, tab_hidden: 3, fullscreen_exit: 1, camera_lost: 4, camera_denied: 10,
  copy: 3, paste: 3, context_menu: 1, devtools: 6, multiple_faces: 8, no_face: 3, network_lost: 0.5,
};

export type RiskLevel = "none" | "low" | "medium" | "high";

export interface IntegrityReport {
  score: number;
  level: RiskLevel;
  counts: Partial<Record<SecurityEventType, number>>;
  totalHiddenMs: number;
  holdCertificate: boolean;
  alerts: string[];        // Romanian, shown on result page and admin
}

export function assessIntegrity(events: SecurityEvent[]): IntegrityReport {
  const counts: Partial<Record<SecurityEventType, number>> = {};
  let score = 0;
  let totalHiddenMs = 0;
  for (const e of events) {
    counts[e.type] = (counts[e.type] ?? 0) + 1;
    let w = WEIGHTS[e.type];
    if ((e.type === "tab_hidden" || e.type === "blur") && e.durationMs) {
      totalHiddenMs += e.durationMs;
      if (e.durationMs > 10_000) w *= 2;  // long absences weigh more
    }
    score += w;
  }
  const level: RiskLevel = score === 0 ? "none" : score < 4 ? "low" : score < 10 ? "medium" : "high";
  const alerts: string[] = [];
  const n = (t: SecurityEventType) => counts[t] ?? 0;
  if (n("tab_hidden")) alerts.push(`Ai părăsit fila examenului de ${n("tab_hidden")} ori.`);
  if (n("blur")) alerts.push(`Fereastra examenului a pierdut focusul de ${n("blur")} ori.`);
  if (n("camera_lost") || n("camera_denied")) alerts.push("Camera a fost întreruptă în timpul examenului.");
  if (n("fullscreen_exit")) alerts.push(`Ai ieșit din modul ecran complet de ${n("fullscreen_exit")} ori.`);
  if (n("copy") || n("paste")) alerts.push("Au fost detectate încercări de copiere sau lipire.");
  if (n("devtools")) alerts.push("Au fost detectate instrumentele de dezvoltare ale browserului.");
  if (n("multiple_faces")) alerts.push("Camera a detectat mai multe persoane.");
  if (n("no_face")) alerts.push("Camera nu te-a detectat pentru o perioadă.");
  return { score, level, counts, totalHiddenMs, holdCertificate: level === "high" || n("camera_denied") > 0, alerts };
}
