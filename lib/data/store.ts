import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { isSupabaseConfigured } from "@/lib/config";
import { createSupabaseServer, createSupabaseService } from "@/lib/supabase/server";
import { hashPassword, verifyPassword, getLocalSessionUserId } from "@/lib/auth-session";
import {
  SEED_CATEGORIES,
  SEED_CHAPTERS,
  SEED_QUESTIONS,
  type SeedCategory,
  type SeedChapter,
  type SeedQuestion,
} from "@/lib/data/seed-content";
import { computeAccess, type Access, type KycStatus } from "@/lib/domain/access";
import { feeFor, validateNextPayment, type Currency, type PaymentMode } from "@/lib/domain/money";
import {
  accuracy,
  mulberry32,
  newMastery,
  pickAdaptive,
  pickGlobal,
  readinessScore,
  shuffle,
  updateMastery,
  type Mastery,
  type QuestionMeta,
} from "@/lib/domain/adaptive";
import { expireOverdue, grade, startExam, submitAnswer, type ExamState } from "@/lib/domain/exam";
import { assessIntegrity, type IntegrityReport, type SecurityEvent, type SecurityEventType } from "@/lib/domain/integrity";
import { certificateLabel, dueForSend, generatePublicCode, nextRetryAt, scheduleSendAt } from "@/lib/domain/certificate";

// ---------------------------------------------------------------------------
// Shared Domain DTOs
// ---------------------------------------------------------------------------
export type UserRole = "candidate" | "reviewer" | "admin";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  country: string;
  category_id: string | null;
  currency: Currency;
  role: UserRole;
  consent_terms_at: string | null;
  consent_privacy_at: string | null;
  consent_biometric_at: string | null;
  consent_marketing_at: string | null;
  created_at: string;
}

export interface KycRecord {
  id: string;
  user_id: string;
  document_type: "ci" | "passport" | "eu_id";
  id_document_name: string | null;
  selfie_name: string | null;
  status: KycStatus;
  risk_flags: string[];
  reviewer_note: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  purge_after: string;
  purged_at: string | null;
}

export interface EnrollmentRecord {
  user_id: string;
  category_id: string;
  currency: Currency;
  mode: PaymentMode;
  total_due: number;
  total_paid: number;
  courses_unlocked: boolean;
  fee_fully_paid: boolean;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  category_id: string;
  mode: PaymentMode;
  installment_no: number;
  amount: number;
  currency: Currency;
  status: "pending" | "succeeded" | "failed" | "refunded" | "canceled";
  method: string;
  stripe_session_id: string | null;
  receipt_url: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface RefundRequestRecord {
  id: string;
  user_id: string;
  payment_id: string | null;
  reason: string;
  status: "open" | "approved" | "rejected";
  created_at: string;
  decided_at: string | null;
}

export interface PracticeAttempt {
  id: string;
  user_id: string;
  kind: "chapter" | "adaptive" | "global";
  chapter_id: string | null;
  question_ids: string[];
  answers: Array<{
    question_id: string;
    chosen: string[];
    correct: boolean;
    ms_taken: number;
    answered_at: string;
  }>;
  started_at: string;
  finished_at: string | null;
  score: number | null;
  total: number;
}

export interface ExamSessionRecord {
  id: string;
  user_id: string;
  category_id: string;
  question_ids: string[];
  current_index: number;
  question_started_at: number | null;
  question_deadline: number | null;
  seconds_per_question: number;
  pass_mark: number;
  status: "briefing" | "in_progress" | "finished" | "aborted";
  camera_granted: boolean;
  answers: Array<{
    idx: number;
    question_id: string;
    chosen: string[];
    correct: boolean;
    timed_out: boolean;
    answered_at: string;
  }>;
  security_events: SecurityEvent[];
  score: number | null;
  passed: boolean | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
}

export interface CertificateRecord {
  id: string;
  public_code: string;
  user_id: string;
  session_id: string;
  category_code: string;
  holder_name: string;
  score: number;
  total: number;
  label_snapshot: string;
  issued_at: string;
  scheduled_send_at: string;
  status: "queued" | "held" | "sent" | "revoked" | "failed";
  hold_reason: string | null;
  held_by: string | null;
  sent_at: string | null;
  send_attempts: number;
  last_error: string | null;
}

export interface AuditEntry {
  id: number;
  actor_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  diff: Record<string, unknown> | null;
  at: string;
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  created_at: string;
}

interface LocalDb {
  app_config: {
    certificate_label: string;
    accredited: boolean;
    certificate_send_delay_hours: number;
    kyc_retention_days: number;
  };
  categories: SeedCategory[];
  chapters: SeedChapter[];
  questions: SeedQuestion[];
  users: Array<{ profile: UserProfile; password_hash: string }>;
  kyc: KycRecord[];
  enrollments: EnrollmentRecord[];
  payments: PaymentRecord[];
  refund_requests: RefundRequestRecord[];
  chapter_progress: Array<{
    user_id: string;
    chapter_id: string;
    summary_read_at: string | null;
    lesson_completed_at: string | null;
    best_test_score: number | null;
  }>;
  attempts: PracticeAttempt[];
  mastery: Array<{ user_id: string } & Mastery>;
  readiness: Array<{ user_id: string; score: number; global_attempt_id: string; computed_at: string }>;
  exam_sessions: ExamSessionRecord[];
  certificates: CertificateRecord[];
  audit_log: AuditEntry[];
  contact_messages: ContactMessageRecord[];
  stripe_events: string[];
}

const LOCAL_DB_PATH = path.join(os.tmpdir(), "drumo-store-v1.json");

function createInitialLocalDb(): LocalDb {
  const now = new Date().toISOString();
  const catB = SEED_CATEGORIES.find((c) => c.code === "B")!;
  const adminId = "00000000-0000-4000-8000-000000000001";
  const demoCandidateId = "00000000-0000-4000-8000-000000000002";
  const demoCode = generatePublicCode(Uint8Array.from([12, 44, 71, 92, 18, 5, 111]));

  return {
    app_config: {
      certificate_label: "atestat de reușită PermisStart",
      accredited: false,
      certificate_send_delay_hours: 48,
      kyc_retention_days: 30,
    },
    categories: structuredClone(SEED_CATEGORIES),
    chapters: structuredClone(SEED_CHAPTERS),
    questions: structuredClone(SEED_QUESTIONS),
    users: [
      {
        profile: {
          id: adminId,
          first_name: "Administrator",
          last_name: "PermisStart",
          email: "admin@drumo.ro",
          phone: null,
          country: "RO",
          category_id: catB.id,
          currency: "RON",
          role: "admin",
          consent_terms_at: now,
          consent_privacy_at: now,
          consent_biometric_at: null,
          consent_marketing_at: null,
          created_at: now,
        },
        password_hash: hashPassword("AdminDrumo2026!"),
      },
      {
        profile: {
          id: demoCandidateId,
          first_name: "Andrei",
          last_name: "Popescu",
          email: "candidat@drumo.ro",
          phone: "+40722000111",
          country: "RO",
          category_id: catB.id,
          currency: "RON",
          role: "candidate",
          consent_terms_at: now,
          consent_privacy_at: now,
          consent_biometric_at: now,
          consent_marketing_at: null,
          created_at: now,
        },
        password_hash: hashPassword("Candidat2026!"),
      },
    ],
    kyc: [
      {
        id: "kyc-demo-1",
        user_id: demoCandidateId,
        document_type: "ci",
        id_document_name: "carte-identitate-demo.jpg",
        selfie_name: "selfie-demo.jpg",
        status: "approved",
        risk_flags: [],
        reviewer_note: "Document valid verificat",
        submitted_at: now,
        reviewed_at: now,
        purge_after: new Date(Date.now() + 30 * 86_400_000).toISOString(),
        purged_at: null,
      },
    ],
    enrollments: [
      {
        user_id: demoCandidateId,
        category_id: catB.id,
        currency: "RON",
        mode: "installments",
        total_due: catB.fee_ron,
        total_paid: catB.min_first_installment_ron,
        courses_unlocked: true,
        fee_fully_paid: false,
        updated_at: now,
      },
    ],
    payments: [
      {
        id: "pay-demo-1",
        user_id: demoCandidateId,
        category_id: catB.id,
        mode: "installments",
        installment_no: 1,
        amount: catB.min_first_installment_ron,
        currency: "RON",
        status: "succeeded",
        method: "card",
        stripe_session_id: null,
        receipt_url: null,
        created_at: now,
        paid_at: now,
      },
    ],
    refund_requests: [],
    chapter_progress: [
      {
        user_id: demoCandidateId,
        chapter_id: "ch-semne",
        summary_read_at: now,
        lesson_completed_at: now,
        best_test_score: 5,
      },
    ],
    attempts: [],
    mastery: [
      { user_id: demoCandidateId, ...newMastery("ch-semne", Date.now()), seen: 6, correct: 5, ability: 2.8, streak: 2 },
    ],
    readiness: [],
    exam_sessions: [],
    certificates: [
      {
        id: "cert-demo-sample",
        public_code: demoCode,
        user_id: demoCandidateId,
        session_id: "sample-session",
        category_code: "B",
        holder_name: "Andrei Popescu",
        score: 24,
        total: 26,
        label_snapshot: "atestat de reușită PermisStart",
        issued_at: now,
        scheduled_send_at: new Date(Date.now() + 48 * 3_600_000).toISOString(),
        status: "sent",
        hold_reason: null,
        held_by: null,
        sent_at: now,
        send_attempts: 1,
        last_error: null,
      },
    ],
    audit_log: [
      {
        id: 1,
        actor_id: adminId,
        action: "system_seed",
        entity: "app_config",
        entity_id: "default",
        diff: { accredited: false },
        at: now,
      },
    ],
    contact_messages: [],
    stripe_events: [],
  };
}

let writeLock: Promise<void> = Promise.resolve();

async function readLocalDb(): Promise<LocalDb> {
  if (isSupabaseConfigured()) {
    try {
      const svc = createSupabaseService();
      if (svc) {
        const { data } = await svc.from("app_config").select("value").eq("key", "runtime_state_v1").single();
        if (data?.value && typeof data.value === "object") {
          return data.value as LocalDb;
        }
      }
    } catch {
      // Fallback to local file if app_config row is not created yet
    }
  }
  try {
    const raw = await fs.readFile(LOCAL_DB_PATH, "utf8");
    return JSON.parse(raw) as LocalDb;
  } catch {
    const db = createInitialLocalDb();
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(db, null, 2), "utf8");
    return db;
  }
}

async function mutateLocalDb<T>(fn: (db: LocalDb) => Promise<T> | T): Promise<T> {
  let result!: T;
  const run = async () => {
    const db = await readLocalDb();
    result = await fn(db);
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(db, null, 2), "utf8");
    if (isSupabaseConfigured()) {
      try {
        const svc = createSupabaseService();
        if (svc) {
          await svc.from("app_config").upsert(
            {
              key: "runtime_state_v1",
              value: db,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "key" },
          );
        }
      } catch {
        // Ignore transient network error while keeping local snapshot consistent
      }
    }
  };
  writeLock = writeLock.then(run, run);
  await writeLock;
  return result;
}

function appendAudit(db: LocalDb, actorId: string | null, action: string, entity: string, entityId: string | null, diff?: Record<string, unknown>) {
  const nextId = (db.audit_log.at(-1)?.id ?? 0) + 1;
  db.audit_log.push({
    id: nextId,
    actor_id: actorId,
    action,
    entity,
    entity_id: entityId,
    diff: diff ?? null,
    at: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// Public Catalogue
// ---------------------------------------------------------------------------
export async function listCategories(): Promise<SeedCategory[]> {
  if (isSupabaseConfigured()) {
    const svc = createSupabaseService()!;
    const { data } = await svc.from("categories").select("*").eq("active", true).order("sort_order");
    if (data && data.length > 0) {
      return data.map((row) => ({
        ...row,
        vehicles_ro: SEED_CATEGORIES.find((c) => c.code === row.code)?.vehicles_ro ?? [],
      })) as SeedCategory[];
    }
  }
  const db = await readLocalDb();
  return db.categories.filter((c) => c.active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getCategoryBySlug(slug: string): Promise<SeedCategory | null> {
  const all = await listCategories();
  return all.find((c) => c.slug === slug || c.code.toLowerCase() === slug.toLowerCase()) ?? null;
}

export async function listChapters(categoryCode?: string): Promise<SeedChapter[]> {
  const db = await readLocalDb();
  const chapters = [...db.chapters].sort((a, b) => a.sort_order - b.sort_order);
  if (!categoryCode) return chapters;
  return chapters.filter((ch) => ch.category_codes.includes(categoryCode));
}

export async function getChapterBySlug(slug: string): Promise<SeedChapter | null> {
  const db = await readLocalDb();
  return db.chapters.find((c) => c.slug === slug) ?? null;
}

export async function getAppConfig() {
  const db = await readLocalDb();
  return db.app_config;
}

// ---------------------------------------------------------------------------
// Auth & Candidate State
// ---------------------------------------------------------------------------
export async function getCurrentUser(): Promise<UserProfile | null> {
  if (isSupabaseConfigured()) {
    const sb = await createSupabaseServer();
    const { data } = (await sb?.auth.getUser()) ?? { data: { user: null } };
    if (!data.user) return null;
    const svc = createSupabaseService()!;
    const { data: profile } = await svc.from("profiles").select("*").eq("id", data.user.id).single();
    return (profile as UserProfile) ?? null;
  }
  const uid = await getLocalSessionUserId();
  if (!uid) return null;
  const db = await readLocalDb();
  return db.users.find((u) => u.profile.id === uid)?.profile ?? null;
}

export async function registerCandidate(input: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  password: string;
  country: string;
  categoryCode: string;
  currency: Currency;
  consentTerms: boolean;
  consentPrivacy: boolean;
  consentBiometric: boolean;
}): Promise<{ ok: true; user: UserProfile } | { ok: false; error: string }> {
  if (!input.consentTerms || !input.consentPrivacy || !input.consentBiometric) {
    return { ok: false, error: "Trebuie să accepți termenii, politica de confidențialitate și prelucrarea imaginilor pentru verificarea identității." };
  }
  if (!input.email && !input.phone) {
    return { ok: false, error: "Introdu o adresă de e-mail sau un număr de telefon." };
  }

  if (isSupabaseConfigured()) {
    const svc = createSupabaseService()!;
    const categories = await listCategories();
    const cat = categories.find((c) => c.code === input.categoryCode);
    if (!cat) return { ok: false, error: "Categoria selectată nu este validă." };

    const authEmail = input.email || `${input.phone?.replace(/[^0-9]/g, "")}@phone.drumo.local`;
    const { data: created, error } = await svc.auth.admin.createUser({
      email: authEmail,
      password: input.password,
      email_confirm: true,
    });
    if (error || !created.user) return { ok: false, error: error?.message || "Înscrierea nu a reușit." };

    const now = new Date().toISOString();
    const profile: UserProfile = {
      id: created.user.id,
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      email: input.email?.trim().toLowerCase() || null,
      phone: input.phone?.trim() || null,
      country: input.country,
      category_id: cat.id,
      currency: input.currency,
      role: "candidate",
      consent_terms_at: now,
      consent_privacy_at: now,
      consent_biometric_at: now,
      consent_marketing_at: null,
      created_at: now,
    };
    const { error: pErr } = await svc.from("profiles").insert(profile);
    if (pErr) return { ok: false, error: pErr.message };
    return { ok: true, user: profile };
  }

  return mutateLocalDb((db) => {
    const emailNorm = input.email?.trim().toLowerCase() || null;
    const phoneNorm = input.phone?.trim() || null;
    const exists = db.users.some(
      (u) => (emailNorm && u.profile.email === emailNorm) || (phoneNorm && u.profile.phone === phoneNorm),
    );
    if (exists) return { ok: false as const, error: "Există deja un cont cu acest e-mail sau număr de telefon." };

    const cat = db.categories.find((c) => c.code === input.categoryCode && c.active);
    if (!cat) return { ok: false as const, error: "Categoria selectată nu este disponibilă." };

    const now = new Date().toISOString();
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      email: emailNorm,
      phone: phoneNorm,
      country: input.country,
      category_id: cat.id,
      currency: input.currency,
      role: "candidate",
      consent_terms_at: now,
      consent_privacy_at: now,
      consent_biometric_at: now,
      consent_marketing_at: null,
      created_at: now,
    };
    db.users.push({ profile, password_hash: hashPassword(input.password) });
    appendAudit(db, profile.id, "candidate_registered", "profiles", profile.id, { category: cat.code, currency: input.currency });
    return { ok: true as const, user: profile };
  });
}

export async function loginCandidate(identifier: string, password: string): Promise<{ ok: true; user: UserProfile } | { ok: false; error: string }> {
  const idNorm = identifier.trim().toLowerCase();
  if (isSupabaseConfigured()) {
    const sb = await createSupabaseServer();
    if (!sb) return { ok: false, error: "Configurație lipsă." };
    const { data, error } = await sb.auth.signInWithPassword({ email: idNorm, password });
    if (error || !data.user) return { ok: false, error: "Date de autentificare incorecte." };
    const svc = createSupabaseService()!;
    const { data: profile } = await svc.from("profiles").select("*").eq("id", data.user.id).single();
    if (!profile) return { ok: false, error: "Profil inexistent." };
    return { ok: true, user: profile as UserProfile };
  }

  const db = await readLocalDb();
  const entry = db.users.find(
    (u) => u.profile.email?.toLowerCase() === idNorm || u.profile.phone?.toLowerCase() === idNorm,
  );
  if (!entry || !verifyPassword(password, entry.password_hash)) {
    return { ok: false, error: "E-mail/telefon sau parolă incorectă." };
  }
  return { ok: true, user: entry.profile };
}

export interface CandidateSnapshot {
  user: UserProfile;
  category: SeedCategory;
  kyc: KycRecord | null;
  enrollment: EnrollmentRecord | null;
  payments: PaymentRecord[];
  refundRequests: RefundRequestRecord[];
  progress: Array<{ chapter_id: string; summary_read_at: string | null; lesson_completed_at: string | null; best_test_score: number | null }>;
  mastery: Mastery[];
  readinessScore: number | null;
  access: Access;
  certificates: CertificateRecord[];
  examSessions: ExamSessionRecord[];
}

export async function getCandidateSnapshot(userId: string): Promise<CandidateSnapshot | null> {
  const db = await readLocalDb();
  const user = db.users.find((u) => u.profile.id === userId)?.profile;
  if (!user) return null;
  const category = db.categories.find((c) => c.id === user.category_id) ?? db.categories[5];
  const kyc = db.kyc.filter((k) => k.user_id === userId).sort((a, b) => b.submitted_at.localeCompare(a.submitted_at))[0] ?? null;
  const enrollment = db.enrollments.find((e) => e.user_id === userId) ?? null;
  const payments = db.payments.filter((p) => p.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at));
  const refundRequests = db.refund_requests.filter((r) => r.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at));
  const progress = db.chapter_progress.filter((p) => p.user_id === userId);
  const mastery = db.mastery.filter((m) => m.user_id === userId);
  const readinessRow = db.readiness.find((r) => r.user_id === userId);
  const certificates = db.certificates.filter((c) => c.user_id === userId).sort((a, b) => b.issued_at.localeCompare(a.issued_at));
  const examSessions = db.exam_sessions.filter((s) => s.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at));

  const access = computeAccess({
    totalDue: enrollment?.total_due ?? null,
    totalPaid: enrollment?.total_paid ?? 0,
    kyc: kyc?.status ?? "not_started",
    readiness: readinessRow?.score ?? null,
    readinessThreshold: category.readiness_threshold,
  });

  return {
    user,
    category,
    kyc,
    enrollment,
    payments,
    refundRequests,
    progress,
    mastery,
    readinessScore: readinessRow?.score ?? null,
    access,
    certificates,
    examSessions,
  };
}

// ---------------------------------------------------------------------------
// KYC
// ---------------------------------------------------------------------------
export async function submitKyc(input: {
  userId: string;
  documentType: "ci" | "passport" | "eu_id";
  idFileName: string;
  selfieFileName: string;
  flagManualReview?: boolean;
}): Promise<KycRecord> {
  return mutateLocalDb((db) => {
    const now = new Date();
    const purgeAfter = new Date(now.getTime() + db.app_config.kyc_retention_days * 86_400_000).toISOString();
    const riskFlags: string[] = [];
    if (input.flagManualReview) riskFlags.push("nevoie_verificare_vizuala");
    const status: KycStatus = riskFlags.length > 0 ? "manual_review" : "pending";
    const record: KycRecord = {
      id: `kyc-${crypto.randomUUID().slice(0, 8)}`,
      user_id: input.userId,
      document_type: input.documentType,
      id_document_name: input.idFileName,
      selfie_name: input.selfieFileName,
      status,
      risk_flags: riskFlags,
      reviewer_note: null,
      submitted_at: now.toISOString(),
      reviewed_at: null,
      purge_after: purgeAfter,
      purged_at: null,
    };
    db.kyc.push(record);
    appendAudit(db, input.userId, "kyc_submitted", "kyc_submissions", record.id, { documentType: input.documentType, status });
    return record;
  });
}

// ---------------------------------------------------------------------------
// Payments (validated against domain rules + idempotent recording)
// ---------------------------------------------------------------------------
export async function preparePayment(input: {
  userId: string;
  mode: PaymentMode;
  currency: Currency;
  requestedAmountMinor: number;
}) {
  const snap = await getCandidateSnapshot(input.userId);
  if (!snap) return { ok: false as const, error: "Cont inexistent." };
  const fees = feeFor(snap.category, input.currency);
  const currentTotal = snap.enrollment?.total_due ?? fees.total;
  const currentPaid = snap.enrollment?.total_paid ?? 0;
  const paidCount = snap.payments.filter((p) => p.status === "succeeded").length;

  // If user switches currency before first payment, allow updating enrollment currency
  const effectiveTotal = currentPaid === 0 ? fees.total : currentTotal;
  const effectiveCurrency: Currency = currentPaid === 0 ? input.currency : (snap.enrollment?.currency ?? input.currency);

  const check = validateNextPayment(
    snap.category,
    effectiveCurrency,
    input.mode,
    { total: effectiveTotal, paid: currentPaid, paymentsMade: paidCount },
    input.requestedAmountMinor,
  );
  if (!check.ok) {
    const messages: Record<string, string> = {
      fee_mismatch: "Taxa categoriei s-a modificat; reîncarcă pagina.",
      already_paid: "Taxa categoriei este deja achitată integral.",
      invalid_amount: "Sumă invalidă.",
      exceeds_remaining: "Suma depășește restul rămas de plată.",
      full_requires_remaining: "Plata integrală trebuie să acopere toată suma rămasă.",
      below_min_first: "Prima tranșă este sub minimul categoriei.",
      last_installment_must_settle: "Ultima tranșă permisă trebuie să achite restul integral.",
      leaves_dust: "Nu poți lăsa un rest mai mic de 10% din taxă.",
    };
    return { ok: false as const, error: messages[check.reason] ?? "Sumă nevalidă." };
  }

  return {
    ok: true as const,
    snapshot: snap,
    currency: effectiveCurrency,
    amountMinor: check.amount,
    installmentNo: paidCount + 1,
    totalDueMinor: effectiveTotal,
  };
}

export async function recordSucceededPayment(input: {
  userId: string;
  categoryId: string;
  mode: PaymentMode;
  currency: Currency;
  amountMinor: number;
  installmentNo: number;
  method: string;
  stripeSessionId?: string | null;
  stripeEventId?: string | null;
}) {
  return mutateLocalDb((db) => {
    if (input.stripeEventId && db.stripe_events.includes(input.stripeEventId)) {
      return { duplicate: true as const };
    }
    if (input.stripeEventId) db.stripe_events.push(input.stripeEventId);

    const cat = db.categories.find((c) => c.id === input.categoryId);
    if (!cat) throw new Error("Category not found");
    const fees = feeFor(cat, input.currency);
    const now = new Date().toISOString();

    let enrollment = db.enrollments.find((e) => e.user_id === input.userId);
    if (!enrollment) {
      enrollment = {
        user_id: input.userId,
        category_id: cat.id,
        currency: input.currency,
        mode: input.mode,
        total_due: fees.total,
        total_paid: 0,
        courses_unlocked: false,
        fee_fully_paid: false,
        updated_at: now,
      };
      db.enrollments.push(enrollment);
    }

    const payment: PaymentRecord = {
      id: `pay-${crypto.randomUUID().slice(0, 8)}`,
      user_id: input.userId,
      category_id: cat.id,
      mode: input.mode,
      installment_no: input.installmentNo,
      amount: input.amountMinor,
      currency: input.currency,
      status: "succeeded",
      method: input.method,
      stripe_session_id: input.stripeSessionId ?? null,
      receipt_url: `/plata?receipt=${input.installmentNo}`,
      created_at: now,
      paid_at: now,
    };
    db.payments.push(payment);

    enrollment.total_paid = Math.min(enrollment.total_due, enrollment.total_paid + input.amountMinor);
    enrollment.courses_unlocked = enrollment.total_paid > 0;
    enrollment.fee_fully_paid = enrollment.total_paid >= enrollment.total_due;
    enrollment.updated_at = now;

    appendAudit(db, input.userId, "payment_succeeded", "payments", payment.id, {
      amount: input.amountMinor,
      currency: input.currency,
      total_paid: enrollment.total_paid,
      courses_unlocked: enrollment.courses_unlocked,
      fee_fully_paid: enrollment.fee_fully_paid,
    });

    const user = db.users.find((u) => u.profile.id === input.userId)?.profile;
    return { duplicate: false as const, payment, enrollment, category: cat, user };
  });
}

export async function createRefundRequest(userId: string, reason: string, paymentId?: string | null) {
  return mutateLocalDb((db) => {
    const req: RefundRequestRecord = {
      id: `ref-${crypto.randomUUID().slice(0, 8)}`,
      user_id: userId,
      payment_id: paymentId ?? null,
      reason: reason.trim(),
      status: "open",
      created_at: new Date().toISOString(),
      decided_at: null,
    };
    db.refund_requests.push(req);
    appendAudit(db, userId, "refund_requested", "refund_requests", req.id, { reason: req.reason });
    return req;
  });
}

// ---------------------------------------------------------------------------
// Chapters & Learning Progress
// ---------------------------------------------------------------------------
export async function markChapterProgress(userId: string, chapterSlug: string, kind: "summary" | "lesson") {
  const snap = await getCandidateSnapshot(userId);
  if (!snap?.access.coursesUnlocked) return { ok: false as const, error: "Cursurile sunt blocate până la prima plată." };
  return mutateLocalDb((db) => {
    const ch = db.chapters.find((c) => c.slug === chapterSlug);
    if (!ch) return { ok: false as const, error: "Capitol inexistent." };
    const now = new Date().toISOString();
    let row = db.chapter_progress.find((p) => p.user_id === userId && p.chapter_id === ch.id);
    if (!row) {
      row = { user_id: userId, chapter_id: ch.id, summary_read_at: null, lesson_completed_at: null, best_test_score: null };
      db.chapter_progress.push(row);
    }
    if (kind === "summary") row.summary_read_at = row.summary_read_at ?? now;
    if (kind === "lesson") {
      row.summary_read_at = row.summary_read_at ?? now;
      row.lesson_completed_at = now;
    }
    return { ok: true as const, progress: row };
  });
}

// ---------------------------------------------------------------------------
// Practice: Chapter QCM, Adaptive Evaluation, Global Evaluation
// ---------------------------------------------------------------------------
export interface SanitizedQuestion {
  id: string;
  chapter_id: string;
  chapter_title: string;
  difficulty: number;
  stem_ro: string;
  media_slug?: string;
  multi: boolean;
  options: Array<{ label: "A" | "B" | "C" | "D"; body_ro: string }>;
}

function sanitizeQuestion(q: SeedQuestion, chapters: SeedChapter[]): SanitizedQuestion {
  const ch = chapters.find((c) => c.id === q.chapter_id);
  return {
    id: q.id,
    chapter_id: q.chapter_id,
    chapter_title: ch?.title_ro ?? "",
    difficulty: q.difficulty,
    stem_ro: q.stem_ro,
    media_slug: q.media_slug,
    multi: q.multi,
    options: q.options.map(({ label, body_ro }) => ({ label, body_ro })),
  };
}

export async function startPracticeAttempt(input: {
  userId: string;
  kind: "chapter" | "adaptive" | "global";
  chapterSlug?: string;
}) {
  const snap = await getCandidateSnapshot(input.userId);
  if (!snap?.access.coursesUnlocked) {
    return { ok: false as const, error: "Deblochează cursurile printr-o primă plată pentru a accesa evaluările." };
  }

  return mutateLocalDb((db) => {
    const catCode = snap.category.code;
    // Never expose exam-only pool questions in practice if non-exam alternatives exist,
    // or include general practice pool + adaptive/global pool cleanly without revealing answers.
    const catQuestions = db.questions.filter(
      (q) => q.category_codes.includes(catCode) && (input.kind !== "chapter" || !q.exam_pool),
    );
    const pool = catQuestions.length > 0 ? catQuestions : db.questions;

    let selected: SeedQuestion[] = [];
    let chapterId: string | null = null;

    if (input.kind === "chapter") {
      const ch = db.chapters.find((c) => c.slug === input.chapterSlug);
      if (!ch) return { ok: false as const, error: "Capitol inexistent." };
      chapterId = ch.id;
      const chPool = db.questions.filter((q) => q.chapter_id === ch.id);
      selected = shuffle(chPool).slice(0, 6);
    } else if (input.kind === "adaptive") {
      const metas: QuestionMeta[] = pool.map((q) => ({ id: q.id, chapterId: q.chapter_id, difficulty: q.difficulty }));
      const map = new Map<string, Mastery>();
      for (const m of db.mastery.filter((x) => x.user_id === input.userId)) map.set(m.chapterId, m);
      const recentIds = new Set(
        db.attempts
          .filter((a) => a.user_id === input.userId && a.kind === "adaptive")
          .slice(-2)
          .flatMap((a) => a.answers.map((ans) => ans.question_id)),
      );
      let picked = pickAdaptive(metas, map, { count: 8, now: Date.now(), recentIds });
      if (picked.length < 6) {
        picked = pickAdaptive(metas, map, { count: 8, now: Date.now() });
      }
      selected = picked.map((p) => pool.find((q) => q.id === p.id)!).filter(Boolean);
    } else {
      const metas: QuestionMeta[] = pool.map((q) => ({ id: q.id, chapterId: q.chapter_id, difficulty: q.difficulty }));
      const picked = pickGlobal(metas, Math.min(18, pool.length));
      selected = picked.map((p) => pool.find((q) => q.id === p.id)!).filter(Boolean);
    }

    const attempt: PracticeAttempt = {
      id: `att-${crypto.randomUUID().slice(0, 8)}`,
      user_id: input.userId,
      kind: input.kind,
      chapter_id: chapterId,
      question_ids: selected.map((q) => q.id),
      answers: [],
      started_at: new Date().toISOString(),
      finished_at: null,
      score: null,
      total: selected.length,
    };
    db.attempts.push(attempt);

    return {
      ok: true as const,
      attempt,
      questions: selected.map((q) => sanitizeQuestion(q, db.chapters)),
    };
  });
}

export async function submitPracticeAnswer(input: {
  userId: string;
  attemptId: string;
  questionId: string;
  chosen: string[];
  msTaken: number;
}) {
  return mutateLocalDb((db) => {
    const attempt = db.attempts.find((a) => a.id === input.attemptId && a.user_id === input.userId);
    if (!attempt) return { ok: false as const, error: "Sesiune de exercițiu inexistentă." };
    if (!attempt.question_ids.includes(input.questionId)) return { ok: false as const, error: "Întrebare invalidă." };

    const q = db.questions.find((x) => x.id === input.questionId);
    if (!q) return { ok: false as const, error: "Întrebare inexistentă." };

    const correctLabels = q.options.filter((o) => o.is_correct).map((o) => o.label);
    const isCorrect = grade(input.chosen, correctLabels);

    const existingIdx = attempt.answers.findIndex((a) => a.question_id === q.id);
    const ansRecord = {
      question_id: q.id,
      chosen: input.chosen,
      correct: isCorrect,
      ms_taken: Math.max(0, input.msTaken),
      answered_at: new Date().toISOString(),
    };
    if (existingIdx >= 0) attempt.answers[existingIdx] = ansRecord;
    else attempt.answers.push(ansRecord);

    // Update SM-2 + Elo mastery
    const now = Date.now();
    let mIdx = db.mastery.findIndex((m) => m.user_id === input.userId && m.chapterId === q.chapter_id);
    const currentM: Mastery = mIdx >= 0 ? db.mastery[mIdx] : newMastery(q.chapter_id, now);
    const updatedM = updateMastery(currentM, { id: q.id, chapterId: q.chapter_id, difficulty: q.difficulty }, isCorrect, now);
    if (mIdx >= 0) db.mastery[mIdx] = { user_id: input.userId, ...updatedM };
    else db.mastery.push({ user_id: input.userId, ...updatedM });

    const finished = attempt.answers.length >= attempt.total;
    let readiness: number | null = null;
    if (finished) {
      attempt.finished_at = new Date().toISOString();
      attempt.score = attempt.answers.filter((a) => a.correct).length;

      if (attempt.kind === "chapter" && attempt.chapter_id) {
        let cp = db.chapter_progress.find((p) => p.user_id === input.userId && p.chapter_id === attempt.chapter_id);
        if (!cp) {
          cp = { user_id: input.userId, chapter_id: attempt.chapter_id, summary_read_at: attempt.finished_at, lesson_completed_at: null, best_test_score: attempt.score };
          db.chapter_progress.push(cp);
        } else {
          cp.best_test_score = Math.max(cp.best_test_score ?? 0, attempt.score);
        }
      }

      if (attempt.kind === "global") {
        const userMasteries = db.mastery.filter((m) => m.user_id === input.userId);
        const chapterAccs = db.chapters.map((ch) => {
          const m = userMasteries.find((x) => x.chapterId === ch.id);
          return m ? accuracy(m) : 0.4;
        });
        readiness = readinessScore(attempt.score, attempt.total, chapterAccs);
        const rIdx = db.readiness.findIndex((r) => r.user_id === input.userId);
        const rRow = { user_id: input.userId, score: readiness, global_attempt_id: attempt.id, computed_at: attempt.finished_at };
        if (rIdx >= 0) db.readiness[rIdx] = rRow;
        else db.readiness.push(rRow);
      }
    }

    return {
      ok: true as const,
      correct: isCorrect,
      correctLabels,
      explanation_ro: q.explanation_ro,
      legal_ref: q.legal_ref,
      finished,
      score: attempt.score,
      total: attempt.total,
      readiness,
      updatedMastery: updatedM,
    };
  });
}

// ---------------------------------------------------------------------------
// Exam Room (strict server-side eligibility, timer, no back, anti-cheat)
// ---------------------------------------------------------------------------
function toExamState(s: ExamSessionRecord): ExamState {
  return {
    questionIds: s.question_ids,
    currentIndex: s.current_index,
    questionDeadline: s.question_deadline,
    secondsPerQuestion: s.seconds_per_question,
    status: s.status,
  };
}

function applyExamState(s: ExamSessionRecord, st: ExamState) {
  s.current_index = st.currentIndex;
  s.question_deadline = st.questionDeadline;
  s.status = st.status;
}

export async function createOrResumeExamBriefing(userId: string) {
  const snap = await getCandidateSnapshot(userId);
  if (!snap) return { ok: false as const, error: "Cont inexistent." };
  if (!snap.access.examUnlocked) {
    return { ok: false as const, error: "Examenul este blocat.", blockers: snap.access.blockers };
  }

  return mutateLocalDb((db) => {
    const existing = db.exam_sessions.find(
      (s) => s.user_id === userId && (s.status === "briefing" || s.status === "in_progress"),
    );
    if (existing) return { ok: true as const, session: existing };

    const cat = snap.category;
    const catPool = db.questions.filter((q) => q.category_codes.includes(cat.code));
    // Prioritize exam_pool questions first, then fill cleanly to category question count (capped at available bank size)
    const examPool = shuffle(catPool.filter((q) => q.exam_pool));
    const practicePool = shuffle(catPool.filter((q) => !q.exam_pool));
    const count = Math.min(cat.exam_question_count, catPool.length);
    const chosen = [...examPool, ...practicePool].slice(0, count);
    const passMark = Math.max(1, Math.round((cat.exam_pass_mark / cat.exam_question_count) * chosen.length));

    const session: ExamSessionRecord = {
      id: `ex-${crypto.randomUUID().slice(0, 8)}`,
      user_id: userId,
      category_id: cat.id,
      question_ids: chosen.map((q) => q.id),
      current_index: 0,
      question_started_at: null,
      question_deadline: null,
      seconds_per_question: cat.seconds_per_question,
      pass_mark: passMark,
      status: "briefing",
      camera_granted: false,
      answers: [],
      security_events: [],
      score: null,
      passed: null,
      started_at: null,
      finished_at: null,
      created_at: new Date().toISOString(),
    };
    db.exam_sessions.push(session);
    appendAudit(db, userId, "exam_briefing_created", "exam_sessions", session.id, { count: chosen.length, passMark });
    return { ok: true as const, session };
  });
}

export async function beginExamSession(userId: string, sessionId: string, cameraGranted: boolean) {
  const snap = await getCandidateSnapshot(userId);
  if (!snap?.access.examUnlocked) {
    return { ok: false as const, error: "Condițiile de acces la examen nu sunt îndeplinite." };
  }
  return mutateLocalDb((db) => {
    const s = db.exam_sessions.find((x) => x.id === sessionId && x.user_id === userId);
    if (!s) return { ok: false as const, error: "Sesiune de examen inexistentă." };
    if (!cameraGranted) {
      s.security_events.push({ type: "camera_denied", at: Date.now(), questionIndex: 0 });
      return { ok: false as const, error: "Camera activă este obligatorie pentru a începe examenul." };
    }
    if (s.status === "briefing") {
      const now = Date.now();
      const next = startExam(toExamState(s), now);
      applyExamState(s, next);
      s.camera_granted = true;
      s.question_started_at = now;
      s.started_at = new Date(now).toISOString();
      appendAudit(db, userId, "exam_started", "exam_sessions", s.id);
    }
    return { ok: true as const, session: s };
  });
}

function finalizeExamInDb(db: LocalDb, s: ExamSessionRecord) {
  if (s.status !== "finished" || s.score !== null) return;
  const nowIso = new Date().toISOString();
  s.finished_at = nowIso;
  s.score = s.answers.filter((a) => a.correct).length;
  s.passed = s.score >= s.pass_mark;

  const integrity = assessIntegrity(s.security_events);
  appendAudit(db, s.user_id, "exam_finished", "exam_sessions", s.id, {
    score: s.score,
    total: s.question_ids.length,
    passed: s.passed,
    integrityLevel: integrity.level,
  });

  if (s.passed) {
    const user = db.users.find((u) => u.profile.id === s.user_id)?.profile;
    const cat = db.categories.find((c) => c.id === s.category_id);
    if (user && cat) {
      const issuedMs = Date.now();
      const publicCode = generatePublicCode(crypto.randomBytes(7));
      const label = certificateLabel({ label: db.app_config.certificate_label, accredited: db.app_config.accredited });
      const hold = integrity.holdCertificate;
      const cert: CertificateRecord = {
        id: `cert-${crypto.randomUUID().slice(0, 8)}`,
        public_code: publicCode,
        user_id: s.user_id,
        session_id: s.id,
        category_code: cat.code,
        holder_name: `${user.first_name} ${user.last_name}`,
        score: s.score,
        total: s.question_ids.length,
        label_snapshot: label,
        issued_at: new Date(issuedMs).toISOString(),
        scheduled_send_at: new Date(scheduleSendAt(issuedMs, db.app_config.certificate_send_delay_hours)).toISOString(),
        status: hold ? "held" : "queued",
        hold_reason: hold ? `Alertă automată integritate (${integrity.level})` : null,
        held_by: null,
        sent_at: null,
        send_attempts: 0,
        last_error: null,
      };
      db.certificates.push(cert);
      appendAudit(db, s.user_id, "certificate_created", "certificates", cert.id, {
        publicCode,
        status: cert.status,
        scheduledSendAt: cert.scheduled_send_at,
      });
    }
  }
}

export async function getExamRoomView(userId: string, sessionId: string) {
  return mutateLocalDb((db) => {
    const s = db.exam_sessions.find((x) => x.id === sessionId && x.user_id === userId);
    if (!s) return null;

    if (s.status === "in_progress") {
      const now = Date.now();
      const { state, expired } = expireOverdue(toExamState(s), now);
      for (const idx of expired) {
        const qId = s.question_ids[idx];
        if (!s.answers.some((a) => a.idx === idx)) {
          s.answers.push({
            idx,
            question_id: qId,
            chosen: [],
            correct: false,
            timed_out: true,
            answered_at: new Date(now).toISOString(),
          });
        }
      }
      applyExamState(s, state);
      if (expired.length > 0 && state.status === "in_progress") {
        s.question_started_at = state.questionDeadline ? state.questionDeadline - s.seconds_per_question * 1000 : now;
      }
      if (state.status === "finished") finalizeExamInDb(db, s);
    }

    const qId = s.status === "in_progress" ? s.question_ids[s.current_index] : null;
    const q = qId ? db.questions.find((x) => x.id === qId) : null;
    const sanitized = q ? sanitizeQuestion(q, db.chapters) : null;
    return {
      session: {
        id: s.id,
        status: s.status,
        current_index: s.current_index,
        total_questions: s.question_ids.length,
        question_deadline: s.question_deadline,
        seconds_per_question: s.seconds_per_question,
        pass_mark: s.pass_mark,
        camera_granted: s.camera_granted,
        security_count: s.security_events.length,
      },
      question: sanitized,
      serverNow: Date.now(),
    };
  });
}

export async function submitExamQuestionAnswer(input: {
  userId: string;
  sessionId: string;
  index: number;
  chosen: string[];
}) {
  return mutateLocalDb((db) => {
    const s = db.exam_sessions.find((x) => x.id === input.sessionId && x.user_id === input.userId);
    if (!s) return { ok: false as const, error: "Sesiune inexistentă." };

    const now = Date.now();
    // Catch up any prior overdue questions first
    const overdue = expireOverdue(toExamState(s), now);
    for (const idx of overdue.expired) {
      if (!s.answers.some((a) => a.idx === idx)) {
        s.answers.push({
          idx,
          question_id: s.question_ids[idx],
          chosen: [],
          correct: false,
          timed_out: true,
          answered_at: new Date(now).toISOString(),
        });
      }
    }
    applyExamState(s, overdue.state);

    if (s.status === "finished") {
      finalizeExamInDb(db, s);
      return { ok: true as const, finished: true };
    }

    const res = submitAnswer(toExamState(s), input.index, now);
    if (!res.ok) {
      return { ok: false as const, error: res.reason === "wrong_index" ? "Nu este permisă întoarcerea sau sărirea întrebărilor." : "Examenul nu este în desfășurare." };
    }

    const qId = s.question_ids[res.recordedIndex];
    const q = db.questions.find((x) => x.id === qId);
    const correctLabels = q ? q.options.filter((o) => o.is_correct).map((o) => o.label) : [];
    const effectiveChosen = res.timedOut ? [] : input.chosen;
    const isCorrect = !res.timedOut && grade(effectiveChosen, correctLabels);

    s.answers.push({
      idx: res.recordedIndex,
      question_id: qId,
      chosen: effectiveChosen,
      correct: isCorrect,
      timed_out: res.timedOut,
      answered_at: new Date(now).toISOString(),
    });

    applyExamState(s, res.state);
    s.question_started_at = res.state.status === "in_progress" ? now : null;
    if (res.state.status === "finished") finalizeExamInDb(db, s);

    return { ok: true as const, finished: res.state.status === "finished", timedOut: res.timedOut };
  });
}

export async function logExamSecurityEvent(input: {
  userId: string;
  sessionId: string;
  type: SecurityEventType;
  questionIndex?: number | null;
  durationMs?: number;
}) {
  return mutateLocalDb((db) => {
    const s = db.exam_sessions.find((x) => x.id === input.sessionId && x.user_id === input.userId);
    if (!s || s.status !== "in_progress") return { ok: false as const };
    s.security_events.push({
      type: input.type,
      at: Date.now(),
      questionIndex: input.questionIndex ?? s.current_index,
      durationMs: input.durationMs,
    });
    return { ok: true as const, count: s.security_events.length };
  });
}

export async function getExamResultView(userId: string, sessionId: string) {
  const db = await readLocalDb();
  const s = db.exam_sessions.find((x) => x.id === sessionId && (x.user_id === userId || db.users.find((u) => u.profile.id === userId)?.profile.role === "admin"));
  if (!s) return null;
  const cat = db.categories.find((c) => c.id === s.category_id);
  const cert = db.certificates.find((c) => c.session_id === s.id) ?? null;
  const integrity: IntegrityReport = assessIntegrity(s.security_events);
  const breakdown = s.question_ids.map((qId, idx) => {
    const q = db.questions.find((x) => x.id === qId)!;
    const ans = s.answers.find((a) => a.idx === idx);
    return {
      idx,
      stem_ro: q.stem_ro,
      media_slug: q.media_slug,
      chosen: ans?.chosen ?? [],
      correctLabels: q.options.filter((o) => o.is_correct).map((o) => o.label),
      options: q.options,
      correct: ans?.correct ?? false,
      timed_out: ans?.timed_out ?? true,
      explanation_ro: q.explanation_ro,
      legal_ref: q.legal_ref,
    };
  });
  return { session: s, category: cat, certificate: cert, integrity, breakdown };
}

// ---------------------------------------------------------------------------
// Certificates & Public Verification
// ---------------------------------------------------------------------------
export async function verifyCertificatePublic(code: string) {
  const db = await readLocalDb();
  const normalized = code.trim().toUpperCase();
  const cert = db.certificates.find((c) => c.public_code === normalized);
  if (!cert) return null;
  const parts = cert.holder_name.split(" ");
  const maskedHolder = parts.length > 1 ? `${parts[0]} ${parts[1].slice(0, 1)}.` : parts[0];
  return {
    public_code: cert.public_code,
    holder_masked: maskedHolder,
    category_code: cert.category_code,
    score: cert.score,
    total: cert.total,
    issued_at: cert.issued_at,
    label: certificateLabel({ label: cert.label_snapshot, accredited: db.app_config.accredited }),
    accredited: db.app_config.accredited,
    valid: cert.status === "queued" || cert.status === "held" || cert.status === "sent",
    status: cert.status,
  };
}

export async function getCertificateForPdf(publicCode: string) {
  const db = await readLocalDb();
  const cert = db.certificates.find((c) => c.public_code === publicCode.toUpperCase());
  if (!cert) return null;
  return { cert, config: db.app_config };
}

export async function processDueCertificates(sendFn: (c: CertificateRecord, labelConfig: { label: string; accredited: boolean }, email: string | null) => Promise<void>) {
  const db = await readLocalDb();
  const now = Date.now();
  const mapped = db.certificates.map((c) => ({
    ...c,
    scheduledSendAt: new Date(c.scheduled_send_at).getTime(),
    sendAttempts: c.send_attempts,
  }));
  const due = dueForSend(mapped, now);
  const results: Array<{ code: string; status: string }> = [];

  for (const item of due) {
    const user = db.users.find((u) => u.profile.id === item.user_id)?.profile;
    try {
      await sendFn(item, { label: db.app_config.certificate_label, accredited: db.app_config.accredited }, user?.email ?? null);
      await mutateLocalDb((d) => {
        const c = d.certificates.find((x) => x.id === item.id);
        if (!c) return;
        c.status = "sent";
        c.sent_at = new Date().toISOString();
        c.send_attempts += 1;
        c.last_error = null;
        appendAudit(d, null, "certificate_sent_auto", "certificates", c.id, { publicCode: c.public_code });
      });
      results.push({ code: item.public_code, status: "sent" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "send_error";
      await mutateLocalDb((d) => {
        const c = d.certificates.find((x) => x.id === item.id);
        if (!c) return;
        c.status = "failed";
        c.send_attempts += 1;
        c.last_error = msg;
        c.scheduled_send_at = new Date(nextRetryAt(Date.now(), c.send_attempts)).toISOString();
      });
      results.push({ code: item.public_code, status: "failed" });
    }
  }
  return results;
}

export async function purgeExpiredKyc() {
  return mutateLocalDb((db) => {
    const now = Date.now();
    let purged = 0;
    for (const k of db.kyc) {
      if (!k.purged_at && new Date(k.purge_after).getTime() <= now) {
        k.id_document_name = null;
        k.selfie_name = null;
        k.purged_at = new Date(now).toISOString();
        purged++;
        appendAudit(db, null, "kyc_auto_purged", "kyc_submissions", k.id);
      }
    }
    return { purged };
  });
}

// ---------------------------------------------------------------------------
// Admin Operations
// ---------------------------------------------------------------------------
export async function getAdminOverview() {
  const db = await readLocalDb();
  return {
    config: db.app_config,
    categories: db.categories,
    chapters: db.chapters,
    questions: db.questions,
    candidates: db.users
      .filter((u) => u.profile.role === "candidate")
      .map((u) => ({
        profile: u.profile,
        kyc: db.kyc.filter((k) => k.user_id === u.profile.id).at(-1) ?? null,
        enrollment: db.enrollments.find((e) => e.user_id === u.profile.id) ?? null,
        readiness: db.readiness.find((r) => r.user_id === u.profile.id)?.score ?? null,
      })),
    payments: db.payments,
    refundRequests: db.refund_requests,
    kycSubmissions: db.kyc.map((k) => ({
      ...k,
      candidate: db.users.find((u) => u.profile.id === k.user_id)?.profile ?? null,
    })),
    examReports: db.exam_sessions
      .filter((s) => s.status === "finished")
      .map((s) => ({
        session: s,
        candidate: db.users.find((u) => u.profile.id === s.user_id)?.profile ?? null,
        integrity: assessIntegrity(s.security_events),
      })),
    certificates: db.certificates,
    auditLog: [...db.audit_log].reverse(),
    contactMessages: db.contact_messages,
  };
}

export async function adminReviewKyc(adminId: string, kycId: string, decision: "approved" | "rejected" | "manual_review", note?: string) {
  return mutateLocalDb((db) => {
    const k = db.kyc.find((x) => x.id === kycId);
    if (!k) return null;
    const prev = k.status;
    k.status = decision;
    k.reviewer_note = note?.trim() || k.reviewer_note;
    k.reviewed_at = new Date().toISOString();
    appendAudit(db, adminId, "kyc_reviewed", "kyc_submissions", k.id, { from: prev, to: decision, note: k.reviewer_note });
    return k;
  });
}

export async function adminUpdateCertificate(
  adminId: string,
  certId: string,
  action: "hold" | "release" | "revoked" | "send_now",
  reason?: string,
) {
  return mutateLocalDb((db) => {
    const c = db.certificates.find((x) => x.id === certId);
    if (!c) return null;
    const prev = c.status;
    if (action === "hold") {
      c.status = "held";
      c.hold_reason = reason?.trim() || "Blocat manual de administrator";
      c.held_by = adminId;
    } else if (action === "release") {
      c.status = "queued";
      c.hold_reason = null;
      c.held_by = null;
    } else if (action === "revoked") {
      c.status = "revoked";
      c.hold_reason = reason?.trim() || "Revocat de administrator";
    } else if (action === "send_now") {
      c.status = "sent";
      c.sent_at = new Date().toISOString();
      c.send_attempts += 1;
    }
    appendAudit(db, adminId, `certificate_${action}`, "certificates", c.id, { from: prev, to: c.status, reason });
    return c;
  });
}

export async function adminUpdateCategory(
  adminId: string,
  categoryId: string,
  patch: Partial<Pick<SeedCategory, "fee_ron" | "fee_eur" | "min_first_installment_ron" | "min_first_installment_eur" | "max_installments" | "readiness_threshold" | "active">>,
) {
  return mutateLocalDb((db) => {
    const c = db.categories.find((x) => x.id === categoryId);
    if (!c) return null;
    Object.assign(c, patch);
    appendAudit(db, adminId, "category_updated", "categories", c.id, patch as Record<string, unknown>);
    return c;
  });
}

export async function adminAddQuestion(
  adminId: string,
  q: Omit<SeedQuestion, "id">,
) {
  return mutateLocalDb((db) => {
    const record: SeedQuestion = { ...q, id: `q-${crypto.randomUUID().slice(0, 8)}` };
    db.questions.push(record);
    appendAudit(db, adminId, "question_created", "questions", record.id, { chapter: q.chapter_slug, difficulty: q.difficulty });
    return record;
  });
}

export async function adminDecideRefund(adminId: string, refundId: string, status: "approved" | "rejected") {
  return mutateLocalDb((db) => {
    const r = db.refund_requests.find((x) => x.id === refundId);
    if (!r) return null;
    r.status = status;
    r.decided_at = new Date().toISOString();
    appendAudit(db, adminId, `refund_${status}`, "refund_requests", r.id);
    return r;
  });
}

export async function adminUpdateConfig(adminId: string, patch: Partial<LocalDb["app_config"]>) {
  return mutateLocalDb((db) => {
    Object.assign(db.app_config, patch);
    appendAudit(db, adminId, "config_updated", "app_config", "default", patch as Record<string, unknown>);
    return db.app_config;
  });
}

export async function saveContactMessage(input: { name: string; email: string; topic: string; message: string }) {
  return mutateLocalDb((db) => {
    const msg: ContactMessageRecord = {
      id: `msg-${crypto.randomUUID().slice(0, 8)}`,
      name: input.name.trim(),
      email: input.email.trim(),
      topic: input.topic.trim(),
      message: input.message.trim(),
      created_at: new Date().toISOString(),
    };
    db.contact_messages.unshift(msg);
    return msg;
  });
}
