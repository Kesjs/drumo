import { AdminShell } from "@/components/admin-shell";
import { AdminCategoryRowEditor } from "@/components/admin-actions";
import { requireStaffUser } from "@/lib/data/require-user";
import { getAdminOverview } from "@/lib/data/store";

export const metadata = { title: "Admin · Categorii și taxe" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [user, data] = await Promise.all([requireStaffUser(), getAdminOverview()]);
  return (
    <AdminShell userName={`${user.first_name} ${user.last_name}`}>
      <div className="space-y-6">
        <div>
          <h1 className="font-cond text-3xl font-bold">Categorii și taxe configurabile</h1>
          <p className="mt-1 text-sm text-mute">
            Sumele se afișează candidaților exclusiv la înscriere și plată, niciodată în tabel public pe landing.
          </p>
        </div>
        <div className="space-y-3">
          {data.categories.map((cat) => (
            <AdminCategoryRowEditor key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
