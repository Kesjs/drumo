import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import {
  Hero,
  Categories,
  Journey,
  StatsBand,
  Exam,
  Payment,
  Certificate,
  Testimonials,
  Faq,
  FinalCta,
} from "@/components/landing";
import { ScrollProgress } from "@/components/motion-kit";
import { getCurrentUser } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  return (
    <>
      <ScrollProgress />
      <PublicHeader loggedIn={Boolean(user)} overlay />
      <main>
        <Hero />
        <Categories />
        <Journey />
        <StatsBand />
        <Exam />
        <Payment />
        <Certificate />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <PublicFooter />
    </>
  );
}
