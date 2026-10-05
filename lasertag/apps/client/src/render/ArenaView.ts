import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { rampVertices, type MapDef, type MapBox, type TrimColor } from '@neon/shared';
import { createArenaMaterial, createFloorMaterial, MAT, PATTERN, MAX_SPAWN_PADS } from './arenaMaterials.ts';
import { NU, NEON_UNIFORMS_GLSL, NEON_FUNCS_GLSL, TEAM_HEX } from './neon.ts';
import { makeTextTexture } from './textures.ts';

const ALBEDO: Record<string, [number, number, number]> = {
  wall: [0.085, 0.07, 0.14],
  perimeter: [0.05, 0.042, 0.09],
  crate: [0.07, 0.075, 0.1],
  metal: [0.11, 0.11, 0.15],
  glass: [0.05, 0.08, 0.1],
  mirror: [0.02, 0.02, 0.03],
  ramp: [0.07, 0.06, 0.11],
  ceiling: [0.025, 0.02, 0.045],
};

function trimColor(t: TrimColor): THREE.Color {
  const c = new THREE.Color(0, 0, 0);
  switch (t) {
    case 'violet': return c.set('#9b5cff').multiplyScalar(2.4);
    case 'blue': return c.set('#3d7bff').multiplyScalar(2.4);
    case 'orange': return c.set('#ff8a1f').multiplyScalar(2.6);
    case 'white': return c.set('#fff2e0').multiplyScalar(2.0);
    case 'team0': return c.set(TEAM_HEX[0]).multiplyScalar(3.0);
    case 'team1': return c.set(TEAM_HEX[1]).multiplyScalar(3.0);
    default: return c;
  }
}

interface SurfaceAttrs {
  boxMin: THREE.Vector3; boxMax: THREE.Vector3; albedo: [number, number, number]; trim: THREE.Color; tint: THREE.Color; pattern: number; mat: number;
}

function decorate(g: THREE.BufferGeometry, a: SurfaceAttrs): THREE.BufferGeometry {
  if (g.index) g = g.toNonIndexed();
  const n = g.attributes.position.count;
  const f3 = (v: [number, number, number]) => { const arr = new Float32Array(n * 3); for (let i = 0; i < n; i++) arr.set(v, i * 3); return new THREE.BufferAttribute(arr, 3); };
  const f1 = (v: number) => new THREE.BufferAttribute(new Float32Array(n).fill(v), 1);
  g.setAttribute('aBoxMin', f3([a.boxMin.x, a.boxMin.y, a.boxMin.z]));
  g.setAttribute('aBoxMax', f3([a.boxMax.x, a.boxMax.y, a.boxMax.z]));
  g.setAttribute('aAlbedo', f3(a.albedo));
  g.setAttribute('aTrim', f3([a.trim.r, a.trim.g, a.trim.b]));
  g.setAttribute('aTint', f3([a.tint.r, a.tint.g, a.tint.b]));
  g.setAttribute('aPattern', f1(a.pattern));
  g.setAttribute('aMat', f1(a.mat));
  g.deleteAttribute('uv');
  return g;
}

/** Everything static in the arena, built from the same MapDef as the colliders. */
export class ArenaView {
  readonly group = new THREE.Group();
  readonly surfaceMat = createArenaMaterial();
  readonly floorMat = createFloorMaterial();
  readonly floor: THREE.Mesh;
  private readonly signMats: THREE.ShaderMaterial[] = [];
  private stationRings: THREE.Mesh[] = [];

  constructor(readonly map: MapDef) {
    const tints = map.atmosphere.patternTints.map((h) => new THREE.Color(h));
    const geos: THREE.BufferGeometry[] = [];

    const addBox = (b: MapBox) => {
      const sx = b.max[0] - b.min[0], sy = b.max[1] - b.min[1], sz = b.max[2] - b.min[2];
      const g = new THREE.BoxGeometry(sx, sy, sz);
      g.translate(b.min[0] + sx / 2, b.min[1] + sy / 2, b.min[2] + sz / 2);
      const mat = b.kind === 'perimeter' ? MAT.perimeter : MAT[b.mat];
      geos.push(decorate(g, {
        boxMin: new THREE.Vector3(...b.min), boxMax: new THREE.Vector3(...b.max),
        albedo: ALBEDO[b.kind === 'perimeter' ? 'perimeter' : b.mat],
        trim: trimColor(b.trim), tint: tints[b.tint ?? 0] ?? tints[0], pattern: PATTERN[b.pattern], mat,
      }));
    };
    for (const b of map.boxes) addBox(b);

    for (const r of map.ramps) {
      const pts = rampVertices(r).map((p) => new THREE.Vector3(...p));
      const g = new ConvexGeometry(pts);
      geos.push(decorate(g, {
        boxMin: new THREE.Vector3(...r.min), boxMax: new THREE.Vector3(...r.max),
        albedo: ALBEDO.ramp, trim: new THREE.Color(0, 0, 0), tint: tints[2], pattern: PATTERN.stripes, mat: MAT.ramp,
      }));
      // glowing guide strips along both sides of the ramp
      const along = r.rise[0] === 'x';
      for (const side of [0, 1]) {
        const w = 0.06;
        const a = along ? new THREE.Vector3(r.min[0], 0, side ? r.max[2] - w : r.min[2]) : new THREE.Vector3(side ? r.max[0] - w : r.min[0], 0, r.min[2]);
        const len = along ? r.max[0] - r.min[0] : r.max[2] - r.min[2];
        const rise = r.max[1] - r.min[1];
        const g2 = new THREE.BoxGeometry(along ? len : w, 0.02, along ? w : len);
        g2.rotateZ(along ? Math.atan2(rise, len) * (r.rise === 'x+' ? 1 : -1) : 0);
        g2.rotateX(!along ? Math.atan2(rise, len) * (r.rise === 'z+' ? -1 : 1) : 0);
        g2.translate(along ? a.x + len / 2 : a.x + w / 2, r.min[1] + rise / 2 + 0.02, along ? a.z + w / 2 : a.z + len / 2);
        const tc = trimColor(r.trim);
        geos.push(decorate(g2, { boxMin: new THREE.Vector3(), boxMax: new THREE.Vector3(), albedo: [0, 0, 0], trim: tc, tint: tc, pattern: 0, mat: MAT.fixture }));
      }
    }

    // ceiling slab + light fixtures
    const { min, max } = map.bounds;
    const cw = max[0] - min[0] + 1.2, cd = max[1] - min[1] + 1.2;
    const ceil = new THREE.BoxGeometry(cw, 0.4, cd);
    ceil.translate((min[0] + max[0]) / 2, map.ceiling + 0.2, (min[1] + max[1]) / 2);
    geos.push(decorate(ceil, {
      boxMin: new THREE.Vector3(min[0], map.ceiling, min[1]), boxMax: new THREE.Vector3(max[0], map.ceiling + 0.4, max[1]),
      albedo: ALBEDO.ceiling, trim: new THREE.Color(0, 0, 0), tint: tints[0].clone().multiplyScalar(0.12), pattern: PATTERN.grid, mat: MAT.ceiling,
    }));
    for (const l of map.lights) {
      if (l.pos[1] < 4) continue;
      const fx = new THREE.CylinderGeometry(0.35, 0.45, 0.18, 20);
      fx.translate(l.pos[0], l.pos[1] + 0.12, l.pos[2]);
      const c = new THREE.Color(l.color).multiplyScalar(3.0);
      geos.push(decorate(fx, { boxMin: new THREE.Vector3(), boxMax: new THREE.Vector3(), albedo: [0.02, 0.02, 0.03], trim: c, tint: c, pattern: 0, mat: MAT.fixture }));
      // hanging rod
      const rod = new THREE.CylinderGeometry(0.03, 0.03, map.ceiling - l.pos[1], 6);
      rod.translate(l.pos[0], (map.ceiling + l.pos[1]) / 2 + 0.1, l.pos[2]);
      geos.push(decorate(rod, { boxMin: new THREE.Vector3(), boxMax: new THREE.Vector3(), albedo: ALBEDO.metal, trim: new THREE.Color(0, 0, 0), tint: new THREE.Color(0, 0, 0), pattern: 0, mat: MAT.metal }));
    }

    const merged = mergeGeometries(geos, false)!;
    merged.computeBoundingSphere();
    const mesh = new THREE.Mesh(merged, this.surfaceMat);
    mesh.name = 'arena-static';
    this.group.add(mesh);

    // floor
    const fg = new THREE.PlaneGeometry(max[0] - min[0], max[1] - min[1], 1, 1);
    fg.rotateX(-Math.PI / 2);
    fg.translate((min[0] + max[0]) / 2, 0, (min[1] + max[1]) / 2);
    this.floor = new THREE.Mesh(fg, this.floorMat);
    this.floor.name = 'arena-floor';
    this.floor.layers.set(1); // not rendered into its own reflection
    this.group.add(this.floor);
    this.setupFloorUniforms();

    this.buildSigns();
    this.buildStation();
  }

  private setupFloorUniforms() {
    const u = this.floorMat.uniforms;
    const bases = this.map.zones.filter((z) => z.type === 'base');
    for (const b of bases) (u.uBase.value as THREE.Vector4[])[b.team].set(b.center[0], b.center[2], b.size[0], b.size[2]);
    const pads = u.uPads.value as THREE.Vector4[];
    this.map.spawns.slice(0, MAX_SPAWN_PADS).forEach((s, i) => pads[i].set(s.pos[0], s.pos[2], s.team, 1));
    const st = this.map.zones.find((z) => z.type === 'station');
    if (st) (u.uStation.value as THREE.Vector3).set(st.center[0], st.center[2], st.size[0]);
  }

  private buildSigns() {
    for (const s of this.map.signs) {
      const { texture, aspect } = makeTextTexture(s.text, s.color);
      const mat = new THREE.ShaderMaterial({
        uniforms: { ...NU, uMap: { value: texture }, uColor: { value: new THREE.Color(s.color).multiplyScalar(2.4) } } as unknown as Record<string, THREE.IUniform>,
        vertexShader: /* glsl */ `
          varying vec2 vUv; varying vec3 vWorld;
          void main() { vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,
        fragmentShader: /* glsl */ `
          ${NEON_UNIFORMS_GLSL}
          uniform sampler2D uMap; uniform vec3 uColor;
          varying vec2 vUv; varying vec3 vWorld;
          ${NEON_FUNCS_GLSL}
          void main() {
            vec4 t = texture2D(uMap, vUv);
            float flick = 0.92 + 0.08 * sin(uTime * 23.0 + vWorld.x) * step(0.97, fract(uTime * 0.13 + vWorld.z * 0.1));
            vec3 c = (uColor * t.r + uColor * t.g * 0.35) * flick * (0.85 + 0.3 * uBeat);
            float fog = neonFogAmount(uCamPos, vWorld);
            gl_FragColor = vec4(c * (1.0 - fog), 1.0);
          }`,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      this.signMats.push(mat);
      const h = s.size, w = s.size * aspect;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      m.position.set(...s.pos);
      m.rotation.y = s.yaw;
      m.renderOrder = 2;
      this.group.add(m);
    }
  }

  private buildStation() {
    const st = this.map.zones.find((z) => z.type === 'station');
    if (!st) return;
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff8a1f').multiplyScalar(3), toneMapped: false });
    for (const y of [0.55, 1.2, 1.85]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.035, 8, 40), mat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(st.center[0], y, st.center[2]);
      this.stationRings.push(ring);
      this.group.add(ring);
    }
  }

  update(t: number) {
    this.stationRings.forEach((r, i) => {
      r.position.y = 0.3 + ((t * 0.6 + i / 3) % 1) * 1.7;
      r.scale.setScalar(1 + 0.08 * Math.sin(t * 3 + i));
    });
  }

  setEnvMap(env: THREE.CubeTexture | null) {
    NU.uEnvMap.value = env;
    this.surfaceMat.uniforms.uHasEnv.value = env ? 1 : 0;
    this.floorMat.uniforms.uHasEnv.value = env ? 1 : 0;
  }
}
