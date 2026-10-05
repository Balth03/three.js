import { signal } from '@preact/signals';
import type { Lang, Life, Resolution, Tab } from '@bl/sim';
import { loadSettings, type Settings } from './save.ts';

export type Screen = 'title' | 'create' | 'game';
export type Modal = null | { kind: 'jobs' } | { kind: 'university' } | { kind: 'grad' } | { kind: 'dating' } | { kind: 'npc'; id: number } | { kind: 'saves' } | { kind: 'settings' } | { kind: 'menu' } | { kind: 'profile' };

const s0 = loadSettings();
export const settings = signal<Settings>(s0);
export const lang = signal<Lang>(s0.lang);
export const screen = signal<Screen>('title');
export const life = signal<Life | null>(null);
/** Bumped after every mutation of the (mutable) life object. */
export const rev = signal(0);
export const tab = signal<Tab | null>(null);
export const modal = signal<Modal>(null);
export const result = signal<Resolution | null>(null);
export const toast = signal<{ text: string; id: number } | null>(null);
export const photoMode = signal(false);
export const ageBusy = signal(false);
export const showDeath = signal(false);

export function bump() { rev.value++; }

let toastId = 0;
export function showToast(text: string) {
  const id = ++toastId;
  toast.value = { text, id };
  setTimeout(() => { if (toast.value?.id === id) toast.value = null; }, 2200);
}
