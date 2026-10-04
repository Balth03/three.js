import type { RawRoads } from './types';

/** Compact typed-array road graph (transferable to workers). Units: metres. */
export interface RoadGraphData {
  names: string[];
  nodeX: Float32Array; nodeZ: Float32Array; nodeSignal: Uint8Array;
  edgeA: Int32Array; edgeB: Int32Array;
  ptOffset: Int32Array; pts: Float32Array;
  cls: Uint8Array; width: Float32Array; lanesF: Uint8Array; lanesB: Uint8Array; oneway: Int8Array; speed: Uint8Array;
  name: Int32Array; flags: Uint8Array; surface: Uint8Array; trimA: Float32Array; trimB: Float32Array; length: Float32Array;
  crossOffset: Int32Array; cross: Float32Array;
  nodeJunction: Int32Array; juncOffset: Int32Array; juncPts: Float32Array; // juncPts: x,z,curb triples
}

export function buildRoadGraphData(raw: RawRoads): RoadGraphData {
  const nn = raw.nodes.length / 2;
  const ne = raw.edges.length;
  const nodeX = new Float32Array(nn), nodeZ = new Float32Array(nn);
  for (let i = 0; i < nn; i++) { nodeX[i] = raw.nodes[i * 2] / 10; nodeZ[i] = raw.nodes[i * 2 + 1] / 10; }
  const nodeSignal = new Uint8Array(nn);
  for (const s of raw.sig) nodeSignal[s] = 1;
  let npts = 0, ncross = 0;
  for (const e of raw.edges) { npts += e[2].length / 2; ncross += e[14].length; }
  const d: RoadGraphData = {
    names: raw.names, nodeX, nodeZ, nodeSignal,
    edgeA: new Int32Array(ne), edgeB: new Int32Array(ne), ptOffset: new Int32Array(ne + 1), pts: new Float32Array(npts * 2),
    cls: new Uint8Array(ne), width: new Float32Array(ne), lanesF: new Uint8Array(ne), lanesB: new Uint8Array(ne), oneway: new Int8Array(ne),
    speed: new Uint8Array(ne), name: new Int32Array(ne), flags: new Uint8Array(ne), surface: new Uint8Array(ne),
    trimA: new Float32Array(ne), trimB: new Float32Array(ne), length: new Float32Array(ne),
    crossOffset: new Int32Array(ne + 1), cross: new Float32Array(ncross),
    nodeJunction: new Int32Array(nn).fill(-1), juncOffset: new Int32Array(0), juncPts: new Float32Array(0),
  };
  let po = 0, co = 0;
  raw.edges.forEach((e, i) => {
    d.edgeA[i] = e[0]; d.edgeB[i] = e[1];
    d.ptOffset[i] = po;
    const p = e[2];
    let len = 0;
    for (let k = 0; k < p.length; k += 2) {
      d.pts[po * 2] = p[k] / 10; d.pts[po * 2 + 1] = p[k + 1] / 10;
      if (k > 0) len += Math.hypot((p[k] - p[k - 2]) / 10, (p[k + 1] - p[k - 1]) / 10);
      po++;
    }
    d.cls[i] = e[3]; d.width[i] = e[4] / 10; d.lanesF[i] = e[5]; d.lanesB[i] = e[6]; d.oneway[i] = e[7]; d.speed[i] = e[8];
    d.name[i] = e[9]; d.flags[i] = e[10]; d.surface[i] = e[11]; d.trimA[i] = e[12] / 10; d.trimB[i] = e[13] / 10; d.length[i] = len;
    d.crossOffset[i] = co;
    for (const c of e[14]) d.cross[co++] = c;
  });
  d.ptOffset[ne] = po; d.crossOffset[ne] = co;
  const keys = Object.keys(raw.junctions);
  let jn = 0;
  for (const k of keys) jn += raw.junctions[k].length;
  d.juncOffset = new Int32Array(keys.length + 1);
  d.juncPts = new Float32Array(jn);
  let jo = 0;
  keys.forEach((k, idx) => {
    const n = Number(k);
    d.nodeJunction[n] = idx;
    d.juncOffset[idx] = jo / 3;
    const arr = raw.junctions[k];
    for (let q = 0; q < arr.length; q += 3) { d.juncPts[jo++] = arr[q] / 10; d.juncPts[jo++] = arr[q + 1] / 10; d.juncPts[jo++] = arr[q + 2]; }
  });
  d.juncOffset[keys.length] = jo / 3;
  return d;
}

export interface EdgeHit { edge: number; s: number; dist: number; x: number; z: number; side: number; tx: number; tz: number }

/** Query helpers + adjacency + spatial index on top of RoadGraphData. */
export class RoadGraph {
  readonly nodeCount: number;
  readonly edgeCount: number;
  /** incident edges per node (CSR): value = edge*2 + (0 if node is edge start, 1 if end) */
  readonly incOffset: Int32Array;
  readonly inc: Int32Array;
  private readonly cell = 48;
  private readonly gx0: number; private readonly gz0: number; private readonly gw: number; private readonly gh: number;
  private readonly cellStart: Int32Array; private readonly cellEdges: Int32Array;

  constructor(readonly d: RoadGraphData) {
    this.nodeCount = d.nodeX.length;
    this.edgeCount = d.edgeA.length;
    const cnt = new Int32Array(this.nodeCount + 1);
    for (let e = 0; e < this.edgeCount; e++) { cnt[d.edgeA[e] + 1]++; cnt[d.edgeB[e] + 1]++; }
    for (let i = 0; i < this.nodeCount; i++) cnt[i + 1] += cnt[i];
    this.incOffset = cnt.slice();
    this.inc = new Int32Array(this.edgeCount * 2);
    const fill = cnt.slice();
    for (let e = 0; e < this.edgeCount; e++) { this.inc[fill[d.edgeA[e]]++] = e * 2; this.inc[fill[d.edgeB[e]]++] = e * 2 + 1; }
    // spatial grid over edge segment bounding boxes
    let minX = Infinity, minZ = Infinity, maxX = -Infinity, maxZ = -Infinity;
    for (let i = 0; i < d.pts.length; i += 2) {
      const x = d.pts[i], z = d.pts[i + 1];
      if (x < minX) minX = x; if (x > maxX) maxX = x; if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }
    this.gx0 = minX - 1; this.gz0 = minZ - 1;
    this.gw = Math.ceil((maxX - minX + 2) / this.cell); this.gh = Math.ceil((maxZ - minZ + 2) / this.cell);
    const counts = new Int32Array(this.gw * this.gh + 1);
    const visit = (e: number, cb: (c: number) => void) => {
      const seen = new Set<number>();
      for (let k = d.ptOffset[e]; k < d.ptOffset[e + 1] - 1; k++) {
        const x0 = d.pts[k * 2], z0 = d.pts[k * 2 + 1], x1 = d.pts[k * 2 + 2], z1 = d.pts[k * 2 + 3];
        const pad = d.width[e] / 2;
        const cx0 = Math.floor((Math.min(x0, x1) - pad - this.gx0) / this.cell), cx1 = Math.floor((Math.max(x0, x1) + pad - this.gx0) / this.cell);
        const cz0 = Math.floor((Math.min(z0, z1) - pad - this.gz0) / this.cell), cz1 = Math.floor((Math.max(z0, z1) + pad - this.gz0) / this.cell);
        for (let cz = Math.max(0, cz0); cz <= Math.min(this.gh - 1, cz1); cz++)
          for (let cx = Math.max(0, cx0); cx <= Math.min(this.gw - 1, cx1); cx++) {
            const c = cz * this.gw + cx;
            if (!seen.has(c)) { seen.add(c); cb(c); }
          }
      }
    };
    for (let e = 0; e < this.edgeCount; e++) visit(e, (c) => counts[c + 1]++);
    for (let i = 0; i < counts.length - 1; i++) counts[i + 1] += counts[i];
    this.cellStart = counts.slice();
    this.cellEdges = new Int32Array(counts[counts.length - 1]);
    const f2 = counts.slice();
    for (let e = 0; e < this.edgeCount; e++) visit(e, (c) => { this.cellEdges[f2[c]++] = e; });
  }

  name(e: number): string { const n = this.d.name[e]; return n >= 0 ? this.d.names[n] : ''; }

  /** Edges whose geometry may lie within r of (x,z). Calls cb for each (may repeat edges across cells). */
  forEdgesNear(x: number, z: number, r: number, cb: (e: number) => void): void {
    const cx0 = Math.max(0, Math.floor((x - r - this.gx0) / this.cell)), cx1 = Math.min(this.gw - 1, Math.floor((x + r - this.gx0) / this.cell));
    const cz0 = Math.max(0, Math.floor((z - r - this.gz0) / this.cell)), cz1 = Math.min(this.gh - 1, Math.floor((z + r - this.gz0) / this.cell));
    for (let cz = cz0; cz <= cz1; cz++)
      for (let cx = cx0; cx <= cx1; cx++) {
        const c = cz * this.gw + cx;
        for (let k = this.cellStart[c]; k < this.cellStart[c + 1]; k++) cb(this.cellEdges[k]);
      }
  }

  /** Nearest point on any edge accepted by `filter`. */
  nearest(x: number, z: number, maxDist: number, out: EdgeHit, filter?: (e: number) => boolean): boolean {
    const d = this.d;
    let best = maxDist * maxDist;
    let found = false;
    this.forEdgesNear(x, z, maxDist, (e) => {
      if (filter && !filter(e)) return;
      let acc = 0;
      for (let k = d.ptOffset[e]; k < d.ptOffset[e + 1] - 1; k++) {
        const x0 = d.pts[k * 2], z0 = d.pts[k * 2 + 1], x1 = d.pts[k * 2 + 2], z1 = d.pts[k * 2 + 3];
        const dx = x1 - x0, dz = z1 - z0;
        const L2 = dx * dx + dz * dz;
        const L = Math.sqrt(L2);
        let t = L2 > 0 ? ((x - x0) * dx + (z - z0) * dz) / L2 : 0;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const px = x0 + dx * t, pz = z0 + dz * t;
        const dd = (x - px) * (x - px) + (z - pz) * (z - pz);
        if (dd < best) {
          best = dd; found = true;
          out.edge = e; out.s = acc + L * t; out.x = px; out.z = pz; out.dist = Math.sqrt(dd);
          out.tx = L > 0 ? dx / L : 1; out.tz = L > 0 ? dz / L : 0;
          // side: + = right of travel direction (x,z with z south: right of (tx,tz) is (-tz, tx))
          out.side = Math.sign((x - px) * -out.tz + (z - pz) * out.tx);
        }
        acc += L;
      }
    });
    return found;
  }

  /** Point and tangent at distance s along edge e. */
  pointAt(e: number, s: number, out: { x: number; z: number; tx: number; tz: number }): void {
    const d = this.d;
    let acc = 0;
    const k0 = d.ptOffset[e], k1 = d.ptOffset[e + 1] - 1;
    for (let k = k0; k < k1; k++) {
      const x0 = d.pts[k * 2], z0 = d.pts[k * 2 + 1], x1 = d.pts[k * 2 + 2], z1 = d.pts[k * 2 + 3];
      const L = Math.hypot(x1 - x0, z1 - z0);
      if (acc + L >= s || k === k1 - 1) {
        const t = L > 0 ? Math.max(0, Math.min(1, (s - acc) / L)) : 0;
        out.x = x0 + (x1 - x0) * t; out.z = z0 + (z1 - z0) * t;
        out.tx = L > 0 ? (x1 - x0) / L : 1; out.tz = L > 0 ? (z1 - z0) / L : 0;
        return;
      }
      acc += L;
    }
    out.x = d.pts[k0 * 2]; out.z = d.pts[k0 * 2 + 1]; out.tx = 1; out.tz = 0;
  }

  /** Can a car drive edge e from node `from`? */
  allowedFrom(e: number, from: number): boolean {
    const ow = this.d.oneway[e];
    if (ow === 0) return true;
    return from === this.d.edgeA[e];
  }
  other(e: number, n: number): number { return this.d.edgeA[e] === n ? this.d.edgeB[e] : this.d.edgeA[e]; }
  degree(n: number): number { return this.incOffset[n + 1] - this.incOffset[n]; }
}
