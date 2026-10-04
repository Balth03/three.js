/** Taxi fare computation — shared by client (display) and server (authority). Values come from data/economy/<city>.json. */
export interface TariffPeriod { id: string; label: string; perKm: number; perHourWaiting: number }
export interface EconomyConfig {
  currency: string;
  pickup: number;              // prise en charge
  minimumFare: number;
  tariffs: TariffPeriod[];     // A/B/C
  schedule: Array<{ from: number; to: number; tariff: string; days?: number[] }>; // hours [from,to)
  supplements: { luggage: number; extraPassenger: number; airport?: number };
  waitingSpeedKmh: number;     // below this speed, time is charged instead of distance
  tips: { base: number; comfortWeight: number; timeWeight: number; max: number };
}
export interface MeterState { distance: number; waiting: number; fare: number; tariff: string; running: boolean }

export function tariffAt(cfg: EconomyConfig, hour: number, day = 1): TariffPeriod {
  for (const s of cfg.schedule) {
    if (s.days && !s.days.includes(day)) continue;
    const inRange = s.from <= s.to ? hour >= s.from && hour < s.to : hour >= s.from || hour < s.to;
    if (inRange) return cfg.tariffs.find((t) => t.id === s.tariff) ?? cfg.tariffs[0];
  }
  return cfg.tariffs[0];
}

export class Taximeter {
  state: MeterState = { distance: 0, waiting: 0, fare: 0, tariff: 'A', running: false };
  constructor(public cfg: EconomyConfig) {}
  start(hour: number): void {
    this.state = { distance: 0, waiting: 0, fare: this.cfg.pickup, tariff: tariffAt(this.cfg, hour).id, running: true };
  }
  /** Advance with real-world metres travelled and seconds elapsed (game time). */
  tick(metres: number, seconds: number, speedKmh: number): void {
    const s = this.state;
    if (!s.running) return;
    const t = this.cfg.tariffs.find((x) => x.id === s.tariff) ?? this.cfg.tariffs[0];
    if (speedKmh < this.cfg.waitingSpeedKmh) {
      s.waiting += seconds;
      s.fare += (t.perHourWaiting / 3600) * seconds;
    } else {
      s.distance += metres;
      s.fare += (t.perKm / 1000) * metres;
    }
  }
  stop(): number {
    this.state.running = false;
    return Math.max(this.cfg.minimumFare, Math.round(this.state.fare * 100) / 100);
  }
}

export interface RideOutcome { fare: number; tip: number; rating: number; comfort: number; timeRatio: number }
/** Tip and rating from comfort (0..100) and time ratio (actual / estimated; < 1 is faster). */
export function rideOutcome(cfg: EconomyConfig, fare: number, comfort: number, timeRatio: number, personality: { generosity: number; patience: number }): RideOutcome {
  const c = Math.max(0, Math.min(100, comfort)) / 100;
  const timeScore = Math.max(0, Math.min(1, 1.35 - timeRatio * (1.1 - personality.patience * 0.4)));
  const score = c * cfg.tips.comfortWeight + timeScore * cfg.tips.timeWeight;
  const tipRate = Math.max(0, cfg.tips.base * personality.generosity * (score * 2 - 0.6));
  const tip = Math.min(cfg.tips.max, Math.round(fare * tipRate * 2) / 2);
  const rating = Math.max(1, Math.min(5, Math.round((1 + score * 4.4) * 2) / 2));
  return { fare, tip, rating, comfort, timeRatio };
}
