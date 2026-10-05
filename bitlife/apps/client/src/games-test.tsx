// Standalone harness to develop / screenshot minigames without loading the game content.
// Usage: npm run dev, then http://localhost:5173/games.html?g=CarChase[&v=variant]
import { render } from 'preact';
import { useState } from 'preact/hooks';
import '@fontsource-variable/fredoka';
import '@fontsource-variable/nunito';
import './styles.css';
import type { Life } from '@bl/sim';
import { unlockAudio } from './audio.ts';
import { CarChase } from './ui/games/CarChase.tsx';
import { Rhythm } from './ui/games/Rhythm.tsx';
import { Hack } from './ui/games/Hack.tsx';
import { Lockpick } from './ui/games/Lockpick.tsx';
import { Fight } from './ui/games/Fight.tsx';
import { BeerPong } from './ui/games/BeerPong.tsx';
import { Trading } from './ui/games/Trading.tsx';
import { Slots } from './ui/games/Slots.tsx';
import { Penalty } from './ui/games/Penalty.tsx';
import { Surgery2 } from './ui/games/Surgery2.tsx';
import { Debate } from './ui/games/Debate.tsx';
import { Blackjack2 } from './ui/games/Blackjack2.tsx';
import { Escape2 } from './ui/games/Escape2.tsx';
import { Cooking2 } from './ui/games/Cooking2.tsx';

const GAMES = { CarChase, Rhythm, Hack, Lockpick, Fight, BeerPong, Trading, Slots, Penalty, Surgery2, Debate, Blackjack2, Escape2, Cooking2 } as const;
const fakeLife = { first: 'Test', last: 'Dummy', gender: 'f', age: 28, city: 'Paris', country: 'fr', money: 25000, stats: { happy: 60, health: 80, smarts: 70, looks: 60 }, attrs: { athletic: 60, karma: 50, fame: 10, discipline: 50, stress: 30 }, seed: 42, rng: [1, 2, 3, 4], flags: {}, npcs: [], log: [] } as unknown as Life;

function Harness() {
  const q = new URLSearchParams(location.search);
  const name = (q.get('g') ?? 'CarChase') as keyof typeof GAMES;
  const [res, setRes] = useState<string | null>(null);
  const [k, setK] = useState(0);
  const G = GAMES[name] ?? CarChase;
  (window as unknown as Record<string, unknown>).harness = { res };
  if (res) return <div style={{ color: '#fff', font: '20px sans-serif', padding: 40 }}>Résultat : {res} <button onClick={() => { setRes(null); setK(k + 1); }}>Rejouer</button></div>;
  return <div onPointerDown={() => unlockAudio()}><G key={k} l={fakeLife} variant={q.get('v') ?? undefined} onDone={(s, extra) => setRes(`${Math.round(s * 100)}%${extra !== undefined ? ` (extra ${extra})` : ''}`)} /></div>;
}

render(<Harness />, document.getElementById('app')!);
