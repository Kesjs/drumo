import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import {
  Hero,
  SignsMarquee,
  Trust,
  About,
  Benefits,
  Categories,
  HowItWorks,
  Journey,
  StatsBand,
  Payment,
  Exam,
  Signs,
  Certificate,
  Testimonials,
  Faq,
  ContactSection,
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
        <About />
        <Benefits />
        <Categories />
        <HowItWorks />
        <Journey />
        <StatsBand />
        <Payment />
        <Exam />
        <Signs />
        <Certificate />
        <Testimonials />
        <Faq />
        <ContactSection />
        <FinalCta />
      </main>
      <PublicFooter />
    </>
  );
}
