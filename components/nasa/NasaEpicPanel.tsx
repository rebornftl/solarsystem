"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import type { EpicImage } from "@/types";

async function fetchEpic(): Promise<{ images: EpicImage[] }> {
  const res = await fetch("/api/nasa/epic");
  if (!res.ok) throw new Error("epic_failed");
  return res.json();
}

export function NasaEpicPanel() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["epic"],
    queryFn: fetchEpic,
  });

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-wider text-accent-cyan">
          NASA · EPIC (DSCOVR)
        </p>
        <h3 className="mt-1 font-display text-xl text-white">
          Актуальные снимки Земли из космоса
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Данные спутника DSCOVR с расстояния ~1,5 млн км от Земли.
        </p>
      </header>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      )}

      {isError && (
        <div className="glass rounded-2xl p-4 text-sm text-slate-400">
          EPIC API временно недоступен. Попробуйте позже.
        </div>
      )}

      {data?.images && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.images.map((img) => (
            <figure
              key={img.identifier}
              className="glass overflow-hidden rounded-xl"
            >
              <div className="relative aspect-square w-full bg-space-800">
                <Image
                  src={img.imageUrl}
                  alt={img.caption || "Earth from DSCOVR"}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <figcaption className="px-3 py-2 text-[11px] text-slate-400">
                {img.date}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Источник: {" "}
        <a
          className="text-accent-cyan hover:underline"
          href="https://epic.gsfc.nasa.gov/"
          target="_blank"
          rel="noreferrer"
        >
          epic.gsfc.nasa.gov
        </a>
      </p>
    </div>
  );
}
