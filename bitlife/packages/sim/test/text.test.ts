import { describe, it, expect } from 'vitest';
import { content } from '@bl/data';
import { createLife, renderString, renderLoc, formatMoney, country } from '../src/index.ts';

describe('text rendering', () => {
  const f = createLife(content, { seed: 1, gender: 'f', country: 'fr', first: 'Léa' });
  const m = createLife(content, { seed: 1, gender: 'm', country: 'fr', first: 'Hugo' });
  const mom = f.npcs.find((n) => n.role === 'mother')!;

  it('applies gender agreement for player and actor', () => {
    expect(renderString('Tu es tombé{|e}.', { life: f, content }, 'fr')).toBe('Tu es tombée.');
    expect(renderString('Tu es tombé{|e}.', { life: m, content }, 'fr')).toBe('Tu es tombé.');
    expect(renderString('{a.rel} est {a:content|contente}.', { life: f, content, actor: mom }, 'fr')).toBe('Ta mère est contente.');
    expect(renderString("J'ai aidé {a.my}.", { life: f, content, actor: mom }, 'fr')).toBe("J'ai aidé ma mère.");
  });

  it('formats money per country and picks the same variant in both languages', () => {
    const c = country(content, 'fr');
    expect(formatMoney(1234, c, 'fr')).toMatch(/1\s?230\s?€/);
    let i = 0;
    const seq = [0.9, 0, 0, 0, 0, 0, 0];
    const r = renderLoc({ fr: ['A', 'B'], en: ['a', 'b'] }, { life: f, content }, () => seq[i++]);
    expect(r).toEqual({ fr: 'B', en: 'B' });
  });

  it('renders variables and inline variants', () => {
    const s = renderString('{first} a [[un chat|un chien]] et {$amount}.', { life: f, content, vars: { amount: 100 } }, 'fr', [0.1]);
    expect(s).toMatch(/^Léa a un chat et 78\s?€\.$/);
  });
});
