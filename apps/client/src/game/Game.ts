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

export interface GameDeps {
  renderer: Renderer; env: Environment; physics: Physics; city: City; world: WorldStreamer; lightField: LightField; params: LaunchParams; loading: LoadingScreen;
}

/** Fixed physics step. */
export const PHYSICS_DT = 1 / 120;

export class Game {
  readonly input: Input;
  private clock = new THREE.Clock();
  private acc = 0;
  private running = false;
  readonly focus = new THREE.Vector3();
  readonly focusVel = new THREE.Vector3();
  // debug free camera
  private freeCam = { yaw: 0, pitch: -0.2 };
  frame = 0;
  fps = 60;
  private fpsAcc = 0; private fpsFrames = 0;

  constructor(readonly d: GameDeps) {
    this.input = new Input(d.renderer.canvas);
  }

  async start(): Promise<void> {
    const { city, world, renderer, params, loading } = this.d;
    const sp = city.meta.spawn;
    if (params.cam) {
      const [x, y, z, yaw, pitch] = params.cam;
      // y is relative to the terrain
      renderer.camera.position.set(x, city.terrain.height(x, z) + y, z);
      this.freeCam.yaw = (yaw ?? 0) * Math.PI / 180; this.freeCam.pitch = (pitch ?? -10) * Math.PI / 180;
      this.focus.set(x, 0, z);
    } else {
      this.focus.set(sp.x, city.terrain.height(sp.x, sp.z), sp.z);
      renderer.camera.position.set(sp.x, this.focus.y + 3, sp.z + 8);
    }
    // wait for the workers and the first ring of tiles
    while (!world.isReady) await new Promise((r) => setTimeout(r, 50));
    const t0 = performance.now();
    while (performance.now() - t0 < 60000) {
      world.update(this.focus);
      const near = this.nearTilesLoaded(220);
      loading.set(0.7 + 0.3 * near, `Construction de la ville… ${world.loadedCount} quartiers`);
      if (near >= 1 && world.pendingCount === 0) break;
      if (near >= 1 && performance.now() - t0 > 4000) break;
      await new Promise((r) => setTimeout(r, 60));
    }
    this.d.env.bakeEnv();
    loading.hide();
    this.running = true;
    this.clock.start();
    if (params.screenshot) this.paused = true;
    renderer.renderer.setAnimationLoop(() => this.tick());
  }

  private nearTilesLoaded(r: number): number {
    const S = this.d.city.meta.tileSize;
    let tot = 0, ok = 0;
    for (let x = this.focus.x - r; x <= this.focus.x + r; x += S) for (let z = this.focus.z - r; z <= this.focus.z + r; z += S) {
      tot++; if (this.d.world.isLoadedAt(x, z)) ok++;
    }
    return tot ? ok / tot : 1;
  }

  /** Pause the real-time loop (used by automated screenshot tests with software rendering). */
  paused = false;
  frameMs = 0;
  setPaused(p: boolean): void { this.paused = p; }
  /** Advance the simulation manually by n frames of dt seconds (renders each frame). */
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
    // fixed-step simulation
    this.acc += dt;
    let steps = 0;
    while (this.acc >= PHYSICS_DT && steps < 8) {
      this.fixedUpdate(PHYSICS_DT);
      physics.step();
      this.acc -= PHYSICS_DT;
      steps++;
    }
    if (steps === 8) this.acc = 0;
    this.updateFreeCam(dt);
    if (this.input.pressed('timeFast')) env.timeScale = env.timeScale > 1 ? 1 : 30;
    if (this.input.pressed('weather')) {
      const order = ['clear', 'cloudy', 'rain', 'storm', 'fog'] as const;
      env.setWeather(order[(order.indexOf(env.weather.kind) + 1) % order.length]);
    }
    G.uTime.value += dt;
    G.uCameraPos.value.copy(renderer.camera.position);
    env.update(dt, this.focus, renderer.camera);
    world.update(this.focus, this.focusVel);
    lightField.beginCones();
    lightField.update(renderer.renderer, this.focus, (cb) => world.forEachLight(cb), env.night > 0.05 || env.weather.cloud > 0.8);
    renderer.setFilm({ exposure: env.exposure, flash: env.lightning * 1.5 });
    renderer.render(dt);
    this.input.endFrame();
    this.frameMs = performance.now() - tStart;
  }

  private fixedUpdate(_dt: number): void { /* vehicles etc. */ }

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
    this.focusVel.set(0, 0, 0);
    this.focus.set(cam.position.x, 0, cam.position.z);
  }
}
