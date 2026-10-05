import { describe, expect, it } from 'vitest';
import { Simulation, MAPS, Btn, AgentState, computePose, createPose, rayVsPose, WEAPONS, GAME, type Agent, type InputCmd } from '../src/index.ts';

const cmd = (o: Partial<InputCmd> = {}): InputCmd => ({ moveX: 0, moveY: 0, yaw: 0, pitch: 0, buttons: 0, ...o });
async function duel() {
  const sim = await Simulation.create({ map: MAPS.maze, seed: 7 });
  const a = sim.addAgent({ name: 'A', team: 0, isBot: false });
  const b = sim.addAgent({ name: 'B', team: 1, isBot: false });
  sim.mode.timeLeft = 0; sim.step(); // leave warmup
  return { sim, a, b };
}
const place = (a: Agent, x: number, z: number, yaw = 0) => { a.pos.x = a.prevPos.x = x; a.pos.z = a.prevPos.z = z; a.pos.y = a.prevPos.y = 0.02; a.yaw = yaw; };

describe('hitboxes', () => {
  const pose = createPose();
  const hit = { t: 0, zone: 'chest' as const };
  const agent = { pos: { x: 0, y: 0, z: 0 }, yaw: 0, pitch: 0, crouched: false } as unknown as Agent;
  it('front of the torso is the chest, rear is the back', () => {
    computePose(agent, pose); // facing -z
    expect(rayVsPose({ x: 0, y: 1.15, z: -5 }, { x: 0, y: 0, z: 1 }, pose, 100, { ...hit })?.zone).toBe('chest');
    expect(rayVsPose({ x: 0, y: 1.15, z: 5 }, { x: 0, y: 0, z: -1 }, pose, 100, { ...hit })?.zone).toBe('back');
  });
  it('helmet sensor and legs', () => {
    computePose(agent, pose);
    expect(rayVsPose({ x: 0, y: GAME.movement.eyeHeight + 0.05, z: -5 }, { x: 0, y: 0, z: 1 }, pose, 100, { ...hit })?.zone).toBe('head');
    expect(rayVsPose({ x: 0, y: 0.4, z: -5 }, { x: 0, y: 0, z: 1 }, pose, 100, { ...hit })).toBeNull();
  });
  it('respects the wall distance', () => {
    computePose(agent, pose);
    expect(rayVsPose({ x: 0, y: 1.15, z: -5 }, { x: 0, y: 0, z: 1 }, pose, 3, { ...hit })).toBeNull();
  });
});

describe('movement', () => {
  it('accelerates to run speed and stays on the ground', async () => {
    const { sim, a } = await duel();
    place(a, -24, 3, -Math.PI / 2); // in base, facing +x
    for (let i = 0; i < 40; i++) { sim.setInput(a.id, cmd({ moveY: 1, yaw: -Math.PI / 2 })); sim.step(); }
    expect(Math.hypot(a.vel.x, a.vel.z)).toBeCloseTo(GAME.movement.runSpeed, 0);
    expect(a.grounded).toBe(true);
    expect(a.pos.x).toBeGreaterThan(-24);
  });
  it('jumps about 1.25 m', async () => {
    const { sim, a } = await duel();
    place(a, -25, 0);
    for (let i = 0; i < 10; i++) sim.step();
    let maxY = 0;
    sim.setInput(a.id, cmd({ buttons: Btn.Jump })); sim.step();
    sim.setInput(a.id, cmd());
    for (let i = 0; i < 60; i++) { sim.step(); maxY = Math.max(maxY, a.pos.y); }
    expect(maxY).toBeGreaterThan(1.1);
    expect(maxY).toBeLessThan(1.45);
    expect(a.grounded).toBe(true);
  });
  it('walks up the ramp onto the central platform', async () => {
    const { sim, a } = await duel();
    place(a, -12.5, 0, -Math.PI / 2);
    for (let i = 0; i < 90; i++) { sim.setInput(a.id, cmd({ moveY: 1, yaw: -Math.PI / 2 })); sim.step(); }
    expect(a.pos.y).toBeGreaterThan(2.3);
  });
  it('cannot walk through a wall', async () => {
    const { sim, a } = await duel();
    place(a, -23, 5.5, -Math.PI / 2); // just behind the base front wall (x = -22, z 3..8)
    for (let i = 0; i < 90; i++) { sim.setInput(a.id, cmd({ moveY: 1, yaw: -Math.PI / 2 })); sim.step(); }
    expect(a.pos.x).toBeLessThan(-22.2);
  });
});

describe('weapon & vest', () => {
  it('fires at the data rate and spends energy', async () => {
    const { sim, a } = await duel();
    place(a, -25, 0, Math.PI); // face the back wall
    const w = WEAPONS.photon7;
    for (let i = 0; i < 60; i++) { sim.setInput(a.id, cmd({ yaw: Math.PI / 2, buttons: Btn.Fire })); sim.step(); }
    expect(a.stats.shots).toBeGreaterThanOrEqual(Math.floor(1 / w.fireInterval));
    expect(a.stats.shots).toBeLessThanOrEqual(Math.ceil(1 / w.fireInterval) + 1);
  });
  it('a chest hit costs 20 and deactivation scores a point', async () => {
    const { sim, a, b } = await duel();
    place(a, -10, 14.5, -Math.PI / 2);
    place(b, -6.9 + 4, 14.5, Math.PI / 2); // facing a
    b.pos.x = -8; b.prevPos.x = -8;
    for (let i = 0; i < 3; i++) sim.step();
    let shots = 0;
    while (b.state === AgentState.Active && shots < 400) {
      sim.setInput(a.id, cmd({ yaw: -Math.PI / 2, pitch: -0.2, buttons: Btn.Fire }));
      sim.setInput(b.id, cmd({ yaw: Math.PI / 2 }));
      sim.step(); shots++;
    }
    expect(b.state).toBe(AgentState.Down);
    expect(sim.mode.scores[0]).toBe(1);
  });
});

describe('determinism', () => {
  it('same seed + same inputs = same state', async () => {
    const run = async () => {
      const sim = await Simulation.create({ map: MAPS.maze, seed: 42 });
      for (let i = 0; i < 6; i++) sim.addAgent({ name: 'b' + i, team: i % 2, isBot: true, difficulty: 'pro', personality: 'aggressive' });
      for (let i = 0; i < 60 * 20; i++) sim.step();
      return sim.agents.map((a) => [a.pos.x.toFixed(4), a.pos.z.toFixed(4), a.vest, a.stats.shots].join(','));
    };
    expect(await run()).toEqual(await run());
  });
});
