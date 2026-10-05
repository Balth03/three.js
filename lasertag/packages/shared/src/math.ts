export interface Vec3 { x: number; y: number; z: number }

export const v3 = (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z });
export const set3 = (o: Vec3, x: number, y: number, z: number): Vec3 => { o.x = x; o.y = y; o.z = z; return o; };
export const copy3 = (o: Vec3, a: Vec3): Vec3 => { o.x = a.x; o.y = a.y; o.z = a.z; return o; };
export const dot3 = (a: Vec3, b: Vec3) => a.x * b.x + a.y * b.y + a.z * b.z;
export const len3 = (a: Vec3) => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
export const dist3 = (a: Vec3, b: Vec3) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
export const distXZ = (a: Vec3, b: Vec3) => Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2);
export const norm3 = (o: Vec3): Vec3 => {
  const l = len3(o);
  if (l > 1e-9) { o.x /= l; o.y /= l; o.z /= l; }
  return o;
};

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const saturate = (v: number) => clamp(v, 0, 1);
export const DEG = Math.PI / 180;
/** Wrap an angle to (-PI, PI]. */
export const wrapAngle = (a: number) => {
  a = (a + Math.PI) % (Math.PI * 2);
  if (a < 0) a += Math.PI * 2;
  return a - Math.PI;
};
/** Exponential smoothing factor for a rate (1/s) over dt. Frame-rate independent. */
export const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

/**
 * View convention (same as a three.js camera): yaw rotates about +Y, yaw = 0 looks toward -Z;
 * pitch > 0 looks up.
 */
export function forwardFromAngles(yaw: number, pitch: number, out: Vec3): Vec3 {
  const cp = Math.cos(pitch);
  out.x = -Math.sin(yaw) * cp;
  out.y = Math.sin(pitch);
  out.z = -Math.cos(yaw) * cp;
  return out;
}
export function yawToward(dx: number, dz: number) {
  return Math.atan2(-dx, -dz);
}

/** Small, fast, deterministic PRNG (mulberry32). */
export class Rng {
  private s: number;
  constructor(seed: number) { this.s = seed >>> 0 || 0x9e3779b9; }
  next(): number {
    let t = (this.s = (this.s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a: number, b: number) { return a + (b - a) * this.next(); }
  int(n: number) { return Math.floor(this.next() * n); }
  pick<T>(arr: readonly T[]): T { return arr[this.int(arr.length)]; }
  /** Approximately normal (sum of 3 uniforms), mean 0, sd ~1. */
  gauss() { return (this.next() + this.next() + this.next() - 1.5) * 2; }
}
