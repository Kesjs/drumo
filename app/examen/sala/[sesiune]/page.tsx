import { redirect } from "next/navigation";
import { ExamRoomClient } from "@/components/exam-room-client";
import { requireCandidateSnapshot } from "@/lib/data/require-user";

export const metadata = { title: "Sala de examen" };
export const dynamic = "force-dynamic";

export default async function ExamRoomPage({ params }: { params: Promise<{ sesiune: string }> }) {
  const { sesiune } = await params;
  const snap = await requireCandidateSnapshot(`/examen/sala/${sesiune}`);
  const session = snap.examSessions.find((s) => s.id === sesiune);
  if (!session) redirect("/examen/briefing");
  if (session.status === "finished") redirect(`/examen/rezultat/${sesiune}`);

  return <ExamRoomClient sessionId={sesiune} />;
}
