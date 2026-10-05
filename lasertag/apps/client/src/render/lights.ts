import * as THREE from 'three';
import type { MapDef } from '@neon/shared';
import { NU, MAX_LIGHTS } from './neon.ts';

interface Flash { x: number; y: number; z: number; r: number; g: number; b: number; i: number; range: number; decay: number }

/** Static map lights + a fixed pool of dynamic flash lights, all written into the shared neon uniforms. */
export class LightRig {
  private staticColors: THREE.Vector3[] = [];
  private staticCount = 0;
  private readonly pool: Flash[];
  private next = 0;
  readonly poolSize: number;

  constructor(poolSize = 6) {
    this.poolSize = poolSize;
    this.pool = Array.from({ length: poolSize }, () => ({ x: 0, y: -100, z: 0, r: 0, g: 0, b: 0, i: 0, range: 1, decay: 10 }));
  }

  setStatic(map: MapDef) {
    const n = Math.min(map.lights.length, MAX_LIGHTS - this.poolSize);
    this.staticCount = n;
    this.staticColors = [];
    const c = new THREE.Color();
    for (let k = 0; k < n; k++) {
      const l = map.lights[k];
      NU.uLightPos.value[k].set(...l.pos);
      NU.uLightRange.value[k] = l.range;
      c.set(l.color);
      this.staticColors.push(new THREE.Vector3(c.r, c.g, c.b).multiplyScalar(l.intensity));
    }
    NU.uLightCount.value = n + this.poolSize;
  }

  flash(x: number, y: number, z: number, color: THREE.Color, intensity: number, range: number, decay: number) {
    // reuse the dimmest slot
    let slot = this.next, best = Infinity;
    for (let k = 0; k < this.pool.length; k++) {
      if (this.pool[k].i < best) { best = this.pool[k].i; slot = k; }
    }
    const f = this.pool[slot];
    f.x = x; f.y = y; f.z = z; f.r = color.r; f.g = color.g; f.b = color.b; f.i = intensity; f.range = range; f.decay = decay;
    this.next = (slot + 1) % this.pool.length;
  }

  update(dt: number, beat: number) {
    const pulse = 0.9 + 0.16 * beat;
    for (let k = 0; k < this.staticCount; k++) NU.uLightColor.value[k].copy(this.staticColors[k]).multiplyScalar(pulse);
    for (let k = 0; k < this.pool.length; k++) {
      const f = this.pool[k];
      f.i *= Math.exp(-f.decay * dt);
      if (f.i < 0.01) f.i = 0;
      const idx = this.staticCount + k;
      NU.uLightPos.value[idx].set(f.x, f.y, f.z);
      NU.uLightColor.value[idx].set(f.r * f.i, f.g * f.i, f.b * f.i);
      NU.uLightRange.value[idx] = f.range;
    }
  }
}
