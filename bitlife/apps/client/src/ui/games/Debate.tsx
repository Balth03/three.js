// Verbal duel (trial, closing argument, interrogation, first date): Ace-Attorney-style tug of war with timed replies.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useGame, useKeys, useLoop, Arena, tr, type GameProps } from './kit.tsx';
import { sfx } from '../../audio.ts';

type L = [string, string];
interface Round { line: L; answers: { t: L; v: number }[] }
interface Cfg { title: L; icon: string; foe: string; foeName: L; meter: L; theme: 'sunset' | 'ice' | 'neon' | 'blood'; win: L; slam: L; rounds: Round[] }

const A = (fr: string, en: string, v: number) => ({ t: [fr, en] as L, v });
const CFG: Record<'trial' | 'case' | 'interrogation' | 'date', Cfg> = {
  trial: {
    title: ['Ton procès', 'Your trial'], icon: '⚖️', foe: '🧑‍⚖️', foeName: ['Le procureur', 'The prosecutor'], meter: ['Jury', 'Jury'], theme: 'sunset', win: ['NON COUPABLE', 'NOT GUILTY'], slam: ['OBJECTION !', 'OBJECTION!'],
    rounds: [
      { line: ['« L\'accusé a été filmé sur les lieux du crime à 3 h du matin ! »', '"The defendant was filmed at the crime scene at 3 a.m.!"'], answers: [A('« Mon jumeau maléfique, Votre Honneur. »', '"My evil twin, Your Honour."', 10), A('« J\'étais somnambule, j\'ai un certificat. »', '"I was sleepwalking, I have a doctor\'s note."', 14), A('« Et alors ? Vous étiez où, vous ? »', '"So? Where were YOU?"', -8), A('Pleurer très fort', 'Cry very loudly', 4)] },
      { line: ['« On a retrouvé vos empreintes sur l\'arme ! »', '"Your fingerprints were found on the weapon!"'], answers: [A('« Je l\'ai touchée… pour la nettoyer. Civisme. »', '"I touched it… to clean it. Good citizenship."', 8), A('« Ce ne sont pas mes empreintes, ce sont mes doigts. »', '"Those aren\'t my fingerprints, those are my fingers."', -6), A('Montrer une photo de ton chat au jury', 'Show the jury a photo of your cat', 13), A('« Contestez ça, espèce de flan ! »', '"Contest this, you pudding!"', -12)] },
      { line: ['« Un témoin vous a vu fuir en riant de façon diabolique ! »', '"A witness saw you fleeing, laughing maniacally!"'], answers: [A('« Je ris toujours comme ça. Écoutez : MOUAHAHA. »', '"I always laugh like that. Listen: MWAHAHA."', -10), A('« Ce témoin est myope ET bourré. »', '"That witness is short-sighted AND drunk."', 15), A('« J\'avais une crampe, je courais vers la pharmacie. »', '"I had a cramp, I was running to the pharmacy."', 9), A('Faire un clin d\'œil au témoin', 'Wink at the witness', 3)] },
      { line: ['« Vous avez publié "j\'ai fait une connerie" la nuit des faits ! »', '"You posted \'I did something stupid\' that very night!"'], answers: [A('« Je parlais de ma coupe de cheveux. Regardez-la. »', '"I was talking about my haircut. Look at it."', 14), A('« Mon compte a été piraté par des Russes. »', '"My account was hacked by hackers."', 7), A('« Oui, et je regrette. Pas le crime, le post. »', '"Yes, and I regret it. Not the crime, the post."', -14), A('Citer la Constitution, article 404', 'Quote the Constitution, article 404', 6)] },
      { line: ['« L\'accusé n\'a aucun alibi ! »', '"The defendant has no alibi!"'], answers: [A('« J\'étais chez ma grand-mère. Elle est morte, mais elle confirmerait. »', '"I was at my grandma\'s. She\'s dead, but she\'d confirm."', 9), A('Sortir un ticket de cinéma froissé', 'Produce a crumpled cinema ticket', 16), A('« L\'alibi, c\'est pour les coupables. »', '"Alibis are for guilty people."', -7), A('Chanter l\'hymne national', 'Sing the national anthem', 5)] },
      { line: ['« Regardez-le, Mesdames et Messieurs : c\'est la tête d\'un coupable ! »', '"Look at him, ladies and gentlemen: that\'s a guilty face!"'], answers: [A('« Délit de sale gueule ! Objection ! »', '"Judging by looks! Objection!"', 15), A('Faire ta tête la plus innocente', 'Pull your most innocent face', 8), A('« Votre mère avait la même hier soir. »', '"Your mother made the same face last night."', -13), A('Mettre des lunettes pour avoir l\'air intelligent', 'Put on glasses to look smart', 6)] },
    ],
  },
  case: {
    title: ['Plaidoirie', 'Closing argument'], icon: '👨‍⚖️', foe: '🦹', foeName: ['L\'avocat adverse', 'Opposing counsel'], meter: ['Jury', 'Jury'], theme: 'sunset', win: ['AFFAIRE GAGNÉE', 'CASE WON'], slam: ['PRENDS ÇA !', 'TAKE THAT!'],
    rounds: [
      { line: ['« Votre client a avoué trois fois à la télé ! »', '"Your client confessed three times on TV!"'], answers: [A('« Il était sous l\'emprise d\'un kebab avarié. »', '"He was under the influence of a bad kebab."', 12), A('« Les aveux ne valent rien sans preuve. »', '"Confessions mean nothing without evidence."', 15), A('« Bon, d\'accord, il est coupable. »', '"OK fine, he\'s guilty."', -16), A('Lancer un PowerPoint de 80 slides', 'Launch an 80-slide PowerPoint', -6)] },
      { line: ['« Les caméras le montrent clairement ! »', '"The cameras clearly show him!"'], answers: [A('« Pixelisé ! Ça pourrait être n\'importe quel chauve. »', '"Pixelated! Could be any bald guy."', 14), A('Brandir une preuve surprise', 'Brandish surprise evidence', 16), A('Faire pleurer la mère du client', 'Make the client\'s mum cry', 9), A('« Objection ! (sans raison) »', '"Objection! (no reason)"', -4)] },
      { line: ['« Mon confrère n\'a même pas lu le dossier ! »', '"My colleague hasn\'t even read the file!"'], answers: [A('« Je l\'ai lu… en diagonale… dans le noir. »', '"I read it… skimmed it… in the dark."', -6), A('Citer la page 347 de mémoire', 'Quote page 347 from memory', 15), A('« Et vous, vous avez lu ma facture ? »', '"And have YOU read my invoice?"', 7), A('Renverser son café sur ses notes', 'Spill coffee on his notes', 10)] },
      { line: ['« La victime réclame 2 millions de dommages ! »', '"The victim demands 2 million in damages!"'], answers: [A('« Pour un orteil ? Il a encore les neuf autres ! »', '"For one toe? He still has nine!"', 12), A('Montrer la victime en train de danser sur Insta', 'Show the victim dancing on Insta', 16), A('« On peut payer en tickets resto ? »', '"Can we pay in meal vouchers?"', 3), A('Insulter la victime', 'Insult the victim', -14)] },
      { line: ['« L\'expert est formel : c\'est son ADN ! »', '"The expert is adamant: it\'s his DNA!"'], answers: [A('« Cet expert a eu son diplôme dans une pochette-surprise. »', '"That expert got his degree from a cereal box."', 14), A('« L\'ADN, c\'est un peu comme l\'horoscope. »', '"DNA is kind of like horoscopes."', -5), A('« Mon client a un jumeau. Et un clone. »', '"My client has a twin. And a clone."', 8), A('Exiger une contre-expertise', 'Demand a second opinion', 11)] },
      { line: ['« Votre client est un danger public ! »', '"Your client is a public menace!"'], answers: [A('Plaidoirie finale enflammée', 'Fiery closing argument', 15), A('Citer une chanson de variété', 'Quote a cheesy pop song', 6), A('« Un danger, oui, mais un danger poli. »', '"A menace, yes, but a polite one."', 5), A('Faire un malaise pour gagner du temps', 'Fake fainting to buy time', -3)] },
    ],
  },
  interrogation: {
    title: ['Interrogatoire', 'Interrogation'], icon: '🕵️', foe: '😰', foeName: ['Le suspect', 'The suspect'], meter: ['Pression', 'Pressure'], theme: 'ice', win: ['AVEUX COMPLETS', 'FULL CONFESSION'], slam: ['AVOUE !', 'CONFESS!'],
    rounds: [
      { line: ['« Je dirai rien sans mon avocat. »', '"I\'m not talking without my lawyer."'], answers: [A('« Ton avocat ? Il nous a déjà tout balancé. »', '"Your lawyer? He already ratted you out."', 13), A('Lui offrir un café', 'Offer him a coffee', 8), A('Frapper la table très fort', 'Slam the table really hard', 11), A('Lui demander son signe astro', 'Ask his star sign', -5)] },
      { line: ['« J\'étais au cinéma, demandez à n\'importe qui ! »', '"I was at the movies, ask anyone!"'], answers: [A('« Quel film ? Raconte la fin. »', '"Which movie? Tell me the ending."', 15), A('« Le cinéma est fermé depuis 2019. »', '"That cinema closed in 2019."', 14), A('Manger son sandwich devant lui', 'Eat his sandwich in front of him', 6), A('« Ah ok, désolé. Tu peux partir. »', '"Oh OK, sorry. You can go."', -16)] },
      { line: ['« Vous avez rien contre moi ! »', '"You\'ve got nothing on me!"'], answers: [A('Étaler les photos sur la table, lentement', 'Spread the photos on the table, slowly', 15), A('Bluffer : « Ton complice a parlé »', 'Bluff: "Your partner talked"', 13), A('« C\'est vrai. Bonne soirée. »', '"True. Have a nice evening."', -12), A('Le fixer en silence pendant 5 minutes', 'Stare at him silently for 5 minutes', 9)] },
      { line: ['« Je veux un verre d\'eau. »', '"I want a glass of water."'], answers: [A('« Les aveux d\'abord, l\'eau après. »', '"Confession first, water after."', 10), A('Boire un grand verre d\'eau devant lui', 'Drink a big glass of water in front of him', 12), A('Lui donner de l\'eau et un câlin', 'Give him water and a hug', -4), A('Lui apporter de l\'eau… gazeuse tiède', 'Bring him lukewarm sparkling water', 7)] },
      { line: ['« Ma mère va venir me chercher ! »', '"My mum\'s coming to get me!"'], answers: [A('« Elle est dans la salle d\'à côté. Elle pleure. »', '"She\'s next door. She\'s crying."', 14), A('« Elle nous a dit que t\'étais un menteur depuis tes 4 ans. »', '"She told us you\'ve been a liar since you were 4."', 12), A('Appeler sa mère en haut-parleur', 'Call his mum on speakerphone', 16), A('Rire nerveusement', 'Laugh nervously', -6)] },
      { line: ['« D\'accord… si je parle, j\'ai quoi en échange ? »', '"OK… if I talk, what do I get?"'], answers: [A('Promettre un arrangement', 'Promise a deal', 14), A('« Un paquet de chips et ma considération. »', '"A bag of chips and my respect."', 9), A('Le laisser seul 3 heures', 'Leave him alone for 3 hours', 7), A('Pleurer avec lui', 'Cry with him', -6)] },
    ],
  },
  date: {
    title: ['Le rencard', 'The date'], icon: '💘', foe: '😏', foeName: ['Ton rencard', 'Your date'], meter: ['Charme', 'Charm'], theme: 'neon', win: ['DEUXIÈME RENCARD !', 'SECOND DATE!'], slam: ['SÉDUCTION !', 'SMOOTH!'],
    rounds: [
      { line: ['« Alors, tu fais quoi dans la vie ? »', '"So, what do you do?"'], answers: [A('Raconter une anecdote drôle sur ton boulot', 'Tell a funny work story', 13), A('Parler de ton ex pendant 20 minutes', 'Talk about your ex for 20 minutes', -14), A('« Je suis dans la crypto. » (t\'as 12 €)', '"I\'m in crypto." (you have $12)', -6), A('Lui retourner la question avec intérêt', 'Ask them back, genuinely', 11)] },
      { line: ['« J\'adore les animaux. »', '"I love animals."'], answers: [A('Montrer 200 photos de ton chat', 'Show 200 photos of your cat', 6), A('« Moi aussi, surtout en barbecue. »', '"Me too, especially barbecued."', -9), A('Parler de ton refuge préféré', 'Talk about your favourite shelter', 13), A('Imiter un dauphin', 'Do a dolphin impression', 8)] },
      { line: ['« Tu veux partager un dessert ? »', '"Want to share a dessert?"'], answers: [A('« Avec plaisir, choisis. »', '"Gladly, you pick."', 12), A('Manger le dessert entier seul', 'Eat the whole dessert alone', -10), A('Faire l\'avion avec la cuillère', 'Do the airplane with the spoon', 7), A('Commander pour toi, pas pour lui/elle', 'Order for yourself only', -5)] },
      { line: ['« Tu crois à l\'astrologie ? »', '"Do you believe in astrology?"'], answers: [A('« Seulement quand ça m\'arrange. »', '"Only when it suits me."', 12), A('Lui faire une conférence de 40 min sur la science', 'Give a 40-minute science lecture', -8), A('Deviner son signe (au pif)', 'Guess their sign (wild guess)', 10), A('« Je suis Scorpion, fuis tant qu\'il est temps. »', '"I\'m a Scorpio, run while you can."', 8)] },
      { line: ['*Silence gênant*', '*Awkward silence*'], answers: [A('Complimenter son sourire', 'Compliment their smile', 13), A('Roter discrètement (pas discrètement)', 'Burp discreetly (not discreetly)', -9), A('Proposer un jeu stupide', 'Suggest a stupid game', 10), A('Regarder ton téléphone', 'Check your phone', -12)] },
      { line: ['« Bon… on fait quoi maintenant ? »', '"So… what now?"'], answers: [A('Proposer un dernier verre', 'Suggest one last drink', 12), A('Partager l\'addition', 'Split the bill', 7), A('Partir en courant', 'Run away', -12), A('Proposer une balade sous les étoiles', 'Suggest a walk under the stars', 14)] },
    ],
  },
};

export function Debate({ onDone, l, variant = 'trial' }: GameProps) {
  const cfg = CFG[(variant as keyof typeof CFG)] ?? CFG.trial;
  const g = useGame({ onDone });
  const lg = document.documentElement.lang === 'en' ? 1 : 0;
  const rounds = useMemo(() => cfg.rounds.slice().sort(() => Math.random() - 0.5).slice(0, 5).map((r) => ({ ...r, answers: r.answers.slice().sort(() => Math.random() - 0.5) })), []);
  const [ri, setRi] = useState(0);
  const [meter, setMeterS] = useState(45);
  const meterRef = useRef(45);
  const setMeter = (f: (m: number) => number) => { meterRef.current = f(meterRef.current); setMeterS(meterRef.current); };
  const [typed, setTyped] = useState(0);
  const [slam, setSlam] = useState<{ good: boolean; id: number } | null>(null);
  const [foeMood, setFoeMood] = useState<'neutral' | 'hurt' | 'smug'>('neutral');
  const tLeft = useRef(7);
  const [, force] = useState(0);
  const lock = useRef(false);
  const r = rounds[ri];
  const skill = variant === 'date' ? l.stats.looks : l.stats.smarts;
  useEffect(() => { setTyped(0); tLeft.current = 7; lock.current = false; setFoeMood('neutral'); }, [ri]);
  useLoop((dt) => {
    if (!r) return;
    setTyped((n) => Math.min(r.line[lg].length, n + dt * 55));
    if (!lock.current && typed >= r.line[lg].length) { tLeft.current -= dt; force((x) => x + 1); if (tLeft.current <= 0) choose(-1); }
  }, g.phase === 'play');
  const choose = (i: number) => {
    if (!r || lock.current || g.phase !== 'play') return;
    lock.current = true;
    const a = r.answers[i];
    const speed = Math.max(0, tLeft.current) / 7;
    let delta = a ? Math.round(a.v * (0.8 + speed * 0.4) + (skill - 50) / 12) : -12;
    if (!a) g.float(tr('TROP LENT !', 'TOO SLOW!'), 50, 40, '#ff4d6d', true);
    const good = delta > 0;
    setMeter((m) => Math.max(0, Math.min(100, m + delta)));
    setSlam({ good, id: Date.now() });
    setFoeMood(good ? 'hurt' : 'smug');
    if (good) { g.hit(delta > 12 ? 'perfect' : 'good'); g.add(delta * 10, `+${delta}`, 50, 55, '#06d6a0'); g.flash('#ffffff'); g.shake(); sfx.punch(); g.burst(70, 35, '#ffd166', 26); }
    else { g.miss(`${delta}`, 50, 55); g.flash('#ff1f3d'); }
    setTimeout(() => {
      setSlam(null);
      if (ri + 1 >= rounds.length) {
        const m = meterRef.current;
        g.end(m / 100, [[tr(cfg.meter[0], cfg.meter[1]), `${m}%`], [tr('Verdict', 'Verdict'), m >= 60 ? T(cfg.win) : tr('PERDU', 'LOST')], [tr('Combo max', 'Best combo'), String(g.best)]]);
      } else setRi(ri + 1);
    }, 1100);
  };
  useKeys((e) => { const m = /^(Digit|Numpad)([1-4])$/.exec(e.code); if (m) choose(+m[2] - 1); });
  const T = (p: L) => p[lg];
  return (
    <Arena g={g} title={T(cfg.title)} icon={cfg.icon} theme={cfg.theme} scoreLabel={T(cfg.meter).toUpperCase()}
      howTo={tr('Ton adversaire parle, tu réponds vite et bien : chaque bonne réplique fait pencher la balance. Trop lent = pénalité.', 'Your opponent talks, you answer fast and well: every good comeback tips the scales. Too slow = penalty.')}
      keys={['1', '2', '3', '4']}>
      <div class="debate">
        <div class="db-meter"><span>{tr('Toi', 'You')}</span><div class="db-bar"><div style={{ width: `${meter}%` }} /><i style={{ left: `${meter}%` }}>⚡</i></div><span>{T(cfg.foeName)}</span></div>
        <div class={`db-foe mood-${foeMood}`}><div class="db-face">{foeMood === 'hurt' ? '😵' : foeMood === 'smug' ? '😏' : cfg.foe}</div><div class="db-name">{T(cfg.foeName)}</div></div>
        {r && <div class="db-bubble">{T(r.line).slice(0, Math.floor(typed))}<span class="caret">▌</span></div>}
        {r && typed >= T(r.line).length && (
          <div class="db-answers">
            <div class="db-timer"><div style={{ width: `${Math.max(0, tLeft.current / 7) * 100}%` }} /></div>
            {r.answers.map((a, i) => <button key={i} class="db-ans" disabled={lock.current} onClick={() => choose(i)}><kbd>{i + 1}</kbd>{T(a.t)}</button>)}
          </div>
        )}
        {slam && <div class={`db-slam ${slam.good ? 'good' : 'bad'}`} key={slam.id}>{slam.good ? T(cfg.slam) : tr('AÏE…', 'OUCH…')}</div>}
        <div class="db-round">{Math.min(ri + 1, rounds.length)} / {rounds.length}</div>
      </div>
    </Arena>
  );
}
