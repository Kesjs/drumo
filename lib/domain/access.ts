// Single source of truth for what a candidate may access. Mirrors the SQL
// helpers `courses_unlocked` and `exam_eligibility`; both must agree.
export type KycStatus = "not_started" | "pending" | "manual_review" | "approved" | "rejected";

export interface AccessInput {
  totalDue: number | null;
  totalPaid: number;
  kyc: KycStatus;
  readiness: number | null;
  readinessThreshold: number;
}

export type ExamBlocker = "kyc" | "payment_none" | "payment_partial" | "readiness";

export interface Access {
  coursesUnlocked: boolean;
  feeFullyPaid: boolean;
  examUnlocked: boolean;
  blockers: ExamBlocker[];
}

export function computeAccess(i: AccessInput): Access {
  const coursesUnlocked = i.totalDue !== null && i.totalPaid > 0;
  const feeFullyPaid = i.totalDue !== null && i.totalPaid >= i.totalDue;
  const blockers: ExamBlocker[] = [];
  if (i.kyc !== "approved") blockers.push("kyc");
  if (!coursesUnlocked) blockers.push("payment_none");
  else if (!feeFullyPaid) blockers.push("payment_partial");
  if (i.readiness === null || i.readiness < i.readinessThreshold) blockers.push("readiness");
  return { coursesUnlocked, feeFullyPaid, examUnlocked: blockers.length === 0, blockers };
}
