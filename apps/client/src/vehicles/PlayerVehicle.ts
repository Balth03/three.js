import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import { VehicleSim, RapierVehicleBody, type CarSpec, type DriveInput } from '@taxi/shared';
import { createCarModel, VIREO_LUMEN_SPEC, type CarModel } from './carModel';
import { GROUP, groups, type Physics } from '../physics/Physics';

/** Chassis collider centre height above the body origin (ground level at static ride height). */
const CHASSIS_Y = 0.72;

/**
 * The player's taxi: Rapier rigid body + shared VehicleSim + procedural model. Rendering interpolates between physics
 * states for smooth motion at any frame rate.
 */
export class PlayerVehicle {
  readonly sim: VehicleSim;
  readonly body: RAPIER.RigidBody;
  readonly api: RapierVehicleBody;
  readonly model: CarModel;
  readonly object = new THREE.Group();
  readonly input: DriveInput = { throttle: 0, brake: 0, steer: 0, handbrake: 0, shiftUp: false, shiftDown: false, digitalSteer: true };
  private prevPos = new THREE.Vector3();
  private currPos = new THREE.Vector3();
  private prevRot = new THREE.Quaternion();
  private currRot = new THREE.Quaternion();
  readonly position = new THREE.Vector3();
  readonly quaternion = new THREE.Quaternion();
  readonly velocity = new THREE.Vector3();
  readonly forward = new THREE.Vector3();
  readonly up = new THREE.Vector3();
  headlights = false;
  indicator: 'none' | 'left' | 'right' | 'hazard' = 'none';
  taxiState: 'free' | 'busy' | 'off' = 'free';
  private spots: THREE.SpotLight[] = [];
  private blinkT = 0;
  private extraMass = 0;
  /** Impact accumulator for comfort/audio (N·s this frame). */
  impact = 0;
  impactPoint = new THREE.Vector3();

  constructor(readonly spec: CarSpec, readonly physics: Physics, x: number, y: number, z: number, headingDeg: number) {
    const R = physics.R;
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (-headingDeg * Math.PI) / 180);
    this.body = physics.world.createRigidBody(
      R.RigidBodyDesc.dynamic().setTranslation(x, y + 0.05, z).setRotation({ x: q.x, y: q.y, z: q.z, w: q.w })
        .setCcdEnabled(true).setCanSleep(false).setAngularDamping(0.05).setLinearDamping(0.0),
    );
    const g = groups(GROUP.PLAYER, GROUP.STATIC | GROUP.TRAFFIC | GROUP.PROP);
    const hw = spec.dimensions.width / 2 - 0.12, hl = spec.dimensions.length / 2 - 0.14;
    const main = R.ColliderDesc.roundCuboid(hw - 0.08, 0.3, hl - 0.08, 0.1).setTranslation(0, CHASSIS_Y, 0)
      .setMassProperties(spec.mass, { x: 0, y: spec.comHeight - CHASSIS_Y, z: spec.comOffsetZ }, { x: spec.inertia[2], y: spec.inertia[1], z: spec.inertia[0] }, { x: 0, y: 0, z: 0, w: 1 })
      .setFriction(0.35).setRestitution(0.1).setCollisionGroups(g)
      .setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(4000);
    physics.world.createCollider(main, this.body);
    const cabin = R.ColliderDesc.roundCuboid(hw - 0.2, 0.12, 1.05, 0.08).setTranslation(0, 1.22, 0.15).setDensity(0).setFriction(0.3).setCollisionGroups(g);
    physics.world.createCollider(cabin, this.body);
    physics.excludeBody = this.body;
    this.api = new RapierVehicleBody(this.body);
    this.sim = new VehicleSim(spec);
    this.model = createCarModel(VIREO_LUMEN_SPEC);
    this.object.add(this.model.root);
    this.model.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.Material;
      m.castShadow = !mat.transparent; m.receiveShadow = true;
      if (mat.transparent) m.userData.cannotReceiveAO = true;
    });
    for (const a of this.model.headlightAnchors) {
      const s = new THREE.SpotLight(0xfff2e0, 0, 70, 0.52, 0.55, 1.6);
      s.position.set(0, 0, 0);
      const tgt = new THREE.Object3D();
      tgt.position.set(0, -0.6, -10);
      a.add(s, tgt);
      s.target = tgt;
      this.spots.push(s);
    }
    this.syncFromBody(true);
  }

  setPassengerMass(kg: number): void {
    if (Math.abs(kg - this.extraMass) < 1) return;
    this.extraMass = kg;
    // rear seat: shift CoM slightly back and up
    this.body.setAdditionalMassProperties(kg, { x: 0.25, y: 0.6, z: 0.45 }, { x: kg * 0.3, y: kg * 0.3, z: kg * 0.3 }, { x: 0, y: 0, z: 0, w: 1 }, true);
  }

  fixedUpdate(dt: number): void {
    this.prevPos.copy(this.currPos);
    this.prevRot.copy(this.currRot);
    this.sim.step(dt, this.input, this.api, this.physics);
    this.input.shiftUp = false; this.input.shiftDown = false;
  }

  /** After physics.step(): capture the new state. */
  postPhysics(): void {
    const t = this.body.translation(), r = this.body.rotation();
    this.currPos.set(t.x, t.y, t.z);
    this.currRot.set(r.x, r.y, r.z, r.w);
  }

  syncFromBody(reset = false): void {
    this.postPhysics();
    if (reset) { this.prevPos.copy(this.currPos); this.prevRot.copy(this.currRot); }
  }

  /** Visual update with interpolation factor alpha (0..1 between previous and current physics step). */
  update(dt: number, alpha: number, night: number): void {
    this.position.lerpVectors(this.prevPos, this.currPos, alpha);
    this.quaternion.slerpQuaternions(this.prevRot, this.currRot, alpha);
    this.object.position.copy(this.position);
    this.object.quaternion.copy(this.quaternion);
    const v = this.body.linvel();
    this.velocity.set(v.x, v.y, v.z);
    this.forward.set(0, 0, -1).applyQuaternion(this.quaternion);
    this.up.set(0, 1, 0).applyQuaternion(this.quaternion);
    // wheels
    const sus = this.spec.suspension, R = this.spec.wheel.radius;
    for (let i = 0; i < 4; i++) {
      const w = this.sim.wheels[i];
      const obj = this.model.wheels[i];
      if (!obj) continue;
      const len = Math.min(sus.staticLength + sus.droop, Math.max(sus.staticLength - sus.bump, w.length));
      obj.position.y = R + sus.staticLength - len;
      obj.rotation.y = w.steer;
      const spin = obj.getObjectByName('spin');
      if (spin) spin.rotation.x = -w.spin;
    }
    if (this.model.steeringWheel) this.model.steeringWheel.rotation.z = this.sim.steeringAngle * 13;
    // lights
    this.blinkT += dt;
    const blinkOn = (this.blinkT % 0.75) < 0.4;
    const tel = this.sim.telemetry;
    const braking = tel.brake > 0.05 && this.sim.gear >= 0 ? 1 : 0;
    this.model.setLights({
      headlights: this.headlights,
      brake: braking,
      reverse: this.sim.gear < 0,
      indicatorLeft: (this.indicator === 'left' || this.indicator === 'hazard') && blinkOn,
      indicatorRight: (this.indicator === 'right' || this.indicator === 'hazard') && blinkOn,
      taxi: this.taxiState,
    });
    for (const s of this.spots) s.intensity = this.headlights ? 26 + night * 10 : 0;
  }

  get blinkerPhase(): boolean { return (this.blinkT % 0.75) < 0.4; }

  /** Respawn upright at a position. */
  teleport(x: number, y: number, z: number, headingDeg: number): void {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (-headingDeg * Math.PI) / 180);
    this.body.setTranslation({ x, y: y + 0.3, z }, true);
    this.body.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.sim.reset();
    this.syncFromBody(true);
  }

  /** Heading in degrees (0 = north/-Z, 90 = east). */
  get heading(): number {
    return (Math.atan2(this.forward.x, -this.forward.z) * 180) / Math.PI;
  }

  get speedKmh(): number { return Math.abs(this.sim.telemetry.speed) * 3.6; }

  dispose(): void {
    this.physics.world.removeRigidBody(this.body);
    this.model.dispose();
  }
}
