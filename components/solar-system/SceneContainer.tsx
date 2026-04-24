"use client";

import dynamic from "next/dynamic";
import { MousePointerClick } from "lucide-react";
import { Suspense, useMemo } from "react";
import { useSceneStore } from "@/store/useSceneStore";
import { getBodyById } from "@/data/planets";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { PlanetDetails } from "@/components/ui/PlanetDetails";
import { EarthDetails } from "@/components/earth/EarthDetails";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SceneControls } from "./SceneControls";
import { useReducedMotionSync } from "@/hooks/useReducedMotion";

// R3F relies on browser-only APIs; load the scene only on the client.
const SolarSystemScene = dynamic(
  () => import("./SolarSystemScene").then((m) => m.SolarSystemScene),
  { ssr: false, loading: () => <LoadingScreen /> },
);

export function SceneContainer() {
  useReducedMotionSync();

  const selectedBodyId = useSceneStore((s) => s.selectedBodyId);
  const selectBody = useSceneStore((s) => s.selectBody);

  const body = useMemo(
    () => (selectedBodyId ? getBodyById(selectedBodyId) : null),
    [selectedBodyId],
  );

  return (
    <>
      <div
        id="hero"
        className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-space-950 stars-bg"
        role="region"
        aria-label="Интерактивная 3D Солнечная система"
      >
        <Suspense fallback={<LoadingScreen />}>
          <SolarSystemScene />
        </Suspense>

        {/* Overlay chrome */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
          <div className="pointer-events-none flex items-start justify-between px-4 pt-20 sm:px-6">
            <div className="glass pointer-events-auto max-w-md rounded-2xl px-5 py-4">
              <p className="text-xs uppercase tracking-widest text-accent-cyan">Solar Explorer</p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
                Исследуйте Солнечную систему
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Вращайте сцену, приближайте планеты и кликайте по ним, чтобы узнать больше.
              </p>
            </div>
            <div className="pointer-events-auto">
              <SceneControls />
            </div>
          </div>

          <div className="pointer-events-none flex justify-center pb-6">
            <div className="glass pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-slate-300">
              <MousePointerClick className="h-3.5 w-3.5 text-accent-cyan" strokeWidth={2} aria-hidden />
              <span>Кликните по любой планете или по Солнцу</span>
            </div>
          </div>
        </div>
      </div>

      <InfoPanel
        open={Boolean(body)}
        title={body?.name ?? ""}
        subtitle={body?.englishName}
        onClose={() => selectBody(null)}
        wide={body?.id === "earth"}
      >
        {body && body.id === "earth" && <EarthDetails body={body} />}
        {body && body.id !== "earth" && <PlanetDetails body={body} />}
      </InfoPanel>
    </>
  );
}
