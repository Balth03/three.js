import * as THREE from 'three';
import { createArcDeTriomphe } from './arcDeTriomphe';
import { createEiffelTower } from './eiffelTower';
import { createObelisk } from './obelisk';
import type { Landmark, LandmarkModelId, LandmarkOptions } from './types';

export type { Landmark, LandmarkCollider, LandmarkModelId, LandmarkOptions, LandmarkQuality } from './types';
export { countTriangles } from './common';

/**
 * Builds a procedural landmark model.
 *
 * Local frame: origin at ground level at the monument centre, +Y up, 1 unit = 1 m, local +X = the longest
 * horizontal side of the OSM footprint (the game sets `object.rotation.y = -rotDeg * PI / 180`).
 * - arcDeTriomphe: 44.8 m along X, 22.2 m along Z; the great arches face ±Z (Champs-Élysées axis along Z).
 * - eiffelTower: square base, sides along X and Z.
 * - obelisk: square, rotation irrelevant.
 */
export function createLandmark(id: LandmarkModelId, opts: LandmarkOptions = {}): Landmark {
  let lm: Landmark;
  switch (id) {
    case 'arcDeTriomphe':
      lm = createArcDeTriomphe(opts);
      break;
    case 'eiffelTower':
      lm = createEiffelTower(opts);
      break;
    case 'obelisk':
      lm = createObelisk(opts);
      break;
    default: {
      const never: never = id;
      throw new Error(`Unknown landmark ${String(never)}`);
    }
  }
  lm.object.userData.landmarkId = id;
  lm.object.matrixAutoUpdate = true;
  return lm;
}

/** Ids of all available landmark models. */
export const LANDMARK_MODEL_IDS: readonly LandmarkModelId[] = ['arcDeTriomphe', 'eiffelTower', 'obelisk'];

/** Convenience: world-space bounding box of a landmark (after it has been placed). */
export function landmarkBounds(lm: Landmark): THREE.Box3 {
  return new THREE.Box3().setFromObject(lm.object);
}
