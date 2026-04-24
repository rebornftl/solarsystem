import type { ReactNode } from "react";

interface Stat {
  label: string;
  value: ReactNode;
}

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-white/5 bg-white/5 px-3 py-3"
        >
          <dt className="text-[11px] uppercase tracking-wider text-slate-400">{s.label}</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
