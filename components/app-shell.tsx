"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Gauge,
  LayoutDashboard,
  Lock,
  LogOut,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/data/store";

export interface AppShellProps {
  userName: string;
  categoryCode: string;
  role: UserRole;
  coursesUnlocked: boolean;
  examUnlocked: boolean;
  children: React.ReactNode;
}

export function AppShell({
  userName,
  categoryCode,
  role,
  coursesUnlocked,
  examUnlocked,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/tablou-de-bord", label: "Tablou de bord", icon: LayoutDashboard, locked: false },
    { href: "/verificare-identitate", label: "Verificare identitate", icon: UserCheck, locked: false },
    { href: "/plata", label: "Plată și tranșe", icon: CreditCard, locked: false },
    { href: "/capitole", label: "Cursuri pe capitole", icon: BookOpen, locked: !coursesUnlocked },
    { href: "/evaluare-adaptiva", label: "Evaluare adaptivă", icon: Gauge, locked: !coursesUnlocked },
    { href: "/evaluare-globala", label: "Evaluare globală", icon: ClipboardCheck, locked: !coursesUnlocked },
    { href: "/examen/briefing", label: "Examen teoretic", icon: ShieldCheck, locked: !examUnlocked },
    { href: "/atestat", label: "Atestat de reușită", icon: Award, locked: false },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-chalk text-asphalt">
      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-cond text-xl font-bold tracking-tight text-asphalt">
              <span className="rounded-sm bg-signal px-2 py-0.5 text-asphalt">PermisStart</span>
            </Link>
            <span className="rounded border border-line bg-chalk px-2 py-0.5 font-mono text-xs font-medium text-asphalt">
              Cat. {categoryCode}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {(role === "admin" || role === "reviewer") && (
              <Link
                href="/admin"
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-asphalt bg-chalk px-3 py-1.5 text-xs font-semibold text-asphalt hover:bg-signal/20"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Admin</span>
              </Link>
            )}
            <span className="hidden text-mute sm:inline">{userName}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-asphalt hover:bg-chalk"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Ieșire</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[248px_1fr]">
        <aside aria-label="Meniu candidat" className="space-y-1">
          <nav className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-[44px] shrink-0 items-center justify-between gap-2.5 rounded border px-3 py-2 text-sm font-medium transition-colors duration-150",
                    active
                      ? "border-asphalt bg-asphalt text-white"
                      : "border-transparent bg-surface text-asphalt hover:border-line hover:bg-white",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.locked ? (
                    <Lock className={cn("h-3.5 w-3.5 shrink-0", active ? "text-signal" : "text-mute")} aria-label="Blocat" />
                  ) : item.href === "/capitole" && coursesUnlocked ? (
                    <CheckCircle2 className={cn("h-3.5 w-3.5 shrink-0", active ? "text-signal" : "text-ok")} />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
