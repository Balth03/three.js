import * as THREE from 'three';
import { AgentState, type Simulation } from '@neon/shared';

type Shot =
  | { kind: 'orbit'; radius: number; height: number; speed: number; phase: number; target: THREE.Vector3 }
  | { kind: 'dolly'; from: THREE.Vector3; to: THREE.Vector3; look: THREE.Vector3 }
  | { kind: 'follow'; agent: number; side: number };

/** Attract-mode camera for the title screen: alternates sweeping arena shots and over-the-shoulder follows. */
export class Cinematic {
  private shot: Shot | null = null;
  private t = 0;
  private dur = 8;
  private readonly pos = new THREE.Vector3(0, 6, 18);
  private readonly look = new THREE.Vector3();
  private readonly tmp = new THREE.Vector3();
  private idx = 0;

  constructor(private readonly sim: Simulation) {}

  private next() {
    const sim = this.sim;
    this.t = 0;
    this.idx++;
    const r = this.idx % 4;
    if (r === 1 || r === 3) {
      const actives = sim.agents.filter((a) => a.state === AgentState.Active);
      const a = actives[Math.floor(Math.random() * actives.length)];
      if (a) { this.shot = { kind: 'follow', agent: a.id, side: Math.random() < 0.5 ? -1 : 1 }; this.dur = 7; return; }
    }
    if (r === 2) {
      const z = (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 5);
      this.shot = {
        kind: 'dolly',
        from: new THREE.Vector3(-22, 1.2 + Math.random() * 1.5, z),
        to: new THREE.Vector3(22, 1.4 + Math.random() * 2, z * 0.7),
        look: new THREE.Vector3(0, 1.5, z * 0.4),
      };
      this.dur = 9;
      return;
    }
    this.shot = { kind: 'orbit', radius: 13 + Math.random() * 8, height: 3.2 + Math.random() * 3, speed: (Math.random() < 0.5 ? -1 : 1) * 0.09, phase: Math.random() * Math.PI * 2, target: new THREE.Vector3(0, 1.8, 0) };
    this.dur = 9;
  }

  update(dt: number, cam: THREE.PerspectiveCamera, renderPos: (id: number, out: THREE.Vector3) => THREE.Vector3): void {
    this.t += dt;
    if (!this.shot || this.t > this.dur) this.next();
    const s = this.shot!;
    const k = this.t / this.dur;
    if (s.kind === 'orbit') {
      const a = s.phase + this.t * s.speed;
      this.pos.set(Math.cos(a) * s.radius * 1.35, s.height + Math.sin(this.t * 0.3) * 0.6, Math.sin(a) * s.radius);
      this.look.copy(s.target);
    } else if (s.kind === 'dolly') {
      const e = k * k * (3 - 2 * k);
      this.pos.lerpVectors(s.from, s.to, e);
      this.look.copy(s.look);
    } else {
      const a = this.sim.agents[s.agent];
      if (!a || (a.state !== AgentState.Active && this.t > 1.5)) { this.next(); return this.update(0, cam, renderPos); }
      const p = renderPos(a.id, this.tmp);
      const fx = -Math.sin(a.yaw), fz = -Math.cos(a.yaw);
      const rx = Math.cos(a.yaw), rz = -Math.sin(a.yaw);
      const want = new THREE.Vector3(p.x - fx * 2.6 + rx * 0.9 * s.side, p.y + 2.0, p.z - fz * 2.6 + rz * 0.9 * s.side);
      // keep the camera out of walls
      const eye = new THREE.Vector3(p.x, p.y + 1.7, p.z);
      const dir = want.clone().sub(eye);
      const len = dir.length();
      dir.divideScalar(len);
      const d = this.sim.rayDistance(eye, dir, len);
      want.copy(eye).addScaledVector(dir, Math.max(0.4, d - 0.3));
      this.pos.lerp(want, this.t < 0.05 ? 1 : Math.min(1, dt * 6));
      this.look.set(p.x + fx * 6, p.y + 1.3 + Math.sin(a.pitch) * 6, p.z + fz * 6);
    }
    cam.position.copy(this.pos);
    cam.lookAt(this.look);
  }
}
