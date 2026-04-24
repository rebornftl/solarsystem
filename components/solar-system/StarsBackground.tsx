"use client";

import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Layered deep-space backdrop:
 *  - drei <Stars/> for the classic starfield
 *  - a second sparse far-field of faint points for depth
 *  - a slow-drifting cloud of coloured "cosmic dust" particles
 *
 * Kept GPU-cheap: all three layers are <Points> with a single material.
 */
export function StarsBackground() {
  return (
    <>
      <Stars radius={140} depth={70} count={3000} factor={4.5} saturation={0.15} fade speed={0.3} />
      <FarField />
      <CosmicDust />
    </>
  );
}

function FarField() {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // Spherical shell between radius 180 and 240.
      const r = 180 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.35}
        color="#e6f0ff"
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Slow-drifting cosmic dust — soft coloured particles that drift around
 * the camera frustum. Gives the scene a sense of volume and motion
 * without costing much GPU.
 */
function CosmicDust() {
  const ref = useRef<THREE.Points>(null);

  const { geometry, colors } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const count = 900;
    const positions = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#7dd3fc"), // cyan
      new THREE.Color("#c4b5fd"), // violet
      new THREE.Color("#fca5a5"), // warm rose
      new THREE.Color("#fde68a"), // golden
      new THREE.Color("#a7f3d0"), // mint
    ];

    for (let i = 0; i < count; i += 1) {
      // Disk-biased distribution: more particles near the ecliptic plane.
      const r = 30 + Math.random() * 90;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 20; // flatter distribution
      positions[i * 3 + 0] = r * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(theta);

      const col = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3 + 0] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    return { geometry: g, colors: cols };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01;
    }
  });

  // Keep reference to colors so buffer isn't GC'd (lint satisfaction).
  void colors;

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.5}
        vertexColors
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
