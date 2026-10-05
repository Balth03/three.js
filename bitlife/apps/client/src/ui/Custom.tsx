// Editor for home-made events: write your own inside jokes, they show up in your lives (and your partner's).
import { useState } from 'preact/hooks';
import { lang, modal, duo } from '../state.ts';
import { loadCustom, saveCustom, blankCustom, type CustomEvent, type CustomChoice } from '../custom.ts';
import { shareCustom } from '../duo.ts';
import { Sheet, Btn } from './common.tsx';
import { sfx } from '../audio.ts';

const STATS: [keyof CustomChoice, string][] = [['happy', '😊'], ['health', '❤️'], ['smarts', '🧠'], ['looks', '✨'], ['karma', '😇']];

export function CustomEditor() {
  const lg = lang.value;
  const T = (fr: string, en: string) => (lg === 'fr' ? fr : en);
  const [list, setList] = useState<CustomEvent[]>(loadCustom());
  const [edit, setEdit] = useState<CustomEvent | null>(null);
  const store = (l: CustomEvent[]) => { setList(l); saveCustom(l); if (duo.value.connected) shareCustom(); };
  if (edit) {
    const up = (p: Partial<CustomEvent>) => setEdit({ ...edit, ...p });
    const upC = (i: number, p: Partial<CustomChoice>) => setEdit({ ...edit, choices: edit.choices.map((c, k) => (k === i ? { ...c, ...p } : c)) });
    const ok = edit.text.trim() && edit.choices.some((c) => c.label.trim());
    return (
      <Sheet title={T('Événement maison', 'Home-made event')} icon="✍️" onClose={() => setEdit(null)} cls="wide custom-ed">
        <div class="field-row">
          <label class="field" style={{ maxWidth: 90 }}><span>Icône</span><input value={edit.icon} maxLength={4} onInput={(e) => up({ icon: (e.target as HTMLInputElement).value })} /></label>
          <label class="field"><span>{T('Âge', 'Age')} : {edit.minAge}–{edit.maxAge}</span>
            <div class="row-btns"><input type="range" min="0" max="120" value={edit.minAge} onInput={(e) => up({ minAge: Math.min(+(e.target as HTMLInputElement).value, edit.maxAge) })} /><input type="range" min="0" max="120" value={edit.maxAge} onInput={(e) => up({ maxAge: Math.max(+(e.target as HTMLInputElement).value, edit.minAge) })} /></div>
          </label>
          <label class="field"><span>{T('Fréquence', 'Frequency')}</span><input type="range" min="5" max="80" value={edit.weight} onInput={(e) => up({ weight: +(e.target as HTMLInputElement).value })} /></label>
        </div>
        <div class="field"><span>{T('Niveau', 'Rating')}</span>
          <div class="seg">{([0, 1, 2] as const).map((r) => <button key={r} class={edit.rating === r ? 'on' : ''} onClick={() => up({ rating: r })}>{[T('Tout public', 'Family'), T('Adulte', 'Adult'), '🔥 Trash'][r]}</button>)}</div>
        </div>
        <label class="field"><span>{T('Texte de la carte (« Tu… »). Jetons possibles : {first}, {age}, {city}, {job}', 'Card text ("You…"). Tokens: {first}, {age}, {city}, {job}')}</span>
          <textarea rows={3} maxLength={400} value={edit.text} placeholder={T('Ta belle-mère débarque à l\'improviste avec ses valises…', 'Your mother-in-law shows up uninvited with suitcases…')} onInput={(e) => up({ text: (e.target as HTMLTextAreaElement).value })} />
        </label>
        {edit.choices.map((c, i) => (
          <div class="custom-choice" key={i}>
            <div class="field-row">
              <label class="field"><span>{T('Choix', 'Choice')} {i + 1}</span><input value={c.label} maxLength={40} placeholder={i === 0 ? T('La mettre dehors', 'Kick her out') : ''} onInput={(e) => upC(i, { label: (e.target as HTMLInputElement).value })} /></label>
              <label class="field"><span>{T('Résultat (« J\'ai… »)', 'Result ("I…")')}</span><input value={c.text} maxLength={240} onInput={(e) => upC(i, { text: (e.target as HTMLInputElement).value })} /></label>
            </div>
            <div class="stat-inputs">
              {STATS.map(([k, ic]) => (
                <label key={k} title={k}>{ic}<input type="number" min="-30" max="30" value={c[k] as number} onInput={(e) => upC(i, { [k]: Math.max(-30, Math.min(30, +(e.target as HTMLInputElement).value || 0)) } as Partial<CustomChoice>)} /></label>
              ))}
              <label title="money">💰<input type="number" step="100" value={c.money} onInput={(e) => upC(i, { money: +(e.target as HTMLInputElement).value || 0 })} /></label>
              {edit.rating === 2 && <label title="die">💀<input type="checkbox" checked={!!c.die} onChange={(e) => upC(i, { die: (e.target as HTMLInputElement).checked })} /></label>}
            </div>
          </div>
        ))}
        <p class="muted small">{T('💰 en dollars, converti dans la monnaie du pays. 💀 = ce choix tue.', '💰 in dollars, converted to local currency. 💀 = this choice kills.')}</p>
        <div class="row-btns">
          <Btn cls="primary" disabled={!ok} onClick={() => { sfx.good(); const i = list.findIndex((x) => x.id === edit.id); store(i >= 0 ? list.map((x) => (x.id === edit.id ? edit : x)) : [...list, edit]); setEdit(null); }}>💾 {T('Enregistrer', 'Save')}</Btn>
          <Btn cls="ghost" onClick={() => setEdit(null)}>{T('Annuler', 'Cancel')}</Btn>
        </div>
      </Sheet>
    );
  }
  const me = duo.value.players.find((p) => p.id === duo.value.you)?.name;
  return (
    <Sheet title={T('Événements maison', 'Home-made events')} icon="✍️" onClose={() => { modal.value = null; }}>
      <p class="muted">{T('Écrivez vos propres événements (blagues privées, belle-famille, collègues…). Ils apparaissent au hasard dans vos vies. En mode à deux, ils sont partagés avec ton/ta partenaire.', 'Write your own events (inside jokes, in-laws, coworkers…). They pop up randomly in your lives. In duo mode they are shared with your partner.')}</p>
      <div class="custom-list">
        {list.map((e) => (
          <div class="custom-row" key={e.id}>
            <span class="ci">{e.icon}</span>
            <span class="ct">{e.text.slice(0, 70)}{e.text.length > 70 ? '…' : ''}<small> · {e.minAge}–{e.maxAge} {T('ans', 'y/o')}{e.author ? ` · ✍️ ${e.author}` : ''}</small></span>
            <button class="btn small" onClick={() => setEdit(e)}>✏️</button>
            <button class="btn small ghost" onClick={() => { if (confirm(T('Supprimer cet événement ?', 'Delete this event?'))) store(list.filter((x) => x.id !== e.id)); }}>🗑️</button>
          </div>
        ))}
        {!list.length && <p class="center muted">{T('Aucun pour l\'instant.', 'None yet.')}</p>}
      </div>
      <div class="row-btns"><Btn cls="primary" onClick={() => { sfx.open(); setEdit(blankCustom(me ?? (lg === 'fr' ? 'Moi' : 'Me'))); }}>➕ {T('Nouvel événement', 'New event')}</Btn></div>
    </Sheet>
  );
}
