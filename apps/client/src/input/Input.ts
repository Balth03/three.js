/**
 * Abstract input: actions with analog values, fed by keyboard (physical key codes => AZERTY/QWERTY agnostic),
 * mouse and gamepads. Touch can be added later as another source writing into the same action table.
 */
export type Action =
  | 'throttle' | 'brake' | 'steerLeft' | 'steerRight' | 'handbrake' | 'shiftUp' | 'shiftDown' | 'horn' | 'lights'
  | 'indicatorLeft' | 'indicatorRight' | 'camera' | 'reset' | 'interact' | 'phone' | 'map' | 'photo' | 'pause'
  | 'lookBack' | 'radio' | 'wipers' | 'debug' | 'timeFast' | 'weather' | 'hazard';

export type Bindings = Record<Action, string[]>;

export const DEFAULT_BINDINGS: Bindings = {
  throttle: ['KeyW', 'ArrowUp'],
  brake: ['KeyS', 'ArrowDown'],
  steerLeft: ['KeyA', 'ArrowLeft'],
  steerRight: ['KeyD', 'ArrowRight'],
  handbrake: ['Space'],
  shiftUp: ['ShiftLeft'],
  shiftDown: ['ControlLeft'],
  horn: ['KeyH'],
  lights: ['KeyL'],
  indicatorLeft: ['KeyQ'],
  indicatorRight: ['KeyE'],
  camera: ['KeyC'],
  reset: ['KeyR'],
  interact: ['KeyF'],
  phone: ['Tab'],
  map: ['KeyM'],
  photo: ['KeyP'],
  pause: ['Escape'],
  lookBack: ['KeyB'],
  radio: ['KeyN'],
  wipers: ['KeyI'],
  debug: ['F3'],
  timeFast: ['KeyT'],
  weather: ['KeyY'],
  hazard: ['KeyX'],
};

const ACTIONS = Object.keys(DEFAULT_BINDINGS) as Action[];

export class Input {
  bindings: Bindings;
  private keys = new Set<string>();
  private pressedThisFrame = new Set<Action>();
  private keyToActions = new Map<string, Action[]>();
  readonly value: Record<Action, number> = Object.fromEntries(ACTIONS.map((a) => [a, 0])) as Record<Action, number>;
  private prevValue: Record<Action, number> = Object.fromEntries(ACTIONS.map((a) => [a, 0])) as Record<Action, number>;
  /** Analog steering -1..1 (+ left), throttle/brake 0..1 */
  steer = 0;
  throttle = 0;
  brake = 0;
  /** True when the current steering comes from a digital source. */
  digitalSteer = true;
  mouseDX = 0;
  mouseDY = 0;
  mouseDown = false;
  wheel = 0;
  gamepadActive = false;
  lastDevice: 'keyboard' | 'gamepad' = 'keyboard';
  private layoutMap: Map<string, string> | null = null;
  deadzone = 0.12;
  private rumbleUntil = 0;

  constructor(private target: HTMLElement) {
    this.bindings = structuredClone(DEFAULT_BINDINGS);
    try {
      const saved = localStorage.getItem('taxi.bindings');
      if (saved) Object.assign(this.bindings, JSON.parse(saved));
    } catch { /* ignore */ }
    this.rebuild();
    window.addEventListener('keydown', (e) => {
      if (e.repeat) { if (this.keyToActions.has(e.code)) e.preventDefault(); return; }
      this.keys.add(e.code);
      this.lastDevice = 'keyboard';
      const acts = this.keyToActions.get(e.code);
      if (acts) { e.preventDefault(); for (const a of acts) this.pressedThisFrame.add(a); }
    });
    window.addEventListener('keyup', (e) => { this.keys.delete(e.code); });
    window.addEventListener('blur', () => this.keys.clear());
    target.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === target || this.mouseDown) { this.mouseDX += e.movementX; this.mouseDY += e.movementY; }
    });
    target.addEventListener('mousedown', () => { this.mouseDown = true; });
    window.addEventListener('mouseup', () => { this.mouseDown = false; });
    target.addEventListener('wheel', (e) => { this.wheel += Math.sign(e.deltaY); }, { passive: true });
    target.addEventListener('contextmenu', (e) => e.preventDefault());
    const kb = (navigator as unknown as { keyboard?: { getLayoutMap(): Promise<Map<string, string>> } }).keyboard;
    kb?.getLayoutMap().then((m) => { this.layoutMap = m; }).catch(() => {});
  }

  rebuild(): void {
    this.keyToActions.clear();
    for (const a of ACTIONS) for (const k of this.bindings[a]) {
      const l = this.keyToActions.get(k) ?? [];
      l.push(a);
      this.keyToActions.set(k, l);
    }
  }

  saveBindings(): void { localStorage.setItem('taxi.bindings', JSON.stringify(this.bindings)); this.rebuild(); }

  /** Display label of a key code for the active keyboard layout (e.g. KeyW -> "Z" on AZERTY). */
  label(action: Action): string {
    const code = this.bindings[action][0];
    if (!code) return '—';
    const m = this.layoutMap?.get(code);
    if (m) return m.toUpperCase();
    if (code.startsWith('Key')) return code.slice(3);
    if (code.startsWith('Digit')) return code.slice(5);
    const names: Record<string, string> = { Space: 'Espace', ShiftLeft: 'Maj', ControlLeft: 'Ctrl', Escape: 'Échap', Tab: 'Tab', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' };
    return names[code] ?? code;
  }

  /** Was the action pressed during the last frame (edge)? */
  pressed(a: Action): boolean { return this.pressedThisFrame.has(a) || (this.value[a] > 0.5 && this.prevValue[a] <= 0.5 && this.gamepadActive); }
  held(a: Action): boolean { return this.value[a] > 0.5; }

  rumble(strong: number, weak: number, ms: number): void {
    const now = performance.now();
    if (now < this.rumbleUntil - 30) return;
    this.rumbleUntil = now + ms;
    for (const gp of navigator.getGamepads?.() ?? []) {
      const act = (gp as unknown as { vibrationActuator?: { playEffect(t: string, p: object): Promise<unknown> } })?.vibrationActuator;
      act?.playEffect('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, strong), weakMagnitude: Math.min(1, weak) }).catch(() => {});
    }
  }

  /** Poll devices; call once per frame before game logic. */
  update(): void {
    for (const a of ACTIONS) { this.prevValue[a] = this.value[a]; let v = 0; for (const k of this.bindings[a]) if (this.keys.has(k)) v = 1; this.value[a] = v; }
    let steer = (this.value.steerLeft ? 1 : 0) - (this.value.steerRight ? 1 : 0);
    let throttle = this.value.throttle, brake = this.value.brake;
    let digital = true;
    this.gamepadActive = false;
    for (const gp of navigator.getGamepads?.() ?? []) {
      if (!gp || !gp.connected) continue;
      const ax = gp.axes[0] ?? 0;
      const rt = gp.buttons[7]?.value ?? 0, lt = gp.buttons[6]?.value ?? 0;
      const any = Math.abs(ax) > this.deadzone || rt > 0.05 || lt > 0.05 || gp.buttons.some((b) => b.pressed);
      if (any) { this.lastDevice = 'gamepad'; }
      if (this.lastDevice !== 'gamepad') continue;
      this.gamepadActive = true;
      // radial deadzone + response curve for fine control
      const dz = this.deadzone;
      const mag = Math.abs(ax);
      const sx = mag < dz ? 0 : Math.sign(ax) * Math.pow((mag - dz) / (1 - dz), 1.6);
      if (sx !== 0) { steer = -sx; digital = false; }
      if (rt > 0.02) throttle = Math.max(throttle, rt);
      if (lt > 0.02) brake = Math.max(brake, lt);
      const b = (i: number) => (gp.buttons[i]?.pressed ? 1 : 0);
      this.value.handbrake = Math.max(this.value.handbrake, b(0)); // A / Cross
      this.value.horn = Math.max(this.value.horn, b(10) || b(3) ? 1 : 0); // L3 or Y
      this.value.camera = Math.max(this.value.camera, b(5)); // RB
      this.value.lookBack = Math.max(this.value.lookBack, b(4)); // LB
      this.value.interact = Math.max(this.value.interact, b(2)); // X / Square
      this.value.reset = Math.max(this.value.reset, b(8)); // View/Select
      this.value.pause = Math.max(this.value.pause, b(9)); // Menu/Start
      this.value.lights = Math.max(this.value.lights, b(12)); // D-pad up
      this.value.indicatorLeft = Math.max(this.value.indicatorLeft, b(14));
      this.value.indicatorRight = Math.max(this.value.indicatorRight, b(15));
      this.value.radio = Math.max(this.value.radio, b(13));
      this.value.shiftUp = Math.max(this.value.shiftUp, b(1)); // B / Circle
      this.value.shiftDown = Math.max(this.value.shiftDown, b(11) ? 1 : 0);
      // right stick: look
      const rx = gp.axes[2] ?? 0, ry = gp.axes[3] ?? 0;
      if (Math.abs(rx) > 0.15) this.mouseDX += rx * 12;
      if (Math.abs(ry) > 0.15) this.mouseDY += ry * 8;
    }
    this.steer = steer; this.throttle = throttle; this.brake = brake; this.digitalSteer = digital;
  }

  /** Call at the end of a frame. */
  endFrame(): void {
    this.pressedThisFrame.clear();
    this.mouseDX = 0; this.mouseDY = 0; this.wheel = 0;
  }

  isDown(code: string): boolean { return this.keys.has(code); }
}
