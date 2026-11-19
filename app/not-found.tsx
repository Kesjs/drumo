import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="font-mono text-sm text-sign">404</p>
        <h1 className="mt-2 font-cond text-4xl font-bold">Pagina nu a fost găsită</h1>
        <p className="mt-3 text-sm text-mute">
          Adresa accesată nu există sau a fost mutată. Revino la pagina principală pentru a continua.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[44px] items-center rounded border-2 border-asphalt bg-signal px-6 py-2.5 text-sm font-semibold text-asphalt"
        >
          Înapoi la Acasă
        </Link>
      </main>
      <PublicFooter />
    </>
  );
}
