// TODO: implemented by an agent (see kit.tsx, CarChase.tsx, Rhythm.tsx, Debate.tsx for the style).
import { useGame, Arena, tr, type GameProps } from './kit.tsx';

export function Cooking2({ onDone }: GameProps) {
  const g = useGame({ duration: 3, onDone });
  if (g.phase === 'play' && g.time <= 0) g.end(0.5);
  return <Arena g={g} title="Cooking2" icon="🎮" howTo={tr('Bientôt.', 'Soon.')}><div /></Arena>;
}
