import "server-only";
import { redirect } from "next/navigation";
import { getCandidateSnapshot, getCurrentUser, type CandidateSnapshot } from "@/lib/data/store";

export async function requireCandidateSnapshot(nextPath = "/tablou-de-bord"): Promise<CandidateSnapshot> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/conectare?next=${encodeURIComponent(nextPath)}`);
  }
  const snap = await getCandidateSnapshot(user.id);
  if (!snap) redirect("/conectare");
  return snap;
}

export async function requireStaffUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/conectare?next=/admin");
  if (user.role !== "admin" && user.role !== "reviewer") redirect("/tablou-de-bord");
  return user;
}
