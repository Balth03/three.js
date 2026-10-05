// Measures text repetition: share of feed lines that are exact duplicates within a life and across lives.
// Usage: node tools/diversity.ts [lives=60] [rating=2]
import { content } from '../data/index.ts';
import { autoplay } from '../packages/sim/src/index.ts';
const N = +(process.argv[2] ?? 60), rating = +(process.argv[3] ?? 2) as 0 | 1 | 2;
let total = 0, dupIn = 0, dupAcross = 0;
const global = new Map<string, number>();
const top = new Map<string, number>();
let fatigue: Record<string, number> | undefined;
for (let s = 1; s <= N; s++) {
  const l = autoplay(content, 1000 + s, { rating, crime: 0.08, fatigue });
  // carry cross-life memory like the client does
  fatigue = {};
  for (const [k, v] of Object.entries(l.seenCount ?? {})) fatigue[k] = v;
  const seen = new Set<string>();
  for (const y of l.log) for (const ln of y.lines) {
    const t = ln.t.fr;
    if (t.length < 25) continue;
    total++;
    if (seen.has(t)) dupIn++;
    seen.add(t);
    if (global.has(t)) dupAcross++;
    global.set(t, (global.get(t) ?? 0) + 1);
  }
}
for (const [t, n] of global) if (n > 2) top.set(t, n);
console.log(`${N} lives · ${total} feed lines · duplicates within a life: ${(100 * dupIn / total).toFixed(1)}% · already seen in a previous life: ${(100 * dupAcross / total).toFixed(1)}% · distinct lines: ${global.size}`);
console.log('Most repeated:');
for (const [t, n] of [...top].sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(`  ×${n}  ${t.slice(0, 110)}`);
