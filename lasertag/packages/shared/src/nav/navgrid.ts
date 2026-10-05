import type RAPIER from '@dimforge/rapier3d-compat';
import { RAPIER as R, QUERY_STATIC } from '../physics.ts';
import type { MapDef } from '../map/types.ts';

/**
 * Multi-level navigation grid, generated from the physics world by vertical ray casts.
 * Nodes are walkable surface samples with standing clearance; edges join neighbouring cells
 * whose heights differ by at most a step (ramps), plus one-way drop-down edges off ledges.
 */
export class NavGrid {
  readonly cell: number;
  readonly ox: number;
  readonly oz: number;
  readonly nx: number;
  readonly nz: number;
  /** node positions xyz */
  pos!: Float32Array;
  count = 0;
  /** per-column first node index and count */
  colStart!: Int32Array;
  colCount!: Uint8Array;
  edgeStart!: Int32Array;
  edgeTo!: Int32Array;
  edgeCost!: Float32Array;

  // A* scratch
  private g!: Float32Array;
  private f!: Float32Array;
  private came!: Int32Array;
  private stamp!: Uint32Array;
  private closed!: Uint32Array;
  private gen = 1;
  private heap!: Int32Array;
  private heapSize = 0;

  constructor(map: MapDef, cell = 0.5) {
    this.cell = cell;
    this.ox = map.bounds.min[0];
    this.oz = map.bounds.min[1];
    this.nx = Math.ceil((map.bounds.max[0] - map.bounds.min[0]) / cell);
    this.nz = Math.ceil((map.bounds.max[1] - map.bounds.min[1]) / cell);
  }

  static build(world: RAPIER.World, map: MapDef, seed: { x: number; y: number; z: number }, cell = 0.5): NavGrid {
    const nav = new NavGrid(map, cell);
    nav.generate(world, map, seed);
    return nav;
  }

  private generate(world: RAPIER.World, map: MapDef, seed: { x: number; y: number; z: number }) {
    const { nx, nz, cell } = this;
    const radius = 0.36, half = 0.5;
    const shape = new R.Capsule(half, radius);
    const rot = { x: 0, y: 0, z: 0, w: 1 };
    const down = { x: 0, y: -1, z: 0 };
    const origin = { x: 0, y: 0, z: 0 };
    const probe = { x: 0, y: 0, z: 0 };
    const ray = new R.Ray(origin, down);

    const rawPos: number[] = [];
    const rawCol: number[] = [];
    for (let iz = 0; iz < nz; iz++) {
      for (let ix = 0; ix < nx; ix++) {
        const x = this.ox + (ix + 0.5) * cell, z = this.oz + (iz + 0.5) * cell;
        origin.x = x; origin.y = map.ceiling - 0.05; origin.z = z;
        for (let guard = 0; guard < 8 && origin.y > -0.5; guard++) {
          const hit = world.castRayAndGetNormal(ray, origin.y + 1, false, undefined, QUERY_STATIC);
          if (!hit) break;
          const y = origin.y - hit.timeOfImpact;
          if (hit.normal.y > 0.7) {
            probe.x = x; probe.y = y + radius + half + 0.12; probe.z = z;
            if (!world.intersectionWithShape(probe, rot, shape, undefined, QUERY_STATIC)) {
              rawPos.push(x, y, z);
              rawCol.push(iz * nx + ix);
            }
          }
          origin.y = y - 0.03;
        }
      }
    }

    // group by column
    const n = rawCol.length;
    const colCount = new Uint8Array(nx * nz);
    for (let i = 0; i < n; i++) colCount[rawCol[i]]++;
    const colStart = new Int32Array(nx * nz + 1);
    for (let c = 0; c < nx * nz; c++) colStart[c + 1] = colStart[c] + colCount[c];
    const fill = new Int32Array(nx * nz);
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const c = rawCol[i];
      const k = colStart[c] + fill[c]++;
      pos[k * 3] = rawPos[i * 3]; pos[k * 3 + 1] = rawPos[i * 3 + 1]; pos[k * 3 + 2] = rawPos[i * 3 + 2];
    }

    // edges
    const STEP = 0.55, DROP = 3.2;
    const adj: number[][] = Array.from({ length: n }, () => []);
    const cost: number[][] = Array.from({ length: n }, () => []);
    for (let iz = 0; iz < nz; iz++) for (let ix = 0; ix < nx; ix++) {
      const c = iz * nx + ix;
      for (let a = colStart[c]; a < colStart[c + 1]; a++) {
        const ay = pos[a * 3 + 1];
        for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dz) continue;
          const jx = ix + dx, jz = iz + dz;
          if (jx < 0 || jz < 0 || jx >= nx || jz >= nz) continue;
          const c2 = jz * nx + jx;
          // diagonal moves need both orthogonal neighbours walkable (no corner cutting)
          if (dx && dz && (!this.hasNear(colStart, pos, iz * nx + jx, ay, STEP) || !this.hasNear(colStart, pos, jz * nx + ix, ay, STEP))) continue;
          for (let b = colStart[c2]; b < colStart[c2 + 1]; b++) {
            const dy = pos[b * 3 + 1] - ay;
            const h = Math.hypot(dx, dz) * cell;
            if (Math.abs(dy) <= STEP) { adj[a].push(b); cost[a].push(h + Math.abs(dy) * 0.5); }
            else if (dy < -STEP && dy >= -DROP && !dz !== !dx) { adj[a].push(b); cost[a].push(h + 1.5); }
          }
        }
      }
    }

    // keep the component reachable from the seed (both directions so drop edges count)
    const radj: number[][] = Array.from({ length: n }, () => []);
    for (let a = 0; a < n; a++) for (const b of adj[a]) radj[b].push(a);
    this.pos = pos; this.count = n; this.colStart = colStart; this.colCount = colCount;
    const start = this.nearestRaw(seed.x, seed.y, seed.z);
    const keep = new Uint8Array(n);
    const stack = [start];
    if (start >= 0) keep[start] = 1;
    while (stack.length) {
      const a = stack.pop()!;
      for (const b of adj[a]) if (!keep[b]) { keep[b] = 1; stack.push(b); }
      for (const b of radj[a]) if (!keep[b]) { keep[b] = 1; stack.push(b); }
    }
    const remap = new Int32Array(n).fill(-1);
    let m = 0;
    for (let i = 0; i < n; i++) if (keep[i]) remap[i] = m++;
    const pos2 = new Float32Array(m * 3);
    const colCount2 = new Uint8Array(nx * nz);
    for (let c = 0; c < nx * nz; c++) for (let i = colStart[c]; i < colStart[c + 1]; i++) if (keep[i]) colCount2[c]++;
    const colStart2 = new Int32Array(nx * nz + 1);
    for (let c = 0; c < nx * nz; c++) colStart2[c + 1] = colStart2[c] + colCount2[c];
    let totalE = 0;
    for (let i = 0; i < n; i++) if (keep[i]) for (const b of adj[i]) if (keep[b]) totalE++;
    const eStart = new Int32Array(m + 1), eTo = new Int32Array(totalE), eCost = new Float32Array(totalE);
    let e = 0;
    for (let i = 0; i < n; i++) {
      if (!keep[i]) continue;
      const k = remap[i];
      pos2[k * 3] = pos[i * 3]; pos2[k * 3 + 1] = pos[i * 3 + 1]; pos2[k * 3 + 2] = pos[i * 3 + 2];
      eStart[k] = e;
      for (let j = 0; j < adj[i].length; j++) {
        const b = adj[i][j];
        if (!keep[b]) continue;
        eTo[e] = remap[b]; eCost[e] = cost[i][j]; e++;
      }
      eStart[k + 1] = e;
    }
    this.pos = pos2; this.count = m; this.colStart = colStart2; this.colCount = colCount2;
    this.edgeStart = eStart; this.edgeTo = eTo; this.edgeCost = eCost;
    this.g = new Float32Array(m); this.f = new Float32Array(m);
    this.came = new Int32Array(m); this.stamp = new Uint32Array(m); this.closed = new Uint32Array(m);
    this.heap = new Int32Array(Math.max(16, totalE + 16));
  }

  private hasNear(colStart: Int32Array, pos: Float32Array, c: number, y: number, step: number) {
    for (let i = colStart[c]; i < colStart[c + 1]; i++) if (Math.abs(pos[i * 3 + 1] - y) <= step) return true;
    return false;
  }

  private nearestRaw(x: number, y: number, z: number): number {
    const ix = Math.floor((x - this.ox) / this.cell), iz = Math.floor((z - this.oz) / this.cell);
    let best = -1, bd = Infinity;
    for (let r = 0; r < 8 && best < 0; r++) {
      for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
        const jx = ix + dx, jz = iz + dz;
        if (jx < 0 || jz < 0 || jx >= this.nx || jz >= this.nz) continue;
        const c = jz * this.nx + jx;
        for (let i = this.colStart[c]; i < this.colStart[c + 1]; i++) {
          const px = this.pos[i * 3], py = this.pos[i * 3 + 1], pz = this.pos[i * 3 + 2];
          const dy = py - y;
          // heavily prefer the level the agent stands on (or just below)
          const d = (px - x) ** 2 + (pz - z) ** 2 + (dy > 0.6 ? dy * 40 : dy < -0.6 ? -dy * 6 : 0);
          if (d < bd) { bd = d; best = i; }
        }
      }
    }
    return best;
  }

  /** Nearest node to a world position (prefers the same level), or -1. */
  nearest(x: number, y: number, z: number): number { return this.nearestRaw(x, y, z); }

  x(i: number) { return this.pos[i * 3]; }
  y(i: number) { return this.pos[i * 3 + 1]; }
  z(i: number) { return this.pos[i * 3 + 2]; }

  /** A* from node a to node b. Writes the node sequence (a..b) into `out`. Allocation-free. */
  findPath(a: number, b: number, out: number[]): boolean {
    out.length = 0;
    if (a < 0 || b < 0) return false;
    const gen = ++this.gen;
    const { g, f, came, stamp, closed, pos } = this;
    const bx = pos[b * 3], by = pos[b * 3 + 1], bz = pos[b * 3 + 2];
    const hfn = (i: number) => Math.hypot(pos[i * 3] - bx, pos[i * 3 + 2] - bz) + Math.abs(pos[i * 3 + 1] - by) * 0.5;
    this.heapSize = 0;
    stamp[a] = gen; g[a] = 0; f[a] = hfn(a); came[a] = -1;
    this.push(a);
    let iter = 0;
    while (this.heapSize > 0 && iter++ < 60000) {
      const cur = this.pop();
      if (cur === b) {
        for (let i = b; i >= 0; i = came[i]) out.push(i);
        out.reverse();
        return true;
      }
      if (closed[cur] === gen) continue;
      closed[cur] = gen;
      for (let e = this.edgeStart[cur]; e < this.edgeStart[cur + 1]; e++) {
        const nb = this.edgeTo[e];
        if (closed[nb] === gen) continue;
        const ng = g[cur] + this.edgeCost[e];
        if (stamp[nb] !== gen || ng < g[nb]) {
          stamp[nb] = gen; g[nb] = ng; f[nb] = ng + hfn(nb); came[nb] = cur;
          this.push(nb);
        }
      }
    }
    return false;
  }

  /** Random node (for wandering), deterministic given the rng value in [0,1). */
  randomNode(r: number) { return Math.min(this.count - 1, Math.floor(r * this.count)); }

  // binary min-heap on f
  private push(i: number) {
    const h = this.heap, f = this.f;
    if (this.heapSize >= h.length) { const nh = new Int32Array(h.length * 2); nh.set(h); this.heap = nh; }
    let k = this.heapSize++;
    const hp = this.heap;
    while (k > 0) {
      const p = (k - 1) >> 1;
      if (f[hp[p]] <= f[i]) break;
      hp[k] = hp[p]; k = p;
    }
    hp[k] = i;
  }
  private pop(): number {
    const h = this.heap, f = this.f;
    const top = h[0];
    const last = h[--this.heapSize];
    let k = 0;
    for (;;) {
      let c = 2 * k + 1;
      if (c >= this.heapSize) break;
      if (c + 1 < this.heapSize && f[h[c + 1]] < f[h[c]]) c++;
      if (f[h[c]] >= f[last]) break;
      h[k] = h[c]; k = c;
    }
    h[k] = last;
    return top;
  }
}
