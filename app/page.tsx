import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { Hero, Trust, Categories, Journey, Payment, Exam, Signs, Certificate, Faq, ContactSection, FinalCta } from "@/components/landing";
import { getCurrentUser } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main>
        <Hero />
        <Trust />
        <Categories />
        <Journey />
        <Payment />
        <Exam />
        <Signs />
        <Certificate />
        <Faq />
        <ContactSection />
        <FinalCta />
      </main>
      <PublicFooter />
    </>
  );
}
