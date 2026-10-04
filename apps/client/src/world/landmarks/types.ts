import type * as THREE from 'three';

export type LandmarkModelId = 'arcDeTriomphe' | 'eiffelTower' | 'obelisk';

/** Box collider expressed in the landmark's local frame (origin at ground level, monument centre). */
export interface LandmarkCollider {
  kind: 'box';
  center: [number, number, number];
  halfExtents: [number, number, number];
  rotationY: number;
}

export interface Landmark {
  /** Local frame: origin at ground level at the monument centre, +Y up, local +X = long axis of the footprint. */
  object: THREE.Object3D;
  colliders: LandmarkCollider[];
  /** timeOfDay in hours (0..24), night = darkness factor (0 day .. 1 full night), elapsed in seconds. */
  update(timeOfDay: number, night: number, elapsed: number): void;
  dispose(): void;
}

export type LandmarkQuality = 'low' | 'high';

export interface LandmarkOptions {
  quality?: LandmarkQuality;
}
