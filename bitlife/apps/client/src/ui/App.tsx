import { useEffect } from 'preact/hooks';
import { screen, life, modal, tab, result, toast, photoMode, showDeath, rev, settings } from '../state.ts';
import { doAgeUp, pickChoice, continueAfterResult, getStage } from '../game.ts';
import { Hud, TAB_ORDER } from './Hud.tsx';
import { EventCard } from './EventCard.tsx';
import { Modals } from './Modals.tsx';
import { Title, Create, Death } from './Screens.tsx';
import { ChallengeChip, AchievementToast } from './Meta.tsx';
import { Retro } from './Retro.tsx';
import { DuoDock, DuoAsk, EmoteBurst } from './Duo.tsx';
import { Tabloid } from './Tabloid.tsx';
import { Mugshot } from './Mugshot.tsx';
import { retro, tabloid } from '../state.ts';
import { t } from '../i18n.ts';
import { sfx, toggleMute, unlockAudio } from '../audio.ts';

// Keyboard: abstract actions → remappable bindings (Settings → Touches)
let capturing = false;
export function setCapturing(v: boolean) { capturing = v; }
export const bindings: Record<string, string[]> = {
  ageUp: ['Space'], choice1: ['Digit1', 'Numpad1'], choice2: ['Digit2', 'Numpad2'], choice3: ['Digit3', 'Numpad3'], choice4: ['Digit4', 'Numpad4'],
  choice5: ['Digit5', 'Numpad5'], choice6: ['Digit6', 'Numpad6'], choice7: ['Digit7', 'Numpad7'], confirm: ['Enter', 'NumpadEnter'], nextTab: ['Tab'], menu: ['Escape'], fullscreen: ['KeyF'], mute: ['KeyM'], photo: ['KeyP'],
};

export const DEFAULT_BINDINGS: Record<string, string[]> = JSON.parse(JSON.stringify(bindings));
export function applyBindings(keys?: Record<string, string[]>) {
  for (const a in DEFAULT_BINDINGS) bindings[a] = keys?.[a]?.length ? keys[a] : [...DEFAULT_BINDINGS[a]];
}
applyBindings(settings.peek().keys);

function actionOf(code: string): string | undefined {
  for (const a in bindings) if (bindings[a].includes(code)) return a;
  return undefined;
}

export function App() {
  void rev.value;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (capturing) return;
      const a = actionOf(e.code);
      if (!a) return;
      unlockAudio();
      const l = life.value;
      const inGame = screen.value === 'game' && l;
      if (a === 'fullscreen') { if (document.fullscreenElement) void document.exitFullscreen(); else void document.documentElement.requestFullscreen(); return; }
      if (a === 'mute') { toggleMute(); return; }
      if (a === 'menu') {
        e.preventDefault();
        if (photoMode.value) { photoMode.value = false; return; }
        if (modal.value) { sfx.close(); modal.value = null; return; }
        if (tab.value) { sfx.close(); tab.value = null; return; }
        if (inGame) { sfx.open(); modal.value = { kind: 'menu' }; }
        return;
      }
      if (!inGame) return;
      if (a === 'photo') { photoMode.value = !photoMode.value; return; }
      if (modal.value || showDeath.value) return;
      if (result.value && (a === 'ageUp' || a === 'confirm')) { e.preventDefault(); sfx.click(); continueAfterResult(); return; }
      const p = l!.queue[0];
      if (p) {
        e.preventDefault();
        if (!p.choices.length && (a === 'ageUp' || a === 'confirm')) { pickChoice(0); return; }
        const m = /^choice(\d)$/.exec(a);
        if (m) pickChoice(+m[1] - 1);
        return;
      }
      if (a === 'ageUp') { e.preventDefault(); doAgeUp(); return; }
      if (a === 'nextTab') {
        e.preventDefault();
        const i = tab.value ? TAB_ORDER.indexOf(tab.value) : -1;
        tab.value = i === TAB_ORDER.length - 1 ? null : TAB_ORDER[i + 1];
        sfx.open();
      }
    };
    window.addEventListener('keydown', onKey);
    const unlock = () => unlockAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    // Feed panel width drives the 3D optical centre
    const st = getStage();
    const w = screen.value === 'game' && !photoMode.value ? Math.min(440, window.innerWidth * 0.34) : screen.value === 'create' ? Math.min(560, window.innerWidth * 0.42) * -1 : 0;
    st?.setRightInset(w);
    document.documentElement.classList.toggle('photo', photoMode.value);
  }, [screen.value, photoMode.value]);

  const s = screen.value;
  return (
    <div class={`app screen-${s}`} data-q={settings.value.quality}>
      <div class="vignette" />
      {s === 'title' && <Title />}
      {s === 'create' && <Create />}
      {retro.value && <Retro />}
      {s === 'game' && !photoMode.value && !retro.value && (
        <>
          <Hud />
          <EventCard />
          <Death />
          <ChallengeChip />
          <DuoDock />
          <button class="menu-btn glass" onClick={() => { sfx.open(); modal.value = { kind: 'menu' }; }} title="Échap">☰</button>
        </>
      )}
      {photoMode.value && <div class="photo-hint glass">{t('photo_hint')}</div>}
      <Modals />
      {toast.value && <div class="toast glass" key={toast.value.id}>{toast.value.text}</div>}
      <AchievementToast />
      {tabloid.value && life.value && <Tabloid l={life.value} onClose={() => { tabloid.value = false; }} />}
      <Mugshot />
      <DuoAsk />
      <EmoteBurst />
    </div>
  );
}
