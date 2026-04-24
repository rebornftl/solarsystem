"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { celestialBodies } from "@/data/planets";
import { useSceneStore } from "@/store/useSceneStore";
import { CameraController } from "./CameraController";
import { OrbitRing } from "./OrbitRing";
import { PlanetMesh } from "./PlanetMesh";
import { StarsBackground } from "./StarsBackground";
import { SunGlow } from "./SunGlow";

export function SolarSystemScene() {
  const scaleMode = useSceneStore((s) => s.scaleMode);

  const bodies = useMemo(() => {
    return celestialBodies.map((b, idx) => {
      const orbitRadius =
        scaleMode === "simplified" ? b.orbitRadius : b.realisticOrbitRadius;
      const renderRadius =
        scaleMode === "simplified" ? b.radius : b.realisticRadius;
      const phaseOffset = (idx / celestialBodies.length) * Math.PI * 2;
      return { body: b, orbitRadius, renderRadius, phaseOffset };
    });
  }, [scaleMode]);

  return (
    <Canvas
      camera={{ position: [0, 14, 32], fov: 55, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#030412"]} />

      {/* Lighting: Sun is the key light; a soft fill keeps night sides legible. */}
      <ambientLight intensity={0.12} />
      <pointLight
        position={[0, 0, 0]}
        intensity={4}
        distance={260}
        decay={1.4}
        color="#ffd58a"
        castShadow
      />
      {/* A second, warmer "kicker" so rear hemispheres get a hint of colour. */}
      <pointLight position={[0, 0, 0]} intensity={1.2} distance={80} decay={2} color="#ff8a3d" />
      <hemisphereLight args={["#aac8ff", "#1b0f2a", 0.18]} />

      <Suspense fallback={null}>
        <StarsBackground />

        {/* Sun's halo / corona / rays at the origin. */}
        {(() => {
          const sun = celestialBodies.find((b) => b.type === "star");
          if (!sun) return null;
          const sunRadius = scaleMode === "simplified" ? sun.radius : sun.realisticRadius;
          return <SunGlow radius={sunRadius} />;
        })()}

        {bodies.map(({ body, orbitRadius }) =>
          body.type === "planet" ? (
            <OrbitRing
              key={`ring-${body.id}`}
              radius={orbitRadius}
              color="#7dd3fc"
              opacity={0.18}
            />
          ) : null,
        )}

        {bodies.map(({ body, orbitRadius, renderRadius, phaseOffset }) => (
          <PlanetMesh
            key={body.id}
            body={body}
            orbitRadius={orbitRadius}
            renderRadius={renderRadius}
            phaseOffset={phaseOffset}
          />
        ))}

        <CameraController />
      </Suspense>
    </Canvas>
  );
}
