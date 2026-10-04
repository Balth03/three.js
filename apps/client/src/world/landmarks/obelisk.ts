import * as THREE from 'three';
import { MeshBuilder, applyNightPatch, disposeObject, smoothstep } from './common';
import { greyGraniteTextures, hieroglyphTextures, pedestalDieTextures } from './textures';
import type { Landmark, LandmarkCollider, LandmarkOptions } from './types';

/*
 * Luxor Obelisk, Place de la Concorde. 22.83 m pink granite monolith with a gilded pyramidion, on a ~9 m grey
 * granite pedestal. Total ≈ 32.3 m. Rotation irrelevant (square plan).
 */

const V = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);

/** Square frustum: half widths a (bottom) / b (top), y0..y1. faces bits: sides(1) top(2) bottom(4). */
function frustum(mb: MeshBuilder, a: number, b: number, y0: number, y1: number, faces = 3): void {
  const c = [V(-a, y0, -a), V(a, y0, -a), V(a, y0, a), V(-a, y0, a), V(-b, y1, -b), V(b, y1, -b), V(b, y1, b), V(-b, y1, b)];
  let mask = 0;
  if (faces & 1) mask |= 0b001111;
  if (faces & 2) mask |= 0b010000;
  if (faces & 4) mask |= 0b100000;
  mb.hexa(c, mask);
}

export function createObelisk(opts: LandmarkOptions = {}): Landmark {
  const high = (opts.quality ?? 'high') === 'high';

  const plain = new MeshBuilder();
  plain.uvScale = 2.5;
  const die = new MeshBuilder();
  const shaft = new MeshBuilder();
  const gold = new MeshBuilder();

  // ---------------------------------------------------------------- pedestal (grey granite)
  plain.setColor(0.92);
  frustum(plain, 3.4, 3.4, 0, 0.32, 3);
  frustum(plain, 3.0, 3.0, 0.32, 0.64, 3);
  plain.setColor(1);
  frustum(plain, 2.35, 2.35, 0.64, 1.55, 3);
  frustum(plain, 2.35, 2.12, 1.55, 1.72, 3); // chamfered moulding
  frustum(plain, 2.12, 1.92, 1.72, 1.85, 3);
  // die (1.85 -> 6.45) with gilded diagrams on ±X, inscriptions on ±Z
  {
    const h = 1.85;
    const t = 6.45;
    const a = 1.85;
    const faces: [THREE.Vector3, THREE.Vector3, number][] = [
      [V(1, 0, 0), V(0, 0, -1), 0],
      [V(-1, 0, 0), V(0, 0, 1), 0],
      [V(0, 0, 1), V(1, 0, 0), 0.5],
      [V(0, 0, -1), V(-1, 0, 0), 0.5],
    ];
    for (const [n, u, u0] of faces) {
      const c = n.clone().multiplyScalar(a);
      const p0 = c.clone().addScaledVector(u, -a).setY(h);
      const p1 = c.clone().addScaledVector(u, a).setY(h);
      const p2 = c.clone().addScaledVector(u, a).setY(t);
      const p3 = c.clone().addScaledVector(u, -a).setY(t);
      die.quad(p0, p1, p2, p3, n, [
        [u0, 0],
        [u0 + 0.5, 0],
        [u0 + 0.5, 1],
        [u0, 1],
      ]);
    }
  }
  // cornice
  frustum(plain, 1.85, 2.2, 6.45, 6.72, 7);
  frustum(plain, 2.2, 2.2, 6.72, 7.05, 3);
  frustum(plain, 2.2, 1.7, 7.05, 7.3, 3);
  // upper plinth
  frustum(plain, 1.55, 1.55, 7.3, 8.5, 3);
  frustum(plain, 1.68, 1.68, 8.5, 8.68, 7);
  frustum(plain, 1.38, 1.38, 8.68, 9.0, 3);

  // ---------------------------------------------------------------- shaft (pink granite, hieroglyphs)
  const Y0 = 9.0;
  const Y1 = 30.0;
  const A = 2.42 / 2;
  const B = 1.54 / 2;
  const rows = high ? 6 : 1;
  for (let f = 0; f < 4; f++) {
    const ang = (f * Math.PI) / 2;
    const n = V(Math.cos(ang), 0, Math.sin(ang));
    const u = V(-Math.sin(ang), 0, Math.cos(ang)).negate();
    for (let r = 0; r < rows; r++) {
      const t0 = r / rows;
      const t1 = (r + 1) / rows;
      // slight entasis: faces bulge a few cm (the real faces are slightly convex)
      const w0 = A + (B - A) * t0;
      const w1 = A + (B - A) * t1;
      const y0 = Y0 + (Y1 - Y0) * t0;
      const y1 = Y0 + (Y1 - Y0) * t1;
      const p0 = n.clone().multiplyScalar(w0).addScaledVector(u, -w0).setY(y0);
      const p1 = n.clone().multiplyScalar(w0).addScaledVector(u, w0).setY(y0);
      const p2 = n.clone().multiplyScalar(w1).addScaledVector(u, w1).setY(y1);
      const p3 = n.clone().multiplyScalar(w1).addScaledVector(u, -w1).setY(y1);
      const nn = n.clone().multiplyScalar(Y1 - Y0).add(V(0, A - B, 0)).normalize();
      const mirror = f % 2 === 1;
      const ua = mirror ? 1 : 0;
      const ub = mirror ? 0 : 1;
      shaft.quad(p0, p1, p2, p3, nn, [
        [ua, t0],
        [ub, t0],
        [ub, t1],
        [ua, t1],
      ]);
    }
  }
  // ---------------------------------------------------------------- gilded pyramidion
  const apex = V(0, 32.3, 0);
  for (let f = 0; f < 4; f++) {
    const a0 = (f * Math.PI) / 2 + Math.PI / 4;
    const a1 = a0 + Math.PI / 2;
    const r = B * Math.SQRT2;
    const p0 = V(Math.cos(a0) * r, Y1, Math.sin(a0) * r);
    const p1 = V(Math.cos(a1) * r, Y1, Math.sin(a1) * r);
    gold.tri(p0, p1, apex);
  }

  // ---------------------------------------------------------------- materials
  const hiero = hieroglyphTextures(high ? 256 : 128, high ? 2048 : 1024, 31);
  hiero.map.wrapS = hiero.map.wrapT = THREE.ClampToEdgeWrapping;
  hiero.normalMap.wrapS = hiero.normalMap.wrapT = THREE.ClampToEdgeWrapping;
  const grey = greyGraniteTextures(high ? 256 : 128, 41);
  const dieT = pedestalDieTextures(high ? 256 : 128, 51);
  dieT.map.wrapS = dieT.map.wrapT = THREE.ClampToEdgeWrapping;
  dieT.normalMap.wrapS = dieT.normalMap.wrapT = THREE.ClampToEdgeWrapping;

  const uNight = { value: 0 };
  const uFlood = { value: new THREE.Color(1.0, 0.82, 0.6) };
  const flood = /* glsl */ `
    float h = lmPos.y;
    float vert = 1.0 - abs(lmN.y);
    float fl = mix(1.5, 0.55, smoothstep(0.0, 32.0, h)) * (0.35 + 0.65 * vert + 0.5 * max(-lmN.y, 0.0));
    lmE = diffuseColor.rgb * uFlood * fl * uNight;
  `;
  const plainMat = new THREE.MeshStandardMaterial({ map: grey.map, normalMap: grey.normalMap, roughness: 0.55, metalness: 0, vertexColors: true });
  applyNightPatch(plainMat, { uniforms: { uNight, uFlood }, emissiveGLSL: flood, key: 'ob-plain' });
  const dieMat = new THREE.MeshStandardMaterial({ map: dieT.map, normalMap: dieT.normalMap, roughnessMap: dieT.roughnessMap, metalnessMap: dieT.metalnessMap, roughness: 1, metalness: 1, vertexColors: true });
  applyNightPatch(dieMat, { uniforms: { uNight, uFlood }, emissiveGLSL: flood, key: 'ob-die' });
  const shaftMat = new THREE.MeshStandardMaterial({ map: hiero.map, normalMap: hiero.normalMap, normalScale: new THREE.Vector2(1.2, 1.2), roughness: 0.62, metalness: 0, vertexColors: true });
  applyNightPatch(shaftMat, {
    uniforms: { uNight, uFlood },
    colorGLSL: 'diffuseColor.rgb *= 0.92 + 0.12 * lmFbm(lmPos * vec3(2.0, 0.25, 2.0)) - 0.06 * smoothstep(12.0, 9.0, lmPos.y);',
    emissiveGLSL: flood,
    key: 'ob-shaft',
  });
  const goldMat = new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(1.0, 0.78, 0.36, THREE.SRGBColorSpace), roughness: 0.25, metalness: 1, vertexColors: true });
  applyNightPatch(goldMat, { uniforms: { uNight, uFlood }, emissiveGLSL: 'lmE = diffuseColor.rgb * uFlood * uNight * 0.9;', key: 'ob-gold' });

  const group = new THREE.Group();
  group.name = 'Obelisk';
  for (const [mb, mat, name] of [
    [plain, plainMat, 'obelisk-pedestal'],
    [die, dieMat, 'obelisk-die'],
    [shaft, shaftMat, 'obelisk-shaft'],
    [gold, goldMat, 'obelisk-pyramidion'],
  ] as const) {
    const mesh = new THREE.Mesh(mb.build(), mat);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  const colliders: LandmarkCollider[] = [
    { kind: 'box', center: [0, 0.32, 0], halfExtents: [3.4, 0.32, 3.4], rotationY: 0 },
    { kind: 'box', center: [0, 4.5, 0], halfExtents: [2.35, 4.5, 2.35], rotationY: 0 },
    { kind: 'box', center: [0, 20.4, 0], halfExtents: [A, 11.4, A], rotationY: 0 },
  ];

  return {
    object: group,
    colliders,
    update(_t: number, night: number): void {
      uNight.value = smoothstep(0.15, 0.85, night) * 0.75;
    },
    dispose(): void {
      disposeObject(group);
    },
  };
}
