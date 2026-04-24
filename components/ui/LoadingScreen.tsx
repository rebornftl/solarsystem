"use client";

import { motion } from "framer-motion";

export function LoadingScreen({ label = "Загружаем Вселенную..." }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-center"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent-cyan" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-glow" />
        </div>
        <p className="text-sm text-slate-300">{label}</p>
      </div>
    </motion.div>
  );
}
