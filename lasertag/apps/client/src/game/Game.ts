import * as THREE from 'three';
import {
  AgentState, Btn, DEG, GAME, MAPS, ROSTER, Simulation, WEAPONS, computePose, createPose, rayVsPose, yawToward,
  type Agent, type MapDef, type Personality, type SimEvent, type InputCmd, type RayHit,
} from '@neon/shared';
import { RenderPipeline, type Quality } from '../render/Renderer.ts';
import { ArenaView } from '../render/ArenaView.ts';
import { Atmosphere } from '../render/atmosphere.ts';
import { Fx } from '../render/Fx.ts';
import { LightRig } from '../render/lights.ts';
import { AgentView } from '../render/AgentView.ts';
import { Viewmodel } from '../render/Viewmodel.ts';
import { NU, TEAM_COLORS, setAtmosphere } from '../render/neon.ts';
import { Input } from '../input/Input.ts';
import { AudioEngine } from '../audio/AudioEngine.ts';
import { Music } from '../audio/Music.ts';
import { Sfx } from '../audio/Sfx.ts';
import { Announcer } from '../audio/Announcer.ts';
import { Hud } from '../ui/Hud.ts';
import { Menu } from '../ui/Menu.ts';
import { Cinematic } from '../camera/Cinematic.ts';
import { loadProfile, loadSettings, saveProfile, saveSettings, verticalFov, type Settings } from './settings.ts';

type Mode = 'attract' | 'match' | 'ended';

const BASE_SENS = 0.0022;
const PAD_RATE = 3.4; // rad/s at full stick

/** Orchestrates simulation, rendering, audio, input and UI. One instance per page. */
export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly ui: HTMLElement;
  readonly settings: Settings;
  readonly pipe: RenderPipeline;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(70, 1, 0.05, 220);
  readonly input: Input;
  readonly hud: Hud;
  readonly menu: Menu;
  readonly fx = new Fx();
  readonly lights = new LightRig(6);
  readonly vm = new Viewmodel();
  private map: MapDef = MAPS.maze;
  private arena!: ArenaView;
  private atmo: Atmosphere | null = null;
  private audio: AudioEngine | null = null;
  private music: Music | null = null;
  private sfx: Sfx | null = null;
  private announcer: Announcer | null = null;

  sim: Simulation | null = null;
  private views = new Map<number, AgentView>();
  private localView: AgentView | null = null;
  private me: Agent | null = null;
  private mode: Mode = 'attract';
  private paused = false;
  private cinematic: Cinematic | null = null;
  private acc = 0;
  private last = performance.now();
  private time = 0;
  private events: SimEvent[] = [];
  private cmd: InputCmd = { moveX: 0, moveY: 0, yaw: 0, pitch: 0, buttons: 0 };

  // view state
  private yaw = 0;
  private pitch = 0;
  private punch = 0;
  private punchVel = 0;
  private trauma = 0;
  private landDip = 0;
  private fovK = 0;
  private roll = 0;
  private bobT = 0;
  private stepDist = new Map<number, number>();
  private deathCam = new THREE.Vector3();
  private lookD = { x: 0, y: 0 };
  private padD = { x: 0, y: 0 };
  private move = { x: 0, y: 0 };
  private combatHeat = 0;
  private briefT = 0;
  private lastCount = -1;
  private hintEl: HTMLElement | null = null;
  private fixedCam: { p: THREE.Vector3; t: THREE.Vector3 } | null = null;

  // perf
  private frameMs = 16;
  private simMs = 0;
  private fpsAcc = 0;
  private fpsN = 0;
  private fps = 60;
  private autoQ = { active: false, t: 0, sum: 0, n: 0, steps: 0 };

  private readonly _v = new THREE.Vector3();
  private readonly _v2 = new THREE.Vector3();
  private readonly _pose = createPose();
  private readonly _hit: RayHit = { t: 0, zone: 'chest' };

  constructor(canvas: HTMLCanvasElement, ui: HTMLElement) {
    this.canvas = canvas;
    this.ui = ui;
    this.settings = loadSettings();
    this.pipe = new RenderPipeline(canvas);
    this.input = new Input(canvas);
    this.hud = new Hud(ui);
    this.menu = new Menu(ui, this.settings, {
      play: () => this.startMatch(),
      resume: () => this.resume(),
      quit: () => this.toAttract(),
      settingsChanged: (s) => this.applySettings(s),
      sound: (k) => this.sfx?.ui(k),
    });
    this.scene.add(this.fx.group);
    this.camera.layers.enable(1);
    this.bindInput();
    window.addEventListener('resize', () => this.resize());
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.hud.message('CONTEXTE GRAPHIQUE PERDU', 'Recharge la page', 99); });
    document.addEventListener('visibilitychange', () => { if (document.hidden && this.mode === 'match') this.pause(); });
  }

  // ------------------------------------------------------------------ setup
  async init(progress: (k: number, msg: string) => void) {
    progress(0.15, 'Chargement des polices');
    try { await Promise.race([document.fonts.load('700 40px "Chakra Petch"'), new Promise((r) => setTimeout(r, 1500))]); } catch { /* offline */ }
    progress(0.3, 'Construction de l’arène');
    setAtmosphere(this.map.atmosphere);
    this.arena = new ArenaView(this.map);
    this.scene.add(this.arena.group);
    this.lights.setStatic(this.map);
    this.lights.update(0, 0);
    progress(0.5, 'Physique & navigation');
    await this.createAttractSim();
    progress(0.8, 'Lumières & reflets');
    this.pickInitialQuality();
    this.applySettings(this.settings);
    this.resize();
    this.pipe.setScene(this.scene, this.camera, this.vm.scene, this.vm.camera, this.arena.floorMat);
    // static environment capture for mirrors and sheen
    this.fx.group.visible = false;
    for (const v of this.views.values()) v.root.visible = false;
    this.arena.setEnvMap(null);
    const env = this.pipe.captureEnv(this.scene, new THREE.Vector3(0, 2.6, 0), 256);
    this.arena.setEnvMap(env);
    this.fx.group.visible = true;
    progress(1, 'Prêt');
    this.menu.showMain(true);
    this.hud.show(false);
    requestAnimationFrame((t) => this.frame(t));
  }

  private pickInitialQuality() {
    if (this.settings.quality !== 'auto') return;
    const gl = this.pipe.renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)).toLowerCase();
    let q: Quality = 'high';
    if (/swiftshader|llvmpipe|software/.test(name)) q = 'low';
    else if (/intel|mali|adreno|powervr|apple m1(?! (pro|max))/.test(name)) q = 'medium';
    else if (/rtx (30|40|50)|rx (6|7|9)\d{3}|apple m\d (pro|max|ultra)/.test(name)) q = 'ultra';
    this.pipe.setQuality(q);
    this.autoQ.active = true;
  }

  private ensureAudio() {
    if (this.audio) { this.audio.resume(); return; }
    try {
      this.audio = new AudioEngine();
      this.music = new Music(this.audio);
      this.sfx = new Sfx(this.audio);
      this.announcer = new Announcer(this.audio);
      this.audio.setVolumes({ master: this.settings.master, music: this.settings.music, sfx: this.settings.sfx, voice: this.settings.voice });
      this.music.start();
      this.music.setIntensity(0.55);
      this.audio.setMusicOpen(0.75);
    } catch (e) {
      console.warn('Audio unavailable', e);
    }
  }

  applySettings(s: Settings) {
    saveSettings(s);
    if (s.quality !== 'auto') { this.pipe.setQuality(s.quality); this.autoQ.active = false; }
    this.atmoRebuild();
    this.audio?.setVolumes({ master: s.master, music: s.music, sfx: s.sfx, voice: s.voice });
    document.documentElement.style.setProperty('--hud-scale', String(s.hudScale));
    this.hud.setCrosshair(s.crosshairColor, s.crosshairSize);
    this.hud.debugEl.classList.toggle('on', s.showFps || this.hud.debugEl.classList.contains('on'));
  }

  private atmoRebuild() {
    const dust = this.pipe.preset.dust;
    if (this.atmo && (this.atmo as unknown as { _dust: number })._dust === dust) return;
    if (this.atmo) this.scene.remove(this.atmo.group);
    this.atmo = new Atmosphere(this.map, dust);
    (this.atmo as unknown as { _dust: number })._dust = dust;
    this.atmo.setPixelRatio(this.pipe.pixelRatio);
    this.scene.add(this.atmo.group);
  }

  private resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.pipe.resize(w, h);
    this.vm.setAspect(w / h);
    this.fx.setPixelRatio(this.pipe.pixelRatio);
    this.atmo?.setPixelRatio(this.pipe.pixelRatio);
  }

  private bindInput() {
    this.input.onAction((a) => {
      this.ensureAudio();
      if (a === 'pause') {
        if (this.mode === 'match') { if (this.paused) { if (this.menu.panelOpen) this.menu.closePanel(); else this.resume(); } else this.pause(); }
        else if (this.menu.panelOpen) this.menu.closePanel();
      }
      if (a === 'scoreboard' && this.mode === 'match' && this.sim && this.me) this.hud.setScoreboard(true, this.sim, this.me);
      if (a === 'debug') this.hud.debugEl.classList.toggle('on');
    });
    this.input.onRelease((a) => { if (a === 'scoreboard') this.hud.setScoreboard(false); });
    document.addEventListener('pointerlockchange', () => {
      if (!document.pointerLockElement && this.mode === 'match' && !this.paused) this.pause();
    });
    this.canvas.addEventListener('click', () => {
      this.ensureAudio();
      if (this.mode === 'match' && !this.paused && !this.input.locked) void this.input.lock();
    });
    window.addEventListener('pointerdown', () => this.ensureAudio(), { once: true });
  }

  // ------------------------------------------------------------------ sims
  private clearViews() {
    for (const v of this.views.values()) { this.scene.remove(v.root); v.dispose(); }
    this.views.clear();
    if (this.localView) { this.scene.remove(this.localView.root); this.localView.dispose(); this.localView = null; }
    this.stepDist.clear();
  }

  private addView(a: Agent, local = false) {
    const v = new AgentView(a);
    if (local) {
      // the local body is only seen in floor reflections
      v.root.traverse((o) => o.layers.set(3));
      this.localView = v;
    } else this.views.set(a.id, v);
    this.scene.add(v.root);
  }

  private async createAttractSim() {
    this.clearViews();
    const sim = await Simulation.create({ map: this.map, seed: (Math.random() * 1e9) | 0 });
    const pers = Object.keys(ROSTER.personalities) as Personality[];
    for (let i = 0; i < 8; i++) sim.addAgent({ name: sim.botName(), team: i % 2, isBot: true, difficulty: 'elite', personality: pers[(i >> 1) % pers.length] });
    // skip the warmup so the arena is alive immediately
    sim.mode.timeLeft = 0.01;
    this.sim = sim;
    this.me = null;
    for (const a of sim.agents) this.addView(a);
    this.cinematic = new Cinematic(sim);
    this.mode = 'attract';
    this.acc = 0;
    this.camera.fov = 52;
    this.camera.updateProjectionMatrix();
  }

  async startMatch() {
    this.ensureAudio();
    this.menu.showMain(false);
    this.menu.showPause(false);
    this.menu.hideEnd();
    this.hud.clearFeed();
    this.clearViews();
    const s = this.settings;
    const sim = await Simulation.create({ map: this.map, seed: (Math.random() * 1e9) | 0 });
    const me = sim.addAgent({ name: 'Toi', team: 0, isBot: false });
    const pers = Object.keys(ROSTER.personalities) as Personality[];
    let pi = Math.floor(Math.random() * pers.length);
    for (let i = 1; i < s.teamSize; i++) sim.addAgent({ name: sim.botName(), team: 0, isBot: true, difficulty: s.difficulty, personality: pers[pi++ % pers.length] });
    for (let i = 0; i < s.teamSize; i++) sim.addAgent({ name: sim.botName(), team: 1, isBot: true, difficulty: s.difficulty, personality: pers[pi++ % pers.length] });
    this.sim = sim;
    this.me = me;
    for (const a of sim.agents) this.addView(a, a === me);
    this.vm.setTeam(me.team);
    this.hud.setTeam(me.team, me.name);
    this.hud.show(true);
    this.yaw = me.yaw; this.pitch = 0;
    this.mode = 'match';
    this.paused = false;
    this.acc = 0;
    this.combatHeat = 0;
    this.briefT = 0;
    this.lastCount = -1;
    this.cinematic = null;
    this.vm.setHidden(false);
    this.music?.setIntensity(0.3);
    this.music?.setTension(0);
    this.audio?.setMusicOpen(1);
    this.music?.stinger('start');
    this.announcer?.say('welcome', `Bienvenue dans ${this.map.name}. Équipe cyan contre équipe magenta.`);
    void this.input.lock();
    if (this.autoQ.active) Object.assign(this.autoQ, { t: 0, sum: 0, n: 0 });
  }

  private pause() {
    if (this.mode !== 'match' || this.paused) return;
    this.paused = true;
    this.input.unlock();
    this.menu.showPause(true);
    this.hud.setScoreboard(false);
    this.audio?.setMusicOpen(0.3);
    this.setHint(false);
  }

  private resume() {
    if (!this.paused) return;
    this.paused = false;
    this.menu.showPause(false);
    this.audio?.setMusicOpen(1);
    void this.input.lock();
  }

  private async toAttract() {
    this.paused = false;
    this.menu.showPause(false);
    this.menu.hideEnd();
    this.menu.briefing(false);
    this.hud.show(false);
    this.hud.setScoreboard(false);
    this.setHint(false);
    this.input.unlock();
    await this.createAttractSim();
    this.music?.setIntensity(0.55);
    this.music?.setTension(0);
    this.audio?.setMusicOpen(0.75);
    this.menu.showMain(true);
  }

  private setHint(on: boolean) {
    if (on && !this.hintEl) {
      this.hintEl = document.createElement('div');
      this.hintEl.className = 'hint-click';
      this.hintEl.textContent = 'CLIQUE POUR REPRENDRE LE CONTRÔLE';
      this.hintEl.addEventListener('click', () => void this.input.lock());
      this.ui.append(this.hintEl);
    } else if (!on && this.hintEl) { this.hintEl.remove(); this.hintEl = null; }
  }

  // ------------------------------------------------------------------ main loop
  private frame(now: number) {
    requestAnimationFrame((t) => this.frame(t));
    const rawDt = (now - this.last) / 1000;
    this.last = now;
    const dt = Math.min(0.1, Math.max(0, rawDt));
    this.time += dt;
    this.frameMs += (rawDt * 1000 - this.frameMs) * 0.05;
    this.fpsAcc += rawDt; this.fpsN++;
    if (this.fpsAcc > 0.5) { this.fps = this.fpsN / this.fpsAcc; this.fpsAcc = 0; this.fpsN = 0; }

    this.input.pollGamepad(dt);
    const sim = this.sim;
    if (!sim) return;
    const running = this.mode !== 'match' || !this.paused;

    if (this.mode === 'match' && this.me && !this.paused) this.updateLook(dt);

    // fixed-step simulation
    const t0 = performance.now();
    if (running) {
      this.acc += dt;
      let steps = 0;
      while (this.acc >= sim.dt && steps < 6) {
        if (this.me) this.fillCmd();
        sim.step();
        this.input.clearLatched();
        sim.drainEvents(this.events);
        this.acc -= sim.dt;
        steps++;
      }
      if (steps === 6) this.acc = 0;
    }
    this.simMs += (performance.now() - t0 - this.simMs) * 0.1;
    for (const e of this.events) this.onEvent(e);
    this.events.length = 0;

    const alpha = this.acc / sim.dt;
    NU.uTime.value = this.time;
    const beat = this.music?.beatPulse() ?? (0.5 + 0.5 * Math.sin(this.time * Math.PI * 2 * 124 / 60)) * 0.3;
    NU.uBeat.value = beat;

    // agent rigs
    for (const v of this.views.values()) {
      const a = v.agent;
      this.renderPos(a, this._v, alpha);
      v.update(dt, this._v.x, this._v.y, this._v.z, this.time, true);
      this.footsteps(a, dt, false);
    }
    if (this.localView && this.me) {
      this.renderPos(this.me, this._v, alpha);
      this.localView.update(dt, this._v.x, this._v.y, this._v.z, this.time, true);
      this.footsteps(this.me, dt, true);
    }

    // camera
    if (this.mode === 'match' && this.me) this.updateFpsCamera(dt, alpha);
    else if (this.fixedCam) { this.camera.position.copy(this.fixedCam.p); this.camera.lookAt(this.fixedCam.t); }
    else if (this.cinematic) this.cinematic.update(dt, this.camera, (id, out) => this.renderPos(sim.agents[id], out, alpha));
    this.camera.updateMatrixWorld();

    if (this.me) this.vm.update(dt, this.me, this.camera, this.lookD.x, this.lookD.y, this.time);
    this.pipe.setScene(this.scene, this.camera, this.mode === 'match' && this.me ? this.vm.scene : null, this.vm.camera, this.arena.floorMat);
    // reflection camera also sees the local body (layer 3)
    this.pipe.reflection?.cam.layers.enable(3);

    this.lights.update(dt, beat);
    this.arena.update(this.time);
    this.fx.flush();
    this.updateAudio(dt);
    this.pipe.render(dt);

    if (this.mode === 'match' && this.me) {
      const aimEnemy = this.aimingAtEnemy();
      this.hud.update(dt, sim, this.me, this.camera, window.innerHeight, aimEnemy, (a, out) => this.renderPos(a, out, alpha));
      this.updateBriefing(dt);
      this.setHint(!this.paused && !this.input.locked && sim.mode.phase !== 'ended');
    }
    this.updateDebug();
    this.autoQuality(rawDt);
  }

  private renderPos(a: Agent, out: THREE.Vector3, alpha = this.acc / (this.sim?.dt ?? 1)): THREE.Vector3 {
    // teleports (respawn) must not be interpolated
    const dx = a.pos.x - a.prevPos.x, dz = a.pos.z - a.prevPos.z;
    if (dx * dx + dz * dz > 4) return out.set(a.pos.x, a.pos.y, a.pos.z);
    return out.set(a.prevPos.x + dx * alpha, a.prevPos.y + (a.pos.y - a.prevPos.y) * alpha, a.prevPos.z + dz * alpha);
  }

  private updateLook(dt: number) {
    const s = this.settings;
    const me = this.me!;
    this.input.consumeMouse(this.lookD);
    this.input.padLook(this.padD);
    if (me.state !== AgentState.Active || this.sim!.mode.phase === 'ended') { this.lookD.x = this.lookD.y = 0; return; }
    const ads = me.aiming ? s.adsSensitivity * WEAPONS[me.weaponId].adsFovMul : 1;
    const k = BASE_SENS * s.sensitivity * ads;
    const inv = s.invertY ? -1 : 1;
    this.yaw -= this.lookD.x * k + this.padD.x * PAD_RATE * s.padSensitivity * ads;
    this.pitch -= (this.lookD.y * k + this.padD.y * PAD_RATE * 0.75 * s.padSensitivity * ads) * inv;
    this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch));
    if (this.yaw > Math.PI) this.yaw -= Math.PI * 2;
    if (this.yaw < -Math.PI) this.yaw += Math.PI * 2;
    void dt;
  }

  private fillCmd() {
    const c = this.cmd;
    if (!this.paused && this.input.locked || this.input.lastDevice === 'pad') {
      this.input.moveAxes(this.move);
      c.moveX = this.move.x; c.moveY = this.move.y;
      c.buttons = this.input.buttons();
    } else { c.moveX = 0; c.moveY = 0; c.buttons = 0; }
    c.yaw = this.yaw; c.pitch = this.pitch;
    this.sim!.setInput(this.me!.id, c);
  }

  private updateFpsCamera(dt: number, alpha: number) {
    const me = this.me!, cam = this.camera, s = this.settings;
    const p = this.renderPos(me, this._v, alpha);
    const eye = THREE.MathUtils.lerp(GAME.movement.eyeHeight, GAME.movement.crouchEyeHeight, me.crouch);

    // view punch spring
    // stiff spring: sub-step so it stays stable at any frame rate
    for (let left = dt; left > 0; left -= 1 / 240) {
      const h = Math.min(left, 1 / 240);
      this.punchVel += (-this.punch * 300 - this.punchVel * 26) * h;
      this.punch += this.punchVel * h;
    }
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    this.landDip = Math.max(0, this.landDip - dt * 3);

    if (me.state === AgentState.Down) {
      // shutdown cam: rise behind the body and look at whoever turned us off
      const k = Math.min(1, (GAME.vest.shutdownTime - me.downTimer) * 1.2);
      const fx = -Math.sin(me.yaw), fz = -Math.cos(me.yaw);
      this.deathCam.set(p.x - fx * 2.2 * k, p.y + eye + 0.8 * k, p.z - fz * 2.2 * k);
      const eyeV = this._v2.set(p.x, p.y + eye, p.z);
      const dir = this.deathCam.clone().sub(eyeV);
      const len = dir.length();
      if (len > 0.01) {
        dir.divideScalar(len);
        const d = this.sim!.rayDistance(eyeV, dir, len);
        this.deathCam.copy(eyeV).addScaledVector(dir, Math.max(0, d - 0.25));
      }
      cam.position.lerp(this.deathCam, Math.min(1, dt * 5));
      const killer = me.lastDownBy >= 0 ? this.sim!.agents[me.lastDownBy] : null;
      if (killer && killer.state === AgentState.Active) {
        const kp = this.renderPos(killer, this._v2, alpha);
        const want = new THREE.Matrix4().lookAt(cam.position, kp.setY(kp.y + 1.3), cam.up);
        const q = new THREE.Quaternion().setFromRotationMatrix(want);
        cam.quaternion.slerp(q, Math.min(1, dt * 3));
      }
      this.vm.setHidden(true);
      this.setFov(dt, false, false);
      return;
    }
    this.vm.setHidden(false);

    // head bob (subtle, only on the ground)
    const speed = Math.hypot(me.vel.x, me.vel.z);
    this.bobT += dt * speed * 1.25;
    const bobAmt = me.grounded && me.sliding <= 0 ? Math.min(1, speed / 9) * 0.022 : 0;
    const bobY = Math.abs(Math.sin(this.bobT)) * bobAmt;

    cam.position.set(p.x, p.y + eye - this.landDip * 0.08 + bobY, p.z);
    // shake (trauma^2)
    const sh = this.trauma * this.trauma * s.shake;
    const n = (f: number) => Math.sin(this.time * f) * Math.sin(this.time * f * 0.37 + 1.3);
    const shYaw = sh * 0.02 * n(41), shPitch = sh * 0.02 * n(37);
    // roll: slide tilt + strafe lean
    const fwdX = -Math.sin(me.yaw), fwdZ = -Math.cos(me.yaw);
    const lat = me.vel.x * fwdZ * -1 + me.vel.z * fwdX; // right-velocity
    const wantRoll = (me.sliding > 0 ? 0.06 : 0) + THREE.MathUtils.clamp(-lat * 0.0025, -0.02, 0.02);
    this.roll += (wantRoll - this.roll) * Math.min(1, dt * 8);
    cam.rotation.set(0, 0, 0, 'YXZ');
    cam.rotation.y = this.yaw + shYaw;
    cam.rotation.x = this.pitch + this.punch + shPitch;
    cam.rotation.z = this.roll;
    this.setFov(dt, me.aiming, me.sprinting || me.sliding > 0);
  }

  private setFov(dt: number, ads: boolean, fast: boolean) {
    const base = verticalFov(this.settings.fov);
    const want = ads ? base * WEAPONS.photon7.adsFovMul : base + (fast ? 4 : 0);
    this.fovK += (want - this.fovK) * Math.min(1, dt * 12);
    if (Math.abs(this.camera.fov - this.fovK) > 0.01) {
      this.camera.fov = this.fovK;
      this.camera.updateProjectionMatrix();
    }
  }

  private aimingAtEnemy(): boolean {
    const me = this.me!, sim = this.sim!;
    if (me.state !== AgentState.Active) return false;
    const o = sim.eyePos(me, this._v);
    const d = this._v2.set(-Math.sin(me.yaw) * Math.cos(me.pitch), Math.sin(me.pitch), -Math.cos(me.yaw) * Math.cos(me.pitch));
    const wall = sim.rayDistance(o, d, 90);
    for (const a of sim.agents) {
      if (a.team === me.team || a.state !== AgentState.Active) continue;
      if (rayVsPose(o, d, computePose(a, this._pose), wall, this._hit)) return true;
    }
    return false;
  }

  private footsteps(a: Agent, dt: number, local: boolean) {
    if (!this.sfx || a.state !== AgentState.Active || !a.grounded || a.sliding > 0) return;
    const sp = Math.hypot(a.vel.x, a.vel.z);
    if (sp < 1.5 || a.crouched) return;
    const d = (this.stepDist.get(a.id) ?? 0) + sp * dt;
    const stride = a.sprinting ? 2.3 : 1.9;
    if (d > stride) {
      this.stepDist.set(a.id, 0);
      if (local) this.sfx.step(true, null, a.sprinting);
      else if (Math.hypot(a.pos.x - this.camera.position.x, a.pos.z - this.camera.position.z) < 26) this.sfx.step(false, a.pos, a.sprinting);
    } else this.stepDist.set(a.id, d);
  }

  // ------------------------------------------------------------------ events
  private muzzleOf(a: Agent, out: THREE.Vector3): THREE.Vector3 {
    if (this.me && a.id === this.me.id && this.mode === 'match') return this.vm.muzzleWorld(this.camera, out);
    const v = this.views.get(a.id);
    return v ? v.muzzleWorld(out) : out.set(a.pos.x, a.pos.y + 1.3, a.pos.z);
  }

  private occluded(p: { x: number; y: number; z: number }) {
    const c = this.camera.position;
    return !this.sim!.hasLineOfSight(c.x, c.y, c.z, p.x, p.y + 0.5, p.z);
  }

  private onEvent(e: SimEvent) {
    const sim = this.sim!;
    const me = this.me;
    const isMe = (id: number) => !!me && id === me.id;
    const reduced = this.settings.reducedFlashes;
    switch (e.type) {
      case 'shot': {
        const a = sim.agents[e.shooter];
        const col = TEAM_COLORS[a.team];
        const m = this.muzzleOf(a, this._v);
        this.fx.beam(m.x, m.y, m.z, e.to.x, e.to.y, e.to.z, col, isMe(a.id) ? 0.085 : 0.11);
        this.lights.flash(m.x, m.y, m.z, col, isMe(a.id) ? 1.6 : 2.6, 6, 22);
        if (e.surface !== 'none') {
          const n = e.normal;
          this.fx.sparks(e.to.x, e.to.y, e.to.z, n.x, n.y, n.z, col, e.surface === 'agent' ? 16 : 9);
          if (e.surface !== 'agent') this.fx.mark(e.to.x, e.to.y, e.to.z, n.x, n.y, n.z, col, 0.32);
          this.lights.flash(e.to.x + n.x * 0.3, e.to.y + n.y * 0.3, e.to.z + n.z * 0.3, col, e.surface === 'agent' ? 2.2 : 1.3, 4.5, 14);
        }
        if (isMe(a.id)) {
          this.vm.onShot();
          this.punchVel += WEAPONS[a.weaponId].recoil.pitchKickDeg * DEG * 18;
          this.combatHeat = Math.min(1, this.combatHeat + 0.04);
          this.sfx?.shot(null, a.team, true);
          this.input.rumble(0.15, 0.3, 40);
        } else {
          this.sfx?.shot(a.pos, a.team, false, this.occluded(a.pos));
          if (e.surface === 'wall' && Math.random() < 0.5) this.sfx?.impact(e.to, this.occluded(e.to));
        }
        break;
      }
      case 'hit': {
        const target = sim.agents[e.target];
        this.views.get(e.target)?.onHit(e.zone);
        this.localView?.agent.id === e.target && this.localView.onHit(e.zone);
        if (isMe(e.shooter) && e.damage > 0) {
          if (target.vest > 0) {
            this.hud.hitmarker(e.zone === 'head' ? 'head' : 'hit');
            this.sfx?.hitConfirm(e.zone, false);
          }
          if (e.zone === 'head') this.hud.toast('TIR AU CASQUE', true);
          if (e.zone === 'back') this.hud.points('DOS +30');
          this.combatHeat = Math.min(1, this.combatHeat + 0.08);
        }
        if (isMe(e.target)) {
          const s = sim.agents[e.shooter];
          this.hud.hurt(e.zone, yawToward(s.pos.x - me!.pos.x, s.pos.z - me!.pos.z));
          this.sfx?.hurt(s.pos);
          this.trauma = Math.min(1, this.trauma + 0.35);
          this.pipe.aberration = Math.min(1, this.pipe.aberration + (reduced ? 0.2 : 0.6));
          this.combatHeat = Math.min(1, this.combatHeat + 0.12);
          this.input.rumble(0.6, 0.4, 120);
          if (e.zone === 'blaster') this.hud.toast('BLASTER BROUILLÉ');
        }
        break;
      }
      case 'down': {
        const k = sim.agents[e.by], v = sim.agents[e.target];
        this.hud.killfeed(k, v, e.zone, me?.id ?? -1);
        this.views.get(v.id)?.onDown();
        if (this.localView?.agent.id === v.id) this.localView.onDown();
        // burst of light where the vest died
        const col = TEAM_COLORS[v.team];
        this.fx.sparks(v.pos.x, v.pos.y + 1.2, v.pos.z, 0, 1, 0, col, 60, 6);
        this.lights.flash(v.pos.x, v.pos.y + 1.4, v.pos.z, col, 5, 9, 4);
        if (isMe(k.id)) {
          this.hud.hitmarker('kill');
          this.sfx?.hitConfirm(e.zone, true);
          this.hud.toast(`${v.name.toUpperCase()} ÉTEINT${e.zone === 'head' ? ' · CASQUE' : ''}`, true);
          this.hud.points('+100');
          this.combatHeat = Math.min(1, this.combatHeat + 0.25);
          if (e.streak === 3) this.hud.toast('SÉRIE ×3 — EN FEU');
        } else if (!isMe(v.id)) {
          this.sfx?.remoteDown(v.pos, this.occluded(v.pos));
        }
        if (isMe(v.id)) {
          this.sfx?.shutdown();
          this.hud.shutdownBy(k, e.zone);
          this.audio?.setMusicOpen(0.35, 0.3);
          this.trauma = Math.min(1, this.trauma + 0.6);
          this.pipe.aberration = reduced ? 0.3 : 1;
          this.input.rumble(1, 0.8, 400);
        }
        break;
      }
      case 'respawn':
        this.views.get(e.agent)?.onRespawn();
        if (this.localView?.agent.id === e.agent) this.localView.onRespawn();
        if (isMe(e.agent)) {
          this.yaw = me!.yaw; this.pitch = 0;
          this.sfx?.bootup();
          this.audio?.setMusicOpen(1, 0.6);
          this.hud.message('GILET RÉACTIVÉ', 'Protection 2 s', 1.2);
        }
        break;
      case 'jump': if (isMe(e.agent)) this.sfx?.jump(true, null); break;
      case 'land':
        if (isMe(e.agent)) { this.sfx?.land(e.speed, true, null); this.vm.onLand(e.speed); this.landDip = Math.min(1, e.speed / 10); }
        else if (Math.random() < 0.6) this.sfx?.land(e.speed, false, sim.agents[e.agent].pos);
        break;
      case 'slide': if (isMe(e.agent)) this.sfx?.slide(); break;
      case 'overheat': if (isMe(e.agent)) { this.sfx?.overheat(); this.hud.toast('SURCHAUFFE'); } break;
      case 'vent': if (isMe(e.agent)) this.sfx?.vent(); break;
      case 'empty': if (isMe(e.agent)) { this.sfx?.empty(); this.hud.toast('ÉNERGIE VIDE — BASE OU BORNE'); } break;
      case 'jammed': if (isMe(e.agent)) this.sfx?.jammed(); break;
      case 'bark': if (this.mode === 'match') this.hud.bark(sim.agents[e.agent], e.text); break;
      case 'phase':
        if (e.phase === 'playing' && this.mode === 'match') { this.menu.briefing(false); this.hud.message('GO !', 'Éteins-les tous', 1.2); this.sfx?.ui('go'); this.music?.setIntensity(0.45); }
        if (e.phase === 'overtime') this.music?.setTension(1);
        if (e.phase === 'ended' && this.mode === 'match') this.endMatch();
        break;
      case 'announce': {
        if (this.mode !== 'match' || !me) break;
        if (e.key === 'leadTaken') { this.announcer?.say(e.team === me.team ? 'leadTaken' : 'leadLost'); break; }
        const personal = ['double', 'triple', 'rampage', 'unstoppable', 'revenge'];
        if (personal.includes(e.key) && e.agent !== me.id) break;
        if (e.key === 'firstBlood' && e.agent !== undefined) this.hud.toast(`PREMIÈRE EXTINCTION · ${sim.agents[e.agent].name.toUpperCase()}`);
        if (personal.includes(e.key)) this.hud.toast({ double: 'DOUBLE DÉSACTIVATION', triple: 'TRIPLE DÉSACTIVATION', rampage: 'CARNAGE LUMINEUX', unstoppable: 'INARRÊTABLE', revenge: 'VENGEANCE' }[e.key as 'double']);
        if (e.key === 'thirtySeconds' || e.key === 'oneMinute') this.music?.setTension(e.key === 'thirtySeconds' ? 0.8 : 0.4);
        this.announcer?.say(e.key);
        break;
      }
      case 'score': break;
    }
  }

  private updateBriefing(dt: number) {
    const sim = this.sim!;
    if (sim.mode.phase !== 'warmup') return;
    this.briefT += dt;
    const count = Math.ceil(sim.mode.timeLeft);
    if (count !== this.lastCount) {
      this.lastCount = count;
      const n = this.settings.teamSize;
      const diff = ROSTER.difficulties[this.settings.difficulty].label;
      this.menu.briefing(true, this.map.name, `${n}v${n} · bots ${diff}`, count);
      if (count <= 3 && count > 0) this.sfx?.ui('tick');
    }
  }

  private endMatch() {
    const sim = this.sim!, me = this.me!;
    this.mode = 'ended';
    this.input.unlock();
    this.hud.setScoreboard(false);
    this.setHint(false);
    const won = sim.mode.winner === me.team, draw = sim.mode.winner < 0;
    this.announcer?.say(draw ? 'draw' : won ? 'victory' : 'defeat');
    this.music?.stinger(won ? 'win' : 'lose');
    this.music?.setIntensity(won ? 0.8 : 0.3);
    this.music?.setTension(0);
    const xp = 100 + me.stats.deactivations * 25 + (won ? 150 : 0) + me.stats.headshots * 10;
    const p = loadProfile();
    p.matches++; if (won) p.wins++; p.deactivations += me.stats.deactivations; p.bestStreak = Math.max(p.bestStreak, me.stats.bestStreak); p.xp += xp;
    saveProfile(p);
    setTimeout(() => {
      if (this.mode !== 'ended') return;
      this.hud.show(false);
      this.menu.showEnd(sim, me, () => void this.startMatch(), () => void this.toAttract(), xp);
      // keep the arena alive behind the end screen
      this.cinematic = new Cinematic(sim);
    }, 2200);
  }

  // ------------------------------------------------------------------ audio, debug, quality
  private updateAudio(dt: number) {
    if (!this.audio) return;
    const c = this.camera;
    const f = c.getWorldDirection(this._v2);
    this.audio.setListener(c.position.x, c.position.y, c.position.z, f.x, f.y, f.z);
    if (this.mode === 'match' && this.sim && this.me) {
      const m = this.sim.mode;
      this.combatHeat = Math.max(0, this.combatHeat - dt * 0.06);
      // nearby fighting also raises intensity
      let near = 0;
      for (const s of this.sim.shotLog) if (Math.hypot(s.x - this.me.pos.x, s.z - this.me.pos.z) < 18) near++;
      let target = 0.38 + this.combatHeat * 0.45 + Math.min(0.2, near * 0.02);
      if (m.phase === 'warmup') target = 0.3;
      if (m.phase === 'playing' && m.timeLeft < 60) target += 0.15;
      if (m.phase === 'playing' && m.timeLeft < 30) target += 0.2;
      if (m.phase === 'overtime') target = 1;
      const lead = m.scores[this.me.team] - m.scores[1 - this.me.team];
      if (Math.abs(lead) <= 2 && m.scores[0] + m.scores[1] > 10) target += 0.1;
      this.music?.setIntensity(target);
    }
  }

  private updateDebug() {
    const el = this.hud.debugEl;
    if (!el.classList.contains('on')) return;
    const info = this.pipe.renderer.info;
    const me = this.me;
    el.textContent =
      `FPS ${this.fps.toFixed(0)}  frame ${this.frameMs.toFixed(2)} ms  sim ${this.simMs.toFixed(2)} ms\n` +
      `draw calls ${info.render.calls}  tris ${(info.render.triangles / 1000).toFixed(1)}k  geo ${info.memory.geometries}  tex ${info.memory.textures}\n` +
      `quality ${this.pipe.quality}  px ${this.pipe.pixelRatio.toFixed(2)}  refl ${this.pipe.reflection ? 'on' : 'off'}  music ${(this.music?.intensity ?? 0).toFixed(2)}\n` +
      (me ? `pos ${me.pos.x.toFixed(1)} ${me.pos.y.toFixed(2)} ${me.pos.z.toFixed(1)}  v ${Math.hypot(me.vel.x, me.vel.z).toFixed(1)} m/s  ${me.grounded ? 'ground' : 'air'}${me.sliding > 0 ? ' slide' : ''}\n` +
        `vest ${me.vest.toFixed(0)}  nrg ${me.energy.toFixed(0)}  heat ${me.heat.toFixed(0)}  spread ${this.sim!.spreadDeg(me).toFixed(2)}°` : `attract · agents ${this.sim?.agents.length}`);
  }

  private autoQuality(rawDt: number) {
    const q = this.autoQ;
    if (!q.active || this.mode !== 'match' || this.paused) return;
    q.t += rawDt;
    if (q.t < 2) return; // ignore warm-up hitches
    q.sum += rawDt; q.n++;
    if (q.t > 6) {
      const avg = q.sum / q.n;
      const order: Quality[] = ['low', 'medium', 'high', 'ultra'];
      const i = order.indexOf(this.pipe.quality);
      if (avg > 1 / 50 && i > 0 && q.steps < 2) {
        this.pipe.setQuality(order[i - 1]);
        this.atmoRebuild();
        this.resize();
        q.steps++;
        Object.assign(q, { t: 0, sum: 0, n: 0 });
      } else q.active = false;
    }
  }

  // test hooks (used by the automated browser checks)
  debugState() {
    return { mode: this.mode, phase: this.sim?.mode.phase, scores: this.sim?.mode.scores, fps: this.fps, quality: this.pipe.quality, calls: this.pipe.renderer.info.render.calls };
  }
  setView(yaw: number, pitch: number) { this.yaw = yaw; this.pitch = pitch; }
  /** Freeze the attract camera at a viewpoint (screenshots / look-dev). Pass null to release. */
  debugCamera(p: [number, number, number] | null, t: [number, number, number] = [0, 1.5, 0], fov = 70) {
    this.fixedCam = p ? { p: new THREE.Vector3(...p), t: new THREE.Vector3(...t) } : null;
    this.camera.fov = fov; this.camera.updateProjectionMatrix();
  }
  setQuality(q: Quality) { this.pipe.setQuality(q); this.autoQ.active = false; this.atmoRebuild(); this.resize(); }
  get local() { return this.me; }
  get btn() { return Btn; }
}
