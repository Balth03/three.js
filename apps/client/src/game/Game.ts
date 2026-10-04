import * as THREE from 'three';
import type { Renderer } from '../render/Renderer';
import type { Environment } from '../render/Environment';
import type { LightField } from '../render/LightField';
import { G } from '../render/materials/common';
import type { Physics } from '../physics/Physics';
import type { City, WorldStreamer } from '../world/World';
import type { LaunchParams } from './bootstrap';
import type { LoadingScreen } from '../ui/LoadingScreen';
import { Input } from '../input/Input';
import { PlayerVehicle } from '../vehicles/PlayerVehicle';
import { CameraRig } from '../camera/CameraRig';
import type { CarSpec } from '@taxi/shared';
import { fetchJson } from '../core/fetchData';
import { EventBus } from '../core/EventBus';
import type { EdgeHit } from '../world/RoadGraph';
import { Landmarks } from '../world/Landmarks';
import { TrafficSystem } from '../traffic/TrafficSystem';

export interface GameDeps {
  renderer: Renderer; env: Environment; physics: Physics; city: City; world: WorldStreamer; lightField: LightField; params: LaunchParams; loading: LoadingScreen;
}

/** A game system: optional hooks called by the main loop. */
export interface System {
  fixedUpdate?(dt: number): void;
  update?(dt: number): void;
  lateUpdate?(dt: number): void;
}

/** Relative traffic density by hour (rush hours in the morning and evening, quiet at night). */
export function trafficDensity(h: number): number {
  const morning = Math.exp(-((h - 8.5) ** 2) / 2.5), evening = Math.exp(-((h - 18.5) ** 2) / 3);
  const night = h < 5 || h > 23 ? 0.35 : h < 7 ? 0.5 : 0.75;
  return Math.min(1.15, night + morning * 0.4 + evening * 0.45);
}

/** Fixed physics step. */
export const PHYSICS_DT = 1 / 120;

export class Game {
  readonly input: Input;
  readonly events = new EventBus();
  private clock = new THREE.Clock();
  private acc = 0;
  private running = false;
  readonly focus = new THREE.Vector3();
  readonly focusVel = new THREE.Vector3();
  player: PlayerVehicle | null = null;
  cameraRig: CameraRig | null = null;
  readonly systems: System[] = [];
  freeCamera = false;
  private freeCam = { yaw: 0, pitch: -0.2 };
  frame = 0;
  fps = 60;
  private fpsAcc = 0; private fpsFrames = 0;
  paused = false;
  /** Pause from menus (simulation frozen, rendering continues). */
  menuPaused = false;
  frameMs = 0;
  private surfaceCache = new Map<number, number>();
  private hit: EdgeHit = { edge: 0, s: 0, dist: 0, x: 0, z: 0, side: 0, tx: 0, tz: 0 };
  carSpec!: CarSpec;
  landmarks!: Landmarks;
  traffic!: TrafficSystem;

  constructor(readonly d: GameDeps) {
    this.input = new Input(d.renderer.canvas);
  }

  async start(): Promise<void> {
    const { city, world, renderer, params, loading, physics } = this.d;
    this.carSpec = await fetchJson<CarSpec>(`${import.meta.env.BASE_URL}cars/vireo_lumen.json`);
    physics.roadSurfaceAt = (x, z) => this.surfaceAt(x, z);
    this.landmarks = new Landmarks(city, physics, renderer.qualityName === 'low' ? 'low' : 'high');
    renderer.scene.add(this.landmarks.group);
    this.systems.push({ update: (dt) => this.landmarks.update(dt, this.d.env, this.focus) });
    this.traffic = new TrafficSystem(city.graph, city.terrain, physics, city.config.drivingSide);
    renderer.scene.add(this.traffic.group);
    this.systems.push({
      update: (dt) => {
        const p = this.player;
        const cam = this.d.renderer.camera.position;
        this.traffic.setNight(this.d.env.night);
        this.traffic.densityScale = trafficDensity(this.d.env.time) * (this.d.env.weather.rain > 0.5 ? 0.85 : 1);
        this.traffic.update(dt, p ? { x: p.position.x, z: p.position.z, vx: p.velocity.x, vz: p.velocity.z, fx: p.forward.x, fz: p.forward.z } : null, cam.x, cam.z, this.d.lightField, this.d.env.night);
      },
    });
    this.events.on('car:impact', (e) => { const p = this.player; if (p) this.traffic.onPlayerHit(e.impulse as number, p.position.x, p.position.z); });
    const sp = this.spawnPoint(city.meta.spawn.x, city.meta.spawn.z, city.meta.spawn.heading);
    this.freeCamera = !!params.cam || params.noCar;
    if (params.cam) {
      const [x, y, z, yaw, pitch] = params.cam;
      renderer.camera.position.set(x, city.terrain.height(x, z) + y, z);
      this.freeCam.yaw = ((yaw ?? 0) * Math.PI) / 180; this.freeCam.pitch = ((pitch ?? -10) * Math.PI) / 180;
      this.focus.set(x, 0, z);
    } else {
      this.focus.set(sp.x, sp.y, sp.z);
    }
    while (!world.isReady) await new Promise((r) => setTimeout(r, 50));
    const t0 = performance.now();
    while (performance.now() - t0 < 60000) {
      world.update(this.focus);
      const near = this.nearTilesLoaded(200);
      loading.set(0.7 + 0.3 * near, `Construction de la ville… ${world.loadedCount} quartiers`);
      if (near >= 1 && (world.pendingCount === 0 || performance.now() - t0 > 4000)) break;
      await new Promise((r) => setTimeout(r, 60));
    }
    if (!params.noCar) {
      this.player = new PlayerVehicle(this.carSpec, physics, sp.x, sp.y, sp.z, sp.heading);
      renderer.scene.add(this.player.object);
      this.cameraRig = new CameraRig(renderer.camera, physics);
      this.player.headlights = this.d.env.night > 0.3;
    }
    this.events.emit('game:ready', {});
    this.d.env.bakeEnv();
    loading.hide();
    this.running = true;
    this.clock.start();
    if (params.screenshot) this.paused = true;
    renderer.renderer.setAnimationLoop(() => this.tick());
  }

  /** Snap a position to the nearest car-drivable road, oriented along it. */
  spawnPoint(x: number, z: number, headingDeg: number): { x: number; y: number; z: number; heading: number } {
    const g = this.d.city.graph;
    const h = this.hit;
    if (g.nearest(x, z, 300, h, (e) => !(g.d.flags[e] & 20) && g.d.width[e] >= 5)) {
      const d = g.d;
      let hdg = (Math.atan2(h.tx, -h.tz) * 180) / Math.PI;
      const diff = ((headingDeg - hdg + 540) % 360) - 180;
      if (d.oneway[h.edge] === 0 && Math.abs(diff) > 90) hdg += 180;
      const rad = (hdg * Math.PI) / 180;
      const fx = Math.sin(rad), fz = -Math.cos(rad);
      const rx = -fz, rz = fx;
      const off = d.oneway[h.edge] ? 0 : Math.min(d.width[h.edge] / 4, 3.5);
      const px = h.x + rx * off, pz = h.z + rz * off;
      return { x: px, y: this.d.city.terrain.height(px, pz) + 0.05, z: pz, heading: hdg };
    }
    return { x, y: this.d.city.terrain.height(x, z), z, heading: headingDeg };
  }

  private surfaceAt(x: number, z: number): number {
    const key = Math.round(x / 3) * 100003 + Math.round(z / 3);
    let s = this.surfaceCache.get(key);
    if (s === undefined) {
      const g = this.d.city.graph;
      s = g.nearest(x, z, 20, this.hit) ? g.d.surface[this.hit.edge] : 0;
      if (this.surfaceCache.size > 4000) this.surfaceCache.clear();
      this.surfaceCache.set(key, s);
    }
    return s;
  }

  private nearTilesLoaded(r: number): number {
    const S = this.d.city.meta.tileSize;
    let tot = 0, ok = 0;
    for (let x = this.focus.x - r; x <= this.focus.x + r; x += S) for (let z = this.focus.z - r; z <= this.focus.z + r; z += S) {
      tot++; if (this.d.world.isLoadedAt(x, z)) ok++;
    }
    return tot ? ok / tot : 1;
  }

  setPaused(p: boolean): void { this.paused = p; }
  /** Advance manually by n frames of dt seconds (automated tests with software GL). */
  advance(n: number, dt = 1 / 30): void { for (let i = 0; i < n; i++) this.tick(dt); }

  private tick(fixedDt?: number): void {
    if (!this.running) return;
    if (this.paused && fixedDt === undefined) { this.clock.getDelta(); return; }
    const tStart = performance.now();
    const dt = fixedDt ?? Math.min(0.1, this.clock.getDelta());
    this.frame++;
    this.fpsAcc += dt; this.fpsFrames++;
    if (this.fpsAcc > 0.5) { this.fps = this.fpsFrames / this.fpsAcc; this.fpsAcc = 0; this.fpsFrames = 0; }
    const { renderer, env, world, lightField, physics } = this.d;
    this.input.update();
    this.handleGlobalInput();
    const simDt = this.menuPaused ? 0 : dt;
    if (this.player && !this.freeCamera) this.mapDriveInput();
    // fixed-step simulation
    this.acc += simDt;
    let steps = 0;
    while (this.acc >= PHYSICS_DT && steps < 10) {
      this.player?.fixedUpdate(PHYSICS_DT);
      for (const s of this.systems) s.fixedUpdate?.(PHYSICS_DT);
      physics.step();
      this.player?.postPhysics();
      this.drainContacts();
      this.acc -= PHYSICS_DT;
      steps++;
    }
    if (steps === 10) this.acc = 0;
    const alpha = this.acc / PHYSICS_DT;
    if (this.player) {
      this.player.update(simDt, alpha, env.night);
      this.focus.copy(this.player.position);
      this.focusVel.copy(this.player.velocity);
    }
    if (this.freeCamera || !this.player) this.updateFreeCam(dt);
    else this.cameraRig!.update(dt, this.player, this.input);
    for (const s of this.systems) s.update?.(simDt);
    G.uTime.value += simDt;
    G.uCameraPos.value.copy(renderer.camera.position);
    env.update(simDt, this.focus, renderer.camera);
    world.update(this.focus, this.focusVel);
    lightField.beginCones();
    if (this.player?.headlights) {
      const p = this.player;
      lightField.addCone(p.position.x + p.forward.x * 2.2, p.position.z + p.forward.z * 2.2, p.forward.x, p.forward.z, 30, 14, 1.4, 1.3, 1.15);
    }
    for (const s of this.systems) s.lateUpdate?.(simDt);
    lightField.update(renderer.renderer, this.focus, (cb) => world.forEachLight(cb), env.night > 0.05 || env.weather.cloud > 0.8);
    renderer.setFilm({ exposure: env.exposure, flash: env.lightning * 1.5 });
    renderer.render(dt);
    this.input.endFrame();
    this.frameMs = performance.now() - tStart;
  }

  private drainContacts(): void {
    const p = this.player;
    this.d.physics.eventQueue.drainContactForceEvents((ev) => {
      if (!p) return;
      const mag = ev.totalForceMagnitude();
      if (mag > 4000) {
        const impulse = mag * PHYSICS_DT;
        p.impact = Math.max(p.impact, impulse);
        this.events.emit('car:impact', { impulse, force: mag });
      }
    });
  }

  private mapDriveInput(): void {
    const p = this.player!;
    const inp = this.input;
    p.input.throttle = inp.throttle;
    p.input.brake = inp.brake;
    p.input.steer = inp.steer;
    p.input.digitalSteer = inp.digitalSteer;
    p.input.handbrake = inp.value.handbrake;
    if (inp.pressed('shiftUp')) p.input.shiftUp = true;
    if (inp.pressed('shiftDown')) p.input.shiftDown = true;
    if (inp.pressed('lights')) p.headlights = !p.headlights;
    if (inp.pressed('indicatorLeft')) p.indicator = p.indicator === 'left' ? 'none' : 'left';
    if (inp.pressed('indicatorRight')) p.indicator = p.indicator === 'right' ? 'none' : 'right';
    if (inp.pressed('hazard')) p.indicator = p.indicator === 'hazard' ? 'none' : 'hazard';
    if (inp.pressed('camera')) this.cameraRig?.next();
    if (inp.pressed('reset')) this.resetCar();
  }

  /** Put the car back on the nearest road, upright. */
  resetCar(): void {
    const p = this.player;
    if (!p) return;
    const sp = this.spawnPoint(p.position.x, p.position.z, p.heading);
    p.teleport(sp.x, sp.y, sp.z, sp.heading);
    this.events.emit('car:reset', {});
  }

  private handleGlobalInput(): void {
    const inp = this.input, env = this.d.env;
    if (inp.pressed('timeFast')) env.timeScale = env.timeScale > 1 ? 1 : 40;
    if (inp.pressed('weather')) {
      const order = ['clear', 'cloudy', 'rain', 'storm', 'fog'] as const;
      env.setWeather(order[(order.indexOf(env.weather.kind) + 1) % order.length]);
      this.events.emit('ui:toast', { text: `Météo : ${env.weather.kind}` });
    }
    if (inp.isDown('F8') && inp.pressed('debug')) this.freeCamera = !this.freeCamera;
  }

  private updateFreeCam(dt: number): void {
    const cam = this.d.renderer.camera;
    const inp = this.input;
    this.freeCam.yaw -= inp.mouseDX * 0.003;
    this.freeCam.pitch = Math.max(-1.5, Math.min(1.5, this.freeCam.pitch - inp.mouseDY * 0.003));
    const speed = (inp.isDown('ShiftLeft') ? 120 : 30) * dt;
    const fwd = new THREE.Vector3(-Math.sin(this.freeCam.yaw), 0, -Math.cos(this.freeCam.yaw));
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
    if (inp.isDown('KeyW')) cam.position.addScaledVector(fwd, speed);
    if (inp.isDown('KeyS')) cam.position.addScaledVector(fwd, -speed);
    if (inp.isDown('KeyD')) cam.position.addScaledVector(right, speed);
    if (inp.isDown('KeyA')) cam.position.addScaledVector(right, -speed);
    if (inp.isDown('KeyE')) cam.position.y += speed;
    if (inp.isDown('KeyQ')) cam.position.y -= speed;
    cam.rotation.set(this.freeCam.pitch, this.freeCam.yaw, 0, 'YXZ');
    if (!this.player) {
      this.focusVel.set(0, 0, 0);
      this.focus.set(cam.position.x, 0, cam.position.z);
    }
  }
}
