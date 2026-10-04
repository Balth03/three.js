import RAPIER from '@dimforge/rapier3d-compat';
import type { GroundHit, VehicleWorldAPI } from '@taxi/shared';
import type { TileBuildResult } from '../world/tileBuilder';

export type Rapier = typeof RAPIER;

/** Collision groups (16-bit membership << 16 | filter). */
export const GROUP = {
  STATIC: 0x0001,
  PLAYER: 0x0002,
  TRAFFIC: 0x0004,
  PROP: 0x0008,
};
export const groups = (member: number, filter: number) => ((member & 0xffff) << 16) | (filter & 0xffff);

interface TilePhysics { body: RAPIER.RigidBody; colliders: RAPIER.Collider[]; mask: Uint8Array; ox: number; oz: number }

/** Rapier world + per-tile static colliders + ground queries used by vehicles. */
export class Physics implements VehicleWorldAPI {
  static async create(): Promise<Physics> {
    await RAPIER.init();
    return new Physics();
  }
  readonly R = RAPIER;
  readonly world: RAPIER.World;
  readonly eventQueue: RAPIER.EventQueue;
  private tiles = new Map<string, TilePhysics>();
  /** collider handle -> surface/material tag */
  readonly colliderTag = new Map<number, number>();
  private ray: RAPIER.Ray;
  excludeBody: RAPIER.RigidBody | null = null;
  readonly tileSize = 256;
  /** Fallback ground height when no tile is loaded (terrain sampler from the world). */
  groundFallback: ((x: number, z: number) => number) | null = null;
  roadSurfaceAt: ((x: number, z: number) => number) | null = null;

  private constructor() {
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.world.timestep = 1 / 120;
    this.world.integrationParameters.numSolverIterations = 6;
    this.eventQueue = new RAPIER.EventQueue(true);
    this.ray = new RAPIER.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 });
  }

  addTile(r: TileBuildResult): void {
    const key = `${r.i}_${r.j}`;
    if (this.tiles.has(key)) this.removeTile(r.i, r.j);
    const R = this.R;
    const body = this.world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(r.ox, 0, r.oz));
    const colliders: RAPIER.Collider[] = [];
    const sg = groups(GROUP.STATIC, GROUP.PLAYER | GROUP.TRAFFIC | GROUP.PROP);
    // heightfield: 32x32 cells over 256 m, centred on the collider origin; rapier expects column-major heights (nrows+1)*(ncols+1)
    const n = 32;
    const hm = new Float32Array((n + 1) * (n + 1));
    // rapier: rows along Z? -> we store heights[col * (nrows+1) + row] with row = z index, col = x index
    for (let ix = 0; ix <= n; ix++) for (let iz = 0; iz <= n; iz++) hm[ix * (n + 1) + iz] = r.physics.heights[iz * 33 + ix];
    const hf = R.ColliderDesc.heightfield(n, n, hm, { x: this.tileSize, y: 1, z: this.tileSize })
      .setTranslation(this.tileSize / 2, 0, this.tileSize / 2).setFriction(0.9).setCollisionGroups(sg);
    const hfc = this.world.createCollider(hf, body);
    this.colliderTag.set(hfc.handle, 1);
    colliders.push(hfc);
    if (r.physics.wallIdx.length > 0) {
      const c = this.world.createCollider(R.ColliderDesc.trimesh(r.physics.wallPos, r.physics.wallIdx).setFriction(0.25).setRestitution(0.05).setCollisionGroups(sg), body);
      this.colliderTag.set(c.handle, 2);
      colliders.push(c);
    }
    const bx = r.physics.boxes;
    for (let k = 0; k < bx.length; k += 7) {
      const q = yawQuat(bx[k + 6]);
      const c = this.world.createCollider(R.ColliderDesc.cuboid(bx[k + 3], bx[k + 4], bx[k + 5]).setTranslation(bx[k], bx[k + 1], bx[k + 2]).setRotation(q).setFriction(0.4).setCollisionGroups(sg), body);
      this.colliderTag.set(c.handle, 3);
      colliders.push(c);
    }
    const cy = r.physics.cylinders;
    for (let k = 0; k < cy.length; k += 6) {
      const c = this.world.createCollider(R.ColliderDesc.cylinder(cy[k + 4], cy[k + 3]).setTranslation(cy[k], cy[k + 1], cy[k + 2]).setFriction(0.3).setCollisionGroups(sg), body);
      this.colliderTag.set(c.handle, 10 + cy[k + 5]);
      colliders.push(c);
    }
    this.tiles.set(key, { body, colliders, mask: r.roadMask, ox: r.ox, oz: r.oz });
  }

  removeTile(i: number, j: number): void {
    const key = `${i}_${j}`;
    const t = this.tiles.get(key);
    if (!t) return;
    for (const c of t.colliders) this.colliderTag.delete(c.handle);
    this.world.removeRigidBody(t.body);
    this.tiles.delete(key);
  }

  hasTileAt(x: number, z: number): boolean {
    return this.tiles.has(`${Math.floor(x / this.tileSize)}_${Math.floor(z / this.tileSize)}`);
  }

  /** Road mask value at a point: 1 = carriageway, 0.4 = grass, 0 = sidewalk/other. Bilinear. */
  roadMaskAt(x: number, z: number): number {
    const t = this.tiles.get(`${Math.floor(x / this.tileSize)}_${Math.floor(z / this.tileSize)}`);
    if (!t) return 1;
    const fx = Math.min(254.999, Math.max(0, x - t.ox - 0.5)), fz = Math.min(254.999, Math.max(0, z - t.oz - 0.5));
    const ix = fx | 0, iz = fz | 0, tx = fx - ix, tz = fz - iz;
    const m = t.mask;
    const a = m[iz * 256 + ix], b = m[iz * 256 + ix + 1], c = m[(iz + 1) * 256 + ix], d = m[(iz + 1) * 256 + ix + 1];
    return ((a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz) / 255;
  }

  castWheelRay(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxDist: number, out: GroundHit): boolean {
    const ray = this.ray;
    ray.origin.x = ox; ray.origin.y = oy; ray.origin.z = oz;
    ray.dir.x = dx; ray.dir.y = dy; ray.dir.z = dz;
    const hit = this.world.castRayAndGetNormal(ray, maxDist + 0.2, true, undefined, groups(GROUP.PLAYER, GROUP.STATIC | GROUP.TRAFFIC | GROUP.PROP), undefined, this.excludeBody ?? undefined);
    if (!hit) {
      if (!this.hasTileAt(ox, oz) && this.groundFallback) {
        // no physics tile yet: analytic ground so the car never falls through the world
        const gy = this.groundFallback(ox, oz);
        const dist = (oy - gy) / Math.max(0.2, -dy);
        if (dist >= 0 && dist <= maxDist) { out.distance = dist; out.nx = 0; out.ny = 1; out.nz = 0; out.surface = 0; out.collider = -1; return true; }
      }
      return false;
    }
    let dist = hit.timeOfImpact;
    const tag = this.colliderTag.get(hit.collider.handle) ?? 0;
    let surface = 0;
    if (tag === 1) {
      // terrain: sidewalks are raised by a kerb, carriageway is not; grass/dirt is soft
      const px = ox + dx * dist, pz = oz + dz * dist;
      const m = this.roadMaskAt(px, pz);
      const road = Math.min(1, Math.max(0, (m - 0.5) * 2.2 + 0.5));
      dist -= (1 - road) * 0.14;
      if (road > 0.5) surface = this.roadSurfaceAt ? this.roadSurfaceAt(px, pz) : 0;
      else if (m > 0.3 && m < 0.5) surface = 3;
      else surface = 0;
    }
    if (dist > maxDist) return false;
    out.distance = dist;
    out.nx = hit.normal.x; out.ny = hit.normal.y; out.nz = hit.normal.z;
    out.surface = surface;
    out.collider = hit.collider.handle;
    return true;
  }

  step(): void {
    this.world.step(this.eventQueue);
  }
}

export function yawQuat(yaw: number): { x: number; y: number; z: number; w: number } {
  return { x: 0, y: Math.sin(yaw / 2), z: 0, w: Math.cos(yaw / 2) };
}
