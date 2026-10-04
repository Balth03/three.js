/**
 * Raycast-suspension vehicle model.
 *
 *  - 4 independent wheels: spring + bump/rebound damper + bump stop, anti-roll bars per axle.
 *  - Tyres: normalised combined-slip magic formula (Pacejka-like), load sensitivity, surface mu, wetness.
 *    Wheel spin is integrated semi-implicitly (linearised tyre force) so it is stable at 120 Hz.
 *  - Powertrain: torque curve, torque converter (auto) / clutch, gearbox auto & manual, LSD/open diff, engine braking,
 *    rev limiter, hybrid electric boost at low speed.
 *  - Brakes with ABS, handbrake on rear, TCS, ESC (yaw-rate based corrective moment), steering assist.
 *  - Aero drag + downforce, rolling resistance.
 *
 * Local frame: forward = -Z, right = +X, up = +Y. Body origin = ground-level centre between the axles at static ride height.
 * All per-step code is allocation free.
 */
import type { Assists, CarSpec, DriveInput, GroundHit, Quat, TireCurve, Vec3, VehicleBodyAPI, VehicleWorldAPI } from './types';
import { SURFACE_DRAG, SURFACE_MU } from './types';

const G = 9.81;
const RAD = Math.PI / 180;

export interface WheelState {
  // static config
  lx: number; ly: number; lz: number; // hardpoint local position
  front: boolean; left: boolean; driven: boolean;
  spring: number; bump: number; rebound: number;
  // dynamic
  contact: boolean;
  length: number; // current hardpoint->wheel centre distance
  prevLength: number;
  compressionVel: number;
  load: number; // Fz (N)
  omega: number; // angular velocity rad/s (positive = rolling forward)
  spin: number; // accumulated rotation angle (visual)
  steer: number; // rad
  slipRatio: number;
  slipAngle: number;
  fx: number; fy: number;
  slide: number; // 0..1+ combined slip intensity (for audio/fx)
  surface: number;
  brakeTorque: number;
  driveTorque: number;
  absPhase: number;
  // world-space contact (for fx: skid marks, smoke)
  px: number; py: number; pz: number;
  nx: number; ny: number; nz: number;
  collider: number;
}

export interface VehicleTelemetry {
  speed: number; // m/s signed (forward +)
  rpm: number;
  gear: number; // -1 R, 0 N, 1..n
  throttle: number; brake: number; steer: number;
  load: number; // -1..1 engine load
  shifting: boolean;
  wheelsOnGround: number;
  lateralG: number; longitudinalG: number; verticalG: number;
  yawRate: number;
  absActive: boolean; tcsActive: boolean; escActive: boolean;
  electric: boolean;
  bumpImpulse: number;
}

function curveForce(s: number, c: TireCurve): number {
  // Normalised magic formula: s = slip / peakSlip, returns 0..~1 with max 1 at s=1.
  const C = c.shape;
  const Bp = Math.tan(Math.PI / (2 * C)); // so that the peak lands at s = 1
  const x = Bp * s;
  const E = c.curvature;
  return Math.sin(C * Math.atan(x - E * (x - Math.atan(x)))) / Math.sin(C * Math.atan(Bp - E * (Bp - Math.atan(Bp))));
}

function curveSlope(s: number, c: TireCurve): number {
  const h = 1e-3;
  return (curveForce(s + h, c) - curveForce(Math.max(0, s - h), c)) / (s + h - Math.max(0, s - h));
}

export class VehicleSim {
  readonly wheels: WheelState[] = [];
  readonly telemetry: VehicleTelemetry = {
    speed: 0, rpm: 0, gear: 1, throttle: 0, brake: 0, steer: 0, load: 0, shifting: false, wheelsOnGround: 0,
    lateralG: 0, longitudinalG: 0, verticalG: 0, yawRate: 0, absActive: false, tcsActive: false, escActive: false, electric: false, bumpImpulse: 0,
  };
  assists: Assists = { abs: true, tcs: true, esc: true, steeringAssist: 0.5, autoGearbox: true, arcade: false };
  /** Surface wetness 0..1 (rain). */
  wetness = 0;
  /** Extra mass carried (passengers/luggage), kg — affects only load estimates; the body mass itself is updated by the host. */
  rpm = 800;
  gear = 1;
  private shiftTimer = 0;
  private pendingGear = 1;
  private steerAngle = 0; // current steering (rad, + left)
  private reverseRequestTimer = 0;
  private lastVel: Vec3 = { x: 0, y: 0, z: 0 };
  private tmpHit: GroundHit = { distance: 0, nx: 0, ny: 1, nz: 0, surface: 0, collider: -1 };
  private pos: Vec3 = { x: 0, y: 0, z: 0 };
  private rot: Quat = { x: 0, y: 0, z: 0, w: 1 };
  private vel: Vec3 = { x: 0, y: 0, z: 0 };
  private ang: Vec3 = { x: 0, y: 0, z: 0 };
  private com: Vec3 = { x: 0, y: 0, z: 0 };
  // basis
  private rx = 1; private ry = 0; private rz = 0;
  private ux = 0; private uy = 1; private uz = 0;
  private fx = 0; private fy = 0; private fz = -1;
  private tcsCut = 1;
  private escTimer = 0;
  private absTimer = 0;
  private maxSteerCurrent = 0;

  constructor(public spec: CarSpec) {
    const s = spec;
    const sus = s.suspension;
    const hw = [s.trackFront / 2, s.trackFront / 2, s.trackRear / 2, s.trackRear / 2];
    const hz = s.wheelbase / 2;
    for (let i = 0; i < 4; i++) {
      const front = i < 2;
      const left = i % 2 === 0;
      const driven = s.drive === 'AWD' || (s.drive === 'RWD' ? !front : front);
      this.wheels.push({
        lx: left ? -hw[i] : hw[i], ly: s.wheel.radius + sus.staticLength, lz: front ? -hz : hz,
        front, left, driven,
        spring: front ? sus.springFront : sus.springRear,
        bump: front ? sus.bumpFront : sus.bumpRear,
        rebound: front ? sus.reboundFront : sus.reboundRear,
        contact: false, length: sus.staticLength, prevLength: sus.staticLength, compressionVel: 0, load: 0,
        omega: 0, spin: 0, steer: 0, slipRatio: 0, slipAngle: 0, fx: 0, fy: 0, slide: 0, surface: 0,
        brakeTorque: 0, driveTorque: 0, absPhase: 0, px: 0, py: 0, pz: 0, nx: 0, ny: 1, nz: 0, collider: -1,
      });
    }
    this.rpm = s.engine.idleRpm;
  }

  /** Static load per wheel (N), from the mass distribution. */
  private staticLoad(front: boolean, mass: number): number {
    const s = this.spec;
    const rearShare = 0.5 + s.comOffsetZ / s.wheelbase;
    return (mass * G * (front ? 1 - rearShare : rearShare)) / 2;
  }

  /** Free (unloaded) spring length so that the static length matches the spec at the given mass. */
  private freeLength(w: WheelState, mass: number): number {
    return this.spec.suspension.staticLength + this.staticLoad(w.front, mass) / w.spring;
  }

  engineTorqueAt(rpm: number): number {
    const c = this.spec.engine.torqueCurve;
    if (rpm <= c[0][0]) return c[0][1];
    for (let i = 1; i < c.length; i++) {
      if (rpm <= c[i][0]) {
        const t = (rpm - c[i - 1][0]) / (c[i][0] - c[i - 1][0]);
        return c[i - 1][1] + (c[i][1] - c[i - 1][1]) * t;
      }
    }
    return c[c.length - 1][1];
  }

  get gearRatio(): number {
    const r = this.spec.gearbox.ratios;
    if (this.gear === 0) return 0;
    if (this.gear < 0) return r[0];
    return r[Math.min(this.gear, r.length - 1)];
  }

  reset(): void {
    for (const w of this.wheels) {
      w.omega = 0; w.length = this.spec.suspension.staticLength; w.prevLength = w.length; w.compressionVel = 0;
    }
    this.gear = 1; this.pendingGear = 1; this.shiftTimer = 0; this.rpm = this.spec.engine.idleRpm; this.steerAngle = 0;
  }

  private rotateLocal(lx: number, ly: number, lz: number, out: Vec3): void {
    out.x = this.rx * lx + this.ux * ly - this.fx * lz;
    out.y = this.ry * lx + this.uy * ly - this.fy * lz;
    out.z = this.rz * lx + this.uz * ly - this.fz * lz;
  }

  private readonly tv: Vec3 = { x: 0, y: 0, z: 0 };

  step(dt: number, input: DriveInput, body: VehicleBodyAPI, world: VehicleWorldAPI): void {
    const s = this.spec;
    const sus = s.suspension;
    const arcade = this.assists.arcade;
    body.getPosition(this.pos);
    body.getRotation(this.rot);
    body.getLinVel(this.vel);
    body.getAngVel(this.ang);
    body.getWorldCom(this.com);
    const mass = body.mass();
    // basis from quaternion
    const { x: qx, y: qy, z: qz, w: qw } = this.rot;
    this.rx = 1 - 2 * (qy * qy + qz * qz); this.ry = 2 * (qx * qy + qz * qw); this.rz = 2 * (qx * qz - qy * qw);
    this.ux = 2 * (qx * qy - qz * qw); this.uy = 1 - 2 * (qx * qx + qz * qz); this.uz = 2 * (qy * qz + qx * qw);
    const bzx = 2 * (qx * qz + qy * qw), bzy = 2 * (qy * qz - qx * qw), bzz = 1 - 2 * (qx * qx + qy * qy);
    this.fx = -bzx; this.fy = -bzy; this.fz = -bzz;

    const vx = this.vel.x, vy = this.vel.y, vz = this.vel.z;
    const fwdSpeed = vx * this.fx + vy * this.fy + vz * this.fz;
    const latSpeed = vx * this.rx + vy * this.ry + vz * this.rz;
    const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
    const yawRate = this.ang.x * this.ux + this.ang.y * this.uy + this.ang.z * this.uz;

    // ------------------------------------------------------------------ gearbox logic
    let throttle = Math.max(0, Math.min(1, input.throttle));
    let brake = Math.max(0, Math.min(1, input.brake));
    const ge = s.gearbox;
    const nGears = ge.ratios.length - 1;
    if (this.assists.autoGearbox) {
      // Arcade-style reverse: hold brake when stopped -> reverse; throttle when in reverse -> forward.
      if (this.gear > 0 && brake > 0.3 && throttle < 0.05 && Math.abs(fwdSpeed) < 0.6) {
        this.reverseRequestTimer += dt;
        if (this.reverseRequestTimer > 0.2) { this.gear = -1; this.pendingGear = -1; this.reverseRequestTimer = 0; }
      } else if (this.gear < 0 && throttle > 0.3 && brake < 0.05 && fwdSpeed > -0.6) {
        this.reverseRequestTimer += dt;
        if (this.reverseRequestTimer > 0.15) { this.gear = 1; this.pendingGear = 1; this.reverseRequestTimer = 0; }
      } else this.reverseRequestTimer = 0;
      if (this.gear < 0) { const t = throttle; throttle = brake; brake = t; }
    } else {
      if (input.shiftUp && this.shiftTimer <= 0 && this.gear < nGears) { this.pendingGear = this.gear === -1 ? 0 : this.gear + 1; this.shiftTimer = this.gear <= 0 ? 0.1 : ge.shiftTime; }
      if (input.shiftDown && this.shiftTimer <= 0 && this.gear > -1) { this.pendingGear = this.gear - 1; this.shiftTimer = ge.shiftTime * 0.8; }
    }
    if (this.shiftTimer > 0) {
      this.shiftTimer -= dt;
      if (this.shiftTimer <= 0) this.gear = this.pendingGear;
    }
    const shifting = this.shiftTimer > 0;

    // ------------------------------------------------------------------ steering
    const vRef = Math.abs(fwdSpeed);
    const speedLimitFactor = 1 - 0.78 * smooth(4, arcade ? 38 : 45, vRef);
    const maxSteer = s.steering.maxAngle * RAD * speedLimitFactor;
    this.maxSteerCurrent = maxSteer;
    let target = input.steer * maxSteer;
    // steering assist: counter-steer towards the direction of travel when the rear slides
    if (this.assists.steeringAssist > 0 && vRef > 3) {
      const beta = Math.atan2(-latSpeed, Math.max(1, Math.abs(fwdSpeed))) * Math.sign(fwdSpeed || 1); // body slip angle (+ when sliding right->left)
      const assist = this.assists.steeringAssist * (arcade ? 1.0 : 0.6);
      target += Math.max(-0.35, Math.min(0.35, beta * assist * (1 - Math.abs(input.steer) * 0.5)));
    }
    if (input.digitalSteer) {
      const rate = (s.steering.rate * RAD) * (arcade ? 1.3 : 1) * (Math.abs(target) < Math.abs(this.steerAngle) || Math.sign(target) !== Math.sign(this.steerAngle) ? 1.6 : 1) * (1 - 0.5 * smooth(5, 40, vRef));
      const d = target - this.steerAngle;
      const m = rate * dt;
      this.steerAngle += Math.abs(d) < m ? d : Math.sign(d) * m;
    } else {
      this.steerAngle += (target - this.steerAngle) * Math.min(1, dt * 25);
    }
    const tanSteer = Math.tan(this.steerAngle);
    const ack = s.steering.ackermann;
    for (const w of this.wheels) {
      if (!w.front) { w.steer = 0; continue; }
      if (Math.abs(tanSteer) < 1e-4) { w.steer = this.steerAngle; continue; }
      // Ackermann: inner wheel steers more
      const R = s.wheelbase / tanSteer; // + = left turn centre on the left
      const inner = (this.steerAngle > 0) === w.left;
      const off = (s.trackFront / 2) * (inner ? -1 : 1) * Math.sign(R);
      const ideal = Math.atan(s.wheelbase / (R + off * 1));
      w.steer = this.steerAngle + (ideal - this.steerAngle) * ack;
    }

    // ------------------------------------------------------------------ suspension
    let wheelsOnGround = 0;
    const rayLen = sus.staticLength + sus.droop + s.wheel.radius;
    const hit = this.tmpHit;
    const tv = this.tv;
    let bumpImpulse = 0;
    for (const w of this.wheels) {
      this.rotateLocal(w.lx, w.ly, w.lz, tv);
      const ox = this.pos.x + tv.x, oy = this.pos.y + tv.y, oz = this.pos.z + tv.z;
      w.prevLength = w.length;
      if (world.castWheelRay(ox, oy, oz, -this.ux, -this.uy, -this.uz, rayLen, hit)) {
        w.contact = true;
        wheelsOnGround++;
        w.length = Math.max(0.0, hit.distance - s.wheel.radius);
        w.nx = hit.nx; w.ny = hit.ny; w.nz = hit.nz; w.surface = hit.surface; w.collider = hit.collider;
        w.px = ox - this.ux * hit.distance; w.py = oy - this.uy * hit.distance; w.pz = oz - this.uz * hit.distance;
      } else {
        w.contact = false;
        w.length = Math.min(sus.staticLength + sus.droop, w.length + dt * 2.5);
        w.load = 0;
      }
      w.compressionVel = (w.prevLength - w.length) / dt;
    }
    // spring/damper/arb forces
    for (let i = 0; i < 4; i++) {
      const w = this.wheels[i];
      if (!w.contact) continue;
      const other = this.wheels[i ^ 1];
      const L0 = this.freeLength(w, mass);
      let f = w.spring * (L0 - w.length);
      f += (w.compressionVel > 0 ? w.bump : w.rebound) * w.compressionVel;
      const minL = sus.staticLength - sus.bump;
      if (w.length < minL + 0.02) {
        // progressive rubber bump stop (never saturates, so the body cannot collapse onto the outer wheels)
        const pen = minL + 0.02 - w.length;
        f += w.spring * (pen * 6 + pen * pen * 400) + Math.max(0, w.compressionVel) * w.bump * 2;
        bumpImpulse = Math.max(bumpImpulse, Math.min(1, w.compressionVel * 0.4));
      }
      const arb = w.front ? sus.antiRollFront : sus.antiRollRear;
      const otherLen = other.contact ? other.length : sus.staticLength + sus.droop;
      f += arb * (otherLen - w.length);
      if (w.compressionVel > 1.2) bumpImpulse = Math.max(bumpImpulse, Math.min(1, (w.compressionVel - 1.2) * 0.35));
      w.load = Math.max(0, f);
    }

    // ------------------------------------------------------------------ powertrain
    const eng = s.engine;
    const ratio = this.gearRatio * ge.final;
    let drivenOmega = 0, nDriven = 0;
    for (const w of this.wheels) if (w.driven) { drivenOmega += w.omega; nDriven++; }
    drivenOmega /= Math.max(1, nDriven);
    const wheelRpm = (drivenOmega * ratio * 60) / (2 * Math.PI);
    // Torque cut: rev limiter, TCS, shifting
    let thr = throttle;
    if (this.rpm >= eng.maxRpm - 50) thr = 0;
    if (shifting) thr *= 0.0;
    thr *= this.tcsCut;
    let engineTorque = 0;
    let driveTorqueTotal = 0;
    let engineLoad = 0;
    const engaged = this.gear !== 0 && !shifting;
    // electric assist (hybrid): strong low-speed torque, silent engine
    const elec = eng.electric;
    const evMode = !!elec && vRef < elec.maxSpeed && throttle < 0.55 && this.gear >= 1;
    if (engaged) {
      const absWheelRpm = Math.abs(wheelRpm);
      // Torque converter / launch clutch: the engine can run faster than the wheels at low speed.
      const launchRpm = eng.idleRpm + thr * (eng.stallRpm - eng.idleRpm);
      const targetRpm = Math.max(absWheelRpm, Math.min(launchRpm, eng.maxRpm));
      // engine spin-up dynamics
      const k = absWheelRpm >= launchRpm ? 60 : 9;
      this.rpm += (targetRpm - this.rpm) * Math.min(1, dt * k);
      this.rpm = Math.max(eng.idleRpm * 0.9, Math.min(eng.maxRpm + 80, this.rpm));
      const slip = Math.max(0, Math.min(1, (this.rpm - absWheelRpm) / 1500));
      const tcMul = 1 + 0.9 * slip;
      const tq = this.engineTorqueAt(this.rpm) * thr;
      const ebrake = absWheelRpm > eng.idleRpm * 1.1 ? eng.engineBrake * (this.rpm / eng.maxRpm) * (1 - thr) : 0;
      engineTorque = tq - ebrake;
      engineLoad = engineTorque / Math.max(1, this.engineTorqueAt(this.rpm));
      driveTorqueTotal = engineTorque * ratio * ge.efficiency * (tq > 0 ? tcMul : 1);
      if (elec) {
        const eAssist = elec.torque * thr * (1 - Math.min(1, vRef / (elec.maxSpeed * 2.5))) * Math.sign(ratio);
        driveTorqueTotal += eAssist * Math.abs(ge.final) * 0.9;
      }
    } else {
      const free = eng.idleRpm + thr * (eng.maxRpm - eng.idleRpm) * 0.9;
      this.rpm += (free - this.rpm) * Math.min(1, dt * (thr > 0 ? 6 : 3));
      engineLoad = thr;
    }
    if (evMode && engaged) {
      // engine off-ish at low speed in EV mode: keep idle rpm for display but audio uses electric flag
      this.rpm = Math.max(eng.idleRpm, Math.min(this.rpm, eng.idleRpm + 600));
    }
    // automatic shifting
    if (this.assists.autoGearbox && this.gear >= 1 && !shifting) {
      const up = lerp(ge.upRpm[0], ge.upRpm[1], throttle);
      const down = lerp(ge.downRpm[0], ge.downRpm[1], throttle);
      const rpmFromWheels = Math.abs(wheelRpm);
      let slipping = false;
      for (const w of this.wheels) if (w.driven && w.slipRatio > 0.2) slipping = true;
      if (rpmFromWheels > up && this.gear < nGears && !slipping && fwdSpeed > 1) { this.pendingGear = this.gear + 1; this.shiftTimer = ge.shiftTime; }
      else if (this.gear > 1) {
        const lowerRpm = rpmFromWheels * (ge.ratios[this.gear - 1] / ge.ratios[this.gear]);
        if (rpmFromWheels < down && lowerRpm < up * 0.92) { this.pendingGear = this.gear - 1; this.shiftTimer = ge.shiftTime * 0.7; }
      }
    }
    // reflected engine inertia on the driven wheels
    const reflectedInertia = engaged ? (eng.inertia * ratio * ratio) / Math.max(1, nDriven) : 0;

    // differential torque split
    for (const w of this.wheels) w.driveTorque = 0;
    if (nDriven > 0) {
      const split = (front: boolean, total: number) => {
        const a = this.wheels[front ? 0 : 2], b = this.wheels[front ? 1 : 3];
        let ta = total / 2, tb = total / 2;
        if (s.diff.type === 'lsd') {
          const lockT = s.diff.lock * Math.abs(total) + 120;
          const d = (a.omega - b.omega) * 40;
          const bias = Math.max(-lockT, Math.min(lockT, d));
          ta -= bias / 2; tb += bias / 2;
        }
        a.driveTorque = ta; b.driveTorque = tb;
      };
      if (s.drive === 'RWD') split(false, driveTorqueTotal);
      else if (s.drive === 'FWD') split(true, driveTorqueTotal);
      else { const f = s.diff.awdFrontSplit ?? 0.4; split(true, driveTorqueTotal * f); split(false, driveTorqueTotal * (1 - f)); }
    }

    // ------------------------------------------------------------------ brakes
    const br = s.brakes;
    let absActive = false;
    this.absTimer += dt;
    for (const w of this.wheels) {
      const bias = w.front ? br.frontBias : 1 - br.frontBias;
      let t = brake * br.maxTorque * bias / 2;
      if (!w.front && input.handbrake > 0) t = Math.max(t, input.handbrake * br.handbrakeTorque);
      // ABS: release when the wheel is locking up (not on handbrake wheels while handbraking)
      if (this.assists.abs && t > 0 && vRef > 2 && !(input.handbrake > 0 && !w.front)) {
        if (w.slipRatio < -0.16) { t *= 0.25; absActive = true; }
        else if (w.slipRatio < -0.11) { t *= 0.7; absActive = true; }
      }
      w.brakeTorque = t;
    }

    // ------------------------------------------------------------------ tyres
    const tires = s.tires;
    const wetMu = 1 - 0.28 * this.wetness;
    const gripMul = arcade ? 1.12 : 1.0;
    let tcsActive = false;
    let maxDriveSlip = 0;
    const R = s.wheel.radius;
    const nominalLoad = (mass * G) / 4;
    const cp: Vec3 = this.tv;
    for (let i = 0; i < 4; i++) {
      const w = this.wheels[i];
      const I = s.wheel.inertia + (w.driven ? reflectedInertia : 0);
      if (!w.contact || w.load <= 0) {
        // free spinning wheel
        w.omega += ((w.driveTorque - Math.sign(w.omega) * w.brakeTorque) / I) * dt;
        if (w.brakeTorque > 0 && Math.abs(w.omega) < (w.brakeTorque / I) * dt) w.omega = 0;
        w.omega *= 1 - dt * 0.2;
        w.fx = 0; w.fy = 0; w.slide = 0; w.slipRatio = 0; w.slipAngle = 0;
        w.spin += w.omega * dt;
        continue;
      }
      // contact point velocity
      const rxp = w.px - this.com.x, ryp = w.py - this.com.y, rzp = w.pz - this.com.z;
      const cvx = vx + (this.ang.y * rzp - this.ang.z * ryp);
      const cvy = vy + (this.ang.z * rxp - this.ang.x * rzp);
      const cvz = vz + (this.ang.x * ryp - this.ang.y * rxp);
      // wheel axes on the contact plane
      const cs = Math.cos(w.steer), sn = Math.sin(w.steer);
      // steer rotates the forward vector towards -right (left)
      let wfx = this.fx * cs - this.rx * sn, wfy = this.fy * cs - this.ry * sn, wfz = this.fz * cs - this.rz * sn;
      let d = wfx * w.nx + wfy * w.ny + wfz * w.nz;
      wfx -= w.nx * d; wfy -= w.ny * d; wfz -= w.nz * d;
      let l = Math.hypot(wfx, wfy, wfz) || 1; wfx /= l; wfy /= l; wfz /= l;
      // lateral = forward x normal  (right-handed: right = fwd x up)
      let wrx = wfy * w.nz - wfz * w.ny, wry = wfz * w.nx - wfx * w.nz, wrz = wfx * w.ny - wfy * w.nx;
      l = Math.hypot(wrx, wry, wrz) || 1; wrx /= l; wry /= l; wrz /= l;
      const vLong = cvx * wfx + cvy * wfy + cvz * wfz;
      const vLat = cvx * wrx + cvy * wry + cvz * wrz;

      const mu = SURFACE_MU[w.surface] * wetMu * gripMul * (1 - tires.loadSensitivity * (w.load / nominalLoad - 1));
      const Fz = Math.min(w.load, nominalLoad * 3.5);
      const Fmax = mu * Fz;
      const lc = tires.longitudinal, lat = tires.lateral;
      const vDen = Math.max(Math.abs(vLong), 2.5);

      // ---- longitudinal: semi-implicit wheel spin integration
      let omega = w.omega;
      for (let sub = 0; sub < 4; sub++) {
        const h = dt / 4;
        const kappa = (omega * R - vLong) / vDen;
        const alpha = Math.atan2(vLat, vDen);
        const sx = kappa / lc.peakSlip, sy = alpha / lat.peakSlip;
        const sMag = Math.hypot(sx, sy);
        const F = sMag > 1e-6 ? curveForce(sMag, lc) : 0;
        const fxN = sMag > 1e-6 ? (F * sx) / sMag : 0;
        const fx0 = fxN * Fmax * lc.peak;
        // d(fx)/d(omega): slope of the curve along x (approx) * Fmax * peak * R / vDen / peakSlip
        const slope = Math.max(0.05, sMag > 1e-6 ? curveSlope(sMag, lc) : curveSlope(0, lc));
        const k = (slope * Fmax * lc.peak * R) / (vDen * lc.peakSlip);
        // implicit solve without brakes
        const rr = tires.rollingResistance * Fz * SURFACE_DRAG[w.surface] * R * Math.sign(omega);
        let omegaNew = (I * omega + h * (w.driveTorque - rr - R * (fx0 - k * omega))) / (I + h * R * k);
        // brakes: friction torque towards zero, can lock
        if (w.brakeTorque > 0) {
          const dOmega = (w.brakeTorque / (I + h * R * k)) * h;
          if (Math.abs(omegaNew) <= dOmega) omegaNew = 0;
          else omegaNew -= Math.sign(omegaNew) * dOmega;
        }
        omega = omegaNew;
      }
      w.omega = omega;
      // final forces with the converged omega
      const kappa = (omega * R - vLong) / vDen;
      let alpha = Math.atan2(vLat, vDen);
      w.slipRatio = (omega * R - vLong) / Math.max(Math.abs(vLong), 0.5);
      w.slipAngle = alpha;
      if (w.driven && w.slipRatio > maxDriveSlip) maxDriveSlip = w.slipRatio;
      let sx = kappa / lc.peakSlip, sy = alpha / lat.peakSlip;
      // handbrake / arcade drift: rear lateral grip reduction while handbraking
      let latGrip = lat.peak;
      if (!w.front && input.handbrake > 0.1) latGrip *= arcade ? 0.62 : 0.78;
      const sMag = Math.hypot(sx, sy);
      let fxF = 0, fyF = 0;
      if (sMag > 1e-6) {
        const F = curveForce(sMag, sMag > 1 ? lat : lc);
        fxF = ((F * sx) / sMag) * Fmax * lc.peak;
        fyF = -((F * sy) / sMag) * Fmax * latGrip;
      }
      // low speed: lateral damping instead of slip-angle model (prevents jitter when nearly stopped)
      const lowBlend = smooth(0.4, 3.0, Math.hypot(vLong, vLat));
      if (lowBlend < 1) {
        const share = (mass / 4) / dt * 0.5;
        const fyLow = Math.max(-Fmax, Math.min(Fmax, -vLat * share));
        fyF = fyF * lowBlend + fyLow * (1 - lowBlend);
        // static hold when braking or wheel locked at standstill
        if (w.brakeTorque > 0 && Math.abs(omega) < 0.5) {
          const fxLow = Math.max(-Fmax, Math.min(Fmax, -vLong * share));
          fxF = fxF * lowBlend + fxLow * (1 - lowBlend);
        }
      }
      w.fx = fxF; w.fy = fyF;
      w.slide = Math.max(0, sMag - 0.75) * (Math.abs(vLong) + Math.abs(vLat) > 1.5 ? 1 : 0);
      // apply forces at the contact point: suspension along body up, tyre forces in the contact plane
      const fsx = this.ux * w.load, fsy = this.uy * w.load, fsz = this.uz * w.load;
      const Fx = fsx + wfx * fxF + wrx * fyF;
      const Fy = fsy + wfy * fxF + wry * fyF;
      const Fz2 = fsz + wfz * fxF + wrz * fyF;
      // tyre forces applied slightly above ground (reduces jacking/roll exaggeration), suspension at contact
      cp.x = w.px + this.ux * 0.05; cp.y = w.py + this.uy * 0.05; cp.z = w.pz + this.uz * 0.05;
      body.applyImpulseAtPoint(Fx * dt, Fy * dt, Fz2 * dt, cp.x, cp.y, cp.z);
      w.spin += w.omega * dt;
      alpha = 0;
    }

    // TCS: progressive throttle cut when driven wheels spin
    if (this.assists.tcs && maxDriveSlip > 0.14 && vRef < 60) { this.tcsCut = Math.max(0.15, this.tcsCut - dt * 6); tcsActive = true; }
    else this.tcsCut = Math.min(1, this.tcsCut + dt * 3);

    // ------------------------------------------------------------------ ESC / arcade yaw assist
    let escActive = false;
    if (wheelsOnGround >= 3 && vRef > 4) {
      const desired = (fwdSpeed * Math.tan(this.steerAngle)) / s.wheelbase;
      const muLimit = (SURFACE_MU[0] * wetMu * 9.81 * 1.05) / Math.max(4, vRef);
      const clampedDesired = Math.max(-muLimit, Math.min(muLimit, desired));
      const err = yawRate - clampedDesired;
      const allowDrift = input.handbrake > 0.1 || (arcade && throttle > 0.8);
      const escGain = this.assists.esc ? (arcade ? 0.9 : 0.55) : arcade ? 0.35 : 0;
      if (escGain > 0 && Math.abs(err) > 0.12 && !allowDrift) {
        const inertiaYaw = s.inertia[1];
        const corr = -Math.sign(err) * Math.min(Math.abs(err) - 0.12, 1.2) * inertiaYaw * escGain * 4;
        body.applyTorqueImpulse(this.ux * corr * dt, this.uy * corr * dt, this.uz * corr * dt);
        escActive = this.assists.esc;
        this.escTimer = 0.25;
      }
    }
    if (this.escTimer > 0) { this.escTimer -= dt; escActive = this.assists.esc; }

    // ------------------------------------------------------------------ aero & air control
    const aero = s.aero;
    const q = 0.5 * 1.225 * speed;
    const drag = q * aero.cd * aero.frontalArea;
    body.applyImpulseAtPoint(-vx * drag * dt, -vy * drag * dt, -vz * drag * dt, this.com.x, this.com.y, this.com.z);
    const down = 0.5 * 1.225 * aero.cl * aero.frontalArea * fwdSpeed * fwdSpeed;
    if (down > 0) body.applyImpulseAtPoint(-this.ux * down * dt, -this.uy * down * dt, -this.uz * down * dt, this.com.x, this.com.y, this.com.z);
    if (wheelsOnGround === 0) {
      // stabilise in the air (prevents tumbling from small ramps, more in arcade)
      const k = (arcade ? 2.2 : 0.6) * dt;
      body.applyTorqueImpulse(-this.ang.x * s.inertia[0] * k, -this.ang.y * s.inertia[1] * k * 0.3, -this.ang.z * s.inertia[2] * k);
    }

    // ------------------------------------------------------------------ telemetry
    const t = this.telemetry;
    const ax = (vx - this.lastVel.x) / dt, ay = (vy - this.lastVel.y) / dt, az = (vz - this.lastVel.z) / dt;
    this.lastVel.x = vx; this.lastVel.y = vy; this.lastVel.z = vz;
    const lg = (ax * this.rx + ay * this.ry + az * this.rz) / G;
    const fg = (ax * this.fx + ay * this.fy + az * this.fz) / G;
    const vg = (ax * this.ux + ay * this.uy + az * this.uz) / G;
    t.lateralG += (lg - t.lateralG) * Math.min(1, dt * 8);
    t.longitudinalG += (fg - t.longitudinalG) * Math.min(1, dt * 8);
    t.verticalG += (vg - t.verticalG) * Math.min(1, dt * 8);
    t.speed = fwdSpeed;
    t.rpm = this.rpm;
    t.gear = this.gear;
    t.throttle = throttle; t.brake = brake; t.steer = this.steerAngle / Math.max(1e-3, s.steering.maxAngle * RAD);
    t.load = Math.max(-1, Math.min(1, engineLoad));
    t.shifting = shifting;
    t.wheelsOnGround = wheelsOnGround;
    t.yawRate = yawRate;
    t.absActive = absActive; t.tcsActive = tcsActive; t.escActive = escActive;
    t.electric = evMode;
    t.bumpImpulse = bumpImpulse;
  }

  get steeringAngle(): number { return this.steerAngle; }
  get maxSteer(): number { return this.maxSteerCurrent; }
}

function smooth(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
