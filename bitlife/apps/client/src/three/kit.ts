// Shared geometry/material helpers: everything is rounded and cached.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const geoCache = new Map<string, THREE.BufferGeometry>();
function cached<T extends THREE.BufferGeometry>(key: string, make: () => T): T {
  let g = geoCache.get(key);
  if (!g) { g = make(); geoCache.set(key, g); }
  return g as T;
}

export const G = {
  sphere: (seg = 24) => cached(`s${seg}`, () => new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75))),
  capsule: () => cached('cap', () => new THREE.CapsuleGeometry(0.5, 1, 6, 16)),
  box: (w: number, h: number, d: number, r = 0.08) => cached(`b${w},${h},${d},${r}`, () => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, Math.min(w, h, d) / 2 - 0.001))),
  cyl: (rt: number, rb: number, h: number, seg = 24) => cached(`c${rt},${rb},${h},${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg)),
  cone: (r: number, h: number, seg = 16) => cached(`k${r},${h},${seg}`, () => new THREE.ConeGeometry(r, h, seg)),
  torus: (r: number, t: number, arc = Math.PI * 2) => cached(`t${r},${t},${arc}`, () => new THREE.TorusGeometry(r, t, 10, 28, arc)),
  cap: (r: number, theta: number, start = 0) => cached(`h${r},${theta},${start}`, () => new THREE.SphereGeometry(r, 28, 18, 0, Math.PI * 2, start, theta)),
  circle: (r: number, start = 0, len = Math.PI * 2) => cached(`ci${r},${start},${len}`, () => new THREE.CircleGeometry(r, 24, start, len)),
  plane: (w: number, h: number) => cached(`p${w},${h}`, () => new THREE.PlaneGeometry(w, h)),
};

const matCache = new Map<string, THREE.MeshStandardMaterial>();
/** Cached standard material (do not mutate unless `unique`). */
export function M(color: THREE.ColorRepresentation, o: { rough?: number; metal?: number; emissive?: THREE.ColorRepresentation; ei?: number; unique?: boolean; transparent?: boolean; opacity?: number } = {}): THREE.MeshStandardMaterial {
  const key = `${new THREE.Color(color).getHexString()}|${o.rough ?? 0.7}|${o.metal ?? 0}|${o.emissive ?? ''}|${o.ei ?? 0}|${o.opacity ?? 1}`;
  if (!o.unique) {
    const m = matCache.get(key);
    if (m) return m;
  }
  const m = new THREE.MeshStandardMaterial({
    color, roughness: o.rough ?? 0.7, metalness: o.metal ?? 0,
    emissive: o.emissive ?? 0x000000, emissiveIntensity: o.ei ?? 0,
    transparent: o.transparent ?? (o.opacity !== undefined && o.opacity < 1), opacity: o.opacity ?? 1,
  });
  if (!o.unique) matCache.set(key, m);
  return m;
}

export function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, shadow = true): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}

/** Soft radial blob used as contact shadow. */
let blobTex: THREE.Texture | null = null;
export function blobShadow(radius: number, opacity = 0.35): THREE.Mesh {
  if (!blobTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(40,30,60,1)');
    grd.addColorStop(0.5, 'rgba(40,30,60,0.5)');
    grd.addColorStop(1, 'rgba(40,30,60,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    blobTex = new THREE.CanvasTexture(c);
  }
  const m = new THREE.Mesh(G.plane(1, 1), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.scale.setScalar(radius * 2);
  m.position.y = 0.012;
  m.renderOrder = 1;
  return m;
}

/** Emoji sprite texture (cached). */
const emojiCache = new Map<string, THREE.Texture>();
export function emojiTexture(e: string): THREE.Texture {
  let t = emojiCache.get(e);
  if (!t) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    g.font = '100px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(e, 64, 72);
    t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    emojiCache.set(e, t);
  }
  return t;
}

export function textTexture(lines: string[], w = 256, h = 256, color = '#5b5148', font = 'Fredoka Variable, Fredoka, sans-serif'): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = color;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  lines.forEach((l, i) => {
    const size = i === 0 ? h * 0.16 : h * 0.11;
    g.font = `600 ${size}px ${font}`;
    g.fillText(l, w / 2, h * 0.3 + i * h * 0.2, w * 0.9);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export const ease = {
  outBack: (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t: number) => 1 - Math.pow(1 - t, 3),
};
