import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { SignupForm } from "@/components/signup-form";
import { getCurrentUser, listCategories } from "@/lib/data/store";

export const metadata = { title: "Înscriere" };
export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const [{ cat }, user, categories] = await Promise.all([searchParams, getCurrentUser(), listCategories()]);

  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">Înscriere candidat</h1>
            <p className="mt-2 max-w-[60ch] text-mute">
              Alegi categoria de permis, vezi exact taxa în RON sau EUR și nu plătești nimic până nu confirmi datele.
            </p>
          </div>
          <p className="text-sm text-mute">
            Ai deja cont?{" "}
            <Link href="/conectare" className="font-semibold text-sign underline underline-offset-4">
              Conectează-te
            </Link>
          </p>
        </div>
        <SignupForm categories={categories} initialCategoryCode={cat?.toUpperCase()} />
      </main>
      <PublicFooter />
    </>
  );
}
