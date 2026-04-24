"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message: string | null;
  onDismiss?: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="glass-strong pointer-events-auto fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-4 py-3 text-sm text-slate-100 shadow-glow"
          onClick={onDismiss}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
