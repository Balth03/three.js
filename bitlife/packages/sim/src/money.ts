// Money & possessions: assets (houses, cars, luxury), mortgages and loans, stock market & crypto,
// businesses, social media income.
import { Rng, hash01 } from './rng.ts';
import type { AssetDef, Asset, Content, Life, Loc, Resolution, YearReport } from './types.ts';
import { addLine, clamp, L, rngOf } from './util.ts';
import { country, toLocal, toBase, formatMoney } from './text.ts';
import { snapshot, diff } from './snapshot.ts';

export const MORTGAGE_RATE = 0.042;
export const LOAN_RATE = 0.085;

function annuity(amount: number, rate: number, years: number) {
  if (years <= 0) return amount;
  return (amount * rate) / (1 - Math.pow(1 + rate, -years));
}

// ───────────────────────────── assets ─────────────────────────────

export interface AssetOffer { key: string; def: AssetDef; name: string; price: number; condition: number }

const HOUSE_STREETS = ['rue des Lilas', 'avenue Foch', 'impasse des Cerisiers', 'boulevard Voltaire', 'chemin du Moulin', 'Maple Street', 'Ocean Drive', 'Baker Street', 'Sunset Boulevard', 'allée des Mouettes'];

/** Offers for a kind, stable within a year (does not consume the life RNG). */
export function assetOffers(life: Life, content: Content, kind: AssetDef['kind']): AssetOffer[] {
  const c = country(content, life.country);
  let k = 0;
  const r = () => hash01(life.seed * 13 + life.age * 7919 + k++ * 104729 + kind.length * 31);
  return content.assets
    .filter((d) => d.kind === kind && (d.rating ?? 0) <= life.rating && life.age >= (d.minAge ?? 18))
    .map((def) => {
      const vary = 0.85 + r() * 0.3;
      const condition = Math.round(55 + r() * 45);
      const street = HOUSE_STREETS[Math.floor(r() * HOUSE_STREETS.length)];
      const name = kind === 'house' ? `${def.name.fr} — ${Math.floor(r() * 120) + 1} ${street}` : def.name.fr;
      return { key: `${def.id}:${life.age}`, def, name, price: Math.round(toLocal(def.price * vary * (0.7 + condition / 330), c)), condition };
    })
    .sort((a, b) => a.price - b.price);
}

export type Financing = 'cash' | 'mortgage';

export function canAfford(life: Life, content: Content, offer: AssetOffer, fin: Financing): Loc<string> | undefined {
  if (life.prison) return L('Difficile de visiter depuis ta cellule.', 'Hard to visit from your cell.');
  if (life.age < 18) return L('Trop jeune.', 'Too young.');
  if (fin === 'cash' && life.money < offer.price) return L("Pas assez d'argent.", 'Not enough money.');
  if (fin === 'mortgage') {
    if (offer.def.kind !== 'house') return L('Prêt immobilier uniquement.', 'Mortgages are for property only.');
    if (!life.job && !life.business) return L('La banque veut un revenu stable.', 'The bank wants a steady income.');
    if (life.money < offer.price * 0.2) return L('Il faut 20 % d\'apport.', 'You need a 20% down payment.');
    const income = (life.job?.salary ?? 0) + (life.business ? life.business.revenue * 0.3 : 0);
    if (annuity(offer.price * 0.8, MORTGAGE_RATE, 25) > income * 0.45) return L('Revenus trop faibles pour ce prêt.', 'Income too low for this loan.');
  }
  return undefined;
}

export function buyAsset(life: Life, content: Content, offer: AssetOffer, fin: Financing): Resolution | null {
  if (canAfford(life, content, offer, fin)) return null;
  const before = snapshot(life);
  const loan = fin === 'mortgage' ? Math.round(offer.price * 0.8) : 0;
  life.money -= offer.price - loan;
  const a: Asset = { uid: life.nextId++, def: offer.def.id, name: offer.name, value: offer.price, loan, bought: life.year, condition: offer.condition, rented: false };
  life.assets.push(a);
  if (loan) life.loans.push({ amount: loan, rate: MORTGAGE_RATE, years: 25, kind: 'mortgage' });
  life.stats.happy = clamp(life.stats.happy + offer.def.happy);
  if (offer.def.looks) life.stats.looks = clamp(life.stats.looks + offer.def.looks);
  if (offer.def.fame) life.attrs.fame = clamp(life.attrs.fame + offer.def.fame);
  life.counters.assetsBought = (life.counters.assetsBought ?? 0) + 1;
  if (offer.def.kind === 'house') { life.movedOut = true; life.flags.home = a.uid; life.place = offer.def.home ?? 'home'; }
  const c = country(content, life.country);
  const text = { fr: `J'ai acheté : ${offer.name} pour ${formatMoney(offer.price, c, 'fr')}${loan ? ' (avec un prêt immobilier)' : ''}.`, en: `I bought: ${offer.def.name.en} for ${formatMoney(offer.price, c, 'en')}${loan ? ' (with a mortgage)' : ''}.` };
  addLine(life, text, offer.def.icon, 'good');
  return { text, icon: offer.def.icon, tone: 'good', deltas: diff(life, before), mood: 'proud', visual: ['money'], scene: offer.def.home ? { place: offer.def.home } : undefined };
}

export function sellAsset(life: Life, content: Content, uid: number): Resolution | null {
  const a = life.assets.find((x) => x.uid === uid);
  if (!a) return null;
  const def = content.assets.find((d) => d.id === a.def)!;
  const before = snapshot(life);
  const price = Math.round(a.value * (0.9 + a.condition / 1000));
  life.money += price - a.loan;
  if (a.loan) {
    const m = life.loans.find((l) => l.kind === 'mortgage');
    if (m) life.loans.splice(life.loans.indexOf(m), 1);
  }
  life.assets = life.assets.filter((x) => x !== a);
  if (life.flags.home === uid) { delete life.flags.home; life.place = 'apartment'; }
  const c = country(content, life.country);
  const text = { fr: `J'ai vendu ${a.name} pour ${formatMoney(price, c, 'fr')}.`, en: `I sold ${def.name.en} for ${formatMoney(price, c, 'en')}.` };
  addLine(life, text, '🤝', 'neutral');
  return { text, icon: '🤝', tone: 'neutral', deltas: diff(life, before), visual: ['money'] };
}

export function renovate(life: Life, content: Content, uid: number): Resolution | null {
  const a = life.assets.find((x) => x.uid === uid);
  if (!a || life.used[`reno:${uid}`]) return null;
  const cost = Math.round(a.value * 0.08);
  if (life.money < cost) return null;
  const before = snapshot(life);
  life.used[`reno:${uid}`] = 1;
  life.money -= cost;
  a.condition = clamp(a.condition + 30);
  a.value = Math.round(a.value * 1.06);
  const rng = rngOf(life);
  const t = rng.chance(0.15)
    ? L(`Rénovation de ${a.name} : les ouvriers ont cassé un mur porteur « pour voir ». Ça tient. Je crois.`, `Renovated ${a.name}: the builders knocked down a load-bearing wall "to see". It holds. I think.`)
    : L(`J'ai rénové ${a.name}. Ça sent la peinture fraîche et l'argent dépensé.`, `I renovated ${a.name}. It smells of fresh paint and spent money.`);
  addLine(life, t, '🛠️', 'good');
  return { text: t, icon: '🛠️', tone: 'good', deltas: diff(life, before) };
}

export function toggleRent(life: Life, content: Content, uid: number) {
  const a = life.assets.find((x) => x.uid === uid);
  if (!a) return;
  a.rented = !a.rented;
  if (a.rented && life.flags.home === uid) { delete life.flags.home; life.place = 'apartment'; }
  void content;
}

export function moveInto(life: Life, content: Content, uid: number) {
  const a = life.assets.find((x) => x.uid === uid);
  if (!a) return;
  a.rented = false;
  life.flags.home = uid;
  life.movedOut = true;
  life.place = content.assets.find((d) => d.id === a.def)?.home ?? 'home';
}

export function giveAsset(life: Life, content: Content, defId: string, rng: Rng) {
  const def = content.assets.find((d) => d.id === defId);
  if (!def) return;
  const c = country(content, life.country);
  life.assets.push({ uid: life.nextId++, def: def.id, name: def.name.fr, value: Math.round(toLocal(def.price * rng.range(0.8, 1.1), c)), loan: 0, bought: life.year, condition: rng.int(50, 95), rented: false });
}

export function loseAsset(life: Life, content: Content, kind: string | true, rng: Rng) {
  const pool = life.assets.filter((a) => kind === true || a.def === kind || content.assets.find((d) => d.id === a.def)?.kind === kind);
  if (!pool.length) return;
  const a = rng.pick(pool);
  life.assets = life.assets.filter((x) => x !== a);
  if (life.flags.home === a.uid) delete life.flags.home;
}

export function homeAsset(life: Life, content: Content): { a: Asset; def: AssetDef } | undefined {
  const a = life.assets.find((x) => x.uid === life.flags.home);
  const def = a && content.assets.find((d) => d.id === a.def);
  return a && def ? { a, def } : undefined;
}

// ───────────────────────────── loans ─────────────────────────────

export function maxLoan(life: Life): number {
  const income = life.job?.salary ?? 0;
  return Math.round(income * 1.5);
}

export function takeLoan(life: Life, content: Content, amount: number): Resolution | null {
  if (amount <= 0 || amount > maxLoan(life) || life.used.loan) return null;
  life.used.loan = 1;
  const before = snapshot(life);
  life.money += amount;
  life.loans.push({ amount, rate: LOAN_RATE, years: 5, kind: 'personal' });
  const c = country(content, life.country);
  const t = { fr: `La banque m'a prêté ${formatMoney(amount, c, 'fr')}. Le conseiller a souri comme un requin.`, en: `The bank lent me ${formatMoney(amount, c, 'en')}. The advisor smiled like a shark.` };
  addLine(life, t, '🏦', 'neutral');
  return { text: t, icon: '🏦', tone: 'neutral', deltas: diff(life, before) };
}

export function repayLoans(life: Life): Resolution | null {
  const total = life.loans.reduce((t, l) => t + l.amount, 0) + life.edu.loan;
  if (!total || life.money < total) return null;
  const before = snapshot(life);
  life.money -= total;
  life.loans = [];
  life.edu.loan = 0;
  for (const a of life.assets) a.loan = 0;
  const t = L('J\'ai remboursé toutes mes dettes d\'un coup. Le banquier a pleuré.', 'I paid off all my debts at once. The banker wept.');
  addLine(life, t, '🎉', 'good');
  return { text: t, icon: '🎉', tone: 'good', deltas: diff(life, before) };
}

export function debt(life: Life): number {
  return life.loans.reduce((t, l) => t + l.amount, 0) + life.edu.loan;
}

// ───────────────────────────── market ─────────────────────────────

export function initMarket(life: Life, content: Content) {
  for (const s of content.stocks) if (life.market[s.id] === undefined) life.market[s.id] = s.price;
}

export function portfolioValue(life: Life, content: Content): number {
  const c = country(content, life.country);
  let v = 0;
  for (const id in life.portfolio) v += life.portfolio[id] * toLocal(life.market[id] ?? 0, c);
  return Math.round(v);
}

export function buyStock(life: Life, content: Content, id: string, amountLocal: number): Resolution | null {
  const c = country(content, life.country);
  const price = toLocal(life.market[id] ?? 0, c);
  if (!price || amountLocal <= 0 || amountLocal > life.money || life.age < 18 || life.prison) return null;
  const before = snapshot(life);
  const shares = amountLocal / price;
  life.portfolio[id] = (life.portfolio[id] ?? 0) + shares;
  life.money -= amountLocal;
  const def = content.stocks.find((s) => s.id === id)!;
  const t = { fr: `J'ai investi ${formatMoney(amountLocal, c, 'fr')} dans ${def.name}.`, en: `I invested ${formatMoney(amountLocal, c, 'en')} in ${def.name}.` };
  addLine(life, t, def.icon, 'neutral');
  return { text: t, icon: def.icon, tone: 'neutral', deltas: diff(life, before) };
}

export function sellStock(life: Life, content: Content, id: string): Resolution | null {
  const shares = life.portfolio[id];
  if (!shares) return null;
  const c = country(content, life.country);
  const before = snapshot(life);
  const value = Math.round(shares * toLocal(life.market[id], c));
  life.money += value;
  delete life.portfolio[id];
  const def = content.stocks.find((s) => s.id === id)!;
  const t = { fr: `J'ai tout vendu sur ${def.name} : ${formatMoney(value, c, 'fr')}.`, en: `I sold all my ${def.name}: ${formatMoney(value, c, 'en')}.` };
  addLine(life, t, '📉', 'neutral');
  return { text: t, icon: def.icon, tone: 'neutral', deltas: diff(life, before), visual: ['money'] };
}

export function yearlyMarket(life: Life, content: Content, rng: Rng, shock = 1) {
  initMarket(life, content);
  // Global mood: slow random walk with occasional crash or bubble
  let mood = Number(life.flags.marketMood ?? 0.05);
  mood = mood * 0.6 + rng.gauss() * 0.08;
  if (rng.chance(0.06)) mood = -0.35; // crash
  if (rng.chance(0.05)) mood = 0.3; // boom
  life.flags.marketMood = Math.round(mood * 1000) / 1000;
  for (const s of content.stocks) {
    const cur = life.market[s.id];
    const ret = s.drift + mood * (s.kind === 'crypto' ? 2.2 : 1) + rng.gauss() * s.vol;
    let next = cur * Math.exp(ret) * shock;
    if (s.kind === 'crypto' && rng.chance(0.03)) next *= rng.chance(0.5) ? 0.08 : 6; // rug pull / moon
    next = Math.min(next, s.price * (s.kind === 'crypto' ? 500 : 40));
    life.market[s.id] = Math.max(0.0001, Math.round(next * 10000) / 10000);
  }
}

// ───────────────────────────── business ─────────────────────────────

export function startBusiness(life: Life, content: Content, sectorId: string, name: string): Resolution | null {
  const sec = content.sectors.find((s) => s.id === sectorId);
  if (!sec || life.business || life.age < 18 || life.prison) return null;
  const c = country(content, life.country);
  const cost = Math.round(toLocal(sec.cost, c));
  if (life.money < cost) return null;
  const before = snapshot(life);
  life.money -= cost;
  life.business = { name: name || `${life.last} & Fils`, sector: sec.id, value: cost, revenue: Math.round(cost * 0.6), employees: 1, years: 0, reputation: 40 };
  life.counters.businesses = (life.counters.businesses ?? 0) + 1;
  const t = { fr: `J'ai fondé ${life.business.name} (${sec.name.fr}). Je suis mon propre patron !`, en: `I founded ${life.business.name} (${sec.name.en}). I'm my own boss!` };
  addLine(life, t, sec.icon, 'good');
  return { text: t, icon: sec.icon, tone: 'good', deltas: diff(life, before), mood: 'proud' };
}

export function investBusiness(life: Life, content: Content, kind: 'hire' | 'marketing' | 'expand'): Resolution | null {
  const b = life.business;
  if (!b || life.used[`biz:${kind}`]) return null;
  const cost = Math.round(b.value * (kind === 'expand' ? 0.4 : kind === 'hire' ? 0.12 : 0.08));
  if (life.money < cost) return null;
  life.used[`biz:${kind}`] = 1;
  const rng = rngOf(life);
  const before = snapshot(life);
  life.money -= cost;
  const ok = rng.chance(0.7 + (life.stats.smarts - 50) / 250);
  if (kind === 'hire') { b.employees += rng.int(1, 4); b.revenue = Math.round(b.revenue * (ok ? 1.25 : 1.05)); }
  if (kind === 'marketing') { b.reputation = clamp(b.reputation + (ok ? 12 : -4)); b.revenue = Math.round(b.revenue * (ok ? 1.15 : 0.97)); }
  if (kind === 'expand') { b.value = Math.round(b.value * (ok ? 1.6 : 1.1)); b.revenue = Math.round(b.revenue * (ok ? 1.5 : 1.05)); b.employees += rng.int(2, 10); }
  b.value += Math.round(cost * (ok ? 0.9 : 0.4));
  const t = ok
    ? L(`Investissement réussi pour ${b.name}. Mes employés m'appellent « visionnaire » (dans mon dos, je ne sais pas).`, `Successful investment for ${b.name}. My staff call me a "visionary" (behind my back, who knows).`)
    : L(`J'ai investi dans ${b.name}… et ça a fait pschitt. L'argent s'est évaporé comme une promesse électorale.`, `I invested in ${b.name}… and it fizzled. The money evaporated like a campaign promise.`);
  addLine(life, t, '📊', ok ? 'good' : 'bad');
  return { text: t, icon: '📊', tone: ok ? 'good' : 'bad', deltas: diff(life, before) };
}

export function sellBusiness(life: Life, content: Content): Resolution | null {
  const b = life.business;
  if (!b) return null;
  const before = snapshot(life);
  const price = Math.round(b.value * (0.8 + b.reputation / 200));
  life.money += price;
  life.business = undefined;
  const c = country(content, life.country);
  const t = { fr: `J'ai revendu ${b.name} pour ${formatMoney(price, c, 'fr')}.`, en: `I sold ${b.name} for ${formatMoney(price, c, 'en')}.` };
  addLine(life, t, '🤝', 'good');
  return { text: t, icon: '🤝', tone: 'good', deltas: diff(life, before), visual: ['money'] };
}

function yearlyBusiness(life: Life, content: Content, rng: Rng, report: YearReport) {
  const b = life.business;
  if (!b) return;
  const sec = content.sectors.find((s) => s.id === b.sector)!;
  b.years++;
  const mood = Number(life.flags.marketMood ?? 0);
  const perf = sec.margin * (1 + rng.gauss() * sec.risk + mood + (b.reputation - 50) / 150 + (life.stats.smarts - 50) / 300);
  const profit = Math.round(b.revenue * perf);
  life.money += profit;
  b.value = Math.max(0, Math.round(b.value * (1 + perf * 0.5 + rng.gauss() * 0.05)));
  b.revenue = Math.max(0, Math.round(b.revenue * (1 + perf * 0.4)));
  b.reputation = clamp(b.reputation + rng.range(-4, 4));
  const c = country(content, life.country);
  if (profit < 0 && (b.value < toLocal(sec.cost * 0.25, c) || rng.chance(sec.risk * 0.12))) {
    addLine(life, { fr: `${b.name} a fait faillite. Les huissiers ont même pris la machine à café.`, en: `${b.name} went bankrupt. The bailiffs even took the coffee machine.` }, '💸', 'bad');
    life.business = undefined;
    life.stats.happy = clamp(life.stats.happy - 15);
    life.counters.bankruptcies = (life.counters.bankruptcies ?? 0) + 1;
    report.milestones.push('bankrupt');
    return;
  }
  addLine(life, { fr: `${b.name} : ${profit >= 0 ? 'bénéfice' : 'perte'} de ${formatMoney(Math.abs(profit), c, 'fr')} cette année.`, en: `${b.name}: ${profit >= 0 ? 'profit' : 'loss'} of ${formatMoney(Math.abs(profit), c, 'en')} this year.` }, sec.icon, profit >= 0 ? 'good' : 'bad');
}

// ───────────────────────────── yearly ─────────────────────────────

export function yearlyMoney2(life: Life, content: Content, rng: Rng, report: YearReport, shock = 1) {
  const c = country(content, life.country);
  yearlyMarket(life, content, rng, shock);
  // Assets: value, condition, upkeep, rent
  for (const a of life.assets) {
    const def = content.assets.find((d) => d.id === a.def);
    if (!def) continue;
    const mood = Number(life.flags.marketMood ?? 0);
    a.value = Math.max(0, Math.round(a.value * (1 + def.growth + (def.kind === 'house' ? mood * 0.4 : 0) + rng.gauss() * 0.03)));
    a.condition = clamp(a.condition - rng.range(1, 5));
    if (!life.prison) life.money -= Math.round(a.value * def.upkeep);
    if (a.rented) life.money += Math.round(a.value * 0.045);
    if (def.kind === 'house' && a.condition < 20 && rng.chance(0.15)) addLine(life, { fr: `${a.name} tombe en ruine. Un pigeon a élu domicile dans la salle de bain.`, en: `${def.name.en} is falling apart. A pigeon moved into the bathroom.` }, '🏚️', 'bad');
  }
  // Loans
  for (const l of life.loans) {
    const pay = annuity(l.amount, l.rate, l.years);
    const interest = l.amount * l.rate;
    life.money -= Math.round(pay);
    l.amount = Math.max(0, Math.round(l.amount + interest - pay));
    l.years = Math.max(0, l.years - 1);
    if (l.kind === 'mortgage') {
      const a = life.assets.find((x) => x.loan > 0);
      if (a) a.loan = l.amount;
    }
  }
  life.loans = life.loans.filter((l) => l.amount > 1 && l.years > 0);
  if (!life.loans.some((l) => l.kind === 'mortgage')) for (const a of life.assets) a.loan = 0;
  // Social media income
  if (life.followers > 5000 && !life.prison) {
    const income = toLocal(Math.min(2_000_000, life.followers * 0.35), c);
    life.money += Math.round(income);
    life.followers = Math.round(life.followers * rng.range(0.85, 1.05));
  }
  yearlyBusiness(life, content, rng, report);
  // Bankruptcy safety: crushing debt
  if (life.money < -toLocal(80000, c) && life.age > 25 && rng.chance(0.3)) {
    addLine(life, L('Mes dettes étaient telles que la banque a saisi ce qu\'elle pouvait. Je me suis déclaré en faillite personnelle.', 'My debts were so bad the bank seized what it could. I declared personal bankruptcy.'), '⚖️', 'bad');
    life.assets = life.assets.filter(() => false);
    delete life.flags.home;
    life.money = Math.round(life.money * 0.3);
    life.loans = [];
    life.counters.bankruptcies = (life.counters.bankruptcies ?? 0) + 1;
  }
  void toBase;
}

export function netWorth(life: Life, content: Content): number {
  return Math.round(life.money + life.assets.reduce((t, a) => t + a.value - a.loan, 0) + portfolioValue(life, content) + (life.business?.value ?? 0) - life.loans.filter((l) => l.kind !== 'mortgage').reduce((t, l) => t + l.amount, 0) - life.edu.loan);
}
