/**
 * Runs bot-only TDM matches headlessly (no rendering) and prints balance stats.
 *   npm run sim:match -- [matches=3] [teamSize=4] [difficulty=pro]
 */
import { Simulation, MAPS, ROSTER, AgentState, type Difficulty, type Personality } from '../../packages/shared/src/index.ts';

const matches = Number(process.argv[2] ?? 3);
const teamSize = Number(process.argv[3] ?? 4);
const difficulty = (process.argv[4] ?? 'pro') as Difficulty;
const pers = Object.keys(ROSTER.personalities) as Personality[];

const totals = { zones: {} as Record<string, number>, wins: [0, 0, 0], durations: [] as number[], kills: 0 };
for (let m = 0; m < matches; m++) {
  const t0 = performance.now();
  const sim = await Simulation.create({ map: MAPS.maze, seed: 1000 + m });
  for (let i = 0; i < teamSize * 2; i++) {
    sim.addAgent({ name: sim.botName(), team: i % 2, isBot: true, difficulty, personality: pers[(i >> 1) % pers.length] });
  }
  const navMs = performance.now() - t0;
  let maxTicks = 60 * 60 * 8;
  let stuckSamples = 0, samples = 0;
  while (sim.mode.phase !== 'ended' && maxTicks-- > 0) {
    sim.step();
    for (const e of sim.events) {
      if (e.type === 'hit') totals.zones[e.zone] = (totals.zones[e.zone] ?? 0) + 1;
      if (e.type === 'down') totals.kills++;
    }
    sim.events.length = 0;
    if (sim.tick % 60 === 0) for (const a of sim.agents) {
      if (a.state !== AgentState.Active) continue;
      samples++;
      if (Math.hypot(a.vel.x, a.vel.z) < 0.3) stuckSamples++;
    }
  }
  const ms = performance.now() - t0;
  totals.wins[sim.mode.winner + 1]++;
  totals.durations.push(sim.mode.elapsed);
  console.log(`match ${m}: ${sim.mode.scores.join(' - ')} winner=${sim.mode.winner} in ${sim.mode.elapsed.toFixed(0)}s sim | nav ${sim.nav!.count} nodes ${navMs.toFixed(0)}ms | wall ${(ms / 1000).toFixed(1)}s (${((sim.tick / 60) / (ms / 1000)).toFixed(0)}x realtime) | idle ${(100 * stuckSamples / samples).toFixed(0)}%`);
  for (const a of sim.agents) {
    const s = a.stats;
    console.log(`   ${a.team ? 'MAG' : 'CYA'} ${a.name.padEnd(20)} ${String(a.personality).padEnd(10)} K ${String(s.deactivations).padStart(2)} D ${String(s.downs).padStart(2)} acc ${(100 * s.hits / Math.max(1, s.shots)).toFixed(0).padStart(3)}% hs ${s.headshots}`);
  }
}
console.log('zones hit:', totals.zones, 'wins (draw,cyan,mag):', totals.wins, 'avg duration', (totals.durations.reduce((a, b) => a + b, 0) / totals.durations.length).toFixed(0) + 's');
