// Content validation: `npm run validate`
import { content } from '../data/index.ts';
import type { LocText } from '../packages/sim/src/index.ts';

const errors: string[] = [];
const warn: string[] = [];
const ids = new Set<string>();
const texts = (l: LocText | undefined, where: string) => {
  if (!l) return;
  for (const lang of ['fr', 'en'] as const) {
    const v = l[lang];
    const arr = Array.isArray(v) ? v : [v];
    if (!arr.length || arr.some((s) => typeof s !== 'string')) errors.push(`${where}: missing ${lang}`);
    for (const s of arr) {
      const opens = (s.match(/\{/g) ?? []).length, closes = (s.match(/\}/g) ?? []).length;
      if (opens !== closes) errors.push(`${where} (${lang}): unbalanced braces`);
      for (const m of s.matchAll(/\{([^{}]*)\}/g)) {
        const k = m[1];
        if (k.includes('|')) continue;
        if (!/^(first|last|full|age|year|city|country|school|job|employer|major|\$\w+|a\.(first|last|full|age|rel|my|title|he|him|his|job|species)|\w+)$/.test(k)) errors.push(`${where} (${lang}): unknown token {${k}}`);
      }
    }
  }
  const fr = Array.isArray(l.fr) ? l.fr.length : 1, en = Array.isArray(l.en) ? l.en.length : 1;
  if (fr !== en) warn.push(`${where}: ${fr} FR variants vs ${en} EN`);
};
const flagsSet = new Set<string>(), flagsRead = new Set<string>();
const scan = (fx: unknown) => { const f = fx as { flag?: string | string[] } | undefined; for (const x of [f?.flag].flat()) if (x) flagsSet.add(x); };
for (const e of content.events) {
  if (ids.has(e.id)) errors.push(`duplicate event id ${e.id}`);
  ids.add(e.id);
  texts(e.text, e.id);
  for (const x of [e.when?.flag, e.when?.noFlag].flat()) if (x) flagsRead.add(x);
  scan(e.fx);
  e.choices?.forEach((c, i) => {
    texts(c.label, `${e.id}.choice${i}`);
    if (!c.out && !c.text) errors.push(`${e.id}.choice${i}: no outcome`);
    texts(c.text, `${e.id}.choice${i}.text`);
    scan(c.fx);
    for (const x of [c.if?.flag, c.if?.noFlag].flat()) if (x) flagsRead.add(x);
    c.out?.forEach((o, j) => { texts(o.text, `${e.id}.choice${i}.out${j}`); scan(o.fx); if (o.fx?.chain && !content.events.some((x) => x.id === o.fx!.chain)) errors.push(`${e.id}: chain to unknown ${o.fx.chain}`); if (o.fx?.schedule && !content.events.some((x) => x.id === o.fx!.schedule!.key)) errors.push(`${e.id}: schedule unknown ${o.fx.schedule.key}`); if (o.fx?.disease && !content.diseases.some((d) => d.id === o.fx!.disease)) errors.push(`${e.id}: unknown disease ${o.fx.disease}`); });
    if (c.fx?.disease && !content.diseases.some((d) => d.id === c.fx!.disease)) errors.push(`${e.id}: unknown disease ${c.fx.disease}`);
  });
  if (e.fx?.disease && !content.diseases.some((d) => d.id === e.fx!.disease)) errors.push(`${e.id}: unknown disease ${e.fx.disease}`);
}
for (const a of content.actions) { texts(a.label, `action ${a.id}`); a.out?.forEach((o, j) => texts(o.text, `action ${a.id}.out${j}`)); }
for (const a of content.relActions) { texts(a.label, `rel ${a.id}`); a.out.forEach((o, j) => texts(o.text, `rel ${a.id}.out${j}`)); }
for (const f of flagsRead) if (!flagsSet.has(f) && !['expelled', 'pension', 'pregnant', 'record', 'tuition'].includes(f)) warn.push(`flag "${f}" is read but never set`);
console.log(`Events: ${content.events.length} · Actions: ${content.actions.length} · Interactions: ${content.relActions.length} · Careers: ${content.careers.length} · Countries: ${content.countries.length} · Diseases: ${content.diseases.length}`);
for (const w of warn) console.log('⚠️ ', w);
for (const e of errors) console.log('❌', e);
if (errors.length) { console.log(`${errors.length} error(s)`); process.exit(1); }
console.log('✅ Data OK');
