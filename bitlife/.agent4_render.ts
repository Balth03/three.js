import { content } from './data/index.ts';
import { autoplay, renderString } from './packages/sim/src/index.ts';
import { relActions } from './data/relactions.ts';
import { relActions2 } from './data/relactions2.ts';
import { relActions3 } from './data/relactions3.ts';
import { actions5 } from './data/actions5.ts';
import { actions6 } from './data/actions6.ts';
import { worldEvents } from './data/meta.ts';
const life = autoplay(content, 4242, { rating: 2 }) as any;
const actor = life.npcs.find((n: any) => n.role !== 'pet') ?? life.npcs[0];
const bad: string[] = []; const all: string[] = [];
const go = (t: any, withActor: boolean) => {
  for (const lang of ['fr', 'en'] as const) {
    const arr = Array.isArray(t[lang]) ? t[lang] : [t[lang]];
    for (const s of arr) for (let k = 0; k < 2; k++) {
      const d = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
      const r = renderString(s, { life, content, actor: withActor ? actor : undefined }, lang, d);
      if (/[{}]|\[\[|\]\]|\?\?\?|undefined/.test(r)) bad.push(r);
      if (lang === 'fr' && k === 0) all.push(r);
    }
  }
};
for (const a of [...relActions, ...relActions2, ...relActions3]) for (const o of a.out) go(o.text, true);
for (const a of [...actions5, ...actions6]) for (const o of a.out ?? []) if (o.text && (o.text as any).fr) go(o.text, false);
for (const w of worldEvents) go(w.text, false);
console.log('bad', bad.length); bad.slice(0, 10).forEach((b) => console.log(' !', b));
console.log('total FR variants', all.length);
for (let i = 0; i < 45; i++) console.log('-', all[Math.floor(Math.random() * all.length)]);
