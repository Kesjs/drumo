import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { getCurrentUser } from "@/lib/data/store";

export const metadata = { title: "Politica de cookie-uri" };
export const dynamic = "force-dynamic";

export default async function CookiesPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-3xl px-5 py-16 space-y-6 text-sm leading-relaxed text-mute">
        <h1 className="font-cond text-4xl font-bold text-asphalt">Politica de cookie-uri</h1>
        <p>
          PermiStart folosește exclusiv cookie-uri strict necesare pentru funcționarea sesiunii autentificate și
          securitatea plăților. Nu folosim cookie-uri de urmărire publicitară.
        </p>
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-chalk text-asphalt">
              <tr>
                <th className="px-4 py-3 font-semibold">Cookie</th>
                <th className="px-4 py-3 font-semibold">Scop</th>
                <th className="px-4 py-3 font-semibold">Durată</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <td className="px-4 py-3 font-mono text-asphalt">drumo_session / sb-*</td>
                <td className="px-4 py-3">Menținerea sesiunii autentificate și protecția rutelor protejate.</td>
                <td className="px-4 py-3">Până la 14 zile / sesiune</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-asphalt">__stripe_mid</td>
                <td className="px-4 py-3">Prevenirea fraudei la procesarea plăților Stripe (doar la plată).</td>
                <td className="px-4 py-3">1 an (Stripe)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
