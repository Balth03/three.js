import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import { createTrafficCarAssets, type TrafficCarAsset } from '../vehicles/carModel';
import type { RoadGraph } from '../world/RoadGraph';
import type { Terrain } from '../world/Terrain';
import { signalAxis, signalOffset } from '../world/signals';
import { signalState } from '../world/props';
import { GROUP, groups, type Physics } from '../physics/Physics';
import type { LightField } from '../render/LightField';
import { mulberry32, hash01 } from '@taxi/shared';

/** Driver personalities (Paris: assertive). */
interface Persona { desiredFactor: number; headway: number; accel: number; decel: number; patience: number }
const PERSONAS: Persona[] = [
  { desiredFactor: 1.08, headway: 1.0, accel: 2.4, decel: 3.2, patience: 1.0 }, // pressé
  { desiredFactor: 0.97, headway: 1.4, accel: 1.8, decel: 2.6, patience: 2.5 }, // normal
  { desiredFactor: 0.88, headway: 1.9, accel: 1.3, decel: 2.2, patience: 4.0 }, // prudent
];

export interface TrafficCar {
  active: boolean;
  variant: number;
  slot: number; // instance index within its variant mesh
  edge: number;
  dir: 1 | -1; // 1 = a->b
  lane: number;
  s: number; // distance travelled along the edge in travel direction
  v: number;
  vDesired: number;
  persona: Persona;
  length: number;
  width: number;
  next: number; // next edge chosen (-1 = none yet)
  nextDir: 1 | -1;
  // junction transit (quadratic Bezier)
  transit: boolean;
  tU: number; tLen: number;
  p0x: number; p0z: number; cx: number; cz: number; p1x: number; p1z: number;
  x: number; y: number; z: number; heading: number;
  waitTime: number;
  stopped: number; // > 0 => stopped by collision (seconds)
  hornCooldown: number;
  body: RAPIER.RigidBody | null;
  id: number;
  blinkLeft: boolean; blinkRight: boolean;
  brake: boolean;
}

const TMP = { x: 0, z: 0, tx: 0, tz: 0 };

/**
 * Lane-following traffic on the OSM graph: IDM car-following, traffic lights shared with the rendered signals,
 * smooth junction turns, yielding, spawn/despawn ring around the player, kinematic colliders near the player.
 */
export class TrafficSystem {
  readonly group = new THREE.Group();
  readonly cars: TrafficCar[] = [];
  private assets: TrafficCarAsset[];
  private meshes: THREE.InstancedMesh[] = [];
  private freeSlots: number[][] = [];
  private rnd = mulberry32(1234);
  maxCars = 110;
  spawnMin = 70;
  spawnMax = 380;
  despawnDist = 470;
  private byLane = new Map<number, TrafficCar[]>();
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private v3 = new THREE.Vector3();
  private s3 = new THREE.Vector3(1, 1, 1);
  private col = new THREE.Color();
  private nextId = 1;
  time = 0;
  private spawnTimer = 0;
  readonly hornEvents: Array<{ x: number; y: number; z: number }> = [];
  densityScale = 1;

  constructor(private graph: RoadGraph, private terrain: Terrain, private physics: Physics, private drivingSide: 'right' | 'left' = 'right') {
    this.assets = createTrafficCarAssets();
    const caps = this.assets.map((a) => (a.name === 'bus' ? 10 : a.name === 'taxi' ? 25 : 45));
    this.assets.forEach((a, i) => {
      const im = new THREE.InstancedMesh(a.geometry, a.material as THREE.Material, caps[i]);
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(caps[i] * 3), 3);
      im.count = caps[i];
      im.castShadow = true; im.receiveShadow = true;
      im.frustumCulled = false;
      // park all instances out of sight
      this.m.makeScale(0, 0, 0);
      for (let k = 0; k < caps[i]; k++) im.setMatrixAt(k, this.m);
      this.group.add(im);
      this.meshes.push(im);
      this.freeSlots.push(Array.from({ length: caps[i] }, (_, k) => caps[i] - 1 - k));
    });
  }

  setNight(n: number): void {
    const mat = this.assets[0].material as THREE.Material;
    const u = (mat.userData as { uniforms?: { uNight: { value: number } } }).uniforms;
    if (u) u.uNight.value = n;
  }

  private eligible(e: number): boolean {
    const d = this.graph.d;
    return !(d.flags[e] & (16 | 4)) && d.width[e] >= 4.5 && d.cls[e] <= 7;
  }

  private lanesFor(e: number, dir: 1 | -1): number {
    const d = this.graph.d;
    if (d.oneway[e]) return Math.max(1, d.lanesF[e]);
    return Math.max(1, dir === 1 ? d.lanesF[e] : d.lanesB[e]);
  }

  /** Lateral offset (to the right of travel direction) of a lane centre. */
  private laneOffset(e: number, dir: 1 | -1, lane: number): number {
    const d = this.graph.d;
    const w = d.width[e];
    const sideSign = this.drivingSide === 'right' ? 1 : -1;
    if (d.oneway[e]) {
      const n = Math.max(1, d.lanesF[e]);
      const lw = Math.min(3.4, w / n);
      // lane 0 = rightmost
      return sideSign * (lw * n * 0.5 - lw * (lane + 0.5));
    }
    const n = this.lanesFor(e, dir);
    const lw = Math.min(3.3, (w / 2) / n);
    return sideSign * (lw * (lane + 0.5));
  }

  /** World point/tangent on an edge at travel-distance s for direction dir. */
  private edgePoint(e: number, dir: 1 | -1, s: number, out: typeof TMP): void {
    const L = this.graph.d.length[e];
    if (dir === 1) this.graph.pointAt(e, s, out);
    else { this.graph.pointAt(e, L - s, out); out.tx = -out.tx; out.tz = -out.tz; }
  }

  private endNode(c: { edge: number; dir: 1 | -1 }): number { return c.dir === 1 ? this.graph.d.edgeB[c.edge] : this.graph.d.edgeA[c.edge]; }
  private trimEnd(e: number, dir: 1 | -1): number { const d = this.graph.d; return dir === 1 ? d.trimB[e] : d.trimA[e]; }
  private trimStart(e: number, dir: 1 | -1): number { const d = this.graph.d; return dir === 1 ? d.trimA[e] : d.trimB[e]; }

  /** Choose the next edge at the end node (no U-turns unless dead end), preferring straight-ish continuations. */
  private chooseNext(c: TrafficCar): void {
    const g = this.graph, d = g.d;
    const node = this.endNode(c);
    this.edgePoint(c.edge, c.dir, d.length[c.edge] - 0.5, TMP);
    const hx = TMP.tx, hz = TMP.tz;
    let total = 0;
    const cands: Array<[number, 1 | -1, number]> = [];
    for (let k = g.incOffset[node]; k < g.incOffset[node + 1]; k++) {
      const e = g.inc[k] >> 1;
      if (e === c.edge) continue;
      if (!this.eligible(e)) continue;
      const dir: 1 | -1 = d.edgeA[e] === node ? 1 : -1;
      if (!g.allowedFrom(e, node)) continue;
      this.edgePoint(e, dir, Math.min(4, d.length[e] * 0.5), TMP);
      const dot = hx * TMP.tx + hz * TMP.tz;
      if (dot < -0.6) continue; // sharp turn-backs
      let w = 0.4 + Math.max(0, dot) * 2.2 + (8 - d.cls[e]) * 0.12;
      if (d.length[e] < 6) w *= 0.6;
      cands.push([e, dir, w]); total += w;
    }
    if (cands.length === 0) {
      // dead end: U-turn on the same edge if two-way
      if (!d.oneway[c.edge]) { c.next = c.edge; c.nextDir = c.dir === 1 ? -1 : 1; } else { c.next = -1; }
      return;
    }
    let r = this.rnd() * total;
    for (const [e, dir, w] of cands) { r -= w; if (r <= 0) { c.next = e; c.nextDir = dir; break; } }
    if (c.next < 0) { c.next = cands[0][0]; c.nextDir = cands[0][1]; }
    // indicators
    this.edgePoint(c.next, c.nextDir, Math.min(4, d.length[c.next] * 0.5), TMP);
    const cross = hx * TMP.tz - hz * TMP.tx; // + = turning right (z south, x east)
    c.blinkRight = cross > 0.45; c.blinkLeft = cross < -0.45;
  }

  private spawnOne(px: number, pz: number, avoidX: number, avoidZ: number): boolean {
    const g = this.graph, d = g.d;
    for (let attempt = 0; attempt < 12; attempt++) {
      const ang = this.rnd() * Math.PI * 2;
      const r = this.spawnMin + this.rnd() * (this.spawnMax - this.spawnMin);
      const x = px + Math.cos(ang) * r, z = pz + Math.sin(ang) * r;
      const hit = { edge: 0, s: 0, dist: 0, x: 0, z: 0, side: 0, tx: 0, tz: 0 };
      if (!g.nearest(x, z, 60, hit, (e) => this.eligible(e))) continue;
      const e = hit.edge;
      // density favours big roads
      if (this.rnd() > [1, 1, 0.95, 0.8, 0.6, 0.35, 0.3, 0.15, 0.1][d.cls[e]]) continue;
      if (Math.hypot(hit.x - avoidX, hit.z - avoidZ) < this.spawnMin * 0.8) continue;
      let dir: 1 | -1 = d.oneway[e] ? 1 : this.rnd() < 0.5 ? 1 : -1;
      if (!d.oneway[e] && this.lanesFor(e, dir) === 0) dir = dir === 1 ? -1 : 1;
      const L = d.length[e];
      const s = dir === 1 ? hit.s : L - hit.s;
      if (s < this.trimStart(e, dir) + 3 || s > L - this.trimEnd(e, dir) - 6) continue;
      const lane = Math.floor(this.rnd() * this.lanesFor(e, dir));
      // free space?
      const key = e * 2 + (dir === 1 ? 0 : 1);
      const lst = this.byLane.get(key);
      if (lst && lst.some((o) => o.lane === lane && Math.abs(o.s - s) < 14)) continue;
      // variant
      const pr = this.rnd();
      const isBusRoad = d.cls[e] <= 3 && d.width[e] >= 9;
      const variant = isBusRoad && pr < 0.06 ? 5 : pr < 0.16 ? 6 : pr < 0.32 ? 0 : pr < 0.6 ? 1 : pr < 0.72 ? 2 : pr < 0.86 ? 3 : 4;
      const slots = this.freeSlots[variant];
      if (slots.length === 0) continue;
      const slot = slots.pop()!;
      const a = this.assets[variant];
      const speedLimit = Math.max(20, d.speed[e]) / 3.6;
      const persona = PERSONAS[Math.floor(this.rnd() * PERSONAS.length)];
      const car: TrafficCar = {
        active: true, variant, slot, edge: e, dir, lane, s, v: speedLimit * 0.6, vDesired: speedLimit * persona.desiredFactor,
        persona, length: a.length, width: a.width, next: -1, nextDir: 1, transit: false, tU: 0, tLen: 1,
        p0x: 0, p0z: 0, cx: 0, cz: 0, p1x: 0, p1z: 0, x: 0, y: 0, z: 0, heading: 0, waitTime: 0, stopped: 0, hornCooldown: 0,
        body: null, id: this.nextId++, blinkLeft: false, blinkRight: false, brake: false,
      };
      const pal = a.palette;
      this.col.set(pal[Math.floor(hash01(car.id * 31) * pal.length)]);
      this.meshes[variant].setColorAt(slot, this.col);
      this.meshes[variant].instanceColor!.needsUpdate = true;
      this.cars.push(car);
      this.chooseNext(car);
      return true;
    }
    return false;
  }

  private despawn(c: TrafficCar): void {
    c.active = false;
    this.m.makeScale(0, 0, 0);
    this.meshes[c.variant].setMatrixAt(c.slot, this.m);
    this.freeSlots[c.variant].push(c.slot);
    if (c.body) { this.physics.world.removeRigidBody(c.body); c.body = null; }
  }

  private rebuildLanes(): void {
    for (const l of this.byLane.values()) l.length = 0;
    for (const c of this.cars) {
      if (!c.active || c.transit) continue;
      const key = c.edge * 2 + (c.dir === 1 ? 0 : 1);
      let l = this.byLane.get(key);
      if (!l) { l = []; this.byLane.set(key, l); }
      l.push(c);
    }
  }

  /** Gap to the vehicle ahead in the same lane (current edge + next edge), returns [gap, leaderSpeed]. */
  private leader(c: TrafficCar, out: { gap: number; v: number }): void {
    out.gap = 1e9; out.v = 0;
    const key = c.edge * 2 + (c.dir === 1 ? 0 : 1);
    const lst = this.byLane.get(key);
    if (lst) for (const o of lst) {
      if (o === c || (o.lane !== c.lane && !(Math.abs(o.lane - c.lane) === 1 && o.width > 2.3))) continue;
      const gap = o.s - c.s - (o.length + c.length) / 2;
      if (o.s > c.s && gap < out.gap) { out.gap = gap; out.v = o.stopped > 0 ? 0 : o.v; }
    }
    if (out.gap > 60 && c.next >= 0) {
      const rem = this.graph.d.length[c.edge] - c.s;
      const l2 = this.byLane.get(c.next * 2 + (c.nextDir === 1 ? 0 : 1));
      if (l2) for (const o of l2) {
        const gap = rem + o.s - (o.length + c.length) / 2;
        if (gap < out.gap) { out.gap = gap; out.v = o.stopped > 0 ? 0 : o.v; }
      }
      // cars crossing the junction ahead
      for (const o of this.cars) {
        if (!o.active || !o.transit || o === c) continue;
        if (this.endNode(c) !== (o.dir === 1 ? this.graph.d.edgeB[o.edge] : this.graph.d.edgeA[o.edge])) continue;
        if (o.edge === c.edge && o.dir === c.dir) {
          // same approach: follow it through the junction
          const gapF = rem + o.tU * o.tLen - (o.length + c.length) / 2;
          if (o.lane === c.lane && gapF < out.gap) { out.gap = gapF; out.v = o.v; }
          continue;
        }
        const gap = rem - this.trimEnd(c.edge, c.dir) - c.length / 2 - 1;
        if (gap < out.gap) { out.gap = Math.max(0, gap); out.v = 0; }
      }
    }
  }

  private lead = { gap: 0, v: 0 };

  update(dt: number, player: { x: number; z: number; vx: number; vz: number; fx: number; fz: number } | null, camX: number, camZ: number, lightField: LightField | null, night: number): void {
    this.time += dt;
    const g = this.graph, d = g.d;
    const px = player ? player.x : camX, pz = player ? player.z : camZ;
    // spawn / despawn
    this.spawnTimer -= dt;
    const active = this.cars.filter((c) => c.active).length;
    const target = Math.floor(this.maxCars * this.densityScale);
    if (this.spawnTimer <= 0 && active < target) {
      this.spawnTimer = active < target * 0.5 ? 0 : 0.05;
      for (let k = 0; k < (active < target * 0.5 ? 8 : 1); k++) this.spawnOne(px, pz, camX, camZ);
    }
    for (const c of this.cars) if (c.active && Math.hypot(c.x - px, c.z - pz) > this.despawnDist && c.x !== 0) this.despawn(c);
    for (let i = this.cars.length - 1; i >= 0; i--) if (!this.cars[i].active) this.cars.splice(i, 1);
    this.rebuildLanes();
    this.hornEvents.length = 0;
    // simulate
    for (const c of this.cars) {
      if (!c.active) continue;
      c.hornCooldown -= dt;
      if (c.stopped > 0) { c.stopped -= dt; c.v = Math.max(0, c.v - 8 * dt); this.place(c); continue; }
      const L = d.length[c.edge];
      let aIdm: number;
      const v0 = c.vDesired;
      const p = c.persona;
      if (!c.transit) {
        this.leader(c, this.lead);
        let gap = this.lead.gap, vl = this.lead.v;
        // traffic light / junction stop line
        const node = this.endNode(c);
        const stopS = L - this.trimEnd(c.edge, c.dir) - (d.nodeSignal[node] ? 5.8 : 1.0);
        if (d.nodeSignal[node] && d.nodeJunction[node] >= 0) {
          const axis = signalAxis(g, node, c.edge);
          const st = signalState(this.time + signalOffset(node), axis);
          const distStop = stopS - c.s - c.length / 2;
          const canStop = distStop > (c.v * c.v) / (2 * 4.5);
          if ((st === 2 || (st === 1 && canStop)) && distStop > -1 && distStop < gap) { gap = Math.max(0, distStop); vl = 0; }
        } else if (c.next >= 0 && d.cls[c.next] < d.cls[c.edge] - 1) {
          // entering a more important road: slow down & yield if someone is close on it
          const distStop = stopS - c.s - c.length / 2;
          if (distStop < 12 && distStop > -1) {
            const busy = (this.byLane.get(c.next * 2 + (c.nextDir === 1 ? 0 : 1)) ?? []).some((o) => o.s < 25 && o.v > 2);
            if (busy && c.waitTime < p.patience * 3) { gap = Math.min(gap, Math.max(0, distStop)); vl = 0; c.waitTime += dt; } else c.waitTime = 0;
          }
        }
        // player as obstacle in our lane
        if (player) {
          this.edgePoint(c.edge, c.dir, c.s, TMP);
          const dx = player.x - c.x, dz = player.z - c.z;
          const ahead = dx * TMP.tx + dz * TMP.tz;
          const lat = Math.abs(dx * -TMP.tz + dz * TMP.tx);
          if (ahead > 0 && ahead < 60 && lat < 2.4) {
            const pv = player.vx * TMP.tx + player.vz * TMP.tz;
            const gapP = ahead - c.length / 2 - 2.5;
            if (gapP < gap) { gap = Math.max(0, gapP); vl = Math.max(0, pv); }
            // honk at a stopped/slow player blocking the lane (Paris!)
            if (gapP < 8 && pv < 1 && c.v < 1 && c.hornCooldown < 0 && this.rnd() < 0.01) { c.hornCooldown = 6; this.hornEvents.push({ x: c.x, y: c.y, z: c.z }); }
          }
        }
        // curvature speed limit before the turn
        let vTarget = v0;
        if (c.next >= 0 && L - c.s < 40) {
          this.edgePoint(c.edge, c.dir, L - 0.5, TMP);
          const hx = TMP.tx, hz = TMP.tz;
          this.edgePoint(c.next, c.nextDir, Math.min(4, d.length[c.next] * 0.5), TMP);
          const dot = hx * TMP.tx + hz * TMP.tz;
          const vTurn = 4.5 + Math.max(0, dot) * 10;
          vTarget = Math.min(v0, vTurn + (L - c.s) * 0.35);
        }
        // IDM
        const s0 = 2.2, T = p.headway, a = p.accel, b = p.decel;
        const dv = c.v - vl;
        const sStar = s0 + Math.max(0, c.v * T + (c.v * dv) / (2 * Math.sqrt(a * b)));
        aIdm = a * (1 - Math.pow(c.v / Math.max(0.5, vTarget), 4) - Math.pow(sStar / Math.max(0.3, gap), 2));
        aIdm = Math.max(-9, Math.min(a, aIdm));
        c.v = Math.max(0, c.v + aIdm * dt);
        c.brake = aIdm < -0.8 || (c.v < 0.3 && gap < 6);
        c.s += c.v * dt;
        // enter junction transit at the trimmed end
        if (c.s >= L - this.trimEnd(c.edge, c.dir)) {
          if (c.next < 0) { this.despawn(c); continue; }
          this.beginTransit(c);
        }
      } else {
        // in the junction: keep moving, no stopping unless the player is right in front
        let vT = Math.max(4, Math.min(c.vDesired, 9));
        if (player) {
          const dx = player.x - c.x, dz = player.z - c.z;
          const hx = Math.sin(c.heading), hz = -Math.cos(c.heading);
          const ahead = dx * hx + dz * hz, lat = Math.abs(-dx * hz + dz * hx);
          if (ahead > 0 && ahead < 9 && lat < 2.2) vT = 0;
        }
        c.v += Math.max(-8, Math.min(2, (vT - c.v) * 2)) * dt;
        c.v = Math.max(0, c.v);
        c.tU += (c.v * dt) / Math.max(0.5, c.tLen);
        c.brake = vT < c.v - 1;
        if (c.tU >= 1) this.endTransit(c);
      }
      this.place(c);
    }
    this.syncInstances(player, lightField, night);
  }

  private beginTransit(c: TrafficCar): void {
    const d = this.graph.d;
    this.edgePoint(c.edge, c.dir, d.length[c.edge] - this.trimEnd(c.edge, c.dir), TMP);
    const off0 = this.laneOffset(c.edge, c.dir, c.lane);
    c.p0x = TMP.x - TMP.tz * off0; c.p0z = TMP.z + TMP.tx * off0;
    const t0x = TMP.tx, t0z = TMP.tz;
    // lane on the next edge: keep relative lane if possible
    const nl = this.lanesFor(c.next, c.nextDir);
    const newLane = Math.min(nl - 1, c.lane);
    const s1 = this.trimStart(c.next, c.nextDir);
    this.edgePoint(c.next, c.nextDir, Math.min(d.length[c.next] * 0.5, s1), TMP);
    const off1 = this.laneOffset(c.next, c.nextDir, newLane);
    c.p1x = TMP.x - TMP.tz * off1; c.p1z = TMP.z + TMP.tx * off1;
    // control point: intersection of the two tangents (fallback: midpoint pushed to the node)
    const t1x = TMP.tx, t1z = TMP.tz;
    const den = t0x * t1z - t0z * t1x;
    if (Math.abs(den) > 0.15) {
      const tt = ((c.p1x - c.p0x) * t1z - (c.p1z - c.p0z) * t1x) / den;
      c.cx = c.p0x + t0x * tt; c.cz = c.p0z + t0z * tt;
      if (tt < 0 || tt > 60) { c.cx = (c.p0x + c.p1x) / 2; c.cz = (c.p0z + c.p1z) / 2; }
    } else { c.cx = (c.p0x + c.p1x) / 2; c.cz = (c.p0z + c.p1z) / 2; }
    c.tLen = Math.max(0.5, Math.hypot(c.cx - c.p0x, c.cz - c.p0z) + Math.hypot(c.p1x - c.cx, c.p1z - c.cz));
    c.tU = 0;
    c.transit = true;
    c.lane = newLane;
  }

  private endTransit(c: TrafficCar): void {
    c.transit = false;
    c.edge = c.next; c.dir = c.nextDir;
    c.s = Math.min(this.graph.d.length[c.edge] * 0.5, this.trimStart(c.edge, c.dir));
    const sp = Math.max(20, this.graph.d.speed[c.edge]) / 3.6;
    c.vDesired = sp * c.persona.desiredFactor;
    c.next = -1;
    c.waitTime = 0;
    this.chooseNext(c);
  }

  private place(c: TrafficCar): void {
    if (c.transit) {
      const u = Math.min(1, c.tU), iu = 1 - u;
      c.x = iu * iu * c.p0x + 2 * iu * u * c.cx + u * u * c.p1x;
      c.z = iu * iu * c.p0z + 2 * iu * u * c.cz + u * u * c.p1z;
      const dx = 2 * iu * (c.cx - c.p0x) + 2 * u * (c.p1x - c.cx);
      const dz = 2 * iu * (c.cz - c.p0z) + 2 * u * (c.p1z - c.cz);
      if (dx * dx + dz * dz > 1e-6) c.heading = Math.atan2(dx, -dz);
    } else {
      this.edgePoint(c.edge, c.dir, c.s, TMP);
      const off = this.laneOffset(c.edge, c.dir, c.lane);
      c.x = TMP.x - TMP.tz * off; c.z = TMP.z + TMP.tx * off;
      c.heading = Math.atan2(TMP.tx, -TMP.tz);
    }
    c.y = this.terrain.height(c.x, c.z) + 0.03;
  }

  private syncInstances(player: { x: number; z: number } | null, lf: LightField | null, night: number): void {
    const near2 = 90 * 90;
    for (const c of this.cars) {
      if (!c.active) continue;
      // pitch along the slope
      const fx = Math.sin(c.heading), fz = -Math.cos(c.heading);
      const half = (this.assets[c.variant].wheelbase || 2.6) / 2;
      const yF = this.terrain.height(c.x + fx * half, c.z + fz * half), yB = this.terrain.height(c.x - fx * half, c.z - fz * half);
      const pitch = Math.atan2(yF - yB, half * 2);
      this.q.setFromEuler(new THREE.Euler(pitch, -c.heading, 0, 'YXZ'));
      this.v3.set(c.x, c.y, c.z);
      this.m.compose(this.v3, this.q, this.s3);
      this.meshes[c.variant].setMatrixAt(c.slot, this.m);
      // kinematic collider near the player
      const dpx = player ? c.x - player.x : 1e9, dpz = player ? c.z - player.z : 1e9;
      const near = dpx * dpx + dpz * dpz < near2;
      if (near && !c.body) {
        const R = this.physics.R;
        const a = this.assets[c.variant];
        c.body = this.physics.world.createRigidBody(R.RigidBodyDesc.kinematicPositionBased().setTranslation(c.x, c.y, c.z));
        this.physics.world.createCollider(R.ColliderDesc.cuboid(a.width / 2 - 0.05, a.height / 2 - 0.1, a.length / 2 - 0.1).setTranslation(0, a.height / 2 + 0.05, 0)
          .setCollisionGroups(groups(GROUP.TRAFFIC, GROUP.PLAYER | GROUP.PROP)).setFriction(0.4), c.body);
      } else if (!near && c.body) { this.physics.world.removeRigidBody(c.body); c.body = null; }
      if (c.body) {
        c.body.setNextKinematicTranslation({ x: c.x, y: c.y, z: c.z });
        c.body.setNextKinematicRotation({ x: this.q.x, y: this.q.y, z: this.q.z, w: this.q.w });
      }
      if (lf && night > 0.2) lf.addCone(c.x + fx * 2.3, c.z + fz * 2.3, fx, fz, 22, 10, 0.9, 0.85, 0.75);
    }
    for (const im of this.meshes) im.instanceMatrix.needsUpdate = true;
  }

  /** Called when the player hits a traffic car (by collider handle). */
  onPlayerHit(impulse: number, px: number, pz: number): void {
    let best: TrafficCar | null = null, bd = 6;
    for (const c of this.cars) { const dd = Math.hypot(c.x - px, c.z - pz); if (dd < bd) { bd = dd; best = c; } }
    if (best && impulse > 800) {
      best.stopped = 4 + Math.min(6, impulse / 2000);
      if (best.hornCooldown < 0) { best.hornCooldown = 5; this.hornEvents.push({ x: best.x, y: best.y, z: best.z }); }
    }
  }

  /** Nearest cars for spatial audio. */
  nearest(x: number, z: number, n: number, out: TrafficCar[]): TrafficCar[] {
    out.length = 0;
    const arr = this.cars.filter((c) => c.active).sort((a, b) => Math.hypot(a.x - x, a.z - z) - Math.hypot(b.x - x, b.z - z));
    for (let i = 0; i < Math.min(n, arr.length); i++) out.push(arr[i]);
    return out;
  }
}
