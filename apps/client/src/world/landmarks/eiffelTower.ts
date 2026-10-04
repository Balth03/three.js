import * as THREE from 'three';
import { MeshBuilder, applyNightPatch, disposeObject, mulberry32, smoothstep } from './common';
import { createGirderTexture, createLatticeAtlas } from './eiffelTextures';
import type { LatticeBand } from './eiffelTextures';
import type { Landmark, LandmarkCollider, LandmarkOptions } from './types';

/*
 * Eiffel Tower, Champ de Mars. Square base (legs' outer corners on a 124.9 m square), sides along local X/Z.
 * Profile: the outer edge follows an exponential-like curve; 1st floor 57.6 m, 2nd floor 115.7 m,
 * top (3rd floor) 276 m, campanile + antennas to 330 m.
 */

// ---------------------------------------------------------------- profile
/** Half-width of the outer faces at height y (legs' outer edges / shaft corners). */
export const eiffelOuter = (y: number): number => 58.95 * Math.exp(-y / 92.4) + 3.5;
/** Half-width of the inner opening between legs at height y (0 above the merge). */
export const eiffelInner = (y: number): number => Math.max(0, 49.8 * Math.exp(-y / 133.3) - 12.7);
const Y_MERGE = 133.3 * Math.log(49.8 / 12.7); // ≈ 182 m: the four legs join into a single shaft
const Y1 = 57.6;
const Y2 = 115.7;
const Y3 = 276.0;
const BEACON_Y = 292.2;

const V = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);

/** Splits [y0,y1] into cells whose height ≈ aspect × width(y). */
function cellBoundaries(y0: number, y1: number, width: (y: number) => number, aspect: number): number[] {
  const N = 400;
  const F = [0];
  for (let i = 1; i <= N; i++) {
    const ym = y0 + ((y1 - y0) * (i - 0.5)) / N;
    F.push(F[i - 1] + (y1 - y0) / N / (width(ym) * aspect));
  }
  const count = Math.max(1, Math.round(F[N]));
  const out = [y0];
  let j = 1;
  for (let k = 1; k < count; k++) {
    const target = (F[N] * k) / count;
    while (F[j] < target) j++;
    const t = (target - F[j - 1]) / (F[j] - F[j - 1]);
    out.push(y0 + ((y1 - y0) * (j - 1 + t)) / N);
  }
  out.push(y1);
  return out;
}

export function createEiffelTower(opts: LandmarkOptions = {}): Landmark {
  const high = (opts.quality ?? 'high') === 'high';
  const rnd = mulberry32(1889);

  const atlas = createLatticeAtlas(high ? 1024 : 512);
  const girderTex = createGirderTexture(high ? 64 : 32, high ? 256 : 128);

  // Builders
  const iron = new MeshBuilder();
  const lattice = new MeshBuilder();
  const glass = new MeshBuilder();
  // Eiffel Tower Brown (#6b5a45), darker at the bottom, lighter towards the top
  const brown = new THREE.Color().setRGB(107 / 255, 90 / 255, 69 / 255, THREE.SRGBColorSpace);
  const grad = (p: THREE.Vector3): number => 0.78 + 0.55 * smoothstep(0, 300, p.y);
  iron.setColor(brown);
  iron.colorFn = grad;
  lattice.setColor(brown);
  lattice.colorFn = grad;
  // plain (non-beam) iron parts sample the plain plate area of the girder texture
  iron.uvScale = 1e6;
  iron.uvOffset.set(0.9, 0.5);
  const beamUV = (w: number): { u0: number; u1: number; vPerM: number } => ({ u0: 0.01, u1: 0.74, vPerM: 1 / (w * 4) });

  // sparkle bulb positions are sampled on the lattice faces
  const sparkle: number[] = [];
  const sparkleSeed: number[] = [];
  const sparkleDensity = high ? 0.42 : 0.14; // bulbs per m² of face
  const addSparkles = (p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): void => {
    const area = p0.distanceTo(p1) * p1.distanceTo(p2);
    let n = area * sparkleDensity;
    const whole = Math.floor(n);
    n = whole + (rnd() < n - whole ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const u = rnd();
      const v = rnd();
      const a = p0.clone().lerp(p1, u);
      const b = p3.clone().lerp(p2, u);
      const p = a.lerp(b, v);
      // push slightly outward from the tower axis
      const r = Math.hypot(p.x, p.z) || 1;
      sparkle.push(p.x + (p.x / r) * 0.3, p.y, p.z + (p.z / r) * 0.3);
      sparkleSeed.push(rnd());
    }
  };

  /** Lattice face panel between two edge curves; adds X diagonals + struts as real geometry. */
  const latticeQuad = (p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, band: LatticeBand, u0: number, u1: number): void => {
    const [v0, v1] = atlas.band(band);
    lattice.quad(p0, p1, p2, p3, null, [
      [u0, v0],
      [u1, v0],
      [u1, v1],
      [u0, v1],
    ]);
  };

  const faceCell = (pa: THREE.Vector3, qa: THREE.Vector3, pb: THREE.Vector3, qb: THREE.Vector3, across: number, diag: boolean): void => {
    // pa,qa bottom edge (left->right), pb,qb top edge
    for (let j = 0; j < across; j++) {
      const t0 = j / across;
      const t1 = (j + 1) / across;
      const a0 = pa.clone().lerp(qa, t0);
      const a1 = pa.clone().lerp(qa, t1);
      const b0 = pb.clone().lerp(qb, t0);
      const b1 = pb.clone().lerp(qb, t1);
      latticeQuad(a0, a1, b1, b0, 'LEG', 0, 1);
      addSparkles(a0, a1, b1, b0);
      if (diag) {
        const cw = a0.distanceTo(a1);
        const dw = THREE.MathUtils.clamp(cw * 0.055, 0.3, 1.1);
        const n = new THREE.Vector3().subVectors(a1, a0).cross(new THREE.Vector3().subVectors(b0, a0)).normalize();
        iron.beam(a0, b1, dw, dw * 0.55, n, false, undefined, undefined, beamUV(dw));
        iron.beam(a1, b0, dw, dw * 0.55, n, false, undefined, undefined, beamUV(dw));
      }
    }
  };

  // ---------------------------------------------------------------- legs
  const legW = (y: number): number => eiffelOuter(y) - eiffelInner(y);
  const sections: { y0: number; y1: number; across: number; aspect: number }[] = [
    { y0: 0, y1: Y1, across: 2, aspect: 0.5 },
    { y0: Y1, y1: Y2, across: 1, aspect: 0.85 },
    { y0: Y2, y1: Y_MERGE, across: 1, aspect: 1.0 },
  ];
  const legBounds: number[] = [];
  for (const s of sections) {
    const b = cellBoundaries(s.y0, s.y1, legW, s.aspect);
    for (let k = 0; k < b.length - 1; k++) legBounds.push(b[k]);
  }
  legBounds.push(Y_MERGE);
  const acrossAt = (y: number): number => (y < Y1 - 0.01 ? 2 : 1);
  const girderT = (y: number): number => 0.55 + 2.0 * Math.exp(-y / 55);

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const corner = (y: number, k: number): THREE.Vector3 => {
        const i = eiffelInner(y);
        const w = eiffelOuter(y);
        // A inner, B (w,i), C outer, D (i,w)
        const xy = [
          [i, i],
          [w, i],
          [w, w],
          [i, w],
        ][k];
        return V(sx * xy[0], y, sz * xy[1]);
      };
      for (let c = 0; c < legBounds.length - 1; c++) {
        const ya = legBounds[c];
        const yb = legBounds[c + 1];
        const across = acrossAt((ya + yb) / 2);
        // faces: (A,B) inner-z, (B,C) outer-x, (C,D) outer-z, (D,A) inner-x
        for (let f = 0; f < 4; f++) {
          const k0 = f;
          const k1 = (f + 1) % 4;
          const inner = f === 0 || f === 3;
          // inner faces get fewer real diagonals (budget) but keep the lattice texture
          faceCell(corner(ya, k0), corner(ya, k1), corner(yb, k0), corner(yb, k1), across, high || !inner);
          // horizontal strut at the top of the cell
          const t = girderT(yb) * 0.55;
          const p = corner(yb, k0);
          const q = corner(yb, k1);
          iron.beam(p, q, t * 0.8, t * 0.6, V(0, 1, 0), false, undefined, undefined, beamUV(t));
        }
        // the 4 corner girders (two segments per cell for a smoother curve)
        for (let k = 0; k < 4; k++) {
          const ym = (ya + yb) / 2;
          const pts = [corner(ya, k), corner(ym, k), corner(yb, k)];
          for (let s = 0; s < 2; s++) {
            const t0 = girderT(pts[s].y);
            const t1 = girderT(pts[s + 1].y);
            iron.beam(pts[s], pts[s + 1], t0, t0, V(1, 0, 0), false, t1, t1, beamUV(t0));
          }
        }
      }
      // masonry piers under the 4 feet
      iron.setColor(new THREE.Color().setRGB(0.62, 0.58, 0.52, THREE.SRGBColorSpace));
      iron.colorFn = null;
      for (let k = 0; k < 4; k++) {
        const p = corner(0, k);
        iron.box(p.x - 2.6, 0, p.z - 2.6, p.x + 2.6, 1.6, p.z + 2.6, 0b111011);
        iron.box(p.x - 2.9, 0, p.z - 2.9, p.x + 2.9, 0.5, p.z + 2.9, 0b111011);
      }
      iron.setColor(brown);
      iron.colorFn = grad;
    }
  }

  // ---------------------------------------------------------------- shaft above the merge
  const shaftBounds = cellBoundaries(Y_MERGE, Y3 - 3, (y) => 2 * eiffelOuter(y), 1.05);
  for (let c = 0; c < shaftBounds.length - 1; c++) {
    const ya = shaftBounds[c];
    const yb = shaftBounds[c + 1];
    const cornerS = (y: number, k: number): THREE.Vector3 => {
      const w = eiffelOuter(y);
      const xy = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ][k];
      return V(xy[0] * w, y, xy[1] * w);
    };
    for (let f = 0; f < 4; f++) {
      const k0 = f;
      const k1 = (f + 1) % 4;
      faceCell(cornerS(ya, k0), cornerS(ya, k1), cornerS(yb, k0), cornerS(yb, k1), 1, true);
      const t = girderT(yb) * 0.6;
      iron.beam(cornerS(yb, k0), cornerS(yb, k1), t * 0.8, t * 0.6, V(0, 1, 0), false, undefined, undefined, beamUV(t));
    }
    for (let k = 0; k < 4; k++) {
      const ym = (ya + yb) / 2;
      const pts = [cornerS(ya, k), cornerS(ym, k), cornerS(yb, k)];
      for (let s = 0; s < 2; s++) {
        const t0 = girderT(pts[s].y) * 1.05;
        const t1 = girderT(pts[s + 1].y) * 1.05;
        iron.beam(pts[s], pts[s + 1], t0, t0, V(1, 0, 0), false, t1, t1, beamUV(t0));
      }
    }
  }
  // lift core (rails, cabins) seen through the shaft
  iron.box(-1.7, Y2, -1.7, 1.7, Y3 - 2, 1.7, 0b111100);

  // ---------------------------------------------------------------- the four decorative base arches
  const arcSegs = high ? 36 : 18;
  const YSPR = 14;
  const A = eiffelInner(YSPR);
  for (let f = 0; f < 4; f++) {
    const onFace = (x: number, y: number, inset: number): THREE.Vector3 => {
      const w = eiffelOuter(y) - inset;
      switch (f) {
        case 0:
          return V(x, y, w);
        case 1:
          return V(-x, y, -w);
        case 2:
          return V(w, y, -x);
        default:
          return V(-w, y, x);
      }
    };
    const intr = (th: number): THREE.Vector3 => onFace(A * Math.cos(th), YSPR + (37.6 - YSPR) * Math.sin(th), 0.6);
    const extr = (th: number): THREE.Vector3 => onFace(A * Math.cos(th), YSPR + 5.5 + (41.2 - YSPR - 5.5) * Math.sin(th), 0.6);
    let s = 0;
    for (let i = 0; i < arcSegs; i++) {
      const t0 = (Math.PI * i) / arcSegs;
      const t1 = (Math.PI * (i + 1)) / arcSegs;
      const a0 = intr(t0);
      const a1 = intr(t1);
      const b0 = extr(t0);
      const b1 = extr(t1);
      const ds = a0.distanceTo(a1);
      latticeQuad(a0, a1, b1, b0, 'ARCH', s / 15, (s + ds) / 15);
      addSparkles(a0, a1, b1, b0);
      s += ds;
      const nrm = new THREE.Vector3().subVectors(a1, a0).cross(new THREE.Vector3().subVectors(b0, a0)).normalize();
      iron.beam(a0, a1, 0.9, 1.0, nrm, false, undefined, undefined, beamUV(0.9));
      iron.beam(b0, b1, 0.8, 0.9, nrm, false, undefined, undefined, beamUV(0.8));
    }
  }

  // ---------------------------------------------------------------- 1st floor
  const O1 = eiffelOuter(Y1) + 0.4;
  const I1 = eiffelInner(Y1);
  const ring = (mb: MeshBuilder, outer: number, inner: number, y0: number, y1: number): void => {
    mb.box(-outer, y0, inner, outer, y1, outer);
    mb.box(-outer, y0, -outer, outer, y1, -inner);
    mb.box(inner, y0, -inner, outer, y1, inner);
    mb.box(-outer, y0, -inner, -inner, y1, inner);
  };
  /** Vertical lattice band all around at half-size r from y0 to y1. */
  const bandAround = (r: number, y0: number, y1: number, band: LatticeBand, tileLen: number, sparkles = false): void => {
    for (let f = 0; f < 4; f++) {
      const P = (t: number, y: number): THREE.Vector3 => {
        switch (f) {
          case 0:
            return V(t, y, r);
          case 1:
            return V(-t, y, -r);
          case 2:
            return V(r, y, -t);
          default:
            return V(-r, y, t);
        }
      };
      const len = 2 * r;
      latticeQuad(P(-r, y0), P(r, y0), P(r, y1), P(-r, y1), band, 0, len / tileLen);
      if (sparkles) addSparkles(P(-r, y0), P(r, y0), P(r, y1), P(-r, y1));
    }
  };
  iron.setColor(brown);
  ring(iron, O1, I1, 57.0, 57.8);
  bandAround(O1, 50.4, 57.0, 'TRUSS', 17, true);
  bandAround(I1 + 0.3, 52.2, 57.0, 'TRUSS', 17);
  ring(iron, O1 + 0.15, O1 - 0.6, 50.2, 50.8); // bottom chord
  bandAround(O1 + 0.25, 57.8, 62.1, 'GALLERY', 34, true);
  ring(iron, O1 + 0.8, O1 - 2.2, 62.1, 62.8); // gallery cornice
  ring(iron, O1 + 0.45, O1 - 1.2, 62.8, 63.2);
  // glass pavilions set back inside the gallery
  {
    const r = O1 - 2.0;
    for (let f = 0; f < 4; f++) {
      const n = [V(0, 0, 1), V(0, 0, -1), V(1, 0, 0), V(-1, 0, 0)][f];
      const u = [V(1, 0, 0), V(-1, 0, 0), V(0, 0, -1), V(0, 0, 1)][f];
      const half = r - 9; // pavilions stop short of the leg corners
      const c = n.clone().multiplyScalar(r);
      glass.quad(c.clone().addScaledVector(u, -half).setY(57.8), c.clone().addScaledVector(u, half).setY(57.8), c.clone().addScaledVector(u, half).setY(61.6), c.clone().addScaledVector(u, -half).setY(61.6), n);
    }
    ring(iron, O1 - 1.6, I1 + 3, 61.6, 62.1);
  }

  // ---------------------------------------------------------------- 2nd floor
  const O2 = eiffelOuter(Y2) + 0.35;
  iron.box(-O2, 115.1, -O2, O2, 116.0, O2);
  bandAround(O2, 112.3, 115.1, 'TRUSS', 12, true);
  bandAround(O2 + 0.2, 116.0, 117.7, 'RAIL', 12);
  iron.box(-O2 - 0.3, 117.7, -O2 - 0.3, O2 + 0.3, 118.0, O2 + 0.3, 0b111111);
  {
    const r = 12.5;
    for (let f = 0; f < 4; f++) {
      const n = [V(0, 0, 1), V(0, 0, -1), V(1, 0, 0), V(-1, 0, 0)][f];
      const u = [V(1, 0, 0), V(-1, 0, 0), V(0, 0, -1), V(0, 0, 1)][f];
      const c = n.clone().multiplyScalar(r);
      glass.quad(c.clone().addScaledVector(u, -r).setY(116), c.clone().addScaledVector(u, r).setY(116), c.clone().addScaledVector(u, r).setY(120.6), c.clone().addScaledVector(u, -r).setY(120.6), n);
    }
    iron.box(-r - 0.6, 120.6, -r - 0.6, r + 0.6, 121.3, r + 0.6);
    iron.box(-5, 121.3, -5, 5, 124.5, 5); // lift machinery house
  }

  // ---------------------------------------------------------------- intermediate platform where the legs merge
  {
    const r = eiffelOuter(Y_MERGE) + 0.3;
    iron.box(-r, Y_MERGE - 0.4, -r, r, Y_MERGE + 0.3, r);
    bandAround(r + 0.15, Y_MERGE + 0.3, Y_MERGE + 1.6, 'RAIL', 10);
  }

  // ---------------------------------------------------------------- summit: 3rd floor, campanile, antennas
  {
    const r = 8.25;
    iron.box(-r - 0.3, Y3 - 3.0, -r - 0.3, r + 0.3, Y3 - 2.4, r + 0.3);
    for (let f = 0; f < 4; f++) {
      const n = [V(0, 0, 1), V(0, 0, -1), V(1, 0, 0), V(-1, 0, 0)][f];
      const u = [V(1, 0, 0), V(-1, 0, 0), V(0, 0, -1), V(0, 0, 1)][f];
      const c = n.clone().multiplyScalar(r - 0.4);
      glass.quad(c.clone().addScaledVector(u, -(r - 0.4)).setY(Y3 - 2.4), c.clone().addScaledVector(u, r - 0.4).setY(Y3 - 2.4), c.clone().addScaledVector(u, r - 0.4).setY(Y3 + 3.0), c.clone().addScaledVector(u, -(r - 0.4)).setY(Y3 + 3.0), n);
    }
    iron.box(-r - 0.5, Y3 + 3.0, -r - 0.5, r + 0.5, Y3 + 3.7, r + 0.5);
    bandAround(r + 0.3, Y3 + 3.7, Y3 + 5.3, 'RAIL', 8);
    // corner posts of the upper gallery
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) iron.box(sx * r - 0.3, Y3 + 3.7, sz * r - 0.3, sx * r + 0.3, Y3 + 5.5, sz * r + 0.3, 0b111011);
    // campanile: four curved lattice arches rising from the deck corners to the lantern
    const segs = high ? 10 : 6;
    const base = Y3 + 3.7;
    const top = 290.4;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        let prev: THREE.Vector3 | null = null;
        for (let i = 0; i <= segs; i++) {
          const t = i / segs;
          const rr = THREE.MathUtils.lerp(r - 0.8, 2.0, t) + Math.sin(t * Math.PI) * 1.6;
          const y = THREE.MathUtils.lerp(base, top, Math.pow(t, 0.9));
          const p = V(sx * rr, y, sz * rr);
          if (prev) iron.beam(prev, p, 0.75, 0.75, V(sx, 0, -sz), false, undefined, undefined, beamUV(0.75));
          prev = p;
        }
      }
    }
    // ring girders of the campanile
    for (const [y, rr] of [
      [base + 4.5, 7.6],
      [base + 9.0, 5.0],
    ]) {
      for (let f = 0; f < 4; f++) {
        const a = [V(-rr, y, rr), V(rr, y, rr), V(rr, y, -rr), V(-rr, y, -rr)];
        iron.beam(a[f], a[(f + 1) % 4], 0.5, 0.4, V(0, 1, 0), false, undefined, undefined, beamUV(0.5));
      }
    }
    // lantern (lighthouse) + dome
    const lanternGlass = new THREE.CylinderGeometry(2.0, 2.0, 2.8, 12, 1, true);
    glass.addGeometry(lanternGlass, new THREE.Matrix4().makeTranslation(0, BEACON_Y, 0));
    lanternGlass.dispose();
    iron.box(-2.6, top - 0.3, -2.6, 2.6, top + 0.4, 2.6);
    const dome = new THREE.CylinderGeometry(0.9, 2.5, 2.4, 12, 1, false);
    iron.addGeometry(dome, new THREE.Matrix4().makeTranslation(0, BEACON_Y + 2.6, 0));
    dome.dispose();
    // antenna mast (red/white bands) to 330 m
    const mastSegs: [number, number, number, number][] = [];
    let y = BEACON_Y + 3.8;
    let k = 0;
    while (y < 312) {
      mastSegs.push([y, y + 2.2, THREE.MathUtils.lerp(0.95, 0.6, (y - 296) / 16), k++]);
      y += 2.2;
    }
    while (y < 324) {
      mastSegs.push([y, y + 2.0, THREE.MathUtils.lerp(0.45, 0.28, (y - 312) / 12), k++]);
      y += 2.0;
    }
    const red = new THREE.Color().setRGB(0.62, 0.12, 0.08, THREE.SRGBColorSpace);
    const white = new THREE.Color().setRGB(0.86, 0.86, 0.84, THREE.SRGBColorSpace);
    iron.colorFn = null;
    for (const [y0, y1, rr, idx] of mastSegs) {
      iron.setColor(idx % 2 ? red : white);
      const g = new THREE.CylinderGeometry(rr * 0.95, rr, y1 - y0, 8, 1, true);
      iron.addGeometry(g, new THREE.Matrix4().makeTranslation(0, (y0 + y1) / 2, 0));
      g.dispose();
    }
    iron.setColor(white);
    const tip = new THREE.CylinderGeometry(0.06, 0.16, 6, 6, 1, true);
    iron.addGeometry(tip, new THREE.Matrix4().makeTranslation(0, 327, 0));
    tip.dispose();
    // cross arms
    for (const ya of [300.5, 306.5]) {
      iron.box(-2.2, ya, -0.12, 2.2, ya + 0.25, 0.12);
      iron.box(-0.12, ya, -2.2, 0.12, ya + 0.25, 2.2);
    }
    iron.setColor(brown);
    iron.colorFn = grad;
  }

  // ---------------------------------------------------------------- materials
  const uNight = { value: 0 };
  const uGold = { value: new THREE.Color(1.0, 0.5, 0.16) };
  const uGoldI = { value: 2.4 };
  const uWarm = { value: new THREE.Color(1.0, 0.72, 0.42) };
  const goldGLSL = /* glsl */ `
    float hgt = lmPos.y;
    float var = 0.82 + 0.3 * lmNoise(lmPos * 0.08);
    float fl = var * mix(1.1, 0.95, smoothstep(0.0, 280.0, hgt));
    float mast = step(294.0, hgt);
    lmE = uGold * (fl * uNight * uGoldI * (1.0 - mast));
  `;
  const ironMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: girderTex, roughness: 0.62, metalness: 0.3, vertexColors: true });
  applyNightPatch(ironMat, { uniforms: { uNight, uGold, uGoldI }, emissiveGLSL: goldGLSL, key: 'eiffel-iron' });
  const latticeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: atlas.texture,
    alphaTest: 0.5,
    alphaToCoverage: true,
    side: THREE.DoubleSide,
    roughness: 0.65,
    metalness: 0.3,
    vertexColors: true,
  });
  applyNightPatch(latticeMat, { uniforms: { uNight, uGold, uGoldI }, emissiveGLSL: goldGLSL, key: 'eiffel-lattice' });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x2b3238, roughness: 0.12, metalness: 0.8, vertexColors: false, side: THREE.DoubleSide });
  applyNightPatch(glassMat, {
    uniforms: { uNight, uWarm },
    colorGLSL: `
      float mull = max(step(0.9, fract((lmPos.x + lmPos.z) / 2.4)), step(0.86, fract(lmPos.y / 1.9)));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.08, 0.06, 0.045), mull);
    `,
    emissiveGLSL: `
      float mull = max(step(0.9, fract((lmPos.x + lmPos.z) / 2.4)), step(0.86, fract(lmPos.y / 1.9)));
      float cell = lmHash(floor(vec3((lmPos.x + lmPos.z) / 2.4, lmPos.y / 1.9, 0.0)));
      lmE = uWarm * uNight * (1.0 - mull) * (0.8 + 1.4 * step(0.25, cell));
    `,
    key: 'eiffel-glass',
  });

  const group = new THREE.Group();
  group.name = 'EiffelTower';
  const ironMesh = new THREE.Mesh(iron.build(), ironMat);
  ironMesh.name = 'eiffel-iron';
  const latticeMesh = new THREE.Mesh(lattice.build(), latticeMat);
  latticeMesh.name = 'eiffel-lattice';
  const glassMesh = new THREE.Mesh(glass.build(), glassMat);
  glassMesh.name = 'eiffel-glass';
  for (const m of [ironMesh, latticeMesh, glassMesh]) {
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  }

  // ---------------------------------------------------------------- sparkle (scintillement)
  const screen = new THREE.Vector2();
  const uScreenScale = { value: 800 };
  const updateScreen = (renderer: THREE.WebGLRenderer, camera: THREE.Camera): void => {
    renderer.getDrawingBufferSize(screen);
    const pm = (camera as THREE.PerspectiveCamera).projectionMatrix;
    uScreenScale.value = screen.y * pm.elements[5] * 0.5;
  };
  const sparkleGeo = new THREE.BufferGeometry();
  sparkleGeo.setAttribute('position', new THREE.Float32BufferAttribute(sparkle, 3));
  sparkleGeo.setAttribute('aSeed', new THREE.Float32BufferAttribute(sparkleSeed, 1));
  sparkleGeo.computeBoundingSphere();
  const sparkleMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOn: { value: 0 }, uScreenScale, uSize: { value: 1.6 } },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime; uniform float uOn; uniform float uScreenScale; uniform float uSize;
      varying float vI;
      float h11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
      void main(){
        float rate = 2.2 + aSeed * 2.0;
        float t = uTime * rate + aSeed * 61.7;
        float cell = floor(t);
        float f = fract(t);
        float on = step(0.7, h11(cell * 1.37 + aSeed * 913.1));
        vI = on * exp(-f * 7.0) * uOn;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float px = uSize * uScreenScale / max(-mv.z, 1.0);
        gl_PointSize = vI > 0.01 ? clamp(px, 2.0, 28.0) : 0.0;
        if (vI <= 0.01) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      varying float vI;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        a = a * a * (0.6 + 0.4 * smoothstep(0.2, 0.0, d));
        gl_FragColor = vec4(vec3(1.0, 0.97, 0.92) * vI * a * 9.0, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sparklePoints = new THREE.Points(sparkleGeo, sparkleMat);
  sparklePoints.name = 'eiffel-sparkle';
  sparklePoints.frustumCulled = false;
  sparklePoints.visible = false;
  sparklePoints.renderOrder = 20;
  sparklePoints.onBeforeRender = (renderer, _scene, camera) => updateScreen(renderer, camera);
  group.add(sparklePoints);

  // ---------------------------------------------------------------- beacon: two rotating beams
  const BEAM_LEN = high ? 1800 : 1200;
  const beamGeo = (() => {
    const g1 = new THREE.CylinderGeometry(42, 0.5, BEAM_LEN, high ? 28 : 16, 1, true);
    g1.translate(0, BEAM_LEN / 2, 0);
    g1.rotateZ(-Math.PI / 2 + 0.02);
    const g2 = g1.clone();
    g2.rotateY(Math.PI);
    const mb = new MeshBuilder();
    mb.addGeometry(g1, null, true);
    mb.addGeometry(g2, null, true);
    g1.dispose();
    g2.dispose();
    return mb.build();
  })();
  const beamMat = new THREE.ShaderMaterial({
    uniforms: { uOn: { value: 0 }, uLen: { value: BEAM_LEN }, uColor: { value: new THREE.Color(1.0, 0.93, 0.8).multiplyScalar(0.5) } },
    vertexShader: /* glsl */ `
      uniform float uLen;
      varying float vAlong; varying vec3 vN; varying vec3 vV;
      void main(){
        vAlong = length(position) / uLen;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOn; uniform vec3 uColor;
      varying float vAlong; varying vec3 vN; varying vec3 vV;
      void main(){
        float e = abs(dot(normalize(vN), normalize(vV)));
        e = pow(e, 2.2);
        float a = clamp(vAlong, 0.0, 1.0);
        float fall = pow(1.0 - a, 2.4) * smoothstep(0.0, 0.004, a);
        float core = 1.0 + 6.0 * exp(-a * 60.0);
        gl_FragColor = vec4(uColor * e * fall * core * uOn, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const beams = new THREE.Mesh(beamGeo, beamMat);
  beams.name = 'eiffel-beacon';
  beams.position.set(0, BEACON_Y, 0);
  beams.frustumCulled = false;
  beams.visible = false;
  beams.renderOrder = 21;
  group.add(beams);

  // ---------------------------------------------------------------- lamps: beacon core + aviation lights
  const lampPos: number[] = [];
  const lampCol: number[] = [];
  const lampSize: number[] = [];
  const lampBlink: number[] = [];
  const addLamp = (p: THREE.Vector3, c: THREE.Color, size: number, blink: number): void => {
    lampPos.push(p.x, p.y, p.z);
    lampCol.push(c.r, c.g, c.b);
    lampSize.push(size);
    lampBlink.push(blink);
  };
  addLamp(V(0, BEACON_Y, 0), new THREE.Color(1.0, 0.95, 0.85).multiplyScalar(4), 6, 0);
  const aviation = new THREE.Color(1.0, 0.05, 0.02).multiplyScalar(5);
  addLamp(V(0, 330.2, 0), aviation, 1.6, 1);
  for (const ya of [306.8, 300.8]) for (const [dx, dz] of [[2.2, 0], [-2.2, 0], [0, 2.2], [0, -2.2]]) addLamp(V(dx, ya + 0.4, dz), aviation, 1.0, 1);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) addLamp(V(sx * 8.6, Y3 + 5.8, sz * 8.6), aviation, 1.0, 0);
  const lampGeo = new THREE.BufferGeometry();
  lampGeo.setAttribute('position', new THREE.Float32BufferAttribute(lampPos, 3));
  lampGeo.setAttribute('color', new THREE.Float32BufferAttribute(lampCol, 3));
  lampGeo.setAttribute('aSize', new THREE.Float32BufferAttribute(lampSize, 1));
  lampGeo.setAttribute('aBlink', new THREE.Float32BufferAttribute(lampBlink, 1));
  const lampMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOn: { value: 0 }, uScreenScale },
    vertexShader: /* glsl */ `
      attribute vec3 color; attribute float aSize; attribute float aBlink;
      uniform float uTime; uniform float uOn; uniform float uScreenScale;
      varying vec3 vC;
      void main(){
        float b = aBlink > 0.5 ? smoothstep(0.2, 0.0, abs(fract(uTime * 0.5) - 0.5) - 0.3) : 1.0;
        vC = color * uOn * b;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = clamp(aSize * uScreenScale / max(-mv.z, 1.0), 2.5, 64.0);
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vC;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d); a *= a;
        gl_FragColor = vec4(vC * a, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const lamps = new THREE.Points(lampGeo, lampMat);
  lamps.name = 'eiffel-lamps';
  lamps.frustumCulled = false;
  lamps.visible = false;
  lamps.renderOrder = 22;
  lamps.onBeforeRender = (renderer, _scene, camera) => updateScreen(renderer, camera);
  group.add(lamps);

  // ---------------------------------------------------------------- colliders: the 4 leg bases (cars drive between them)
  const colliders: LandmarkCollider[] = [];
  const o0 = eiffelOuter(0);
  const i0 = eiffelInner(0) - 1.5;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      colliders.push({ kind: 'box', center: [sx * (o0 + i0) / 2, 5, sz * (o0 + i0) / 2], halfExtents: [(o0 - i0) / 2 + 2.9, 5, (o0 - i0) / 2 + 2.9], rotationY: 0 });
    }
  }

  return {
    object: group,
    colliders,
    update(timeOfDay: number, night: number, elapsed: number): void {
      const lit = smoothstep(0.2, 0.75, night);
      uNight.value = lit;
      const minute = (((timeOfDay % 1) + 1) % 1) * 60;
      // sparkle: first 5 minutes of each hour after dark
      const sparkleOn = night > 0.45 ? smoothstep(0, 0.15, minute) * (1 - smoothstep(4.85, 5.0, minute)) : 0;
      sparkleMat.uniforms.uOn.value = sparkleOn;
      sparkleMat.uniforms.uTime.value = elapsed;
      sparklePoints.visible = sparkleOn > 0.001;
      const beaconOn = smoothstep(0.4, 0.8, night);
      beamMat.uniforms.uOn.value = beaconOn;
      beams.visible = beaconOn > 0.001;
      beams.rotation.y = (elapsed / 24) * Math.PI * 2; // one revolution every ~24 s
      lampMat.uniforms.uOn.value = beaconOn;
      lampMat.uniforms.uTime.value = elapsed;
      lamps.visible = beaconOn > 0.001;
    },
    dispose(): void {
      disposeObject(group, [atlas.texture, girderTex]);
    },
  };
}
