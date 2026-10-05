// Which events fire most often across many lives (to prioritise variant writing). Usage: node tools/frequency.ts [lives] [top]
import { content } from '../data/index.ts';
import { autoplay } from '../packages/sim/src/index.ts';
import { readdirSync, readFileSync } from 'node:fs';
const N = +(process.argv[2] ?? 200), TOP = +(process.argv[3] ?? 200);
const count: Record<string, number> = {};
for (let s = 1; s <= N; s++) {
  const l = autoplay(content, s, { rating: (s % 3) as 0 | 1 | 2, crime: 0.08 });
  for (const [k, v] of Object.entries(l.seenCount ?? {})) if (!k.startsWith('an:')) count[k] = (count[k] ?? 0) + v;
}
const fileOf: Record<string, string> = {};
for (const f of readdirSync('data/events')) { const src = readFileSync(`data/events/${f}`, 'utf8'); for (const m of src.matchAll(/id: '([a-z0-9_]+)'/g)) fileOf[m[1]] ??= f; }
const variants = (id: string) => { const e = content.events.find((x) => x.id === id); const fr = e?.text.fr; return Array.isArray(fr) ? fr.length : 1; };
const rows = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, TOP);
for (const [id, n] of rows) console.log(`${(n / N).toFixed(2)}\t${variants(id)}v\t${fileOf[id] ?? '?'}\t${id}`);
