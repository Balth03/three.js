import RAPIER from '@dimforge/rapier3d-compat';
import type { MapDef } from './map/types.ts';
import { rampVertices } from './map/geometry.ts';

export { RAPIER };

let ready: Promise<void> | null = null;
/** Initialise the Rapier WASM module once. */
export function initPhysics(): Promise<void> {
  if (!ready) ready = RAPIER.init().then(() => undefined);
  return ready;
}

/** Collision groups: membership in the high 16 bits, filter in the low 16 bits. */
export const GROUP_STATIC = 0x0001;
export const GROUP_AGENT = 0x0002;
export const groups = (membership: number, filter: number) => ((membership & 0xffff) << 16) | (filter & 0xffff);
/** Query groups that only see the static arena. */
export const QUERY_STATIC = groups(0xffff, GROUP_STATIC);
export const AGENT_GROUPS = groups(GROUP_AGENT, GROUP_STATIC | GROUP_AGENT);

export type Surface = 'wall' | 'mirror';

export interface ArenaPhysics {
  world: RAPIER.World;
  surfaces: Map<number, Surface>;
}

/** Build the static Rapier world for a map. No rigid bodies: fixed colliders only. */
export function buildArenaPhysics(map: MapDef): ArenaPhysics {
  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  const surfaces = new Map<number, Surface>();
  const add = (desc: RAPIER.ColliderDesc, surface: Surface) => {
    desc.setCollisionGroups(groups(GROUP_STATIC, 0xffff));
    const c = world.createCollider(desc);
    surfaces.set(c.handle, surface);
    return c;
  };

  const { min, max } = map.bounds;
  const cx = (min[0] + max[0]) / 2, cz = (min[1] + max[1]) / 2;
  const hx = (max[0] - min[0]) / 2 + 2, hz = (max[1] - min[1]) / 2 + 2;
  add(RAPIER.ColliderDesc.cuboid(hx, 0.5, hz).setTranslation(cx, -0.5, cz), 'wall');
  add(RAPIER.ColliderDesc.cuboid(hx, 0.5, hz).setTranslation(cx, map.ceiling + 0.5, cz), 'wall');

  for (const b of map.boxes) {
    if (b.ghost) continue;
    const sx = (b.max[0] - b.min[0]) / 2, sy = (b.max[1] - b.min[1]) / 2, sz = (b.max[2] - b.min[2]) / 2;
    add(
      RAPIER.ColliderDesc.cuboid(sx, sy, sz).setTranslation(b.min[0] + sx, b.min[1] + sy, b.min[2] + sz),
      b.mat === 'mirror' ? 'mirror' : 'wall',
    );
  }
  for (const r of map.ramps) {
    const pts = new Float32Array(rampVertices(r).flat());
    const desc = RAPIER.ColliderDesc.convexHull(pts);
    if (desc) add(desc, 'wall');
  }
  world.step();
  return { world, surfaces };
}
