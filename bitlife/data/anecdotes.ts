// Procedural daily-life lines (first person), assembled into content.anecdotes.
import type { AnecdoteDef } from '@bl/sim';
import { anecdotesKids } from './anecdotes/kids.ts';
import { anecdotesAdults } from './anecdotes/adults.ts';

export const anecdotes: AnecdoteDef[] = [...anecdotesKids, ...anecdotesAdults];
