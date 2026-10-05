// « Le Torchon » — a trashy tabloid front page: obituary at death, or the headlines of the current year.
import { summarize, careerTitle, roleTitle, npcAge, hash01, type Life, type LogLine, type Npc } from '@bl/sim';
import { content } from '@bl/data';
import { lang, rev } from '../state.ts';
import { Portrait, money } from './common.tsx';
import { sfx } from '../audio.ts';

const T = (fr: string, en: string) => (lang.value === 'fr' ? fr : en);

const LOVE_FR = ['« C\'était une personne merveilleuse. Enfin, la plupart du temps. »', '« Je n\'arrive pas à y croire. On devait aller chez Ikea samedi. »', '« Le paradis vient de gagner un sacré numéro. »', '« Je garderai son pull. Et sa carte bleue. »', '« Il/elle me manque déjà. Surtout sa voiture. »'];
const LOVE_EN = ['"A wonderful person. Most of the time."', '"I can\'t believe it. We were going to Ikea on Saturday."', '"Heaven just gained a real character."', '"I\'ll keep the sweater. And the credit card."', '"I miss them already. Especially their car."'];
const HATE_FR = ['« Enfin ! Je vais pouvoir danser sur sa tombe. J\'ai pris des cours. »', '« Bon débarras. Je réclame le grille-pain. »', '« Il/elle me devait 40 balles. Qui me rembourse ? »', '« Je ne dirai rien de méchant. Alors je ne dirai rien. »', '« J\'apporterai du champagne aux funérailles. Deux bouteilles. »'];
const HATE_EN = ['"Finally! I can dance on their grave. I took lessons."', '"Good riddance. I want the toaster."', '"They owed me 40 bucks. Who pays me back?"', '"I won\'t say anything mean. So I won\'t say anything."', '"I\'m bringing champagne to the funeral. Two bottles."'];
const ADS: [string, string][] = [
  ['🪦 POMPES FUNÈBRES DUPONT — 2 cercueils achetés, le 3e offert !', '🪦 DUPONT FUNERALS — Buy 2 coffins, get the 3rd free!'],
  ['💊 MAGNÉSIUM-PLUS : vous ne mourrez pas, ou remboursé*. (*non remboursé)', '💊 MAGNESIUM-PLUS: you won\'t die or your money back*. (*no refunds)'],
  ['⚖️ Maître Requin, avocat : « Coupable ? Pas chez moi. »', '⚖️ Shark & Co, attorneys: "Guilty? Not on my watch."'],
  ['🔮 Madame Irma contacte vos défunts. Paiement d\'avance.', '🔮 Madame Irma contacts your dead. Payment upfront.'],
  ['🍆 Pilule bleue discount — livraison discrète en camion de glaces.', '🍆 Discount blue pills — discreet delivery by ice-cream truck.'],
  ['🏚️ À vendre : maison hantée, vue sur cimetière, fantôme inclus.', '🏚️ For sale: haunted house, cemetery view, ghost included.'],
];

function rnd(l: Life, k: number) { return hash01(l.seed * 31 + k * 977 + l.age); }
function pick<T>(l: Life, arr: T[], k: number): T { return arr[Math.floor(rnd(l, k) * arr.length) % arr.length]; }

function lines(l: Life, tone: LogLine['tone'], n: number, k: number, onlyAge?: number): LogLine[] {
  const all = l.log.filter((y) => onlyAge === undefined || y.age === onlyAge).flatMap((y) => y.lines.filter((x) => x.tone === tone && x.t.fr.length > 30));
  const out: LogLine[] = [];
  for (let i = 0; i < all.length && out.length < n; i++) {
    const c = all[Math.floor(rnd(l, k + i * 13) * all.length)];
    if (!out.some((o) => o.t.fr === c.t.fr)) out.push(c);
  }
  return out;
}

export function Tabloid({ l, onClose }: { l: Life; onClose: () => void }) {
  void rev.value;
  const lg = lang.value;
  const s = summarize(l, content);
  const obit = !l.alive;
  const job = s.topJob ? careerTitle(content, s.topJob.careerId, s.topJob.level, l.gender, lg) : T('sans emploi', 'unemployed');
  const head = obit
    ? `${l.first.toUpperCase()} ${l.last.toUpperCase()} (${l.age} ${T('ANS', 'Y/O')}) : ${T('MORT', 'DEAD')} ${(l.death?.cause[lg] ?? '').toUpperCase()}`
    : (() => { const big = lines(l, 'bad', 1, 3, l.age)[0] ?? lines(l, 'good', 1, 5, l.age)[0] ?? l.log[l.log.length - 1]?.lines[0]; return big ? big.t[lg].replace(/^J'/, `${l.first} `).replace(/^Je /, `${l.first} `).replace(/^I /, `${l.first} `).toUpperCase() : T('RIEN NE SE PASSE, LE JOURNAL FAIT FAILLITE', 'NOTHING HAPPENS, PAPER GOES BROKE'); })();
  const sub = obit
    ? s.score > 70 ? T('Une vie bien remplie, des proches en larmes (et des héritiers ravis).', 'A full life, loved ones in tears (and delighted heirs).') : s.score > 40 ? T('Une vie moyenne, une mort plus mémorable que tout le reste.', 'An average life, a death more memorable than everything else.') : T('Personne n\'est vraiment surpris.', 'Nobody is really surprised.')
    : T(`Notre envoyé spécial a suivi ${l.first} toute l'année. Il a demandé une prime de risque.`, `Our reporter followed ${l.first} all year. He asked for hazard pay.`);
  const highs = lines(l, 'good', 3, 11, obit ? undefined : l.age);
  const lows = lines(l, 'bad', 3, 29, obit ? undefined : l.age);
  const people = l.npcs.filter((n) => n.alive && ['mother', 'father', 'spouse', 'partner', 'child', 'bestfriend', 'friend', 'ex', 'enemy', 'sibling'].includes(n.role) && npcAge(n, l.year) >= 8);
  const quotes = people.sort((a, b) => Math.abs(b.rel - 50) - Math.abs(a.rel - 50)).slice(0, 3).map((n: Npc, i) => {
    const hate = n.rel < 40 || n.role === 'ex' || n.role === 'enemy';
    const q = hate ? pick(l, lg === 'fr' ? HATE_FR : HATE_EN, 50 + i) : pick(l, lg === 'fr' ? LOVE_FR : LOVE_EN, 70 + i);
    return { n, q };
  });
  const ad = pick(l, ADS, 99);
  const price = money(l, 2);
  return (
    <div class="modal-back" onClick={(e) => { if (e.target === e.currentTarget) { sfx.close(); onClose(); } }}>
      <div class="tabloid pop-in">
        <button class="x" onClick={() => { sfx.close(); onClose(); }}>✕</button>
        <div class="tb-mast">
          <span class="tb-ear">{T('N° ', 'No. ')}{l.year % 1000} · {price}</span>
          <h1>{T('LE TORCHON', 'THE DAILY RAG')}</h1>
          <span class="tb-ear">{l.city}, {l.year}</span>
        </div>
        <div class="tb-tag">{T('L\'information qui sent mauvais depuis 1872', 'News that stinks since 1872')}</div>
        <h2 class="tb-head">{head}</h2>
        <p class="tb-sub">{sub}</p>
        <div class="tb-grid">
          <div class="tb-photo">
            <Portrait l={l} size={150} mood={obit ? 'sleepy' : 'shock'} />
            <small>{obit ? T('Le défunt, sur sa meilleure photo (la seule).', 'The deceased, best photo (the only one).') : T('Photo volée par nos paparazzi.', 'Photo stolen by our paparazzi.')}</small>
          </div>
          <div class="tb-col">
            <h3>{obit ? T('Sa vie en bref', 'Life in brief') : T('Fiche du suspect', 'Suspect file')}</h3>
            <ul>
              <li>💼 {job}</li>
              <li>💰 {money(l, s.netWorth)}</li>
              <li>👶 {s.children} {T('enfant(s)', 'kid(s)')} · 💍 {l.counters.marriages ?? 0}</li>
              {(l.counters.crimes ?? 0) > 0 && <li>🚔 {l.counters.crimes} {T('crime(s)', 'crime(s)')} · {l.record.length} {T('condamnation(s)', 'conviction(s)')}</li>}
              <li>⭐ {T('Score de vie', 'Life score')} : {s.score}</li>
            </ul>
          </div>
        </div>
        {highs.length > 0 && <div class="tb-sect"><h3>✨ {T('Les grands moments', 'The highlights')}</h3>{highs.map((x, i) => <p key={i}>{x.icon} {x.t[lg]}</p>)}</div>}
        {lows.length > 0 && <div class="tb-sect"><h3>🍳 {T('Les casseroles', 'The skeletons')}</h3>{lows.map((x, i) => <p key={i}>{x.icon} {x.t[lg]}</p>)}</div>}
        {quotes.length > 0 && (
          <div class="tb-sect">
            <h3>🎤 {obit ? T('Ils témoignent', 'Tributes') : T('Ses proches réagissent', 'Loved ones react')}</h3>
            {quotes.map(({ n, q }) => <p key={n.id}><i>{q.replace('Il/elle', l.gender === 'f' ? 'Elle' : 'Il').replace('them', l.gender === 'f' ? 'her' : 'him').replace('They', l.gender === 'f' ? 'She' : 'He').replace('their', l.gender === 'f' ? 'her' : 'his').replace('they', l.gender === 'f' ? 'she' : 'he')}</i> — {n.first}, {roleTitle(n.role, n.gender, lg).toLowerCase()}</p>)}
          </div>
        )}
        <div class="tb-ad">{ad[lg === 'fr' ? 0 : 1]}</div>
      </div>
    </div>
  );
}
