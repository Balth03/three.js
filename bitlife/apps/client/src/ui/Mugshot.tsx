// Police mugshot overlay when the player gets locked up.
import { useEffect } from 'preact/hooks';
import { content } from '@bl/data';
import { life, lang, mugshot } from '../state.ts';
import { Portrait } from './common.tsx';
import { sfx } from '../audio.ts';

export function Mugshot() {
  const m = mugshot.value, l = life.value;
  useEffect(() => {
    if (!m) return;
    sfx.siren();
    const t = setTimeout(() => { sfx.gavel(); }, 900);
    const t2 = setTimeout(() => { if (mugshot.value?.n === m.n) mugshot.value = null; }, 6000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [m?.n]);
  if (!m || !l) return null;
  const lg = lang.value;
  const crime = content.crimes.find((c) => c.id === m.crime);
  const num = String(Math.floor((l.seed % 900000) + 100000));
  return (
    <div class="mugshot-back" onClick={() => { mugshot.value = null; }}>
      <div class="mugshot pop-in">
        <div class="mug-wall">{[200, 190, 180, 170, 160, 150].map((h) => <div key={h} class="mug-line"><span>{h}</span></div>)}</div>
        <div class="mug-face"><Portrait l={l} size={220} mood="angry" /></div>
        <div class="mug-board">
          <b>{lg === 'fr' ? 'POLICE NATIONALE' : 'POLICE DEPT.'}</b>
          <span>{l.last.toUpperCase()} {l.first}</span>
          <span>#{num} · {l.year}</span>
          <span>{crime ? `${crime.icon} ${crime.label[lg]}` : '—'}</span>
          <span>{m.years} {lg === 'fr' ? (m.years > 1 ? 'ans' : 'an') : (m.years > 1 ? 'years' : 'year')}</span>
        </div>
        <small class="mug-hint">{lg === 'fr' ? 'Souris pour la photo… ou pas.' : 'Smile for the camera… or don\'t.'}</small>
      </div>
    </div>
  );
}
