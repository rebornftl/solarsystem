"use client";

import { useCursor, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { CelestialBody } from "@/types";
import { useSceneStore } from "@/store/useSceneStore";

interface PlanetMeshProps {
  body: CelestialBody;
  /** Pre-resolved orbit radius in the current scale mode. */
  orbitRadius: number;
  /** Pre-resolved render radius in the current scale mode. */
  renderRadius: number;
  /** Optional phase offset so planets start at different angles. */
  phaseOffset?: number;
}

/**
 * A single celestial body:
 *  - Orbits around the origin via a parent pivot group (`orbitRef`).
 *  - Rotates on its own axis via `meshRef`.
 *  - Emits click/hover interactions through the shared Zustand store.
 *  - Uses a high-quality equirectangular texture when one is provided;
 *    falls back to a procedural color material otherwise.
 */
export function PlanetMesh({ body, orbitRadius, renderRadius, phaseOffset = 0 }: PlanetMeshProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const selectBody = useSceneStore((s) => s.selectBody);
  const hoverBody = useSceneStore((s) => s.hoverBody);
  const isPaused = useSceneStore((s) => s.isPaused);
  const timeScale = useSceneStore((s) => s.timeScale);
  const selectedBodyId = useSceneStore((s) => s.selectedBodyId);
  const hoveredBodyId = useSceneStore((s) => s.hoveredBodyId);

  const [localHover, setLocalHover] = useState(false);
  // Drei helper that sets/unsets the canvas cursor cleanly, even across unmounts.
  useCursor(localHover);

  useFrame((_, delta) => {
    if (isPaused) return;
    const dt = delta * timeScale;

    if (orbitRef.current && body.type === "planet") {
      orbitRef.current.rotation.y += body.orbitSpeed * dt * 0.25;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += body.rotationSpeed * dt;
    }
  });

  const isSelected = selectedBodyId === body.id;
  const isHighlighted = localHover || hoveredBodyId === body.id;
  const haloScale = isSelected ? 1.4 : localHover ? 1.25 : 1.1;

  return (
    <group
      ref={orbitRef}
      rotation-y={phaseOffset}
      onClick={(e) => {
        e.stopPropagation();
        selectBody(body.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setLocalHover(true);
        hoverBody(body.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setLocalHover(false);
        hoverBody(null);
      }}
    >
      <group position={[orbitRadius, 0, 0]}>
        {/* Axial tilt + self-rotation */}
        <group rotation-z={(body.axialTilt * Math.PI) / 180}>
          <mesh ref={meshRef} castShadow receiveShadow>
            <sphereGeometry args={[renderRadius, 128, 128]} />
            <PlanetMaterial body={body} highlighted={isHighlighted} />
          </mesh>

          {body.ring && <PlanetRing body={body} renderRadius={renderRadius} />}
        </group>

        {/* Soft halo — scales up on hover/selection. */}
        <mesh scale={haloScale}>
          <sphereGeometry args={[renderRadius * 1.08, 24, 24]} />
          <meshBasicMaterial
            color={body.color}
            transparent
            opacity={localHover || isSelected ? 0.18 : 0.08}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Material is factored out so we can call `useTexture` conditionally
 * (it must be called unconditionally at the top of the component that
 * needs the texture).
 */
function PlanetMaterial({ body, highlighted }: { body: CelestialBody; highlighted: boolean }) {
  if (body.textureUrl) {
    return <TexturedMaterial body={body} highlighted={highlighted} url={body.textureUrl} />;
  }
  if (body.type === "star") {
    return (
      <meshStandardMaterial
        color={body.color}
        emissive={body.color}
        emissiveIntensity={body.emissiveIntensity ?? 1.5}
        toneMapped={false}
      />
    );
  }
  return (
    <meshStandardMaterial
      color={body.color}
      roughness={0.85}
      metalness={0.05}
      emissive={body.color}
      emissiveIntensity={highlighted ? 0.25 : 0.05}
    />
  );
}

function TexturedMaterial({
  body,
  highlighted,
  url,
}: {
  body: CelestialBody;
  highlighted: boolean;
  url: string;
}) {
  const texture = useTexture(url);
  // Equirectangular maps look best with max anisotropy + sRGB encoding.
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;

  if (body.type === "star") {
    return (
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        // Additive-friendly, no lighting for the Sun.
      />
    );
  }
  return (
    <meshStandardMaterial
      map={texture}
      roughness={0.9}
      metalness={0.0}
      emissive={body.color}
      emissiveIntensity={highlighted ? 0.18 : 0.015}
    />
  );
}

function PlanetRing({ body, renderRadius }: { body: CelestialBody; renderRadius: number }) {
  const ring = body.ring!;
  const inner = renderRadius * (ring.innerRadius / Math.max(body.radius, 0.1));
  const outer = renderRadius * (ring.outerRadius / Math.max(body.radius, 0.1));

  // Rebuild ring UVs so a 1-D gradient texture maps radially (the default
  // ring UVs are useless for banded planetary rings).
  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(inner, outer, 128, 4);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const uv = geo.attributes.uv as THREE.BufferAttribute;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i += 1) {
      v3.fromBufferAttribute(pos, i);
      const radius = v3.length();
      const u = (radius - inner) / (outer - inner);
      uv.setXY(i, u, 1);
    }
    uv.needsUpdate = true;
    return geo;
  }, [inner, outer]);

  return (
    <mesh rotation-x={Math.PI / 2}>
      <primitive object={geometry} attach="geometry" />
      {body.ringTextureUrl ? (
        <TexturedRingMaterial url={body.ringTextureUrl} />
      ) : (
        <meshBasicMaterial
          color={ring.color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      )}
    </mesh>
  );
}

function TexturedRingMaterial({ url }: { url: string }) {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return (
    <meshBasicMaterial
      map={texture}
      alphaMap={texture}
      side={THREE.DoubleSide}
      transparent
      depthWrite={false}
      alphaTest={0.01}
    />
  );
}
