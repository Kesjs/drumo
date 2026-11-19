import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { ContactForm } from "@/components/contact-form";
import { getCurrentUser } from "@/lib/data/store";
import { LEGAL_ENTITY } from "@/lib/config";

export const metadata = { title: "Contact" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <h1 className="font-cond text-4xl font-bold tracking-[-0.015em] md:text-5xl">Contact</h1>
          <p className="text-mute">
            Pentru întrebări despre cont, plăți, rambursări, protecția datelor sau verificarea unui atestat, ne poți
            scrie direct aici.
          </p>
          <div className="rounded-lg border border-line bg-surface p-5 text-sm space-y-2">
            <p className="font-semibold text-asphalt">Date de contact</p>
            <p className="text-mute">E-mail general: {LEGAL_ENTITY.contactEmail}</p>
            <p className="text-mute">Protecția datelor (GDPR): {LEGAL_ENTITY.dpoEmail}</p>
            <p className="text-mute">{LEGAL_ENTITY.companyPlaceholder}</p>
            <p className="text-mute">{LEGAL_ENTITY.addressPlaceholder}</p>
          </div>
        </div>
        <ContactForm />
      </main>
      <PublicFooter />
    </>
  );
}
