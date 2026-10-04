import type { Quat, Vec3, VehicleBodyAPI } from './types';

/** Structural subset of a Rapier RigidBody used by the vehicle (avoids a hard dependency on rapier in shared code). */
export interface RapierBodyLike {
  translation(): Vec3;
  rotation(): Quat;
  linvel(): Vec3;
  angvel(): Vec3;
  worldCom(): Vec3;
  mass(): number;
  applyImpulseAtPoint(impulse: Vec3, point: Vec3, wakeUp: boolean): void;
  applyTorqueImpulse(torque: Vec3, wakeUp: boolean): void;
}

export class RapierVehicleBody implements VehicleBodyAPI {
  private imp: Vec3 = { x: 0, y: 0, z: 0 };
  private pt: Vec3 = { x: 0, y: 0, z: 0 };
  constructor(public body: RapierBodyLike) {}
  getPosition(out: Vec3): void { const t = this.body.translation(); out.x = t.x; out.y = t.y; out.z = t.z; }
  getRotation(out: Quat): void { const r = this.body.rotation(); out.x = r.x; out.y = r.y; out.z = r.z; out.w = r.w; }
  getLinVel(out: Vec3): void { const v = this.body.linvel(); out.x = v.x; out.y = v.y; out.z = v.z; }
  getAngVel(out: Vec3): void { const v = this.body.angvel(); out.x = v.x; out.y = v.y; out.z = v.z; }
  getWorldCom(out: Vec3): void { const c = this.body.worldCom(); out.x = c.x; out.y = c.y; out.z = c.z; }
  applyImpulseAtPoint(ix: number, iy: number, iz: number, px: number, py: number, pz: number): void {
    this.imp.x = ix; this.imp.y = iy; this.imp.z = iz; this.pt.x = px; this.pt.y = py; this.pt.z = pz;
    this.body.applyImpulseAtPoint(this.imp, this.pt, true);
  }
  applyTorqueImpulse(tx: number, ty: number, tz: number): void { this.imp.x = tx; this.imp.y = ty; this.imp.z = tz; this.body.applyTorqueImpulse(this.imp, true); }
  mass(): number { return this.body.mass(); }
}
