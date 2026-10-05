import { Btn } from '@neon/shared';

/**
 * Abstract actions over keyboard/mouse and gamepad. Gameplay code only reads actions, so touch controls can be
 * added later as another source. Keys are bound by physical position (KeyboardEvent.code), so WASD on QWERTY
 * and ZQSD on AZERTY both work without any setting.
 */
export type Action =
  | 'forward' | 'back' | 'left' | 'right' | 'jump' | 'crouch' | 'sprint' | 'fire' | 'aim' | 'vent'
  | 'interact' | 'scoreboard' | 'pause' | 'debug' | 'photo';

export const DEFAULT_BINDINGS: Record<Action, string[]> = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  jump: ['Space'],
  crouch: ['ControlLeft', 'KeyC'],
  sprint: ['ShiftLeft'],
  fire: ['Mouse0'],
  aim: ['Mouse2'],
  vent: ['KeyR'],
  interact: ['KeyE'],
  scoreboard: ['Tab'],
  pause: ['Escape'],
  debug: ['F3'],
  photo: ['KeyP'],
};

const BTN_OF: Partial<Record<Action, number>> = {
  fire: Btn.Fire, aim: Btn.Aim, jump: Btn.Jump, crouch: Btn.Crouch, sprint: Btn.Sprint, vent: Btn.Vent, interact: Btn.Interact,
};

export class Input {
  private readonly down = new Set<string>();
  private bindings: Record<Action, string[]> = structuredClone(DEFAULT_BINDINGS);
  private codeToActions = new Map<string, Action[]>();
  private latched = 0;
  private lookDX = 0;
  private lookDY = 0;
  private padLookX = 0;
  private padLookY = 0;
  private padMoveX = 0;
  private padMoveY = 0;
  private padButtons = 0;
  private padPrev: boolean[] = [];
  private listeners: ((a: Action) => void)[] = [];
  private releaseListeners: ((a: Action) => void)[] = [];
  enabled = true;
  locked = false;
  lastDevice: 'kbm' | 'pad' = 'kbm';
  padIndex = -1;

  constructor(private readonly target: HTMLElement) {
    this.rebuild();
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Tab' || e.code === 'F3' || (e.code === 'Space' && this.locked)) e.preventDefault();
      if (e.repeat) return;
      this.press(e.code);
    });
    window.addEventListener('keyup', (e) => this.release(e.code));
    window.addEventListener('blur', () => { for (const c of [...this.down]) this.release(c); });
    target.addEventListener('mousedown', (e) => { if (this.locked) this.press('Mouse' + e.button); });
    window.addEventListener('mouseup', (e) => this.release('Mouse' + e.button));
    target.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      // ignore absurd spikes some browsers emit when (re)locking
      if (Math.abs(e.movementX) > 400 || Math.abs(e.movementY) > 400) return;
      this.lookDX += e.movementX;
      this.lookDY += e.movementY;
      this.lastDevice = 'kbm';
    });
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.target;
      if (!this.locked) for (const c of [...this.down]) if (c.startsWith('Mouse')) this.release(c);
    });
    window.addEventListener('gamepadconnected', (e) => { this.padIndex = e.gamepad.index; });
  }

  setBindings(b: Partial<Record<Action, string[]>>) {
    this.bindings = { ...structuredClone(DEFAULT_BINDINGS), ...b };
    this.rebuild();
  }
  private rebuild() {
    this.codeToActions.clear();
    for (const [a, codes] of Object.entries(this.bindings) as [Action, string[]][]) {
      for (const c of codes) {
        const arr = this.codeToActions.get(c) ?? [];
        arr.push(a);
        this.codeToActions.set(c, arr);
      }
    }
  }

  onAction(fn: (a: Action) => void) { this.listeners.push(fn); }
  onRelease(fn: (a: Action) => void) { this.releaseListeners.push(fn); }

  private press(code: string) {
    if (this.down.has(code)) return;
    this.down.add(code);
    this.lastDevice = 'kbm';
    for (const a of this.codeToActions.get(code) ?? []) {
      const b = BTN_OF[a];
      if (b && this.enabled) this.latched |= b;
      for (const l of this.listeners) l(a);
    }
  }
  private release(code: string) {
    if (!this.down.delete(code)) return;
    for (const a of this.codeToActions.get(code) ?? []) for (const l of this.releaseListeners) l(a);
  }

  isDown(a: Action): boolean {
    for (const c of this.bindings[a]) if (this.down.has(c)) return true;
    return false;
  }

  async lock() {
    if (this.locked) return;
    try {
      await (this.target.requestPointerLock as (o?: { unadjustedMovement?: boolean }) => Promise<void>)({ unadjustedMovement: true });
    } catch {
      try { await this.target.requestPointerLock(); } catch { /* user gesture required */ }
    }
  }
  unlock() { if (document.pointerLockElement) document.exitPointerLock(); }

  /** Poll the gamepad once per frame. Returns stick look rates (rad/s scale) via consumeLook. */
  pollGamepad(dt: number) {
    const pads = navigator.getGamepads?.() ?? [];
    const pad = this.padIndex >= 0 ? pads[this.padIndex] : pads.find((p) => p) ?? null;
    if (!pad) { this.padMoveX = this.padMoveY = this.padLookX = this.padLookY = 0; this.padButtons = 0; return; }
    this.padIndex = pad.index;
    const dz = (x: number, y: number, d = 0.15): [number, number] => {
      const m = Math.hypot(x, y);
      if (m < d) return [0, 0];
      const k = Math.min(1, (m - d) / (1 - d)) / m;
      return [x * k, y * k];
    };
    const [mx, my] = dz(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
    const [lx, ly] = dz(pad.axes[2] ?? 0, pad.axes[3] ?? 0, 0.12);
    this.padMoveX = mx; this.padMoveY = -my;
    // quadratic response curve for fine aiming
    const curve = (v: number) => Math.sign(v) * v * v;
    this.padLookX = curve(lx) * dt;
    this.padLookY = curve(ly) * dt;
    const b = (i: number) => (pad.buttons[i]?.value ?? 0) > 0.35;
    let bits = 0;
    if (b(7)) bits |= Btn.Fire;
    if (b(6)) bits |= Btn.Aim;
    if (b(0)) bits |= Btn.Jump;
    if (b(1)) bits |= Btn.Crouch;
    if (b(10)) bits |= Btn.Sprint;
    if (b(2)) bits |= Btn.Vent;
    if (b(3)) bits |= Btn.Interact;
    if (bits || mx || my || lx || ly) this.lastDevice = 'pad';
    const edges: [number, Action][] = [[0, 'jump'], [9, 'pause'], [8, 'scoreboard']];
    for (const [i, a] of edges) {
      const now = b(i);
      if (now && !this.padPrev[i]) { for (const l of this.listeners) l(a); if (a === 'jump') this.latched |= Btn.Jump; }
      if (!now && this.padPrev[i]) for (const l of this.releaseListeners) l(a);
      this.padPrev[i] = now;
    }
    this.padButtons = bits;
  }

  rumble(strong: number, weak: number, ms: number) {
    const pads = navigator.getGamepads?.() ?? [];
    const pad = this.padIndex >= 0 ? pads[this.padIndex] : null;
    const act = (pad as unknown as { vibrationActuator?: { playEffect: (t: string, o: object) => Promise<unknown> } } | null)?.vibrationActuator;
    act?.playEffect('dual-rumble', { duration: ms, strongMagnitude: strong, weakMagnitude: weak }).catch(() => undefined);
  }

  /** Mouse delta (pixels) accumulated since last call. */
  consumeMouse(out: { x: number; y: number }) {
    out.x = this.lookDX; out.y = this.lookDY;
    this.lookDX = 0; this.lookDY = 0;
    return out;
  }
  /** Gamepad look this frame (already scaled by dt). */
  padLook(out: { x: number; y: number }) { out.x = this.padLookX; out.y = this.padLookY; return out; }

  moveAxes(out: { x: number; y: number }) {
    let x = (this.isDown('right') ? 1 : 0) - (this.isDown('left') ? 1 : 0);
    let y = (this.isDown('forward') ? 1 : 0) - (this.isDown('back') ? 1 : 0);
    if (Math.abs(this.padMoveX) + Math.abs(this.padMoveY) > Math.abs(x) + Math.abs(y)) { x = this.padMoveX; y = this.padMoveY; }
    out.x = x; out.y = y;
    return out;
  }

  /** Held buttons + presses latched since the last tick (so a quick tap is never lost between ticks). */
  buttons(): number {
    if (!this.enabled) return 0;
    let b = this.padButtons | this.latched;
    for (const [a, bit] of Object.entries(BTN_OF) as [Action, number][]) if (this.isDown(a)) b |= bit;
    return b;
  }
  clearLatched() { this.latched = 0; }
}
