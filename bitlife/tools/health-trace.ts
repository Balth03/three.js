// Debug: which events / actions drain health the most. Usage: node tools/health-trace.ts [lives] [rating]
import { content } from '../data/index.ts';
import { createLife, ageUp, choose, listActions, doAction, Rng } from '../packages/sim/src/index.ts';
const N = +(process.argv[2] ?? 200), rating = +(process.argv[3] ?? 2);
const ev: Record<string, [number, number]> = {};
const add = (k: string, d: number) => { const e = (ev[k] ??= [0, 0]); e[0] += d; e[1]++; };
let ages = 0;
for (let s = 1; s <= N; s++) {
  const l = createLife(content, { seed: s, birthYear: 2000, rating });
  const pick = new Rng([s, 7, 13, 99]);
  while (l.alive && l.age < 120) {
    let h = l.stats.health;
    ageUp(l, content);
    add('(yearly)', l.stats.health - h);
    let g = 0;
    while (l.queue.length && g++ < 20 && l.alive) { const p = l.queue[0]; h = l.stats.health; choose(l, content, p.choices.length ? pick.int(0, p.choices.length - 1) : 0); add(p.key, l.stats.health - h); }
    const acts = listActions(l, content).filter((a) => a.ok && !a.def.open && !a.def.event && a.def.group !== 'vices');
    for (let i = 0; i < 2 && acts.length && l.alive; i++) { const a = pick.pick(acts); h = l.stats.health; doAction(l, content, a.def.id); add('act:' + a.def.id, l.stats.health - h); g = 0; while (l.queue.length && g++ < 20 && l.alive) { const p = l.queue[0]; choose(l, content, 0); } }
  }
  ages += l.age;
}
console.log('mean age', (ages / N).toFixed(1));
const rows = Object.entries(ev).map(([k, [sum, n]]) => [k, +(sum / N).toFixed(2), n, +(sum / n).toFixed(1)] as const).sort((a, b) => a[1] - b[1]);
console.log('total health per life by source (most negative first): key, perLife, count, avg');
for (const r of rows.slice(0, 30)) console.log(r.join('  '));
