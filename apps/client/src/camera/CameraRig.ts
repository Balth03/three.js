import * as THREE from 'three';
import type { PlayerVehicle } from '../vehicles/PlayerVehicle';
import type { Input } from '../input/Input';
import type { Physics } from '../physics/Physics';
import { GROUP, groups } from '../physics/Physics';

export type CameraMode = 'chase' | 'chaseFar' | 'hood' | 'bumper' | 'cockpit';
const MODES: CameraMode[] = ['chase', 'chaseFar', 'cockpit', 'hood', 'bumper'];

/** Vehicle cameras with inertia, dynamic FOV, collision avoidance, mouse/stick orbit and impact shake. */
export class CameraRig {
  mode: CameraMode = 'chase';
  baseFov = 62;
  shakeScale = 1;
  private pos = new THREE.Vector3();
  private vel = new THREE.Vector3();
  private look = new THREE.Vector3();
  private orbitYaw = 0;
  private orbitPitch = 0;
  private orbitIdle = 0;
  private headYaw = 0;
  private headPitch = 0;
  private shake = 0;
  private fov = 62;
  private lagYaw = 0;
  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();
  private desired = new THREE.Vector3();
  private dir = new THREE.Vector3();
  private ray: InstanceType<Physics['R']['Ray']>;
  private initialised = false;
  private lookAccel = new THREE.Vector3();
  private prevVel = new THREE.Vector3();

  constructor(readonly camera: THREE.PerspectiveCamera, private physics: Physics) {
    this.ray = new physics.R.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
  }

  next(): void { this.mode = MODES[(MODES.indexOf(this.mode) + 1) % MODES.length]; this.initialised = false; }
  addShake(v: number): void { this.shake = Math.min(1.2, this.shake + v); }
  get isInterior(): boolean { return this.mode === 'cockpit'; }

  update(dt: number, car: PlayerVehicle, input: Input): void {
    const cam = this.camera;
    const speed = car.velocity.length();
    const fwd = car.forward;
    // flat forward for the chase camera, lagging the car's heading for a sense of rotation
    const flatYaw = Math.atan2(fwd.x, fwd.z);
    let dy = flatYaw - this.lagYaw;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    if (!this.initialised) { this.lagYaw = flatYaw; dy = 0; }
    this.lagYaw += dy * Math.min(1, dt * (3.5 + speed * 0.06));
    // when reversing, keep looking forward
    const lookBack = input.held('lookBack');
    // orbit control (mouse drag / right stick), auto-return when idle
    if (input.mouseDX !== 0 || input.mouseDY !== 0) {
      if (this.mode === 'cockpit') {
        this.headYaw = THREE.MathUtils.clamp(this.headYaw - input.mouseDX * 0.004, -2.2, 2.2);
        this.headPitch = THREE.MathUtils.clamp(this.headPitch - input.mouseDY * 0.004, -0.8, 0.6);
      } else {
        this.orbitYaw -= input.mouseDX * 0.005;
        this.orbitPitch = THREE.MathUtils.clamp(this.orbitPitch - input.mouseDY * 0.004, -0.35, 0.9);
      }
      this.orbitIdle = 0;
    } else {
      this.orbitIdle += dt;
      if (this.orbitIdle > 1.6) {
        const k = Math.min(1, dt * 2.5);
        this.orbitYaw += (Math.round(this.orbitYaw / (Math.PI * 2)) * Math.PI * 2 - this.orbitYaw) * k;
        this.orbitPitch += (0 - this.orbitPitch) * k;
        this.headYaw += (0 - this.headYaw) * k;
        this.headPitch += (0 - this.headPitch) * k;
      }
    }
    // dynamic FOV with speed (subtle), narrower inside
    const targetFov = (this.mode === 'cockpit' ? this.baseFov - 4 : this.baseFov) + Math.min(14, speed * 0.28);
    this.fov += (targetFov - this.fov) * Math.min(1, dt * 2);
    if (Math.abs(cam.fov - this.fov) > 0.01) { cam.fov = this.fov; cam.updateProjectionMatrix(); }
    // acceleration for head motion (cockpit) and camera sway
    this.tmp.copy(car.velocity).sub(this.prevVel).divideScalar(Math.max(dt, 1e-3));
    this.prevVel.copy(car.velocity);
    this.lookAccel.lerp(this.tmp, Math.min(1, dt * 4));

    this.shake = Math.max(0, this.shake - dt * 2.2);
    const sh = this.shake * this.shakeScale;
    const t = performance.now() * 0.001;
    const roadBuzz = Math.min(1, speed / 50) * 0.004 * this.shakeScale * (car.sim.wheels.some((w) => w.surface === 1) ? 3 : 1);
    const shx = (Math.sin(t * 37.1) * 0.6 + Math.sin(t * 23.7) * 0.4) * (sh * 0.12 + roadBuzz);
    const shy = (Math.sin(t * 41.3) * 0.6 + Math.sin(t * 29.1) * 0.4) * (sh * 0.12 + roadBuzz);

    if (this.mode === 'chase' || this.mode === 'chaseFar') {
      const far = this.mode === 'chaseFar';
      const dist = (far ? 9.5 : 6.2) + Math.min(2.2, speed * 0.035);
      const height = far ? 3.4 : 2.05;
      const yaw = this.lagYaw + this.orbitYaw + (lookBack ? Math.PI : 0);
      const pitch = this.orbitPitch;
      const target = this.tmp2.copy(car.position).addScaledVector(car.up, 1.1);
      const desired = this.desired.set(
        target.x - Math.sin(yaw) * dist * Math.cos(pitch),
        target.y + height - 1.1 + Math.sin(pitch) * dist,
        target.z - Math.cos(yaw) * dist * Math.cos(pitch),
      );
      // keep the camera above the ground
      const gy = car.position.y + 0.5;
      if (desired.y < gy) desired.y = gy;
      // collision: pull in if a wall is between target and camera
      const dir = this.dir.subVectors(desired, target);
      const L = dir.length();
      dir.divideScalar(L);
      this.ray.origin = { x: target.x, y: target.y, z: target.z };
      this.ray.dir = { x: dir.x, y: dir.y, z: dir.z };
      const hit = this.physics.world.castRay(this.ray, L, true, undefined, groups(GROUP.PLAYER, GROUP.STATIC), undefined, car.body);
      if (hit) desired.copy(target).addScaledVector(dir, Math.max(1.5, hit.timeOfImpact - 0.35));
      if (!this.initialised) { this.pos.copy(desired); this.vel.set(0, 0, 0); this.look.copy(target); this.initialised = true; }
      // critically-damped spring on position (stiffer laterally to avoid lag sickness)
      const k = 38, c = 2 * Math.sqrt(k);
      const ax = (desired.x - this.pos.x) * k - this.vel.x * c;
      const ay = (desired.y - this.pos.y) * k * 1.6 - this.vel.y * c * 1.25;
      const az = (desired.z - this.pos.z) * k - this.vel.z * c;
      this.vel.x += ax * dt; this.vel.y += ay * dt; this.vel.z += az * dt;
      // follow the car's velocity directly too (prevents the camera from lagging behind at speed)
      this.pos.addScaledVector(this.vel, dt);
      if (this.pos.distanceTo(desired) > 12) this.pos.copy(desired);
      // look slightly ahead of the car
      const lookTarget = this.tmp.copy(car.position).addScaledVector(car.up, 1.0).addScaledVector(car.velocity, 0.08);
      this.look.lerp(lookTarget, Math.min(1, dt * 12));
      cam.position.copy(this.pos);
      cam.position.x += shx; cam.position.y += shy;
      cam.up.set(0, 1, 0);
      cam.lookAt(this.look);
    } else {
      const anchor = this.mode === 'cockpit' ? car.model.cameraAnchors.cockpit : this.mode === 'hood' ? car.model.cameraAnchors.hood : car.model.cameraAnchors.bumper;
      anchor.updateWorldMatrix(true, false);
      anchor.getWorldPosition(cam.position);
      // head motion: lean against acceleration (cockpit only)
      const q = car.quaternion.clone();
      cam.quaternion.copy(q);
      if (this.mode === 'cockpit') {
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
        const lat = this.lookAccel.dot(right), lon = this.lookAccel.dot(car.forward);
        cam.position.addScaledVector(right, THREE.MathUtils.clamp(-lat * 0.004, -0.05, 0.05));
        cam.position.addScaledVector(car.forward, THREE.MathUtils.clamp(-lon * 0.003, -0.05, 0.05));
        // look into turns
        const turnLook = THREE.MathUtils.clamp(car.sim.steeringAngle * 0.6, -0.25, 0.25);
        const e = new THREE.Euler(this.headPitch - 0.06, this.headYaw + turnLook + (lookBack ? Math.PI * 0.95 : 0), 0, 'YXZ');
        cam.quaternion.multiply(new THREE.Quaternion().setFromEuler(e));
      } else {
        const e = new THREE.Euler(this.mode === 'hood' ? -0.03 : 0, lookBack ? Math.PI : 0, 0, 'YXZ');
        cam.quaternion.multiply(new THREE.Quaternion().setFromEuler(e));
      }
      cam.position.x += shx * 0.4; cam.position.y += shy * 0.4;
      this.initialised = false;
    }
    cam.updateMatrixWorld();
  }
}
