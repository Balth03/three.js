import type { CityMeta } from './types';

/** Global terrain heightfield (8 m grid), bilinear sampling. Usable on main thread and in workers. */
export class Terrain {
  readonly x0: number; readonly z0: number; readonly step: number; readonly nx: number; readonly nz: number;
  constructor(readonly heights: Float32Array, info: { x0: number; z0: number; step: number; nx: number; nz: number }) {
    this.x0 = info.x0; this.z0 = info.z0; this.step = info.step; this.nx = info.nx; this.nz = info.nz;
  }

  static decode(bytes: Uint8Array, meta: CityMeta['terrain']): Terrain {
    const raw = new Int16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2);
    const h = new Float32Array(meta.nx * meta.nz);
    for (let z = 0; z < meta.nz; z++) {
      let acc = 0;
      const row = z * meta.nx;
      for (let x = 0; x < meta.nx; x++) { acc += raw[row + x]; h[row + x] = acc * meta.scale; }
    }
    return new Terrain(h, meta);
  }

  height(x: number, z: number): number {
    let fx = (x - this.x0) / this.step, fz = (z - this.z0) / this.step;
    if (fx < 0) fx = 0; if (fz < 0) fz = 0;
    if (fx > this.nx - 1.001) fx = this.nx - 1.001; if (fz > this.nz - 1.001) fz = this.nz - 1.001;
    const ix = fx | 0, iz = fz | 0;
    const tx = fx - ix, tz = fz - iz;
    const i = iz * this.nx + ix;
    const h = this.heights;
    // same triangulation as the ground mesh (split along the a-d diagonal)
    const a = h[i], b = h[i + 1], c = h[i + this.nx], d = h[i + this.nx + 1];
    if (tx + tz <= 1) return a + (b - a) * tx + (c - a) * tz;
    return d + (c - d) * (1 - tx) + (b - d) * (1 - tz);
  }

  /** Surface normal (unnormalised gradient form) into out [x,y,z]. */
  normal(x: number, z: number, out: { x: number; y: number; z: number }): void {
    const e = 2;
    const dx = this.height(x + e, z) - this.height(x - e, z);
    const dz = this.height(x, z + e) - this.height(x, z - e);
    const l = Math.hypot(dx, 2 * e, dz);
    out.x = -dx / l; out.y = (2 * e) / l; out.z = -dz / l;
  }
}
