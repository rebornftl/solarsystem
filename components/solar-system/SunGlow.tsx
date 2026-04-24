"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface SunGlowProps {
  /** Render radius of the Sun body (for scaling halo layers). */
  radius: number;
}

/**
 * Real-looking Sun lighting:
 *  - A procedurally-generated radial gradient sprite provides a soft,
 *    billboarded corona that always faces the camera.
 *  - A second, larger sprite adds a wider faint halo / lens-flare bloom.
 *  - Both use AdditiveBlending so they never darken anything behind them.
 *  - The inner corona subtly "breathes" (pulsating size) — imitates
 *    granulation without costing a shader.
 *
 * No external textures needed.
 */
export function SunGlow({ radius }: SunGlowProps) {
  const innerRef = useRef<THREE.Sprite>(null);
  const outerRef = useRef<THREE.Sprite>(null);
  const rayRef = useRef<THREE.Sprite>(null);

  const { coronaTex, haloTex, rayTex } = useMemo(
    () => ({
      coronaTex: makeRadialGradient("#ffd98a", "#ff6a3d", "rgba(255,120,30,0)", 256),
      haloTex: makeRadialGradient("#fff4c8", "#ffae58", "rgba(255,160,60,0)", 256, 0.35),
      rayTex: makeRaysTexture(512),
    }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 0.9) * 0.03;
    if (innerRef.current) {
      const s = radius * 3.2 * pulse;
      innerRef.current.scale.set(s, s, 1);
    }
    if (outerRef.current) {
      const s = radius * 6.5 * (1 + Math.sin(t * 0.5) * 0.02);
      outerRef.current.scale.set(s, s, 1);
    }
    if (rayRef.current) {
      rayRef.current.material.rotation = t * 0.05;
    }
  });

  return (
    <group>
      {/* Wide, faint outer bloom. */}
      <sprite ref={outerRef}>
        <spriteMaterial
          map={haloTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.85}
        />
      </sprite>

      {/* Long radial rays — slowly rotates. */}
      <sprite ref={rayRef} scale={[radius * 9, radius * 9, 1]}>
        <spriteMaterial
          map={rayTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.35}
        />
      </sprite>

      {/* Inner dense corona that hugs the Sun. */}
      <sprite ref={innerRef}>
        <spriteMaterial
          map={coronaTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={1}
        />
      </sprite>
    </group>
  );
}

/** Builds an RGB radial-gradient canvas texture usable as a sprite map. */
function makeRadialGradient(
  inner: string,
  mid: string,
  outer: string,
  size: number,
  midStop = 0.4,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const r = size / 2;
  const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(midStop, mid);
  gradient.addColorStop(1, outer);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Radial-ray sunburst pattern (additive). */
function makeRaysTexture(size: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;

  // Faint background glow so the rays aren't pure edges.
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
  bg.addColorStop(0, "rgba(255,220,150,0.18)");
  bg.addColorStop(1, "rgba(255,200,120,0)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // 36 thin rays of varying length & opacity.
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 36; i += 1) {
    const angle = (i / 36) * Math.PI * 2;
    const len = (size / 2) * (0.55 + Math.random() * 0.4);
    const alpha = 0.12 + Math.random() * 0.25;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const g = ctx.createLinearGradient(0, 0, len, 0);
    g.addColorStop(0, `rgba(255,220,150,${alpha})`);
    g.addColorStop(1, "rgba(255,220,150,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, -1.2, len, 2.4);
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
