/**
 * Procedural, part-based pedestrian geometry (no external assets).
 *
 * The character is authored in a single REST space: a reference adult of 1.75 m, standing, arms hanging,
 * facing +Z (front), +X = the character's LEFT, Y up, feet on y = 0. Every vertex carries:
 *
 *   position  vec3  rest-space position (reference body)
 *   normal    vec3  smooth rest-space normal
 *   aPart     vec4  x = primary part id (A), y = secondary part id (B), z = weight of B, w = weight of the pelvis.
 *                   weight(A) = 1 - z - w. Linear blend of up to three rigid part transforms (smooth joints, coat
 *                   skirts that follow both thighs, etc.).
 *   aMeta     vec4  x = colour slot + 64 * morph group, y = visibility condition, z = alternative-shape condition,
 *                   w = baked ambient occlusion (0..1)
 *   aAlt      vec3  rest-space delta applied when the alternative-shape condition holds (e.g. trousers vs bare
 *                   legs, coat sleeves vs shirt sleeves, short vs midi skirt)
 *
 * All clothing variants live in the same mesh; the vertex shader collapses hidden pieces to a degenerate point.
 */
import * as THREE from 'three';

export const PART = {
  pelvis: 0, torso: 1, head: 2,
  upperArmL: 3, upperArmR: 4, forearmL: 5, forearmR: 6, handL: 7, handR: 8,
  thighL: 9, thighR: 10, shinL: 11, shinR: 12, footL: 13, footR: 14,
  umbrella: 15,
  /** handbag: hangs upright from the left-hand grip */
  bagL: 16,
} as const;

/** Colour slots, resolved per fragment from the instance colours + style bits. */
export const SLOT = {
  skin: 0, head: 1, torso: 2, sleeve: 3, legs: 4, shoes: 5, coat: 6, jacket: 7, skirt: 8,
  hair: 9, accent: 10, hat: 11, bag: 12, canopy: 13, dark: 14, collar: 15, hand: 16,
} as const;

/** Visibility conditions (evaluated per vertex from style bits + current animation). */
export const VIS = {
  always: 0, coat: 1, jacket: 2, trench: 3, noOuter: 4, skirt: 5, scarf: 6, beanie: 7, cap: 8, hat: 9,
  hairCap: 10, hairLong: 11, hairBun: 12, backpack: 13, handbag: 14, umbrella: 15, phone: 16, outer: 17,
} as const;

/** Alternative-shape conditions. */
export const ALT = { none: 0, trousers: 1, outerSleeve: 2, skirtShort: 3 } as const;

/** Morph groups (how per-instance height/build/shape deform the rest geometry). */
export const MORPH = { central: 0, head: 1, armL: 2, armR: 3, legL: 4, legR: 5, footL: 6, footR: 7, none: 8 } as const;

/** Joint pivots of the reference body (LEFT side; right side = x mirrored). Shared with the shader. */
export const PIVOT = {
  root: [0, 0.95, 0] as V3,
  spine: [0, 1.05, -0.02] as V3,
  neck: [0, 1.47, -0.025] as V3,
  shoulder: [0.185, 1.43, -0.015] as V3,
  elbow: [0.2, 1.115, -0.02] as V3,
  wrist: [0.2124, 0.855, -0.024] as V3,
  hip: [0.09, 0.915, 0.0] as V3,
  knee: [0.087, 0.49, 0.005] as V3,
  ankle: [0.082, 0.085, -0.025] as V3,
  grip: [0.214, 0.772, -0.008] as V3,
  headTop: 1.762,
};

export type V3 = [number, number, number];

interface Bind { a: number; b?: number; wb?: number; wc?: number; ao?: number }
type BindFn = (p: V3, ring: number) => Bind;

interface Key { y: number; x?: number; z?: number; rx: number; zf: number; zb: number; n?: number; lo?: boolean }

interface RingSet { rings: V3[][]; pole: boolean[] }

interface PieceOpts {
  slot: number;
  morph: number;
  vis?: number;
  altCond?: number;
  bind: BindFn;
  /** z-axis lofts have opposite winding */
  flip?: boolean;
}

const ss = (e0: number, e1: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type Lod = 'near' | 'far';

// ---------------------------------------------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------------------------------------------

class GeoBuilder {
  pos: number[] = [];
  nrm: number[] = [];
  part: number[] = [];
  meta: number[] = [];
  alt: number[] = [];
  idx: number[] = [];

  /** Append a piece (positions + triangles), computing smooth normals within the piece. */
  add(pos: V3[], tris: number[], o: PieceOpts, altPos?: V3[], ringIdx?: number[]): void {
    const base = this.pos.length / 3;
    const n = pos.length;
    const nrm = new Float64Array(n * 3);
    for (let t = 0; t < tris.length; t += 3) {
      const ia = tris[t], ib = tris[t + 1], ic = tris[t + 2];
      const a = pos[ia], b = pos[ib], c = pos[ic];
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
      const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      for (const i of [ia, ib, ic]) { nrm[i * 3] += nx; nrm[i * 3 + 1] += ny; nrm[i * 3 + 2] += nz; }
    }
    for (let i = 0; i < n; i++) {
      const p = pos[i];
      let nx = nrm[i * 3], ny = nrm[i * 3 + 1], nz = nrm[i * 3 + 2];
      const l = Math.hypot(nx, ny, nz) || 1;
      nx /= l; ny /= l; nz /= l;
      this.pos.push(p[0], p[1], p[2]);
      this.nrm.push(nx, ny, nz);
      const bd = o.bind(p, ringIdx ? ringIdx[i] : 0);
      this.part.push(bd.a, bd.b ?? bd.a, bd.wb ?? 0, bd.wc ?? 0);
      this.meta.push(o.slot + 64 * o.morph, o.vis ?? VIS.always, o.altCond ?? ALT.none, bd.ao ?? 1);
      if (altPos) this.alt.push(altPos[i][0] - p[0], altPos[i][1] - p[1], altPos[i][2] - p[2]);
      else this.alt.push(0, 0, 0);
    }
    for (const t of tris) this.idx.push(base + t);
  }

  /** Add a piece and its x-mirrored twin (left → right), remapping part ids and morph groups. */
  addMirrored(pos: V3[], tris: number[], o: PieceOpts, altPos?: V3[], ringIdx?: number[]): void {
    this.add(pos, tris, o, altPos, ringIdx);
    const mp = pos.map((p) => [-p[0], p[1], p[2]] as V3);
    const ma = altPos?.map((p) => [-p[0], p[1], p[2]] as V3);
    const mt: number[] = [];
    for (let i = 0; i < tris.length; i += 3) mt.push(tris[i], tris[i + 2], tris[i + 1]);
    const swap = (id: number) => (id >= 3 && id <= 14 ? (id % 2 === 1 ? id + 1 : id - 1) : id);
    const mm = o.morph >= MORPH.armL && o.morph <= MORPH.footR ? o.morph + 1 : o.morph;
    this.add(mp, mt, {
      ...o, morph: mm,
      bind: (p, r) => {
        const b = o.bind([-p[0], p[1], p[2]], r);
        return { ...b, a: swap(b.a), b: b.b === undefined ? undefined : swap(b.b) };
      },
    }, ma, ringIdx);
  }

  build(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('aPart', new THREE.Float32BufferAttribute(this.part, 4));
    g.setAttribute('aMeta', new THREE.Float32BufferAttribute(this.meta, 4));
    g.setAttribute('aAlt', new THREE.Float32BufferAttribute(this.alt, 3));
    const nv = this.pos.length / 3;
    g.setIndex(nv > 65535 ? new THREE.Uint32BufferAttribute(this.idx, 1) : new THREE.Uint16BufferAttribute(this.idx, 1));
    g.computeBoundingBox();
    g.computeBoundingSphere();
    return g;
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Rings / lofts
// ---------------------------------------------------------------------------------------------------------------

function isPole(k: Key): boolean { return k.rx <= 1e-6 && k.zf <= 1e-6 && k.zb <= 1e-6; }

function se(v: number, n: number): number { return Math.sign(v) * Math.pow(Math.abs(v), 2 / n); }

/** Ring of a key. axis 'y': horizontal ring at height k.y. axis 'z': ring in the xy plane at depth k.y
 *  (k.x = centre x, k.z = centre y, rx = half width, zf = up extent, zb = down extent). */
function ringOf(k: Key, segs: number, axis: 'y' | 'z', arc?: [number, number], thick = 0): V3[] {
  const cx = k.x ?? 0, cz = k.z ?? 0, n = k.n ?? 2;
  const pt = (th: number, shrink: number): V3 => {
    const c = Math.cos(th), s = Math.sin(th);
    const ex = se(c, n), ez = se(s, n);
    const rx = Math.max(0, k.rx - shrink), rf = Math.max(0, k.zf - shrink), rb = Math.max(0, k.zb - shrink);
    const a = cx + rx * ex;
    const b = cz + (s > 0 ? rf : rb) * ez;
    return axis === 'y' ? [a, k.y, b] : [a, b, k.y];
  };
  const out: V3[] = [];
  if (!arc) {
    for (let j = 0; j < segs; j++) out.push(pt((j / segs) * Math.PI * 2, 0));
    return out;
  }
  // thick partial arc: outer arc forward, inner arc backward (closed loop)
  const [a0, a1] = arc;
  for (let j = 0; j <= segs; j++) out.push(pt(lerp(a0, a1, j / segs), 0));
  for (let j = segs; j >= 0; j--) out.push(pt(lerp(a0, a1, j / segs), thick));
  return out;
}

function catmull(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

const KEY_FIELDS = ['y', 'x', 'z', 'rx', 'zf', 'zb', 'n'] as const;

function keyVal(k: Key, f: typeof KEY_FIELDS[number]): number {
  const v = k[f];
  return v === undefined ? (f === 'n' ? 2 : 0) : (v as number);
}

/** Resample keys with Catmull-Rom; `sub` rings per key interval. Poles are kept exact. */
function sampleKeys(keys: Key[], sub: number, lod: Lod, mask?: Key[]): Key[] {
  const m = mask ?? keys;
  const ks = lod === 'far' ? keys.filter((_k, i) => m[i].lo || i === 0 || i === keys.length - 1) : keys;
  if (sub <= 1) return ks.map((k) => ({ ...k }));
  const out: Key[] = [];
  for (let i = 0; i < ks.length - 1; i++) {
    const k0 = ks[Math.max(0, i - 1)], k1 = ks[i], k2 = ks[i + 1], k3 = ks[Math.min(ks.length - 1, i + 2)];
    out.push({ ...k1 });
    if (isPole(k1) || isPole(k2)) continue; // keep pole caps tight
    for (let s = 1; s < sub; s++) {
      const t = s / sub;
      const k: Key = { y: 0, rx: 0, zf: 0, zb: 0 };
      for (const f of KEY_FIELDS) {
        (k as unknown as Record<string, number>)[f] = catmull(keyVal(k0, f), keyVal(k1, f), keyVal(k2, f), keyVal(k3, f), t);
      }
      k.rx = Math.max(k.rx, 0.0005); k.zf = Math.max(k.zf, 0.0005); k.zb = Math.max(k.zb, 0.0005);
      out.push(k);
    }
  }
  out.push({ ...ks[ks.length - 1] });
  return out;
}

/** Build triangles between consecutive rings. Rings are closed loops of equal size (or single-vertex poles). */
function stitch(rs: RingSet, flip: boolean): { pos: V3[]; tris: number[]; ring: number[] } {
  const pos: V3[] = [];
  const ring: number[] = [];
  const start: number[] = [];
  for (let i = 0; i < rs.rings.length; i++) {
    start.push(pos.length);
    if (rs.pole[i]) { pos.push(rs.rings[i][0]); ring.push(i); }
    else for (const p of rs.rings[i]) { pos.push(p); ring.push(i); }
  }
  const tris: number[] = [];
  const tri = (a: number, b: number, c: number) => { if (flip) tris.push(a, c, b); else tris.push(a, b, c); };
  for (let i = 0; i < rs.rings.length - 1; i++) {
    const pa = rs.pole[i], pb = rs.pole[i + 1];
    const m = pa ? rs.rings[i + 1].length : rs.rings[i].length;
    if (pa && pb) continue;
    for (let j = 0; j < m; j++) {
      const j1 = (j + 1) % m;
      const a = pa ? start[i] : start[i] + j;
      const a1 = pa ? start[i] : start[i] + j1;
      const b = pb ? start[i + 1] : start[i + 1] + j;
      const b1 = pb ? start[i + 1] : start[i + 1] + j1;
      // outward winding for rings going "up" (ccw profile): (v(i,j), v(i+1,j), v(i,j+1)) + (v(i,j+1), v(i+1,j), v(i+1,j+1))
      if (!pa) tri(a, b, a1);
      if (!pb) tri(a1, b, b1);
    }
  }
  return { pos, tris, ring };
}

interface LoftOpts extends PieceOpts {
  segs: number;
  sub?: number;
  axis?: 'y' | 'z';
  arc?: [number, number];
  thick?: number;
  altKeys?: Key[];
  mirror?: boolean;
}

function loft(gb: GeoBuilder, keys: Key[], lod: Lod, o: LoftOpts): void {
  const axis = o.axis ?? 'y';
  const sub = lod === 'far' ? 1 : (o.sub ?? 1);
  const ks = sampleKeys(keys, sub, lod);
  const mk = (kk: Key[]): RingSet => ({
    rings: kk.map((k) => (isPole(k) ? [axis === 'y' ? [k.x ?? 0, k.y, k.z ?? 0] : [k.x ?? 0, k.z ?? 0, k.y]] as V3[] : ringOf(k, o.segs, axis, o.arc, o.thick))),
    pole: kk.map(isPole),
  });
  const rs = mk(ks);
  const flip = axis === 'z' ? !o.flip : !!o.flip;
  const { pos, tris, ring } = stitch(rs, flip);
  let altPos: V3[] | undefined;
  if (o.altKeys) {
    const aks = sampleKeys(o.altKeys, sub, lod, keys);
    altPos = stitch(mk(aks), flip).pos;
    if (altPos.length !== pos.length) throw new Error('alt keys topology mismatch');
  }
  if (o.mirror) gb.addMirrored(pos, tris, o, altPos, ring);
  else gb.add(pos, tris, o, altPos, ring);
}

/** Generic piece from explicit rings (used for surfaces that follow the head shape). */
function ringsPiece(gb: GeoBuilder, rs: RingSet, o: PieceOpts & { mirror?: boolean }): void {
  const { pos, tris, ring } = stitch(rs, !!o.flip);
  if (o.mirror) gb.addMirrored(pos, tris, o, undefined, ring); else gb.add(pos, tris, o, undefined, ring);
}

/** Ellipsoid as a y-loft. */
function ellipsoidKeys(c: V3, r: V3, rings: number, lo = true): Key[] {
  const ks: Key[] = [{ y: c[1] - r[1], x: c[0], z: c[2], rx: 0, zf: 0, zb: 0 }];
  for (let i = 1; i < rings; i++) {
    const a = -Math.PI / 2 + (i / rings) * Math.PI;
    const s = Math.cos(a);
    ks.push({ y: c[1] + r[1] * Math.sin(a), x: c[0], z: c[2], rx: r[0] * s, zf: r[2] * s, zb: r[2] * s, lo });
  }
  ks.push({ y: c[1] + r[1], x: c[0], z: c[2], rx: 0, zf: 0, zb: 0 });
  return ks;
}

// ---------------------------------------------------------------------------------------------------------------
// Body definition
// ---------------------------------------------------------------------------------------------------------------

const P = PART;

/** Head profile (y, half width, front depth, back depth, centre z). */
const HEAD_KEYS: Key[] = [
  { y: 1.43, z: -0.02, rx: 0, zf: 0, zb: 0 },
  { y: 1.44, z: -0.02, rx: 0.052, zf: 0.046, zb: 0.05, lo: true },
  { y: 1.5, z: -0.02, rx: 0.05, zf: 0.045, zb: 0.05 },
  { y: 1.53, z: -0.016, rx: 0.052, zf: 0.05, zb: 0.055, lo: true },
  { y: 1.545, z: -0.01, rx: 0.056, zf: 0.083, zb: 0.06 },
  { y: 1.556, z: -0.005, rx: 0.06, zf: 0.1, zb: 0.068 },
  { y: 1.577, z: 0, rx: 0.066, zf: 0.104, zb: 0.078, n: 2.2, lo: true },
  { y: 1.602, z: 0, rx: 0.071, zf: 0.104, zb: 0.09, n: 2.3 },
  { y: 1.627, z: 0, rx: 0.075, zf: 0.1, zb: 0.098, n: 2.4 },
  { y: 1.652, z: 0, rx: 0.077, zf: 0.096, zb: 0.102, n: 2.4, lo: true },
  { y: 1.677, z: 0, rx: 0.078, zf: 0.096, zb: 0.104, n: 2.3 },
  { y: 1.702, z: 0, rx: 0.076, zf: 0.09, zb: 0.102, n: 2.2 },
  { y: 1.726, z: 0, rx: 0.068, zf: 0.077, zb: 0.092, lo: true },
  { y: 1.745, z: 0, rx: 0.053, zf: 0.057, zb: 0.071 },
  { y: 1.757, z: 0, rx: 0.03, zf: 0.032, zb: 0.042 },
  { y: PIVOT.headTop, z: 0, rx: 0, zf: 0, zb: 0 },
];

/** Interpolated head key at height y. */
function headAt(y: number): Key {
  const ks = HEAD_KEYS;
  let i = 1;
  while (i < ks.length - 2 && ks[i + 1].y < y) i++;
  const k1 = ks[i], k2 = ks[i + 1];
  const t = Math.min(1, Math.max(0, (y - k1.y) / (k2.y - k1.y)));
  const out: Key = { y, rx: 0, zf: 0, zb: 0 };
  for (const f of KEY_FIELDS) (out as unknown as Record<string, number>)[f] = lerp(keyVal(k1, f), keyVal(k2, f), t);
  if (isPole(k2)) { // dome towards the crown
    const s = Math.sqrt(Math.max(0, 1 - t * t));
    out.rx = k1.rx * s; out.zf = k1.zf * s; out.zb = k1.zb * s;
  }
  out.y = y;
  return out;
}

function headPoint(y: number, th: number, off: number): V3 {
  const k = headAt(y);
  const c = Math.cos(th), s = Math.sin(th), n = k.n ?? 2;
  return [(k.rx + off) * se(c, n), y, (k.z ?? 0) + ((s > 0 ? k.zf : k.zb) + off) * se(s, n)];
}

/** Hairline height as a function of ring angle (θ=π/2 front). */
function hairline(th: number, style: 'short' | 'long'): number {
  let a = Math.abs(Math.atan2(Math.cos(th), Math.sin(th))); // 0 = front, π = back
  a = Math.min(a, Math.PI);
  let h = lerp(style === 'long' ? 1.7 : 1.707, 1.655, ss(0.3, 1.25, a));
  h = lerp(h, style === 'long' ? 1.6 : 1.575, ss(1.55, 2.5, a));
  return h;
}

export interface BuildResult { geometry: THREE.BufferGeometry; triangles: number }

export function buildPedGeometry(lod: Lod = 'near'): BuildResult {
  const gb = new GeoBuilder();
  const near = lod === 'near';
  const S = near
    ? { head: 14, torso: 14, arm: 9, leg: 10, hand: 7, shoe: 9, coat: 14, skirt: 14, hair: 14, small: 6, sub: 1 }
    : { head: 6, torso: 6, arm: 4, leg: 5, hand: 3, shoe: 4, coat: 6, skirt: 6, hair: 6, small: 4, sub: 1 };

  // ---------------- HEAD (+ neck) ----------------
  loft(gb, HEAD_KEYS, lod, {
    segs: S.head, slot: SLOT.head, morph: MORPH.head,
    bind: (p) => ({ a: P.head, b: P.torso, wb: ss(1.535, 1.45, p[1]), ao: p[1] < 1.545 ? lerp(0.72, 1, ss(1.47, 1.545, p[1])) : 1 }),
  });
  if (near) {
    // nose (z-axis loft)
    const noseKeys: Key[] = [
      { y: 0.084, x: 0, z: 1.624, rx: 0.014, zf: 0.022, zb: 0.016 },
      { y: 0.1, x: 0, z: 1.615, rx: 0.0125, zf: 0.015, zb: 0.012, n: 2.3 },
      { y: 0.111, x: 0, z: 1.607, rx: 0.011, zf: 0.009, zb: 0.009, n: 2.4 },
      { y: 0.1175, x: 0, z: 1.604, rx: 0.006, zf: 0.004, zb: 0.005 },
      { y: 0.119, x: 0, z: 1.604, rx: 0, zf: 0, zb: 0 },
    ];
    loft(gb, noseKeys, lod, { segs: 6, axis: 'z', slot: SLOT.head, morph: MORPH.head, bind: () => ({ a: P.head }) });
    // ears
    loft(gb, ellipsoidKeys([0.076, 1.632, -0.008], [0.013, 0.031, 0.02], 4), lod, {
      segs: 7, slot: SLOT.skin, morph: MORPH.head, mirror: true, bind: () => ({ a: P.head, ao: 0.85 }),
    });
  }

  // ---------------- TORSO (pelvis + chest), shown when no outer layer ----------------
  const TORSO_KEYS: Key[] = [
    { y: 0.79, z: -0.01, rx: 0, zf: 0, zb: 0 },
    { y: 0.8, z: -0.01, rx: 0.07, zf: 0.035, zb: 0.055, lo: true },
    { y: 0.83, z: -0.008, rx: 0.14, zf: 0.066, zb: 0.09 },
    { y: 0.87, z: -0.01, rx: 0.168, zf: 0.094, zb: 0.112, lo: true },
    { y: 0.93, z: -0.01, rx: 0.174, zf: 0.1, zb: 0.116 },
    { y: 0.99, z: -0.005, rx: 0.166, zf: 0.1, zb: 0.1, lo: true },
    { y: 1.06, z: 0, rx: 0.149, zf: 0.1, zb: 0.088 },
    { y: 1.14, z: 0, rx: 0.153, zf: 0.105, zb: 0.09, n: 2.2 },
    { y: 1.22, z: 0, rx: 0.16, zf: 0.114, zb: 0.1, n: 2.4, lo: true },
    { y: 1.3, z: -0.005, rx: 0.167, zf: 0.117, zb: 0.105, n: 2.5 },
    { y: 1.37, z: -0.01, rx: 0.171, zf: 0.104, zb: 0.105, n: 2.5 },
    { y: 1.42, z: -0.015, rx: 0.178, zf: 0.088, zb: 0.097, n: 2.5, lo: true },
    { y: 1.448, z: -0.018, rx: 0.17, zf: 0.072, zb: 0.086, n: 2.4 },
    { y: 1.474, z: -0.02, rx: 0.128, zf: 0.06, zb: 0.07, n: 2.2 },
    { y: 1.5, z: -0.02, rx: 0.078, zf: 0.053, zb: 0.058, lo: true },
    { y: 1.525, z: -0.02, rx: 0.055, zf: 0.045, zb: 0.05 },
  ];
  const torsoBind: BindFn = (p) => {
    const y = p[1];
    if (y > 0.97) return { a: P.torso, wc: 1 - ss(0.98, 1.12, y), ao: 1 };
    const side = p[0] >= 0 ? P.thighL : P.thighR;
    const wl = 0.4 * ss(0.93, 0.8, y) * ss(0.02, 0.09, Math.abs(p[0]));
    return { a: side, b: P.torso, wb: 0, wc: 1 - wl, ao: lerp(0.75, 1, ss(0.78, 0.86, y)) };
  };
  loft(gb, TORSO_KEYS, lod, { segs: S.torso, slot: SLOT.torso, morph: MORPH.central, vis: VIS.noOuter, bind: torsoBind });

  // ---------------- ARMS ----------------
  const ARM_KEYS: Key[] = [
    { y: 1.458, x: 0.18, z: -0.015, rx: 0, zf: 0, zb: 0 },
    { y: 1.452, x: 0.182, z: -0.015, rx: 0.028, zf: 0.032, zb: 0.032 },
    { y: 1.435, x: 0.188, z: -0.015, rx: 0.044, zf: 0.05, zb: 0.05, lo: true },
    { y: 1.395, x: 0.195, z: -0.016, rx: 0.048, zf: 0.052, zb: 0.05 },
    { y: 1.33, x: 0.198, z: -0.018, rx: 0.045, zf: 0.047, zb: 0.044 },
    { y: 1.24, x: 0.199, z: -0.019, rx: 0.042, zf: 0.044, zb: 0.042, lo: true },
    { y: 1.16, x: 0.2, z: -0.02, rx: 0.038, zf: 0.04, zb: 0.038 },
    { y: 1.115, x: 0.2, z: -0.02, rx: 0.037, zf: 0.038, zb: 0.037 },
    { y: 1.06, x: 0.203, z: -0.021, rx: 0.039, zf: 0.042, zb: 0.038, lo: true },
    { y: 0.98, x: 0.206, z: -0.022, rx: 0.035, zf: 0.036, zb: 0.033 },
    { y: 0.9, x: 0.21, z: -0.023, rx: 0.029, zf: 0.031, zb: 0.028 },
    { y: 0.868, x: 0.211, z: -0.024, rx: 0.029, zf: 0.032, zb: 0.029, lo: true },
    { y: 0.866, x: 0.211, z: -0.024, rx: 0.02, zf: 0.022, zb: 0.02 },
    { y: 0.864, x: 0.211, z: -0.024, rx: 0, zf: 0, zb: 0 },
  ];
  const sleeveAlt = ARM_KEYS.map((k, i) => {
    if (isPole(k)) return { ...k, y: k.y + (i === 0 ? 0.008 : 0) };
    const inf = k.y > 1.44 ? 0.012 : k.y < 0.92 ? 0.017 : 0.012;
    return { ...k, rx: k.rx + inf, zf: k.zf + inf, zb: k.zb + inf };
  });
  const armBind: BindFn = (p) => {
    const y = p[1];
    if (y > 1.115) {
      const wt = 0.45 * ss(1.38, 1.5, y);
      const wf = ss(1.17, 1.08, y);
      return { a: P.upperArmL, b: wt > 0 ? P.torso : P.forearmL, wb: wt > 0 ? wt : wf * 0.5 };
    }
    return { a: P.forearmL, b: P.upperArmL, wb: 0.5 * ss(1.06, 1.15, y) };
  };
  loft(gb, ARM_KEYS, lod, {
    segs: S.arm, sub: S.sub, slot: SLOT.sleeve, morph: MORPH.armL, mirror: true,
    altCond: ALT.outerSleeve, altKeys: sleeveAlt, bind: armBind,
  });

  // ---------------- HANDS (mitten + thumb) ----------------
  const HAND_KEYS: Key[] = [
    { y: 0.875, x: 0.212, z: -0.024, rx: 0, zf: 0, zb: 0 },
    { y: 0.872, x: 0.212, z: -0.024, rx: 0.021, zf: 0.025, zb: 0.025 },
    { y: 0.848, x: 0.213, z: -0.022, rx: 0.02, zf: 0.028, zb: 0.028, lo: true },
    { y: 0.806, x: 0.215, z: -0.017, rx: 0.016, zf: 0.042, zb: 0.037 },
    { y: 0.765, x: 0.213, z: -0.011, rx: 0.0145, zf: 0.042, zb: 0.037, lo: true },
    { y: 0.728, x: 0.208, z: -0.004, rx: 0.013, zf: 0.036, zb: 0.032 },
    { y: 0.7, x: 0.203, z: 0.001, rx: 0.011, zf: 0.027, zb: 0.022 },
    { y: 0.684, x: 0.2, z: 0.003, rx: 0, zf: 0, zb: 0 },
  ];
  loft(gb, HAND_KEYS, lod, {
    segs: S.hand, slot: SLOT.hand, morph: MORPH.armL, mirror: true,
    bind: (p) => ({ a: P.handL, b: P.forearmL, wb: 0.5 * ss(0.85, 0.875, p[1]) }),
  });
  if (near) {
    const THUMB: Key[] = [
      { y: 0.84, x: 0.206, z: 0.012, rx: 0, zf: 0, zb: 0 },
      { y: 0.832, x: 0.205, z: 0.018, rx: 0.011, zf: 0.012, zb: 0.012 },
      { y: 0.8, x: 0.2, z: 0.03, rx: 0.01, zf: 0.011, zb: 0.011 },
      { y: 0.775, x: 0.196, z: 0.036, rx: 0.008, zf: 0.009, zb: 0.009 },
      { y: 0.765, x: 0.195, z: 0.037, rx: 0, zf: 0, zb: 0 },
    ];
    loft(gb, THUMB, lod, { segs: 5, slot: SLOT.hand, morph: MORPH.armL, mirror: true, bind: () => ({ a: P.handL }) });
  }

  // ---------------- LEGS (bare/tights shape; alt = trousers) ----------------
  const LEG_KEYS: Key[] = [
    { y: 0.04, x: 0.082, z: -0.02, rx: 0, zf: 0, zb: 0 },
    { y: 0.05, x: 0.082, z: -0.02, rx: 0.027, zf: 0.03, zb: 0.03 },
    { y: 0.1, x: 0.082, z: -0.02, rx: 0.028, zf: 0.03, zb: 0.031, lo: true },
    { y: 0.17, x: 0.082, z: -0.015, rx: 0.031, zf: 0.031, zb: 0.037 },
    { y: 0.26, x: 0.083, z: -0.01, rx: 0.04, zf: 0.037, zb: 0.05 },
    { y: 0.35, x: 0.084, z: -0.005, rx: 0.049, zf: 0.042, zb: 0.066, lo: true },
    { y: 0.43, x: 0.085, z: 0, rx: 0.047, zf: 0.045, zb: 0.052 },
    { y: 0.49, x: 0.086, z: 0.006, rx: 0.05, zf: 0.05, zb: 0.046 },
    { y: 0.54, x: 0.087, z: 0.008, rx: 0.054, zf: 0.052, zb: 0.05, lo: true },
    { y: 0.63, x: 0.088, z: 0.012, rx: 0.064, zf: 0.063, zb: 0.06 },
    { y: 0.75, x: 0.09, z: 0.012, rx: 0.075, zf: 0.075, zb: 0.075 },
    { y: 0.86, x: 0.09, z: 0.006, rx: 0.081, zf: 0.078, zb: 0.086, lo: true },
    { y: 0.96, x: 0.086, z: 0.0, rx: 0.076, zf: 0.08, zb: 0.084 },
  ];
  const TROUSER_KEYS: Key[] = [
    { y: 0.03, x: 0.083, z: -0.008, rx: 0, zf: 0, zb: 0 },
    { y: 0.03, x: 0.083, z: -0.008, rx: 0.05, zf: 0.058, zb: 0.055 },
    { y: 0.1, x: 0.083, z: -0.008, rx: 0.053, zf: 0.059, zb: 0.056 },
    { y: 0.17, x: 0.083, z: -0.006, rx: 0.055, zf: 0.059, zb: 0.058 },
    { y: 0.26, x: 0.084, z: -0.004, rx: 0.058, zf: 0.06, zb: 0.062 },
    { y: 0.35, x: 0.085, z: -0.002, rx: 0.061, zf: 0.061, zb: 0.066 },
    { y: 0.43, x: 0.086, z: 0.001, rx: 0.063, zf: 0.063, zb: 0.064 },
    { y: 0.49, x: 0.087, z: 0.005, rx: 0.065, zf: 0.066, zb: 0.063 },
    { y: 0.54, x: 0.088, z: 0.007, rx: 0.068, zf: 0.068, zb: 0.065 },
    { y: 0.63, x: 0.089, z: 0.011, rx: 0.075, zf: 0.074, zb: 0.072 },
    { y: 0.75, x: 0.091, z: 0.012, rx: 0.083, zf: 0.083, zb: 0.083 },
    { y: 0.86, x: 0.091, z: 0.006, rx: 0.087, zf: 0.086, zb: 0.093 },
    { y: 0.96, x: 0.087, z: 0.0, rx: 0.082, zf: 0.087, zb: 0.09 },
  ];
  const legBind: BindFn = (p) => {
    const y = p[1];
    if (y > 0.49) {
      const wc = 0.45 * ss(0.84, 0.97, y);
      return { a: P.thighL, b: P.shinL, wb: 0.5 * ss(0.55, 0.47, y), wc, ao: lerp(1, 0.8, ss(0.8, 0.95, y) * ss(0.05, 0.0, p[0] - 0.09 + 0.08)) };
    }
    return { a: P.shinL, b: P.thighL, wb: 0.5 * ss(0.43, 0.51, y) };
  };
  loft(gb, LEG_KEYS, lod, {
    segs: S.leg, sub: S.sub, slot: SLOT.legs, morph: MORPH.legL, mirror: true,
    altCond: ALT.trousers, altKeys: TROUSER_KEYS, bind: legBind,
  });

  // ---------------- SHOES (z-axis loft: y=depth, x=centre x, z=centre height) ----------------
  const SHOE_KEYS: Key[] = [
    { y: -0.086, x: 0.083, z: 0.045, rx: 0, zf: 0, zb: 0 },
    { y: -0.08, x: 0.083, z: 0.045, rx: 0.026, zf: 0.03, zb: 0.04, n: 2.4 },
    { y: -0.06, x: 0.083, z: 0.052, rx: 0.038, zf: 0.05, zb: 0.052, n: 2.6, lo: true },
    { y: -0.02, x: 0.084, z: 0.054, rx: 0.042, zf: 0.052, zb: 0.054, n: 2.8 },
    { y: 0.03, x: 0.086, z: 0.045, rx: 0.045, zf: 0.046, zb: 0.045, n: 2.8, lo: true },
    { y: 0.08, x: 0.089, z: 0.036, rx: 0.048, zf: 0.034, zb: 0.036, n: 2.8 },
    { y: 0.13, x: 0.092, z: 0.029, rx: 0.046, zf: 0.026, zb: 0.029, n: 2.6, lo: true },
    { y: 0.168, x: 0.094, z: 0.023, rx: 0.037, zf: 0.02, zb: 0.023, n: 2.4 },
    { y: 0.186, x: 0.095, z: 0.019, rx: 0.022, zf: 0.013, zb: 0.019, n: 2.2 },
    { y: 0.193, x: 0.095, z: 0.017, rx: 0, zf: 0, zb: 0 },
  ];
  loft(gb, SHOE_KEYS, lod, {
    segs: S.shoe, axis: 'z', slot: SLOT.shoes, morph: MORPH.footL, mirror: true,
    bind: (p) => ({ a: P.footL, b: P.shinL, wb: 0.35 * ss(0.075, 0.105, p[1]) }),
  });

  // ---------------- OUTER LAYERS: coat / trench (to knee), jacket (to hip) ----------------
  const upperCoat = (inf: number): Key[] => [
    { y: 0.99, z: -0.005, rx: 0.183 + inf, zf: 0.12 + inf, zb: 0.117 + inf, lo: true },
    { y: 1.06, z: 0, rx: 0.168 + inf, zf: 0.122 + inf, zb: 0.105 + inf },
    { y: 1.14, z: 0, rx: 0.171 + inf, zf: 0.126 + inf, zb: 0.107 + inf, n: 2.2 },
    { y: 1.22, z: 0, rx: 0.177 + inf, zf: 0.134 + inf, zb: 0.117 + inf, n: 2.4, lo: true },
    { y: 1.3, z: -0.005, rx: 0.185 + inf, zf: 0.136 + inf, zb: 0.122 + inf, n: 2.5 },
    { y: 1.37, z: -0.01, rx: 0.19 + inf, zf: 0.124 + inf, zb: 0.12 + inf, n: 2.5 },
    { y: 1.42, z: -0.015, rx: 0.19 + inf, zf: 0.104 + inf, zb: 0.111 + inf, n: 2.4, lo: true },
    { y: 1.455, z: -0.018, rx: 0.176 + inf, zf: 0.088 + inf, zb: 0.102 + inf, n: 2.2 },
    { y: 1.485, z: -0.02, rx: 0.13 + inf, zf: 0.072 + inf, zb: 0.082 + inf, lo: true },
    { y: 1.51, z: -0.02, rx: 0.085, zf: 0.062, zb: 0.068 },
    { y: 1.53, z: -0.02, rx: 0.068, zf: 0.058, zb: 0.062 },
  ];
  const coatKeys: Key[] = [
    { y: 0.78, z: -0.005, rx: 0.205, zf: 0.128, zb: 0.13, lo: true }, // lining (inside, going down)
    { y: 0.515, z: -0.005, rx: 0.222, zf: 0.146, zb: 0.148, lo: true },
    { y: 0.505, z: -0.005, rx: 0.23, zf: 0.154, zb: 0.156, lo: true }, // hem
    { y: 0.6, z: -0.005, rx: 0.223, zf: 0.149, zb: 0.151 },
    { y: 0.7, z: -0.005, rx: 0.215, zf: 0.142, zb: 0.145 },
    { y: 0.8, z: -0.007, rx: 0.208, zf: 0.136, zb: 0.14, lo: true },
    { y: 0.87, z: -0.008, rx: 0.203, zf: 0.132, zb: 0.137 },
    { y: 0.93, z: -0.01, rx: 0.197, zf: 0.128, zb: 0.133 },
    ...upperCoat(0),
  ];
  const coatBind: BindFn = (p, ring) => {
    const y = p[1];
    if (y > 0.97) return { a: P.torso, wc: 1 - ss(0.98, 1.12, y), ao: 1 };
    const k = 0.95 * ss(1.02, 0.79, y);
    const wr = ss(0.09, -0.09, p[0]);
    return { a: P.thighL, b: P.thighR, wb: k * wr, wc: 1 - k, ao: ring < 2 ? 0.6 : 1 };
  };
  loft(gb, coatKeys, lod, { segs: S.coat, sub: S.sub, slot: SLOT.coat, morph: MORPH.central, vis: VIS.coat, bind: coatBind });

  const jacketKeys: Key[] = [
    { y: 0.86, z: -0.01, rx: 0.186, zf: 0.115, zb: 0.124, lo: true },
    { y: 0.8, z: -0.01, rx: 0.192, zf: 0.119, zb: 0.129, lo: true },
    { y: 0.795, z: -0.01, rx: 0.2, zf: 0.127, zb: 0.136, lo: true },
    { y: 0.86, z: -0.01, rx: 0.198, zf: 0.126, zb: 0.135 },
    { y: 0.93, z: -0.01, rx: 0.193, zf: 0.122, zb: 0.13 },
    ...upperCoat(-0.004),
  ];
  const jacketBind: BindFn = (p) => {
    const y = p[1];
    if (y > 0.97) return { a: P.torso, wc: 1 - ss(0.98, 1.12, y) };
    const k = 0.45 * ss(0.98, 0.79, y);
    return { a: P.thighL, b: P.thighR, wb: k * ss(0.07, -0.07, p[0]), wc: 1 - k };
  };
  loft(gb, jacketKeys, lod, { segs: S.coat, sub: S.sub, slot: SLOT.jacket, morph: MORPH.central, vis: VIS.jacket, bind: jacketBind });

  // collar (stand-up back, open V at the front) for coats and jackets
  {
    const ck: Key[] = [
      { y: 1.475, z: -0.022, rx: 0.13, zf: 0.085, zb: 0.096 },
      { y: 1.505, z: -0.024, rx: 0.094, zf: 0.072, zb: 0.078, lo: true },
      { y: 1.532, z: -0.026, rx: 0.084, zf: 0.068, zb: 0.074 },
      { y: 1.542, z: -0.028, rx: 0.092, zf: 0.075, zb: 0.083, lo: true },
    ];
    const half = 0.62; // gap half angle at the front
    loft(gb, ck, lod, {
      segs: near ? 12 : 4, arc: [Math.PI / 2 + half, Math.PI / 2 - half + Math.PI * 2], thick: 0.007,
      slot: SLOT.collar, morph: MORPH.central, vis: VIS.outer,
      bind: (p) => ({ a: P.torso, b: P.head, wb: 0.15 * ss(1.5, 1.56, p[1]) }),
    });
  }
  // trench belt
  if (near) {
    const bk: Key[] = [
      { y: 1.03, z: 0, rx: 0.172, zf: 0.122, zb: 0.106 },
      { y: 1.03, z: 0, rx: 0.178, zf: 0.128, zb: 0.112 },
      { y: 1.068, z: 0, rx: 0.176, zf: 0.129, zb: 0.112 },
      { y: 1.068, z: 0, rx: 0.17, zf: 0.123, zb: 0.106 },
    ];
    loft(gb, bk, lod, { segs: S.coat, slot: SLOT.collar, morph: MORPH.central, vis: VIS.trench, bind: () => ({ a: P.torso, wc: 0.4 }) });
  }

  // ---------------- SKIRT (midi; alt = knee length) ----------------
  {
    const sk = (hem: number, flare: number): Key[] => [
      { y: hem + 0.2, z: -0.005, rx: 0.17 + flare * 0.5, zf: 0.115 + flare * 0.4, zb: 0.125 + flare * 0.4, lo: true },
      { y: hem + 0.004, z: -0.005, rx: 0.185 + flare - 0.007, zf: 0.12 + flare - 0.007, zb: 0.13 + flare - 0.007, lo: true },
      { y: hem, z: -0.005, rx: 0.185 + flare, zf: 0.12 + flare, zb: 0.13 + flare, lo: true },
      { y: lerp(hem, 0.82, 0.5), z: -0.006, rx: lerp(0.185 + flare, 0.19, 0.55), zf: lerp(0.12 + flare, 0.118, 0.55), zb: lerp(0.13 + flare, 0.13, 0.55) },
      { y: 0.84, z: -0.008, rx: 0.19, zf: 0.12, zb: 0.13, lo: true },
      { y: 0.93, z: -0.01, rx: 0.185, zf: 0.114, zb: 0.127 },
      { y: 1.0, z: -0.005, rx: 0.172, zf: 0.109, zb: 0.107, lo: true },
      { y: 1.055, z: 0, rx: 0.156, zf: 0.107, zb: 0.095 },
      { y: 1.065, z: 0, rx: 0.15, zf: 0.1, zb: 0.088 },
    ];
    const midi = sk(0.36, 0.045);
    const knee = sk(0.5, 0.02);
    loft(gb, midi, lod, {
      segs: S.skirt, slot: SLOT.skirt, morph: MORPH.central, vis: VIS.skirt, altCond: ALT.skirtShort, altKeys: knee,
      bind: (p) => {
        const y = p[1];
        if (y > 0.96) return { a: P.pelvis, b: P.torso, wb: 0.5 * ss(1.0, 1.07, y) };
        const k = 0.8 * ss(0.95, 0.5, y);
        return { a: P.thighL, b: P.thighR, wb: k * ss(0.07, -0.07, p[0]), wc: 1 - k };
      },
    });
  }

  // ---------------- HAIR ----------------
  const hairCap = (style: 'short' | 'long', off0: number, off1: number, vis: number) => {
    const rings: V3[][] = [];
    const pole: boolean[] = [];
    const K = near ? 5 : 2;
    const segs = S.hair;
    for (let k = 0; k <= K; k++) {
      const ring: V3[] = [];
      for (let j = 0; j < segs; j++) {
        const th = (j / segs) * Math.PI * 2;
        const hl = hairline(th, style);
        const t = k / K;
        const y = lerp(hl, PIVOT.headTop - 0.004, 1 - (1 - t) * (1 - t));
        const off = k === 0 ? off0 * 0.4 : lerp(off0, off1, t);
        ring.push(headPoint(y, th, off));
      }
      rings.push(ring);
      pole.push(false);
    }
    rings.push([[0, PIVOT.headTop + off1, 0]]);
    pole.push(true);
    ringsPiece(gb, { rings, pole }, { slot: SLOT.hair, morph: MORPH.head, vis, bind: () => ({ a: P.head }) });
  };
  hairCap('short', 0.004, 0.011, VIS.hairCap);
  // long hair: curtain behind the head down to the shoulders (thick arc)
  {
    const lk: Key[] = [
      { y: 1.39, z: -0.06, rx: 0.1, zf: 0.07, zb: 0.075, lo: true },
      { y: 1.47, z: -0.045, rx: 0.098, zf: 0.085, zb: 0.083 },
      { y: 1.55, z: -0.02, rx: 0.088, zf: 0.105, zb: 0.098, lo: true },
      { y: 1.62, z: -0.005, rx: 0.088, zf: 0.11, zb: 0.112 },
      { y: 1.68, z: 0, rx: 0.088, zf: 0.108, zb: 0.116, lo: true },
      { y: 1.72, z: 0, rx: 0.08, zf: 0.095, zb: 0.106 },
    ];
    const half = 0.78;
    loft(gb, lk, lod, {
      segs: near ? 12 : 4, arc: [Math.PI / 2 + half, Math.PI / 2 - half + Math.PI * 2], thick: 0.014,
      slot: SLOT.hair, morph: MORPH.head, vis: VIS.hairLong,
      bind: (p) => ({ a: P.head, b: P.torso, wb: 0.55 * ss(1.56, 1.42, p[1]) }),
    });
  }
  // bun
  loft(gb, ellipsoidKeys([0, 1.705, -0.112], [0.042, 0.04, 0.036], near ? 5 : 2), lod, {
    segs: near ? 8 : 4, slot: SLOT.hair, morph: MORPH.head, vis: VIS.hairBun, bind: () => ({ a: P.head }),
  });

  // ---------------- HEADWEAR ----------------
  const headShell = (y0: number, y1: number, off: number, rings: number, vis: number, slot: number, extraTop = 0, foldOff = 0) => {
    const ks: Key[] = [];
    if (foldOff > 0) {
      const k = headAt(y0);
      ks.push({ ...k, y: y0 - 0.002, rx: k.rx + off - 0.004, zf: k.zf + off - 0.004, zb: k.zb + off - 0.004, lo: true });
      ks.push({ ...k, y: y0, rx: k.rx + off + foldOff, zf: k.zf + off + foldOff, zb: k.zb + off + foldOff, lo: true });
      const k2 = headAt(y0 + 0.04);
      ks.push({ ...k2, y: y0 + 0.04, rx: k2.rx + off + foldOff, zf: k2.zf + off + foldOff, zb: k2.zb + off + foldOff, lo: true });
      ks.push({ ...k2, y: y0 + 0.042, rx: k2.rx + off, zf: k2.zf + off, zb: k2.zb + off });
    }
    for (let i = foldOff > 0 ? 1 : 0; i <= rings; i++) {
      const y = lerp(foldOff > 0 ? y0 + 0.042 : y0, y1, i / rings);
      const k = headAt(Math.min(y, PIVOT.headTop - 0.006));
      const t = i / rings;
      const lift = extraTop * t * t;
      ks.push({ ...k, y: y + lift, rx: k.rx + off, zf: k.zf + off, zb: k.zb + off, lo: i % 2 === 0 });
    }
    ks.push({ y: y1 + extraTop + off * 0.8, z: 0, rx: 0, zf: 0, zb: 0 });
    loft(gb, ks, lod, { segs: S.hair, slot, morph: MORPH.head, vis, bind: () => ({ a: P.head }) });
  };
  // beanie (knit hat) with folded brim, slightly slouchy top
  headShell(1.655, 1.752, 0.016, near ? 5 : 2, VIS.beanie, SLOT.accent, 0.022, 0.006);
  // cap: crown + visor
  headShell(1.672, 1.752, 0.012, near ? 4 : 2, VIS.cap, SLOT.hat, 0.006);
  {
    // visor as a z-loft (thin, curved by ring shape)
    const vk: Key[] = [];
    const n = near ? 4 : 2;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const z = lerp(0.075, 0.175, t);
      const w = lerp(0.085, 0.06, t * t);
      vk.push({ y: z, x: 0, z: 1.684 - 0.022 * t * t, rx: w, zf: 0.005, zb: 0.004, n: 6, lo: true });
    }
    vk.push({ y: 0.179, x: 0, z: 1.662, rx: 0, zf: 0, zb: 0 });
    loft(gb, vk, lod, { segs: near ? 10 : 4, axis: 'z', slot: SLOT.hat, morph: MORPH.head, vis: VIS.cap, bind: () => ({ a: P.head }) });
  }
  // brimmed felt hat: brim + crown
  {
    const hk: Key[] = [];
    const k0 = headAt(1.685);
    const r = (k: Key, d: number) => ({ rx: k.rx + d, zf: k.zf + d, zb: k.zb + d });
    hk.push({ y: 1.683, z: 0, ...r(k0, 0.008) });
    hk.push({ y: 1.678, z: 0, ...r(k0, 0.062), lo: true });
    hk.push({ y: 1.686, z: 0, ...r(k0, 0.064), lo: true });
    hk.push({ y: 1.69, z: 0, ...r(k0, 0.017), lo: true });
    hk.push({ y: 1.74, z: 0, rx: 0.081, zf: 0.093, zb: 0.1 });
    hk.push({ y: 1.795, z: 0, rx: 0.075, zf: 0.087, zb: 0.094, lo: true });
    hk.push({ y: 1.808, z: 0, rx: 0.05, zf: 0.055, zb: 0.065 });
    hk.push({ y: 1.81, z: 0, rx: 0, zf: 0, zb: 0 });
    loft(gb, hk, lod, { segs: S.hair, slot: SLOT.hat, morph: MORPH.head, vis: VIS.hat, bind: () => ({ a: P.head }) });
  }

  // ---------------- SCARF ----------------
  {
    const sk: Key[] = [
      { y: 1.435, z: -0.022, rx: 0.075, zf: 0.07, zb: 0.074 },
      { y: 1.43, z: -0.022, rx: 0.095, zf: 0.09, zb: 0.094, lo: true },
      { y: 1.47, z: -0.022, rx: 0.102, zf: 0.097, zb: 0.098 },
      { y: 1.51, z: -0.02, rx: 0.088, zf: 0.087, zb: 0.084, lo: true },
      { y: 1.528, z: -0.02, rx: 0.07, zf: 0.07, zb: 0.068 },
    ];
    loft(gb, sk, lod, {
      segs: near ? 12 : 5, slot: SLOT.accent, morph: MORPH.central, vis: VIS.scarf,
      bind: (p) => ({ a: P.torso, b: P.head, wb: 0.25 * ss(1.47, 1.53, p[1]) }),
    });
    // hanging end (z-loft along a front strip, steep)
    const ek: Key[] = [];
    const n = near ? 4 : 1;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      ek.push({ y: lerp(1.44, 1.18, t), x: 0.045 + 0.01 * t, z: lerp(0.098, 0.15, t) + 0.0, rx: 0.035, zf: 0.009, zb: 0.009, n: 5, lo: true });
    }
    // build as y-loft going up (reverse order so profile goes up)
    ek.reverse();
    const ekp: Key[] = [{ ...ek[0], rx: 0, zf: 0, zb: 0, y: ek[0].y - 0.005 }, ...ek.map((k) => ({ ...k })), { ...ek[ek.length - 1], rx: 0, zf: 0, zb: 0, y: ek[ek.length - 1].y + 0.005 }];
    loft(gb, ekp, lod, { segs: near ? 6 : 4, slot: SLOT.accent, morph: MORPH.central, vis: VIS.scarf, bind: () => ({ a: P.torso }) });
  }

  // ---------------- BACKPACK ----------------
  {
    const bk: Key[] = [
      { y: 1.04, z: -0.165, rx: 0, zf: 0, zb: 0 },
      { y: 1.05, z: -0.165, rx: 0.12, zf: 0.05, zb: 0.06, n: 4, lo: true },
      { y: 1.2, z: -0.172, rx: 0.135, zf: 0.055, zb: 0.07, n: 4 },
      { y: 1.36, z: -0.17, rx: 0.13, zf: 0.05, zb: 0.065, n: 4, lo: true },
      { y: 1.43, z: -0.16, rx: 0.1, zf: 0.04, zb: 0.045, n: 3 },
      { y: 1.445, z: -0.158, rx: 0, zf: 0, zb: 0 },
    ];
    loft(gb, bk, lod, { segs: near ? 12 : 4, sub: 1, slot: SLOT.bag, morph: MORPH.central, vis: VIS.backpack, bind: () => ({ a: P.torso, ao: 1 }) });
  }

  // ---------------- HANDBAG (left hand) ----------------
  {
    const g = PIVOT.grip;
    const hb: Key[] = [
      { y: 0.52, x: g[0] + 0.04, z: g[2], rx: 0, zf: 0, zb: 0 },
      { y: 0.525, x: g[0] + 0.04, z: g[2], rx: 0.04, zf: 0.13, zb: 0.13, n: 5, lo: true },
      { y: 0.62, x: g[0] + 0.04, z: g[2], rx: 0.045, zf: 0.135, zb: 0.135, n: 5 },
      { y: 0.7, x: g[0] + 0.04, z: g[2], rx: 0.035, zf: 0.12, zb: 0.12, n: 5, lo: true },
      { y: 0.705, x: g[0] + 0.04, z: g[2], rx: 0, zf: 0, zb: 0 },
    ];
    loft(gb, hb, lod, { segs: near ? 10 : 4, slot: SLOT.bag, morph: MORPH.none, vis: VIS.handbag, bind: () => ({ a: P.bagL }) });
    if (near) {
      const st: Key[] = [
        { y: 0.69, x: g[0] + 0.035, z: g[2], rx: 0.006, zf: 0.05, zb: 0.05 },
        { y: 0.78, x: g[0] + 0.0, z: g[2], rx: 0.006, zf: 0.012, zb: 0.012 },
      ];
      loft(gb, st, lod, { segs: 6, slot: SLOT.dark, morph: MORPH.none, vis: VIS.handbag, bind: () => ({ a: P.bagL }) });
    }
  }

  // ---------------- PHONE (right hand; phone call / photo) ----------------
  if (near) {
    const g = PIVOT.grip;
    const ph: Key[] = [
      { y: 0.715, x: -(g[0] - 0.024), z: g[2] + 0.01, rx: 0, zf: 0, zb: 0 },
      { y: 0.718, x: -(g[0] - 0.024), z: g[2] + 0.01, rx: 0.005, zf: 0.035, zb: 0.035, n: 6 },
      { y: 0.855, x: -(g[0] - 0.024), z: g[2] + 0.01, rx: 0.005, zf: 0.035, zb: 0.035, n: 6 },
      { y: 0.858, x: -(g[0] - 0.024), z: g[2] + 0.01, rx: 0, zf: 0, zb: 0 },
    ];
    loft(gb, ph, lod, { segs: 6, slot: SLOT.dark, morph: MORPH.armR, vis: VIS.phone, bind: () => ({ a: P.handR }) });
  }

  // ---------------- UMBRELLA (special part: follows the right hand, stays upright) ----------------
  {
    const gx = -PIVOT.grip[0], gy = PIVOT.grip[1], gz = PIVOT.grip[2];
    const segs = near ? 16 : 8; // 8 panels: ribs on even vertices, panel middles on odd (far: ribs only)
    const R = 0.52;
    const apex = gy + 0.86;
    const prof = near ? [0.18, 0.38, 0.58, 0.78, 0.92, 1.0] : [0.55, 1.0];
    const surf = (t: number, top: boolean): V3[] => {
      const out: V3[] = [];
      for (let j = 0; j < segs; j++) {
        const th = (j / segs) * Math.PI * 2;
        const mid = near && j % 2 === 1;
        const rr = (R * Math.sin(t * Math.PI * 0.42)) / Math.sin(Math.PI * 0.42) * (mid ? lerp(1, 0.93, t * t) : 1);
        const y = apex - 0.3 * (1 - Math.cos(t * Math.PI * 0.5)) + (mid ? 0.016 * t * t : 0) - (top ? 0 : 0.012);
        out.push([gx + rr * Math.cos(th), y, gz + rr * Math.sin(th)]);
      }
      return out;
    };
    // closed profile, ccw in the (r, y) half plane: underside outward, then top surface inward
    const rs: RingSet = { rings: [[[gx, apex - 0.012, gz]]], pole: [true] };
    for (const t of prof) { rs.rings.push(surf(t, false)); rs.pole.push(false); }
    for (const t of prof.slice().reverse()) { rs.rings.push(surf(t, true)); rs.pole.push(false); }
    rs.rings.push([[gx, apex, gz]]); rs.pole.push(true);
    const umbBind: BindFn = () => ({ a: P.umbrella });
    ringsPiece(gb, rs, { slot: SLOT.canopy, morph: MORPH.none, vis: VIS.umbrella, bind: umbBind });
    // shaft + handle
    const sh: Key[] = [
      { y: gy - 0.13, x: gx, z: gz, rx: 0, zf: 0, zb: 0 },
      { y: gy - 0.125, x: gx, z: gz, rx: 0.016, zf: 0.016, zb: 0.016, lo: true },
      { y: gy + 0.05, x: gx, z: gz, rx: 0.016, zf: 0.016, zb: 0.016, lo: true },
      { y: gy + 0.055, x: gx, z: gz, rx: 0.007, zf: 0.007, zb: 0.007 },
      { y: apex + 0.07, x: gx, z: gz, rx: 0.005, zf: 0.005, zb: 0.005, lo: true },
      { y: apex + 0.075, x: gx, z: gz, rx: 0, zf: 0, zb: 0 },
    ];
    loft(gb, sh, lod, { segs: near ? 5 : 3, slot: SLOT.dark, morph: MORPH.none, vis: VIS.umbrella, bind: umbBind });
  }

  const geometry = gb.build();
  return { geometry, triangles: gb.idx.length / 3 };
}

/** Triangle counts per visibility condition (for reporting / budgeting). */
export function triangleStats(g: THREE.BufferGeometry): Record<number, number> {
  const idx = g.getIndex()!;
  const meta = g.getAttribute('aMeta') as THREE.BufferAttribute;
  const out: Record<number, number> = {};
  for (let i = 0; i < idx.count; i += 3) {
    const v = meta.getY(idx.getX(i));
    out[v] = (out[v] ?? 0) + 1;
  }
  return out;
}
