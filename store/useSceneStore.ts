"use client";

import { create } from "zustand";
import type { ScaleMode } from "@/types";

interface SceneState {
  selectedBodyId: string | null;
  hoveredBodyId: string | null;
  scaleMode: ScaleMode;
  isPaused: boolean;
  timeScale: number;
  reducedMotion: boolean;
  cameraResetSignal: number;

  selectBody: (id: string | null) => void;
  hoverBody: (id: string | null) => void;
  setScaleMode: (mode: ScaleMode) => void;
  togglePause: () => void;
  setTimeScale: (v: number) => void;
  setReducedMotion: (v: boolean) => void;
  resetCamera: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  selectedBodyId: null,
  hoveredBodyId: null,
  scaleMode: "simplified",
  isPaused: false,
  timeScale: 1,
  reducedMotion: false,
  cameraResetSignal: 0,

  selectBody: (id) => set({ selectedBodyId: id }),
  hoverBody: (id) => set({ hoveredBodyId: id }),
  setScaleMode: (scaleMode) => set({ scaleMode }),
  togglePause: () => set((s) => ({ isPaused: !s.isPaused })),
  setTimeScale: (timeScale) => set({ timeScale }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  resetCamera: () => set((s) => ({ cameraResetSignal: s.cameraResetSignal + 1 })),
}));
