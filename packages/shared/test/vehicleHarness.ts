import RAPIER from '@dimforge/rapier3d-compat';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { VehicleSim, RapierVehicleBody, type CarSpec, type DriveInput, type GroundHit } from '../src/index';

export function loadSpec(id = 'vireo_lumen'): CarSpec {
  return JSON.parse(readFileSync(resolve(__dirname, '../../../data/cars', id + '.json'), 'utf8')) as CarSpec;
}

/** Flat-ground test rig: Rapier world with a big plane, the car body and the vehicle sim. */
export async function makeRig(spec: CarSpec, opts: { mu?: number; surface?: number; wet?: number } = {}) {
  await RAPIER.init();
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = 1 / 120;
  const ground = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  world.createCollider(RAPIER.ColliderDesc.cuboid(5000, 1, 5000).setTranslation(0, -1, 0), ground);
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 0.02, 0).setCanSleep(false));
  const col = RAPIER.ColliderDesc.roundCuboid(0.83, 0.33, 2.36, 0.1).setTranslation(0, 0.72, 0)
    .setMassProperties(spec.mass, { x: 0, y: spec.comHeight - 0.72, z: spec.comOffsetZ }, { x: spec.inertia[2], y: spec.inertia[1], z: spec.inertia[0] }, { x: 0, y: 0, z: 0, w: 1 });
  world.createCollider(col, body);
  const sim = new VehicleSim(spec);
  if (opts.wet) sim.wetness = opts.wet;
  const api = new RapierVehicleBody(body);
  const ray = new RAPIER.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 });
  const vworld = {
    castWheelRay(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxDist: number, out: GroundHit): boolean {
      ray.origin = { x: ox, y: oy, z: oz }; ray.dir = { x: dx, y: dy, z: dz };
      const h = world.castRayAndGetNormal(ray, maxDist, true, undefined, undefined, undefined, body);
      if (!h) return false;
      out.distance = h.timeOfImpact; out.nx = h.normal.x; out.ny = h.normal.y; out.nz = h.normal.z; out.surface = opts.surface ?? 0; out.collider = 0;
      return true;
    },
  };
  const input: DriveInput = { throttle: 0, brake: 0, steer: 0, handbrake: 0, shiftUp: false, shiftDown: false, digitalSteer: false };
  const step = (n = 1) => { for (let i = 0; i < n; i++) { sim.step(1 / 120, input, api, vworld); world.step(); } };
  const speed = () => { const v = body.linvel(); return Math.hypot(v.x, v.z); };
  return { world, body, sim, input, step, speed };
}
