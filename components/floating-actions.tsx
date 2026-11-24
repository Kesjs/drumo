"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { WHATSAPP } from "@/lib/config";
import { EASE_OUT } from "@/lib/ui";

// Pagini cu formulare: ascundem WhatsApp ca să nu acopere butoanele de trimitere.
const NO_WHATSAPP = ["/inscriere", "/conectare", "/contact", "/plata", "/verificare-identitate"];

/**
 * Butoane plutitoare, mereu în dreapta jos.
 * Mobil: doar WhatsApp (iconiță). Desktop: WhatsApp cu text + „înapoi sus” după un scroll lung.
 */
export function FloatingActions() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const hideWhatsApp = NO_WHATSAPP.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const [showTop, setShowTop] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 600);
    const onScroll = () => setShowTop(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const href = `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(WHATSAPP.message)}`;
  const pop = { initial: { opacity: 0, y: 16, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16, scale: 0.9 } };

  return (
    <div className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop ? (
          <motion.button
            type="button"
            {...pop}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
            aria-label="Înapoi sus"
            className="pointer-events-auto hidden h-12 w-12 place-items-center rounded border border-line bg-white sm:grid text-asphalt shadow-lift transition-colors hover:bg-chalk"
          >
            <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {ready && !hideWhatsApp ? (
          <motion.a
            {...pop}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Scrie-ne pe WhatsApp"
            className="pointer-events-auto flex h-12 items-center gap-2 rounded bg-[#25D366] px-3 font-semibold sm:h-14 sm:px-4 text-asphalt shadow-lift transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
          >
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
            <span className="hidden sm:inline">WhatsApp</span>
          </motion.a>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
