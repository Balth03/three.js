// Mass simulation for balancing: `npm run sim -- 2000`
import { content } from '../data/index.ts';
import { autoplay, summarize, toBase, country } from '../packages/sim/src/index.ts';

const N = Number(process.argv[2] ?? 1000);
const t0 = Date.now();
const ages: number[] = [];
const wealth: number[] = [];
const causes = new Map<string, number>();
const seenEvents = new Map<string, number>();
let uni = 0, grad = 0, married = 0, kids = 0, jobless30 = 0;
for (let i = 1; i <= N; i++) {
  const l = autoplay(content, i * 7919);
  const s = summarize(l, content);
  ages.push(l.age);
  wealth.push(toBase(s.netWorth, country(content, l.country)));
  const c = l.death?.cause.fr.replace(/des suites de : /, '') ?? '?';
  causes.set(c, (causes.get(c) ?? 0) + 1);
  for (const k of Object.keys(l.seen)) seenEvents.set(k, (seenEvents.get(k) ?? 0) + 1);
  if (l.edu.degrees.some((d) => d.startsWith('uni:'))) uni++;
  if (l.edu.degrees.some((d) => d.startsWith('grad:'))) grad++;
  if (l.npcs.some((n) => n.role === 'spouse')) married++;
  kids += s.children;
  if (!l.jobHistory.some((j) => j.years > 0) && !l.job) jobless30++;
}
const q = (arr: number[], p: number) => { const s = [...arr].sort((a, b) => a - b); return s[Math.floor(p * (s.length - 1))]; };
const pct = (n: number) => `${((n / N) * 100).toFixed(1)}%`;
console.log(`\n=== ${N} lives in ${((Date.now() - t0) / 1000).toFixed(1)}s ===`);
console.log(`Age at death: mean ${(ages.reduce((a, b) => a + b, 0) / N).toFixed(1)} · p10 ${q(ages, 0.1)} · median ${q(ages, 0.5)} · p90 ${q(ages, 0.9)}`);
console.log(`Net worth (base $): p10 ${Math.round(q(wealth, 0.1))} · median ${Math.round(q(wealth, 0.5))} · p90 ${Math.round(q(wealth, 0.9))} · max ${Math.round(q(wealth, 1))}`);
console.log(`University ${pct(uni)} · Graduate ${pct(grad)} · Married at death ${pct(married)} · Kids/life ${(kids / N).toFixed(2)} · Never worked ${pct(jobless30)}`);
console.log('Top causes of death:');
for (const [c, n] of [...causes].sort((a, b) => b[1] - a[1]).slice(0, 8)) console.log(`  ${pct(n).padStart(6)}  ${c}`);
const never = content.events.filter((e) => !e.chainOnly && !seenEvents.has(e.id)).map((e) => e.id);
console.log(`Events never seen (${never.length}/${content.events.length}): ${never.join(', ') || '—'}`);
const top = [...seenEvents].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, n]) => `${k} (${(n / N).toFixed(2)}/life)`);
console.log(`Most frequent: ${top.join(', ')}`);
