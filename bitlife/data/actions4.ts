// Special career entries (not on the job board).
import type { ActionDef, EffectCtx } from '@bl/sim';
import { hire, levelSalary, employerFor, rngOf, addLine, careerTitle, renderString } from '@bl/sim';

function join(id: string, chance: number, okFr: string, okEn: string, koFr: string, koEn: string) {
  return {
    fn: ({ life, content, rand }: EffectCtx) => {
      const def = content.careers.find((c) => c.id === id);
      if (!def) return;
      if (rand() < chance) {
        const rng = rngOf(life);
        hire(life, content, def, employerFor(life, content, def, rng), levelSalary(life, content, def, 0), rng);
        const tFr = careerTitle(content, id, 0, life.gender, 'fr'), tEn = careerTitle(content, id, 0, life.gender, 'en');
        addLine(life, { fr: renderString(`${okFr} Me voilà ${tFr.toLowerCase()}.`, { life, content }, 'fr'), en: `${okEn} I'm now a ${tEn.toLowerCase()}.` }, def.icon, 'good');
      } else addLine(life, { fr: renderString(koFr, { life, content }, 'fr'), en: koEn }, '🚫', 'bad');
    },
  };
}

export const actions4: ActionDef[] = [
  { id: 'sp_mafia', tab: 'career', group: 'special', icon: '🕴️', rating: 1, label: { fr: 'Rejoindre la mafia', en: 'Join the mob' }, desc: { fr: 'Carrière criminelle', en: 'Criminal career' }, limit: 1,
    when: { age: [18, 70], noFlag: 'never', test: (l) => !!l.flags.cr_mafia || !!l.flags.mf_made || !!l.flags.mafia || (l.counters.crimes ?? 0) >= 5 || l.record.length > 0 },
    out: [{ text: { fr: 'J\'ai demandé un rendez-vous au parrain du quartier, dans l\'arrière-salle d\'une pizzeria.', en: 'I asked for a sit-down with the local don, in the back room of a pizzeria.' }, fx: join('mafia', 0.7, 'Il a embrassé mes deux joues. J\'en ai encore des frissons.', 'He kissed both my cheeks. I still have chills.', 'Il m\'a regardé de haut en bas et a éclaté de rire. « Reviens quand t\'auras tué quelqu\'un. »', 'He looked me up and down and laughed. "Come back when you\'ve killed someone."') }] },
  { id: 'sp_spy', tab: 'career', group: 'special', icon: '🕶️', label: { fr: 'Postuler aux services secrets', en: 'Apply to the secret service' }, desc: { fr: 'Intelligence 80+, casier vierge', en: 'Smarts 80+, clean record' }, limit: 1,
    when: { age: [21, 50], degree: 'uni', record: false, stat: { smarts: [80, 100] } },
    out: [{ text: { fr: 'Un homme en imper m\'a donné rendez-vous sur un banc, à 3 h du matin.', en: 'A man in a trench coat met me on a bench at 3am.' }, fx: join('spy', 0.45, 'J\'ai réussi les tests (et le détecteur de mensonges).', 'I passed the tests (and the lie detector).', 'Recalé{|e} au test psychologique : j\'ai dessiné une bite dans le test de Rorschach.', 'Failed the psych eval: I drew a penis in the Rorschach test.') }] },
  { id: 'sp_hacker', tab: 'career', group: 'special', icon: '💀', label: { fr: 'Devenir hacker', en: 'Become a hacker' }, desc: { fr: 'Intelligence 70+', en: 'Smarts 70+' }, limit: 1,
    when: { age: [16, 70], stat: { smarts: [70, 100] } },
    out: [{ text: { fr: 'J\'ai posté sur un forum du dark web avec une capuche, même seul{|e} dans ma chambre.', en: 'I posted on a dark web forum wearing a hoodie, even alone in my room.' }, fx: join('hacker', 0.6, 'Un collectif anonyme m\'a recruté{|e}.', 'An anonymous collective recruited me.', 'Personne ne m\'a répondu, sauf un bot qui vendait des chaussettes.', 'Nobody answered except a bot selling socks.') }] },
  { id: 'sp_guru', tab: 'career', group: 'special', icon: '🔮', rating: 1, label: { fr: 'Fonder ma religion', en: 'Found my own religion' }, desc: { fr: 'Charisme requis', en: 'Charisma required' }, limit: 1,
    when: { age: [25, 90], stat: { looks: [45, 100] } },
    out: [{ text: { fr: 'J\'ai reçu une révélation sous la douche. Ou c\'était le shampoing.', en: 'I had a revelation in the shower. Or it was the shampoo.' }, fx: join('cult_guru', 0.55, 'Douze adeptes m\'appellent déjà « Maître ».', 'Twelve followers already call me "Master".', 'Mon premier prêche a attiré trois pigeons et un SDF qui voulait mon sandwich.', 'My first sermon drew three pigeons and a homeless guy who wanted my sandwich.') }] },
  { id: 'sp_influencer', tab: 'career', group: 'special', icon: '🤳', label: { fr: 'Devenir influenceur pro', en: 'Go pro as an influencer' }, desc: { fr: '50 000 abonnés', en: '50,000 followers' }, limit: 1,
    when: { age: [16, 80], followers: [50000, 1e12] },
    out: [{ text: { fr: 'J\'ai signé avec une agence d\'influence.', en: 'I signed with an influencer agency.' }, fx: join('influencer', 0.9, 'Placements de produits à gogo.', 'Product placements galore.', 'L\'agence a fait faillite le lendemain.', 'The agency went bankrupt the next day.') }] },
  { id: 'sp_streamer', tab: 'career', group: 'special', icon: '📹', label: { fr: 'Streamer à plein temps', en: 'Stream full-time' }, desc: { fr: '5 000 abonnés', en: '5,000 followers' }, limit: 1,
    when: { age: [16, 80], followers: [5000, 1e12] },
    out: [{ text: { fr: 'J\'ai acheté une chaise gamer qui coûte plus cher que ma voiture.', en: 'I bought a gaming chair more expensive than my car.' }, fx: join('streamer', 0.85, 'Les dons pleuvent.', 'Donations are pouring in.', 'Mon premier stream a attiré ma mère et un bot.', 'My first stream drew my mom and a bot.') }] },
  { id: 'sp_politics', tab: 'career', group: 'special', icon: '🏛️', label: { fr: 'Se présenter aux élections', en: 'Run for office' }, desc: { fr: 'Campagne municipale', en: 'City council race' }, limit: 1, cost: 5000,
    when: { age: [25, 85], degree: 'high' },
    out: [{ text: { fr: 'J\'ai serré 4 000 mains et embrassé 30 bébés (dont un chien).', en: 'I shook 4,000 hands and kissed 30 babies (one was a dog).' }, fx: join('politician', 0.45, 'Élu{|e} ! Le pouvoir me monte déjà à la tête.', 'Elected! Power is already going to my head.', 'Battu{|e} par un candidat qui promettait des frites gratuites.', 'Beaten by a candidate promising free fries.') }] },
];
