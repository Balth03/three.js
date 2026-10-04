/**
 * Procedural car models for Taxi·Monde — fictional brand "Vireo".
 *
 * Everything is generated in code (no external assets): the body is a lofted surface built from a side profile,
 * a plan-view outline and parametric cross-sections (a grid of rings along the length, closed by concentric
 * "face" rings at both ends), with wheel arches cut by vertex projection, a separate glass greenhouse, lights as
 * surface-conforming bands, a full interior for the hero car, and canvas textures for plates / taxi sign / screens.
 *
 * Conventions (all models):
 *   - units: metres; forward = -Z, right = +X, up = +Y
 *   - root origin = centre between the axles at ground level (y = 0 is where the tyres touch the ground at rest)
 *   - hero: `body` holds every sprung part; wheels are children of root at the hub centres, each with a child
 *     named 'spin' that rotates about local X. Left-hand drive (driver on -X).
 *
 * Draw-call strategy of the hero car: one body mesh with material groups [paint, uber, decal, sign, screen],
 * one glass mesh, one steering wheel mesh, 4 wheel meshes + 4 caliper meshes. "uber" is a MeshStandardMaterial
 * whose base colour / metalness / roughness / emissive come from vertex attributes (color, aSurf, aEmit) so that
 * all trim, lights and interior parts share one draw call; lights are driven by a uniform array of 16 levels.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// =================================================================================================== public types

export type CarBodyStyle = 'sedan' | 'hatch' | 'wagon' | 'suv' | 'van' | 'compact' | 'bus' | 'truck';

export interface CarModelSpec {
  style: CarBodyStyle;
  length: number; width: number; height: number; // metres, overall body
  wheelbase: number; track: number; // metres
  wheelRadius: number; wheelWidth: number; // metres
  paint: number; // hex colour of the body paint
  taxiSign?: boolean; // Paris taxi roof sign
  interior?: boolean; // detailed interior
  seed?: number; // small shape variations
}

export interface CarLightState {
  headlights: boolean;
  highBeam?: boolean;
  brake: number;
  reverse: boolean;
  indicatorLeft: boolean;
  indicatorRight: boolean;
  taxi?: 'free' | 'busy' | 'off';
}

export interface CarDashboardState { speedKmh: number; rpm: number; gear: string; fare?: string; clock?: string }

export interface CarModel {
  root: THREE.Group;
  body: THREE.Group;
  wheels: THREE.Object3D[];
  steeringWheel?: THREE.Object3D;
  headlightAnchors: THREE.Object3D[];
  cameraAnchors: { hood: THREE.Object3D; bumper: THREE.Object3D; cockpit: THREE.Object3D };
  setLights(state: CarLightState): void;
  setDashboard?(state: CarDashboardState): void;
  dispose(): void;
}

/**
 * Traffic car asset for InstancedMesh rendering.
 * - geometry: one merged, static BufferGeometry (wheels included). Attributes: position, normal, color,
 *   surf (vec2 metalness/roughness), paintMask (float 0/1), lightMask (float 0 none, 1 headlight, 2 tail light, 3 sign).
 * - material: ONE MeshStandardMaterial shared by every variant (see createTrafficMaterial()). Per-instance paint:
 *   InstancedMesh.setColorAt(i, colour) — the instance colour multiplies the vertex colour only where paintMask = 1.
 *   Painted vertices are white, so the instance colour IS the paint (the taxi variant has dark-grey painted vertices,
 *   so it always stays dark; the bus livery has paintMask = 0 and ignores the instance colour).
 * - Uniforms (shared, on material.userData.uniforms):  uNight (0..1, 0 = day, 1 = full night),
 *   uHeadlight (headlight emissive at night, default 7), uTail (tail-light emissive at night, default 3),
 *   uSign (taxi sign / bus display emissive at night, default 3). By day headlights keep a DRL glow.
 */
export interface TrafficCarAsset {
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
  length: number; width: number; height: number;
  wheelbase: number; wheelRadius: number;
  /** variant name: compact, sedan, wagon, suv, van, bus, taxi */
  name: string;
  /** suggested instance colours (linear-agnostic hex) */
  palette: number[];
}

export const VIREO_LUMEN_SPEC: CarModelSpec = {
  style: 'sedan',
  length: 4.92, width: 1.86, height: 1.47,
  wheelbase: 2.94, track: 1.6,
  wheelRadius: 0.34, wheelWidth: 0.245,
  paint: 0x111418,
  taxiSign: true,
  interior: true,
};

// =================================================================================================== small utils

type P2 = [number, number];
type V3 = THREE.Vector3;
const V = (x = 0, y = 0, z = 0): V3 => new THREE.Vector3(x, y, z);
const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const smooth = (a: number, b: number, x: number): number => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Monotone cubic (Fritsch–Carlson) 1D interpolation — no overshoot between control points. */
class Prof {
  private xs: number[];
  private ys: number[];
  private ms: number[];
  constructor(pts: P2[]) {
    const n = pts.length;
    this.xs = pts.map((p) => p[0]);
    this.ys = pts.map((p) => p[1]);
    const d: number[] = [];
    for (let i = 0; i < n - 1; i++) d.push((this.ys[i + 1] - this.ys[i]) / Math.max(1e-9, this.xs[i + 1] - this.xs[i]));
    const m: number[] = new Array(n).fill(0);
    m[0] = d[0] ?? 0;
    m[n - 1] = d[n - 2] ?? 0;
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (Math.abs(d[i]) < 1e-12) { m[i] = 0; m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    this.ms = m;
  }
  at(x: number): number {
    const xs = this.xs, n = xs.length;
    if (x <= xs[0]) return this.ys[0];
    if (x >= xs[n - 1]) return this.ys[n - 1];
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (xs[mid] <= x) lo = mid; else hi = mid; }
    const h = xs[hi] - xs[lo], t = (x - xs[lo]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * this.ys[lo] + (t3 - 2 * t2 + t) * h * this.ms[lo] + (-2 * t3 + 3 * t2) * this.ys[hi] + (t3 - t2) * h * this.ms[hi];
  }
}

// =================================================================================================== geometry builder

/** Light channels of the hero "uber" material (index into the uLevels uniform array). */
const CH = {
  NONE: 0, HEAD: 1, HIGH: 2, DRL: 3, TAIL: 4, BRAKE_TAIL: 5, BRAKE: 6, REVERSE: 7, IND_L: 8, IND_R: 9,
  TAXI_GREEN: 10, TAXI_RED: 11, TAXI_AMBER: 12, AMBIENT: 13, BACKLIGHT: 14, PLATE: 15,
} as const;

interface Brush {
  c: [number, number, number];
  metal: number;
  rough: number;
  ch: number;
  e: [number, number, number];
  paint: number;
  light: number;
}
const _col = new THREE.Color();
function lin(hex: number): [number, number, number] {
  _col.setHex(hex);
  return [_col.r, _col.g, _col.b];
}
function brush(hex: number, metal: number, rough: number, o: { ch?: number; emit?: number; paint?: number; light?: number } = {}): Brush {
  return { c: lin(hex), metal, rough, ch: o.ch ?? 0, e: o.emit !== undefined ? lin(o.emit) : [0, 0, 0], paint: o.paint ?? 0, light: o.light ?? 0 };
}

/** Hero material presets (vertex attributes of the uber material). */
const BR = {
  gloss: brush(0x040405, 0.0, 0.12),
  matte: brush(0x0a0a0b, 0.0, 0.8),
  seam: brush(0x030303, 0.0, 0.9),
  chrome: brush(0xe6e8eb, 1.0, 0.06),
  satin: brush(0xb4b8bd, 1.0, 0.28),
  darkChrome: brush(0x5b6066, 1.0, 0.22),
  rubber: brush(0x0b0b0c, 0.0, 0.92),
  liner: brush(0x060606, 0.0, 0.95),
  lensSmoke: brush(0x16191d, 0.5, 0.06),
  reflector: brush(0xc9ced4, 1.0, 0.1),
  mesh: brush(0x050506, 0.0, 0.55),
  plateBack: brush(0x0b0b0c, 0.0, 0.5),
  mirrorGlass: brush(0x8e959c, 1.0, 0.03),
  carpet: brush(0x141312, 0.0, 0.97),
  soft: brush(0x1a1a1c, 0.0, 0.72),
  softDark: brush(0x101011, 0.0, 0.8),
  leather: brush(0x2a231e, 0.0, 0.5),
  leatherDark: brush(0x161412, 0.0, 0.55),
  headliner: brush(0x5c5852, 0.0, 0.95),
  doorTrim: brush(0x1b1a19, 0.0, 0.62),
  doorTop: brush(0x26231f, 0.0, 0.55),
  wheelLeather: brush(0x111111, 0.0, 0.5),
  piano: brush(0x020203, 0.0, 0.05),
};

const EMIT = {
  head: 0xfff5e6,
  drl: 0xf1f6ff,
  red: 0xff0502,
  amber: 0xff7000,
  white: 0xffffff,
  green: 0x22ff44,
  ambient: 0x58b4ff,
};

const DEFAULT_BRUSH = brush(0x333333, 0, 0.5);

class Geo {
  pos: number[] = [];
  nor: number[] = [];
  uv: number[] = [];
  col: number[] = [];
  surf: number[] = [];
  emi: number[] = [];
  pm: number[] = [];
  lm: number[] = [];
  layers = new Map<string, number[]>();
  b: Brush = DEFAULT_BRUSH;
  duv: P2 = [0.97, 0.97];
  /** ambient-occlusion factor baked into new vertices (aSurf.w): scales indirect (environment) light. */
  ao = 1;
  get n(): number { return this.pos.length / 3; }
  set(b: Brush): this { this.b = b; return this; }
  v(x: number, y: number, z: number, nx: number, ny: number, nz: number, u?: number, w?: number): number {
    const b = this.b;
    this.pos.push(x, y, z);
    this.nor.push(nx, ny, nz);
    this.uv.push(u ?? this.duv[0], w ?? this.duv[1]);
    this.col.push(b.c[0], b.c[1], b.c[2]);
    this.surf.push(b.metal, b.rough, b.ch, this.ao);
    this.emi.push(b.e[0], b.e[1], b.e[2]);
    this.pm.push(b.paint);
    this.lm.push(b.light);
    return this.n - 1;
  }
  vv(p: V3, n: V3, u?: number, w?: number): number { return this.v(p.x, p.y, p.z, n.x, n.y, n.z, u, w); }
  tri(layer: string, a: number, b: number, c: number): void {
    let l = this.layers.get(layer);
    if (!l) { l = []; this.layers.set(layer, l); }
    l.push(a, b, c);
  }
  /** Adds a three.js geometry (indexed or not), transformed by m. uvRect remaps its uvs into an atlas rect. */
  add(layer: string, g: THREE.BufferGeometry, m?: THREE.Matrix4, uvRect?: [number, number, number, number] | 'keep'): void {
    const pos = g.getAttribute('position');
    const nor = g.getAttribute('normal');
    const uvA = g.getAttribute('uv');
    const nm = m ? new THREE.Matrix3().getNormalMatrix(m) : null;
    const base = this.n;
    const p = V(), n = V();
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos as THREE.BufferAttribute, i);
      if (m) p.applyMatrix4(m);
      n.fromBufferAttribute(nor as THREE.BufferAttribute, i);
      if (nm) n.applyMatrix3(nm).normalize();
      let u: number | undefined, w: number | undefined;
      if (uvRect && uvA) {
        if (uvRect === 'keep') { u = uvA.getX(i); w = uvA.getY(i); }
        else { u = lerp(uvRect[0], uvRect[2], uvA.getX(i)); w = lerp(uvRect[1], uvRect[3], uvA.getY(i)); }
      }
      this.v(p.x, p.y, p.z, n.x, n.y, n.z, u, w);
    }
    const flip = m ? m.determinant() < 0 : false;
    const idx = g.getIndex();
    const cnt = idx ? idx.count : pos.count;
    for (let i = 0; i < cnt; i += 3) {
      const a = base + (idx ? idx.getX(i) : i), b = base + (idx ? idx.getX(i + 1) : i + 1), c = base + (idx ? idx.getX(i + 2) : i + 2);
      if (flip) this.tri(layer, a, c, b); else this.tri(layer, a, b, c);
    }
  }
  tris(layers?: string[]): number {
    let t = 0;
    for (const [k, l] of this.layers) if (!layers || layers.includes(k)) t += l.length / 3;
    return t;
  }
  /** Builds a BufferGeometry; layers in `order` become consecutive groups (materialIndex = position in order). */
  build(order: string[], mode: 'hero' | 'traffic'): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    if (mode === 'hero') {
      g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
      g.setAttribute('aSurf', new THREE.Float32BufferAttribute(this.surf, 4));
      g.setAttribute('aEmit', new THREE.Float32BufferAttribute(this.emi, 3));
    } else {
      const s2: number[] = [];
      for (let i = 0; i < this.surf.length; i += 4) s2.push(this.surf[i], this.surf[i + 1]);
      g.setAttribute('surf', new THREE.Float32BufferAttribute(s2, 2));
      g.setAttribute('paintMask', new THREE.Float32BufferAttribute(this.pm, 1));
      g.setAttribute('lightMask', new THREE.Float32BufferAttribute(this.lm, 1));
    }
    const all: number[] = [];
    order.forEach((name, mi) => {
      const l = this.layers.get(name);
      if (!l || l.length === 0) return;
      g.addGroup(all.length, l.length, mi);
      for (let i = 0; i < l.length; i++) all.push(l[i]);
    });
    g.setIndex(this.n > 65535 ? new THREE.Uint32BufferAttribute(all, 1) : new THREE.Uint16BufferAttribute(all, 1));
    g.computeBoundingSphere();
    g.computeBoundingBox();
    return g;
  }
  indexFor(layer: string): THREE.BufferAttribute {
    const l = this.layers.get(layer) ?? [];
    return this.n > 65535 ? new THREE.Uint32BufferAttribute(l, 1) : new THREE.Uint16BufferAttribute(l, 1);
  }
}

/** Emits a quad grid; orientation is chosen so that faces agree with the supplied vertex normals. */
function gridMesh(geo: Geo, layer: string, P: V3[][], N: V3[][], UV?: P2[][]): void {
  const R = P.length, C = P[0].length;
  const ids: number[][] = [];
  for (let r = 0; r < R; r++) {
    ids.push([]);
    for (let c = 0; c < C; c++) ids[r].push(geo.vv(P[r][c], N[r][c], UV?.[r][c][0], UV?.[r][c][1]));
  }
  let score = 0;
  const e1 = V(), e2 = V(), fn = V(), na = V();
  for (let r = 0; r < R - 1; r++)
    for (let c = 0; c < C - 1; c++) {
      e1.subVectors(P[r][c + 1], P[r][c]);
      e2.subVectors(P[r + 1][c], P[r][c]);
      fn.crossVectors(e1, e2);
      na.copy(N[r][c]).add(N[r + 1][c + 1]);
      score += fn.dot(na);
    }
  const flip = score < 0;
  for (let r = 0; r < R - 1; r++)
    for (let c = 0; c < C - 1; c++) {
      const a = ids[r][c], b = ids[r][c + 1], cc = ids[r + 1][c], d = ids[r + 1][c + 1];
      if (!flip) { geo.tri(layer, a, b, cc); geo.tri(layer, b, d, cc); }
      else { geo.tri(layer, a, cc, b); geo.tri(layer, b, cc, d); }
    }
}

interface SP { p: V3; n: V3 }

/** Flat ribbon following surface points (seams, trims, wipers). */
function ribbon(geo: Geo, layer: string, pts: SP[], width: number, off: number): void {
  if (pts.length < 2) return;
  const P: V3[][] = [[], []], N: V3[][] = [[], []];
  for (let k = 0; k < pts.length; k++) {
    const a = pts[Math.max(0, k - 1)].p, b = pts[Math.min(pts.length - 1, k + 1)].p;
    const t = V().subVectors(b, a).normalize();
    const n = pts[k].n;
    const s = V().crossVectors(n, t).normalize().multiplyScalar(width / 2);
    const base = V().copy(pts[k].p).addScaledVector(n, off);
    P[0].push(V().subVectors(base, s));
    P[1].push(V().addVectors(base, s));
    N[0].push(n.clone());
    N[1].push(n.clone());
  }
  gridMesh(geo, layer, P, N);
}

/** Lathe around local X. pts = [radius, x]; sharp points get split normals. */
interface LP { r: number; x: number; sharp?: boolean; v?: number }
function lathe(geo: Geo, layer: string, pts: LP[], seg: number, m: THREE.Matrix4, uFn?: (s: number) => number, a0 = 0, a1 = Math.PI * 2): void {
  // expand sharp points
  const ex: { r: number; x: number; nr: number; nx: number; v?: number }[] = [];
  const segN = (i: number): P2 => {
    const a = pts[i], b = pts[i + 1];
    const dr = b.r - a.r, dx = b.x - a.x, l = Math.hypot(dr, dx) || 1;
    return [dx / l, -dr / l];
  };
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const nPrev = i > 0 ? segN(i - 1) : null;
    const nNext = i < pts.length - 1 ? segN(i) : null;
    if (p.sharp && nPrev && nNext) {
      ex.push({ r: p.r, x: p.x, nr: nPrev[0], nx: nPrev[1], v: p.v });
      ex.push({ r: p.r, x: p.x, nr: nNext[0], nx: nNext[1], v: p.v });
    } else {
      const a = nPrev ?? nNext!, b = nNext ?? nPrev!;
      const nr = a[0] + b[0], nx = a[1] + b[1], l = Math.hypot(nr, nx) || 1;
      ex.push({ r: p.r, x: p.x, nr: nr / l, nx: nx / l, v: p.v });
    }
  }
  const nm = new THREE.Matrix3().getNormalMatrix(m);
  const flip = m.determinant() < 0;
  const ns = seg + 1; // seam vertices duplicated so uv.u runs 0..1 without wrapping
  const ids: number[][] = [];
  const p = V(), n = V();
  for (let i = 0; i < ex.length; i++) {
    ids.push([]);
    for (let s = 0; s < ns; s++) {
      const a = a0 + ((a1 - a0) * s) / seg;
      const ca = Math.cos(a), sa = Math.sin(a);
      const e = ex[i];
      p.set(e.x, e.r * ca, e.r * sa).applyMatrix4(m);
      n.set(e.nx, e.nr * ca, e.nr * sa).applyMatrix3(nm).normalize();
      ids[i].push(geo.vv(p, n, uFn ? uFn(s / seg) : undefined, e.v));
    }
  }
  for (let i = 0; i < ex.length - 1; i++) {
    if (ex[i].r === ex[i + 1].r && ex[i].x === ex[i + 1].x) continue;
    for (let s = 0; s < seg; s++) {
      const s1 = s + 1;
      const a = ids[i][s], b = ids[i][s1], c = ids[i + 1][s], d = ids[i + 1][s1];
      if (!flip) { geo.tri(layer, a, b, c); geo.tri(layer, b, d, c); }
      else { geo.tri(layer, a, c, b); geo.tri(layer, b, c, d); }
    }
  }
}

function mat4(pos: V3 | [number, number, number], rot: [number, number, number] = [0, 0, 0], scl: [number, number, number] = [1, 1, 1], order: THREE.EulerOrder = 'XYZ'): THREE.Matrix4 {
  const p = Array.isArray(pos) ? V(pos[0], pos[1], pos[2]) : pos;
  return new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromEuler(new THREE.Euler(rot[0], rot[1], rot[2], order)), V(scl[0], scl[1], scl[2]));
}

function rbox(geo: Geo, layer: string, b: Brush, size: [number, number, number], m: THREE.Matrix4, radius = 0.01, seg = 1, uvRect?: [number, number, number, number]): void {
  const r = Math.max(1e-4, Math.min(radius, size[0] / 2 - 1e-4, size[1] / 2 - 1e-4, size[2] / 2 - 1e-4));
  const g = new RoundedBoxGeometry(size[0], size[1], size[2], seg, r);
  geo.set(b).add(layer, g, m, uvRect);
  g.dispose();
}

function cyl(geo: Geo, layer: string, b: Brush, r0: number, r1: number, len: number, m: THREE.Matrix4, seg = 10, capped = true): void {
  const g = new THREE.CylinderGeometry(r1, r0, len, seg, 1, !capped);
  geo.set(b).add(layer, g, m);
  g.dispose();
}

/** Quad (plane) of size w×h in the XY plane of matrix m, facing +Z. */
function plane(geo: Geo, layer: string, b: Brush, w: number, h: number, m: THREE.Matrix4, uv?: [number, number, number, number], flipU = false): void {
  const g = new THREE.PlaneGeometry(w, h);
  if (flipU) {
    const a = g.getAttribute('uv');
    for (let i = 0; i < a.count; i++) a.setX(i, 1 - a.getX(i));
  }
  geo.set(b).add(layer, g, m, uv);
  g.dispose();
}

function basisMatrix(pos: V3, xAxis: V3, normal: V3): THREE.Matrix4 {
  const z = normal.clone().normalize();
  const x = xAxis.clone().addScaledVector(z, -xAxis.dot(z)).normalize();
  const y = V().crossVectors(z, x);
  return new THREE.Matrix4().makeBasis(x, y, z).setPosition(pos);
}

// =================================================================================================== body styles

interface SecStyle {
  sill: number; max: number; sh: number; // fractions of (belt - bottom)
  shIn: number; botIn: number; sillIn: number; // insets (m, ref width)
  topN: number; tumble: number; frame: number; bow: number;
}
interface StyleDef {
  ref: { L: number; W: number; H: number };
  frontShare: number; // share of the total overhang at the front
  top: P2[]; edge: P2[]; belt: P2[]; bottom: P2[]; hw: P2[]; // d (m from front, ref) → y (m, ref) | hw fraction of W/2
  sec: SecStyle;
  bendF: number; bendR: number; // plan-view curvature of the ends (m)
  rakeF?: number; rakeR?: number; // side-view curvature of the end faces (top/bottom recede, m)
  cowl: number; header: number; aBase: number;
  wins: P2[]; // side glass ranges (gaps between them = black pillars)
  taper: P2 | null; // the last side window tapers into the C/D pillar
  rearWin: P2 | null; // top-region glass at the rear (rear window / tailgate glass)
  cladding?: boolean;
}

const SEDAN: StyleDef = {
  ref: { L: 4.92, W: 1.86, H: 1.47 },
  frontShare: 0.48,
  top: [[0, 0.605], [0.02, 0.672], [0.06, 0.712], [0.15, 0.748], [0.4, 0.792], [0.8, 0.838], [1.15, 0.872], [1.42, 0.902], [1.6, 1.02], [1.85, 1.185], [2.05, 1.31], [2.16, 1.365], [2.3, 1.415], [2.55, 1.455], [2.85, 1.47], [3.15, 1.452], [3.42, 1.41], [3.7, 1.31], [4.0, 1.17], [4.28, 1.075], [4.55, 1.052], [4.84, 1.06], [4.89, 1.046], [4.912, 1.008], [4.92, 0.975]],
  edge: [[1.2, 0.8], [1.42, 0.897], [1.65, 1.02], [1.9, 1.17], [2.15, 1.29], [2.35, 1.36], [2.6, 1.4], [2.85, 1.412], [3.1, 1.4], [3.35, 1.36], [3.65, 1.25], [3.95, 1.12], [4.3, 1.03], [4.5, 0.95]],
  belt: [[0, 0.585], [0.05, 0.652], [0.15, 0.71], [0.4, 0.758], [0.95, 0.815], [1.42, 0.874], [2.1, 0.928], [2.8, 0.966], [3.5, 0.996], [4.1, 1.01], [4.6, 1.008], [4.86, 0.998], [4.905, 0.985], [4.92, 0.955]],
  bottom: [[0, 0.3], [0.06, 0.24], [0.25, 0.195], [0.6, 0.172], [1.2, 0.165], [3.5, 0.165], [4.2, 0.18], [4.6, 0.215], [4.85, 0.285], [4.92, 0.34]],
  hw: [[0, 0.8], [0.025, 0.885], [0.08, 0.935], [0.2, 0.968], [0.5, 0.99], [0.95, 1.0], [1.4, 0.995], [2.2, 0.982], [3.0, 0.985], [3.6, 0.998], [3.89, 1.0], [4.3, 0.993], [4.6, 0.977], [4.8, 0.948], [4.885, 0.912], [4.92, 0.86]],
  sec: { sill: 0.17, max: 0.64, sh: 0.94, shIn: 0.075, botIn: 0.13, sillIn: 0.045, topN: 2.3, tumble: 0.45, frame: 0.028, bow: 0.012 },
  bendF: 0.085, bendR: 0.05, rakeF: 0.05, rakeR: 0.025,
  cowl: 1.42, header: 2.16, aBase: 1.56,
  wins: [[1.56, 2.86], [2.95, 3.86]],
  taper: [3.22, 3.86],
  rearWin: [3.42, 4.28],
};

const HATCH: StyleDef = {
  ref: { L: 4.3, W: 1.8, H: 1.46 },
  frontShare: 0.52,
  top: [[0, 0.62], [0.03, 0.69], [0.1, 0.74], [0.3, 0.78], [0.7, 0.84], [1.05, 0.89], [1.12, 0.9], [1.35, 1.07], [1.6, 1.24], [1.8, 1.36], [1.95, 1.42], [2.3, 1.46], [2.9, 1.455], [3.3, 1.43], [3.55, 1.4], [3.85, 1.22], [4.12, 1.02], [4.22, 0.98], [4.27, 0.95], [4.3, 0.9]],
  edge: [[0.9, 0.8], [1.12, 0.885], [1.4, 1.06], [1.7, 1.24], [1.95, 1.35], [2.3, 1.4], [2.9, 1.405], [3.3, 1.385], [3.55, 1.345], [3.85, 1.18], [4.12, 1.0], [4.25, 0.9]],
  belt: [[0, 0.6], [0.05, 0.67], [0.15, 0.72], [0.5, 0.78], [1.12, 0.87], [2.0, 0.93], [3.0, 0.97], [3.7, 0.99], [4.1, 0.99], [4.25, 0.95], [4.3, 0.88]],
  bottom: [[0, 0.32], [0.06, 0.25], [0.25, 0.2], [0.6, 0.17], [3.5, 0.17], [4.0, 0.22], [4.22, 0.3], [4.3, 0.38]],
  hw: [[0, 0.7], [0.03, 0.8], [0.1, 0.885], [0.25, 0.945], [0.55, 0.985], [0.88, 1.0], [1.4, 0.995], [2.4, 0.985], [3.3, 0.995], [3.5, 1.0], [3.9, 0.985], [4.15, 0.94], [4.25, 0.88], [4.3, 0.8]],
  sec: { sill: 0.17, max: 0.64, sh: 0.925, shIn: 0.07, botIn: 0.12, sillIn: 0.045, topN: 2.4, tumble: 0.4, frame: 0.028, bow: 0.01 },
  bendF: 0.06, bendR: 0.05,
  cowl: 1.12, header: 1.95, aBase: 1.25,
  wins: [[1.25, 2.45], [2.54, 3.6]],
  taper: [3.15, 3.6],
  rearWin: [3.55, 4.12],
};

const WAGON: StyleDef = {
  ...SEDAN,
  ref: { L: 4.92, W: 1.86, H: 1.5 },
  frontShare: 0.47,
  top: [...SEDAN.top.filter((p) => p[0] <= 2.85), [3.2, 1.475], [3.9, 1.465], [4.42, 1.44], [4.62, 1.26], [4.78, 1.06], [4.86, 1.0], [4.92, 0.95]],
  edge: [...SEDAN.edge.filter((p) => p[0] <= 2.85), [3.5, 1.415], [4.2, 1.405], [4.45, 1.37], [4.65, 1.2], [4.82, 0.99]],
  belt: [[0, 0.64], [0.05, 0.7], [0.15, 0.75], [0.4, 0.785], [0.95, 0.83], [1.42, 0.88], [2.1, 0.93], [2.8, 0.968], [3.5, 0.995], [4.2, 1.01], [4.6, 1.0], [4.85, 0.97], [4.92, 0.9]],
  hw: [[0, 0.7], [0.03, 0.8], [0.1, 0.885], [0.25, 0.945], [0.55, 0.985], [0.95, 1.0], [1.4, 0.995], [2.2, 0.982], [3.0, 0.985], [3.6, 0.998], [3.89, 1.0], [4.4, 0.99], [4.7, 0.96], [4.85, 0.9], [4.92, 0.82]],
  wins: [[1.56, 2.86], [2.95, 3.78], [3.86, 4.5]],
  taper: [4.05, 4.52],
  rearWin: [4.42, 4.8],
};

const SUV: StyleDef = {
  ref: { L: 4.7, W: 1.9, H: 1.68 },
  frontShare: 0.47,
  top: [[0, 0.78], [0.03, 0.86], [0.1, 0.92], [0.3, 0.96], [0.7, 1.0], [1.05, 1.04], [1.2, 1.06], [1.45, 1.24], [1.7, 1.42], [1.92, 1.56], [2.1, 1.63], [2.5, 1.68], [3.5, 1.675], [4.15, 1.65], [4.38, 1.6], [4.55, 1.4], [4.65, 1.18], [4.69, 1.12], [4.7, 1.06]],
  edge: [[1.0, 0.95], [1.2, 1.045], [1.5, 1.24], [1.8, 1.43], [2.05, 1.55], [2.4, 1.615], [3.5, 1.62], [4.15, 1.6], [4.38, 1.55], [4.55, 1.36], [4.66, 1.15], [4.69, 1.05]],
  belt: [[0, 0.76], [0.05, 0.84], [0.15, 0.89], [0.5, 0.95], [1.2, 1.03], [2.2, 1.08], [3.5, 1.12], [4.3, 1.14], [4.6, 1.12], [4.7, 1.04]],
  bottom: [[0, 0.42], [0.08, 0.33], [0.3, 0.27], [0.8, 0.25], [3.8, 0.25], [4.3, 0.3], [4.6, 0.38], [4.7, 0.46]],
  hw: [[0, 0.74], [0.03, 0.83], [0.1, 0.9], [0.25, 0.955], [0.55, 0.99], [0.95, 1.0], [3.8, 1.0], [4.3, 0.985], [4.55, 0.95], [4.65, 0.9], [4.7, 0.84]],
  sec: { sill: 0.18, max: 0.62, sh: 0.93, shIn: 0.07, botIn: 0.12, sillIn: 0.05, topN: 2.6, tumble: 0.3, frame: 0.03, bow: 0.01 },
  bendF: 0.06, bendR: 0.04,
  cowl: 1.2, header: 2.08, aBase: 1.32,
  wins: [[1.32, 2.6], [2.7, 3.65], [3.75, 4.36]],
  taper: [3.95, 4.4],
  rearWin: [4.38, 4.66],
  cladding: true,
};

const VAN: StyleDef = {
  ref: { L: 4.4, W: 1.86, H: 1.82 },
  frontShare: 0.55,
  top: [[0, 0.8], [0.03, 0.88], [0.1, 0.93], [0.3, 0.97], [0.6, 1.01], [0.8, 1.05], [1.05, 1.3], [1.3, 1.52], [1.5, 1.66], [1.7, 1.75], [2.0, 1.8], [4.25, 1.8], [4.33, 1.78], [4.37, 1.72], [4.385, 1.4], [4.395, 1.1], [4.4, 1.02]],
  edge: [[0.6, 0.95], [0.8, 1.04], [1.1, 1.3], [1.4, 1.56], [1.65, 1.7], [2.0, 1.755], [4.25, 1.755], [4.36, 1.7], [4.385, 1.4], [4.395, 1.1], [4.4, 1.0]],
  belt: [[0, 0.78], [0.05, 0.86], [0.15, 0.91], [0.5, 0.98], [0.8, 1.03], [2.0, 1.1], [4.3, 1.12], [4.4, 1.06]],
  bottom: [[0, 0.42], [0.08, 0.32], [0.3, 0.26], [0.8, 0.24], [3.9, 0.26], [4.3, 0.34], [4.4, 0.42]],
  hw: [[0, 0.76], [0.03, 0.85], [0.1, 0.91], [0.25, 0.96], [0.55, 0.99], [0.9, 1.0], [4.1, 1.0], [4.3, 0.99], [4.37, 0.97], [4.4, 0.93]],
  sec: { sill: 0.12, max: 0.55, sh: 0.95, shIn: 0.035, botIn: 0.08, sillIn: 0.03, topN: 3.5, tumble: 0.1, frame: 0.03, bow: 0.004 },
  bendF: 0.05, bendR: 0.02,
  cowl: 0.8, header: 1.62, aBase: 0.92,
  wins: [[0.92, 2.05]],
  taper: null,
  rearWin: [4.37, 4.395],
};

const BUS: StyleDef = {
  ref: { L: 12, W: 2.55, H: 3.05 },
  frontShare: 0.443,
  top: [[0, 1.0], [0.015, 1.5], [0.04, 2.2], [0.08, 2.7], [0.15, 2.92], [0.35, 3.02], [0.8, 3.05], [11.2, 3.05], [11.7, 3.02], [11.88, 2.92], [11.95, 2.75], [11.985, 2.3], [12, 1.95]],
  edge: [[0, 0.96], [0.03, 1.6], [0.07, 2.45], [0.12, 2.78], [0.3, 2.9], [11.5, 2.9], [11.85, 2.82], [11.94, 2.66], [11.98, 2.25], [12, 1.95]],
  belt: [[0, 0.95], [0.1, 1.0], [0.6, 1.06], [11.4, 1.06], [11.9, 1.02], [12, 0.96]],
  bottom: [[0, 0.42], [0.1, 0.34], [11.9, 0.34], [12, 0.42]],
  hw: [[0, 0.92], [0.02, 0.965], [0.08, 0.99], [0.3, 1.0], [11.7, 1.0], [11.92, 0.99], [11.98, 0.965], [12, 0.93]],
  sec: { sill: 0.06, max: 0.45, sh: 0.96, shIn: 0.02, botIn: 0.05, sillIn: 0.015, topN: 4, tumble: 0.03, frame: 0.12, bow: 0 },
  bendF: 0.04, bendR: 0.03,
  cowl: 0.003, header: 0.12, aBase: 0.3,
  wins: [[0.3, 1.4], [1.48, 2.95], [3.03, 4.5], [4.58, 5.3], [5.38, 6.6], [6.68, 8.1], [8.18, 9.4], [9.48, 10.6], [10.68, 11.55]],
  taper: null,
  rearWin: [11.88, 11.985],
};

const STYLES: Record<CarBodyStyle, StyleDef> = {
  sedan: SEDAN, hatch: HATCH, compact: { ...HATCH, frontShare: 0.5 }, wagon: WAGON, suv: SUV, van: VAN, bus: BUS, truck: VAN,
};

// =================================================================================================== body shell

type SegName = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
const SEGS: SegName[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
interface SecP {
  yBot: number; hwBot: number; ySill: number; hwSill: number; yMax: number; hwMax: number; ySh: number; hwSh: number;
  yBelt: number; hwBelt: number; yG: number; hwG: number; yEdge: number; hwEdge: number; yTop: number;
}
interface ShellRow { d: number; k: number; face: 0 | 1 | 2; s: SecP }
interface ShellRes { faceK: number[]; rows: number; cols: number[] }
type Cls = 'paint' | 'glass' | 'black' | 'under' | 'clad';
interface OPt { p: V3; n: V3 }

const HERO_RES: ShellRes = { faceK: [0, 0.3, 0.55, 0.74, 0.87, 0.95], rows: 88, cols: [3, 3, 5, 4, 4, 5, 2, 9] };
const LOW_RES: ShellRes = { faceK: [0, 0.62], rows: 21, cols: [1, 2, 2, 1, 2, 2, 1, 3] };
const BUS_RES: ShellRes = { faceK: [0, 0.62], rows: 44, cols: [1, 1, 2, 1, 1, 1, 1, 3] };

class Shell {
  readonly st: StyleDef;
  readonly L: number; readonly W: number; readonly H: number;
  readonly xs: number; readonly ys: number; readonly zs: number;
  readonly zFront: number;
  readonly pTop: Prof; readonly pEdge: Prof; readonly pBelt: Prof; readonly pBot: Prof; readonly pHw: Prof;
  readonly m: { cowl: number; header: number; aBase: number; wins: P2[]; taper: P2 | null; rearWin: P2 | null };
  readonly rows: ShellRow[] = [];
  readonly C: number; readonly RS: number;
  readonly segStart = {} as Record<SegName, number>;
  readonly segN = {} as Record<SegName, number>;
  readonly arches: { z: number; y: number; r: number }[];
  readonly xIn: number;
  iB0 = 0; iB1 = 0;
  P!: Float32Array; P0!: Float32Array; N!: Float32Array; cut!: Uint8Array;
  private roofVar = 0; private beltVar = 0; private hwVar = 0;
  private edgeRange: P2 = [0, 0];

  constructor(spec: CarModelSpec, st: StyleDef, res: ShellRes, opts: { zFront?: number; arches?: number[]; seed?: number } = {}) {
    this.st = st;
    this.L = spec.length; this.W = spec.width; this.H = spec.height;
    const zs = (this.zs = this.L / st.ref.L), ys = (this.ys = this.H / st.ref.H);
    this.xs = this.W / st.ref.W;
    const fo = (this.L - spec.wheelbase) * st.frontShare;
    this.zFront = opts.zFront ?? -(fo + spec.wheelbase / 2);
    const S = (pts: P2[], sy: number): Prof => new Prof(pts.map((p) => [p[0] * zs, p[1] * sy] as P2));
    this.pTop = S(st.top, ys); this.pEdge = S(st.edge, ys); this.pBelt = S(st.belt, ys); this.pBot = S(st.bottom, ys);
    this.pHw = S(st.hw, this.W / 2);
    this.edgeRange = [st.edge[0][0] * zs, st.edge[st.edge.length - 1][0] * zs];
    if (opts.seed) {
      const r = mulberry32(opts.seed * 7919 + 13);
      this.roofVar = (r() - 0.5) * 0.035 * this.H;
      this.beltVar = (r() - 0.5) * 0.02 * this.H;
      this.hwVar = (r() - 0.5) * 0.012 * this.W;
    }
    const sc = (p: P2): P2 => [p[0] * zs, p[1] * zs];
    this.m = {
      cowl: st.cowl * zs, header: st.header * zs, aBase: st.aBase * zs, wins: st.wins.map(sc),
      taper: st.taper ? sc(st.taper) : null, rearWin: st.rearWin ? sc(st.rearWin) : null,
    };
    this.arches = (opts.arches ?? [-spec.wheelbase / 2, spec.wheelbase / 2]).map((z) => ({ z, y: spec.wheelRadius + 0.012, r: spec.wheelRadius + Math.max(0.04, spec.wheelRadius * 0.14) }));
    this.xIn = spec.track / 2 - spec.wheelWidth / 2 - 0.04;
    let j = 0;
    SEGS.forEach((s, k) => { this.segStart[s] = j; this.segN[s] = res.cols[k]; j += res.cols[k]; });
    this.C = j + 1;
    this.RS = 2 * this.C - 2;
    const ds = this.distribute(res.rows);
    for (const k of res.faceK) this.rows.push({ d: 0, k, face: 1, s: this.sec(0) });
    this.iB0 = this.rows.length;
    for (const d of ds) this.rows.push({ d, k: 1, face: 0, s: this.sec(d) });
    this.iB1 = this.rows.length - 1;
    for (const k of [...res.faceK].reverse()) this.rows.push({ d: this.L, k, face: 2, s: this.sec(this.L) });
    this.buildGrid();
  }

  taperAt(d: number): number {
    const t = this.m.taper;
    if (!t) return 1;
    return Math.pow(1 - smooth(t[0], t[1], d), 0.85);
  }

  sec(d: number): SecP {
    const st = this.st.sec, xs = this.xs, ys = this.ys;
    const cab = smooth(this.m.cowl, this.m.header, d) * (1 - smooth((this.m.rearWin?.[0] ?? this.L * 0.8), (this.m.rearWin?.[1] ?? this.L), d));
    const yBelt = this.pBelt.at(d) + this.beltVar * smooth(0, 0.5, d / this.L);
    const eT = d >= this.edgeRange[0] && d <= this.edgeRange[1] ? this.pEdge.at(d) + this.roofVar * cab : -1;
    let yEdge = Math.max(yBelt + 0.012 * ys, eT);
    const yTop = Math.max(yEdge + 0.006 * ys, this.pTop.at(d) + this.roofVar * cab);
    yEdge = Math.min(yEdge, yTop - 0.003);
    const yBot = this.pBot.at(d);
    const hwMax = this.pHw.at(d) + this.hwVar;
    const span = yBelt - yBot;
    const ySill = yBot + st.sill * span, yMax = yBot + st.max * span, ySh = yBot + st.sh * span;
    const inset = Math.min(st.shIn * xs, hwMax * 0.12);
    const hwBelt = hwMax - inset;
    const hwSh = hwMax - inset * 0.32;
    const hwSill = hwMax - Math.min(st.sillIn * xs, hwMax * 0.1);
    const endT = smooth(0, 0.45 * this.zs, d) * (1 - smooth(this.L - 0.45 * this.zs, this.L, d));
    const hwBot = Math.max(hwMax * 0.4, hwMax - st.botIn * xs * lerp(0.55, 1, endT));
    const band = yEdge - yBelt;
    const hwEdge = hwBelt - Math.max(0.03 * xs, st.tumble * band);
    let gH = Math.max(0, band - Math.min(st.frame * ys, band * 0.5));
    gH *= this.taperAt(d);
    const yG = yBelt + gH;
    const hwG = band > 1e-6 ? lerp(hwBelt, hwEdge, gH / band) : hwBelt;
    return { yBot, hwBot, ySill, hwSill, yMax, hwMax, ySh, hwSh, yBelt, hwBelt, yG, hwG, yEdge, hwEdge, yTop };
  }

  /** Half cross-section (x ≥ 0) from the bottom centre to the top centre, C points as [x0,y0,x1,y1,...]. */
  sectionPts(s: SecP): number[] {
    const st = this.st.sec;
    const out: number[] = [0, s.yBot];
    const N = this.segN;
    const push = (x: number, y: number): void => { out.push(x, y); };
    const bez = (n: number, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number): void => {
      for (let i = 1; i <= n; i++) {
        const t = i / n, u = 1 - t;
        push(u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1);
      }
    };
    for (let i = 1; i <= N.A; i++) push((s.hwBot * i) / N.A, s.yBot);
    bez(N.B, s.hwBot, s.yBot, s.hwSill, s.yBot, s.hwSill, s.ySill);
    bez(N.C, s.hwSill, s.ySill, s.hwMax, s.ySill + 0.35 * (s.yMax - s.ySill), s.hwMax, s.yMax);
    bez(N.D, s.hwMax, s.yMax, s.hwMax + 0.002 * this.xs, (s.yMax + s.ySh) / 2, s.hwSh, s.ySh);
    bez(N.E, s.hwSh, s.ySh, s.hwSh, s.yBelt, s.hwBelt, s.yBelt);
    // glass band with a slight outward bow
    const dx = s.hwEdge - s.hwBelt, dy = s.yEdge - s.yBelt, len = Math.hypot(dx, dy) || 1;
    const onx = dy / len, ony = -dx / len;
    const gT = len > 1e-6 ? Math.hypot(s.hwG - s.hwBelt, s.yG - s.yBelt) / len : 0;
    for (let i = 1; i <= N.F; i++) {
      const t = (gT * i) / N.F;
      const b = st.bow * Math.sin(Math.PI * t) * len;
      push(s.hwBelt + dx * t + onx * b, s.yBelt + dy * t + ony * b);
    }
    for (let i = 1; i <= N.G; i++) {
      const t = lerp(gT, 1, i / N.G);
      const b = st.bow * Math.sin(Math.PI * t) * len;
      push(s.hwBelt + dx * t + onx * b, s.yBelt + dy * t + ony * b);
    }
    const n = st.topN;
    for (let i = 1; i <= N.H; i++) {
      const th = (i / N.H) * Math.PI * 0.5;
      const c = Math.cos(th), sn = Math.sin(th);
      const x = i === N.H ? 0 : s.hwEdge * Math.pow(c, 2 / n);
      push(x, s.yEdge + (s.yTop - s.yEdge) * Math.pow(sn, 2 / n));
    }
    return out;
  }

  private endF: { ym: number; h: number } | null = null;
  private endR: { ym: number; h: number } | null = null;
  /** z offset of a surface point: plan-view bend of the ends + side-view rake of the end faces. */
  bend(d: number, x: number, hw: number, y?: number): number {
    const zs = this.zs;
    const r = (x / Math.max(1e-6, hw)) ** 2;
    const bF = this.st.bendF * zs * (1 - smooth(0, 0.9 * zs, d));
    const bR = this.st.bendR * zs * smooth(this.L - 0.9 * zs, this.L, d);
    let z = (bF - bR) * r;
    if (y !== undefined) {
      if (!this.endF) { const a = this.sec(0), b = this.sec(this.L); this.endF = { ym: (a.yBot + a.yTop) / 2, h: (a.yTop - a.yBot) / 2 }; this.endR = { ym: (b.yBot + b.yTop) / 2, h: (b.yTop - b.yBot) / 2 }; }
      const tF = clamp(Math.abs(y - this.endF.ym) / this.endF.h, 0, 1), tR = clamp(Math.abs(y - this.endR!.ym) / this.endR!.h, 0, 1);
      z += (this.st.rakeF ?? 0) * zs * tF * tF * (1 - smooth(0, 0.3 * zs, d));
      z -= (this.st.rakeR ?? 0) * zs * tR * tR * smooth(this.L - 0.3 * zs, this.L, d);
    }
    return z;
  }

  private distribute(n: number): number[] {
    const L = this.L, NS = 1400;
    const feat = (d: number): number[] => { const s = this.sec(d); return [s.yTop, s.yEdge, s.yBelt, s.yBot, s.hwMax]; };
    const w = [1, 0.6, 0.6, 0.6, 1.6];
    const cum: number[] = [0];
    let prev = feat(0);
    for (let i = 1; i <= NS; i++) {
      const d = (L * i) / NS, f = feat(d), dd = L / NS;
      let arch = 0;
      for (const a of this.arches) { const z = this.zFront + d; if (Math.abs(z - a.z) < a.r + 0.06) arch = 0.9; }
      const endW = 1 + 2.5 * Math.exp(-d / (0.08 * this.zs)) + 2.5 * Math.exp(-(L - d) / (0.08 * this.zs));
      let s = dd * dd * (1 + arch) * endW * endW;
      for (let k = 0; k < 5; k++) s += w[k] * (f[k] - prev[k]) ** 2;
      cum.push(cum[i - 1] + Math.sqrt(s));
      prev = f;
    }
    const cumAt = (d: number): number => { const t = clamp((d / L) * NS, 0, NS); const i = Math.min(NS - 1, Math.floor(t)); return lerp(cum[i], cum[i + 1], t - i); };
    const inv = (c: number): number => {
      let lo = 0, hi = NS;
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cum[mid] <= c) lo = mid; else hi = mid; }
      const t = (c - cum[lo]) / Math.max(1e-12, cum[hi] - cum[lo]);
      return ((lo + clamp(t, 0, 1)) / NS) * L;
    };
    const m = this.m;
    const raw = [0, L, m.cowl, m.header, m.aBase, ...m.wins.flat(), ...(m.taper ?? []), ...(m.rearWin ?? [])];
    const pins = raw.filter((p) => p >= 0 && p <= L).sort((a, b) => a - b);
    const P: number[] = [];
    for (const p of pins) if (P.length === 0 || p - P[P.length - 1] > 0.012 * this.zs) P.push(p);
    if (P[P.length - 1] !== L) { if (L - P[P.length - 1] < 0.012 * this.zs) P[P.length - 1] = L; else P.push(L); }
    P[0] = 0;
    const total = cum[NS];
    const out: number[] = [0];
    for (let s = 0; s < P.length - 1; s++) {
      const c0 = cumAt(P[s]), c1 = cumAt(P[s + 1]);
      const k = Math.max(1, Math.round((n * (c1 - c0)) / total));
      for (let i = 1; i <= k; i++) out.push(i === k ? P[s + 1] : inv(lerp(c0, c1, i / k)));
    }
    return out;
  }

  vi(i: number, j: number, side: number): number {
    const C = this.C;
    return i * this.RS + (side > 0 || j === 0 || j === C - 1 ? j : C + j - 1);
  }

  private buildGrid(): void {
    const nR = this.rows.length, RS = this.RS, C = this.C;
    const P = new Float32Array(nR * RS * 3);
    for (let i = 0; i < nR; i++) {
      const row = this.rows[i];
      const pts = this.sectionPts(row.s);
      const ymid = (row.s.yBot + row.s.yTop) / 2;
      for (let j = 0; j < C; j++) {
        const x = pts[2 * j] * row.k;
        const y = ymid + (pts[2 * j + 1] - ymid) * row.k;
        const z = this.zFront + row.d + this.bend(row.d, x, row.s.hwMax, y);
        let o = this.vi(i, j, 1) * 3;
        P[o] = x; P[o + 1] = y; P[o + 2] = z;
        if (j > 0 && j < C - 1) { o = this.vi(i, j, -1) * 3; P[o] = -x; P[o + 1] = y; P[o + 2] = z; }
      }
    }
    // welded smooth normals
    const N = new Float32Array(P.length);
    const keyOf = new Int32Array(nR * RS);
    const keys = new Map<string, number>();
    for (let v = 0; v < nR * RS; v++) {
      const k = `${Math.round(P[v * 3] * 2e4)},${Math.round(P[v * 3 + 1] * 2e4)},${Math.round(P[v * 3 + 2] * 2e4)}`;
      let id = keys.get(k);
      if (id === undefined) { id = keys.size; keys.set(k, id); }
      keyOf[v] = id;
    }
    const acc = new Float32Array(keys.size * 3);
    const a = V(), b = V(), c = V(), e1 = V(), e2 = V(), f = V();
    const addTri = (ia: number, ib: number, ic: number): void => {
      a.fromArray(P, ia * 3); b.fromArray(P, ib * 3); c.fromArray(P, ic * 3);
      f.crossVectors(e1.subVectors(b, a), e2.subVectors(c, a));
      for (const v of [ia, ib, ic]) { const k = keyOf[v] * 3; acc[k] += f.x; acc[k + 1] += f.y; acc[k + 2] += f.z; }
    };
    this.forQuads((i, j, side, va, vb, vc, vd) => {
      if (side > 0) { addTri(va, vb, vc); addTri(vb, vd, vc); } else { addTri(va, vc, vb); addTri(vb, vc, vd); }
      void i; void j;
    });
    for (let v = 0; v < nR * RS; v++) {
      const k = keyOf[v] * 3;
      f.set(acc[k], acc[k + 1], acc[k + 2]);
      if (f.lengthSq() < 1e-20) f.set(0, 1, 0);
      f.normalize();
      N[v * 3] = f.x; N[v * 3 + 1] = f.y; N[v * 3 + 2] = f.z;
    }
    this.P0 = P.slice();
    // wheel arches: vertices above the hub are projected radially onto the arch circle, vertices below the hub
    // are folded inwards to the wheel-well wall; quads entirely inside the opening are dropped (skipQuad).
    const cut = new Uint8Array(nR * RS);
    for (let v = 0; v < nR * RS; v++) {
      const x = P[v * 3];
      if (Math.abs(x) < this.xIn) continue;
      let y = P[v * 3 + 1], z = P[v * 3 + 2];
      for (const ar of this.arches) {
        let dz = z - ar.z, dy = y - ar.y;
        if (dy >= 0) {
          let r = Math.hypot(dz, dy);
          if (r < ar.r) {
            if (r < 1e-6) { dz = 0; dy = 1; r = 1; }
            z = ar.z + (dz / r) * ar.r; y = ar.y + (dy / r) * ar.r;
            cut[v] = 1;
          }
        } else if (Math.abs(dz) < ar.r) {
          P[v * 3] = Math.sign(x) * this.xIn;
          cut[v] = 2;
        }
      }
      P[v * 3 + 1] = y; P[v * 3 + 2] = z;
    }
    this.cut = cut;
    this.P = P;
    this.N = N;
  }

  forQuads(fn: (i: number, j: number, side: number, a: number, b: number, c: number, d: number) => void): void {
    for (let i = 0; i < this.rows.length - 1; i++)
      for (let j = 0; j < this.C - 1; j++)
        for (const side of [1, -1]) fn(i, j, side, this.vi(i, j, side), this.vi(i, j + 1, side), this.vi(i + 1, j, side), this.vi(i + 1, j + 1, side));
  }

  /** true when a quad lies entirely inside a wheel-arch opening. */
  skipQuad(a: number, b: number, c: number, d: number): boolean {
    const k = this.cut;
    if (!k[a] || !k[b] || !k[c] || !k[d]) return false;
    return k[a] === 1 || k[b] === 1 || k[c] === 1 || k[d] === 1;
  }

  segOf(j: number): SegName {
    for (let k = SEGS.length - 1; k >= 0; k--) if (j >= this.segStart[SEGS[k]]) return SEGS[k];
    return 'A';
  }

  cls(i: number, j: number): Cls {
    const r0 = this.rows[i], r1 = this.rows[i + 1];
    const seg = this.segOf(j);
    if (r0.face || r1.face) return 'paint';
    if (seg === 'A') return 'under';
    const d = (r0.d + r1.d) / 2, m = this.m;
    if (this.st.cladding && (seg === 'B' || (seg === 'C' && j - this.segStart.C < this.segN.C * 0.5))) return 'clad';
    if (seg === 'F') {
      if (d < m.aBase) return 'paint';
      for (const w of m.wins) if (d >= w[0] && d <= w[1]) return 'glass';
      if (d > m.wins[0][0] && d < m.wins[m.wins.length - 1][1]) return 'black';
      return 'paint';
    }
    if (seg === 'H' && j - this.segStart.H >= 1) {
      if (d >= m.cowl && d <= m.header) return 'glass';
      if (m.rearWin && d >= m.rearWin[0] && d <= m.rearWin[1]) return 'glass';
    }
    return 'paint';
  }

  /** Bilinear evaluation of the (un-deformed) surface in index space. */
  evalRC(r: number, c: number, side: number): SP {
    const nR = this.rows.length;
    const i0 = clamp(Math.floor(r), 0, nR - 2), fi = clamp(r - i0, 0, 1);
    const j0 = clamp(Math.floor(c), 0, this.C - 2), fj = clamp(c - j0, 0, 1);
    const p = V(), n = V(), t = V();
    const w = [(1 - fi) * (1 - fj), (1 - fi) * fj, fi * (1 - fj), fi * fj];
    const vs = [this.vi(i0, j0, 1), this.vi(i0, j0 + 1, 1), this.vi(i0 + 1, j0, 1), this.vi(i0 + 1, j0 + 1, 1)];
    for (let k = 0; k < 4; k++) {
      p.addScaledVector(t.fromArray(this.P0, vs[k] * 3), w[k]);
      n.addScaledVector(t.fromArray(this.N, vs[k] * 3), w[k]);
    }
    if (side < 0) { p.x = -p.x; n.x = -n.x; }
    n.normalize();
    return { p, n };
  }

  rowAt(d: number): number {
    let lo = this.iB0, hi = this.iB1;
    if (d <= this.rows[lo].d) return lo;
    if (d >= this.rows[hi].d) return hi;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (this.rows[mid].d <= d) lo = mid; else hi = mid; }
    return lo + (d - this.rows[lo].d) / Math.max(1e-9, this.rows[hi].d - this.rows[lo].d);
  }

  col(seg: SegName, f: number): number { return this.segStart[seg] + f * this.segN[seg]; }

  /** Points along a straight line in index space. */
  lineRC(r0: number, c0: number, r1: number, c1: number, side: number, steps?: number): SP[] {
    const n = steps ?? Math.max(2, Math.ceil(Math.max(Math.abs(r1 - r0), Math.abs(c1 - c0)) * 1.5));
    const out: SP[] = [];
    for (let k = 0; k <= n; k++) out.push(this.evalRC(lerp(r0, r1, k / n), lerp(c0, c1, k / n), side));
    return out;
  }

  /** Grid patch on the surface in index space, offset along the normal. */
  patchRC(geo: Geo, layer: string, r0: number, r1: number, c0: number, c1: number, off: number, side: number, nr?: number, nc?: number): void {
    const NR = nr ?? Math.max(1, Math.ceil(Math.abs(r1 - r0))), NC = nc ?? Math.max(1, Math.ceil(Math.abs(c1 - c0)));
    const P: V3[][] = [], N: V3[][] = [];
    for (let a = 0; a <= NR; a++) {
      P.push([]); N.push([]);
      for (let b = 0; b <= NC; b++) {
        const s = this.evalRC(lerp(r0, r1, a / NR), lerp(c0, c1, b / NC), side);
        P[a].push(s.p.addScaledVector(s.n, off)); N[a].push(s.n);
      }
    }
    gridMesh(geo, layer, P, N);
  }

  /** Point on the analytic side surface at length d and height y. */
  sideAt(d: number, y: number): V3 {
    const s = this.sec(d), pts = this.sectionPts(s);
    for (let j = 0; j < this.C - 1; j++) {
      const y0 = pts[2 * j + 1], y1 = pts[2 * j + 3];
      if (y0 === y1) continue;
      if ((y - y0) * (y - y1) <= 0) {
        const t = (y - y0) / (y1 - y0), x = lerp(pts[2 * j], pts[2 * j + 2], t);
        return V(x, y, this.zFront + d + this.bend(d, x, s.hwMax, y));
      }
    }
    return V(s.hwMax, y, this.zFront + d);
  }
  sidePoint(d: number, y: number, side = 1): SP & { t: V3 } {
    const p = this.sideAt(d, y), pd = this.sideAt(d + 0.01, y), py = this.sideAt(d, y + 0.01);
    const tD = pd.sub(p), tY = py.sub(p);
    const n = V().crossVectors(tY, tD).normalize();
    if (side < 0) { p.x = -p.x; n.x = -n.x; tD.x = -tD.x; }
    return { p, n, t: tD.normalize() };
  }
  /** Point on the analytic top surface at length d and lateral x. */
  topAt(d: number, x: number): V3 {
    const s = this.sec(d), pts = this.sectionPts(s), ax = Math.abs(x);
    for (let j = this.segStart.D; j < this.C - 1; j++) {
      const x0 = pts[2 * j], x1 = pts[2 * j + 2];
      if ((ax - x0) * (ax - x1) <= 0 && x0 !== x1) {
        const t = (ax - x0) / (x1 - x0), y = lerp(pts[2 * j + 1], pts[2 * j + 3], t);
        return V(x, y, this.zFront + d + this.bend(d, ax, s.hwMax, y));
      }
    }
    return V(x, s.yTop, this.zFront + d);
  }
  topPoint(d: number, x: number): SP {
    const p = this.topAt(d, x), pd = this.topAt(d + 0.01, x), px = this.topAt(d, x + 0.01);
    const n = V().crossVectors(pd.sub(p), px.sub(p)).normalize();
    if (n.y < 0) n.negate();
    return { p, n };
  }

  /** Horizontal outline of the body at height y from the centreline around one end (mesh/plane slice,
   *  points sorted by angle around a centre inside the car). */
  outline(y: number, end: 0 | 1, dMax = 0.75): OPt[] {
    const nR = this.rows.length;
    const rows: number[] = [];
    if (end === 0) {
      for (let i = 0; i < nR; i++) { const r = this.rows[i]; if (r.face === 2 || (r.face === 0 && r.d > dMax * this.zs)) break; rows.push(i); }
    } else {
      for (let i = nR - 1; i >= 0; i--) { const r = this.rows[i]; if (r.face === 1 || (r.face === 0 && r.d < this.L - dMax * this.zs)) break; rows.push(i); }
      rows.reverse();
    }
    if (rows.length < 2) return [];
    const P0 = this.P0, N = this.N;
    const zc = this.zFront + this.L * 0.5;
    const pts: (OPt & { a: number })[] = [];
    const edge = (va: number, vb: number): void => {
      const ya = P0[va * 3 + 1], yb = P0[vb * 3 + 1];
      if (ya === yb || (y - ya) * (y - yb) > 0) return;
      const t = (y - ya) / (yb - ya);
      const p = V(lerp(P0[va * 3], P0[vb * 3], t), y, lerp(P0[va * 3 + 2], P0[vb * 3 + 2], t));
      const n = V(lerp(N[va * 3], N[vb * 3], t), lerp(N[va * 3 + 1], N[vb * 3 + 1], t), lerp(N[va * 3 + 2], N[vb * 3 + 2], t)).normalize();
      const a = Math.atan2(p.x, end === 0 ? zc - p.z : p.z - zc);
      pts.push({ p, n, a });
    };
    const i0 = rows[0], i1 = rows[rows.length - 1];
    for (let i = i0; i <= i1; i++)
      for (let j = 0; j < this.C; j++) {
        if (j < this.C - 1) edge(this.vi(i, j, 1), this.vi(i, j + 1, 1));
        if (i < i1) {
          edge(this.vi(i, j, 1), this.vi(i + 1, j, 1));
          if (j < this.C - 1) edge(this.vi(i, j + 1, 1), this.vi(i + 1, j, 1));
        }
      }
    pts.sort((a, b) => a.a - b.a);
    const res: OPt[] = [];
    for (const q of pts) if (!res.length || q.p.distanceTo(res[res.length - 1].p) > 0.002) res.push({ p: q.p, n: q.n });
    if (res.length && res[0].p.x > 1e-4) {
      const f = res[0];
      res.unshift({ p: V(0, y, f.p.z), n: V(0, f.n.y, f.n.z).normalize() });
    }
    return res;
  }

  resample(pts: OPt[], a0: number, a1: number, n: number): OPt[] | null {
    if (pts.length < 2) return null;
    const cum = [0];
    for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + pts[k].p.distanceTo(pts[k - 1].p));
    const total = cum[cum.length - 1];
    const out: OPt[] = [];
    let k = 0;
    for (let s = 0; s <= n; s++) {
      const a = clamp(lerp(a0, a1, s / n), 0, total);
      while (k < cum.length - 2 && cum[k + 1] < a) k++;
      const t = (a - cum[k]) / Math.max(1e-9, cum[k + 1] - cum[k]);
      out.push({ p: V().lerpVectors(pts[k].p, pts[k + 1].p, t), n: V().lerpVectors(pts[k].n, pts[k + 1].n, t).normalize() });
    }
    return out;
  }

  /** Surface-conforming horizontal band between heights y0..y1 over arc length a0..a1 (from the centreline). */
  band(geo: Geo, layer: string, b: Brush | ((side: number) => Brush), end: 0 | 1, y0: number, y1: number, a0: number, a1: number, off: number, n: number, o: { walls?: boolean; sides?: number[] } = {}): void {
    const A = this.resample(this.outline(y0, end), a0, a1, n), B = this.resample(this.outline(y1, end), a0, a1, n);
    if (!A || !B) return;
    for (const side of o.sides ?? [1, -1]) {
      geo.set(typeof b === 'function' ? b(side) : b);
      const mk = (pt: OPt, of: number): V3 => { const p = V().copy(pt.p).addScaledVector(pt.n, of); if (side < 0) p.x = -p.x; return p; };
      const mn = (pt: OPt): V3 => { const q = pt.n.clone(); if (side < 0) q.x = -q.x; return q; };
      const rowsP: V3[][] = [], rowsN: V3[][] = [];
      if (o.walls) { rowsP.push(A.map((p) => mk(p, 0))); rowsN.push(A.map(mn)); }
      rowsP.push(A.map((p) => mk(p, off))); rowsN.push(A.map(mn));
      rowsP.push(B.map((p) => mk(p, off))); rowsN.push(B.map(mn));
      if (o.walls) { rowsP.push(B.map((p) => mk(p, 0))); rowsN.push(B.map(mn)); }
      gridMesh(geo, layer, rowsP, rowsN);
    }
  }

  faceZ(end: 0 | 1, x: number, y: number): { z: number; n: V3 } {
    const s = this.rows[end === 0 ? this.iB0 : this.iB1].s;
    const d = end === 0 ? 0 : this.L;
    const z = this.zFront + d + this.bend(d, x, s.hwMax, y);
    const zx = this.zFront + d + this.bend(d, x + 0.005, s.hwMax, y), zy = this.zFront + d + this.bend(d, x, s.hwMax, y + 0.005);
    const n = V().crossVectors(V(0.005, 0, zx - z), V(0, 0.005, zy - z)).normalize();
    if ((end === 0 && n.z > 0) || (end === 1 && n.z < 0)) n.negate();
    return { z, n };
  }

  /** Planar patch on an end face (plates, badges, grilles). */
  facePatch(geo: Geo, layer: string, end: 0 | 1, x0: number, x1: number, y0: number, y1: number, off: number, nx = 4, ny = 1, uv?: [number, number, number, number], flipU = false): void {
    const P: V3[][] = [], N: V3[][] = [], U: P2[][] = [];
    for (let a = 0; a <= ny; a++) {
      P.push([]); N.push([]); U.push([]);
      for (let b = 0; b <= nx; b++) {
        const x = lerp(x0, x1, b / nx), y = lerp(y0, y1, a / ny);
        const f = this.faceZ(end, x, y);
        P[a].push(V(x, y, f.z).addScaledVector(f.n, off));
        N[a].push(f.n);
        if (uv) { const tu = flipU ? 1 - b / nx : b / nx; U[a].push([lerp(uv[0], uv[2], tu), lerp(uv[1], uv[3], a / ny)]); }
      }
    }
    gridMesh(geo, layer, P, N, uv ? U : undefined);
  }

  /** Emits the hero shell: shared vertices, groups paint / glass / uber. */
  emitHero(geo: Geo): void {
    geo.set(BR.gloss);
    const base = geo.n;
    const nV = this.rows.length * this.RS;
    for (let v = 0; v < nV; v++) geo.v(this.P[v * 3], this.P[v * 3 + 1], this.P[v * 3 + 2], this.N[v * 3], this.N[v * 3 + 1], this.N[v * 3 + 2]);
    this.forQuads((i, j, side, a, b, c, d) => {
      if (this.skipQuad(a, b, c, d)) return;
      const cl = this.cls(i, j);
      const layer = cl === 'paint' ? 'paint' : cl === 'glass' ? 'glass' : 'uber';
      a += base; b += base; c += base; d += base;
      if (side > 0) { geo.tri(layer, a, b, c); geo.tri(layer, b, d, c); } else { geo.tri(layer, a, c, b); geo.tri(layer, b, c, d); }
    });
  }

  /** Emits the traffic shell with per-region vertex attributes. */
  emitTraffic(geo: Geo, brushOf: (cl: Cls, i: number, j: number, y: number) => Brush): void {
    const cache = new Map<string, number>();
    const vert = (cl: Cls, b: Brush, v: number, key: string): number => {
      const k = key + ':' + v;
      let id = cache.get(k);
      if (id === undefined) {
        geo.set(b);
        id = geo.v(this.P[v * 3], this.P[v * 3 + 1], this.P[v * 3 + 2], this.N[v * 3], this.N[v * 3 + 1], this.N[v * 3 + 2]);
        cache.set(k, id);
      }
      void cl;
      return id;
    };
    this.forQuads((i, j, side, a, b, c, d) => {
      if (this.skipQuad(a, b, c, d)) return;
      const cl = this.cls(i, j);
      const yc = (this.P[a * 3 + 1] + this.P[d * 3 + 1]) / 2;
      const br = brushOf(cl, i, j, yc);
      const key = cl + '|' + br.c.join(',');
      const A = vert(cl, br, a, key), B = vert(cl, br, b, key), Cc = vert(cl, br, c, key), D = vert(cl, br, d, key);
      if (side > 0) { geo.tri('all', A, B, Cc); geo.tri('all', B, D, Cc); } else { geo.tri('all', A, Cc, B); geo.tri('all', B, Cc, D); }
    });
  }

  /** Interior lining (door cards, pillars, headliner) — the shell offset inwards, plus window reveals. */
  emitLining(geo: Geo, d0: number, d1: number, floorY: number): void {
    const thick = (j: number): number => (j < this.segStart.F ? 0.04 : 0.022);
    const zoneOf = (j: number): string => { const s = this.segOf(j); return s === 'B' || s === 'C' || s === 'D' ? 'door' : s === 'E' ? 'doorTop' : 'roof'; };
    const brushes: Record<string, Brush> = { door: BR.doorTrim, doorTop: BR.doorTop, roof: BR.headliner };
    const cache = new Map<string, number>();
    const P = this.P, N = this.N;
    const aoBase = geo.ao;
    const lv = (zone: string, i: number, j: number, side: number): number => {
      const v = this.vi(i, j, side);
      const k = `${zone}|${v}`;
      let id = cache.get(k);
      if (id === undefined) {
        const t = thick(j);
        geo.set(brushes[zone]);
        geo.ao = zone === 'roof' ? Math.min(1, aoBase * 1.7) : aoBase;
        id = geo.v(P[v * 3] - N[v * 3] * t, P[v * 3 + 1] - N[v * 3 + 1] * t, P[v * 3 + 2] - N[v * 3 + 2] * t, -N[v * 3], -N[v * 3 + 1], -N[v * 3 + 2]);
        cache.set(k, id);
      }
      return id;
    };
    const reveal = (zone: string, i0: number, j0: number, i1: number, j1: number, side: number): void => {
      const va = this.vi(i0, j0, side), vb = this.vi(i1, j1, side);
      const sa = V().fromArray(P, va * 3), sb = V().fromArray(P, vb * 3);
      const la = V().copy(sa).addScaledVector(V().fromArray(N, va * 3), -thick(j0));
      const lb = V().copy(sb).addScaledVector(V().fromArray(N, vb * 3), -thick(j1));
      const n = V().crossVectors(V().subVectors(sb, sa), V().subVectors(la, sa)).normalize();
      geo.set(brushes[zone]);
      const a = geo.vv(sa, n), b = geo.vv(sb, n), c = geo.vv(lb, n), d = geo.vv(la, n);
      const n2 = n.clone().negate();
      const a2 = geo.vv(sa, n2), b2 = geo.vv(sb, n2), c2 = geo.vv(lb, n2), d2 = geo.vv(la, n2);
      geo.tri('uber', a, b, c); geo.tri('uber', a, c, d);
      geo.tri('uber', a2, c2, b2); geo.tri('uber', a2, d2, c2);
    };
    for (let i = this.iB0; i < this.iB1; i++) {
      if (this.rows[i].d < d0 || this.rows[i + 1].d > d1) continue;
      for (let j = this.segStart.C; j < this.C - 1; j++) {
        if (this.cls(i, j) === 'glass') continue;
        const ymin = Math.min(P[this.vi(i, j, 1) * 3 + 1], P[this.vi(i + 1, j, 1) * 3 + 1]);
        if (ymin < floorY - 0.03) continue;
        const zone = zoneOf(j);
        for (const side of [1, -1]) {
          const a = lv(zone, i, j, side), b = lv(zone, i, j + 1, side), c = lv(zone, i + 1, j, side), d = lv(zone, i + 1, j + 1, side);
          if (side > 0) { geo.tri('uber', a, c, b); geo.tri('uber', b, c, d); } else { geo.tri('uber', a, b, c); geo.tri('uber', b, d, c); }
          if (j + 1 < this.C - 1 && this.cls(i, j + 1) === 'glass') reveal(zone, i, j + 1, i + 1, j + 1, side);
          if (j - 1 >= 0 && this.cls(i, j - 1) === 'glass') reveal(zone, i, j, i + 1, j, side);
          if (i + 1 < this.rows.length - 1 && this.cls(i + 1, j) === 'glass') reveal(zone, i + 1, j, i + 1, j + 1, side);
          if (i - 1 >= 0 && this.cls(i - 1, j) === 'glass') reveal(zone, i, j, i, j + 1, side);
        }
      }
    }
    geo.ao = aoBase;
  }
}

// =================================================================================================== canvas textures

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')!];
}
/** atlas rect in uv space from pixel coordinates (flipY convention). */
function uvRect(x: number, y: number, w: number, h: number, W: number, H: number): [number, number, number, number] {
  return [x / W, 1 - (y + h) / H, (x + w) / W, 1 - y / H];
}

const DETAIL = { W: 512, H: 512, tread: [0, 0, 512, 128] as const, quilt: [0, 160, 256, 256] as const };

function makeDetailTexture(): THREE.CanvasTexture {
  const [c, g] = canvas(DETAIL.W, DETAIL.H);
  g.fillStyle = '#808080';
  g.fillRect(0, 0, 512, 512);
  // tyre tread (64 repeats around the circumference, rows 20..108 = tread, margins flat)
  const rnd = mulberry32(5);
  g.fillStyle = '#9a9a9a';
  g.fillRect(0, 20, 512, 88);
  for (let k = 0; k < 64; k++) {
    const x0 = k * 8;
    g.fillStyle = '#303030';
    // outer shoulder blocks
    g.beginPath(); g.moveTo(x0, 20); g.lineTo(x0 + 2.4, 20); g.lineTo(x0 + 3.6, 40); g.lineTo(x0 + 1.2, 40); g.fill();
    g.beginPath(); g.moveTo(x0 + 4, 88); g.lineTo(x0 + 6.4, 88); g.lineTo(x0 + 5.2, 108); g.lineTo(x0 + 2.8, 108); g.fill();
    // central sipes
    g.fillStyle = '#505050';
    g.beginPath(); g.moveTo(x0 + 1, 46); g.lineTo(x0 + 2, 46); g.lineTo(x0 + 5, 62); g.lineTo(x0 + 4, 62); g.fill();
    g.beginPath(); g.moveTo(x0 + 5, 66); g.lineTo(x0 + 6, 66); g.lineTo(x0 + 3, 82); g.lineTo(x0 + 2, 82); g.fill();
  }
  // circumferential grooves (geometry has real grooves too; this softens them)
  g.fillStyle = '#404040';
  g.fillRect(0, 42, 512, 3); g.fillRect(0, 63, 512, 2); g.fillRect(0, 84, 512, 3);
  void rnd;
  // quilted leather (diamond stitching)
  const [qx, qy, qw, qh] = DETAIL.quilt;
  g.fillStyle = '#8c8c8c';
  g.fillRect(qx, qy, qw, qh);
  g.strokeStyle = '#5a5a5a';
  g.lineWidth = 3;
  for (let k = -8; k <= 16; k++) {
    g.beginPath(); g.moveTo(qx + k * 32, qy); g.lineTo(qx + k * 32 + qh, qy + qh); g.stroke();
    g.beginPath(); g.moveTo(qx + k * 32, qy + qh); g.lineTo(qx + k * 32 + qh, qy); g.stroke();
  }
  g.fillStyle = '#808080';
  g.fillRect(256, 160, 256, 352);
  g.fillRect(0, 416, 256, 96);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.anisotropy = 4;
  return t;
}

const DECAL = { W: 1024, H: 256 };
const DECAL_PLATE = uvRect(0, 0, 520, 112, DECAL.W, DECAL.H);
const DECAL_VIREO = uvRect(0, 128, 512, 64, DECAL.W, DECAL.H);
const DECAL_LUMEN = uvRect(528, 128, 384, 64, DECAL.W, DECAL.H);

function makeDecalTexture(plate: string): THREE.CanvasTexture {
  const [c, g] = canvas(DECAL.W, DECAL.H);
  g.clearRect(0, 0, DECAL.W, DECAL.H);
  // licence plate (French-style layout, fictional)
  g.fillStyle = '#f4f4f0';
  g.fillRect(0, 0, 520, 112);
  g.strokeStyle = '#111';
  g.lineWidth = 4;
  g.strokeRect(3, 3, 514, 106);
  g.fillStyle = '#1a3fa0';
  g.fillRect(5, 5, 44, 102);
  g.fillRect(471, 5, 44, 102);
  g.fillStyle = '#ffd400';
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; g.beginPath(); g.arc(27 + Math.cos(a) * 13, 36 + Math.sin(a) * 13, 2.2, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#fff';
  g.font = 'bold 30px Arial, Helvetica, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('F', 27, 84);
  g.font = 'bold 26px Arial, Helvetica, sans-serif';
  g.fillText('75', 493, 84);
  g.save();
  g.translate(260, 60);
  g.scale(0.82, 1);
  g.fillStyle = '#111';
  g.font = 'bold 82px "Arial Narrow", Arial, Helvetica, sans-serif';
  g.fillText(plate, 0, 0);
  g.restore();
  // rear lettering
  g.fillStyle = '#d8dadd';
  g.font = '600 50px Arial, Helvetica, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const word = 'VIREO';
  for (let k = 0; k < word.length; k++) g.fillText(word[k], 256 + (k - 2) * 92, 160);
  g.font = '500 40px Arial, Helvetica, sans-serif';
  g.fillText('L U M E N   H Y B R I D', 720, 160);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const SIGN = { W: 512, H: 128 };
function makeSignTexture(): THREE.CanvasTexture {
  const [c, g] = canvas(SIGN.W, SIGN.H);
  const grd = g.createLinearGradient(0, 0, 0, 128);
  grd.addColorStop(0, '#fbfbf7');
  grd.addColorStop(1, '#ecebe4');
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 128);
  g.fillStyle = '#16181c';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.save();
  g.translate(256, 66);
  g.scale(0.9, 1);
  g.font = 'bold 62px Arial, Helvetica, sans-serif';
  g.fillText('TAXI PARISIEN', 0, 0);
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const DASH = { W: 512, H: 512 };
const DASH_CLUSTER = uvRect(0, 0, 512, 160, DASH.W, DASH.H);
const DASH_CENTER = uvRect(0, 160, 512, 292, DASH.W, DASH.H);
const DASH_TAXI = uvRect(0, 452, 240, 60, DASH.W, DASH.H);

class DashDisplay {
  readonly canvas: HTMLCanvasElement;
  readonly tex: THREE.CanvasTexture;
  private g: CanvasRenderingContext2D;
  private last = '';
  private mapImg: HTMLCanvasElement;
  constructor() {
    [this.canvas, this.g] = canvas(DASH.W, DASH.H);
    this.mapImg = this.renderMap();
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 4;
    this.draw({ speedKmh: 0, rpm: 0, gear: 'P', fare: '0,00 €', clock: '12:00' });
  }
  private renderMap(): HTMLCanvasElement {
    const [c, g] = canvas(512, 292);
    g.fillStyle = '#0e1418';
    g.fillRect(0, 0, 512, 292);
    const r = mulberry32(42);
    g.save();
    g.translate(256, 160);
    g.rotate(-0.38);
    g.fillStyle = '#18222a';
    for (let x = -420; x < 420; x += 46)
      for (let y = -420; y < 420; y += 38) if (r() > 0.08) g.fillRect(x + 4, y + 4, 38 + (r() - 0.5) * 6, 30 + (r() - 0.5) * 6);
    g.strokeStyle = '#2a3944';
    g.lineWidth = 7;
    for (let k = -6; k < 7; k++) { g.beginPath(); g.moveTo(-500, k * 76 + 20); g.lineTo(500, k * 76 - 30); g.stroke(); }
    g.restore();
    // the river
    g.strokeStyle = '#1d3a52';
    g.lineWidth = 22;
    g.beginPath(); g.moveTo(-10, 60); g.bezierCurveTo(140, 120, 260, 30, 520, 110); g.stroke();
    // route
    g.strokeStyle = '#38b6ff';
    g.lineWidth = 7;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.beginPath(); g.moveTo(256, 250); g.lineTo(250, 190); g.lineTo(300, 150); g.lineTo(420, 132); g.stroke();
    // own position arrow
    g.fillStyle = '#ffffff';
    g.beginPath(); g.moveTo(256, 228); g.lineTo(268, 262); g.lineTo(256, 254); g.lineTo(244, 262); g.closePath(); g.fill();
    // header
    g.fillStyle = 'rgba(8,12,16,0.88)';
    g.fillRect(0, 0, 512, 46);
    g.fillStyle = '#38b6ff';
    g.beginPath(); g.moveTo(22, 32); g.lineTo(22, 20); g.lineTo(14, 20); g.lineTo(26, 8); g.lineTo(38, 20); g.lineTo(30, 20); g.lineTo(30, 32); g.fill();
    g.fillStyle = '#e8eef3';
    g.font = '600 22px Arial, Helvetica, sans-serif';
    g.textBaseline = 'middle';
    g.fillText('Rue de Rivoli', 52, 18);
    g.fillStyle = '#8fa3b2';
    g.font = '15px Arial, Helvetica, sans-serif';
    g.fillText('250 m · puis Pont Neuf', 52, 37);
    // footer bar
    g.fillStyle = 'rgba(8,12,16,0.88)';
    g.fillRect(0, 258, 512, 34);
    g.fillStyle = '#c9d4dc';
    g.font = '15px Arial, Helvetica, sans-serif';
    g.fillText('Arrivée 21:58  ·  3,2 km', 14, 276);
    g.fillStyle = '#3ddc84';
    g.fillText('VIREO · EV 72%', 380, 276);
    return c;
  }
  draw(s: CarDashboardState): void {
    const key = `${Math.round(s.speedKmh)}|${Math.round(s.rpm / 50)}|${s.gear}|${s.fare ?? ''}|${s.clock ?? ''}`;
    if (key === this.last) return;
    this.last = key;
    const g = this.g;
    // ------------------------------------------------ cluster (0,0,512,160)
    const grd = g.createLinearGradient(0, 0, 0, 160);
    grd.addColorStop(0, '#060a0e');
    grd.addColorStop(1, '#0c141b');
    g.fillStyle = grd;
    g.fillRect(0, 0, 512, 160);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    // power / rpm arc
    const f = clamp(s.rpm / 7000, 0, 1);
    g.lineCap = 'round';
    g.lineWidth = 9;
    g.strokeStyle = '#1b2833';
    g.beginPath(); g.arc(400, 104, 62, Math.PI * 0.85, Math.PI * 2.15); g.stroke();
    g.strokeStyle = f > 0.8 ? '#ff6a3a' : '#38b6ff';
    g.beginPath(); g.arc(400, 104, 62, Math.PI * 0.85, Math.PI * (0.85 + 1.3 * f)); g.stroke();
    g.fillStyle = '#9fb3c2';
    g.font = '14px Arial, Helvetica, sans-serif';
    g.fillText('x1000', 400, 132);
    g.fillStyle = '#e9f1f7';
    g.font = 'bold 30px Arial, Helvetica, sans-serif';
    g.fillText((s.rpm / 1000).toFixed(1), 400, 102);
    // speed
    g.fillStyle = '#ffffff';
    g.font = 'bold 76px Arial, Helvetica, sans-serif';
    g.fillText(String(Math.round(Math.abs(s.speedKmh))), 120, 92);
    g.fillStyle = '#8fa3b2';
    g.font = '16px Arial, Helvetica, sans-serif';
    g.fillText('km/h', 120, 140);
    // gear
    g.strokeStyle = '#38b6ff';
    g.lineWidth = 3;
    g.strokeRect(232, 64, 50, 54);
    g.fillStyle = '#ffffff';
    g.font = 'bold 40px Arial, Helvetica, sans-serif';
    g.fillText(s.gear, 257, 93);
    // top status row
    g.font = '15px Arial, Helvetica, sans-serif';
    g.fillStyle = '#9fb3c2';
    g.textAlign = 'left';
    g.fillText('14°C', 16, 18);
    g.textAlign = 'right';
    g.fillText(s.clock ?? '', 496, 18);
    g.textAlign = 'center';
    g.fillStyle = '#3ddc84';
    g.fillText('EV  ·  412 km', 257, 18);
    // ------------------------------------------------ centre screen (0,160,512,292)
    g.drawImage(this.mapImg, 0, 160);
    g.fillStyle = 'rgba(8,12,16,0.88)';
    g.fillRect(430, 166, 76, 30);
    g.fillStyle = '#e8eef3';
    g.font = 'bold 18px Arial, Helvetica, sans-serif';
    g.fillText(s.clock ?? '', 468, 182);
    // ------------------------------------------------ taximeter (0,452,240,60)
    g.fillStyle = '#050505';
    g.fillRect(0, 452, 240, 60);
    g.fillStyle = '#ff3b1f';
    g.font = 'bold 40px "Courier New", monospace';
    g.textAlign = 'right';
    g.fillText(s.fare ?? '', 232, 484);
    g.textAlign = 'center';
    g.fillStyle = '#3ddc84';
    g.font = 'bold 22px Arial, Helvetica, sans-serif';
    g.fillText('A', 18, 470);
    g.font = '10px Arial, Helvetica, sans-serif';
    g.fillStyle = '#9a9a9a';
    g.fillText('TARIF', 18, 494);
    this.tex.needsUpdate = true;
  }
}

// =================================================================================================== materials

/** Clamp HDR output: sun highlights on low-roughness clearcoat exceed the half-float range of post-processing
 *  targets (→ Inf → bloom blow-out). 16 is far above any bloom threshold. */
function clampOut(fs: string): string {
  return fs.replace('#include <opaque_fragment>', '#include <opaque_fragment>\ngl_FragColor.rgb = min( gl_FragColor.rgb, vec3( 16.0 ) );');
}

function makePaintMaterial(color: number): THREE.MeshPhysicalMaterial {
  const m = new THREE.MeshPhysicalMaterial({ color, metalness: 0.6, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.05 });
  m.onBeforeCompile = (sh) => { sh.fragmentShader = clampOut(sh.fragmentShader); };
  m.customProgramCacheKey = () => 'vireo-paint-v1';
  return m;
}

function makeUberMaterial(levels: Float32Array, detail: THREE.Texture | null): THREE.MeshStandardMaterial {
  // detail = greyscale cavity atlas (tyre tread, seat quilting); 0.5 grey = neutral. A cavity multiply is used
  // instead of bump mapping: screen-space bump derivatives produced HDR fireflies on grazing tyre sidewalls.
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
  const uLevels = { value: levels };
  const uDetail = { value: detail };
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uLevels = uLevels;
    sh.uniforms.uDetail = uDetail;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
attribute vec4 aSurf;
attribute vec3 aEmit;
uniform float uLevels[16];
varying vec2 vSurfMR;
varying vec3 vEmitC;
varying vec2 vUvD;
varying float vAO;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
vSurfMR = aSurf.xy;
vAO = aSurf.w;
vUvD = uv;
vEmitC = aEmit * uLevels[int(aSurf.z + 0.5)];`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform sampler2D uDetail;
varying vec2 vSurfMR;
varying vec3 vEmitC;
varying vec2 vUvD;
varying float vAO;`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
reflectedLight.indirectDiffuse *= vAO;
reflectedLight.indirectSpecular *= vAO * vAO;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
float cav = texture2D( uDetail, vUvD ).r * 2.0;
diffuseColor.rgb *= cav;`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = clamp( vSurfMR.y + ( 1.0 - cav ) * 0.25, 0.0, 1.0 );')
      .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = vSurfMR.x;')
      .replace('#include <emissivemap_fragment>', 'totalEmissiveRadiance += vEmitC;');
    sh.fragmentShader = clampOut(sh.fragmentShader);
  };
  m.customProgramCacheKey = () => 'vireo-uber-v3';
  return m;
}

function makeGlassMaterial(opacity: number): THREE.MeshPhysicalMaterial {
  const m = new THREE.MeshPhysicalMaterial({
    color: 0x0b0f13, metalness: 0, roughness: 0.03, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false,
    envMapIntensity: 1.25, specularIntensity: 1,
  });
  // reflections stay at full strength while the body of the glass is see-through (premultiplied-style blend)
  m.blending = THREE.CustomBlending;
  m.blendSrc = THREE.OneFactor;
  m.blendDst = THREE.OneMinusSrcAlphaFactor;
  m.blendEquation = THREE.AddEquation;
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `
float inside = gl_FrontFacing ? 1.0 : 0.22;
gl_FragColor = vec4( min( totalDiffuse * diffuseColor.a + totalSpecular * inside + totalEmissiveRadiance, vec3( 16.0 ) ), diffuseColor.a * mix( 0.75, 1.0, inside ) );`);
  };
  m.customProgramCacheKey = () => 'vireo-glass-v1';
  return m;
}

/** The shared traffic material (see TrafficCarAsset docs for attributes and uniforms). */
export function createTrafficMaterial(): THREE.MeshStandardMaterial {
  const uniforms = { uNight: { value: 0 }, uHeadlight: { value: 7 }, uTail: { value: 3 }, uSign: { value: 3 } };
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
  m.userData.uniforms = uniforms;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
attribute float paintMask;
attribute float lightMask;
attribute vec2 surf;
uniform float uNight;
uniform float uHeadlight;
uniform float uTail;
uniform float uSign;
varying vec2 vSurfMR;
varying vec3 vEmitC;`)
      .replace('#include <color_vertex>', `
vColor = vec4( 1.0 );
vColor.rgb *= color;
#ifdef USE_INSTANCING_COLOR
vColor.rgb *= mix( vec3( 1.0 ), instanceColor.rgb, paintMask );
#endif
vSurfMR = surf;
vEmitC = vec3( 0.0 );
if ( lightMask > 0.5 && lightMask < 1.5 ) vEmitC = vec3( 1.0, 0.93, 0.82 ) * ( 0.6 + uNight * uHeadlight );
else if ( lightMask > 1.5 && lightMask < 2.5 ) vEmitC = vec3( 1.0, 0.03, 0.015 ) * ( uNight * uTail );
else if ( lightMask > 2.5 ) vEmitC = color * ( 0.35 + uNight * uSign );`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec2 vSurfMR;
varying vec3 vEmitC;`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = vSurfMR.y;')
      .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = vSurfMR.x;')
      .replace('#include <emissivemap_fragment>', 'totalEmissiveRadiance += vEmitC;');
    sh.fragmentShader = clampOut(sh.fragmentShader);
  };
  m.customProgramCacheKey = () => 'vireo-traffic-v1';
  return m;
}

// =================================================================================================== wheels

function tyreAndRim(geo: Geo, spec: CarModelSpec, hero: boolean, m: THREE.Matrix4): void {
  const R = spec.wheelRadius, w = spec.wheelWidth;
  const s = R / 0.34;
  const rr = hero ? R * 0.705 : R * 0.68;
  const sh = R - rr;
  const seg = hero ? 56 : 10;
  const tread = (x: number): number => 1 - (20 + clamp(x / (0.72 * w) + 0.5, 0, 1) * 88) / DETAIL.H;
  const margin = 1 - 8 / DETAIL.H;
  const uFn = (t: number): number => t;
  if (hero) {
    const pts: LP[] = [
      { r: rr + 0.004, x: -w * 0.43, v: margin },
      { r: rr + sh * 0.35, x: -w * 0.5 - 0.004, v: margin },
      { r: rr + sh * 0.75, x: -w * 0.5 - 0.002, v: margin },
      { r: R - 0.02, x: -w * 0.47, v: margin },
      { r: R - 0.005, x: -w * 0.42, v: tread(-w * 0.36) },
      { r: R, x: -w * 0.36, v: tread(-w * 0.36) },
      { r: R, x: -w * 0.16, v: tread(-w * 0.16), sharp: true },
      { r: R - 0.008, x: -w * 0.15, v: tread(-w * 0.15), sharp: true },
      { r: R - 0.008, x: -w * 0.1, v: tread(-w * 0.1), sharp: true },
      { r: R, x: -w * 0.09, v: tread(-w * 0.09), sharp: true },
      { r: R, x: w * 0.09, v: tread(w * 0.09), sharp: true },
      { r: R - 0.008, x: w * 0.1, v: tread(w * 0.1), sharp: true },
      { r: R - 0.008, x: w * 0.15, v: tread(w * 0.15), sharp: true },
      { r: R, x: w * 0.16, v: tread(w * 0.16), sharp: true },
      { r: R, x: w * 0.36, v: tread(w * 0.36) },
      { r: R - 0.005, x: w * 0.42, v: tread(w * 0.36) },
      { r: R - 0.02, x: w * 0.47, v: margin },
      { r: rr + sh * 0.75, x: w * 0.5 + 0.002, v: margin },
      { r: rr + sh * 0.35, x: w * 0.5 + 0.004, v: margin },
      { r: rr + 0.004, x: w * 0.43, v: margin },
    ];
    geo.set(brush(0x101011, 0, 0.88));
    lathe(geo, 'uber', pts, seg, m, uFn);
    const face = brush(0xd5d9de, 1, 0.2), dark = brush(0x24272b, 0.85, 0.42), steel = brush(0x6e7276, 1, 0.42);
    // lip + barrel
    const xf = w * 0.49;
    geo.set(face);
    lathe(geo, 'uber', [{ r: rr + 0.011, x: w * 0.4 }, { r: rr + 0.014, x: w * 0.47 }, { r: rr + 0.009, x: xf + 0.008 }, { r: rr - 0.006, x: xf + 0.01 }, { r: rr - 0.016, x: xf + 0.002, sharp: true }], seg, m);
    geo.set(dark);
    geo.ao = 0.5;
    lathe(geo, 'uber', [{ r: rr - 0.016, x: xf + 0.002 }, { r: rr - 0.022, x: w * 0.3, sharp: true }, { r: rr - 0.022, x: -w * 0.4, sharp: true }, { r: rr + 0.008, x: -w * 0.46 }], seg, m);
    geo.ao = 1;
    // twin spokes (5 pairs)
    const r0 = 0.066 * s, r1 = rr - 0.012;
    const xHub = xf - 0.04 * s;
    const depth = 0.026 * s;
    const p = V(), nn = V(), nmx = new THREE.Matrix3().getNormalMatrix(m);
    const flip = m.determinant() < 0;
    for (let k = 0; k < 10; k++) {
      const pair = Math.floor(k / 2), sgn = k % 2 === 0 ? -1 : 1;
      const phi0 = (pair / 5) * Math.PI * 2;
      const NS = 5;
      const sec: { c: V3; t: V3; r: V3; w: number; x: number }[] = [];
      for (let i = 0; i <= NS; i++) {
        const tt = i / NS;
        const r = lerp(r0, r1, tt);
        const phi = phi0 + sgn * lerp(0.07, 0.13, tt);
        const wdt = lerp(0.03, 0.02, tt) * s;
        const x = lerp(xHub, xf + 0.002, Math.pow(tt, 0.7));
        const rd = V(0, Math.cos(phi), Math.sin(phi));
        const tg = V(0, -Math.sin(phi), Math.cos(phi));
        sec.push({ c: V(x, rd.y * r, rd.z * r), t: tg, r: rd, w: wdt, x });
      }
      // 4 sides: face(+x), side+, back(-x), side-
      const corner = (sc: (typeof sec)[number], a: number, b: number): V3 => V().copy(sc.c).addScaledVector(sc.t, a * sc.w * (b > 0 ? 0.5 : 0.62)).add(V(b > 0 ? 0 : -depth, 0, 0));
      const sides: { b: Brush; ca: [number, number]; cb: [number, number]; n: (sc: (typeof sec)[number]) => V3 }[] = [
        { b: face, ca: [-1, 1], cb: [1, 1], n: () => V(1, 0, 0) },
        { b: dark, ca: [1, 1], cb: [1, -1], n: (sc) => sc.t.clone() },
        { b: dark, ca: [1, -1], cb: [-1, -1], n: () => V(-1, 0, 0) },
        { b: dark, ca: [-1, -1], cb: [-1, 1], n: (sc) => sc.t.clone().negate() },
      ];
      for (const sd of sides) {
        geo.set(sd.b);
        const ids: number[][] = [];
        for (const sc of sec) {
          const pa = corner(sc, sd.ca[0], sd.ca[1]), pb = corner(sc, sd.cb[0], sd.cb[1]);
          const n0 = sd.n(sc);
          p.copy(pa).applyMatrix4(m); nn.copy(n0).applyMatrix3(nmx).normalize();
          const ia = geo.vv(p, nn);
          p.copy(pb).applyMatrix4(m);
          const ib = geo.vv(p, nn);
          ids.push([ia, ib]);
        }
        // orientation test in local space
        const e1 = V().subVectors(corner(sec[0], sd.cb[0], sd.cb[1]), corner(sec[0], sd.ca[0], sd.ca[1]));
        const e2 = V().subVectors(sec[1].c, sec[0].c);
        let f = V().crossVectors(e1, e2).dot(sd.n(sec[0])) < 0;
        if (flip) f = !f;
        for (let i = 0; i < NS; i++) {
          const a = ids[i][0], b = ids[i][1], c = ids[i + 1][0], d = ids[i + 1][1];
          if (!f) { geo.tri('uber', a, b, c); geo.tri('uber', b, d, c); } else { geo.tri('uber', a, c, b); geo.tri('uber', b, c, d); }
        }
      }
    }
    // hub + centre cap
    geo.set(dark);
    lathe(geo, 'uber', [{ r: 0.0001, x: xHub + 0.012 }, { r: 0.028 * s, x: xHub + 0.012, sharp: true }, { r: 0.03 * s, x: xHub + 0.006, sharp: true }, { r: 0.074 * s, x: xHub - 0.002 }, { r: 0.08 * s, x: xHub - 0.022 }], 24, m);
    geo.set(face);
    lathe(geo, 'uber', [{ r: 0.0001, x: xHub + 0.0135 }, { r: 0.018 * s, x: xHub + 0.0135 }], 16, m);
    // lug bolts
    geo.set(BR.satin);
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 + Math.PI / 5;
      const mm = m.clone().multiply(mat4([xHub + 0.006, Math.cos(a) * 0.05 * s, Math.sin(a) * 0.05 * s]));
      lathe(geo, 'uber', [{ r: 0.0001, x: 0.012 }, { r: 0.009 * s, x: 0.012, sharp: true }, { r: 0.009 * s, x: 0 }], 6, mm);
    }
    // brake disc + hat
    const rd = rr - 0.035, xd = xf - 0.085 * s;
    geo.ao = 0.55;
    geo.set(steel);
    lathe(geo, 'uber', [{ r: 0.1 * s, x: xd - 0.013 }, { r: rd, x: xd - 0.013, sharp: true }, { r: rd, x: xd + 0.013, sharp: true }, { r: 0.1 * s, x: xd + 0.013 }], 40, m);
    geo.set(dark);
    lathe(geo, 'uber', [{ r: 0.1 * s, x: xd + 0.013 }, { r: 0.085 * s, x: xd + 0.03 }, { r: 0.075 * s, x: xHub - 0.022 }], 24, m);
    geo.ao = 1;
  } else {
    geo.set(brush(0x111112, 0, 0.9));
    lathe(geo, 'all', [{ r: rr, x: -w * 0.45 }, { r: R - 0.03, x: -w * 0.5 }, { r: R, x: -w * 0.4 }, { r: R, x: w * 0.4 }, { r: R - 0.03, x: w * 0.5 }, { r: rr, x: w * 0.45 }], seg, m);
    geo.set(brush(0x9a9ea3, 1, 0.35));
    lathe(geo, 'all', [{ r: rr, x: w * 0.45 }, { r: rr * 0.82, x: w * 0.42 }], seg, m);
    geo.set(brush(0x3a3d41, 0.8, 0.45));
    lathe(geo, 'all', [{ r: rr * 0.82, x: w * 0.42 }, { r: rr * 0.25, x: w * 0.3 }, { r: 0.0001, x: w * 0.33 }], seg, m);
  }
}

function caliperGeo(geo: Geo, spec: CarModelSpec): void {
  const R = spec.wheelRadius, w = spec.wheelWidth, s = R / 0.34;
  const rr = R * 0.705, rd = rr - 0.035, xd = w * 0.49 - 0.085 * s;
  const th0 = 0.8 - 0.36, th1 = 0.8 + 0.36, NS = 8;
  geo.ao = 0.6;
  const rI = rd - 0.05 * s, rO = rd + 0.012, xI = xd - 0.03, xO = xd + 0.034;
  geo.set(brush(0x2b2e33, 0.35, 0.45));
  const pt = (r: number, x: number, th: number): V3 => V(x, r * Math.cos(th), r * Math.sin(th));
  const strip = (f: (th: number, k: 0 | 1) => V3, nf: (th: number) => V3): void => {
    const P: V3[][] = [[], []], N: V3[][] = [[], []];
    for (let i = 0; i <= NS; i++) {
      const th = lerp(th0, th1, i / NS);
      P[0].push(f(th, 0)); P[1].push(f(th, 1));
      N[0].push(nf(th)); N[1].push(nf(th));
    }
    gridMesh(geo, 'uber', P, N);
  };
  strip((th, k) => pt(rO, k ? xO : xI, th), (th) => V(0, Math.cos(th), Math.sin(th)));
  strip((th, k) => pt(rI, k ? xO : xI, th), (th) => V(0, -Math.cos(th), -Math.sin(th)));
  strip((th, k) => pt(k ? rO : rI, xO, th), () => V(1, 0, 0));
  strip((th, k) => pt(k ? rO : rI, xI, th), () => V(-1, 0, 0));
  for (const th of [th0, th1]) {
    const tn = V(0, -Math.sin(th), Math.cos(th)).multiplyScalar(th === th0 ? -1 : 1);
    gridMesh(geo, 'uber', [[pt(rI, xI, th), pt(rI, xO, th)], [pt(rO, xI, th), pt(rO, xO, th)]], [[tn, tn], [tn, tn]]);
  }
}

// =================================================================================================== hero details

function heroExterior(geo: Geo, sh: Shell, spec: CarModelSpec): void {
  const xs = sh.xs, ys = sh.ys, zs = sh.zs, L = sh.L;
  const fS = sh.rows[sh.iB0].s, rS = sh.rows[sh.iB1].s;
  const fTop = fS.yTop, fBot = fS.yBot, rTop = rS.yTop, rBot = rS.yBot;
  const A = (a: number): number => a * xs;
  const ind = (side: number): Brush => brush(0xd9a066, 0, 0.2, { ch: side < 0 ? CH.IND_L : CH.IND_R, emit: EMIT.amber });

  // ------------------------------------------------------------------ front
  sh.band(geo, 'uber', brush(0x343a41, 0.85, 0.1), 0, fTop - 0.032 * ys, fTop + 0.028 * ys, A(0.37), A(0.78), 0.004, 18, { walls: true });
  sh.band(geo, 'uber', BR.seam, 0, fTop + 0.034 * ys, fTop + 0.039 * ys, 0, A(0.95), 0.0012, 24);
  sh.band(geo, 'uber', BR.satin, 0, fBot - 0.006 * ys, fBot + 0.004 * ys, 0, A(0.62), 0.0035, 14);
  sh.band(geo, 'uber', BR.gloss, 0, fTop - 0.03 * ys, fTop + 0.026 * ys, 0, A(0.375), 0.003, 10, { walls: true });
  sh.band(geo, 'uber', brush(0xdfe3e8, 0, 0.25, { ch: CH.DRL, emit: EMIT.drl }), 0, fTop + 0.012 * ys, fTop + 0.021 * ys, A(0.385), A(0.7), 0.0068, 16);
  sh.band(geo, 'uber', brush(0xcfd4da, 0, 0.3, { ch: CH.DRL, emit: EMIT.drl }), 0, fTop + 0.0125 * ys, fTop + 0.0185 * ys, 0, A(0.39), 0.006, 10);
  sh.band(geo, 'uber', ind, 0, fTop + 0.012 * ys, fTop + 0.021 * ys, A(0.705), A(0.77), 0.0068, 4);
  sh.band(geo, 'uber', brush(0xd7dbe0, 1, 0.1, { ch: CH.HIGH, emit: EMIT.head }), 0, fTop - 0.022 * ys, fTop + 0.003 * ys, A(0.42), A(0.53), 0.0062, 5);
  sh.band(geo, 'uber', brush(0xd7dbe0, 1, 0.1, { ch: CH.HEAD, emit: EMIT.head }), 0, fTop - 0.022 * ys, fTop + 0.003 * ys, A(0.55), A(0.68), 0.0062, 6);
  // lower intake with slats
  sh.band(geo, 'uber', BR.mesh, 0, fBot - 0.012 * ys, fBot + 0.15 * ys, 0, A(0.48), 0.003, 10, { walls: true });
  for (let k = 0; k < 4; k++) {
    const y = fBot + (0.025 + k * 0.035) * ys;
    sh.band(geo, 'uber', BR.darkChrome, 0, y - 0.004, y + 0.004, 0, A(0.47), 0.006, 10);
  }
  sh.band(geo, 'uber', BR.satin, 0, fBot + 0.15 * ys, fBot + 0.158 * ys, 0, A(0.49), 0.005, 10);
  sh.band(geo, 'uber', BR.mesh, 0, fBot + 0.02 * ys, fBot + 0.16 * ys, A(0.53), A(0.6), 0.003, 3, { walls: true });
  // plate
  geo.set(BR.plateBack);
  sh.facePatch(geo, 'uber', 0, -0.272, 0.272, fBot + 0.04 * ys, fBot + 0.16 * ys, 0.016, 4, 4);
  geo.set(brush(0xffffff, 0, 0.35));
  sh.facePatch(geo, 'decal', 0, -0.26, 0.26, fBot + 0.046 * ys, fBot + 0.154 * ys, 0.02, 4, 4, DECAL_PLATE, true);
  // emblem (chevron)
  {
    geo.set(BR.chrome);
    const yc = fTop - 0.002 * ys;
    for (const sgn of [-1, 1]) {
      const pts: SP[] = [];
      for (let k = 0; k <= 3; k++) {
        const t = k / 3, x = sgn * lerp(0.036, 0.0, t), y = yc + lerp(0.018, -0.016, t);
        const f = sh.faceZ(0, x, y);
        pts.push({ p: V(x, y, f.z - 0.004), n: f.n });
      }
      ribbon(geo, 'uber', pts, 0.008, 0.007);
    }
  }
  // ------------------------------------------------------------------ rear
  const tail = brush(0x3a0503, 0, 0.12, { ch: CH.TAIL, emit: EMIT.red });
  const tailB = brush(0x420604, 0, 0.12, { ch: CH.BRAKE_TAIL, emit: EMIT.red });
  sh.band(geo, 'uber', BR.gloss, 1, rTop - 0.088 * ys, rTop - 0.028 * ys, 0, A(1.06), 0.003, 30, { walls: true });
  sh.band(geo, 'uber', tail, 1, rTop - 0.07 * ys, rTop - 0.044 * ys, 0, A(0.6), 0.0058, 16);
  sh.band(geo, 'uber', tailB, 1, rTop - 0.08 * ys, rTop - 0.034 * ys, A(0.6), A(1.03), 0.0062, 14);
  sh.band(geo, 'uber', ind, 1, rTop - 0.098 * ys, rTop - 0.086 * ys, A(0.66), A(1.0), 0.005, 8, { walls: true });
  sh.band(geo, 'uber', brush(0x7d8187, 0.3, 0.12, { ch: CH.REVERSE, emit: EMIT.white }), 1, rTop - 0.098 * ys, rTop - 0.086 * ys, A(0.4), A(0.6), 0.005, 5, { walls: true });
  // trunk / bumper parting line
  sh.band(geo, 'uber', BR.seam, 1, rTop - 0.29 * ys, rTop - 0.285 * ys, 0, A(1.15), 0.0012, 30);
  // diffuser
  sh.band(geo, 'uber', brush(0x0c0c0d, 0, 0.45), 1, rBot - 0.025 * ys, rBot + 0.075 * ys, 0, A(0.8), 0.003, 14, { walls: true });
  sh.band(geo, 'uber', BR.satin, 1, rBot + 0.075 * ys, rBot + 0.082 * ys, 0, A(0.72), 0.004, 12);
  sh.band(geo, 'uber', brush(0x5a0606, 0, 0.2), 1, rBot + 0.03 * ys, rBot + 0.05 * ys, A(0.62), A(0.74), 0.0055, 3);
  // plate + lettering
  geo.set(BR.plateBack);
  sh.facePatch(geo, 'uber', 1, -0.272, 0.272, rBot + 0.14 * ys, rBot + 0.26 * ys, 0.004, 4, 4);
  geo.set(brush(0xffffff, 0, 0.35, { ch: CH.PLATE, emit: 0x202020 }));
  sh.facePatch(geo, 'decal', 1, -0.26, 0.26, rBot + 0.146 * ys, rBot + 0.254 * ys, 0.008, 4, 4, DECAL_PLATE);
  geo.set(brush(0xffffff, 0, 0.3));
  sh.facePatch(geo, 'decal', 1, -0.19, 0.19, rTop - 0.155 * ys, rTop - 0.11 * ys, 0.0025, 6, 3, DECAL_VIREO);

  // ------------------------------------------------------------------ sides
  const m = sh.m;
  const lastWin = m.wins[m.wins.length - 1];
  const cBelt = sh.col('F', 0), cGlassTop = sh.col('G', 0);
  geo.set(BR.chrome);
  for (const side of [1, -1]) {
    // DLO chrome surround
    ribbon(geo, 'uber', sh.lineRC(sh.rowAt(m.aBase), cBelt - 0.1, sh.rowAt(lastWin[1]), cBelt - 0.1, side), 0.011, 0.0018);
    ribbon(geo, 'uber', sh.lineRC(sh.rowAt(m.aBase), cGlassTop + 0.3, sh.rowAt(lastWin[1]), cGlassTop + 0.3, side), 0.009, 0.0016);
  }
  // seams (door cut lines, hood, trunk)
  geo.set(BR.seam);
  const cSill = sh.col('C', 0.18), cTopBelt = sh.col('E', 0.85);
  const doorSeams = [m.cowl + 0.035 * zs, m.wins[0][1] + 0.03 * zs, (m.taper ? m.taper[1] : lastWin[1]) - 0.06 * zs];
  for (const side of [1, -1]) {
    for (const d of doorSeams) ribbon(geo, 'uber', sh.lineRC(sh.rowAt(d), cSill, sh.rowAt(d), cTopBelt, side), 0.0045, 0.0012);
    ribbon(geo, 'uber', sh.lineRC(sh.rowAt(doorSeams[0]), cSill, sh.rowAt(doorSeams[2]), cSill, side), 0.004, 0.0012);
    const cHood = sh.col('H', 0.12);
    ribbon(geo, 'uber', sh.lineRC(sh.rowAt(0.09 * zs), cHood, sh.rowAt(m.cowl - 0.07 * zs), cHood, side), 0.0045, 0.0012);
    if (m.rearWin) ribbon(geo, 'uber', sh.lineRC(sh.rowAt(m.rearWin[1] + 0.03 * zs), cHood, sh.rowAt(L - 0.03 * zs), cHood, side), 0.0045, 0.0012);
    // charge flap on the right rear quarter
    if (side > 0) {
      const d0 = (lastWin[1] + 0.12) * 1, d1 = d0 + 0.14 * zs;
      const c0 = sh.col('D', 0.15), c1 = sh.col('D', 0.85);
      const r0 = sh.rowAt(d0), r1 = sh.rowAt(d1);
      ribbon(geo, 'uber', sh.lineRC(r0, c0, r1, c0, 1), 0.003, 0.0012);
      ribbon(geo, 'uber', sh.lineRC(r0, c1, r1, c1, 1), 0.003, 0.0012);
      ribbon(geo, 'uber', sh.lineRC(r0, c0, r0, c1, 1), 0.003, 0.0012);
      ribbon(geo, 'uber', sh.lineRC(r1, c0, r1, c1, 1), 0.003, 0.0012);
    }
  }
  // cowl panel + wipers
  geo.set(BR.matte);
  for (const side of [1, -1]) sh.patchRC(geo, 'uber', sh.rowAt(m.cowl - 0.06 * zs), sh.rowAt(m.cowl + 0.006 * zs), sh.col('H', 0.1), sh.col('H', 1), 0.0025, side, 2, 6);
  geo.set(brush(0x070708, 0.2, 0.5));
  for (const [x0, x1] of [[-0.66, -0.04], [0.06, 0.6]]) {
    const pts: SP[] = [];
    for (let k = 0; k <= 8; k++) { const t = k / 8, x = lerp(x0, x1, t) * xs; pts.push(sh.topPoint(m.cowl + (0.05 + 0.05 * t) * zs, x)); }
    ribbon(geo, 'uber', pts, 0.014, 0.012);
  }
  // rocker strip (satin) between the arches
  geo.set(BR.darkChrome);
  const a0 = sh.arches[0], a1 = sh.arches[sh.arches.length - 1];
  for (const side of [1, -1]) {
    const cR = sh.col('C', 0.42);
    ribbon(geo, 'uber', sh.lineRC(sh.rowAt(a0.z - sh.zFront + a0.r + 0.06), cR, sh.rowAt(a1.z - sh.zFront - a1.r - 0.06), cR, side), 0.016, 0.0018);
  }
  // door handles (flush)
  for (const side of [1, -1]) {
    for (const d of [m.wins[0][1] - 0.32 * zs, (m.wins[1]?.[1] ?? m.wins[0][1]) - (m.taper ? 0.55 : 0.32) * zs]) {
      const sp = sh.sidePoint(d, sh.sec(d).yBelt - 0.075 * ys, side);
      const pos = V().copy(sp.p).addScaledVector(sp.n, 0.002);
      rbox(geo, 'uber', BR.chrome, [0.15, 0.022, 0.012], basisMatrix(pos, sp.t, sp.n), 0.005, 1);
    }
  }
  // mirrors
  for (const side of [1, -1]) {
    const d = m.cowl + 0.09 * zs;
    const sp = sh.sidePoint(d, sh.sec(d).yBelt + 0.04 * ys, side);
    const out = V(side, 0, 0);
    const hc = V().copy(sp.p).addScaledVector(out, 0.14).add(V(0, 0.045, 0.035));
    const stalkC = V().lerpVectors(sp.p, hc, 0.45);
    rbox(geo, 'paint', BR.gloss, [0.1, 0.035, 0.06], mat4(stalkC, [0, 0, side * 0.25]), 0.012, 1);
    const hm = mat4(hc, [0, side * -0.08, 0], [0.115, 0.064, 0.075]);
    const hg = new THREE.SphereGeometry(1, 16, 10, Math.PI, Math.PI);
    geo.set(BR.gloss).add('paint', hg, hm);
    hg.dispose();
    const cg = new THREE.CircleGeometry(1, 20);
    geo.set(BR.mirrorGlass).add('uber', cg, mat4(V().copy(hc).add(V(0, 0, -0.004)), [0, side * -0.08, 0], [0.105, 0.056, 1]));
    cg.dispose();
    const rg = new THREE.RingGeometry(0.93, 1.0, 20);
    geo.set(BR.gloss).add('uber', rg, mat4(V().copy(hc).add(V(0, 0, 0.0005)), [0, side * -0.08, 0], [0.115, 0.064, 1]));
    rg.dispose();
    // repeater
    rbox(geo, 'uber', ind(side), [0.07, 0.008, 0.02], mat4(V().copy(hc).add(V(side * 0.03, -0.05, -0.03)), [0, side * -0.25, 0]), 0.003, 1);
  }
  // shark-fin antenna
  if (m.rearWin) {
    const tp = sh.topPoint(m.rearWin[0] - 0.12 * zs, 0);
    const fg = new THREE.SphereGeometry(1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    geo.set(BR.gloss).add('uber', fg, mat4(V().copy(tp.p).add(V(0, -0.004, 0)), [0, 0, 0], [0.032, 0.058, 0.12]));
    fg.dispose();
  }
  // fender badge
  {
    const d = sh.arches[0].z - sh.zFront + sh.arches[0].r + 0.13 * zs;
    for (const side of [1, -1]) {
      const sp = sh.sidePoint(d, sh.sec(d).yBelt - 0.13 * ys, side);
      const pos = V().copy(sp.p).addScaledVector(sp.n, 0.0025);
      const t = side > 0 ? sp.t : sp.t.clone().negate();
      plane(geo, 'decal', brush(0xffffff, 0, 0.3), 0.15, 0.025, basisMatrix(pos, t, sp.n), DECAL_LUMEN);
    }
  }
  void spec;
}

function archDetails(geo: Geo, sh: Shell, layerLip: string, lipBrush: Brush, linerLayer: string, linerBrush: Brush, hero: boolean): void {
  const NS = hero ? 34 : 8;
  for (const a of sh.arches) {
    for (const side of [1, -1]) {
      // lip: three rows (body surface, lip crown, inside)
      const rows: V3[][] = [[], [], []], nrm: V3[][] = [[], [], []];
      const angles: number[] = [];
      for (let k = 0; k <= NS; k++) angles.push(lerp(-0.14, Math.PI + 0.14, k / NS));
      for (const phi of angles) {
        const cy = Math.sin(phi), cz = -Math.cos(phi);
        const y = a.y + a.r * Math.max(cy, Math.sin(-0.14));
        const z = phi < 0 ? a.z - a.r : phi > Math.PI ? a.z + a.r : a.z + a.r * cz;
        const radial = phi < 0 ? V(0, 0, -1) : phi > Math.PI ? V(0, 0, 1) : V(0, cy, cz);
        const d = z - sh.zFront;
        const sp = sh.sidePoint(d, y, side);
        const outer = V().copy(sp.p).addScaledVector(radial, 0.016).addScaledVector(sp.n, 0.001);
        const crown = V().copy(sp.p).addScaledVector(sp.n, 0.006).addScaledVector(radial, 0.002);
        const inner = V().copy(sp.p).add(V(-side * 0.03, 0, 0)).addScaledVector(radial, -0.004);
        rows[0].push(outer); rows[1].push(crown); rows[2].push(inner);
        nrm[0].push(sp.n.clone()); nrm[1].push(V().copy(sp.n).addScaledVector(radial, -1).normalize()); nrm[2].push(radial.clone().negate());
      }
      if (hero) { geo.set(lipBrush); gridMesh(geo, layerLip, rows, nrm); }
      // liner (half cylinder + inner wall)
      const xi = side * (sh.xIn - 0.03);
      const LP: V3[][] = [[], []], LN: V3[][] = [[], []];
      const wall: V3[] = [];
      for (const phi of angles) {
        const cy = Math.sin(phi), cz = -Math.cos(phi);
        const rr = a.r + 0.006;
        const yb = sh.sec(a.z - sh.zFront).yBot + 0.03;
        const y = phi < 0 || phi > Math.PI ? Math.max(yb, a.y + a.r * Math.sin(-0.14)) : a.y + rr * cy;
        const z = phi < 0 ? a.z - rr : phi > Math.PI ? a.z + rr : a.z + rr * cz;
        const xo = side * Math.max(Math.abs(xi) + 0.02, sh.sideAt(z - sh.zFront, y).x - 0.012);
        LP[0].push(V(xo, y, z)); LP[1].push(V(xi, y, z));
        const n = phi < 0 ? V(0, 0, 1) : phi > Math.PI ? V(0, 0, -1) : V(0, -cy, -cz);
        LN[0].push(n); LN[1].push(n);
        wall.push(V(xi, y, z));
      }
      geo.set(linerBrush);
      const ao0 = geo.ao;
      geo.ao = 0.35;
      gridMesh(geo, linerLayer, LP, LN);
      const wn = V(side, 0, 0);
      const cIdx = geo.vv(V(xi, a.y - 0.1, a.z), wn);
      const ids = wall.map((p) => geo.vv(p, wn));
      for (let k = 0; k < ids.length - 1; k++) {
        if (side > 0) geo.tri(linerLayer, cIdx, ids[k + 1], ids[k]); else geo.tri(linerLayer, cIdx, ids[k], ids[k + 1]);
      }
      geo.ao = ao0;
    }
  }
}

function taxiSignGeo(geo: Geo, sh: Shell, signLayer: string, lampLayer: string, hero: boolean): void {
  const d = sh.m.header + (hero ? 0.42 : 0.42) * sh.zs;
  const tp = sh.topPoint(d, 0);
  const y0 = tp.p.y - 0.004, z0 = tp.p.z;
  const W = 0.44, Hs = 0.115, Ds = 0.11;
  const whiteUV = uvRect(2, 2, 4, 4, SIGN.W, SIGN.H);
  if (hero) {
    rbox(geo, 'uber', BR.gloss, [0.36, 0.03, 0.15], mat4([0, y0 + 0.012, z0]), 0.01, 1);
    rbox(geo, signLayer, brush(0xffffff, 0, 0.3), [W, Hs, Ds], mat4([0, y0 + 0.028 + Hs / 2, z0]), 0.018, 2, whiteUV);
    const textUV = uvRect(0, 0, SIGN.W, SIGN.H, SIGN.W, SIGN.H);
    const ty = y0 + 0.028 + Hs / 2 + 0.012;
    plane(geo, signLayer, brush(0xffffff, 0, 0.25), W - 0.05, Hs - 0.042, mat4([0, ty, z0 - Ds / 2 - 0.0012], [0, Math.PI, 0]), textUV);
    plane(geo, signLayer, brush(0xffffff, 0, 0.25), W - 0.05, Hs - 0.042, mat4([0, ty, z0 + Ds / 2 + 0.0012]), textUV);
    const lamps: [number, number, number][] = [[-0.055, CH.TAXI_GREEN, EMIT.green], [0, CH.TAXI_AMBER, EMIT.amber], [0.055, CH.TAXI_RED, EMIT.red]];
    for (const [x, ch, e] of lamps) {
      const base = ch === CH.TAXI_GREEN ? 0x2c6b3a : ch === CH.TAXI_RED ? 0x6b2420 : 0x7a5a2a;
      rbox(geo, lampLayer, brush(base, 0, 0.15, { ch, emit: e }), [0.034, 0.016, 0.012], mat4([x, y0 + 0.028 + 0.014, z0 - Ds / 2 - 0.004]), 0.004, 1);
    }
  } else {
    geo.set(brush(0x101010, 0, 0.5));
    const bg = new THREE.BoxGeometry(0.36, 0.03, 0.15);
    geo.add('all', bg, mat4([0, y0 + 0.012, z0]));
    bg.dispose();
    geo.set(brush(0xf4f4ee, 0, 0.3, { light: 3 }));
    const sg = new THREE.BoxGeometry(W, Hs, Ds);
    geo.add('all', sg, mat4([0, y0 + 0.028 + Hs / 2, z0]));
    sg.dispose();
    geo.set(brush(0x33ff55, 0, 0.3, { light: 3 }));
    const lg = new THREE.BoxGeometry(0.034, 0.016, 0.01);
    geo.add('all', lg, mat4([-0.055, y0 + 0.028 + 0.014, z0 - Ds / 2 - 0.004]));
    lg.dispose();
  }
}

// =================================================================================================== hero interior

interface InteriorOut { steering: THREE.Group | null; cockpit: V3 }

function heroInterior(geo: Geo, sh: Shell, full: boolean, swGeo: Geo): InteriorOut {
  const xs = sh.xs, ys = sh.ys, zs = sh.zs;
  const zc = sh.zFront + sh.m.cowl;
  const Z = (dz: number): number => zc + dz * zs;
  const Y = (y: number): number => y * ys;
  const X = (x: number): number => x * xs;
  const floorY = sh.sec(sh.L / 2).yBot + 0.09 * ys;
  geo.ao = 0.32;
  const dEnd = sh.m.rearWin ? sh.m.rearWin[1] : sh.L * 0.85;
  sh.emitLining(geo, sh.m.cowl - 0.02 * zs, dEnd, floorY);
  const midS = sh.sec(sh.m.cowl + 1.2 * zs);
  // floor
  {
    const hwF = sh.sideAt(sh.m.cowl + 1.2 * zs, floorY).x - 0.012;
    const P = [[V(-hwF, floorY, Z(-0.06)), V(hwF, floorY, Z(-0.06))], [V(-hwF, floorY, Z(2.75)), V(hwF, floorY, Z(2.75))]];
    const N = [[V(0, 1, 0), V(0, 1, 0)], [V(0, 1, 0), V(0, 1, 0)]];
    geo.set(BR.carpet);
    gridMesh(geo, 'uber', P, N);
  }
  // door sills (close the gap between floor and door cards)
  {
    const zA = Z(-0.02), zB = Math.min(Z(2.75), sh.arches[sh.arches.length - 1].z - sh.arches[sh.arches.length - 1].r - 0.05);
    for (const s of [-1, 1]) {
      const x = sh.sideAt(sh.m.cowl + 1.2 * zs, floorY + 0.08).x - 0.035;
      rbox(geo, 'uber', BR.softDark, [0.05, 0.2, zB - zA], mat4([s * x, floorY + 0.08, (zA + zB) / 2]), 0.01, 1);
      rbox(geo, 'uber', BR.satin, [0.012, 0.004, (zB - zA) * 0.5], mat4([s * (x - 0.02), floorY + 0.181, Z(0.55)]), 0.002, 1);
    }
  }
  // dashboard (loft along x)
  const dashHW = sh.sec(sh.m.cowl + 0.3 * zs).hwBelt - 0.035 * xs;
  const profUp: P2[] = [[0.03, 0.9], [0.15, 0.94], [0.28, 0.972], [0.38, 0.986], [0.44, 0.984], [0.47, 0.966], [0.478, 0.93], [0.465, 0.87]];
  const profLo: P2[] = [[0.465, 0.87], [0.462, 0.8], [0.43, 0.71], [0.36, 0.61], [0.26, 0.5], [0.13, 0.38], [0.0, floorY / ys]];
  const loft = (prof: P2[], b: Brush): void => {
    const NX = 12;
    const P: V3[][] = [], N: V3[][] = [];
    for (let k = 0; k < prof.length; k++) {
      P.push([]); N.push([]);
      const a = prof[Math.max(0, k - 1)], c = prof[Math.min(prof.length - 1, k + 1)];
      const tz = c[0] - a[0], ty = c[1] - a[1], l = Math.hypot(tz, ty) || 1;
      const n = V(0, tz / l, -ty / l);
      for (let i = 0; i <= NX; i++) {
        const x = lerp(-dashHW, dashHW, i / NX);
        const edge = Math.abs(x) / dashHW;
        const dzAdj = edge > 0.85 ? -0.06 * smooth(0.85, 1, edge) : 0;
        P[k].push(V(x, Y(prof[k][1]), Z(prof[k][0] + dzAdj * (prof[k][0] > 0.3 ? 1 : 0))));
        N[k].push(n.clone());
      }
    }
    geo.set(b);
    gridMesh(geo, 'uber', P, N);
  };
  loft(profUp, BR.soft);
  loft(profLo, BR.softDark);
  // dash trim + ambient strip + vents
  rbox(geo, 'uber', BR.satin, [dashHW * 2 - 0.1, 0.022, 0.014], mat4([0, Y(0.845), Z(0.467)], [-0.1, 0, 0]), 0.004, 1);
  rbox(geo, 'uber', brush(0x9fd4ff, 0, 0.3, { ch: CH.AMBIENT, emit: EMIT.ambient }), [dashHW * 2 - 0.14, 0.004, 0.006], mat4([0, Y(0.829), Z(0.469)]), 0.0015, 1);
  for (const [x0, x1] of [[-0.66, -0.5], [-0.2, -0.07], [0.07, 0.2], [0.5, 0.66]]) {
    rbox(geo, 'uber', BR.piano, [X(x1 - x0), 0.034, 0.012], mat4([X((x0 + x1) / 2), Y(0.892), Z(0.474)], [-0.25, 0, 0]), 0.005, 1);
    for (let k = 0; k < 3; k++) rbox(geo, 'uber', BR.satin, [X(x1 - x0) - 0.01, 0.003, 0.004], mat4([X((x0 + x1) / 2), Y(0.882 + k * 0.01), Z(0.481 - k * 0.0025)]), 0.001, 1);
  }
  // cluster pod + screen
  const eye = V(X(-0.37), Y(1.17), Z(1.3));
  {
    const pc = V(X(-0.37), Y(1.03), Z(0.41));
    const rm = mat4(pc, [-0.17, 0, 0]);
    rbox(geo, 'uber', BR.piano, [0.33, 0.105, 0.07], rm, 0.012, 2);
    rbox(geo, 'uber', BR.soft, [0.35, 0.016, 0.1], rm.clone().multiply(mat4([0, 0.058, -0.012], [-0.08, 0, 0])), 0.006, 1);
    plane(geo, 'screen', brush(0xffffff, 0, 0.2), 0.295, 0.092, rm.clone().multiply(mat4([0, 0, 0.0362])), DASH_CLUSTER);
  }
  // centre screen
  {
    const sc = V(X(0.02), Y(1.035), Z(0.39));
    const rm = mat4(sc, [-0.2, -0.14, 0], [1, 1, 1], 'YXZ');
    rbox(geo, 'uber', BR.piano, [0.31, 0.185, 0.016], rm, 0.008, 1);
    plane(geo, 'screen', brush(0xffffff, 0, 0.2), 0.292, 0.166, rm.clone().multiply(mat4([0, 0, 0.0085])), DASH_CENTER);
    rbox(geo, 'uber', BR.satin, [0.04, 0.09, 0.03], mat4([X(0.02), Y(0.96), Z(0.33)], [-0.2, 0, 0]), 0.006, 1);
  }
  // taximeter
  {
    const tc = V(X(0.3), Y(0.986) + 0.026, Z(0.33));
    const rm = mat4(tc, [0, -0.3, 0], [1, 1, 1], 'YXZ');
    rbox(geo, 'uber', brush(0x121214, 0.2, 0.4), [0.15, 0.05, 0.075], rm, 0.008, 1);
    plane(geo, 'screen', brush(0xffffff, 0, 0.2), 0.124, 0.031, rm.clone().multiply(mat4([0, 0.002, 0.0378])), DASH_TAXI);
  }
  // centre console + armrest + selector
  rbox(geo, 'uber', BR.softDark, [0.24, Y(0.82) - floorY, 0.24], mat4([0, (Y(0.82) + floorY) / 2, Z(0.5)]), 0.02, 1);
  rbox(geo, 'uber', BR.softDark, [0.22, Y(0.6) - floorY, 0.92], mat4([0, (Y(0.6) + floorY) / 2, Z(1.06)]), 0.03, 1);
  rbox(geo, 'uber', BR.satin, [0.2, 0.006, 0.6], mat4([0, Y(0.6) + 0.002, Z(0.92)]), 0.003, 1);
  rbox(geo, 'uber', BR.piano, [0.16, 0.008, 0.25], mat4([0, Y(0.6) + 0.006, Z(0.86)]), 0.003, 1);
  rbox(geo, 'uber', BR.leather, [0.2, 0.07, 0.34], mat4([0, Y(0.66), Z(1.38)]), 0.025, 2);
  rbox(geo, 'uber', BR.leatherDark, [0.04, 0.05, 0.07], mat4([X(-0.01), Y(0.6) + 0.03, Z(0.88)], [0.3, 0, 0]), 0.015, 1);
  rbox(geo, 'uber', BR.chrome, [0.044, 0.008, 0.074], mat4([X(-0.01), Y(0.6) + 0.012, Z(0.885)], [0.3, 0, 0]), 0.003, 1);
  rbox(geo, 'uber', brush(0x9fd4ff, 0, 0.3, { ch: CH.BACKLIGHT, emit: 0xbfe3ff }), [0.12, 0.003, 0.006], mat4([0, Y(0.6) + 0.0105, Z(0.79)]), 0.001, 1);
  // seats
  const quilt = uvRect(DETAIL.quilt[0], DETAIL.quilt[1], DETAIL.quilt[2], DETAIL.quilt[3], DETAIL.W, DETAIL.H);
  const seat = (x: number, w: number, cushionZ: number, backZ: number, recline: number, front: boolean): void => {
    const cm = mat4([x, Y(0.47), Z(cushionZ)], [0.1, 0, 0]);
    rbox(geo, 'uber', BR.leather, [w - 0.1, 0.12, 0.5], cm, 0.035, 2, quilt);
    for (const s of [-1, 1]) rbox(geo, 'uber', BR.leatherDark, [0.075, 0.15, 0.5], cm.clone().multiply(mat4([s * (w / 2 - 0.035), 0.018, 0])), 0.03, 2);
    const bm = mat4([x, Y(front ? 0.84 : 0.8), Z(backZ)], [recline, 0, 0]);
    rbox(geo, 'uber', BR.leather, [w - 0.1, front ? 0.64 : 0.58, 0.1], bm, 0.035, 2, quilt);
    for (const s of [-1, 1]) rbox(geo, 'uber', BR.leatherDark, [0.075, front ? 0.6 : 0.55, 0.15], bm.clone().multiply(mat4([s * (w / 2 - 0.035), -0.02, -0.01])), 0.03, 2);
    rbox(geo, 'uber', BR.leatherDark, [w - 0.04, (front ? 0.66 : 0.6), 0.05], bm.clone().multiply(mat4([0, 0, 0.065])), 0.02, 1);
  };
  if (full) {
    seat(X(-0.37), 0.52, 1.12, 1.5, 0.33, true);
    seat(X(0.37), 0.52, 1.12, 1.5, 0.33, true);
    for (const x of [X(-0.37), X(0.37)]) {
      rbox(geo, 'uber', BR.leatherDark, [0.27, 0.17, 0.09], mat4([x, Y(1.28), Z(1.66)], [0.2, 0, 0]), 0.035, 2);
      for (const s of [-1, 1]) cyl(geo, 'uber', BR.satin, 0.006, 0.006, 0.1, mat4([x + s * 0.07, Y(1.17), Z(1.63)], [0.2, 0, 0]), 6);
    }
    seat(0, X(1.24), 2.1, 2.45, 0.42, false);
    for (const x of [X(-0.38), X(0.38)]) rbox(geo, 'uber', BR.leatherDark, [0.25, 0.13, 0.08], mat4([x, Y(1.12), Z(2.55)], [0.42, 0, 0]), 0.03, 2);
  } else {
    rbox(geo, 'uber', BR.leatherDark, [X(0.5), 0.6, 0.5], mat4([X(-0.37), Y(0.7), Z(1.3)]), 0.05, 1);
    rbox(geo, 'uber', BR.leatherDark, [X(0.5), 0.6, 0.5], mat4([X(0.37), Y(0.7), Z(1.3)]), 0.05, 1);
    rbox(geo, 'uber', BR.leatherDark, [X(1.2), 0.55, 0.5], mat4([0, Y(0.68), Z(2.25)]), 0.05, 1);
  }
  // parcel shelf
  if (sh.m.rearWin) {
    const yS = sh.sec(sh.m.rearWin[1]).yBelt + 0.02 * ys;
    const z0 = Z(2.6), z1 = sh.zFront + sh.m.rearWin[1] + 0.02;
    if (z1 > z0) rbox(geo, 'uber', BR.softDark, [X(1.3), 0.02, z1 - z0], mat4([0, yS, (z0 + z1) / 2]), 0.008, 1);
  }
  // door armrests, pulls and ambient strips
  const doors: P2[] = [[sh.m.aBase + 0.05 * zs, sh.m.wins[0][1] - 0.05 * zs], [(sh.m.wins[1]?.[0] ?? sh.m.wins[0][1]) + 0.05 * zs, (sh.m.taper ? sh.m.taper[1] - 0.25 * zs : sh.m.wins[sh.m.wins.length - 1][1])]];
  for (const side of [1, -1]) {
    for (const [d0, d1] of doors) {
      const dm = (d0 + d1) / 2, len = d1 - d0;
      if (len <= 0.1) continue;
      const ya = Y(0.68);
      const sp = sh.sidePoint(dm, ya, side);
      const ax = sp.p.x - side * 0.075;
      rbox(geo, 'uber', BR.leather, [0.07, 0.05, len * 0.7], mat4([ax, ya, sp.p.z]), 0.02, 1);
      const yb = sh.sec(dm).yBelt - 0.035 * ys;
      const sb = sh.sidePoint(dm, yb, side);
      rbox(geo, 'uber', BR.satin, [0.012, 0.012, len * 0.92], mat4([sb.p.x - side * 0.05, yb + 0.004, sb.p.z]), 0.004, 1);
      rbox(geo, 'uber', brush(0x9fd4ff, 0, 0.3, { ch: CH.AMBIENT, emit: EMIT.ambient }), [0.004, 0.004, len * 0.9], mat4([sb.p.x - side * 0.056, yb - 0.006, sb.p.z]), 0.0015, 1);
      rbox(geo, 'uber', BR.chrome, [0.02, 0.025, 0.1], mat4([sp.p.x - side * 0.06, Y(0.79), sp.p.z - len * 0.2]), 0.006, 1);
    }
  }
  // rear-view mirror + sun visors
  {
    const hd = sh.m.header;
    const tp = sh.topAt(hd + 0.06 * zs, 0);
    rbox(geo, 'uber', BR.softDark, [0.028, 0.06, 0.03], mat4([0, tp.y - 0.05, tp.z + 0.03]), 0.008, 1);
    rbox(geo, 'uber', BR.softDark, [0.21, 0.058, 0.03], mat4([0, tp.y - 0.09, tp.z + 0.06], [0.1, 0, 0]), 0.012, 1);
    plane(geo, 'uber', BR.mirrorGlass, 0.196, 0.047, mat4([0, tp.y - 0.09, tp.z + 0.0755], [0.1, 0, 0]));
    for (const s of [-1, 1]) {
      const vp = sh.topAt(hd + 0.13 * zs, X(0.36) * s);
      rbox(geo, 'uber', BR.headliner, [0.4, 0.014, 0.17], mat4([X(0.36) * s, vp.y - 0.05, vp.z + 0.02], [0.18, 0, 0]), 0.006, 1);
    }
  }
  // steering column + wheel
  let steering: THREE.Group | null = null;
  const tilt = 0.384;
  const wc = V(X(-0.37), Y(0.86), Z(0.64));
  const axis = V(0, Math.sin(tilt), Math.cos(tilt));
  if (full) {
    const c0 = V().copy(wc).addScaledVector(axis, -0.06), c1 = V().copy(wc).addScaledVector(axis, -0.3);
    const cm = new THREE.Matrix4().compose(V().lerpVectors(c0, c1, 0.5), new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), axis), V(1, 1, 1));
    cyl(geo, 'uber', BR.softDark, 0.042, 0.034, c0.distanceTo(c1), cm, 12);
    // stalks
    for (const s of [-1, 1]) rbox(geo, 'uber', BR.softDark, [0.11, 0.012, 0.016], mat4(V().copy(wc).addScaledVector(axis, -0.1).add(V(s * 0.07, 0, 0)), [-tilt, 0, s * 0.1]), 0.005, 1);
    steering = new THREE.Group();
    steering.name = 'steeringWheel';
    steering.position.copy(wc);
    steering.rotation.set(-tilt, 0, 0);
    swGeo.ao = 0.45;
    steeringWheelGeo(swGeo, 0.178);
  }
  geo.ao = 1;
  return { steering, cockpit: eye };
}

/** Steering wheel in local space: wheel plane = XY, column axis = +Z (towards the driver). */
function steeringWheelGeo(geo: Geo, R: number): void {
  const NS = 48, NR = 8;
  const path: V3[] = [];
  for (let k = 0; k < NS; k++) {
    const t = (k / NS) * Math.PI * 2;
    let x = R * Math.cos(t), y = R * Math.sin(t);
    if (y < -0.8 * R) y = -0.8 * R - (y + 0.8 * R) * 0.2; // flat bottom
    if (y > 0.88 * R) y = 0.88 * R + (y - 0.88 * R) * 0.35; // flattened top (compact French-style wheel)
    x *= 1.04;
    path.push(V(x, y, 0));
  }
  const P: V3[][] = [], Nn: V3[][] = [];
  for (let k = 0; k <= NS; k++) {
    const kk = k % NS;
    const a = path[(kk + NS - 1) % NS], b = path[(kk + 1) % NS], p = path[kk];
    const t = V().subVectors(b, a).normalize();
    const inward = V(-p.x, -p.y, 0).normalize();
    const side = V().crossVectors(t, V(0, 0, 1)).normalize();
    if (side.dot(inward) > 0) side.negate();
    P.push([]); Nn.push([]);
    for (let r = 0; r <= NR; r++) {
      const th = (r / NR) * Math.PI * 2;
      const n = V().addScaledVector(side, Math.cos(th)).add(V(0, 0, Math.sin(th))).normalize();
      P[k].push(V().copy(p).addScaledVector(side, Math.cos(th) * 0.0165).add(V(0, 0, Math.sin(th) * 0.019)));
      Nn[k].push(n);
    }
  }
  geo.set(BR.wheelLeather);
  gridMesh(geo, 'uber', P, Nn);
  // fix orientation if needed: check one face
  // spokes + hub
  rbox(geo, 'uber', BR.wheelLeather, [0.12, 0.09, 0.05], mat4([0, -0.005, 0.012]), 0.02, 2);
  rbox(geo, 'uber', BR.piano, [0.07, 0.04, 0.004], mat4([0, 0.0, 0.039]), 0.008, 1);
  for (const s of [-1, 1]) {
    rbox(geo, 'uber', BR.wheelLeather, [R - 0.06, 0.03, 0.022], mat4([s * (R / 2 + 0.03), -0.012, 0.004]), 0.01, 1);
    rbox(geo, 'uber', BR.satin, [R - 0.07, 0.008, 0.006], mat4([s * (R / 2 + 0.03), -0.012, 0.017]), 0.003, 1);
  }
  rbox(geo, 'uber', BR.wheelLeather, [0.05, R - 0.07, 0.02], mat4([0, -(R / 2 + 0.02), 0.002]), 0.01, 1);
  // emblem
  geo.set(BR.chrome);
  for (const s of [-1, 1]) rbox(geo, 'uber', BR.chrome, [0.004, 0.026, 0.003], mat4([s * 0.0065, 0.0, 0.042], [0, 0, -s * 0.42]), 0.001, 1);
}

// =================================================================================================== createCarModel

export function createCarModel(spec: CarModelSpec): CarModel {
  const style = STYLES[spec.style] ?? SEDAN;
  const isTruck = spec.style === 'truck';
  let shSpec = spec;
  let shOpts: { zFront?: number; arches?: number[]; seed?: number } = { seed: spec.seed };
  if (isTruck) {
    const cabL = Math.min(2.4, spec.length * 0.36);
    const fo = 1.1;
    shSpec = { ...spec, length: cabL, height: spec.height * 0.82 };
    shOpts = { zFront: -(fo + spec.wheelbase / 2), arches: [-spec.wheelbase / 2], seed: spec.seed };
  }
  const sh = new Shell(shSpec, style, HERO_RES, shOpts);
  const interior = spec.interior ?? false;
  const disposables: { dispose(): void }[] = [];

  // textures
  const detailTex = makeDetailTexture();
  const decalTex = makeDecalTexture(spec.taxiSign ? 'GT-417-PX' : 'FV-' + String(100 + ((spec.seed ?? 7) * 37) % 899) + '-LX');
  const signTex = spec.taxiSign ? makeSignTexture() : null;
  const dash = interior ? new DashDisplay() : null;
  disposables.push(detailTex, decalTex);
  if (signTex) disposables.push(signTex);
  if (dash) disposables.push(dash.tex);

  // materials
  const levels = new Float32Array(16);
  const paintMat = makePaintMaterial(spec.paint);
  const uber = makeUberMaterial(levels, detailTex);
  const decalMat = new THREE.MeshStandardMaterial({ map: decalTex, roughness: 0.4, metalness: 0, alphaTest: 0.5 });
  const signMat = new THREE.MeshStandardMaterial({ map: signTex, emissiveMap: signTex, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.3 });
  const screenMat = new THREE.MeshBasicMaterial({ map: dash?.tex ?? null });
  screenMat.color.setScalar(1.25);
  const glassMat = makeGlassMaterial(interior ? 0.6 : 0.82);
  disposables.push(paintMat, uber, decalMat, signMat, screenMat, glassMat);

  // geometry
  const geo = new Geo();
  sh.emitHero(geo);
  archDetails(geo, sh, 'paint', BR.gloss, 'uber', BR.liner, true);
  if (!isTruck) heroExterior(geo, sh, spec);
  if (spec.taxiSign) taxiSignGeo(geo, sh, 'sign', 'uber', true);
  const swGeo = new Geo();
  const inter = heroInterior(geo, sh, interior, swGeo);
  if (isTruck) {
    const z0 = sh.zFront + sh.L + 0.06, z1 = sh.zFront + spec.length;
    rbox(geo, 'paint', BR.gloss, [spec.width, spec.height - 0.95, z1 - z0], mat4([0, (spec.height + 0.95) / 2, (z0 + z1) / 2]), 0.04, 2);
    rbox(geo, 'uber', BR.matte, [spec.width * 0.7, 0.2, z1 - z0], mat4([0, 0.85, (z0 + z1) / 2]), 0.02, 1);
  }

  const order = ['paint', 'uber', 'decal', 'sign', 'screen'];
  const bodyGeom = geo.build(order, 'hero');
  const glassGeom = new THREE.BufferGeometry();
  for (const k of ['position', 'normal', 'uv', 'color', 'aSurf', 'aEmit']) glassGeom.setAttribute(k, bodyGeom.getAttribute(k));
  glassGeom.setIndex(geo.indexFor('glass'));
  glassGeom.computeBoundingSphere();
  disposables.push(bodyGeom, glassGeom);

  const root = new THREE.Group();
  root.name = 'VireoCar';
  const body = new THREE.Group();
  body.name = 'body';
  root.add(body);
  const bodyMesh = new THREE.Mesh(bodyGeom, [paintMat, uber, decalMat, signMat, screenMat]);
  bodyMesh.name = 'bodyMesh';
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  body.add(bodyMesh);
  const glassMesh = new THREE.Mesh(glassGeom, glassMat);
  glassMesh.name = 'glass';
  glassMesh.renderOrder = 2;
  body.add(glassMesh);

  let steeringWheel: THREE.Object3D | undefined;
  if (inter.steering) {
    const g = swGeo.build(['uber'], 'hero');
    disposables.push(g);
    const mesh = new THREE.Mesh(g, uber);
    mesh.castShadow = true;
    inter.steering.add(mesh);
    body.add(inter.steering);
    steeringWheel = inter.steering;
  }

  // wheels
  const spinGeo = new Geo();
  tyreAndRim(spinGeo, spec, true, new THREE.Matrix4());
  const spinGeom = spinGeo.build(['uber'], 'hero');
  const calGeo = new Geo();
  caliperGeo(calGeo, spec);
  const calGeom = calGeo.build(['uber'], 'hero');
  disposables.push(spinGeom, calGeom);
  const wheels: THREE.Object3D[] = [];
  const names = ['FL', 'FR', 'RL', 'RR'];
  const rearZ = isTruck ? spec.wheelbase / 2 : spec.wheelbase / 2;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz], k) => {
    const w = new THREE.Group();
    w.name = 'wheel' + names[k];
    w.position.set((sx * spec.track) / 2, spec.wheelRadius, sz < 0 ? -spec.wheelbase / 2 : rearZ);
    const spin = new THREE.Group();
    spin.name = 'spin';
    const sm = new THREE.Mesh(spinGeom, uber);
    sm.castShadow = true;
    sm.receiveShadow = true;
    if (sx < 0) sm.scale.x = -1;
    spin.add(sm);
    w.add(spin);
    const cm = new THREE.Mesh(calGeom, uber);
    if (sx < 0) cm.scale.x = -1;
    w.add(cm);
    root.add(w);
    wheels.push(w);
  });

  // anchors
  const fS = sh.rows[sh.iB0].s;
  const headlightAnchors: THREE.Object3D[] = [];
  for (const side of [-1, 1]) {
    const o = new THREE.Object3D();
    o.name = side < 0 ? 'headlightL' : 'headlightR';
    const pts = sh.resample(sh.outline(fS.yTop - 0.01 * sh.ys, 0), 0.6 * sh.xs, 0.6 * sh.xs, 1);
    const p = pts ? pts[0].p : V(0.6, 0.65, sh.zFront);
    o.position.set(side * p.x, p.y, p.z - 0.02);
    body.add(o);
    headlightAnchors.push(o);
  }
  const hood = new THREE.Object3D();
  hood.name = 'camHood';
  hood.position.set(0, sh.sec(sh.m.cowl).yTop + 0.2 * sh.ys, sh.zFront + sh.m.cowl + 0.02);
  const bumper = new THREE.Object3D();
  bumper.name = 'camBumper';
  bumper.position.set(0, fS.yBot + 0.22 * sh.ys, sh.zFront - 0.06);
  const cockpit = new THREE.Object3D();
  cockpit.name = 'camCockpit';
  cockpit.position.copy(inter.cockpit);
  body.add(hood, bumper, cockpit);

  const setLights = (s: CarLightState): void => {
    const tail = s.headlights ? 2.6 : 0;
    const brake = clamp(s.brake, 0, 1) * 8;
    levels[CH.HEAD] = s.headlights ? 9 : 0;
    levels[CH.HIGH] = s.headlights && s.highBeam ? 12 : 0;
    levels[CH.DRL] = s.headlights ? 6 : 4.5;
    levels[CH.TAIL] = tail + brake * 0.25;
    levels[CH.BRAKE_TAIL] = Math.max(tail, brake);
    levels[CH.BRAKE] = brake;
    levels[CH.REVERSE] = s.reverse ? 6 : 0;
    levels[CH.IND_L] = s.indicatorLeft ? 7 : 0;
    levels[CH.IND_R] = s.indicatorRight ? 7 : 0;
    const taxi = s.taxi ?? 'off';
    levels[CH.TAXI_GREEN] = taxi === 'free' ? 5 : 0;
    levels[CH.TAXI_RED] = taxi === 'busy' ? 5 : 0;
    levels[CH.TAXI_AMBER] = taxi !== 'off' ? 1.6 : 0;
    levels[CH.AMBIENT] = 1.4;
    levels[CH.BACKLIGHT] = 1.2;
    levels[CH.PLATE] = s.headlights ? 1.5 : 0;
    signMat.emissiveIntensity = taxi === 'free' ? (s.headlights ? 1.25 : 1.0) : 0;
  };
  setLights({ headlights: false, brake: 0, reverse: false, indicatorLeft: false, indicatorRight: false, taxi: spec.taxiSign ? 'free' : 'off' });

  const model: CarModel = {
    root, body, wheels, steeringWheel, headlightAnchors,
    cameraAnchors: { hood, bumper, cockpit },
    setLights,
    dispose: () => { for (const d of disposables) d.dispose(); },
  };
  if (dash) model.setDashboard = (s: CarDashboardState) => dash.draw(s);
  root.userData.stats = {
    triangles: geo.tris(['paint', 'uber', 'decal', 'sign', 'screen', 'glass']) + swGeo.tris() + 4 * (spinGeo.tris() + calGeo.tris()),
    bodyTriangles: geo.tris(), wheelTriangles: spinGeo.tris() + calGeo.tris(), steeringTriangles: swGeo.tris(),
  };
  return model;
}

// =================================================================================================== traffic assets

interface TrafficVariant {
  name: string;
  spec: CarModelSpec;
  palette: number[];
  kind: 'car' | 'taxi' | 'van' | 'bus' | 'suv';
}

const TB = {
  glass: brush(0x0c0f13, 0.0, 0.08),
  black: brush(0x08090a, 0, 0.25),
  under: brush(0x101010, 0, 0.9),
  clad: brush(0x141516, 0, 0.8),
  grille: brush(0x0a0a0b, 0.2, 0.5),
  plate: brush(0xe8e8e2, 0, 0.4),
  head: brush(0xe8e8e8, 0.6, 0.15, { light: 1 }),
  tail: brush(0x5a0505, 0, 0.2, { light: 2 }),
  liner: brush(0x060606, 0, 0.95),
  chrome: brush(0xb8bcc0, 1, 0.2),
};

function buildTrafficGeometry(v: TrafficVariant): THREE.BufferGeometry {
  const spec = v.spec;
  const st = STYLES[spec.style];
  const sh = new Shell(spec, st, spec.style === 'bus' ? BUS_RES : LOW_RES, {});
  const geo = new Geo();
  const paint = v.kind === 'taxi' ? brush(0x2a2c30, 0.5, 0.3, { paint: 1 }) : brush(0xffffff, 0.45, 0.32, { paint: 1 });
  const green = brush(0x1f8a68, 0.2, 0.35), white = brush(0xe9ece9, 0.2, 0.35), roof = brush(0xc8ccce, 0.1, 0.5);
  sh.emitTraffic(geo, (cl, i, j, y) => {
    if (cl === 'glass') return TB.glass;
    if (cl === 'black') return TB.black;
    if (cl === 'under') return TB.under;
    if (cl === 'clad') return TB.clad;
    if (v.kind === 'bus') {
      const seg = sh.segOf(j);
      if (seg === 'H') return roof;
      return y < 0.95 ? green : white;
    }
    void i;
    return paint;
  });
  const xs = sh.xs, ys = sh.ys;
  const fS = sh.rows[sh.iB0].s, rS = sh.rows[sh.iB1].s;
  const fTop = fS.yTop, fBot = fS.yBot, rTop = rS.yTop, rBot = rS.yBot;
  const fW = fS.hwMax, rW = rS.hwMax;
  if (v.kind === 'bus') {
    // headlights low on the corners, tail lights high, destination display, doors, roof pods
    sh.band(geo, 'all', TB.head, 0, 0.55, 0.68, fW * 0.62, fW * 0.98, 0.006, 2);
    sh.band(geo, 'all', TB.grille, 0, 0.45, 0.52, 0, fW * 0.95, 0.004, 2);
    sh.band(geo, 'all', TB.tail, 1, 0.9, 1.35, rW * 0.8, rW * 1.08, 0.006, 2);
    sh.facePatch(geo, 'all', 1, -0.26, 0.26, 0.55, 0.66, 0.006, 1, 1);
    {
      const yD = spec.height - 0.42;
      let lo = 0, hi = 1.5;
      for (let k = 0; k < 30; k++) { const mid = (lo + hi) / 2; if (sh.sec(mid).yTop < yD) lo = mid; else hi = mid; }
      const zD = sh.zFront + lo - 0.03;
      geo.set(TB.black);
      plane(geo, 'all', TB.black, spec.width * 0.86, 0.3, mat4([0, yD, zD], [0, Math.PI, 0]));
      plane(geo, 'all', brush(0xffa31a, 0, 0.4, { light: 3 }), spec.width * 0.6, 0.16, mat4([0, yD, zD - 0.004], [0, Math.PI, 0]));
    }
    const doors: P2[] = [[0.38, 1.38], [5.4, 6.58], [9.5, 10.58]];
    for (const [d0, d1] of doors) {
      geo.set(TB.black);
      sh.patchRC(geo, 'all', sh.rowAt(d0 - 0.04), sh.rowAt(d1 + 0.04), sh.col('B', 1), sh.col('F', 0), 0.005, 1, 1, 2);
      geo.set(TB.glass);
      sh.patchRC(geo, 'all', sh.rowAt(d0), sh.rowAt(d1), sh.col('C', 0.4), sh.col('F', 0), 0.009, 1, 1, 2);
    }
    geo.set(roof);
    const pod = new THREE.BoxGeometry(1.7, 0.26, 2.6);
    geo.add('all', pod, mat4([0, spec.height + 0.11, -1.0]));
    pod.dispose();
    const pod2 = new THREE.BoxGeometry(1.2, 0.2, 1.6);
    geo.add('all', pod2, mat4([0, spec.height + 0.08, 3.2]));
    pod2.dispose();
  } else {
    sh.band(geo, 'all', TB.head, 0, fTop - 0.045 * ys, fTop + 0.02 * ys, fW * 0.56, fW * 1.12, 0.006, 3);
    sh.band(geo, 'all', TB.grille, 0, fBot + 0.0 * ys, fBot + 0.15 * ys, 0, fW * 0.75, 0.004, 3);
    sh.facePatch(geo, 'all', 0, -0.26, 0.26, fBot + 0.03, fBot + 0.14, 0.009, 1, 1);
    geo.set(TB.plate);
    sh.facePatch(geo, 'all', 0, -0.25, 0.25, fBot + 0.035, fBot + 0.135, 0.012, 1, 1);
    if (v.kind === 'van') {
      sh.band(geo, 'all', TB.tail, 1, rBot + 0.3, rBot + 0.75, rW * 0.86, rW * 1.08, 0.006, 2);
    } else if (spec.style === 'sedan') {
      sh.band(geo, 'all', TB.tail, 1, rTop - 0.08 * ys, rTop - 0.035 * ys, 0, rW * 1.35, 0.006, 4);
    } else {
      sh.band(geo, 'all', TB.tail, 1, rTop - 0.12 * ys, rTop - 0.02 * ys, rW * 0.62, rW * 1.2, 0.006, 3);
    }
    geo.set(TB.plate);
    sh.facePatch(geo, 'all', 1, -0.25, 0.25, rBot + 0.14, rBot + 0.24, 0.008, 1, 1);
    sh.band(geo, 'all', TB.grille, 1, rBot - 0.02, rBot + 0.06, 0, rW * 0.9, 0.004, 3);
    // mirrors
    for (const side of [1, -1]) {
      const d = sh.m.cowl + 0.09 * sh.zs;
      const sp = sh.sidePoint(d, sh.sec(d).yBelt + 0.03 * ys, side);
      geo.set(v.kind === 'taxi' || v.kind === 'van' ? TB.black : paint);
      const bg = new THREE.BoxGeometry(0.15, 0.09, 0.06);
      geo.add('all', bg, mat4(V().copy(sp.p).add(V(side * 0.07, 0.0, 0.02)), [0, 0, side * 0.12]));
      bg.dispose();
    }
    if (v.kind === 'taxi') taxiSignGeo(geo, sh, 'all', 'all', false);
  }
  archDetails(geo, sh, 'all', TB.liner, 'all', TB.liner, false);
  // wheels
  const zs = [-spec.wheelbase / 2, spec.wheelbase / 2];
  for (const z of zs)
    for (const sx of [-1, 1]) {
      const m = mat4([(sx * spec.track) / 2, spec.wheelRadius, z], [0, 0, 0], [sx, 1, 1]);
      tyreAndRim(geo, spec, false, m);
    }
  void xs;
  return geo.build(['all'], 'traffic');
}

export function createTrafficCarAssets(): TrafficCarAsset[] {
  const mat = createTrafficMaterial();
  const car = [0xf2f2f0, 0x1c1d20, 0x8a8f96, 0x5d6168, 0x2b3a55, 0x6e1e22, 0xc9c3b6, 0x37443b, 0x9aa6b2, 0x0f1a2e];
  const variants: TrafficVariant[] = [
    { name: 'compact', kind: 'car', palette: [0xd8312a, 0xf2f2f0, 0x2f6fb0, 0xe0c341, 0x1c1d20, 0x8a8f96], spec: { style: 'compact', length: 3.95, width: 1.75, height: 1.46, wheelbase: 2.52, track: 1.5, wheelRadius: 0.3, wheelWidth: 0.195, paint: 0xffffff } },
    { name: 'sedan', kind: 'car', palette: car, spec: { style: 'sedan', length: 4.72, width: 1.82, height: 1.45, wheelbase: 2.8, track: 1.56, wheelRadius: 0.32, wheelWidth: 0.225, paint: 0xffffff } },
    { name: 'wagon', kind: 'car', palette: car, spec: { style: 'wagon', length: 4.8, width: 1.84, height: 1.5, wheelbase: 2.84, track: 1.57, wheelRadius: 0.325, wheelWidth: 0.225, paint: 0xffffff } },
    { name: 'suv', kind: 'suv', palette: car, spec: { style: 'suv', length: 4.62, width: 1.88, height: 1.68, wheelbase: 2.74, track: 1.6, wheelRadius: 0.36, wheelWidth: 0.235, paint: 0xffffff } },
    { name: 'van', kind: 'van', palette: [0xf4f4f2, 0xe9e9e6, 0xc9ccd0, 0x2b4a7a, 0xd8d0b8], spec: { style: 'van', length: 4.4, width: 1.86, height: 1.82, wheelbase: 2.75, track: 1.58, wheelRadius: 0.32, wheelWidth: 0.205, paint: 0xffffff } },
    { name: 'bus', kind: 'bus', palette: [0xffffff], spec: { style: 'bus', length: 12, width: 2.55, height: 3.05, wheelbase: 5.9, track: 2.1, wheelRadius: 0.5, wheelWidth: 0.3, paint: 0xffffff } },
    { name: 'taxi', kind: 'taxi', palette: [0x101215, 0x1c1f24, 0x14213a, 0x2a2d31], spec: { ...VIREO_LUMEN_SPEC, interior: false } },
  ];
  return variants.map((v) => ({
    geometry: buildTrafficGeometry(v),
    material: mat,
    length: v.spec.length, width: v.spec.width, height: v.spec.height + (v.kind === 'taxi' ? 0.15 : v.kind === 'bus' ? 0.24 : 0),
    wheelbase: v.spec.wheelbase, wheelRadius: v.spec.wheelRadius,
    name: v.name, palette: v.palette,
  }));
}
