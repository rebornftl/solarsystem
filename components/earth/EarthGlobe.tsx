"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, type ElementRef } from "react";
import * as THREE from "three";
import { architecturalLandmarks } from "@/data/landmarks";
import type { ArchitecturalLandmark } from "@/types";
import { latLonToVector3 } from "@/lib/latLonToVector3";
import { GlobeMarker } from "./GlobeMarker";

const GLOBE_RADIUS = 2;
const EARTH_TEXTURE = "/textures/earth_hd.jpg";
const EARTH_NORMAL = "/textures/earth_normal.jpg";
const EARTH_CLOUDS = "/textures/earth_clouds.jpg";

interface EarthGlobeProps {
  selectedId: string | null;
  onSelect: (landmark: ArchitecturalLandmark) => void;
}

/**
 * Real Earth globe with NASA Blue Marble day map, normal map for surface
 * detail, and a translucent cloud layer rotating at its own pace.
 */
function EarthSphere({ autoRotate }: { autoRotate: boolean }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const [dayMap, normalMap, cloudsMap] = useTexture([
    EARTH_TEXTURE,
    EARTH_NORMAL,
    EARTH_CLOUDS,
  ]);
  for (const t of [dayMap, cloudsMap]) {
    t.colorSpace = THREE.SRGBColorSpace;
  }
  for (const t of [dayMap, normalMap, cloudsMap]) {
    t.anisotropy = 16;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
  }

  useFrame((_, delta) => {
    if (!autoRotate) return;
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.08;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 128, 128]} />
        <meshStandardMaterial
          map={dayMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.6, 0.6)}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Cloud layer — slightly larger sphere, soft alpha. */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[GLOBE_RADIUS * 1.012, 96, 96]} />
        <meshStandardMaterial
          map={cloudsMap}
          alphaMap={cloudsMap}
          transparent
          opacity={0.65}
          depthWrite={false}
          roughness={1}
        />
      </mesh>

      {/* Subtle atmosphere halo. */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.06, 48, 48]} />
        <meshBasicMaterial
          color="#4ea1ff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Camera focus controller — animates the camera toward the surface point of a
 * selected landmark. Uses lerp inside useFrame so it plays nicely with
 * OrbitControls (we update the controls target, not the camera's lookAt).
 */
function FocusController({ targetId }: { targetId: string | null }) {
  const camera = useThree((s) => s.camera);
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);

  const target = useMemo(() => {
    if (!targetId) return null;
    const lm = architecturalLandmarks.find((l) => l.id === targetId);
    if (!lm) return null;
    return latLonToVector3(lm.latitude, lm.longitude, GLOBE_RADIUS * 2.6);
  }, [targetId]);

  useFrame(() => {
    if (!target) return;
    camera.position.lerp(target, 0.05);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.1}
      minDistance={3.2}
      maxDistance={12}
    />
  );
}

export function EarthGlobe({ selectedId, onSelect }: EarthGlobeProps) {
  const [autoRotate, setAutoRotate] = useState(true);

  // Pause auto-rotation while the user has a marker selected (so they can read).
  useEffect(() => {
    setAutoRotate(!selectedId);
  }, [selectedId]);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-space-900">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#05060f"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <Stars radius={80} depth={30} count={800} factor={2} saturation={0} fade />

        <Suspense fallback={null}>
          <EarthSphere autoRotate={autoRotate} />
          {architecturalLandmarks.map((l) => (
            <GlobeMarker
              key={l.id}
              landmark={l}
              radius={GLOBE_RADIUS}
              selected={selectedId === l.id}
              onClick={onSelect}
            />
          ))}
          <FocusController targetId={selectedId} />
        </Suspense>
      </Canvas>

      <div className="glass pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1.5 text-[11px] text-slate-300">
        Кликните по маркеру, чтобы сфокусироваться
      </div>
    </div>
  );
}
