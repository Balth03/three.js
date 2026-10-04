/**
 * Instanced, procedurally animated pedestrians (1 draw call per mesh, + 1 per shadow pass).
 *
 * ## Coordinate conventions
 * - Model space: character faces +Z, +X is the character's left, feet on y = 0.
 * - `setTransform(i, x, y, z, heading)`: heading 0 = facing -Z (north); positive heading turns clockwise seen from
 *   above, i.e. towards +X (east) — compass convention. Facing vector = (sin h, 0, -cos h). y = ground height at feet.
 *
 * ## Animation timing (CPU cost ~0 per frame)
 * The shader advances the phase itself: phase(t) = fract(phaseOffset + uTime * rate). The game calls `setAnim` only
 * when the animation or the speed changes (calling it every frame with identical values is a no-op). Changing the
 * animation cross-fades over 0.3 s on the GPU. Walk/Run take the ground speed (m/s) and derive cadence + stride from
 * the pedestrian's height so the feet roughly match the root motion the game applies. Flinch is one-shot (phase
 * clamps at 1). `getPhase(i)` returns the current phase (e.g. to hand an instance over from the far to the near LOD).
 *
 * ## Per-instance attributes
 *   instanceMatrix  rigid transform (translation + heading)
 *   iAnim     vec4  (anim id, phase offset, phase rate [cycles/s], speed [m/s] or playback param)
 *   iAnimPrev vec4  (previous anim id, previous phase offset, previous rate, cross-fade start time)
 *   iLook     vec4  (height scale = height/1.75, build/width scale, feminine shape 0..1, age/stoop 0..1)
 *   iColors0  vec4  (skin, hair, top, bottom) packed sRGB 0xRRGGBB as float (exact up to 2^24)
 *   iColors1  vec4  (shoes, coat/outer layer, accent [scarf, beanie, tie, stripes], style bits)
 *   iColors2  vec4  (bag, umbrella, legwear [tights], variation seed 0..1)
 * Uniform: uTime (seconds, rebased internally every 600 s to keep float precision).
 */
import * as THREE from 'three';
import { buildPedGeometry, type Lod, PIVOT } from './pedGeometry';
import { PED_FRAGMENT_PARS, PED_VERTEX_PARS } from './pedShader';

export enum PedAnim { Idle = 0, Walk = 1, Run = 2, Hail = 3, Phone = 4, Sit = 5, Umbrella = 6, Flinch = 7, Photo = 8 }

/**
 * Style bit flags (`PedAppearance.style`).
 * bits 0-1  outer layer: 0 none (sweater/shirt), 1 jacket (hip length), 2 long coat (knee), 3 trench coat (knee, belted)
 * bit 2     skirt / dress instead of trousers (legs show legwear colour = tights, or skin with BARE_LEGS)
 * bit 3     short skirt (knee length instead of midi)
 * bits 4-5  headwear: 0 none, 1 beanie, 2 cap, 3 brimmed felt hat
 * bits 6-7  hair: 0 short, 1 long (shoulder length), 2 bun, 3 bald / receding
 * bit 8     scarf
 * bit 9     backpack
 * bit 10    handbag (carried in the left hand)
 * bit 11    umbrella (held open in the right hand while idle/walking; always shown with PedAnim.Umbrella)
 * bit 12    beard
 * bit 13    suit (shirt + tie inside the jacket V)
 * bit 14    Breton stripes on the top (accent colour)
 * bit 15    bare legs under the skirt (instead of tights)
 */
export const PedStyle = {
  OUTER_NONE: 0, OUTER_JACKET: 1, OUTER_COAT: 2, OUTER_TRENCH: 3, OUTER_MASK: 3,
  SKIRT: 1 << 2, SKIRT_SHORT: 1 << 3,
  HAT_NONE: 0, HAT_BEANIE: 1 << 4, HAT_CAP: 2 << 4, HAT_FELT: 3 << 4, HAT_MASK: 3 << 4,
  HAIR_SHORT: 0, HAIR_LONG: 1 << 6, HAIR_BUN: 2 << 6, HAIR_BALD: 3 << 6, HAIR_MASK: 3 << 6,
  SCARF: 1 << 8, BACKPACK: 1 << 9, HANDBAG: 1 << 10, UMBRELLA: 1 << 11, BEARD: 1 << 12, SUIT: 1 << 13,
  STRIPES: 1 << 14, BARE_LEGS: 1 << 15,
} as const;

export interface PedAppearance {
  /** metres (1.55–1.95 adults, ~1.1–1.4 children) */
  height: number;
  /** 0.85 slim … 1.0 average … 1.35 heavy */
  build: number;
  /** 0 masculine … 1 feminine body shape */
  feminine: number;
  /** 0 young … 1 elderly (stoop, slower, smaller gait) */
  age: number;
  skin: THREE.ColorRepresentation;
  hair: THREE.ColorRepresentation;
  top: THREE.ColorRepresentation;
  bottom: THREE.ColorRepresentation;
  shoes: THREE.ColorRepresentation;
  /** outer layer (coat / jacket), defaults to a dark neutral */
  coat?: THREE.ColorRepresentation;
  /** scarf / beanie / tie / stripes colour */
  accent?: THREE.ColorRepresentation;
  bag?: THREE.ColorRepresentation;
  umbrella?: THREE.ColorRepresentation;
  /** tights colour under skirts */
  legwear?: THREE.ColorRepresentation;
  /** bit flags, see PedStyle */
  style: number;
  /** 0..1 variation seed (idle timing, secondary choices) */
  seed?: number;
}

// ------------------------------------------------------------------------------------------------------------------
// Appearance palette
// ------------------------------------------------------------------------------------------------------------------

const SKIN = ['#f3d5c0', '#ecc6aa', '#e2b593', '#d6a47f', '#c99068', '#b57a52', '#9e6642', '#865235', '#6e4129', '#58331f', '#47291a'];
const SKIN_W = [6, 9, 10, 9, 7, 5, 4, 4, 3, 3, 2];
const HAIR_YOUNG = ['#17110d', '#241812', '#33231a', '#4a3324', '#5e432d', '#7a5a3c', '#9b7a52', '#b89566', '#5a2a18'];
const HAIR_YOUNG_W = [7, 8, 7, 6, 4, 3, 2, 2, 1];
const HAIR_OLD = ['#6d6863', '#8d8882', '#aaa59e', '#c9c4bc', '#3b3029'];
const NEUTRAL_TOPS = ['#1c2333', '#141416', '#2b2c30', '#5d6064', '#9b9ea2', '#e6e3dc', '#ddd2bd', '#c2ae92', '#3a3f4a', '#26303f'];
const ACCENT_TOPS = ['#6a1f26', '#2d4231', '#b88a2a', '#8e4025', '#3d5878', '#8fa9c4', '#c77d8a', '#4b3a5c', '#a9542f'];
const COATS = ['#9b7449', '#151517', '#1d2433', '#2b2d31', '#53565a', '#3c3328', '#4a4a35', '#5c2328', '#6b6f73'];
const COATS_W = [6, 8, 8, 6, 4, 2, 2, 1, 2];
const TRENCH = ['#b9a37e', '#a8956f', '#c2b08d', '#8d7a5a', '#262a2e'];
const BOTTOMS = ['#26344c', '#3a4d6b', '#4f6584', '#1b1b1f', '#46474b', '#b3a183', '#1f2637', '#4a3a2c', '#6b6b66'];
const BOTTOMS_W = [8, 6, 3, 7, 4, 3, 4, 2, 2];
const SKIRTS = ['#151517', '#1d2433', '#4a4b4f', '#5c2328', '#6b5a45', '#2d4231', '#9b7449'];
const SHOES_DARK = ['#121212', '#1a1714', '#3d2718', '#5a3a22', '#2a2a2c'];
const SHOES_LIGHT = ['#e8e6e1', '#d9d6cf', '#9a9a98'];
const ACCENTS = ['#8c1c1c', '#b88a2a', '#7a7d80', '#e2d9c6', '#1d2433', '#2d4231', '#c77d8a', '#3d6a8a', '#d06030', '#5a3a5f'];
const UMBRELLAS = ['#0f0f11', '#14192a', '#1d2b22', '#3a1416', '#26282c', '#1a1a1a'];
const BAGS = ['#1a1412', '#4a2f1e', '#7a5232', '#151517', '#8a6a4a', '#5c2328'];
const TIGHTS = ['#141416', '#1c1c20', '#2a2420', '#4a3a30'];

function pick<T>(rng: () => number, arr: readonly T[], w?: readonly number[]): T {
  if (!w) return arr[Math.floor(rng() * arr.length) % arr.length];
  let tot = 0;
  for (const x of w) tot += x;
  let r = rng() * tot;
  for (let i = 0; i < arr.length; i++) { r -= w[i]; if (r <= 0) return arr[i]; }
  return arr[arr.length - 1];
}
function gauss(rng: () => number): number { return (rng() + rng() + rng() - 1.5) / 0.5; }

/** Plausible Parisian passer-by. */
export function randomAppearance(rng: () => number, ctx: { rain?: boolean; night?: boolean; tourist?: boolean } = {}): PedAppearance {
  const r = rng();
  const child = r < 0.06;
  const elderly = !child && rng() < 0.16;
  const fem = rng() < 0.52;
  const feminine = fem ? 0.85 + rng() * 0.15 : rng() * 0.12;
  let height: number;
  if (child) height = 1.12 + rng() * 0.32;
  else height = (fem ? 1.645 : 1.775) + gauss(rng) * 0.065 - (elderly ? 0.03 : 0);
  height = child ? height : Math.min(1.95, Math.max(1.55, height));
  const bu = rng();
  let build = bu < 0.25 ? 0.86 + rng() * 0.07 : bu < 0.8 ? 0.95 + rng() * 0.1 : 1.08 + rng() * 0.25;
  if (child) build = 0.9 + rng() * 0.08;
  const age = child ? 0 : elderly ? 0.55 + rng() * 0.45 : rng() * 0.25;

  const skin = pick(rng, SKIN, SKIN_W);
  const hair = elderly && rng() < 0.75 ? pick(rng, HAIR_OLD) : pick(rng, HAIR_YOUNG, HAIR_YOUNG_W);
  let style = 0;

  // hair
  if (fem) {
    const h = rng();
    style |= h < 0.55 ? PedStyle.HAIR_LONG : h < 0.78 ? PedStyle.HAIR_BUN : PedStyle.HAIR_SHORT;
  } else {
    style |= (elderly && rng() < 0.45) || rng() < 0.06 ? PedStyle.HAIR_BALD : PedStyle.HAIR_SHORT;
    if (!child && rng() < 0.28) style |= PedStyle.BEARD;
  }

  // layers (Paris, temperate; coats common)
  const cold = ctx.night ? 0.15 : 0;
  const o = rng();
  let outer = 0;
  if (child) outer = o < 0.5 ? PedStyle.OUTER_JACKET : 0;
  else if (o < 0.24 + cold) outer = PedStyle.OUTER_COAT;
  else if (o < 0.36 + cold) outer = PedStyle.OUTER_TRENCH;
  else if (o < 0.72) outer = PedStyle.OUTER_JACKET;
  style |= outer;
  const suit = !fem && !child && outer === PedStyle.OUTER_JACKET && rng() < 0.3;
  if (suit) style |= PedStyle.SUIT;

  // top/bottom
  let top = rng() < 0.75 ? pick(rng, NEUTRAL_TOPS) : pick(rng, ACCENT_TOPS);
  let accent = pick(rng, ACCENTS);
  if (!suit && outer === 0 && rng() < 0.05) { style |= PedStyle.STRIPES; top = '#ece8df'; accent = '#1b2340'; }
  const skirtP = fem && !child ? 0.38 : fem ? 0.3 : 0;
  let bottom: string;
  if (rng() < skirtP) {
    style |= PedStyle.SKIRT;
    if (rng() < 0.5) style |= PedStyle.SKIRT_SHORT;
    if (!ctx.rain && rng() < 0.3) style |= PedStyle.BARE_LEGS;
    bottom = rng() < 0.25 ? top : pick(rng, SKIRTS); // dress when same as top
  } else bottom = pick(rng, BOTTOMS, BOTTOMS_W);
  let coat = outer === PedStyle.OUTER_TRENCH ? pick(rng, TRENCH) : pick(rng, COATS, COATS_W);
  if (suit) { coat = pick(rng, ['#1d2433', '#2b2d31', '#151517', '#3a3f4a']); bottom = coat; accent = rng() < 0.5 ? pick(rng, ['#e8ecf2', '#c9d6e6']) : pick(rng, ['#5c2328', '#1d2b4a', '#2d4231']); }

  const sneakers = !suit && rng() < (child ? 0.8 : elderly ? 0.15 : 0.42);
  const shoes = sneakers ? pick(rng, SHOES_LIGHT) : pick(rng, SHOES_DARK);

  // accessories
  if (!child && (rng() < 0.18 + (ctx.night ? 0.15 : 0) || (outer >= 2 && rng() < 0.3))) style |= PedStyle.SCARF;
  const hr = rng();
  if (!child && hr < 0.06) style |= PedStyle.HAT_BEANIE;
  else if (hr < 0.1) style |= PedStyle.HAT_CAP;
  else if (!child && hr < 0.13 && (elderly || fem)) style |= PedStyle.HAT_FELT;
  if (ctx.tourist && rng() < 0.4) style = (style & ~PedStyle.HAT_MASK) | PedStyle.HAT_CAP;
  const br = rng();
  if (br < (ctx.tourist ? 0.45 : 0.16) || child) style |= PedStyle.BACKPACK;
  else if (fem && br < 0.55) style |= PedStyle.HANDBAG;
  else if (!fem && br < 0.22) style |= PedStyle.HANDBAG;
  if (ctx.rain && !child && rng() < 0.7) style |= PedStyle.UMBRELLA;

  return {
    height, build, feminine, age, skin, hair, top, bottom, shoes, coat, accent,
    bag: pick(rng, BAGS), umbrella: pick(rng, UMBRELLAS), legwear: pick(rng, TIGHTS),
    style, seed: rng(),
  };
}

/** Approximate seat contact height above the instance origin while in PedAnim.Sit (metres). */
export function sitSeatHeight(a: Pick<PedAppearance, 'height'>): number { return 0.47 * (a.height / 1.75); }

// ------------------------------------------------------------------------------------------------------------------
// Material
// ------------------------------------------------------------------------------------------------------------------

const PROGRAM_KEY = 'ped-v1';

function patchVertex(src: string, color: boolean): string {
  let s = src.replace('#include <common>', `#include <common>\n${color ? '#define PED_COLOR\n' : ''}${PED_VERTEX_PARS}`);
  if (s.includes('#include <beginnormal_vertex>') && color) {
    s = s.replace('#include <beginnormal_vertex>', 'PedOut ped = pedCompute();\nvec3 objectNormal = ped.nrm;\n#ifdef USE_TANGENT\nvec3 objectTangent = vec3( tangent.xyz );\n#endif');
    s = s.replace('#include <begin_vertex>', 'vec3 transformed = ped.pos;');
  } else {
    s = s.replace('#include <begin_vertex>', 'PedOut ped = pedCompute();\nvec3 transformed = ped.pos;');
  }
  return s;
}

function createMaterials(uTime: { value: number }): { main: THREE.MeshStandardMaterial; depth: THREE.MeshDepthMaterial; distance: THREE.MeshDistanceMaterial } {
  const main = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0 });
  main.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uTime;
    sh.vertexShader = patchVertex(sh.vertexShader, true);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\n${PED_FRAGMENT_PARS}`)
      .replace('vec4 diffuseColor = vec4( diffuse, opacity );', 'float pedRough, pedMetal;\nvec3 pedAlb = pedAlbedo(pedRough, pedMetal);\nvec4 diffuseColor = vec4( diffuse * pedAlb, opacity );')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = pedRough;')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = pedMetal;');
  };
  main.customProgramCacheKey = () => PROGRAM_KEY + '-main';

  const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  depth.onBeforeCompile = (sh) => { sh.uniforms.uTime = uTime; sh.vertexShader = patchVertex(sh.vertexShader, false); };
  depth.customProgramCacheKey = () => PROGRAM_KEY + '-depth';
  const distance = new THREE.MeshDistanceMaterial();
  distance.onBeforeCompile = (sh) => { sh.uniforms.uTime = uTime; sh.vertexShader = patchVertex(sh.vertexShader, false); };
  distance.customProgramCacheKey = () => PROGRAM_KEY + '-distance';
  return { main, depth, distance };
}

// ------------------------------------------------------------------------------------------------------------------
// PedestrianMesh
// ------------------------------------------------------------------------------------------------------------------

const geoCache = new Map<Lod, { geometry: THREE.BufferGeometry; triangles: number; users: number }>();
function acquireGeometry(lod: Lod): THREE.BufferGeometry {
  let e = geoCache.get(lod);
  if (!e) { const b = buildPedGeometry(lod); e = { ...b, users: 0 }; geoCache.set(lod, e); }
  e.users++;
  return e.geometry;
}
function releaseGeometry(lod: Lod): void {
  const e = geoCache.get(lod);
  if (!e) return;
  if (--e.users <= 0) { e.geometry.dispose(); geoCache.delete(lod); }
}

/** Triangle count of the full character mesh (all clothing variants) for a LOD. */
export function pedTriangleCount(lod: Lod): number {
  const e = geoCache.get(lod);
  return e ? e.triangles : buildPedGeometry(lod).triangles;
}

const tmpColor = new THREE.Color();
function packColor(c: THREE.ColorRepresentation | undefined, fallback: number): number {
  if (c === undefined) return fallback;
  tmpColor.set(c);
  return tmpColor.getHex(THREE.SRGBColorSpace);
}

class Dirty {
  lo = Infinity;
  hi = -1;
  mark(i: number): void { if (i < this.lo) this.lo = i; if (i > this.hi) this.hi = i; }
  all(n: number): void { this.lo = 0; this.hi = n - 1; }
  flush(attr: THREE.InstancedBufferAttribute | THREE.InstancedBufferAttribute, itemSize: number): void {
    if (this.hi < this.lo) return;
    attr.clearUpdateRanges();
    attr.addUpdateRange(this.lo * itemSize, (this.hi - this.lo + 1) * itemSize);
    attr.needsUpdate = true;
    this.lo = Infinity; this.hi = -1;
  }
}

const REBASE_PERIOD = 600;
const BLEND_TIME = 0.3;

export class PedestrianMesh {
  readonly mesh: THREE.InstancedMesh;
  readonly maxCount: number;
  readonly lod: Lod;
  private readonly uTime = { value: 0 };
  private timeBase = 0;
  private timeNow = 0;
  private readonly anim: Float32Array;
  private readonly animPrev: Float32Array;
  private readonly look: Float32Array;
  private readonly c0: Float32Array;
  private readonly c1: Float32Array;
  private readonly c2: Float32Array;
  private readonly heights: Float32Array;
  private readonly attrs: Record<'anim' | 'animPrev' | 'look' | 'c0' | 'c1' | 'c2', THREE.InstancedBufferAttribute>;
  private readonly dirty = { anim: new Dirty(), animPrev: new Dirty(), look: new Dirty(), c0: new Dirty(), c1: new Dirty(), c2: new Dirty(), matrix: new Dirty() };
  private readonly materials: ReturnType<typeof createMaterials>;

  constructor(maxCount: number, opts: { lod?: Lod; castShadow?: boolean; receiveShadow?: boolean } = {}) {
    this.maxCount = maxCount;
    this.lod = opts.lod ?? 'near';
    const geometry = acquireGeometry(this.lod);
    this.materials = createMaterials(this.uTime);
    this.mesh = new THREE.InstancedMesh(geometry, this.materials.main, maxCount);
    this.mesh.customDepthMaterial = this.materials.depth;
    this.mesh.customDistanceMaterial = this.materials.distance;
    this.mesh.castShadow = opts.castShadow ?? true;
    this.mesh.receiveShadow = opts.receiveShadow ?? true;
    this.mesh.frustumCulled = false; // instances move every frame; the game culls/streams per area
    this.mesh.name = `pedestrians-${this.lod}`;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.count = 0;

    const mk = (n: number) => new Float32Array(maxCount * n);
    this.anim = mk(4); this.animPrev = mk(4); this.look = mk(4); this.c0 = mk(4); this.c1 = mk(4); this.c2 = mk(4);
    this.heights = new Float32Array(maxCount).fill(1.75);
    const attr = (arr: Float32Array) => {
      const a = new THREE.InstancedBufferAttribute(arr, 4);
      a.setUsage(THREE.DynamicDrawUsage);
      return a;
    };
    this.attrs = { anim: attr(this.anim), animPrev: attr(this.animPrev), look: attr(this.look), c0: attr(this.c0), c1: attr(this.c1), c2: attr(this.c2) };
    // InstancedMesh shares one geometry; per-instance attributes are attached to a per-mesh geometry clone view.
    const g = new THREE.BufferGeometry();
    for (const name of ['position', 'normal', 'aPart', 'aMeta', 'aAlt'] as const) g.setAttribute(name, geometry.getAttribute(name));
    g.setIndex(geometry.getIndex());
    g.boundingBox = geometry.boundingBox;
    g.boundingSphere = geometry.boundingSphere;
    g.setAttribute('iAnim', this.attrs.anim);
    g.setAttribute('iAnimPrev', this.attrs.animPrev);
    g.setAttribute('iLook', this.attrs.look);
    g.setAttribute('iColors0', this.attrs.c0);
    g.setAttribute('iColors1', this.attrs.c1);
    g.setAttribute('iColors2', this.attrs.c2);
    this.mesh.geometry = g;

    const def = randomAppearance(() => 0.5);
    const m = this.mesh.instanceMatrix.array as Float32Array;
    for (let i = 0; i < maxCount; i++) {
      m[i * 16] = 1; m[i * 16 + 5] = 1; m[i * 16 + 10] = 1; m[i * 16 + 15] = 1;
      this.setAppearance(i, def);
      this.animPrev[i * 4 + 3] = -1e3;
    }
    for (const d of Object.values(this.dirty)) d.all(maxCount);
  }

  get count(): number { return this.mesh.count; }
  set count(n: number) { this.mesh.count = Math.max(0, Math.min(this.maxCount, n | 0)); }

  /** heading: 0 = facing -Z (north), positive = clockwise from above (towards +X / east). */
  setTransform(i: number, x: number, y: number, z: number, headingRad: number): void {
    // model faces +Z; rotation about Y by θ = π - heading maps +Z to (sin h, 0, -cos h)
    const th = Math.PI - headingRad;
    const c = Math.cos(th), s = Math.sin(th);
    const m = this.mesh.instanceMatrix.array as Float32Array;
    const o = i * 16;
    m[o] = c; m[o + 1] = 0; m[o + 2] = -s; m[o + 3] = 0;
    m[o + 4] = 0; m[o + 5] = 1; m[o + 6] = 0; m[o + 7] = 0;
    m[o + 8] = s; m[o + 9] = 0; m[o + 10] = c; m[o + 11] = 0;
    m[o + 12] = x; m[o + 13] = y; m[o + 14] = z; m[o + 15] = 1;
    this.dirty.matrix.mark(i);
  }

  /** Cadence (cycles/s) for an animation at a given speed for this instance. */
  private rateFor(i: number, anim: PedAnim, speed: number): number {
    const hs = this.heights[i] / 1.75;
    switch (anim) {
      case PedAnim.Walk: {
        const v = Math.max(0.05, speed);
        const stride = hs * 1.75 * (0.5 + 0.23 * Math.min(v, 2.2)); // full cycle (2 steps) length
        return v / stride;
      }
      case PedAnim.Run: {
        const v = Math.max(0.5, speed);
        const stride = hs * 1.75 * (0.75 + 0.15 * Math.min(v, 7));
        return v / stride;
      }
      case PedAnim.Hail: return 1.4 * (speed > 0 ? speed : 1);
      case PedAnim.Flinch: return 1.1 * (speed > 0 ? speed : 1);
      default: return 0.25 * (speed > 0 ? speed : 1);
    }
  }

  /**
   * Set the animation. `phase` (0..1) is the phase *now*; `speed` = ground speed in m/s for Walk/Run, playback rate
   * multiplier for the others (1 = natural). Same anim → only the speed is updated (phase kept continuous).
   */
  setAnim(i: number, anim: PedAnim, phase: number, speed: number): void {
    const o = i * 4;
    const t = this.timeNow - this.timeBase;
    const cur = this.anim[o];
    const rate = this.rateFor(i, anim, speed);
    if (cur === anim && this.animPrev[o + 3] > -1e3 + 1) {
      if (this.anim[o + 2] === rate && this.anim[o + 3] === speed) return;
      // keep phase continuous while changing cadence
      const ph = this.anim[o + 1] + t * this.anim[o + 2];
      this.anim[o + 1] = fract(ph - t * rate);
      this.anim[o + 2] = rate;
      this.anim[o + 3] = speed;
      this.dirty.anim.mark(i);
      return;
    }
    const first = this.animPrev[o + 3] <= -1e3 + 1;
    this.animPrev[o] = first ? anim : cur;
    this.animPrev[o + 1] = this.anim[o + 1];
    this.animPrev[o + 2] = this.anim[o + 2];
    this.animPrev[o + 3] = first ? -100 : t;
    this.anim[o] = anim;
    this.anim[o + 1] = anim === PedAnim.Flinch ? phase - t * rate : fract(phase - t * rate);
    this.anim[o + 2] = rate;
    this.anim[o + 3] = speed;
    this.dirty.anim.mark(i);
    this.dirty.animPrev.mark(i);
  }

  /** Directly set phase with a frozen clock (rate 0) — used by the passenger model. */
  setAnimFrozen(i: number, anim: PedAnim, phase: number, speed = 1.2): void {
    const o = i * 4;
    const t = this.timeNow - this.timeBase;
    if (this.anim[o] !== anim) {
      const first = this.animPrev[o + 3] <= -1e3 + 1;
      this.animPrev[o] = first ? anim : this.anim[o];
      this.animPrev[o + 1] = this.anim[o + 1];
      this.animPrev[o + 2] = this.anim[o + 2];
      this.animPrev[o + 3] = first ? -100 : t;
      this.dirty.animPrev.mark(i);
    }
    this.anim[o] = anim; this.anim[o + 1] = phase; this.anim[o + 2] = 0; this.anim[o + 3] = speed;
    this.dirty.anim.mark(i);
  }

  /** Current animation phase of an instance (CPU mirror of the shader). */
  getPhase(i: number): number {
    const o = i * 4;
    const p = this.anim[o + 1] + (this.timeNow - this.timeBase) * this.anim[o + 2];
    return this.anim[o] === PedAnim.Flinch ? Math.min(1, Math.max(0, p)) : fract(p);
  }

  getAnim(i: number): PedAnim { return this.anim[i * 4] as PedAnim; }

  setAppearance(i: number, a: PedAppearance): void {
    const o = i * 4;
    this.heights[i] = a.height;
    this.look[o] = a.height / 1.75; this.look[o + 1] = a.build; this.look[o + 2] = a.feminine; this.look[o + 3] = a.age;
    this.c0[o] = packColor(a.skin, 0xd6a47f); this.c0[o + 1] = packColor(a.hair, 0x2a1d15);
    this.c0[o + 2] = packColor(a.top, 0x333333); this.c0[o + 3] = packColor(a.bottom, 0x222a3a);
    this.c1[o] = packColor(a.shoes, 0x141414); this.c1[o + 1] = packColor(a.coat, 0x1d2433);
    this.c1[o + 2] = packColor(a.accent, 0x8c1c1c); this.c1[o + 3] = a.style & 0xffffff;
    this.c2[o] = packColor(a.bag, 0x1a1412); this.c2[o + 1] = packColor(a.umbrella, 0x111111);
    this.c2[o + 2] = packColor(a.legwear, 0x161618); this.c2[o + 3] = a.seed ?? ((i * 0.6180339) % 1);
    this.dirty.look.mark(i); this.dirty.c0.mark(i); this.dirty.c1.mark(i); this.dirty.c2.mark(i);
  }

  /** Per frame: set time uniform, upload only the dirty instance ranges. */
  update(timeSeconds: number): void {
    this.timeNow = timeSeconds;
    if (timeSeconds - this.timeBase > REBASE_PERIOD || timeSeconds < this.timeBase) this.rebase(timeSeconds);
    this.uTime.value = timeSeconds - this.timeBase;
    this.dirty.anim.flush(this.attrs.anim, 4);
    this.dirty.animPrev.flush(this.attrs.animPrev, 4);
    this.dirty.look.flush(this.attrs.look, 4);
    this.dirty.c0.flush(this.attrs.c0, 4);
    this.dirty.c1.flush(this.attrs.c1, 4);
    this.dirty.c2.flush(this.attrs.c2, 4);
    this.dirty.matrix.flush(this.mesh.instanceMatrix, 16);
  }

  /** Shift the time origin (keeps phases continuous, preserves float precision of uTime). */
  private rebase(now: number): void {
    const dt = now - this.timeBase;
    for (let i = 0; i < this.maxCount; i++) {
      const o = i * 4;
      const isFlinch = this.anim[o] === PedAnim.Flinch;
      this.anim[o + 1] = isFlinch ? this.anim[o + 1] + dt * this.anim[o + 2] : fract(this.anim[o + 1] + dt * this.anim[o + 2]);
      if (isFlinch) this.anim[o + 1] = Math.max(-2, Math.min(2, this.anim[o + 1]));
      const pf = this.animPrev[o] === PedAnim.Flinch;
      this.animPrev[o + 1] = pf ? Math.max(-2, Math.min(2, this.animPrev[o + 1] + dt * this.animPrev[o + 2])) : fract(this.animPrev[o + 1] + dt * this.animPrev[o + 2]);
      this.animPrev[o + 3] = Math.max(-100, this.animPrev[o + 3] - dt);
    }
    this.timeBase = now;
    this.dirty.anim.all(this.maxCount);
    this.dirty.animPrev.all(this.maxCount);
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    releaseGeometry(this.lod);
    this.materials.main.dispose();
    this.materials.depth.dispose();
    this.materials.distance.dispose();
    this.mesh.dispose();
  }
}

function fract(x: number): number { return x - Math.floor(x); }

// ------------------------------------------------------------------------------------------------------------------
// Passenger (single high-quality instance)
// ------------------------------------------------------------------------------------------------------------------

/**
 * Single pedestrian for the passenger walking to / sitting in the taxi. The game drives the phase directly
 * (setAnim(anim, phase)); secondary motion (breathing, looking around, cross-fades) uses a clock that is updated
 * automatically before each render (or explicitly with `update(t)`).
 * Sit: place the object at the floor point below the hips; seat contact ≈ sitSeatHeight(a) above it.
 */
export function createPassengerModel(a: PedAppearance): {
  object: THREE.Object3D;
  setAnim(anim: PedAnim, phase: number): void;
  update(timeSeconds: number): void;
  dispose(): void;
} {
  const pm = new PedestrianMesh(1, { lod: 'near', castShadow: true });
  pm.count = 1;
  pm.setAppearance(0, a);
  pm.setTransform(0, 0, 0, 0, Math.PI); // model space: facing +Z like a regular Object3D "front"
  pm.setAnimFrozen(0, PedAnim.Idle, 0);
  let manual = false;
  let last = 0;
  const t0 = performance.now();
  pm.mesh.onBeforeRender = () => { if (!manual) { last = (performance.now() - t0) / 1000; pm.update(last); } };
  pm.update(0);
  pm.mesh.name = 'passenger';
  return {
    object: pm.mesh,
    setAnim(anim, phase) { pm.setAnimFrozen(0, anim, phase); pm.update(manual ? last : (performance.now() - t0) / 1000); },
    update(t) { manual = true; last = t; pm.update(t); },
    dispose() { pm.dispose(); },
  };
}

export { PIVOT as PED_PIVOTS };
