// Results of the arcade minigames (pure & deterministic: the score comes from the player, effects from the life RNG).
import type { Content, Life, LocText, Resolution, VisualFx } from './types.ts';
import { addLine, clamp, rngOf } from './util.ts';
import { country, renderLoc, toLocal, formatMoney } from './text.ts';
import { snapshot, diff } from './snapshot.ts';

export type ArcadeKind = 'karaoke' | 'concert' | 'dj' | 'beerpong' | 'fight' | 'hack' | 'slots' | 'trading' | 'race';

type Tier = 'top' | 'mid' | 'low';
const TXT: Record<ArcadeKind, Record<Tier, LocText>> = {
  karaoke: {
    top: { fr: ['Karaoké : j\'ai chanté {w:song} comme une déesse. Le bar entier pleurait, même le videur.', 'Karaoké légendaire : {w:song}, standing ovation, quelqu\'un m\'a lancé {w:object} en signe d\'amour.', 'J\'ai massacré personne au karaoké : {w:song}, note finale tenue 14 secondes. Le patron m\'a offert {w:drink}.'], en: ['Karaoke: I sang {w:song} like a goddess. The whole bar cried, even the bouncer.', 'Legendary karaoke: {w:song}, standing ovation, someone threw {w:object} at me out of love.', 'Karaoke triumph: {w:song}, final note held for 14 seconds. The owner bought me {w:drink}.'] },
    mid: { fr: ['Karaoké correct sur {w:song}. Quelques applaudissements polis et un « bof » au fond.', 'J\'ai chanté {w:song}, faux mais avec conviction. Mes amis ont filmé « pour plus tard ».', 'Karaoké : {w:song}. J\'ai oublié le deuxième couplet et j\'ai improvisé sur {w:hobby}.'], en: ['Decent karaoke on {w:song}. Polite applause and one "meh" from the back.', 'I sang {w:song}, off-key but with conviction. My friends filmed it "for later".', 'Karaoke: {w:song}. Forgot the second verse and improvised about {w:hobby}.'] },
    low: { fr: ['Karaoké catastrophique : {w:song} hurlé faux, un verre s\'est brisé tout seul. Les voisins ont appelé les flics.', 'J\'ai chanté {w:song} si mal qu\'un chien a hurlé dehors en solidarité. Huées générales.', 'Humiliation au karaoké : {w:sound} est sorti de ma bouche à la place du refrain.'], en: ['Disastrous karaoke: {w:song} screamed off-key, a glass shattered on its own. The neighbours called the cops.', 'I sang {w:song} so badly a dog howled outside in solidarity. Mass booing.', 'Karaoke humiliation: {w:sound} came out of my mouth instead of the chorus.'] },
  },
  concert: {
    top: { fr: ['Concert de folie : le public scandait mon nom, un fan s\'est évanoui, un autre a jeté {w:object} sur scène.', 'Show historique : slam dans la fosse, rappel ×3, une groupie a tatoué mon visage sur sa cuisse.', 'Le concert a mis le feu (au sens propre : la pyrotechnie a cramé le bassiste). Triomphe total.'], en: ['Insane gig: the crowd chanted my name, one fan fainted, another threw {w:object} on stage.', 'Historic show: crowd-surfing, three encores, a groupie tattooed my face on her thigh.', 'The gig was on fire (literally: the pyro torched the bassist). Total triumph.'] },
    mid: { fr: ['Concert honnête. Le son était pourri mais le public a dansé quand même.', 'Bon concert, sauf quand j\'ai crié « Bonsoir {city} ! » dans la mauvaise ville.', 'Le public a aimé la moitié du set. L\'autre moitié a fait la queue {w:at_place}.'], en: ['Decent gig. Terrible sound but the crowd danced anyway.', 'Good gig, except when I yelled "Good evening {city}!" in the wrong city.', 'The crowd liked half the set. The other half queued {w:at_place}.'] },
    low: { fr: ['Concert raté : larsen infernal, une tomate en pleine face, le batteur s\'est barré avec la caisse.', 'Fiasco : j\'ai trébuché sur un câble et fini le concert la tête dans la grosse caisse.', 'Le public m\'a hué si fort que j\'ai fini le set caché derrière l\'ampli.'], en: ['Failed gig: hellish feedback, a tomato to the face, the drummer ran off with the cash box.', 'Fiasco: I tripped on a cable and finished the show head-first in the bass drum.', 'The crowd booed so hard I finished the set hiding behind the amp.'] },
  },
  dj: {
    top: { fr: ['DJ set mythique : le drop a fait trembler les murs, quelqu\'un a demandé ma main, un autre a vomi de bonheur.', 'J\'ai retourné la boîte. 4 h du matin, le club entier hurlait « ENCORE ».', 'Set parfait : même le videur dansait. Le patron m\'a proposé une résidence.'], en: ['Mythical DJ set: the drop shook the walls, someone proposed, someone else puked with joy.', 'I tore the club apart. 4 a.m., the whole place screaming "MORE".', 'Perfect set: even the bouncer danced. The owner offered me a residency.'] },
    mid: { fr: ['DJ set correct. Deux transitions ratées, mais personne n\'était assez sobre pour remarquer.', 'J\'ai passé {w:song} trois fois sans faire exprès. Ça a marché, bizarrement.', 'Set honnête, piste de danse à moitié pleine (ou à moitié vide).'], en: ['Decent DJ set. Two botched transitions, but nobody was sober enough to notice.', 'I played {w:song} three times by accident. Weirdly, it worked.', 'Honest set, dance floor half full (or half empty).'] },
    low: { fr: ['DJ set désastreux : silence de 10 secondes en plein drop. On m\'a lancé {w:drink} au visage.', 'J\'ai appuyé sur le mauvais bouton : {w:sound} à plein volume. Évacuation de la boîte.', 'Le public a fui vers le bar d\'en face. Le patron m\'a payé en tickets boisson périmés.'], en: ['Disastrous DJ set: 10 seconds of silence mid-drop. Someone threw {w:drink} in my face.', 'I hit the wrong button: {w:sound} at full volume. Club evacuated.', 'The crowd fled to the bar across the street. The owner paid me in expired drink tickets.'] },
  },
  beerpong: {
    top: { fr: ['Beer pong : massacre. J\'ai tout rentré, l\'adversaire a bu ses 10 verres et dort dans la baignoire.', 'Champion du beer pong ! On m\'a porté en triomphe jusqu\'à ce qu\'on me fasse tomber dans {w:at_place}.', 'Victoire écrasante au beer pong. J\'ai gagné le respect éternel et un T-shirt collant.'], en: ['Beer pong: massacre. Sank everything, my opponent drank all 10 cups and is sleeping in the bathtub.', 'Beer pong champion! Carried in triumph until they dropped me somewhere.', 'Crushing beer pong win. Earned eternal respect and a sticky T-shirt.'] },
    mid: { fr: ['Beer pong serré. J\'ai perdu de peu, bu beaucoup, et embrassé {w:object} par erreur.', 'Match nul au beer pong, mais victoire morale (j\'ai pas vomi).', 'Beer pong honorable. Ma vision s\'est dédoublée au 6e verre, ça aidait pas.'], en: ['Close beer pong match. Lost narrowly, drank a lot, kissed {w:object} by mistake.', 'Beer pong draw, but a moral victory (I didn\'t puke).', 'Respectable beer pong. My vision doubled at cup six, didn\'t help.'] },
    low: { fr: ['Humiliation au beer pong : zéro verre. J\'ai tout bu et fini par vomir dans le bac à litière du chat.', 'Défaite totale. Ma balle a atterri dans le décolleté de la tante de quelqu\'un.', 'J\'ai perdu au beer pong, puis ma dignité, puis une chaussure.'], en: ['Beer pong humiliation: zero cups. I drank everything and puked in the cat litter.', 'Total defeat. My ball landed in someone\'s aunt\'s cleavage.', 'Lost at beer pong, then my dignity, then a shoe.'] },
  },
  fight: {
    top: { fr: ['Bagarre : K.O. au premier round. Mon adversaire a perdu deux dents, je les garde en souvenir.', 'J\'ai mis une raclée mémorable. Le type est reparti en rampant, la foule m\'appelle « le Marteau ».', 'Victoire par K.O. ! Une dent a volé jusque dans le verre {w:drink}.'], en: ['Fight: first-round K.O. My opponent lost two teeth, I keep them as souvenirs.', 'I dished out a legendary beating. The guy crawled away, the crowd calls me "the Hammer".', 'Win by K.O.! A tooth flew right into someone\'s drink.'] },
    mid: { fr: ['Bagarre indécise : on s\'est roulés par terre pendant 5 minutes avant qu\'on nous sépare. Œil au beurre noir des deux côtés.', 'Match nul. J\'ai mal partout mais lui aussi, c\'est déjà ça.', 'On s\'est battus jusqu\'à l\'épuisement, puis on a partagé {w:food}. Bizarre.'], en: ['Messy fight: we rolled on the floor for 5 minutes before being separated. Black eyes all round.', 'Draw. Everything hurts, but his too, so there\'s that.', 'We fought until exhausted, then shared {w:food}. Weird.'] },
    low: { fr: ['Je me suis fait démolir. Je me suis réveillé{|e} {w:at_place}, avec un goût de sang et de honte.', 'Raclée monumentale : nez cassé, dignité en miettes, et {w:object} coincé où je pense.', 'K.O. en 8 secondes. La vidéo tourne déjà sur {w:app}.'], en: ['I got demolished. Woke up somewhere, tasting blood and shame.', 'Monumental beating: broken nose, dignity in pieces, and {w:object} stuck where the sun don\'t shine.', 'K.O. in 8 seconds. The video\'s already all over {w:app}.'] },
  },
  hack: {
    top: { fr: ['Piratage réussi : j\'ai siphonné des données ultra-secrètes. Il y avait surtout des photos de chats.', 'ACCÈS AUTORISÉ. J\'ai changé le fond d\'écran de toute la boîte en photo de {w:animal}.', 'Hack parfait, zéro trace. Je me sens comme dans un film, en jogging.'], en: ['Hack successful: I siphoned top-secret data. It was mostly cat pictures.', 'ACCESS GRANTED. I changed the whole company\'s wallpaper to {w:animal}.', 'Flawless hack, zero trace. I feel like a movie hacker, in sweatpants.'] },
    mid: { fr: ['Piratage à moitié réussi : j\'ai récupéré un fichier Excel et un virus.', 'Hack laborieux. J\'ai dû redémarrer trois fois et appeler mon cousin.', 'J\'ai percé un pare-feu sur trois. Le reste était protégé par le mot de passe « 1234 », mais je l\'ai pas trouvé.'], en: ['Half-successful hack: got an Excel file and a virus.', 'Laborious hack. Had to reboot three times and call my cousin.', 'Breached one firewall out of three. The rest was protected by "1234", but I didn\'t guess it.'] },
    low: { fr: ['Piratage raté : ils ont tracé mon IP. Mon ordinateur affiche maintenant une photo de moi en train de pleurer.', 'Hack foiré : j\'ai accidentellement envoyé mon historique de recherche à tout le service informatique.', 'Échec total. Le pare-feu s\'est moqué de moi en ASCII art.'], en: ['Failed hack: they traced my IP. My computer now shows a photo of me crying.', 'Botched hack: accidentally emailed my search history to the whole IT department.', 'Total failure. The firewall mocked me in ASCII art.'] },
  },
  race: {
    top: { fr: ['Course de rue : victoire au finish, en sortant le frein à main dans le dernier virage. Les flics sont encore en train de chercher.', 'J\'ai gagné la course illégale. Le perdant m\'a filé ses clés et sa dignité.', 'Rodéo nocturne victorieux : j\'ai semé tout le monde, y compris {w:animal} qui traversait.'], en: ['Street race: won at the line with a last-corner handbrake turn. The cops are still looking.', 'Won the illegal race. The loser handed over his keys and his dignity.', 'Night race victory: I left everyone behind, including {w:animal} crossing the road.'] },
    mid: { fr: ['Course de rue : deuxième. J\'ai rayé la voiture contre {w:object}, mais j\'ai sauvé l\'honneur.', 'Course moyenne : j\'ai calé au départ mais rattrapé deux voitures.', 'J\'ai fini la course, pas en tête, mais vivant{|e}. C\'est déjà ça.'], en: ['Street race: second place. Scraped the car on {w:object}, but saved face.', 'Average race: stalled at the start but caught up two cars.', 'Finished the race, not first, but alive. That\'s something.'] },
    low: { fr: ['Course de rue : accident spectaculaire, la voiture a fait trois tonneaux et a atterri {w:at_place}.', 'J\'ai perdu la course et un rétroviseur. Puis un deuxième. Puis la voiture entière dans un fossé.', 'Crash monumental : airbag dans la face, flics dans le rétro.'], en: ['Street race: spectacular crash, the car rolled three times and landed somewhere absurd.', 'Lost the race and a mirror. Then the other one. Then the whole car in a ditch.', 'Monumental crash: airbag in the face, cops in the mirror.'] },
  },
  slots: { top: { fr: ['Machine à sous : JACKPOT ! Les pièces débordaient, j\'en ai rempli mes poches et mon soutif.'], en: ['Slots: JACKPOT! Coins overflowing, I stuffed my pockets and my bra.'] }, mid: { fr: ['Machine à sous : à peu près à l\'équilibre, si on oublie les 3 heures perdues.'], en: ['Slots: about break-even, if you ignore the 3 hours lost.'] }, low: { fr: ['La machine à sous m\'a tout pris. Elle a même fait un petit bruit moqueur.'], en: ['The slot machine took everything. It even made a little mocking sound.'] } },
  trading: { top: { fr: ['Day trading : TO THE MOON 🚀 ! J\'ai acheté au plus bas et revendu au plus haut, comme un génie (ou un chanceux).'], en: ['Day trading: TO THE MOON 🚀! Bought the dip, sold the top, like a genius (or a lucky idiot).'] }, mid: { fr: ['Day trading : petit gain, gros stress. J\'ai rafraîchi le graphique 400 fois.'], en: ['Day trading: small gain, big stress. Refreshed the chart 400 times.'] }, low: { fr: ['Day trading : liquidé. J\'ai acheté au sommet et vendu au fond, comme tout le monde.'], en: ['Day trading: liquidated. Bought the top, sold the bottom, like everyone else.'] } },
};

/** Stake (local currency) for money minigames, computed BEFORE the game so the UI can show it. */
export function arcadeStake(life: Life, content: Content, kind: 'slots' | 'trading'): number {
  const c = country(content, life.country);
  const min = toLocal(kind === 'slots' ? 20 : 100, c);
  return Math.max(0, Math.round(Math.min(life.money, Math.max(min, life.money * (kind === 'slots' ? 0.05 : 0.2)))));
}

/**
 * Applies a minigame result. `score` 0..1; `extra` = net result as a fraction of the stake for slots/trading.
 * `fromCrime` hack results are handled by commitCrime (bonus) instead.
 */
export function arcadeResult(life: Life, content: Content, kind: ArcadeKind, score: number, extra = 0): Resolution {
  const before = snapshot(life);
  const rng = rngOf(life);
  const tier: Tier = score >= 0.7 ? 'top' : score >= 0.4 ? 'mid' : 'low';
  const c = country(content, life.country);
  const s = (k: keyof Life['stats'], v: number) => { life.stats[k] = clamp(life.stats[k] + v); };
  const visual: VisualFx[] = [];
  let icon = '🎮';
  let money = 0;
  life.counters[`mg_${kind}`] = (life.counters[`mg_${kind}`] ?? 0) + 1;
  if (score >= 0.95) life.counters.mg_s = (life.counters.mg_s ?? 0) + 1;
  switch (kind) {
    case 'karaoke': case 'concert': case 'dj': {
      icon = kind === 'karaoke' ? '🎤' : kind === 'concert' ? '🎸' : '🎧';
      s('happy', (score - 0.4) * 20);
      life.attrs.fame = clamp(life.attrs.fame + (kind === 'karaoke' ? 1 : 4) * (score - 0.3));
      life.followers = Math.max(0, life.followers + Math.round((score - 0.35) * (kind === 'karaoke' ? 300 : 3000) * (1 + life.attrs.fame / 25)));
      if (life.job) life.job.perf = clamp(life.job.perf + (score - 0.45) * 30);
      if (kind !== 'karaoke' && score >= 0.5) money = toLocal(rng.range(100, 1500) * score * (1 + life.attrs.fame / 20), c);
      if (tier === 'top') visual.push('confetti');
      break;
    }
    case 'beerpong':
      icon = '🍺';
      s('happy', (score - 0.3) * 15); s('health', -2 - (1 - score) * 4);
      life.addictions.alcohol = clamp((life.addictions.alcohol ?? 0) + 3 + (1 - score) * 4);
      if (tier === 'low' && rng.chance(0.4)) visual.push('poop');
      break;
    case 'fight':
      icon = '🥊';
      if (tier === 'top') { s('happy', 8); life.attrs.karma = clamp(life.attrs.karma - 4); life.attrs.athletic = clamp(life.attrs.athletic + 2); visual.push('gore'); }
      else if (tier === 'mid') { s('health', -8); s('looks', -2); }
      else { s('health', -15 - rng.range(0, 10)); s('looks', -5); s('happy', -6); visual.push('gore'); }
      if (!life.prison && rng.chance(0.15)) life.heat = clamp((life.heat ?? 0) + 8);
      break;
    case 'hack':
      icon = '💻';
      if (life.job) life.job.perf = clamp(life.job.perf + (score - 0.45) * 35);
      s('smarts', (score - 0.4) * 4);
      if (tier === 'low' && rng.chance(0.3)) life.heat = clamp((life.heat ?? 0) + 10);
      break;
    case 'race':
      icon = '🏁';
      if (tier === 'top') { money = toLocal(rng.range(500, 5000), c); life.attrs.fame = clamp(life.attrs.fame + 2); visual.push('money'); }
      else if (tier === 'low') { s('health', -10 - rng.range(0, 15)); visual.push('explosion'); if (rng.chance(0.35)) life.heat = clamp((life.heat ?? 0) + 15); }
      s('happy', (score - 0.4) * 15);
      break;
    case 'slots': case 'trading': {
      icon = kind === 'slots' ? '🎰' : '📈';
      const stake = arcadeStake(life, content, kind);
      money = Math.round(stake * Math.max(-1, extra));
      if (kind === 'slots') life.addictions.gambling = clamp((life.addictions.gambling ?? 0) + 5);
      s('happy', money >= 0 ? 6 : -6);
      if (money > 0) visual.push('money');
      break;
    }
  }
  let text = renderLoc(TXT[kind][tier], { life, content, memo: `arcade:${kind}:${tier}` }, () => rng.next());
  if (money) {
    life.money += Math.round(money);
    const m = { fr: formatMoney(Math.abs(money), c, 'fr'), en: formatMoney(Math.abs(money), c, 'en') };
    text = { fr: `${text.fr} (${money > 0 ? '+' : '−'}${m.fr})`, en: `${text.en} (${money > 0 ? '+' : '−'}${m.en})` };
  }
  life.used[`arcade:${kind}`] = (life.used[`arcade:${kind}`] ?? 0) + 1;
  const tone = tier === 'low' || money < 0 ? 'bad' : tier === 'top' ? 'good' : 'neutral';
  addLine(life, text, icon, tone);
  return { text, icon, tone, deltas: diff(life, before), mood: tier === 'top' ? 'party' : tier === 'mid' ? 'neutral' : 'sad', visual: visual.length ? visual : undefined };
}
