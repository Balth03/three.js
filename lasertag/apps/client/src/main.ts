import './ui/style.css';
import { Game } from './game/Game.ts';

const ui = document.getElementById('ui')!;
const canvas = document.getElementById('view') as HTMLCanvasElement;

const loading = document.createElement('div');
loading.className = 'loading';
loading.innerHTML = `<div><div class="logo"><span>NEON</span><span class="dot">·</span><span class="tag">TAG</span></div><div class="bar"><i></i></div><div class="msg">Initialisation</div></div>`;
ui.append(loading);
const bar = loading.querySelector('.bar i') as HTMLElement;
const msg = loading.querySelector('.msg') as HTMLElement;

function fail(e: unknown) {
  console.error(e);
  msg.textContent = 'Impossible de démarrer : ' + (e instanceof Error ? e.message : String(e)) + ' — WebGL2 est requis.';
  msg.style.color = '#ff3b4e';
}

try {
  const game = new Game(canvas, ui);
  (window as unknown as { __game: Game }).__game = game;
  game.init((k, m) => { bar.style.width = `${Math.round(k * 100)}%`; msg.textContent = m; })
    .then(() => { loading.classList.add('done'); setTimeout(() => loading.remove(), 700); })
    .catch(fail);
} catch (e) {
  fail(e);
}
