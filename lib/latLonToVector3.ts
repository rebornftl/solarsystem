import * as THREE from "three";

/**
 * Convert geographic coordinates to a point on a sphere of the given radius.
 * Math convention: latitude 0° & longitude 0° -> point on +X axis facing camera.
 * This matches the default equirectangular texture mapping on a BufferGeometry
 * sphere built with `new SphereGeometry(r, ...)` (Three.js uses +Z forward,
 * longitude 0 maps to +X when the geometry is not rotated).
 */
export function latLonToVector3(lat: number, lon: number, radius = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  // Flip longitude sign so textures from equirectangular NASA maps align with
  // real-world east-positive conventions.
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}
