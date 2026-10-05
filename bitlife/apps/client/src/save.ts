// Versioned local saves: autosave + 6 slots, export/import JSON.
import { migrate, type Life } from '@bl/sim';

export interface SlotInfo { slot: number; name: string; age: number; alive: boolean; savedAt: number; country: string }
const KEY = (n: number) => `bl:slot:${n}`;
export const AUTOSAVE = 0;
export const SLOTS = [1, 2, 3, 4, 5, 6];

export function saveLife(life: Life, slot = AUTOSAVE): boolean {
  try {
    localStorage.setItem(KEY(slot), JSON.stringify({ savedAt: Date.now(), life }));
    return true;
  } catch { return false; }
}

export function loadLife(slot = AUTOSAVE): Life | null {
  try {
    const raw = localStorage.getItem(KEY(slot));
    if (!raw) return null;
    return migrate(JSON.parse(raw).life);
  } catch (e) { console.warn('save load failed', e); return null; }
}

export function slotInfo(slot: number): SlotInfo | null {
  try {
    const raw = localStorage.getItem(KEY(slot));
    if (!raw) return null;
    const o = JSON.parse(raw);
    const l = o.life as Life;
    return { slot, name: `${l.first} ${l.last}`, age: l.age, alive: l.alive, savedAt: o.savedAt, country: l.country };
  } catch { return null; }
}

export function deleteSlot(slot: number) { try { localStorage.removeItem(KEY(slot)); } catch { /* ignore */ } }

export function exportLife(life: Life) {
  const blob = new Blob([JSON.stringify({ format: 'bitlife-online', life }, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${life.first}-${life.last}-${life.age}ans.json`.replace(/\s+/g, '_');
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export async function importLife(file: File): Promise<Life> {
  const o = JSON.parse(await file.text());
  return migrate(o.life ?? o);
}

export interface Settings {
  lang: 'fr' | 'en'; quality: 'low' | 'medium' | 'high'; music: number; sfx: number; reducedMotion: boolean;
  textScale: number; previews: boolean; family: boolean; dyslexic: boolean; contrast: boolean; rating: 0 | 1 | 2;
}

export const defaultSettings: Settings = { lang: 'fr', quality: 'high', music: 0.4, sfx: 0.7, reducedMotion: false, textScale: 1, previews: true, family: true, dyslexic: false, contrast: false, rating: 2 };

export function loadSettings(): Settings {
  try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem('bl:settings') ?? '{}') }; } catch { return { ...defaultSettings }; }
}
export function storeSettings(s: Settings) { try { localStorage.setItem('bl:settings', JSON.stringify(s)); } catch { /* ignore */ } }
