import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { Panel } from "@/components/ui/primitives";
import { requireStaffUser } from "@/lib/data/require-user";
import { getAdminOverview } from "@/lib/data/store";

export const metadata = { title: "Admin · Capitole" };
export const dynamic = "force-dynamic";

export default async function AdminChaptersPage() {
  const [user, data] = await Promise.all([requireStaffUser(), getAdminOverview()]);
  return (
    <AdminShell userName={`${user.first_name} ${user.last_name}`}>
      <div className="space-y-6">
        <h1 className="font-cond text-3xl font-bold">Capitole de curs ({data.chapters.length})</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {data.chapters.map((ch, idx) => (
            <Panel key={ch.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs text-mute">
                <span className="font-mono">Capitolul {idx + 1} · {ch.slug}</span>
                <span>{ch.audio_path ? "Audio uman" : "Fallback TTS ro-RO"}</span>
              </div>
              <h2 className="font-cond text-2xl font-bold">{ch.title_ro}</h2>
              <p className="text-xs text-mute">{ch.summary_ro}</p>
              <p className="text-xs">
                Blocuri lecție: <span className="font-mono font-semibold">{ch.blocks.length}</span> · Categorii:{" "}
                <span className="font-mono">{ch.category_codes.join(", ")}</span>
              </p>
              <Link href={`/capitole/${ch.slug}`} className="inline-block text-xs font-semibold text-sign underline">
                Previzualizează capitolul
              </Link>
            </Panel>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
