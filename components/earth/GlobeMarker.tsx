"use client";

import { useRef, useState } from "react";
import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLonToVector3 } from "@/lib/latLonToVector3";
import type { ArchitecturalLandmark } from "@/types";

interface GlobeMarkerProps {
  landmark: ArchitecturalLandmark;
  radius: number;
  selected: boolean;
  onClick: (l: ArchitecturalLandmark) => void;
}

export function GlobeMarker({ landmark, radius, selected, onClick }: GlobeMarkerProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const pos = latLonToVector3(landmark.latitude, landmark.longitude, radius * 1.01);

  // Orient the marker cone to point outwards from sphere center.
  const lookAt = pos.clone().multiplyScalar(2);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 3 + landmark.latitude) * 0.08;
    ref.current.scale.setScalar(selected ? pulse * 1.6 : pulse);
  });

  return (
    <group position={pos} onUpdate={(self) => self.lookAt(lookAt)}>
      <mesh
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onClick(landmark);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <coneGeometry args={[radius * 0.02, radius * 0.08, 12]} />
        <meshStandardMaterial
          color={selected ? "#fbbf24" : "#4ecdc4"}
          emissive={selected ? "#fbbf24" : "#4ecdc4"}
          emissiveIntensity={selected ? 1.2 : 0.6}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.015, 16, 16]} />
        <meshBasicMaterial
          color={selected ? "#fbbf24" : "#4ecdc4"}
          transparent
          opacity={selected ? 0.9 : 0.7}
        />
      </mesh>
    </group>
  );
}
