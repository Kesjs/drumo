// Adaptive engine: per-chapter mastery with SM-2 style spacing, ability-based
// difficulty selection, and a readiness score built from the global evaluation.

export interface Mastery {
  chapterId: string;
  ease: number;          // 1.3 .. 3.0
  intervalDays: number;
  streak: number;
  seen: number;
  correct: number;
  ability: number;       // 1 .. 5
  dueAt: number;         // epoch ms
}

export interface QuestionMeta {
  id: string;
  chapterId: string;
  difficulty: number;    // 1 .. 5
}

const DAY = 86_400_000;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function newMastery(chapterId: string, now: number): Mastery {
  return { chapterId, ease: 2.5, intervalDays: 0, streak: 0, seen: 0, correct: 0, ability: 2, dueAt: now };
}

/** Accuracy with a Bayesian prior so 1/1 does not read as 100 % mastered. */
export function accuracy(m: Pick<Mastery, "seen" | "correct">) {
  return (m.correct + 1) / (m.seen + 3);
}

/** Update after one answered question. */
export function updateMastery(m: Mastery, q: QuestionMeta, correct: boolean, now: number): Mastery {
  // Elo-like ability step: beating a hard question moves you more.
  const expected = 1 / (1 + Math.exp(q.difficulty - m.ability));
  const ability = clamp(m.ability + 0.6 * ((correct ? 1 : 0) - expected), 1, 5);

  // SM-2: quality 5 for correct, 1 for wrong.
  const quality = correct ? 5 : 1;
  const ease = clamp(m.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)), 1.3, 3.0);
  const streak = correct ? m.streak + 1 : 0;
  const intervalDays = !correct ? 0 : streak === 1 ? 1 : streak === 2 ? 3 : Math.round(m.intervalDays * ease * 10) / 10;
  const dueAt = correct ? now + intervalDays * DAY : now + 10 * 60_000; // wrong: back in 10 minutes

  return { ...m, ability, ease, streak, intervalDays, dueAt, seen: m.seen + 1, correct: m.correct + (correct ? 1 : 0) };
}

/** Weakness weight: overdue and low-accuracy chapters get more questions. */
export function chapterWeight(m: Mastery, now: number) {
  const overdue = m.dueAt <= now ? 1 + Math.min(3, (now - m.dueAt) / DAY) : 0.25;
  const weak = 1.5 - accuracy(m); // 0.5 .. ~1.17
  const unseen = m.seen === 0 ? 1.5 : 1;
  return overdue * weak * unseen;
}

/** Deterministic PRNG so selections are reproducible in tests. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface PickOptions {
  count: number;
  now: number;
  recentIds?: Set<string>;   // avoid repeats within the session / last attempts
  rng?: () => number;
}

/**
 * Picks the next adaptive set: chapters by weakness weight, then within a
 * chapter the question whose difficulty is closest to ability + 0.5 (a bit
 * of stretch), avoiding recent questions.
 */
export function pickAdaptive(pool: QuestionMeta[], masteries: Map<string, Mastery>, o: PickOptions): QuestionMeta[] {
  const rng = o.rng ?? Math.random;
  const recent = o.recentIds ?? new Set<string>();
  const byChapter = new Map<string, QuestionMeta[]>();
  for (const q of pool) {
    if (recent.has(q.id)) continue;
    (byChapter.get(q.chapterId) ?? byChapter.set(q.chapterId, []).get(q.chapterId)!).push(q);
  }
  const picked: QuestionMeta[] = [];
  const used = new Set<string>();
  while (picked.length < o.count) {
    const chapters = [...byChapter.entries()].filter(([, qs]) => qs.some((q) => !used.has(q.id)));
    if (chapters.length === 0) break;
    const weights = chapters.map(([id]) => chapterWeight(masteries.get(id) ?? newMastery(id, o.now), o.now));
    const sum = weights.reduce((a, b) => a + b, 0);
    let r = rng() * sum;
    let idx = 0;
    while (idx < weights.length - 1 && (r -= weights[idx]) > 0) idx++;
    const [chapterId, qs] = chapters[idx];
    const ability = (masteries.get(chapterId) ?? newMastery(chapterId, o.now)).ability;
    const target = clamp(ability + 0.5, 1, 5);
    const candidates = qs.filter((q) => !used.has(q.id));
    candidates.sort((a, b) => Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target) || rng() - 0.5);
    const q = candidates[0];
    used.add(q.id);
    picked.push(q);
  }
  return picked;
}

/** Global evaluation: stratified, every chapter represented proportionally. */
export function pickGlobal(pool: QuestionMeta[], count: number, rng: () => number = Math.random): QuestionMeta[] {
  const byChapter = new Map<string, QuestionMeta[]>();
  for (const q of pool) (byChapter.get(q.chapterId) ?? byChapter.set(q.chapterId, []).get(q.chapterId)!).push(q);
  const shuffled = [...byChapter.values()].map((qs) => shuffle(qs, rng));
  const out: QuestionMeta[] = [];
  let round = 0;
  while (out.length < count && shuffled.some((qs) => qs.length > round)) {
    for (const qs of shuffled) if (qs[round] && out.length < count) out.push(qs[round]);
    round++;
  }
  return shuffle(out, rng);
}

export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Readiness 0..100. The global evaluation dominates, but a single weak
 * chapter caps the score: you cannot be "ready" while failing a chapter.
 */
export function readinessScore(globalCorrect: number, globalTotal: number, chapterAccuracies: number[]): number {
  if (globalTotal === 0) return 0;
  const global = globalCorrect / globalTotal;
  const weakest = chapterAccuracies.length ? Math.min(...chapterAccuracies) : global;
  const mean = chapterAccuracies.length ? chapterAccuracies.reduce((a, b) => a + b, 0) / chapterAccuracies.length : global;
  const raw = 0.7 * global + 0.3 * mean;
  const cap = weakest < 0.6 ? 0.79 : 1; // below the default 80 threshold
  return Math.round(Math.min(raw, cap) * 100);
}
