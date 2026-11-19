import { describe, expect, it } from "vitest";
import { startExam, submitAnswer, expireOverdue, remainingMs, grade, GRACE_MS, type ExamState } from "@/lib/domain/exam";
import { assessIntegrity } from "@/lib/domain/integrity";

const T0 = 1_700_000_000_000;
const base: ExamState = { questionIds: ["q1", "q2", "q3"], currentIndex: 0, questionDeadline: null, secondsPerQuestion: 30, status: "briefing" };

describe("exam timer and navigation", () => {
  it("starts with a deadline for the first question", () => {
    const s = startExam(base, T0);
    expect(s.status).toBe("in_progress");
    expect(s.questionDeadline).toBe(T0 + 30_000);
    expect(remainingMs(s, T0 + 10_000)).toBe(20_000);
  });

  it("cannot go back to a previous question", () => {
    let s = startExam(base, T0);
    const r = submitAnswer(s, 0, T0 + 5_000);
    expect(r.ok).toBe(true);
    if (r.ok) s = r.state;
    expect(submitAnswer(s, 0, T0 + 6_000)).toEqual({ ok: false, reason: "wrong_index" });
  });

  it("cannot skip ahead", () => {
    const s = startExam(base, T0);
    expect(submitAnswer(s, 2, T0)).toEqual({ ok: false, reason: "wrong_index" });
  });

  it("answers within grace are accepted, later ones are timed out", () => {
    const s = startExam(base, T0);
    const inGrace = submitAnswer(s, 0, T0 + 30_000 + GRACE_MS);
    expect(inGrace.ok && inGrace.timedOut).toBe(false);
    const late = submitAnswer(s, 0, T0 + 30_000 + GRACE_MS + 1);
    expect(late.ok && late.timedOut).toBe(true);
  });

  it("each answer resets the clock for the next question", () => {
    const s = startExam(base, T0);
    const r = submitAnswer(s, 0, T0 + 12_000);
    expect(r.ok && r.state.questionDeadline).toBe(T0 + 12_000 + 30_000);
  });

  it("auto-advances through expired questions after a disconnect", () => {
    const s = startExam(base, T0);
    const { state, expired } = expireOverdue(s, T0 + 65_000);
    expect(expired).toEqual([0, 1]);
    expect(state.currentIndex).toBe(2);
    expect(state.questionDeadline).toBe(T0 + 90_000);
  });

  it("finishes after the last question", () => {
    let s = startExam(base, T0);
    for (let i = 0; i < 3; i++) {
      const r = submitAnswer(s, i, T0 + i * 1000);
      if (!r.ok) throw new Error("unexpected");
      s = r.state;
    }
    expect(s.status).toBe("finished");
    expect(submitAnswer(s, 3, T0 + 5000)).toEqual({ ok: false, reason: "not_in_progress" });
  });

  it("expiring everything finishes the exam", () => {
    const s = startExam(base, T0);
    expect(expireOverdue(s, T0 + 10 * 60_000).state.status).toBe("finished");
  });

  it("grades multi-answer questions exactly", () => {
    expect(grade(["B", "A"], ["A", "B"])).toBe(true);
    expect(grade(["A"], ["A", "B"])).toBe(false);
    expect(grade([], ["A"])).toBe(false);
  });
});

describe("anti-cheat integrity", () => {
  it("a clean session has no alerts and no hold", () => {
    const r = assessIntegrity([]);
    expect(r.level).toBe("none");
    expect(r.holdCertificate).toBe(false);
    expect(r.alerts).toEqual([]);
  });

  it("a single short blur is low risk", () => {
    const r = assessIntegrity([{ type: "blur", at: T0, durationMs: 800 }]);
    expect(r.level).toBe("low");
    expect(r.holdCertificate).toBe(false);
  });

  it("repeated tab switching holds the certificate", () => {
    const ev = Array.from({ length: 4 }, (_, i) => ({ type: "tab_hidden" as const, at: T0 + i, durationMs: 12_000 }));
    const r = assessIntegrity(ev);
    expect(r.level).toBe("high");
    expect(r.holdCertificate).toBe(true);
    expect(r.alerts[0]).toContain("de 4 ori");
    expect(r.totalHiddenMs).toBe(48_000);
  });

  it("camera denied always holds", () => {
    expect(assessIntegrity([{ type: "camera_denied", at: T0 }]).holdCertificate).toBe(true);
  });
});
