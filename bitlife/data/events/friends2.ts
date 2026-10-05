// Friends 2: actor-driven social stories — friends & best friends, exes, enemies, coworkers & bosses,
// classmates (minors: rating ≤ 1, never sexual), neighbours, roommates, strangers and online friends.
// Chains: fr2_loan_startup → fr2_loan_startup_due (schedule), fr2_friend_famous → fr2_famous_dropped (schedule),
// fr2_ex_revenge_plot → fr2_ex_revenge_result (chain), fr2_office_affair_seen → fr2_affair_leverage (flag),
// fr2_neighbour_feud → fr2_neighbour_feud_war (schedule).
import type { EventDef } from '@bl/sim';

export const friends2Events: EventDef[] = [
  // ───────────────────────────── friends: money, partners, trips ─────────────────────────────
  {
    id: 'fr2_loan_startup',
    icon: '💸',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    vars: { amount: [500, 3000] },
    scene: { place: 'home', mood: 'neutral', prop: 'phone' },
    when: { age: [20, 70] },
    weight: 7,
    cooldown: 8,
    text: {
      fr: [
        "{a.first}, {a.rel}, a une idée « qui va tout changer » : livrer {w:food} par drone. Il ne lui manque que {$amount}. Les tiens, de préférence.",
        "{w:exclaim} {a.first} débarque avec un business plan imprimé en Comic Sans. Le concept : louer {w:animal} aux gens qui s'ennuient le dimanche. Mise de départ demandée : {$amount}.",
        "{a.first} t'emmène {w:to_place} « pour parler affaires ». Entre deux bouchées, {a:il|elle} te demande {$amount} pour lancer sa marque de [[bougies au fromage|kombucha artisanal|chaussettes connectées]]. « Je te rends le double, juré. »",
        "Message vocal de quatre minutes de {a.first} : {a:il|elle} a « trouvé LE filon », un truc avec {w:object} et de la blockchain. Il manque {$amount}. En fond, on entend {w:sound}.",
      ],
      en: [
        "{a.first}, {a.rel}, has an idea 'that will change everything': delivering {w:food} by drone. All {a:he|she} needs is {$amount}. Yours, ideally.",
        "{w:exclaim} {a.first} shows up with a business plan printed in Comic Sans. The concept: renting out {w:animal} to people who are bored on Sundays. Seed money required: {$amount}.",
        "{a.first} takes you {w:to_place} 'to talk business'. Between two bites, {a:he|she} asks for {$amount} to launch a brand of [[cheese-scented candles|craft kombucha|smart socks]]. 'I'll pay you back double, swear.'",
        "Four-minute voice memo from {a.first}: {a:he|she} 'found THE gold mine', something involving {w:object} and the blockchain. {a:He|She} is short {$amount}. In the background, you hear {w:sound}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Prêter le fric', en: 'Lend the cash' },
        text: {
          fr: ["J'ai prêté {$amount} à {a.first}. {a:Il|Elle} m'a serré{|e} dans ses bras en hurlant « ASSOCIÉ{|E} ! ». Je n'ai signé aucun papier. J'ai juste un câlin.", "J'ai fait le virement de {$amount}. Libellé choisi par {a.first} : « l'avenir ». Mon banquier m'a appelé{|e} pour vérifier que j'allais bien."],
          en: ["I lent {a.first} {$amount}. {a:He|She} hugged me screaming 'PARTNER!'. I signed nothing. All I have is a hug.", "I wired {$amount}. Reference chosen by {a.first}: 'the future'. My banker called to check if I was okay."],
        },
        fx: { money: '-amount', rel: 12, happy: 2, schedule: { key: 'fr2_loan_startup_due', years: 2 } },
      },
      {
        label: { fr: 'Refuser gentiment', en: 'Politely decline' },
        out: [
          { w: 2, text: { fr: ["J'ai dit non avec douceur. {a.first} a soupiré : « Tu rateras le train, tant pis pour toi. » Le train, c'était {w:vehicle}.", "J'ai refusé en invoquant mon conseiller financier. Je n'en ai pas. {a.first} a fait semblant de me croire, poliment."], en: ["I said no, gently. {a.first} sighed: 'You'll miss the train, your loss.' The train was {w:vehicle}.", "I declined, citing my financial advisor. I don't have one. {a.first} politely pretended to believe me."] }, fx: { rel: -5 } },
          { w: 1, text: { fr: ["J'ai refusé. {a.first} m'a traité{|e} de « rat » devant tout le groupe, puis a lancé une cagnotte en ligne où je suis cité{|e} comme « le traître ».", "J'ai dit non. {a.first} a quitté le groupe WhatsApp, puis l'a recréé sans moi. Il s'appelle « Les Vrais »."], en: ["I said no. {a.first} called me a 'rat' in front of the whole group, then launched a crowdfunding page naming me as 'the traitor'.", "I said no. {a.first} left the group chat, then recreated it without me. It's called 'The Real Ones'."] }, fx: { rel: -15, happy: -3 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Exiger un vrai contrat', en: 'Demand a real contract' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai rédigé un contrat béton, avec intérêts. {a.first} l'a signé sans lire. J'ai prêté {$amount}, mais j'ai un papier. Un papier très joli.", "Contrat, signature, tampon de la mairie. {a.first} a trouvé ça « froid ». Moi je trouve ça rassurant. Très rassurant."], en: ["I drafted an ironclad contract, with interest. {a.first} signed without reading. I lent {$amount}, but I have paperwork. Very pretty paperwork.", "Contract, signature, notary stamp. {a.first} found it 'cold'. I find it reassuring. Very reassuring."] }, fx: { money: '-amount', rel: 3, smarts: 2, schedule: { key: 'fr2_loan_startup_due', years: 2 } } },
          { w: 1, text: { fr: ["En voyant mon contrat de 14 pages, {a.first} est parti{a:|e} en disant que l'amitié, « ça ne se notarise pas ». {a:Il|Elle} a trouvé l'argent chez sa grand-mère.", "{a.first} a lu la clause 7 et s'est vexé{a:|e}. Plus de projet, plus de prêt, et un froid polaire pendant trois semaines."], en: ["Seeing my 14-page contract, {a.first} left saying friendship 'can't be notarized'. {a:He|She} got the money from {a:his|her} grandma.", "{a.first} read clause 7 and got offended. No project, no loan, and a polar chill for three weeks."] }, fx: { rel: -8 } },
        ],
      },
    ],
  },
  {
    id: 'fr2_loan_startup_due',
    icon: '🧾',
    cat: 'friends',
    rating: 0,
    chainOnly: true,
    actor: 'anyFriend',
    vars: { amount: [1500, 8000] },
    scene: { place: 'home', mood: 'neutral', prop: 'phone' },
    text: {
      fr: [
        "Deux ans depuis ton prêt à {a.first}. Sa start-up a « pivoté » quatre fois. Aujourd'hui, {a:il|elle} vend {w:object} sur un marché. Tu oses parler de l'argent ?",
        "Tu tombes sur {a.first} {w:at_place}. {a:Il|Elle} porte une montre qui brille beaucoup trop pour quelqu'un qui te doit de l'argent depuis deux ans.",
        "{a.first} poste des photos {w:far_place}, cocktail à la main. Légende : « Investir en soi 🙏 ». Tu reconnais l'argent que tu lui as prêté. Il bronze.",
        "Ça fait deux ans. Chaque fois que tu évoques ton prêt, {a.first} change de sujet ou prétend avoir {w:food} sur le feu. Ce soir, {a:il|elle} n'a plus d'excuse.",
      ],
      en: [
        "Two years since your loan to {a.first}. The startup has 'pivoted' four times. Today, {a:he|she} sells {w:object} at a flea market. Do you dare bring up the money?",
        "You run into {a.first} {w:at_place}. {a:He|She} is wearing a watch that sparkles way too much for someone who has owed you money for two years.",
        "{a.first} posts photos {w:far_place}, cocktail in hand. Caption: 'Invest in yourself 🙏'. You recognize the money you lent. It's getting a tan.",
        "Two years. Every time you mention the loan, {a.first} changes the subject or claims to have {w:food} on the stove. Tonight, {a:he|she} is out of excuses.",
      ],
    },
    choices: [
      {
        label: { fr: 'Réclamer mon argent', en: 'Ask for my money' },
        out: [
          { w: 1, text: { fr: ["Surprise totale : le projet a marché. {a.first} m'a rendu {$amount}, intérêts compris, et m'a payé{|e} un resto. J'ai pleuré dans mon tartare.", "{a.first} a sorti une liasse de {$amount} « avec les intérêts de l'amitié ». Je ne sais pas d'où vient l'argent et je ne veux pas le savoir."], en: ["Total shock: it worked. {a.first} paid me back {$amount}, interest included, and bought me dinner. I cried into my steak tartare.", "{a.first} pulled out a wad of {$amount} 'with friendship interest'. I don't know where the money came from and I don't want to know."] }, fx: { money: 'amount', rel: 10, happy: 10 }, mood: 'happy' },
          { w: 2, text: { fr: ["{a.first} n'a pas un rond. À la place, {a:il|elle} m'a donné {w:object} « qui vaut au moins le double ». Ça ne vaut rien. Mais ça trône dans mon salon.", "{a.first} a pleuré, m'a parlé de « résilience », et m'a remboursé en bons d'achat périmés. L'amitié survit, mon compte en banque moins."], en: ["{a.first} is broke. Instead, {a:he|she} gave me {w:object} 'worth at least double'. It's worthless. But it sits proudly in my living room.", "{a.first} cried, talked about 'resilience', and repaid me in expired vouchers. The friendship survives; my bank account, less so."] }, fx: { rel: 2, happy: -4 } },
          { w: 1, text: { fr: ["{a.first} a nié m'avoir jamais emprunté quoi que ce soit, puis m'a bloqué{|e} partout. Deux ans d'amitié, effacés pour quelques billets.", "« Quel prêt ? » {a.first} m'a regardé{|e} comme si j'étais {w:insult}. On ne se parle plus. Je garde les captures d'écran, au cas où."], en: ["{a.first} denied ever borrowing anything, then blocked me everywhere. Years of friendship, deleted for a few bills.", "'What loan?' {a.first} looked at me like I was a lunatic. We don't speak anymore. I'm keeping the screenshots, just in case."] }, fx: { rel: -40, actorRole: 'enemy', happy: -8 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Effacer la dette', en: 'Forgive the debt' },
        text: {
          fr: ["J'ai dit à {a.first} d'oublier la dette. {a:Il|Elle} a pleuré, m'a appelé{|e} « mon frère de sang » et a tatoué mes initiales sur son mollet. C'était pas demandé.", "J'ai passé l'éponge. {a.first} me doit toujours de l'argent dans mon cœur, mais plus sur le papier. C'est plus léger, finalement."],
          en: ["I told {a.first} to forget the debt. {a:He|She} cried, called me 'my blood sibling' and got my initials tattooed on {a:his|her} calf. Nobody asked for that.", "I wiped the slate clean. {a.first} still owes me in my heart, just not on paper anymore. It feels lighter, honestly."],
        },
        fx: { rel: 18, karma: 6, happy: 3 },
      },
      {
        label: { fr: 'Saisir un truc chez lui', en: 'Repossess something' },
        rating: 1,
        out: [
          { w: 1, text: { fr: ["Je suis reparti{|e} de chez {a.first} avec sa télé sous le bras. « Saisie amicale », j'ai dit. {a:Il|Elle} n'a pas trouvé ça amical.", "J'ai embarqué la console de {a.first} en garantie. On est quittes, et brouillés pour l'année."], en: ["I left {a.first}'s place with the TV under my arm. 'Friendly repossession', I said. {a:He|She} didn't find it friendly.", "I took {a.first}'s game console as collateral. We're even, and not speaking for a year."] }, fx: { money: 400, rel: -20 } },
          { w: 1, text: { fr: ["J'ai voulu saisir la voiture de {a.first}. Elle n'avait plus de moteur. Je l'ai poussée sur trois kilomètres pour rien. {w:swear}", "En fouillant pour trouver un truc à saisir, j'ai découvert que {a.first} vivait avec un matelas et {w:animal}. J'ai laissé un billet sur la table, à la place."], en: ["I tried to repossess {a.first}'s car. It had no engine. I pushed it two miles for nothing. {w:swear}", "Looking for something to seize, I found out {a.first} lives with a mattress and {w:animal}. I left a bill on the table instead."] }, fx: { health: -3, rel: 4, karma: 3 } },
        ],
      },
    ],
  },
  {
    id: 'fr2_awful_partner',
    icon: '🙄',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'angry', prop: 'wine' },
    when: { age: [18, 65] },
    weight: 8,
    cooldown: 6,
    text: {
      fr: [
        "{a.first} te présente enfin sa nouvelle moitié. En dix minutes, la chose t'a expliqué {w:conspiracy}, t'a surnommé{|e} {w:nickname} et a fini ton verre.",
        "Dîner à quatre avec {a.first} et sa nouvelle conquête, qui claque des doigts pour appeler le serveur et parle de ses cryptos en mâchant {w:food} la bouche ouverte.",
        "La nouvelle moitié de {a.first} tient à te montrer ses abdos {w:at_place}. Devant tout le monde. Puis il y a eu {w:sound}. Puis les abdos, encore.",
        "Depuis qu'{a:il|elle} est en couple, {a.first} ne parle plus que par la bouche de sa moitié, qui a décidé {w:excuse} que tu étais « une mauvaise influence ».",
      ],
      en: [
        "{a.first} finally introduces you to {a:his|her} new other half. Within ten minutes, the creature explained to you {w:conspiracy}, nicknamed you {w:nickname} and finished your drink.",
        "Double date with {a.first} and {a:his|her} new catch, who snaps fingers at the waiter and talks crypto while chewing {w:food} with mouth wide open.",
        "{a.first}'s new partner insists on showing you their abs {w:at_place}. In front of everyone. Then came {w:sound}. Then the abs, again.",
        "Ever since {a:he|she} got into a relationship, {a.first} only speaks through {a:his|her} partner, who decided {w:excuse} that you're 'a bad influence'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Lui dire la vérité', en: 'Tell the truth' },
        out: [
          { w: 1, text: { fr: ["J'ai dit à {a.first} que sa moitié était une catastrophe ambulante. {a:Il|Elle} a rompu le soir même et m'a remercié{|e} avec une bouteille. J'avais raison, et j'ai du vin.", "J'ai tout déballé. {a.first} a ouvert les yeux, puis son téléphone, puis a tout bloqué. Libéré{a:|e}. On a fêté ça jusqu'à 4 h."], en: ["I told {a.first} the partner was a walking disaster. {a:He|She} broke up that very night and thanked me with a bottle. I was right, AND I got wine.", "I spilled everything. {a.first} opened {a:his|her} eyes, then {a:his|her} phone, then blocked everything. Freedom. We partied until 4 a.m."] }, fx: { rel: 12, happy: 5 }, mood: 'happy' },
          { w: 2, text: { fr: ["J'ai dit la vérité. {a.first} m'a répondu : « Tu es juste jaloux{|se}. » Ils sont fiancés depuis. Je ne suis pas invité{|e}.", "J'ai été honnête. {a.first} a tout répété à sa moitié, mot pour mot, avec mes fautes de grammaire. Je suis officiellement l'ennemi du couple."], en: ["I told the truth. {a.first} replied: 'You're just jealous.' They've gotten engaged since. I'm not invited.", "I was honest. {a.first} repeated everything to the partner, word for word, including my grammar mistakes. I'm officially the couple's enemy."] }, fx: { rel: -18, happy: -4 }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Sourire et serrer les dents', en: 'Smile through it' }, text: { fr: ["J'ai souri toute la soirée. J'ai tellement serré les dents que mon dentiste m'a demandé si je faisais de la musculation de la mâchoire.", "J'ai hoché la tête à chaque phrase débile. À force, j'ai un torticolis et un ulcère. Mais {a.first} est content{a:|e}."], en: ["I smiled all evening. I clenched my teeth so hard my dentist asked if I'd been doing jaw workouts.", "I nodded at every dumb sentence. Now I have a stiff neck and an ulcer. But {a.first} is happy."] }, fx: { stress: 8, rel: 4 } },
      {
        label: { fr: 'Saboter le couple', en: 'Sabotage the couple' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai glissé deux-trois infos bien choisies au bon moment. Le couple a explosé tout seul, sans que personne ne me soupçonne. Je me fais un peu peur.", "Opération discrète : faux souvenirs, vraies questions, ambiance pourrie. Rupture en dix jours. {a.first} pleure sur mon épaule. Mission accomplie."], en: ["I dropped two or three carefully chosen facts at the right moment. The couple imploded on its own, nobody suspected me. I scare myself a little.", "Covert operation: fake memories, real questions, rotten vibes. Breakup within ten days. {a.first} is crying on my shoulder. Mission accomplished."] }, fx: { rel: 5, karma: -6, happy: 4 } },
          { w: 1, text: { fr: ["{a.first} a découvert mes messages anonymes. Mon pseudo était mon prénom à l'envers. Je ne suis pas fait{|e} pour l'espionnage. Ni pour l'amitié, apparemment.", "Mon plan a foiré : le couple s'est soudé contre moi. {a.first} m'a officiellement rayé{|e} de sa vie, avec un discours."], en: ["{a.first} found my anonymous messages. My username was my first name backwards. I'm not cut out for espionage. Or friendship, apparently.", "My plan backfired: the couple bonded against me. {a.first} officially erased me from {a:his|her} life, with a speech."] }, fx: { rel: -35, actorRole: 'enemy', karma: -4 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'fr2_partner_hits_on_you',
    icon: '🐍',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'shock', prop: 'phone' },
    when: { age: [18, 60] },
    weight: 6,
    cooldown: 8,
    text: {
      fr: [
        "La moitié de {a.first} te coince dans la cuisine, {w:drink} à la main, l'haleine chargée, et chuchote : « Toi et moi, dans la salle de bain, deux minutes. » Ton pote est à trois mètres et découpe le gâteau.",
        "Notification à 2 h du matin : la moitié de {a.first} t'envoie une photo d'une partie de son anatomie qui n'a rien à faire sur ton téléphone. Légende : « on garde ça entre nous 😏 ».",
        "Au mariage de {a.first}, sa toute nouvelle moitié te met la main aux fesses pendant {w:song}. Tu sens {w:smell}, et un gros malaise.",
        "{w:exclaim} Tu surprends la moitié de {a.first} en train de rouler une pelle à quelqu'un {w:at_place}. Elle te voit. Elle te fait un clin d'œil. {w:swear}",
      ],
      en: [
        "{a.first}'s partner corners you in the kitchen, {w:drink} in hand, breath reeking, and whispers: 'You and me, bathroom, two minutes.' Your friend is ten feet away cutting the cake.",
        "Notification at 2 a.m.: {a.first}'s partner sends you a photo of a body part that has no business being on your phone. Caption: 'let's keep this between us 😏'.",
        "At {a.first}'s wedding, the brand-new spouse grabs your butt during {w:song}. You smell {w:smell}, and deep discomfort.",
        "{w:exclaim} You catch {a.first}'s partner making out with someone {w:at_place}. They see you. They wink. {w:swear}",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout dire à mon pote', en: 'Tell my friend' },
        out: [
          { w: 2, text: { fr: ["J'ai montré les preuves à {a.first}. {a:Il|Elle} a jeté les affaires de sa moitié par la fenêtre, y compris un aquarium. Le poisson va bien. Moi aussi.", "J'ai tout raconté. {a.first} a vomi, pleuré, puis brûlé leurs photos dans le barbecue. On a fait griller des saucisses dessus. Thérapeutique."], en: ["I showed {a.first} the evidence. {a:He|She} threw the partner's stuff out the window, aquarium included. The fish is fine. So am I.", "I told everything. {a.first} puked, cried, then burned their photos in the barbecue. We grilled sausages on top. Therapeutic."] }, fx: { rel: 15, karma: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["{a.first} ne m'a pas cru{|e}. Sa moitié a juré que c'était MOI qui l'avais allumé{a:|e}. Je suis passé{|e} pour un serpent. Le vrai serpent rigole encore.", "J'ai dit la vérité, {a.first} a choisi le mensonge. Il paraît que j'ai « toujours été jaloux{|se} ». Bloqué{|e}, banni{|e}, détesté{|e}."], en: ["{a.first} didn't believe me. The partner swore I was the one hitting on THEM. I came off as the snake. The real snake is still laughing.", "I told the truth, {a.first} chose the lie. Apparently I've 'always been jealous'. Blocked, banned, hated."] }, fx: { rel: -30, actorRole: 'enemy', happy: -6 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Balancer dans le groupe', en: 'Post it in the group chat' }, text: { fr: ["J'ai posté la capture dans le groupe des potes. 47 messages en une minute, dont 12 émojis aubergine. Le couple n'a pas survécu à la nuit.", "Capture d'écran, groupe WhatsApp, enter. Silence de mort, puis {a.first} a écrit « merci ». Puis « je vais le/la tuer ». Puis plus rien."], en: ["I posted the screenshot in the friends' group chat. 47 messages in a minute, 12 of them eggplant emojis. The couple didn't survive the night.", "Screenshot, group chat, enter. Dead silence, then {a.first} wrote 'thanks'. Then 'I'm going to kill them'. Then nothing."] }, fx: { rel: 6, fame: 2, stress: 6 } },
      {
        label: { fr: 'Céder à la tentation', en: 'Give in' },
        out: [
          { w: 1, text: { fr: ["J'ai cédé. Deux minutes dans la salle de bain, c'était optimiste : quarante secondes. Personne ne l'a su. Ma conscience, si, et elle me fait la gueule.", "J'ai craqué. Ce fut bref, nul et sur un panier à linge. Je ne regarderai plus jamais {a.first} dans les yeux pareil."], en: ["I gave in. 'Two minutes' was optimistic: forty seconds. Nobody found out. My conscience did, and it's not speaking to me.", "I cracked. It was brief, lousy, and on top of a laundry basket. I'll never look {a.first} in the eye the same way."] }, fx: { karma: -15, happy: 2, stress: 10 } },
          { w: 1, text: { fr: ["{a.first} a ouvert la porte de la salle de bain pile au mauvais moment. J'ai encore la marque de la brosse à dents électrique qu'{a:il|elle} m'a lancée.", "On s'est fait griller par {a.first} en direct. {a:Il|Elle} a hurlé, j'ai fui en chaussettes. Plus d'ami{a:|e}, et une réputation de rat."], en: ["{a.first} opened the bathroom door at exactly the wrong moment. I still have the mark from the electric toothbrush {a:he|she} threw at me.", "{a.first} caught us live. {a:He|She} screamed, I fled in my socks. No more friend, and a reputation as a rat."] }, fx: { karma: -15, rel: -60, actorRole: 'enemy', health: -4, happy: -8 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'fr2_trip_airbnb',
    icon: '🏚️',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    vars: { amount: [300, 1500] },
    scene: { place: 'apartment', mood: 'sick', prop: 'suitcase', fx: 'poop' },
    when: { age: [18, 55] },
    weight: 7,
    cooldown: 6,
    text: {
      fr: [
        "Voyage entre potes {w:far_place}, organisé par {a.first}. L'Airbnb « vue mer » donne sur un mur. Les toilettes débordent. Dans le frigo : {w:animal}, vivant{a:|e}… enfin, vivant.",
        "{a.first} a réservé « une pépite » pour le groupe. À l'arrivée : des punaises de lit, {w:smell} et un hôte qui dort dans la baignoire. Tu as payé {$amount}.",
        "Week-end de rêve avec {a.first} et la bande. Sauf que la chasse d'eau a explosé à 3 h du matin. Tout le monde s'est réveillé dans {w:gross}. Littéralement.",
        "Le logement choisi par {a.first} {w:far_place} était « cosy ». Traduction : six adultes dans un studio, un seul lit, et un voisin qui joue {w:song} au trombone.",
      ],
      en: [
        "Friends' trip {w:far_place}, organized by {a.first}. The 'sea view' Airbnb faces a wall. The toilet overflows. In the fridge: {w:animal}, alive… well, alive-ish.",
        "{a.first} booked 'a hidden gem' for the group. On arrival: bedbugs, {w:smell} and a host sleeping in the bathtub. You paid {$amount}.",
        "Dream weekend with {a.first} and the gang. Except the toilet exploded at 3 a.m. Everyone woke up in {w:gross}. Literally.",
        "The place {a.first} picked {w:far_place} was 'cozy'. Translation: six adults in a studio, one bed, and a neighbor playing {w:song} on the trombone.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exiger un remboursement', en: 'Demand a refund' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai envoyé 63 photos au service client, dont une très gros plan des toilettes. Remboursement intégral de {$amount} en une heure. Ils voulaient surtout que j'arrête.", "Négociation de génie : j'ai menacé de laisser un avis en trois langues. Remboursés, surclassés, et l'hôte nous a offert {w:drink} pour se faire pardonner."], en: ["I sent customer service 63 photos, including a very close-up of the toilet. Full refund of {$amount} within an hour. Mostly they wanted me to stop.", "Genius negotiation: I threatened to leave a review in three languages. Refunded, upgraded, and the host gave us {w:drink} as an apology."] }, fx: { money: 'amount', happy: 6, rel: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["Le service client m'a proposé un bon de réduction de 5 % « pour mon prochain séjour ». Dans le même logement. J'ai hurlé dans un oreiller plein de punaises.", "Remboursement refusé : les punaises étaient « mentionnées dans la description, en petit ». J'ai relu. C'est vrai. {w:swear}"], en: ["Customer service offered me a 5% voucher 'for my next stay'. In the same place. I screamed into a bedbug-infested pillow.", "Refund denied: the bedbugs were 'mentioned in the listing, in small print'. I reread it. It's true. {w:swear}"] }, fx: { happy: -6, stress: 6, rel: -4 } },
        ],
      },
      {
        label: { fr: 'En rire ensemble', en: 'Laugh it off together' },
        out: [
          { w: 2, text: { fr: ["On a décidé d'en rire. On a dormi sur la plage, mangé {w:food} à même la boîte et chanté jusqu'à l'aube. Meilleur voyage de ma vie. Les punaises sont rentrées avec moi.", "On a transformé le désastre en légende. Le groupe parle encore de « la nuit des toilettes ». {a.first} a fait imprimer des t-shirts."], en: ["We decided to laugh it off. Slept on the beach, ate {w:food} straight out of the box, sang until dawn. Best trip of my life. The bedbugs came home with me.", "We turned the disaster into legend. The group still talks about 'the toilet night'. {a.first} had T-shirts printed."] }, fx: { happy: 8, rel: 10, health: -3 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai voulu rire, mais j'ai attrapé un truc dans la douche. Mes pieds ont changé de couleur. Le médecin a dit « intéressant », ce qui n'est jamais bon.", "On riait jusqu'à ce que le plafond s'effondre sur {a.first}. Plâtre, poussière, et un pigeon mort. {a:Il|Elle} va bien. Le pigeon, non."], en: ["I tried to laugh, but I caught something in the shower. My feet changed color. The doctor said 'interesting', which is never good.", "We were laughing until the ceiling collapsed on {a.first}. Plaster, dust, and a dead pigeon. {a:He|She} is fine. The pigeon isn't."] }, fx: { health: -8, happy: -2, rel: 5 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Rentrer seul{|e} en douce', en: 'Sneak home alone' }, text: { fr: ["J'ai pris le premier train sans prévenir personne. {a.first} a cru que j'avais été kidnappé{|e} et a appelé la police locale. J'ai une fiche Interpol, maintenant.", "Je suis parti{|e} à l'aube avec ma valise. Le groupe m'a renommé{|e} « le déserteur » dans la conversation. Mais j'ai dormi dans un vrai lit."], en: ["I took the first train home without telling anyone. {a.first} thought I'd been kidnapped and called the local police. I have an Interpol file now.", "I left at dawn with my suitcase. The group renamed me 'the deserter' in the chat. But I slept in a real bed."] }, fx: { rel: -12, happy: 3, stress: -4 } },
    ],
  },
  {
    id: 'fr2_bill_split',
    icon: '🧮',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    vars: { amount: [80, 400] },
    scene: { place: 'party', mood: 'angry', prop: 'receipt' },
    when: { age: [16, 75] },
    weight: 9,
    cooldown: 5,
    text: {
      fr: [
        "Fin du resto entre potes. Tu as pris une salade et de l'eau. {a.first} a pris {w:food}, trois desserts et {w:drink}. {a:Il|Elle} propose : « On divise par huit ? » Total : {$amount}.",
        "{a.first} sort un tableur pour répartir les frais du week-end. Colonne « divers » : {w:object}. Tu ne te souviens pas d'avoir acheté ça. Ta part : {$amount}.",
        "Au moment de payer, {a.first} se rappelle soudain qu'{a:il|elle} a « oublié sa carte ». Pour la quatrième fois cette année. L'addition fait {$amount}.",
        "{a.first} réclame 1,40 sur l'appli de remboursement pour un café d'il y a trois ans. Mais {a:il|elle} te doit encore {$amount} pour les vacances {w:far_place}.",
      ],
      en: [
        "End of a dinner with friends. You had a salad and water. {a.first} had {w:food}, three desserts and {w:drink}. {a:He|She} suggests: 'Split it eight ways?' Total: {$amount}.",
        "{a.first} pulls out a spreadsheet to split the weekend costs. Column 'misc': {w:object}. You don't remember buying that. Your share: {$amount}.",
        "When the check comes, {a.first} suddenly remembers {a:he|she} 'forgot {a:his|her} card'. For the fourth time this year. The bill is {$amount}.",
        "{a.first} requests $1.40 on the payment app for a coffee from three years ago. But {a:he|she} still owes you {$amount} for the trip {w:far_place}.",
      ],
    },
    choices: [
      { label: { fr: 'Payer sans rien dire', en: 'Pay and shut up' }, text: { fr: ["J'ai payé. En silence. Un silence lourd, chargé de rancœur, que j'entretiendrai pendant des années.", "J'ai payé ma part, et un peu celle des autres. Je suis le mécène officieux de ce groupe d'amis."], en: ["I paid. In silence. A heavy silence, loaded with resentment, that I will nurture for years.", "I paid my share, and some of everyone else's. I am the unofficial patron of this friend group."] }, fx: { money: '-amount', rel: 4, stress: 4 } },
      {
        label: { fr: 'Contre-tableur', en: 'Counter-spreadsheet' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai sorti mon propre tableur, avec graphiques et code couleur. {a.first} a perdu le débat et a payé la différence. Le groupe m'appelle désormais « le comptable ».", "J'ai calculé au centime près, TVA comprise. {a.first} m'a rendu la monnaie en pièces de 1 centime. Par vengeance. Mais j'ai gagné."], en: ["I pulled out my own spreadsheet, with charts and color coding. {a.first} lost the debate and paid the difference. The group now calls me 'the accountant'.", "I calculated to the cent, tax included. {a.first} paid me back in pennies. Out of spite. But I won."] }, fx: { smarts: 2, happy: 4, rel: -4 } },
          { w: 1, text: { fr: ["Le débat comptable a duré deux heures. Le resto a fermé. On a fini le calcul sur le parking. Personne ne se parle depuis.", "Mon tableur avait une erreur de formule. C'est moi qui devais de l'argent à tout le monde. J'ai payé {$amount} et ma dignité."], en: ["The accounting debate lasted two hours. The restaurant closed. We finished the math in the parking lot. Nobody's spoken since.", "My spreadsheet had a formula error. Turns out I owed everyone money. I paid {$amount} plus my dignity."] }, fx: { money: '-amount', rel: -8, happy: -4 } },
        ],
      },
      { label: { fr: 'Partir aux toilettes', en: 'Escape to the bathroom' }, rating: 1, text: { fr: ["Je suis parti{|e} « aux toilettes » et je suis rentré{|e} chez moi par la fenêtre. Le groupe a payé. Ma réputation, elle, est morte {w:at_place}.", "Technique ancestrale : les toilettes, puis la sortie de secours. {a.first} m'a envoyé un message : « On sait. » Rien d'autre."], en: ["I went 'to the bathroom' and went home through the window. The group paid. My reputation died right there.", "Ancestral technique: bathroom, then fire exit. {a.first} texted me: 'We know.' Nothing else."] }, fx: { rel: -10, karma: -4, happy: 3 } },
    ],
  },
  {
    id: 'fr2_camping_gore',
    icon: '🪓',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'park', mood: 'shock', prop: 'tent', fx: 'gore' },
    when: { age: [18, 60] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "Camping sauvage avec {a.first}. {a:Il|Elle} coupe du bois en tongs, une hache dans une main, {w:drink} dans l'autre. Ça va forcément bien se passer.",
        "{a.first} veut impressionner le groupe en allumant le feu avec un litre d'essence. Tu sens {w:smell}. Puis une chaleur. Puis plus de sourcils, chez {a.first}.",
        "Nuit au camping. {a.first} sort de la tente pour pisser et marche pieds nus sur {w:object}, puis sur un piège à loup. Le cri résonne jusqu'au village.",
        "{a.first} joue au lancer de couteau sur un arbre pour épater la galerie. Le couteau rebondit. {w:exclaim}",
      ],
      en: [
        "Wild camping with {a.first}. {a:He|She} is chopping wood in flip-flops, axe in one hand, {w:drink} in the other. What could possibly go wrong.",
        "{a.first} wants to impress the group by lighting the campfire with a gallon of gasoline. You smell {w:smell}. Then heat. Then {a.first} has no eyebrows.",
        "Night at the campsite. {a.first} steps out of the tent to pee and walks barefoot onto {w:object}, then onto a bear trap. The scream echoes all the way to the village.",
        "{a.first} is throwing knives at a tree to impress everyone. The knife bounces back. {w:exclaim}",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire un garrot', en: 'Apply a tourniquet' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["Garrot avec mon lacet, désinfection au rosé, point de suture avec du fil dentaire. Le chirurgien a dit que j'avais sauvé le pied. Et que j'étais dégueulasse.", "J'ai improvisé un garrot avec la sangle de la glacière. Le sang a giclé sur la tente, sur moi, sur les chips. Mais {a.first} a gardé tous ses orteils sauf un."], en: ["Tourniquet with my shoelace, rosé as disinfectant, stitches with dental floss. The surgeon said I saved the foot. And that I was disgusting.", "I improvised a tourniquet with the cooler strap. Blood sprayed on the tent, on me, on the chips. But {a.first} kept every toe but one."] }, fx: { rel: 15, karma: 5, visual: 'gore' }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai serré tellement fort que le garrot a coupé la circulation dans le mauvais membre. {a.first} a maintenant un bras violet ET un pied en moins. On en rit. Lui un peu moins.", "Le garrot a lâché, le sang a giclé façon tuyau d'arrosage. J'ai glissé dedans et je me suis cassé {w:bodypart}. Deux blessés pour le prix d'un."], en: ["I squeezed so hard the tourniquet cut circulation to the wrong limb. {a.first} now has a purple arm AND one less foot. We laugh about it. {a:He|She} laughs less.", "The tourniquet slipped, blood sprayed like a garden hose. I slipped in it and broke my {w:bodypart}. Two casualties for the price of one."] }, fx: { rel: 4, health: -8, visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Filmer pour les réseaux', en: 'Film it for socials' },
        out: [
          { w: 2, text: { fr: ["J'ai filmé avant d'aider. La vidéo a fait 2 millions de vues sur {w:app}. {a.first} a perdu un orteil et un ami. Moi, j'ai gagné des abonnés.", "« Attends, je te filme ! » Le gros orteil de {a.first} a volé dans le feu en plein cadre. Plan parfait. Ami perdu."], en: ["I filmed before helping. The video got 2 million views on {w:app}. {a.first} lost a toe and a friend. I gained followers.", "'Wait, let me film!' {a.first}'s big toe flew into the fire mid-shot. Perfect frame. Friend lost."] }, fx: { followers: 8000, fame: 3, rel: -25, karma: -8, visual: 'gore' } },
          { w: 1, text: { fr: ["Pendant que je filmais, {a.first} s'est vidé{a:|e} de son sang dans l'indifférence générale. Mort{a:|e} en direct. La vidéo a été supprimée. Moi aussi, de tous les groupes.", "J'ai filmé trop longtemps. {a.first} a fait un dernier doigt d'honneur à la caméra et s'est éteint{a:|e}. Le plan est culte. Je suis un monstre."], en: ["While I filmed, {a.first} bled out with nobody helping. Died live on camera. The video got taken down. So did I, from every group.", "I filmed too long. {a.first} gave the camera one final middle finger and passed away. The shot is legendary. I'm a monster."] }, fx: { actorDie: true, karma: -20, happy: -15, visual: 'gore' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Courir chercher les secours', en: 'Run for help' }, text: { fr: ["J'ai couru six kilomètres dans le noir, perdu{|e}, en slip. Les secours ont trouvé {a.first} avant moi. On m'a retrouvé{|e} à l'aube, coincé{|e} dans des ronces.", "J'ai sprinté jusqu'au village. Le seul habitant réveillé était un vieux avec un fusil et {w:animal}. Il a appelé les pompiers. Puis il m'a offert la goutte."], en: ["I ran four miles in the dark, lost, in my underwear. Rescuers found {a.first} before they found me. I was recovered at dawn, stuck in brambles.", "I sprinted to the village. The only person awake was an old man with a shotgun and {w:animal}. He called the paramedics. Then poured me a moonshine."] }, fx: { rel: 8, athletic: 4, health: -3 } },
    ],
  },
  {
    id: 'fr2_secret_spilled',
    icon: '🗣️',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'angry', prop: 'phone' },
    when: { age: [16, 75] },
    weight: 8,
    cooldown: 6,
    text: {
      fr: [
        "{a.first}, à qui tu avais tout confié, a balancé ton secret à la soirée : tu as pleuré devant {w:movie}. Trois fois. Dont une au cinéma, debout.",
        "Tout le groupe est au courant que tu as un compte secret où tu notes {w:food} sur dix. Une seule personne le savait : {a.first}. {w:swear}",
        "{a.first} a raconté à tout le monde ta phobie secrète : {w:animal}. Ce matin, quelqu'un en a laissé un devant ta porte. Avec un nœud.",
        "Bourré{a:|e}, {a.first} a révélé au micro du karaoké ton vrai surnom d'enfance : {w:nickname}. La salle entière le scande en rythme.",
      ],
      en: [
        "{a.first}, whom you told everything, spilled your secret at the party: you cried watching {w:movie}. Three times. Once in the theater, standing up.",
        "The whole group knows you have a secret account where you rate {w:food} out of ten. Only one person knew: {a.first}. {w:swear}",
        "{a.first} told everyone about your secret phobia: {w:animal}. This morning, someone left one at your door. With a bow.",
        "Drunk, {a.first} revealed your real childhood nickname over the karaoke mic: {w:nickname}. The whole bar is chanting it in rhythm.",
      ],
    },
    choices: [
      {
        label: { fr: 'Confronter', en: 'Confront' },
        out: [
          { w: 2, text: { fr: ["{a.first} s'est excusé{a:|e} platement, m'a offert {w:gift} et m'a laissé{|e} choisir sa pénitence : chanter du Céline Dion en public. Justice rendue.", "On s'est engueulés, puis on a ri. {a.first} m'a confié un de ses propres secrets en garantie. Maintenant, on se tient par la barbichette."], en: ["{a.first} apologized profusely, gave me {w:gift} and let me pick the penance: singing ballads in public. Justice served.", "We yelled, then laughed. {a.first} told me one of {a:his|her} own secrets as collateral. Now we each have dirt on the other."] }, fx: { rel: 6, happy: 4 } },
          { w: 1, text: { fr: ["{a.first} a haussé les épaules : « Fallait pas me le dire. » J'ai claqué la porte. Puis je me suis coincé les doigts dedans. Double humiliation.", "La confrontation a dégénéré en concours de reproches qui remontaient jusqu'au CM2. On ne se parle plus, et j'ai perdu la garde de nos blagues communes."], en: ["{a.first} shrugged: 'Shouldn't have told me.' I slammed the door. Then caught my fingers in it. Double humiliation.", "The confrontation turned into a blame contest going back to fourth grade. We don't talk anymore, and I lost custody of our inside jokes."] }, fx: { rel: -20, happy: -5, actorRole: 'enemy' }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Révéler le sien', en: 'Expose theirs' }, text: { fr: ["Œil pour œil : j'ai révélé au groupe que {a.first} écoute {w:band} en boucle et dort avec une peluche nommée « Monsieur Câlin ». Guerre totale déclarée.", "J'ai publié le secret de {a.first} sur la grande conversation, avec preuves photo. Le groupe s'est scindé en deux camps. C'est la Guerre froide, version potes."], en: ["Eye for an eye: I told the group that {a.first} listens to {w:band} on loop and sleeps with a plushie named 'Mr. Cuddles'. Total war declared.", "I posted {a.first}'s secret in the big group chat, with photo proof. The group split into two camps. It's the Cold War, friend edition."] }, fx: { rel: -25, happy: 4, karma: -5 } },
      { label: { fr: 'Assumer à fond', en: 'Own it completely' }, text: { fr: ["J'ai assumé : j'ai fait imprimer un t-shirt avec mon secret dessus. Plus personne ne peut m'atteindre. Je suis devenu{|e} invincible, et légèrement ridicule.", "J'ai monté sur une chaise et j'ai tout confirmé, avec des détails en plus. Ovation. {a.first} est vexé{a:|e} que son coup ait foiré."], en: ["I owned it: I had a T-shirt printed with my secret on it. Nobody can touch me now. I've become invincible, and slightly ridiculous.", "I got up on a chair and confirmed everything, with bonus details. Standing ovation. {a.first} is annoyed the stunt backfired."] }, fx: { happy: 6, fame: 1, rel: -2 }, mood: 'proud' },
    ],
  },
  {
    id: 'fr2_old_bff',
    icon: '📬',
    cat: 'friends',
    rating: 0,
    actor: { create: { role: 'acquaintance', age: [-1, 1], gender: 'any' } },
    scene: { place: 'park', mood: 'happy', prop: 'phone' },
    when: { age: [25, 85] },
    weight: 6,
    cooldown: 10,
    text: {
      fr: [
        "Un message d'un nom que tu n'avais pas lu depuis vingt ans : {a.first}, ton meilleur pote de l'époque, celui avec qui tu volais des bonbons {w:at_place}. « Un verre ? »",
        "{w:exclaim} Tu reconnais {a.first} {w:at_place}, ton inséparable d'enfance. Un peu plus de rides, un peu moins de cheveux, et toujours ce rire qui fait fuir {w:animal}.",
        "{a.first}, perdu{a:|e} de vue depuis le collège, t'a retrouvé{|e} sur {w:app}. Premier message : « Tu te souviens de la cabane ? » Tu t'en souviens. La cabane a brûlé.",
        "Une lettre. Une vraie, avec un timbre. C'est {a.first}, ton ami{a:|e} d'enfance, qui vit maintenant {w:far_place} et repasse en ville le mois prochain.",
      ],
      en: [
        "A message from a name you haven't seen in twenty years: {a.first}, your best buddy back in the day, the one you used to steal candy with {w:at_place}. 'Drink?'",
        "{w:exclaim} You recognize {a.first} {w:at_place}, your inseparable childhood pal. A few more wrinkles, a little less hair, and still that laugh that scares off {w:animal}.",
        "{a.first}, lost touch since middle school, found you on {w:app}. First message: 'Remember the treehouse?' You do. The treehouse burned down.",
        "A letter. A real one, with a stamp. It's {a.first}, your childhood friend, who now lives {w:far_place} and is back in town next month.",
      ],
    },
    choices: [
      {
        label: { fr: 'Boire un verre', en: 'Grab a drink' },
        out: [
          { w: 2, text: { fr: ["On a parlé six heures sans voir le temps passer. Comme si on s'était quittés la veille. {a.first} est revenu{a:|e} dans ma vie, et j'ai retrouvé une partie de moi.", "On a rejoué nos vieilles blagues, rigolé comme des gamins, et on s'est fait virer du bar. Exactement comme à 14 ans. Amitié réactivée."], en: ["We talked for six hours without noticing the time. Like we'd parted yesterday. {a.first} is back in my life, and I found a piece of myself again.", "We replayed our old jokes, giggled like kids, and got kicked out of the bar. Exactly like at 14. Friendship reactivated."] }, fx: { actorRole: 'friend', rel: 30, happy: 10 }, mood: 'happy' },
          { w: 1, text: { fr: ["Silence gênant au bout de dix minutes. On n'a plus rien en commun : {a.first} est devenu{a:|e} {w:weird_job} et parle de cryptos. Les souvenirs étaient mieux sans la suite.", "{a.first} a passé la soirée à me parler de son régime, puis de sa passion : {w:hobby}. J'ai compris pourquoi on s'était perdus de vue. C'était pas un accident."], en: ["Awkward silence after ten minutes. Nothing in common anymore: {a.first} became {w:weird_job} and talks crypto. The memories were better without the sequel.", "{a.first} spent the evening telling me about {a:his|her} diet and {w:hobby}. I understood why we'd drifted apart. It wasn't an accident."] }, fx: { happy: -2 } },
        ],
      },
      { label: { fr: 'Laisser le passé au passé', en: 'Leave the past alone' }, text: { fr: ["Je n'ai pas répondu. Certains souvenirs sont plus beaux sous verre. J'ai quand même regardé ses photos pendant une heure.", "J'ai mis un pouce bleu et rien d'autre. Le pouce bleu le plus lâche de l'histoire de l'humanité."], en: ["I didn't reply. Some memories are prettier under glass. I still stalked the photos for an hour.", "I left a thumbs-up and nothing else. The most cowardly thumbs-up in human history."] }, fx: { happy: -1 } },
      { label: { fr: 'Raconter des bobards', en: 'Lie about my life' }, text: { fr: ["J'ai prétendu être pilote de ligne et marié{|e} avec {w:celeb}. {a.first} m'a cru{|e}. Maintenant, je dois entretenir le mensonge par messages, tous les jours.", "J'ai inventé une vie fabuleuse. {a.first} aussi, j'en suis sûr{|e}. Deux mythomanes qui trinquent : c'était magnifique."], en: ["I claimed to be an airline pilot married to {w:celeb}. {a.first} believed me. Now I have to keep up the lie by text, every day.", "I invented a fabulous life. So did {a.first}, I'm sure of it. Two compulsive liars clinking glasses: it was beautiful."] }, fx: { happy: 4, karma: -3, stress: 4, keep: true } },
    ],
  },
  {
    id: 'fr2_surprise_party_you',
    icon: '🎉',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'home', mood: 'shock', prop: 'cake', fx: 'confetti' },
    when: { age: [18, 65] },
    weight: 5,
    cooldown: 10,
    text: {
      fr: [
        "Tu rentres chez toi avec une gastro carabinée, en serrant les fesses comme jamais. La lumière s'allume : « SURPRIIIISE ! » {a.first} a invité trente personnes. Les toilettes sont derrière eux.",
        "Tu passes la porte, tout nu{|e} sous ton manteau parce que ton date a mal tourné. « SURPRISE ! » hurlent {a.first}, tes collègues et ta grand-mère.",
        "{a.first} t'a organisé une fête surprise. Tu arrives en plein appel coquin au téléphone, haut-parleur activé. Quarante invités entendent la fin de la phrase.",
        "Fête surprise montée par {a.first}. Mauvaise idée : tu reviens de la salle de sport, tu sens {w:smell}, et tu as {w:gross} collé sur la joue. Tout est filmé.",
      ],
      en: [
        "You come home with violent food poisoning, clenching like never before. Lights on: 'SURPRIIIISE!' {a.first} invited thirty people. The bathroom is behind them.",
        "You walk in naked under your coat because your date went sideways. 'SURPRISE!' scream {a.first}, your coworkers and your grandma.",
        "{a.first} threw you a surprise party. You walk in mid-sexy phone call, on speaker. Forty guests hear the end of the sentence.",
        "Surprise party set up by {a.first}. Bad idea: you're back from the gym, you smell {w:smell}, and you have {w:gross} stuck to your cheek. It's all being filmed.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire comme si de rien', en: 'Act totally normal' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: ["J'ai lancé « Merci tout le monde ! » avec une dignité de reine. J'ai tenu deux heures. Les invités ont parlé de mon « charisme ». Ils ne savent pas ce que ça m'a coûté.", "Sourire, bise, champagne. Personne n'a rien remarqué, ou tout le monde a eu la politesse de faire semblant. {a.first} est ravi{a:|e}."], en: ["I said 'Thanks, everyone!' with royal dignity. Held it together for two hours. Guests praised my 'charisma'. They don't know what it cost me.", "Smile, cheek kisses, champagne. Nobody noticed, or everyone was polite enough to pretend. {a.first} is thrilled."] }, fx: { happy: 6, rel: 8 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai tenu onze secondes. Puis mon corps a pris le contrôle, devant le gâteau. Le gâteau n'a pas survécu. La réputation non plus. {w:swear}", "J'ai fait comme si de rien… jusqu'à ce que mon manteau s'ouvre pendant la photo de groupe. Ma grand-mère a dit « ah bah quand même ». C'est encadré chez {a.first}."], en: ["I held on for eleven seconds. Then my body took over, right in front of the cake. The cake didn't survive. Neither did my reputation. {w:swear}", "I acted normal… until my coat flew open during the group photo. Grandma said 'well, well'. It's framed at {a.first}'s place."] }, fx: { happy: -10, fame: 2, rel: 2, visual: 'poop' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Courir aux toilettes', en: 'Sprint to the bathroom' }, text: { fr: ["J'ai traversé la foule comme un rugbyman. J'ai passé ma propre fête enfermé{|e} aux toilettes, à entendre les invités chanter « Joyeux anniversaire » à la porte.", "Sprint, porte, verrou. Quarante personnes ont entendu des bruits que je n'aurais jamais crus possibles. Quelqu'un a lancé {w:song} à fond, par charité."], en: ["I bulldozed through the crowd like a linebacker. I spent my own party locked in the bathroom, listening to the guests sing 'Happy Birthday' at the door.", "Sprint, door, lock. Forty people heard noises I never thought possible. Someone blasted {w:song} out of mercy."] }, fx: { happy: -6, health: -3, rel: 3 } },
      { label: { fr: 'Virer tout le monde', en: 'Kick everyone out' }, text: { fr: ["J'ai hurlé « DEHORS ! » en montrant la porte. Les invités sont partis avec le gâteau. {a.first} ne m'organisera plus jamais rien. Promis juré.", "« Vous avez une minute pour sortir de chez moi. » Ils sont partis en 40 secondes. {a.first} m'a laissé un mot : « Joyeux anniversaire quand même, {w:insult}. »"], en: ["I yelled 'OUT!' pointing at the door. The guests left with the cake. {a.first} will never organize anything for me again. Pinky swear.", "'You have one minute to leave my home.' They left in 40 seconds. {a.first} left a note: 'Happy birthday anyway, {w:insult}.'"] }, fx: { rel: -15, stress: -4, happy: -3 } },
    ],
  },
  {
    id: 'fr2_surprise_for_friend',
    icon: '🎂',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    vars: { amount: [100, 700] },
    scene: { place: 'party', mood: 'party', prop: 'cake', fx: 'confetti' },
    when: { age: [12, 85] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: [
        "C'est bientôt l'anniversaire de {a.first}. Tu pourrais organiser une fête surprise : budget {$amount}, une trentaine d'invités et {w:food} en quantité industrielle.",
        "{a.first} répète depuis des mois qu'{a:il|elle} « déteste les surprises ». Évidemment, tu y penses très fort. Tu as déjà un thème : {w:celeb}.",
        "Pour les [[30|40|50]] ans de {a.first}, le groupe compte sur toi. Tu as une idée : planquer tout le monde {w:at_place} et lui faire le coup du siècle.",
        "Anniversaire de {a.first} en approche. Tu hésites entre une fête géante, un dîner tranquille, ou {w:gift} acheté à la dernière minute dans une station-service.",
      ],
      en: [
        "{a.first}'s birthday is coming up. You could throw a surprise party: {$amount} budget, thirty-ish guests and an industrial quantity of {w:food}.",
        "{a.first} has been saying for months that {a:he|she} 'hates surprises'. Obviously, you're thinking hard about one. You already have a theme: {w:celeb}.",
        "For {a.first}'s [[30th|40th|50th]], the group is counting on you. You have an idea: hide everyone {w:at_place} and pull the stunt of the century.",
        "{a.first}'s birthday is coming. You're torn between a giant party, a quiet dinner, or {w:gift} bought at a gas station at the last minute.",
      ],
    },
    choices: [
      {
        label: { fr: 'Fête surprise géante', en: 'Giant surprise party' },
        out: [
          { w: 2, text: { fr: ["« SURPRISE ! » {a.first} a hurlé, ri, pleuré, puis dansé sur la table jusqu'à 3 h. Meilleure soirée de l'année. J'ai dépensé {$amount} et je ne regrette rien.", "La surprise a été totale. {a.first} m'a serré{|e} si fort que j'ai entendu une côte craquer. Ça valait le coup, et les {$amount}."], en: ["'SURPRISE!' {a.first} screamed, laughed, cried, then danced on the table until 3 a.m. Party of the year. I spent {$amount} and regret nothing.", "Total surprise. {a.first} hugged me so hard I heard a rib crack. Worth it, and worth the {$amount}."] }, fx: { money: '-amount', rel: 18, happy: 8, visual: 'confetti' }, mood: 'party' },
          { w: 1, text: { fr: ["« SURPRISE ! » {a.first} a eu tellement peur qu'{a:il|elle} a balancé un coup de poing réflexe. Dans ma tête. Le gâteau m'a amorti{|e}.", "{a.first} n'est jamais venu{a:|e} : {a:il|elle} était parti{a:|e} {w:far_place} sur un coup de tête. Trente invités, une piñata et moi, dans le noir."], en: ["'SURPRISE!' {a.first} got so scared {a:he|she} threw a reflex punch. At my face. The cake broke my fall.", "{a.first} never showed up: {a:he|she} had gone off {w:far_place} on a whim. Thirty guests, a piñata and me, in the dark."] }, fx: { money: '-amount', happy: -5, rel: 4 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Dîner tranquille', en: 'Quiet dinner' }, text: { fr: ["Petit dîner à deux. On a parlé de tout, de nos vieux souvenirs et de nos futures rides. {a.first} a dit que c'était parfait. C'était parfait.", "Un resto simple, un gâteau avec une seule bougie. {a.first} a fait un vœu. Je pense que c'était de ne jamais avoir de fête surprise."], en: ["A small dinner for two. We talked about everything, old memories and future wrinkles. {a.first} said it was perfect. It was perfect.", "A simple restaurant, a cake with one candle. {a.first} made a wish. I think it was to never get a surprise party."] }, fx: { rel: 10, happy: 4, money: -60 } },
      { label: { fr: 'Oublier complètement', en: 'Totally forget' }, text: { fr: ["J'ai oublié. Complètement. Je m'en suis rendu compte en voyant les photos de la fête organisée par quelqu'un d'autre. J'étais pas invité{|e} : ils pensaient que je l'organisais.", "J'ai offert {w:gift} trois jours en retard, avec l'étiquette du prix. {a.first} a souri. Un sourire très, très poli."], en: ["I forgot. Completely. I realized it seeing photos of the party someone else threw. I wasn't invited: they thought I was hosting.", "I gave {w:gift} three days late, price tag still on. {a.first} smiled. A very, very polite smile."] }, fx: { rel: -10, happy: -2 } },
    ],
  },
  {
    id: 'fr2_wedding_toast',
    icon: '🥂',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'party', prop: 'microphone' },
    when: { age: [20, 80] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Mariage de {a.first}. Tu sirotes {w:drink}, ton cinquième verre, quand le DJ annonce : « Et maintenant, un petit mot de son meilleur ami ! » Ce n'était pas prévu. Tout le monde te regarde.",
        "Tu as écrit un discours magnifique pour le mariage de {a.first}. Ton téléphone vient de mourir. Le micro est dans ta main. Cent vingt invités attendent.",
        "Au mariage de {a.first}, le témoin officiel s'est effondré, ivre mort, sous la table. Le micro arrive jusqu'à toi, comme une patate chaude.",
        "{a.first} te glisse : « Fais un discours, mais tu ne racontes pas ce qui s'est passé {w:at_place}, hein. » Tu n'avais pas l'intention d'en parler. Maintenant, tu ne penses qu'à ça.",
      ],
      en: [
        "{a.first}'s wedding. You're sipping {w:drink}, your fifth drink, when the DJ announces: 'And now, a few words from the best friend!' That wasn't planned. Everyone's looking at you.",
        "You wrote a gorgeous speech for {a.first}'s wedding. Your phone just died. The mic is in your hand. A hundred and twenty guests are waiting.",
        "At {a.first}'s wedding, the official best man collapsed, blackout drunk, under a table. The mic makes its way to you like a hot potato.",
        "{a.first} whispers: 'Give a speech, but don't mention what happened {w:at_place}, okay?' You weren't going to. Now it's all you can think about.",
      ],
    },
    choices: [
      {
        label: { fr: 'Improviser', en: 'Improvise' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai improvisé un discours drôle, tendre, parfait. Les invités ont ri, puis pleuré. La belle-mère m'a demandé mon numéro « pour un autre mariage ». Le sien.", "Trois minutes d'impro magique. Même le traiteur a applaudi. {a.first} m'a serré{|e} dans ses bras en chuchotant « je t'aime, enfoiré{|e} »."], en: ["I improvised a speech that was funny, tender, perfect. Guests laughed, then cried. The mother-in-law asked for my number 'for another wedding'. Hers.", "Three minutes of magical improv. Even the caterer applauded. {a.first} hugged me whispering 'love you, you bastard'."] }, fx: { rel: 15, happy: 8, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai commencé par « Je me souviens de la première fois que j'ai vu {a.first} vomir… » et je n'ai jamais réussi à remonter la pente. Le marié a coupé le micro.", "J'ai improvisé. Par réflexe, j'ai cité tous les ex de {a.first}. Par ordre chronologique. Avec des notes. La salle a gelé."], en: ["I opened with 'I remember the first time I saw {a.first} throw up…' and never recovered. The groom cut the mic.", "I improvised. By reflex, I listed all of {a.first}'s exes. In chronological order. With ratings. The room froze."] }, fx: { rel: -12, happy: -6 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Chanter à la place', en: 'Sing instead' }, text: { fr: ["Faute de mots, j'ai chanté {w:song} a cappella. Faux. Très faux. Mais avec une telle conviction que la salle a repris en chœur.", "J'ai tenté {w:song} en version slow. Les grands-parents ont dansé. Un oncle a pleuré. Je ne sais pas si c'était d'émotion."], en: ["Lost for words, I sang {w:song} a cappella. Off-key. Very off-key. But with such conviction that the whole room joined in.", "I attempted a slow version of {w:song}. The grandparents danced. An uncle cried. Not sure it was emotion."] }, fx: { rel: 6, happy: 5 } },
      { label: { fr: "Raconter l'histoire interdite", en: 'Tell the forbidden story' }, rating: 2, text: { fr: ["J'ai raconté l'histoire interdite, détails compris. Le mariage a continué, techniquement. Mais les deux familles ne se sont plus adressé la parole de la soirée.", "J'ai tout balancé au micro. Le marié a ri, la mariée a pleuré, le curé a pris des notes. {a.first} m'a jeté sa jarretière à la figure."], en: ["I told the forbidden story, details included. The wedding went on, technically. But the two families didn't speak another word all night.", "I spilled it all on the mic. The groom laughed, the bride cried, the priest took notes. {a.first} threw the garter in my face."] }, fx: { rel: -25, happy: 5, karma: -5 } },
    ],
  },
  // ───────────────────────────── friends: funerals, fame, cults, nights out ─────────────────────────────
  {
    id: 'fr2_funeral_wishes',
    icon: '⚱️',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'cemetery', mood: 'sad', prop: 'urn' },
    when: { age: [20, 95] },
    weight: 3,
    cooldown: 10,
    text: {
      fr: [
        "{a.first} est mort{a:|e}. Dans son testament, une seule demande pour toi : disperser ses cendres {w:at_place}, en chantant {w:song}. Le notaire a lu ça sans sourciller.",
        "Coup de massue : {a.first} n'est plus. Ses dernières volontés exigent que tout le monde vienne déguisé en {w:celeb} à l'enterrement. Tu es chargé{|e} de faire respecter le dress code.",
        "{a.first}, {a.rel}, s'est éteint{a:|e} {w:time}. Sa famille te tend l'urne : « {a:Il|Elle} voulait que ce soit toi qui décides. » Tu n'as jamais tenu de mort dans tes mains.",
        "Enterrement de {a.first}. Dernière volonté : que ses cendres soient mélangées dans {w:food} et servies au buffet. La famille hésite. Tous les regards se tournent vers toi.",
      ],
      en: [
        "{a.first} is dead. The will has a single request for you: scatter the ashes {w:at_place}, singing {w:song}. The lawyer read it with a straight face.",
        "Gut punch: {a.first} is gone. The last wishes demand that everyone come to the funeral dressed as {w:celeb}. You're in charge of enforcing the dress code.",
        "{a.first}, {a.rel}, passed away {w:time}. The family hands you the urn: '{a:He|She} wanted you to decide.' You've never held a dead person in your hands.",
        "{a.first}'s funeral. Last wish: the ashes mixed into {w:food} and served at the buffet. The family hesitates. Every eye turns to you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Respecter ses volontés', en: 'Honour the wishes' },
        out: [
          { w: 2, text: { fr: ["J'ai tout fait à la lettre. C'était absurde, magnifique et parfaitement {a.first}. Tout le monde a ri en pleurant. {a:Il|Elle} aurait adoré.", "On a suivi ses consignes jusqu'au bout. Les passants nous ont pris pour une secte. Je crois que {a.first} rigole quelque part."], en: ["I did everything to the letter. It was absurd, beautiful and so very {a.first}. Everyone laughed through their tears. {a:He|She} would've loved it.", "We followed the instructions to the end. Passersby thought we were a cult. I think {a.first} is laughing somewhere."] }, fx: { actorDie: true, happy: -6, karma: 6 }, mood: 'cry' },
          { w: 1, text: { fr: ["Un coup de vent a renvoyé les cendres de {a.first} direct dans ma bouche. J'ai toussé mon meilleur ami pendant dix minutes. On était proches, maintenant on est inséparables.", "Le couvercle de l'urne a sauté. {a.first} a fini sur ma veste, mes cheveux et un caniche qui passait. Le caniche est parti avec une partie de mon pote."], en: ["A gust of wind blew {a.first}'s ashes straight into my mouth. I coughed up my best friend for ten minutes. We were close; now we're inseparable.", "The urn lid popped off. {a.first} ended up on my jacket, my hair and a passing poodle. The poodle left with part of my friend."] }, fx: { actorDie: true, happy: -8, health: -2 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Enterrement classique', en: 'Traditional funeral' }, text: { fr: ["J'ai opté pour un enterrement sobre. Fleurs blanches, musique douce, silence. C'était beau. Mais j'ai l'impression d'avoir trahi {a.first} pour la première fois.", "Cérémonie classique, discours poli, café tiède. La famille m'a remercié{|e}. Un vieux pote m'a glissé : « {a:Il|Elle} aurait détesté. » Il a raison."], en: ["I went with a sober funeral. White flowers, soft music, silence. It was lovely. But I feel like I betrayed {a.first} for the first time.", "Classic ceremony, polite speech, lukewarm coffee. The family thanked me. An old friend whispered: '{a:He|She} would've hated this.' He's right."] }, fx: { actorDie: true, happy: -10, karma: -2 }, mood: 'sad' },
      { label: { fr: "Garder l'urne chez moi", en: 'Keep the urn at home' }, text: { fr: ["J'ai ramené {a.first} à la maison. Son urne trône sur l'étagère, entre {w:object} et la télé. On regarde encore nos séries ensemble.", "L'urne de {a.first} vit chez moi. Je lui raconte ma journée. Mes invités trouvent ça glauque. {a.first} trouverait ça hilarant."], en: ["I brought {a.first} home. The urn sits on the shelf between {w:object} and the TV. We still watch our shows together.", "{a.first}'s urn lives with me. I tell it about my day. Guests find it creepy. {a.first} would find it hilarious."] }, fx: { actorDie: true, happy: -5 }, mood: 'sad' },
    ],
  },
  {
    id: 'fr2_funeral_coffin',
    icon: '⚰️',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'cemetery', mood: 'shock', prop: 'coffin', fx: 'gore' },
    when: { age: [20, 90] },
    weight: 3,
    cooldown: 12,
    text: {
      fr: [
        "{a.first} est mort{a:|e} {w:excuse}, apparemment. Tu portes son cercueil avec cinq autres potes. Celui de devant a bu. La pente est verglacée. Tu sens que ça va mal finir.",
        "Enterrement de {a.first}. Tu es porteur, le cercueil pèse une tonne, et le type derrière toi vient de glisser sur {w:gross}. Le monde passe au ralenti.",
        "Funérailles de {a.first} {w:weather}. Le cercueil est en carton recyclé (son dernier geste écolo). Il commence à se ramollir. Tu tiens un coin.",
        "Tu portes le cercueil de {a.first} quand la poignée te reste dans la main. {w:swear} Le prêtre ferme les yeux. La famille hurle.",
      ],
      en: [
        "{a.first} died {w:excuse}, apparently. You're carrying the coffin with five other friends. The guy in front is drunk. The slope is icy. You sense this will end badly.",
        "{a.first}'s funeral. You're a pallbearer, the coffin weighs a ton, and the guy behind you just slipped on {w:gross}. The world goes slow-motion.",
        "{a.first}'s funeral {w:weather}. The coffin is recycled cardboard ({a:his|her} final eco-gesture). It's starting to go soggy. You're holding a corner.",
        "You're carrying {a.first}'s coffin when the handle comes off in your hand. {w:swear} The priest shuts his eyes. The family screams.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rattraper le cercueil', en: 'Catch the coffin' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: ["Plongeon héroïque. J'ai rattrapé le cercueil à deux centimètres du sol. Applaudissements dans le cimetière. Un neveu a filmé : ralenti, musique épique, 400 000 vues.", "J'ai bloqué le cercueil avec mon genou. Craquement sinistre, mais {a.first} est resté{a:|e} dedans. Je boite, mais avec fierté."], en: ["Heroic dive. I caught the coffin an inch from the ground. Applause across the cemetery. A nephew filmed it: slow-mo, epic music, 400,000 views.", "I blocked the coffin with my knee. Ominous crunch, but {a.first} stayed inside. I'm limping, but proudly."] }, fx: { actorDie: true, athletic: 3, fame: 2, health: -3 }, mood: 'proud' },
          { w: 2, text: { fr: ["Le cercueil a dévalé la pente comme une luge et s'est ouvert contre une tombe. {a.first} a roulé dehors, raide comme un piquet, et a fini debout contre un ange en pierre. Je n'oublierai jamais ce regard.", "Le cercueil m'a écrasé le pied, puis s'est fendu. Un bras de {a.first} est sorti pour pendre sur le côté, comme un dernier « salut ». Tante Josiane a vomi dans la fosse."], en: ["The coffin slid down the slope like a sled and burst open against a tombstone. {a.first} rolled out, stiff as a board, and ended up standing against a stone angel. I'll never forget that stare.", "The coffin crushed my foot, then split. One of {a.first}'s arms flopped out over the side like a final 'bye'. Aunt Josie puked into the grave."] }, fx: { actorDie: true, health: -6, happy: -10, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Lâcher et fuir', en: 'Drop it and run' }, text: { fr: ["J'ai lâché ma poignée et couru. Derrière moi : un grand boum, des cris, et le prêtre qui jure en latin. Je ne suis plus invité{|e} à aucun enterrement de cette famille. Même le mien, probablement.", "J'ai paniqué et filé derrière un caveau. Le cercueil a fini dans la mauvaise fosse, sur un inconnu. Les deux familles se disputent encore la concession."], en: ["I let go and ran. Behind me: a big thud, screams, and the priest swearing in Latin. I'm banned from every funeral in that family. Probably my own too.", "I panicked and bolted behind a mausoleum. The coffin landed in the wrong grave, on top of a stranger. Both families are still fighting over the plot."] }, fx: { actorDie: true, karma: -8, happy: -6 } },
      { label: { fr: "Improviser l'éloge", en: 'Improvise the eulogy' }, text: { fr: ["Pendant que les autres ramassaient le désastre, j'ai pris la parole : « {a.first} a toujours voulu faire une sortie remarquée. » Fou rire général. Même la veuve.", "J'ai fait l'éloge funèbre au milieu du chaos, debout sur le cercueil renversé. Un moment de grâce absolue. Le prêtre a dit que c'était « une première, au moins »."], en: ["While the others cleaned up the disaster, I spoke: '{a.first} always wanted to make an entrance. Or an exit.' Everyone burst out laughing. Even the widow.", "I gave the eulogy amid the chaos, standing on the overturned coffin. A moment of pure grace. The priest said it was 'a first, at least'."] }, fx: { actorDie: true, happy: -2, karma: 3 } },
    ],
  },
  {
    id: 'fr2_friend_famous',
    icon: '🌟',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    scene: { place: 'studio', mood: 'shock', prop: 'phone' },
    when: { age: [14, 70] },
    weight: 5,
    cooldown: 15,
    text: {
      fr: [
        "{a.first} a posté une vidéo où {a:il|elle} imite {w:animal}. Douze millions de vues en une nuit. Ce matin, {a:il|elle} est au JT. Tu as son numéro. Pour l'instant.",
        "{w:exclaim} {a.first} vient de signer avec une grosse maison de disques après avoir chanté {w:song} {w:at_place}. Tout le monde veut être son ami. Toi, tu l'étais avant.",
        "{a.first} est devenu{a:|e} la grande révélation de l'émission {w:show}. Ta mère te demande des autographes. Le groupe WhatsApp est en feu.",
        "Ton pote {a.first} a gagné un concours national (catégorie : {w:hobby}), puis un contrat publicitaire avec {w:brand}. Sa tête est sur les bus. Toi, tu prends le bus.",
      ],
      en: [
        "{a.first} posted a video imitating {w:animal}. Twelve million views overnight. This morning {a:he|she} is on the news. You have {a:his|her} number. For now.",
        "{w:exclaim} {a.first} just signed with a major label after singing {w:song} {w:at_place}. Everyone wants to be {a:his|her} friend. You were before.",
        "{a.first} became the breakout star of {w:show}. Your mom wants autographs. The group chat is on fire.",
        "Your buddy {a.first} won a national contest ({w:hobby} category), then an ad deal with {w:brand}. {a:His|Her} face is on buses. You ride the bus.",
      ],
    },
    choices: [
      { label: { fr: 'Rester naturel{|le}', en: 'Stay normal' }, text: { fr: ["Je lui ai envoyé « Bravo, frimeur{a:|se} » et rien d'autre. {a.first} m'a répondu à 3 h du matin : « Merci d'être le seul à pas me demander un truc. »", "Je l'ai traité{a:|e} exactement comme avant : mal. {a:Il|Elle} a adoré. C'est la seule personne qui ose encore lui dire qu'{a:il|elle} a du persil entre les dents."], en: ["I texted 'Congrats, show-off' and nothing else. {a.first} replied at 3 a.m.: 'Thanks for being the only one not asking me for something.'", "I treated {a:him|her} exactly like before: badly. {a:He|She} loved it. I'm the only one who still dares to point out spinach in {a:his|her} teeth."] }, fx: { rel: 12, happy: 3, schedule: { key: 'fr2_famous_dropped', years: 2 } } },
      {
        label: { fr: 'Profiter de la gloire', en: 'Ride the fame' },
        out: [
          { w: 1, text: { fr: ["J'ai squatté toutes ses soirées VIP. J'ai bu du champagne avec {w:celeb} et j'ai fini sur une photo de magazine, flou{|e}, mais présent{|e}.", "Je suis devenu{|e} « l'ami{|e} de ». Des inconnus m'offrent des verres pour avoir son numéro. Je ne le donne pas. Mais je bois les verres."], en: ["I crashed every VIP party. Drank champagne with {w:celeb} and ended up in a magazine photo, blurry but present.", "I became 'the friend of'. Strangers buy me drinks to get the number. I don't give it out. But I drink the drinks."] }, fx: { fame: 3, happy: 6, rel: -3, schedule: { key: 'fr2_famous_dropped', years: 2 } }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai vendu une photo de {a.first} bourré{a:|e} à un magazine. 2 000 balles. {a:Il|Elle} a reconnu l'angle de mon téléphone. Ami{a:|e} perdu{a:|e}, loyer payé.", "J'ai donné une interview sur « le vrai {a.first} ». J'ai trop parlé. {a:Il|Elle} m'a bloqué{|e} et son avocat m'a écrit."], en: ["I sold a photo of drunk {a.first} to a tabloid. Two grand. {a:He|She} recognized my phone's angle. Friend lost, rent paid.", "I gave an interview about 'the real {a.first}'. I said too much. {a:He|She} blocked me and {a:his|her} lawyer wrote to me."] }, fx: { money: 2000, rel: -40, actorRole: 'enemy', karma: -8 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Être jaloux{|se} en silence', en: 'Be silently jealous' }, text: { fr: ["Je n'ai rien dit. J'ai juste regardé chaque vidéo en serrant les dents et j'ai laissé des commentaires anonymes du type « surcoté ». Je ne suis pas fier{|e}.", "J'ai mis {a.first} en sourdine partout. Je le/la vois quand même sur les bus. La jalousie me ronge comme {w:animal} une vieille chaussure."], en: ["I said nothing. I just watched every video through gritted teeth and left anonymous comments like 'overrated'. Not proud.", "I muted {a.first} everywhere. I still see that face on the buses. Jealousy gnaws at me like {w:animal} on an old shoe."] }, fx: { happy: -5, karma: -2, rel: -5 } },
    ],
  },
  {
    id: 'fr2_famous_dropped',
    icon: '📵',
    cat: 'friends',
    rating: 1,
    chainOnly: true,
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'sad', prop: 'phone' },
    text: {
      fr: [
        "Deux ans de célébrité plus tard, {a.first} ne répond plus à tes messages. Son assistant{a:|e} t'a envoyé un mail : « {a.first} vous remercie pour votre soutien. »",
        "Tu as vu {a.first} à la télé dire que « ses vrais amis, ce sont ses fans ». Tu as été son témoin de mariage, son garant, son alibi. Tu n'es plus rien.",
        "{a.first} sort une autobiographie. Tu apparais page 112 sous le nom de « un pote un peu lourd de l'époque ». C'est tout. Une ligne.",
        "Soirée de lancement de la marque de {a.first}. Tu n'es pas sur la liste. Le videur te demande d'épeler ton nom. Deux fois.",
      ],
      en: [
        "Two years of fame later, {a.first} doesn't answer your texts. {a:His|Her} assistant emailed you: '{a.first} thanks you for your support.'",
        "You saw {a.first} on TV saying 'my real friends are my fans'. You were {a:his|her} wedding witness, guarantor and alibi. You're nothing now.",
        "{a.first} is publishing a memoir. You appear on page 112 as 'a slightly annoying buddy from back then'. That's it. One line.",
        "Launch party for {a.first}'s brand. You're not on the list. The bouncer asks you to spell your name. Twice.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le/La confronter', en: 'Confront them' },
        out: [
          { w: 1, text: { fr: ["J'ai forcé l'entrée, j'ai trouvé {a.first} et je lui ai dit ses quatre vérités. {a:Il|Elle} a fondu en larmes : « Tout le monde me ment, sauf toi. » On a fini la soirée en kebab, comme avant.", "Je l'ai coincé{a:|e} dans les loges. Silence, puis {a:il|elle} a éclaté de rire et m'a serré{|e} dans ses bras. La gloire lui avait juste grillé quelques neurones."], en: ["I forced my way in, found {a.first} and told {a:him|her} the hard truth. {a:He|She} burst into tears: 'Everyone lies to me except you.' We ended the night eating kebabs, like old times.", "I cornered {a:him|her} backstage. Silence, then {a:he|she} burst out laughing and hugged me. Fame had just fried a few neurons."] }, fx: { rel: 20, happy: 8 }, mood: 'happy' },
          { w: 1, text: { fr: ["La sécurité m'a sorti{|e} par le col avant que j'ouvre la bouche. Le lendemain, j'étais dans la presse : « Un fan déséquilibré tente d'approcher {a.first}. » Le fan, c'est moi.", "{a.first} m'a regardé{|e} comme un inconnu et a fait signe au garde du corps. Fin d'une amitié de vingt ans, en un geste de la main."], en: ["Security dragged me out by the collar before I could speak. Next day, I was in the press: 'Unhinged fan tries to approach {a.first}.' The fan is me.", "{a.first} looked at me like a stranger and signaled the bodyguard. Twenty years of friendship, ended with a hand gesture."] }, fx: { rel: -40, actorRole: 'enemy', happy: -10, fame: 1 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Vendre mes souvenirs', en: 'Sell my memories' }, rating: 1, text: { fr: ["J'ai vendu à la presse ses photos d'ado avec appareil dentaire et coupe mulet. 5 000 balles. Ça s'appelle la justice poétique, et ça paie bien.", "J'ai écrit un livre : « {a.first}, l'imposteur ». Best-seller dans trois rayons de supermarché. On ne se parlera plus jamais. Ça me va."], en: ["I sold the press {a:his|her} teen photos with braces and a mullet. Five grand. It's called poetic justice, and it pays well.", "I wrote a book: '{a.first}, the Fraud'. Bestseller in three supermarket aisles. We'll never speak again. Fine by me."] }, fx: { money: 5000, rel: -50, actorRole: 'enemy', karma: -6 } },
      { label: { fr: 'Tourner la page', en: 'Move on' }, text: { fr: ["J'ai supprimé son numéro et je me suis fait de nouveaux amis. Des gens normaux, qui ne passent pas à la télé. Ça repose.", "J'ai lâché l'affaire. Parfois, je souris en voyant sa tête sur un paquet de chips. C'est ma façon de lui dire au revoir."], en: ["I deleted the number and made new friends. Normal people who aren't on TV. It's restful.", "I let it go. Sometimes I smile when I see that face on a bag of chips. It's my way of saying goodbye."] }, fx: { happy: 2, rel: -15, stress: -3 } },
    ],
  },
  {
    id: 'fr2_friend_guru',
    icon: '🕯️',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    vars: { amount: [500, 4000] },
    scene: { place: 'villa', mood: 'shock', prop: 'candle' },
    when: { age: [20, 70] },
    weight: 4,
    cooldown: 12,
    text: {
      fr: [
        "{a.first} n'a pas rejoint une secte : {a:il|elle} en a fondé une. Robe blanche, regard fixe, et une révélation : {w:conspiracy}. {a:Il|Elle} te propose le poste de bras droit.",
        "Nouveau nom pour {a.first} : « Lumière Suprême ». Douze disciples, une ferme {w:far_place}, et des rituels de purification qui impliquent {w:gross}. {a:Il|Elle} veut que tu viennes.",
        "{a.first} a quitté son job pour devenir gourou à plein temps. Sa doctrine tient en une phrase : tout le monde doit lui donner {$amount} et faire l'amour en rond le dimanche.",
        "Tu arrives à l'anniversaire de {a.first}. Quarante personnes en toge psalmodient son nom. Sur l'autel : {w:food} et un portrait géant de {a:lui|elle}, torse nu.",
      ],
      en: [
        "{a.first} didn't join a cult: {a:he|she} founded one. White robe, fixed stare, and a revelation: {w:conspiracy}. {a:He|She} offers you the job of right hand.",
        "New name for {a.first}: 'Supreme Light'. Twelve disciples, a farm {w:far_place}, and purification rituals involving {w:gross}. {a:He|She} wants you to come.",
        "{a.first} quit {a:his|her} job to become a full-time guru. The doctrine fits in one sentence: everyone must give {a:him|her} {$amount} and have sex in a circle on Sundays.",
        "You show up at {a.first}'s birthday. Forty people in togas are chanting {a:his|her} name. On the altar: {w:food} and a giant shirtless portrait of {a:him|her}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Devenir bras droit', en: 'Become the right hand' },
        out: [
          { w: 2, text: { fr: ["J'ai accepté. Je gère la trésorerie, les toges et la playlist des orgies. Je gagne bien ma vie. J'ai honte, mais en lin blanc.", "Me voilà « Archange de la Caisse ». Les disciples me vouvoient et m'apportent {w:drink} au réveil. Le paradis, c'est une arnaque bien organisée."], en: ["I accepted. I run the treasury, the robes and the orgy playlist. I make good money. I'm ashamed, but in white linen.", "I am now 'Archangel of the Cash Register'. The disciples call me 'Your Grace' and bring me {w:drink} in bed. Paradise is a well-run scam."] }, fx: { money: 'amount', karma: -12, rel: 15, happy: 5 }, mood: 'proud' },
          { w: 1, text: { fr: ["Descente de police au bout de trois semaines. J'étais le seul à avoir signé quelque chose. {a.first} a disparu en hélicoptère. Moi, en fourgon.", "Le GIGN a défoncé la porte pendant le rituel. J'étais en toge, couvert{|e} de miel, à genoux devant un bouc. La photo est au dossier."], en: ["Police raid after three weeks. I was the only one who'd signed anything. {a.first} vanished by helicopter. I left by police van.", "SWAT smashed the door during the ritual. I was in a toga, covered in honey, kneeling before a goat. The photo is in the file."] }, fx: { arrest: 'ponzi', karma: -10, visual: 'police' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Le/La faire désenvoûter', en: 'Stage a deprogramming' }, text: { fr: ["J'ai kidnappé {a.first} avec trois potes et un minibus. Quarante-huit heures de Disney et de pizzas. {a:Il|Elle} est revenu{a:|e} à la raison, mais réclame encore qu'on L'appelle Lumière.", "Opération exfiltration : sac sur la tête, coffre de la Clio. {a.first} m'a mordu{|e} au sang. Puis {a:il|elle} a pleuré dans mes bras. Retour à la normale, plus ou moins."], en: ["I kidnapped {a.first} with three friends and a minivan. Forty-eight hours of Disney and pizza. {a:He|She} came back to reason, but still insists we call {a:him|her} Light.", "Extraction op: bag over the head, car trunk. {a.first} bit me until I bled. Then cried in my arms. Back to normal, more or less."] }, fx: { rel: 10, karma: 6, health: -3, heat: 5 } },
      { label: { fr: 'Venir juste pour le buffet', en: 'Just come for the buffet' }, text: { fr: ["Je suis venu{|e} pour le buffet. J'ai mangé, bu, hoché la tête pendant le sermon, et je suis reparti{|e} avec un tupperware. Les sectes ont de super traiteurs.", "J'ai profité du buffet gratuit en restant au fond. Une disciple m'a fait du pied pendant le chant sacré. J'ai pris son numéro et deux parts de gâteau."], en: ["I came for the buffet. Ate, drank, nodded through the sermon, and left with a Tupperware. Cults have amazing caterers.", "I enjoyed the free buffet from the back row. A disciple played footsie with me during the sacred chant. I got her number and two slices of cake."] }, fx: { happy: 5, weight: 0.02, rel: 2 } },
    ],
  },
  {
    id: 'fr2_friend_restaurant',
    icon: '🍽️',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'sick', prop: 'plate', fx: 'poop' },
    when: { age: [18, 75] },
    weight: 6,
    cooldown: 8,
    text: {
      fr: [
        "Inauguration du restaurant de {a.first}. Spécialité de la maison : {w:food} « revisité{a:|e} », servi dans une chaussure. Tu sens déjà ton intestin rédiger son testament.",
        "{a.first} a ouvert son food-truck. Tu es le premier client. La viande a une couleur que tu n'as jamais vue dans la nature. {a:Il|Elle} te regarde, plein{a:|e} d'espoir.",
        "Soirée dégustation chez {a.first}, qui se lance comme chef{a:|fe}. Il règne {w:smell}. Dans l'assiette : {w:food}, et quelque chose qui bouge encore.",
        "Le resto de {a.first} ouvre ce soir. Dans les cuisines, tu aperçois {w:animal} qui goûte la sauce. {a:Il|Elle} te sert la première assiette avec un clin d'œil.",
      ],
      en: [
        "Opening night at {a.first}'s restaurant. House special: 'reinvented' {w:food}, served in a shoe. You can already feel your intestines writing their will.",
        "{a.first} opened a food truck. You're the first customer. The meat is a color you've never seen in nature. {a:He|She} watches you, full of hope.",
        "Tasting night at {a.first}'s, who's starting out as a chef. The air holds {w:smell}. On the plate: {w:food}, and something still moving.",
        "{a.first}'s restaurant opens tonight. In the kitchen, you spot {w:animal} tasting the sauce. {a:He|She} serves you the first plate with a wink.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout manger, par amitié', en: 'Eat it all, for friendship' },
        out: [
          { w: 1, text: { fr: ["C'était… délicieux ? J'ai demandé du rab. {a.first} a pleuré de joie. Mon estomac a tenu bon. Miracle de la cuisine moderne.", "Contre toute attente, c'était incroyable. J'ai laissé cinq étoiles en ligne. Le resto est complet pour six mois et j'ai ma table attitrée."], en: ["It was… delicious? I asked for seconds. {a.first} cried with joy. My stomach held strong. A miracle of modern cuisine.", "Against all odds, it was incredible. I left five stars online. The place is booked for six months and I have my own table."] }, fx: { rel: 12, happy: 6 }, mood: 'happy' },
          { w: 2, text: { fr: ["Vingt minutes plus tard, j'ai repeint les toilettes du resto du sol au plafond, par les deux bouts. {a.first} a fermé le soir même pour « travaux ».", "J'ai tout mangé. Puis j'ai tout rendu, en jet, sur le critique gastronomique de la table d'à côté. Il a écrit une critique. Elle parle surtout de moi."], en: ["Twenty minutes later, I repainted the restaurant bathroom floor to ceiling, from both ends. {a.first} closed that same night 'for renovations'.", "I ate everything. Then returned everything, projectile-style, onto the food critic at the next table. He wrote a review. It's mostly about me."] }, fx: { health: -10, disease: 'food_poisoning', rel: 6, visual: 'poop' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Donner à manger au chien', en: 'Feed it to a dog' }, text: { fr: ["J'ai discrètement nourri le chien du voisin de table. Le chien a fait une tête que je n'oublierai jamais, puis a vomi sur ses maîtres. Diversion parfaite.", "J'ai glissé l'assiette à un chien errant devant la terrasse. Il a reniflé, a gémi, et a enterré la nourriture. Même lui a dit non."], en: ["I quietly fed the dog at the next table. The dog made a face I'll never forget, then threw up on its owners. Perfect diversion.", "I slipped the plate to a stray dog outside. It sniffed, whimpered, and buried the food. Even the dog said no."] }, fx: { karma: -3, happy: 3, rel: 2 } },
      { label: { fr: 'Critique honnête', en: 'Honest review' }, text: { fr: ["Je lui ai dit la vérité : « On dirait {w:gross} sur un lit de regrets. » {a.first} a changé toute la carte. Le resto tient encore, et notre amitié aussi, de justesse.", "Critique honnête et constructive. {a.first} m'a balancé une louche de sauce à la figure. Mais le lendemain, la carte avait changé."], en: ["I told the truth: 'Looks like {w:gross} on a bed of regret.' {a.first} rewrote the whole menu. The place is still open, and so is our friendship, barely.", "Honest, constructive feedback. {a.first} threw a ladle of sauce in my face. But the next day, the menu had changed."] }, fx: { rel: -6, karma: 4, smarts: 1 } },
    ],
  },
  {
    id: 'fr2_bachelor_party',
    icon: '🍾',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    vars: { amount: [400, 2500] },
    scene: { place: 'party', mood: 'party', prop: 'bottle' },
    when: { age: [20, 60] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "Enterrement de vie de célibataire de {a.first} {w:far_place}. Budget : {$amount}. Programme : karting, strip-club, et « une surprise » qui implique {w:animal} et un costume en latex.",
        "EVG/EVJF de {a.first}. Il est 4 h, tu es menotté{|e} à un lampadaire, quelqu'un t'a rasé un sourcil, et {a.first} a disparu avec quelqu'un déguisé en {w:celeb}.",
        "Pour l'enterrement de vie de jeune {a:garçon|fille} de {a.first}, le groupe a loué un bateau. Personne ne sait piloter. Il y a {w:drink} à volonté et un strip-teaseur déguisé en pompier.",
        "Lendemain d'EVG à Amsterdam. Tu te réveilles dans une baignoire de glaçons, avec un tatouage frais où est écrit « {a.first} 4 EVER ». {a.first} est introuvable.",
      ],
      en: [
        "{a.first}'s bachelor(ette) party {w:far_place}. Budget: {$amount}. Program: go-karts, strip club, and 'a surprise' involving {w:animal} and a latex costume.",
        "{a.first}'s bachelor(ette) party. It's 4 a.m., you're handcuffed to a lamppost, someone shaved off one of your eyebrows, and {a.first} vanished with someone dressed as {w:celeb}.",
        "For {a.first}'s bachelor(ette) party, the group rented a boat. Nobody knows how to sail. There's unlimited {w:drink} and a stripper dressed as a firefighter.",
        "Morning after the bachelor party in Amsterdam. You wake up in a bathtub of ice, with a fresh tattoo reading '{a.first} 4 EVER'. {a.first} is nowhere to be found.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout donner', en: 'Go all in' },
        out: [
          { w: 2, text: { fr: ["Nuit légendaire. J'ai dansé sur un bar, embrassé un inconnu, perdu une chaussure et {$amount}. {a.first} dit que c'est le plus beau jour de sa vie, avant le mariage.", "Je n'ai aucun souvenir après minuit, mais quarante vidéos sur mon téléphone. Sur l'une d'elles, je fais un salto arrière dans une fontaine. Je ne sais pas faire de salto."], en: ["Legendary night. Danced on a bar, kissed a stranger, lost a shoe and {$amount}. {a.first} says it was the best day of {a:his|her} life, pre-wedding.", "I remember nothing after midnight, but have forty videos on my phone. In one, I do a backflip into a fountain. I can't do backflips."] }, fx: { money: '-amount', happy: 12, rel: 12, health: -5, addiction: ['alcohol', 6] }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai fini la nuit au poste, en string léopard, pour « exhibition sur la voie publique ». Le flic m'a demandé si c'était un EVG. Il en voit trois par semaine.", "On a perdu {a.first}. Retrouvé{a:|e} 18 heures plus tard {w:far_place}, marié{a:|e} à quelqu'un d'autre par un faux prêtre. Le vrai mariage est dans deux jours."], en: ["I ended the night at the station, in a leopard thong, for 'public indecency'. The cop asked if it was a bachelor party. He sees three a week.", "We lost {a.first}. Found 18 hours later {w:far_place}, married to someone else by a fake priest. The real wedding is in two days."] }, fx: { money: '-amount', happy: 4, heat: 8, rel: 4, visual: 'police' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Jouer le chauffeur sobre', en: 'Be the sober driver' }, text: { fr: ["J'ai fait le chauffeur sobre. J'ai ramassé six adultes vomissant, un cône de chantier et {w:animal}. Personne ne se souvient de mon héroïsme. Moi, si.", "Toute la nuit au Coca. J'ai vu des choses que des yeux sobres n'auraient jamais dû voir. Je garde les vidéos. Pour les anniversaires de mariage."], en: ["I was the sober driver. Collected six puking adults, a traffic cone and {w:animal}. Nobody remembers my heroism. I do.", "All night on soda. I saw things sober eyes should never see. I'm keeping the videos. For wedding anniversaries."] }, fx: { rel: 8, karma: 4, stress: 6, happy: -2 } },
      { label: { fr: 'Rentrer à minuit', en: 'Go home at midnight' }, text: { fr: ["Je suis rentré{|e} à minuit, comme un{|e} vieux{|ille}. J'ai raté le moment où {a.first} a été kidnappé{a:|e} par des drag-queens. Le groupe en parle encore. Sans moi.", "Minuit, dodo. Le lendemain, j'ai découvert sur Insta que j'avais raté la nuit du siècle. FOMO sévère et un pote vexé."], en: ["I went home at midnight like a grandparent. I missed the moment {a.first} got kidnapped by drag queens. The group still talks about it. Without me.", "Midnight, bed. Next day I found out on Insta I'd missed the night of the century. Severe FOMO and an offended friend."] }, fx: { rel: -8, health: 2, happy: -3 } },
    ],
  },
  {
    id: 'fr2_baby_name',
    icon: '🍼',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    scene: { place: 'home', mood: 'shock', prop: 'baby' },
    when: { age: [20, 60] },
    weight: 7,
    cooldown: 6,
    text: {
      fr: [
        "{a.first} va être parent et te demande ton avis sur le prénom. Son favori : « [[Kayzeur|Lou-Pharaon|Yzëlya|Tornade]] ». {a:Il|Elle} ajoute : « C'est inspiré par {w:celeb}. »",
        "{a.first}, enceinte ou presque, a choisi d'appeler son bébé comme {w:brand}. Pas « comme une marque » : exactement le nom de la marque. {a:Il|Elle} attend ta réaction.",
        "Annonce du prénom chez {a.first}. Ballon, gâteau, ambiance. Le prénom tombe : « [[Mojito|Kebab|Wifi|Clafoutis]] ». Tout le monde se tourne vers toi.",
        "{a.first} hésite entre deux prénoms pour son futur bébé. Tu as le vote décisif. Le premier évoque {w:food}, le second un nom de Pokémon.",
      ],
      en: [
        "{a.first} is about to be a parent and asks your opinion on the name. The favorite: '[[Kayzer|Lou-Pharaoh|Yzelya|Tornado]]'. {a:He|She} adds: 'It's inspired by {w:celeb}.'",
        "{a.first}, expecting a baby, chose to name it after {w:brand}. Not 'like a brand': literally the brand name. {a:He|She} awaits your reaction.",
        "Name reveal at {a.first}'s. Balloon, cake, the works. The name drops: '[[Mojito|Kebab|Wifi|Clafoutis]]'. Everyone turns to you.",
        "{a.first} is torn between two names for the baby. You have the deciding vote. The first evokes {w:food}, the second a Pokémon.",
      ],
    },
    choices: [
      { label: { fr: 'Dire « Magnifique ! »', en: "Say 'Gorgeous!'" }, text: { fr: ["J'ai menti avec un grand sourire. Le bébé porte ce nom maintenant. Dans quinze ans, il saura que j'aurais pu l'arrêter.", "« Magnifique ! » ai-je dit, en mourant à l'intérieur. {a.first} m'a nommé{|e} parrain/marraine. Je suis complice à vie."], en: ["I lied with a big smile. The baby has that name now. In fifteen years, the kid will know I could have stopped it.", "'Gorgeous!' I said, dying inside. {a.first} made me the godparent. I'm an accomplice for life."] }, fx: { rel: 10, karma: -2 } },
      {
        label: { fr: 'Dire la vérité', en: 'Tell the truth' },
        out: [
          { w: 1, text: { fr: ["J'ai dit que ce prénom allait condamner l'enfant à une vie de moqueries. {a.first} a réfléchi, puis a choisi « Paul ». Un enfant sauvé. Je mérite une médaille.", "J'ai été honnête. {a.first} a pris le temps d'y penser et m'a remercié{|e}. Le bébé s'appellera normalement, grâce à moi."], en: ["I said the name would doom the child to a lifetime of mockery. {a.first} thought about it, then picked 'Paul'. One child saved. I deserve a medal.", "I was honest. {a.first} took time to think and thanked me. The baby will have a normal name, thanks to me."] }, fx: { rel: 4, karma: 6 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai dit la vérité. {a.first} s'est vexé{a:|e} et a ajouté un deuxième prénom pour me punir : le mien. Le bébé s'appelle « Clafoutis {first} ».", "{a.first} n'a pas apprécié ma franchise. Je ne suis pas invité{|e} au baptême. On m'a dit que le gâteau avait la forme du prénom."], en: ["I told the truth. {a.first} got offended and added a middle name to punish me: mine. The baby is now 'Clafoutis {first}'.", "{a.first} didn't appreciate my honesty. I'm not invited to the christening. I hear the cake was shaped like the name."] }, fx: { rel: -10, happy: -2 } },
        ],
      },
      { label: { fr: 'Proposer mon prénom', en: 'Suggest my own name' }, text: { fr: ["J'ai suggéré « {first} ». Par pure modestie. {a.first} a ri pendant trois minutes, puis s'est arrêté{a:|e} net en voyant que j'étais sérieux{|se}.", "J'ai proposé mon propre prénom. {a.first} a dit qu'{a:il|elle} y penserait. Ça veut dire non. Mais je garde espoir pour le deuxième."], en: ["I suggested '{first}'. Out of pure modesty. {a.first} laughed for three minutes, then stopped dead seeing I was serious.", "I suggested my own name. {a.first} said {a:he|she}'d think about it. That means no. But I'm hopeful for the second kid."] }, fx: { happy: 2, rel: 2 } },
    ],
  },
  {
    id: 'fr2_drunk_pickup',
    icon: '🚕',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'home', mood: 'sleepy', prop: 'phone', fx: 'poop' },
    when: { age: [18, 65] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: [
        "Il est {w:time}, et {a.first} t'appelle en larmes, ivre mort{a:|e}, {w:at_place}. « Viens me chercher, j'ai perdu mon pantalon et ma dignité. »",
        "Ton téléphone sonne à 4 h 12. {a.first}, voix pâteuse : « Je suis dans une poubelle. Pas à côté. Dedans. » En fond : {w:sound}.",
        "SMS de {a.first} : « jsui pa bourrer » suivi de 14 photos floues {w:at_place} et d'une vidéo où l'on voit {w:animal}. Puis : « vien stp ».",
        "{a.first} t'appelle depuis la soirée la plus glauque de sa vie. {a:Il|Elle} a vomi sur {w:object} du propriétaire et quelqu'un menace de lui casser {w:bodypart}.",
      ],
      en: [
        "It's {w:time}, and {a.first} calls you crying, blackout drunk, {w:at_place}. 'Come get me, I lost my pants and my dignity.'",
        "Your phone rings at 4:12 a.m. {a.first}, slurring: 'I'm in a dumpster. Not next to it. In it.' In the background: {w:sound}.",
        "Text from {a.first}: 'im nott drunkk' followed by 14 blurry photos {w:at_place} and a video featuring {w:animal}. Then: 'cum get me pls'.",
        "{a.first} is calling from the sketchiest party of {a:his|her} life. {a:He|She} puked on the owner's {w:object} and someone is threatening to break {a:his|her} {w:bodypart}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Foncer le/la chercher', en: 'Rush over' },
        out: [
          { w: 2, text: { fr: ["Je suis allé{|e} le/la chercher en pyjama. {a.first} a vomi dans ma voiture, sur moi, puis dans mes cheveux. Puis {a:il|elle} m'a dit « t'es le meilleur humain du monde ». Ça compense presque.", "Sauvetage réussi. J'ai porté {a.first} jusqu'à son lit comme un sac de patates. Le lendemain, {a:il|elle} m'a offert {w:gift} sans rien dire. On s'est compris."], en: ["I went to get {a:him|her} in my pajamas. {a.first} puked in my car, on me, then in my hair. Then said 'you're the best human in the world'. Almost worth it.", "Rescue successful. I carried {a.first} to bed like a sack of potatoes. Next day, {a:he|she} gave me {w:gift} without a word. We understood each other."] }, fx: { rel: 15, health: -2, happy: -2, karma: 4, visual: 'poop' } },
          { w: 1, text: { fr: ["En arrivant, je me suis pris une bouteille perdue dans la tempe. Les urgences ont recousu mon front. {a.first} dormait paisiblement dans le couloir, sur un brancard volé.", "J'ai récupéré {a.first}, mais la soirée m'a récupéré{|e} aussi. Je me suis réveillé{|e} à 11 h sur un canapé inconnu, avec {a.first} qui me tendait un café. Inversion des rôles."], en: ["When I got there, a stray bottle hit me in the temple. The ER stitched my forehead. {a.first} was sleeping peacefully in the hallway on a stolen gurney.", "I picked up {a.first}, but the party picked me up too. I woke at 11 a.m. on a stranger's couch, with {a.first} handing me coffee. Roles reversed."] }, fx: { rel: 10, health: -8, happy: 2 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Lui payer un taxi', en: 'Pay for a cab' }, text: { fr: ["J'ai commandé un taxi à distance. Le chauffeur m'a facturé 80 balles de « nettoyage ». J'ai payé, j'ai dormi. Investissement rentable.", "Taxi commandé, pourboire laissé, problème réglé. Le chauffeur m'a envoyé une note une étoile : « Votre ami chante faux et sent {w:smell}. »"], en: ["I ordered a cab remotely. The driver charged me 80 bucks for 'cleaning'. I paid, I slept. Good investment.", "Cab ordered, tip left, problem solved. The driver left me a one-star rating: 'Your friend sings off-key and smells of {w:smell}.'"] }, fx: { money: -80, rel: 6 } },
      { label: { fr: 'Couper le téléphone', en: 'Turn off the phone' }, text: { fr: ["J'ai éteint mon téléphone. Au réveil : 37 appels manqués et une photo de {a.first} endormi{a:|e} dans un caddie. {a:Il|Elle} est vivant{a:|e}. Mais vexé{a:|e}.", "J'ai coupé et je me suis rendormi{|e}. {a.first} a fini la nuit au commissariat, où un flic sympa lui a prêté un pantalon. {a:Il|Elle} me le rappelle à chaque soirée."], en: ["I turned off my phone. Woke up to 37 missed calls and a photo of {a.first} asleep in a shopping cart. Alive. But offended.", "I switched it off and went back to sleep. {a.first} spent the night at the police station, where a nice cop lent {a:him|her} pants. {a:He|She} reminds me at every party."] }, fx: { rel: -15, health: 2 } },
    ],
  },
  {
    id: 'fr2_jealous_friend',
    icon: '😒',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    scene: { place: 'park', mood: 'neutral', prop: 'coffee' },
    when: { age: [14, 80] },
    weight: 8,
    cooldown: 6,
    text: {
      fr: [
        "Depuis que ça va bien pour toi, {a.first} a changé. Chaque bonne nouvelle reçoit la même réponse : « Ah. Cool. » Puis {a:il|elle} parle de sa sciatique.",
        "Tu racontes ta réussite à {a.first}. {a:Il|Elle} répond : « Moi aussi, j'aurais pu, si j'avais voulu. » Puis {a:il|elle} commande {w:drink} et te laisse payer.",
        "{a.first} a commenté ta dernière photo : « Ça va, la frime ? » avec un émoji clown. Tu étais juste {w:at_place}. Avec un sandwich.",
        "{a.first} t'a félicité{|e} pour ta bonne nouvelle d'une voix si glaciale que ton café a refroidi. {w:exclaim}",
      ],
      en: [
        "Ever since things went well for you, {a.first} has changed. Every bit of good news gets the same reply: 'Oh. Cool.' Then {a:he|she} talks about {a:his|her} sciatica.",
        "You tell {a.first} about your success. {a:He|She} replies: 'I could've done that too, if I'd wanted.' Then orders {w:drink} and lets you pay.",
        "{a.first} commented on your latest photo: 'Showing off much?' with a clown emoji. You were just {w:at_place}. With a sandwich.",
        "{a.first} congratulated you on your good news in a voice so icy your coffee went cold. {w:exclaim}",
      ],
    },
    choices: [
      {
        label: { fr: 'Crever l\'abcès', en: 'Clear the air' },
        out: [
          { w: 2, text: { fr: ["On a parlé franchement. {a.first} a avoué traverser une mauvaise passe. On s'est pris dans les bras, et {a:il|elle} m'a payé un verre. Le premier en trois ans.", "Discussion à cœur ouvert. {a.first} a admis être jaloux{a:|se}, et moi d'être un peu frimeur{|se}. Match nul, amitié sauvée."], en: ["We talked honestly. {a.first} admitted to going through a rough patch. We hugged, and {a:he|she} bought me a drink. The first in three years.", "Heart-to-heart. {a.first} admitted being jealous, and I admitted being a bit of a show-off. A draw, friendship saved."] }, fx: { rel: 12, happy: 4 } },
          { w: 1, text: { fr: ["{a.first} a nié en bloc, puis m'a reproché d'avoir « changé ». Je n'ai pas changé, j'ai juste une meilleure mutuelle. Froid polaire depuis.", "La conversation a viré au procès de mes défauts, avec liste numérotée. {a.first} l'avait préparée à l'avance. Ça fait peur."], en: ["{a.first} flat-out denied it, then accused me of having 'changed'. I didn't change, I just have better health insurance. Polar chill since.", "The conversation turned into a trial of my flaws, with a numbered list. {a.first} had prepared it in advance. Scary."] }, fx: { rel: -12, happy: -3 } },
        ],
      },
      { label: { fr: 'Minimiser mes succès', en: 'Downplay my wins' }, text: { fr: ["J'ai commencé à mentir à l'envers : je prétends que tout va mal. {a.first} est beaucoup plus gentil{a:|le}. Notre amitié repose sur ma fausse déprime.", "Je ne raconte plus rien de bien. Juste mes galères, parfois inventées. {a.first} est ravi{a:|e}. Moi, épuisé{|e}."], en: ["I started lying in reverse: I pretend everything's terrible. {a.first} is way nicer now. Our friendship rests on my fake depression.", "I don't share anything good anymore. Just my struggles, some invented. {a.first} is delighted. I'm exhausted."] }, fx: { rel: 6, stress: 6 } },
      { label: { fr: 'En rajouter des tonnes', en: 'Rub it in' }, text: { fr: ["J'ai doublé la frime : photos {w:far_place}, montre au poignet, coucher de soleil filtré. {a.first} m'a mis{|e} en sourdine. C'était le but.", "J'ai offert à {a.first} un livre intitulé « Gérer sa jalousie ». Emballé. Avec un nœud. {a:Il|Elle} me l'a renvoyé par la poste, déchiré."], en: ["I doubled down on showing off: photos {w:far_place}, wristwatch, filtered sunset. {a.first} muted me. That was the point.", "I gave {a.first} a book titled 'Managing Jealousy'. Gift-wrapped. With a bow. {a:He|She} mailed it back, torn up."] }, fx: { rel: -15, happy: 4, karma: -3 } },
    ],
  },
  {
    id: 'fr2_bail_call',
    icon: '🚔',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    vars: { amount: [500, 5000] },
    scene: { place: 'prison', mood: 'shock', prop: 'phone', fx: 'police' },
    when: { age: [18, 70] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "Appel en PCV du commissariat. {a.first} a été arrêté{a:|e} pour « {w:crime_small} » en état d'ébriété avancé. Caution : {$amount}. {a:Il|Elle} pleure dans le combiné.",
        "{a.first} t'appelle de garde à vue. {a:Il|Elle} a tenté de voler {w:animal} au zoo « pour le libérer ». Le juge réclame {$amount} de caution et tu es son seul contact.",
        "{w:swear} {a.first} est en cellule après une baston {w:at_place} qui a mal tourné. Le policier au bout du fil soupire : « {$amount}, ou {a:il|elle} dort ici. »",
        "Un message de {a.first} depuis un téléphone inconnu : « suis au poste, tout nu{a:|e}, longue histoire, {$amount} stp, dis rien à ma mère ».",
      ],
      en: [
        "Collect call from the police station. {a.first} got arrested for '{w:crime_small}' while extremely drunk. Bail: {$amount}. {a:He|She} is sobbing into the phone.",
        "{a.first} calls you from custody. {a:He|She} tried to steal {w:animal} from the zoo 'to free it'. The judge wants {$amount} bail and you're the only contact.",
        "{w:swear} {a.first} is in a cell after a brawl {w:at_place} that went south. The cop on the line sighs: '{$amount}, or {a:he|she} sleeps here.'",
        "A text from {a.first} from an unknown number: 'at the station, naked, long story, {$amount} pls, dont tell my mom'.",
      ],
    },
    choices: [
      { label: { fr: 'Payer la caution', en: 'Post bail' }, text: { fr: ["J'ai payé {$amount}. {a.first} est sorti{a:|e} en couverture de survie, a embrassé le sol et m'a juré une loyauté éternelle. Je garde le reçu au cas où l'éternité expire.", "Caution payée. Sur le parking, {a.first} m'a raconté toute l'histoire. Je regrette de l'avoir écoutée plus que d'avoir payé."], en: ["I paid {$amount}. {a.first} walked out wrapped in a space blanket, kissed the ground and swore eternal loyalty. I'm keeping the receipt in case eternity expires.", "Bail paid. In the parking lot, {a.first} told me the whole story. I regret listening more than paying."] }, fx: { money: '-amount', rel: 20, karma: 4 } },
      {
        label: { fr: 'Négocier avec les flics', en: 'Sweet-talk the cops' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: ["J'ai fait du charme au brigadier. Il a « perdu » le dossier et relâché {a.first} avec un avertissement. Il m'a aussi demandé mon numéro.", "J'ai sorti mon plus beau baratin. Le commissaire a ri, a déchiré le PV et nous a offert un café dégueulasse. Victoire totale."], en: ["I flirted with the desk sergeant. He 'lost' the file and released {a.first} with a warning. He also asked for my number.", "I rolled out my best smooth talk. The chief laughed, tore up the ticket and gave us terrible coffee. Total victory."] }, fx: { rel: 15, happy: 5 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai tenté d'amadouer les flics. J'ai dit un mot de trop. Je dors maintenant dans la cellule voisine de {a.first}. On se parle à travers le mur.", "Ma négociation s'est terminée en garde à vue pour « outrage ». {a.first} et moi, menottés côte à côte. Au moins, on est ensemble."], en: ["I tried to charm the cops. I said one word too many. Now I'm sleeping in the cell next to {a.first}. We talk through the wall.", "My negotiation ended in custody for 'contempt'. {a.first} and me, cuffed side by side. At least we're together."] }, fx: { rel: 8, heat: 10, happy: -6, visual: 'police' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Le/La laisser mariner', en: 'Let them stew' }, text: { fr: ["J'ai laissé {a.first} une nuit au frais. « Pour sa leçon. » {a:Il|Elle} est ressorti{a:|e} avec un nouveau tatouage fait au stylo et une rancune tenace.", "Pas un centime. {a.first} a dormi en cellule avec un type qui parlait à ses pieds. {a:Il|Elle} m'a envoyé une carte postale de la prison. Glaçante."], en: ["I let {a.first} spend a night in the cooler. 'To learn a lesson.' {a:He|She} came out with a new ballpoint-pen tattoo and a stubborn grudge.", "Not a cent. {a.first} slept in a cell with a guy who talks to his feet. {a:He|She} sent me a postcard from jail. Chilling."] }, fx: { rel: -20 } },
    ],
  },
  {
    id: 'fr2_intervention',
    icon: '🫂',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    scene: { place: 'home', mood: 'shock', prop: 'sofa' },
    when: { age: [16, 80] },
    weight: 6,
    cooldown: 10,
    text: {
      fr: [
        "Tu rentres chez toi : tous tes amis sont assis en cercle dans le salon. {a.first} se lève, une feuille à la main : « On est là parce qu'on t'aime. Le sujet : {w:hobby}. »",
        "Intervention surprise orchestrée par {a.first}. Motif officiel : ton obsession pour {w:show}. Il y a une banderole, des mouchoirs et un psychologue amateur.",
        "{a.first} a réuni le groupe pour « parler de ton problème ». Ton problème, selon eux : ton obsession pour {w:animal}. Il y a un PowerPoint.",
        "Tes potes t'attendent, mine grave. {a.first} lit une lettre en tremblant : « Depuis que tu passes tes nuits sur {w:app}, on ne te reconnaît plus. »",
      ],
      en: [
        "You come home: all your friends are sitting in a circle in your living room. {a.first} stands up, holding a sheet of paper: 'We're here because we love you. The topic: {w:hobby}.'",
        "Surprise intervention orchestrated by {a.first}. Official reason: your obsession with {w:show}. There's a banner, tissues and an amateur psychologist.",
        "{a.first} gathered the group to 'talk about your problem'. Your problem, according to them: your obsession with {w:animal}. There's a PowerPoint.",
        "Your friends are waiting, faces grim. {a.first} reads a letter, trembling: 'Ever since you started spending your nights on {w:app}, we don't recognize you.'",
      ],
    },
    choices: [
      { label: { fr: 'Fondre en larmes', en: 'Burst into tears' }, text: { fr: ["J'ai pleuré, ils ont pleuré, on s'est tous pris dans les bras. J'ai promis de me calmer. Je ne me calmerai pas. Mais c'était un beau moment.", "J'ai sangloté sur l'épaule de {a.first}. Je n'avais pas réalisé à quel point j'étais devenu{|e} pénible. Le groupe m'a offert des chips en signe de pardon."], en: ["I cried, they cried, we all hugged. I promised to tone it down. I won't. But it was a beautiful moment.", "I sobbed on {a.first}'s shoulder. I hadn't realized how annoying I'd become. The group gave me chips as a sign of forgiveness."] }, fx: { rel: 12, happy: 3, stress: -3 } },
      {
        label: { fr: 'Les convertir', en: 'Convert them' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai fait une contre-présentation passionnée. À la fin, la moitié du groupe était convertie. On a fondé un club. {a.first} en est le/la trésorier{a:|e}.", "J'ai répondu avec tant de passion que {a.first} m'a demandé des conseils pour débuter. L'intervention s'est transformée en atelier."], en: ["I gave a passionate counter-presentation. By the end, half the group was converted. We founded a club. {a.first} is treasurer.", "I answered with such passion that {a.first} asked me for beginner tips. The intervention turned into a workshop."] }, fx: { rel: 8, happy: 6, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai parlé pendant deux heures. Ils sont partis un par un. {a.first} est resté{a:|e} jusqu'au bout, par politesse, et s'est endormi{a:|e} sur le canapé.", "Mon plaidoyer a été si long que l'intervention a été officiellement déclarée « échec ». Le groupe a créé une conversation sans moi pour en parler."], en: ["I talked for two hours. They left one by one. {a.first} stayed till the end out of politeness and fell asleep on the couch.", "My plea was so long the intervention was officially declared 'a failure'. The group made a chat without me to discuss it."] }, fx: { rel: -6, happy: -2 } },
        ],
      },
      { label: { fr: 'Les mettre dehors', en: 'Throw them out' }, text: { fr: ["« Sortez de chez moi. » Ils sont sortis. {a.first} a laissé la banderole. Je l'ai accrochée dans ma chambre. Par provocation.", "Je les ai virés avec dignité. Puis j'ai passé la soirée seul{|e} avec ma passion, en me demandant s'ils n'avaient pas un peu raison."], en: ["'Get out of my house.' They got out. {a.first} left the banner. I hung it in my bedroom. Out of spite.", "I kicked them out with dignity. Then spent the evening alone with my passion, wondering if they had a point."] }, fx: { rel: -12, happy: -2 } },
    ],
  },
  {
    id: 'fr2_conspiracy_friend',
    icon: '🛸',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    scene: { place: 'park', mood: 'shock', prop: 'tinfoil' },
    when: { age: [16, 85] },
    weight: 7,
    cooldown: 7,
    text: {
      fr: [
        "{a.first} a passé l'été sur des forums. {a:Il|Elle} est désormais persuadé{a:|e} {w:conspiracy}. {a:Il|Elle} te tend une vidéo de quatre heures : « Regarde. Après, tu sauras. »",
        "Au dîner, {a.first} chuchote, en regardant les plafonniers : « Tu savais {w:conspiracy} ? » {a:Il|Elle} a un chapeau en papier alu. Dans son sac, il y a un deuxième chapeau. Pour toi.",
        "{a.first} ne vient plus aux soirées {w:excuse}. Ce soir, {a:il|elle} t'explique que {w:celeb} est un hologramme et que ton grille-pain t'écoute.",
        "Nouveau post de {a.first}, en majuscules : « RÉVEILLEZ-VOUS ». {a:Il|Elle} y affirme {w:conspiracy}. Tu es identifié{|e} comme « mouton potentiel à sauver ».",
      ],
      en: [
        "{a.first} spent the summer on forums. {a:He|She} is now convinced {w:conspiracy}. {a:He|She} hands you a four-hour video: 'Watch. Then you'll know.'",
        "At dinner, {a.first} whispers, eyeing the ceiling lights: 'Did you know {w:conspiracy}?' {a:He|She} is wearing a tinfoil hat. In {a:his|her} bag, there's a second hat. For you.",
        "{a.first} stopped coming to parties {w:excuse}. Tonight, {a:he|she} explains that {w:celeb} is a hologram and your toaster is listening.",
        "New post from {a.first}, all caps: 'WAKE UP'. {a:He|She} claims {w:conspiracy}. You're tagged as a 'potential sheep worth saving'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Débattre avec des faits', en: 'Debate with facts' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai sorti des sources, des graphiques et de la patience. Au bout de trois semaines, {a.first} a admis qu'{a:il|elle} s'était peut-être un peu emballé{a:|e}. Le chapeau est au placard.", "Débat calme, arguments solides. {a.first} a fini par rire de lui-même/d'elle-même. On a brûlé le chapeau alu au barbecue, en cérémonie."], en: ["I pulled out sources, charts and patience. After three weeks, {a.first} admitted {a:he|she} might have gotten carried away. The hat is in the closet.", "Calm debate, solid arguments. {a.first} ended up laughing at {a:himself|herself}. We ceremonially burned the tinfoil hat on the barbecue."] }, fx: { rel: 10, smarts: 3, karma: 3 }, mood: 'proud' },
          { w: 2, text: { fr: ["Chaque fait que je donnais était « exactement ce qu'ils veulent que tu croies ». J'ai perdu le débat contre quelqu'un qui pense que les pigeons sont des drones.", "{a.first} a conclu que j'étais « payé{|e} par eux ». J'aimerais bien, au moins je serais payé{|e} pour ce débat."], en: ["Every fact I gave was 'exactly what they want you to believe'. I lost a debate to someone who thinks pigeons are drones.", "{a.first} concluded I'm 'paid by them'. I wish; at least I'd get paid for this debate."] }, fx: { rel: -6, stress: 6 } },
        ],
      },
      { label: { fr: 'Mettre le chapeau', en: 'Put on the hat' }, text: { fr: ["J'ai mis le chapeau, pour lui faire plaisir. On a passé une soirée géniale à guetter des satellites. Je crois que j'ai vu un drone. C'était un pigeon. Ou pas.", "J'ai joué le jeu et porté le chapeau alu toute la soirée. Les voisins ont pris des photos. {a.first} m'a dit que j'étais « l'un{|e} des rares éveillé{|e}s »."], en: ["I wore the hat to make {a:him|her} happy. We had a great evening watching for satellites. I think I saw a drone. It was a pigeon. Or was it.", "I played along and wore the tinfoil hat all evening. The neighbors took pictures. {a.first} said I'm 'one of the few who are awake'."] }, fx: { rel: 10, smarts: -2, happy: 3 } },
      { label: { fr: 'Prendre ses distances', en: 'Keep my distance' }, text: { fr: ["J'ai espacé les verres, puis les messages. {a.first} m'a envoyé un dernier lien : « Tu verras. » Je n'ai pas cliqué. Je ne verrai donc jamais.", "J'ai mis {a.first} en sourdine. Parfois, je jette un œil. Hier, {a:il|elle} expliquait que la pluie était « une opinion »."], en: ["I spaced out the drinks, then the messages. {a.first} sent one last link: 'You'll see.' I didn't click. So I'll never see.", "I muted {a.first}. Sometimes I peek. Yesterday {a:he|she} was explaining that rain is 'an opinion'."] }, fx: { rel: -10, stress: -2 } },
    ],
  },
  {
    id: 'fr2_couch_squatter',
    icon: '🛋️',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'apartment', mood: 'angry', prop: 'sofa' },
    when: { age: [20, 70], movedOut: true },
    weight: 7,
    cooldown: 8,
    text: {
      fr: [
        "{a.first} s'est fait larguer et dort sur ton canapé « deux ou trois jours ». Ça fait quatre mois. {a:Il|Elle} a reçu du courrier à ton adresse. Et {w:animal}, livré ce matin.",
        "Le séjour « temporaire » de {a.first} sur ton canapé entre dans sa deuxième saison. {a:Il|Elle} a changé ton mot de passe Wi-Fi et appelle ton frigo « mon frigo ».",
        "{a.first} squatte chez toi depuis son divorce. Ce matin, tu l'as trouvé{a:|e} en caleçon dans ton lit, avec ton peignoir, en train de manger {w:food}.",
        "Ça fait des semaines que {a.first} vit sur ton canapé. Aujourd'hui, {a:il|elle} a ramené quelqu'un rencontré{a:|e} {w:at_place}. Tu as entendu. Tout entendu.",
      ],
      en: [
        "{a.first} got dumped and is crashing on your couch 'two or three days'. It's been four months. {a:He|She} gets mail at your address. And {w:animal}, delivered this morning.",
        "{a.first}'s 'temporary' stay on your couch is entering season two. {a:He|She} changed your Wi-Fi password and calls your fridge 'my fridge'.",
        "{a.first} has been crashing at your place since the divorce. This morning you found {a:him|her} in your bed, in your bathrobe, eating {w:food}.",
        "{a.first} has lived on your couch for weeks. Today, {a:he|she} brought home someone met {w:at_place}. You heard. You heard everything.",
      ],
    },
    choices: [
      {
        label: { fr: 'Fixer une date limite', en: 'Set a deadline' },
        out: [
          { w: 2, text: { fr: ["J'ai fixé un ultimatum : un mois. {a.first} a trouvé un appart en trois semaines. {a:Il|Elle} m'a laissé un mot : « Merci pour tout. » Et ses chaussettes.", "Date limite posée. {a.first} a fait la tête deux jours, puis a déménagé en me remerciant. Mon canapé a retrouvé sa forme. Pas son odeur."], en: ["I set an ultimatum: one month. {a.first} found a place in three weeks. {a:He|She} left a note: 'Thanks for everything.' And socks.", "Deadline set. {a.first} sulked for two days, then moved out thanking me. My couch got its shape back. Not its smell."] }, fx: { rel: 4, happy: 6, stress: -6 } },
          { w: 1, text: { fr: ["{a.first} a fait semblant de ne pas comprendre. La date est passée. {a:Il|Elle} a accroché un poster au-dessus du canapé. Je crois que c'est chez {a:lui|elle}, maintenant.", "Ultimatum ignoré. {a.first} m'a demandé si je pouvais « dormir ailleurs ce week-end, pour son date ». Chez moi."], en: ["{a.first} pretended not to understand. The deadline passed. {a:He|She} hung a poster above the couch. I think this is {a:his|her} place now.", "Ultimatum ignored. {a.first} asked if I could 'sleep somewhere else this weekend, for a date'. At my place."] }, fx: { stress: 10, happy: -5 } },
        ],
      },
      { label: { fr: 'Lui faire payer un loyer', en: 'Charge rent' }, text: { fr: ["J'ai exigé un loyer. {a.first} paie en nature : ménage, cuisine, et massages de pieds non sollicités. J'ai un{|e} colocataire bizarre, mais propre.", "Je lui ai fait signer un bail pour le canapé. 200 balles par mois. Le meilleur investissement immobilier de ma vie."], en: ["I demanded rent. {a.first} pays in kind: cleaning, cooking, and unsolicited foot rubs. I have a weird roommate, but a clean one.", "I made {a:him|her} sign a lease for the couch. 200 bucks a month. The best real estate investment of my life."] }, fx: { money: 400, rel: -3, happy: 3 } },
      { label: { fr: 'Changer les serrures', en: 'Change the locks' }, rating: 1, text: { fr: ["J'ai changé les serrures pendant qu'{a:il|elle} était sous la douche. Ses affaires sont sur le palier. {a.first} a dormi dans le hall et m'a maudit{|e} jusqu'à la troisième génération.", "Serrures changées. {a.first} a sonné pendant trois heures, puis a hurlé {w:insult} dans l'interphone. Les voisins applaudissaient."], en: ["I changed the locks while {a:he|she} was in the shower. {a:His|Her} stuff is on the landing. {a.first} slept in the lobby and cursed me to the third generation.", "Locks changed. {a.first} rang for three hours, then yelled '{w:insult}' into the intercom. The neighbors applauded."] }, fx: { rel: -30, stress: -8, karma: -4 } },
    ],
  },
  {
    id: 'fr2_car_returned',
    icon: '🚗',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'home', mood: 'angry', prop: 'car', fx: 'poop' },
    when: { age: [18, 75], asset: 'car' },
    weight: 6,
    cooldown: 8,
    text: {
      fr: [
        "{a.first} te rend ta voiture après le week-end. Elle sent {w:smell}. Sur la banquette arrière : {w:object}, une culotte qui n'appartient à personne que tu connais, et {w:gross}.",
        "Ta voiture revient de chez {a.first} avec 900 km de plus, un rétro en moins et des taches suspectes au plafond. Au plafond. {w:swear}",
        "{a.first} t'a emprunté la voiture « pour un déménagement ». Tu retrouves dans le coffre {w:animal}, une pelle et une bâche. {a:Il|Elle} dit que c'est « pas ce que tu crois ».",
        "{a.first} rend tes clés en évitant ton regard. La voiture a une nouvelle bosse, une contravention sur le pare-brise, et la banquette est poisseuse. « J'ai eu un date », dit-{a:il|elle}.",
      ],
      en: [
        "{a.first} returns your car after the weekend. It smells of {w:smell}. In the back seat: {w:object}, underwear belonging to nobody you know, and {w:gross}.",
        "Your car comes back from {a.first}'s with 600 more miles, one less mirror and suspicious stains on the ceiling. The CEILING. {w:swear}",
        "{a.first} borrowed your car 'for a move'. In the trunk you find {w:animal}, a shovel and a tarp. {a:He|She} says it's 'not what you think'.",
        "{a.first} hands back your keys avoiding eye contact. The car has a new dent, a ticket on the windshield, and the back seat is sticky. 'I had a date,' {a:he|she} says.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exiger un nettoyage', en: 'Demand a deep clean' },
        out: [
          { w: 2, text: { fr: ["{a.first} a payé un nettoyage complet. Le laveur a mis une combinaison intégrale et m'a regardé{|e} avec pitié. La voiture est propre. Mon âme, non.", "{a.first} a tout nettoyé {a:lui|elle}-même, avec une brosse à dents. La mienne, j'ai découvert après."], en: ["{a.first} paid for a full detail. The cleaner put on a hazmat suit and looked at me with pity. The car is clean. My soul isn't.", "{a.first} cleaned everything personally, with a toothbrush. Mine, I found out later."] }, fx: { rel: -3, happy: 2 } },
          { w: 1, text: { fr: ["{a.first} a « oublié ». Je roule avec l'odeur depuis un mois. Au feu rouge, les gens ferment leurs fenêtres.", "{a.first} m'a filé 20 balles et un sapin désodorisant. Le sapin s'est suicidé au bout de deux jours."], en: ["{a.first} 'forgot'. I've been driving with the smell for a month. At red lights, people roll up their windows.", "{a.first} gave me 20 bucks and an air freshener. The air freshener died of despair after two days."] }, fx: { rel: -10, happy: -5 } },
        ],
      },
      { label: { fr: 'Ne pas poser de questions', en: "Don't ask questions" }, text: { fr: ["Je n'ai rien demandé. J'ai fait brûler de la sauge dans l'habitacle et j'ai continué ma vie. Certaines vérités ne valent pas d'être connues.", "Pas de questions. Ni pour la pelle, ni pour la bâche. Si la police m'interroge un jour, je n'aurai pas à mentir."], en: ["I asked nothing. Burned sage inside the car and moved on with my life. Some truths aren't worth knowing.", "No questions. Not about the shovel, not about the tarp. If the police ever ask, I won't have to lie."] }, fx: { rel: 4, stress: 4 } },
      { label: { fr: 'Lui emprunter la sienne', en: 'Borrow theirs back' }, text: { fr: ["Vengeance symétrique : j'ai emprunté la voiture de {a.first} et je l'ai rendue avec un fromage de chèvre caché sous le siège. En plein mois d'août.", "J'ai pris sa voiture pour une semaine de camping avec trois chiens mouillés. Œil pour œil, poil pour poil."], en: ["Symmetrical revenge: I borrowed {a.first}'s car and returned it with a goat cheese hidden under the seat. In August.", "I took {a:his|her} car for a week of camping with three wet dogs. An eye for an eye, a hair for a hair."] }, fx: { happy: 6, rel: -8, karma: -2 } },
    ],
  },
  {
    id: 'fr2_pet_sitting',
    icon: '🐾',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    scene: { place: 'home', mood: 'shock', prop: 'pet' },
    when: { age: [12, 85] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: [
        "{a.first} part {w:far_place} et te confie son animal : {w:animal}. La liste des consignes fait onze pages. Page 7 : « ne jamais le regarder dans les yeux après 22 h ».",
        "Tu gardes {w:animal} de {a.first} pour le week-end. Au bout d'une heure, la bête a mangé {w:object} et te fixe comme si tu étais le prochain.",
        "{a.first} te confie son compagnon adoré, {w:animal}, pendant ses vacances. Il ne mange que {w:food}, tiède, servi à la petite cuillère, en lui chantant {w:song}.",
        "{a.first} t'appelle tous les jours pendant que tu gardes son {w:animal}. Visio obligatoire, pour lui dire bonne nuit. Ce soir, la bête est introuvable.",
      ],
      en: [
        "{a.first} is going {w:far_place} and leaves you the pet: {w:animal}. The instructions run eleven pages. Page 7: 'never look it in the eye after 10 p.m.'",
        "You're watching {a.first}'s {w:animal} for the weekend. Within an hour, the beast has eaten {w:object} and stares at you like you're next.",
        "{a.first} leaves you {a:his|her} beloved companion, {w:animal}, during vacation. It only eats {w:food}, lukewarm, spoon-fed, while you sing {w:song}.",
        "{a.first} calls daily while you pet-sit {w:animal}. Mandatory video call, to say good night. Tonight, the creature is nowhere to be found.",
      ],
    },
    choices: [
      {
        label: { fr: 'Suivre les consignes', en: 'Follow the instructions' },
        out: [
          { w: 2, text: { fr: ["J'ai suivi les onze pages. La bête et moi sommes devenus inséparables. {a.first} est jaloux{a:|se} : son animal pleure quand je pars.", "Tout s'est bien passé. J'ai même appris un tour à la bestiole. {a.first} m'a ramené {w:gift} de voyage pour me remercier."], en: ["I followed all eleven pages. The beast and I are now inseparable. {a.first} is jealous: the pet cries when I leave.", "All went well. I even taught the critter a trick. {a.first} brought me back {w:gift} as thanks."] }, fx: { rel: 10, happy: 5 } },
          { w: 1, text: { fr: ["Malgré les consignes, la bestiole a fait ses besoins dans mon lit, ma chaussure et mon sac de sport. Dans cet ordre. {a.first} dit qu'« il ne fait jamais ça ».", "Il s'est enfui par la fenêtre. Je l'ai retrouvé trois heures après chez le voisin, en train de manger son dîner. Le voisin aussi était surpris."], en: ["Despite the instructions, the critter relieved itself in my bed, my shoe and my gym bag. In that order. {a.first} says 'it never does that'.", "It escaped through the window. I found it three hours later at the neighbor's, eating his dinner. The neighbor was surprised too."] }, fx: { happy: -5, stress: 5, rel: 3 } },
        ],
      },
      { label: { fr: 'Improviser', en: 'Wing it' }, text: { fr: ["J'ai ignoré les consignes et donné des chips à la bête. Elle a adoré. Elle a pris trois kilos. {a.first} m'a demandé si je l'avais « gonflé ».", "J'ai fait à ma sauce : canapé, télé, pizza partagée. L'animal ne veut plus rentrer chez {a.first}. Je suis l'oncle cool."], en: ["I ignored the instructions and fed the beast chips. It loved them. It gained six pounds. {a.first} asked if I'd 'inflated' it.", "I did it my way: couch, TV, shared pizza. The pet doesn't want to go back to {a.first}'s. I'm the cool uncle."] }, fx: { happy: 4, rel: -4 } },
      { label: { fr: 'Le confier à ma mère', en: 'Pass it to my mom' }, text: { fr: ["J'ai sous-traité à ma mère. Elle l'a baptisé « Bichon », l'a habillé en marin et refuse de le rendre. {a.first} est furieux{a:|se}.", "J'ai refilé la bête à ma mère, qui l'a emmenée à la messe. Il paraît qu'il a aboyé pendant le sermon. {a.first} n'a rien su. Pour l'instant."], en: ["I outsourced to my mom. She named it 'Snookums', dressed it as a sailor and refuses to give it back. {a.first} is furious.", "I passed the beast to my mom, who took it to church. Apparently it barked during the sermon. {a.first} never found out. Yet."] }, fx: { rel: -6, happy: 2 } },
    ],
  },
  {
    id: 'fr2_moving_day',
    icon: '📦',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    scene: { place: 'apartment', mood: 'sleepy', prop: 'boxes' },
    when: { age: [18, 70] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: [
        "{a.first} déménage. Sixième étage sans ascenseur. Paiement prévu : une pizza pour huit. Dans les cartons : {w:object}, un piano droit et, pour une raison inconnue, {w:food}.",
        "« Ce sera rapide, j'ai pas grand-chose », jurait {a.first}. Tu arrives : 74 cartons, un frigo américain et {w:animal} qui refuse de bouger.",
        "Déménagement de {a.first} {w:weather}. Le camion loué n'a plus de freins. Le canapé ne passe pas la porte. Ton dos craque déjà.",
        "{a.first} t'a promis « juste quelques cartons ». En réalité, {a:il|elle} n'a rien emballé. Tout est en vrac, et le camion repart dans deux heures.",
      ],
      en: [
        "{a.first} is moving. Sixth floor, no elevator. Payment: one pizza for eight people. In the boxes: {w:object}, an upright piano and, for unknown reasons, {w:food}.",
        "'It'll be quick, I don't have much stuff,' swore {a.first}. You arrive: 74 boxes, a giant fridge and {w:animal} that refuses to move.",
        "{a.first}'s moving day {w:weather}. The rental truck has no brakes. The couch won't fit through the door. Your back is already cracking.",
        "{a.first} promised 'just a few boxes'. In reality, nothing is packed. It's all loose, and the truck leaves in two hours.",
      ],
    },
    choices: [
      {
        label: { fr: 'Porter le piano', en: 'Carry the piano' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: ["J'ai porté le piano sur mon dos comme un Hercule de banlieue. {a.first} a filmé, le voisin a applaudi, mon dos a déposé plainte.", "Piano monté en douze minutes chrono. Je suis devenu{|e} une légende du déménagement. On m'appelle désormais pour tous les cartons du quartier."], en: ["I carried the piano on my back like a suburban Hercules. {a.first} filmed, the neighbor applauded, my back filed a complaint.", "Piano upstairs in twelve minutes flat. I'm now a moving-day legend. Everyone in the neighborhood calls me for their boxes."] }, fx: { athletic: 4, rel: 12, health: -2 }, mood: 'proud' },
          { w: 1, text: { fr: ["Le piano m'a échappé au quatrième étage. Il a dévalé l'escalier en jouant tout seul un accord de fin du monde. Je me suis froissé {w:bodypart}.", "J'ai soulevé le piano, mon dos a fait « crac ». Trois semaines de kiné. {a.first} m'a envoyé une part de pizza froide en guise d'excuse."], en: ["The piano slipped on the fourth floor. It tumbled down the stairs playing an apocalyptic chord by itself. I strained my {w:bodypart}.", "I lifted the piano, my back went 'crack'. Three weeks of physical therapy. {a.first} sent me a slice of cold pizza as an apology."] }, fx: { health: -10, disease: 'back_pain', rel: 6 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Gérer la logistique', en: 'Run logistics' }, text: { fr: ["J'ai pris le commandement : étiquettes, plan de chargement, chaîne humaine. Fini en trois heures. {a.first} m'a nommé{|e} « général{|e} des cartons ».", "Je me suis autoproclamé{|e} chef de chantier et je n'ai rien porté. J'ai beaucoup pointé du doigt. Ça marche étonnamment bien."], en: ["I took command: labels, loading plan, human chain. Done in three hours. {a.first} named me 'General of the Boxes'.", "I appointed myself site foreman and carried nothing. I pointed a lot. It works surprisingly well."] }, fx: { rel: 8, smarts: 2 } },
      { label: { fr: 'Prétexter une urgence', en: 'Fake an emergency' }, text: { fr: ["J'ai prétendu avoir une urgence familiale. {a.first} a vu ma story trois heures plus tard : moi, {w:at_place}, en train de bronzer. Très mauvaise idée.", "J'ai inventé une gastro. {a.first} m'a apporté de la soupe le lendemain. Je n'ai jamais eu aussi honte de ma vie."], en: ["I claimed a family emergency. {a.first} saw my story three hours later: me, {w:at_place}, tanning. Very bad idea.", "I faked food poisoning. {a.first} brought me soup the next day. I've never been so ashamed in my life."] }, fx: { rel: -12, karma: -3 } },
    ],
  },
  {
    id: 'fr2_podcast',
    icon: '🎙️',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    scene: { place: 'studio', mood: 'neutral', prop: 'microphone' },
    when: { age: [16, 70] },
    weight: 7,
    cooldown: 6,
    text: {
      fr: [
        "{a.first} lance son podcast : trois heures par épisode sur {w:hobby}. Tu es son seul auditeur. {a:Il|Elle} le sait, parce que les statistiques affichent « 1 ».",
        "{a.first} t'invite dans son podcast pour parler de « l'amitié ». Le micro est un vieux casque de jeu vidéo. Le studio, c'est sa baignoire.",
        "Nouvel épisode du podcast de {a.first}, intitulé « Pourquoi mes amis me déçoivent ». Tu l'écoutes. Le chapitre 3 parle de toi. Nommément.",
        "{a.first} veut que vous lanciez un podcast ensemble sur {w:show}. Nom proposé : « [[Les Bavards|Deux Cerveaux, Zéro Neurone|Micro Ouvert]] ». Tu as déjà mal à la tête.",
      ],
      en: [
        "{a.first} launched a podcast: three hours per episode about {w:hobby}. You're the only listener. {a:He|She} knows, because the stats say '1'.",
        "{a.first} invites you onto the podcast to talk about 'friendship'. The mic is an old gaming headset. The studio is {a:his|her} bathtub.",
        "New episode of {a.first}'s podcast, titled 'Why My Friends Disappoint Me'. You listen. Chapter 3 is about you. By name.",
        "{a.first} wants to launch a podcast with you about {w:show}. Proposed name: '[[The Chatterboxes|Two Brains, Zero Neurons|Open Mic]]'. Your head already hurts.",
      ],
    },
    choices: [
      {
        label: { fr: 'Participer à fond', en: 'Go all in' },
        out: [
          { w: 1, text: { fr: ["Notre épisode a explosé. 80 000 écoutes, un sponsor de matelas, et un public qui nous appelle « le duo infernal ». {a.first} pleure de joie à chaque notification.", "On a enregistré un épisode légendaire où je raconte comment je me suis cassé {w:bodypart}. Il est devenu viral. Les gens nous arrêtent dans la rue."], en: ["Our episode blew up. 80,000 listens, a mattress sponsor, and an audience calling us 'the dynamic duo'. {a.first} cries with joy at every notification.", "We recorded a legendary episode where I tell how I broke my {w:bodypart}. It went viral. People stop us in the street."] }, fx: { rel: 12, fame: 3, money: 500, happy: 6 }, mood: 'proud' },
          { w: 2, text: { fr: ["On a enregistré quatorze épisodes. Total : 23 écoutes, dont 19 de nos mères. Mais on s'est bien marrés, et c'est l'essentiel.", "Le podcast a eu deux auditeurs : moi et un bot. {a.first} a quand même acheté un micro à 400 balles. On est fiers de nos 0,00 € de revenus."], en: ["We recorded fourteen episodes. Total: 23 listens, 19 of them from our moms. But we had a blast, and that's what matters.", "The podcast had two listeners: me and a bot. {a.first} still bought a $400 mic. We're proud of our $0.00 revenue."] }, fx: { rel: 8, happy: 3 } },
        ],
      },
      { label: { fr: 'Laisser une note 5 étoiles', en: 'Leave a 5-star review' }, text: { fr: ["J'ai laissé cinq étoiles et un commentaire élogieux sous un faux nom. {a.first} l'a lu à voix haute dans l'épisode suivant, ému{a:|e} aux larmes.", "Je n'écoute pas, mais je laisse un avis cinq étoiles chaque semaine. {a.first} pense avoir une fan base. C'est moi, avec quatorze comptes."], en: ["I left five stars and a glowing review under a fake name. {a.first} read it aloud on the next episode, moved to tears.", "I don't listen, but I leave a five-star review every week. {a.first} thinks there's a fan base. It's me, with fourteen accounts."] }, fx: { rel: 8, karma: 2 } },
      { label: { fr: 'Critiquer honnêtement', en: 'Give honest feedback' }, text: { fr: ["Je lui ai dit que trois heures sur ce sujet, c'était long. {a.first} a fait un épisode entier pour me répondre. Quatre heures.", "J'ai suggéré de couper les silences. {a.first} a coupé les silences, et moi de sa liste d'amis."], en: ["I told {a:him|her} three hours on that subject was a lot. {a.first} made an entire episode replying to me. Four hours.", "I suggested cutting the silences. {a.first} cut the silences, and me from {a:his|her} friend list."] }, fx: { rel: -8, smarts: 1 } },
    ],
  },
];
