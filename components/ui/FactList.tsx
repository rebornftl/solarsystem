export function FactList({ facts }: { facts: string[] }) {
  return (
    <ul className="space-y-2">
      {facts.map((f, i) => (
        <li
          key={i}
          className="flex gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-200"
        >
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan" aria-hidden />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}
