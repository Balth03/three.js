// The 3D stage: renderer, post-processing, sky, light, dioramas, characters, camera direction.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { HorizontalTiltShiftShader } from 'three/examples/jsm/shaders/HorizontalTiltShiftShader.js';
import { VerticalTiltShiftShader } from 'three/examples/jsm/shaders/VerticalTiltShiftShader.js';
import type { Mood, Place } from '@bl/sim';
import { Avatar, type AvatarSpec } from './avatar.ts';
import { buildDiorama, type Diorama } from './dioramas.ts';
import { ease } from './kit.ts';

export type Quality = 'low' | 'medium' | 'high';

export interface StageView {
  place: Place;
  age: number;
  player: AvatarSpec & { key: string };
  others: (AvatarSpec & { key: string })[];
  tombLines?: string[];
  dead?: boolean;
}

// Age themes (sky top, sky bottom) — see DESIGN.md §3.1
const THEMES: [number, string, string][] = [
  [0, '#FFD9EC', '#DDF1FF'],
  [6, '#CDEFFF', '#FFF1D2'],
  [13, '#C6B5FF', '#FFD1EC'],
  [18, '#B5E0FF', '#FFE5C2'],
  [30, '#BFD3EA', '#F3EADB'],
  [60, '#FFE2B0', '#F7D0BE'],
];

export function themeFor(age: number): { top: THREE.Color; bottom: THREE.Color } {
  for (let i = 0; i < THEMES.length - 1; i++) {
    const [a0, t0, b0] = THEMES[i];
    const [a1, t1, b1] = THEMES[i + 1];
    if (age < a1) {
      const k = Math.max(0, Math.min(1, (age - a0) / (a1 - a0)));
      const s = k * k * (3 - 2 * k);
      return { top: new THREE.Color(t0).lerp(new THREE.Color(t1), s), bottom: new THREE.Color(b0).lerp(new THREE.Color(b1), s) };
    }
  }
  const l = THEMES[THEMES.length - 1];
  return { top: new THREE.Color(l[1]), bottom: new THREE.Color(l[2]) };
}

const SEASON_LEAF = [new THREE.Color('#9BE38A'), null, new THREE.Color('#F0A14A'), new THREE.Color('#EEF3F6')];
const SEASON_GRASS = [new THREE.Color('#A8E58A'), null, new THREE.Color('#CFC56E'), new THREE.Color('#F2F6F9')];

interface Placed { avatar: Avatar; key: string }

export class Stage {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(30, 1, 0.5, 400);
  private composer: EffectComposer | null = null;
  private tiltH: ShaderPass | null = null;
  private tiltV: ShaderPass | null = null;
  private bloom: UnrealBloomPass | null = null;
  private quality: Quality = 'high';
  private sky: THREE.Mesh;
  private skyMat: THREE.ShaderMaterial;
  private sun: THREE.DirectionalLight;
  private hemi: THREE.HemisphereLight;
  private current: Diorama | null = null;
  private leaving: { d: Diorama; t: number }[] = [];
  private entering: { d: Diorama; t: number } | null = null;
  private cache = new Map<Place, Diorama>();
  private chars = new Map<string, Placed>();
  private player: Avatar | null = null;
  private snow: THREE.Points;
  private season = 0.9;
  private seasonAnim: { from: number; t: number } | null = null;
  private themeTop = new THREE.Color('#FFD9EC');
  private themeBottom = new THREE.Color('#DDF1FF');
  private targetTop = new THREE.Color();
  private targetBottom = new THREE.Color();
  // camera rig
  private yaw = 0.32;
  private pitch = 0.36;
  private dist = 27;
  private yawGoal = 0.32;
  private pitchGoal = 0.36;
  private distGoal = 27;
  private target = new THREE.Vector3(0, 1.2, 1);
  private targetGoal = new THREE.Vector3(0, 1.2, 1);
  private focus = false;
  private drag: { x: number; y: number; yaw: number; pitch: number } | null = null;
  private rightInset = 0;
  private offY = 0;
  private offYGoal = 0;
  private clock = new THREE.Timer();
  private time = 0;
  private running = false;
  reducedMotion = false;
  private lastView: StageView | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.35;
    pmrem.dispose();
    // Sky dome
    this.skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: { top: { value: this.themeTop }, bottom: { value: this.themeBottom } },
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform vec3 top; uniform vec3 bottom; varying vec3 vP;
        void main(){ float h = smoothstep(-0.35, 0.75, vP.y); vec3 c = mix(bottom, top, h);
          float glow = pow(max(0.0, 1.0 - abs(vP.y - 0.05) * 2.2), 3.0) * 0.12; c += vec3(glow);
          gl_FragColor = vec4(c, 1.0); }`,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 16), this.skyMat);
    this.scene.add(this.sky);
    // Lights
    this.hemi = new THREE.HemisphereLight('#E6F0FF', '#F2D9BC', 0.75);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight('#FFF1DE', 1.9);
    this.sun.position.set(9, 16, 11);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    const sc = this.sun.shadow.camera;
    sc.left = -10; sc.right = 10; sc.top = 10; sc.bottom = -10; sc.near = 1; sc.far = 50;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.025;
    this.sun.shadow.radius = 3;
    this.scene.add(this.sun, this.sun.target);
    const fill = new THREE.DirectionalLight('#CFE0FF', 0.45);
    fill.position.set(-10, 6, -4);
    this.scene.add(fill);
    // Snow
    const n = 400;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 13; pos[i * 3 + 1] = Math.random() * 9; pos[i * 3 + 2] = (Math.random() - 0.5) * 13; }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.snow = new THREE.Points(sg, new THREE.PointsMaterial({ color: '#ffffff', size: 0.09, transparent: true, opacity: 0, depthWrite: false }));
    this.scene.add(this.snow);
    this.setQuality('high');
    this.bindInput();
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  setQuality(q: Quality) {
    this.quality = q;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q === 'high' ? 2 : q === 'medium' ? 1.5 : 1));
    this.renderer.shadowMap.enabled = q !== 'low';
    this.composer?.dispose();
    this.composer = null;
    if (q !== 'low') {
      const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
      const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4 });
      this.composer = new EffectComposer(this.renderer, rt);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.14, 0.4, 1.4);
      this.composer.addPass(this.bloom);
      if (q === 'high') {
        this.tiltH = new ShaderPass(HorizontalTiltShiftShader);
        this.tiltV = new ShaderPass(VerticalTiltShiftShader);
        this.composer.addPass(this.tiltH);
        this.composer.addPass(this.tiltV);
      } else { this.tiltH = this.tiltV = null; }
      this.composer.addPass(new OutputPass());
      this.composer.addPass(new ShaderPass(GradeShader));
    }
    this.resize();
  }

  setRightInset(px: number) { this.rightInset = px; this.resize(); }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Shift the optical centre left so the diorama sits in the free space beside the feed
    const shift = this.rightInset / 2;
    this.camera.setViewOffset(w, h, shift, this.offY * h, w, h);
    this.camera.updateProjectionMatrix();
    if (this.composer) {
      this.composer.setPixelRatio(this.renderer.getPixelRatio());
      this.composer.setSize(w, h);
    }
    const dh = h * this.renderer.getPixelRatio();
    const dw = w * this.renderer.getPixelRatio();
    if (this.tiltH) { this.tiltH.uniforms.h.value = 2.6 / dw; this.tiltH.uniforms.r.value = 0.48; }
    if (this.tiltV) { this.tiltV.uniforms.v.value = 2.6 / dh; this.tiltV.uniforms.r.value = 0.48; }
  }

  private bindInput() {
    const c = this.canvas;
    c.addEventListener('pointerdown', (e) => { this.drag = { x: e.clientX, y: e.clientY, yaw: this.yawGoal, pitch: this.pitchGoal }; c.setPointerCapture(e.pointerId); });
    c.addEventListener('pointermove', (e) => {
      if (!this.drag) return;
      this.yawGoal = Math.max(-1.3, Math.min(1.3, this.drag.yaw - (e.clientX - this.drag.x) * 0.006));
      this.pitchGoal = Math.max(0.12, Math.min(0.95, this.drag.pitch + (e.clientY - this.drag.y) * 0.004));
    });
    c.addEventListener('pointerup', () => { this.drag = null; });
    c.addEventListener('wheel', (e) => { this.distGoal = Math.max(10, Math.min(40, this.distGoal * (1 + Math.sign(e.deltaY) * 0.1))); }, { passive: true });
  }

  resetCamera() { this.yawGoal = 0.32; this.pitchGoal = 0.36; this.distGoal = 27; }

  // ───────────────────────────── scene content ─────────────────────────────

  private diorama(place: Place): Diorama {
    let d = this.cache.get(place);
    if (!d) { d = buildDiorama(place); this.cache.set(place, d); }
    return d;
  }

  show(view: StageView) {
    this.lastView = view;
    const t = themeFor(view.age);
    this.targetTop.copy(t.top);
    this.targetBottom.copy(t.bottom);
    const d = this.diorama(view.place);
    if (d !== this.current) {
      if (this.current) this.leaving.push({ d: this.current, t: 0 });
      this.leaving = this.leaving.filter((l) => l.d !== d);
      d.root.rotation.y = 0;
      this.current = d;
      this.scene.add(d.root);
      d.root.position.set(0, -6, 0);
      this.entering = { d, t: 0 };
      if (this.reducedMotion) { d.root.position.y = 0; this.entering = null; for (const l of this.leaving) this.scene.remove(l.d.root); this.leaving = []; }
    }
    if (view.tombLines && d.setLabel) d.setLabel(view.tombLines);
    // Characters
    const wanted = [view.player, ...view.others].slice(0, d.spots.length);
    const keys = new Set(wanted.map((w) => w.key));
    for (const [k, p] of this.chars) if (!keys.has(k)) { p.avatar.dispose(); this.chars.delete(k); }
    wanted.forEach((spec, i) => {
      let p = this.chars.get(spec.key);
      if (!p) { p = { avatar: new Avatar(spec), key: spec.key }; this.chars.set(spec.key, p); }
      else p.avatar.set(spec);
      const spot = d.spots[i];
      d.root.add(p.avatar.root);
      p.avatar.root.position.copy(spot);
      p.avatar.root.rotation.y = i === 0 ? 0.25 : Math.atan2(d.spots[0].x - spot.x, d.spots[0].z - spot.z) * 0.6 + 0.2;
      p.avatar.lookAtTarget = this.camera.position;
      if (i === 0) {
        this.player = p.avatar;
        if (view.dead) p.avatar.root.position.y = 0.6;
      }
    });
    const ps = d.spots[0];
    this.targetGoal.set(ps.x * 0.5, 1.4, ps.z * 0.4 + 0.3);
  }

  setMood(m: Mood, all = false) {
    this.player?.setMood(m);
    if (all) for (const p of this.chars.values()) p.avatar.setMood(m);
  }

  setOtherMood(key: string, m: Mood) { this.chars.get(key)?.avatar.setMood(m); }

  play(kind: 'hop' | 'spin' | 'celebrate') { this.player?.play(kind); }

  /** Year transition: seasons cycle + hop. */
  ageUpFx() {
    this.seasonAnim = { from: this.season, t: 0 };
    this.player?.play('hop');
    if (!this.reducedMotion) this.yawGoal += 0.18 * (Math.random() < 0.5 ? -1 : 1);
    this.yawGoal = Math.max(-0.7, Math.min(1.0, this.yawGoal));
  }

  setFocus(on: boolean) {
    this.focus = on;
    this.distGoal = on ? 19 : 27;
    this.offYGoal = on ? 0.26 : 0;
  }

  // ───────────────────────────── loop ─────────────────────────────

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      requestAnimationFrame(loop);
      this.clock.update(); this.frame(Math.min(0.05, this.clock.getDelta()));
    };
    requestAnimationFrame(loop);
  }

  stop() { this.running = false; }

  frame(dt: number) {
    this.time += dt;
    const t = this.time;
    // theme colours
    this.themeTop.lerp(this.targetTop, 1 - Math.exp(-dt * 2));
    this.themeBottom.lerp(this.targetBottom, 1 - Math.exp(-dt * 2));
    this.hemi.color.copy(this.themeTop).lerp(_white, 0.6);
    // transitions
    for (let i = this.leaving.length - 1; i >= 0; i--) {
      const l = this.leaving[i];
      l.t += dt / 0.55;
      const k = ease.inOut(Math.min(1, l.t));
      l.d.root.position.y = -k * 7;
      l.d.root.rotation.y = -k * 0.4;
      if (l.t >= 1) { this.scene.remove(l.d.root); l.d.root.rotation.y = 0; this.leaving.splice(i, 1); }
    }
    if (this.entering) {
      const e = this.entering;
      e.t += dt / 0.9;
      const k = Math.min(1, Math.max(0, e.t - 0.15) / 0.85);
      e.d.root.position.y = -6 + ease.outBack(k) * 6;
      e.d.root.rotation.y = (1 - ease.out(k)) * 0.5;
      if (e.t >= 1) { e.d.root.position.y = 0; e.d.root.rotation.y = 0; this.entering = null; }
    }
    // seasons
    if (this.seasonAnim) {
      this.seasonAnim.t += dt / 1.8;
      const k = ease.inOut(Math.min(1, this.seasonAnim.t));
      this.season = (this.seasonAnim.from + k * 4) % 4;
      if (this.seasonAnim.t >= 1) { this.seasonAnim = null; this.season = 0.9; }
    }
    this.applySeason();
    // idle float of the plinth
    if (this.current && !this.entering) this.current.root.position.y = Math.sin(t * 0.8) * 0.06;
    // camera
    const damp = 1 - Math.exp(-dt * 3);
    if (!this.drag && !this.focus && !this.reducedMotion) this.yawGoal += Math.sin(t * 0.15) * dt * 0.02;
    this.yaw += (this.yawGoal - this.yaw) * damp;
    this.pitch += (this.pitchGoal - this.pitch) * damp;
    this.dist += (this.distGoal - this.dist) * damp;
    this.target.lerp(this.targetGoal, damp);
    if (Math.abs(this.offYGoal - this.offY) > 0.0005) {
      this.offY += (this.offYGoal - this.offY) * damp;
      const w = window.innerWidth, h = window.innerHeight;
      this.camera.setViewOffset(w, h, this.rightInset / 2, this.offY * h, w, h);
      this.camera.updateProjectionMatrix();
    }
    const tgt = _v.copy(this.target);
    if (this.focus && this.player) tgt.y = 0.9 + this.player.height * 0.5;
    this.camera.position.set(
      tgt.x + Math.sin(this.yaw) * Math.cos(this.pitch) * this.dist,
      tgt.y + Math.sin(this.pitch) * this.dist,
      tgt.z + Math.cos(this.yaw) * Math.cos(this.pitch) * this.dist,
    );
    this.camera.lookAt(tgt);
    // characters
    for (const p of this.chars.values()) p.avatar.update(dt, t);
    if (this.lastView?.dead && this.player) {
      this.player.root.position.y = 0.7 + Math.sin(t * 1.4) * 0.15;
    }
    this.current?.update?.(t);
    // snow
    const winter = Math.max(0, 1 - Math.abs(this.season - 3) * 1.6);
    const sm = this.snow.material as THREE.PointsMaterial;
    sm.opacity = winter * 0.9;
    this.snow.visible = winter > 0.01;
    if (this.snow.visible) {
      const a = this.snow.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = a.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] -= dt * (0.9 + (i % 7) * 0.08);
        arr[i] += Math.sin(t + i) * dt * 0.1;
        if (arr[i + 1] < 0) arr[i + 1] += 9;
      }
      a.needsUpdate = true;
    }
    if (this.composer) this.composer.render(dt);
    else this.renderer.render(this.scene, this.camera);
  }

  private applySeason() {
    const d = this.current;
    if (!d) return;
    const s = this.season;
    const i0 = Math.floor(s) % 4, i1 = (i0 + 1) % 4, f = s - Math.floor(s);
    const k = f * f * (3 - 2 * f);
    for (const { m, base } of d.foliage) {
      const a = SEASON_LEAF[i0] ?? base, b = SEASON_LEAF[i1] ?? base;
      m.color.copy(a === base ? base : _c.copy(base).lerp(a, 0.75)).lerp(b === base ? base : _c2.copy(base).lerp(b, 0.75), k);
    }
    for (const { m, base } of d.grass) {
      const a = SEASON_GRASS[i0] ?? base, b = SEASON_GRASS[i1] ?? base;
      m.color.copy(a === base ? base : _c.copy(base).lerp(a, 0.7)).lerp(b === base ? base : _c2.copy(base).lerp(b, 0.7), k);
    }
  }

  /** Test hook: advance N frames synchronously. */
  advance(frames: number, dt = 1 / 30) { for (let i = 0; i < frames; i++) this.frame(dt); }
}

// Final light grade in display space: a touch of contrast & saturation, very soft vignette.
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, contrast: { value: 1.07 }, saturation: { value: 1.12 }, vignette: { value: 0.1 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float contrast; uniform float saturation; uniform float vignette; varying vec2 vUv;
    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec3 col = c.rgb;
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(l), col, saturation);
      col = (col - 0.5) * contrast + 0.5;
      vec2 d = vUv - 0.5; col *= 1.0 - vignette * dot(d, d) * 2.2;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), c.a); }`,
};

const _v = new THREE.Vector3();
const _c = new THREE.Color();
const _c2 = new THREE.Color();
const _white = new THREE.Color('#ffffff');

// ───────────────────────────── portraits ─────────────────────────────

let pr: { r: THREE.WebGLRenderer; scene: THREE.Scene; cam: THREE.PerspectiveCamera } | null = null;
const portraitCache = new Map<string, string>();

export function portrait(spec: AvatarSpec, mood: Mood = 'happy', size = 128): string {
  const key = `${spec.gender}|${Math.floor(spec.age / 3)}|${JSON.stringify(spec.app)}|${spec.outfit ?? ''}|${mood}|${spec.ghost ?? ''}`;
  const hit = portraitCache.get(key);
  if (hit) return hit;
  if (!pr) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    r.setPixelRatio(1);
    r.setSize(size, size, false);
    r.toneMapping = THREE.NeutralToneMapping;
    r.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(r);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.6;
    pm.dispose();
    scene.add(new THREE.HemisphereLight('#ffffff', '#f2d9bc', 1.3));
    const key = new THREE.DirectionalLight('#fff3e6', 2.2);
    key.position.set(2, 3, 4);
    scene.add(key);
    pr = { r, scene, cam: new THREE.PerspectiveCamera(26, 1, 0.1, 50) };
  }
  const a = new Avatar(spec);
  a.setMood(mood);
  a.update(0.016, 1.3);
  pr.scene.add(a.root);
  const h = a.height;
  const headY = h - 0.32 * (spec.age < 13 ? 0.9 : 1);
  pr.cam.position.set(0, headY + 0.02, 3.1 * Math.max(0.75, Math.min(1.05, h / 1.6)));
  pr.cam.lookAt(0, headY - 0.16, 0);
  pr.r.render(pr.scene, pr.cam);
  const url = pr.r.domElement.toDataURL('image/png');
  a.dispose();
  portraitCache.set(key, url);
  return url;
}
