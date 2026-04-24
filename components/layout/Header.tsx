import { Orbit } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-fuchsia-700 text-space-950 shadow-glow">
            <Orbit className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-slate-100 transition group-hover:text-accent-cyan">
            Solar Explorer
          </span>
        </Link>

        <nav
          aria-label="Основная навигация"
          className="glass hidden items-center gap-1 rounded-full px-2 py-1 text-sm sm:flex"
        >
          <a
            href="#hero"
            className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-white/5 hover:text-white"
          >
            Сцена
          </a>
          <a
            href="#apod"
            className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-white/5 hover:text-white"
          >
            NASA сегодня
          </a>
          <a
            href="#features"
            className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-white/5 hover:text-white"
          >
            Возможности
          </a>
        </nav>
      </div>
    </header>
  );
}
