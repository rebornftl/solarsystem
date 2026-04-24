"use client";

import { ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { DonkiFlare } from "@/types";

async function fetchFlares(): Promise<{ flares: DonkiFlare[] }> {
  const res = await fetch("/api/nasa/solar?days=30");
  if (!res.ok) throw new Error("solar_failed");
  return res.json();
}

export function SolarActivity() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["donki-flares"],
    queryFn: fetchFlares,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass rounded-2xl p-4 text-sm text-slate-400">
        Данные DONKI сейчас недоступны.
      </div>
    );
  }

  if (!data?.flares?.length) {
    return (
      <p className="text-sm text-slate-400">За последние 30 дней крупных вспышек не зарегистрировано.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {data.flares.slice(0, 8).map((f) => (
        <li
          key={f.flrID}
          className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm"
        >
          <div>
            <p className="font-medium text-slate-100">
              Класс {f.classType ?? "—"}
              {f.sourceLocation ? ` · ${f.sourceLocation}` : ""}
            </p>
            <p className="text-xs text-slate-400">Начало: {f.beginTime}</p>
          </div>
          {f.link && (
            <a
              className="inline-flex items-center gap-1 text-xs text-accent-cyan hover:underline"
              href={f.link}
              target="_blank"
              rel="noreferrer"
            >
              <span>Подробнее</span>
              <ArrowUpRight className="h-3 w-3" strokeWidth={2.25} aria-hidden />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
