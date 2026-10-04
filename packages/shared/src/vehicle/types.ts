/** Vehicle specification — loaded from data/cars/<id>.json. All SI units (kg, m, N, Nm, s) unless noted. */
export interface TireCurve {
  /** Peak slip (ratio for longitudinal, radians for lateral). */
  peakSlip: number;
  /** Shape factor C of the magic formula (1.2..1.9). Higher = sharper drop after the peak. */
  shape: number;
  /** Curvature E (-2..1). */
  curvature: number;
  /** Grip multiplier D (peak mu relative to surface mu). */
  peak: number;
}
export interface CarSpec {
  id: string;
  name: string;
  brand: string;
  mass: number;
  /** Principal inertia [roll (about Z, the long axis), yaw (Y), pitch (X)] kg·m² */
  inertia: [number, number, number];
  comHeight: number;
  /** CoM longitudinal offset from the wheelbase centre, +ve = towards the rear (local +Z). */
  comOffsetZ: number;
  dimensions: { length: number; width: number; height: number };
  wheelbase: number;
  trackFront: number;
  trackRear: number;
  wheel: { radius: number; width: number; inertia: number };
  suspension: {
    staticLength: number; // hardpoint->wheel centre at static load
    droop: number; // extra extension available from static
    bump: number; // compression available from static
    springFront: number; springRear: number; // N/m
    bumpFront: number; reboundFront: number; bumpRear: number; reboundRear: number; // N·s/m
    antiRollFront: number; antiRollRear: number; // N/m
  };
  steering: { maxAngle: number /* deg */; ackermann: number; rate: number /* deg/s at the wheels for keyboard */ };
  tires: { longitudinal: TireCurve; lateral: TireCurve; loadSensitivity: number; rollingResistance: number; relaxation: number };
  engine: {
    idleRpm: number; maxRpm: number; stallRpm: number;
    torqueCurve: Array<[number, number]>;
    inertia: number;
    engineBrake: number;
    electric?: { torque: number; maxSpeed: number };
    cylinders: number;
  };
  gearbox: { ratios: number[] /* [reverse, 1st, 2nd ...] reverse negative */; final: number; shiftTime: number; efficiency: number; upRpm: [number, number]; downRpm: [number, number] };
  drive: 'RWD' | 'FWD' | 'AWD';
  diff: { type: 'open' | 'lsd'; lock: number; awdFrontSplit?: number };
  brakes: { maxTorque: number; frontBias: number; handbrakeTorque: number };
  aero: { cd: number; frontalArea: number; cl: number };
  fuel?: { type: 'petrol' | 'diesel' | 'hybrid' | 'electric'; capacity: number; consumption: number };
  capacity?: { passengers: number; luggage: number };
}

export interface DriveInput {
  throttle: number; // 0..1
  brake: number; // 0..1
  steer: number; // -1..1 (+ = left)
  handbrake: number; // 0..1
  shiftUp: boolean;
  shiftDown: boolean;
  /** Steering comes from a digital source (keyboard): apply rate limiting and auto-centering. */
  digitalSteer: boolean;
}

export interface Assists {
  abs: boolean;
  tcs: boolean;
  esc: boolean;
  steeringAssist: number; // 0..1 counter-steer help
  autoGearbox: boolean;
  arcade: boolean;
}

export interface Vec3 { x: number; y: number; z: number }
export interface Quat { x: number; y: number; z: number; w: number }

export interface GroundHit { distance: number; nx: number; ny: number; nz: number; surface: number; collider: number }

/** Abstraction over the physics engine so the simulation can run on the client (Rapier WASM) and the server alike. */
export interface VehicleBodyAPI {
  getPosition(out: Vec3): void;
  getRotation(out: Quat): void;
  getLinVel(out: Vec3): void;
  getAngVel(out: Vec3): void;
  getWorldCom(out: Vec3): void;
  applyImpulseAtPoint(ix: number, iy: number, iz: number, px: number, py: number, pz: number): void;
  applyTorqueImpulse(tx: number, ty: number, tz: number): void;
  mass(): number;
}
export interface VehicleWorldAPI {
  castWheelRay(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxDist: number, out: GroundHit): boolean;
}

/** Surface ids (world materials). */
export const enum Surface { Asphalt = 0, Cobbles = 1, Gravel = 2, Grass = 3, Kerb = 4, Water = 5 }
export const SURFACE_MU: Record<number, number> = { 0: 1.0, 1: 0.86, 2: 0.62, 3: 0.55, 4: 0.95, 5: 0.3 };
/** Rolling drag multipliers per surface */
export const SURFACE_DRAG: Record<number, number> = { 0: 1, 1: 1.6, 2: 3.5, 3: 5, 4: 1.2, 5: 20 };
