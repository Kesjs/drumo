import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { LoginForm } from "@/components/login-form";
import { isSupabaseConfigured } from "@/lib/config";
import { getCurrentUser } from "@/lib/data/store";

export const metadata = { title: "Conectare" };
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, user] = await Promise.all([searchParams, getCurrentUser()]);
  const nextPath = next && next.startsWith("/") ? next : "/tablou-de-bord";

  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-md px-5 py-16">
        <h1 className="font-cond text-4xl font-bold">Conectare</h1>
        <p className="mt-2 text-sm text-mute">
          Continuă pregătirea, verifică starea plăților sau intră la examen.
        </p>
        <div className="mt-6">
          <LoginForm nextPath={nextPath} localTestHint={!isSupabaseConfigured()} />
        </div>
        <p className="mt-4 text-center text-sm text-mute">
          Nu ai cont?{" "}
          <Link href="/inscriere" className="font-semibold text-sign underline underline-offset-4">
            Înscrie-te aici
          </Link>
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
