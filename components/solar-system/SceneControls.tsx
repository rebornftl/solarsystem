"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useSceneStore } from "@/store/useSceneStore";
import { Button } from "@/components/ui/Button";

export function SceneControls() {
  const scaleMode = useSceneStore((s) => s.scaleMode);
  const setScaleMode = useSceneStore((s) => s.setScaleMode);
  const isPaused = useSceneStore((s) => s.isPaused);
  const togglePause = useSceneStore((s) => s.togglePause);
  const resetCamera = useSceneStore((s) => s.resetCamera);

  return (
    <div className="glass pointer-events-auto flex flex-wrap items-center gap-2 rounded-2xl px-3 py-2">
      <div className="flex items-center gap-1 rounded-full bg-white/5 p-1 text-xs">
        <button
          type="button"
          aria-pressed={scaleMode === "simplified"}
          onClick={() => setScaleMode("simplified")}
          className={`rounded-full px-3 py-1 transition ${
            scaleMode === "simplified"
              ? "bg-accent-cyan text-space-950"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Упрощённо
        </button>
        <button
          type="button"
          aria-pressed={scaleMode === "realistic"}
          onClick={() => setScaleMode("realistic")}
          className={`rounded-full px-3 py-1 transition ${
            scaleMode === "realistic"
              ? "bg-accent-cyan text-space-950"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Реалистичнее
        </button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={togglePause}
        aria-pressed={isPaused}
        className="inline-flex items-center gap-1.5"
      >
        {isPaused ? (
          <Play className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        ) : (
          <Pause className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        )}
        <span>{isPaused ? "Запустить" : "Пауза"}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={resetCamera}
        className="inline-flex items-center gap-1.5"
      >
        <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        <span>Сбросить камеру</span>
      </Button>
    </div>
  );
}
