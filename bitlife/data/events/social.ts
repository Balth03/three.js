// Social events: friendships, frenemies, enemies, siblings, parties, reunions, group chats.
import type { EventDef } from '@bl/sim';

export const socialEvents: EventDef[] = [
  // ───────────────────────────── feed-only lines ─────────────────────────────
  {
    id: 'so_groupchat_mute_auto',
    icon: '🔕',
    cat: 'social',
    rating: 0,
    auto: true,
    cooldown: 4,
    weight: 8,
    when: { age: [18, 70] },
    text: {
      fr: ["J'ai rouvert le groupe « Les Bros du Lycée » après trois semaines en sourdine : 847 messages non lus. J'ai tout marqué comme lu et répondu « mdr ». Personne n'a vu la différence.", "Quelqu'un a renommé notre groupe d'amis « Projet Barbecue 2019 ». Le barbecue n'a jamais eu lieu. Le groupe, lui, ne mourra jamais.", "Dans le groupe de la famille, mon oncle a partagé une vidéo affirmant {w:conspiracy}. Vingt-trois réponses. Ma tante a juste écrit « {w:exclaim} ».", "Le groupe « Anciens de la promo » s'est réveillé après deux ans pour une seule question : qui a gardé {w:object} de la soirée de 2016 ? Silence radio. Le groupe s'est rendormi.", "Quelqu'un a proposé un week-end {w:far_place} dans le groupe. [[43|86|112]] messages pour fixer une date. Conclusion : un apéro {w:at_place}, un mardi, sans moi."],
      en: ["I unmuted the 'High School Bros' group chat after three weeks: 847 unread messages. I marked them all as read and replied 'lmao'. Nobody noticed.", "Someone renamed our friend group chat 'BBQ Project 2019'. The barbecue never happened. The chat will never die.", "In the family group chat, my uncle shared a video claiming {w:conspiracy}. Twenty-three replies. My aunt just wrote '{w:exclaim}'.", "The 'Class Alumni' group chat woke up after two years for a single question: who kept {w:object} from that 2016 party? Radio silence. The chat went back to sleep.", "Someone in the group chat suggested a weekend {w:far_place}. [[43|86|112]] messages to pick a date. Outcome: drinks {w:at_place}, on a Tuesday, without me."],
    },
    fx: { happy: 1 },
  },
  {
    id: 'so_forgot_bday_auto',
    icon: '🎂',
    cat: 'social',
    rating: 0,
    auto: true,
    cooldown: 3,
    actor: 'anyFriend',
    when: { age: [16, 80] },
    text: {
      fr: ["J'ai oublié l'anniversaire de {a.first}. Je lui ai souhaité trois jours plus tard avec un GIF de chaton qui s'excuse. {a:Il|Elle} a répondu « ok ». Juste « ok ». Avec un point.", "J'ai souhaité un joyeux anniversaire à {a.first} le mauvais jour. Avec un mois d'avance. {a:Il|Elle} a trouvé ça « attentionné mais inquiétant ».", "Pour me faire pardonner d'avoir oublié l'anniversaire de {a.first}, je lui ai offert {w:gift}. {a:Il|Elle} m'a regardé{|e} très longtemps. J'aurais dû ne rien offrir.", "J'ai oublié l'anniversaire de {a.first}. Je me suis justifié{|e} : « J'étais occupé{|e} à {w:activity}. » {a:Il|Elle} a fait une capture d'écran pour le groupe. [[47|112|300]] réactions.", "Facebook m'a rappelé l'anniversaire de {a.first} pendant que je regardais {w:show}. J'ai écrit « JOYEUX ANNIV » avec [[trois|onze|vingt]] émojis gâteau. Facebook avait deux semaines de retard. Moi aussi, du coup."],
      en: ["I forgot {a.first}'s birthday. I wished {a.him} a happy one three days late with a GIF of an apologizing kitten. {a:He|She} replied 'ok.' Just 'ok.' With a period.", "I wished {a.first} a happy birthday on the wrong day. A month early. {a:He|She} called it 'thoughtful but worrying'.", "To make up for forgetting {a.first}'s birthday, I gave {a.him} {w:gift}. {a:He|She} stared at me for a very long time. I should have given nothing.", "I forgot {a.first}'s birthday. My defense: 'I was busy {w:activity}.' {a:He|She} screenshotted it for the group chat. [[47|112|300]] reactions.", "Facebook reminded me of {a.first}'s birthday while I was watching {w:show}. I wrote 'HAPPY BDAY' with [[three|eleven|twenty]] cake emojis. Facebook was two weeks late. So was I, then."],
    },
    fx: { rel: -6, happy: -1 },
  },
  {
    id: 'so_kid_recess_friend_auto',
    icon: '🤝',
    cat: 'friends',
    rating: 0,
    auto: true,
    once: true,
    weight: 8,
    when: { age: [6, 11], school: 'primary' },
    text: {
      fr: [
        "À la récré, j'ai échangé une carte Pokémon brillante contre une amitié éternelle. Mon nouveau meilleur pote mange de la colle, mais personne n'est parfait.",
        "Un enfant m'a demandé si je voulais être son ami. J'ai dit oui. Ça m'a pris quatre secondes. Les adultes devraient prendre exemple.",
      ],
      en: [
        "At recess, I traded a shiny Pokémon card for eternal friendship. My new best buddy eats glue, but nobody's perfect.",
        "A kid asked if I wanted to be friends. I said yes. It took four seconds. Adults should take notes.",
      ],
    },
    fx: { happy: 5, newNpc: { role: 'friend', age: [-1, 1] }, counter: 'so_friends_made' },
  },
  {
    id: 'so_teen_bracelet_auto',
    icon: '📿',
    cat: 'friends',
    rating: 0,
    auto: true,
    once: true,
    actor: 'anyFriend',
    when: { age: [12, 17] },
    text: {
      fr: ["{a.first} et moi avons des bracelets d'amitié assortis. Le mien a déteint en vert sur mon poignet. C'est ça, l'amitié : une tache indélébile.", "{a.first} et moi avons inventé une poignée de main secrète en 14 étapes. Il nous faut 40 secondes pour nous dire bonjour. Ça vaut le coup.", "{a.first} et moi avons un code secret : quand l'un de nous dit « {w:food} », ça veut dire « sauve-moi de cette conversation ». On l'utilise surtout avec nos parents.", "{a.first} et moi avons juré d'être amis pour toujours, la main sur {w:object}. C'est moins solennel que sur la Bible, mais plus drôle.", "{a.first} et moi avons passé la nuit à regarder {w:movie} en mangeant {w:food}. On a ri tellement fort que les voisins ont tapé au mur. Meilleure nuit de l'année."],
      en: ["{a.first} and I have matching friendship bracelets. Mine stained my wrist green. That's friendship: a permanent mark.", "{a.first} and I invented a 14-step secret handshake. It takes us 40 seconds to say hi. Worth it.", "{a.first} and I have a secret code: when one of us says '{w:food}', it means 'get me out of this conversation'. We mostly use it on our parents.", "{a.first} and I swore to be friends forever, hand on {w:object}. Less solemn than a Bible, but funnier.", "{a.first} and I spent the night watching {w:movie} and eating {w:food}. We laughed so hard the neighbors banged on the wall. Best night of the year."],
    },
    fx: { happy: 4, rel: 10 },
  },
  {
    id: 'so_ghosted_auto',
    icon: '👻',
    cat: 'friends',
    rating: 1,
    auto: true,
    cooldown: 8,
    weight: 4,
    actor: { role: 'anyFriend', maxRel: 45 },
    when: { age: [18, 70] },
    text: {
      fr: [
        "{a.first} ne répond plus à mes messages depuis quatre mois. Je vois pourtant ses stories de brunch tous les dimanches. J'ai compris : je me suis fait ghoster. Bordel, même pas un « vu ».",
        "{a.first} a quitté tous nos groupes en commun et m'a bloqué{|e} partout, y compris sur LinkedIn. Je ne sais toujours pas ce que j'ai fait. Probablement exister.",
      ],
      en: [
        "{a.first} hasn't answered my texts in four months. Yet I see {a.his} brunch stories every Sunday. Got it: I've been ghosted. Damn, not even a 'seen'.",
        "{a.first} left every group chat we shared and blocked me everywhere, including LinkedIn. I still don't know what I did. Probably existed.",
      ],
    },
    fx: { happy: -5, actorGone: true, visual: 'ghost' },
  },
  {
    id: 'so_drunk_text_auto',
    icon: '🍷',
    cat: 'social',
    rating: 1,
    auto: true,
    cooldown: 4,
    when: { age: [18, 65] },
    text: {
      fr: ["Bourré{|e} à 3 h du matin, j'ai envoyé « je vous aime tous putain » à l'intégralité de mes contacts. Mon dentiste a répondu « moi aussi ». C'est gênant à chaque détartrage.", "J'ai écrit un vocal de 11 minutes à mes potes après six mojitos. Je l'ai réécouté le lendemain. J'y pleure sur un pigeon. Personne n'en parle, et c'est pire.", "Après {w:drink} et beaucoup de regrets, j'ai envoyé un vocal à mon ex où je chante {w:song}. En entier. Il y a eu un « vu ». Puis rien. Pour toujours.", "Bourré{|e}, j'ai écrit « {w:swear} je t'ai toujours admiré » à mon ancien prof de maths. Il a répondu « Qui est-ce ? ». J'ai répondu « ton pire cauchemar ». Je ne bois plus le mardi.", "J'ai retrouvé dans mon téléphone un SMS envoyé à [[4 h 12|3 h 47|5 h 01]] à mon patron : « tu as {w:bodypart} d'un dieu grec ». Ni lui ni moi n'en avons parlé. Il me sourit trop."],
      en: ["Drunk at 3 a.m., I texted 'I fucking love you all' to every single contact. My dentist replied 'me too'. Cleanings are awkward now.", "I sent my friends an 11-minute voice memo after six mojitos. I listened to it the next morning. I'm crying about a pigeon in it. Nobody mentions it, which is worse.", "After {w:drink} and a lot of regret, I sent my ex a voice memo of me singing {w:song}. All of it. Marked 'seen'. Then nothing. Forever.", "Drunk, I texted my old math teacher '{w:swear} I always looked up to you'. He replied 'Who is this?'. I answered 'your worst nightmare'. I don't drink on Tuesdays anymore.", "I found a text on my phone sent at [[4:12|3:47|5:01]] a.m. to my boss: 'you have the {w:bodypart} of a Greek god'. Neither of us has brought it up. He smiles at me too much."],
    },
    fx: { happy: -2, stress: 3 },
  },
  {
    id: 'so_enemy_auto',
    icon: '🐟',
    cat: 'enemies',
    rating: 2,
    auto: true,
    cooldown: 3,
    actor: 'enemy',
    when: { age: [18, 80] },
    text: {
      fr: [
        "J'ai retrouvé un maquereau cru glissé dans ma boîte aux lettres, avec un mot : « Bises, {a.first} ». Le facteur a vomi sur mon paillasson. Ma vendetta continue.",
        "{a.first} a laissé une crotte humaine, une vraie, dans le coffre de ma voiture. Avec un ruban. J'ai respecté le niveau d'engagement, puis j'ai pleuré en la jetant.",
      ],
      en: [
        "I found a raw mackerel stuffed in my mailbox, with a note: 'XOXO, {a.first}'. The mailman threw up on my doormat. The vendetta continues.",
        "{a.first} left a human turd, a real one, in the trunk of my car. With a ribbon. I respected the commitment, then cried while throwing it out.",
      ],
    },
    fx: { happy: -5, stress: 4, rel: -5, visual: 'poop' },
  },
  {
    id: 'so_brunch_vomit_auto',
    icon: '🥂',
    cat: 'social',
    rating: 2,
    auto: true,
    cooldown: 4,
    when: { age: [21, 60] },
    text: {
      fr: ["Brunch « mimosas à volonté » avec mes potes. À la neuvième carafe, Jérémy a vomi dans la fontaine à chocolat. Le serveur a continué à y tremper des fraises. On ne reviendra jamais. On reviendra dimanche.", "Le brunch entre amis a dégénéré : quelqu'un a gerbé dans son propre sac à main, un autre a demandé le serveur en mariage. Addition : 640. Dignité : zéro.", "Brunch « boissons à volonté » : au bout de deux heures, {w:drink} n'avait plus de goût et Kevin n'avait plus de sourcils. Personne ne sait comment. Le serveur a pleuré en apportant l'addition.", "Au brunch, j'ai trouvé {w:gross} dans mes œufs Bénédicte. J'étais déjà trop bourré{|e} pour m'en soucier. Je les ai finis. Puis je les ai rendus, sur la nappe.", "Le brunch a dérapé : Sonia a repeint le panier de viennoiseries en vomi, Max a juré {w:conspiracy} et moi, j'ai hurlé « {w:swear} » debout sur la table. Bannis à vie."],
      en: ["Bottomless-mimosa brunch with the gang. On the ninth pitcher, Jeremy puked into the chocolate fountain. The waiter kept dipping strawberries in it. We'll never go back. We're going back Sunday.", "Friend brunch got out of hand: someone barfed into her own purse, someone else proposed to the waiter. Bill: 640. Dignity: zero.", "'Bottomless drinks' brunch: two hours in, {w:drink} had no taste left and Kevin had no eyebrows left. Nobody knows how. The waiter cried bringing the bill.", "At brunch, I found {w:gross} in my eggs Benedict. I was already too drunk to care. I finished them. Then I gave them back, all over the tablecloth.", "Brunch went off the rails: Sonia redecorated the pastry basket with vomit, Max swore {w:conspiracy}, and I yelled '{w:swear}' standing on the table. Banned for life."],
    },
    fx: { happy: 4, health: -3, money: -90, visual: 'poop' },
  },

  // ───────────────────────────── best friend drama ─────────────────────────────
  {
    id: 'so_friend_crypto',
    icon: '🪙',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    vars: { amount: [500, 5000] },
    scene: { place: 'apartment', mood: 'neutral', prop: 'phone' },
    when: { age: [18, 60], noFlag: 'so_crypto_loan' },
    weight: 7,
    cooldown: 6,
    text: {
      fr: [
        "{a.first} débarque avec des yeux de fou : {a.he} a trouvé « la prochaine pépite », un memecoin qui s'appelle $CHIASSE. Il lui manque {$amount} pour « all-in ». Les tiens, évidemment.",
        "{a.first} te montre un graphique qui monte, sur un téléphone à l'écran fêlé. « Frère, {$amount} aujourd'hui, une Lambo dans six mois. » {a:Il|Elle} n'a pas le permis.",
      ],
      en: [
        "{a.first} shows up wild-eyed: {a.he} found 'the next gem', a memecoin called $DIARRHEA. {a:He|She} just needs {$amount} to 'go all-in'. Yours, obviously.",
        "{a.first} shows you a chart going up, on a phone with a cracked screen. 'Bro, {$amount} today, a Lambo in six months.' {a:He|She} doesn't have a driver's license.",
      ],
    },
    choices: [
      { label: { fr: 'Prêter le fric', en: 'Lend the cash' }, text: { fr: "J'ai prêté {$amount} à {a.first} pour son $CHIASSE. {a:Il|Elle} m'a fait un câlin et dit « on va être riches, putain ». Le « on » m'inquiète.", en: "I lent {a.first} {$amount} for {a.his} $DIARRHEA coin. {a:He|She} hugged me and said 'we're gonna be fucking rich'. The 'we' worries me." }, fx: { money: '-amount', rel: 12, flag: 'so_crypto_loan', schedule: { key: 'so_friend_crypto_return', years: 2 } } },
      { label: { fr: 'Investir aussi', en: 'Invest too' }, text: { fr: "J'ai non seulement prêté {$amount}, mais j'ai aussi acheté du $CHIASSE pour moi. Deux idiots, une seule blockchain.", en: "Not only did I lend {$amount}, I bought some $DIARRHEA for myself too. Two idiots, one blockchain." }, fx: { money: '-amount', rel: 18, stress: 5, flag: 'so_crypto_loan', schedule: { key: 'so_friend_crypto_return', years: 2 } }, mood: 'party' },
      { label: { fr: 'Refuser', en: 'Refuse' }, text: { fr: "J'ai dit non. {a.first} m'a traité{|e} de « boomer » et m'a envoyé des captures d'écran de courbes vertes pendant une semaine.", en: "I said no. {a.first} called me a 'boomer' and sent me screenshots of green candles for a week." }, fx: { rel: -8, smarts: 2 } },
    ],
  },
  {
    id: 'so_friend_crypto_return',
    icon: '📉',
    cat: 'friends',
    rating: 1,
    chainOnly: true,
    actor: 'anyone',
    vars: { amount: [2000, 40000] },
    scene: { place: 'apartment', mood: 'shock' },
    text: {
      fr: [
        "Deux ans après l'épisode $CHIASSE, {a.first} sonne chez toi. Tu ne sais pas encore si c'est pour te rembourser ou pour dormir sur ton canapé.",
        "{a.first} t'envoie un message : « Faut qu'on parle du $CHIASSE. » Ton cœur fait un saut. Dans un sens ou dans l'autre.",
      ],
      en: [
        "Two years after the $DIARRHEA saga, {a.first} rings your doorbell. You don't know yet if it's to pay you back or to sleep on your couch.",
        "{a.first} texts you: 'We need to talk about $DIARRHEA.' Your heart skips. One way or the other.",
      ],
    },
    choices: [
      {
        label: { fr: 'Ouvrir la porte', en: 'Open the door' },
        out: [
          { w: 1, text: { fr: "Le $CHIASSE a fait x400. {a.first} m'a tendu un chèque de {$amount}. Je l'ai encadré, puis je l'ai encaissé. Puis j'ai racheté le cadre.", en: "$DIARRHEA went 400x. {a.first} handed me a check for {$amount}. I framed it, then cashed it. Then bought the frame back." }, fx: { money: 'amount', happy: 15, rel: 15, unflag: 'so_crypto_loan', visual: 'money' }, mood: 'party' },
          { w: 3, text: { fr: "Le $CHIASSE vaut zéro. Le fondateur a fui aux Bahamas. {a.first} m'a remboursé{|e} avec un NFT de crotte souriante et une boîte de raviolis.", en: "$DIARRHEA is worth zero. The founder fled to the Bahamas. {a.first} paid me back with an NFT of a smiling poop and a can of ravioli." }, fx: { happy: -8, rel: -10, unflag: 'so_crypto_loan' }, mood: 'angry' },
          { w: 1, text: { fr: "{a.first} a tout perdu et dort maintenant sur mon canapé « deux semaines ». Ça fait quatre mois. {a:Il|Elle} m'explique le Bitcoin tous les soirs.", en: "{a.first} lost everything and is now sleeping on my couch 'for two weeks'. It's been four months. {a:He|She} explains Bitcoin to me every night." }, fx: { happy: -6, stress: 8, rel: 5, unflag: 'so_crypto_loan' }, mood: 'sleepy' },
        ],
      },
      { label: { fr: 'Faire le mort', en: 'Play dead' }, text: { fr: "J'ai éteint les lumières et je me suis caché{|e} derrière le canapé. {a.first} a glissé un mot : « J'ai tout perdu, toi aussi. Bisous. »", en: "I turned off the lights and hid behind the couch. {a.first} slipped a note under the door: 'I lost everything, so did you. Love you.'" }, fx: { happy: -5, rel: -10, unflag: 'so_crypto_loan' } },
    ],
  },
  {
    id: 'so_friend_ex',
    icon: '💔',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'shock' },
    when: { age: [18, 55], has: 'ex' },
    weight: 6,
    cooldown: 8,
    text: {
      fr: [
        "{a.first} t'avoue, en fixant son verre, qu'{a:il|elle} a « un peu dormi » avec ton ex. « Enfin, pas beaucoup dormi, justement. » Silence.",
        "Tu tombes sur une photo : {a.first} et ton ex, au même brunch, la même chemise froissée, le même sourire de gens qui n'ont pas dormi chez eux.",
      ],
      en: [
        "{a.first} confesses, staring into {a.his} glass, that {a.he} 'kind of slept' with your ex. 'Well, not much sleeping, actually.' Silence.",
        "You stumble on a photo: {a.first} and your ex at the same brunch, same wrinkled shirt, same smile of people who didn't sleep at home.",
      ],
    },
    choices: [
      { label: { fr: 'Donner ma bénédiction', en: 'Give my blessing' }, text: { fr: "J'ai dit que c'était « totalement ok ». Puis je suis rentré{|e} manger un pot de glace entier dans la baignoire vide. Maturité.", en: "I said it was 'totally fine'. Then I went home and ate a whole tub of ice cream in an empty bathtub. Maturity." }, fx: { rel: 5, happy: -8, karma: 4 }, mood: 'sad' },
      { label: { fr: 'Lui jeter mon verre', en: 'Throw my drink' }, text: { fr: "Je lui ai jeté mon spritz au visage. Moment très cinématographique, gâché par le fait que c'était mon dernier spritz et qu'il coûtait 14 balles.", en: "I threw my spritz in {a.his} face. A very cinematic moment, ruined by the fact that it was my last spritz and cost 14 bucks." }, fx: { rel: -30, happy: 3, money: -15, actorRole: 'enemy' }, mood: 'angry' },
      { label: { fr: 'Couper les ponts', en: 'Cut ties' }, text: { fr: "J'ai supprimé {a.first} de partout. Le groupe d'amis a dû choisir son camp. Ils ont choisi celui qui a une piscine. Pas moi.", en: "I deleted {a.first} from everything. The friend group had to pick sides. They picked the one with a pool. Not me." }, fx: { happy: -6, actorGone: true }, mood: 'cry' },
      {
        label: { fr: 'Vengeance symétrique', en: 'Symmetrical revenge' },
        rating: 2,
        out: [
          { w: 1, text: { fr: "Pour me venger, j'ai couché avec le père de {a.first}. Il a 61 ans, une prothèse de hanche et beaucoup d'enthousiasme. Je ne sais pas qui a gagné.", en: "For revenge, I hooked up with {a.first}'s dad. He's 61, has a hip replacement and a lot of enthusiasm. I'm not sure who won." }, fx: { rel: -40, happy: 2, karma: -8, actorRole: 'enemy' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai tenté de séduire le frère de {a.first} pour me venger. Il m'a parlé de ses NFT pendant deux heures. J'ai abandonné la vengeance. Et l'envie de vivre.", en: "I tried to seduce {a.first}'s brother for revenge. He talked about his NFTs for two hours. I gave up on revenge. And on life." }, fx: { rel: -15, happy: -5 } },
        ],
      },
    ],
  },
  {
    id: 'so_ex_caught',
    icon: '🛏️',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'apartment', mood: 'shock' },
    when: { age: [18, 55], has: 'ex', movedOut: true },
    weight: 4,
    once: true,
    text: {
      fr: [
        "Tu rentres plus tôt du boulot. Bruits suspects dans ta chambre. Tu ouvres : {a.first} et ton ex, dans TON lit, sur TES draps en lin à 200 balles, en train de faire des choses que tes draps n'oublieront jamais.",
        "Tu avais prêté tes clés à {a.first} « pour arroser les plantes ». Tu rentres de vacances : les plantes sont mortes, mais ton ex est dans ta douche avec {a.him}. Nu{a:|e}. Très mouillé{a:|e}.",
      ],
      en: [
        "You get home early from work. Suspicious noises from your bedroom. You open the door: {a.first} and your ex, in YOUR bed, on YOUR $200 linen sheets, doing things those sheets will never forget.",
        "You lent {a.first} your keys 'to water the plants'. You come back from vacation: the plants are dead, but your ex is in your shower with {a.him}. Naked. Very wet.",
      ],
    },
    choices: [
      { label: { fr: 'Hurler et tout casser', en: 'Scream and smash' }, text: { fr: "J'ai hurlé, lancé une lampe, un cactus et une bouteille de lubrifiant (qui n'était pas à moi). Les voisins ont applaudi. {a.first} s'est enfui{a:|e} en slip par l'escalier de secours.", en: "I screamed and threw a lamp, a cactus and a bottle of lube (not mine). The neighbors applauded. {a.first} escaped down the fire escape in {a.his} underwear." }, fx: { rel: -50, happy: -6, stress: 10, actorRole: 'enemy' }, mood: 'angry' },
      { label: { fr: 'Brûler les draps', en: 'Burn the sheets' }, text: { fr: "J'ai traîné les draps dans le jardin et j'y ai mis le feu en hurlant des insultes en latin. Les pompiers sont venus. L'un d'eux m'a demandé{|e} mon numéro. Rebond.", en: "I dragged the sheets into the yard and set them on fire while screaming Latin insults. The firefighters came. One of them asked for my number. Rebound." }, fx: { rel: -40, happy: 4, karma: -2, actorRole: 'enemy', visual: 'fire' }, mood: 'angry' },
      { label: { fr: 'Me joindre à eux', en: 'Join them' }, text: { fr: "J'ai haussé les épaules, retiré mes chaussures et demandé s'il restait de la place. Il en restait. Personne n'en a jamais reparlé. Les draps, si.", en: "I shrugged, took off my shoes and asked if there was room. There was. Nobody ever spoke of it again. The sheets did." }, fx: { rel: 10, happy: 6, karma: -5, stress: -3 }, mood: 'love' },
      { label: { fr: 'Refermer la porte', en: 'Close the door' }, text: { fr: "J'ai refermé la porte, je suis allé{|e} au bar d'en face et j'ai attendu qu'ils sortent pour leur faire signer une facture de pressing. 85 balles, draps compris. Ils ont payé.", en: "I closed the door, went to the bar across the street and waited for them to come out so they'd sign a dry-cleaning invoice. 85 bucks. They paid." }, fx: { rel: -25, money: 85, smarts: 2, actorGone: true }, mood: 'neutral' },
    ],
  },
  {
    id: 'so_friend_rich',
    icon: '🤑',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    vars: { amount: [1000, 10000] },
    scene: { place: 'villa', mood: 'shock', fx: 'money' },
    when: { age: [22, 70] },
    weight: 6,
    once: true,
    text: {
      fr: [
        "{a.first} vient de revendre sa start-up d'appli pour chiens anxieux à un géant de la tech. {a:Il|Elle} pèse maintenant 40 millions et porte des chaussettes en cachemire « parce que c'est plus doux pour l'âme ».",
        "{a.first}, avec qui tu partageais des pâtes au beurre à la fac, est devenu{a:|e} millionnaire grâce à un brevet de bouchon de stylo. {a:Il|Elle} t'invite dans sa villa. Il y a un toboggan qui part de la chambre.",
      ],
      en: [
        "{a.first} just sold {a.his} app for anxious dogs to a tech giant. {a:He|She}'s now worth 40 million and wears cashmere socks 'because they're softer on the soul'.",
        "{a.first}, who used to split buttered pasta with you in college, became a millionaire off a pen-cap patent. {a:He|She} invites you to {a.his} villa. There's a slide coming out of the bedroom.",
      ],
    },
    choices: [
      { label: { fr: 'Rester naturel{|le}', en: 'Act normal' }, text: { fr: "J'ai traité {a.first} comme avant. {a:Il|Elle} m'a avoué que j'étais la seule personne à ne pas lui avoir parlé de « projet ». On a mangé des pâtes au beurre dans sa cuisine à 300 000 balles.", en: "I treated {a.first} like before. {a:He|She} admitted I was the only person who hadn't pitched {a.him} a 'project'. We ate buttered pasta in {a.his} $300,000 kitchen." }, fx: { rel: 20, happy: 6, karma: 4 }, mood: 'happy' },
      {
        label: { fr: 'Demander un coup de pouce', en: 'Ask for a little help' },
        out: [
          { w: 1, text: { fr: "{a.first} m'a fait un virement de {$amount} « sans rien attendre en retour ». J'ai pleuré. {a:Il|Elle} aussi, mais de fierté.", en: "{a.first} wired me {$amount} 'with no strings attached'. I cried. So did {a.he}, out of pride." }, fx: { money: 'amount', rel: 5, happy: 10 }, mood: 'happy' },
          { w: 1, text: { fr: "{a.first} m'a regardé{|e} avec pitié et m'a offert… un livre de développement personnel dédicacé par son coach. J'en ai fait un cale-porte.", en: "{a.first} looked at me with pity and gave me… a self-help book signed by {a.his} life coach. It's a doorstop now." }, fx: { rel: -10, happy: -5 } },
        ],
      },
      { label: { fr: 'Glisser dans le toboggan', en: 'Ride the slide' }, text: { fr: "J'ai glissé dans le toboggan de la chambre jusqu'à la piscine. Dix-sept fois. J'ai été le meilleur moment de la semaine de {a.first}, et {a.his} majordome m'a appelé{|e} « {Monsieur|Madame} Toboggan ».", en: "I rode the bedroom slide into the pool. Seventeen times. I was the highlight of {a.first}'s week, and {a.his} butler started calling me 'the Slide Guest'." }, fx: { rel: 10, happy: 12, athletic: 2 }, mood: 'party' },
    ],
  },
  {
    id: 'so_friend_cult',
    icon: '🕯️',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'park', mood: 'shock' },
    when: { age: [18, 65], noFlag: 'so_friend_cult' },
    weight: 5,
    cooldown: 10,
    text: {
      fr: [
        "{a.first} a rejoint « La Fraternité du Quinoa Ascendant ». {a:Il|Elle} porte une tunique beige, s'appelle maintenant Lumière-Dorée et dit que ton aura « sent le gluten ».",
        "{a.first} t'invite à un « simple atelier de respiration ». Il y a 40 personnes en tunique, un gourou nommé Patrice qui flotte (il est sur un tabouret) et un contrat de 30 pages.",
      ],
      en: [
        "{a.first} joined 'The Fellowship of Ascending Quinoa'. {a:He|She} wears a beige tunic, now goes by Golden-Light and says your aura 'smells like gluten'.",
        "{a.first} invites you to a 'simple breathing workshop'. There are 40 people in tunics, a guru named Patrice who levitates (he's on a stool) and a 30-page contract.",
      ],
    },
    choices: [
      {
        label: { fr: '{a:Le|La} kidnapper pour son bien', en: 'Kidnap them for their own good' },
        out: [
          { w: 2, text: { fr: "J'ai enfourné {a.first} dans mon coffre avec un sandwich jambon-beurre. Trois jours de « déprogrammation » plus tard, {a:il|elle} a mangé le sandwich en pleurant. Je l'ai récupéré{a:|e}.", en: "I stuffed {a.first} into my trunk with a ham sandwich. Three days of 'deprogramming' later, {a.he} ate the sandwich in tears. I got {a.him} back." }, fx: { rel: 25, karma: 5, stress: 8 }, mood: 'proud' },
          { w: 1, text: { fr: "Pendant le kidnapping, {a.first} m'a mordu{|e} en hurlant « Patrice me protège ! ». Les flics ont trouvé ça moins drôle que moi.", en: "During the kidnapping, {a.first} bit me screaming 'Patrice protects me!'. The cops found it less funny than I did." }, fx: { rel: -20, health: -4, heat: 15, flag: 'so_friend_cult', schedule: { key: 'so_friend_cult_return', years: 3 } }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Rejoindre la secte aussi', en: 'Join the cult too' }, text: { fr: "J'ai signé le contrat sans le lire. On m'a pris ma voiture, mes économies et mes sourcils. En échange, j'ai droit à une tunique et à un quinoa béni par semaine.", en: "I signed the contract without reading it. They took my car, my savings and my eyebrows. In exchange, I get a tunic and one blessed quinoa a week." }, fx: { money: -2000, rel: 15, happy: 3, looks: -5, smarts: -4 }, mood: 'sleepy' },
      { label: { fr: 'Laisser tomber', en: 'Let it go' }, text: { fr: "J'ai souhaité bonne ascension à {a.first}. {a:Il|Elle} m'a béni{|e} avec une feuille de chou et a disparu dans un minibus beige.", en: "I wished {a.first} a good ascension. {a:He|She} blessed me with a cabbage leaf and vanished in a beige minivan." }, fx: { happy: -4, rel: -5, flag: 'so_friend_cult', schedule: { key: 'so_friend_cult_return', years: 3 } }, mood: 'sad' },
    ],
  },
  {
    id: 'so_friend_cult_return',
    icon: '🌾',
    cat: 'friends',
    rating: 1,
    chainOnly: true,
    actor: 'anyone',
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "On sonne. C'est {a.first}, trois ans après avoir rejoint la secte du Quinoa. Tunique déchirée, cheveux rasés en forme de céréale, regard de quelqu'un qui a vu Patrice tomber de son tabouret.",
        "{a.first} réapparaît dans ta vie : la Fraternité du Quinoa a été démantelée, Patrice est en garde à vue et {a:il|elle} n'a nulle part où aller. À part chez toi.",
      ],
      en: [
        "Doorbell. It's {a.first}, three years after joining the Quinoa cult. Torn tunic, head shaved in the shape of a grain, the eyes of someone who saw Patrice fall off his stool.",
        "{a.first} reappears in your life: the Quinoa Fellowship got busted, Patrice is in custody and {a.he} has nowhere to go. Except your place.",
      ],
    },
    choices: [
      { label: { fr: "L'accueillir", en: 'Take them in' }, text: { fr: "J'ai hébergé {a.first}. {a:Il|Elle} a redécouvert le gluten devant moi, une baguette entière en larmes. Notre amitié est plus forte que jamais.", en: "I took {a.first} in. {a:He|She} rediscovered gluten in front of me, a whole baguette, in tears. Our friendship is stronger than ever." }, fx: { rel: 25, karma: 6, happy: 5, unflag: 'so_friend_cult' }, mood: 'cry' },
      { label: { fr: "Lui dire « je te l'avais dit »", en: "Say 'I told you so'" }, text: { fr: "J'ai dit « je te l'avais dit » onze fois, dont une en chanson. {a.first} est reparti{a:|e} rejoindre une autre secte, par principe.", en: "I said 'I told you so' eleven times, once as a song. {a.first} left to join another cult, out of spite." }, fx: { rel: -20, happy: 4, unflag: 'so_friend_cult', actorGone: true } },
      { label: { fr: 'Fonder notre propre secte', en: 'Start our own cult' }, text: { fr: "Avec l'expérience de {a.first}, on a lancé notre propre secte : « L'Église du Sommeil Réparateur ». Le dogme : faire la sieste. 200 fidèles en un mois.", en: "With {a.first}'s experience, we started our own cult: 'The Church of Restorative Napping'. The doctrine: take naps. 200 followers in a month." }, fx: { rel: 15, money: 3000, karma: -6, followers: 2000, unflag: 'so_friend_cult' }, mood: 'party' },
    ],
  },
  {
    id: 'so_friend_marries_awful',
    icon: '💒',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'angry', prop: 'flowers' },
    when: { age: [22, 55] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "{a.first} épouse Grégoire, un type qui appelle les serveurs « chef », parle de son ex à chaque repas et a un tatouage « No Regrets » mal orthographié. La cérémonie commence. « Si quelqu'un s'oppose à ce mariage… »",
        "Mariage de {a.first} avec une personne qui l'a déjà largué{a:|e} trois fois par SMS. Le prêtre demande si quelqu'un a une objection. Tout le monde te regarde.",
      ],
      en: [
        "{a.first} is marrying Greg, a guy who calls waiters 'chief', brings up his ex at every meal and has a misspelled 'No Regerts' tattoo. The ceremony starts. 'If anyone objects to this marriage…'",
        "{a.first}'s wedding, to someone who's already dumped {a.him} three times by text. The priest asks if anyone objects. Everyone looks at you.",
      ],
    },
    choices: [
      {
        label: { fr: "M'opposer", en: 'Object' },
        out: [
          { w: 1, text: { fr: "Je me suis levé{|e} et j'ai crié « Je m'y oppose ! ». {a.first} a réfléchi trois secondes, puis s'est enfui{a:|e} en courant avec moi et la pièce montée. Meilleur jour de nos vies.", en: "I stood up and yelled 'I object!'. {a.first} thought for three seconds, then ran off with me and the wedding cake. Best day of our lives." }, fx: { rel: 30, happy: 10, karma: 3 }, mood: 'party' },
          { w: 2, text: { fr: "J'ai crié « Je m'y oppose ! ». Silence glacial. Le mariage a continué. J'ai mangé mon entrée seul{|e} à la table du DJ. Merde.", en: "I yelled 'I object!'. Icy silence. The wedding went on. I ate my appetizer alone at the DJ's table. Shit." }, fx: { rel: -25, happy: -8 }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Me taire et boire', en: 'Shut up and drink' }, text: { fr: "Je n'ai rien dit. J'ai bu onze coupes de champagne et fini par danser un slow avec la grand-mère de Grégoire, qui pense comme moi.", en: "I said nothing. I drank eleven glasses of champagne and ended up slow-dancing with Greg's grandma, who agrees with me." }, fx: { happy: 4, health: -3, addiction: ['alcohol', 4] }, mood: 'party' },
      { label: { fr: 'Parier sur le divorce', en: 'Bet on the divorce' }, text: { fr: "J'ai lancé un pari discret entre invités sur la durée du mariage. La cagnotte est à 400 balles. J'ai pris « 18 mois ». Le marié a parié aussi.", en: "I started a discreet betting pool among the guests on how long the marriage lasts. The pot's at 400. I took '18 months'. The groom bet too." }, fx: { karma: -4, happy: 5, smarts: 1 } },
    ],
  },
  {
    id: 'so_godparent',
    icon: '👶',
    cat: 'friends',
    rating: 0,
    actor: 'anyFriend',
    scene: { place: 'home', mood: 'love' },
    when: { age: [24, 55], noFlag: 'so_godparent' },
    weight: 6,
    cooldown: 8,
    text: {
      fr: [
        "{a.first} vient d'avoir un bébé et te tend un body où il est écrit « Veux-tu être {mon parrain|ma marraine} ? ». Le bébé te regarde comme un créancier.",
        "{a.first} te demande d'être le parrain ou la marraine de son enfant. « Et s'il nous arrive quelque chose, c'est toi qui l'élèves. » Tu n'arrives pas à élever une plante.",
      ],
      en: [
        "{a.first} just had a baby and hands you a onesie that says 'Will you be my godparent?'. The baby looks at you like a debt collector.",
        "{a.first} asks you to be {a.his} kid's godparent. 'And if anything happens to us, you raise them.' You can't even raise a houseplant.",
      ],
    },
    choices: [
      { label: { fr: 'Accepter, ému{|e}', en: 'Accept, moved' }, text: { fr: "J'ai dit oui en pleurant. Le bébé m'a vomi sur l'épaule pour sceller le pacte. Je suis officiellement {parrain|marraine}. Ça me terrifie.", en: "I said yes, crying. The baby threw up on my shoulder to seal the deal. I'm officially a godparent. It terrifies me." }, fx: { rel: 20, happy: 8, karma: 4, flag: 'so_godparent', schedule: { key: 'so_godchild_birthday', years: 6 } }, mood: 'love' },
      { label: { fr: 'Négocier les conditions', en: 'Negotiate terms' }, text: { fr: "J'ai accepté à condition de ne jamais changer de couche et d'avoir le droit de lui apprendre des gros mots à 12 ans. Contrat signé sur une serviette en papier.", en: "I accepted on the condition that I never change a diaper and get to teach the kid swear words at 12. Contract signed on a napkin." }, fx: { rel: 8, happy: 5, flag: 'so_godparent', schedule: { key: 'so_godchild_birthday', years: 6 } } },
      { label: { fr: 'Refuser poliment', en: 'Politely decline' }, text: { fr: "J'ai refusé. {a.first} a choisi son cousin Raphaël à la place, qui offre des chèques de 50 balles à chaque anniversaire. Je suis devenu{|e} « {le tonton bizarre|la tata bizarre} ».", en: "I declined. {a.first} picked {a.his} cousin Raphael instead, who gives $50 checks every birthday. I became '{the weird uncle|the weird aunt}'." }, fx: { rel: -12 } },
    ],
  },
  {
    id: 'so_godchild_birthday',
    icon: '🎁',
    cat: 'friends',
    rating: 0,
    chainOnly: true,
    actor: 'anyone',
    scene: { place: 'home', mood: 'happy', fx: 'confetti' },
    text: {
      fr: [
        "Anniversaire de Lucas, ton filleul, 6 ans. {a.first} te glisse : « Il ne parle que de toi depuis une semaine. » L'enfant t'attend, mains tendues, regard de douanier.",
        "Lucas, ton filleul, fête ses 6 ans et a préparé une liste de cadeaux. En tête : « un vrai cheval ». {a.first} te fait un clin d'œil qui ne t'aide pas.",
      ],
      en: [
        "Your godson Lucas's 6th birthday. {a.first} whispers: 'He's talked about nothing but you all week.' The child is waiting, hands out, with the stare of a customs officer.",
        "Your godson Lucas turns 6 and wrote a gift list. At the top: 'a real horse'. {a.first} winks at you, which doesn't help.",
      ],
    },
    choices: [
      { label: { fr: 'Offrir une batterie', en: 'Give a drum kit' }, text: { fr: "J'ai offert une batterie complète. L'enfant m'adore. {a.first} ne me parlera plus jamais. Le voisinage a déménagé.", en: "I gave the kid a full drum kit. The kid adores me. {a.first} will never speak to me again. The neighbors moved." }, fx: { money: -400, rel: -15, happy: 8, karma: -1 }, mood: 'party' },
      { label: { fr: 'Offrir un livre', en: 'Give a book' }, text: { fr: "J'ai offert un livre. L'enfant l'a ouvert, m'a regardé{|e} et a dit « c'est tout ? ». {a.first} a trouvé ça éducatif. Moi, humiliant.", en: "I gave a book. The kid opened it, looked at me and said 'that's it?'. {a.first} found it educational. I found it humiliating." }, fx: { money: -20, rel: 8, happy: -3 } },
      { label: { fr: 'Faire le clown', en: 'Do a clown show' }, text: { fr: "Faute de budget, j'ai fait un spectacle de clown improvisé. J'ai glissé sur un ballon et fini dans le gâteau. Les enfants pensent que c'était voulu. Je les laisse croire.", en: "On a zero budget, I put on an improvised clown show. I slipped on a balloon and landed in the cake. The kids think it was on purpose. I'm letting them." }, fx: { rel: 12, happy: 6, looks: -2 }, mood: 'happy' },
    ],
  },
  {
    id: 'so_friend_dies',
    icon: '⚰️',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'cemetery', mood: 'cry', prop: 'flowers' },
    when: { age: [25, 90] },
    weight: 3,
    cooldown: 10,
    text: {
      fr: [
        "{a.first} est mort{a:|e}. Arrêt cardiaque, à {a.age} ans, en pleine partie de padel. Sa famille te demande de dire quelques mots à l'enterrement. Tu n'as jamais su parler devant les gens.",
        "Le téléphone sonne à 7 h. {a.first} est décédé{a:|e} cette nuit. {a:Il|Elle} t'a laissé une lettre, une dette de 30 balles et la garde de son poisson rouge.",
      ],
      en: [
        "{a.first} died. Heart attack, at {a.age}, in the middle of a padel match. {a:His|Her} family asks you to say a few words at the funeral. You've never been good at public speaking.",
        "The phone rings at 7 a.m. {a.first} passed away last night. {a:He|She} left you a letter, a $30 debt and custody of {a.his} goldfish.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire un éloge funèbre', en: 'Give a eulogy' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "Mon éloge a fait rire et pleurer toute l'église. J'ai raconté la fois où {a.first} avait vomi dans un taxi à Lisbonne. Sa mère m'a serré{|e} dans ses bras. Repose en paix, vieille branche.", en: "My eulogy made the whole church laugh and cry. I told the story of {a.first} puking in a Lisbon cab. {a:His|Her} mom hugged me. Rest easy, old friend." }, fx: { happy: -10, karma: 5, actorDie: true, counter: 'so_funerals' }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai bafouillé, confondu le prénom de {a.first} avec celui de son ex et fini sur une blague sur les cercueils. Silence. Un oncle a toussé jusqu'au cimetière.", en: "I stammered, mixed up {a.first}'s name with {a.his} ex's and ended with a coffin joke. Silence. An uncle coughed all the way to the cemetery." }, fx: { happy: -14, stress: 8, actorDie: true, counter: 'so_funerals' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Me souler en son honneur', en: 'Get drunk in their honor' }, text: { fr: "J'ai réuni la bande et on a bu au bar préféré de {a.first} jusqu'à l'aube. On a gravé son nom sous la table. Le patron a laissé faire. Putain, qu'est-ce qu'on va s'ennuyer.", en: "I got the gang together and we drank at {a.first}'s favorite bar till dawn. We carved {a.his} name under the table. The owner let us. Damn, we're gonna miss {a.him}." }, fx: { happy: -6, health: -3, actorDie: true, addiction: ['alcohol', 5], counter: 'so_funerals' }, mood: 'cry' },
      { label: { fr: "Ne pas y aller", en: "Skip the funeral" }, text: { fr: "Je ne suis pas allé{|e} à l'enterrement. Trop dur. J'ai regardé le direct sur Facebook, en pyjama, en mangeant les chips préférées de {a.first}.", en: "I didn't go to the funeral. Too hard. I watched the Facebook livestream in pajamas, eating {a.first}'s favorite chips." }, fx: { happy: -12, karma: -3, actorDie: true }, mood: 'sad' },
    ],
  },
  {
    id: 'so_friend_dies_gore',
    icon: '🎆',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'park', mood: 'shock', fx: 'explosion' },
    when: { age: [18, 80] },
    weight: 2,
    cooldown: 12,
    text: {
      fr: [
        "Barbecue du 14 juillet. {a.first} allume une fusée d'artifice achetée « à un mec sur un parking », la tient à l'envers et la regarde de près « pour voir si elle marche ». Elle marche.",
        "{a.first} veut prouver qu'on peut sauter du toit du garage sur le trampoline. Il y a un râteau planté juste à côté du trampoline. Tout le monde le voit. Sauf {a.him}.",
      ],
      en: [
        "Fourth of July barbecue. {a.first} lights a firework bought 'from a guy in a parking lot', holds it upside down and peers into it 'to see if it works'. It works.",
        "{a.first} wants to prove you can jump from the garage roof onto the trampoline. There's a rake stuck in the ground right next to the trampoline. Everyone sees it. Except {a.him}.",
      ],
    },
    choices: [
      { label: { fr: 'Crier « NON ! »', en: "Yell 'NO!'" }, text: { fr: "J'ai crié « NON ! » une demi-seconde trop tard. {a.first} a été répandu{a:|e} sur trois jardins, une haie et le pare-brise du voisin. On a retrouvé une chaussure sur le toit de l'église. RIP, abruti{a:|e} magnifique.", en: "I yelled 'NO!' half a second too late. {a.first} got spread over three yards, a hedge and the neighbor's windshield. A shoe was found on the church roof. RIP, you magnificent idiot." }, fx: { happy: -15, stress: 10, actorDie: true, visual: 'gore', counter: 'so_funerals' }, mood: 'shock' },
      { label: { fr: 'Filmer', en: 'Film it' }, text: { fr: "J'ai filmé. La vidéo, avec les tripes de {a.first} qui retombent au ralenti sur les merguez, a fait 12 millions de vues. Sa famille a porté plainte. Les merguez, on les a mangées quand même.", en: "I filmed it. The video, with {a.first}'s guts raining down in slow motion on the sausages, got 12 million views. {a:His|Her} family sued. We ate the sausages anyway." }, fx: { happy: -8, karma: -10, fame: 8, followers: 50000, actorDie: true, visual: 'gore', counter: 'so_funerals' }, mood: 'shock' },
      {
        label: { fr: 'Plonger pour {a:le|la} sauver', en: 'Dive to save them' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai plaqué {a.first} au sol au dernier moment. On s'en tire avec un sourcil cramé chacun. {a:Il|Elle} m'a nommé{|e} dans son testament. Je suis héritier de sa collection de casquettes.", en: "I tackled {a.first} at the last second. We each walked away with one singed eyebrow. {a:He|She} put me in {a.his} will. I'm the heir to {a.his} cap collection." }, fx: { rel: 30, happy: 10, karma: 8, looks: -2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai plongé héroïquement. Il ne reste de {a.first} qu'une tong fumante. Il ne reste de moi qu'un doigt en moins. On m'a donné une médaille du courage et une prothèse en plastique.", en: "I dove heroically. All that's left of {a.first} is one smoking flip-flop. All that's left of me is one fewer finger. I got a bravery medal and a plastic prosthetic." }, fx: { happy: -12, health: -10, disease: 'missing_finger', actorDie: true, visual: 'gore', counter: 'so_funerals' }, mood: 'cry' },
        ],
      },
    ],
  },
  {
    id: 'so_friend_kidney',
    icon: '🫘',
    cat: 'friends',
    rating: 2,
    actor: { role: 'anyFriend', minRel: 40 },
    scene: { place: 'hospital', mood: 'sad' },
    when: { age: [20, 70], stat: { health: [40, 100] } },
    weight: 3,
    once: true,
    text: {
      fr: [
        "{a.first} t'appelle de l'hôpital : ses reins ont lâché après « une décennie de Monster et de kebabs ». Tu es compatible. {a:Il|Elle} te demande un rein. Gentiment. Avec un émoji cœur.",
        "{a.first} a besoin d'une greffe de rein et tu es le seul donneur compatible. {a:Il|Elle} t'a envoyé un PowerPoint de 18 slides intitulé « Pourquoi ton rein serait plus heureux chez moi ».",
      ],
      en: [
        "{a.first} calls from the hospital: {a:His|Her} kidneys gave out after 'a decade of Monster and kebabs'. You're a match. {a:He|She} asks for a kidney. Nicely. With a heart emoji.",
        "{a.first} needs a kidney transplant and you're the only compatible donor. {a:He|She} sent you an 18-slide PowerPoint titled 'Why your kidney would be happier with me'.",
      ],
    },
    choices: [
      { label: { fr: 'Donner mon rein', en: 'Donate my kidney' }, text: { fr: "J'ai donné mon rein. Le chirurgien l'a fait tomber par terre une seconde (« règle des cinq secondes ! »), mais la greffe a pris. {a.first} me doit littéralement un organe. Je le lui rappelle à chaque dîner.", en: "I gave my kidney. The surgeon dropped it on the floor for a second ('five-second rule!'), but the transplant took. {a.first} literally owes me an organ. I bring it up at every dinner." }, fx: { health: -15, rel: 40, karma: 15, happy: 5 }, mood: 'proud' },
      { label: { fr: "Vendre l'autre au marché noir", en: 'Sell it on the black market' }, text: { fr: "J'ai refusé à {a.first}, puis j'ai vendu mon rein 30 000 balles à un type dans une baignoire de glaçons. {a.first} l'a appris. Puis {a:il|elle} est mort{a:|e}. Je ne dors plus très bien. Mais sur un matelas neuf.", en: "I said no to {a.first}, then sold my kidney for 30 grand to a guy in a bathtub full of ice. {a.first} found out. Then {a.he} died. I don't sleep well anymore. But on a new mattress." }, fx: { health: -18, money: 30000, karma: -20, actorDie: true, visual: 'gore' }, mood: 'sad' },
      { label: { fr: 'Refuser', en: 'Refuse' }, text: { fr: "J'ai dit non. J'aime bien mes deux reins, ils travaillent en équipe. {a.first} a trouvé un donneur in extremis : un motard décapité sur l'A6. {a:Il|Elle} ne me parle plus, mais ses nouveaux reins ont envie de vitesse.", en: "I said no. I like both my kidneys, they work as a team. {a.first} found a donor at the last minute: a biker decapitated on the highway. {a:He|She} won't speak to me, but {a.his} new kidneys crave speed." }, fx: { rel: -40, karma: -6 }, mood: 'neutral' },
    ],
  },

  // ───────────────────────────── group trips & game nights ─────────────────────────────
  {
    id: 'so_group_trip',
    icon: '🏡',
    cat: 'friends',
    rating: 0,
    vars: { amount: [200, 900] },
    scene: { place: 'villa', mood: 'happy' },
    when: { age: [19, 60], has: 'anyFriend' },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["La bande loue un gîte pour le week-end. Le groupe de discussion « Gîte 🔥 » compte 1 200 messages, dont 1 150 sur qui dort dans le canapé-lit. Ta part : {$amount}.", "Week-end entre potes à la campagne ! Il y a un jacuzzi, un baby-foot et une seule salle de bains pour onze personnes. Ta part : {$amount}.", "Week-end entre potes {w:far_place} ! Le groupe a voté pour une maison avec piscine, sauf que dans la piscine, il y a {w:animal}. Ta part : {$amount}.", "Le groupe « Week-end 🔥 » a choisi une location avec « vue mer ». Sur les photos, on voit surtout {w:object}. Ta part : {$amount}. Départ vendredi.", "La bande part en week-end. Programme : {w:activity}, barbecue et {w:song} en boucle toute la nuit. Ta part : {$amount}, à payer « avant jeudi, sinon tu dors dans la voiture »."],
      en: ["The gang is renting a cottage for the weekend. The 'Cottage 🔥' group chat has 1,200 messages, 1,150 of them about who gets the sofa bed. Your share: {$amount}.", "Weekend in the countryside with friends! There's a hot tub, a foosball table and one single bathroom for eleven people. Your share: {$amount}.", "Friends' weekend {w:far_place}! The group voted for a house with a pool, except there's {w:animal} in the pool. Your share: {$amount}.", "The 'Weekend 🔥' group chat picked a rental with a 'sea view'. In the photos, you mostly see {w:object}. Your share: {$amount}. Leaving Friday.", "The gang is off for a weekend. Program: {w:activity}, barbecue and {w:song} on repeat all night. Your share: {$amount}, payable 'by Thursday or you sleep in the car'."],
    },
    choices: [
      {
        label: { fr: "Organiser l'intendance", en: 'Run the logistics' },
        out: [
          { w: 2, text: { fr: ["J'ai fait un tableur avec les courses, les chambres et les tours de vaisselle. Tout le monde m'a trouvé{|e} insupportable, puis m'a remercié{|e}. Week-end parfait.", "J'ai tout organisé au millimètre, avec même un créneau pour {w:activity}. Personne ne l'a fait, mais tout le monde a apprécié l'intention."], en: ["I made a spreadsheet for groceries, rooms and dish duty. Everyone found me unbearable, then thanked me. Perfect weekend.", "I organized everything to the minute, even a slot for {w:activity}. Nobody did it, but everyone appreciated the thought."] }, fx: { money: '-amount', happy: 10, discipline: 3 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai avancé tout l'argent. Trois mois plus tard, quatre personnes ne m'ont toujours pas remboursé{|e}. L'une d'elles m'a fait un « Lydia » de 2 balles « pour le pain ».", "J'ai fait les courses pour onze. On m'a remboursé{|e} avec {w:food} et des promesses. Je suis le banquier le plus pauvre du monde."], en: ["I fronted all the money. Three months later, four people still haven't paid me back. One of them Venmo'd me $2 'for the bread'.", "I did the groceries for eleven. I got paid back with {w:food} and promises. I'm the world's poorest banker."] }, fx: { money: -1200, happy: -4, stress: 5 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Venir les mains vides', en: 'Show up empty-handed' }, text: { fr: ["Je suis arrivé{|e} avec un paquet de chips entamé et beaucoup de charisme. J'ai eu la meilleure chambre. Je ne sais toujours pas comment.", "Je suis venu{|e} les mains vides, à part {w:object}. Ça a été le clou du week-end. Personne ne sait pourquoi."], en: ["I showed up with a half-eaten bag of chips and lots of charisma. I got the best room. I still don't know how.", "I came empty-handed, except for {w:object}. It was the highlight of the weekend. Nobody knows why."] }, fx: { money: -50, happy: 8, karma: -2 }, mood: 'party' },
      { label: { fr: 'Me désister', en: 'Bail' }, text: { fr: ["Je me suis désisté{|e} la veille. J'ai passé le week-end à regarder leurs stories en mangeant des pâtes. Le jacuzzi avait l'air incroyable.", "Je me suis désisté{|e} {w:excuse}. Ils ont posé une photo de moi en carton à table à chaque repas. J'étais là sans être là."], en: ["I bailed the day before. I spent the weekend watching their stories eating pasta. The hot tub looked amazing.", "I bailed {w:excuse}. They put a cardboard cutout of me at the table for every meal. I was there without being there."] }, fx: { happy: -5 }, mood: 'sad' },
    ],
  },
  {
    id: 'so_trip_prague',
    icon: '🍺',
    cat: 'friends',
    rating: 2,
    scene: { place: 'party', mood: 'party', fx: 'gore' },
    when: { age: [20, 50], has: 'anyFriend' },
    weight: 5,
    cooldown: 6,
    text: {
      fr: [
        "Week-end à Prague avec la bande. 48 heures, sept bars, un char d'assaut loué pour une heure et un ami qui a perdu une dent, son passeport et le souvenir de son prénom.",
        "Voyage de potes à Amsterdam. Nuit 1 : Kevin a avalé une truffe « de bienvenue ». Nuit 2 : il parle à un canard. Nuit 3 : le canard lui répond. Et c'est le dernier soir.",
      ],
      en: [
        "Weekend in Prague with the gang. 48 hours, seven bars, a tank rented for an hour and a friend who lost a tooth, his passport and the memory of his own name.",
        "Friends' trip to Amsterdam. Night 1: Kevin ate a 'welcome' truffle. Night 2: he's talking to a duck. Night 3: the duck talks back. And it's the last night.",
      ],
    },
    choices: [
      {
        label: { fr: 'Suivre le mouvement', en: 'Go with the flow' },
        out: [
          { w: 2, text: { fr: "Je me suis réveillé{|e} dans une baignoire d'hôtel, un tatouage de saucisse sur la fesse, une dent qui n'est pas la mienne dans la poche et 200 couronnes tchèques collées au front. Meilleur voyage de ma vie.", en: "I woke up in a hotel bathtub with a sausage tattoo on my butt, a tooth that isn't mine in my pocket and 200 Czech crowns stuck to my forehead. Best trip of my life." }, fx: { happy: 12, health: -6, money: -800, addiction: ['alcohol', 5] }, mood: 'party' },
          { w: 1, text: { fr: "Concours de lancer de bocks sur le pont Charles. Un bock a ricoché sur un réverbère et m'a arraché la moitié de l'oreille. Elle a fini dans la Vltava. Un cygne l'a mangée.", en: "Beer-mug throwing contest on the Charles Bridge. A mug ricocheted off a lamppost and tore off half my ear. It fell in the river. A swan ate it." }, fx: { happy: -4, health: -12, looks: -6, money: -600, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Jouer les baby-sitters', en: 'Be the babysitter' }, text: { fr: "J'ai été {le seul|la seule} sobre du voyage. J'ai tenu des cheveux pendant que les autres vomissaient dans des fontaines du XIVe siècle. Ils m'ont offert un aimant de frigo en remerciement.", en: "I was the only sober one on the trip. I held hair back while the others puked into 14th-century fountains. They gave me a fridge magnet as thanks." }, fx: { happy: -2, karma: 6, health: 2, money: -400 }, mood: 'sleepy' },
      { label: { fr: 'Conduire le char', en: 'Drive the tank' }, text: { fr: "J'ai conduit le char d'assaut loué et écrasé une Smart garée en double file. Le moniteur a applaudi, puis facturé. Ça valait chaque centime.", en: "I drove the rented tank and crushed a double-parked Smart car. The instructor clapped, then billed me. Worth every cent." }, fx: { happy: 15, money: -2500, visual: 'explosion' }, mood: 'party' },
    ],
  },
  {
    id: 'so_camping_bear',
    icon: '🐻',
    cat: 'friends',
    rating: 2,
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    when: { age: [18, 60], has: 'anyFriend' },
    weight: 4,
    cooldown: 8,
    text: {
      fr: [
        "Camping sauvage entre potes. Bilan des bagages : 4 tentes, 48 bières, 0 eau, 0 lampe. Et à 3 h du matin, quelque chose de très gros renifle la tente de Mathieu, qui a dormi avec un saucisson dans le duvet.",
        "Week-end camping. Un ours débarque au milieu du feu de camp, attiré par l'odeur des chamallows et de Benoît, qui ne s'est pas lavé depuis jeudi.",
      ],
      en: [
        "Wild camping with friends. Packing list: 4 tents, 48 beers, 0 water, 0 flashlights. At 3 a.m., something very large is sniffing Matt's tent, who went to sleep with a salami in his sleeping bag.",
        "Camping weekend. A bear walks into the middle of the campfire, drawn by the smell of marshmallows and of Ben, who hasn't showered since Thursday.",
      ],
    },
    choices: [
      { label: { fr: 'Courir plus vite que Mathieu', en: 'Outrun Matt' }, text: { fr: "Je n'ai pas couru plus vite que l'ours. J'ai couru plus vite que Mathieu. Mathieu y a laissé un bras et le saucisson. Il me fait un doigt d'honneur depuis, avec le bras qui lui reste.", en: "I didn't outrun the bear. I outran Matt. Matt lost an arm and the salami. He's been flipping me off ever since, with his remaining arm." }, fx: { happy: -3, karma: -8, athletic: 3, visual: 'gore' }, mood: 'shock' },
      {
        label: { fr: 'Faire le mort', en: 'Play dead' },
        out: [
          { w: 2, text: { fr: "J'ai fait le mort. L'ours m'a reniflé, léché l'oreille, puis a fait caca à vingt centimètres de ma tête. Je n'ai pas bougé. J'ai un nouveau respect pour moi-même.", en: "I played dead. The bear sniffed me, licked my ear, then took a dump eight inches from my head. I didn't move. I have a new respect for myself." }, fx: { happy: 2, stress: 10, discipline: 4, visual: 'poop' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai fait le mort. L'ours a trouvé ça convaincant et a commencé à me manger. Il a commencé par la fesse gauche. Je l'ai eu à l'usure : j'ai été dégueulasse.", en: "I played dead. The bear found it convincing and started eating me. Left butt cheek first. I outlasted him: I tasted disgusting." }, fx: { health: -20, happy: -8, visual: 'gore' }, mood: 'cry' },
        ],
      },
      { label: { fr: "Combattre l'ours", en: 'Fight the bear' }, text: { fr: "J'ai combattu l'ours à mains nues, bourré{|e} comme une huître. On m'a retrouvé{|e} le lendemain en morceaux éparpillés autour d'une glacière vide. L'ours a terminé les bières.", en: "I fought the bear bare-handed, drunk as a skunk. They found me the next day in pieces scattered around an empty cooler. The bear finished the beers." }, fx: { die: { fr: "en défiant un ours à la boxe pendant un camping bien arrosé", en: 'challenging a bear to a boxing match during a boozy camping trip' }, visual: 'gore' }, mood: 'shock' },
    ],
  },
  {
    id: 'so_monopoly',
    icon: '🎲',
    cat: 'friends',
    rating: 2,
    scene: { place: 'apartment', mood: 'angry', fx: 'gore' },
    when: { age: [18, 75], has: 'anyFriend' },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Soirée Monopoly. Quatre heures de jeu. Sophie possède la rue de la Paix, trois hôtels et tes reins. Thomas vient d'être pris en train de voler à la banque. L'air sent la haine et la pizza froide.",
        "Le Monopoly dégénère : Julien refuse de payer le loyer de ta gare, invoque une règle « maison » inventée à l'instant, et brandit le fer à repasser en métal comme une arme.",
      ],
      en: [
        "Monopoly night. Four hours in. Sophie owns Boardwalk, three hotels and your kidneys. Tom just got caught stealing from the bank. The air smells of hatred and cold pizza.",
        "Monopoly is escalating: Julian refuses to pay rent on your railroad, invokes a 'house rule' invented on the spot and brandishes the metal iron token like a weapon.",
      ],
    },
    choices: [
      { label: { fr: 'Retourner le plateau', en: 'Flip the board' }, text: { fr: "J'ai retourné le plateau. Un hôtel en plastique s'est fiché dans l'œil de Thomas, qui a hurlé et giclé sur les billets de 500. Les billets de 500 sont devenus de vrais billets rouges. Partie annulée, amitiés aussi.", en: "I flipped the board. A plastic hotel lodged itself in Tom's eye; he screamed and squirted blood all over the $500 bills. Game canceled, friendships too." }, fx: { happy: 6, karma: -6, visual: 'gore', counter: 'so_fights' }, mood: 'angry' },
      {
        label: { fr: 'Duel au fer à repasser', en: 'Iron-token duel' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai esquivé le fer et contre-attaqué avec le chapeau haut-de-forme. Julien a perdu une incisive dans le pot de la Caisse de Communauté. Je l'ai gardée comme trophée.", en: "I dodged the iron and counterattacked with the top hat. Julian lost a front tooth into the Community Chest. I kept it as a trophy." }, fx: { happy: 8, athletic: 2, visual: 'gore', counter: 'so_fights' }, mood: 'proud' },
          { w: 1, text: { fr: "Le fer à repasser m'a ouvert l'arcade. J'ai pissé le sang sur Boulevard de Belleville. Aux urgences, le médecin a dit : « Encore un Monopoly ? » C'est le troisième ce soir.", en: "The iron split my eyebrow open. I bled all over Baltic Avenue. In the ER, the doctor said: 'Another Monopoly?' Third one tonight." }, fx: { health: -10, happy: -5, visual: 'gore', counter: 'so_fights' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Aller en prison exprès', en: 'Go to jail on purpose' }, text: { fr: "Je suis allé{|e} en prison volontairement et j'y suis resté{|e} deux heures sur mon téléphone pendant qu'ils s'entretuaient. Seul{|e} survivant{|e}. J'ai gagné par forfait.", en: "I went to jail on purpose and stayed there two hours on my phone while they killed each other. Sole survivor. I won by forfeit." }, fx: { happy: 5, smarts: 2 }, mood: 'neutral' },
    ],
  },
  {
    id: 'so_kid_uno',
    icon: '🃏',
    cat: 'family',
    rating: 0,
    actor: 'sibling',
    scene: { place: 'home', mood: 'angry' },
    when: { age: [6, 13] },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "Partie de Uno avec {a.first}. {a:Il|Elle} vient de poser un +4, puis un autre +4, puis de déclarer qu'il existe une règle « +4 sur +4 ça fait +12 ». Tu as 23 cartes en main.",
        "{a.first} triche au Uno, c'est sûr : {a:il|elle} a une carte cachée dans sa chaussette. Tu l'as vue dépasser.",
      ],
      en: [
        "Uno with {a.first}. {a:He|She} just played a +4, then another +4, then announced there's a rule that '+4 on +4 makes +12'. You have 23 cards in your hand.",
        "{a.first} is definitely cheating at Uno: {a.he} has a card hidden in {a.his} sock. You saw it sticking out.",
      ],
    },
    choices: [
      { label: { fr: 'Dénoncer aux parents', en: 'Tell the parents' }, text: { fr: "J'ai crié « MAMAAAAN ». {a.first} a été privé{a:|e} de dessert. J'ai gagné la guerre mais perdu le droit d'utiliser la télécommande pendant une semaine, « pour l'ambiance ».", en: "I yelled 'MOOOOM'. {a.first} lost dessert privileges. I won the war but lost TV remote rights for a week, 'for the atmosphere'." }, fx: { rel: -8, happy: 2 } },
      { label: { fr: 'Tricher plus fort', en: 'Cheat harder' }, text: { fr: "J'ai sorti trois cartes Joker que j'avais dessinées moi-même. {a.first} a protesté. J'ai dit que c'étaient des « éditions limitées ». On a fini en bataille de coussins.", en: "I pulled out three wild cards I'd drawn myself. {a.first} protested. I said they were 'limited editions'. It ended in a pillow fight." }, fx: { rel: 5, happy: 6, smarts: 1, karma: -1 }, mood: 'happy' },
      { label: { fr: 'Manger les cartes', en: 'Eat the cards' }, text: { fr: "J'ai mangé une carte +4 pour qu'on ne puisse plus jamais y jouer. C'était pas bon. {a.first} m'a regardé{|e} avec un mélange de peur et de respect.", en: "I ate a +4 card so nobody could ever play it again. It wasn't tasty. {a.first} looked at me with a mix of fear and respect." }, fx: { rel: 3, health: -1, happy: 3 }, mood: 'shock' },
    ],
  },
  {
    id: 'so_poker_night',
    icon: '♠️',
    cat: 'friends',
    rating: 1,
    vars: { amount: [100, 1500] },
    scene: { place: 'apartment', mood: 'neutral', prop: 'cards' },
    when: { age: [18, 80], has: 'anyFriend' },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "Soirée poker chez Fred. Cigares qui puent, chips au vinaigre et un pot qui monte à {$amount}. Fred a un tic à l'œil gauche quand il bluffe. Ou quand il a une conjonctivite.",
        "Poker entre potes. Tu as deux as. Ton pote Max fait tapis avec un sourire de crocodile. Le pot : {$amount}.",
      ],
      en: [
        "Poker night at Fred's. Stinky cigars, salt-and-vinegar chips and a pot climbing to {$amount}. Fred's left eye twitches when he bluffs. Or when he has pink eye.",
        "Poker with friends. You're holding two aces. Your buddy Max goes all-in with a crocodile smile. The pot: {$amount}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tapis !', en: 'All-in!' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "Tapis ! J'ai raflé {$amount}. J'ai fait une danse de la victoire sur la table et cassé une chaise. Je ne la rembourserai pas.", en: "All-in! I raked in {$amount}. I did a victory dance on the table and broke a chair. I'm not paying for it." }, fx: { money: 'amount', happy: 10, addiction: ['gambling', 4], counter: 'so_poker_wins', flag: 'so_poker_pro' }, mood: 'party' },
          { w: 2, text: { fr: "Tapis… perdu. Max avait un brelan de 7. J'ai perdu {$amount} et la dignité qu'il me restait. J'ai dû rentrer à pied, en pleurant un peu dans mon écharpe.", en: "All-in… lost. Max had three 7s. I lost {$amount} and whatever dignity I had left. I walked home crying a little into my scarf." }, fx: { money: '-amount', happy: -8, addiction: ['gambling', 6] }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Coucher mes cartes', en: 'Fold' }, text: { fr: "Je me suis couché{|e}. Max a montré sa main : un 2 et un 7 dépareillés. Il a ri pendant onze minutes. Je l'entends encore la nuit.", en: "I folded. Max showed his hand: an off-suit 2-7. He laughed for eleven minutes. I still hear it at night." }, fx: { happy: -3, smarts: 1 } },
      { label: { fr: 'Accuser Fred de tricher', en: 'Accuse Fred of cheating' }, text: { fr: "J'ai accusé Fred de tricher. On a fouillé ses manches : un as, deux rois et un Twix. Il a été banni de sa propre soirée poker. On a joué chez lui sans lui.", en: "I accused Fred of cheating. We searched his sleeves: an ace, two kings and a Twix. He got banned from his own poker night. We played at his place without him." }, fx: { happy: 6, karma: 2 }, mood: 'proud' },
    ],
  },
  {
    id: 'so_garage_poker',
    icon: '🔪',
    cat: 'friends',
    rating: 2,
    scene: { place: 'casino', mood: 'shock', fx: 'gore' },
    when: { age: [21, 70], flag: 'so_poker_pro' },
    weight: 4,
    cooldown: 6,
    text: {
      fr: [
        "Ta réputation au poker t'a valu une invitation au « vrai » tournoi : un garage à Aubervilliers, un néon qui grésille, et Dédé-la-Pince, qui ne joue pas d'argent mais des orteils. Le sien est déjà dans un bocal.",
        "Partie clandestine chez Dédé-la-Pince. Les mises : des phalanges. Il y a une glacière remplie de glaçons « pour les perdants ». Tu as une paire de dames.",
      ],
      en: [
        "Your poker reputation got you invited to the 'real' tournament: a garage on the wrong side of town, a buzzing neon light, and Dede the Pliers, who doesn't bet money but toes. His is already in a jar.",
        "Underground game at Dede the Pliers'. The stakes: finger bones. There's a cooler full of ice 'for the losers'. You've got a pair of queens.",
      ],
    },
    choices: [
      {
        label: { fr: 'Miser un orteil', en: 'Bet a toe' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai gagné. Dédé a perdu son deuxième orteil et m'a donné une mallette de 20 000 balles « pour le dérangement ». Il boite. Je dors avec un couteau.", en: "I won. Dede lost his second toe and gave me a briefcase with 20 grand 'for the trouble'. He limps. I sleep with a knife." }, fx: { money: 20000, happy: 10, addiction: ['gambling', 8], visual: 'money' }, mood: 'party' },
          { w: 1, text: { fr: "J'ai perdu. Dédé a sorti la pince. Mon petit orteil a giclé dans le bac à litière du chat du garage. Le chat l'a gardé. Je marche de travers depuis.", en: "I lost. Dede took out the pliers. My pinky toe flew into the garage cat's litter box. The cat kept it. I've been walking crooked ever since." }, fx: { health: -12, athletic: -5, happy: -10, visual: 'gore' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Fuir par le soupirail', en: 'Escape through the vent' }, text: { fr: "J'ai prétexté une envie pressante et je me suis enfui{|e} par le soupirail. Je suis resté{|e} coincé{|e} au niveau des hanches pendant vingt minutes, les fesses côté garage. Dédé m'a laissé{|e} partir, par pitié.", en: "I faked an urgent bathroom break and escaped through the vent. I got stuck at the hips for twenty minutes, butt facing the garage. Dede let me go, out of pity." }, fx: { happy: -4, stress: 6, unflag: 'so_poker_pro' }, mood: 'shock' },
      { label: { fr: 'Appeler les flics', en: 'Call the cops' }, text: { fr: "J'ai appelé les flics depuis les toilettes. Descente, sirènes, Dédé menotté avec son bocal d'orteils. Je suis officiellement une balance. Je ne joue plus au poker nulle part.", en: "I called the cops from the bathroom. Raid, sirens, Dede cuffed with his jar of toes. I'm officially a snitch. I can't play poker anywhere anymore." }, fx: { karma: 4, happy: -2, heat: -5, unflag: 'so_poker_pro', visual: 'police' }, mood: 'neutral' },
    ],
  },
  {
    id: 'so_house_party',
    icon: '🎉',
    cat: 'social',
    rating: 2,
    scene: { place: 'apartment', mood: 'party', fx: 'poop' },
    when: { age: [18, 45], movedOut: true },
    weight: 6,
    cooldown: 4,
    text: {
      fr: [
        "Tu organises une petite soirée « entre quelques amis ». À minuit, 140 inconnus sont chez toi, quelqu'un fait un barbecue sur ton balcon et il y a une chèvre dans ta cuisine. Personne ne sait d'où elle vient.",
        "Ta crémaillère a été partagée sur TikTok. Il y a la queue dans l'escalier. Un type en slip léopard a vomi dans ton aquarium et quelqu'un a fait caca dans ta baignoire. Dans la baignoire. Pas les toilettes. La baignoire.",
      ],
      en: [
        "You're throwing a little get-together 'with a few friends'. By midnight, 140 strangers are in your place, someone's grilling on your balcony and there's a goat in your kitchen. Nobody knows where it came from.",
        "Your housewarming got posted on TikTok. There's a line down the stairs. A guy in leopard briefs puked in your fish tank and someone pooped in your bathtub. In the tub. Not the toilet. The tub.",
      ],
    },
    choices: [
      { label: { fr: 'Couper la musique', en: 'Kill the music' }, text: { fr: "J'ai coupé la musique et hurlé « TOUT LE MONDE DEHORS ». La foule m'a hué{|e}, puis porté{|e} sur ses épaules, puis jeté{|e} dans la baignoire. Oui, celle-là.", en: "I killed the music and screamed 'EVERYBODY OUT'. The crowd booed me, then crowd-surfed me, then dropped me in the bathtub. Yes, that one." }, fx: { happy: -10, health: -4, money: -600, visual: 'poop' }, mood: 'cry' },
      { label: { fr: 'Faire payer l\'entrée', en: 'Charge admission' }, text: { fr: "J'ai posté un videur (un voisin de 120 kilos) et fait payer 10 balles l'entrée. J'ai remboursé les dégâts et il m'en reste. La chèvre fait maintenant partie du staff.", en: "I posted a bouncer (a 260-pound neighbor) and charged $10 a head. I covered the damages with change left over. The goat is staff now." }, fx: { money: 900, happy: 10, smarts: 2 }, mood: 'party' },
      { label: { fr: 'Me défoncer avec eux', en: 'Get wrecked with them' }, text: { fr: "Si on ne peut pas les battre… Je me suis réveillé{|e} trois jours plus tard sur le toit de l'immeuble, en string, enlaçant la chèvre. Mon appartement n'a plus de porte.", en: "If you can't beat them… I woke up three days later on the roof of the building, in a thong, spooning the goat. My apartment no longer has a door." }, fx: { happy: 8, health: -10, money: -2000, addiction: ['alcohol', 8] }, mood: 'sleepy' },
    ],
  },

  // ───────────────────────────── group chats ─────────────────────────────
  {
    id: 'so_groupchat_leak',
    icon: '📲',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'apartment', mood: 'shock', prop: 'phone' },
    when: { age: [18, 65] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Tu voulais envoyer « {a.first} est d'une chiantise mortelle avec son bébé, je vais me pendre » au groupe secret. Tu l'as envoyé au groupe principal. Où se trouve {a.first}. Deux coches bleues.",
        "Quelqu'un a fait une capture d'écran du groupe « Sans {a.first} » et l'a envoyée à {a.first}. Ton message le plus récent : un sondage « on lui dit pour son haleine ? ».",
      ],
      en: [
        "You meant to send '{a.first} is so fucking boring with that baby, I'm gonna hang myself' to the secret chat. You sent it to the main chat. Where {a.first} is. Two blue ticks.",
        "Someone screenshotted the 'No {a.first}' group chat and sent it to {a.first}. Your latest message: a poll, 'do we tell {a.him} about the breath?'.",
      ],
    },
    choices: [
      { label: { fr: 'Prétendre un piratage', en: 'Claim I was hacked' }, text: { fr: "J'ai prétendu qu'on m'avait piraté{|e}. Personne n'y a cru, surtout pas {a.first}, qui a fait remarquer que mon « hacker » faisait les mêmes fautes d'orthographe que moi.", en: "I claimed I'd been hacked. Nobody bought it, least of all {a.first}, who pointed out my 'hacker' makes the same typos I do." }, fx: { rel: -20, karma: -3, happy: -4 }, mood: 'shock' },
      { label: { fr: 'Assumer et m\'excuser', en: 'Own it and apologize' }, text: { fr: "Je me suis excusé{|e} platement, avec un bouquet et un dentifrice premium. {a.first} a ri, puis pleuré, puis acheté le dentifrice. On est réconciliés. Plus ou moins.", en: "I apologized profusely, with flowers and premium toothpaste. {a.first} laughed, then cried, then used the toothpaste. We're good. Mostly." }, fx: { rel: -5, karma: 3, money: -40 } },
      { label: { fr: 'Quitter le groupe', en: 'Leave the chat' }, text: { fr: "J'ai quitté le groupe, éteint mon téléphone et je suis parti{|e} en randonnée sans réseau pendant une semaine. À mon retour, plus personne ne m'invitait nulle part.", en: "I left the chat, turned off my phone and went hiking off-grid for a week. When I came back, nobody invited me anywhere anymore." }, fx: { rel: -15, happy: -6, athletic: 2 }, mood: 'sad' },
    ],
  },
  {
    id: 'so_groupchat_teen',
    icon: '🤳',
    cat: 'social',
    rating: 0,
    scene: { place: 'school', mood: 'shock', prop: 'phone' },
    when: { age: [12, 17], school: ['middle', 'high'] },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "Quelqu'un a posté sur le groupe de la classe une photo de toi en train de dormir en cours, la bouche ouverte, avec un filet de bave. 312 réactions. Ton surnom est désormais « L'Escargot ».",
        "Le groupe de la classe a été renommé « Ceux qui ont vu {first} tomber dans l'escalier ». Il y a une vidéo. Au ralenti. Avec de la musique dramatique.",
      ],
      en: [
        "Someone posted a photo of you sleeping in class on the class group chat, mouth open, drool and all. 312 reactions. Your nickname is now 'The Snail'.",
        "The class group chat got renamed 'Those who saw {first} fall down the stairs'. There's a video. In slow motion. With dramatic music.",
      ],
    },
    choices: [
      { label: { fr: 'En rire avec eux', en: 'Laugh along' }, text: { fr: "J'ai répondu avec un sticker d'escargot qui fait un clin d'œil. Tout le monde a trouvé ça classe. Le surnom est resté, mais avec respect.", en: "I replied with a sticker of a winking snail. Everyone thought it was classy. The nickname stuck, but with respect." }, fx: { happy: 4, looks: 1 }, mood: 'happy' },
      { label: { fr: 'Contre-attaquer', en: 'Strike back' }, text: { fr: "J'ai posté une photo du coupable en train de se curer le nez au CDI. Guerre totale. On a tous été privés de téléphone par la CPE. La paix par l'épuisement.", en: "I posted a photo of the culprit picking his nose in the library. Total war. The vice principal confiscated everyone's phones. Peace through exhaustion." }, fx: { happy: 3, karma: -2, discipline: -2 }, mood: 'angry' },
      { label: { fr: 'Pleurer aux toilettes', en: 'Cry in the bathroom' }, text: { fr: "J'ai passé la pause de midi enfermé{|e} dans les toilettes. Une fille de troisième m'a glissé un mouchoir sous la porte. On est potes maintenant. Enfin, je crois.", en: "I spent lunch break locked in a bathroom stall. An older kid slid a tissue under the door. I think we're friends now." }, fx: { happy: -6, stress: 4 }, mood: 'cry' },
    ],
  },

  // ───────────────────────────── making new friends ─────────────────────────────
  {
    id: 'so_new_neighbor',
    icon: '🏘️',
    cat: 'friends',
    rating: 0,
    actor: { create: { role: 'acquaintance', age: [-8, 8], gender: 'any' } },
    scene: { place: 'apartment', mood: 'happy' },
    when: { age: [20, 75], movedOut: true },
    weight: 8,
    cooldown: 5,
    text: {
      fr: [
        "{a:Ton nouveau voisin|Ta nouvelle voisine}, {a.first}, frappe à ta porte avec une tarte aux pommes encore chaude et un sourire un peu trop large. « Je me suis dit qu'on pourrait être amis ! »",
        "{a.first}, {a:ton voisin|ta voisine} du dessus, te demande si tu peux lui prêter du sel. Puis du beurre. Puis de la farine. Puis {a:il|elle} te propose de manger le gâteau avec elle.",
      ],
      en: [
        "Your new neighbor, {a.first}, knocks with a still-warm apple pie and a slightly too-wide smile. 'I thought we could be friends!'",
        "{a.first}, your upstairs neighbor, asks to borrow some salt. Then butter. Then flour. Then invites you to eat the cake together.",
      ],
    },
    choices: [
      { label: { fr: "L'inviter à entrer", en: 'Invite them in' }, text: { fr: "J'ai invité {a.first} à entrer. On a parlé jusqu'à minuit de nos voisins communs, surtout du type du troisième qui passe l'aspirateur à 6 h. Un lien sacré est né.", en: "I invited {a.first} in. We talked until midnight about the other neighbors, especially the third-floor guy who vacuums at 6 a.m. A sacred bond was born." }, fx: { happy: 8, rel: 30, actorRole: 'friend', counter: 'so_friends_made' }, mood: 'happy' },
      { label: { fr: 'Prendre la tarte et fermer', en: 'Take the pie, close the door' }, text: { fr: "J'ai pris la tarte, dit « merci, bisous » et refermé la porte. La tarte était délicieuse. {a.first} me dit bonjour très sèchement depuis.", en: "I took the pie, said 'thanks, bye' and shut the door. The pie was delicious. {a.first} has greeted me very coldly ever since." }, fx: { happy: 3, karma: -2 } },
      { label: { fr: 'Faire semblant de ne pas être là', en: 'Pretend not to be home' }, text: { fr: "Je me suis jeté{|e} au sol et j'ai rampé jusqu'à la salle de bains. {a.first} a laissé la tarte sur le paillasson. Un pigeon l'a mangée. Le pigeon et moi, on ne s'est rien dit.", en: "I threw myself on the floor and crawled to the bathroom. {a.first} left the pie on the doormat. A pigeon ate it. The pigeon and I didn't discuss it." }, fx: { happy: -2, stress: 2 } },
    ],
  },
  {
    id: 'so_kid_new_friend',
    icon: '🧃',
    cat: 'friends',
    rating: 0,
    actor: { create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    scene: { place: 'school', mood: 'happy' },
    when: { age: [5, 11], school: 'primary' },
    weight: 8,
    cooldown: 2,
    text: {
      fr: [
        "Un nouvel élève, {a.first}, est assis{a:|e} tout{a:|e} seul{a:|e} à la cantine avec une boîte à goûter en forme de dinosaure. Elle est incroyable. {a:Il|Elle} a l'air triste.",
        "{a.first}, de la classe d'à côté, a construit le plus grand château de sable de l'histoire de la cour de récré. Il manque une tour. Tu as une pelle.",
      ],
      en: [
        "A new kid, {a.first}, is sitting alone in the cafeteria with a dinosaur-shaped lunchbox. It's amazing. {a:He|She} looks sad.",
        "{a.first}, from the class next door, built the biggest sandcastle in playground history. It's missing a tower. You have a shovel.",
      ],
    },
    choices: [
      { label: { fr: "M'asseoir à côté", en: 'Sit next to them' }, text: { fr: "Je me suis assis{|e} à côté de {a.first}. On a échangé nos desserts et découvert qu'on détestait tous les deux les épinards. Amis pour la vie.", en: "I sat next to {a.first}. We traded desserts and discovered we both hate spinach. Friends for life." }, fx: { happy: 8, karma: 3, rel: 30, actorRole: 'friend', counter: 'so_friends_made' }, mood: 'happy' },
      { label: { fr: 'Proposer un échange', en: 'Propose a trade' }, text: { fr: "J'ai proposé mon yaourt contre la boîte dinosaure. {a.first} a refusé, mais m'a laissé{|e} la tenir cinq minutes. C'est le début d'une belle amitié.", en: "I offered my yogurt for the dinosaur lunchbox. {a.first} said no, but let me hold it for five minutes. The start of a beautiful friendship." }, fx: { happy: 5, rel: 20, smarts: 1, actorRole: 'friend', counter: 'so_friends_made' } },
      { label: { fr: 'Rester avec ma bande', en: 'Stick with my crew' }, text: { fr: "Je suis resté{|e} avec ma bande. Le lendemain, {a.first} était entouré{a:|e} de dix enfants. La boîte dinosaure, c'est un aimant à amis.", en: "I stayed with my crew. The next day, {a.first} was surrounded by ten kids. That dinosaur lunchbox is a friend magnet." }, fx: { happy: -1 } },
    ],
  },
  {
    id: 'so_teen_new_friend',
    icon: '🖤',
    cat: 'friends',
    rating: 0,
    actor: { create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    scene: { place: 'school', mood: 'neutral' },
    when: { age: [12, 17], school: ['middle', 'high'] },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "{a.first}, l'élève gothique qui mange seul{a:|e} au fond du self, te fait signe de t'asseoir. {a:Il|Elle} lit un livre sur les pharaons et porte du vernis noir. Tout le monde dit qu'{a:il|elle} est bizarre.",
        "{a.first}, de ta classe, a le même tee-shirt de groupe obscur que toi. Personne d'autre au monde ne connaît ce groupe. Même pas le groupe, apparemment.",
      ],
      en: [
        "{a.first}, the goth kid who eats alone at the back of the cafeteria, waves you over. {a:He|She}'s reading a book about pharaohs and wears black nail polish. Everyone says {a.he}'s weird.",
        "{a.first}, from your class, is wearing the same obscure band T-shirt as you. Nobody else on Earth knows that band. Not even the band, apparently.",
      ],
    },
    choices: [
      { label: { fr: "M'asseoir avec {a.him}", en: 'Sit with them' }, text: { fr: "Je me suis assis{|e} avec {a.first}. On a parlé momies, musique et profs insupportables. Finalement, c'est la personne la plus drôle du collège.", en: "I sat with {a.first}. We talked mummies, music and unbearable teachers. Turns out {a.he}'s the funniest person in school." }, fx: { happy: 7, rel: 30, karma: 2, actorRole: 'friend', counter: 'so_friends_made' }, mood: 'happy' },
      { label: { fr: 'Lancer un club ensemble', en: 'Start a club together' }, text: { fr: "{a.first} et moi avons créé le Club des Choses Bizarres. Nous sommes deux membres. Nous sommes extrêmement sélectifs.", en: "{a.first} and I founded the Weird Stuff Club. We have two members. We're extremely selective." }, fx: { happy: 8, rel: 25, smarts: 2, actorRole: 'friend', counter: 'so_friends_made' }, mood: 'proud' },
      { label: { fr: 'Ignorer pour ma réputation', en: 'Ignore them for my rep' }, text: { fr: "J'ai fait semblant de ne pas voir {a.first}. Ma réputation est intacte. Ma conscience, un peu moins.", en: "I pretended not to see {a.first}. My reputation is intact. My conscience, slightly less." }, fx: { karma: -3, happy: -1 } },
    ],
  },
  {
    id: 'so_copycat',
    icon: '🪞',
    cat: 'social',
    rating: 0,
    actor: { create: { role: 'acquaintance', age: [-5, 5], gender: 'same' } },
    scene: { place: 'office', mood: 'shock' },
    when: { age: [18, 60] },
    weight: 5,
    once: true,
    text: {
      fr: ["{a.first}, une connaissance, a la même coupe que toi. Puis les mêmes lunettes. Puis le même chien, avec le même nom. Ce matin, {a:il|elle} a raconté TA blague sur les pingouins, avec TES gestes.", "{a.first} t'imite. Tes vêtements, ton rire, ton plat préféré, ton expression « c'est pas faux ». {a:Il|Elle} s'est même inscrit{a:|e} à ton cours de céramique. {a:Il|Elle} est meilleur{a:|e} que toi.", "{a.first} est arrivé{a:|e} à la soirée avec la même tenue que toi, {w:object} compris. Les gens demandent si c'est un concept. {a:Il|Elle} répond « oui » à ta place.", "Depuis que tu as posté une photo de toi avec {w:animal}, {a.first} a adopté exactement le même animal. Même nom. Même collier.", "{a.first} a commandé {w:food} au resto, comme toi, avec la même phrase, au mot près. Puis {a:il|elle} t'a regardé{|e} et a souri. Tu as peur."],
      en: ["{a.first}, an acquaintance, has the same haircut as you. Then the same glasses. Then the same dog, with the same name. This morning, {a.he} told YOUR penguin joke, with YOUR hand gestures.", "{a.first} is copying you. Your clothes, your laugh, your favorite dish, your catchphrase. {a:He|She} even signed up for your pottery class. {a:He|She}'s better at it than you.", "{a.first} showed up at the party in the same outfit as you, {w:object} included. People ask if it's a theme. {a:He|She} answers 'yes' for you.", "Ever since you posted a photo of yourself with {w:animal}, {a.first} has adopted the exact same animal. Same name. Same collar.", "{a.first} ordered {w:food} at the restaurant, like you, with the exact same words. Then {a.he} looked at you and smiled. You're scared."],
    },
    choices: [
      { label: { fr: 'Confronter le clone', en: 'Confront the clone' }, text: { fr: ["J'ai confronté {a.first}. {a:Il|Elle} m'a répondu exactement ce que j'aurais répondu, avec mon intonation. J'ai eu un vertige existentiel en pleine rue.", "J'ai crié « {w:exclaim} Arrête de me copier ! ». {a.first} a crié « {w:exclaim} Arrête de me copier ! ». Les passants nous ont pris pour un duo comique."], en: ["I confronted {a.first}. {a:He|She} replied exactly what I would've said, in my exact tone. I had an existential crisis on the sidewalk.", "I yelled '{w:exclaim} Stop copying me!'. {a.first} yelled '{w:exclaim} Stop copying me!'. Passers-by thought we were a comedy duo."] }, fx: { happy: -4, stress: 6 }, mood: 'shock' },
      { label: { fr: 'Tout changer pour {a:le|la} piéger', en: 'Change everything to trap them' }, text: { fr: ["J'ai adopté une moustache, un béret et une passion feinte pour le curling. Une semaine plus tard, {a.first} avait une moustache, un béret et un match de curling. Je suis piégé{|e} dans le béret.", "Je me suis mis{|e} à {w:activity} pour {a:le|la} semer. Une semaine plus tard, {a.first} le faisait mieux que moi, sur Instagram, avec 4 000 likes."], en: ["I adopted a mustache, a beret and a fake passion for curling. A week later, {a.first} had a mustache, a beret and a curling match. Now I'm stuck with the beret.", "I took up {w:activity} to shake {a:him|her} off. A week later, {a.first} was doing it better than me, on Instagram, with 4,000 likes."] }, fx: { happy: 3, looks: -3, smarts: 1 }, mood: 'neutral' },
      { label: { fr: 'Devenir ami{|e}s', en: 'Become friends' }, text: { fr: ["Si on ne peut pas battre son clone… On est devenus amis. On s'habille pareil le mardi. Les gens nous prennent pour des jumeaux et nous offrent des boissons.", "On est devenus amis. Maintenant, on achète {w:object} en double, par principe. Notre psy commun dit que c'est « fusionnel »."], en: ["If you can't beat your clone… We became friends. We dress alike on Tuesdays. People think we're twins and buy us drinks.", "We became friends. Now we buy {w:object} in pairs, on principle. Our shared therapist calls it 'enmeshed'."] }, fx: { happy: 6, rel: 30, actorRole: 'friend', counter: 'so_friends_made' }, mood: 'happy' },
    ],
  },
  {
    id: 'so_coworker_friend',
    icon: '☕',
    cat: 'friends',
    rating: 0,
    actor: 'coworker',
    scene: { place: 'office', mood: 'happy', prop: 'coffee' },
    when: { age: [18, 67], job: true },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["{a.first}, {a.rel}, t'attend tous les matins à la machine à café pour commenter la vie amoureuse de la compta. Aujourd'hui, {a:il|elle} te propose de déjeuner ensemble « en dehors du bureau, comme des vrais gens ».", "{a.first} et toi êtes les deux seuls à trouver le DRH ridicule. Vous communiquez par regards en réunion. {a:Il|Elle} te propose un verre après le boulot.", "{a.first}, {a.rel}, partage avec toi {w:food} tous les midis, avec des ragots sur le chef en dessert. Aujourd'hui, {a:il|elle} te propose un verre « pour de vrai, hors du bureau ».", "En réunion, {a.first} t'envoie des messages privés sur la cravate du directeur, qui représente {w:animal}. Tu étouffes un fou rire. {a:Il|Elle} te propose de déjeuner ensemble.", "{a.first}, de la machine à café, connaît déjà ton prénom, ton signe astro et ta passion secrète pour {w:hobby}. {a:Il|Elle} veut devenir ton ami{a:|e}."],
      en: ["{a.first}, your coworker, waits for you at the coffee machine every morning to gossip about accounting's love lives. Today {a.he} suggests having lunch together 'outside the office, like real people'.", "{a.first} and you are the only two who find the HR director ridiculous. You communicate with looks during meetings. {a:He|She} asks you out for a drink after work.", "{a.first}, your coworker, shares {w:food} with you every lunch, with gossip about the boss for dessert. Today {a.he} suggests drinks 'for real, outside the office'.", "In meetings, {a.first} DMs you comments about the director's tie, which features {w:animal}. You stifle a giggle. {a:He|She} asks you to lunch.", "{a.first} from the coffee machine already knows your name, your star sign and your secret passion for {w:hobby}. {a:He|She} wants to be friends."],
    },
    choices: [
      { label: { fr: 'Accepter', en: 'Accept' }, text: { fr: ["On a déjeuné ensemble et parlé de tout sauf du boulot. Enfin, surtout du boulot. Mais en disant du mal. {a.first} est officiellement {a:mon pote|ma pote} du bureau.", "On a déjeuné {w:at_place} et refait le monde. {a.first} est désormais mon allié{a:|e} officiel{a:|le} contre les réunions inutiles."], en: ["We had lunch and talked about everything but work. Well, mostly work. But trash-talking it. {a.first} is officially my work bestie.", "We had lunch {w:at_place} and set the world to rights. {a.first} is now my official ally against pointless meetings."] }, fx: { happy: 7, rel: 20, stress: -4, actorRole: 'friend', counter: 'so_friends_made' }, mood: 'happy' },
      { label: { fr: 'Garder mes distances', en: 'Keep my distance' }, text: { fr: ["J'ai décliné. « Pas d'amis au boulot », c'est ma règle. Je mange seul{|e} devant mon écran en regardant des vidéos de sauvetage de chatons. C'est très sain.", "J'ai refusé poliment. Le lendemain, {a.first} déjeunait avec tout l'étage en riant. J'ai mangé {w:food} seul{|e}, face au mur."], en: ["I declined. 'No friends at work' is my rule. I eat alone at my desk watching kitten rescue videos. Very healthy.", "I politely declined. The next day, {a.first} was having lunch with the whole floor, laughing. I ate {w:food} alone, facing the wall."] }, fx: { rel: -5, perf: 2 } },
      { label: { fr: 'Créer un club secret', en: 'Start a secret club' }, text: { fr: ["On a fondé le Club des Anti-DRH. On se réunit dans la salle de reprographie. On a des badges. Le DRH ne se doute de rien. Je n'ai jamais autant aimé aller au travail.", "Notre club secret a désormais un mot de passe : « {w:food} ». On l'a dit trop fort en réunion. Le DRH a commandé à manger."], en: ["We founded the Anti-HR Club. We meet in the copy room. We have badges. HR suspects nothing. I've never enjoyed work this much.", "Our secret club now has a password: '{w:food}'. We said it too loudly in a meeting. HR ordered takeout."] }, fx: { happy: 10, rel: 25, perf: -3, actorRole: 'friend', counter: 'so_friends_made' }, mood: 'party' },
    ],
  },
  {
    id: 'so_coworker_tattoo',
    icon: '🍑',
    cat: 'friends',
    rating: 2,
    actor: 'coworker',
    scene: { place: 'party', mood: 'party' },
    when: { age: [21, 60], job: true },
    weight: 5,
    cooldown: 6,
    text: {
      fr: [
        "Afterwork qui dérape avec {a.first}, {a.rel}. 2 h du matin, un salon de tatouage ouvert 24 h/24, deux pintes de trop. {a:Il|Elle} propose que vous vous tatouiez le visage de l'autre. Sur la fesse.",
        "Pot de départ d'un collègue. À la troisième tournée de shots, {a.first} te met au défi de faxer tes fesses au siège social. Le fax est juste là. Il fonctionne encore.",
      ],
      en: [
        "Afterwork drinks with {a.first}, your coworker, go off the rails. 2 a.m., a 24-hour tattoo parlor, two pints too many. {a:He|She} suggests you each get the other's face tattooed. On your butt.",
        "A colleague's farewell drinks. Third round of shots: {a.first} dares you to fax your butt to headquarters. The fax machine is right there. It still works.",
      ],
    },
    choices: [
      { label: { fr: 'Tope là', en: "You're on" }, text: { fr: "On l'a fait. J'ai la tête de {a.first} sur la fesse gauche, avec un regard inquiétant. {a:Il|Elle} a la mienne, mais le tatoueur a raté le nez. On est liés à vie, que ça nous plaise ou non.", en: "We did it. I have {a.first}'s face on my left cheek, with an unsettling stare. {a:He|She} has mine, but the artist botched the nose. We're bonded for life, whether we like it or not." }, fx: { rel: 30, happy: 8, money: -250, looks: -2, actorRole: 'friend' }, mood: 'party' },
      {
        label: { fr: 'Faxer mes fesses', en: 'Fax my butt' },
        out: [
          { w: 1, text: { fr: "J'ai faxé mes fesses au siège. Le PDG a cru à une œuvre d'art et l'a fait encadrer dans le hall. Personne ne sait que c'est moi. Je passe devant tous les jours.", en: "I faxed my butt to HQ. The CEO thought it was art and had it framed in the lobby. Nobody knows it's me. I walk past it every day." }, fx: { happy: 12, rel: 15, actorRole: 'friend' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai faxé mes fesses. Le fax a coincé. Puis s'est rallumé. Puis a imprimé 400 copies dans le bureau de la DRH. Mon tatouage de dauphin m'a trahi{|e}. Viré{|e}.", en: "I faxed my butt. The fax jammed. Then rebooted. Then printed 400 copies in the HR director's office. My dolphin tattoo gave me away. Fired." }, fx: { happy: -6, rel: 10, fired: true }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Rentrer dignement', en: 'Go home with dignity' }, text: { fr: "Je suis rentré{|e} dignement. {a.first} est venu{a:|e} travailler lundi avec le visage du tatoueur sur la fesse. {a:Il|Elle} a refusé de nous dire pourquoi.", en: "I went home with dignity. {a.first} came to work Monday with the tattoo artist's face on {a.his} butt. {a:He|She} won't tell us why." }, fx: { rel: -5, discipline: 3 } },
    ],
  },

  // ───────────────────────────── frenemies & toxic friends ─────────────────────────────
  {
    id: 'so_frenemy',
    icon: '🐍',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'angry' },
    when: { age: [18, 70] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "{a.first} te serre dans ses bras : « T'as trop bonne mine ! T'as pris un peu, non ? Ça te va bien, ça fait… rassurant. » Puis {a:il|elle} te montre ses photos de vacances aux Maldives. Toutes les 214.",
        "Dîner chez {a.first}, qui t'a placé{|e} à côté de son ex et en face d'un miroir. « Je savais que tu adorerais ! » {a:Il|Elle} te sert un vin « pas cher, tu verras pas la différence ».",
      ],
      en: [
        "{a.first} hugs you: 'You look great! Did you put on a little? It suits you, it's… reassuring.' Then {a.he} shows you {a.his} Maldives vacation photos. All 214.",
        "Dinner at {a.first}'s, who seated you next to {a.his} ex and across from a mirror. 'I knew you'd love it!' {a:He|She} pours you a wine that's 'cheap, you won't notice the difference'.",
      ],
    },
    choices: [
      { label: { fr: 'Compliment empoisonné', en: 'Poisoned compliment' }, text: { fr: "J'ai répondu : « Toi aussi t'es super ! Ton nouveau nez, on le voit presque pas. » Le silence qui a suivi était d'une pureté cristalline. Partie nulle.", en: "I replied: 'You look great too! Your new nose, you can barely tell.' The silence that followed was crystal-clear. Tie game." }, fx: { rel: -10, happy: 6, karma: -2 }, mood: 'proud' },
      { label: { fr: 'Encaisser en souriant', en: 'Smile and take it' }, text: { fr: "J'ai souri jusqu'à avoir des crampes aux joues. Je suis rentré{|e} et j'ai regardé mon reflet pendant une heure. Merde, j'ai vraiment pris un peu.", en: "I smiled until my cheeks cramped. I went home and stared at my reflection for an hour. Shit, I really did put on a little." }, fx: { happy: -6, stress: 4 }, mood: 'sad' },
      { label: { fr: 'Rompre officiellement', en: 'Officially break up' }, text: { fr: "Je lui ai annoncé que notre amitié était terminée, avec un discours préparé et une boîte contenant tous ses cadeaux de merde. Je me sens 10 kilos plus léger{|e}. Ironiquement.", en: "I told {a.him} our friendship was over, with a prepared speech and a box of all the shitty gifts {a.he} ever gave me. I feel 20 pounds lighter. Ironically." }, fx: { happy: 8, actorRole: 'enemy', rel: -30 }, mood: 'proud' },
    ],
  },
  {
    id: 'so_toxic_friend',
    icon: '☣️',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'apartment', mood: 'angry', fx: 'poop' },
    when: { age: [18, 65] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "{a.first} ne t'appelle que quand {a:il|elle} est en crise. 23 h, en larmes, pour la neuvième fois ce mois-ci. Mais quand tu as eu ton accident, {a:il|elle} a liké la photo du plâtre et c'est tout. Ce soir, c'est son anniversaire. Tu as fait des brownies.",
        "{a.first} a encore « oublié » son portefeuille au resto, flirté avec ta moitié et raconté ton secret le plus honteux à des inconnus. Il te reste une boîte de laxatifs et un moule à gâteau.",
      ],
      en: [
        "{a.first} only calls you when {a.he}'s in crisis. 11 p.m., sobbing, ninth time this month. But when you had your accident, {a.he} liked the photo of your cast and that was it. Tonight is {a.his} birthday. You made brownies.",
        "{a.first} 'forgot' {a.his} wallet at the restaurant again, flirted with your partner and told strangers your most embarrassing secret. You have a box of laxatives and a cake pan.",
      ],
    },
    choices: [
      { label: { fr: 'Brownies spéciaux', en: 'Special brownies' }, text: { fr: "J'ai offert mes brownies « maison » à {a.first}. Vingt minutes plus tard, {a:il|elle} a repeint les toilettes du bar, le couloir et la jambe du videur. J'ai demandé un discours. {a:Il|Elle} n'a pas pu. Meilleure soirée de ma vie.", en: "I gave {a.first} my 'homemade' brownies. Twenty minutes later, {a.he} repainted the bar's bathroom, the hallway and the bouncer's leg. I asked for a speech. {a:He|She} couldn't. Best night of my life." }, fx: { happy: 12, karma: -10, rel: -40, actorRole: 'enemy', visual: 'poop' }, mood: 'party' },
      { label: { fr: 'Couper les ponts', en: 'Cut them off' }, text: { fr: "J'ai bloqué {a.first} partout, supprimé son numéro et changé de boulangerie, au cas où. Je dors mieux. Mes brownies, je les ai mangés seul{|e}. Tous.", en: "I blocked {a.first} everywhere, deleted {a.his} number and switched bakeries, just in case. I sleep better. I ate the brownies alone. All of them." }, fx: { happy: 6, stress: -8, weight: 0.02, actorGone: true }, mood: 'proud' },
      { label: { fr: 'Rester, comme toujours', en: 'Stay, as always' }, text: { fr: "Je suis resté{|e}. {a.first} a pleuré sur mon épaule toute la soirée à propos de son ex, puis m'a demandé 50 balles pour le taxi. Je suis un paillasson avec un cœur.", en: "I stayed. {a.first} cried on my shoulder all night about {a.his} ex, then asked me for 50 bucks for a cab. I'm a doormat with a heart." }, fx: { happy: -8, stress: 6, money: -50, rel: 5 }, mood: 'sad' },
    ],
  },
  {
    id: 'so_ghosting_you',
    icon: '📵',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'apartment', mood: 'neutral', prop: 'phone' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "{a.first} t'a écrit « on se fait un verre ? » il y a sept mois. Tu n'as jamais répondu. Chaque jour, la notification te regarde. Chaque jour, elle est plus lourde.",
        "Tu as volontairement ignoré les trois derniers appels de {a.first}. Aujourd'hui, {a:il|elle} t'a envoyé « t'es mort{|e} ou quoi ? ». Techniquement non.",
      ],
      en: [
        "{a.first} texted you 'grab a drink?' seven months ago. You never answered. Every day, the notification stares at you. Every day, it gets heavier.",
        "You deliberately ignored {a.first}'s last three calls. Today {a.he} texted 'are you dead or what?'. Technically no.",
      ],
    },
    choices: [
      { label: { fr: 'Répondre comme si de rien', en: 'Reply like nothing happened' }, text: { fr: "J'ai répondu « grave, jeudi ? » comme si sept mois ne s'étaient pas écoulés. {a.first} a répondu « grave ». On n'en parlera jamais. C'est ça, l'amitié adulte.", en: "I replied 'totally, Thursday?' as if seven months hadn't passed. {a.first} replied 'totally'. We'll never talk about it. That's adult friendship." }, fx: { rel: 10, happy: 4 }, mood: 'happy' },
      { label: { fr: 'Inventer une excuse épique', en: 'Invent an epic excuse' }, text: { fr: "J'ai prétendu avoir été coincé{|e} dans une retraite spirituelle sans réseau au Tibet. {a.first} a vu mes stories de kebab à Roubaix. Putain d'Instagram.", en: "I claimed I'd been stuck at a spiritual retreat in Tibet with no signal. {a.first} had seen my kebab stories from Cleveland. Fucking Instagram." }, fx: { rel: -10, karma: -2, happy: -2 }, mood: 'shock' },
      { label: { fr: 'Continuer le ghosting', en: 'Keep ghosting' }, text: { fr: "J'ai continué à ghoster {a.first}. {a:Il|Elle} a fini par me laisser tranquille. Parfois, la nuit, je me demande ce que voulait dire ce « on se fait un verre ».", en: "I kept ghosting {a.first}. {a:He|She} eventually let it go. Sometimes, at night, I wonder what that 'grab a drink' might have meant." }, fx: { happy: -3, actorGone: true, visual: 'ghost' }, mood: 'sad' },
    ],
  },
  {
    id: 'so_friend_influencer',
    icon: '📸',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'studio', mood: 'angry', prop: 'phone' },
    when: { age: [18, 50], era: [2012, 2100] },
    weight: 6,
    once: true,
    text: {
      fr: [
        "{a.first} est devenu{a:|e} {a:influenceur|influenceuse} lifestyle. Sa vidéo la plus vue : « Ma meilleure amie fait ses courses comme une pauvre 😂 ». C'est toi, au rayon promo, en jogging. 3 millions de vues.",
        "{a.first} te filme en permanence pour son contenu. Ton chagrin d'amour est devenu « POV : ton pote sous Xanax pleure dans un Burger King » avec un filtre mignon. Sponsorisé par une marque de déodorant.",
      ],
      en: [
        "{a.first} became a lifestyle influencer. {a:His|Her} most viewed video: 'My best friend grocery shops like a broke loser 😂'. It's you, in the clearance aisle, in sweatpants. 3 million views.",
        "{a.first} films you constantly for content. Your heartbreak became 'POV: your friend sobbing in a Burger King' with a cute filter. Sponsored by a deodorant brand.",
      ],
    },
    choices: [
      { label: { fr: 'Exiger ma part', en: 'Demand my cut' }, text: { fr: "J'ai exigé 30 % des revenus. {a.first} a refusé, puis j'ai menacé de révéler qu'{a:il|elle} filme ses « petits-déj healthy » avec des croissants cachés sous la table. J'ai eu 40 %.", en: "I demanded 30% of the revenue. {a.first} refused, then I threatened to reveal {a.he} films {a.his} 'healthy breakfasts' with croissants hidden under the table. I got 40%." }, fx: { money: 4000, rel: -10, smarts: 2 }, mood: 'proud' },
      { label: { fr: 'Devenir la star', en: 'Become the star' }, text: { fr: "J'ai joué le jeu à fond. Les abonnés m'adorent plus que {a.first}. J'ai maintenant ma propre chaîne. {a.first} me fait la gueule et commente mes vidéos avec des émojis vomi.", en: "I leaned all the way in. The followers like me more than {a.first}. Now I have my own channel. {a.first} is sulking and comments vomit emojis on my videos." }, fx: { followers: 30000, fame: 5, happy: 6, rel: -20 }, mood: 'party' },
      { label: { fr: 'Casser son ring light', en: 'Smash the ring light' }, text: { fr: "J'ai cassé son ring light sur mon genou en direct devant 80 000 personnes. La vidéo de ma crise a fait plus de vues que toutes les siennes. Personne n'a gagné.", en: "I smashed {a.his} ring light over my knee live in front of 80,000 people. The video of my meltdown got more views than all of {a.his}. Nobody won." }, fx: { rel: -30, followers: 8000, happy: 2, actorRole: 'enemy' }, mood: 'angry' },
    ],
  },

  // ───────────────────────────── enemies ─────────────────────────────
  {
    id: 'so_make_enemy',
    icon: '🚗',
    cat: 'enemies',
    rating: 2,
    actor: { create: { role: 'acquaintance', age: [-10, 15], gender: 'any' } },
    scene: { place: 'apartment', mood: 'angry', fx: 'poop' },
    when: { age: [18, 80], movedOut: true },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "{a.first}, {a:ton voisin|ta voisine}, s'est garé{a:|e} sur ta place de parking. Pour la douzième fois. Ce matin, {a:il|elle} a laissé un mot sur ton pare-brise : « Apprends à te garer, connard. » Sur TA place.",
        "{a.first}, du deuxième étage, laisse son chien chier devant ta porte tous les matins à 7 h 12. Tu l'as filmé{a:|e}. {a:Il|Elle} t'a fait un doigt d'honneur à la caméra.",
      ],
      en: [
        "{a.first}, your neighbor, parked in your spot. For the twelfth time. This morning {a.he} left a note on your windshield: 'Learn to park, asshole.' In YOUR spot.",
        "{a.first}, from the second floor, lets {a.his} dog shit in front of your door every morning at 7:12. You filmed it. {a:He|She} flipped off the camera.",
      ],
    },
    choices: [
      { label: { fr: 'Rendre la monnaie', en: 'Return the favor' }, text: { fr: "J'ai rempli sa boîte aux lettres de crottes de chien soigneusement collectées pendant une semaine, avec un ruban. {a.first} m'a déclaré la guerre. Je l'avais déclarée en premier.", en: "I filled {a.his} mailbox with dog turds carefully collected over a week, with a ribbon. {a.first} declared war on me. I'd declared it first." }, fx: { happy: 8, karma: -5, rel: -30, actorRole: 'enemy', visual: 'poop' }, mood: 'proud' },
      { label: { fr: 'Crever ses pneus', en: 'Slash the tires' }, text: { fr: "J'ai crevé ses quatre pneus à 3 h du matin. Une caméra m'a filmé{|e} en pyjama licorne. {a.first} a porté plainte. On se croise au tribunal comme de vieux amis.", en: "I slashed all four tires at 3 a.m. A camera filmed me in my unicorn pajamas. {a.first} pressed charges. We see each other in court like old friends." }, fx: { happy: 4, karma: -4, rel: -40, heat: 10, actorRole: 'enemy', arrest: 'vandal' }, mood: 'angry' },
      { label: { fr: 'Négocier calmement', en: 'Negotiate calmly' }, text: { fr: "Je suis allé{|e} parler calmement à {a.first}. {a:Il|Elle} m'a écouté{|e}, hoché la tête, puis m'a craché dessus. Mon calme a ses limites. Elles ont été atteintes.", en: "I went to talk calmly to {a.first}. {a:He|She} listened, nodded, then spat on me. My calm has limits. They were reached." }, fx: { happy: -6, stress: 6, rel: -20, actorRole: 'enemy' }, mood: 'angry' },
    ],
  },
  {
    id: 'so_enemy_sabotage',
    icon: '🗡️',
    cat: 'enemies',
    rating: 1,
    actor: 'enemy',
    scene: { place: 'office', mood: 'angry' },
    when: { age: [18, 80] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "{a.first}, ton ennemi{a:|e} juré{a:|e}, a créé un faux profil de rencontre à ton nom. Ta bio : « Cherche quelqu'un qui accepte mes 14 furets et mon amour pour les pieds. » Tu as 300 matchs. Beaucoup trop enthousiastes.",
        "{a.first} a laissé un avis 1 étoile sur toi. Sur Google Maps. À ton adresse personnelle. « Hôte désagréable, odeur de chou, à éviter. » 47 personnes l'ont trouvé utile.",
      ],
      en: [
        "{a.first}, your sworn nemesis, made a fake dating profile in your name. Your bio: 'Looking for someone who accepts my 14 ferrets and my love of feet.' You have 300 matches. Way too enthusiastic.",
        "{a.first} left you a 1-star review. On Google Maps. At your home address. 'Unpleasant host, smells like cabbage, avoid.' 47 people found it helpful.",
      ],
    },
    choices: [
      { label: { fr: 'Contre-attaque', en: 'Counterattack' }, text: { fr: "J'ai inscrit {a.first} à 40 newsletters de chasse, 12 sectes et le club de fans d'un DJ hardstyle belge. {a:Il|Elle} reçoit 900 e-mails par jour. Ça me remplit de joie.", en: "I signed {a.first} up for 40 hunting newsletters, 12 cults and the fan club of a Belgian hardstyle DJ. {a:He|She} gets 900 emails a day. It fills me with joy." }, fx: { happy: 8, karma: -3, rel: -10, counter: 'so_revenges' }, mood: 'proud' },
      { label: { fr: 'Assumer à fond', en: 'Lean into it' }, text: { fr: "J'ai gardé le profil. J'ai eu trois rendez-vous, deux bons, et un type qui m'a offert un furet. Je l'ai appelé {a.first}. Il mord.", en: "I kept the profile. I went on three dates, two good ones, and a guy gave me a ferret. I named it {a.first}. It bites." }, fx: { happy: 6, newNpc: { role: 'pet', species: 'ferret' } }, mood: 'happy' },
      { label: { fr: 'Porter plainte', en: 'File a complaint' }, text: { fr: "J'ai porté plainte. Le policier a ri pendant toute la déposition, puis il m'a demandé si c'était vrai, pour les pieds. Plainte classée sans suite. Les pieds, aussi.", en: "I filed a complaint. The cop laughed through the whole statement, then asked me if the feet thing was true. Case dismissed. The feet, too." }, fx: { happy: -4, stress: 4 } },
    ],
  },
  {
    id: 'so_enemy_reconcile',
    icon: '🕊️',
    cat: 'enemies',
    rating: 0,
    actor: 'enemy',
    scene: { place: 'park', mood: 'neutral' },
    when: { age: [10, 90] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: [
        "{a.first}, ton ennemi{a:|e} de toujours, t'attend sur un banc avec deux cafés et une boîte de chouquettes. « J'en ai marre de te détester. Ça me prend trop de temps. »",
        "{a.first} t'envoie une carte : « Paix ? » avec un dessin de colombe très mal fait. On dirait un poulet avec un bonnet. Tu sens que c'est sincère.",
      ],
      en: [
        "{a.first}, your lifelong nemesis, is waiting on a bench with two coffees and a box of pastries. 'I'm tired of hating you. It takes up too much time.'",
        "{a.first} sends you a card: 'Truce?' with a very badly drawn dove. It looks like a chicken in a beanie. You can tell it's sincere.",
      ],
    },
    choices: [
      { label: { fr: 'Faire la paix', en: 'Make peace' }, text: { fr: "On a fait la paix. On a ri de nos coups bas passés, comparé nos meilleures vengeances et partagé les chouquettes. Mon pire ennemi est devenu mon pote. Le monde est bizarre.", en: "We made peace. We laughed about our old dirty tricks, compared our best revenges and split the pastries. My worst enemy became my buddy. The world is weird." }, fx: { happy: 8, karma: 6, rel: 40, actorRole: 'friend' }, mood: 'happy' },
      { label: { fr: 'Prendre les chouquettes et partir', en: 'Take the pastries and run' }, text: { fr: "J'ai pris la boîte de chouquettes et je suis parti{|e} en courant. Dans la rue, je me suis retourné{|e} et j'ai crié « LA GUERRE CONTINUE ». C'était mesquin. C'était délicieux.", en: "I grabbed the box of pastries and ran off. In the street, I turned around and yelled 'THE WAR CONTINUES'. Petty. Delicious." }, fx: { happy: 5, karma: -3, rel: -10 }, mood: 'party' },
      { label: { fr: 'Exiger des excuses écrites', en: 'Demand a written apology' }, text: { fr: "J'ai exigé des excuses écrites, signées, en trois exemplaires. {a.first} les a apportées. Je les ai encadrées. On est presque amis.", en: "I demanded a written, signed apology, in triplicate. {a.first} brought it. I framed it. We're almost friends." }, fx: { happy: 6, rel: 20, smarts: 1 }, mood: 'proud' },
    ],
  },
  {
    id: 'so_enemy_duel',
    icon: '🤺',
    cat: 'enemies',
    rating: 2,
    actor: 'enemy',
    scene: { place: 'park', mood: 'angry', fx: 'gore' },
    when: { age: [18, 80] },
    weight: 4,
    cooldown: 10,
    text: {
      fr: [
        "{a.first} t'a giflé{|e} avec un gant. Un vrai gant, en cuir, acheté exprès. « Demain, à l'aube, au parc. Choisis ton arme. » {a:Il|Elle} a amené un témoin, un notaire et un photographe.",
        "Ça ne peut plus durer : {a.first} et toi avez convenu d'un duel pour régler votre conflit une bonne fois pour toutes. 6 h du matin, la brume, et un joggeur qui ne comprend pas ce qu'il voit.",
      ],
      en: [
        "{a.first} slapped you with a glove. A real leather glove, bought for the occasion. 'Tomorrow, at dawn, in the park. Choose your weapon.' {a:He|She} brought a second, a notary and a photographer.",
        "This can't go on: {a.first} and you have agreed to a duel to settle your feud once and for all. 6 a.m., mist, and a jogger who has no idea what he's looking at.",
      ],
    },
    choices: [
      {
        label: { fr: 'Épée', en: 'Swords' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "D'un revers magnifique, j'ai tranché l'oreille de {a.first}, qui a volé dans la mare aux canards. Un canard l'a gobée. {a.first} a abandonné en hurlant. Victoire, honneur, canard repu.", en: "With a magnificent backhand, I sliced off {a.first}'s ear, which flew into the duck pond. A duck gobbled it. {a.first} surrendered screaming. Victory, honor, well-fed duck." }, fx: { happy: 12, rel: -20, fame: 2, visual: 'gore', counter: 'so_duels_won', flag: 'so_duelist' }, mood: 'proud' },
          { w: 1, text: { fr: "{a.first} m'a embroché{|e} comme une brochette de supermarché. J'ai regardé l'épée qui dépassait de mon ventre et dit « ah ». Ce furent mes dernières paroles. Pas les meilleures.", en: "{a.first} skewered me like a supermarket kebab. I looked at the sword sticking out of my belly and said 'oh'. Those were my last words. Not my best." }, fx: { die: { fr: "embroché{|e} lors d'un duel à l'épée au parc municipal, à 6 h du matin", en: 'skewered in a sword duel in the city park at 6 a.m.' }, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Pistolets à eau bouillante', en: 'Boiling water pistols' },
        out: [
          { w: 1, text: { fr: "J'ai tiré le premier. {a.first} a fondu un peu, comme une bougie. On a dû l'emmener aux grands brûlés. Je suis officiellement en garde à vue, mais moralement vainqueur.", en: "I fired first. {a.first} melted a little, like a candle. {a:He|She} went straight to the burn unit. I'm officially under arrest, but morally victorious." }, fx: { happy: 4, karma: -8, arrest: 'vandal', counter: 'so_duels_won', flag: 'so_duelist' }, mood: 'shock' },
          { w: 1, text: { fr: "On a tiré en même temps. On s'est retrouvés côte à côte aux urgences, cramés, à se lancer des regards noirs entre deux pansements. Le duel continue en salle d'attente.", en: "We fired at the same time. We ended up side by side in the ER, scalded, glaring at each other between bandages. The duel continues in the waiting room." }, fx: { health: -12, happy: -5, disease: 'burns' }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Baguettes de pain', en: 'Baguettes' },
        out: [
          { w: 2, text: { fr: "Duel à la baguette. Trois minutes de combat acharné, de la mie partout. On a fini assis dans l'herbe à manger les armes avec du beurre. On n'est pas amis. Mais on a faim ensemble.", en: "Baguette duel. Three minutes of fierce combat, crumbs everywhere. We ended up sitting in the grass eating the weapons with butter. We're not friends. But we're hungry together." }, fx: { happy: 8, rel: 20 }, mood: 'happy' },
          { w: 1, text: { fr: "La baguette de {a.first} était rassise depuis mardi. Elle m'a cassé le nez comme une barre à mine. J'ai pissé le sang sur ma chemise blanche de duelliste. Je hais le pain, désormais.", en: "{a.first}'s baguette had been stale since Tuesday. It broke my nose like a crowbar. I bled all over my white dueling shirt. I hate bread now." }, fx: { health: -8, looks: -4, happy: -6, visual: 'gore' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Ne pas venir', en: "Don't show up" }, text: { fr: "Je ne suis pas venu{|e}. {a.first} a attendu deux heures dans la brume avec son notaire. Il m'a facturé le déplacement. Je suis un lâche, mais un lâche entier.", en: "I didn't show up. {a.first} waited two hours in the mist with {a.his} notary. The notary billed me for the trip. I'm a coward, but an intact one." }, fx: { happy: -4, karma: -2, money: -300, fame: -1 } },
    ],
  },
  {
    id: 'so_enemy_obituary',
    icon: '🪦',
    cat: 'enemies',
    rating: 2,
    actor: 'enemy',
    scene: { place: 'cemetery', mood: 'party' },
    when: { age: [25, 95] },
    weight: 3,
    cooldown: 10,
    text: {
      fr: [
        "{a.first}, ton ennemi{a:|e} juré{a:|e}, est mort{a:|e}. Écrasé{a:|e} par un distributeur de boissons qu'{a:il|elle} secouait pour récupérer un Twix. Le Twix a survécu. L'enterrement est demain.",
        "Tu apprends dans le journal que {a.first} est décédé{a:|e} : chute dans une cuve de chocolat lors d'une visite d'usine. Les enfants du groupe ont trouvé ça « trop cool ». Les funérailles ont lieu samedi.",
      ],
      en: [
        "{a.first}, your sworn nemesis, is dead. Crushed by a vending machine {a.he} was shaking to get a Twix. The Twix survived. The funeral is tomorrow.",
        "You read in the paper that {a.first} has died: fell into a chocolate vat during a factory tour. The kids on the tour thought it was 'so cool'. The funeral is Saturday.",
      ],
    },
    choices: [
      { label: { fr: 'Danser sur sa tombe', en: 'Dance on the grave' }, text: { fr: "J'ai attendu la fin de la cérémonie, puis j'ai dansé la Macarena sur sa tombe avec une enceinte Bluetooth. Sa tante m'a frappé{|e} avec un parapluie. Ça valait le coup.", en: "I waited for the ceremony to end, then danced the Macarena on the grave with a Bluetooth speaker. {a:His|Her} aunt hit me with an umbrella. Worth it." }, fx: { happy: 10, karma: -10, actorDie: true }, mood: 'party' },
      { label: { fr: 'Pisser sur la tombe', en: 'Piss on the grave' }, text: { fr: "Je suis revenu{|e} de nuit pour pisser sur sa tombe. Le gardien m'a pris{|e} en flagrant délit, la braguette ouverte, au clair de lune. J'ai payé l'amende avec le sourire.", en: "I came back at night to piss on the grave. The groundskeeper caught me in the act, fly open, in the moonlight. I paid the fine with a smile." }, fx: { happy: 8, karma: -12, money: -135, actorDie: true }, mood: 'proud' },
      { label: { fr: 'Pleurer sincèrement', en: 'Cry sincerely' }, text: { fr: "À ma grande surprise, j'ai pleuré. Sans {a.first}, ma vie n'a plus d'antagoniste. Je n'ai plus personne à détester. Je me sens vide. J'envisage d'adopter un nouvel ennemi.", en: "To my surprise, I cried. Without {a.first}, my life has no antagonist. No one left to hate. I feel empty. I'm considering adopting a new nemesis." }, fx: { happy: -6, karma: 6, actorDie: true }, mood: 'cry' },
    ],
  },

  // ───────────────────────────── siblings ─────────────────────────────
  {
    id: 'so_sib_inheritance',
    icon: '📜',
    cat: 'family',
    rating: 1,
    actor: 'sibling',
    scene: { place: 'court', mood: 'angry' },
    when: { age: [30, 80], has: 'sibling' },
    weight: 5,
    once: true,
    text: {
      fr: [
        "Chez le notaire, tes parents ont laissé la maison de famille « à celui qui s'en occupera le mieux ». {a.first} et toi vous regardez comme deux cow-boys dans un western. Le notaire recule sa chaise.",
        "Le testament de tes parents a été lu. {a.first} réclame la maison de vacances « parce qu'{a:il|elle} y a perdu sa virginité ». Tu la réclames aussi, pour une raison que tu ne diras jamais.",
      ],
      en: [
        "At the notary's office: your parents left the family house 'to whoever takes the best care of it'. {a.first} and you stare at each other like two cowboys in a western. The notary scoots his chair back.",
        "Your parents' will has been read. {a.first} is claiming the vacation house 'because that's where {a.he} lost {a.his} virginity'. You want it too, for a reason you'll never say out loud.",
      ],
    },
    choices: [
      {
        label: { fr: 'Avocat requin', en: 'Shark lawyer' },
        out: [
          { w: 1, text: { fr: "Mon avocat a fait pleurer celui de {a.first}. J'ai eu la maison. {a.first} m'a envoyé un SMS : « T'es mort{|e} pour moi. » J'ai répondu avec une photo de la piscine.", en: "My lawyer made {a.first}'s lawyer cry. I got the house. {a.first} texted me: 'You're dead to me.' I replied with a photo of the pool." }, fx: { money: 80000, rel: -50, happy: 6, karma: -5, actorRole: 'enemy' }, mood: 'proud' },
          { w: 1, text: { fr: "Quatre ans de procédure. Les avocats ont tout mangé, la maison a été vendue pour payer leurs honoraires. Il nous reste chacun un vase. Il est moche.", en: "Four years of litigation. The lawyers ate everything; the house was sold to pay their fees. We each got a vase. It's ugly." }, fx: { money: -15000, rel: -40, happy: -10 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Partager équitablement', en: 'Split it fairly' }, text: { fr: "On a vendu et partagé moitié-moitié. On a pleuré ensemble en vidant le grenier et retrouvé nos dessins d'enfants. Il y en a un où je lui coupe la tête. On a ri.", en: "We sold it and split it fifty-fifty. We cried together emptying the attic and found our childhood drawings. There's one where I'm cutting off {a.his} head. We laughed." }, fx: { money: 40000, rel: 20, happy: 5, karma: 5 }, mood: 'cry' },
      { label: { fr: 'Tout lui laisser', en: 'Let them have it all' }, text: { fr: "J'ai tout laissé à {a.first}. {a:Il|Elle} a été tellement surpris{a:|e} qu'{a:il|elle} a cru à un piège pendant trois ans. Puis m'a invité{|e} pour les vacances.", en: "I let {a.first} have everything. {a:He|She} was so surprised {a.he} thought it was a trap for three years. Then invited me over for the holidays." }, fx: { rel: 30, karma: 10 }, mood: 'proud' },
    ],
  },
  {
    id: 'so_sib_wedding',
    icon: '💍',
    cat: 'family',
    rating: 0,
    actor: 'sibling',
    scene: { place: 'party', mood: 'happy', fx: 'confetti' },
    when: { age: [20, 65] },
    weight: 6,
    once: true,
    text: {
      fr: [
        "{a.first} se marie ! Tu es témoin et tu dois faire le discours. Tu as deux options : l'histoire touchante, ou la fois où {a:il|elle} a fait pipi dans le congélateur à 8 ans.",
        "Mariage de {a.first}. Ta mère pleure depuis 9 h du matin, ton père a déjà tâché sa cravate et le traiteur a oublié les desserts. Tout le monde compte sur toi.",
      ],
      en: [
        "{a.first} is getting married! You're the {best man|maid of honor} and have to give a speech. Two options: the touching story, or the time {a.he} peed in the freezer at age 8.",
        "{a.first}'s wedding. Your mom has been crying since 9 a.m., your dad already stained his tie and the caterer forgot the desserts. Everyone's counting on you.",
      ],
    },
    choices: [
      { label: { fr: 'Discours touchant', en: 'Touching speech' }, text: { fr: "J'ai parlé de nos cabanes dans le jardin et des nuits où {a.first} venait dormir dans ma chambre quand il y avait de l'orage. Toute la salle a pleuré. Même le DJ.", en: "I talked about our backyard forts and the nights {a.first} would sneak into my room during thunderstorms. The whole room cried. Even the DJ." }, fx: { rel: 25, happy: 10, karma: 3 }, mood: 'cry' },
      { label: { fr: "L'histoire du congélateur", en: 'The freezer story' }, text: { fr: "J'ai raconté l'histoire du congélateur. Avec des diapos. Les invités ont hurlé de rire, la belle-famille beaucoup moins. {a.first} m'a pardonné{|e}. Au dessert.", en: "I told the freezer story. With slides. The guests howled, the in-laws much less. {a.first} forgave me. By dessert." }, fx: { rel: -5, happy: 8, fame: 1 }, mood: 'party' },
      { label: { fr: 'Sauver les desserts', en: 'Save the desserts' }, text: { fr: "J'ai foncé au supermarché en tenue de cérémonie et rapporté 40 éclairs et une tarte au citron. On m'a acclamé{|e} comme un héros de guerre.", en: "I sprinted to the supermarket in my wedding outfit and brought back 40 eclairs and a lemon tart. They cheered me like a war hero." }, fx: { rel: 20, money: -120, happy: 8, karma: 4 }, mood: 'proud' },
    ],
  },
  {
    id: 'so_sib_prison',
    icon: '⛓️',
    cat: 'family',
    rating: 1,
    actor: 'sibling',
    scene: { place: 'prison', mood: 'sad' },
    when: { age: [18, 75] },
    weight: 4,
    once: true,
    text: {
      fr: [
        "{a.first} a pris trois ans pour avoir braqué une station-service avec une banane dans un sac. Au parloir, {a:il|elle} te demande de lui faire passer « un petit truc » dans un gâteau.",
        "{a.rel} {a.first} est en taule. {a:Il|Elle} t'appelle en PCV tous les dimanches pour te raconter les embrouilles de la cantine. Ce dimanche, {a:il|elle} a besoin d'argent pour « se protéger ».",
      ],
      en: [
        "{a.first} got three years for robbing a gas station with a banana in a bag. In the visiting room, {a.he} asks you to sneak 'a little something' in a cake.",
        "Your sibling {a.first} is in the slammer. {a:He|She} calls you collect every Sunday to tell you about cafeteria beef. This Sunday, {a.he} needs money 'for protection'.",
      ],
    },
    choices: [
      { label: { fr: 'Rendre visite chaque mois', en: 'Visit every month' }, text: { fr: "Je suis allé{|e} voir {a.first} tous les mois. On joue aux cartes à travers une vitre. Son codétenu, Bébert, m'a appris à faire un tatouage avec un stylo. On est une famille, maintenant.", en: "I visited {a.first} every month. We play cards through a glass window. {a:His|Her} cellmate, Bert, taught me to tattoo with a ballpoint pen. We're a family now." }, fx: { rel: 25, karma: 6, happy: -2 }, mood: 'sad' },
      {
        label: { fr: 'Le gâteau piégé', en: 'The trick cake' },
        out: [
          { w: 1, text: { fr: "J'ai caché une lime dans un fraisier. Le gardien l'a mangé devant nous et s'est cassé une dent sur la lime. J'ai pris six mois. Je suis dans la cellule d'à côté. Au moins, on se voit.", en: "I hid a file in a strawberry cake. The guard ate it in front of us and broke a tooth on the file. I got six months. I'm in the next cell. At least we see each other." }, fx: { rel: 20, jail: 1, karma: -3 }, mood: 'shock' },
          { w: 1, text: { fr: "Le gâteau est passé. {a.first} a utilisé la lime pour… se limer les ongles. « Ah, tu croyais que c'était pour m'évader ? » Non mais quel{a:|le} con{a:|ne}.", en: "The cake got through. {a.first} used the file to… do {a.his} nails. 'Oh, you thought it was for escaping?' What an idiot." }, fx: { rel: 10, happy: -3, smarts: -1 } },
        ],
      },
      { label: { fr: 'Lui envoyer du fric', en: 'Send money' }, text: { fr: "J'ai envoyé 500 balles sur son compte de cantine. {a.first} est devenu{a:|e} le caïd des nouilles instantanées du bloc C. Je finance un empire.", en: "I put $500 on {a.his} commissary account. {a.first} became the instant-noodle kingpin of Block C. I'm funding an empire." }, fx: { money: -500, rel: 15 }, mood: 'neutral' },
      { label: { fr: 'Couper les ponts', en: 'Cut ties' }, text: { fr: "Je n'ai plus répondu aux appels. Ma mère me demande à chaque repas si je suis « vraiment de cette famille ». Je mange en silence.", en: "I stopped answering the calls. My mom asks every dinner if I'm 'really part of this family'. I eat in silence." }, fx: { rel: -30, karma: -4, happy: -3 } },
    ],
  },
  {
    id: 'so_sib_lottery',
    icon: '🎰',
    cat: 'family',
    rating: 0,
    actor: 'sibling',
    scene: { place: 'mansion', mood: 'shock', fx: 'money' },
    when: { age: [20, 80], noFlag: 'so_sib_rich' },
    weight: 3,
    once: true,
    text: {
      fr: [
        "{a.first} a gagné 22 millions au loto. Tu l'apprends par la télé régionale, en même temps que tout le monde. Depuis, {a:il|elle} ne répond plus au téléphone. Son numéro n'existe plus. Sa maison est à vendre.",
        "{a.rel} {a.first} a touché le jackpot et a disparu dans la nature. Dernière trace : une photo sur un yacht avec un flamant rose gonflable et la légende « nouvelle vie, nouvelle famille ».",
      ],
      en: [
        "{a.first} won 22 million in the lottery. You find out from the local news, along with everyone else. Since then, {a.he} hasn't picked up the phone. {a:His|Her} number's disconnected. {a:His|Her} house is for sale.",
        "Your sibling {a.first} hit the jackpot and vanished. Last trace: a photo on a yacht with an inflatable flamingo and the caption 'new life, new family'.",
      ],
    },
    choices: [
      { label: { fr: '{a:Le|La} traquer', en: 'Track them down' }, text: { fr: "J'ai retrouvé {a.first} à Monaco grâce aux tags Instagram d'un flamant rose gonflable. {a:Il|Elle} m'a fait raccompagner par la sécurité. Avec un cookie. Un seul.", en: "I tracked {a.first} down in Monaco through an inflatable flamingo's Instagram tags. {a:He|She} had security escort me out. With a cookie. Just one." }, fx: { money: -800, rel: -15, happy: -5, flag: 'so_sib_rich', schedule: { key: 'so_sib_lottery_broke', years: 4 } }, mood: 'angry' },
      { label: { fr: 'Être content{|e} pour {a.him}', en: 'Be happy for them' }, text: { fr: "J'ai décidé d'être content{|e} pour {a.first}. J'ai même envoyé une carte « Félicitations ». Elle m'est revenue. Adresse inconnue. Je suis content{|e} quand même. Un peu moins.", en: "I decided to be happy for {a.first}. I even sent a 'Congratulations' card. It came back. Address unknown. I'm still happy. Slightly less." }, fx: { karma: 6, happy: -2, flag: 'so_sib_rich', schedule: { key: 'so_sib_lottery_broke', years: 4 } } },
      { label: { fr: 'Raconter tout à la presse', en: 'Tell the press everything' }, text: { fr: "J'ai donné une interview au journal local : « {a:Mon frère millionnaire|Ma sœur millionnaire} m'a abandonné{|e} ». Avec photos d'enfance. {a.first} m'a envoyé une mise en demeure. Avec du papier à en-tête doré.", en: "I gave an interview to the local paper: 'My millionaire sibling abandoned me'. With childhood photos. {a.first} sent me a cease and desist. On gold letterhead." }, fx: { fame: 3, rel: -30, happy: 3, flag: 'so_sib_rich', schedule: { key: 'so_sib_lottery_broke', years: 4 } }, mood: 'proud' },
    ],
  },
  {
    id: 'so_sib_lottery_broke',
    icon: '🪫',
    cat: 'family',
    rating: 1,
    chainOnly: true,
    actor: 'anyone',
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Quatre ans après le loto, {a.first} sonne chez toi. Bronzé{a:|e}, une valise Louis Vuitton à la main, et plus un centime. « 22 millions, ça part vite quand on achète un zoo. » {a:Il|Elle} veut ton canapé.",
        "{a.first} réapparaît, ruiné{a:|e} : un yacht coulé, deux divorces, un tigre domestique à nourrir et un associé « très gentil » parti avec le reste. {a:Il|Elle} te demande pardon. Et 300 balles.",
      ],
      en: [
        "Four years after the lottery, {a.first} rings your doorbell. Tanned, a Louis Vuitton suitcase in hand, and not a cent left. '22 million goes fast when you buy a zoo.' {a:He|She} wants your couch.",
        "{a.first} reappears, broke: a sunken yacht, two divorces, a pet tiger to feed and a 'really nice' business partner who ran off with the rest. {a:He|She} asks for your forgiveness. And 300 bucks.",
      ],
    },
    choices: [
      { label: { fr: 'Pardonner', en: 'Forgive' }, text: { fr: "J'ai pardonné à {a.first} et lui ai ouvert mon canapé. {a:Il|Elle} m'a offert sa dernière possession de valeur : une montre en or. Elle est fausse. Mais le geste est vrai.", en: "I forgave {a.first} and opened up my couch. {a:He|She} gave me {a.his} last valuable possession: a gold watch. It's fake. But the gesture is real." }, fx: { rel: 30, karma: 8, happy: 4, unflag: 'so_sib_rich' }, mood: 'cry' },
      { label: { fr: 'Claquer la porte', en: 'Slam the door' }, text: { fr: "J'ai claqué la porte en criant « NOUVELLE VIE, NOUVELLE FAMILLE ». Je me suis répété cette phrase sous la douche pendant quatre ans. Ça valait l'attente, putain.", en: "I slammed the door yelling 'NEW LIFE, NEW FAMILY'. I'd rehearsed that line in the shower for four years. Damn, worth the wait." }, fx: { happy: 10, karma: -4, rel: -30, unflag: 'so_sib_rich' }, mood: 'proud' },
      { label: { fr: '{a:Le|La} faire bosser pour moi', en: 'Make them work for me' }, text: { fr: "J'ai accepté d'héberger {a.first} à condition qu'{a:il|elle} fasse le ménage, la cuisine et m'appelle « Votre Altesse ». {a:Il|Elle} a dit oui. C'est la meilleure année de ma vie.", en: "I agreed to put {a.first} up on condition {a.he} does the cleaning, the cooking and calls me 'Your Highness'. {a:He|She} said yes. Best year of my life." }, fx: { happy: 12, rel: 5, karma: -2, unflag: 'so_sib_rich' }, mood: 'party' },
    ],
  },
  {
    id: 'so_twin_swap',
    icon: '👯',
    cat: 'family',
    rating: 0,
    actor: 'sibling',
    scene: { place: 'school', mood: 'happy' },
    when: { age: [10, 40] },
    weight: 4,
    once: true,
    text: {
      fr: [
        "{a.first} a une idée de génie : échanger vos vies pour une journée. Avec une perruque, un peu de maquillage et beaucoup de conviction, personne ne verra la différence. « Fais-moi confiance. »",
        "{a.first} et toi vous ressemblez assez sous un mauvais éclairage. {a:Il|Elle} propose que tu passes son examen de conduite à sa place pendant qu'{a:il|elle} va à ton rendez-vous chez le dentiste.",
      ],
      en: [
        "{a.first} has a genius idea: swap lives for a day. With a wig, some makeup and lots of conviction, nobody will notice. 'Trust me.'",
        "{a.first} and you look alike enough in bad lighting. {a:He|She} suggests you take {a.his} driving test while {a.he} goes to your dentist appointment.",
      ],
    },
    choices: [
      {
        label: { fr: "Tenter l'échange", en: 'Try the swap' },
        out: [
          { w: 2, text: { fr: "Personne n'a rien remarqué. Même pas notre mère. Surtout pas notre mère. On a fait ça pendant trois semaines avant d'avouer. Elle a dit « ah, ça explique les brocolis ».", en: "Nobody noticed. Not even our mom. Especially not our mom. We kept it up for three weeks before confessing. She said 'oh, that explains the broccoli'." }, fx: { happy: 10, rel: 15, smarts: 1 }, mood: 'party' },
          { w: 1, text: { fr: "La perruque est tombée dans la soupe à la cantine devant tout le monde. On a été démasqués en 40 secondes. On est punis tous les deux. Ensemble. C'est déjà ça.", en: "The wig fell into the soup in front of everyone. We were exposed in 40 seconds. We're both grounded. Together. That's something." }, fx: { happy: -2, rel: 10, discipline: -2 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Refuser, trop risqué', en: 'Refuse, too risky' }, text: { fr: "J'ai refusé. {a.first} a tenté l'échange avec notre cousin, qui a 14 kilos et une moustache de plus. Ça n'a pas marché du tout.", en: "I said no. {a.first} tried the swap with our cousin, who has 30 pounds and a mustache on {a.him}. It didn't work at all." }, fx: { rel: -5, discipline: 2 } },
      { label: { fr: '{a:Le|La} dénoncer en avance', en: 'Snitch preemptively' }, text: { fr: "J'ai prévenu tout le monde du plan de {a.first}. {a:Il|Elle} a été attendu{a:|e} par un comité d'accueil hilare. {a:Il|Elle} prépare sa vengeance. Je dors avec un œil ouvert.", en: "I warned everyone about {a.first}'s plan. {a:He|She} was met by a laughing welcome committee. Revenge is coming. I sleep with one eye open." }, fx: { rel: -15, happy: 3, karma: -2 } },
    ],
  },
  {
    id: 'so_sib_roast',
    icon: '🔥',
    cat: 'family',
    rating: 2,
    actor: 'sibling',
    scene: { place: 'party', mood: 'party', fx: 'fire' },
    when: { age: [30, 70] },
    weight: 5,
    once: true,
    text: {
      fr: [
        "Pour les 40 ans de {a.first}, la famille organise un « roast » : chacun doit l'humilier au micro. {a:Il|Elle} t'a regardé{|e} droit dans les yeux et a dit : « Toi, je te défie d'aller trop loin. »",
        "{a.first} fête ses 40 ans avec un concours d'insultes entre frères et sœurs, « comme quand on était petits ». Le micro est à toi. Tu as 20 ans de munitions.",
      ],
      en: [
        "For {a.first}'s 40th, the family is throwing a 'roast': everyone has to humiliate {a.him} on the mic. {a:He|She} looked you dead in the eye and said: 'I dare you to go too far.'",
        "{a.first} is celebrating {a.his} 40th with a sibling insult battle, 'like when we were kids'. The mic is yours. You have 20 years of ammunition.",
      ],
    },
    choices: [
      { label: { fr: 'Aller trop loin', en: 'Go too far' }, text: { fr: "« {a.first} a un tel charisme que même ses morpions sont partis sans laisser d'adresse. » Puis j'ai parlé de sa période métal, de son ex qui l'a quitté{a:|e} pour un pasteur, et de ses selles dans le jacuzzi en 2009. Ovation. Papa a eu besoin d'oxygène.", en: "'{a.first} has such charisma that even {a.his} crabs left without a forwarding address.' Then I covered {a.his} metal phase, {a.his} ex who left {a.him} for a pastor, and the hot tub poop incident of 2009. Standing ovation. Dad needed oxygen." }, fx: { happy: 12, rel: -10, fame: 2 }, mood: 'party' },
      {
        label: { fr: 'Me faire roaster en retour', en: 'Get roasted back' },
        out: [
          { w: 1, text: { fr: "{a.first} a pris le micro et révélé que je pissais au lit jusqu'à 14 ans, avec des photos du matelas. Ma belle-famille était là. Mon patron aussi. Je suis mort{|e} de l'intérieur.", en: "{a.first} grabbed the mic and revealed I wet the bed until 14, with photos of the mattress. My in-laws were there. My boss too. I died inside." }, fx: { happy: -10, looks: -2, rel: 10 }, mood: 'shock' },
          { w: 1, text: { fr: "{a.first} a tenté de me roaster mais a fondu en larmes au milieu en disant que j'étais son héros. Tout le monde s'est tourné vers moi. Je n'étais pas prêt{|e} pour ça.", en: "{a.first} tried to roast me but broke down crying halfway through, saying I was {a.his} hero. Everyone turned to me. I wasn't ready for that." }, fx: { happy: 8, rel: 25 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Rester gentil{|le}', en: 'Be nice' }, text: { fr: "J'ai fait un discours gentil. Huées. Quelqu'un m'a lancé un cornichon. Dans cette famille, la gentillesse est une insulte.", en: "I gave a nice speech. Boos. Someone threw a pickle at me. In this family, kindness is an insult." }, fx: { happy: -4, karma: 3, rel: 5 } },
    ],
  },
  // ───────────────────────────── parties, anxiety, karaoke ─────────────────────────────
  {
    id: 'so_party_nobody',
    icon: '🥤',
    cat: 'social',
    rating: 0,
    scene: { place: 'party', mood: 'neutral' },
    when: { age: [18, 60] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["Tu arrives à une soirée où tu ne connais personne. L'ami qui t'a invité{|e} n'est pas encore là. Il y a un bol de chips, un chien, et quarante inconnus qui rient d'une blague que tu as ratée.", "Soirée chez des amis d'amis. Tu tiens ton verre comme un bouclier. Quelqu'un te demande « et toi, tu connais qui ? ». Tu ne connais personne. Même pas le chien.", "Soirée chez un collègue d'un ami. Tout le monde se connaît depuis la maternelle. Tu es coincé{|e} dans la cuisine avec {w:weird_job} qui t'explique son métier depuis vingt minutes.", "Tu débarques à une soirée déguisée. Personne ne t'a prévenu{|e}. Tu es en jogging. Quelqu'un te demande si tu es venu{|e} en « dépression ». Il y a {w:food} sur la table et {w:animal} sur le canapé.", "Tu arrives à une soirée où l'on passe {w:song} pour la [[troisième|cinquième|onzième]] fois. Tu ne connais personne, à part l'hôte, qui dort déjà dans la baignoire."],
      en: ["You arrive at a party where you know nobody. The friend who invited you isn't here yet. There's a bowl of chips, a dog, and forty strangers laughing at a joke you missed.", "Party at your friends' friends' place. You're holding your drink like a shield. Someone asks 'so who do you know here?'. You know nobody. Not even the dog.", "Party at a friend's coworker's place. Everyone's known each other since kindergarten. You're stuck in the kitchen with {w:weird_job} who's been explaining the job for twenty minutes.", "You show up at a costume party. Nobody warned you. You're in sweatpants. Someone asks if you came as 'depression'. There's {w:food} on the table and {w:animal} on the couch.", "You arrive at a party where they're playing {w:song} for the [[third|fifth|eleventh]] time. You know nobody except the host, who's already asleep in the bathtub."],
    },
    choices: [
      { label: { fr: 'Parler au chien', en: 'Talk to the dog' }, text: { fr: ["J'ai passé la soirée à caresser le chien dans un coin. C'est le meilleur interlocuteur que j'aie rencontré cette année. Il s'appelle Biscotte. On s'écrit.", "J'ai passé la soirée avec le chien. Il m'a montré sa collection : {w:object} et une chaussette. On a parlé de nos ex. Il comprend."], en: ["I spent the whole party petting the dog in a corner. Best conversationalist I've met all year. His name is Biscuit. We keep in touch.", "I spent the party with the dog. He showed me his collection: {w:object} and a sock. We talked about our exes. He gets it."] }, fx: { happy: 5, stress: -3 }, mood: 'happy' },
      {
        label: { fr: 'Me lancer', en: 'Mingle' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["Je me suis présenté{|e} à un groupe au hasard. Trois heures plus tard, on organisait un voyage en Islande ensemble. J'ai quatre nouveaux amis et un sac de couchage à acheter.", "Je me suis lancé{|e} avec une anecdote sur {w:animal}. Gros succès. On m'a réclamé la suite. J'ai improvisé une saga en six épisodes."], en: ["I introduced myself to a random group. Three hours later, we were planning a trip to Iceland together. I have four new friends and a sleeping bag to buy.", "I opened with a story about {w:animal}. Huge hit. They wanted a sequel. I improvised a six-part saga."] }, fx: { happy: 10, newNpc: { role: 'friend', age: [-5, 5] }, counter: 'so_friends_made' }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai rejoint une conversation en hochant la tête. C'était un enterrement de vie de célibataire. Dans le mauvais appartement. Je suis reparti{|e} avec un diadème.", "Je me suis présenté{|e} avec assurance à un groupe passionné par {w:hobby}. Deux heures de monologue. J'ai simulé un appel urgent. Mon téléphone était en mode avion."], en: ["I joined a conversation, nodding along. It was a bachelorette party. In the wrong apartment. I left wearing a tiara.", "I confidently introduced myself to a group obsessed with {w:hobby}. Two-hour monologue. I faked an urgent call. My phone was in airplane mode."] }, fx: { happy: 2, stress: 3 }, mood: 'shock' },
        ],
      },
      { label: { fr: "Filer à l'anglaise", en: 'Irish goodbye' }, text: { fr: ["Je suis parti{|e} sans dire au revoir au bout de quatorze minutes. Dans l'escalier, j'ai croisé l'ami qui m'avait invité{|e}. On s'est regardés. J'ai continué à descendre.", "Je suis parti{|e} à l'anglaise avec {w:food} sous le bras. Le lendemain, on m'a remercié{|e} d'être venu{|e}. Personne n'a remarqué ni mon départ, ni le vol."], en: ["I left without saying goodbye after fourteen minutes. On the stairs, I passed the friend who'd invited me. We looked at each other. I kept walking down.", "I slipped out with {w:food} under my arm. The next day, they thanked me for coming. Nobody noticed my exit, or the theft."] }, fx: { happy: 1, stress: -2 } },
    ],
  },
  {
    id: 'so_social_anxiety',
    icon: '😰',
    cat: 'social',
    rating: 0,
    scene: { place: 'apartment', mood: 'sad', prop: 'phone' },
    when: { age: [14, 70] },
    weight: 6,
    cooldown: 4,
    text: {
      fr: [
        "Tu dois appeler pour commander une pizza. Ça fait 40 minutes que tu répètes « Bonjour, je voudrais une margherita » devant le miroir. Tu as faim. Tu as peur. Tu as écrit un script.",
        "Quelqu'un t'a dit « bon appétit » au boulot et tu as répondu « toi aussi ». Il ne mangeait pas. Ça fait trois jours que tu y penses.",
      ],
      en: [
        "You need to call to order a pizza. You've been rehearsing 'Hi, I'd like a margherita' in the mirror for 40 minutes. You're hungry. You're scared. You wrote a script.",
        "Someone said 'enjoy your meal' to you at work and you said 'you too'. He wasn't eating. You've been thinking about it for three days.",
      ],
    },
    choices: [
      {
        label: { fr: 'Affronter ma peur', en: 'Face my fear' },
        out: [
          { w: 2, text: { fr: "J'ai appelé. Ma voix a tremblé, mais j'ai commandé ma pizza. Puis j'ai dit « je t'aime » au livreur au téléphone par réflexe. Il a dit « moi aussi ». On va bien.", en: "I called. My voice shook, but I ordered my pizza. Then I said 'love you' to the pizza guy on reflex. He said 'love you too'. We're good." }, fx: { happy: 6, stress: -4, discipline: 3 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai paniqué et raccroché dès qu'ils ont décroché. Puis ils ont rappelé. J'ai laissé sonner en me cachant sous la couette. J'ai mangé des céréales sèches.", en: "I panicked and hung up as soon as they answered. Then they called back. I let it ring while hiding under the covers. I ate dry cereal." }, fx: { happy: -4, stress: 6 }, mood: 'sad' },
        ],
      },
      { label: { fr: "Commander sur l'appli", en: 'Order on the app' }, text: { fr: "J'ai commandé sur l'appli, comme une personne civilisée. Le livreur a sonné. J'ai fait semblant de ne pas être là et attendu qu'il pose la pizza devant la porte. Victoire totale.", en: "I ordered on the app like a civilized person. The delivery guy rang. I pretended not to be home and waited for him to leave it at the door. Total victory." }, fx: { happy: 4, stress: -2 }, mood: 'happy' },
      { label: { fr: 'Consulter un psy', en: 'See a therapist' }, text: { fr: "J'ai pris rendez-vous chez un psy. Par e-mail, évidemment. Il m'a appris des exercices de respiration. Je respire mieux. J'ai toujours peur du téléphone, mais calmement.", en: "I booked a therapist appointment. By email, obviously. He taught me breathing exercises. I breathe better. I'm still scared of phones, but calmly." }, fx: { money: -80, stress: -10, happy: 3, smarts: 1 } },
    ],
  },
  {
    id: 'so_karaoke',
    icon: '🎤',
    cat: 'social',
    rating: 1,
    scene: { place: 'party', mood: 'party', prop: 'microphone' },
    when: { age: [18, 75] },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "Soirée karaoké avec la bande. Tes potes ont choisi ta chanson sans te demander : « My Heart Will Go On », version longue. La salle est pleine. Il y a ton ex au bar.",
        "Karaoké, 1 h du matin, cinquième pinte. Le micro arrive vers toi comme une grenade dégoupillée. L'écran affiche : « Bohemian Rhapsody — 6 min 07 ».",
      ],
      en: [
        "Karaoke night with the gang. Your friends picked your song without asking: 'My Heart Will Go On', extended version. The place is packed. Your ex is at the bar.",
        "Karaoke, 1 a.m., fifth pint. The mic is coming your way like a live grenade. The screen says: 'Bohemian Rhapsody — 6:07'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout donner', en: 'Give it everything' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "J'ai tout donné, genoux au sol sur le refrain. Le bar entier a chanté avec moi. Un inconnu m'a offert un shot. Ma voix est partie, ma légende est née.", en: "I gave it everything, on my knees for the chorus. The whole bar sang with me. A stranger bought me a shot. My voice is gone, my legend is born." }, fx: { happy: 12, fame: 2, followers: 1500 }, mood: 'party' },
          { w: 2, text: { fr: "J'ai attaqué la note haute. Ma voix a fait un bruit de chèvre qu'on égorge. Un verre s'est fendu. Mon ex a filmé. La vidéo s'appelle « La Chèvre de Titanic ». Putain.", en: "I went for the high note. My voice made the sound of a goat being strangled. A glass cracked. My ex filmed it. The video is called 'The Titanic Goat'. Fuck." }, fx: { happy: -8, looks: -2, followers: 3000 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Duo forcé avec un pote', en: 'Drag a friend into a duet' }, text: { fr: "J'ai traîné mon pote le plus timide sur scène pour un duo de « Je l'aime à mourir ». Il a chanté les yeux fermés, moi faux. Tout le monde a pleuré pour des raisons différentes.", en: "I dragged my shyest friend on stage for a duet of 'Islands in the Stream'. He sang with his eyes closed, me off-key. Everyone cried for different reasons." }, fx: { happy: 8, stress: -3 }, mood: 'happy' },
      { label: { fr: 'Fuir aux toilettes', en: 'Flee to the bathroom' }, text: { fr: "Je me suis enfermé{|e} aux toilettes jusqu'à la fermeture. À 3 h, le patron m'a sorti{|e} de là avec une serpillière. Mes potes ont chanté ma chanson à ma place. En se moquant de moi.", en: "I locked myself in the bathroom until closing. At 3 a.m., the owner got me out with a mop. My friends sang my song for me. Mocking me." }, fx: { happy: -3, stress: 4 } },
    ],
  },
  {
    id: 'so_drunk_confession',
    icon: '🥃',
    cat: 'friends',
    rating: 1,
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'love' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "4 h du matin, ta septième bière, {a.first} assis{a:|e} à côté de toi sur le trottoir. Tu sens que quelque chose veut sortir. Un aveu. Ou du vomi. Peut-être les deux.",
        "Après une bouteille de rhum arrangé, {a.first} te prend par les épaules : « Dis-moi un secret que tu n'as jamais dit à personne. » Ton cerveau imbibé en a plusieurs en stock.",
      ],
      en: [
        "4 a.m., your seventh beer, {a.first} sitting next to you on the curb. You feel something wants to come out. A confession. Or vomit. Maybe both.",
        "After a bottle of spiced rum, {a.first} grabs your shoulders: 'Tell me a secret you've never told anyone.' Your soaked brain has several in stock.",
      ],
    },
    choices: [
      {
        label: { fr: "« Je t'ai toujours aimé{a:|e} »", en: "'I've always loved you'" },
        out: [
          { w: 1, text: { fr: "Je lui ai dit que je l'aimais depuis toujours. {a.first} m'a regardé{|e} longtemps, puis m'a embrassé{|e}. On ne sait pas encore si c'est l'alcool. On vérifiera sobres.", en: "I told {a.first} I'd always loved {a.him}. {a:He|She} looked at me for a long time, then kissed me. We don't know yet if it's the booze. We'll check sober." }, fx: { rel: 25, happy: 10, actorRole: 'partner' }, mood: 'love' },
          { w: 2, text: { fr: "J'ai avoué mon amour. {a.first} a répondu « ah, euh… je vais chercher des frites ». {a:Il|Elle} n'est jamais revenu{a:|e}. Je suis resté{|e} seul{|e} sur le trottoir avec mes sentiments et un pigeon.", en: "I confessed my love. {a.first} said 'oh, uh… I'm gonna grab some fries'. {a:He|She} never came back. I sat alone on the curb with my feelings and a pigeon." }, fx: { rel: -10, happy: -10 }, mood: 'cry' },
        ],
      },
      { label: { fr: "« J'ai pissé dans ta plante »", en: "'I peed in your plant'" }, text: { fr: "J'ai avoué avoir pissé dans son ficus en 2016 parce que ses toilettes étaient occupées. {a.first} a ri pendant dix minutes, puis avoué avoir couché avec mon cousin. On est quittes. Je crois.", en: "I confessed to peeing in {a.his} ficus in 2016 because the bathroom was taken. {a.first} laughed for ten minutes, then admitted to sleeping with my cousin. We're even. I think." }, fx: { rel: 10, happy: 6 }, mood: 'happy' },
      { label: { fr: 'Vomir à la place', en: 'Puke instead' }, text: { fr: "Au lieu d'un secret, j'ai vomi sur les chaussures de {a.first}. Des Stan Smith toutes neuves. Le secret est resté à l'intérieur. Les chips, non.", en: "Instead of a secret, I puked on {a.first}'s shoes. Brand-new white sneakers. The secret stayed inside. The chips didn't." }, fx: { rel: -5, health: -2, happy: -3 }, mood: 'sick' },
    ],
  },

  // ───────────────────────────── reunions ─────────────────────────────
  {
    id: 'so_reunion10',
    icon: '🎓',
    cat: 'social',
    rating: 1,
    scene: { place: 'school', mood: 'neutral' },
    when: { age: [27, 30] },
    weight: 6,
    once: true,
    text: {
      fr: [
        "Réunion des 10 ans du lycée. Le gymnase sent toujours la sueur et le désinfectant. Le mec le plus populaire vend maintenant des assurances. La fille la plus discrète est astronaute. Et toi ?",
        "Dix ans après le bac, tout le monde se retrouve avec des badges « Bonjour, je m'appelle ». Tu entends quelqu'un dire : « Ah, c'est {first} ! Je croyais que t'étais mort{|e}. »",
      ],
      en: [
        "Ten-year high school reunion. The gym still smells of sweat and disinfectant. The most popular guy sells insurance now. The quietest girl is an astronaut. And you?",
        "Ten years after graduation, everyone's wearing 'Hello, my name is' badges. You hear someone say: 'Oh, it's {first}! I thought you were dead.'",
      ],
    },
    choices: [
      { label: { fr: 'Mentir sur ma vie', en: 'Lie about my life' }, text: { fr: "J'ai prétendu être chirurgien{|ne} cardiaque et propriétaire d'un vignoble. Ça a impressionné tout le monde. Puis une ancienne camarade m'a demandé de regarder son grain de beauté. J'ai dit « c'est bénin ». J'espère.", en: "I claimed to be a heart surgeon who owns a vineyard. Everyone was impressed. Then an old classmate asked me to look at her mole. I said 'it's benign'. I hope." }, fx: { happy: 6, karma: -3, flag: 'so_reunion_lied' }, mood: 'proud' },
      { label: { fr: 'Être honnête', en: 'Be honest' }, text: { fr: "J'ai été honnête sur ma vie, mes galères et mes petits succès. Tout le monde a été honnête après moi. On a fini par pleurer ensemble dans les gradins, bourrés au punch tiède. Thérapie de groupe gratuite.", en: "I was honest about my life, my struggles and my small wins. Everyone got honest after me. We ended up crying together in the bleachers, wasted on lukewarm punch. Free group therapy." }, fx: { happy: 8, karma: 4, stress: -5 }, mood: 'happy' },
      { label: { fr: 'Retrouver mon crush', en: 'Find my old crush' }, text: { fr: "J'ai retrouvé mon crush du lycée. Mon crush a perdu ses cheveux, gagné trois enfants et parle uniquement de son barbecue à gaz. Le fantasme est mort. Je me sens libre.", en: "I found my high school crush. They've lost their hair, gained three kids and talk exclusively about their gas grill. The fantasy is dead. I feel free." }, fx: { happy: 4, stress: -3 }, mood: 'neutral' },
    ],
  },
  {
    id: 'so_reunion20',
    icon: '🪩',
    cat: 'social',
    rating: 2,
    scene: { place: 'school', mood: 'party', fx: 'gore' },
    when: { age: [37, 40] },
    weight: 6,
    once: true,
    text: {
      fr: [
        "Réunion des 20 ans du lycée. Open bar. Ton ancien harceleur, Kévin, est là : chauve, trois divorces, une haleine de cendrier, et il te montre du doigt en criant « EH, LA BALEINE ! » comme en 2005.",
        "20 ans après, la promo se retrouve. Deux pintes plus tard, la reine du bal vomit dans le bac à ballons, le délégué de classe se bat avec le prof de sport et Kévin, ton ancien bourreau, t'attend près du buffet.",
      ],
      en: [
        "Twenty-year high school reunion. Open bar. Your old bully, Kevin, is there: bald, three divorces, ashtray breath, pointing at you and yelling 'HEY, WHALE!' just like back in the day.",
        "20 years later, the class gets back together. Two pints in, the prom queen pukes into the ball bin, the class president fights the gym teacher and Kevin, your old tormentor, is waiting for you by the buffet.",
      ],
    },
    choices: [
      { label: { fr: 'Venger mon adolescence', en: 'Avenge my teenage self' }, text: { fr: "J'ai attendu vingt ans pour ça. Coup de boule. Le nez de Kévin a explosé comme une tomate trop mûre, aspergeant la pièce montée et la directrice. La salle a applaudi. Kévin aussi, à terre, par réflexe.", en: "I waited twenty years for this. Headbutt. Kevin's nose exploded like an overripe tomato, spraying the cake and the principal. The room applauded. So did Kevin, on the floor, by reflex." }, fx: { happy: 15, karma: -3, health: -2, visual: 'gore', counter: 'so_fights' }, mood: 'proud' },
      {
        label: { fr: 'Maintenir le mensonge', en: 'Keep up the lie' },
        if: { flag: 'so_reunion_lied' },
        out: [
          { w: 1, text: { fr: "Dix ans plus tard, je suis toujours « chirurgien{|ne} cardiaque ». Kévin s'est effondré, crise cardiaque en plein slow. Tout le monde m'a regardé{|e}. J'ai fait un massage cardiaque en chantant « Stayin' Alive ». Il a survécu. Je suis un héros. Et un imposteur.", en: "Ten years on, I'm still 'a heart surgeon'. Kevin collapsed, heart attack mid-slow dance. Everyone looked at me. I did CPR singing 'Stayin' Alive'. He survived. I'm a hero. And a fraud." }, fx: { happy: 10, karma: 5, fame: 2, unflag: 'so_reunion_lied' }, mood: 'proud' },
          { w: 1, text: { fr: "Kévin a fait un malaise et tout le monde s'est tourné vers « {le chirurgien|la chirurgienne} ». J'ai paniqué et tapé sur sa poitrine avec une chaussure. Une vraie infirmière l'a sauvé. Ma réputation est morte, Kévin non.", en: "Kevin collapsed and everyone turned to 'the surgeon'. I panicked and hit his chest with a shoe. A real nurse saved him. My reputation died; Kevin didn't." }, fx: { happy: -12, fame: -2, unflag: 'so_reunion_lied' }, mood: 'shock' },
        ],
      },
      { label: { fr: "Boire jusqu'à l'oubli", en: 'Drink until oblivion' }, text: { fr: "J'ai bu tout l'open bar. Je me suis réveillé{|e} dans le vestiaire des filles, en survêtement de sport de 2004, avec Kévin qui me tenait les cheveux pendant que je vomissais. On est potes maintenant.", en: "I drank the whole open bar. I woke up in the girls' locker room, in a 2004 gym tracksuit, with Kevin holding my hair while I puked. We're friends now." }, fx: { happy: 5, health: -6, addiction: ['alcohol', 6] }, mood: 'sick' },
    ],
  },
  {
    id: 'so_friend_kid_monster',
    icon: '👹',
    cat: 'friends',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'home', mood: 'shock', fx: 'poop' },
    when: { age: [25, 65] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: [
        "Dîner chez {a.first}. Son fils de 5 ans, Enzo, vient de te mordre le mollet jusqu'au sang, de lécher ta fourchette et de faire caca dans ta chaussure. {a.first} sourit : « Il exprime ses émotions. On ne dit jamais non chez nous. »",
        "{a.first} t'a confié son gamin « juste deux heures ». Le petit monstre a peint le chat, avalé tes clés, et il te fixe en tenant un couteau à beurre. Il chuchote « encore ». Tu ne sais pas encore quoi.",
      ],
      en: [
        "Dinner at {a.first}'s. {a:His|Her} 5-year-old, Brayden, just bit your calf till it bled, licked your fork and pooped in your shoe. {a.first} smiles: 'He's expressing his feelings. We never say no in this house.'",
        "{a.first} left you {a.his} kid 'just for two hours'. The little monster painted the cat, swallowed your keys, and is staring at you holding a butter knife. He whispers 'again'. You don't know what yet.",
      ],
    },
    choices: [
      { label: { fr: 'Lui dire non', en: 'Tell him no' }, text: { fr: "J'ai dit « non ». Le gosse a hurlé pendant 47 minutes, à une fréquence qui a fait saigner le nez du chien. {a.first} m'a regardé{|e} comme si j'avais tué quelqu'un. Je ne suis plus invité{|e}. Victoire.", en: "I said 'no'. The kid screamed for 47 minutes at a frequency that made the dog's nose bleed. {a.first} looked at me like I'd murdered someone. I'm not invited anymore. Victory." }, fx: { rel: -20, happy: 4, stress: 5 }, mood: 'proud' },
      { label: { fr: 'Fuir par la fenêtre', en: 'Escape through the window' }, text: { fr: "J'ai prétexté un appel et je suis sorti{|e} par la fenêtre des toilettes, en chaussettes, une chaussure pleine de merde à la main. Je l'ai jetée dans leur jardin. On est quittes.", en: "I faked a phone call and climbed out the bathroom window in my socks, holding a shoe full of shit. I tossed it into their yard. We're even." }, fx: { rel: -10, happy: 2, visual: 'poop' }, mood: 'shock' },
      { label: { fr: 'Le terroriser en retour', en: 'Scare him back' }, text: { fr: "Je me suis penché{|e} et j'ai chuchoté à Enzo une histoire de croque-mitaine qui mange les enfants qui mordent. Il est devenu sage instantanément. {a.first} me demande mon secret. Il fait encore pipi au lit.", en: "I leaned in and whispered a story to the kid about a boogeyman who eats children who bite. He turned into an angel instantly. {a.first} keeps asking for my secret. He's back to wetting the bed." }, fx: { rel: 10, karma: -3, happy: 6, health: -2 }, mood: 'party' },
    ],
  },
];
