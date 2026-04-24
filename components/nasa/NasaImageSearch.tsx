"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import type { NasaSearchItem } from "@/types";

async function fetchSearch(q: string): Promise<{ items: NasaSearchItem[] }> {
  const res = await fetch(`/api/nasa/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error("search_failed");
  return res.json();
}

export function NasaImageSearch({ query }: { query: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["nasa-search", query],
    queryFn: () => fetchSearch(query),
    enabled: Boolean(query),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass rounded-2xl p-4 text-sm text-slate-400">
        Не удалось получить изображения NASA.
      </div>
    );
  }

  if (!data?.items?.length) {
    return <p className="text-sm text-slate-400">По запросу ничего не найдено.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {data.items.slice(0, 9).map((item) => (
        <figure key={item.nasa_id} className="glass overflow-hidden rounded-xl">
          <div className="relative aspect-square w-full bg-space-800">
            {item.thumbnail && (
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <figcaption className="line-clamp-2 px-3 py-2 text-[11px] text-slate-400">
            {item.title}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
