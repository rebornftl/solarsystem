"use client";

import { useEffect } from "react";
import { useSceneStore } from "@/store/useSceneStore";

export function useReducedMotionSync() {
  const setReducedMotion = useSceneStore((s) => s.setReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [setReducedMotion]);
}
