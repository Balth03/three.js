import { signal } from '@preact/signals';
import type { Lang, Life, Resolution, Tab } from '@bl/sim';
import { loadSettings, type Settings } from './save.ts';
import { loadProfile } from './profile.ts';
import type { DuoMode, PeerSummary, SocialKind } from '@bl/shared';

export type Screen = 'title' | 'create' | 'game';
export type MinigameKind = 'heist' | 'getaway' | 'escape' | 'trial' | 'blackjack' | 'surgery' | 'cooking' | 'match' | 'interrogation' | 'case' | 'date';
export type Modal = null | { kind: 'jobs' } | { kind: 'university' } | { kind: 'grad' } | { kind: 'dating' } | { kind: 'npc'; id: number } | { kind: 'saves' } | { kind: 'settings' } | { kind: 'menu' } | { kind: 'profile' }
  | { kind: 'crime' } | { kind: 'realestate' } | { kind: 'cars' } | { kind: 'shop' } | { kind: 'stocks' } | { kind: 'bank' } | { kind: 'business' }
  | { kind: 'achievements' } | { kind: 'graveyard' } | { kind: 'tree' } | { kind: 'god' } | { kind: 'duo' } | { kind: 'ghost' } | { kind: 'album' }
  | { kind: 'minigame'; game: MinigameKind; title: string; onDone: (score: number, extra?: number) => void };

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
export const profile = signal(loadProfile());
export const retro = signal(false);
export const achToast = signal<{ id: string; n: number } | null>(null);

export function bump() { rev.value++; }

// ── Two-player state
export interface ChatLine { from: string; name: string; text: string; at: number }
export interface DuoState {
  status: 'off' | 'connecting' | 'room';
  connected: boolean;
  code: string;
  you: string;
  host: boolean;
  mode: DuoMode;
  players: { id: string; name: string; online: boolean }[];
  peer: PeerSummary | null;
  peerOnline: boolean;
  chat: ChatLine[];
  unread: number;
  myVote?: number;
  peerVoted?: boolean;
  /** Incoming social request awaiting my answer. */
  ask?: { kind: SocialKind; data?: Record<string, unknown> };
  duel?: { stake: number; mine?: number; theirs?: number };
  error?: string;
}
export const duo = signal<DuoState>({ status: 'off', connected: false, code: '', you: '', host: false, mode: 'parallel', players: [], peer: null, peerOnline: false, chat: [], unread: 0 });
/** Mugshot overlay shown when the player is locked up. */
export const mugshot = signal<{ crime: string; years: number; n: number } | null>(null);
/** Tabloid front page (obituary or year headlines). */
export const tabloid = signal(false);
export const emoteFx = signal<{ e: string; mine: boolean; id: number } | null>(null);

let toastId = 0;
export function showToast(text: string) {
  const id = ++toastId;
  toast.value = { text, id };
  setTimeout(() => { if (toast.value?.id === id) toast.value = null; }, 2200);
}
