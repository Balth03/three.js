import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { patchMaterial, G } from '../render/materials/common';
import { mulberry32 } from '@taxi/shared';

/**
 * Procedural street furniture and trees (Paris style). Every geometry carries:
 *  color (vertex colour = albedo), aEmit (float: 0 none, 1 warm lamp, 2 signal red, 3 signal amber, 4 signal green, 5 cool panel).
 */

function colorize(g: THREE.BufferGeometry, c: THREE.ColorRepresentation, emit = 0): THREE.BufferGeometry {
  const geo = g.index ? g.toNonIndexed() : g;
  const n = geo.attributes.position.count;
  const col = new THREE.Color(c);
  const ca = new Float32Array(n * 3), ea = new Float32Array(n);
  for (let i = 0; i < n; i++) { ca[i * 3] = col.r; ca[i * 3 + 1] = col.g; ca[i * 3 + 2] = col.b; ea[i] = emit; }
  geo.setAttribute('color', new THREE.BufferAttribute(ca, 3));
  geo.setAttribute('aEmit', new THREE.BufferAttribute(ea, 1));
  if (geo.attributes.uv) geo.deleteAttribute('uv');
  return geo;
}
const at = (g: THREE.BufferGeometry, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
  g.rotateX(rx); g.rotateY(ry); g.rotateZ(rz); g.translate(x, y, z); return g;
};

const PAINT_GREEN = 0x16201b; // Paris street furniture "vert Wallace" (very dark)
const IRON = 0x1b1d1e;

export function propMaterial(name: string): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.35 });
  return patchMaterial(m, {
    name: 'prop_' + name,
    vertexHeader: 'attribute float aEmit; varying float vEmit; varying vec4 vInst;',
    vertexMain: /* glsl */ `
      vEmit = aEmit;
      #ifdef USE_INSTANCING
        vInst = vec4(instanceMatrix[3].xyz, 0.0);
      #else
        vInst = vec4(0.0);
      #endif
    `,
    fragmentHeader: /* glsl */ `
      varying float vEmit; varying vec4 vInst; float lfHeight;
      uniform float uSignalTime;
    `,
    afterMap: 'lfHeight = max(0.0, vWorld.y - vInst.y); diffuseColor.rgb *= 1.0 - uWet * 0.2;',
    afterRoughness: 'roughnessFactor *= 1.0 - uWet * 0.4;',
    afterEmissive: /* glsl */ `
      {
        float e = vEmit;
        if (e > 0.5 && e < 1.5) totalEmissiveRadiance += vec3(1.0, 0.78, 0.5) * 7.0 * smoothstep(0.2, 0.7, uNight);
        if (e > 4.5) totalEmissiveRadiance += vec3(0.85, 0.9, 1.0) * 1.8 * (0.3 + 0.7 * smoothstep(0.1, 0.6, uNight));
      }
    `,
    afterLights: /* glsl */ `
      {
        vec4 lf = sampleLightField(vWorld.xz);
        reflectedLight.directDiffuse += lf.rgb * exp(-max(0.0, lfHeight - 1.5) * 0.2) * BRDF_Lambert(material.diffuseColor);
      }
    `,
  });
}

/** Paris Haussmann-style lamp post with a single lantern (~6.5 m). */
export function lampGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const base = new THREE.LatheGeometry([new THREE.Vector2(0.0, 0), new THREE.Vector2(0.22, 0), new THREE.Vector2(0.22, 0.1), new THREE.Vector2(0.16, 0.25), new THREE.Vector2(0.17, 0.5), new THREE.Vector2(0.1, 0.7), new THREE.Vector2(0.075, 1.0), new THREE.Vector2(0.0, 1.0)], 10);
  parts.push(colorize(base, PAINT_GREEN));
  parts.push(colorize(at(new THREE.CylinderGeometry(0.055, 0.075, 4.8, 8), 0, 3.4, 0), PAINT_GREEN));
  // collar rings
  parts.push(colorize(at(new THREE.TorusGeometry(0.08, 0.02, 4, 10), 0, 1.6, 0, Math.PI / 2), PAINT_GREEN));
  parts.push(colorize(at(new THREE.TorusGeometry(0.07, 0.02, 4, 10), 0, 5.6, 0, Math.PI / 2), PAINT_GREEN));
  // curved arm towards the street (-Z)
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 5.6, 0), new THREE.Vector3(0, 6.3, -0.2), new THREE.Vector3(0, 6.55, -0.7), new THREE.Vector3(0, 6.45, -1.15)]);
  parts.push(colorize(new THREE.TubeGeometry(curve, 8, 0.035, 5), PAINT_GREEN));
  // lantern: hexagonal glass body, cap and finial
  const lx = 0, ly = 6.0, lz = -1.15;
  parts.push(colorize(at(new THREE.CylinderGeometry(0.2, 0.13, 0.45, 6, 1, true), lx, ly, lz), 0xfff0d8, 1));
  parts.push(colorize(at(new THREE.CylinderGeometry(0.06, 0.25, 0.16, 6), lx, ly + 0.3, lz), PAINT_GREEN));
  parts.push(colorize(at(new THREE.ConeGeometry(0.05, 0.16, 6), lx, ly + 0.46, lz), PAINT_GREEN));
  parts.push(colorize(at(new THREE.CylinderGeometry(0.14, 0.09, 0.08, 6), lx, ly - 0.26, lz), PAINT_GREEN));
  return mergeGeometries(parts)!;
}

/** French traffic light: grey pole, 3-aspect housing at 2.8 m + small repeater at eye level. */
export function signalGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  parts.push(colorize(at(new THREE.CylinderGeometry(0.055, 0.065, 3.3, 8), 0, 1.65, 0), 0x2c2f31));
  const housing = (y: number, s: number) => {
    parts.push(colorize(at(new THREE.BoxGeometry(0.3 * s, 0.85 * s, 0.22 * s), 0, y, -0.12 * s), 0x1a1c1d));
    const em = [2, 3, 4];
    for (let k = 0; k < 3; k++) {
      parts.push(colorize(at(new THREE.CircleGeometry(0.09 * s, 12), 0, y + (0.27 - k * 0.27) * s, -0.235 * s, 0, Math.PI), 0x111111, em[k]));
      // visors
      parts.push(colorize(at(new THREE.CylinderGeometry(0.105 * s, 0.105 * s, 0.1 * s, 10, 1, true, -Math.PI / 2, Math.PI), 0, y + (0.27 - k * 0.27) * s + 0.0, -0.28 * s, Math.PI / 2), 0x151617));
    }
  };
  housing(2.85, 1);
  housing(1.55, 0.45);
  return mergeGeometries(parts)!;
}

export function signalMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.3 });
  return patchMaterial(m, {
    name: 'signal',
    vertexHeader: 'attribute float aEmit; varying float vEmit; varying vec2 vSig;',
    vertexMain: /* glsl */ `
      vEmit = aEmit;
      // per-instance signal timing is packed in the instance matrix scale: x-scale = 1 + offset/1000, axis in z-scale sign
      #ifdef USE_INSTANCING
        float sx = length(instanceMatrix[0].xyz);
        float sz = length(instanceMatrix[2].xyz);
        vSig = vec2((sx - 1.0) * 1000.0, sz > 1.0005 ? 1.0 : 0.0);
      #else
        vSig = vec2(0.0);
      #endif
    `,
    fragmentHeader: 'varying float vEmit; varying vec2 vSig;\n' + SIGNAL_GLSL,
    afterEmissive: /* glsl */ `
      {
        int st = signalState(uTime + vSig.x, vSig.y);
        float on = 0.0; vec3 c = vec3(0.0);
        if (vEmit > 1.5 && vEmit < 2.5 && st == 2) { on = 1.0; c = vec3(1.0, 0.08, 0.04); }
        if (vEmit > 2.5 && vEmit < 3.5 && st == 1) { on = 1.0; c = vec3(1.0, 0.45, 0.02); }
        if (vEmit > 3.5 && vEmit < 4.5 && st == 0) { on = 1.0; c = vec3(0.1, 1.0, 0.45); }
        totalEmissiveRadiance += c * on * mix(4.0, 9.0, uNight);
        if (vEmit > 1.5 && vEmit < 4.5) diffuseColor.rgb = mix(diffuseColor.rgb, c * 0.3, on);
      }
    `,
  });
}

/** Signal state for an approach axis: 0 green, 1 amber, 2 red. Same function on CPU (traffic AI) and GPU. */
export const SIGNAL_CYCLE = 64;
export const SIGNAL_GLSL = /* glsl */ `
int signalState(float t, float axis){
  float c = mod(t + axis * 32.0, 64.0);
  if (c < 25.0) return 0;
  if (c < 28.0) return 1;
  return 2;
}`;
export function signalState(t: number, axis: number): number {
  let c = (t + axis * 32) % SIGNAL_CYCLE;
  if (c < 0) c += SIGNAL_CYCLE;
  if (c < 25) return 0;
  if (c < 28) return 1;
  return 2;
}

export function benchGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const wood = 0x2b3a2c;
  for (let k = 0; k < 3; k++) parts.push(colorize(at(new THREE.BoxGeometry(1.8, 0.04, 0.1), 0, 0.45, -0.15 + k * 0.13), wood));
  for (let k = 0; k < 2; k++) parts.push(colorize(at(new THREE.BoxGeometry(1.8, 0.1, 0.035), 0, 0.62 + k * 0.14, 0.22, -0.25), wood));
  for (const x of [-0.8, 0.8]) {
    parts.push(colorize(at(new THREE.BoxGeometry(0.06, 0.45, 0.5), x, 0.22, 0.02), IRON));
    parts.push(colorize(at(new THREE.BoxGeometry(0.05, 0.45, 0.05), x, 0.65, 0.23, -0.25), IRON));
  }
  return mergeGeometries(parts)!;
}

export function bollardGeometry(): THREE.BufferGeometry {
  const prof = [new THREE.Vector2(0, 0), new THREE.Vector2(0.075, 0), new THREE.Vector2(0.07, 0.75), new THREE.Vector2(0.09, 0.8), new THREE.Vector2(0.085, 0.85), new THREE.Vector2(0.06, 0.9), new THREE.Vector2(0.07, 0.96), new THREE.Vector2(0.04, 1.02), new THREE.Vector2(0, 1.04)];
  return mergeGeometries([colorize(new THREE.LatheGeometry(prof, 10), 0x2a2420)])!;
}

export function busStopGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const metal = 0x3a3d40;
  parts.push(colorize(at(new THREE.BoxGeometry(3.8, 0.08, 1.5), 0, 2.45, 0), metal));
  for (const x of [-1.85, 1.85]) for (const z of [0.65]) parts.push(colorize(at(new THREE.BoxGeometry(0.07, 2.45, 0.07), x, 1.22, z), metal));
  // back glass panel (rendered as bluish semi-dark), ad panel lit
  parts.push(colorize(at(new THREE.BoxGeometry(3.6, 2.0, 0.02), 0, 1.25, 0.68), 0x2a3236));
  parts.push(colorize(at(new THREE.BoxGeometry(0.06, 1.75, 1.2), 1.88, 1.2, 0.05), 0xd8dde0, 5));
  parts.push(colorize(at(new THREE.BoxGeometry(2.0, 0.05, 0.35), -0.4, 0.5, 0.45), metal));
  return mergeGeometries(parts)!;
}

export function wallaceGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const g = 0x14301f;
  parts.push(colorize(new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(0.38, 0), new THREE.Vector2(0.38, 0.25), new THREE.Vector2(0.3, 0.35), new THREE.Vector2(0.28, 1.0), new THREE.Vector2(0.33, 1.1), new THREE.Vector2(0, 1.1)], 12), g));
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    parts.push(colorize(at(new THREE.CylinderGeometry(0.07, 0.09, 1.0, 6), Math.cos(a) * 0.2, 1.6, Math.sin(a) * 0.2), g));
  }
  parts.push(colorize(at(new THREE.SphereGeometry(0.36, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0, 2.15, 0), g));
  parts.push(colorize(at(new THREE.ConeGeometry(0.08, 0.35, 8), 0, 2.65, 0), g));
  return mergeGeometries(parts)!;
}

export function binGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  parts.push(colorize(at(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 6), 0, 0.5, 0.2), 0x3b4a3a));
  parts.push(colorize(at(new THREE.TorusGeometry(0.2, 0.02, 4, 12), 0, 0.95, 0, Math.PI / 2), 0x3b4a3a));
  parts.push(colorize(at(new THREE.CylinderGeometry(0.2, 0.15, 0.55, 10, 1, true), 0, 0.7, 0), 0x6f8a62));
  return mergeGeometries(parts)!;
}

export function postboxGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  parts.push(colorize(at(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6), 0, 0.45, 0), 0x333333));
  parts.push(colorize(at(new THREE.BoxGeometry(0.45, 0.6, 0.4), 0, 1.15, 0), 0xe8b512));
  return mergeGeometries(parts)!;
}

// ------------------------------------------------------------------------------------------------ trees
function leafTexture(): THREE.CanvasTexture {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const ctx = cv.getContext('2d')!;
  ctx.clearRect(0, 0, S, S);
  const rnd = mulberry32(7);
  // cluster of plane-tree leaves (palmate) on a twig
  for (let i = 0; i < 70; i++) {
    const r = Math.sqrt(rnd()) * S * 0.42;
    const a = rnd() * Math.PI * 2;
    const x = S / 2 + Math.cos(a) * r, y = S / 2 + Math.sin(a) * r;
    const s = 10 + rnd() * 14;
    const g = 130 + rnd() * 90;
    ctx.fillStyle = `rgb(${Math.floor(g * 0.55)},${Math.floor(g)},${Math.floor(g * 0.35)})`;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rnd() * Math.PI * 2);
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const ang = (k / 10) * Math.PI * 2;
      const rr = k % 2 === 0 ? s : s * 0.55;
      ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr * 0.9);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Plane tree (platane). near: ~180 leaf cards; far: ~28 big cards. */
export function treeGeometry(lod: 'near' | 'far'): { trunk: THREE.BufferGeometry; crown: THREE.BufferGeometry } {
  const rnd = mulberry32(lod === 'near' ? 3 : 5);
  const trunkParts: THREE.BufferGeometry[] = [];
  const seg = lod === 'near' ? 7 : 5;
  trunkParts.push(at(new THREE.CylinderGeometry(0.16, 0.26, 4.2, seg), 0, 2.1, 0));
  const nb = lod === 'near' ? 5 : 3;
  for (let i = 0; i < nb; i++) {
    const a = (i / nb) * Math.PI * 2 + rnd();
    const len = 3.2 + rnd() * 1.5;
    const b = new THREE.CylinderGeometry(0.06, 0.13, len, seg - 2);
    b.translate(0, len / 2, 0);
    b.rotateZ(0.55 + rnd() * 0.25);
    b.rotateY(a);
    b.translate(0, 3.8, 0);
    trunkParts.push(b);
  }
  const trunk = mergeGeometries(trunkParts.map((g) => { g.deleteAttribute('uv'); return g; }))!;
  // crown cards on an ellipsoid shell, normals pointing outwards from the crown centre
  const cards = lod === 'near' ? 190 : 34;
  const size = lod === 'near' ? 1.9 : 3.6;
  const pos: number[] = [], nor: number[] = [], uv: number[] = [], idx: number[] = [];
  const cy = 8.2, rx = 4.2, ry = 3.4;
  for (let i = 0; i < cards; i++) {
    const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2;
    const r = Math.pow(rnd(), 0.35);
    const sx = Math.sqrt(1 - u * u) * Math.cos(th), sz = Math.sqrt(1 - u * u) * Math.sin(th), sy = u;
    const px = sx * rx * r, py = cy + sy * ry * r, pz = sz * rx * r;
    const n = new THREE.Vector3(sx, sy * 0.8 + 0.2, sz).normalize();
    // random orientation, roughly facing outwards
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI));
    const ax = new THREE.Vector3(1, 0, 0).applyQuaternion(q).multiplyScalar(size / 2);
    const ay = new THREE.Vector3(0, 1, 0).applyQuaternion(q).multiplyScalar(size / 2);
    const base = pos.length / 3;
    for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      pos.push(px + ax.x * a + ay.x * b, py + ax.y * a + ay.y * b, pz + ax.z * a + ay.z * b);
      nor.push(n.x, n.y, n.z);
      uv.push((a + 1) / 2, (b + 1) / 2);
    }
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  const crown = new THREE.BufferGeometry();
  crown.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  crown.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  crown.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  crown.setIndex(idx);
  return { trunk, crown };
}

let leafTex: THREE.CanvasTexture | null = null;
export function crownMaterial(): THREE.MeshStandardMaterial {
  leafTex ??= leafTexture();
  const m = new THREE.MeshStandardMaterial({ map: leafTex, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.8, metalness: 0 });
  patchMaterial(m, {
    name: 'crown',
    vertexMain: /* glsl */ `
      {
        // wind sway: stronger at the top, phase per tree
        vec3 tp = vec3(0.0);
        #ifdef USE_INSTANCING
          tp = instanceMatrix[3].xyz;
        #endif
        float ph = dot(tp.xz, vec2(0.13, 0.17));
        float sway = (sin(uTime * 1.3 + ph) * 0.5 + sin(uTime * 2.7 + ph * 1.7) * 0.25) * max(0.0, position.y - 4.0) * 0.02;
        vec4 off = vec4(sway, 0.0, sway * 0.6, 0.0);
        gl_Position += projectionMatrix * viewMatrix * off;
        vWorld += off.xyz;
      }
    `,
    fragmentHeader: 'float lfHeight;',
    afterMap: /* glsl */ `
      lfHeight = 4.0;
      {
        float v = vnoise(vWorld.xz * 0.15 + floor(vWorld.y));
        // late September: a few yellowing leaves
        diffuseColor.rgb *= mix(vec3(0.62, 0.78, 0.42), vec3(1.0, 0.85, 0.45), smoothstep(0.65, 0.9, v)) * 1.05;
        diffuseColor.rgb *= 1.0 - uWet * 0.25;
      }
    `,
    afterRoughness: 'roughnessFactor *= 1.0 - uWet * 0.5;',
    afterLights: /* glsl */ `
      {
        // translucency: leaves glow when back-lit by the sun
        vec4 lf = sampleLightField(vWorld.xz);
        reflectedLight.directDiffuse += lf.rgb * 0.22 * BRDF_Lambert(material.diffuseColor);
      }
    `,
  });
  return m;
}

export function trunkMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 });
  return patchMaterial(m, {
    name: 'trunk',
    fragmentHeader: 'float lfHeight;',
    afterMap: /* glsl */ `
      lfHeight = 2.0;
      {
        // plane tree camouflage bark
        vec2 q = vec2(atan(vWNormal.x, vWNormal.z) * 1.5, vWorld.y * 1.2) + vWorld.xz * 0.3;
        float n = fbm(q * 1.4);
        vec3 c = mix(vec3(0.38, 0.36, 0.27), vec3(0.62, 0.6, 0.48), smoothstep(0.45, 0.5, n));
        c = mix(c, vec3(0.27, 0.27, 0.2), smoothstep(0.62, 0.66, fbm(q * 2.3 + 4.0)));
        diffuseColor.rgb = c * (1.0 - uWet * 0.35);
      }
    `,
    afterLights: /* glsl */ `
      { vec4 lf = sampleLightField(vWorld.xz); reflectedLight.directDiffuse += lf.rgb * BRDF_Lambert(material.diffuseColor); }
    `,
  });
}

export { G };
