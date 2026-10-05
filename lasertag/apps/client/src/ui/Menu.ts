import { ROSTER, type Agent, type Simulation, type Difficulty } from '@neon/shared';
import type { Settings } from '../game/settings.ts';
import { TEAM_NAMES, TEAM_SHAPES } from '../render/neon.ts';

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', html = ''): HTMLElementTagNameMap[K] => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

export interface MenuCallbacks {
  play(): void;
  resume(): void;
  quit(): void;
  settingsChanged(s: Settings): void;
  sound(kind: 'hover' | 'click' | 'back'): void;
}

const LOGO = '<span>NEON</span><span class="dot">·</span><span class="tag">TAG</span>';

export class Menu {
  private main = h('div', 'menu hidden');
  private pause = h('div', 'menu hidden');
  private panel: HTMLElement | null = null;
  private end: HTMLElement | null = null;
  private briefingEl: HTMLElement | null = null;

  constructor(private readonly ui: HTMLElement, private settings: Settings, private readonly cb: MenuCallbacks) {
    this.buildMain();
    this.buildPause();
    ui.append(this.main, this.pause);
  }

  private wire(btn: HTMLElement, fn: () => void, sound: 'click' | 'back' = 'click') {
    btn.addEventListener('mouseenter', () => this.cb.sound('hover'));
    btn.addEventListener('click', (e) => { e.stopPropagation(); this.cb.sound(sound); fn(); });
  }

  private buildMain() {
    const side = h('div', 'side');
    side.innerHTML = `<h1 class="title logo">${LOGO}</h1><div class="subtitle">Laser game · Arène néon-UV</div>`;
    const nav = h('nav');
    const play = h('button', 'btn primary', 'Jouer<small>Team Deathmatch · bots</small>');
    const opts = h('button', 'btn', 'Options');
    const ctr = h('button', 'btn', 'Contrôles');
    const how = h('button', 'btn', 'Comment jouer');
    this.wire(play, () => this.cb.play());
    this.wire(opts, () => this.openOptions());
    this.wire(ctr, () => this.openControls());
    this.wire(how, () => this.openHowTo());
    nav.append(play, opts, ctr, how);
    side.append(nav);
    const foot = h('div', 'foot');
    foot.innerHTML = `<div><kbd>ZQSD</kbd>/<kbd>WASD</kbd> bouger · <kbd>Souris</kbd> viser · <kbd>Clic</kbd> tirer · <kbd>Maj</kbd> sprint · <kbd>Ctrl</kbd> glisser</div><div>Étape 1 · vertical slice — tout est généré par code</div>`;
    side.append(foot);
    this.main.append(side);
  }

  private buildPause() {
    const side = h('div', 'side');
    side.innerHTML = `<h1 class="title logo" style="font-size:64px">${LOGO}</h1><div class="subtitle">Pause</div>`;
    const nav = h('nav');
    const resume = h('button', 'btn primary', 'Reprendre');
    const opts = h('button', 'btn', 'Options');
    const ctr = h('button', 'btn', 'Contrôles');
    const quit = h('button', 'btn', 'Quitter la partie');
    this.wire(resume, () => this.cb.resume());
    this.wire(opts, () => this.openOptions());
    this.wire(ctr, () => this.openControls());
    this.wire(quit, () => this.cb.quit(), 'back');
    nav.append(resume, opts, ctr, quit);
    side.append(nav);
    this.pause.append(side);
  }

  showMain(on: boolean) { this.fade(this.main, on); if (!on) this.closePanel(); }
  showPause(on: boolean) { this.fade(this.pause, on); if (!on) this.closePanel(); }
  get pauseVisible() { return !this.pause.classList.contains('hidden'); }
  get panelOpen() { return !!this.panel; }

  private fade(el: HTMLElement, on: boolean) {
    if (on) { el.classList.remove('hidden'); requestAnimationFrame(() => el.classList.add('show')); }
    else { el.classList.remove('show'); el.classList.add('hidden'); }
  }

  closePanel() { this.panel?.remove(); this.panel = null; }

  private openPanel(title: string): HTMLElement {
    this.closePanel();
    const p = h('div', 'panel');
    p.innerHTML = `<h2>${title}</h2>`;
    const close = h('button', 'btn close', '✕');
    close.style.fontSize = '20px';
    this.wire(close, () => this.closePanel(), 'back');
    p.append(close);
    this.ui.append(p);
    this.panel = p;
    return p;
  }

  private openOptions() {
    const p = this.openPanel('OPTIONS');
    const s = this.settings;
    const apply = () => this.cb.settingsChanged(s);
    const section = (t: string) => p.append(h('h3', '', t));
    const slider = (label: string, key: keyof Settings, min: number, max: number, step: number, fmt: (v: number) => string) => {
      const row = h('div', 'row');
      const val = h('span', 'val', fmt(s[key] as number));
      const input = h('input') as HTMLInputElement;
      input.type = 'range'; input.min = String(min); input.max = String(max); input.step = String(step); input.value = String(s[key]);
      input.addEventListener('input', () => { (s as unknown as Record<string, number>)[key] = Number(input.value); val.textContent = fmt(Number(input.value)); apply(); });
      const ctl = h('div', 'ctl'); ctl.append(input, val);
      row.append(h('span', '', label), ctl);
      p.append(row);
    };
    const seg = <T extends string | number>(label: string, key: keyof Settings, options: [T, string][]) => {
      const row = h('div', 'row');
      const box = h('div', 'seg');
      for (const [v, l] of options) {
        const b = h('button', s[key] === v ? 'on' : '', l);
        this.wire(b, () => { (s as unknown as Record<string, unknown>)[key] = v; box.querySelectorAll('button').forEach((x) => x.classList.remove('on')); b.classList.add('on'); apply(); });
        box.append(b);
      }
      row.append(h('span', '', label), box);
      p.append(row);
    };
    const toggle = (label: string, key: keyof Settings) => {
      const row = h('div', 'row');
      const t = h('input', 'toggle') as HTMLInputElement;
      t.type = 'checkbox'; t.checked = !!s[key];
      t.addEventListener('change', () => { (s as unknown as Record<string, boolean>)[key] = t.checked; apply(); });
      const ctl = h('div', 'ctl'); ctl.append(t);
      row.append(h('span', '', label), ctl);
      p.append(row);
    };
    section('Visée');
    slider('Sensibilité souris', 'sensitivity', 0.1, 4, 0.05, (v) => v.toFixed(2));
    slider('Sensibilité en visée', 'adsSensitivity', 0.3, 1.5, 0.05, (v) => `×${v.toFixed(2)}`);
    slider('Sensibilité manette', 'padSensitivity', 0.3, 3, 0.05, (v) => v.toFixed(2));
    toggle('Inverser l’axe vertical', 'invertY');
    slider('Champ de vision', 'fov', 80, 120, 1, (v) => `${v}°`);
    slider('Taille du réticule', 'crosshairSize', 0.5, 2, 0.1, (v) => `×${v.toFixed(1)}`);
    seg('Couleur du réticule', 'crosshairColor', [['#ffffff', 'Blanc'], ['#5dff3a', 'Vert'], ['#f4ff2b', 'Jaune'], ['#18e7ff', 'Cyan']]);
    section('Graphismes');
    seg('Qualité', 'quality', [['auto', 'Auto'], ['low', 'Bas'], ['medium', 'Moyen'], ['high', 'Haut'], ['ultra', 'Ultra']]);
    slider('Tremblement caméra', 'shake', 0, 1.5, 0.05, (v) => `${Math.round(v * 100)}%`);
    toggle('Réduire les flashs', 'reducedFlashes');
    slider('Taille du HUD', 'hudScale', 0.75, 1.4, 0.05, (v) => `×${v.toFixed(2)}`);
    toggle('Afficher les FPS', 'showFps');
    section('Audio');
    slider('Volume général', 'master', 0, 1, 0.01, (v) => `${Math.round(v * 100)}`);
    slider('Musique', 'music', 0, 1, 0.01, (v) => `${Math.round(v * 100)}`);
    slider('Effets', 'sfx', 0, 1, 0.01, (v) => `${Math.round(v * 100)}`);
    slider('Annonceur', 'voice', 0, 1, 0.01, (v) => `${Math.round(v * 100)}`);
    section('Partie (prochain match)');
    seg('Difficulté des bots', 'difficulty', (Object.keys(ROSTER.difficulties) as Difficulty[]).map((d) => [d, ROSTER.difficulties[d].label] as [Difficulty, string]));
    seg('Taille des équipes', 'teamSize', [[1, '1v1'], [2, '2v2'], [3, '3v3'], [4, '4v4'], [5, '5v5'], [6, '6v6']]);
  }

  private openControls() {
    const p = this.openPanel('CONTRÔLES');
    const rows: [string, string][] = [
      ['ZQSD / WASD', 'Se déplacer (AZERTY et QWERTY détectés)'], ['Souris', 'Viser'], ['Clic gauche', 'Tirer'], ['Clic droit', 'Visée précise'],
      ['Maj', 'Sprint (vers l’avant)'], ['Espace', 'Sauter'], ['Ctrl / C', 'S’accroupir · en sprint : glissade'], ['R', 'Purger la chaleur du blaster'],
      ['Tab', 'Tableau des scores'], ['Échap', 'Pause'], ['F3', 'Infos de debug'],
    ];
    const pad: [string, string][] = [['Stick G / D', 'Bouger / viser'], ['RT / LT', 'Tirer / viser'], ['A', 'Sauter'], ['B', 'S’accroupir / glisser'], ['X', 'Purger'], ['L3', 'Sprint'], ['Start', 'Pause'], ['Back', 'Scores']];
    p.append(h('h3', '', 'Clavier & souris'));
    const k = h('div', 'keys');
    for (const [a, b] of rows) k.innerHTML += `<kbd>${a}</kbd><span>${b}</span>`;
    p.append(k);
    p.append(h('h3', '', 'Manette'));
    const k2 = h('div', 'keys');
    for (const [a, b] of pad) k2.innerHTML += `<kbd>${a}</kbd><span>${b}</span>`;
    p.append(k2);
  }

  private openHowTo() {
    const p = this.openPanel('COMMENT JOUER');
    p.insertAdjacentHTML('beforeend', `
      <h3>Le but</h3><p style="font:600 17px var(--font-num);line-height:1.5;color:var(--ink)">Deux équipes, <span style="color:var(--cyan)">▲ CYAN</span> contre <span style="color:var(--magenta)">◆ MAGENTA</span>. Chaque gilet adverse éteint rapporte 1 point. Premiers à 30, ou meilleur score après 5 minutes.</p>
      <h3>Ton gilet</h3><p style="font:600 17px var(--font-num);line-height:1.5">Il se recharge seul après 3 s sans être touché. Capteurs : <b>poitrine</b> 20 · <b>dos</b> 30 · <b>épaules</b> 15 · <b>casque</b> 34 · <b>blaster</b> 10 + brouillage. Les jambes n’ont pas de capteur. À 0 : extinction 4 s, puis retour à la base.</p>
      <h3>Ton blaster</h3><p style="font:600 17px var(--font-num);line-height:1.5">Chaque tir coûte de l’énergie et chauffe. Purge avec <b>R</b> avant la surchauffe. L’énergie se recharge à ta <b>base</b> ou à la <b>borne orange</b> sous la plateforme centrale — exposée, mais rapide.</p>
      <h3>Astuces</h3><p style="font:600 17px var(--font-num);line-height:1.5">Accroupi = plus précis. Le dos vaut plus cher : prends les flancs. La plateforme voit tout… et tout le monde la voit.</p>`);
  }

  // ------------------------------------------------------------------ briefing + countdown
  briefing(on: boolean, mapName = '', bots = '', count = 0) {
    if (!on) { this.briefingEl?.remove(); this.briefingEl = null; return; }
    if (!this.briefingEl) {
      this.briefingEl = h('div', 'briefing');
      this.ui.append(this.briefingEl);
    }
    this.briefingEl.innerHTML = `<div class="mode">TEAM DEATHMATCH</div><div class="map">${esc(mapName.toUpperCase())}</div><div class="rules">Premiers à 30 désactivations · 5 minutes · ${esc(bots)}</div><div class="teams"><span class="t0">${TEAM_SHAPES[0]} ${TEAM_NAMES[0]}</span><span class="t1">${TEAM_NAMES[1]} ${TEAM_SHAPES[1]}</span></div><div class="count">${count > 0 ? count : 'GO'}</div>`;
  }

  // ------------------------------------------------------------------ end screen
  showEnd(sim: Simulation, me: Agent, onReplay: () => void, onMenu: () => void, xpGain: number) {
    this.hideEnd();
    const mode = sim.mode;
    const won = mode.winner === me.team, draw = mode.winner < 0;
    const e = h('div', 'endscreen');
    const all = [...sim.agents];
    const mvp = all.sort((a, b) => b.stats.score - a.stats.score)[0];
    const acc = me.stats.shots ? Math.round((100 * me.stats.hits) / me.stats.shots) : 0;
    const kd = (me.stats.deactivations / Math.max(1, me.stats.downs)).toFixed(2);
    const graph = this.graphSvg(mode.timeline, mode.def.scoreLimit);
    e.innerHTML = `
      <div class="wrap">
        <div class="result ${won ? 'win' : 'lose'}">${draw ? 'ÉGALITÉ' : won ? 'VICTOIRE' : 'DÉFAITE'}</div>
        <div class="final"><span class="t0">${TEAM_SHAPES[0]} ${mode.scores[0]}</span> &nbsp;—&nbsp; <span class="t1">${mode.scores[1]} ${TEAM_SHAPES[1]}</span></div>
        <div class="cards">
          <div class="card mvp" style="animation-delay:.1s"><div class="k">MVP</div><div class="v">${esc(mvp.name)}</div><div class="s">${mvp.stats.deactivations} désac. · ${mvp.stats.score} pts</div></div>
          <div class="card" style="animation-delay:.2s"><div class="k">Désactivations</div><div class="v">${me.stats.deactivations}</div><div class="s">ratio ${kd}</div></div>
          <div class="card" style="animation-delay:.3s"><div class="k">Précision</div><div class="v">${acc}%</div><div class="s">${me.stats.hits}/${me.stats.shots} tirs · ${me.stats.headshots} casques</div></div>
          <div class="card" style="animation-delay:.4s"><div class="k">Meilleure série</div><div class="v">${me.stats.bestStreak}</div><div class="s">${me.stats.backshots} tirs dans le dos</div></div>
        </div>
        <div class="graph">${graph}</div>
        <div class="xp">+${xpGain} XP</div>
        <div class="actions"></div>
      </div>`;
    const actions = e.querySelector('.actions')!;
    const again = h('button', 'btn primary', 'Encore une');
    const menu = h('button', 'btn', 'Menu');
    this.wire(again, onReplay);
    this.wire(menu, onMenu, 'back');
    actions.append(again, menu);
    this.ui.append(e);
    this.end = e;
  }
  hideEnd() { this.end?.remove(); this.end = null; }

  private graphSvg(tl: { t: number; s0: number; s1: number }[], limit: number): string {
    if (tl.length < 2) return '';
    const W = 1000, H = 130, T = Math.max(1, tl[tl.length - 1].t);
    const max = Math.max(limit * 0.5, ...tl.map((p) => Math.max(p.s0, p.s1)));
    const path = (k: 's0' | 's1') => tl.map((p, i) => `${i ? 'L' : 'M'}${((p.t / T) * W).toFixed(1)},${(H - 8 - (p[k] / max) * (H - 20)).toFixed(1)}`).join(' ');
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <path d="${path('s0')}" fill="none" stroke="#18e7ff" stroke-width="3" vector-effect="non-scaling-stroke" style="filter:drop-shadow(0 0 4px #18e7ff)"/>
      <path d="${path('s1')}" fill="none" stroke="#ff2bd6" stroke-width="3" vector-effect="non-scaling-stroke" style="filter:drop-shadow(0 0 4px #ff2bd6)"/>
    </svg>`;
  }
}
