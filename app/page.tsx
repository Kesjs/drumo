import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import {
  Hero,
  SignsMarquee,
  Trust,
  Journey,
  Categories,
  Payment,
  Exam,
  Certificate,
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
        <SignsMarquee />
        <Trust />
        <Journey />
        <Categories />
        <Payment />
        <Exam />
        <Certificate />
        <Faq />
        <FinalCta />
      </main>
      <PublicFooter />
    </>
  );
}
