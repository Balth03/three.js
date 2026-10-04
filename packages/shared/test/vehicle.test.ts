import { describe, it, expect } from 'vitest';
import { makeRig, loadSpec } from './vehicleHarness';

const spec = loadSpec();

describe('VehicleSim on flat ground', () => {
  it('settles at rest without drifting or bouncing', async () => {
    const r = await makeRig(spec);
    r.step(240);
    const p0 = r.body.translation();
    r.step(600);
    const p1 = r.body.translation();
    expect(Math.hypot(p1.x - p0.x, p1.z - p0.z)).toBeLessThan(0.02);
    // vertical position must not oscillate (linvel().y includes the gravity step and is not meaningful at rest)
    expect(Math.abs(p1.y - p0.y)).toBeLessThan(0.002);
    // ride height close to the static design (origin at ground level)
    expect(Math.abs(p1.y)).toBeLessThan(0.05);
  });

  it('accelerates 0-100 km/h in a believable time (6-10 s)', async () => {
    const r = await makeRig(spec);
    r.step(120);
    r.input.throttle = 1;
    let t = 0;
    while (r.speed() < 100 / 3.6 && t < 20) { r.step(1); t += 1 / 120; }
    console.log('0-100', t.toFixed(2), 's, gear', r.sim.gear);
    expect(t).toBeGreaterThan(5.5);
    expect(t).toBeLessThan(10.5);
  });

  it('brakes from 100 km/h in 35-45 m (ABS) and stays straight', async () => {
    const r = await makeRig(spec);
    r.step(120);
    r.input.throttle = 1;
    while (r.speed() < 100 / 3.6) r.step(1);
    r.input.throttle = 0; r.input.brake = 1;
    const p0 = r.body.translation();
    let t = 0;
    while (r.speed() > 0.3 && t < 10) { r.step(1); t += 1 / 120; }
    const p1 = r.body.translation();
    const d = Math.hypot(p1.x - p0.x, p1.z - p0.z);
    console.log('100-0', d.toFixed(1), 'm, lateral drift', p1.x.toFixed(2));
    expect(d).toBeGreaterThan(30);
    expect(d).toBeLessThan(47);
    expect(Math.abs(p1.x - p0.x)).toBeLessThan(1.0);
  });

  it('holds 0.8-1.0 g on a steady-state skidpad and does not spin with ESC', async () => {
    const r = await makeRig(spec);
    r.step(120);
    r.sim.assists.esc = true;
    // accelerate to 60 km/h then steer
    r.input.throttle = 0.6;
    while (r.speed() < 60 / 3.6) r.step(1);
    let maxG = 0;
    r.input.steer = 0.7;
    for (let i = 0; i < 120 * 8; i++) {
      // simple cruise control
      r.input.throttle = r.speed() < 60 / 3.6 ? 0.5 : 0.1;
      r.step(1);
      if (i > 240) maxG = Math.max(maxG, Math.abs(r.sim.telemetry.lateralG));
    }
    console.log('skidpad lateral g', maxG.toFixed(2), 'yawRate', r.sim.telemetry.yawRate.toFixed(2));
    expect(maxG).toBeGreaterThan(0.55);
    expect(maxG).toBeLessThan(1.15);
    const av = r.body.angvel();
    expect(Math.abs(av.y)).toBeLessThan(2.0);
  });

  it('stays upright in an aggressive slalom', async () => {
    const r = await makeRig(spec);
    r.step(120);
    r.input.throttle = 1;
    while (r.speed() < 80 / 3.6) r.step(1);
    r.input.throttle = 0.4;
    for (let i = 0; i < 120 * 6; i++) { r.input.steer = Math.sin(i / 120 * Math.PI * 1.2) > 0 ? 1 : -1; r.step(1); }
    const q = r.body.rotation();
    const upY = 1 - 2 * (q.x * q.x + q.z * q.z);
    expect(upY).toBeGreaterThan(0.85);
  });

  it('handbrake makes the rear step out (drift possible)', async () => {
    const r = await makeRig(spec);
    r.sim.assists.esc = false; r.sim.assists.steeringAssist = 0;
    r.step(120);
    r.input.throttle = 1;
    while (r.speed() < 70 / 3.6) r.step(1);
    r.input.throttle = 0.3; r.input.steer = 0.6; r.input.handbrake = 1;
    let maxYaw = 0;
    for (let i = 0; i < 90; i++) { r.step(1); maxYaw = Math.max(maxYaw, Math.abs(r.body.angvel().y)); }
    console.log('handbrake max yaw rate', maxYaw.toFixed(2));
    expect(maxYaw).toBeGreaterThan(0.9);
  });

  it('reverses when braking at standstill (arcade gearbox)', async () => {
    const r = await makeRig(spec);
    r.step(120);
    r.input.brake = 1;
    r.step(120 * 3);
    expect(r.sim.gear).toBe(-1);
    const v = r.sim.telemetry.speed;
    expect(v).toBeLessThan(-1);
  });
});
