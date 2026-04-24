"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

interface InfoPanelProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  /** Wider variant for Earth with tabs & globe. */
  wide?: boolean;
}

export function InfoPanel({ open, title, subtitle, onClose, children, wide = false }: InfoPanelProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            aria-hidden
            className="fixed inset-0 z-40 bg-space-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className={`glass-strong fixed right-0 top-0 z-50 flex h-full w-full flex-col overflow-hidden shadow-glow ${
              wide ? "max-w-3xl" : "max-w-xl"
            }`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
                  {title}
                </h2>
                {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
