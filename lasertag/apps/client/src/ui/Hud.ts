import * as THREE from 'three';
import { AgentState, GAME, WEAPONS, type Agent, type Simulation, type DamageZone } from '@neon/shared';
import { TEAM_HEX, TEAM_NAMES, TEAM_SHAPES } from '../render/neon.ts';

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', html = ''): HTMLElementTagNameMap[K] => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const fmtTime = (t: number) => {
  t = Math.max(0, Math.ceil(t));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};
const ZONE_LABEL: Record<DamageZone, string> = { chest: 'POITRINE', back: 'DOS', shoulder: 'ÉPAULE', head: 'CASQUE', blaster: 'BLASTER' };

const VEST_SVG = `
<svg viewBox="0 0 70 92">
  <circle class="suit" cx="35" cy="12" r="10"/>
  <circle class="z zh" cx="35" cy="4" r="3"/>
  <path class="suit" d="M14 26 Q35 18 56 26 L58 62 Q35 70 12 62 Z"/>
  <circle class="z zsl" cx="13" cy="28" r="6"/>
  <circle class="z zsr" cx="57" cy="28" r="6"/>
  <rect class="z zc" x="22" y="32" width="26" height="18" rx="3"/>
  <rect class="z zb" x="26" y="54" width="18" height="5" rx="2" opacity=".55"/>
  <rect class="z zbl" x="58" y="56" width="10" height="26" rx="2"/>
  <path class="suit" d="M20 66 L18 90 M50 66 L52 90" fill="none"/>
</svg>`;

export class Hud {
  readonly root = h('div', 'hud hidden');
  private scorebar = h('div', 'scorebar');
  private s0 = h('div', 'team t0');
  private s1 = h('div', 'team t1');
  private clock = h('div', 'clock', '5:00');
  private bar0 = h('i');
  private bar1 = h('i');
  private phaseEl = h('div', 'phase');
  private crosshair = h('div', 'crosshair', '<i class="l"></i><i class="r"></i><i class="t"></i><i class="b"></i><i class="c"></i>');
  private hitmarkerEl = h('div', 'hitmarker', '<svg viewBox="0 0 30 30"><line x1="2" y1="2" x2="10" y2="10" stroke="#fff" stroke-width="2.5"/><line x1="28" y1="2" x2="20" y2="10" stroke="#fff" stroke-width="2.5"/><line x1="2" y1="28" x2="10" y2="20" stroke="#fff" stroke-width="2.5"/><line x1="28" y1="28" x2="20" y2="20" stroke="#fff" stroke-width="2.5"/></svg>');
  private dmgdirs = h('div', 'dmgdirs');
  private dmgPool: { el: HTMLElement; angle: number; t: number }[] = [];
  private killfeedEl = h('div', 'killfeed');
  private center = h('div', 'center-msg');
  private vest = h('div', 'vest');
  private vestCharge!: HTMLElement;
  private vestBar!: HTMLElement;
  private vestBarWrap!: HTMLElement;
  private vestName!: HTMLElement;
  private vestStreak!: HTMLElement;
  private energy = h('div', 'energy');
  private eNum!: HTMLElement;
  private eBar!: HTMLElement;
  private hBar!: HTMLElement;
  private eState!: HTMLElement;
  private zonehint = h('div', 'zonehint');
  private shutdownEl = h('div', 'shutdown', '<div class="box"><div class="t">GILET DÉSACTIVÉ</div><div class="by"></div><div class="reboot"><i></i></div><div class="rt">RÉACTIVATION</div></div>');
  private vHit = h('div', 'vignette-hit');
  private vLow = h('div', 'vignette-low');
  private invFrame = h('div', 'invuln-frame');
  private markers = h('div', 'markers');
  private markerPool: HTMLElement[] = [];
  private scoreboardEl = h('div', 'scoreboard');
  private toastLayer = h('div');
  readonly debugEl = h('div', 'debug');
  private centerTimer = 0;
  private hitTimer = 0;
  private sbTimer = 0;
  private scoreboardOn = false;
  private team = 0;
  private lastScores = '';
  private zoneHitTimers = new Map<string, number>();
  private _v = new THREE.Vector3();

  constructor(parent: HTMLElement) {
    const r = this.root;
    this.scorebar.append(this.s0, this.clock, this.s1);
    const bars = h('div', 'bars');
    const b0 = h('div', 'b0'); b0.append(this.bar0);
    const b1 = h('div', 'b1'); b1.append(this.bar1);
    bars.append(b0, b1);
    this.scorebar.append(bars, this.phaseEl);
    this.vest.innerHTML = VEST_SVG + '<div class="info"><div class="streak"></div><div class="name"></div><div class="charge">100<small>%</small></div><div class="cbar"><i></i></div></div>';
    this.vestCharge = this.vest.querySelector('.charge')!;
    this.vestBar = this.vest.querySelector('.cbar i')!;
    this.vestBarWrap = this.vest.querySelector('.cbar')!;
    this.vestName = this.vest.querySelector('.name')!;
    this.vestStreak = this.vest.querySelector('.streak')!;
    this.energy.innerHTML = '<div class="num">100<small>NRG</small></div><div class="ebar"><i></i></div><div class="hbar"><i></i></div><div class="state"></div>';
    this.eNum = this.energy.querySelector('.num')!;
    this.eBar = this.energy.querySelector('.ebar i')!;
    this.hBar = this.energy.querySelector('.hbar i')!;
    this.eState = this.energy.querySelector('.state')!;
    for (let i = 0; i < 6; i++) {
      const el = h('div', 'dmgdir');
      this.dmgdirs.append(el);
      this.dmgPool.push({ el, angle: 0, t: 0 });
    }
    r.append(this.vHit, this.vLow, this.invFrame, this.markers, this.scorebar, this.crosshair, this.hitmarkerEl, this.dmgdirs,
      this.killfeedEl, this.center, this.toastLayer, this.vest, this.energy, this.zonehint, this.shutdownEl, this.scoreboardEl);
    parent.append(r, this.debugEl);
  }

  show(on: boolean) { this.root.classList.toggle('hidden', !on); }

  setTeam(team: number, name: string) {
    this.team = team;
    document.documentElement.style.setProperty('--team', TEAM_HEX[team]);
    document.documentElement.style.setProperty('--enemy', TEAM_HEX[1 - team]);
    this.s0.classList.toggle('mine', team === 0);
    this.s1.classList.toggle('mine', team === 1);
    this.vestName.textContent = `${TEAM_SHAPES[team]} ${name.toUpperCase()}`;
    this.lastScores = '';
  }

  setCrosshair(color: string, size: number) {
    this.crosshair.style.setProperty('--col', color);
    this.crosshair.style.setProperty('--len', `${7 * size}px`);
  }

  // ------------------------------------------------------------------ per-frame
  update(dt: number, sim: Simulation, me: Agent, camera: THREE.PerspectiveCamera, viewH: number, aimingAtEnemy: boolean, renderPos: (a: Agent, out: THREE.Vector3) => THREE.Vector3) {
    const mode = sim.mode;
    const scores = `${mode.scores[0]}|${mode.scores[1]}`;
    if (scores !== this.lastScores) {
      this.lastScores = scores;
      this.s0.innerHTML = `<span class="shape">${TEAM_SHAPES[0]}</span>${mode.scores[0]}`;
      this.s1.innerHTML = `${mode.scores[1]}<span class="shape">${TEAM_SHAPES[1]}</span>`;
      this.bar0.style.width = `${(100 * mode.scores[0]) / mode.def.scoreLimit}%`;
      this.bar1.style.width = `${(100 * mode.scores[1]) / mode.def.scoreLimit}%`;
    }
    this.clock.textContent = mode.phase === 'warmup' ? fmtTime(mode.def.timeLimit) : fmtTime(mode.timeLeft);
    this.clock.classList.toggle('hot', (mode.phase === 'playing' && mode.timeLeft <= 30) || mode.phase === 'overtime');
    this.phaseEl.textContent = mode.phase === 'overtime' ? 'PROLONGATION — POINT DÉCISIF' : mode.phase === 'warmup' ? 'ÉCHAUFFEMENT' : `PREMIERS À ${mode.def.scoreLimit}`;

    // crosshair gap from the real spread cone
    const spread = sim.spreadDeg(me) * Math.PI / 180;
    const px = Math.tan(spread) * (viewH / 2) / Math.tan((camera.fov * Math.PI) / 360);
    this.crosshair.style.setProperty('--gap', `${Math.max(3, px).toFixed(1)}px`);
    this.crosshair.classList.toggle('dim', me.sprinting || me.state !== AgentState.Active);
    this.crosshair.classList.toggle('enemy', aimingAtEnemy);

    // vest
    const v = Math.ceil(me.vest);
    this.vestCharge.innerHTML = `${v}<small>%</small>`;
    this.vestBar.style.width = `${me.vest}%`;
    this.vestBarWrap.classList.toggle('low', me.vest < 35);
    this.vestStreak.textContent = me.streak >= 2 ? `SÉRIE ×${me.streak}` : '';
    this.vLow.classList.toggle('on', me.state === AgentState.Active && me.vest < 35);
    this.invFrame.classList.toggle('on', me.invuln > 0);
    for (const [cls, t] of this.zoneHitTimers) {
      const nt = t - dt;
      if (nt <= 0) { this.zoneHitTimers.delete(cls); this.vest.querySelectorAll(`.${cls}`).forEach((e) => e.classList.remove('hit')); }
      else this.zoneHitTimers.set(cls, nt);
    }

    // energy
    const w = WEAPONS[me.weaponId];
    const e = Math.floor(me.energy);
    this.eNum.innerHTML = `${e}<small>NRG</small>`;
    this.eBar.style.width = `${(100 * me.energy) / w.energyMax}%`;
    this.hBar.style.width = `${(100 * me.heat) / w.heatMax}%`;
    this.energy.classList.toggle('low', me.energy < w.energyMax * 0.25);
    const st = me.overheated > 0 ? 'SURCHAUFFE' : me.venting > 0 ? 'PURGE…' : me.jammed > 0 ? 'BLASTER BROUILLÉ' : me.energy < w.energyPerShot ? 'VIDE — RECHARGE À LA BASE' : me.heat > w.heatMax * 0.7 ? '[R] PURGER' : '';
    this.eState.textContent = st;
    this.eState.classList.toggle('vent', me.venting > 0);

    // recharge zones
    const zone = me.state === AgentState.Active ? sim.rechargeZone(me) : null;
    const charging = zone && (me.energy < w.energyMax - 0.5 || me.vest < GAME.vest.maxCharge - 0.5);
    this.zonehint.classList.toggle('on', !!charging);
    this.zonehint.classList.toggle('station', zone === 'station');
    this.zonehint.textContent = zone === 'station' ? '⚡ BORNE — RECHARGE' : '⚡ BASE — RECHARGE';

    // shutdown overlay
    const down = me.state === AgentState.Down;
    this.shutdownEl.classList.toggle('on', down);
    if (down) {
      const k = 1 - me.downTimer / GAME.vest.shutdownTime;
      (this.shutdownEl.querySelector('.reboot i') as HTMLElement).style.width = `${k * 100}%`;
      (this.shutdownEl.querySelector('.rt') as HTMLElement).textContent = `RÉACTIVATION ${Math.max(0, me.downTimer).toFixed(1)}s`;
    }

    // damage directions
    for (const d of this.dmgPool) {
      if (d.t > 0) {
        d.t -= dt;
        // keep pointing at the source as we turn
        const rel = d.angle - me.yaw;
        d.el.style.transform = `rotate(${-rel}rad)`;
        if (d.t <= 0) d.el.classList.remove('on');
      }
    }

    // ally markers
    let mi = 0;
    for (const a of sim.agents) {
      if (a === me || a.team !== me.team) continue;
      const p = renderPos(a, this._v);
      p.y += 2.15;
      p.project(camera);
      if (p.z > 1 || Math.abs(p.x) > 1.1 || Math.abs(p.y) > 1.1) continue;
      let el = this.markerPool[mi];
      if (!el) { el = h('div', 'marker'); this.markers.append(el); this.markerPool.push(el); }
      el.style.display = '';
      el.style.left = `${((p.x + 1) / 2) * 100}%`;
      el.style.top = `${((1 - p.y) / 2) * 100}%`;
      const label = a.state === AgentState.Down ? `${a.name} ⏻` : a.name;
      if (el.textContent !== label) el.textContent = label;
      el.classList.toggle('down', a.state === AgentState.Down);
      mi++;
    }
    for (let k = mi; k < this.markerPool.length; k++) this.markerPool[k].style.display = 'none';

    if (this.centerTimer > 0) { this.centerTimer -= dt; if (this.centerTimer <= 0) this.center.innerHTML = ''; }
    if (this.hitTimer > 0) { this.hitTimer -= dt; if (this.hitTimer <= 0) this.vHit.classList.remove('on'); }
    if (this.scoreboardOn) { this.sbTimer -= dt; if (this.sbTimer <= 0) { this.renderScoreboard(sim, me); this.sbTimer = 0.4; } }
  }

  // ------------------------------------------------------------------ events
  hitmarker(kind: 'hit' | 'head' | 'kill') {
    const el = this.hitmarkerEl;
    el.classList.remove('show', 'kill', 'head');
    void el.offsetWidth;
    el.classList.add('show');
    if (kind !== 'hit') el.classList.add(kind);
  }

  hurt(zone: DamageZone, worldAngle: number) {
    this.vHit.classList.add('on');
    this.hitTimer = 0.12;
    const cls = zone === 'head' ? 'zh' : zone === 'chest' ? 'zc' : zone === 'back' ? 'zb' : zone === 'blaster' ? 'zbl' : 'zsl';
    const els = zone === 'shoulder' ? ['zsl', 'zsr'] : [cls];
    for (const c of els) { this.vest.querySelectorAll(`.${c}`).forEach((e) => e.classList.add('hit')); this.zoneHitTimers.set(c, 0.18); }
    const slot = this.dmgPool.reduce((a, b) => (a.t < b.t ? a : b));
    slot.angle = worldAngle;
    slot.t = 1.1;
    slot.el.classList.add('on');
  }

  killfeed(killer: Agent, victim: Agent, zone: DamageZone, meId: number) {
    const row = h('div', `kf${killer.id === meId || victim.id === meId ? ' me' : ''}`);
    const icon = zone === 'head' ? '◎' : zone === 'back' ? '↩' : zone === 'blaster' ? '⌁' : '⟶';
    row.innerHTML = `<span class="k${killer.team}">${esc(killer.name)}</span><span class="icon">${icon}</span><span class="k${victim.team}">${esc(victim.name)}</span>`;
    this.pushFeed(row);
  }

  bark(a: Agent, text: string) {
    const row = h('div', 'kf bark');
    row.innerHTML = `<span class="k${a.team}">${esc(a.name)}</span> « ${esc(text)} »`;
    this.pushFeed(row);
  }

  private pushFeed(row: HTMLElement) {
    this.killfeedEl.prepend(row);
    while (this.killfeedEl.children.length > 6) this.killfeedEl.lastElementChild!.remove();
    setTimeout(() => row.classList.add('fade'), 5500);
    setTimeout(() => row.remove(), 6000);
  }

  toast(text: string, team = false) {
    const el = h('div', `toast${team ? ' team' : ''}`);
    el.textContent = text;
    this.toastLayer.append(el);
    setTimeout(() => el.remove(), 1700);
  }

  points(text: string) {
    const el = h('div', 'points');
    el.textContent = text;
    this.toastLayer.append(el);
    setTimeout(() => el.remove(), 1000);
  }

  message(big: string, small = '', time = 2) {
    this.center.innerHTML = `<div class="big">${esc(big)}</div>${small ? `<div class="small">${esc(small)}</div>` : ''}`;
    this.centerTimer = time;
  }

  shutdownBy(killer: Agent | null, zone: DamageZone) {
    const by = this.shutdownEl.querySelector('.by') as HTMLElement;
    by.innerHTML = killer ? `éteint par <b>${esc(killer.name)}</b> · ${ZONE_LABEL[zone]}` : '';
  }

  setScoreboard(on: boolean, sim?: Simulation, me?: Agent) {
    this.scoreboardOn = on;
    this.scoreboardEl.classList.toggle('on', on);
    if (on && sim && me) { this.renderScoreboard(sim, me); this.sbTimer = 0.4; }
  }

  renderScoreboard(sim: Simulation, me: Agent) {
    const mode = sim.mode;
    let html = `<div class="head"><b>THE MAZE</b><span>TEAM DEATHMATCH · ${fmtTime(mode.timeLeft)}</span></div>`;
    for (const t of [0, 1]) {
      const agents = sim.agents.filter((a) => a.team === t).sort((a, b) => b.stats.score - a.stats.score);
      html += `<div class="sb-team t${t}"><div class="th"><span>${TEAM_SHAPES[t]} ${TEAM_NAMES[t]}</span><span>${mode.scores[t]}</span></div>`;
      html += '<div class="sb-row hdr"><span class="n">JOUEUR</span><span>DÉSAC.</span><span>ÉTEINT</span><span>PRÉC.</span><span>SÉRIE</span><span>SCORE</span></div>';
      for (const a of agents) {
        const acc = a.stats.shots ? Math.round((100 * a.stats.hits) / a.stats.shots) : 0;
        html += `<div class="sb-row${a.id === me.id ? ' me' : ''}"><span class="n">${esc(a.name)}${a.isBot ? '<span class="bot">BOT</span>' : ''}${a.state === AgentState.Down ? '<span class="dead">OFF</span>' : ''}</span><span>${a.stats.deactivations}</span><span>${a.stats.downs}</span><span>${acc}%</span><span>${a.stats.bestStreak}</span><span>${a.stats.score}</span></div>`;
      }
      html += '</div>';
    }
    this.scoreboardEl.innerHTML = html;
  }

  clearFeed() { this.killfeedEl.innerHTML = ''; this.center.innerHTML = ''; this.toastLayer.innerHTML = ''; }
}
