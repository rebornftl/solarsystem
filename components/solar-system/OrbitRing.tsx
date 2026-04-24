"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface OrbitRingProps {
  radius: number;
  color?: string;
  segments?: number;
  opacity?: number;
}

/**
 * Thin glowing orbit line drawn as a LineLoop, so it stays 1px-ish
 * regardless of camera distance — much cheaper than a TubeGeometry.
 */
export function OrbitRing({
  radius,
  color = "#4ecdc4",
  segments = 128,
  opacity = 0.35,
}: OrbitRingProps) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius, segments]);

  return (
    <lineLoop>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineLoop>
  );
}
