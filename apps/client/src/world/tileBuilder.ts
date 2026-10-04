/**
 * Builds all geometry / instance / physics data for one 256 m city tile. Runs in a Web Worker (no three.js).
 * Positions are tile-local in x/z (relative to the tile origin) and absolute in y.
 */
import earcut from 'earcut';
import { MeshBuilder, FloatBuf, type GeoData } from './geoBuilder';
import { RoadGraph } from './RoadGraph';
import type { Terrain } from './Terrain';
import type { RawTile } from './types';
import { hash01, hash2 } from '@taxi/shared';
import { signalAxis, signalOffset } from './signals';

export interface TileStyle {
  city: string;
  style: 'haussmann' | 'manhattan' | 'tokyo' | 'london' | 'generic';
  waterLevel: number;
  tileSize: number;
  groundCells: number;
  drivingSide: 'right' | 'left';
}

export interface TileBuildResult {
  i: number; j: number; ox: number; oz: number;
  meshes: Record<string, GeoData | null>;
  groundMask: ImageBitmap | null;
  roadMask: Uint8Array; // 256x256, 255 = carriageway
  instances: Record<string, Float32Array>; // per kind: [x,y,z,rotY,scale,variant] (tile-local x/z)
  lights: Float32Array; // [x,y,z,kind] world? tile-local x/z
  physics: {
    heights: Float32Array; // 33x33 absolute heights (with lowered river bed)
    wallPos: Float32Array; wallIdx: Uint32Array;
    boxes: Float32Array; // [cx,cy,cz,hx,hy,hz,rotY] tile-local
    cylinders: Float32Array; // [x,y,z,radius,halfHeight,kind]
  };
  stats: { buildings: number; tris: number };
}

const CURB_H = 0.14;
const ROAD_Y = 0.03;

// --------------------------------------------------------------------------------------------- helpers
function ringFromDm(flat: number[]): Float64Array {
  const r = new Float64Array(flat.length);
  for (let i = 0; i < flat.length; i++) r[i] = flat[i] / 10;
  return r;
}
function signedArea(r: ArrayLike<number>): number {
  let a = 0;
  const n = r.length / 2;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    a += r[i * 2] * r[j * 2 + 1] - r[j * 2] * r[i * 2 + 1];
  }
  return a / 2;
}
/** Inward offset of a simple polygon ring (miter). Returns null when the result is degenerate. */
function insetRing(r: Float64Array, d: number): Float64Array | null {
  const n = r.length / 2;
  const area = signedArea(r);
  const s = area > 0 ? 1 : -1; // inward normal of edge (dx,dz) = s*(-dz, dx)
  const out = new Float64Array(r.length);
  for (let i = 0; i < n; i++) {
    const p = (i + n - 1) % n, q = (i + 1) % n;
    let ax = r[i * 2] - r[p * 2], az = r[i * 2 + 1] - r[p * 2 + 1];
    let bx = r[q * 2] - r[i * 2], bz = r[q * 2 + 1] - r[i * 2 + 1];
    const la = Math.hypot(ax, az) || 1, lb = Math.hypot(bx, bz) || 1;
    ax /= la; az /= la; bx /= lb; bz /= lb;
    const n1x = -az * s, n1z = ax * s, n2x = -bz * s, n2z = bx * s;
    let mx = n1x + n2x, mz = n1z + n2z;
    const ml = Math.hypot(mx, mz);
    if (ml < 1e-6) { mx = n1x; mz = n1z; } else { mx /= ml; mz /= ml; }
    const cosHalf = mx * n1x + mz * n1z;
    const k = d / Math.max(0.35, cosHalf);
    out[i * 2] = r[i * 2] + mx * k; out[i * 2 + 1] = r[i * 2 + 1] + mz * k;
  }
  // validity: edges keep direction & area shrinks reasonably
  for (let i = 0; i < n; i++) {
    const q = (i + 1) % n;
    const ox = r[q * 2] - r[i * 2], oz = r[q * 2 + 1] - r[i * 2 + 1];
    const nx = out[q * 2] - out[i * 2], nz = out[q * 2 + 1] - out[i * 2 + 1];
    if (ox * nx + oz * nz <= 0) return null;
  }
  const a2 = signedArea(out);
  if (Math.sign(a2) !== Math.sign(area) || Math.abs(a2) < Math.abs(area) * 0.15) return null;
  return out;
}

export class TileBuilder {
  constructor(readonly graph: RoadGraph, readonly terrain: Terrain, readonly style: TileStyle) {}

  build(t: RawTile, waterHeightsOverride?: unknown): TileBuildResult {
    void waterHeightsOverride;
    const S = this.style.tileSize;
    const ox = t.i * S, oz = t.j * S;
    const T = this.terrain;
    const H = (lx: number, lz: number) => T.height(lx + ox, lz + oz);
    const meshes: Record<string, GeoData | null> = {};
    const instances: Record<string, Float32Array> = {};
    const physBoxes = new FloatBuf(64);
    const physCyl = new FloatBuf(256);
    const lights = new FloatBuf(256);
    const g = this.graph, d = g.d;

    // ---------------------------------------------------------------- water polygons (for ground cut + quays)
    const waterPolys: Array<{ outer: Float64Array; holes: Float64Array[]; kind: number }> = (t.w ?? []).map(([o, hs, k]) => ({ outer: ringFromDm(o), holes: hs.map(ringFromDm), kind: k }));
    const inWater = (x: number, z: number, kind = -1): boolean => {
      for (const w of waterPolys) {
        if (kind >= 0 && w.kind !== kind) continue;
        if (pointInRing(w.outer, x, z) && !w.holes.some((h) => pointInRing(h, x, z))) return true;
      }
      return false;
    };

    // ---------------------------------------------------------------- ground
    const N = this.style.groundCells;
    const cs = S / N;
    const fullWater = new Set(t.gx ?? []);
    const partial = new Map<number, number[]>();
    for (const [c, tris] of t.gp ?? []) partial.set(c, tris);
    {
      const mb = new MeshBuilder();
      const vid = new Int32Array((N + 1) * (N + 1)).fill(-1);
      const nrm = { x: 0, y: 1, z: 0 };
      const getV = (ix: number, iz: number) => {
        const k = iz * (N + 1) + ix;
        if (vid[k] < 0) {
          const x = ix * cs, z = iz * cs;
          T.normal(x + ox, z + oz, nrm);
          vid[k] = mb.v(x, H(x, z), z, nrm.x, nrm.y, nrm.z);
        }
        return vid[k];
      };
      for (let iz = 0; iz < N; iz++) {
        for (let ix = 0; ix < N; ix++) {
          const c = iz * N + ix;
          if (fullWater.has(c)) continue;
          const p = partial.get(c);
          if (p) {
            for (let k = 0; k < p.length; k += 6) {
              const ids: number[] = [];
              for (let q = 0; q < 3; q++) {
                const x = p[k + q * 2] / 10, z = p[k + q * 2 + 1] / 10;
                T.normal(x + ox, z + oz, nrm);
                ids.push(mb.v(x, H(x, z), z, nrm.x, nrm.y, nrm.z));
              }
              mb.triFacing(ids[0], ids[1], ids[2], 0, 1, 0);
            }
            continue;
          }
          const a = getV(ix, iz), b = getV(ix + 1, iz), cc = getV(ix, iz + 1), dd = getV(ix + 1, iz + 1);
          mb.triFacing(a, cc, b, 0, 1, 0);
          mb.triFacing(b, cc, dd, 0, 1, 0);
        }
      }
      meshes.ground = mb.build();
    }

    // ---------------------------------------------------------------- buildings
    const walls = new MeshBuilder({ aFac: 4, aFac2: 4 });
    const roofs = new MeshBuilder({ aRoof: 4 });
    const wallPhys = new MeshBuilder();
    let nb = 0;
    const style = this.style.style;
    for (const b of t.b ?? []) {
      const ring = ringFromDm(b[0]);
      const n = ring.length / 2;
      if (n < 3) continue;
      const hTot = b[1] / 10, minH = b[2] / 10, cls = b[4], roof = b[5], seed = b[6];
      const baseMin = b[7] / 10, baseMax = b[8] / 10;
      const holes = (b[9] ?? []).map(ringFromDm);
      const seed01 = hash01(seed);
      const street = baseMax;
      const isLandmarkish = cls === 7 || cls === 13 || cls === 15;
      const tall = hTot > 38;
      const hauss = style === 'haussmann' && hTot >= 10.5 && !tall && !isLandmarkish && holes.length === 0 && (roof === 0 || roof === 1 || roof === 4) && (cls <= 5 || cls === 14);
      let roofH = 0;
      if (hauss) roofH = Math.min(5.8, Math.max(2.8, hTot * (0.17 + seed01 * 0.06)));
      const top = street + hTot;
      const cornice = top - roofH;
      const bottom = minH > 0.5 ? street + minH : baseMin - 0.6;
      const wallKind = tall ? 2 : hauss ? 1 : cls === 7 ? 3 : cls === 9 || cls === 10 || cls === 11 ? 4 : 0;
      // walls of outer ring and holes
      const addRingWalls = (r: Float64Array, isHole: boolean) => {
        const m = r.length / 2;
        const area = signedArea(r);
        const outSign = (area > 0 ? 1 : -1) * (isHole ? -1 : 1);
        let u = 0;
        for (let k = 0; k < m; k++) {
          const q = (k + 1) % m;
          const x0 = r[k * 2], z0 = r[k * 2 + 1], x1 = r[q * 2], z1 = r[q * 2 + 1];
          const dx = x1 - x0, dz = z1 - z0;
          const L = Math.hypot(dx, dz);
          if (L < 0.05) continue;
          // outward normal for CCW (area>0, x/z as math x/y): (dz, -dx)
          const nx = (dz / L) * outSign, nz = (-dx / L) * outSign;
          const g0 = H(x0, z0), g1 = H(x1, z1);
          const a = walls.v(x0, bottom, z0, nx, 0, nz, 0, bottom - g0, L, cornice - g0, seed01, cls, wallKind, hTot);
          const bb = walls.v(x1, bottom, z1, nx, 0, nz, L, bottom - g1, L, cornice - g1, seed01, cls, wallKind, hTot);
          const c = walls.v(x1, cornice, z1, nx, 0, nz, L, cornice - g1, L, cornice - g1, seed01, cls, wallKind, hTot);
          const dd = walls.v(x0, cornice, z0, nx, 0, nz, 0, cornice - g0, L, cornice - g0, seed01, cls, wallKind, hTot);
          walls.quadFacing(a, bb, c, dd, nx, 0, nz);
          if (!isHole) {
            const pa = wallPhys.v(x0, bottom, z0, nx, 0, nz), pb = wallPhys.v(x1, bottom, z1, nx, 0, nz);
            const ph = Math.min(cornice, Math.max(street + 10, bottom + 4));
            const pc = wallPhys.v(x1, ph, z1, nx, 0, nz), pd = wallPhys.v(x0, ph, z0, nx, 0, nz);
            wallPhys.quadFacing(pa, pb, pc, pd, nx, 0, nz);
          }
          u += L;
        }
      };
      addRingWalls(ring, false);
      for (const h of holes) addRingWalls(h, true);

      // roof
      const area = Math.abs(signedArea(ring));
      let inset: Float64Array | null = null;
      if (hauss) {
        const dIn = Math.min(2.7, Math.sqrt(area) * 0.2);
        inset = insetRing(ring, dIn);
      }
      // cornice ledge (protruding band) for haussmann buildings
      if (hauss) {
        const out = insetRing(ring, -0.38);
        if (out) {
          for (let k = 0; k < n; k++) {
            const q = (k + 1) % n;
            const x0 = ring[k * 2], z0 = ring[k * 2 + 1], x1 = ring[q * 2], z1 = ring[q * 2 + 1];
            const X0 = out[k * 2], Z0 = out[k * 2 + 1], X1 = out[q * 2], Z1 = out[q * 2 + 1];
            const L = Math.hypot(x1 - x0, z1 - z0);
            const nx = X0 - x0 + X1 - x1, nz = Z0 - z0 + Z1 - z1;
            const nl = Math.hypot(nx, nz) || 1;
            const ex = nx / nl, ez = nz / nl;
            const y0 = cornice - 0.55, y1 = cornice + 0.05;
            // underside (slanted), front, top
            const a1 = roofs.v(x0, y0 - 0.25, z0, ex, -0.6, ez, 2, seed01, 0, 0), b1 = roofs.v(x1, y0 - 0.25, z1, ex, -0.6, ez, 2, seed01, L, 0);
            const c1 = roofs.v(X1, y0, Z1, ex, -0.6, ez, 2, seed01, L, 0.3), d1 = roofs.v(X0, y0, Z0, ex, -0.6, ez, 2, seed01, 0, 0.3);
            roofs.quadFacing(a1, b1, c1, d1, ex, -0.6, ez);
            const a2 = roofs.v(X0, y0, Z0, ex, 0, ez, 2, seed01, 0, 0.3), b2 = roofs.v(X1, y0, Z1, ex, 0, ez, 2, seed01, L, 0.3);
            const c2 = roofs.v(X1, y1, Z1, ex, 0, ez, 2, seed01, L, 0.9), d2 = roofs.v(X0, y1, Z0, ex, 0, ez, 2, seed01, 0, 0.9);
            roofs.quadFacing(a2, b2, c2, d2, ex, 0, ez);
            const a3 = roofs.v(X0, y1, Z0, 0, 1, 0, 2, seed01, 0, 1), b3 = roofs.v(X1, y1, Z1, 0, 1, 0, 2, seed01, L, 1);
            const c3 = roofs.v(x1, y1, z1, 0, 1, 0, 2, seed01, L, 1), d3 = roofs.v(x0, y1, z0, 0, 1, 0, 2, seed01, 0, 1);
            roofs.quadFacing(a3, b3, c3, d3, 0, 1, 0);
          }
        }
      }
      if (hauss && inset) {
        const yTop = cornice + roofH * 0.82;
        const ySlope0 = cornice + 0.05;
        let u = 0;
        for (let k = 0; k < n; k++) {
          const q = (k + 1) % n;
          const x0 = ring[k * 2], z0 = ring[k * 2 + 1], x1 = ring[q * 2], z1 = ring[q * 2 + 1];
          const X0 = inset[k * 2], Z0 = inset[k * 2 + 1], X1 = inset[q * 2], Z1 = inset[q * 2 + 1];
          const L = Math.hypot(x1 - x0, z1 - z0);
          // face normal
          const e1x = x1 - x0, e1y = 0, e1z = z1 - z0;
          const e2x = X0 - x0, e2y = yTop - ySlope0, e2z = Z0 - z0;
          let nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
          const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
          if (ny < 0) { nx = -nx; ny = -ny; nz = -nz; }
          const slopeLen = Math.hypot(e2x, e2y, e2z);
          const a = roofs.v(x0, ySlope0, z0, nx, ny, nz, 1, seed01, u, 0);
          const bb = roofs.v(x1, ySlope0, z1, nx, ny, nz, 1, seed01, u + L, 0);
          const c = roofs.v(X1, yTop, Z1, nx, ny, nz, 1, seed01, u + L, slopeLen);
          const dd = roofs.v(X0, yTop, Z0, nx, ny, nz, 1, seed01, u, slopeLen);
          roofs.quadFacing(a, bb, c, dd, nx, ny, nz);
          u += L;
        }
        this.flatPolygon(roofs, inset, [], yTop + 0.0, (x, z) => [0, seed01, x + ox, z + oz]);
        // chimney stacks along the top ridge (Paris terracotta pots on party walls)
        const nCh = Math.min(6, Math.floor(1 + seed01 * 3 + area / 250));
        for (let c = 0; c < nCh; c++) {
          const k = Math.floor(hash2(seed, c) * n);
          const cx = inset[k * 2], cz = inset[k * 2 + 1];
          const w = 0.5 + hash2(seed, c + 7) * 0.5, l = 1.2 + hash2(seed, c + 13) * 1.6, hgt = 1.0 + hash2(seed, c + 21) * 1.0;
          const ang = hash2(seed, c + 3) * Math.PI;
          this.box(roofs, cx, yTop - 0.2 + hgt / 2, cz, l / 2, hgt / 2 + 0.2, w / 2, ang, [3, seed01, 0, 0]);
        }
      } else {
        // flat roof (+ low parapet edge)
        this.flatPolygon(roofs, ring, holes, top, (x, z) => [hauss ? 0 : 4, seed01, x + ox, z + oz]);
      }
      nb++;
    }
    meshes.walls = walls.build();
    meshes.roofs = roofs.build();

    // ---------------------------------------------------------------- roads
    const roads = new MeshBuilder({ aRoad: 4, aRoad2: 4 });
    const curbs = new MeshBuilder({ aCurb: 2 });
    const marks = new MeshBuilder({ aMark: 2 });
    const bridges = new MeshBuilder({ aStone: 2 });
    const pt = { x: 0, z: 0, tx: 0, tz: 0 };
    const owned = t.re ?? [];
    const ownedSet = new Set(owned);
    const nodeHasJunction = (n: number) => d.nodeJunction[n] >= 0;
    const bridgeEdgesNear: number[] = [];
    // edge direction at a node (unit, pointing away from the node)
    const dirAtNode = (e: number, n: number, out: { x: number; z: number }) => {
      const len = d.length[e];
      if (d.edgeA[e] === n) { g.pointAt(e, Math.min(3, len * 0.5), pt); const p0x = d.pts[d.ptOffset[e] * 2], p0z = d.pts[d.ptOffset[e] * 2 + 1]; const l = Math.hypot(pt.x - p0x, pt.z - p0z) || 1; out.x = (pt.x - p0x) / l; out.z = (pt.z - p0z) / l; }
      else { g.pointAt(e, Math.max(0, len - Math.min(3, len * 0.5)), pt); const k = d.ptOffset[e + 1] - 1; const p0x = d.pts[k * 2], p0z = d.pts[k * 2 + 1]; const l = Math.hypot(pt.x - p0x, pt.z - p0z) || 1; out.x = (pt.x - p0x) / l; out.z = (pt.z - p0z) / l; }
    };
    const tmpDir = { x: 0, z: 0 };
    const classRank = (e: number) => (8 - d.cls[e]) * 0.003;
    for (const e of owned) {
      const len = d.length[e];
      const w = d.width[e];
      const hw = w / 2;
      const isBridge = (d.flags[e] & 1) !== 0;
      if (isBridge) bridgeEdgesNear.push(e);
      const a = d.edgeA[e], b = d.edgeB[e];
      const s0 = d.trimA[e], s1 = len - d.trimB[e];
      if (s1 - s0 < 0.2) continue;
      // sample positions
      const samples: number[] = [];
      const k0 = d.ptOffset[e], k1 = d.ptOffset[e + 1];
      let acc = 0;
      samples.push(s0);
      for (let k = k0; k < k1 - 1; k++) {
        const L = Math.hypot(d.pts[k * 2 + 2] - d.pts[k * 2], d.pts[k * 2 + 3] - d.pts[k * 2 + 1]);
        const segStart = acc, segEnd = acc + L;
        // subdivide each segment every ~6 m, include vertices
        const step = 6;
        for (let s = Math.ceil((segStart + 0.01) / step) * step; s < segEnd; s += step) if (s > s0 + 0.3 && s < s1 - 0.3) samples.push(s);
        if (segEnd > s0 + 0.3 && segEnd < s1 - 0.3) samples.push(segEnd);
        acc = segEnd;
      }
      samples.push(s1);
      samples.sort((p, q) => p - q);
      // end miters for smooth degree-2 continuations
      const endNormal = (node: number, atStart: boolean): { x: number; z: number } | null => {
        if (nodeHasJunction(node) || g.degree(node) !== 2) return null;
        let other = -1;
        for (let k = g.incOffset[node]; k < g.incOffset[node + 1]; k++) { const oe = g.inc[k] >> 1; if (oe !== e) other = oe; }
        if (other < 0) return null;
        dirAtNode(e, node, tmpDir);
        const t1x = atStart ? tmpDir.x : -tmpDir.x, t1z = atStart ? tmpDir.z : -tmpDir.z; // e's a->b direction at node
        dirAtNode(other, node, tmpDir); // away from node along the other edge
        const bx = atStart ? t1x - tmpDir.x : t1x + tmpDir.x, bz = atStart ? t1z - tmpDir.z : t1z + tmpDir.z;
        const l = Math.hypot(bx, bz);
        if (l < 1e-3) return null;
        const cos = Math.max(0.6, (bx / l) * t1x + (bz / l) * t1z);
        return { x: (-bz / l) / cos, z: (bx / l) / cos };
      };
      const nA = s0 < 0.01 ? endNormal(a, true) : null;
      const nB = s1 > len - 0.01 ? endNormal(b, false) : null;
      const yOff = ROAD_Y + classRank(e);
      const packed = d.lanesF[e] + d.lanesB[e] * 8 + (d.oneway[e] ? 64 : 0) + d.surface[e] * 128;
      const flags = (d.nodeSignal[a] ? 1 : 0) + (d.nodeSignal[b] ? 2 : 0) + (isBridge ? 4 : 0);
      let prevL = -1, prevR = -1, prevCL: number[] | null = null, prevCR: number[] | null = null;
      const curbAttr = isBridge ? 1 : 0;
      for (let si = 0; si < samples.length; si++) {
        const s = samples[si];
        g.pointAt(e, Math.min(len, s + 0.6), pt);
        const fx2 = pt.x, fz2 = pt.z;
        g.pointAt(e, Math.max(0, s - 0.6), pt);
        let tdx = fx2 - pt.x, tdz = fz2 - pt.z;
        const tl = Math.hypot(tdx, tdz) || 1; tdx /= tl; tdz /= tl;
        g.pointAt(e, s, pt);
        let rx = -tdz, rz = tdx; // right normal (smoothed across polyline vertices)
        if (si === 0 && nA) { rx = nA.x; rz = nA.z; }
        if (si === samples.length - 1 && nB) { rx = nB.x; rz = nB.z; }
        const lx = pt.x - ox, lz = pt.z - oz;
        const xl = lx - rx * hw, zl = lz - rz * hw, xr = lx + rx * hw, zr = lz + rz * hw;
        const yl = H(xl, zl) + yOff, yr = H(xr, zr) + yOff;
        const vl = roads.v(xl, yl, zl, 0, 1, 0, -hw, s, w, packed, len, d.trimA[e], d.trimB[e], flags);
        const vr = roads.v(xr, yr, zr, 0, 1, 0, hw, s, w, packed, len, d.trimA[e], d.trimB[e], flags);
        if (prevL >= 0) roads.quadFacing(prevL, prevR, vr, vl, 0, 1, 0);
        prevL = vl; prevR = vr;
        // curbs on both sides
        const cl = this.curbSection(curbs, xl, zl, -rx, -rz, yl - yOff, s, curbAttr);
        const cr = this.curbSection(curbs, xr, zr, rx, rz, yr - yOff, s, curbAttr);
        if (prevCL && prevCR) { this.curbJoin(curbs, prevCL, cl); this.curbJoin(curbs, prevCR, cr); }
        prevCL = cl; prevCR = cr;
      }
      // bridge deck + parapets
      if (isBridge) this.bridgeDeck(bridges, e, s0, s1, ox, oz, physBoxes);
      // zebra crossings & stop lines
      const lanesF = d.lanesF[e], lanesB = d.lanesB[e];
      const zebraAt = (s: number) => {
        if (s < 1 || s > len - 1) return;
        g.pointAt(e, s, pt);
        const lx = pt.x - ox, lz = pt.z - oz;
        const rx = -pt.tz, rz = pt.tx;
        const bandW = 0.5, gap = 0.6, depth = 4.0;
        for (let o = -hw + 0.4; o + bandW <= hw - 0.2; o += bandW + gap) {
          // stripe: across = o..o+bandW, along = s-depth/2..s+depth/2
          const p = (oo: number, aa: number): [number, number] => [lx + rx * oo + pt.tx * aa, lz + rz * oo + pt.tz * aa];
          const c = [p(o, -depth / 2), p(o + bandW, -depth / 2), p(o + bandW, depth / 2), p(o, depth / 2)];
          const ids = c.map(([x, z]) => marks.v(x, H(x, z) + yOff + 0.012, z, 0, 1, 0, 0, 0));
          marks.quadFacing(ids[0], ids[1], ids[2], ids[3], 0, 1, 0);
        }
      };
      const stopLineAt = (s: number, rightSide: boolean) => {
        if (s < 0.5 || s > len - 0.5) return;
        g.pointAt(e, s, pt);
        const lx = pt.x - ox, lz = pt.z - oz;
        const rx = -pt.tz, rz = pt.tx;
        const twoWay = lanesB > 0 && lanesF > 0;
        const o0 = twoWay ? (rightSide ? 0.1 : -hw + 0.3) : -hw + 0.3;
        const o1 = twoWay ? (rightSide ? hw - 0.3 : -0.1) : hw - 0.3;
        const c = [[o0, -0.25], [o1, -0.25], [o1, 0.25], [o0, 0.25]].map(([oo, aa]) => [lx + rx * oo + pt.tx * aa, lz + rz * oo + pt.tz * aa]);
        const ids = c.map(([x, z]) => marks.v(x, H(x, z) + yOff + 0.012, z, 0, 1, 0, 1, 0));
        marks.quadFacing(ids[0], ids[1], ids[2], ids[3], 0, 1, 0);
      };
      const zebras: number[] = [];
      if (d.nodeSignal[a] && nodeHasJunction(a)) { zebras.push(d.trimA[e] + 2.4); if (lanesB > 0 || !d.oneway[e]) stopLineAt(d.trimA[e] + 5.6, false); }
      if (d.nodeSignal[b] && nodeHasJunction(b)) { zebras.push(len - d.trimB[e] - 2.4); stopLineAt(len - d.trimB[e] - 5.6, true); }
      for (let k = d.crossOffset[e]; k < d.crossOffset[e + 1]; k++) {
        const s = d.cross[k];
        if (zebras.every((z) => Math.abs(z - s) > 6)) zebras.push(Math.max(d.trimA[e] + 2.2, Math.min(len - d.trimB[e] - 2.2, s)));
      }
      if (w >= 5) for (const s of zebras) zebraAt(s);
    }
    // junction polygons
    for (const n of t.rn ?? []) {
      const ji = d.nodeJunction[n];
      if (ji < 0) continue;
      const p0 = d.juncOffset[ji], p1 = d.juncOffset[ji + 1];
      const m = p1 - p0;
      if (m < 3) continue;
      const flat: number[] = [];
      for (let k = p0; k < p1; k++) flat.push(d.juncPts[k * 3] - ox, d.juncPts[k * 3 + 1] - oz);
      // surface: majority of incident edges
      let cob = 0, cnt = 0, maxRank = 0;
      for (let k = g.incOffset[n]; k < g.incOffset[n + 1]; k++) { const e = g.inc[k] >> 1; cob += d.surface[e] === 1 ? 1 : 0; cnt++; maxRank = Math.max(maxRank, classRank(e)); }
      const surf = cob * 2 > cnt ? 1 : 0;
      const tri = earcut(flat);
      const base = roads.vertexCount;
      const yOff = ROAD_Y + maxRank + 0.004;
      for (let k = 0; k < m; k++) {
        const x = flat[k * 2], z = flat[k * 2 + 1];
        roads.v(x, H(x, z) + yOff, z, 0, 1, 0, 1000, 0, 10, surf * 128, 0, 0, 0, 0);
      }
      for (let k = 0; k < tri.length; k += 3) roads.triFacing(base + tri[k], base + tri[k + 1], base + tri[k + 2], 0, 1, 0);
      // curb segments (flag c=1 means segment from this point to the next is a curb)
      const area = signedArea(flat);
      let prev: number[] | null = null;
      for (let k = 0; k <= m; k++) {
        const kk = k % m, kn = (k + 1) % m;
        const isCurb = d.juncPts[(p0 + kk) * 3 + 2] > 0.5;
        if (!isCurb) { prev = null; continue; }
        const x0 = flat[kk * 2], z0 = flat[kk * 2 + 1], x1 = flat[kn * 2], z1 = flat[kn * 2 + 1];
        const dx = x1 - x0, dz = z1 - z0;
        const L = Math.hypot(dx, dz);
        if (L < 0.05) continue;
        const s = area > 0 ? 1 : -1;
        const nx = (dz / L) * s, nz = (-dx / L) * s; // outward
        const c0 = prev ?? this.curbSection(curbs, x0, z0, nx, nz, H(x0, z0), 0, 0);
        const c1 = this.curbSection(curbs, x1, z1, nx, nz, H(x1, z1), L, 0);
        this.curbJoin(curbs, c0, c1);
        prev = c1;
        if (k === m) break;
      }
    }
    meshes.roads = roads.build();
    meshes.curbs = curbs.build();
    meshes.marks = marks.build();

    // ---------------------------------------------------------------- water surfaces + quay walls
    const water = new MeshBuilder({ aWater: 2 });
    for (const wp of waterPolys) {
      const flat: number[] = Array.from(wp.outer);
      const holesIdx: number[] = [];
      for (const h of wp.holes) { holesIdx.push(flat.length / 2); flat.push(...Array.from(h)); }
      const tri = earcut(flat, holesIdx.length ? holesIdx : undefined);
      let y = this.style.waterLevel;
      if (wp.kind === 1) {
        // basin: slightly below local ground
        let mn = Infinity;
        for (let k = 0; k < wp.outer.length; k += 2) mn = Math.min(mn, H(wp.outer[k], wp.outer[k + 1]));
        y = mn - 0.35;
      }
      const base = water.vertexCount;
      for (let k = 0; k < flat.length; k += 2) water.v(flat[k], y, flat[k + 1], 0, 1, 0, wp.kind, 0);
      for (let k = 0; k < tri.length; k += 3) water.triFacing(base + tri[k], base + tri[k + 1], base + tri[k + 2], 0, 1, 0);
      if (wp.kind === 1) {
        // basin stone rim
        const r = wp.outer;
        const mm = r.length / 2;
        const area = signedArea(r);
        for (let k = 0; k < mm; k++) {
          const q = (k + 1) % mm;
          const x0 = r[k * 2], z0 = r[k * 2 + 1], x1 = r[q * 2], z1 = r[q * 2 + 1];
          const L = Math.hypot(x1 - x0, z1 - z0);
          if (L < 0.05) continue;
          const nx = ((z1 - z0) / L) * (area > 0 ? 1 : -1), nz = (-(x1 - x0) / L) * (area > 0 ? 1 : -1);
          const yt = Math.max(H(x0, z0), H(x1, z1)) + 0.35;
          const a = bridges.v(x0, y - 0.6, z0, -nx, 0, -nz, 0, 0), bb = bridges.v(x1, y - 0.6, z1, -nx, 0, -nz, L, 0);
          const c = bridges.v(x1, yt, z1, -nx, 0, -nz, L, 1), dd = bridges.v(x0, yt, z0, -nx, 0, -nz, 0, 1);
          bridges.quadFacing(a, bb, c, dd, -nx, 0, -nz);
          const a2 = bridges.v(x0, yt, z0, 0, 1, 0, 0, 1), b2 = bridges.v(x1, yt, z1, 0, 1, 0, L, 1);
          const c2 = bridges.v(x1 + nx * 0.45, yt, z1 + nz * 0.45, 0, 1, 0, L, 1.4), d2 = bridges.v(x0 + nx * 0.45, yt, z0 + nz * 0.45, 0, 1, 0, 0, 1.4);
          bridges.quadFacing(a2, b2, c2, d2, 0, 1, 0);
          const a3 = bridges.v(x0 + nx * 0.45, yt, z0 + nz * 0.45, nx, 0, nz, 0, 1), b3 = bridges.v(x1 + nx * 0.45, yt, z1 + nz * 0.45, nx, 0, nz, L, 1);
          const c3 = bridges.v(x1 + nx * 0.45, yt - 0.4, z1 + nz * 0.45, nx, 0, nz, L, 0.6), d3 = bridges.v(x0 + nx * 0.45, yt - 0.4, z0 + nz * 0.45, nx, 0, nz, 0, 0.6);
          bridges.quadFacing(a3, b3, c3, d3, nx, 0, nz);
        }
      }
    }
    meshes.water = water.build();
    // quay walls + parapets
    for (const q of t.q ?? []) {
      const x0 = q[0] / 10, z0 = q[1] / 10, x1 = q[2] / 10, z1 = q[3] / 10;
      const dx = x1 - x0, dz = z1 - z0;
      const L = Math.hypot(dx, dz);
      if (L < 0.1) continue;
      let nx = dz / L, nz = -dx / L;
      const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
      // normal towards the water
      if (!inWater(mx + nx * 1.5, mz + nz * 1.5, 0)) { nx = -nx; nz = -nz; }
      const yw = this.style.waterLevel - 2.5;
      const yt0 = H(x0 - nx * 0.5, z0 - nz * 0.5) + 0.02, yt1 = H(x1 - nx * 0.5, z1 - nz * 0.5) + 0.02;
      const a = bridges.v(x0, yw, z0, nx, 0, nz, 0, 0), bb = bridges.v(x1, yw, z1, nx, 0, nz, L, 0);
      const c = bridges.v(x1, yt1, z1, nx, 0, nz, L, yt1 - yw), dd = bridges.v(x0, yt0, z0, nx, 0, nz, 0, yt0 - yw);
      bridges.quadFacing(a, bb, c, dd, nx, 0, nz);
      // parapet unless a bridge crosses here
      let underBridge = false;
      g.forEdgesNear(mx + ox, mz + oz, 30, (e) => {
        if (underBridge || !(d.flags[e] & 1)) return;
        const hit = { edge: 0, s: 0, dist: 0, x: 0, z: 0, side: 0, tx: 0, tz: 0 };
        if (g.nearest(mx + ox, mz + oz, d.width[e] / 2 + 4, hit, (ee) => ee === e)) underBridge = true;
      });
      if (!underBridge) {
        const pw = 0.45, ph = 0.95;
        const ix0 = x0 - nx * pw, iz0 = z0 - nz * pw, ix1 = x1 - nx * pw, iz1 = z1 - nz * pw;
        const p = [bridges.v(x0, yt0, z0, nx, 0, nz, 0, 0), bridges.v(x1, yt1, z1, nx, 0, nz, L, 0), bridges.v(x1, yt1 + ph, z1, nx, 0, nz, L, ph), bridges.v(x0, yt0 + ph, z0, nx, 0, nz, 0, ph)];
        bridges.quadFacing(p[0], p[1], p[2], p[3], nx, 0, nz);
        const t2 = [bridges.v(x0, yt0 + ph, z0, 0, 1, 0, 0, ph), bridges.v(x1, yt1 + ph, z1, 0, 1, 0, L, ph), bridges.v(ix1, yt1 + ph, iz1, 0, 1, 0, L, ph + pw), bridges.v(ix0, yt0 + ph, iz0, 0, 1, 0, 0, ph + pw)];
        bridges.quadFacing(t2[0], t2[1], t2[2], t2[3], 0, 1, 0);
        const i2 = [bridges.v(ix0, yt0 - 0.1, iz0, -nx, 0, -nz, 0, 0), bridges.v(ix1, yt1 - 0.1, iz1, -nx, 0, -nz, L, 0), bridges.v(ix1, yt1 + ph, iz1, -nx, 0, -nz, L, ph), bridges.v(ix0, yt0 + ph, iz0, -nx, 0, -nz, 0, ph)];
        bridges.quadFacing(i2[0], i2[1], i2[2], i2[3], -nx, 0, -nz);
        physBoxes.push4((x0 + x1) / 2 - nx * pw / 2, (yt0 + yt1) / 2 + ph / 2, (z0 + z1) / 2 - nz * pw / 2, L / 2 + 0.05);
        physBoxes.push3(ph / 2 + 0.3, pw / 2, Math.atan2(-dz, dx));
      }
    }
    meshes.stone = bridges.build();

    // ---------------------------------------------------------------- ground mask + road mask rasters
    const groundMask = this.rasterGround(t, ox, oz);
    const roadMask = this.rasterRoads(owned, t, ox, oz);

    // ---------------------------------------------------------------- trees
    if (t.tr) {
      const tr = t.tr;
      const out = new Float32Array((tr.length / 2) * 6);
      for (let k = 0, o = 0; k < tr.length; k += 2) {
        const x = tr[k] / 10, z = tr[k + 1] / 10;
        const h = hash2(tr[k], tr[k + 1]);
        out[o++] = x; out[o++] = H(x, z); out[o++] = z; out[o++] = h * Math.PI * 2; out[o++] = 0.75 + hash2(tr[k + 1], tr[k]) * 0.55; out[o++] = Math.floor(h * 4);
        physCyl.push3(x, H(x, z) + 1.5, z); physCyl.push3(0.28, 1.5, 0);
      }
      instances.trees = out;
    }
    // ---------------------------------------------------------------- props: orient towards the nearest road
    const hit = { edge: -1, s: 0, dist: 0, x: 0, z: 0, side: 0, tx: 0, tz: 0 };
    for (const kind in t.pp ?? {}) {
      const arr = t.pp![kind];
      const out = new Float32Array((arr.length / 2) * 6);
      let o = 0;
      for (let k = 0; k < arr.length; k += 2) {
        let x = arr[k] / 10, z = arr[k + 1] / 10;
        let rot = hash2(arr[k], arr[k + 1]) * Math.PI * 2;
        hit.edge = -1;
        if (g.nearest(x + ox, z + oz, 25, hit, (e) => !(d.flags[e] & 16) || kind === 'lamp')) {
          // face the road: object's local -Z points to the road
          const dx = hit.x - (x + ox), dz = hit.z - (z + oz);
          rot = Math.atan2(-dx, -dz);
          if (kind === 'signal') {
            // traffic light faces oncoming traffic: place at the kerb, rotated to face against travel direction
            const sideSign = hit.side || 1;
            const kerb = d.width[hit.edge] / 2 + 0.6;
            x = hit.x - ox + -hit.tz * kerb * sideSign; z = hit.z - oz + hit.tx * kerb * sideSign;
            rot = Math.atan2(sideSign > 0 ? hit.tx : -hit.tx, sideSign > 0 ? hit.tz : -hit.tz);
          } else if (kind === 'busstop') {
            rot = Math.atan2(-hit.tx, -hit.tz) + (hit.side > 0 ? 0 : Math.PI);
          } else if (hit.dist < d.width[hit.edge] / 2 + 0.5 && kind !== 'bollard') {
            // pushed onto the sidewalk
            const push = d.width[hit.edge] / 2 + 0.7 - hit.dist;
            const l = Math.hypot(dx, dz) || 1;
            x -= (dx / l) * push; z -= (dz / l) * push;
          }
        }
        const y = H(x, z) + CURB_H;
        let scale = 1, variant = Math.floor(hash2(arr[k + 1], arr[k]) * 4);
        if (kind === 'signal' && hit.edge >= 0) {
          // timing: offset of the junction the light belongs to, and the approach axis
          const e = hit.edge;
          const na = d.edgeA[e], nb2 = d.edgeB[e];
          const da = Math.hypot(d.nodeX[na] - (x + ox), d.nodeZ[na] - (z + oz)), db = Math.hypot(d.nodeX[nb2] - (x + ox), d.nodeZ[nb2] - (z + oz));
          const node = da < db ? na : nb2;
          scale = 1 + signalOffset(node) / 1000;
          variant = signalAxis(g, node, e);
        }
        out[o++] = x; out[o++] = y; out[o++] = z; out[o++] = rot; out[o++] = scale; out[o++] = variant;
        if (kind === 'lamp') { lights.push4(x, y + 7.0, z, 0); physCyl.push3(x, y + 2, z); physCyl.push3(0.13, 2, 1); }
        else if (kind === 'signal') { physCyl.push3(x, y + 1.5, z); physCyl.push3(0.1, 1.5, 2); }
        else if (kind === 'bollard') { physCyl.push3(x, y + 0.5, z); physCyl.push3(0.1, 0.5, 3); }
        else if (kind === 'busstop') { physBoxes.push4(x, y + 1.2, z, 1.9); physBoxes.push3(1.2, 0.7, rot); }
      }
      instances[kind] = out;
    }

    // ---------------------------------------------------------------- physics heightfield (33x33 at 8 m), river bed lowered
    const heights = new Float32Array(33 * 33);
    for (let iz = 0; iz <= 32; iz++) for (let ix = 0; ix <= 32; ix++) heights[iz * 33 + ix] = H(ix * 8, iz * 8);
    for (const c of fullWater) {
      const cx = c % N, cz = (c / N) | 0;
      // only lower if this cell's centre is river (kind 0)
      if (!inWater(cx * cs + cs / 2, cz * cs + cs / 2, 0)) continue;
      const bed = this.style.waterLevel - 3;
      for (const [ax, az] of [[cx, cz], [cx + 1, cz], [cx, cz + 1], [cx + 1, cz + 1]]) {
        // keep land vertices at land height if any neighbouring cell is land
        let allWater = true;
        for (let qz = az - 1; qz <= az; qz++) for (let qx = ax - 1; qx <= ax; qx++) {
          if (qx < 0 || qz < 0 || qx >= N || qz >= N) continue;
          if (!fullWater.has(qz * N + qx)) allWater = false;
        }
        if (allWater) heights[az * 33 + ax] = bed;
      }
    }
    const wp = wallPhys.build();
    const triCount = Object.values(meshes).reduce((s, m) => s + (m ? m.index.length / 3 : 0), 0);
    return {
      i: t.i, j: t.j, ox, oz, meshes, groundMask, roadMask, instances, lights: lights.result(),
      physics: { heights, wallPos: wp ? wp.position : new Float32Array(0), wallIdx: wp ? wp.index : new Uint32Array(0), boxes: physBoxes.result(), cylinders: physCyl.result() },
      stats: { buildings: nb, tris: triCount },
    };
  }

  // ------------------------------------------------------------------------------------------------
  private flatPolygon(mb: MeshBuilder, ring: Float64Array, holes: Float64Array[], y: number, attr: (x: number, z: number) => number[]): void {
    const flat: number[] = Array.from(ring);
    const hi: number[] = [];
    for (const h of holes) { hi.push(flat.length / 2); for (const v of h) flat.push(v); }
    const tri = earcut(flat, hi.length ? hi : undefined);
    const base = mb.vertexCount;
    for (let k = 0; k < flat.length; k += 2) mb.v(flat[k], y, flat[k + 1], 0, 1, 0, ...attr(flat[k], flat[k + 1]));
    for (let k = 0; k < tri.length; k += 3) mb.triFacing(base + tri[k], base + tri[k + 1], base + tri[k + 2], 0, 1, 0);
  }

  private box(mb: MeshBuilder, cx: number, cy: number, cz: number, hx: number, hy: number, hz: number, rot: number, attr: number[]): void {
    const c = Math.cos(rot), s = Math.sin(rot);
    const P = (x: number, y: number, z: number): [number, number, number] => [cx + x * c - z * s, cy + y, cz + x * s + z * c];
    const faces: Array<[number[], [number, number, number][]]> = [
      [[c, 0, s], [P(hx, -hy, -hz), P(hx, -hy, hz), P(hx, hy, hz), P(hx, hy, -hz)]],
      [[-c, 0, -s], [P(-hx, -hy, hz), P(-hx, -hy, -hz), P(-hx, hy, -hz), P(-hx, hy, hz)]],
      [[-s, 0, c], [P(hx, -hy, hz), P(-hx, -hy, hz), P(-hx, hy, hz), P(hx, hy, hz)]],
      [[s, 0, -c], [P(-hx, -hy, -hz), P(hx, -hy, -hz), P(hx, hy, -hz), P(-hx, hy, -hz)]],
      [[0, 1, 0], [P(-hx, hy, -hz), P(hx, hy, -hz), P(hx, hy, hz), P(-hx, hy, hz)]],
    ];
    for (const [n, q] of faces) {
      const ids = q.map((p) => mb.v(p[0], p[1], p[2], n[0], n[1], n[2], ...attr));
      mb.quadFacing(ids[0], ids[1], ids[2], ids[3], n[0], n[1], n[2]);
    }
  }

  /** Curb cross-section at (x,z) with outward direction (nx,nz). Returns 4 vertex ids [bottomInner, topInner, topOuter, rampEnd]. */
  private curbSection(mb: MeshBuilder, x: number, z: number, nx: number, nz: number, y: number, u: number, kind: number): number[] {
    const a = mb.v(x, y + ROAD_Y - 0.02, z, -nx, 0.3, -nz, u, kind);
    const b = mb.v(x + nx * 0.03, y + CURB_H, z + nz * 0.03, -nx * 0.5, 0.85, -nz * 0.5, u, kind);
    const c = mb.v(x + nx * 0.28, y + CURB_H, z + nz * 0.28, 0, 1, 0, u, kind);
    const dd = mb.v(x + nx * 1.6, y + 0.005, z + nz * 1.6, nx * 0.1, 1, nz * 0.1, u, kind + 2);
    return [a, b, c, dd];
  }
  private curbJoin(mb: MeshBuilder, p: number[], q: number[]): void {
    // faces between consecutive sections; orientation via facing test with the per-vertex normal
    const P = mb.nor.a;
    for (let k = 0; k < 3; k++) {
      const i0 = p[k], i1 = p[k + 1], j0 = q[k], j1 = q[k + 1];
      const nx = P[i0 * 3] + P[i1 * 3], ny = P[i0 * 3 + 1] + P[i1 * 3 + 1], nz = P[i0 * 3 + 2] + P[i1 * 3 + 2];
      mb.quadFacing(i0, j0, j1, i1, nx, ny, nz);
    }
  }

  private bridgeDeck(mb: MeshBuilder, e: number, s0: number, s1: number, ox: number, oz: number, physBoxes: FloatBuf): void {
    const g = this.graph, d = g.d;
    const hw = d.width[e] / 2 + 3.0;
    const T = this.terrain;
    const pt = { x: 0, z: 0, tx: 0, tz: 0 };
    const n = Math.max(2, Math.ceil((s1 - s0) / 6));
    let prev: number[] | null = null;
    let px = 0, pz = 0, py = 0;
    for (let k = 0; k <= n; k++) {
      const s = s0 + ((s1 - s0) * k) / n;
      g.pointAt(e, s, pt);
      const rx = -pt.tz, rz = pt.tx;
      const x = pt.x - ox, z = pt.z - oz;
      const y = T.height(pt.x, pt.z);
      const yb = y - 1.4;
      // sidewalk tops (stone) and side faces, underside
      const L = [x - rx * hw, z - rz * hw], R = [x + rx * hw, z + rz * hw];
      const Li = [x - rx * (hw - 2.9), z - rz * (hw - 2.9)], Ri = [x + rx * (hw - 2.9), z + rz * (hw - 2.9)];
      const ids = [
        mb.v(L[0], y + 0.16, L[1], 0, 1, 0, s, 0), mb.v(Li[0], y + 0.16, Li[1], 0, 1, 0, s, 0.3),
        mb.v(Ri[0], y + 0.16, Ri[1], 0, 1, 0, s, 0.3), mb.v(R[0], y + 0.16, R[1], 0, 1, 0, s, 0),
        mb.v(L[0], y + 1.15, L[1], -rx, 0, -rz, s, 1.2), mb.v(L[0], yb, L[1], -rx, 0, -rz, s, -1),
        mb.v(R[0], y + 1.15, R[1], rx, 0, rz, s, 1.2), mb.v(R[0], yb, R[1], rx, 0, rz, s, -1),
        mb.v(L[0], yb, L[1], 0, -1, 0, s, -1), mb.v(R[0], yb, R[1], 0, -1, 0, s, -1),
        // parapet inner faces
        mb.v(L[0] + rx * 0.4, y + 0.16, L[1] + rz * 0.4, rx, 0, rz, s, 0), mb.v(L[0] + rx * 0.4, y + 1.15, L[1] + rz * 0.4, rx, 0, rz, s, 1),
        mb.v(R[0] - rx * 0.4, y + 0.16, R[1] - rz * 0.4, -rx, 0, -rz, s, 0), mb.v(R[0] - rx * 0.4, y + 1.15, R[1] - rz * 0.4, -rx, 0, -rz, s, 1),
        // parapet tops
        mb.v(L[0], y + 1.15, L[1], 0, 1, 0, s, 1.3), mb.v(L[0] + rx * 0.4, y + 1.15, L[1] + rz * 0.4, 0, 1, 0, s, 1.3),
        mb.v(R[0] - rx * 0.4, y + 1.15, R[1] - rz * 0.4, 0, 1, 0, s, 1.3), mb.v(R[0], y + 1.15, R[1], 0, 1, 0, s, 1.3),
      ];
      if (prev) {
        const q = (a: number, b: number, nx: number, ny: number, nz: number) => mb.quadFacing(prev![a], ids[a], ids[b], prev![b], nx, ny, nz);
        q(0, 1, 0, 1, 0); q(2, 3, 0, 1, 0);
        q(5, 4, -rx, 0, -rz); q(6, 7, rx, 0, rz); q(8, 9, 0, -1, 0);
        q(10, 11, rx, 0, rz); q(12, 13, -rx, 0, -rz); q(14, 15, 0, 1, 0); q(16, 17, 0, 1, 0);
        // physics: deck box
        const cx = (px + x) / 2, cz = (pz + z) / 2, cy = (py + y) / 2 - 0.5;
        const len = Math.hypot(x - px, z - pz);
        physBoxes.push4(cx, cy, cz, len / 2 + 0.3);
        physBoxes.push3(0.5, hw, Math.atan2(-(z - pz), x - px));
        // parapets
        for (const side of [-1, 1]) {
          physBoxes.push4(cx + rx * (hw - 0.2) * side, cy + 1.15, cz + rz * (hw - 0.2) * side, len / 2 + 0.3);
          physBoxes.push3(0.6, 0.25, Math.atan2(-(z - pz), x - px));
        }
      }
      prev = ids; px = x; pz = z; py = y;
    }
  }

  private rasterGround(t: RawTile, ox: number, oz: number): ImageBitmap | null {
    if (typeof OffscreenCanvas === 'undefined') return null;
    const S = 256;
    const cv = new OffscreenCanvas(S, S);
    const ctx = cv.getContext('2d');
    if (!ctx) return null;
    ctx.clearRect(0, 0, S, S);
    ctx.globalCompositeOperation = 'lighter';
    const scale = S / this.style.tileSize;
    const poly = (ring: number[], holes: number[][]) => {
      ctx.beginPath();
      const path = (r: number[]) => { for (let k = 0; k < r.length; k += 2) { const x = (r[k] / 10) * scale, z = (r[k + 1] / 10) * scale; if (k === 0) ctx.moveTo(x, z); else ctx.lineTo(x, z); } ctx.closePath(); };
      path(ring); for (const h of holes) path(h);
      ctx.fill('evenodd');
    };
    for (const [ring, holes, kind] of t.l ?? []) {
      // R grass, G paving, B gravel, A flowers/pitch
      if (kind === 1 || kind === 6) ctx.fillStyle = 'rgba(255,0,0,1)';
      else if (kind === 2) ctx.fillStyle = 'rgba(255,0,0,1)';
      else if (kind === 3) ctx.fillStyle = 'rgba(200,0,0,1)';
      else if (kind === 4 || kind === 7) ctx.fillStyle = 'rgba(0,0,255,1)';
      else if (kind === 5) ctx.fillStyle = 'rgba(0,255,0,1)';
      else if (kind === 8) ctx.fillStyle = 'rgba(0,0,200,1)';
      else continue;
      poly(ring, holes);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [pts, wdm, kind, surf] of t.p ?? []) {
      // gravel paths in parks, stone for pedestrian streets
      ctx.strokeStyle = kind === 0 ? 'rgba(0,255,0,1)' : surf === 1 ? 'rgba(0,255,0,1)' : kind === 3 ? 'rgba(0,0,0,0)' : 'rgba(0,0,255,1)';
      if (kind === 3) continue;
      ctx.lineWidth = Math.max(1, (wdm / 10) * scale);
      ctx.beginPath();
      for (let k = 0; k < pts.length; k += 2) { const x = (pts[k] / 10) * scale, z = (pts[k + 1] / 10) * scale; if (k === 0) ctx.moveTo(x, z); else ctx.lineTo(x, z); }
      ctx.stroke();
    }
    void ox; void oz;
    return cv.transferToImageBitmap();
  }

  private rasterRoads(owned: number[], t: RawTile, ox: number, oz: number): Uint8Array {
    const S = 256;
    const out = new Uint8Array(S * S);
    if (typeof OffscreenCanvas === 'undefined') return out;
    const cv = new OffscreenCanvas(S, S);
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    if (!ctx) return out;
    const g = this.graph, d = g.d;
    const scale = S / this.style.tileSize;
    // soft ground (grass, parks) = 100
    ctx.fillStyle = 'rgb(100,100,100)';
    for (const [ring, holes, kind] of t.l ?? []) {
      if (kind !== 1 && kind !== 2 && kind !== 3 && kind !== 6) continue;
      ctx.beginPath();
      const path = (r: number[]) => { for (let k = 0; k < r.length; k += 2) { const x = (r[k] / 10) * scale, z = (r[k + 1] / 10) * scale; if (k === 0) ctx.moveTo(x, z); else ctx.lineTo(x, z); } ctx.closePath(); };
      path(ring); for (const h of holes) path(h);
      ctx.fill('evenodd');
    }
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
    const seen = new Set<number>();
    g.forEdgesNear(ox + 128, oz + 128, 190, (e) => {
      if (seen.has(e)) return;
      seen.add(e);
      ctx.lineWidth = d.width[e] * scale;
      ctx.beginPath();
      for (let k = d.ptOffset[e]; k < d.ptOffset[e + 1]; k++) {
        const x = (d.pts[k * 2] - ox) * scale, z = (d.pts[k * 2 + 1] - oz) * scale;
        if (k === d.ptOffset[e]) ctx.moveTo(x, z); else ctx.lineTo(x, z);
      }
      ctx.stroke();
      for (const n of [d.edgeA[e], d.edgeB[e]]) {
        const ji = d.nodeJunction[n];
        if (ji < 0) continue;
        ctx.beginPath();
        for (let k = d.juncOffset[ji]; k < d.juncOffset[ji + 1]; k++) {
          const x = (d.juncPts[k * 3] - ox) * scale, z = (d.juncPts[k * 3 + 1] - oz) * scale;
          if (k === d.juncOffset[ji]) ctx.moveTo(x, z); else ctx.lineTo(x, z);
        }
        ctx.closePath(); ctx.fill();
      }
    });
    void owned;
    const img = ctx.getImageData(0, 0, S, S).data;
    for (let i = 0; i < S * S; i++) out[i] = img[i * 4];
    return out;
  }
}

function pointInRing(r: ArrayLike<number>, x: number, z: number): boolean {
  let inside = false;
  const n = r.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = r[i * 2], zi = r[i * 2 + 1], xj = r[j * 2], zj = r[j * 2 + 1];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
