import * as THREE from 'three';
import type { MeshBuilder } from './common';

export type EdgeTag = 'skip' | string;

export interface ProfilePoint {
  a: number;
  b: number;
  /** Optional smooth 2D normal at this point (used when both ends of an edge have one). */
  n?: [number, number];
  /** Tag of the edge starting at this point. */
  tag: EdgeTag;
}

export interface EdgeTarget {
  mb: MeshBuilder;
  glow?: number;
  /** Explicit UV from cumulative profile length s (m) and extrusion coordinate w (m). */
  uv?: (s: number, w: number) => [number, number];
}

export interface ExtrudeOptions {
  /** Maps (a, b, w) profile/extrusion coordinates to 3D. */
  map: (a: number, b: number, w: number) => THREE.Vector3;
  /** Maps a 2D profile normal to a 3D normal. */
  mapN: (na: number, nb: number) => THREE.Vector3;
  /** 3D direction of increasing w. */
  wAxis: THREE.Vector3;
  w0: number;
  w1: number;
  edges: Record<string, EdgeTarget>;
  capStart?: EdgeTarget | null;
  capEnd?: EdgeTarget | null;
}

/** Extrudes a closed 2D profile (counter-clockwise in a/b) between w0 and w1. */
export function extrudeProfile(pts: ProfilePoint[], o: ExtrudeOptions): void {
  const n = pts.length;
  // cumulative lengths
  const s: number[] = [0];
  for (let i = 1; i <= n; i++) {
    const p = pts[i - 1];
    const q = pts[i % n];
    s.push(s[i - 1] + Math.hypot(q.a - p.a, q.b - p.b));
  }
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    if (p.tag === 'skip') continue;
    const tgt = o.edges[p.tag];
    if (!tgt) continue;
    const q = pts[(i + 1) % n];
    const A = o.map(p.a, p.b, o.w0);
    const B = o.map(q.a, q.b, o.w0);
    const C = o.map(q.a, q.b, o.w1);
    const D = o.map(p.a, p.b, o.w1);
    const prevGlow = tgt.mb.glow;
    tgt.mb.glow = tgt.glow ?? prevGlow;
    let uv: number[][] | null = null;
    if (tgt.uv) {
      uv = [tgt.uv(s[i], o.w0), tgt.uv(s[i + 1], o.w0), tgt.uv(s[i + 1], o.w1), tgt.uv(s[i], o.w1)];
    }
    if (p.n && q.n) {
      const np = o.mapN(p.n[0], p.n[1]).normalize();
      const nq = o.mapN(q.n[0], q.n[1]).normalize();
      tgt.mb.quad(A, B, C, D, null, uv, [np, nq, nq, np]);
    } else {
      const da = q.a - p.a;
      const db = q.b - p.b;
      const nn = o.mapN(db, -da).normalize();
      tgt.mb.quad(A, B, C, D, nn, uv);
    }
    tgt.mb.glow = prevGlow;
  }
  const contour = pts.map((p) => new THREE.Vector2(p.a, p.b));
  const faces = THREE.ShapeUtils.triangulateShape(contour, []);
  const cap = (t: EdgeTarget | null | undefined, w: number, nrm: THREE.Vector3): void => {
    if (!t) return;
    const prevGlow = t.mb.glow;
    t.mb.glow = t.glow ?? prevGlow;
    for (const f of faces) {
      const a = o.map(pts[f[0]].a, pts[f[0]].b, w);
      const b = o.map(pts[f[1]].a, pts[f[1]].b, w);
      const c = o.map(pts[f[2]].a, pts[f[2]].b, w);
      t.mb.tri(a, b, c, nrm, nrm, nrm);
    }
    t.mb.glow = prevGlow;
  };
  cap(o.capStart, o.w0, o.wAxis.clone().negate());
  cap(o.capEnd, o.w1, o.wAxis.clone());
}

/** Annular sector (arch ring) lying in a plane, extruded along `normal` by depth. */
export function archRing(
  mb: MeshBuilder,
  centre: THREE.Vector3,
  uAxis: THREE.Vector3,
  vAxis: THREE.Vector3,
  normal: THREE.Vector3,
  r0: number,
  r1: number,
  depth: number,
  segments: number,
  a0 = 0,
  a1 = Math.PI,
): void {
  const P = (r: number, ang: number, d: number): THREE.Vector3 =>
    centre.clone().addScaledVector(uAxis, Math.cos(ang) * r).addScaledVector(vAxis, Math.sin(ang) * r).addScaledVector(normal, d);
  for (let i = 0; i < segments; i++) {
    const t0 = a0 + ((a1 - a0) * i) / segments;
    const t1 = a0 + ((a1 - a0) * (i + 1)) / segments;
    // front face
    mb.quad(P(r0, t0, depth), P(r1, t0, depth), P(r1, t1, depth), P(r0, t1, depth), normal);
    // outer (extrados) face
    const no0 = uAxis.clone().multiplyScalar(Math.cos(t0)).addScaledVector(vAxis, Math.sin(t0));
    const no1 = uAxis.clone().multiplyScalar(Math.cos(t1)).addScaledVector(vAxis, Math.sin(t1));
    mb.quad(P(r1, t0, 0), P(r1, t1, 0), P(r1, t1, depth), P(r1, t0, depth), null, null, [no0, no1, no1, no0]);
    // inner (intrados) face
    const ni0 = no0.clone().negate();
    const ni1 = no1.clone().negate();
    mb.quad(P(r0, t0, 0), P(r0, t0, depth), P(r0, t1, depth), P(r0, t1, 0), null, null, [ni0, ni0, ni1, ni1]);
  }
  // end caps at springings (facing down if the ring ends horizontal)
  const capN0 = vAxis.clone().negate();
  if (Math.abs(Math.sin(a0)) < 1e-3) mb.quad(P(r0, a0, 0), P(r1, a0, 0), P(r1, a0, depth), P(r0, a0, depth), capN0);
  if (Math.abs(Math.sin(a1)) < 1e-3) mb.quad(P(r0, a1, 0), P(r1, a1, 0), P(r1, a1, depth), P(r0, a1, depth), capN0);
}
