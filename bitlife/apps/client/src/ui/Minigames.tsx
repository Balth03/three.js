// Minigames: full-screen arcade games (ui/games/*) that feed a 0..1 score (+ optional extra) back into the simulation.
import type { Life } from '@bl/sim';
import { type MinigameKind, rev } from '../state.ts';
import { CarChase } from './games/CarChase.tsx';
import { Rhythm } from './games/Rhythm.tsx';
import { Hack } from './games/Hack.tsx';
import { Lockpick } from './games/Lockpick.tsx';
import { Fight } from './games/Fight.tsx';
import { BeerPong } from './games/BeerPong.tsx';
import { Trading } from './games/Trading.tsx';
import { Slots } from './games/Slots.tsx';
import { Penalty } from './games/Penalty.tsx';
import { Surgery2 } from './games/Surgery2.tsx';
import { Debate } from './games/Debate.tsx';
import { Blackjack2 } from './games/Blackjack2.tsx';
import { Escape2 } from './games/Escape2.tsx';
import { Cooking2 } from './games/Cooking2.tsx';

type Done = (score: number, extra?: number) => void;

export function Minigame({ game, onDone, l }: { game: MinigameKind; title: string; onDone: Done; l: Life }) {
  void rev.value;
  switch (game) {
    case 'getaway': return <CarChase onDone={onDone} l={l} />;
    case 'karaoke': case 'concert': case 'dj': return <Rhythm onDone={onDone} l={l} variant={game} />;
    case 'hack': return <Hack onDone={onDone} l={l} />;
    case 'lockpick': case 'heist': return <Lockpick onDone={onDone} l={l} variant={game} />;
    case 'fight': return <Fight onDone={onDone} l={l} />;
    case 'beerpong': return <BeerPong onDone={onDone} l={l} />;
    case 'trading': return <Trading onDone={onDone} l={l} />;
    case 'slots': return <Slots onDone={onDone} l={l} />;
    case 'penalty': case 'match': return <Penalty onDone={onDone} l={l} />;
    case 'surgery': return <Surgery2 onDone={onDone} l={l} />;
    case 'trial': case 'case': case 'interrogation': case 'date': return <Debate onDone={onDone} l={l} variant={game} />;
    case 'blackjack': return <Blackjack2 onDone={onDone} l={l} />;
    case 'escape': return <Escape2 onDone={onDone} l={l} />;
    case 'cooking': return <Cooking2 onDone={onDone} l={l} />;
  }
  return null;
}
