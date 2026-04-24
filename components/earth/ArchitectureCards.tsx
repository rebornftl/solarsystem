"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { architecturalLandmarks } from "@/data/landmarks";
import type { ArchitecturalLandmark } from "@/types";

interface Props {
  onSelect?: (landmark: ArchitecturalLandmark) => void;
  selectedId?: string | null;
}

export function ArchitectureCards({ onSelect, selectedId }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {architecturalLandmarks.map((l, idx) => (
        <motion.button
          type="button"
          key={l.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04 }}
          onClick={() => onSelect?.(l)}
          className={`group relative overflow-hidden rounded-2xl border text-left transition ${
            selectedId === l.id
              ? "border-accent-cyan/60 shadow-glow"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <div className="relative h-40 w-full overflow-hidden bg-space-800">
            <Image
              src={l.image}
              alt={l.name}
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              className="object-cover transition duration-500 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/30 to-transparent" />
            <div className="absolute bottom-2 left-3 text-xs text-slate-300">
              {l.city}, {l.country}
            </div>
          </div>
          <div className="bg-space-900/60 px-4 py-3">
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="font-medium text-slate-100">{l.name}</h4>
              <span className="text-[11px] text-slate-400">{l.year}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-slate-400">{l.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
