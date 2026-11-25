"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { LEGAL_ENTITY } from "@/lib/config";
import { Logo } from "./logo";
import { FloatingActions } from "./floating-actions";

type NavItem =
  | { kind: "link"; href: string; label: string }
  | {
      kind: "dropdown";
      id: string;
      label: string;
      items: Array<{ href: string; label: string; desc: string }>;
    };

const PUBLIC_NAV: NavItem[] = [
  { kind: "link", href: "/categorii", label: "Categorii" },
  {
    kind: "dropdown",
    id: "platforma",
    label: "Platformă",
    items: [
      { href: "/cum-functioneaza", label: "Cum funcționează", desc: "Parcursul complet și plata în tranșe" },
      { href: "/cursuri", label: "Cursuri pe capitole", desc: "Lecții, audio și indicatoare reale" },
      { href: "/examen", label: "Examen online", desc: "Reguli, cronometru și cameră activă" },
    ],
  },
  { kind: "link", href: "/verificare", label: "Verificare atestat" },
  {
    kind: "dropdown",
    id: "informatii",
    label: "Informații",
    items: [
      { href: "/despre-noi", label: "Despre noi", desc: "Principiile și operatorul platformei" },
      { href: "/intrebari-frecvente", label: "Întrebări frecvente", desc: "Răspunsuri despre taxă și atestat" },
      { href: "/contact", label: "Contact", desc: "Suport direct în limba română" },
    ],
  },
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!openDropdown) return;
    function onDocDown(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openDropdown]);

  // Overlay mode (home): transparent over the hero, solid once the page scrolls.
  const solid = !overlay || scrolled || open;
  const tone = solid ? "text-asphalt" : "text-white";
  const navTone = solid ? "text-mute hover:text-asphalt" : "text-white/90 hover:text-white";

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
        <Link href="/" aria-label="PermiStart, prima pagină" className={`shrink-0 transition-colors ${tone}`}>
          <Logo className="h-10 sm:h-11" />
        </Link>

        <nav ref={navRef} aria-label="Navigare principală" className="hidden items-center gap-6 whitespace-nowrap text-sm lg:flex">
          {PUBLIC_NAV.map((item) => {
            if (item.kind === "link") {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpenDropdown(null)}
                  className={`relative py-1 font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-signal after:transition-transform after:duration-200 hover:after:scale-x-100 ${navTone}`}
                >
                  {item.label}
                </Link>
              );
            }

            const isOpen = openDropdown === item.id;
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.id)}
                onMouseLeave={() => setOpenDropdown((cur) => (cur === item.id ? null : cur))}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  onClick={() => setOpenDropdown((cur) => (cur === item.id ? null : item.id))}
                  className={`inline-flex items-center gap-1.5 py-1 font-medium transition-colors focus:outline-none ${navTone}`}
                >
                  <span>{item.label}</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-signal" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen ? (
                  <div className="absolute left-0 top-full pt-2">
                    <div
                      role="menu"
                      className="w-64 rounded-lg border-2 border-asphalt bg-surface p-2 text-asphalt shadow-[0_14px_30px_rgba(24,32,43,0.18)]"
                    >
                      {item.items.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          role="menuitem"
                          onClick={() => setOpenDropdown(null)}
                          className="block rounded px-3 py-2.5 transition-colors hover:bg-chalk"
                        >
                          <span className="block text-sm font-semibold text-asphalt">{sub.label}</span>
                          <span className="mt-0.5 block whitespace-normal text-xs text-mute">{sub.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
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
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded border border-line bg-surface text-asphalt lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-line bg-surface px-5 py-4 lg:hidden"
        >
          <nav aria-label="Meniu mobil" className="space-y-3">
            {PUBLIC_NAV.map((item) => {
              if (item.kind === "link") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center rounded px-2 text-base font-semibold text-asphalt hover:bg-chalk"
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <div key={item.id} className="border-t border-line pt-3">
                  <p className="px-2 font-mono text-xs font-semibold uppercase tracking-wider text-mute">{item.label}</p>
                  <div className="mt-1 flex flex-col gap-0.5">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-[44px] items-center rounded px-2 text-base font-medium text-asphalt hover:bg-chalk"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
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
    <>
    <footer className="bg-ink text-sm text-chalk/70">
      <RoadLine />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <motion.div {...col(0)} className="space-y-2">
          <Link href="/" aria-label="PermiStart, prima pagină" className="inline-block text-chalk">
            <Logo className="h-12" tagline={false} />
          </Link>
          <p className="pt-2 text-chalk">Examen auto online, în limba română.</p>
          <p>{LEGAL_ENTITY.companyPlaceholder}</p>
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
        Atestatul de reușită PermiStart confirmă rezultatul obținut pe platformă. Nu este permis de conducere și nu
        înlocuiește examenul oficial organizat de autoritățile competente.
      </div>
    </footer>
    <FloatingActions />
    </>
  );
}
