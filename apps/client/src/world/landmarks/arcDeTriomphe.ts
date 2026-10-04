import * as THREE from 'three';
import { MeshBuilder, addRelief, applyNightPatch, blob, disposeObject, fbm2, mulberry32, smoothstep, valueNoise2 } from './common';
import type { ReliefFrame } from './common';
import { archRing, extrudeProfile } from './extrude';
import type { ProfilePoint } from './extrude';
import { carvedStoneTextures, cofferTextures, limestoneTextures } from './textures';
import type { Landmark, LandmarkCollider, LandmarkOptions } from './types';

/*
 * Arc de Triomphe de l'Étoile. Local frame: +X along the 44.8 m façade (long side), the great arches face ±Z
 * (the Champs-Élysées axis runs along local Z), +Y up, origin at ground level at the monument centre.
 */

// --- Key real-world dimensions (metres) ---------------------------------------------------------
const HX = 22.4; // half length (44.8 m)
const HZ = 11.1; // half depth (22.2 m)
const Y0 = 0.6; // top of the platform (3 steps)
const RA = 7.31; // main arch half width (14.62 m)
const YS = 21.88; // main arch springing (top at 29.19 m)
const RT = 4.22; // transverse arch half width (8.44 m)
const YTS = 14.46; // transverse arch springing (top at 18.68 m)
const YE = 30.9; // underside of the architrave
const PIER_C = (RA + HX) / 2; // pier centre along X

interface Face {
  n: THREE.Vector3;
  u: THREE.Vector3;
  c: THREE.Vector3;
  half: number;
}

const FACES: Face[] = [
  { n: new THREE.Vector3(0, 0, 1), u: new THREE.Vector3(1, 0, 0), c: new THREE.Vector3(0, 0, HZ), half: HX },
  { n: new THREE.Vector3(0, 0, -1), u: new THREE.Vector3(-1, 0, 0), c: new THREE.Vector3(0, 0, -HZ), half: HX },
  { n: new THREE.Vector3(1, 0, 0), u: new THREE.Vector3(0, 0, -1), c: new THREE.Vector3(HX, 0, 0), half: HZ },
  { n: new THREE.Vector3(-1, 0, 0), u: new THREE.Vector3(0, 0, 1), c: new THREE.Vector3(-HX, 0, 0), half: HZ },
];

const V = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);

// faceBox face bits (hexa order): wall side, +u side, outer, -u side, top, bottom
const FB_WALL = 1;
const FB_TOP = 16;
const FB_DEFAULT = 0b111111 & ~FB_WALL;

/** Box attached to a face: centred at uc along the face, width w, from y0..y1, from o0..o1 along the normal. */
function faceBox(mb: MeshBuilder, f: Face, uc: number, w: number, y0: number, y1: number, o0: number, o1: number, faces = FB_DEFAULT): void {
  const P = (du: number, y: number, o: number): THREE.Vector3 => f.c.clone().addScaledVector(f.u, uc + du).addScaledVector(f.n, o).setY(y);
  const h = w / 2;
  mb.hexa([P(-h, y0, o0), P(h, y0, o0), P(h, y0, o1), P(-h, y0, o1), P(-h, y1, o0), P(h, y1, o0), P(h, y1, o1), P(-h, y1, o1)], faces);
}

/** A horizontal band running around the whole monument (all four faces), projecting `out` m. */
function belt(mb: MeshBuilder, y0: number, y1: number, out: number, inset = 0): void {
  mb.box(-HX - out + inset, y0, -HZ - out + inset, HX + out - inset, y1, HZ + out - inset, 0b111111);
}

function smax(a: number, b: number, k: number): number {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.max(a, b) + h * h * k * 0.25;
}

type Part = [number, number, number, number, number, number]; // cx, cy, sx, sy, angle, depth

/** Heroic standing figure built from gaussian masses (metres). */
function figure(parts: Part[], bx: number, by: number, h: number, lean: number, armA: number, armB: number, depth = 1, rnd: () => number = Math.random): void {
  const d = depth;
  const hipX = bx + lean * 0.35 * h;
  // legs (striding)
  const stride = 0.1 + rnd() * 0.12;
  parts.push([bx - stride * h * 0.5 + lean * 0.1 * h, by + 0.23 * h, 0.05 * h, 0.24 * h, -stride * 1.2 + lean, 0.85 * d]);
  parts.push([bx + stride * h * 0.5 + lean * 0.12 * h, by + 0.23 * h, 0.05 * h, 0.24 * h, stride * 1.2 + lean, 0.95 * d]);
  // pelvis + torso
  parts.push([hipX, by + 0.5 * h, 0.1 * h, 0.075 * h, 0, 1.1 * d]);
  parts.push([bx + lean * 0.6 * h, by + 0.66 * h, 0.105 * h, 0.15 * h, lean * 0.8, 1.35 * d]);
  // head
  parts.push([bx + lean * 0.95 * h, by + 0.9 * h, 0.05 * h, 0.06 * h, 0, 1.45 * d]);
  parts.push([bx + lean * 0.9 * h, by + 0.835 * h, 0.03 * h, 0.03 * h, 0, 1.1 * d]); // neck
  // arms
  const sx = bx + lean * 0.75 * h;
  const sy = by + 0.78 * h;
  for (const [a, side] of [
    [armA, -1],
    [armB, 1],
  ] as const) {
    const ax = sx + side * 0.1 * h + Math.cos(a) * 0.17 * h;
    const ay = sy + Math.sin(a) * 0.17 * h;
    parts.push([ax, ay, 0.18 * h, 0.032 * h, a, 1.2 * d]);
  }
  // cloak / drapery mass behind
  parts.push([bx + lean * 0.5 * h - 0.05 * h, by + 0.55 * h, 0.15 * h, 0.28 * h, lean * 0.5, 0.45 * d]);
  // shield or weapon
  if (rnd() < 0.5) parts.push([bx + (rnd() < 0.5 ? -1 : 1) * 0.2 * h, by + 0.55 * h, 0.09 * h, 0.1 * h, 0, 1.3 * d]);
}

/** High-relief group (≈8 m × 11.6 m): winged genius above, warriors below. */
function groupHeight(seed: number): (u: number, v: number) => number {
  const rnd = mulberry32(seed);
  const W = 8;
  const H = 11.6;
  const parts: Part[] = [];
  // ground / rocks
  parts.push([W * 0.5, 0.35, 3.6, 0.6, 0, 0.9]);
  // 3-4 warriors
  const n = 3 + (rnd() < 0.5 ? 1 : 0);
  for (let i = 0; i < n; i++) {
    const bx = W * (0.16 + (0.7 * i) / (n - 1)) + (rnd() - 0.5) * 0.5;
    const h = 5.2 + rnd() * 1.2;
    const lean = (rnd() - 0.5) * 0.25;
    figure(parts, bx, 0.4 + rnd() * 0.4, h, lean, -0.3 + rnd() * 2.5, 0.5 + rnd() * 2.2, 1.0, rnd);
  }
  // a kneeling / fallen figure in front
  parts.push([W * (0.3 + rnd() * 0.4), 1.4, 1.3, 0.6, (rnd() - 0.5) * 0.6, 1.6]);
  // winged genius (upper register)
  const gx = W * (0.4 + rnd() * 0.2);
  const gy = 8.4 + rnd() * 0.5;
  const gl = (rnd() - 0.5) * 0.6;
  parts.push([gx, gy, 0.75, 1.05, gl, 1.4]); // torso
  parts.push([gx + gl * 0.8, gy + 1.45, 0.34, 0.38, 0, 1.3]); // head
  parts.push([gx - gl, gy - 1.6, 0.45, 1.3, gl * 1.5 + 0.3, 1.0]); // legs / drapery trailing
  const wingA = 0.55 + rnd() * 0.35;
  parts.push([gx - 1.8, gy + 0.9, 2.0, 0.5, -wingA, 0.85]); // left wing
  parts.push([gx + 1.8, gy + 0.9, 2.0, 0.5, wingA, 0.85]);
  parts.push([gx - 2.6, gy + 1.5, 1.2, 0.35, -wingA - 0.25, 0.55]);
  parts.push([gx + 2.6, gy + 1.5, 1.2, 0.35, wingA + 0.25, 0.55]);
  // raised sword arm
  const armSide = rnd() < 0.5 ? -1 : 1;
  parts.push([gx + armSide * 0.9, gy + 1.9, 0.18, 1.0, -armSide * 0.35, 1.25]);
  parts.push([gx - armSide * 1.1, gy + 0.3, 0.9, 0.2, armSide * 0.4, 1.2]);
  return (u: number, v: number): number => {
    const X = u * W;
    const Y = v * H;
    let h = 0.06;
    for (const p of parts) h = smax(h, p[5] * blob(X, Y, p[0], p[1], p[2], p[3], p[4], 1.7), 0.18);
    // drapery folds + chisel noise
    const folds = Math.sin(X * 3.1 + fbm2(X * 0.6, Y * 0.6, 2, seed) * 6 + Y * 0.8) * 0.06;
    h += folds * smoothstep(0.3, 0.9, h) + (fbm2(X * 1.6, Y * 1.6, 3, seed + 5) - 0.5) * 0.18 * smoothstep(0.2, 0.6, h);
    // fade to the slab at the edges
    const e = Math.min(X, W - X, Y + 0.6, H - Y);
    h *= smoothstep(-0.05, 0.45, e);
    return h * 1.35;
  };
}

/** Bas-relief procession band (low relief). W × H metres. */
function processionHeight(seed: number, W: number, H: number, depth: number, spacing: number, framed = true): (u: number, v: number) => number {
  const rnd = mulberry32(seed);
  const parts: Part[] = [];
  let x = spacing * 0.6;
  while (x < W - spacing * 0.4) {
    const h = H * (0.72 + rnd() * 0.12);
    if (rnd() < 0.12) {
      // horse
      parts.push([x + spacing * 0.6, H * 0.45, spacing * 1.0, H * 0.14, 0, 1.0]);
      parts.push([x + spacing * 1.5, H * 0.62, spacing * 0.2, H * 0.14, -0.6, 1.0]);
      parts.push([x + spacing * 0.6, H * 0.72, spacing * 0.25, H * 0.15, 0, 0.9]);
      x += spacing * 2.2;
    } else {
      figure(parts, x, H * 0.05, h, (rnd() - 0.5) * 0.2, rnd() * 3, rnd() * 3, 1, rnd);
      x += spacing * (0.8 + rnd() * 0.5);
    }
  }
  return (u: number, v: number): number => {
    const X = u * W;
    const Y = v * H;
    let h = 0;
    for (const p of parts) {
      if (Math.abs(X - p[0]) > 3 * Math.max(p[2], p[3]) + 0.5) continue;
      h = smax(h, p[5] * blob(X, Y, p[0], p[1], p[2], p[3], p[4], 1.5), 0.2);
    }
    h += (valueNoise2(X * 3, Y * 3, seed) - 0.5) * 0.12 * h;
    const e = framed ? Math.min(X, W - X, Y, H - Y) : Math.min(Y + 0.1, H - Y);
    return h * depth * smoothstep(0, 0.25, e) + 0.02;
  };
}

/** Reclining winged Fame in the spandrel next to the archivolt. Frame origin at (0.3, 22.0). */
function fameHeight(seed: number, W: number, H: number): (u: number, v: number) => number {
  const cx = -0.3;
  const cy = YS - 22.0;
  const parts: Part[] = [];
  const at = (r: number, deg: number): [number, number] => {
    const a = (deg * Math.PI) / 180;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  const tang = (deg: number): number => (deg * Math.PI) / 180 + Math.PI / 2;
  const [bx, by] = at(9.35, 48);
  parts.push([bx, by, 1.8, 0.42, tang(48), 0.6]); // body
  const [lx, ly] = at(9.1, 26);
  parts.push([lx, ly, 1.3, 0.3, tang(26), 0.45]); // legs
  const [hx, hy] = at(9.3, 72);
  parts.push([hx, hy, 0.34, 0.34, 0, 0.6]); // head
  const [wx, wy] = at(10.7, 58);
  parts.push([wx, wy, 1.6, 0.55, tang(58) + 0.5, 0.45]); // wing
  const [tx, ty] = at(9.4, 84);
  parts.push([tx, ty, 0.9, 0.12, tang(84), 0.45]); // trumpet / palm
  return (u: number, v: number): number => {
    const X = u * W;
    const Y = v * H;
    const r = Math.hypot(X - cx, Y - cy);
    if (r < 8.0) return -1; // inside the archivolt: hole
    if (r < 8.45) return 0;
    let h = 0;
    for (const p of parts) h = smax(h, p[5] * blob(X, Y, p[0], p[1], p[2], p[3], p[4]), 0.25);
    h += (fbm2(X * 1.5, Y * 1.5, 2, seed) - 0.5) * 0.08 * h;
    return h * smoothstep(8.45, 8.75, r) * smoothstep(0, 0.4, H - Y) * smoothstep(0, 0.3, W - X);
  };
}

export function createArcDeTriomphe(opts: LandmarkOptions = {}): Landmark {
  const high = (opts.quality ?? 'high') === 'high';
  const texSize = high ? 512 : 256;
  const arcSegs = high ? 28 : 14;

  const stone = new MeshBuilder();
  stone.uvScale = 8;
  const coffer = new MeshBuilder();
  const sculpt = new MeshBuilder();
  sculpt.uvScale = 3;
  const dark = new MeshBuilder();
  dark.uvScale = 1;

  const SC = 1; // base vertex colour factor
  stone.setColor(SC);

  // ---------------------------------------------------------------- platform & steps
  stone.setColor(0.86);
  const steps = [
    [4.2, 0, 0.2],
    [3.4, 0.2, 0.4],
    [2.6, 0.4, Y0],
  ];
  for (const [m, y0, y1] of steps) stone.box(-HX - m, y0, -HZ - m, HX + m, y1, HZ + m, 0b111111 & ~0b000100);
  stone.setColor(SC);

  // ---------------------------------------------------------------- massing: piers with transverse vault
  const transverse = (side: number): void => {
    const pts: ProfilePoint[] = [];
    pts.push({ a: -HZ, b: Y0, tag: 'skip' });
    pts.push({ a: -RT, b: Y0, tag: 'jamb' });
    for (let i = 0; i <= arcSegs; i++) {
      const th = Math.PI - (Math.PI * i) / arcSegs;
      const last = i === arcSegs;
      pts.push({ a: RT * Math.cos(th), b: YTS + RT * Math.sin(th), n: [-Math.cos(th), -Math.sin(th)], tag: last ? 'jamb' : 'vault' });
    }
    pts.push({ a: RT, b: Y0, tag: 'skip' });
    pts.push({ a: HZ, b: Y0, tag: 'facade' });
    pts.push({ a: HZ, b: YS, tag: 'skip' });
    pts.push({ a: -HZ, b: YS, tag: 'facade' });
    // the jamb tags: first jamb point is (-RT, Y0) -> (-RT, YTS); the arc's last point tags jamb (RT, YTS)->(RT, Y0)
    const w0 = side > 0 ? RA : -HX;
    const w1 = side > 0 ? HX : -RA;
    const tvLen = Math.PI * RT;
    const cell = tvLen / 7;
    extrudeProfile(pts, {
      map: (a, b, w) => V(w, b, a),
      mapN: (na, nb) => V(0, nb, na),
      wAxis: V(1, 0, 0),
      w0,
      w1,
      edges: {
        facade: { mb: stone },
        jamb: { mb: stone, glow: 0.7 },
        vault: { mb: coffer, glow: 1, uv: (s, w) => [(s - (HZ - RT + YTS - Y0)) / cell, w / (15.09 / 8)] },
      },
      capStart: { mb: stone, glow: side > 0 ? 0.55 : 0 },
      capEnd: { mb: stone, glow: side > 0 ? 0 : 0.55 },
    });
  };
  transverse(1);
  transverse(-1);

  // upper block with the great barrel vault
  {
    const pts: ProfilePoint[] = [];
    pts.push({ a: -HX, b: YS, tag: 'skip' });
    for (let i = 0; i <= arcSegs * 2; i++) {
      const th = Math.PI - (Math.PI * i) / (arcSegs * 2);
      const last = i === arcSegs * 2;
      pts.push({ a: RA * Math.cos(th), b: YS + RA * Math.sin(th), n: [-Math.cos(th), -Math.sin(th)], tag: last ? 'skip' : 'vault' });
    }
    pts.push({ a: HX, b: YS, tag: 'facade' });
    pts.push({ a: HX, b: YE, tag: 'skip' });
    pts.push({ a: -HX, b: YE, tag: 'facade' });
    const len = Math.PI * RA;
    const cell = len / 11;
    extrudeProfile(pts, {
      map: (a, b, w) => V(a, b, w),
      mapN: (na, nb) => V(na, nb, 0),
      wAxis: V(0, 0, 1),
      w0: -HZ,
      w1: HZ,
      edges: {
        facade: { mb: stone },
        vault: { mb: coffer, glow: 1, uv: (s, w) => [(s - (HX - RA)) / cell, (w + HZ) / (2 * HZ / 11)] },
      },
      capStart: { mb: stone },
      capEnd: { mb: stone },
    });
  }

  // ---------------------------------------------------------------- socles (plinths) around the 4 pillars
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const xa = sx > 0 ? RA - 0.3 : -HX - 0.3;
      const xb = sx > 0 ? HX + 0.3 : -RA + 0.3;
      const za = sz > 0 ? RT - 0.3 : -HZ - 0.3;
      const zb = sz > 0 ? HZ + 0.3 : -RT + 0.3;
      stone.box(xa, Y0, za, xb, 4.15, zb, 0b111011);
      stone.box(xa - 0.15, 4.15, za - 0.15, xb + 0.15, 4.45, zb + 0.15, 0b111111);
      stone.box(xa - 0.05, 4.45, za - 0.05, xb + 0.05, 4.65, zb + 0.05, 0b111011);
      // transverse impost (not on the main façades)
      const fz = sz > 0 ? 0b000001 : 0b000010; // only the face toward the transverse vault
      stone.glow = 0.4;
      stone.box(sx > 0 ? RA - 0.22 : -HX - 0.22, YTS - 0.55, sz > 0 ? RT - 0.22 : -HZ, sx > 0 ? HX + 0.22 : -RA + 0.22, YTS, sz > 0 ? HZ : -RT + 0.22, 0b111100 | fz);
      stone.glow = 0;
    }
  }

  // ---------------------------------------------------------------- impost belt at the main springing
  for (const sx of [-1, 1]) {
    const xa = sx > 0 ? RA - 0.28 : -HX - 0.28;
    const xb = sx > 0 ? HX + 0.28 : -RA + 0.28;
    stone.box(xa, YS - 0.65, -HZ - 0.28, xb, YS - 0.15, HZ + 0.28);
    stone.box(xa + 0.1, YS - 0.15, -HZ - 0.18, xb - 0.1, YS + 0.05, HZ + 0.18, 0b111011);
  }

  // ---------------------------------------------------------------- archivolts and keystones
  for (const f of FACES.slice(0, 2)) {
    const c = V(0, YS, 0).addScaledVector(f.n, HZ);
    archRing(stone, c, f.u, V(0, 1, 0), f.n, RA, 7.85, 0.18, arcSegs * 2);
    archRing(stone, c, f.u, V(0, 1, 0), f.n, 7.85, 8.3, 0.34, arcSegs * 2);
    // keystone (console)
    const P = (du: number, y: number, o: number): THREE.Vector3 => c.clone().addScaledVector(f.u, du).addScaledVector(f.n, o).setY(y);
    stone.hexa([P(-0.55, 28.85, 0), P(0.55, 28.85, 0), P(0.55, 28.85, 0.55), P(-0.55, 28.85, 0.55), P(-0.85, YE, 0), P(0.85, YE, 0), P(0.85, YE, 0.7), P(-0.85, YE, 0.7)]);
  }
  for (const f of FACES.slice(2)) {
    const c = V(0, YTS, 0).addScaledVector(f.n, HX);
    archRing(stone, c, f.u, V(0, 1, 0), f.n, RT, 4.7, 0.15, arcSegs);
    archRing(stone, c, f.u, V(0, 1, 0), f.n, 4.7, 5.1, 0.28, arcSegs);
    const P = (du: number, y: number, o: number): THREE.Vector3 => c.clone().addScaledVector(f.u, du).addScaledVector(f.n, o).setY(y);
    stone.hexa([P(-0.4, 18.2, 0), P(0.4, 18.2, 0), P(0.4, 18.2, 0.42), P(-0.4, 18.2, 0.42), P(-0.6, 19.9, 0), P(0.6, 19.9, 0), P(0.6, 19.9, 0.5), P(-0.6, 19.9, 0.5)]);
  }

  // ---------------------------------------------------------------- high-relief groups (4) on the main façades
  const gNu = high ? 34 : 18;
  const gNv = high ? 54 : 28;
  let gSeed = 101;
  for (const f of FACES.slice(0, 2)) {
    for (const side of [-1, 1]) {
      const uc = side * PIER_C;
      // pedestal
      stone.setColor(0.95);
      faceBox(stone, f, uc, 8.8, 4.65, 6.6, 0, 2.3);
      faceBox(stone, f, uc, 9.2, 6.35, 6.65, 0, 2.5);
      stone.setColor(SC);
      const frame: ReliefFrame = {
        origin: f.c.clone().addScaledVector(f.u, uc - 4).setY(6.65).addScaledVector(f.n, 0.05),
        uAxis: f.u.clone(),
        vAxis: V(0, 1, 0),
        normal: f.n.clone(),
        width: 8,
        height: 11.6,
      };
      addRelief(sculpt, frame, gNu, gNv, groupHeight(gSeed++), 0.6);
    }
  }

  // ---------------------------------------------------------------- bas-relief panels above the impost
  const bNu = high ? 36 : 18;
  const bNv = high ? 14 : 7;
  const panel = (f: Face, uc: number, w: number, y0: number, h: number, seed: number): void => {
    // frame
    stone.setColor(0.97);
    faceBox(stone, f, uc, w + 0.7, y0 - 0.35, y0, 0, 0.22);
    faceBox(stone, f, uc, w + 0.7, y0 + h, y0 + h + 0.35, 0, 0.22);
    faceBox(stone, f, uc - w / 2 - 0.175, 0.35, y0, y0 + h, 0, 0.22);
    faceBox(stone, f, uc + w / 2 + 0.175, 0.35, y0, y0 + h, 0, 0.22);
    sculpt.setColor(0.92);
    addRelief(sculpt, { origin: f.c.clone().addScaledVector(f.u, uc - w / 2).setY(y0), uAxis: f.u.clone(), vAxis: V(0, 1, 0), normal: f.n.clone(), width: w, height: h }, bNu, bNv, processionHeight(seed, w, h, 0.38, 0.95), 0.7);
    stone.setColor(SC);
  };
  let pSeed = 301;
  for (const f of FACES.slice(0, 2)) for (const side of [-1, 1]) panel(f, side * (PIER_C + 0.4), 9.4, 23.4, 4.9, pSeed++);
  for (const f of FACES.slice(2)) panel(f, 0, 15.5, 23.4, 4.9, pSeed++);

  // ---------------------------------------------------------------- spandrel Fames
  const fNu = high ? 22 : 12;
  const fNv = high ? 20 : 10;
  for (const f of FACES.slice(0, 2)) {
    for (const side of [-1, 1]) {
      const u = f.u.clone().multiplyScalar(side);
      addRelief(sculpt, { origin: f.c.clone().addScaledVector(u, 0.3).setY(22.0), uAxis: u, vAxis: V(0, 1, 0), normal: f.n.clone(), width: 9.7, height: YE - 22.0 - 0.02 }, fNu, fNv, fameHeight(500 + side, 9.7, YE - 22.0), 0.5);
    }
  }

  // ---------------------------------------------------------------- entablature
  belt(stone, YE, 31.45, 0.12);
  belt(stone, 31.45, 32.0, 0.2);
  belt(stone, 32.0, 35.4, 0.1);
  // the great frieze (sculpted)
  const frNu = high ? 2.2 : 1.1; // vertices per metre
  let frSeed = 700;
  for (const f of FACES) {
    const W = f.half * 2 + 0.2;
    addRelief(sculpt, { origin: f.c.clone().addScaledVector(f.n, 0.1).addScaledVector(f.u, -W / 2).setY(32.05), uAxis: f.u.clone(), vAxis: V(0, 1, 0), normal: f.n.clone(), width: W, height: 3.3 }, Math.round(W * frNu), high ? 7 : 4, processionHeight(frSeed++, W, 3.3, 0.3, 0.75, false), 0.5);
  }
  belt(stone, 35.4, 35.8, 0.38);
  // modillions under the corona
  stone.setColor(0.9);
  for (const f of FACES) {
    const half = f.half + 0.38;
    const n = Math.floor((half * 2) / 0.95);
    for (let i = 0; i <= n; i++) {
      const uc = -half + 0.2 + (i * (half * 2 - 0.4)) / n;
      faceBox(stone, f, uc, 0.32, 35.8, 36.42, 0.3, 1.25, FB_DEFAULT & ~FB_TOP);
    }
  }
  stone.setColor(0.86);
  belt(stone, 36.4, 37.1, 1.38); // corona (soffit darker via vertex colour)
  stone.setColor(SC);
  belt(stone, 37.1, 37.45, 1.15);

  // ---------------------------------------------------------------- attic
  belt(stone, 37.45, 38.25, 0.02);
  belt(stone, 38.25, 47.6, -0.3);
  // corner pilasters + shield bays
  for (const f of FACES) {
    for (const s of [-1, 1]) faceBox(stone, f, s * (f.half - 0.9), 1.8, 38.25, 47.6, -0.3, -0.12);
    const count = f.half > 15 ? 9 : 6;
    const span = f.half * 2 - 4.4;
    for (let i = 0; i < count; i++) {
      const uc = -span / 2 + (span * (i + 0.5)) / count;
      // inscription plaque
      faceBox(stone, f, uc, 1.9, 38.55, 38.95, -0.3, -0.24);
      const centre = f.c.clone().addScaledVector(f.u, uc).addScaledVector(f.n, -0.3).setY(40.2);
      const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), f.n);
      const m = new THREE.Matrix4().compose(centre.clone().addScaledVector(f.n, 0.11), q, V(1, 1, 1));
      const g1 = new THREE.CylinderGeometry(0.88, 0.92, 0.22, high ? 18 : 10, 1, false);
      stone.addGeometry(g1, m);
      g1.dispose();
      const m2 = new THREE.Matrix4().compose(centre.clone().addScaledVector(f.n, 0.28), q, V(1, 1, 1));
      const g2 = new THREE.CylinderGeometry(0.42, 0.62, 0.14, high ? 14 : 8, 1, false);
      stone.addGeometry(g2, m2);
      g2.dispose();
      // garland hint
      faceBox(stone, f, uc, 2.6, 41.45, 41.65, -0.3, -0.2);
    }
  }
  belt(stone, 47.6, 48.0, -0.1);
  belt(stone, 48.0, 48.6, 0.45);
  belt(stone, 48.6, 48.85, 0.3);
  belt(stone, 48.85, 50.0, -0.4);

  // ---------------------------------------------------------------- Tomb of the Unknown Soldier + chains
  const TZ = 1.2;
  dark.setColor(0.09, 0.09, 0.1);
  dark.box(-0.75, Y0, TZ - 1.5, 0.75, Y0 + 0.05, TZ + 1.5, 0b111011);
  dark.setColor(0.3, 0.19, 0.09); // bronze
  dark.box(-0.42, Y0 + 0.05, TZ - 0.6, 0.42, Y0 + 0.06, TZ + 0.8, 0b111011); // inscription plate
  // flame burner: bronze star rosette
  const star = new THREE.Shape();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r = i % 2 ? 0.32 : 0.6;
    if (i === 0) star.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else star.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const starGeo = new THREE.ExtrudeGeometry(star, { depth: 0.06, bevelEnabled: false });
  starGeo.rotateX(-Math.PI / 2);
  dark.addGeometry(starGeo, new THREE.Matrix4().makeTranslation(0, Y0, TZ - 2.1));
  starGeo.dispose();
  const ring = new THREE.CylinderGeometry(0.14, 0.18, 0.18, 12, 1, true);
  dark.addGeometry(ring, new THREE.Matrix4().makeTranslation(0, Y0 + 0.09, TZ - 2.1));
  ring.dispose();
  // bollards and sagging chains
  dark.setColor(0.06, 0.06, 0.065);
  const posts: THREE.Vector3[] = [];
  const bx = 1.7;
  const bz0 = TZ - 3.2;
  const bz1 = TZ + 2.4;
  for (const [px, pz] of [
    [-bx, bz0],
    [0, bz0],
    [bx, bz0],
    [bx, (bz0 + bz1) / 2],
    [bx, bz1],
    [0, bz1],
    [-bx, bz1],
    [-bx, (bz0 + bz1) / 2],
  ]) {
    posts.push(V(px, Y0, pz));
    const post = new THREE.CylinderGeometry(0.05, 0.07, 0.62, 8);
    dark.addGeometry(post, new THREE.Matrix4().makeTranslation(px, Y0 + 0.31, pz));
    post.dispose();
    const knob = new THREE.SphereGeometry(0.075, 8, 6);
    dark.addGeometry(knob, new THREE.Matrix4().makeTranslation(px, Y0 + 0.66, pz));
    knob.dispose();
  }
  for (let i = 0; i < posts.length; i++) {
    const a = posts[i].clone().setY(Y0 + 0.55);
    const b = posts[(i + 1) % posts.length].clone().setY(Y0 + 0.55);
    const seg = 6;
    let prev = a;
    for (let k = 1; k <= seg; k++) {
      const t = k / seg;
      const p = a.clone().lerp(b, t);
      p.y -= Math.sin(t * Math.PI) * 0.18;
      dark.beam(prev, p, 0.025, 0.025, V(0, 1, 0));
      prev = p;
    }
  }

  // ---------------------------------------------------------------- materials
  const lime = limestoneTextures(texSize, 8, 7);
  const cof = cofferTextures(high ? 256 : 128, 11);
  const carved = carvedStoneTextures(high ? 256 : 128, 13);
  const stoneColor = new THREE.Color().setRGB(0.94, 0.88, 0.77, THREE.SRGBColorSpace);
  const uNight = { value: 0 };
  const uFloodColor = { value: new THREE.Color(1.0, 0.66, 0.36) };
  const uFloodI = { value: 0.62 };
  const stoneColorGLSL = /* glsl */ `
    float n1 = lmFbm(lmPos * 0.32);
    float n2 = lmNoise(vec3(lmPos.x * 1.7 + lmPos.z * 1.7, lmPos.y * 0.09, 3.1));
    float grime = (1.0 - smoothstep(0.0, 16.0, lmPos.y)) * 0.13;
    float streak = smoothstep(0.55, 0.9, n2) * 0.11 * smoothstep(8.0, 30.0, lmPos.y);
    diffuseColor.rgb *= (0.9 + 0.17 * n1) * (1.0 - streak) * (1.0 - grime);
    diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.93, 0.95, 1.0), grime * 2.0);
  `;
  const floodGLSL = /* glsl */ `
    float h = lmPos.y;
    float up = lmN.y;
    float vert = 1.0 - abs(up);
    float fl = mix(1.45, 0.62, smoothstep(0.0, 50.0, h));
    fl *= 0.35 + 0.65 * vert + 0.8 * max(-up, 0.0) - 0.2 * max(up, 0.0);
    // light pools from the ground projectors along the facades
    fl *= 0.85 + 0.3 * sin(lmPos.x * 0.55 + lmPos.z * 0.55) * (1.0 - smoothstep(0.0, 25.0, h));
    fl += lmGlow * 0.55;
    lmE = diffuseColor.rgb * uFloodColor * (fl * uNight * uFloodI);
  `;
  const stoneMat = new THREE.MeshStandardMaterial({ color: stoneColor, map: lime.map, normalMap: lime.normalMap, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.86, metalness: 0, vertexColors: true });
  applyNightPatch(stoneMat, { uniforms: { uNight, uFloodColor, uFloodI }, colorGLSL: stoneColorGLSL, emissiveGLSL: floodGLSL, key: 'arc-stone' });
  const cofferMat = new THREE.MeshStandardMaterial({ color: stoneColor, map: cof.map, normalMap: cof.normalMap, normalScale: new THREE.Vector2(1.2, 1.2), roughness: 0.88, metalness: 0, vertexColors: true });
  applyNightPatch(cofferMat, { uniforms: { uNight, uFloodColor, uFloodI }, colorGLSL: stoneColorGLSL, emissiveGLSL: floodGLSL, key: 'arc-coffer' });
  const sculptMat = new THREE.MeshStandardMaterial({ color: stoneColor, map: carved.map, normalMap: carved.normalMap, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 0.88, metalness: 0, vertexColors: true });
  applyNightPatch(sculptMat, { uniforms: { uNight, uFloodColor, uFloodI }, colorGLSL: stoneColorGLSL, emissiveGLSL: floodGLSL, key: 'arc-sculpt' });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.42, metalness: 0.75, vertexColors: true });
  applyNightPatch(darkMat, { uniforms: { uNight, uFloodColor, uFloodI }, emissiveGLSL: 'lmE = diffuseColor.rgb * uFloodColor * uNight * 0.6;', key: 'arc-dark' });

  const group = new THREE.Group();
  group.name = 'ArcDeTriomphe';
  const mk = (mb: MeshBuilder, mat: THREE.Material, name: string): THREE.Mesh => {
    const mesh = new THREE.Mesh(mb.build(), mat);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  mk(stone, stoneMat, 'arc-stone');
  mk(coffer, cofferMat, 'arc-coffers');
  mk(sculpt, sculptMat, 'arc-sculpture');
  mk(dark, darkMat, 'arc-tomb');

  // ---------------------------------------------------------------- eternal flame
  const flameMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uIntensity: { value: 3 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uIntensity;
      varying vec2 vUv;
      float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float vn(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
      void main(){
        vec2 p = vUv;
        float t = uTime;
        float n = vn(vec2(p.x * 3.0, p.y * 2.5 - t * 3.2));
        float n2 = vn(vec2(p.x * 8.0 + 3.0, p.y * 6.0 - t * 6.5));
        float x = (p.x - 0.5) + (n - 0.5) * 0.32 * p.y + (n2 - 0.5) * 0.1 * p.y;
        float w = 0.27 * pow(max(1.0 - p.y, 0.0), 0.8) * (0.45 + 0.55 * smoothstep(0.0, 0.22, p.y));
        float m = smoothstep(w, w * 0.25, abs(x));
        m *= 1.0 - smoothstep(0.45 + 0.3 * n, 0.95, p.y);
        vec3 col = mix(vec3(1.0, 0.85, 0.5), vec3(1.0, 0.36, 0.05), smoothstep(0.05, 0.6, p.y));
        float core = smoothstep(w * 0.55, 0.0, abs(x)) * (1.0 - smoothstep(0.05, 0.45, p.y));
        col += vec3(0.5, 0.45, 0.35) * core;
        gl_FragColor = vec4(col * m * uIntensity, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const flameMB = new MeshBuilder();
  const fh = 0.85;
  const fw = 0.55;
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI;
    const dx = Math.cos(a) * fw * 0.5;
    const dz = Math.sin(a) * fw * 0.5;
    const c = V(0, Y0 + 0.12, TZ - 2.1);
    flameMB.quad(V(c.x - dx, c.y, c.z - dz), V(c.x + dx, c.y, c.z + dz), V(c.x + dx, c.y + fh, c.z + dz), V(c.x - dx, c.y + fh, c.z - dz), null, [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ]);
  }
  const flame = new THREE.Mesh(flameMB.build(), flameMat);
  flame.name = 'arc-flame';
  flame.renderOrder = 10;
  group.add(flame);

  // ---------------------------------------------------------------- colliders
  const colliders: LandmarkCollider[] = [];
  const pillarHX = (HX - RA) / 2;
  const pillarHZ = (HZ - RT) / 2;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      colliders.push({ kind: 'box', center: [sx * PIER_C, 15, sz * (RT + pillarHZ)], halfExtents: [pillarHX + 0.3, 15, pillarHZ + 0.3], rotationY: 0 });
    }
  }
  colliders.push({ kind: 'box', center: [0, 0.3, 0], halfExtents: [HX + 4.2, 0.3, HZ + 4.2], rotationY: 0 }); // platform steps
  colliders.push({ kind: 'box', center: [0, 0.75, 0], halfExtents: [HX, 0.75, HZ], rotationY: 0 }); // solid low block with the tomb
  colliders.push({ kind: 'box', center: [0, 40.45, 0], halfExtents: [HX + 1.4, 9.55, HZ + 1.4], rotationY: 0 }); // upper mass

  let lastNight = -1;
  return {
    object: group,
    colliders,
    update(_timeOfDay: number, night: number, elapsed: number): void {
      if (night !== lastNight) {
        uNight.value = smoothstep(0.15, 0.85, night);
        lastNight = night;
      }
      flameMat.uniforms.uTime.value = elapsed;
      flameMat.uniforms.uIntensity.value = 2.2 + 2.0 * night + 0.35 * Math.sin(elapsed * 17.0) * Math.sin(elapsed * 5.3);
    },
    dispose(): void {
      disposeObject(group);
    },
  };
}
