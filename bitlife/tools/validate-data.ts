// Content validation: `npm run validate`
import { content as base } from '../data/index.ts';
import type { LocText, EventDef, Content, AnecdoteDef, WordEntry } from '../packages/sim/src/index.ts';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

// Optional: validate an extra events module not yet registered: `npm run validate -- data/events/foo.ts`
let content: Content = base;
if (process.argv[2]) {
  const mod = await import(pathToFileURL(resolve(process.argv[2])).href) as Record<string, unknown>;
  // Exports named `anecdotes*` are anecdote lists, `words*` are word-pool objects, other arrays are events.
  const anec = Object.entries(mod).filter(([k, v]) => /^anecdotes/i.test(k) && Array.isArray(v)).flatMap(([, v]) => v as AnecdoteDef[]);
  const words = Object.entries(mod).filter(([k, v]) => /^words/i.test(k) && v && typeof v === 'object' && !Array.isArray(v)).map(([, v]) => v as Record<string, WordEntry[]>);
  const extra = Object.entries(mod).filter(([k, v]) => !/^(anecdotes|words)/i.test(k) && Array.isArray(v)).flatMap(([, v]) => v as EventDef[]);
  const known = new Set(base.events.map((e) => e.id));
  const knownA = new Set((base.anecdotes ?? []).map((e) => e.id));
  const mergedWords: Record<string, WordEntry[]> = { ...(base.words ?? {}) };
  for (const w of words) for (const k in w) mergedWords[k] = [...(mergedWords[k] ?? []), ...w[k]];
  content = { ...base, words: mergedWords, anecdotes: [...(base.anecdotes ?? []), ...anec.filter((e) => !knownA.has(e.id))], events: [...base.events, ...extra.filter((e) => !known.has(e.id))] };
  console.log(`+ ${extra.length} events, ${anec.length} anecdotes, ${words.reduce((n, w) => n + Object.values(w).flat().length, 0)} words from ${process.argv[2]}`);
}

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
        if (k.startsWith('w:')) { if (!content.words?.[k.slice(2)]?.length) errors.push(`${where} (${lang}): unknown word pool {${k}}`); continue; }
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
// Word pools
for (const [k, list] of Object.entries(content.words ?? {})) {
  if (!/^[a-z_0-9]+$/.test(k)) errors.push(`word pool name "${k}" must be lowercase a-z/0-9/_`);
  const seenFr = new Set<string>();
  list.forEach((e, i) => {
    if (!Array.isArray(e) || (e.length !== 2 && e.length !== 3) || !e[0]?.trim() || !e[1]?.trim() || (e.length === 3 && e[2] !== 1 && e[2] !== 2)) errors.push(`words.${k}[${i}]: must be [fr, en] or [fr, en, 1|2]`);
    else if (/[{}\[\]]/.test(e[0] + e[1])) errors.push(`words.${k}[${i}]: no braces/brackets inside words`);
    else if (seenFr.has(e[0])) warn.push(`words.${k}: duplicate "${e[0]}"`);
    else seenFr.add(e[0]);
  });
  if (list.length < 8) warn.push(`words.${k}: only ${list.length} entries`);
}
// Anecdotes
const aIds = new Set<string>();
for (const a of content.anecdotes ?? []) {
  if (aIds.has(a.id)) errors.push(`duplicate anecdote id ${a.id}`);
  aIds.add(a.id);
  texts(a.text, `anecdote ${a.id}`);
  for (const lang of ['fr', 'en'] as const) for (const t of [a.text[lang]].flat()) if (/\{a\./.test(t)) errors.push(`anecdote ${a.id}: no actor tokens in anecdotes`);
}
for (const a of content.actions) { texts(a.label, `action ${a.id}`); a.out?.forEach((o, j) => texts(o.text, `action ${a.id}.out${j}`)); }
for (const a of content.relActions) { texts(a.label, `rel ${a.id}`); a.out.forEach((o, j) => texts(o.text, `rel ${a.id}.out${j}`)); }
for (const f of flagsRead) if (!flagsSet.has(f) && !['expelled', 'pension', 'pregnant', 'record', 'tuition'].includes(f)) warn.push(`flag "${f}" is read but never set`);
console.log(`Events: ${content.events.length} · Anecdotes: ${(content.anecdotes ?? []).length} · Words: ${Object.values(content.words ?? {}).flat().length} in ${Object.keys(content.words ?? {}).length} pools · Actions: ${content.actions.length} · Interactions: ${content.relActions.length} · Careers: ${content.careers.length} · Countries: ${content.countries.length} · Diseases: ${content.diseases.length}`);
for (const w of warn) console.log('⚠️ ', w);
for (const e of errors) console.log('❌', e);
if (errors.length) { console.log(`${errors.length} error(s)`); process.exit(1); }
console.log('✅ Data OK');
