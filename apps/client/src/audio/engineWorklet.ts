// Player-vehicle synthesiser running in an AudioWorklet: engine + intake/turbo + EV whine + tyres + road.
//
// The processor is written as a normal TypeScript function and stringified with Function#toString()
// at runtime; the resulting JS is loaded through a Blob URL so it works in Vite dev, in production
// builds and offline. The function body must therefore be fully self-contained (no imports, no
// references to module-scope identifiers other than the AudioWorkletGlobalScope globals declared below).
//
// Output: ONE output with 4 channels
//   0: exhaust / engine block       1: intake, turbo, blow-off, electric-motor whine
//   2: tyre squeal & scrub          3: road: rolling noise, cobbles, gravel, grass, wet hiss, suspension thumps

export const VEHICLE_PROCESSOR_NAME = 'taxi-vehicle-synth';

/** Parameter names (k-rate). Must match the list inside workletMain(). */
export const VEHICLE_PARAMS = [
  'rpm', 'throttle', 'load', 'shift', 'speed', 'ev',
  'squealF', 'squealR', 'scrub', 'scrubKind',
  'cobble', 'gravel', 'grass', 'thump', 'wet',
  'idleRpm', 'maxRpm', 'cyl', 'active',
] as const;
export type VehicleParamName = (typeof VEHICLE_PARAMS)[number];

// Globals of the AudioWorkletGlobalScope (module-scoped declarations, they do not leak into the app).
declare const sampleRate: number;
declare class AudioWorkletProcessor {
  readonly port: MessagePort;
  constructor();
}
declare function registerProcessor(name: string, ctor: unknown): void;

function workletMain(): void {
  const SR: number = sampleRate;
  const INV_SR = 1 / SR;
  const TWO_PI = Math.PI * 2;

  // ---- sine table (phase in turns, [0,1)) ------------------------------------------------------
  const TAB = 4096;
  const sinTab = new Float32Array(TAB + 1);
  for (let i = 0; i <= TAB; i++) sinTab[i] = Math.sin((i / TAB) * TWO_PI);
  const sinp = (p: number): number => {
    const x = p * TAB;
    const i = x | 0;
    const a = sinTab[i];
    return a + (sinTab[i + 1] - a) * (x - i);
  };
  const clamp = (x: number, a: number, b: number): number => (x < a ? a : x > b ? b : x);
  const kc = (blk: number, tau: number): number => 1 - Math.exp(-blk / tau);
  const sstep = (e0: number, e1: number, x: number): number => {
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  class Biquad {
    b0 = 1; b1 = 0; b2 = 0; a1 = 0; a2 = 0; z1 = 0; z2 = 0;
    lp(f: number, q: number): void {
      const w = TWO_PI * clamp(f, 10, SR * 0.45) * INV_SR;
      const cw = Math.cos(w), al = Math.sin(w) / (2 * q), a0 = 1 / (1 + al);
      this.b0 = (1 - cw) * 0.5 * a0; this.b1 = (1 - cw) * a0; this.b2 = this.b0;
      this.a1 = -2 * cw * a0; this.a2 = (1 - al) * a0;
    }
    hp(f: number, q: number): void {
      const w = TWO_PI * clamp(f, 10, SR * 0.45) * INV_SR;
      const cw = Math.cos(w), al = Math.sin(w) / (2 * q), a0 = 1 / (1 + al);
      this.b0 = (1 + cw) * 0.5 * a0; this.b1 = -(1 + cw) * a0; this.b2 = this.b0;
      this.a1 = -2 * cw * a0; this.a2 = (1 - al) * a0;
    }
    /** band-pass, constant 0 dB peak gain */
    bp(f: number, q: number): void {
      const w = TWO_PI * clamp(f, 10, SR * 0.45) * INV_SR;
      const cw = Math.cos(w), al = Math.sin(w) / (2 * q), a0 = 1 / (1 + al);
      this.b0 = al * a0; this.b1 = 0; this.b2 = -al * a0;
      this.a1 = -2 * cw * a0; this.a2 = (1 - al) * a0;
    }
    run(x: number): number {
      const y = this.b0 * x + this.z1;
      this.z1 = this.b1 * x - this.a1 * y + this.z2;
      this.z2 = this.b2 * x - this.a2 * y;
      return y;
    }
    reset(): void { this.z1 = 0; this.z2 = 0; }
  }

  const NAMES = [
    'rpm', 'throttle', 'load', 'shift', 'speed', 'ev',
    'squealF', 'squealR', 'scrub', 'scrubKind',
    'cobble', 'gravel', 'grass', 'thump', 'wet',
    'idleRpm', 'maxRpm', 'cyl', 'active',
  ];
  const DEFAULTS: Record<string, number> = { rpm: 800, idleRpm: 800, maxRpm: 6500, cyl: 4, active: 1 };

  // Additive partials, as multiples of the FIRING frequency. For a 4-cyl (firing = crank order 2)
  // these are crank orders 0.5, 1, 1.5, 2, 3, 4, 6, 8.
  const ORDERS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];
  const AMP_BASE = [0.07, 0.2, 0.06, 1.0, 0.14, 0.42, 0.16, 0.06];
  const NP = ORDERS.length;

  class VehicleProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors(): Array<Record<string, unknown>> {
      return NAMES.map((name) => ({
        name, defaultValue: DEFAULTS[name] ?? 0, minValue: -100000, maxValue: 100000, automationRate: 'k-rate',
      }));
    }

    // smoothed controls
    rpm = 800; thr = 0; load = 0; shift = 0; speed = 0; ev = 0; evS = 0;
    sqF = 0; sqR = 0; scrub = 0; scrubKind = 0; cob = 0; grav = 0; grass = 0; wet = 0;
    thrSlow = 0;
    // interpolated gains (previous block values)
    gEng = 0; gIntake = 0; gSqF = 0; gSqR = 0; gRoll = 0; gCob = 0;
    // rng
    seed = 0x2545f491;
    nseed = 0x1b873593;
    // engine
    cyc = 0; lastK = -1; fireAmp = 0; nEnv = 0;
    cylVar = new Float32Array(16);
    addPh = new Float64Array(NP);
    addAmp = new Float32Array(NP);
    dcX = 0; dcY = 0;
    comb = new Float32Array(2048); combIdx = 0; combLp = 0; combD = 500;
    exLp1 = new Biquad(); exLp2 = new Biquad(); body = new Biquad(); burstBp = new Biquad();
    limCount = 0; limGate = 1;
    popEnv = 0;
    // intake / turbo / ev
    inBp = new Biquad(); inducBp = new Biquad(); turboBp = new Biquad(); bovBp = new Biquad();
    spool = 0; turboPh = 0; bovEnv = 0; evPh1 = 0; evPh2 = 0; evPh3 = 0;
    // tyres
    sqPh = new Float64Array(6); sqFm = new Float32Array(2); sqFmT = new Float32Array(2);
    sqAm = new Float32Array(2); sqAmT = new Float32Array(2);
    sqBpF = new Biquad(); sqBpR = new Biquad(); scrubBp = new Biquad(); scrubLp = new Biquad(); crunchEnv = 0;
    // road
    rollBp = new Biquad(); rumbleLp = new Biquad(); wetHp = new Biquad();
    cobBody = new Biquad(); cobSlap = new Biquad(); gravBp = new Biquad(); grassLp = new Biquad();
    cobPh0 = 0; cobPh1 = 0.37; cobLen0 = 0.13; cobLen1 = 0.13; cobEnv = 0; gravEnv = 0;
    thumpPrev = 0; thEnv = 0; thNoise = 0; thPh = 0; thLp = new Biquad();

    constructor() {
      super();
      for (let i = 0; i < 16; i++) this.cylVar[i] = this.rnd();
      for (let i = 0; i < NP; i++) this.addPh[i] = this.rnd01();
      this.body.bp(115, 1.6);
      this.cobBody.bp(85, 3.5);
      this.cobSlap.bp(650, 1.2);
      this.gravBp.bp(2600, 0.8);
      this.grassLp.lp(500, 0.7);
      this.rumbleLp.lp(140, 0.7);
      this.wetHp.hp(3200, 0.7);
      this.thLp.lp(260, 0.7);
      this.scrubLp.lp(700, 0.7);
      this.port.onmessage = (): void => { /* reserved */ };
    }

    rnd(): number { // [-1, 1)
      let s = this.seed;
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
      this.seed = s;
      return (s | 0) * 4.656612873077393e-10;
    }
    rnd01(): number { return this.rnd() * 0.5 + 0.5; }

    process(_in: Float32Array[][], outputs: Float32Array[][], P: Record<string, Float32Array>): boolean {
      const out = outputs[0];
      if (!out || out.length === 0) return true;
      const o0 = out[0], o1 = out[1] ?? out[0], o2 = out[2] ?? out[0], o3 = out[3] ?? out[0];
      const N = o0.length;
      if (P.active[0] < 0.5) {
        for (let c = 0; c < out.length; c++) out[c].fill(0);
        return true;
      }

      // ---- control smoothing (per block) ---------------------------------------------------------
      const blk = N * INV_SR;
      const idle = Math.max(300, P.idleRpm[0]);
      const maxR = Math.max(idle + 500, P.maxRpm[0]);
      const cylN = clamp(Math.round(P.cyl[0]), 1, 16);
      const rpmT = clamp(P.rpm[0], 0, maxR * 1.1);
      const rpm0 = this.rpm;
      this.rpm += (rpmT - this.rpm) * kc(blk, 0.03);
      const rpm1 = this.rpm;
      this.thr += (clamp(P.throttle[0], 0, 1) - this.thr) * kc(blk, 0.04);
      this.thrSlow += (this.thr - this.thrSlow) * kc(blk, 0.12);
      this.load += (clamp(P.load[0], -1, 1) - this.load) * kc(blk, 0.06);
      this.shift += (clamp(P.shift[0], 0, 1) - this.shift) * kc(blk, 0.018);
      this.speed += (Math.max(0, P.speed[0]) - this.speed) * kc(blk, 0.05);
      this.evS += (clamp(P.ev[0], 0, 1) - this.evS) * kc(blk, 0.35);
      const sqFT = clamp(P.squealF[0], 0, 1.3), sqRT = clamp(P.squealR[0], 0, 1.3);
      this.sqF += (sqFT - this.sqF) * kc(blk, sqFT > this.sqF ? 0.035 : 0.09);
      this.sqR += (sqRT - this.sqR) * kc(blk, sqRT > this.sqR ? 0.035 : 0.09);
      this.scrub += (clamp(P.scrub[0], 0, 1.3) - this.scrub) * kc(blk, 0.05);
      this.scrubKind += (clamp(P.scrubKind[0], 0, 1) - this.scrubKind) * kc(blk, 0.1);
      this.cob += (clamp(P.cobble[0], 0, 1) - this.cob) * kc(blk, 0.06);
      this.grav += (clamp(P.gravel[0], 0, 1) - this.grav) * kc(blk, 0.06);
      this.grass += (clamp(P.grass[0], 0, 1) - this.grass) * kc(blk, 0.06);
      this.wet += (clamp(P.wet[0], 0, 1) - this.wet) * kc(blk, 0.5);

      const thr = this.thr, load = this.load, speed = this.speed, evS = this.evS;
      const rpmN = clamp((rpm1 - idle) / (maxR - idle), 0, 1);
      const loadPos = Math.max(0, load), over = Math.max(0, -load);
      const push = clamp(0.45 * thr + 0.55 * loadPos, 0, 1); // how hard the engine works
      const engOn = 1 - evS;

      // ---- engine block parameters ---------------------------------------------------------------
      const width = clamp(0.52 - 0.3 * push - 0.06 * rpmN, 0.16, 0.6);
      const exCut = 260 + push * 2600 + rpmN * 1500 + over * 400;
      this.exLp1.lp(exCut, 0.75);
      this.exLp2.lp(exCut * 1.35, 0.6);
      this.burstBp.bp(1300 + 1900 * rpmN, 0.7);
      const burstLevel = 0.04 + 0.5 * push * push + over * 0.08;
      const burstDecay = Math.exp(-INV_SR / (0.0012 + 0.0025 * push));
      const varAmt = 0.04 + 0.05 * push;
      const jitAmt = 0.02 + 0.06 * push + 0.25 * over;
      const combD = Math.round(SR / 88);
      const combFb = 0.38 + 0.2 * push;
      const combDamp = 0.25 + 0.35 * push; // one-pole coefficient in the feedback loop (brightness)
      const bodyGain = 0.9 - 0.4 * push;
      // additive amplitudes: higher orders grow with load, sub-orders with throttle (lumpier)
      for (let j = 0; j < NP; j++) {
        const o = ORDERS[j];
        let a = AMP_BASE[j];
        if (o > 1) a *= 0.55 + 0.9 * push + 0.3 * rpmN;
        else if (o < 1) a *= 0.8 + 0.9 * thr + 0.5 * over;
        this.addAmp[j] += (a - this.addAmp[j]) * 0.2;
      }
      const addGain = 0.22 - 0.06 * push;
      const pulseGain = 0.9;
      const burstGain = 2.2;
      const drive = 1 + 2.6 * push * (0.4 + 0.6 * rpmN);
      const makeup = 1 / Math.pow(drive, 0.55);
      // overall engine loudness: refined at idle, a proper growl when pushed, softer on overrun
      let engLevel = 0.30 + 0.38 * push + 0.22 * rpmN + 0.1 * over * rpmN;
      engLevel *= engOn;
      // rev limiter: ignition cut stutter when pinned at max rpm
      const limiting = rpm1 > maxR * 0.985 && thr > 0.3;
      const limHalf = Math.floor(SR / 26);
      // overrun pops
      const popProb = over > 0.05 && rpmN > 0.2 ? over * 0.06 * (0.3 + rpmN) : 0;

      // ---- intake / turbo / ev parameters ------------------------------------------------------
      this.inBp.bp(200 + rpmN * 1100 + thr * 350, 1.2);
      this.inducBp.bp(320 + rpmN * 160, 2.2);
      const intakeGain = engOn * thr * (0.12 + 0.88 * rpmN) * 0.3;
      const spoolT = clamp(loadPos * thr, 0, 1) * sstep(1400, 3800, rpm1);
      this.spool += (spoolT - this.spool) * kc(blk, spoolT > this.spool ? 0.75 : 0.3);
      const spool = this.spool * engOn;
      const turboF = 2300 + 5200 * spool + 700 * rpmN;
      this.turboBp.bp(2800 + 3200 * spool, 1.1);
      if (this.thrSlow - this.thr > 0.3 && this.spool > 0.35 && this.bovEnv < 0.05) this.bovEnv = this.spool;
      const bovDecay = Math.exp(-INV_SR / 0.12);
      if (this.bovEnv > 1e-4) this.bovBp.bp(2400, 0.8);
      const evF = 25 + speed * 68;
      const evGain = (0.06 + 0.94 * evS) * sstep(0.2, 2.5, speed) * (0.5 + 0.5 * thr + 0.6 * over) * (1 - 0.6 * sstep(20, 40, speed)) * 0.05;

      // ---- tyres parameters -------------------------------------------------------------------------
      const speedN = clamp(speed / 30, 0, 1.5);
      for (let g = 0; g < 2; g++) {
        // chaotic modulation: random targets refreshed per block, smoothed
        if (this.rnd01() < 0.12) this.sqFmT[g] = this.rnd() * 0.035;
        if (this.rnd01() < 0.3) this.sqAmT[g] = this.rnd();
        this.sqFm[g] += (this.sqFmT[g] - this.sqFm[g]) * 0.15;
        this.sqAm[g] += (this.sqAmT[g] - this.sqAm[g]) * 0.35;
      }
      const sqI_F = this.sqF, sqI_R = this.sqR;
      const f0F = (1080 - 240 * clamp(sqI_F, 0, 1) + 80 * speedN) * (1 + this.sqFm[0]);
      const f0R = (1080 - 240 * clamp(sqI_R, 0, 1) + 80 * speedN) * 0.86 * (1 + this.sqFm[1]);
      if (sqI_F > 1e-3) this.sqBpF.bp(f0F * 1.3, 2.2);
      if (sqI_R > 1e-3) this.sqBpR.bp(f0R * 1.3, 2.2);
      const sqGainF = sstep(0, 0.15, sqI_F) * sqI_F * 0.22 * (1 + 0.35 * this.sqAm[0]);
      const sqGainR = sstep(0, 0.15, sqI_R) * sqI_R * 0.22 * (1 + 0.35 * this.sqAm[1]);
      const tonalF = 0.75 - 0.35 * clamp(sqI_F, 0, 1), tonalR = 0.75 - 0.35 * clamp(sqI_R, 0, 1);
      const scrubG = this.scrub * 0.3 * clamp(0.3 + speedN, 0, 1.2);
      if (scrubG > 1e-4) this.scrubBp.bp(1800 + 1200 * speedN, 0.9);
      const crunchRate = (220 + 900 * speedN) * INV_SR;

      // ---- road parameters -------------------------------------------------------------------------
      const asphalt = clamp(1 - this.cob - this.grav - this.grass, 0, 1);
      this.rollBp.bp(420 + speed * 14, 0.55);
      const rollGain = Math.pow(speedN, 1.25) * (0.2 * asphalt + 0.08 * this.cob) * (1 + 0.6 * this.wet);
      const rumbleGain = speedN * (0.22 + 0.4 * this.cob + 0.25 * this.grav);
      const wetGain = this.wet * sstep(1, 18, speed) * 0.1;
      const cobGain = this.cob * clamp(speed / 7, 0, 1.4) * 0.45;
      const cobStep = speed * INV_SR;
      const gravGain = this.grav * clamp(speedN * 1.5, 0, 1.2) * 0.25;
      const grassGain = this.grass * speedN * 0.25;
      const gravRate = (150 + speed * 60) * INV_SR;
      const th = P.thump[0];
      if (th > this.thumpPrev + 0.05) { this.thEnv = Math.min(1.2, th); this.thNoise = this.thEnv; this.thPh = 0; }
      this.thumpPrev = th;
      const thDecay = Math.exp(-INV_SR / 0.12), thNDecay = Math.exp(-INV_SR / 0.035);

      // per-sample interpolation targets
      const gEng1 = engLevel, gInt1 = intakeGain, gSqF1 = sqGainF, gSqR1 = sqGainR, gRoll1 = rollGain, gCob1 = cobGain;
      const dEng = (gEng1 - this.gEng) / N, dInt = (gInt1 - this.gIntake) / N;
      const dSqF = (gSqF1 - this.gSqF) / N, dSqR = (gSqR1 - this.gSqR) / N;
      const dRoll = (gRoll1 - this.gRoll) / N, dCob = (gCob1 - this.gCob) / N;
      let gEng = this.gEng, gInt = this.gIntake, gSqF = this.gSqF, gSqR = this.gSqR, gRoll = this.gRoll, gCob = this.gCob;
      const dRpm = (rpm1 - rpm0) / N;
      let rpm = rpm0;
      const doEngine = engLevel > 1e-4 || this.gEng > 1e-4 || intakeGain > 1e-4 || this.gIntake > 1e-4 || spool > 1e-4;
      const doSq = sqGainF > 1e-5 || sqGainR > 1e-5 || this.gSqF > 1e-5 || this.gSqR > 1e-5;
      const comb = this.comb;
      const doIntake = intakeGain > 1e-5 || this.gIntake > 1e-5;
      // hot engine state in locals (written back after the loop)
      let nseed = this.nseed;
      let cyc = this.cyc, lastK = this.lastK, fireAmp = this.fireAmp, nEnv = this.nEnv, popEnv = this.popEnv;
      let dcX = this.dcX, dcY = this.dcY, combIdx = this.combIdx, combLp = this.combLp, limCount = this.limCount, limGate = this.limGate;
      const addPh = this.addPh, addAmp = this.addAmp, cylVar = this.cylVar;
      const shiftCut = 1 - 0.72 * this.shift;
      const exLp1 = this.exLp1, exLp2 = this.exLp2, body = this.body, burstBp = this.burstBp, inBp = this.inBp, inducBp = this.inducBp;
      const addMix = addGain;
      const invW = 1 / width;

      for (let i = 0; i < N; i++) {
        rpm += dRpm;
        gEng += dEng; gInt += dInt; gSqF += dSqF; gSqR += dSqR; gRoll += dRoll; gCob += dCob;
        nseed ^= nseed << 13; nseed ^= nseed >>> 17; nseed ^= nseed << 5;
        const w = (nseed | 0) * 4.656612873077393e-10;
        let s0 = 0, s1 = 0, s2 = 0, s3 = 0;

        // ================= ENGINE =================
        if (doEngine) {
          const cycInc = (rpm / 120) * INV_SR;
          const fInc = cycInc * cylN; // firing frequency / SR
          cyc += cycInc;
          if (cyc >= 1) cyc -= 1;
          const fpos = cyc * cylN;
          const kf = fpos | 0;
          const loc = fpos - kf;
          // rev limiter gate (square at ~13 Hz)
          if (limiting) {
            if (++limCount >= limHalf) { limCount = 0; limGate = limGate > 0.5 ? 0.12 : 1; }
          } else { limGate = 1; limCount = 0; }
          if (kf !== lastK) {
            // ---- a cylinder fires ----
            lastK = kf;
            let a = 1 + cylVar[kf] * varAmt + this.rnd() * jitAmt;
            if (over > 0.05) a *= 1 - over * 0.55 * this.rnd01();
            a *= limGate * shiftCut;
            fireAmp = a;
            const b = a * burstLevel * (0.75 + 0.5 * this.rnd01());
            if (b > nEnv) nEnv = b;
            if (popProb > 0 && this.rnd01() < popProb) popEnv = 0.5 + 0.5 * this.rnd01();
          }
          // smooth firing pulse (raised cosine) – narrower when pushed -> brighter
          let pulse = 0;
          if (loc < width) pulse = fireAmp * (0.5 - 0.5 * sinp((loc * invW + 0.25) % 1));
          let x = pulse * pulseGain;
          const ne = nEnv + popEnv * 1.2;
          if (ne > 1e-5) {
            x += burstBp.run(w * ne) * burstGain;
            nEnv *= burstDecay;
            popEnv *= 0.9992;
          }
          // DC blocker (~8 Hz)
          const y = x - dcX + 0.999 * dcY;
          dcX = x; dcY = y;
          // exhaust pipe resonance: damped comb
          const c = comb[(combIdx - combD) & 2047];
          combLp += (c - combLp) * combDamp;
          const v = y + combLp * combFb;
          comb[combIdx] = v;
          combIdx = (combIdx + 1) & 2047;
          x = exLp2.run(exLp1.run(v)) + body.run(v) * bodyGain;
          // additive crank-order body
          let add = 0;
          for (let j = 0; j < NP; j++) {
            let p = addPh[j] + ORDERS[j] * fInc;
            if (p >= 1) p -= 1;
            addPh[j] = p;
            add += addAmp[j] * sinp(p);
          }
          x = x * 0.55 + add * addMix * (0.6 + 0.4 * limGate);
          // drive: soft saturation for growl under load
          const d = x * 0.5 * drive;
          s0 = (d / (1 + Math.abs(d))) * makeup * gEng;

          // intake: throttle-body noise modulated by the firing pulse + airbox induction resonance
          if (doIntake) s1 = (inBp.run(w) * (0.35 + 0.65 * pulse) * 0.9 + inducBp.run(pulse) * 0.5) * gInt;
          // turbo whistle + whoosh
          if (spool > 1e-4) {
            this.turboPh += turboF * INV_SR; if (this.turboPh >= 1) this.turboPh -= 1;
            s1 += sinp(this.turboPh) * spool * spool * 0.03 + this.turboBp.run(w) * spool * 0.05;
          }
        }
        if (this.bovEnv > 1e-4) {
          s1 += this.bovBp.run(w) * this.bovEnv * 0.16;
          this.bovEnv *= bovDecay;
        }
        // electric motor whine (hybrid)
        if (evGain > 1e-5) {
          this.evPh1 += evF * INV_SR; if (this.evPh1 >= 1) this.evPh1 -= 1;
          this.evPh2 += evF * 2.73 * INV_SR; if (this.evPh2 >= 1) this.evPh2 -= 1;
          this.evPh3 += (3800 + speed * 25) * INV_SR; if (this.evPh3 >= 1) this.evPh3 -= 1;
          s1 += (sinp(this.evPh1) + 0.25 * sinp(this.evPh2) + 0.06 * sinp(this.evPh3)) * evGain;
        }

        // ================= TYRES =================
        if (doSq) {
          const ph = this.sqPh;
          ph[0] += f0F * INV_SR; if (ph[0] >= 1) ph[0] -= 1;
          ph[1] += f0F * 2.01 * INV_SR; if (ph[1] >= 1) ph[1] -= 1;
          ph[2] += f0F * 3.03 * INV_SR; if (ph[2] >= 1) ph[2] -= 1;
          ph[3] += f0R * INV_SR; if (ph[3] >= 1) ph[3] -= 1;
          ph[4] += f0R * 1.98 * INV_SR; if (ph[4] >= 1) ph[4] -= 1;
          ph[5] += f0R * 3.05 * INV_SR; if (ph[5] >= 1) ph[5] -= 1;
          const tF = sinp(ph[0]) + 0.35 * sinp(ph[1]) + 0.12 * sinp(ph[2]);
          const tR = sinp(ph[3]) + 0.35 * sinp(ph[4]) + 0.12 * sinp(ph[5]);
          s2 = (tF * tonalF + this.sqBpF.run(w) * (1.6 - tonalF)) * gSqF + (tR * tonalR + this.sqBpR.run(-w) * (1.6 - tonalR)) * gSqR;
        }
        if (scrubG > 1e-4) {
          if (this.rnd01() < crunchRate) this.crunchEnv = 0.4 + 0.6 * this.rnd01();
          this.crunchEnv *= 0.9985;
          const gravel = this.scrubBp.run(w * (this.crunchEnv + 0.2));
          const grassS = this.scrubLp.run(w) * 0.8;
          s2 += (gravel * (1 - this.scrubKind) + grassS * this.scrubKind) * scrubG;
        }

        // ================= ROAD =================
        if (speed > 0.05 || this.thEnv > 1e-4) {
          s3 = this.rollBp.run(w) * gRoll + this.rumbleLp.run(w) * rumbleGain;
          if (wetGain > 1e-4) s3 += this.wetHp.run(w) * wetGain;
          if (gCob > 1e-4) {
            // cobbles (pavé): one hit per stone per axle, slightly irregular stone length
            this.cobPh0 += cobStep / this.cobLen0;
            if (this.cobPh0 >= 1) { this.cobPh0 -= 1; this.cobLen0 = 0.12 + 0.035 * this.rnd01(); this.cobEnv = Math.max(this.cobEnv, 0.55 + 0.45 * this.rnd01()); }
            this.cobPh1 += cobStep / this.cobLen1;
            if (this.cobPh1 >= 1) { this.cobPh1 -= 1; this.cobLen1 = 0.12 + 0.035 * this.rnd01(); this.cobEnv = Math.max(this.cobEnv, 0.5 + 0.45 * this.rnd01()); }
            const e = w * this.cobEnv;
            this.cobEnv *= 0.9975;
            s3 += (this.cobBody.run(e) * 7 + this.cobSlap.run(e) * 1.4) * gCob;
          }
          if (gravGain > 1e-4) {
            if (this.rnd01() < gravRate) this.gravEnv = 0.3 + 0.7 * this.rnd01();
            this.gravEnv *= 0.998;
            s3 += this.gravBp.run(w * (this.gravEnv + 0.15)) * gravGain;
          }
          if (grassGain > 1e-4) s3 += this.grassLp.run(w) * grassGain;
          if (this.thEnv > 1e-4) {
            this.thPh += (42 + 45 * this.thEnv) * INV_SR; if (this.thPh >= 1) this.thPh -= 1;
            s3 += sinp(this.thPh) * this.thEnv * 0.6 + this.thLp.run(w) * this.thNoise * 0.9;
            this.thEnv *= thDecay; this.thNoise *= thNDecay;
          }
        }

        o0[i] = s0; o1[i] = s1; o2[i] = s2; o3[i] = s3;
      }
      this.nseed = nseed;
      this.cyc = cyc; this.lastK = lastK; this.fireAmp = fireAmp; this.nEnv = nEnv; this.popEnv = popEnv;
      this.dcX = dcX; this.dcY = dcY; this.combIdx = combIdx; this.combLp = combLp; this.limCount = limCount; this.limGate = limGate;
      this.gEng = gEng1; this.gIntake = gInt1; this.gSqF = gSqF1; this.gSqR = gSqR1; this.gRoll = gRoll1; this.gCob = gCob1;
      return true;
    }
  }

  registerProcessor('taxi-vehicle-synth', VehicleProcessor);
}

/** JS source of the worklet module (self-invoking). */
export function vehicleWorkletSource(): string {
  return `(${workletMain.toString()})();\n`;
}
