// Procedural toy dioramas: one floating plinth per place.
import * as THREE from 'three';
import type { Place } from '@bl/sim';
import { G, M, mesh, blobShadow, textTexture } from './kit.ts';

export interface Diorama {
  place: Place;
  root: THREE.Group;
  /** Materials tinted by season: [material, summer colour] */
  foliage: { m: THREE.MeshStandardMaterial; base: THREE.Color }[];
  grass: { m: THREE.MeshStandardMaterial; base: THREE.Color }[];
  /** Where characters stand: [0] = player, others = NPCs */
  spots: THREE.Vector3[];
  /** Emissive window materials (night glow) */
  windows: THREE.MeshStandardMaterial[];
  setLabel?: (lines: string[]) => void;
  update?: (t: number) => void;
}

export const S = 12; // plinth size

export function plinth(d: Diorama, grassColor = '#8FD16F', soil = '#B98563', stone = '#D9C7AE') {
  const g = new THREE.Group();
  const grassM = M(grassColor, { unique: true, rough: 0.9 });
  d.grass.push({ m: grassM, base: grassM.color.clone() });
  const top = mesh(G.box(S, 0.5, S, 0.22), grassM, 0, -0.25, 0);
  const mid = mesh(G.box(S - 0.15, 1.1, S - 0.15, 0.25), M(soil, { rough: 0.95 }), 0, -0.95, 0);
  const bot = mesh(G.box(S - 0.4, 0.6, S - 0.4, 0.25), M(stone, { rough: 0.85 }), 0, -1.75, 0);
  top.castShadow = false;
  // little pebbles on the soil band
  for (let i = 0; i < 26; i++) {
    const side = i % 4;
    const p = (Math.sin(i * 12.9898) * 0.5 + 0.5) * (S - 1.4) - (S - 1.4) / 2;
    const y = -0.7 - ((i * 7) % 5) * 0.12;
    const r = 0.09 + ((i * 3) % 4) * 0.03;
    const x = side === 0 ? p : side === 1 ? p : side === 2 ? S / 2 - 0.05 : -S / 2 + 0.05;
    const z = side === 0 ? S / 2 - 0.05 : side === 1 ? -S / 2 + 0.05 : p;
    const pebble = mesh(G.sphere(8), M(i % 3 ? '#9C6E50' : '#C9B79C', { rough: 1 }), x, y, z, false);
    pebble.scale.set(r * 1.4, r, r);
    g.add(pebble);
  }
  g.add(top, mid, bot);
  d.root.add(g);
}

export function leafMat(d: Diorama, color: string) {
  const m = M(color, { unique: true, rough: 0.85 });
  d.foliage.push({ m, base: m.color.clone() });
  return m;
}

export function tree(d: Diorama, x: number, z: number, s = 1, kind: 'round' | 'pine' | 'tall' = 'round', color = '#5DBB63') {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.scale.setScalar(s);
  const trunkM = M('#9A6B4C', { rough: 0.9 });
  const lm = leafMat(d, color);
  if (kind === 'pine') {
    g.add(mesh(G.cyl(0.12, 0.16, 0.8, 10), trunkM, 0, 0.4, 0));
    for (let i = 0; i < 3; i++) g.add(mesh(G.cone(0.95 - i * 0.22, 1.1, 14), lm, 0, 1.05 + i * 0.6, 0));
  } else {
    const h = kind === 'tall' ? 1.6 : 1.1;
    g.add(mesh(G.cyl(0.13, 0.19, h, 10), trunkM, 0, h / 2, 0));
    const blobs: [number, number, number, number][] = kind === 'tall'
      ? [[0, h + 0.7, 0, 0.75], [0.35, h + 1.3, 0.1, 0.55], [-0.3, h + 1.15, -0.1, 0.55]]
      : [[0, h + 0.55, 0, 0.85], [0.55, h + 0.35, 0.15, 0.55], [-0.5, h + 0.4, -0.1, 0.6], [0.1, h + 1.05, -0.2, 0.55]];
    for (const [bx, by, bz, r] of blobs) {
      const b = mesh(G.sphere(18), lm, bx, by, bz);
      b.scale.setScalar(r);
      g.add(b);
    }
  }
  g.add(blobShadow(0.9 * s, 0.25));
  d.root.add(g);
  return g;
}

export function bush(d: Diorama, x: number, z: number, s = 1, color = '#4FAF5A') {
  const lm = leafMat(d, color);
  for (const [bx, bz, r] of [[0, 0, 0.42], [0.35, 0.1, 0.3], [-0.32, 0.05, 0.32]] as const) {
    const b = mesh(G.sphere(14), lm, x + bx * s, r * s * 0.8, z + bz * s);
    b.scale.setScalar(r * s);
    d.root.add(b);
  }
}

export function flowers(d: Diorama, x: number, z: number, n = 6, spread = 0.8) {
  const cols = ['#FF7AA2', '#FFD166', '#FFFFFF', '#B28DFF', '#FF9F68'];
  for (let i = 0; i < n; i++) {
    const a = i * 2.4, r = spread * Math.sqrt((i + 0.5) / n);
    const fx = x + Math.cos(a) * r, fz = z + Math.sin(a) * r;
    d.root.add(mesh(G.cyl(0.015, 0.015, 0.22, 4), M('#4E9F3D'), fx, 0.11, fz, false));
    const f = mesh(G.sphere(8), M(cols[i % cols.length], { rough: 0.6 }), fx, 0.25, fz, false);
    f.scale.setScalar(0.07);
    d.root.add(f);
  }
}

export function fence(d: Diorama, x0: number, z0: number, x1: number, z1: number, color = '#FFFFFF') {
  const len = Math.hypot(x1 - x0, z1 - z0);
  const n = Math.max(2, Math.round(len / 0.55));
  const m = M(color, { rough: 0.6 });
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    d.root.add(mesh(G.box(0.12, 0.6, 0.08, 0.04), m, x0 + (x1 - x0) * t, 0.3, z0 + (z1 - z0) * t));
  }
  const ang = Math.atan2(z1 - z0, x1 - x0);
  for (const y of [0.2, 0.42]) {
    const rail = mesh(G.box(len, 0.07, 0.05, 0.02), m, (x0 + x1) / 2, y, (z0 + z1) / 2);
    rail.rotation.y = -ang;
    d.root.add(rail);
  }
}

export function lamp(d: Diorama, x: number, z: number) {
  d.root.add(mesh(G.cyl(0.05, 0.07, 2.2, 8), M('#3D4756', { rough: 0.4, metal: 0.5 }), x, 1.1, z));
  const bulbM = M('#FFF2C4', { emissive: '#FFD27A', ei: 0.8, unique: true });
  d.windows.push(bulbM);
  const b = mesh(G.sphere(12), bulbM, x, 2.3, z, false);
  b.scale.setScalar(0.18);
  d.root.add(b);
}

export function bench(d: Diorama, x: number, z: number, rot = 0) {
  const g = new THREE.Group();
  const wood = M('#C58B5C', { rough: 0.7 });
  const iron = M('#3D4756', { rough: 0.4, metal: 0.4 });
  g.add(mesh(G.box(1.3, 0.08, 0.4, 0.03), wood, 0, 0.42, 0));
  g.add(mesh(G.box(1.3, 0.3, 0.06, 0.03), wood, 0, 0.66, -0.18));
  for (const s of [-0.55, 0.55]) g.add(mesh(G.box(0.06, 0.42, 0.4, 0.02), iron, s, 0.21, 0));
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  d.root.add(g);
}

export function car(d: Diorama, x: number, z: number, color = '#FF6B6B', rot = 0) {
  const g = new THREE.Group();
  const body = M(color, { rough: 0.35, metal: 0.1 });
  g.add(mesh(G.box(2.0, 0.55, 1.0, 0.22), body, 0, 0.45, 0));
  g.add(mesh(G.box(1.15, 0.5, 0.9, 0.22), body, -0.1, 0.9, 0));
  const glass = M('#BFE3FF', { rough: 0.1, metal: 0.2 });
  g.add(mesh(G.box(1.0, 0.36, 0.92, 0.15), glass, -0.1, 0.92, 0));
  const tire = M('#2B2B33', { rough: 0.8 });
  for (const [wx, wz] of [[-0.65, 0.5], [0.65, 0.5], [-0.65, -0.5], [0.65, -0.5]]) {
    const w = mesh(G.cyl(0.22, 0.22, 0.18, 16), tire, wx, 0.22, wz);
    w.rotation.x = Math.PI / 2;
    g.add(w);
  }
  for (const s of [-0.3, 0.3]) {
    const hl = mesh(G.sphere(8), M('#FFF6D5', { emissive: '#FFE8A0', ei: 0.5 }), 1.0, 0.5, s, false);
    hl.scale.setScalar(0.09);
    g.add(hl);
  }
  g.add(blobShadow(1.2, 0.3));
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  d.root.add(g);
}

export function windowGrid(d: Diorama, parent: THREE.Object3D, cx: number, cy: number, z: number, cols: number, rows: number, w: number, h: number, gx: number, gy: number, frame = '#FFFFFF', glow = '#FFE29A', rotY = 0) {
  const fm = M(frame, { rough: 0.5 });
  const wm = M('#9FD3F5', { rough: 0.15, metal: 0.1, emissive: glow, ei: 0.15, unique: true });
  d.windows.push(wm);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = cx + (c - (cols - 1) / 2) * gx;
      const y = cy + (r - (rows - 1) / 2) * gy;
      const g = new THREE.Group();
      g.position.set(x, y, z);
      g.rotation.y = rotY;
      g.add(mesh(G.box(w + 0.12, h + 0.12, 0.08, 0.04), fm, 0, 0, 0));
      g.add(mesh(G.box(w, h, 0.1, 0.03), wm, 0, 0, 0.01));
      g.add(mesh(G.box(0.05, h, 0.12, 0.01), fm, 0, 0, 0.02));
      parent.add(g);
    }
  }
}

export function path(d: Diorama, pts: [number, number][], color = '#EADCC6') {
  const m = M(color, { rough: 0.95 });
  for (const [x, z] of pts) {
    const s = mesh(G.cyl(0.32, 0.34, 0.06, 14), m, x, 0.03, z, false);
    s.scale.set(1, 1, 0.8 + ((x * 7 + z * 3) % 3) * 0.08);
    d.root.add(s);
  }
}

export function newD(place: Place): Diorama {
  return { place, root: new THREE.Group(), foliage: [], grass: [], spots: [], windows: [] };
}

// ───────────────────────────── places ─────────────────────────────

export function house(d: Diorama, x: number, z: number, wall = '#FFF1DC', roof = '#E8765C', s = 1) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.scale.setScalar(s);
  const wm = M(wall, { rough: 0.8 });
  g.add(mesh(G.box(4.2, 2.6, 3.2, 0.12), wm, 0, 1.3, 0));
  g.add(mesh(G.box(4.4, 0.25, 3.4, 0.08), M('#E9D5BA'), 0, 0.12, 0));
  // roof: two slanted rounded slabs
  const rm = M(roof, { rough: 0.6 });
  for (const sgn of [-1, 1]) {
    const r = mesh(G.box(4.7, 0.22, 2.25, 0.1), rm, 0, 3.25, sgn * 0.8);
    r.rotation.x = sgn * 0.62;
    g.add(r);
  }
  const gable = new THREE.Shape([new THREE.Vector2(-1.6, 0), new THREE.Vector2(1.6, 0), new THREE.Vector2(0, 1.25)]);
  const gg = new THREE.ExtrudeGeometry(gable, { depth: 4.0, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 });
  const gm = mesh(gg, wm, -2.0, 2.58, 0);
  gm.rotation.y = Math.PI / 2;
  g.add(gm);
  g.add(mesh(G.box(0.5, 1.1, 0.5, 0.06), M('#C9705A'), 1.2, 3.6, -0.6));
  // door
  g.add(mesh(G.box(0.85, 1.45, 0.12, 0.08), M('#6FA8DC', { rough: 0.5 }), 0, 0.85, 1.62));
  const knob = mesh(G.sphere(8), M('#FFD166', { metal: 0.6, rough: 0.3 }), 0.28, 0.85, 1.7, false);
  knob.scale.setScalar(0.05);
  g.add(knob);
  g.add(mesh(G.box(1.1, 0.12, 0.4, 0.04), M('#E9D5BA'), 0, 0.06, 1.85));
  windowGrid(d, g, -1.35, 1.55, 1.62, 1, 1, 0.75, 0.75, 1, 1);
  windowGrid(d, g, 1.35, 1.55, 1.62, 1, 1, 0.75, 0.75, 1, 1);
  windowGrid(d, g, 0, 3.0, 1.0, 1, 1, 0.5, 0.5, 1, 1, '#FFFFFF', '#FFE29A');
  // planter boxes
  for (const sx of [-1.35, 1.35]) {
    g.add(mesh(G.box(0.85, 0.18, 0.22, 0.05), M('#B5835A'), sx, 1.05, 1.72));
    flowersAt(g, sx, 1.18, 1.72);
  }
  d.root.add(g);
  return g;
}

function flowersAt(g: THREE.Group, x: number, y: number, z: number) {
  const cols = ['#FF7AA2', '#FFD166', '#FFFFFF', '#FF9F68'];
  for (let i = 0; i < 4; i++) {
    const f = mesh(G.sphere(8), M(cols[i]), x - 0.3 + i * 0.2, y, z, false);
    f.scale.setScalar(0.07);
    g.add(f);
  }
}

function buildHome(): Diorama {
  const d = newD('home');
  plinth(d);
  house(d, -0.6, -2.4);
  fence(d, -5.6, 4.6, -1.2, 4.6);
  fence(d, 1.2, 4.6, 5.6, 4.6);
  tree(d, 4.0, -3.0, 1.15, 'round');
  tree(d, -4.6, 0.6, 0.9, 'round', '#6CC56B');
  tree(d, 4.6, 1.6, 0.8, 'pine', '#3E9E5E');
  bush(d, -3.3, -0.4, 0.9);
  bush(d, 2.2, -0.5, 0.8, '#5CB85C');
  flowers(d, -2.8, 3.4, 7);
  flowers(d, 3.4, 3.6, 6);
  path(d, [[0, 0.1], [0.15, 0.9], [-0.1, 1.7], [0.1, 2.6], [0, 3.5], [0, 4.4]]);
  // mailbox
  d.root.add(mesh(G.cyl(0.05, 0.05, 0.9, 6), M('#7A5236'), 1.6, 0.45, 4.2));
  d.root.add(mesh(G.box(0.45, 0.32, 0.6, 0.12), M('#FF6B6B', { rough: 0.4 }), 1.6, 1.0, 4.2));
  // swing on tree branch
  const swing = new THREE.Group();
  swing.position.set(3.2, 0, -1.5);
  for (const s of [-0.25, 0.25]) swing.add(mesh(G.cyl(0.015, 0.015, 1.4, 4), M('#C9B79C'), s, 1.2, 0, false));
  swing.add(mesh(G.box(0.7, 0.07, 0.3, 0.03), M('#E07A5F'), 0, 0.5, 0));
  d.root.add(swing);
  d.spots = [new THREE.Vector3(0, 0, 1.6), new THREE.Vector3(-1.6, 0, 1.2), new THREE.Vector3(1.6, 0, 1.2), new THREE.Vector3(-2.6, 0, 2.3), new THREE.Vector3(2.6, 0, 2.4), new THREE.Vector3(-0.9, 0, 3.0)];
  return d;
}

function buildApartment(): Diorama {
  const d = newD('apartment');
  plinth(d, '#93CF73');
  const g = new THREE.Group();
  g.position.set(-0.3, 0, -2.6);
  const wall = M('#F6C9A8', { rough: 0.85 });
  g.add(mesh(G.box(5.4, 5.6, 3.0, 0.15), wall, 0, 2.8, 0));
  g.add(mesh(G.box(5.7, 0.3, 3.3, 0.1), M('#E39B7B'), 0, 5.7, 0));
  windowGrid(d, g, 0, 2.5, 1.52, 3, 3, 0.8, 0.9, 1.6, 1.55);
  for (let r = 0; r < 2; r++) {
    for (const x of [-1.6, 1.6]) {
      g.add(mesh(G.box(1.3, 0.1, 0.55, 0.04), M('#FFFFFF'), x, 2.3 + r * 1.55, 1.75));
      g.add(mesh(G.box(1.3, 0.38, 0.05, 0.02), M('#5C6B7A', { metal: 0.4, rough: 0.4 }), x, 2.5 + r * 1.55, 2.0));
    }
  }
  g.add(mesh(G.box(1.0, 1.5, 0.12, 0.06), M('#556B8D'), 0, 0.75, 1.52));
  g.add(mesh(G.box(1.6, 0.12, 0.6, 0.06), M('#FFFFFF'), 0, 1.6, 1.75));
  d.root.add(g);
  tree(d, 4.4, -2.2, 1.0, 'tall');
  tree(d, -4.6, 1.8, 0.85, 'round');
  bush(d, 3.2, 0.8, 0.7);
  lamp(d, -3.0, 2.6);
  bench(d, 3.5, 2.4, -0.4);
  car(d, -3.6, -0.1, '#5AA9FF', 0.15);
  flowers(d, 2.0, 4.2, 6);
  path(d, [[0, 0.2], [0.1, 1.2], [-0.1, 2.2], [0, 3.2], [0.1, 4.3]], '#E3DCD2');
  d.spots = [new THREE.Vector3(0, 0, 1.6), new THREE.Vector3(-1.5, 0, 1.4), new THREE.Vector3(1.5, 0, 1.4), new THREE.Vector3(-2.4, 0, 2.6), new THREE.Vector3(2.4, 0, 2.7)];
  return d;
}

function buildSchool(): Diorama {
  const d = newD('school');
  plinth(d, '#92D46E');
  const g = new THREE.Group();
  g.position.set(-1.0, 0, -2.8);
  const brick = M('#E5735E', { rough: 0.85 });
  const trim = M('#FFF3E0', { rough: 0.7 });
  g.add(mesh(G.box(6.6, 3.4, 2.8, 0.12), brick, 0, 1.7, 0));
  g.add(mesh(G.box(6.9, 0.3, 3.1, 0.1), trim, 0, 3.5, 0));
  g.add(mesh(G.box(2.0, 4.6, 3.0, 0.12), brick, 0, 2.3, 0.05));
  const ped = new THREE.Shape([new THREE.Vector2(-1.25, 0), new THREE.Vector2(1.25, 0), new THREE.Vector2(0, 0.9)]);
  const pm = mesh(new THREE.ExtrudeGeometry(ped, { depth: 3.1, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }), trim, 0, 4.6, -1.55);
  g.add(pm);
  // clock
  const clock = mesh(G.cyl(0.42, 0.42, 0.12, 24), M('#FFFFFF', { rough: 0.4 }), 0, 4.0, 1.58);
  clock.rotation.x = Math.PI / 2;
  g.add(clock);
  const ring = mesh(G.torus(0.42, 0.05), M('#3D4756', { metal: 0.5, rough: 0.3 }), 0, 4.0, 1.64);
  g.add(ring);
  const hand1 = mesh(G.box(0.04, 0.3, 0.02, 0.01), M('#2B2B33'), 0, 4.1, 1.66, false);
  const hand2 = mesh(G.box(0.03, 0.22, 0.02, 0.01), M('#2B2B33'), 0.08, 4.0, 1.66, false);
  hand2.rotation.z = -1.2;
  g.add(hand1, hand2);
  windowGrid(d, g, -2.3, 1.9, 1.42, 2, 2, 0.75, 0.75, 1.1, 1.15);
  windowGrid(d, g, 2.3, 1.9, 1.42, 2, 2, 0.75, 0.75, 1.1, 1.15);
  g.add(mesh(G.box(1.1, 1.7, 0.12, 0.06), M('#3D6FB6'), 0, 0.85, 1.56));
  d.root.add(g);
  // flagpole
  d.root.add(mesh(G.cyl(0.04, 0.05, 4.2, 8), M('#D8DEE6', { metal: 0.6, rough: 0.3 }), 3.2, 2.1, -1.6));
  const flag = mesh(G.box(0.9, 0.55, 0.03, 0.01), M('#5AA9FF'), 3.67, 3.85, -1.6);
  d.root.add(flag);
  // playground: slide
  const slide = new THREE.Group();
  slide.position.set(3.7, 0, 1.6);
  slide.rotation.y = -0.6;
  for (const sx of [-0.35, 0.35]) for (const sz of [-0.35, 0.35]) slide.add(mesh(G.cyl(0.05, 0.05, 1.6, 8), M('#FFD166'), sx, 0.8, sz));
  slide.add(mesh(G.box(0.9, 0.1, 0.9, 0.04), M('#FF6B6B'), 0, 1.6, 0));
  const ramp = mesh(G.box(0.6, 0.08, 2.0, 0.04), M('#5AA9FF', { rough: 0.3 }), 0, 0.85, 1.1);
  ramp.rotation.x = 0.75;
  slide.add(ramp);
  d.root.add(slide);
  // school bus
  const bus = new THREE.Group();
  bus.position.set(-3.9, 0, 2.6);
  bus.rotation.y = 0.2;
  const y = M('#FFC93C', { rough: 0.4 });
  bus.add(mesh(G.box(2.8, 1.1, 1.2, 0.25), y, 0, 0.75, 0));
  bus.add(mesh(G.box(0.7, 0.7, 1.15, 0.2), y, 1.55, 0.55, 0));
  windowGrid(d, bus, -0.2, 1.0, 0.61, 4, 1, 0.42, 0.35, 0.6, 1, '#2B2B33', '#FFF5D0');
  for (const [wx, wz] of [[-0.8, 0.55], [1.1, 0.55], [-0.8, -0.55], [1.1, -0.55]]) {
    const w = mesh(G.cyl(0.24, 0.24, 0.16, 16), M('#2B2B33'), wx, 0.24, wz);
    w.rotation.x = Math.PI / 2;
    bus.add(w);
  }
  bus.add(blobShadow(1.6, 0.3));
  d.root.add(bus);
  tree(d, -4.8, -2.0, 0.9, 'round');
  tree(d, 4.8, -4.2, 0.8, 'pine', '#3E9E5E');
  bush(d, 1.8, -0.9, 0.7);
  bush(d, -3.6, -0.9, 0.7);
  flowers(d, 0.8, 4.4, 6);
  // hopscotch
  for (let i = 0; i < 5; i++) d.root.add(mesh(G.box(0.4, 0.02, 0.4, 0.01), M(i % 2 ? '#FFFFFF' : '#FFE6A7'), 1.6, 0.01, 2.2 + i * 0.45, false));
  d.spots = [new THREE.Vector3(-0.3, 0, 1.2), new THREE.Vector3(-1.7, 0, 1.4), new THREE.Vector3(1.0, 0, 1.4), new THREE.Vector3(-0.6, 0, 2.5), new THREE.Vector3(0.9, 0, 2.6)];
  return d;
}

function buildUni(): Diorama {
  const d = newD('uni');
  plinth(d, '#8FCB6E');
  const g = new THREE.Group();
  g.position.set(0, 0, -2.7);
  const stone = M('#F3E9D8', { rough: 0.75 });
  g.add(mesh(G.box(7.6, 0.4, 3.4, 0.1), M('#E2D5BF'), 0, 0.2, 0.2));
  g.add(mesh(G.box(7.0, 3.6, 2.6, 0.1), stone, 0, 2.2, -0.2));
  for (let i = 0; i < 6; i++) {
    const c = mesh(G.cyl(0.2, 0.22, 3.2, 16), M('#FFFFFF', { rough: 0.6 }), -2.6 + i * 1.04, 2.0, 1.4);
    g.add(c);
  }
  g.add(mesh(G.box(7.2, 0.35, 0.8, 0.08), stone, 0, 3.75, 1.4));
  const ped = new THREE.Shape([new THREE.Vector2(-3.6, 0), new THREE.Vector2(3.6, 0), new THREE.Vector2(0, 1.3)]);
  g.add(mesh(new THREE.ExtrudeGeometry(ped, { depth: 1.0, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }), stone, 0, 3.9, 0.9));
  const dome = mesh(G.cap(1.3, Math.PI / 2), M('#7FB3A8', { rough: 0.4, metal: 0.3 }), 0, 4.0, -0.5);
  g.add(dome);
  g.add(mesh(G.cyl(1.35, 1.35, 0.5, 24), stone, 0, 4.0, -0.5));
  windowGrid(d, g, 0, 2.2, 1.12, 5, 1, 0.55, 1.4, 1.04, 1, '#FFFFFF', '#FFE6B0');
  d.root.add(g);
  tree(d, -4.6, -0.2, 1.0, 'tall');
  tree(d, 4.6, -0.4, 1.0, 'tall');
  tree(d, 4.5, 3.6, 0.8, 'round');
  bench(d, -3.4, 3.0, 0.6);
  lamp(d, 3.0, 2.0);
  lamp(d, -3.0, 1.4);
  path(d, [[0, 0.6], [0, 1.6], [0, 2.6], [0, 3.6], [0, 4.6]], '#E8DCC8');
  flowers(d, -2.2, 4.4, 7);
  d.spots = [new THREE.Vector3(-0.8, 0, 2.2), new THREE.Vector3(-2.1, 0, 2.2), new THREE.Vector3(0.7, 0, 2.4), new THREE.Vector3(1.9, 0, 2.8)];
  return d;
}

function buildOffice(): Diorama {
  const d = newD('office');
  plinth(d, '#9AD07A', '#A98A73', '#CFC6BA');
  // plaza
  d.root.add(mesh(G.box(9, 0.08, 6.5, 0.04), M('#E6E1D8', { rough: 0.9 }), 0, 0.04, 0.6, false));
  const g = new THREE.Group();
  g.position.set(-0.6, 0, -3.0);
  const glass = M('#7EC4F0', { rough: 0.12, metal: 0.35, emissive: '#FFE6A8', ei: 0.06, unique: true });
  d.windows.push(glass);
  g.add(mesh(G.box(4.6, 7.8, 3.6, 0.2), glass, 0, 3.9, 0));
  const fm = M('#E8EEF5', { rough: 0.4, metal: 0.3 });
  for (let i = 1; i < 8; i++) g.add(mesh(G.box(4.7, 0.1, 3.7, 0.04), fm, 0, i * 0.98, 0));
  for (const x of [-1.5, 0, 1.5]) g.add(mesh(G.box(0.08, 7.8, 3.68, 0.03), fm, x, 3.9, 0));
  g.add(mesh(G.box(4.9, 0.4, 3.9, 0.12), fm, 0, 7.95, 0));
  g.add(mesh(G.box(2.6, 1.2, 4.0, 0.1), M('#3D4756', { rough: 0.5 }), 0, 0.6, 0.1));
  g.add(mesh(G.box(1.2, 0.9, 0.1, 0.04), M('#A9D8F5', { rough: 0.1 }), 0, 0.6, 2.12));
  // logo sign
  const signTex = textTexture(['BitCorp'], 256, 96, '#FFFFFF');
  const sign = new THREE.Mesh(G.plane(2.0, 0.6), new THREE.MeshBasicMaterial({ map: signTex, transparent: true }));
  sign.position.set(0, 1.45, 2.12);
  g.add(sign);
  d.root.add(g);
  // second smaller building
  const b2 = new THREE.Group();
  b2.position.set(3.6, 0, -3.6);
  b2.add(mesh(G.box(2.4, 4.4, 2.6, 0.15), M('#F2D6B3', { rough: 0.8 }), 0, 2.2, 0));
  windowGrid(d, b2, 0, 2.3, 1.32, 2, 3, 0.6, 0.7, 1.0, 1.2);
  d.root.add(b2);
  for (const [x, z] of [[-3.8, 1.0], [3.8, 1.4]] as const) {
    d.root.add(mesh(G.box(1.1, 0.5, 1.1, 0.1), M('#C9B79C'), x, 0.3, z));
    bush(d, x, z, 0.6, '#58B368');
    d.root.children[d.root.children.length - 1].position.y += 0.5;
    d.root.children[d.root.children.length - 2].position.y += 0.5;
    d.root.children[d.root.children.length - 3].position.y += 0.5;
  }
  lamp(d, 2.6, 3.4);
  car(d, -3.8, 3.8, '#FFD166', 0.1);
  tree(d, 5.0, 2.2, 0.75, 'tall');
  tree(d, -5.0, -1.5, 0.8, 'round');
  d.spots = [new THREE.Vector3(0, 0, 1.4), new THREE.Vector3(-1.5, 0, 1.6), new THREE.Vector3(1.5, 0, 1.6), new THREE.Vector3(0.4, 0, 2.8)];
  return d;
}

function buildHospital(): Diorama {
  const d = newD('hospital');
  plinth(d, '#98D27A');
  const g = new THREE.Group();
  g.position.set(-0.4, 0, -2.8);
  const w = M('#FAFBFD', { rough: 0.6 });
  g.add(mesh(G.box(6.6, 4.2, 3.0, 0.15), w, 0, 2.1, 0));
  g.add(mesh(G.box(6.9, 0.3, 3.3, 0.1), M('#BFD7EA'), 0, 4.3, 0));
  windowGrid(d, g, 0, 2.6, 1.52, 5, 2, 0.75, 0.7, 1.2, 1.3, '#BFD7EA', '#E8F6FF');
  const red = M('#FF5A5F', { emissive: '#FF5A5F', ei: 0.3 });
  g.add(mesh(G.box(0.3, 1.0, 0.15, 0.05), red, 0, 4.9, 1.0));
  g.add(mesh(G.box(1.0, 0.3, 0.15, 0.05), red, 0, 4.9, 1.0));
  g.add(mesh(G.box(0.2, 0.8, 0.2, 0.05), w, 0, 4.4, 1.0));
  g.add(mesh(G.box(1.8, 0.15, 1.2, 0.05), M('#BFD7EA'), 0, 1.6, 2.0));
  g.add(mesh(G.box(1.2, 1.4, 0.1, 0.05), M('#A9D8F5', { rough: 0.1 }), 0, 0.7, 1.52));
  d.root.add(g);
  // ambulance
  const amb = new THREE.Group();
  amb.position.set(3.6, 0, 1.8);
  amb.rotation.y = -0.4;
  amb.add(mesh(G.box(2.2, 1.2, 1.1, 0.2), w, 0, 0.8, 0));
  amb.add(mesh(G.box(0.8, 0.12, 1.12, 0.03), M('#FF5A5F'), -0.2, 0.9, 0));
  amb.add(mesh(G.box(0.12, 0.8, 1.12, 0.03), M('#FF5A5F'), -0.2, 0.9, 0));
  amb.add(mesh(G.box(0.3, 0.12, 0.4, 0.05), M('#5AA9FF', { emissive: '#5AA9FF', ei: 0.8 }), 0.3, 1.46, 0));
  for (const [wx, wz] of [[-0.7, 0.5], [0.7, 0.5], [-0.7, -0.5], [0.7, -0.5]]) {
    const wh = mesh(G.cyl(0.22, 0.22, 0.16, 16), M('#2B2B33'), wx, 0.22, wz);
    wh.rotation.x = Math.PI / 2;
    amb.add(wh);
  }
  amb.add(blobShadow(1.3, 0.3));
  d.root.add(amb);
  tree(d, -4.6, 0.8, 0.9);
  tree(d, -4.4, 3.8, 0.7, 'pine', '#3E9E5E');
  bush(d, 2.6, -0.6, 0.6);
  bench(d, -2.6, 3.4, 0.3);
  flowers(d, 1.0, 4.2, 5);
  d.spots = [new THREE.Vector3(0, 0, 1.4), new THREE.Vector3(-1.5, 0, 1.6), new THREE.Vector3(1.4, 0, 1.8), new THREE.Vector3(-0.6, 0, 2.8)];
  return d;
}

function buildPark(): Diorama {
  const d = newD('park');
  plinth(d, '#8ED36C');
  const pond = mesh(G.cyl(2.1, 2.1, 0.06, 32), M('#7CC6F2', { rough: 0.05, metal: 0.2 }), -2.0, 0.03, -1.6, false);
  pond.scale.set(1, 1, 0.7);
  d.root.add(pond);
  const duck = mesh(G.sphere(10), M('#FFD166'), -1.4, 0.12, -1.4);
  duck.scale.set(0.2, 0.15, 0.15);
  d.root.add(duck);
  tree(d, 3.6, -3.2, 1.2);
  tree(d, -4.5, 2.6, 0.9);
  tree(d, 4.4, 1.4, 0.85, 'tall');
  tree(d, 0.8, -4.2, 0.9, 'pine', '#3E9E5E');
  bench(d, 2.2, 1.0, -0.6);
  lamp(d, -0.8, 3.0);
  flowers(d, 2.0, 3.6, 8);
  flowers(d, -3.6, -4.0, 6);
  bush(d, -0.2, -2.6, 0.7);
  d.spots = [new THREE.Vector3(0.4, 0, 1.4), new THREE.Vector3(-1.0, 0, 1.6), new THREE.Vector3(1.6, 0, 2.2), new THREE.Vector3(-0.4, 0, 2.8)];
  return d;
}

function buildCemetery(): Diorama {
  const d = newD('cemetery');
  plinth(d, '#86BF77', '#A6876F', '#C8BDB0');
  const stone = M('#C9CCD3', { rough: 0.9 });
  for (const [x, z, r] of [[-3.5, -2.5, 0.1], [-1.5, -3.2, -0.05], [2.0, -3.0, 0.08], [3.8, -1.2, -0.12], [-3.8, 0.4, 0.05]] as const) {
    const t = mesh(G.box(0.7, 0.9, 0.18, 0.12), stone, x, 0.45, z);
    t.rotation.y = r;
    d.root.add(t);
    flowers(d, x, z + 0.3, 3, 0.2);
  }
  // player's tombstone
  const tomb = new THREE.Group();
  tomb.position.set(0, 0, -0.6);
  tomb.add(mesh(G.box(1.5, 1.7, 0.3, 0.25), M('#E2E4EA', { rough: 0.7 }), 0, 0.85, 0));
  tomb.add(mesh(G.box(1.9, 0.2, 0.9, 0.06), M('#C9CCD3'), 0, 0.1, 0.2));
  const label = new THREE.Mesh(G.plane(1.3, 1.3), new THREE.MeshBasicMaterial({ transparent: true }));
  label.position.set(0, 0.95, 0.16);
  tomb.add(label);
  d.root.add(tomb);
  d.setLabel = (lines) => {
    const m = label.material as THREE.MeshBasicMaterial;
    m.map?.dispose();
    m.map = textTexture(lines, 256, 256, '#5B6070');
    m.needsUpdate = true;
  };
  flowers(d, 0, 0.1, 9, 0.6);
  tree(d, 3.8, 2.4, 1.2, 'round', '#6FAF6A');
  tree(d, -4.4, 3.2, 0.9, 'pine', '#3E8E5E');
  fence(d, -5.6, -5.0, 5.6, -5.0, '#4A4F5A');
  lamp(d, -2.4, 2.2);
  bench(d, 2.6, 0.6, -0.5);
  d.spots = [new THREE.Vector3(0, 0, 1.4), new THREE.Vector3(-1.6, 0, 1.8), new THREE.Vector3(1.6, 0, 1.8), new THREE.Vector3(-0.8, 0, 3.0), new THREE.Vector3(0.9, 0, 3.0)];
  return d;
}

import { EXTRA_BUILDERS } from './dioramas2.ts';

const BUILDERS: Partial<Record<Place, () => Diorama>> = {
  ...EXTRA_BUILDERS,
  home: buildHome, apartment: buildApartment, school: buildSchool, uni: buildUni, office: buildOffice,
  hospital: buildHospital, park: buildPark, cemetery: buildCemetery, party: buildApartment,
};

export function buildDiorama(place: Place): Diorama {
  const d = (BUILDERS[place] ?? buildHome)();
  d.place = place;
  d.root.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.matrixAutoUpdate = true; });
  return d;
}
