/**
 * Measures how long each bot difficulty needs to switch off a human-like target at 14 m:
 * standing still, and strafing (A/D every 0.5-0.9 s). Use it to tune data/bots/roster.json.
 *   npx tsx tools/sim/bot-aim.ts
 */
import { Simulation, MAPS, AgentState, Btn, type Difficulty } from '../../packages/shared/src/index.ts';

const diffs: Difficulty[] = ['recruit', 'pro', 'elite', 'legend'];
async function trial(diff: Difficulty, strafe: boolean, seed: number) {
  const sim = await Simulation.create({ map: MAPS.maze, seed });
  const bot = sim.addAgent({ name: 'bot', team: 1, isBot: true, difficulty: diff, personality: 'camper' });
  const me = sim.addAgent({ name: 'me', team: 0, isBot: false });
  sim.mode.timeLeft = 0; sim.step();
  // open lane in the south gallery
  const put = (a: typeof me, x: number, z: number, yaw: number) => { a.pos.x = a.prevPos.x = x; a.pos.z = a.prevPos.z = z; a.pos.y = a.prevPos.y = 0.02; a.yaw = yaw; };
  put(me, -7, -13.5, -Math.PI / 2); put(bot, 7, -13.5, Math.PI / 2);
  let dir = 1, flip = 0.6;
  for (let i = 0; i < 60 * 15; i++) {
    flip -= sim.dt;
    if (flip <= 0) { dir = -dir; flip = 0.5 + ((i * 7919) % 100) / 250; }
    sim.setInput(me.id, { moveX: strafe ? dir : 0, moveY: 0, yaw: -Math.PI / 2, pitch: 0, buttons: 0 });
    // keep the target in its lane
    if (me.pos.z < -17.5) dir = 1; if (me.pos.z > -9.5) dir = -1;
    sim.step();
    if (me.state === AgentState.Down) return { t: sim.time, acc: bot.stats.hits / Math.max(1, bot.stats.shots) };
  }
  return { t: 15, acc: bot.stats.hits / Math.max(1, bot.stats.shots) };
}
for (const d of diffs) {
  for (const strafe of [false, true]) {
    const r = [] as { t: number; acc: number }[];
    for (let s = 0; s < 12; s++) r.push(await trial(d, strafe, 100 + s));
    const avg = r.reduce((a, b) => a + b.t, 0) / r.length;
    const acc = r.reduce((a, b) => a + b.acc, 0) / r.length;
    console.log(`${d.padEnd(8)} ${strafe ? 'strafing' : 'standing'}  time-to-switch-off ${avg.toFixed(2)} s   accuracy ${(acc * 100).toFixed(0)}%`);
  }
}
void Btn;
