import * as THREE from 'three';
import { fetchBytes, fetchJson } from '../core/fetchData';
import { RoadGraph, buildRoadGraphData, type RoadGraphData } from './RoadGraph';
import { Terrain } from './Terrain';
import type { CityMeta, RawRoads } from './types';
import type { TileBuildResult, TileStyle } from './tileBuilder';
import type { GeoData } from './geoBuilder';
import * as M from '../render/materials/world';
import { Instances } from './Instances';
import type { Physics } from '../physics/Physics';

export interface CityConfig { id: string; name: { fr: string; en: string }; drivingSide: 'right' | 'left'; style: TileStyle['style']; currency: string }
export interface Poi { name: string; cat: string; x: number; z: number; addr: string }

/** Loaded static city data: meta, road graph, terrain, POIs. */
export class City {
  constructor(
    readonly config: CityConfig,
    readonly meta: CityMeta,
    readonly graphData: RoadGraphData,
    readonly graph: RoadGraph,
    readonly terrain: Terrain,
    readonly pois: Poi[],
    readonly baseUrl: string,
  ) {}

  static async load(id: string, onProgress: (p: number, label: string) => void): Promise<City> {
    const base = `${import.meta.env.BASE_URL}cities/${id}`;
    onProgress(0.02, 'Configuration');
    const config = await fetchJson<CityConfig>(`${import.meta.env.BASE_URL}cities/${id}.json`);
    const meta = await fetchJson<CityMeta>(`${base}/meta.json`);
    onProgress(0.08, 'Relief');
    const terrain = Terrain.decode(await fetchBytes(`${base}/${meta.terrain.file}`), meta.terrain);
    onProgress(0.2, 'Réseau routier');
    const raw = await fetchJson<RawRoads>(`${base}/roads.json.gz`);
    onProgress(0.45, 'Graphe');
    const gd = buildRoadGraphData(raw);
    const graph = new RoadGraph(gd);
    onProgress(0.55, "Points d'intérêt");
    const pj = await fetchJson<{ pois: Array<[string, string, number, number, string]> }>(`${base}/pois.json.gz`);
    const pois = pj.pois.map(([name, cat, x, z, addr]) => ({ name, cat, x: x / 10, z: z / 10, addr }));
    return new City(config, meta, gd, graph, terrain, pois, base);
  }
}

interface LoadedTile { key: string; i: number; j: number; group: THREE.Group; geometries: THREE.BufferGeometry[]; materials: THREE.Material[]; textures: THREE.Texture[]; lights: Float32Array; result: TileBuildResult }

/** Streams 256 m tiles around a focus point: worker pool -> meshes + physics + instances. */
export class WorldStreamer {
  readonly group = new THREE.Group();
  readonly instances: Instances;
  private workers: Worker[] = [];
  private busy: boolean[] = [];
  private ready = 0;
  private loaded = new Map<string, LoadedTile>();
  private pending = new Map<string, number>(); // key -> request id
  private nextId = 1;
  private reqKeys = new Map<number, { key: string; i: number; j: number; worker: number }>();
  private available: Set<string>;
  radius = 700;
  readonly materials = {
    walls: M.createFacadeMaterial(),
    roofs: M.createRoofMaterial(),
    roads: M.createRoadMaterial(),
    curbs: M.createCurbMaterial(),
    marks: M.createMarkingMaterial(),
    water: M.createWaterMaterial(),
    stone: M.createStoneMaterial(),
  };
  stats = { tiles: 0, pending: 0, buildMs: 0, tris: 0 };
  onTileLoaded: ((t: TileBuildResult) => void) | null = null;
  onTileUnloaded: ((i: number, j: number) => void) | null = null;

  constructor(readonly city: City, private physics: Physics | null, shadows: boolean) {
    this.instances = new Instances(shadows);
    this.group.add(this.instances.group);
    this.available = new Set(city.meta.tiles.map(([i, j]) => `${i}_${j}`));
    const n = Math.max(2, Math.min(4, (navigator.hardwareConcurrency || 4) - 1));
    const style: TileStyle = {
      city: city.config.id, style: city.config.style, waterLevel: city.meta.waterLevel, tileSize: city.meta.tileSize,
      groundCells: city.meta.groundCells, drivingSide: city.config.drivingSide,
    };
    for (let w = 0; w < n; w++) {
      const worker = new Worker(new URL('./tile.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (ev) => this.onMessage(w, ev.data);
      worker.postMessage({ type: 'init', graph: city.graphData, terrain: { heights: city.terrain.heights, x0: city.terrain.x0, z0: city.terrain.z0, step: city.terrain.step, nx: city.terrain.nx, nz: city.terrain.nz }, style, baseUrl: city.baseUrl });
      this.workers.push(worker);
      this.busy.push(false);
    }
  }

  get isReady(): boolean { return this.ready === this.workers.length; }
  get loadedCount(): number { return this.loaded.size; }
  get pendingCount(): number { return this.pending.size; }

  private onMessage(w: number, msg: { type: string; id?: number; result?: TileBuildResult; ms?: number; error?: string }): void {
    if (msg.type === 'ready') { this.ready++; return; }
    this.busy[w] = false;
    const req = msg.id !== undefined ? this.reqKeys.get(msg.id) : undefined;
    if (!req) return;
    this.reqKeys.delete(msg.id!);
    if (this.pending.get(req.key) !== msg.id) return; // cancelled
    this.pending.delete(req.key);
    if (msg.type === 'error') { console.warn('tile error', req.key, msg.error); this.available.delete(req.key); return; }
    if (msg.result) { this.stats.buildMs = this.stats.buildMs * 0.8 + (msg.ms ?? 0) * 0.2; this.addTile(msg.result); }
  }

  private makeGeometry(g: GeoData): THREE.BufferGeometry {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(g.position, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(g.normal, 3));
    for (const k in g.attrs) geo.setAttribute(k, new THREE.BufferAttribute(g.attrs[k].array, g.attrs[k].itemSize));
    geo.setIndex(new THREE.BufferAttribute(g.index, 1));
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    return geo;
  }

  private addTile(r: TileBuildResult): void {
    const key = `${r.i}_${r.j}`;
    const group = new THREE.Group();
    group.position.set(r.ox, 0, r.oz);
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const add = (name: string, mat: THREE.Material, cast: boolean, receive: boolean) => {
      const g = r.meshes[name];
      if (!g) return;
      const geo = this.makeGeometry(g);
      geometries.push(geo);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = cast; mesh.receiveShadow = receive;
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      mesh.name = name;
      group.add(mesh);
    };
    // ground: per-tile material for the mask texture
    let mask: THREE.Texture | null = null;
    if (r.groundMask) {
      mask = new THREE.Texture(r.groundMask as unknown as HTMLImageElement);
      mask.flipY = false; mask.needsUpdate = true; mask.colorSpace = THREE.NoColorSpace;
      mask.minFilter = THREE.LinearMipmapLinearFilter; mask.magFilter = THREE.LinearFilter; mask.generateMipmaps = true;
      textures.push(mask);
    }
    const groundMat = M.createGroundMaterial(mask, new THREE.Vector2(r.ox, r.oz), this.city.meta.tileSize);
    materials.push(groundMat);
    add('ground', groundMat, false, true);
    add('walls', this.materials.walls, true, true);
    add('roofs', this.materials.roofs, true, true);
    add('roads', this.materials.roads, false, true);
    add('curbs', this.materials.curbs, false, true);
    add('marks', this.materials.marks, false, true);
    add('water', this.materials.water, false, false);
    add('stone', this.materials.stone, true, true);
    group.matrixAutoUpdate = false;
    group.updateMatrix();
    this.group.add(group);
    this.loaded.set(key, { key, i: r.i, j: r.j, group, geometries, materials, textures, lights: r.lights, result: r });
    this.instances.addTile(key, r.ox, r.oz, r.instances);
    this.physics?.addTile(r);
    this.stats.tris += r.stats.tris;
    this.onTileLoaded?.(r);
  }

  private removeTile(key: string): void {
    const t = this.loaded.get(key);
    if (!t) return;
    this.group.remove(t.group);
    for (const g of t.geometries) g.dispose();
    for (const m of t.materials) m.dispose();
    for (const tx of t.textures) { tx.dispose(); (tx.image as ImageBitmap | undefined)?.close?.(); }
    this.loaded.delete(key);
    this.instances.removeTile(key);
    this.physics?.removeTile(t.i, t.j);
    this.stats.tris -= t.result.stats.tris;
    this.onTileUnloaded?.(t.i, t.j);
  }

  /** Lamp positions from loaded tiles (world space) for the light field. */
  forEachLight(cb: (x: number, y: number, z: number, kind: number) => void): void {
    for (const t of this.loaded.values()) {
      const L = t.lights;
      const ox = t.result.ox, oz = t.result.oz;
      for (let k = 0; k < L.length; k += 4) cb(L[k] + ox, L[k + 1], L[k + 2] + oz, L[k + 3]);
    }
  }

  isLoadedAt(x: number, z: number): boolean {
    const S = this.city.meta.tileSize;
    return this.loaded.has(`${Math.floor(x / S)}_${Math.floor(z / S)}`);
  }

  update(focus: THREE.Vector3, velocity?: THREE.Vector3): void {
    if (!this.isReady) return;
    const S = this.city.meta.tileSize;
    // look-ahead in the direction of travel
    const fx = focus.x + (velocity ? velocity.x * 2.5 : 0), fz = focus.z + (velocity ? velocity.z * 2.5 : 0);
    const R = this.radius;
    const want: Array<{ key: string; i: number; j: number; d: number }> = [];
    const i0 = Math.floor((fx - R) / S), i1 = Math.floor((fx + R) / S), j0 = Math.floor((fz - R) / S), j1 = Math.floor((fz + R) / S);
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const cx = (i + 0.5) * S, cz = (j + 0.5) * S;
      const d = Math.hypot(cx - fx, cz - fz);
      if (d > R + S * 0.5) continue;
      const key = `${i}_${j}`;
      if (!this.available.has(key)) continue;
      want.push({ key, i, j, d });
    }
    // unload far tiles
    for (const [key, t] of this.loaded) {
      const d = Math.hypot((t.i + 0.5) * S - focus.x, (t.j + 0.5) * S - focus.z);
      if (d > R + S * 1.5) this.removeTile(key);
    }
    for (const [key, id] of this.pending) {
      const [i, j] = key.split('_').map(Number);
      const d = Math.hypot((i + 0.5) * S - focus.x, (j + 0.5) * S - focus.z);
      if (d > R + S * 1.5) { this.pending.delete(key); this.reqKeys.delete(id); }
    }
    want.sort((a, b) => a.d - b.d);
    for (const w of want) {
      if (this.loaded.has(w.key) || this.pending.has(w.key)) continue;
      const free = this.busy.indexOf(false);
      if (free < 0) break;
      const id = this.nextId++;
      this.busy[free] = true;
      this.pending.set(w.key, id);
      this.reqKeys.set(id, { key: w.key, i: w.i, j: w.j, worker: free });
      this.workers[free].postMessage({ type: 'build', i: w.i, j: w.j, id });
    }
    this.instances.update(focus);
    this.stats.tiles = this.loaded.size;
    this.stats.pending = this.pending.size;
  }

  dispose(): void {
    for (const w of this.workers) w.terminate();
    for (const k of [...this.loaded.keys()]) this.removeTile(k);
  }
}
