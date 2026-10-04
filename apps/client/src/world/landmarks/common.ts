import * as THREE from 'three';

// ---------------------------------------------------------------------------------------------
// Deterministic random + noise (CPU side, used for geometry and procedural textures)
// ---------------------------------------------------------------------------------------------

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash2(x: number, y: number, seed = 0): number {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const smooth = (t: number): number => t * t * (3 - 2 * t);

/** 2D value noise in [0,1], optionally periodic (period in lattice cells). */
export function valueNoise2(x: number, y: number, seed = 0, period = 0): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const wrap = (v: number): number => (period > 0 ? ((v % period) + period) % period : v);
  const x0 = wrap(xi);
  const x1 = wrap(xi + 1);
  const y0 = wrap(yi);
  const y1 = wrap(yi + 1);
  const a = hash2(x0, y0, seed);
  const b = hash2(x1, y0, seed);
  const c = hash2(x0, y1, seed);
  const d = hash2(x1, y1, seed);
  const u = smooth(xf);
  const v = smooth(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm2(x: number, y: number, octaves = 4, seed = 0, period = 0): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise2(x * f, y * f, seed + i * 17, period > 0 ? period * f : 0);
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const smoothstep = (e0: number, e1: number, x: number): number => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

// ---------------------------------------------------------------------------------------------
// MeshBuilder: accumulates non-indexed triangles with position / normal / uv / color / glow
// ---------------------------------------------------------------------------------------------

export type V3 = THREE.Vector3;
const _ab = new THREE.Vector3();
const _ac = new THREE.Vector3();
const _n = new THREE.Vector3();
const _v = new THREE.Vector3();

export type UVMode = 'box' | 'explicit';

export class MeshBuilder {
  private pos: number[] = [];
  private nor: number[] = [];
  private uvs: number[] = [];
  private col: number[] = [];
  private glw: number[] = [];

  /** Current vertex colour (linear) multiplied with colorFn when present. */
  color = new THREE.Color(1, 1, 1);
  glow = 0;
  /** World units per UV unit for box projection. */
  uvScale = 1;
  uvOffset = new THREE.Vector2(0, 0);
  colorFn: ((p: V3, n: V3) => number) | null = null;
  /** Optional per-vertex glow function (overrides `glow`). */
  glowFn: ((p: V3, n: V3) => number) | null = null;

  get triangleCount(): number {
    return this.pos.length / 9;
  }

  setColor(r: number | THREE.Color, g?: number, b?: number): this {
    if (r instanceof THREE.Color) this.color.copy(r);
    else this.color.setRGB(r, g ?? r, b ?? r);
    return this;
  }

  private pushVertex(p: V3, n: V3, u: number, v: number): void {
    this.pos.push(p.x, p.y, p.z);
    this.nor.push(n.x, n.y, n.z);
    this.uvs.push(u, v);
    const k = this.colorFn ? this.colorFn(p, n) : 1;
    this.col.push(this.color.r * k, this.color.g * k, this.color.b * k);
    this.glw.push(this.glowFn ? this.glowFn(p, n) : this.glow);
  }

  boxUV(p: V3, n: V3): [number, number] {
    const ax = Math.abs(n.x);
    const ay = Math.abs(n.y);
    const az = Math.abs(n.z);
    const s = 1 / this.uvScale;
    let u: number;
    let v: number;
    if (ay > ax && ay > az) {
      u = p.x;
      v = p.z;
    } else if (ax > az) {
      u = n.x > 0 ? -p.z : p.z;
      v = p.y;
    } else {
      u = n.z > 0 ? p.x : -p.x;
      v = p.y;
    }
    return [u * s + this.uvOffset.x, v * s + this.uvOffset.y];
  }

  /**
   * Triangle with explicit per-vertex normals (optional) and uvs (optional, box projection otherwise).
   * Winding is fixed automatically so that the geometric normal agrees with the supplied normals.
   */
  tri(a: V3, b: V3, c: V3, na?: V3 | null, nb?: V3 | null, nc?: V3 | null, uva?: number[] | null, uvb?: number[] | null, uvc?: number[] | null): void {
    _ab.subVectors(b, a);
    _ac.subVectors(c, a);
    _n.crossVectors(_ab, _ac);
    const len = _n.length();
    if (len < 1e-12) return;
    _n.multiplyScalar(1 / len);
    const fa = na ?? _n;
    if (na) {
      _v.copy(na).add(nb ?? na).add(nc ?? na);
      if (_v.dot(_n) < 0) {
        // swap b and c
        const fnA = na.clone();
        const fnB = (nc ?? na).clone();
        const fnC = (nb ?? na).clone();
        this.emit(a, c, b, fnA, fnB, fnC, uva, uvc, uvb);
        return;
      }
      this.emit(a, b, c, fa.clone(), (nb ?? na).clone(), (nc ?? na).clone(), uva, uvb, uvc);
      return;
    }
    const n = _n.clone();
    this.emit(a, b, c, n, n, n, uva, uvb, uvc);
  }

  private emit(a: V3, b: V3, c: V3, na: V3, nb: V3, nc: V3, uva?: number[] | null, uvb?: number[] | null, uvc?: number[] | null): void {
    const ua = uva ?? this.boxUV(a, na);
    const ub = uvb ?? this.boxUV(b, nb);
    const uc = uvc ?? this.boxUV(c, nc);
    this.pushVertex(a, na, ua[0], ua[1]);
    this.pushVertex(b, nb, ub[0], ub[1]);
    this.pushVertex(c, nc, uc[0], uc[1]);
  }

  /**
   * Quad a-b-c-d (in order around the perimeter). `normal` gives the intended facing (flat), else computed
   * from winding (a,b,c counter-clockwise when seen from the front).
   */
  quad(a: V3, b: V3, c: V3, d: V3, normal?: V3 | null, uv?: number[][] | null, normals?: V3[] | null): void {
    if (normals) {
      this.tri(a, b, c, normals[0], normals[1], normals[2], uv?.[0], uv?.[1], uv?.[2]);
      this.tri(a, c, d, normals[0], normals[2], normals[3], uv?.[0], uv?.[2], uv?.[3]);
      return;
    }
    let n = normal ?? null;
    if (!n) {
      _ab.subVectors(b, a);
      _ac.subVectors(d, a);
      n = new THREE.Vector3().crossVectors(_ab, _ac);
      const l = n.length();
      if (l < 1e-12) {
        _ab.subVectors(c, a);
        n.crossVectors(_ab, _ac.subVectors(d, b));
      }
      n.normalize();
    }
    this.tri(a, b, c, n, n, n, uv?.[0], uv?.[1], uv?.[2]);
    this.tri(a, c, d, n, n, n, uv?.[0], uv?.[2], uv?.[3]);
  }

  /** Axis-aligned box given min/max corners. `faces` mask: px nx py ny pz nz (default all). */
  box(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, faces = 0b111111): void {
    const V = (x: number, y: number, z: number): V3 => new THREE.Vector3(x, y, z);
    if (faces & 0b100000) this.quad(V(x1, y0, z1), V(x1, y0, z0), V(x1, y1, z0), V(x1, y1, z1), V(1, 0, 0));
    if (faces & 0b010000) this.quad(V(x0, y0, z0), V(x0, y0, z1), V(x0, y1, z1), V(x0, y1, z0), V(-1, 0, 0));
    if (faces & 0b001000) this.quad(V(x0, y1, z1), V(x1, y1, z1), V(x1, y1, z0), V(x0, y1, z0), V(0, 1, 0));
    if (faces & 0b000100) this.quad(V(x0, y0, z0), V(x1, y0, z0), V(x1, y0, z1), V(x0, y0, z1), V(0, -1, 0));
    if (faces & 0b000010) this.quad(V(x0, y0, z1), V(x1, y0, z1), V(x1, y1, z1), V(x0, y1, z1), V(0, 0, 1));
    if (faces & 0b000001) this.quad(V(x1, y0, z0), V(x0, y0, z0), V(x0, y1, z0), V(x1, y1, z0), V(0, 0, -1));
  }

  /** Box by centre and full size. */
  boxC(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, faces = 0b111111): void {
    this.box(cx - sx / 2, cy - sy / 2, cz - sz / 2, cx + sx / 2, cy + sy / 2, cz + sz / 2, faces);
  }

  /** Generic hexahedron from 8 corners: bottom (b0..b3) and top (t0..t3), ordered around. Normals flat, auto-oriented outwards. */
  hexa(c: V3[], faces = 0b111111, uvFn?: ((face: number, corner: number) => number[]) | null): void {
    // c: [b0,b1,b2,b3,t0,t1,t2,t3]
    const centre = new THREE.Vector3();
    for (const p of c) centre.add(p);
    centre.multiplyScalar(1 / 8);
    const F = [
      [0, 1, 5, 4],
      [1, 2, 6, 5],
      [2, 3, 7, 6],
      [3, 0, 4, 7],
      [4, 5, 6, 7],
      [3, 2, 1, 0],
    ];
    for (let f = 0; f < 6; f++) {
      if (!(faces & (1 << f))) continue;
      const [i0, i1, i2, i3] = F[f];
      const a = c[i0];
      const b = c[i1];
      const cc = c[i2];
      const d = c[i3];
      const n = new THREE.Vector3().crossVectors(_ab.subVectors(cc, a), _ac.subVectors(d, b));
      if (n.lengthSq() < 1e-14) continue;
      n.normalize();
      const fc = new THREE.Vector3().add(a).add(b).add(cc).add(d).multiplyScalar(0.25);
      if (n.dot(fc.sub(centre)) < 0) n.negate();
      const uv = uvFn ? [uvFn(f, 0), uvFn(f, 1), uvFn(f, 2), uvFn(f, 3)] : null;
      this.quad(a, b, cc, d, n, uv);
    }
  }

  /**
   * Beam with rectangular section between points a and b. `side` is a reference direction used for the
   * section width axis (projected perpendicular to the beam). w along side, d along the other axis.
   */
  beam(a: V3, b: V3, w: number, d: number, side: V3, caps = false, w2?: number, d2?: number, uv?: { u0: number; u1: number; vPerM: number; v0?: number } | null): void {
    const dir = new THREE.Vector3().subVectors(b, a).normalize();
    const s = side.clone().addScaledVector(dir, -side.dot(dir)).normalize();
    const t = new THREE.Vector3().crossVectors(dir, s).normalize();
    const wb = w2 ?? w;
    const db = d2 ?? d;
    const corner = (p: V3, ww: number, dd: number, i: number): V3 => {
      const sx = i === 0 || i === 3 ? -1 : 1;
      const sy = i < 2 ? -1 : 1;
      return p.clone().addScaledVector(s, (sx * ww) / 2).addScaledVector(t, (sy * dd) / 2);
    };
    const c = [0, 1, 2, 3].map((i) => corner(a, w, d, i)).concat([0, 1, 2, 3].map((i) => corner(b, wb, db, i)));
    if (uv) {
      const L = a.distanceTo(b) * uv.vPerM;
      const v0 = uv.v0 ?? 0;
      const tab = [
        [uv.u0, v0],
        [uv.u1, v0],
        [uv.u1, v0 + L],
        [uv.u0, v0 + L],
      ];
      this.hexa(c, caps ? 0b111111 : 0b001111, (face, corner) => (face < 4 ? tab[corner] : [uv.u0, v0]));
    } else this.hexa(c, caps ? 0b111111 : 0b001111);
  }

  /** Add a BufferGeometry (indexed or not). UVs kept if present and keepUV, else box projected. */
  addGeometry(geo: THREE.BufferGeometry, matrix?: THREE.Matrix4 | null, keepUV = false): void {
    const g = geo.index ? geo.toNonIndexed() : geo;
    if (!g.getAttribute('normal')) g.computeVertexNormals();
    const P = g.getAttribute('position') as THREE.BufferAttribute;
    const N = g.getAttribute('normal') as THREE.BufferAttribute;
    const U = g.getAttribute('uv') as THREE.BufferAttribute | undefined;
    const nm = matrix ? new THREE.Matrix3().getNormalMatrix(matrix) : null;
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    for (let i = 0; i < P.count; i++) {
      p.fromBufferAttribute(P, i);
      n.fromBufferAttribute(N, i);
      if (matrix && nm) {
        p.applyMatrix4(matrix);
        n.applyMatrix3(nm).normalize();
      }
      let u: number;
      let v: number;
      if (keepUV && U) {
        u = U.getX(i);
        v = U.getY(i);
      } else {
        [u, v] = this.boxUV(p, n);
      }
      this.pushVertex(p, n, u, v);
    }
    if (g !== geo) g.dispose();
  }

  append(other: MeshBuilder): void {
    this.pos.push(...other.pos);
    this.nor.push(...other.nor);
    this.uvs.push(...other.uvs);
    this.col.push(...other.col);
    this.glw.push(...other.glw);
  }

  build(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uvs, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setAttribute('glow', new THREE.Float32BufferAttribute(this.glw, 1));
    g.computeBoundingBox();
    g.computeBoundingSphere();
    return g;
  }
}

// ---------------------------------------------------------------------------------------------
// Heightfield relief grids (sculpture suggestion). Builds a displaced grid on a planar frame.
// ---------------------------------------------------------------------------------------------

export interface ReliefFrame {
  origin: V3; // bottom-left corner of the panel on the wall surface
  uAxis: V3; // unit vector along panel width
  vAxis: V3; // unit vector along panel height
  normal: V3; // outward
  width: number;
  height: number;
}

/**
 * Adds a relief surface to the builder: height(u,v) in metres (u,v in 0..1). Edges should go to ~0.
 * Returning a value below -0.5 marks a hole (triangles touching it are skipped).
 * Vertex colour is darkened in cavities (cheap baked AO). Includes thin skirt on the border.
 */
export function addRelief(mb: MeshBuilder, frame: ReliefFrame, nu: number, nv: number, height: (u: number, v: number) => number, aoStrength = 0.35): void {
  const H: number[] = [];
  const hole: boolean[] = [];
  const P: THREE.Vector3[] = [];
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i <= nu; i++) {
      const u = i / nu;
      const v = j / nv;
      const raw = height(u, v);
      hole.push(raw < -0.5);
      const h = Math.max(0, raw);
      H.push(h);
      P.push(
        frame.origin
          .clone()
          .addScaledVector(frame.uAxis, u * frame.width)
          .addScaledVector(frame.vAxis, v * frame.height)
          .addScaledVector(frame.normal, h + 0.02),
      );
    }
  }
  const idx = (i: number, j: number): number => j * (nu + 1) + i;
  // smooth normals
  const N: THREE.Vector3[] = P.map(() => new THREE.Vector3());
  const tmp = new THREE.Vector3();
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = idx(i, j);
      const b = idx(i + 1, j);
      const c = idx(i + 1, j + 1);
      const d = idx(i, j + 1);
      for (const [x, y, z] of [
        [a, b, c],
        [a, c, d],
      ]) {
        tmp.crossVectors(_ab.subVectors(P[y], P[x]), _ac.subVectors(P[z], P[x]));
        if (tmp.dot(frame.normal) < 0) tmp.negate();
        N[x].add(tmp);
        N[y].add(tmp);
        N[z].add(tmp);
      }
    }
  }
  N.forEach((n) => n.normalize());
  // AO from local cavity (compare with neighbourhood average)
  const AO: number[] = H.map((h, k) => {
    const i = k % (nu + 1);
    const j = Math.floor(k / (nu + 1));
    let s = 0;
    let c = 0;
    for (let dj = -2; dj <= 2; dj++) {
      for (let di = -2; di <= 2; di++) {
        const ii = i + di;
        const jj = j + dj;
        if (ii < 0 || jj < 0 || ii > nu || jj > nv) continue;
        s += H[idx(ii, jj)];
        c++;
      }
    }
    const cav = s / c - h; // positive in cavities
    return clamp01(1 - aoStrength * Math.max(0, cav) * 2.2 - (h < 0.05 ? 0.12 : 0));
  });
  const base = mb.color.clone();
  const emitV = (k: number): [V3, V3, number] => [P[k], N[k], AO[k]];
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const q = [idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)];
      // choose diagonal following the shorter span for nicer shading
      const tris = [
        [q[0], q[1], q[2]],
        [q[0], q[2], q[3]],
      ];
      for (const t of tris) {
        if (hole[t[0]] || hole[t[1]] || hole[t[2]]) continue;
        const [pa, na, aa] = emitV(t[0]);
        const [pb, nb, ab] = emitV(t[1]);
        const [pc, nc, ac] = emitV(t[2]);
        // per-tri colour from the average AO keeps API simple
        const ao = (aa + ab + ac) / 3;
        mb.color.copy(base).multiplyScalar(ao);
        mb.tri(pa, pb, pc, na, nb, nc);
      }
    }
  }
  mb.color.copy(base);
}

/** Gaussian blob helper for relief composition. */
export function blob(u: number, v: number, cu: number, cv: number, su: number, sv: number, angle = 0): number {
  const du = u - cu;
  const dv = v - cv;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const x = (du * c + dv * s) / su;
  const y = (-du * s + dv * c) / sv;
  return Math.exp(-(x * x + y * y));
}

// ---------------------------------------------------------------------------------------------
// Canvas & texture helpers
// ---------------------------------------------------------------------------------------------

export function makeCanvas(w: number, h: number): { canvas: HTMLCanvasElement | OffscreenCanvas; ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D } {
  let canvas: HTMLCanvasElement | OffscreenCanvas;
  if (typeof document !== 'undefined') {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    canvas = c;
  } else {
    canvas = new OffscreenCanvas(w, h);
  }
  const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  return { canvas, ctx };
}

/** Builds a tangent-space normal map from a height field (0..1 values, row-major, wraps). */
export function normalMapFromHeight(height: Float32Array, w: number, h: number, strength: number, wrap = true): THREE.DataTexture {
  const data = new Uint8Array(w * h * 4);
  const at = (x: number, y: number): number => {
    if (wrap) {
      x = (x + w) % w;
      y = (y + h) % h;
    } else {
      x = Math.min(w - 1, Math.max(0, x));
      y = Math.min(h - 1, Math.max(0, y));
    }
    return height[y * w + x];
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      // canvas rows go downwards while texture v goes upwards (flipY) -> invert dy
      const dy = (at(x, y - 1) - at(x, y + 1)) * strength;
      const nx = -dx;
      const ny = -dy;
      const nz = 1;
      const l = Math.hypot(nx, ny, nz);
      const k = (y * w + x) * 4;
      data[k] = Math.round((nx / l * 0.5 + 0.5) * 255);
      data[k + 1] = Math.round((ny / l * 0.5 + 0.5) * 255);
      data[k + 2] = Math.round((nz / l * 0.5 + 0.5) * 255);
      data[k + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.flipY = false;
  tex.needsUpdate = true;
  return tex;
}

/** Reads a grayscale height (red channel) from a canvas. */
export function heightFromCanvas(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, w: number, h: number): Float32Array {
  const img = ctx.getImageData(0, 0, w, h).data;
  const out = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = img[i * 4] / 255;
  return out;
}

/**
 * DataTexture from RGBA canvas data. Rows of canvas start at the top; we flip so that v=0 is the bottom
 * row (consistent with CanvasTexture default flipY=true but avoids flipY on DataTextures).
 */
export function dataTextureFromRGBA(rgba: Uint8ClampedArray | Uint8Array, w: number, h: number, srgb: boolean): THREE.DataTexture {
  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    const src = (h - 1 - y) * w * 4;
    data.set(rgba.subarray(src, src + w * 4), y * w * 4);
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

export function canvasTexture(canvas: HTMLCanvasElement | OffscreenCanvas, srgb: boolean): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas as HTMLCanvasElement);
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Builds a full mip chain for an alpha-tested RGBA image, rescaling alpha in each level so that the
 * fraction of texels passing `cutoff` matches the base level (coverage-preserving mips). Without this,
 * thin lattice bars vanish at distance. `growth` slightly increases target coverage per level so that a
 * far lattice reads denser (like the real thing seen from afar).
 */
export function coveragePreservingMips(rgba: Uint8Array, w: number, h: number, cutoff = 0.5, growth = 1.06, bands?: number[]): THREE.DataTexture {
  const levels: { data: Uint8Array; width: number; height: number }[] = [{ data: rgba, width: w, height: h }];
  // band boundaries (fractions of height, from v=0) let us preserve coverage per horizontal region
  const bandEdges = bands ?? [0, 1];
  const coverage = (d: Uint8Array, lw: number, lh: number, y0: number, y1: number, scale: number): number => {
    let pass = 0;
    let total = 0;
    const ys = Math.floor(y0 * lh);
    const ye = Math.max(ys + 1, Math.ceil(y1 * lh));
    for (let y = ys; y < ye && y < lh; y++) {
      for (let x = 0; x < lw; x++) {
        total++;
        if ((d[(y * lw + x) * 4 + 3] / 255) * scale >= cutoff) pass++;
      }
    }
    return total ? pass / total : 0;
  };
  const baseCov: number[] = [];
  for (let b = 0; b < bandEdges.length - 1; b++) baseCov.push(coverage(rgba, w, h, bandEdges[b], bandEdges[b + 1], 1));
  let cw = w;
  let ch = h;
  let prev = rgba;
  let level = 0;
  while (cw > 1 || ch > 1) {
    const nw = Math.max(1, cw >> 1);
    const nh = Math.max(1, ch >> 1);
    const out = new Uint8Array(nw * nh * 4);
    for (let y = 0; y < nh; y++) {
      for (let x = 0; x < nw; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let wsum = 0;
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const sx = Math.min(cw - 1, x * 2 + dx);
            const sy = Math.min(ch - 1, y * 2 + dy);
            const k = (sy * cw + sx) * 4;
            const al = prev[k + 3];
            // alpha-weighted colour so transparent texels do not darken bars
            const wt = al + 1;
            r += prev[k] * wt;
            g += prev[k + 1] * wt;
            b += prev[k + 2] * wt;
            a += al;
            wsum += wt;
          }
        }
        const o = (y * nw + x) * 4;
        out[o] = r / wsum;
        out[o + 1] = g / wsum;
        out[o + 2] = b / wsum;
        out[o + 3] = a / 4;
      }
    }
    level++;
    // per band alpha rescale
    for (let bi = 0; bi < bandEdges.length - 1; bi++) {
      const target = Math.min(0.97, baseCov[bi] * Math.pow(growth, level));
      let lo = 0.5;
      let hi = 8;
      for (let it = 0; it < 14; it++) {
        const mid = (lo + hi) / 2;
        if (coverage(out, nw, nh, bandEdges[bi], bandEdges[bi + 1], mid) < target) lo = mid;
        else hi = mid;
      }
      const scale = (lo + hi) / 2;
      const ys = Math.floor(bandEdges[bi] * nh);
      const ye = Math.max(ys + 1, Math.ceil(bandEdges[bi + 1] * nh));
      for (let y = ys; y < ye && y < nh; y++) {
        for (let x = 0; x < nw; x++) {
          const k = (y * nw + x) * 4 + 3;
          out[k] = Math.min(255, out[k] * scale);
        }
      }
    }
    levels.push({ data: out, width: nw, height: nh });
    prev = out;
    cw = nw;
    ch = nh;
  }
  const tex = new THREE.DataTexture(rgba, w, h, THREE.RGBAFormat);
  tex.mipmaps = levels as unknown as THREE.DataTexture['mipmaps'];
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

// ---------------------------------------------------------------------------------------------
// Night-lighting shader patch for MeshStandardMaterial
// ---------------------------------------------------------------------------------------------

export const GLSL_NOISE = /* glsl */ `
float lmHash(vec3 p){ p = fract(p*0.3183099 + 0.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float lmNoise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(lmHash(i+vec3(0,0,0)), lmHash(i+vec3(1,0,0)), f.x),
                 mix(lmHash(i+vec3(0,1,0)), lmHash(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(lmHash(i+vec3(0,0,1)), lmHash(i+vec3(1,0,1)), f.x),
                 mix(lmHash(i+vec3(0,1,1)), lmHash(i+vec3(1,1,1)), f.x), f.y), f.z);
}
float lmFbm(vec3 p){ float s=0.0; float a=0.5; for(int i=0;i<4;i++){ s+=a*lmNoise(p); p*=2.03; a*=0.5; } return s/0.9375; }
`;

export interface NightPatch {
  uniforms: Record<string, THREE.IUniform>;
  /** GLSL (fragment) modifying `diffuseColor.rgb`; has access to lmPos (local position) and lmGlow. */
  colorGLSL?: string;
  /** GLSL (fragment) computing `vec3 lmE` (added to emissive radiance); has lmPos, lmN (world normal), lmGlow. */
  emissiveGLSL: string;
  /** Extra GLSL declarations for the fragment shader. */
  fragDecl?: string;
  key: string;
}

/** Patches a MeshStandardMaterial with local-position varyings, colour variation and night emissive term. */
export function applyNightPatch(mat: THREE.MeshStandardMaterial, patch: NightPatch): void {
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, patch.uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
attribute float glow;
varying vec3 lmPosV;
varying float lmGlowV;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
lmPosV = transformed;
lmGlowV = glow;`,
      );
    const decl = Object.keys(patch.uniforms)
      .map((k) => {
        const v = patch.uniforms[k].value;
        let t = 'float';
        if (v instanceof THREE.Color || v instanceof THREE.Vector3) t = 'vec3';
        else if (v instanceof THREE.Vector2) t = 'vec2';
        else if (v instanceof THREE.Vector4) t = 'vec4';
        return `uniform ${t} ${k};`;
      })
      .join('\n');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 lmPosV;
varying float lmGlowV;
${decl}
${GLSL_NOISE}
${patch.fragDecl ?? ''}`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
{
  vec3 lmPos = lmPosV; float lmGlow = lmGlowV;
  ${patch.colorGLSL ?? ''}
}`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
{
  vec3 lmPos = lmPosV; float lmGlow = lmGlowV;
  vec3 lmN = inverseTransformDirection(normal, viewMatrix);
  vec3 lmE = vec3(0.0);
  ${patch.emissiveGLSL}
  totalEmissiveRadiance += lmE;
}`,
      );
  };
  mat.customProgramCacheKey = () => 'lm-' + patch.key;
}

/** Disposes all geometries, materials and textures under an object. */
export function disposeObject(root: THREE.Object3D, extraTextures: THREE.Texture[] = []): void {
  const mats = new Set<THREE.Material>();
  const texs = new Set<THREE.Texture>(extraTextures);
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mm = m.material as THREE.Material | THREE.Material[] | undefined;
    if (mm) (Array.isArray(mm) ? mm : [mm]).forEach((x) => mats.add(x));
  });
  for (const m of mats) {
    for (const v of Object.values(m)) if (v instanceof THREE.Texture) texs.add(v);
    const sm = m as THREE.ShaderMaterial;
    if (sm.uniforms) for (const u of Object.values(sm.uniforms)) if (u && u.value instanceof THREE.Texture) texs.add(u.value);
    m.dispose();
  }
  for (const t of texs) t.dispose();
}

export function countTriangles(root: THREE.Object3D): { triangles: number; drawCalls: number } {
  let triangles = 0;
  let drawCalls = 0;
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!(m as THREE.Mesh).isMesh && !(o as THREE.Points).isPoints) return;
    drawCalls++;
    if ((o as THREE.Points).isPoints) return;
    const g = m.geometry;
    triangles += g.index ? g.index.count / 3 : g.getAttribute('position').count / 3;
  });
  return { triangles, drawCalls };
}
