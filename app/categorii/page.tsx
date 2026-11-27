import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { CategoriesShowcase } from "@/components/categories-showcase";
import { getCurrentUser, listCategories } from "@/lib/data/store";

export const metadata = {
  title: "Categorii europene și taxe",
  description:
    "Toate cele 15 categorii europene de permis disponibile pe PermiStart (AM – DE): fotografii, condiții de examen, taxe unice în RON/EUR și plată în tranșe.",
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
