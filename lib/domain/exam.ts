// Exam state machine. Runs on the server; the client only renders.
// Rules: strict per-question timer, automatic advance, no going back.

export interface ExamState {
  questionIds: string[];
  currentIndex: number;
  questionDeadline: number | null;  // epoch ms
  secondsPerQuestion: number;
  status: "briefing" | "in_progress" | "finished" | "aborted";
}

/** Network latency tolerance for an answer arriving just after the deadline. */
export const GRACE_MS = 1500;

export type AnswerResult =
  | { ok: true; state: ExamState; timedOut: boolean; recordedIndex: number }
  | { ok: false; reason: "not_in_progress" | "wrong_index" };

export function startExam(s: ExamState, now: number): ExamState {
  if (s.status !== "briefing") return s;
  return { ...s, status: "in_progress", currentIndex: 0, questionDeadline: now + s.secondsPerQuestion * 1000 };
}

function advance(s: ExamState, now: number): ExamState {
  const next = s.currentIndex + 1;
  if (next >= s.questionIds.length) return { ...s, currentIndex: next, questionDeadline: null, status: "finished" };
  return { ...s, currentIndex: next, questionDeadline: now + s.secondsPerQuestion * 1000 };
}

/**
 * Submit an answer for `index`. An index other than the current one is
 * rejected (no going back, no skipping ahead). Late answers past the grace
 * window are recorded as timed out (empty).
 */
export function submitAnswer(s: ExamState, index: number, now: number): AnswerResult {
  if (s.status !== "in_progress") return { ok: false, reason: "not_in_progress" };
  if (index !== s.currentIndex) return { ok: false, reason: "wrong_index" };
  const timedOut = s.questionDeadline !== null && now > s.questionDeadline + GRACE_MS;
  return { ok: true, state: advance(s, now), timedOut, recordedIndex: index };
}

/**
 * Catch up on expired questions (client closed, network drop...). Each
 * expired question is recorded as timed out. Returns indexes to record.
 */
export function expireOverdue(s: ExamState, now: number): { state: ExamState; expired: number[] } {
  const expired: number[] = [];
  let st = s;
  while (st.status === "in_progress" && st.questionDeadline !== null && now > st.questionDeadline + GRACE_MS) {
    expired.push(st.currentIndex);
    // the next question's clock starts when the previous one expired
    st = advance(st, st.questionDeadline);
  }
  return { state: st, expired };
}

export function remainingMs(s: ExamState, now: number) {
  return s.questionDeadline === null ? 0 : Math.max(0, s.questionDeadline - now);
}

export function grade(chosen: string[], correct: string[]) {
  if (chosen.length !== correct.length) return false;
  const a = [...chosen].sort().join();
  const b = [...correct].sort().join();
  return a === b;
}
