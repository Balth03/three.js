import type { MapRamp, V3 } from './types.ts';

/**
 * The 6 vertices of a ramp wedge: indices 0-3 = bottom quad, 4-5 = top edge (high side).
 * Shared by the physics (convex hull) and the renderer so both always agree.
 */
export function rampVertices(r: MapRamp): V3[] {
  const [x0, y0, z0] = r.min;
  const [x1, y1, z1] = r.max;
  const bottom: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]];
  let top: V3[];
  switch (r.rise) {
    case 'x+': top = [[x1, y1, z0], [x1, y1, z1]]; break;
    case 'x-': top = [[x0, y1, z0], [x0, y1, z1]]; break;
    case 'z+': top = [[x0, y1, z1], [x1, y1, z1]]; break;
    case 'z-': top = [[x0, y1, z0], [x1, y1, z0]]; break;
  }
  return [...bottom, ...top];
}

/** Height of the ramp surface at (x, z), or -Infinity if outside. */
export function rampHeightAt(r: MapRamp, x: number, z: number): number {
  if (x < r.min[0] || x > r.max[0] || z < r.min[2] || z > r.max[2]) return -Infinity;
  const h = r.max[1] - r.min[1];
  let t: number;
  switch (r.rise) {
    case 'x+': t = (x - r.min[0]) / (r.max[0] - r.min[0]); break;
    case 'x-': t = (r.max[0] - x) / (r.max[0] - r.min[0]); break;
    case 'z+': t = (z - r.min[2]) / (r.max[2] - r.min[2]); break;
    case 'z-': t = (r.max[2] - z) / (r.max[2] - r.min[2]); break;
  }
  return r.min[1] + h * t;
}
