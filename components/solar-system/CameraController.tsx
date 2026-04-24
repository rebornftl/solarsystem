"use client";

import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, type ElementRef } from "react";
import * as THREE from "three";
import { useSceneStore } from "@/store/useSceneStore";

const DEFAULT_POS = new THREE.Vector3(0, 14, 32);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

/**
 * Thin wrapper around drei's OrbitControls that reacts to a "reset" signal
 * from the store. Using a signal (incremented counter) avoids the common
 * pitfall of trying to re-instantiate controls on every reset.
 */
export function CameraController() {
  const resetSignal = useSceneStore((s) => s.cameraResetSignal);
  const camera = useThree((s) => s.camera);
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    camera.position.copy(DEFAULT_POS);
    controlsRef.current.target.copy(DEFAULT_TARGET);
    controlsRef.current.update();
  }, [resetSignal, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={6}
      maxDistance={90}
      makeDefault
    />
  );
}
