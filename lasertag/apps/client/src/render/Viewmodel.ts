import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { WEAPONS, type Agent } from '@neon/shared';
import { NU, NEON_UNIFORMS_GLSL, NEON_FUNCS_GLSL, TEAM_COLORS, TEAM_HEX } from './neon.ts';

// zones: 0 body, 1 team glow, 2 heat bar, 3 emitter, 4 glove
function zoned(g: THREE.BufferGeometry, zone: number, along = 0): THREE.BufferGeometry {
  if (g.index) g = g.toNonIndexed();
  g.deleteAttribute('uv');
  const n = g.attributes.position.count;
  g.setAttribute('aZone', new THREE.BufferAttribute(new Float32Array(n).fill(zone), 1));
  // aU: normalised position along -z within this part (for the heat gauge fill)
  const u = new Float32Array(n);
  if (along) {
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    const p = g.attributes.position;
    for (let i = 0; i < n; i++) u[i] = (bb.max.z - p.getZ(i)) / Math.max(1e-4, bb.max.z - bb.min.z);
  }
  g.setAttribute('aU', new THREE.BufferAttribute(u, 1));
  return g;
}
const rbox = (w: number, h: number, d: number, x: number, y: number, z: number, zone: number, r = 0.008, along = 0) => {
  const g = new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2.01, h / 2.01, d / 2.01));
  g.translate(x, y, z);
  return zoned(g, zone, along);
};
const cyl = (r: number, len: number, x: number, y: number, z: number, zone: number, seg = 18) => {
  const g = new THREE.CylinderGeometry(r, r, len, seg);
  g.rotateX(Math.PI / 2);
  g.translate(x, y, z);
  return zoned(g, zone);
};
const torus = (r: number, t: number, x: number, y: number, z: number, zone: number) => {
  const g = new THREE.TorusGeometry(r, t, 8, 28);
  g.translate(x, y, z);
  return zoned(g, zone);
};

const VM_VERT = /* glsl */ `
attribute float aZone; attribute float aU;
varying vec3 vWorld; varying vec3 vNormal; varying float vZone; varying float vU; varying vec3 vLocal;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz; vNormal = normalize(mat3(modelMatrix) * normal); vZone = aZone; vU = aU; vLocal = position;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const VM_FRAG = /* glsl */ `
${NEON_UNIFORMS_GLSL}
uniform vec3 uTeam; uniform float uHeat; uniform float uShot; uniform float uOverheat; uniform float uEnergy; uniform float uJam;
varying vec3 vWorld; varying vec3 vNormal; varying float vZone; varying float vU; varying vec3 vLocal;
${NEON_FUNCS_GLSL}
void main() {
  vec3 P = vWorld; vec3 N = normalize(vNormal); vec3 V = normalize(uCamPos - P);
  int z = int(vZone + 0.5);
  vec3 col;
  float pulse = 0.85 + 0.3 * uBeat;
  if (z == 0 || z == 4) {
    vec3 albedo = z == 0 ? vec3(0.05, 0.05, 0.065) : vec3(0.02, 0.02, 0.025);
    // brushed panel lines
    float lines = smoothstep(0.45, 0.5, abs(fract(vLocal.z * 40.0) - 0.5)) * 0.25;
    col = neonLighting(P, N, V, albedo * (1.0 - lines), z == 0 ? 1.4 : 0.3, 50.0);
    float rim = pow(1.0 - max(dot(N, V), 0.0), 4.0);
    col += uTeam * rim * 0.15;
    // the barrel glows hot with heat
    col += vec3(1.0, 0.35, 0.08) * uHeat * uHeat * 0.5 * (1.0 - smoothstep(-0.5, -0.3, vLocal.z));
  } else if (z == 1) {
    col = uTeam * 2.6 * pulse * (0.6 + 0.4 * uEnergy) * (1.0 - uJam * (0.5 + 0.5 * sin(uTime * 50.0)));
    col += vec3(4.0) * uShot;
  } else if (z == 2) {
    // heat gauge: fills along the part, team -> orange -> red
    vec3 hc = mix(uTeam, vec3(1.0, 0.5, 0.08), smoothstep(0.4, 0.75, uHeat));
    hc = mix(hc, vec3(1.0, 0.08, 0.05), smoothstep(0.8, 1.0, uHeat));
    float fill = step(vU, uHeat);
    float blink = uOverheat > 0.5 ? (0.5 + 0.5 * sign(sin(uTime * 25.0))) : 1.0;
    col = hc * (fill * 3.2 * blink + 0.06);
  } else {
    col = mix(uTeam * 3.0 * pulse, vec3(9.0, 9.0, 9.5), uShot);
    col += vec3(1.0, 0.3, 0.05) * uHeat * 2.0;
  }
  gl_FragColor = vec4(col, 1.0);
}`;

const HIP = new THREE.Vector3(0.14, -0.15, -0.3);
const ADS = new THREE.Vector3(0.0, -0.1, -0.26);
const _ndc = new THREE.Vector3();
const _dir = new THREE.Vector3();

export class Viewmodel {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(56, 1, 0.01, 20);
  readonly anchor = new THREE.Group(); // follows the main camera
  readonly gun = new THREE.Group();
  readonly material: THREE.ShaderMaterial;
  private screenTex: THREE.CanvasTexture;
  private screenCtx: CanvasRenderingContext2D;
  private screenKey = '';
  readonly muzzleLocal = new THREE.Vector3(0, 0.016, -0.56);

  // animation state
  private kick = 0;
  private kickVel = 0;
  private swayX = 0;
  private swayY = 0;
  private bobT = 0;
  private sprintK = 0;
  private adsK = 0;
  private ventK = 0;
  private landK = 0;
  private shotGlow = 0;
  private team = 0;
  private hidden = 0;

  constructor() {
    this.scene.add(this.anchor);
    this.anchor.add(this.gun);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        ...NU, uTeam: { value: TEAM_COLORS[0].clone() }, uHeat: { value: 0 }, uShot: { value: 0 }, uOverheat: { value: 0 }, uEnergy: { value: 1 }, uJam: { value: 0 },
      } as unknown as Record<string, THREE.IUniform>,
      vertexShader: VM_VERT,
      fragmentShader: VM_FRAG,
    });
    const g = mergeGeometries([
      rbox(0.072, 0.09, 0.34, 0, 0, -0.2, 0, 0.018),
      rbox(0.05, 0.03, 0.3, 0, 0.058, -0.22, 0, 0.01),
      rbox(0.064, 0.05, 0.1, 0, -0.012, -0.405, 0, 0.012),
      cyl(0.024, 0.14, 0, 0.016, -0.47, 0),
      cyl(0.03, 0.02, 0, 0.016, -0.42, 0),
      torus(0.03, 0.007, 0, 0.016, -0.535, 3),
      torus(0.026, 0.005, 0, 0.016, -0.505, 3),
      rbox(0.004, 0.012, 0.28, 0.037, 0.012, -0.21, 1, 0.002),
      rbox(0.004, 0.012, 0.28, -0.037, 0.012, -0.21, 1, 0.002),
      rbox(0.012, 0.008, 0.22, -0.016, 0.075, -0.22, 2, 0.003, 1),
      rbox(0.042, 0.11, 0.055, 0, -0.085, -0.075, 0, 0.012),
      rbox(0.03, 0.035, 0.09, 0, -0.06, -0.24, 0, 0.01),
      cyl(0.02, 0.07, 0, -0.04, -0.03, 1, 12),
      // gloved hands
      rbox(0.06, 0.07, 0.09, 0.008, -0.1, -0.06, 4, 0.025),
      rbox(0.06, 0.06, 0.1, -0.02, -0.035, -0.33, 4, 0.025),
      rbox(0.07, 0.07, 0.2, 0.02, -0.13, 0.08, 4, 0.03),
    ])!;
    const mesh = new THREE.Mesh(g, this.material);
    mesh.frustumCulled = false;
    this.gun.add(mesh);

    // ammo screen (diegetic HUD)
    const cv = document.createElement('canvas');
    cv.width = 192; cv.height = 96;
    this.screenCtx = cv.getContext('2d')!;
    this.screenTex = new THREE.CanvasTexture(cv);
    this.screenTex.colorSpace = THREE.SRGBColorSpace;
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.058, 0.029),
      new THREE.MeshBasicMaterial({ map: this.screenTex, color: new THREE.Color(1.6, 1.6, 1.6), toneMapped: false }),
    );
    screen.position.set(0, 0.077, -0.07);
    screen.rotation.x = -1.05;
    this.gun.add(screen);
  }

  setTeam(team: number) {
    this.team = team;
    (this.material.uniforms.uTeam.value as THREE.Color).copy(TEAM_COLORS[team]);
    this.screenKey = '';
  }

  onShot() {
    this.kickVel += 9;
    this.shotGlow = 1;
  }
  onLand(speed: number) { this.landK = Math.min(1, speed / 12); }
  setHidden(h: boolean) { this.hidden = h ? 1 : 0; }

  private drawScreen(a: Agent) {
    const w = WEAPONS[a.weaponId];
    const e = Math.round(a.energy);
    const state = a.overheated > 0 ? 'SURCHAUFFE' : a.venting > 0 ? 'PURGE' : a.jammed > 0 ? 'BROUILLÉ' : a.energy < w.energyPerShot ? 'VIDE' : '';
    const key = `${e}|${state}|${this.team}`;
    if (key === this.screenKey) return;
    this.screenKey = key;
    const g = this.screenCtx;
    const team = TEAM_HEX[this.team];
    g.fillStyle = '#05030c'; g.fillRect(0, 0, 192, 96);
    g.strokeStyle = team; g.lineWidth = 3; g.strokeRect(3, 3, 186, 90);
    if (state) {
      g.fillStyle = state === 'PURGE' ? '#7ad7ff' : '#ff4a2a';
      g.font = '700 30px "Rajdhani", monospace';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(state, 96, 50);
      return;
    }
    const frac = a.energy / w.energyMax;
    g.fillStyle = frac < 0.25 ? '#ff8a1f' : team;
    g.font = '700 54px "Rajdhani", monospace';
    g.textAlign = 'right'; g.textBaseline = 'alphabetic';
    g.fillText(String(e), 120, 66);
    g.font = '600 18px "Rajdhani", monospace';
    g.textAlign = 'left';
    g.fillText('NRG', 128, 64);
    g.fillRect(14, 76, 164 * frac, 8);
    g.globalAlpha = 0.25; g.fillRect(14, 76, 164, 8); g.globalAlpha = 1;
  }

  update(dt: number, a: Agent, cam: THREE.PerspectiveCamera, lookDX: number, lookDY: number, time: number) {
    const w = WEAPONS[a.weaponId];
    this.anchor.position.copy(cam.position);
    this.anchor.quaternion.copy(cam.quaternion);
    this.camera.position.copy(cam.position);
    this.camera.quaternion.copy(cam.quaternion);
    this.camera.updateMatrixWorld();

    // spring recoil
    for (let left = dt; left > 0; left -= 1 / 240) {
      const h = Math.min(left, 1 / 240);
      this.kickVel += (-this.kick * 260 - this.kickVel * 22) * h;
      this.kick += this.kickVel * h;
    }
    this.shotGlow = Math.max(0, this.shotGlow - dt * 14);

    const speed = Math.hypot(a.vel.x, a.vel.z);
    const moving = a.grounded ? Math.min(1, speed / 7) : 0;
    this.bobT += dt * (4 + speed * 1.3);
    this.sprintK += ((a.sprinting ? 1 : 0) - this.sprintK) * Math.min(1, dt * 10);
    this.adsK += ((a.aiming ? 1 : 0) - this.adsK) * Math.min(1, dt * 14);
    this.ventK += ((a.venting > 0 || a.overheated > 0 ? 1 : 0) - this.ventK) * Math.min(1, dt * 9);
    this.landK = Math.max(0, this.landK - dt * 4);
    // sway lags behind the view
    this.swayX += (-lookDX * 0.0009 - this.swayX) * Math.min(1, dt * 12);
    this.swayY += (lookDY * 0.0009 - this.swayY) * Math.min(1, dt * 12);

    const bob = (1 - this.adsK * 0.8);
    const bx = Math.sin(this.bobT) * 0.008 * moving * bob;
    const by = -Math.abs(Math.cos(this.bobT)) * 0.009 * moving * bob;
    const p = this.gun.position.copy(HIP).lerp(ADS, this.adsK);
    p.x += bx + this.swayX * 0.5 - this.sprintK * 0.03;
    p.y += by + this.swayY * 0.5 - this.sprintK * 0.04 - this.landK * 0.03 - this.ventK * 0.02 - this.hidden * 0.4;
    p.z += this.kick * 0.045;
    this.gun.rotation.set(
      this.kick * 0.09 - this.sprintK * 0.35 + this.swayY * 2 + this.ventK * 0.2,
      this.sprintK * 0.7 + this.swayX * 2 + (1 - this.adsK) * 0.04,
      this.sprintK * 0.25 + this.ventK * 0.9 + Math.sin(time * 70) * 0.01 * (a.jammed > 0 ? 1 : 0),
    );

    const u = this.material.uniforms;
    u.uHeat.value = a.heat / w.heatMax;
    u.uShot.value = this.shotGlow;
    u.uOverheat.value = a.overheated > 0 ? 1 : 0;
    u.uEnergy.value = a.energy / w.energyMax;
    u.uJam.value = a.jammed > 0 ? 1 : 0;
    this.drawScreen(a);
  }

  setAspect(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  /**
   * World point that the *main* camera sees exactly where the viewmodel's muzzle is drawn
   * (the two cameras have different FOVs), at a fixed depth in front of the eye.
   */
  muzzleWorld(mainCam: THREE.PerspectiveCamera, out: THREE.Vector3, depth = 0.75): THREE.Vector3 {
    this.anchor.updateMatrixWorld(true);
    _ndc.copy(this.muzzleLocal).applyMatrix4(this.gun.matrixWorld).project(this.camera);
    out.set(_ndc.x, _ndc.y, 0.5).unproject(mainCam);
    out.sub(mainCam.position).normalize();
    // scale so the point sits at `depth` along the view axis
    mainCam.getWorldDirection(_dir);
    const k = depth / Math.max(0.2, out.dot(_dir));
    return out.multiplyScalar(k).add(mainCam.position);
  }
}
