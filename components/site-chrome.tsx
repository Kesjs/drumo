"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LEGAL_ENTITY } from "@/lib/config";

const PUBLIC_NAV = [
  { href: "/categorii", label: "Categorii" },
  { href: "/cum-functioneaza", label: "Cum funcționează" },
  { href: "/cursuri", label: "Cursuri" },
  { href: "/examen", label: "Examen" },
  { href: "/despre-noi", label: "Despre noi" },
  { href: "/verificare", label: "Verificare atestat" },
  { href: "/intrebari-frecvente", label: "Întrebări" },
];

const ctaBtn =
  "inline-flex min-h-[40px] items-center rounded bg-signal px-4 py-2 text-sm font-semibold text-asphalt shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-deep active:translate-y-0";

export function PublicHeader({
  loggedIn = false,
  overlay = false,
}: {
  loggedIn?: boolean;
  overlay?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Overlay mode (home): transparent over the hero, solid once the page scrolls.
  const solid = !overlay || scrolled || open;
  const tone = solid ? "text-asphalt" : "text-chalk";
  const navTone = solid ? "text-mute hover:text-asphalt" : "text-chalk/80 hover:text-chalk";

  return (
    <motion.header
      initial={reduce ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`${overlay ? "fixed inset-x-0" : "sticky"} top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${
        solid
          ? "border-b border-line bg-chalk/95 shadow-card backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 transition-[height] duration-300 ${
          solid ? "h-16" : "h-20"
        }`}
      >
        <Link href="/" className="font-cond text-2xl font-bold tracking-tight">
          <span className="rounded-sm bg-signal px-2 py-0.5 text-asphalt">Drumo</span>
        </Link>

        <nav aria-label="Navigare principală" className="hidden items-center gap-5 text-sm xl:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative py-1 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-signal after:transition-transform after:duration-200 hover:after:scale-x-100 ${navTone}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <Link href="/tablou-de-bord" className={ctaBtn}>
              Tablou de bord
            </Link>
          ) : (
            <>
              <Link
                href="/conectare"
                className={`inline-flex min-h-[40px] items-center px-3 py-2 text-sm font-semibold transition-colors hover:text-signal ${tone}`}
              >
                Conectare
              </Link>
              <Link href="/inscriere" className={ctaBtn}>
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
          className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded border xl:hidden ${
            solid ? "border-line bg-surface text-asphalt" : "border-chalk/40 bg-asphalt/40 text-chalk"
          }`}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-line bg-surface px-5 py-4 xl:hidden"
        >
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
                className="flex min-h-[44px] items-center justify-center rounded bg-signal px-4 font-semibold text-asphalt"
              >
                Tablou de bord
              </Link>
            ) : (
              <>
                <Link
                  href="/inscriere"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center justify-center rounded bg-signal px-4 font-semibold text-asphalt"
                >
                  Începe înscrierea
                </Link>
                <Link
                  href="/conectare"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center justify-center rounded border border-asphalt bg-surface px-4 font-semibold text-asphalt"
                >
                  Conectare
                </Link>
              </>
            )}
          </div>
        </motion.div>
      ) : null}
    </motion.header>
  );
}

function RoadLine() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className="h-1 w-full"
      style={{
        backgroundImage: "repeating-linear-gradient(90deg, #f2b705 0 22px, transparent 22px 40px)",
      }}
      animate={reduce ? undefined : { backgroundPositionX: ["0px", "-40px"] }}
      transition={reduce ? undefined : { duration: 1.4, ease: "linear", repeat: Infinity }}
    />
  );
}

const linkCls =
  "inline-flex min-h-[36px] items-center text-chalk/70 transition-colors hover:text-signal hover:underline";

export function PublicFooter() {
  const reduce = useReducedMotion();
  const col = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <footer className="bg-ink text-sm text-chalk/70">
      <RoadLine />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <motion.div {...col(0)} className="space-y-2">
          <p className="font-cond text-3xl font-bold text-chalk">
            <span className="rounded-sm bg-signal px-2 py-0.5 text-asphalt">Drumo</span>
          </p>
          <p className="pt-2">{LEGAL_ENTITY.companyPlaceholder}</p>
          <p>
            {LEGAL_ENTITY.cuiPlaceholder} · {LEGAL_ENTITY.regComPlaceholder}
          </p>
          <p>{LEGAL_ENTITY.addressPlaceholder}</p>
          <p>
            {LEGAL_ENTITY.contactEmail} · {LEGAL_ENTITY.phonePlaceholder}
          </p>
        </motion.div>

        <motion.div {...col(1)} className="space-y-2">
          <p className="font-semibold text-chalk">Platformă</p>
          <ul className="space-y-0.5">
            <li><Link className={linkCls} href="/categorii">Categorii de permis</Link></li>
            <li><Link className={linkCls} href="/cum-functioneaza">Cum funcționează</Link></li>
            <li><Link className={linkCls} href="/cursuri">Cursuri pe capitole</Link></li>
            <li><Link className={linkCls} href="/examen">Examen online</Link></li>
            <li><Link className={linkCls} href="/verificare">Verificare atestat</Link></li>
          </ul>
        </motion.div>

        <motion.div {...col(2)} className="space-y-2">
          <p className="font-semibold text-chalk">Informații</p>
          <ul className="space-y-0.5">
            <li><Link className={linkCls} href="/despre-noi">Despre noi</Link></li>
            <li><Link className={linkCls} href="/intrebari-frecvente">Întrebări frecvente</Link></li>
            <li><Link className={linkCls} href="/contact">Contact</Link></li>
            <li><Link className={linkCls} href="/credite-imagini">Credite imagini</Link></li>
          </ul>
        </motion.div>

        <motion.div {...col(3)} className="space-y-2">
          <p className="font-semibold text-chalk">Documente legale</p>
          <ul className="space-y-0.5">
            <li><Link className={linkCls} href="/termeni">Termeni și condiții</Link></li>
            <li><Link className={linkCls} href="/confidentialitate">Confidențialitate (GDPR)</Link></li>
            <li><Link className={linkCls} href="/cookie-uri">Cookie-uri</Link></li>
            <li><Link className={linkCls} href="/rambursari">Politica de rambursare</Link></li>
          </ul>
        </motion.div>
      </div>

      <div className="mx-auto max-w-6xl border-t border-chalk/15 px-5 py-6 text-xs text-chalk/60">
        Atestatul de reușită Drumo confirmă rezultatul obținut pe platformă. Nu este permis de conducere și nu
        înlocuiește examenul oficial organizat de autoritățile competente.
      </div>
    </footer>
  );
}
