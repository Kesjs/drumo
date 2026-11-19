import { describe, expect, it } from "vitest";
import { certificateLabel, generatePublicCode, isValidPublicCode, scheduleSendAt, dueForSend, MAX_SEND_DELAY_HOURS } from "@/lib/domain/certificate";
import { updateMastery, newMastery, pickAdaptive, pickGlobal, readinessScore, mulberry32, type QuestionMeta } from "@/lib/domain/adaptive";

const H = 3_600_000;
const T0 = 1_700_000_000_000;

describe("certificate label (legal rule)", () => {
  it("keeps the safe label", () => {
    expect(certificateLabel({ label: "atestat de reușită Drumo", accredited: false })).toBe("atestat de reușită Drumo");
  });
  it("refuses any 'permis de conducere' wording while not accredited", () => {
    expect(certificateLabel({ label: "Permis de conducere Drumo", accredited: false })).toBe("atestat de reușită Drumo");
    expect(certificateLabel({ label: "Permis provizoriu", accredited: false })).toBe("atestat de reușită Drumo");
  });
  it("allows a new label once the accreditation flag is set", () => {
    expect(certificateLabel({ label: "Certificat agreat", accredited: true })).toBe("Certificat agreat");
  });
});

describe("public code", () => {
  it("generates valid, checksummed codes", () => {
    for (let i = 0; i < 200; i++) {
      const bytes = Uint8Array.from({ length: 7 }, () => Math.floor(Math.random() * 256));
      const code = generatePublicCode(bytes);
      expect(code).toMatch(/^DR-[0-9A-Z]{4}-[0-9A-Z]{4}$/);
      expect(isValidPublicCode(code)).toBe(true);
    }
  });
  it("detects a typo", () => {
    const code = generatePublicCode(new Uint8Array([1, 2, 3, 4, 5, 6, 7]));
    const last = code.at(-1)!;
    const typo = code.slice(0, -1) + (last === "0" ? "1" : "0");
    expect(isValidPublicCode(typo)).toBe(false);
  });
});

describe("3-day send queue", () => {
  it("never schedules beyond 72 hours", () => {
    expect(scheduleSendAt(T0, 500)).toBe(T0 + MAX_SEND_DELAY_HOURS * H);
    expect(scheduleSendAt(T0, 24)).toBe(T0 + 24 * H);
  });
  it("sends due queued certificates, never held ones", () => {
    const certs = [
      { id: "a", status: "queued" as const, scheduledSendAt: T0, sendAttempts: 0 },
      { id: "b", status: "held" as const, scheduledSendAt: T0, sendAttempts: 0 },
      { id: "c", status: "queued" as const, scheduledSendAt: T0 + H, sendAttempts: 0 },
      { id: "d", status: "failed" as const, scheduledSendAt: T0, sendAttempts: 2 },
      { id: "e", status: "failed" as const, scheduledSendAt: T0, sendAttempts: 5 },
      { id: "f", status: "sent" as const, scheduledSendAt: T0, sendAttempts: 1 },
    ];
    expect(dueForSend(certs, T0).map((c) => c.id)).toEqual(["a", "d"]);
  });
});

describe("adaptive engine", () => {
  const pool: QuestionMeta[] = [];
  for (const ch of ["semne", "prioritati", "viteza"]) for (let d = 1; d <= 5; d++) for (let k = 0; k < 3; k++) pool.push({ id: `${ch}-${d}-${k}`, chapterId: ch, difficulty: d });

  it("wrong answers bring the chapter back soon and lower ability", () => {
    const m = updateMastery(newMastery("semne", T0), { id: "x", chapterId: "semne", difficulty: 2 }, false, T0);
    expect(m.ability).toBeLessThan(2);
    expect(m.dueAt).toBe(T0 + 10 * 60_000);
    expect(m.streak).toBe(0);
  });

  it("correct streaks space the chapter out", () => {
    let m = newMastery("semne", T0);
    for (let i = 0; i < 3; i++) m = updateMastery(m, { id: "x", chapterId: "semne", difficulty: 3 }, true, T0);
    expect(m.intervalDays).toBeGreaterThan(3);
    expect(m.ability).toBeGreaterThan(2);
  });

  it("weak chapters receive more questions", () => {
    let weak = newMastery("viteza", T0);
    for (let i = 0; i < 6; i++) weak = updateMastery(weak, { id: "x", chapterId: "viteza", difficulty: 2 }, false, T0);
    let strong = newMastery("semne", T0);
    for (let i = 0; i < 6; i++) strong = updateMastery(strong, { id: "x", chapterId: "semne", difficulty: 2 }, true, T0);
    let strong2 = newMastery("prioritati", T0);
    for (let i = 0; i < 6; i++) strong2 = updateMastery(strong2, { id: "x", chapterId: "prioritati", difficulty: 2 }, true, T0);
    const map = new Map([["viteza", weak], ["semne", strong], ["prioritati", strong2]]);
    const set = pickAdaptive(pool, map, { count: 12, now: T0 + 60 * 60_000, rng: mulberry32(7) });
    const fromWeak = set.filter((q) => q.chapterId === "viteza").length;
    expect(fromWeak).toBeGreaterThanOrEqual(8);
    expect(new Set(set.map((q) => q.id)).size).toBe(set.length);
  });

  it("targets difficulty near ability", () => {
    const m = { ...newMastery("semne", T0), ability: 4.2 };
    const set = pickAdaptive(pool.filter((q) => q.chapterId === "semne"), new Map([["semne", m]]), { count: 3, now: T0, rng: mulberry32(1) });
    expect(set.every((q) => q.difficulty >= 4)).toBe(true);
  });

  it("global evaluation covers every chapter", () => {
    const set = pickGlobal(pool, 9, mulberry32(3));
    expect(new Set(set.map((q) => q.chapterId)).size).toBe(3);
  });

  it("readiness is capped while one chapter is weak", () => {
    expect(readinessScore(25, 26, [0.95, 0.9, 0.5])).toBeLessThan(80);
    expect(readinessScore(24, 26, [0.9, 0.85, 0.88])).toBeGreaterThanOrEqual(80);
  });
});
