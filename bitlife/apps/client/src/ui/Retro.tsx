// End-of-life retrospective: the life replayed as a slideshow of dioramas.
import { useEffect, useState } from 'preact/hooks';
import type { Place } from '@bl/sim';
import { life, retro, lang } from '../state.ts';
import { getStage, specOf, syncStage } from '../game.ts';
import { sfx } from '../audio.ts';

export function Retro() {
  const l = life.value;
  const [i, setI] = useState(0);
  const on = retro.value;
  const chapters = !l ? [] : [0, 4, 8, 13, 17, 22, 30, 42, 55, 68, 80, 95].filter((a) => a < l.age).concat([l.age]).map((age) => {
    const y = l.log.find((x) => x.age === age);
    const line = y?.lines.find((ln) => ln.tone === 'good' || ln.tone === 'bad') ?? y?.lines[0];
    const deg = l.edu.degrees.some((d) => d.startsWith('uni:'));
    const place: Place = age === l.age && !l.alive ? 'cemetery' : age < 6 ? 'home' : age < 18 ? 'school' : age < 23 && deg ? 'uni' : age < 62 && (l.jobHistory.length || l.job) ? 'office' : age < 62 ? 'apartment' : 'home';
    return { age, place, text: line?.t[lang.value] ?? '…', icon: line?.icon ?? '✨' };
  });
  useEffect(() => {
    if (!on || !l) return;
    setI(0);
    return () => { syncStage(); };
  }, [on]);
  useEffect(() => {
    if (!on || !l) return;
    const ch = chapters[i];
    if (!ch) { retro.value = false; return; }
    const st = getStage();
    st?.show({ place: ch.place, age: ch.age, player: { ...specOf(l), age: ch.age, ghost: ch.place === 'cemetery', key: 'player' }, others: [], dead: ch.place === 'cemetery', tombLines: [`${l.first} ${l.last}`, `${l.birthYear} – ${l.year}`, ''] });
    st?.setMood(ch.place === 'cemetery' ? 'sleepy' : 'happy');
    sfx.card();
    const t = setTimeout(() => setI((x) => x + 1), 3400);
    return () => clearTimeout(t);
  }, [i, on]);
  if (!on || !l) return null;
  const ch = chapters[i];
  if (!ch) return null;
  return (
    <div class="retro" onClick={() => setI((x) => x + 1)}>
      <div class="retro-bar">{chapters.map((_, k) => <span key={k} class={k <= i ? 'on' : ''} />)}</div>
      <div class="retro-card glass pop-in" key={i}>
        <div class="retro-age">{lang.value === 'fr' ? `${ch.age} ans` : `Age ${ch.age}`}</div>
        <div class="retro-text">{ch.icon} {ch.text}</div>
      </div>
      <button class="x retro-x" onClick={(e) => { e.stopPropagation(); retro.value = false; }}>✕</button>
    </div>
  );
}
