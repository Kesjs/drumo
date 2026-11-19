"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LEGAL_ENTITY } from "@/lib/config";

const PUBLIC_NAV = [
  { href: "/categorii", label: "Categorii" },
  { href: "/cum-functioneaza", label: "Cum funcționează" },
  { href: "/cursuri", label: "Cursuri" },
  { href: "/examen", label: "Examen" },
  { href: "/verificare", label: "Verificare atestat" },
  { href: "/intrebari-frecvente", label: "Întrebări" },
];

export function PublicHeader({ loggedIn = false }: { loggedIn?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-chalk/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="font-cond text-2xl font-bold tracking-tight text-asphalt">
          <span className="rounded-sm bg-signal px-2 py-0.5 text-asphalt">Drumo</span>
        </Link>

        <nav aria-label="Navigare principală" className="hidden items-center gap-6 text-sm text-mute lg:flex">
          {PUBLIC_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-asphalt">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <Link
              href="/tablou-de-bord"
              className="inline-flex min-h-[40px] items-center rounded border-2 border-asphalt bg-signal px-4 py-2 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
            >
              Tablou de bord
            </Link>
          ) : (
            <>
              <Link
                href="/conectare"
                className="inline-flex min-h-[40px] items-center px-3 py-2 text-sm font-semibold text-asphalt hover:text-sign"
              >
                Conectare
              </Link>
              <Link
                href="/inscriere"
                className="inline-flex min-h-[40px] items-center rounded border-2 border-asphalt bg-signal px-4 py-2 text-sm font-semibold text-asphalt hover:bg-[#e0a900]"
              >
                Înscrie-te
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Închide meniul" : "Deschide meniul"}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded border border-line bg-surface text-asphalt lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-surface px-5 py-4 lg:hidden">
          <nav aria-label="Meniu mobil" className="flex flex-col gap-1">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center rounded px-2 text-base font-medium text-asphalt hover:bg-chalk"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
            {loggedIn ? (
              <Link
                href="/tablou-de-bord"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center justify-center rounded border-2 border-asphalt bg-signal px-4 font-semibold text-asphalt"
              >
                Tablou de bord
              </Link>
            ) : (
              <>
                <Link
                  href="/inscriere"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center justify-center rounded border-2 border-asphalt bg-signal px-4 font-semibold text-asphalt"
                >
                  Începe înscrierea
                </Link>
                <Link
                  href="/conectare"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center justify-center rounded border-2 border-asphalt bg-surface px-4 font-semibold text-asphalt"
                >
                  Conectare
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t-2 border-asphalt bg-chalk py-12 text-sm text-mute">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-2">
          <p className="font-cond text-xl font-bold text-asphalt">Drumo</p>
          <p>{LEGAL_ENTITY.companyPlaceholder}</p>
          <p>
            {LEGAL_ENTITY.cuiPlaceholder} · {LEGAL_ENTITY.regComPlaceholder}
          </p>
          <p>{LEGAL_ENTITY.addressPlaceholder}</p>
          <p>
            {LEGAL_ENTITY.contactEmail} · {LEGAL_ENTITY.phonePlaceholder}
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-asphalt">Platformă</p>
          <ul className="space-y-1.5">
            <li><Link className="hover:text-asphalt hover:underline" href="/categorii">Categorii de permis</Link></li>
            <li><Link className="hover:text-asphalt hover:underline" href="/cum-functioneaza">Cum funcționează</Link></li>
            <li><Link className="hover:text-asphalt hover:underline" href="/cursuri">Cursuri pe capitole</Link></li>
            <li><Link className="hover:text-asphalt hover:underline" href="/examen">Examen online</Link></li>
            <li><Link className="hover:text-asphalt hover:underline" href="/verificare">Verificare atestat</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-asphalt">Informații</p>
          <ul className="space-y-1.5">
            <li><Link className="hover:text-asphalt hover:underline" href="/despre-noi">Despre noi</Link></li>
            <li><Link className="hover:text-asphalt hover:underline" href="/intrebari-frecvente">Întrebări frecvente</Link></li>
            <li><Link className="hover:text-asphalt hover:underline" href="/contact">Contact</Link></li>
            <li><Link className="hover:text-asphalt hover:underline" href="/credite-imagini">Credite imagini</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-asphalt">Documente legale</p>
          <ul className="space-y-1.5">
            <li><Link className="hover:text-asphalt hover:underline" href="/termeni">Termeni și condiții</Link></li>
            <li><Link className="hover:text-asphalt hover:underline" href="/confidentialitate">Confidențialitate (GDPR)</Link></li>
            <li><Link className="hover:text-asphalt hover:underline" href="/cookie-uri">Cookie-uri</Link></li>
            <li><Link className="hover:text-asphalt hover:underline" href="/rambursari">Politica de rambursare</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-line px-5 pt-6 text-xs text-mute">
        Atestatul de reușită Drumo confirmă rezultatul obținut pe platformă. Nu este permis de conducere și nu
        înlocuiește examenul oficial organizat de autoritățile competente.
      </div>
    </footer>
  );
}
