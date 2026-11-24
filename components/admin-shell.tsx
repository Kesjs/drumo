"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  CreditCard,
  FileSearch,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  Tags,
  UserCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Prezentare generală", icon: LayoutDashboard },
  { href: "/admin/candidati", label: "Candidați", icon: Users },
  { href: "/admin/kyc", label: "Revizuire KYC", icon: UserCheck },
  { href: "/admin/plati", label: "Plăți și tranșe", icon: CreditCard },
  { href: "/admin/categorii", label: "Categorii și taxe", icon: Tags },
  { href: "/admin/capitole", label: "Capitole", icon: BookOpen },
  { href: "/admin/intrebari", label: "Banca de întrebări", icon: HelpCircle },
  { href: "/admin/antifrauda", label: "Rapoarte antifraudă", icon: ShieldAlert },
  { href: "/admin/atestate", label: "Coadă atestate", icon: Award },
  { href: "/admin/jurnal", label: "Jurnal de audit", icon: FileSearch },
];

export function AdminShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-chalk text-asphalt">
      <header className="sticky top-0 z-30 border-b-2 border-asphalt bg-asphalt text-chalk">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-cond text-xl font-bold tracking-tight">
              <span className="rounded-sm bg-signal px-2 py-0.5 text-asphalt">PermisStart</span>
            </Link>
            <span className="rounded border border-chalk/30 px-2 py-0.5 font-mono text-xs text-signal">ADMIN</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/tablou-de-bord" className="underline underline-offset-4 hover:text-signal">
              Vedere candidat
            </Link>
            <span className="hidden text-chalk/70 sm:inline">{userName}</span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded border border-chalk/30 px-3 hover:bg-white/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Ieșire</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Meniu administrare">
          <nav className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {ADMIN_NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-[42px] shrink-0 items-center gap-2.5 rounded border px-3 py-2 text-sm font-medium",
                    active
                      ? "border-asphalt bg-asphalt text-white"
                      : "border-transparent bg-surface text-asphalt hover:border-line",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
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
