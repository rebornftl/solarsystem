"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MarsRoverPhoto } from "@/types";

type Rover = "curiosity" | "perseverance" | "opportunity" | "spirit";
const ROVERS: { id: Rover; label: string; defaultSol: number }[] = [
  { id: "curiosity", label: "Curiosity", defaultSol: 1000 },
  { id: "perseverance", label: "Perseverance", defaultSol: 300 },
  { id: "opportunity", label: "Opportunity", defaultSol: 1000 },
  { id: "spirit", label: "Spirit", defaultSol: 1000 },
];

async function fetchMars(rover: Rover, sol: number): Promise<{ photos: MarsRoverPhoto[] }> {
  const res = await fetch(`/api/nasa/mars?rover=${rover}&sol=${sol}`);
  if (!res.ok) throw new Error("mars_failed");
  return res.json();
}

export function MarsRoverGallery() {
  const [rover, setRover] = useState<Rover>("curiosity");
  const sol = ROVERS.find((r) => r.id === rover)?.defaultSol ?? 1000;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mars", rover, sol],
    queryFn: () => fetchMars(rover, sol),
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs">
        {ROVERS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRover(r.id)}
            aria-pressed={rover === r.id}
            className={`rounded-full px-3 py-1 transition ${
              rover === r.id
                ? "bg-accent-cyan text-space-950"
                : "border border-white/10 text-slate-300 hover:bg-white/5"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      )}

      {isError && (
        <div className="glass rounded-2xl p-4 text-sm text-slate-400">
          Mars Rover Photos API сейчас недоступен.
        </div>
      )}

      {data?.photos && data.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.photos.slice(0, 9).map((p) => (
            <figure key={p.id} className="glass overflow-hidden rounded-xl">
              <div className="relative aspect-square w-full bg-space-800">
                <Image
                  src={p.img_src.replace(/^http:/, "https:")}
                  alt={p.camera.full_name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <figcaption className="flex items-center justify-between px-3 py-2 text-[11px] text-slate-400">
                <span>{p.camera.name}</span>
                <span>{p.earth_date}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {data?.photos && data.photos.length === 0 && (
        <p className="text-sm text-slate-400">За указанный sol фото не найдено.</p>
      )}
    </div>
  );
}
