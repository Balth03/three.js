import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { AgentState, GAME, type Agent } from '@neon/shared';
import { NU, NEON_UNIFORMS_GLSL, NEON_FUNCS_GLSL, TEAM_COLORS } from './neon.ts';

/** Light zones of the suit (aZone attribute). */
export const Z = { suit: 0, chest: 1, back: 2, shoulder: 3, head: 4, blaster: 5, visor: 6, accent: 7, armor: 8 } as const;
const ZONE_OF_HIT: Record<string, number> = { chest: Z.chest, back: Z.back, shoulder: Z.shoulder, head: Z.head, blaster: Z.blaster };

function zoned(g: THREE.BufferGeometry, zone: number): THREE.BufferGeometry {
  if (g.index) g = g.toNonIndexed();
  g.deleteAttribute('uv');
  g.setAttribute('aZone', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count).fill(zone), 1));
  return g;
}
const box = (w: number, h: number, d: number, x: number, y: number, z: number, zone: number, r = 0.02) => {
  const g = r > 0 ? new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2)) : new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return zoned(g, zone);
};
const sphere = (r: number, x: number, y: number, z: number, zone: number, seg = 14) => {
  const g = new THREE.SphereGeometry(r, seg, Math.max(6, seg / 1.5));
  g.translate(x, y, z);
  return zoned(g, zone);
};
const _q = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);
/** Capsule between two points. */
const limb = (a: [number, number, number], b: [number, number, number], r: number, zone: number) => {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
  const d = vb.clone().sub(va);
  const len = d.length();
  const g = new THREE.CapsuleGeometry(r, Math.max(0.001, len), 4, 10);
  _q.setFromUnitVectors(_up, d.normalize());
  g.applyQuaternion(_q);
  g.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
  return zoned(g, zone);
};
const ring = (r: number, tube: number, x: number, y: number, z: number, rx: number, ry: number, zone: number) => {
  const g = new THREE.TorusGeometry(r, tube, 6, 24);
  g.rotateX(rx); g.rotateY(ry);
  g.translate(x, y, z);
  return zoned(g, zone);
};
const merge = (gs: THREE.BufferGeometry[]) => mergeGeometries(gs, false)!;

/** Shared geometry of every suit part (built once). */
/** Tapered cylinder between two points. */
const seg = (a: [number, number, number], b: [number, number, number], ra: number, rb: number, zone: number, sz = 1, radial = 14) => {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
  const d = vb.clone().sub(va);
  const g = new THREE.CylinderGeometry(rb, ra, d.length(), radial, 1, false);
  g.scale(1, 1, sz);
  _q.setFromUnitVectors(_up, d.clone().normalize());
  g.applyQuaternion(_q);
  g.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
  return zoned(g, zone);
};
const ell = (rx: number, ry: number, rz: number, x: number, y: number, z: number, zone: number, seg2 = 16) => {
  const g = new THREE.SphereGeometry(1, seg2, Math.max(8, seg2 * 0.7));
  g.scale(rx, ry, rz);
  g.translate(x, y, z);
  return zoned(g, zone);
};
/** Lathe body section (circular profile squashed in depth). */
const lathe = (profile: [number, number][], sz: number, y: number, zone: number) => {
  const g = new THREE.LatheGeometry(profile.map(([r, h]) => new THREE.Vector2(r, h)), 20);
  g.scale(1, 1, sz);
  g.translate(0, y, 0);
  return zoned(g, zone);
};
/** Bevelled plate from a 2D outline (in the xy plane, extruded toward +z then oriented). */
const plate = (pts: [number, number][], depth: number, bevel: number, x: number, y: number, z: number, faceBack: boolean, zone: number) => {
  const shape = new THREE.Shape(pts.map(([px, py]) => new THREE.Vector2(px, py)));
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 4 });
  g.translate(0, 0, -depth / 2);
  if (!faceBack) g.rotateY(Math.PI);
  g.translate(x, y, z);
  g.computeVertexNormals();
  return zoned(g, zone);
};
const strip = (a: [number, number, number], b: [number, number, number], w: number, zone: number) => seg(a, b, w, w, zone, 1, 6);

/** Shared geometry of every suit part (built once). Faces -z. */
function buildParts() {
  const HIP_W = 0.1;
  const chestZ = -0.135, backZ = 0.135;
  return {
    pelvis: merge([
      lathe([[0.01, -0.09], [0.13, -0.08], [0.155, 0.0], [0.15, 0.08], [0.01, 0.09]], 0.72, 0, Z.suit),
      ring(0.152, 0.02, 0, 0.06, 0, Math.PI / 2, 0, Z.armor),
      box(0.09, 0.07, 0.03, 0, 0.04, -0.115, Z.armor, 0.012),
      box(0.05, 0.012, 0.01, 0, 0.04, -0.132, Z.accent, 0),
      box(0.07, 0.12, 0.05, -0.15, -0.03, 0, Z.armor, 0.015),
      box(0.07, 0.12, 0.05, 0.15, -0.03, 0, Z.armor, 0.015),
    ]),
    torso: merge([
      // athletic torso: narrow waist, broad chest
      lathe([[0.01, 0.0], [0.135, 0.02], [0.13, 0.14], [0.17, 0.24], [0.215, 0.36], [0.225, 0.46], [0.2, 0.54], [0.12, 0.6], [0.01, 0.61]], 0.62, 0.02, Z.suit),
      // chest plate with V inlay + sensor
      plate([[-0.17, 0.12], [0.17, 0.12], [0.15, -0.02], [0.06, -0.12], [-0.06, -0.12], [-0.15, -0.02]], 0.03, 0.012, 0, 0.44, chestZ - 0.02, false, Z.armor),
      strip([-0.13, 0.53, chestZ - 0.05], [-0.015, 0.36, chestZ - 0.05], 0.011, Z.chest),
      strip([0.13, 0.53, chestZ - 0.05], [0.015, 0.36, chestZ - 0.05], 0.011, Z.chest),
      seg([0, 0.43, chestZ - 0.04], [0, 0.43, chestZ - 0.06], 0.035, 0.035, Z.chest, 1, 16),
      // abdominal armour bands
      box(0.2, 0.05, 0.03, 0, 0.22, -0.1, Z.armor, 0.012),
      box(0.17, 0.045, 0.03, 0, 0.16, -0.095, Z.armor, 0.012),
      // back plate, power pack, glowing spine
      plate([[-0.16, 0.12], [0.16, 0.12], [0.14, -0.1], [-0.14, -0.1]], 0.03, 0.012, 0, 0.43, backZ + 0.02, true, Z.armor),
      box(0.16, 0.2, 0.08, 0, 0.26, backZ + 0.06, Z.armor, 0.025),
      box(0.025, 0.16, 0.012, 0, 0.27, backZ + 0.105, Z.back, 0),
      seg([-0.09, 0.47, backZ + 0.04], [-0.09, 0.47, backZ + 0.06], 0.03, 0.03, Z.back, 1, 12),
      seg([0.09, 0.47, backZ + 0.04], [0.09, 0.47, backZ + 0.06], 0.03, 0.03, Z.back, 1, 12),
      // pauldrons with glowing rims
      ell(0.125, 0.08, 0.13, -0.25, 0.54, 0, Z.armor), ell(0.125, 0.08, 0.13, 0.25, 0.54, 0, Z.armor),
      ring(0.105, 0.012, -0.255, 0.51, 0, Math.PI / 2, 0, Z.shoulder), ring(0.105, 0.012, 0.255, 0.51, 0, Math.PI / 2, 0, Z.shoulder),
      strip([-0.25, 0.6, -0.09], [-0.25, 0.62, 0.09], 0.01, Z.shoulder), strip([0.25, 0.6, -0.09], [0.25, 0.62, 0.09], 0.01, Z.shoulder),
      // side light piping
      strip([-0.2, 0.42, 0], [-0.14, 0.12, 0], 0.008, Z.accent), strip([0.2, 0.42, 0], [0.14, 0.12, 0], 0.008, Z.accent),
      // neck + collar
      seg([0, 0.58, 0], [0, 0.7, 0], 0.06, 0.055, Z.suit),
      ring(0.085, 0.022, 0, 0.6, 0, Math.PI / 2, 0, Z.armor),
    ]),
    head: merge([
      ell(0.135, 0.15, 0.15, 0, 0.01, 0.005, Z.armor, 20),
      // curved visor band
      (() => {
        const g = new THREE.CylinderGeometry(0.142, 0.135, 0.06, 24, 1, true, Math.PI - 1.15, 2.3);
        g.scale(1, 1, 1.08);
        g.translate(0, 0.0, 0.0);
        return zoned(g, Z.visor);
      })(),
      // faceplate: chin guard + breathing vents under the visor
      (() => {
        const g = new THREE.SphereGeometry(0.128, 20, 10, Math.PI - 0.9, 1.8, Math.PI * 0.55, Math.PI * 0.3);
        g.scale(1, 1, 1.15);
        g.translate(0, 0.0, -0.005);
        return zoned(g, Z.armor);
      })(),
      box(0.012, 0.035, 0.01, -0.03, -0.075, -0.142, Z.accent, 0), box(0.012, 0.035, 0.01, 0, -0.08, -0.146, Z.accent, 0), box(0.012, 0.035, 0.01, 0.03, -0.075, -0.142, Z.accent, 0),
      // team paint stripes on the helmet sides
      strip([-0.128, 0.07, -0.06], [-0.13, 0.08, 0.08], 0.007, Z.accent), strip([0.128, 0.07, -0.06], [0.13, 0.08, 0.08], 0.007, Z.accent),
      // ear pods
      seg([-0.13, 0, 0.01], [-0.165, 0, 0.01], 0.05, 0.045, Z.armor, 1, 14), seg([0.13, 0, 0.01], [0.165, 0, 0.01], 0.05, 0.045, Z.armor, 1, 14),
      seg([-0.166, 0, 0.01], [-0.17, 0, 0.01], 0.032, 0.032, Z.accent, 1, 12), seg([0.166, 0, 0.01], [0.17, 0, 0.01], 0.032, 0.032, Z.accent, 1, 12),
      // crest fin with the helmet sensor at its front
      box(0.022, 0.05, 0.2, 0, 0.15, 0.02, Z.armor, 0.01),
      ell(0.03, 0.028, 0.04, 0, 0.165, -0.08, Z.head, 10),
      strip([0, 0.176, -0.04], [0, 0.18, 0.11], 0.006, Z.head),
    ]),
    // arms + blaster, pivot at shoulder height (aim group)
    aim: merge([
      seg([0.26, 0, 0], [0.24, -0.21, -0.12], 0.065, 0.055, Z.suit),
      ell(0.06, 0.06, 0.065, 0.24, -0.21, -0.12, Z.armor, 12),
      seg([0.24, -0.21, -0.12], [0.14, -0.12, -0.34], 0.06, 0.052, Z.armor),
      strip([0.215, -0.185, -0.17], [0.2, -0.17, -0.2], 0.058, Z.accent),
      box(0.06, 0.08, 0.07, 0.13, -0.13, -0.37, Z.suit, 0.02),
      seg([-0.26, 0, 0], [-0.17, -0.22, -0.2], 0.065, 0.055, Z.suit),
      ell(0.06, 0.06, 0.065, -0.17, -0.22, -0.2, Z.armor, 12),
      seg([-0.17, -0.22, -0.2], [0.04, -0.12, -0.5], 0.06, 0.052, Z.armor),
      strip([-0.13, -0.2, -0.27], [-0.11, -0.19, -0.3], 0.058, Z.accent),
      box(0.07, 0.06, 0.08, 0.06, -0.11, -0.52, Z.suit, 0.02),
      // blaster
      box(0.075, 0.11, 0.4, 0.12, -0.08, -0.46, Z.armor, 0.025),
      box(0.055, 0.035, 0.32, 0.12, -0.01, -0.47, Z.armor, 0.012),
      seg([0.12, -0.065, -0.66], [0.12, -0.065, -0.76], 0.025, 0.025, Z.armor),
      box(0.05, 0.12, 0.06, 0.12, -0.17, -0.37, Z.suit, 0.015),
      strip([0.16, -0.07, -0.3], [0.16, -0.07, -0.62], 0.007, Z.blaster),
      strip([0.08, -0.07, -0.3], [0.08, -0.07, -0.62], 0.007, Z.blaster),
      ring(0.034, 0.011, 0.12, -0.065, -0.77, 0, 0, Z.blaster),
      box(0.03, 0.02, 0.06, 0.12, 0.02, -0.38, Z.blaster, 0.008),
    ]),
    thigh: merge([
      seg([0, 0, 0], [0, -0.41, 0], 0.1, 0.075, Z.suit, 0.95),
      box(0.12, 0.2, 0.04, 0, -0.17, -0.075, Z.armor, 0.018),
      strip([-0.045, -0.08, -0.098], [-0.045, -0.26, -0.098], 0.006, Z.accent),
      ell(0.065, 0.06, 0.05, 0, -0.41, -0.06, Z.armor, 12),
      strip([-0.04, -0.41, -0.11], [0.04, -0.41, -0.11], 0.007, Z.accent),
    ]),
    shin: merge([
      seg([0, 0, 0], [0, -0.38, 0], 0.075, 0.058, Z.suit, 0.95),
      box(0.1, 0.24, 0.035, 0, -0.17, -0.06, Z.armor, 0.015),
      box(0.12, 0.1, 0.27, 0, -0.43, -0.045, Z.armor, 0.035),
      box(0.13, 0.018, 0.28, 0, -0.485, -0.045, Z.accent, 0.006),
      box(0.1, 0.025, 0.01, 0, -0.41, -0.18, Z.accent, 0),
    ]),
    hipOffset: HIP_W,
  };
}
let PARTS: ReturnType<typeof buildParts> | null = null;

const AGENT_VERT = /* glsl */ `
attribute float aZone;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vZone;
varying float vH;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vZone = aZone;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;
const AGENT_FRAG = /* glsl */ `
${NEON_UNIFORMS_GLSL}
uniform vec3 uTeam;
uniform float uFlash[9];
uniform samplerCube uEnvMap;
uniform float uPower;
uniform float uInvuln;
uniform float uBoot;
uniform float uFeetY;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vZone;
${NEON_FUNCS_GLSL}
void main() {
  vec3 P = vWorld;
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCamPos - P);
  int z = int(vZone + 0.5);
  float flash = uFlash[z];
  float h = P.y - uFeetY;
  float boot = smoothstep(uBoot * 2.1 - 0.15, uBoot * 2.1, h);
  float power = uPower * (1.0 - boot);
  vec3 col;
  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  if (z == 0) {
    // matte technical fabric with a fine weave
    float weave = 0.85 + 0.15 * sin(P.y * 220.0) * sin((P.x + P.z) * 220.0);
    col = neonLighting(P, N, V, vec3(0.022, 0.021, 0.03) * weave, 0.35, 18.0);
    col += uTeam * rim * 0.16 * power;
    col += vec3(1.0) * flash * 0.5;
  } else if (z == 8) {
    // glossy armour shell: lit + environment reflections + team-tinted rim
    col = neonLighting(P, N, V, vec3(0.085, 0.085, 0.11), 1.6, 70.0);
    vec3 R = reflect(-V, N);
    col += textureCube(uEnvMap, R).rgb * (0.08 + rim * 0.5);
    col += uTeam * rim * 0.3 * power;
    col += vec3(1.0) * uFlash[0] * 0.6;
  } else {
    float k = z == 7 ? 0.9 : (z == 6 ? 2.2 : (z == 4 ? 4.0 : 2.8));
    float pulse = 0.85 + 0.3 * uBeat;
    col = uTeam * k * pulse * power;
    // hit flash: white-hot, then the team colour
    col = mix(col, vec3(7.0, 7.0, 7.5), clamp(flash, 0.0, 1.0));
    // invulnerability: fast white shimmer
    col += vec3(1.5) * uInvuln * (0.5 + 0.5 * sin(uTime * 40.0));
    // unlit dark plastic when powered down
    col += neonLighting(P, N, V, vec3(0.05), 0.8, 40.0) * (1.0 - power);
  }
  col = neonFog(col, P);
  gl_FragColor = vec4(col, 1.0);
}
`;

const _v = new THREE.Vector3();

export class AgentView {
  readonly root = new THREE.Group();
  readonly material: THREE.ShaderMaterial;
  private hips = new THREE.Group();
  private torso = new THREE.Group();
  private head = new THREE.Group();
  private aim = new THREE.Group();
  private thighL = new THREE.Group();
  private thighR = new THREE.Group();
  private shinL = new THREE.Group();
  private shinR = new THREE.Group();
  private readonly flash = new Array<number>(9).fill(0);
  private phase = Math.random() * 10;
  private speed = 0;
  private localMoveAngle = 0;
  private downT = 0;
  private bootT = 1;
  private power = 1;
  private lean = 0;
  private hitKick = 0;
  readonly muzzleLocal = new THREE.Vector3(0.12, -0.065, -0.79);
  readonly team: number;

  constructor(readonly agent: Agent) {
    if (!PARTS) PARTS = buildParts();
    this.team = agent.team;
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        ...NU,
        uTeam: { value: TEAM_COLORS[agent.team].clone() },
        uFlash: { value: this.flash },
        uPower: { value: 1 },
        uInvuln: { value: 0 },
        uBoot: { value: 1 },
        uFeetY: { value: 0 },
      } as unknown as Record<string, THREE.IUniform>,
      vertexShader: AGENT_VERT,
      fragmentShader: AGENT_FRAG,
    });
    const mk = (g: THREE.BufferGeometry, parent: THREE.Object3D) => {
      const m = new THREE.Mesh(g, this.material);
      m.frustumCulled = false;
      parent.add(m);
      return m;
    };
    const P = PARTS;
    this.root.add(this.hips);
    this.hips.position.y = 0.95;
    mk(P.pelvis, this.hips);
    this.hips.add(this.torso);
    mk(P.torso, this.torso);
    this.torso.add(this.head);
    this.head.position.y = 0.72;
    mk(P.head, this.head);
    this.torso.add(this.aim);
    this.aim.position.y = 0.47;
    mk(P.aim, this.aim);
    for (const [thigh, shin, x] of [[this.thighL, this.shinL, -P.hipOffset], [this.thighR, this.shinR, P.hipOffset]] as const) {
      this.hips.add(thigh);
      thigh.position.set(x, -0.04, 0);
      mk(P.thigh, thigh);
      thigh.add(shin);
      shin.position.y = -0.42;
      mk(P.shin, shin);
    }
  }

  onHit(zone: string) {
    const z = ZONE_OF_HIT[zone] ?? Z.chest;
    this.flash[z] = 1.4;
    this.flash[Z.accent] = Math.max(this.flash[Z.accent], 0.6);
    this.flash[Z.suit] = Math.max(this.flash[Z.suit], 0.25);
    this.flash[Z.armor] = Math.max(this.flash[Z.armor], 0.25);
    this.hitKick = 1;
  }
  onDown() { this.downT = 0; this.flash.fill(1.2); }
  onRespawn() { this.bootT = 0; this.downT = 0; }

  /** Pose the rig. `px,py,pz` is the interpolated feet position. */
  update(dt: number, px: number, py: number, pz: number, time: number, visible: boolean) {
    const a = this.agent;
    this.root.visible = visible;
    if (!visible) return;
    this.root.position.set(px, py, pz);
    this.root.rotation.y = a.yaw;

    const down = a.state === AgentState.Down;
    // ---- lights
    for (let k = 0; k < 9; k++) this.flash[k] = Math.max(0, this.flash[k] - dt * 5);
    if (down) {
      this.downT += dt;
      // flicker, then dark
      const t = this.downT;
      this.power = t < 0.7 ? (Math.sin(t * 60) > 0.2 ? 1 - t : 0.05) : 0;
    } else {
      this.bootT = Math.min(1, this.bootT + dt * 1.6);
      this.power = 1;
    }
    const u = this.material.uniforms;
    u.uPower.value = this.power;
    u.uBoot.value = down ? 1 : this.bootT;
    u.uInvuln.value = a.invuln > 0 ? 0.5 : 0;
    u.uFeetY.value = py;

    // ---- locomotion
    const vx = a.vel.x, vz = a.vel.z;
    const sp = Math.hypot(vx, vz);
    this.speed += (sp - this.speed) * Math.min(1, dt * 10);
    const fwdX = -Math.sin(a.yaw), fwdZ = -Math.cos(a.yaw);
    const rx = Math.cos(a.yaw), rz = -Math.sin(a.yaw);
    const lf = (vx * fwdX + vz * fwdZ), ls = (vx * rx + vz * rz);
    let moveAng = sp > 0.5 ? Math.atan2(ls, lf) : 0;
    let dirSign = 1;
    if (Math.abs(moveAng) > Math.PI / 2) { moveAng = moveAng - Math.sign(moveAng) * Math.PI; dirSign = -1; }
    this.localMoveAngle += (THREE.MathUtils.clamp(moveAng, -1.0, 1.0) - this.localMoveAngle) * Math.min(1, dt * 8);
    const stride = a.sprinting ? 2.1 : 1.7;
    this.phase += dt * (this.speed / stride) * Math.PI * 2 * dirSign;

    const crouch = a.crouch;
    const sliding = a.sliding > 0;
    const air = !a.grounded && a.airTime > 0.08;
    const amp = Math.min(0.85, this.speed * 0.1) * (1 - crouch * 0.4);
    const s1 = Math.sin(this.phase), s2 = Math.sin(this.phase + Math.PI);
    const k1 = Math.max(0, Math.sin(this.phase + Math.PI * 0.5)), k2 = Math.max(0, Math.sin(this.phase + Math.PI * 1.5));

    let tl = s1 * amp, tr = s2 * amp, sl = -k1 * amp * 1.3, sr = -k2 * amp * 1.3;
    let hipsY = 0.95 - Math.abs(Math.cos(this.phase)) * 0.035 * Math.min(1, this.speed / 5);
    let torsoX = -Math.min(0.25, this.speed * 0.022) + this.lean * 0;
    let aimX = a.pitch * 0.9;
    let headX = a.pitch * 0.3;
    // crouch: knees bent
    hipsY -= crouch * 0.36;
    tl += crouch * 0.9; tr += crouch * 0.9; sl -= crouch * 1.5; sr -= crouch * 1.5;
    if (air) { tl = 0.6; tr = 0.15; sl = -1.0; sr = -0.4; }
    if (sliding) { hipsY = 0.5; tl = 1.35; sl = -0.15; tr = 0.5; sr = -1.6; torsoX = 0.3; }

    // shutdown: drop to one knee, arms down
    if (down) {
      const k = Math.min(1, this.downT * 2.2);
      const e = 1 - Math.pow(1 - k, 3);
      hipsY = THREE.MathUtils.lerp(hipsY, 0.52, e);
      tl = THREE.MathUtils.lerp(tl, 1.5, e); sl = THREE.MathUtils.lerp(sl, -1.55, e);
      tr = THREE.MathUtils.lerp(tr, -0.25, e); sr = THREE.MathUtils.lerp(sr, -1.7, e);
      torsoX = THREE.MathUtils.lerp(torsoX, -0.55, e);
      aimX = THREE.MathUtils.lerp(aimX, -1.0, e);
      headX = THREE.MathUtils.lerp(headX, -0.5, e);
    }
    this.hitKick = Math.max(0, this.hitKick - dt * 6);
    torsoX += this.hitKick * 0.18;

    this.hips.position.y = hipsY;
    this.hips.rotation.y = this.localMoveAngle * 0.8 * (sp > 0.5 ? 1 : 0);
    this.torso.rotation.y = -this.hips.rotation.y;
    this.torso.rotation.x = torsoX;
    this.torso.rotation.z = -ls * 0.012;
    this.thighL.rotation.x = tl; this.thighR.rotation.x = tr;
    this.shinL.rotation.x = sl; this.shinR.rotation.x = sr;
    this.aim.rotation.x = aimX - torsoX;
    this.head.rotation.x = headX - torsoX * 0.5;
    void time;
  }

  muzzleWorld(out: THREE.Vector3): THREE.Vector3 {
    this.root.updateMatrixWorld(true);
    return out.copy(this.muzzleLocal).applyMatrix4(this.aim.matrixWorld);
  }

  headWorld(out: THREE.Vector3): THREE.Vector3 {
    return out.set(this.root.position.x, this.root.position.y + (this.agent.crouched ? GAME.movement.crouchEyeHeight : GAME.movement.eyeHeight) + 0.42, this.root.position.z);
  }

  dispose() { this.material.dispose(); }
}

export const _unused = _v;
