import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { CategoriesShowcase } from "@/components/categories-showcase";
import { getCurrentUser, listCategories } from "@/lib/data/store";

export const metadata = {
  title: "Categorii și taxe",
  description:
    "Cele 10 categorii de permis disponibile pe PermiStart: fotografii, condiții de examen, taxe unice în RON/EUR și opțiuni de plată în tranșe.",
};
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [user, categories] = await Promise.all([getCurrentUser(), listCategories()]);

  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main>
        <CategoriesShowcase categories={categories} />
      </main>
      <PublicFooter />
    </>
  );
}
