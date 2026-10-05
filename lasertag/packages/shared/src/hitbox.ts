import type { Agent, DamageZone } from './types.ts';
import type { Vec3 } from './math.ts';
import { GAME } from './data.ts';

/**
 * Analytic vest hitboxes (kept out of Rapier so they can be rewound for lag compensation).
 * Legs carry no sensor: rays pass through them, exactly like a real laser-tag suit.
 */
export interface HitboxPose {
  /** torso capsule segment (bottom, top) */
  tx: number; tyBottom: number; tyTop: number; tz: number; tr: number;
  head: Vec3; headR: number;
  shoulderL: Vec3; shoulderR: Vec3; shoulderRad: number;
  blaster: Vec3; blasterR: number;
  fwdX: number; fwdZ: number;
}

export const createPose = (): HitboxPose => ({
  tx: 0, tyBottom: 0, tyTop: 0, tz: 0, tr: 0.27,
  head: { x: 0, y: 0, z: 0 }, headR: 0.16,
  shoulderL: { x: 0, y: 0, z: 0 }, shoulderR: { x: 0, y: 0, z: 0 }, shoulderRad: 0.12,
  blaster: { x: 0, y: 0, z: 0 }, blasterR: 0.11,
  fwdX: 0, fwdZ: -1,
});

/** Vertical offset applied to the upper body when crouched. */
export const crouchDrop = () => GAME.movement.eyeHeight - GAME.movement.crouchEyeHeight;

export function computePose(a: Agent, out: HitboxPose): HitboxPose {
  const drop = a.crouched ? crouchDrop() : 0;
  const fx = -Math.sin(a.yaw), fz = -Math.cos(a.yaw);
  const rx = -fz, rz = fx; // right = forward rotated -90° about Y
  const x = a.pos.x, y = a.pos.y - drop, z = a.pos.z;
  out.fwdX = fx; out.fwdZ = fz;
  out.tx = x; out.tz = z; out.tyBottom = y + 0.98; out.tyTop = y + 1.32;
  out.head.x = x; out.head.y = y + GAME.movement.eyeHeight + 0.05; out.head.z = z;
  out.shoulderL.x = x - rx * 0.27; out.shoulderL.y = y + 1.44; out.shoulderL.z = z - rz * 0.27;
  out.shoulderR.x = x + rx * 0.27; out.shoulderR.y = y + 1.44; out.shoulderR.z = z + rz * 0.27;
  const sp = Math.sin(a.pitch), cp = Math.cos(a.pitch);
  out.blaster.x = x + fx * 0.46 * cp + rx * 0.17;
  out.blaster.y = y + 1.3 + sp * 0.46;
  out.blaster.z = z + fz * 0.46 * cp + rz * 0.17;
  return out;
}

/** Ray (unit dir) vs sphere: entry distance or Infinity. */
export function raySphere(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, c: Vec3, r: number): number {
  const lx = ox - c.x, ly = oy - c.y, lz = oz - c.z;
  const b = lx * dx + ly * dy + lz * dz;
  const cc = lx * lx + ly * ly + lz * lz - r * r;
  const disc = b * b - cc;
  if (disc < 0) return Infinity;
  const t = -b - Math.sqrt(disc);
  return t >= 0 ? t : (cc < 0 ? 0 : Infinity);
}

const _s0: Vec3 = { x: 0, y: 0, z: 0 }, _s1: Vec3 = { x: 0, y: 0, z: 0 };

/** Ray vs vertical capsule (axis x,z from y0 to y1, radius r). */
export function rayVCapsule(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number,
  cx: number, y0: number, y1: number, cz: number, r: number): number {
  // infinite cylinder in xz
  const px = ox - cx, pz = oz - cz;
  const a = dx * dx + dz * dz;
  let best = Infinity;
  if (a > 1e-9) {
    const b = px * dx + pz * dz;
    const c = px * px + pz * pz - r * r;
    const disc = b * b - a * c;
    if (disc >= 0) {
      const t = (-b - Math.sqrt(disc)) / a;
      if (t >= 0) {
        const hy = oy + dy * t;
        if (hy >= y0 && hy <= y1) best = t;
      }
    }
  }
  if (best === Infinity) {
    _s0.x = cx; _s0.y = y0; _s0.z = cz;
    _s1.x = cx; _s1.y = y1; _s1.z = cz;
    best = Math.min(raySphere(ox, oy, oz, dx, dy, dz, _s0, r), raySphere(ox, oy, oz, dx, dy, dz, _s1, r));
  }
  return best;
}

export interface RayHit { t: number; zone: DamageZone }

/** Nearest vest sensor hit along the ray, or null. */
export function rayVsPose(o: Vec3, d: Vec3, p: HitboxPose, maxT: number, out: RayHit): RayHit | null {
  let t = maxT;
  let zone: DamageZone | null = null;
  let tt = raySphere(o.x, o.y, o.z, d.x, d.y, d.z, p.head, p.headR);
  if (tt < t) { t = tt; zone = 'head'; }
  tt = raySphere(o.x, o.y, o.z, d.x, d.y, d.z, p.blaster, p.blasterR);
  if (tt < t) { t = tt; zone = 'blaster'; }
  tt = raySphere(o.x, o.y, o.z, d.x, d.y, d.z, p.shoulderL, p.shoulderRad);
  if (tt < t) { t = tt; zone = 'shoulder'; }
  tt = raySphere(o.x, o.y, o.z, d.x, d.y, d.z, p.shoulderR, p.shoulderRad);
  if (tt < t) { t = tt; zone = 'shoulder'; }
  tt = rayVCapsule(o.x, o.y, o.z, d.x, d.y, d.z, p.tx, p.tyBottom, p.tyTop, p.tz, p.tr);
  if (tt < t) {
    t = tt;
    // front plate vs back plate: which side of the torso did the ray enter?
    const hx = o.x + d.x * tt - p.tx, hz = o.z + d.z * tt - p.tz;
    const l = Math.hypot(hx, hz) || 1;
    zone = (hx * p.fwdX + hz * p.fwdZ) / l < -0.3 ? 'back' : 'chest';
  }
  if (!zone) return null;
  out.t = t; out.zone = zone;
  return out;
}
