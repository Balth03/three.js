// Lignes de journal du quotidien (1re personne, sans choix ni effet), 18–120 ans.
// Voir data/WRITING_GUIDE.md (section Diversité) et data/words/index.ts (conventions des pools {w:…}).
import type { AnecdoteDef, Cond, Rating, Tone } from '@bl/sim';

const A = (id: string, icon: string, rating: Rating, when: Cond, fr: string[], en: string[], o: { tone?: Tone; w?: number } = {}): AnecdoteDef =>
  ({ id: `aa_${id}`, icon, rating, when, text: { fr, en }, ...o });

export const anecdotesAdults: AnecdoteDef[] = [
  // ───────────── Jeunes adultes 18–30 ─────────────
  A('coloc_fridge', '🧀', 0, { age: [18, 30] }, [
    `Mon coloc a étiqueté {w:food} dans le frigo avec son prénom et une date de péremption [[inventée|menaçante|en chiffres romains]].`,
    `Réunion de coloc d'urgence {w:time} : quelqu'un a mangé {w:food} qui ne lui appartenait pas.`,
    `J'ai retrouvé {w:object} dans le bac à légumes de la coloc. Personne n'assume.`,
  ], [
    `My flatmate labelled {w:food} in the fridge with his name and a [[made-up|threatening|Roman-numeral]] expiry date.`,
    `Emergency flatmate meeting {w:time}: someone ate {w:food} that wasn't theirs.`,
    `I found {w:object} in the flat's vegetable drawer. Nobody's owning up.`,
  ]),
  A('coloc_dishes', '🍽️', 0, { age: [18, 30] }, [
    `La pile de vaisselle de la coloc a atteint [[un mètre|le plafond|l'autonomie]]. On l'a baptisée {w:nickname}.`,
    `J'ai fait la vaisselle de toute la coloc {w:time}. Personne ne l'a remarqué. Je suis {un héros|une héroïne} de l'ombre.`,
    `Un tableau de répartition des tâches a été affiché dans la coloc. Il a tenu [[deux jours|six heures|un week-end]], puis a servi à emballer {w:food}.`,
  ], [
    `The flat's dish pile reached [[three feet|the ceiling|sentience]]. We named it {w:nickname}.`,
    `I did the whole flat's dishes {w:time}. Nobody noticed. I am an unsung hero.`,
    `A chore chart went up in the flat. It lasted [[two days|six hours|one weekend]], then got used to wrap {w:food}.`,
  ]),
  A('coloc_noise', '🔊', 2, { age: [18, 30] }, [
    `La copine de mon coloc fait {w:sound} chaque nuit à travers la cloison. J'ai acheté des bouchons d'oreilles industriels.`,
    `Mon coloc a ramené quelqu'un {w:time}. Les murs sont fins. Je connais maintenant son surnom intime : {w:nickname}.`,
    `J'ai mis {w:song} à fond pour couvrir les bruits de la chambre d'à côté. Ça n'a pas suffi.`,
  ], [
    `My flatmate's girlfriend makes {w:sound} through the wall every night. I bought industrial earplugs.`,
    `My flatmate brought someone home {w:time}. The walls are thin. I now know his pet name: {w:nickname}.`,
    `I blasted {w:song} to drown out the next room. It wasn't enough.`,
  ]),
  A('coloc_hair', '🪮', 2, { age: [18, 30] }, [
    `J'ai débouché la douche de la coloc et sorti une boule de cheveux grosse comme {w:animal}. Elle a bougé.`,
    `Le siphon de la coloc dégageait {w:smell}. Dedans : {w:gross}. J'ai crié.`,
    `Quelqu'un dans la coloc ne tire jamais la chasse. On a ouvert une enquête. Les suspects nient. Il règne {w:smell} dans le couloir.`,
  ], [
    `I unclogged the flat's shower and pulled out a hairball the size of {w:animal}. It moved.`,
    `The flat's drain gave off {w:smell}. Inside: {w:gross}. I screamed.`,
    `Someone in the flat never flushes. We've opened an investigation. The suspects deny everything. There's {w:smell} in the hallway.`,
  ]),
  A('dating_app', '📱', 1, { age: [18, 30] }, [
    `J'ai matché sur {w:app} avec quelqu'un dont la bio disait juste « {w:exclaim} ». Ça m'a plu.`,
    `Mon date {w:app} est arrivé avec {w:animal} en laisse. On n'en a jamais parlé.`,
    `J'ai swipé [[200|500|1 000]] profils sur {w:app}. Le seul match, c'était mon ex.`,
    `Sur {w:app}, quelqu'un m'a écrit « {w:compliment} » puis m'a bloqué{|e} trente secondes plus tard.`,
  ], [
    `I matched on {w:app} with someone whose bio just said "{w:exclaim}". I liked it.`,
    `My {w:app} date showed up with {w:animal} on a leash. We never discussed it.`,
    `I swiped through [[200|500|1,000]] profiles on {w:app}. The only match was my ex.`,
    `On {w:app}, someone wrote "{w:compliment}" then blocked me thirty seconds later.`,
  ]),
  A('dating_bad', '💔', 2, { age: [18, 30] }, [
    `Mon rencard a lâché {w:sound} au restaurant puis a accusé le serveur. Je suis tombé{|e} amoureu{x|se}.`,
    `Premier date : on a mangé {w:food}, j'ai eu la chiasse dans le tram du retour. Il n'y aura pas de deuxième date.`,
    `Mon date m'a montré une photo de son pied pendant [[dix|vingt|quarante]] minutes. Puis la facture, {w:drink} compris.`,
  ], [
    `My date let out {w:sound} at the restaurant and blamed the waiter. I fell in love.`,
    `First date: we ate {w:food}, I got the runs on the tram home. There will be no second date.`,
    `My date showed me a photo of their foot for [[ten|twenty|forty]] minutes. Then the bill, {w:drink} included.`,
  ]),
  A('ghosted', '👻', 0, { age: [18, 30] }, [
    `On m'a ghosté{|e} après trois dates. Dernier message : {w:food} en photo.`,
    `J'ai ghosté quelqu'un {w:excuse}. Je suis une ordure, mais une ordure cohérente.`,
    `Mon crush a vu mon message il y a [[4|9|17]] jours. Je surveille le « vu » comme un sismologue. Je me console avec {w:food}.`,
  ], [
    `I got ghosted after three dates. Last message: a photo of {w:food}.`,
    `I ghosted someone {w:excuse}. I'm trash, but consistent trash.`,
    `My crush read my message [[4|9|17]] days ago. I'm monitoring that "seen" like a seismologist. I'm consoling myself with {w:food}.`,
  ]),
  A('hangover', '🥴', 1, { age: [18, 30] }, [
    `Je me suis réveillé{|e} {w:at_place} avec {w:object} dans les bras et zéro souvenir.`,
    `Gueule de bois niveau [[8|9|11]] sur 10. J'ai pleuré devant une pub {w:brand}.`,
    `Petit-déj de lendemain de soirée : {w:food} et {w:drink}. Thérapeutique.`,
  ], [
    `I woke up {w:at_place} hugging {w:object} with zero memories.`,
    `Hangover level [[8|9|11]] out of 10. I cried at an ad for {w:brand}.`,
    `Hangover breakfast: {w:food} and {w:drink}. Therapeutic.`,
  ]),
  A('party_puke', '🤮', 2, { age: [18, 30] }, [
    `J'ai repeint les toilettes de la soirée en gerbant {w:food} façon lance à incendie.`,
    `Soirée finie à quatre pattes {w:at_place}, à vomir en rythme sur {w:song}.`,
    `J'ai vomi dans le sac à main d'une inconnue. Un jet parfait, digne des JO. Elle m'a applaudi{|e} en criant « {w:exclaim} ».`,
  ], [
    `I repainted the party bathroom by firehosing {w:food} back up.`,
    `Night ended on all fours {w:at_place}, puking in time to {w:song}.`,
    `I puked into a stranger's handbag. A perfect arc, Olympic-level. She applauded, yelling "{w:exclaim}".`,
  ]),
  A('party_shots', '🥃', 1, { age: [18, 30] }, [
    `On a inventé un shot : {w:drink} mélangé avec {w:drink}. On l'a appelé « {w:nickname} ». Deux hospitalisations.`,
    `J'ai fait un discours émouvant à la soirée, debout sur {w:object}. Personne ne m'avait demandé.`,
    `J'ai dansé sur {w:song} pendant [[45 minutes|2 heures|toute la nuit]]. Mes genoux ont porté plainte.`,
  ], [
    `We invented a shot: {w:drink} mixed with {w:drink}. We called it "{w:nickname}". Two hospital trips.`,
    `I gave a moving speech at the party, standing on {w:object}. Nobody asked me to.`,
    `I danced to {w:song} for [[45 minutes|2 hours|the whole night]]. My knees filed a complaint.`,
  ]),
  A('party_naked', '🍑', 2, { age: [18, 30] }, [
    `Il paraît que j'ai fini la soirée tout{|e} nu{|e} sur {w:vehicle} en hurlant « {w:exclaim} ». Les vidéos circulent.`,
    `J'ai perdu mon slip {w:at_place}. Je l'ai retrouvé une semaine plus tard, accroché à un lampadaire.`,
    `On a joué à action ou vérité. J'ai léché {w:object} et avoué que j'ai trompé tout le monde au Monopoly.`,
  ], [
    `Apparently I ended the night butt-naked on {w:vehicle} yelling "{w:exclaim}". The videos are out there.`,
    `I lost my underwear {w:at_place}. Found it a week later hanging from a lamppost.`,
    `We played truth or dare. I licked {w:object} and admitted I cheat at Monopoly.`,
  ]),
  A('first_job', '💼', 0, { age: [18, 26], job: true }, [
    `Premier mois chez {employer} : j'ai passé [[deux|trois|quatre]] semaines à chercher où était la machine à café. Elle était cachée derrière {w:object}.`,
    `Mon manager m'a appelé{|e} « {w:nickname} » pendant trois mois. Je n'ai jamais osé le corriger.`,
    `J'ai envoyé un mail à toute la boîte au lieu de mon pote. Il contenait le mot « {w:food} » et un emoji douteux.`,
  ], [
    `First month at {employer}: I spent [[two|three|four]] weeks looking for the coffee machine. It was hidden behind {w:object}.`,
    `My manager called me "{w:nickname}" for three months. I never dared correct him.`,
    `I emailed the whole company instead of my buddy. It contained the word "{w:food}" and a dubious emoji.`,
  ]),
  A('student_loan', '🎓', 0, { age: [18, 30], money: [-1e12, 2000] }, [
    `J'ai fait mes courses avec [[4,12|7,80|2,30]] €. Le dîner, ce sera {w:food} divisé en trois.`,
    `Mon banquier m'a appelé{|e}. J'ai fait semblant d'être mon propre répondeur, avec {w:song} en musique d'attente.`,
    `J'ai revendu {w:object} sur Leboncoin pour payer le loyer. L'acheteur m'a négocié de 50 centimes.`,
  ], [
    `I did my groceries with [[$4.12|$7.80|$2.30]]. Dinner will be {w:food} split three ways.`,
    `My banker called. I pretended to be my own voicemail, with {w:song} as hold music.`,
    `I sold {w:object} online to pay rent. The buyer haggled me down 50 cents.`,
  ]),
  A('pasta_life', '🍝', 0, { age: [18, 30], money: [-1e12, 3000] }, [
    `Septième jour de pâtes au ketchup. J'ai commencé à leur donner des prénoms. La plus grosse s'appelle {w:nickname}.`,
    `J'ai invité des potes à dîner : pâtes, sel, et la fierté.`,
    `J'ai rêvé toute la nuit qu'on me servait {w:food}. Au réveil, il restait des coquillettes.`,
  ], [
    `Day seven of ketchup pasta. I've started naming them. The biggest one is called {w:nickname}.`,
    `I had friends over for dinner: pasta, salt, and pride.`,
    `I dreamed all night someone served me {w:food}. I woke up to plain macaroni.`,
  ]),
  A('festival', '🎪', 1, { age: [18, 30] }, [
    `Festival : trois jours sous la tente, {w:weather}, à écouter {w:band}. Je sens encore {w:smell}.`,
    `J'ai perdu mes potes au festival dès la première heure. Je les ai retrouvés trois jours plus tard {w:at_place}, mariés à des inconnus.`,
    `Au festival, quelqu'un m'a vendu {w:drink} à 14 €. J'en ai bu six. Mon compte en banque pleure.`,
  ], [
    `Festival: three days in a tent, {w:weather}, listening to {w:band}. I still have {w:smell} on me.`,
    `Lost my friends at the festival in the first hour. Found them three days later {w:at_place}, married to strangers.`,
    `At the festival someone sold me {w:drink} for $14. I had six. My bank account is crying.`,
  ]),
  A('festival_toilet', '🚽', 2, { age: [18, 30] }, [
    `J'ai utilisé les toilettes sèches du festival le troisième jour. J'ai vu des choses que la science ignore. Et il régnait {w:smell}.`,
    `Mon téléphone est tombé dans les chiottes du festival. Je l'ai récupéré. Je ne suis plus la même personne.`,
    `Au festival, j'ai fait caca derrière {w:vehicle}. Le propriétaire dormait dedans.`,
  ], [
    `I used the festival porta-potty on day three. I saw things science doesn't know about. And there was {w:smell}.`,
    `My phone fell into the festival toilet. I fished it out. I am not the same person anymore.`,
    `At the festival I pooped behind {w:vehicle}. The owner was sleeping inside.`,
  ]),
  A('roadtrip', '🚐', 0, { age: [18, 30] }, [
    `Road trip entre potes {w:weather}. On s'est perdus [[deux|cinq|onze]] fois et on a fini {w:at_place}.`,
    `Road trip : la playlist n'avait qu'une chanson, {w:song}, en boucle. On ne se parle plus.`,
    `On est partis en vacances {w:far_place} avec 80 € et un GPS de 2009. Aventure.`,
  ], [
    `Road trip with friends {w:weather}. We got lost [[two|five|eleven]] times and ended up {w:at_place}.`,
    `Road trip: the playlist had one song, {w:song}, on loop. We're no longer speaking.`,
    `We went on holiday {w:far_place} with $80 and a 2009 GPS. Adventure.`,
  ]),
  A('gym_young', '🏋️', 0, { age: [18, 30] }, [
    `Je me suis inscrit{|e} à la salle. J'y suis allé{|e} une fois. Je paie toujours, et je porte le t-shirt pour aller manger {w:food}.`,
    `À la salle, un mec m'a expliqué la vie pendant que je soulevais {w:object}. Je n'avais rien demandé.`,
    `J'ai fait un selfie dans le miroir de la salle avant de m'entraîner. Puis je suis rentré{|e} manger {w:food}.`,
  ], [
    `I joined a gym. I went once. I'm still paying, and I wear the T-shirt to go eat {w:food}.`,
    `At the gym a guy explained life to me while I lifted {w:object}. I hadn't asked.`,
    `Took a mirror selfie at the gym before working out. Then went home to eat {w:food}.`,
  ]),
  A('gym_fart', '💨', 2, { age: [18, 30] }, [
    `En plein squat, j'ai lâché {w:sound}. Toute la salle a arrêté de respirer. Moi aussi.`,
    `J'ai forcé sur le développé couché et il s'est passé quelque chose dans mon short. On ne reviendra pas là-dessus.`,
    `Le mec du tapis d'à côté dégageait {w:smell}. Il me draguait. J'ai couru plus vite que jamais.`,
  ], [
    `Mid-squat I let out {w:sound}. The whole gym stopped breathing. So did I.`,
    `I pushed too hard on bench press and something happened in my shorts. We will not discuss it.`,
    `The guy on the next treadmill gave off {w:smell}. He was hitting on me. I ran faster than ever.`,
  ]),
  A('appart_hunt', '🏚️', 0, { age: [18, 32] }, [
    `J'ai visité un studio de [[9|11|12]] m² avec les toilettes dans la cuisine. Trente candidats faisaient la queue.`,
    `Une agence m'a demandé trois garants, un CDI et une lettre de recommandation signée {w:celeb}.`,
    `Le propriétaire a qualifié l'appart de « cosy ». Il fallait enjamber le lit pour ouvrir le frigo. Avec le loyer, je pourrais m'acheter {w:vehicle} chaque mois.`,
  ], [
    `I viewed a [[95|120|130]] sq ft studio with the toilet in the kitchen. Thirty applicants in line.`,
    `An agency asked for three guarantors, a permanent contract and a reference letter from {w:celeb}.`,
    `The landlord called the flat "cozy". You had to climb over the bed to open the fridge. The rent could buy {w:vehicle} every month.`,
  ]),
  A('appart_mold', '🍄', 1, { age: [18, 32] }, [
    `Il y a une tache d'humidité au plafond qui ressemble à {w:celeb}. Elle grandit. Je crois qu'elle me juge.`,
    `Le chauffage de mon appart fait {w:sound} et chauffe autant qu'une bougie. Merci pour le loyer, connard de proprio.`,
    `Mon appart dégage {w:smell} depuis que je l'ai loué. L'agence dit que c'est « du caractère ».`,
  ], [
    `There's a damp stain on the ceiling that looks like {w:celeb}. It's growing. I think it's judging me.`,
    `My heater makes {w:sound} and gives off as much heat as a candle. Thanks for the rent, asshole landlord.`,
    `My flat has given off {w:smell} since I moved in. The agency calls it "character".`,
  ]),
  A('cockroach', '🪳', 2, { age: [18, 35] }, [
    `J'ai écrasé un cafard avec {w:object}. Il a fait un bruit de chips. J'en ai encore la chair de poule.`,
    `Un cafard est sorti de mon grille-pain pendant le petit-déj. On s'est regardés. Il a gagné. Je lui ai laissé {w:food}.`,
    `J'ai trouvé une famille de cafards dans {w:food}. Ils avaient l'air heureux. J'ai tout jeté en hurlant.`,
  ], [
    `I squashed a cockroach with {w:object}. It crunched like a chip. I still have goosebumps.`,
    `A cockroach crawled out of my toaster during breakfast. We stared at each other. It won. I left it {w:food}.`,
    `I found a family of cockroaches in {w:food}. They looked happy. I threw everything out screaming.`,
  ]),
  A('night_bus', '🚌', 1, { age: [18, 30] }, [
    `Dans le bus de nuit, un type a mangé {w:food} à mains nues en me fixant. J'ai changé de place trois fois.`,
    `J'ai raté le dernier métro et marché {w:weather} jusqu'à chez moi en chantant {w:song}.`,
    `Le bus de nuit dégageait {w:smell} et quelqu'un pleurait au fond. Ambiance de samedi.`,
  ], [
    `On the night bus, a guy ate {w:food} with his bare hands while staring at me. I switched seats three times.`,
    `I missed the last train and walked home {w:weather} singing {w:song}.`,
    `The night bus gave off {w:smell} and someone was crying at the back. Saturday vibes.`,
  ]),
  A('kebab_3am', '🌯', 2, { age: [18, 30] }, [
    `Kebab de 3 h du matin. Une giclée de sauce blanche m'a atterri dans l'œil. J'ai cru devenir aveugle.`,
    `J'ai mangé {w:food} assis{|e} sur le trottoir à 4 h. Le lendemain, mes toilettes ont connu l'apocalypse.`,
    `J'ai fait tomber mon kebab par terre. Je l'ai ramassé. Je l'ai fini. Je n'ai aucun regret, juste la gastro.`,
  ], [
    `3 a.m. kebab. A squirt of garlic sauce landed in my eye. I thought I'd gone blind.`,
    `I ate {w:food} sitting on the curb at 4 a.m. The next day my toilet witnessed the apocalypse.`,
    `I dropped my kebab on the pavement. I picked it up. I finished it. No regrets, just food poisoning.`,
  ]),
  A('walk_of_shame', '👠', 2, { age: [18, 32] }, [
    `Walk of shame {w:time}, chaussures à la main et {w:object} sous le bras. Je ne sais pas d'où il sort.`,
    `Je me suis réveillé{|e} chez quelqu'un dont je ne connaissais pas le prénom. Sur le frigo : une photo de moi. Je suis parti{|e} par la fenêtre {w:weather}.`,
    `J'ai découvert un suçon gros comme {w:food} dans mon cou. J'ai mis une écharpe {w:weather}.`,
  ], [
    `Walk of shame {w:time}, shoes in hand and {w:object} under my arm. No idea where it came from.`,
    `I woke up at someone's place without knowing their name. On the fridge: a photo of me. I left through the window {w:weather}.`,
    `I found a hickey the size of {w:food} on my neck. I wore a scarf {w:weather}.`,
  ]),
  A('one_night', '🛏️', 2, { age: [18, 35] }, [
    `Une nuit torride avec quelqu'un rencontré {w:at_place}. Au matin, il y avait {w:animal} dans la cuisine. Personne ne m'avait prévenu{|e}.`,
    `Coup d'un soir. Au moment critique, son téléphone a joué {w:song} à fond. On n'a jamais repris.`,
    `J'ai couché avec quelqu'un qui criait « {w:exclaim} » à chaque fois. Les voisins ont applaudi.`,
  ], [
    `A steamy night with someone I met {w:at_place}. In the morning there was {w:animal} in the kitchen. Nobody warned me.`,
    `One-night stand. At the critical moment their phone blasted {w:song}. We never recovered.`,
    `I slept with someone who yelled "{w:exclaim}" every time. The neighbours applauded.`,
  ]),
  A('selfie_fail', '🤳', 0, { age: [18, 30] }, [
    `J'ai pris [[87|143|312]] selfies pour en poster un seul. Il a eu quatre likes, dont ma mère et un bot qui se fait appeler {w:nickname}.`,
    `Mon selfie {w:at_place} a été partagé par un compte qui se moque des selfies ratés.`,
    `J'ai posté {w:food} en photo avec un filtre vintage. Un inconnu a commenté « {w:insult} ».`,
  ], [
    `I took [[87|143|312]] selfies to post one. It got four likes, including my mom and a bot called {w:nickname}.`,
    `My selfie {w:at_place} got shared by an account that mocks failed selfies.`,
    `I posted a photo of {w:food} with a vintage filter. A stranger commented "{w:insult}".`,
  ]),
  A('tattoo_regret', '🖋️', 1, { age: [18, 30] }, [
    `Je me suis fait tatouer le prénom de mon ex sur la fesse {w:excuse}. On s'est séparés le lendemain.`,
    `Mon nouveau tatouage était censé représenter un loup. Tout le monde y voit {w:animal}.`,
    `Tatouage en kanji : il signifie paraît-il « {w:food} ». Je l'assume.`,
  ], [
    `I got my ex's name tattooed on my butt {w:excuse}. We broke up the next day.`,
    `My new tattoo was supposed to be a wolf. Everyone sees {w:animal}.`,
    `Kanji tattoo: apparently it means "{w:food}". I own it.`,
  ]),
  A('erasmus', '✈️', 1, { age: [18, 26] }, [
    `Mon pote est revenu d'Erasmus avec un accent bizarre et une passion pour {w:hobby}. Insupportable.`,
    `J'ai passé un week-end {w:far_place}, j'ai dormi [[4|6|9]] heures en tout et bu {w:drink} au petit-déj.`,
    `En vacances {w:far_place}, j'ai embrassé un inconnu sous {w:weather}. Je ne sais toujours pas son prénom.`,
  ], [
    `My buddy came back from his semester abroad with a weird accent and a passion for {w:hobby}. Unbearable.`,
    `Spent a weekend {w:far_place}, slept [[4|6|9]] hours total and had {w:drink} for breakfast.`,
    `On holiday {w:far_place}, I kissed a stranger {w:weather}. Still don't know their name.`,
  ]),
  A('job_interview', '🤝', 0, { age: [18, 30], job: false }, [
    `Entretien d'embauche : on m'a demandé mon plus gros défaut. J'ai répondu « {w:hobby} ». Pas rappelé{|e}.`,
    `J'ai envoyé [[37|84|152]] CV cette semaine. Seule réponse : une offre pour devenir {w:weird_job}.`,
    `En entretien, j'ai dit « {w:exclaim} » quand ils ont annoncé le salaire. Je crois que ça a joué.`,
  ], [
    `Job interview: they asked my biggest weakness. I said "{w:hobby}". Never heard back.`,
    `I sent [[37|84|152]] CVs this week. Only reply: an offer to become {w:weird_job}.`,
    `In the interview I said "{w:exclaim}" when they announced the salary. I think that mattered.`,
  ]),
  A('unemployed_day', '🛋️', 1, { age: [18, 35], job: false }, [
    `Journée type de chômeur : réveil à midi, {w:show} jusqu'à 18 h, crise existentielle, dodo.`,
    `Pôle Emploi m'a proposé une formation pour devenir {w:weird_job}. J'ai dit que j'allais réfléchir.`,
    `J'ai passé l'après-midi en caleçon à regarder {w:movie}. Ma productivité est un concept.`,
  ], [
    `Typical unemployed day: wake up at noon, {w:show} till 6 p.m., existential crisis, bed.`,
    `The job centre offered me training to become {w:weird_job}. I said I'd think about it.`,
    `Spent the afternoon in my underwear watching {w:movie}. Productivity is a concept.`,
  ]),
  A('parents_visit', '🏠', 0, { age: [18, 28], movedOut: true }, [
    `Je suis rentré{|e} chez mes parents pour le week-end. Je suis reparti{|e} avec [[six|neuf|douze]] tupperwares et {w:object}.`,
    `Ma mère a visité mon appart. Elle a passé le doigt sur une étagère et soupiré pendant [[3|7|12]] minutes.`,
    `J'ai appelé mes parents pour leur demander comment faire cuire {w:food}. Mon père a ri très fort.`,
  ], [
    `Went back to my parents' for the weekend. Left with [[six|nine|twelve]] tupperwares and {w:object}.`,
    `My mom visited my flat. She ran a finger along a shelf and sighed for [[3|7|12]] minutes.`,
    `I called my parents to ask how to cook {w:food}. My dad laughed very loudly.`,
  ]),
  A('laundry', '🧺', 0, { age: [18, 30] }, [
    `J'ai lavé tout mon linge blanc avec une chaussette rouge. Je suis désormais une personne rose. Au bureau, on m'appelle {w:nickname}.`,
    `À la laverie, j'ai retrouvé {w:object} dans ma machine. Ce n'est pas à moi. Je l'ai gardé.`,
    `J'ai étendu mon linge sur le balcon {w:weather}. Mon pantalon est parti vivre sa vie.`,
  ], [
    `I washed all my whites with a red sock. I am now a pink person. At work they call me {w:nickname}.`,
    `At the laundromat I found {w:object} in my machine. Not mine. I kept it.`,
    `I hung my laundry on the balcony {w:weather}. My trousers left to live their own life.`,
  ]),
  A('cooking_fail', '🔥', 0, { age: [18, 30] }, [
    `J'ai voulu cuisiner {w:food} pour impressionner quelqu'un. Les pompiers sont venus. Ils ont goûté.`,
    `Le détecteur de fumée a sonné pendant que je faisais des pâtes. Des pâtes. Le pompier a dit « {w:exclaim} ».`,
    `J'ai suivi un tuto de cuisine présenté par {w:celeb}. Le résultat : on aurait dit {w:animal}.`,
  ], [
    `I tried cooking {w:food} to impress someone. The fire brigade came. They had a taste.`,
    `The smoke alarm went off while I was making pasta. Pasta. The firefighter said "{w:exclaim}".`,
    `I followed a cooking tutorial by {w:celeb}. The result looked like {w:animal}.`,
  ]),
  A('weed_couch', '🌿', 1, { age: [18, 30] }, [
    `Soirée canapé avec des potes et un pétard. On a regardé {w:movie} et on a pleuré de rire à la scène la plus triste.`,
    `J'ai fumé un truc trop fort. J'ai passé deux heures à fixer {w:object} en murmurant « {w:exclaim} ».`,
    `Petite fringale après un joint : j'ai mangé {w:food}, {w:food} et un yaourt périmé.`,
  ], [
    `Couch night with friends and a joint. We watched {w:movie} and cried laughing at the saddest scene.`,
    `I smoked something too strong. Spent two hours staring at {w:object} whispering "{w:exclaim}".`,
    `Post-joint munchies: I ate {w:food}, {w:food} and an expired yogurt.`,
  ]),
  A('bad_trip', '🍄', 2, { age: [18, 32] }, [
    `Un ami m'a filé un champignon « tranquille ». J'ai discuté avec {w:animal} pendant quatre heures. Il m'a insulté{|e}.`,
    `En plein bad trip, j'étais persuadé{|e} {w:conspiracy}. J'ai appelé ma mère pour la prévenir.`,
    `J'ai cru que mes mains étaient en {w:food}. J'ai essayé d'en manger un doigt. Petite morsure, gros cri.`,
  ], [
    `A friend gave me a "chill" mushroom. I talked to {w:animal} for four hours. It insulted me.`,
    `Mid bad trip I was convinced {w:conspiracy}. I called my mom to warn her.`,
    `I thought my hands were made of {w:food}. I tried eating a finger. Small bite, big scream.`,
  ]),
  A('uber_eats', '🛵', 0, { age: [18, 35] }, [
    `J'ai commandé {w:food} sur {w:app}. Le livreur a mangé la moitié des frites en route. Il me l'a avoué, les yeux dans les yeux.`,
    `Ma commande {w:app} est arrivée après [[1 h 30|2 h|3 h]]. Froide. Et c'était celle du voisin.`,
    `J'ai dépensé plus en livraison ce mois-ci qu'en loyer. Je suis un modèle économique à moi tout{|e} seul{|e}. Plat préféré : {w:food}.`,
  ], [
    `I ordered {w:food} on {w:app}. The courier ate half the fries on the way. He confessed, looking me in the eye.`,
    `My {w:app} order arrived after [[90 minutes|2 hours|3 hours]]. Cold. And it was the neighbour's.`,
    `I spent more on delivery this month than on rent. I am an entire business model. Favourite dish: {w:food}.`,
  ]),
  A('wedding_guest', '💒', 1, { age: [22, 35] }, [
    `Troisième mariage de potes cette année. J'ai fait la chenille sur {w:song} et pleuré pendant le discours du témoin.`,
    `À un mariage, j'étais placé{|e} à la table des célibataires, à côté de quelqu'un qui collectionne {w:object}.`,
    `J'ai renversé {w:drink} sur la robe de la mariée. Elle a souri. Elle me tuera plus tard.`,
  ], [
    `Third friends' wedding this year. I did the conga to {w:song} and cried during the best man's speech.`,
    `At a wedding I was seated at the singles table, next to someone who collects {w:object}.`,
    `I spilled {w:drink} on the bride's dress. She smiled. She'll kill me later.`,
  ]),
  A('wedding_drunk', '🍾', 2, { age: [22, 35] }, [
    `Au mariage de ma cousine, j'ai vomi dans la pièce montée. Les choux ont absorbé le choc.`,
    `Au mariage d'un pote, j'ai roulé une pelle au traiteur derrière le camion à paella. Le marié aussi, d'ailleurs.`,
    `J'ai fait un discours de témoin bourré{|e} où j'ai parlé des ex du marié, avec un PowerPoint et {w:song} en fond sonore.`,
  ], [
    `At my cousin's wedding I puked into the wedding cake. The cream puffs absorbed the impact.`,
    `At a buddy's wedding I made out with the caterer behind the paella truck. So did the groom, actually.`,
    `I gave a drunk best-man speech about the groom's exes, with a PowerPoint and {w:song} playing.`,
  ]),
  A('birthday_25', '🎂', 0, { age: [24, 26] }, [
    `Crise du quart de siècle : j'ai acheté une plante, puis {w:object}, puis j'ai pleuré.`,
    `Pour mes 25 ans, mes potes m'ont offert {w:gift}. Je sens que ma vie a atteint un plateau.`,
    `J'ai réalisé que les assurances me considèrent enfin comme un adulte responsable. Hahaha.`,
  ], [
    `Quarter-life crisis: I bought a plant, then {w:object}, then cried.`,
    `For my 25th, my friends gave me {w:gift}. I feel my life has reached a plateau.`,
    `I realized insurance companies finally see me as a responsible adult. Hahaha.`,
  ]),
  A('phone_broken', '📵', 0, { age: [18, 40] }, [
    `Mon téléphone est tombé {w:at_place}. L'écran ressemble maintenant à une toile d'araignée. Je continue.`,
    `Mon téléphone a fait une mise à jour et a perdu toutes mes photos sauf celles où on voit {w:food}.`,
    `J'ai cherché mon téléphone pendant vingt minutes avec la lampe torche de mon téléphone.`,
  ], [
    `My phone fell {w:at_place}. The screen now looks like a spiderweb. I carry on.`,
    `My phone updated and lost all my photos except the ones of {w:food}.`,
    `I looked for my phone for twenty minutes using my phone's flashlight.`,
  ]),
  A('bachelor_party', '🎉', 2, { age: [22, 38] }, [
    `EVG {w:far_place} : le futur marié s'est réveillé rasé, tatoué et fiancé à quelqu'un d'autre.`,
    `À l'enterrement de vie de jeune fille, on a eu un strip-teaseur déguisé en {w:weird_job}. Il a glissé sur le cocktail.`,
    `EVJF : on a perdu la future mariée {w:at_place}. Retrouvée six heures plus tard en train de vomir dans {w:vehicle}.`,
  ], [
    `Stag do {w:far_place}: the groom woke up shaved, tattooed and engaged to someone else.`,
    `At the bachelorette we had a stripper dressed as {w:weird_job}. He slipped on a cocktail.`,
    `Hen party: we lost the bride {w:at_place}. Found her six hours later puking into {w:vehicle}.`,
  ]),
  A('crypto_young', '📉', 1, { age: [18, 35] }, [
    `J'ai mis mes économies dans une crypto appelée {w:nickname}Coin. Elle vaut maintenant moins qu'un ticket de métro.`,
    `Un mec sur {w:app} m'a promis +3 000 % en une semaine. J'ai perdu 300 €. Il m'a conseillé de « hodl ».`,
    `J'ai regardé le cours de ma crypto toutes les [[4|7|12]] minutes pendant une journée. Elle s'est effondrée pendant que je faisais pipi {w:at_place}.`,
  ], [
    `I put my savings into a crypto called {w:nickname}Coin. It's now worth less than a subway ticket.`,
    `A guy on {w:app} promised me +3,000% in a week. I lost $300. He told me to "hodl".`,
    `I checked my crypto price every [[4|7|12]] minutes for a day. It crashed while I was peeing {w:at_place}.`,
  ]),
  A('flatmate_nude', '🧖', 2, { age: [18, 30] }, [
    `Mon coloc se balade à poil dans l'appart « pour respirer ». Il s'assoit sur le canapé. Sur MON coussin, en mangeant {w:food}.`,
    `J'ai surpris ma colocataire en train de se raser les jambes dans l'évier de la cuisine. Les poils sont dans le pesto.`,
    `Mon coloc s'est coupé les ongles de pied sur la table basse. J'en ai retrouvé un dans {w:food}.`,
  ], [
    `My flatmate walks around the flat naked "to breathe". He sits on the couch. On MY cushion, eating {w:food}.`,
    `I caught my flatmate shaving her legs in the kitchen sink. The hair is in the pesto.`,
    `My flatmate clipped his toenails on the coffee table. I found one in {w:food}.`,
  ]),
  A('stairs_fall', '🤕', 0, { age: [18, 30] }, [
    `Je me suis cassé {w:bodypart} en descendant un escalier en dansant. Personne ne m'a vu, heureusement. Sauf tout le monde.`,
    `J'ai glissé {w:at_place} devant mon crush. J'ai fait semblant de chercher un truc par terre.`,
    `J'ai raté une marche {w:time} et crié « {w:exclaim} ». Un enfant s'est moqué de moi.`,
  ], [
    `I broke my {w:bodypart} dancing down a staircase. Luckily nobody saw. Except everyone.`,
    `I slipped {w:at_place} in front of my crush. Pretended I was looking for something on the floor.`,
    `I missed a step {w:time} and yelled "{w:exclaim}". A child laughed at me.`,
  ]),
  A('poop_stranger', '💩', 2, { age: [18, 40] }, [
    `Urgence intestinale dans le métro. J'ai serré les fesses pendant [[6|9|14]] stations. J'ai vu Dieu. Il était déçu.`,
    `J'ai dû faire caca chez la personne avec qui j'avais un date. Pas de papier. J'ai utilisé {w:object}.`,
    `J'ai bouché les toilettes d'une soirée. J'ai paniqué et je suis parti{|e} par la fenêtre du rez-de-chaussée en criant « {w:exclaim} ».`,
  ], [
    `Bowel emergency on the subway. I clenched for [[6|9|14]] stops. I saw God. He was disappointed.`,
    `I had to poop at my date's place. No paper. I used {w:object}.`,
    `I clogged the toilet at a party. I panicked and left through the ground-floor window yelling "{w:exclaim}".`,
  ]),
  A('roomie_pet', '🐹', 2, { age: [18, 30] }, [
    `Mon coloc a adopté {w:animal} sans demander. Il dort dans mon panier à linge. La bestiole, pas le coloc.`,
    `Le chat de la coloc a chié dans ma chaussure. On a eu une discussion. Il n'a rien regretté. Ma chaussure dégage désormais {w:smell}.`,
    `On a voté en réunion de coloc pour adopter {w:animal}. Il a déjà mangé deux câbles et un caleçon.`,
  ], [
    `My flatmate adopted {w:animal} without asking. It sleeps in my laundry basket. The animal, not the flatmate.`,
    `The flat cat shat in my shoe. We had a talk. It regretted nothing. My shoe now gives off {w:smell}.`,
    `We voted at the flat meeting to adopt {w:animal}. It has already eaten two cables and a pair of boxers.`,
  ]),
  A('karaoke', '🎤', 1, { age: [18, 35] }, [
    `Karaoké : j'ai chanté {w:song} avec une conviction terrifiante. Un couple a quitté le bar.`,
    `J'ai fait un duo sur {w:song} avec un inconnu bourré. On a fini en larmes, dans les bras l'un de l'autre.`,
    `J'ai monopolisé le micro du karaoké pendant [[40 minutes|une heure|deux heures]]. Le patron a coupé le courant en plein {w:song}.`,
  ], [
    `Karaoke: I sang {w:song} with terrifying conviction. A couple left the bar.`,
    `I did a duet of {w:song} with a drunk stranger. We ended up crying in each other's arms.`,
    `I hogged the karaoke mic for [[40 minutes|an hour|two hours]]. The owner cut the power in the middle of {w:song}.`,
  ]),
  A('lost_keys', '🔑', 0, { age: [18, 50] }, [
    `J'ai perdu mes clés {w:time}. Elles étaient dans ma main.`,
    `Je me suis enfermé{|e} dehors {w:weather}. Le serrurier m'a facturé le prix d'un rein.`,
    `Mes clés sont tombées dans une grille d'égout. J'ai passé une heure à pêcher avec {w:object}.`,
  ], [
    `I lost my keys {w:time}. They were in my hand.`,
    `I locked myself out {w:weather}. The locksmith charged me a kidney.`,
    `My keys fell down a drain. I spent an hour fishing with {w:object}.`,
  ]),
  A('student_job', '🍟', 1, { age: [18, 25], job: ['fastfood', 'cashier', 'waiter', 'delivery'] }, [
    `Un client m'a hurlé dessus parce que son plat était « trop chaud ». Je souris pour 11,65 € de l'heure.`,
    `J'ai fait un service de [[9|10|12]] heures. Je rêve en codes-barres et je dégage {w:smell}.`,
    `Un client m'a laissé un pourboire : {w:object}. Je ne sais pas quoi en faire.`,
  ], [
    `A customer screamed at me because his meal was "too hot". I smile for $11.65 an hour.`,
    `I worked a [[9|10|12]]-hour shift. I dream in barcodes and give off {w:smell}.`,
    `A customer left me a tip: {w:object}. I don't know what to do with it.`,
  ]),
  A('stalk_ex', '🕵️', 1, { age: [18, 35] }, [
    `J'ai stalké le compte de mon ex jusqu'en 2016 et liké une photo par accident. Mentalement, je vis désormais {w:far_place}.`,
    `Mon ex sort avec quelqu'un qui adore {w:hobby}. Je me sens bizarrement vengé{|e}.`,
    `J'ai bu deux verres et envoyé « tu dors ? » à mon ex. Réponse : {w:animal} en photo.`,
  ], [
    `I stalked my ex's account back to 2016 and accidentally liked a photo. Mentally, I now live {w:far_place}.`,
    `My ex is dating someone into {w:hobby}. I feel oddly avenged.`,
    `Two drinks in, I texted my ex "u up?". Reply: a photo of {w:animal}.`,
  ]),
  A('periods', '🩸', 2, { age: [18, 50], gender: 'f' }, [
    `Mes règles sont arrivées en plein entretien, sur une chaise blanche. J'ai fait semblant d'avoir renversé {w:drink}.`,
    `Crampes de règles niveau éventration. J'ai hurlé des insultes à mon utérus et mangé {w:food} à moi toute seule.`,
    `J'ai fait une tache de sang sur le canapé d'un date. J'ai retourné le coussin et je suis partie avec dignité.`,
  ], [
    `My period arrived mid-interview, on a white chair. I pretended I'd spilled {w:drink}.`,
    `Period cramps at disembowelment level. I screamed insults at my uterus and ate {w:food} all by myself.`,
    `I left a blood stain on a date's couch. I flipped the cushion and left with dignity.`,
  ]),
  A('morning_wood', '🍆', 2, { age: [18, 45], gender: 'm' }, [
    `Je me suis endormi dans le train et réveillé avec une érection monumentale en face d'une religieuse. On a prié tous les deux.`,
    `J'ai coincé mes bijoux de famille dans ma braguette. J'ai crié « {w:swear} » dans des toilettes publiques.`,
    `Le médecin du travail m'a demandé de tousser en me tenant les couilles. J'ai éternué. Ça s'est mal passé.`,
  ], [
    `I fell asleep on the train and woke up with a monumental boner facing a nun. We both prayed.`,
    `I caught the family jewels in my zipper. I screamed "{w:swear}" in a public restroom.`,
    `The work doctor told me to cough while holding my balls. I sneezed. It went badly.`,
  ]),
  A('vegan_phase', '🥦', 0, { age: [18, 35] }, [
    `J'ai tenu une semaine en vegan. Ça s'est terminé {w:time} devant {w:food}.`,
    `J'ai tenté le jeûne intermittent. J'ai craqué à 10 h 12 sur {w:food}.`,
    `Je me suis mis{|e} au kombucha. On dirait {w:drink} qui aurait passé l'été dans une voiture.`,
  ], [
    `Lasted a week as a vegan. It ended {w:time} in front of {w:food}.`,
    `I tried intermittent fasting. I cracked at 10:12 a.m. on {w:food}.`,
    `I got into kombucha. Tastes like {w:drink} that spent the summer in a car.`,
  ]),
  A('road_rage_young', '🚗', 1, { age: [18, 35] }, [
    `J'ai raté mon permis parce que j'ai crié « {w:swear} » sur l'inspecteur. Il a noté « bonne énergie, mauvaise attitude ».`,
    `J'ai calé [[3|5|8]] fois au même feu rouge. Derrière moi, {w:vehicle} klaxonnait l'hymne national.`,
    `J'ai eu le permis du premier coup. Le lendemain, j'ai rayé la voiture contre {w:object}.`,
  ], [
    `I failed my driving test because I yelled "{w:swear}" at the examiner. He wrote "good energy, bad attitude".`,
    `I stalled [[3|5|8]] times at the same red light. Behind me, {w:vehicle} was honking the national anthem.`,
    `I passed my driving test first try. Next day I scraped the car against {w:object}.`,
  ]),
  A('blood_donation', '🩸', 1, { age: [18, 60] }, [
    `J'ai donné mon sang. J'ai mangé [[quatre|sept|douze]] madeleines et je me suis évanoui{|e} sur l'infirmière.`,
    `Prise de sang : l'infirmière a raté ma veine trois fois. J'ai vu ma vie défiler, et {w:celeb} au passage.`,
    `J'ai donné mon sang pour le jus d'orange gratuit. J'ai pris quatre jus. On m'a demandé de partir.`,
  ], [
    `I gave blood. I ate [[four|seven|twelve]] cookies and fainted onto the nurse.`,
    `Blood test: the nurse missed my vein three times. I saw my life flash by, along with {w:celeb}.`,
    `I gave blood for the free orange juice. I had four. They asked me to leave.`,
  ]),
  A('pigeon_attack', '🐦', 2, { age: [18, 120] }, [
    `Un pigeon m'a chié dessus en pleine bouche pendant que je bâillais. La fiente rappelait {w:food}.`,
    `Une mouette m'a arraché {w:food} des mains et m'a griffé le front. J'ai pissé le sang comme un film de Tarantino.`,
    `{w:animal} m'a attaqué{|e} {w:at_place}. J'ai gagné, mais à quel prix.`,
  ], [
    `A pigeon shat straight into my mouth while I was yawning. It tasted like {w:food}.`,
    `A seagull snatched {w:food} from my hands and clawed my forehead. I gushed blood like a Tarantino movie.`,
    `{w:animal} attacked me {w:at_place}. I won, but at what cost.`,
  ]),
  A('gaming_night', '🎮', 0, { age: [18, 40] }, [
    `J'ai joué aux jeux vidéo jusqu'à 5 h du matin. Un gamin de 11 ans m'a dit « {w:insult} ». Il avait raison.`,
    `J'ai perdu [[12|20|35]] parties d'affilée en ligne. J'ai hurlé dans un coussin puis relancé en mangeant {w:food}.`,
    `Nuit blanche sur un jeu. J'ai mangé {w:food} sans lever les yeux de l'écran.`,
  ], [
    `Gamed until 5 a.m. An 11-year-old called me "{w:insult}". He was right.`,
    `I lost [[12|20|35]] online matches in a row. I screamed into a pillow and queued again, eating {w:food}.`,
    `All-nighter on a game. Ate {w:food} without looking away from the screen.`,
  ]),
  A('youth_hostel', '🛏️', 2, { age: [18, 30] }, [
    `Auberge de jeunesse : le mec du lit du dessus ronflait comme {w:vehicle} et pétait comme une fanfare.`,
    `Dans le dortoir de l'auberge, un couple a fait l'amour en pensant qu'on dormait. On ne dormait pas. On a noté.`,
    `J'ai pris une douche à l'auberge de jeunesse. J'ai attrapé une mycose qui parle trois langues et dégage {w:smell}.`,
  ], [
    `Hostel: the guy in the top bunk snored like {w:vehicle} and farted like a marching band.`,
    `In the hostel dorm, a couple had sex thinking we were asleep. We weren't. We gave scores.`,
    `I showered at the hostel. I caught a foot fungus that speaks three languages and gives off {w:smell}.`,
  ]),
  A('roommate_drama', '😤', 1, { age: [18, 30] }, [
    `Mon coloc a utilisé ma brosse à dents « juste une fois ». J'ai jeté la brosse, et pris un abonnement chez le dentiste.`,
    `Guerre froide dans la coloc pour {w:food}. Les post-it passifs-agressifs atteignent un niveau littéraire.`,
    `Mon coloc ne paie plus sa part depuis trois mois {w:excuse}. J'ai changé la serrure.`,
  ], [
    `My flatmate used my toothbrush "just once". I threw out the brush and booked a dentist.`,
    `Cold war in the flat over {w:food}. The passive-aggressive post-its have reached literary quality.`,
    `My flatmate hasn't paid his share for three months {w:excuse}. I changed the lock.`,
  ]),
  A('thrift_find', '🛍️', 0, { age: [18, 40] }, [
    `J'ai trouvé {w:object} dans une friperie pour 2 €. Il est désormais le centre de mon salon.`,
    `J'ai acheté une veste vintage. Dans la poche : un ticket de bus de 1987 et {w:object}.`,
    `Vide-grenier : j'ai négocié {w:object} pendant vingt minutes avec une mamie. Elle a gagné.`,
  ], [
    `I found {w:object} in a thrift shop for $2. It is now the centrepiece of my living room.`,
    `I bought a vintage jacket. In the pocket: a 1987 bus ticket and {w:object}.`,
    `Yard sale: I haggled over {w:object} for twenty minutes with a grandma. She won.`,
  ]),
  A('concert_mosh', '🤘', 2, { age: [18, 35] }, [
    `Concert : {w:band} sur scène, moi dans le pogo. Je suis sorti{|e} avec une dent en moins et la chaussure d'un inconnu.`,
    `Au concert, j'ai pris un coude dans le nez. J'ai saigné sur trois personnes. Elles ont trouvé ça punk.`,
    `Je me suis fait porter par la foule pendant que {w:band} jouait. On m'a lâché{|e}. Je suis tombé{|e} sur {w:object}.`,
  ], [
    `Gig: {w:band} on stage, me in the mosh pit. I came out missing a tooth and wearing a stranger's shoe.`,
    `At the gig I took an elbow to the nose. I bled on three people. They thought it was punk.`,
    `I crowd-surfed while {w:band} played. They dropped me. I landed on {w:object}.`,
  ]),
  A('sunburn', '🌞', 1, { age: [18, 50] }, [
    `Je me suis endormi{|e} à la plage. J'ai maintenant un coup de soleil qui dessine {w:object}.`,
    `Coup de soleil de compétition : je pèle comme un serpent. Je laisse des bouts de moi partout, même dans {w:food}.`,
    `J'ai oublié la crème solaire {w:far_place}. Je ressemble à un homard qui a tout perdu.`,
  ], [
    `I fell asleep at the beach. I now have a sunburn shaped like {w:object}.`,
    `Competition-grade sunburn: I'm peeling like a snake. I'm leaving bits of myself everywhere, even in {w:food}.`,
    `I forgot sunscreen {w:far_place}. I look like a lobster who lost everything.`,
  ]),
  A('ikea_couple', '🛋️', 1, { age: [20, 40], has: ['partner', 'spouse'] }, [
    `Expédition {w:to_place} en couple. On a failli rompre devant une étagère Billy.`,
    `Montage d'un meuble suédois à deux : il reste [[3|7|14]] vis et notre relation est en sursis. On s'est réconciliés devant {w:food}.`,
    `On s'est disputés pendant une heure pour savoir quelle couleur de canapé. On a acheté {w:object}.`,
  ], [
    `Couple expedition {w:to_place}. We nearly broke up in front of a bookcase.`,
    `Assembling Swedish furniture together: [[3|7|14]] screws left over and our relationship on probation. We made up over {w:food}.`,
    `We argued for an hour about the couch colour. We bought {w:object}.`,
  ]),
  A('moving_day', '📦', 0, { age: [18, 40] }, [
    `Déménagement au 6e sans ascenseur. Mes potes sont venus pour la pizza et sont partis avant le frigo. Il est resté coincé dans l'escalier avec {w:object}.`,
    `En déménageant, j'ai retrouvé {w:object} que je croyais perdu depuis des années. Il ne m'avait pas manqué.`,
    `J'ai déménagé {w:weather}. Mon matelas a pris l'eau, ma dignité aussi.`,
  ], [
    `Moved to a 6th-floor walk-up. My friends came for the pizza and left before the fridge. It's stuck in the stairwell with {w:object}.`,
    `While moving I found {w:object} I thought I'd lost years ago. I hadn't missed it.`,
    `I moved {w:weather}. My mattress got soaked, and so did my dignity.`,
  ]),
  A('std_scare', '🧪', 2, { age: [18, 40] }, [
    `Ça me gratte en bas depuis trois jours. J'ai fait un dépistage. Verdict : allergie à la lessive. J'ai pleuré de soulagement.`,
    `J'ai dû envoyer un SMS à [[quatre|six|neuf]] ex pour leur dire de se faire dépister. Personne n'a répondu « {w:compliment} ».`,
    `Le médecin a regardé mon entrejambe et a dit « {w:exclaim} ». Je n'ai jamais eu aussi peur.`,
  ], [
    `It's been itching down there for three days. Got tested. Verdict: detergent allergy. I cried with relief.`,
    `I had to text [[four|six|nine]] exes to tell them to get tested. Nobody replied "{w:compliment}".`,
    `The doctor looked at my crotch and said "{w:exclaim}". I've never been so scared.`,
  ]),
  A('condom_fail', '🎈', 2, { age: [18, 45] }, [
    `Le préservatif a craqué. On a passé la nuit sur Doctissimo et le matin à la pharmacie, en lunettes de soleil {w:weather}.`,
    `J'ai fait tomber une boîte de capotes à la caisse {w:at_place}. La caissière a dit « bon courage ».`,
    `Mon plan cul a gardé ses chaussettes. J'ai gardé mon respect. Enfin, un peu.`,
  ], [
    `The condom broke. We spent the night on WebMD and the morning at the pharmacy, in sunglasses, {w:weather}.`,
    `I dropped a box of condoms at the checkout {w:at_place}. The cashier said "good luck".`,
    `My hookup kept his socks on. I kept my respect. Well, some of it.`,
  ]),
  A('influencer_try', '📸', 0, { age: [18, 30], followers: [0, 999] }, [
    `J'ai décidé de devenir influenceu{r|se}. Ma première vidéo {w:app} a été vue par ma tante et un bot.`,
    `J'ai posté un tuto sur {w:hobby}. Trois vues. L'une d'elles, c'était moi en navigation privée.`,
    `J'ai acheté une ring light. Mes photos culinaires, avec {w:food} en vedette, n'ont jamais été aussi tristes et bien éclairées.`,
  ], [
    `I decided to become an influencer. My first {w:app} video was seen by my aunt and a bot.`,
    `I posted a tutorial on {w:hobby}. Three views. One was me in incognito.`,
    `I bought a ring light. My food photos, starring {w:food}, have never been so sad and so well lit.`,
  ]),
  A('wisdom_tooth', '🦷', 2, { age: [18, 28] }, [
    `On m'a arraché les dents de sagesse. J'ai la tête gonflée comme {w:animal} et je bave du sang dans mon oreiller.`,
    `Sous anesthésie après les dents de sagesse, j'ai demandé le dentiste en mariage et appelé l'infirmière « {w:nickname} ».`,
    `Le dentiste a dû casser ma dent de sagesse au marteau. Un bout a volé jusqu'à la salle d'attente et atterri dans {w:drink}.`,
  ], [
    `Had my wisdom teeth out. My face is swollen like {w:animal} and I'm drooling blood into my pillow.`,
    `Under anaesthesia after my wisdom teeth, I proposed to the dentist and called the nurse "{w:nickname}".`,
    `The dentist had to break my wisdom tooth with a hammer. A chunk flew into the waiting room and landed in {w:drink}.`,
  ]),
  // ───────────── Adultes 30–60 ─────────────
  A('commute', '🚇', 0, { age: [25, 62], job: true }, [
    `Métro bondé : j'ai passé [[20|35|50]] minutes avec le visage dans l'aisselle d'un inconnu. Elle dégageait {w:smell}. On est intimes maintenant.`,
    `Mon train a été supprimé « pour raisons techniques ». J'ai attendu {w:weather} sur le quai avec 400 personnes qui me ressemblaient.`,
    `Dans le RER, un type écoutait {w:song} sans écouteurs. Personne n'a rien dit. On est tous complices.`,
  ], [
    `Packed subway: I spent [[20|35|50]] minutes with my face in a stranger's armpit. It gave off {w:smell}. We're close now.`,
    `My train was cancelled "for technical reasons". I waited {w:weather} on the platform with 400 people who looked just like me.`,
    `On the train, a guy played {w:song} with no headphones. Nobody said anything. We're all accomplices.`,
  ]),
  A('commute_car', '🚦', 1, { age: [25, 62], job: true }, [
    `Bouchon de [[45 minutes|1 h 20|2 h]] sur le périph. J'ai crié « {w:swear} » quarante fois et écouté {w:song} en entier.`,
    `Un camion devant moi transportait {w:animal}. On s'est regardés dans les bouchons pendant une heure. Une vraie connexion.`,
    `J'ai fait un doigt d'honneur à un automobiliste. C'était mon nouveau boss, qui conduisait {w:vehicle}. Lundi va être long.`,
  ], [
    `[[45-minute|80-minute|2-hour]] traffic jam on the ring road. I yelled "{w:swear}" forty times and listened to {w:song} in full.`,
    `A truck ahead of me was carrying {w:animal}. We stared at each other in traffic for an hour. A real connection.`,
    `I flipped off a driver. It was my new boss, driving {w:vehicle}. Monday is going to be long.`,
  ]),
  A('meeting', '📊', 1, { age: [25, 65], job: true }, [
    `Réunion de [[1 h|2 h|3 h]] chez {employer} qui aurait pu être un mail. Pour tout buffet : {w:food}.`,
    `En visio, j'ai oublié de couper ma caméra et je me suis curé le nez devant toute la direction. Le PDG a dit « {w:exclaim} ».`,
    `Mon collègue a dit « on se fait un point » [[12|19|27]] fois aujourd'hui. Je fais un point sur ma démission.`,
    `Le séminaire d'entreprise avait pour thème « {w:hobby} et leadership ». J'ai fait semblant d'y croire.`,
  ], [
    `A [[1-hour|2-hour|3-hour]] meeting at {employer} that could have been an email. The only refreshment: {w:food}.`,
    `On a video call I forgot to turn off my camera and picked my nose in front of the whole board. The CEO said "{w:exclaim}".`,
    `My coworker said "let's circle back" [[12|19|27]] times today. I'm circling back to my resignation.`,
    `The company retreat theme was "{w:hobby} and leadership". I pretended to believe in it.`,
  ]),
  A('office_microwave', '🍲', 1, { age: [22, 65], job: true }, [
    `Quelqu'un a réchauffé du poisson au micro-ondes du bureau. L'étage entier dégage {w:smell}. Les RH enquêtent.`,
    `On m'a volé {w:food} dans le frigo du boulot. J'ai mis une caméra. C'est le directeur.`,
    `J'ai fait exploser {w:food} dans le micro-ondes du bureau. Je n'ai pas nettoyé. Je ne nettoierai jamais.`,
  ], [
    `Someone microwaved fish at the office. The whole floor gives off {w:smell}. HR is investigating.`,
    `Someone stole {w:food} from the work fridge. I set up a camera. It's the director.`,
    `I exploded {w:food} in the office microwave. I didn't clean it. I never will.`,
  ]),
  A('office_toilet', '🚽', 2, { age: [22, 65], job: true }, [
    `J'ai fait un caca nucléaire dans les toilettes du bureau. Mon boss est entré juste après. Il me regarde différemment.`,
    `Mon collègue passe [[40|55|70]] minutes par jour aux toilettes avec son téléphone. Il est payé pour chier. Respect.`,
    `Quelqu'un a repeint le mur des toilettes du bureau avec du caca. Mail général : « Qui ? ». Personne n'a répondu.`,
  ], [
    `I dropped a nuclear dump in the office toilet. My boss walked in right after. He looks at me differently now.`,
    `My coworker spends [[40|55|70]] minutes a day on the toilet with his phone. He gets paid to poop. Respect.`,
    `Someone painted the office bathroom wall with poop. All-staff email: "Who?". Nobody replied.`,
  ]),
  A('boss_rant', '🤬', 1, { age: [22, 65], job: true }, [
    `Mon boss m'a convoqué{|e} pour me dire de « sortir de ma zone de confort ». J'y retourne demain matin.`,
    `J'ai écrit un mail à mon chef qui commençait par « {w:insult} ». Je ne l'ai pas envoyé. Je le relis le soir pour dormir.`,
    `Le patron a annoncé « pas d'augmentation cette année » depuis sa Tesla neuve. Quel connard.`,
  ], [
    `My boss called me in to tell me to "step out of my comfort zone". I'm going back in tomorrow morning.`,
    `I wrote my boss an email starting with "{w:insult}". I didn't send it. I reread it at night to fall asleep.`,
    `The boss announced "no raises this year" from his brand-new Tesla. What a dick.`,
  ]),
  A('coworker_bday', '🎂', 0, { age: [22, 65], job: true }, [
    `Pot de départ d'un collègue dont je ne connaissais pas le prénom. J'ai fait un discours. Il a pleuré et m'a offert {w:object}.`,
    `Cagnotte au boulot pour l'anniversaire de quelqu'un : on lui a offert {w:gift}. Il a fait semblant d'aimer.`,
    `J'ai mangé [[trois|cinq|huit]] parts de gâteau au pot du service. Je n'ai jamais travaillé avec cette équipe.`,
  ], [
    `Farewell drinks for a coworker whose name I didn't know. I gave a speech. He cried and gave me {w:object}.`,
    `Office collection for someone's birthday: we got them {w:gift}. They pretended to love it.`,
    `I ate [[three|five|eight]] slices of cake at the department party. I've never worked with that team.`,
  ]),
  A('kids_morning', '🥣', 0, { age: [25, 60], has: 'child' }, [
    `Matin chaotique : un enfant a mis ses chaussures dans le grille-pain, l'autre a mangé {w:food} au petit-déj.`,
    `Mon enfant m'a demandé pourquoi le ciel est bleu, pourquoi on meurt et ce qu'est {w:object}. À 7 h 12.`,
    `J'ai déposé les enfants à l'école en pyjama. Personne n'a remarqué. Enfin, toutes les mamans ont remarqué.`,
  ], [
    `Chaotic morning: one kid put their shoes in the toaster, the other ate {w:food} for breakfast.`,
    `My kid asked me why the sky is blue, why we die and what {w:object} is. At 7:12 a.m.`,
    `I dropped the kids at school in my pyjamas. Nobody noticed. Well, every parent noticed.`,
  ]),
  A('kids_drawing', '🖍️', 1, { age: [25, 55], has: 'child' }, [
    `Mon enfant m'a dessiné en {w:animal}. Il paraît que c'est ressemblant.`,
    `Réunion parents-profs : mon enfant a raconté à toute la classe que je pratique {w:hobby} tout nu{|e}.`,
    `Mon enfant m'a offert {w:gift} pour la fête des parents. J'ai pleuré. Puis je l'ai rangé dans un placard pour toujours.`,
  ], [
    `My kid drew me as {w:animal}. Apparently it's a good likeness.`,
    `Parent-teacher meeting: my kid told the whole class I do {w:hobby} naked.`,
    `My kid gave me {w:gift} for Parents' Day. I cried. Then I put it in a cupboard forever.`,
  ]),
  A('kids_vomit', '🤮', 2, { age: [25, 55], has: 'child' }, [
    `Gastro familiale : un enfant m'a vomi dans le décolleté à 3 h du matin. J'ai vomi sur l'enfant. Cycle de la vie.`,
    `Mon gosse a fait caca dans la baignoire et l'a appelé « {w:nickname} ». Il voulait le garder.`,
    `L'enfant a eu la chiasse en plein restaurant. Le jet a atteint la table d'à côté. On a payé leur dessert.`,
  ], [
    `Family stomach bug: a kid puked down my shirt at 3 a.m. I puked on the kid. Circle of life.`,
    `My kid pooped in the bath and named it "{w:nickname}". He wanted to keep it.`,
    `The kid got the runs mid-restaurant. The spray hit the next table. We paid for their dessert.`,
  ]),
  A('kids_tantrum', '😭', 1, { age: [25, 55], has: 'child' }, [
    `Mon enfant a fait une crise {w:at_place} parce que je refusais d'acheter {w:object}. J'ai fait semblant de ne pas le connaître.`,
    `Mon gosse a appris un gros mot à l'école. Il le répète en boucle chez sa grand-mère. Il le tient de moi. Le mot : « {w:insult} ».`,
    `J'ai survécu à un anniversaire de 14 gamins sous sucre. J'ai bu {w:drink} en cachette dans la cave.`,
  ], [
    `My kid threw a tantrum {w:at_place} because I wouldn't buy {w:object}. I pretended not to know him.`,
    `My kid learned a swear word at school. He repeats it nonstop at his grandma's. He got it from me. The word: "{w:insult}".`,
    `I survived a birthday party of 14 sugar-high kids. I secretly drank {w:drink} in the cellar.`,
  ]),
  A('kids_lego', '🧱', 1, { age: [25, 55], has: 'child' }, [
    `J'ai marché sur un Lego pieds nus {w:time}. J'ai inventé [[six|neuf|quinze]] nouveaux jurons.`,
    `Mon enfant a mis {w:object} dans les toilettes « pour voir ». Le plombier a vu, lui aussi.`,
    `J'ai passé la soirée à construire un château en Lego. Les enfants dormaient depuis longtemps. C'était pour moi. Avec {w:animal} en guise de dragon.`,
  ], [
    `I stepped on a Lego barefoot {w:time}. I invented [[six|nine|fifteen]] new swear words.`,
    `My kid flushed {w:object} down the toilet "to see". The plumber saw too.`,
    `I spent the evening building a Lego castle. The kids had been asleep for hours. It was for me. With {w:animal} as the dragon.`,
  ]),
  A('kids_teen', '📱', 0, { age: [38, 65], has: 'child' }, [
    `Mon ado m'a dit que j'étais « cringe ». J'ai cherché ce que ça veut dire. C'était encore plus cringe.`,
    `Mon ado ne parle plus qu'en émojis et en grognements. J'ai appris le grognement en observant {w:animal}.`,
    `J'ai voulu faire une danse {w:app} avec mon ado. Il a quitté la maison pour la journée.`,
  ], [
    `My teen called me "cringe". I looked up what it means. That was even more cringe.`,
    `My teen now speaks only in emojis and grunts. I learned grunting by watching {w:animal}.`,
    `I tried doing a dance from {w:app} with my teen. He left the house for the day.`,
  ]),
  A('kids_school_run', '🚸', 0, { age: [25, 55], has: 'child' }, [
    `Les devoirs de maths de CM2 m'ont humilié{|e}. J'ai demandé à {w:app}. Il s'est trompé aussi.`,
    `Fête de l'école : mon enfant jouait {w:animal} numéro 3. Je l'ai filmé pendant 47 minutes.`,
    `J'ai oublié d'aller chercher mon enfant à l'école. Il m'a pardonné contre {w:food}.`,
  ], [
    `Fifth-grade math homework humiliated me. I asked {w:app}. It got it wrong too.`,
    `School show: my kid played {w:animal} number 3. I filmed for 47 minutes.`,
    `I forgot to pick my kid up from school. He forgave me in exchange for {w:food}.`,
  ]),
  A('baby_sleep', '🍼', 2, { age: [22, 50], has: 'child' }, [
    `Le bébé a dormi [[2|3|4]] heures cette nuit. Au boulot, j'ai mis le café dans l'imprimante et appelé mon boss « {w:nickname} ».`,
    `Couche explosive : le caca est monté jusque dans le dos du bébé. Il a souri. Je n'ai pas souri.`,
    `J'ai chanté {w:song} au bébé pendant une heure pour l'endormir. C'est moi qui me suis endormi{|e}.`,
  ], [
    `The baby slept [[2|3|4]] hours last night. At work I put the coffee in the printer and called my boss "{w:nickname}".`,
    `Diaper blowout: the poop went all the way up the baby's back. He smiled. I did not.`,
    `I sang {w:song} to the baby for an hour to get him to sleep. I'm the one who fell asleep.`,
  ]),
  A('couple_netflix', '📺', 0, { age: [25, 70], has: ['partner', 'spouse'] }, [
    `On a passé [[40|55|70]] minutes à choisir un film. On a regardé un épisode de {w:show} qu'on avait déjà vu.`,
    `Mon couple a traversé une crise grave : l'autre a regardé {w:show} sans moi.`,
    `Soirée en amoureux : {w:food} devant {w:movie}. On s'est endormis au générique du début.`,
  ], [
    `We spent [[40|55|70]] minutes choosing a movie. We watched an episode of {w:show} we'd already seen.`,
    `My relationship went through a serious crisis: my other half watched {w:show} without me.`,
    `Date night: {w:food} in front of {w:movie}. We fell asleep during the opening credits.`,
  ]),
  A('couple_fight', '💢', 1, { age: [25, 70], has: ['partner', 'spouse'] }, [
    `On s'est engueulés pendant une heure. Le sujet : {w:object}. Personne ne se souvient qui avait raison.`,
    `Dispute de couple dans la voiture à cause du GPS. On a fini {w:at_place} sans se parler.`,
    `Mon conjoint ronfle comme {w:vehicle}. J'ai enregistré pour avoir des preuves. Il nie.`,
  ], [
    `We argued for an hour. The topic: {w:object}. Nobody remembers who was right.`,
    `Couple fight in the car over the GPS. We ended up {w:at_place} in silence.`,
    `My other half snores like {w:vehicle}. I recorded it as evidence. He denies everything.`,
  ]),
  A('couple_spice', '🔥', 2, { age: [25, 65], has: ['partner', 'spouse'] }, [
    `On a voulu pimenter notre vie de couple avec des menottes. On a perdu la clé. Les pompiers étaient très professionnels.`,
    `Mon conjoint m'a fait un strip-tease sur {w:song}. Il s'est coincé le dos à mi-parcours. Kiné, glaçons, fou rire.`,
    `On a testé une position vue sur Internet. J'ai entendu {w:sound} venant de ma hanche. Urgences.`,
    `Câlin du dimanche interrompu par {w:animal} qui a sauté sur le lit au pire moment. Traumatisme partagé.`,
  ], [
    `We tried spicing things up with handcuffs. We lost the key. The firefighters were very professional.`,
    `My other half did a striptease to {w:song}. Threw out their back halfway. Physio, ice packs, giggles.`,
    `We tried a position from the internet. I heard {w:sound} from my hip. ER.`,
    `Sunday cuddle interrupted by {w:animal} jumping on the bed at the worst moment. Shared trauma.`,
  ]),
  A('couple_fart', '💨', 2, { age: [25, 90], has: ['partner', 'spouse'] }, [
    `J'ai fait le coup de la couette à mon conjoint. Il a pleuré. On est ensemble pour la vie, maintenant.`,
    `Mon conjoint a pété au lit en dormant. Le chien a quitté la chambre. Moi aussi. La pièce dégage encore {w:smell}.`,
    `On en est au stade du couple où on fait pipi la porte ouverte en se racontant sa journée.`,
  ], [
    `I Dutch-ovened my other half. They cried. We're together for life now.`,
    `My partner farted in their sleep. The dog left the room. So did I. The room still gives off {w:smell}.`,
    `We've reached the couple stage where we pee with the door open while chatting about our day.`,
  ]),
  A('anniversary', '💐', 0, { age: [25, 90], has: 'spouse' }, [
    `J'ai oublié notre anniversaire de mariage. J'ai acheté {w:gift} à la station-service. Ça n'a trompé personne.`,
    `Pour notre anniversaire de mariage, on est partis {w:far_place}. Il a plu. On a joué aux cartes à l'hôtel. C'était parfait.`,
    `On a relu nos vœux de mariage. On a beaucoup ri. Surtout au passage « je ne te laisserai jamais choisir la déco ».`,
  ], [
    `I forgot our wedding anniversary. Bought {w:gift} at the gas station. Fooled nobody.`,
    `For our anniversary we went {w:far_place}. It rained. We played cards at the hotel. It was perfect.`,
    `We reread our wedding vows. We laughed a lot. Especially at "I'll never let you pick the decor".`,
  ]),
  A('in_laws', '👵', 1, { age: [25, 65], has: ['partner', 'spouse'] }, [
    `Repas chez la belle-famille : on m'a servi {w:food} et demandé quand on fait des enfants. Entre la poire et le fromage.`,
    `Ma belle-mère m'a offert {w:gift} avec un regard qui disait « {w:insult} ».`,
    `Mon beau-père m'a expliqué {w:conspiracy} pendant tout le repas. J'ai hoché la tête [[200|340|600]] fois.`,
  ], [
    `Dinner with the in-laws: they served {w:food} and asked when we're having kids. Between cheese and dessert.`,
    `My mother-in-law gave me {w:gift} with a look that said "{w:insult}".`,
    `My father-in-law explained {w:conspiracy} all through dinner. I nodded [[200|340|600]] times.`,
  ]),
  A('money_tight', '💸', 0, { age: [25, 65], money: [-1e12, 2000] }, [
    `Fin du mois le 9. J'ai fait un dîner avec {w:food} et la boîte de conserve la plus ancienne du placard.`,
    `Ma carte a été refusée {w:at_place}. J'ai prétendu un problème de puce. La caissière connaissait la chanson.`,
    `J'ai regardé mon relevé de compte et fait {w:sound}. Mon banquier m'a envoyé un SMS de condoléances.`,
  ], [
    `End of the month on the 9th. Made dinner from {w:food} and the oldest can in the cupboard.`,
    `My card was declined {w:at_place}. I blamed the chip. The cashier had heard that one before.`,
    `I looked at my bank statement and made {w:sound}. My banker sent a condolences text.`,
  ]),
  A('money_overdraft', '🏦', 1, { age: [25, 65], money: [-1e12, 2000] }, [
    `Agios, frais de rejet, frais de frais. Ma banque me facture le fait d'être pauvre. Bande d'enfoirés.`,
    `J'ai vendu {w:object} pour payer l'électricité. Je m'éclaire à la bougie pour économiser.`,
    `J'ai rempli un dossier de crédit à la conso pour acheter {w:food}. On en est là.`,
  ], [
    `Overdraft fees, bounced-payment fees, fees on fees. My bank charges me for being poor. Bastards.`,
    `I sold {w:object} to pay the electric bill. I'm using candles to save power.`,
    `I filled out a consumer-credit form to buy {w:food}. That's where we are.`,
  ]),
  A('money_broke_trash', '🗑️', 2, { age: [25, 65], money: [-1e12, 1500] }, [
    `J'ai fouillé la poubelle du supermarché. J'ai trouvé {w:food} encore sous plastique... et un rat qui m'a mordu le pouce.`,
    `Pour économiser le PQ, j'utilise les prospectus de la boîte aux lettres. {w:celeb} me fixe depuis la pub à chaque fois.`,
    `J'ai mangé de la pâtée pour chat pour voir. C'est meilleur que mes pâtes au beurre. Je suis au fond.`,
  ], [
    `I dug through the supermarket bins. Found {w:food} still wrapped... and a rat that bit my thumb.`,
    `To save on toilet paper I use the junk mail. {w:celeb} stares at me from the ad every time.`,
    `I tried cat food to see. It's better than my buttered pasta. I've hit rock bottom.`,
  ]),
  A('rich_life', '💎', 0, { age: [25, 120], money: [1e6, 1e15] }, [
    `J'ai acheté {w:object} en or massif {w:excuse}. Il trône dans l'entrée.`,
    `Mon majordome m'a apporté {w:drink} sur un plateau en argent. Il était trop froid. Je l'ai renvoyé.`,
    `J'ai privatisé un restaurant entier pour manger {w:food} tout{|e} seul{|e}. Le chef a pleuré d'incompréhension.`,
  ], [
    `I bought a solid gold version of {w:object} {w:excuse}. It sits in the hallway.`,
    `My butler brought me {w:drink} on a silver tray. It was too cold. I sent it back.`,
    `I booked out an entire restaurant to eat {w:food} alone. The chef cried in confusion.`,
  ]),
  A('rich_bored', '🥂', 1, { age: [25, 120], money: [1e6, 1e15] }, [
    `Je me suis tellement ennuyé{|e} que j'ai fait livrer {w:animal} par hélicoptère. Il a mangé le canapé en cuir.`,
    `J'ai payé {w:celeb} pour venir à mon anniversaire : une soirée entière à bouder dans un coin. J'ai payé quand même.`,
    `Mon comptable m'a parlé de « paradis fiscal ». Il avait des étoiles dans les yeux. Moi aussi. On a trinqué avec {w:drink}.`,
  ], [
    `I got so bored I had {w:animal} delivered by helicopter. It ate the leather couch.`,
    `I paid {w:celeb} to come to my birthday: a whole night sulking in a corner. I paid anyway.`,
    `My accountant mentioned "tax haven". He had stars in his eyes. So did I. We toasted with {w:drink}.`,
  ]),
  A('rich_trash', '🤑', 2, { age: [25, 120], money: [1e6, 1e15] }, [
    `J'ai allumé un cigare avec un billet de 500. Le billet s'est collé à ma moustache et a cramé un sourcil.`,
    `J'ai fait remplir ma piscine de champagne. Elle a attiré toutes les guêpes du département. J'ai enflé comme un ballon.`,
    `J'ai fait installer des toilettes en or. J'y ai lâché un caca historique. Le majordome a démissionné en hurlant « {w:swear} ».`,
  ], [
    `I lit a cigar with a $500 bill. It stuck to my moustache and torched an eyebrow.`,
    `I had my pool filled with champagne. It attracted every wasp in the county. I swelled up like a balloon.`,
    `I had gold toilets installed. I dropped a historic dump in them. The butler quit, screaming "{w:swear}".`,
  ]),
  A('admin_hell', '📑', 0, { age: [22, 90] }, [
    `On m'a demandé un justificatif de domicile pour obtenir un justificatif de domicile. J'ai pleuré {w:at_place}.`,
    `J'ai fait la queue [[2|3|4]] heures {w:at_place} pour apprendre qu'il manquait une photocopie.`,
    `J'ai passé la matinée en attente avec un service client sur l'air de {w:song}. Ils ont raccroché à mon tour.`,
  ], [
    `They asked me for proof of address in order to issue proof of address. I cried {w:at_place}.`,
    `I queued [[2|3|4]] hours {w:at_place} to learn I was missing a photocopy.`,
    `Spent the morning on hold with customer service to {w:song}. They hung up when it was my turn.`,
  ]),
  A('admin_rage', '🗂️', 1, { age: [22, 90] }, [
    `Les impôts m'ont réclamé 3 centimes par lettre recommandée. J'ai crié « {w:swear} » à la boîte aux lettres.`,
    `Le chatbot de ma mutuelle m'a répondu « je n'ai pas compris » [[11|17|26]] fois. Je l'ai insulté. Il n'a pas compris non plus.`,
    `J'ai rempli un formulaire en ligne pendant une heure. Session expirée. J'ai mordu {w:object}.`,
  ], [
    `The tax office claimed 3 cents from me by registered mail. I yelled "{w:swear}" at the mailbox.`,
    `My insurer's chatbot said "I didn't understand" [[11|17|26]] times. I insulted it. It didn't understand that either.`,
    `I filled out an online form for an hour. Session expired. I bit {w:object}.`,
  ]),
  A('diy_fail', '🔨', 0, { age: [25, 80] }, [
    `J'ai voulu poser une étagère. J'ai percé une canalisation. Ma cuisine est désormais une piscine. {w:animal} y fait des longueurs.`,
    `Tuto YouTube : « réparer {w:object} en 5 minutes ». Six heures plus tard, j'ai trois pièces en trop.`,
    `J'ai repeint le salon tout{|e} seul{|e}. Le chat aussi est repeint. Et {w:object}.`,
  ], [
    `I tried putting up a shelf. I drilled into a pipe. My kitchen is now a pool. {w:animal} is doing laps in it.`,
    `YouTube tutorial: "fix {w:object} in 5 minutes". Six hours later I have three spare parts.`,
    `I repainted the living room by myself. The cat is also repainted. And {w:object}.`,
  ]),
  A('diy_blood', '🩸', 2, { age: [25, 80] }, [
    `Je me suis tapé sur le pouce avec un marteau. L'ongle est devenu violet, puis noir, puis il est parti vivre sa vie.`,
    `Accident de perceuse : la mèche a traversé le mur, puis un peu {w:bodypart}. Il y a du sang jusqu'au plafond.`,
    `J'ai coupé du carrelage sans gants. Le salon ressemble à une scène de crime. J'ai fini le chantier avec un doigt en moins de sensibilité.`,
  ], [
    `I hit my thumb with a hammer. The nail went purple, then black, then left to live its own life.`,
    `Drill accident: the bit went through the wall, then a bit of my {w:bodypart}. There's blood up to the ceiling.`,
    `I cut tiles without gloves. The living room looks like a crime scene. I finished the job with one less working finger.`,
  ]),
  A('neighbour_noise', '🏢', 1, { age: [22, 90] }, [
    `Mon voisin passe l'aspirateur à [[6 h|23 h|minuit]] tous les jours. J'ai glissé un mot. Il l'a aspiré.`,
    `La voisine du dessus déplace des meubles à 2 h du matin. Ou alors elle fait des claquettes avec {w:animal}.`,
    `Mes voisins ont fait une fête et ne m'ont pas invité{|e}. J'ai fait semblant d'être contrarié{|e} par le bruit. Je suis allé{|e} me plaindre avec {w:drink} à la main. Je suis resté{|e} jusqu'à 4 h.`,
  ], [
    `My neighbour vacuums at [[6 a.m.|11 p.m.|midnight]] every day. I slipped a note under his door. He vacuumed it up.`,
    `The upstairs neighbour moves furniture at 2 a.m. Or tap-dances with {w:animal}.`,
    `My neighbours threw a party and didn't invite me. I pretended to be upset about the noise. I went to complain holding {w:drink}. I stayed till 4 a.m.`,
  ]),
  A('neighbour_war', '⚔️', 1, { age: [22, 90] }, [
    `Guerre avec le voisin à cause de sa haie. Il m'a traité de « {w:insult} ». J'ai répondu « {w:insult} ». Match nul.`,
    `Le voisin a garé {w:vehicle} devant mon portail. J'ai garé ma poubelle devant le sien. L'escalade commence.`,
    `Mon voisin me dit « {w:threat} » depuis que j'ai coupé son Wi-Fi par accident. Ce n'était pas un accident.`,
  ], [
    `War with the neighbour over his hedge. He called me "{w:insult}". I replied "{w:insult}". A draw.`,
    `The neighbour parked {w:vehicle} in front of my gate. I parked my bin in front of his. Escalation begins.`,
    `My neighbour has been saying "{w:threat}" since I accidentally cut his Wi-Fi. It wasn't an accident.`,
  ]),
  A('neighbour_gross', '👃', 2, { age: [22, 90] }, [
    `Le voisin du dessous fait sécher ses slips sur le balcon, juste au niveau de ma fenêtre. Ils sont transparents de vieillesse.`,
    `Le chien du voisin chie devant ma porte tous les matins. J'ai renvoyé le colis par la fenêtre. Ça a fait splotch.`,
    `J'entends mon voisin se moucher, roter et pisser à travers le mur. On est plus proches que la plupart des couples.`,
  ], [
    `The downstairs neighbour dries his briefs on the balcony, right at my window level. They're see-through with age.`,
    `The neighbour's dog poops at my door every morning. I returned the package through his window. It went splat.`,
    `I can hear my neighbour blow his nose, burp and pee through the wall. We're closer than most couples.`,
  ]),
  A('gym_adult', '🧘', 0, { age: [30, 60] }, [
    `J'ai repris le sport. Au bout de [[8|12|15]] minutes de vélo d'appartement, j'ai vu une lumière blanche et {w:celeb} qui me faisait signe.`,
    `Cours pour débutants, thème : {w:hobby}. J'étais le seul à ne pas connaître le prof depuis vingt ans.`,
    `J'ai couru un 10 km. J'ai été doublé{|e} par {w:animal} et un monsieur de 82 ans.`,
  ], [
    `I got back into exercise. After [[8|12|15]] minutes on the stationary bike I saw a white light and {w:celeb} waving at me.`,
    `Beginners' class, subject: {w:hobby}. I was the only one who hadn't known the teacher for twenty years.`,
    `I ran a 10K. I was overtaken by {w:animal} and an 82-year-old man.`,
  ]),
  A('gym_crossfit', '💪', 2, { age: [30, 55] }, [
    `Mon collègue fait du CrossFit et ne parle que de ça. J'ai inventé une allergie à la sueur pour qu'il se taise.`,
    `Cours de yoga : pendant la posture du chien tête en bas, j'ai lâché une caisse. Le prof a dit « libère tes énergies ».`,
    `J'ai fait un marathon. Je n'ai plus d'ongles de pied, plus de tétons intacts, mais une médaille.`,
  ], [
    `My coworker does CrossFit and talks of nothing else. I invented a sweat allergy to shut him up.`,
    `Yoga class: during downward dog I ripped one. The teacher said "release your energies".`,
    `I ran a marathon. No toenails left, no intact nipples, but a medal.`,
  ]),
  A('midlife', '🏍️', 1, { age: [40, 55] }, [
    `Crise de la quarantaine : j'ai acheté {w:vehicle} et un blouson en cuir. Je ressemble à un oncle qui a divorcé.`,
    `J'ai teint mes cheveux pour cacher les blancs. Ils sont devenus orange. On m'appelle {w:nickname}.`,
    `J'ai envisagé de tout plaquer pour devenir {w:weird_job}. Puis j'ai pensé au crédit de la maison.`,
  ], [
    `Midlife crisis: I bought {w:vehicle} and a leather jacket. I look like a recently divorced uncle.`,
    `I dyed my hair to hide the grey. It turned orange. They call me {w:nickname}.`,
    `I considered quitting everything to become {w:weird_job}. Then I remembered the mortgage.`,
  ]),
  A('midlife_body', '🧓', 2, { age: [40, 60] }, [
    `Il m'a poussé un poil noir et dur de 4 cm sur l'oreille. Pendant la nuit. Il était fier. Je l'ai appelé {w:nickname}.`,
    `J'ai éternué en portant les courses et je me suis fait un tour de rein et un petit pipi en même temps.`,
    `Coloscopie de routine : on m'a fait boire quatre litres de purgatif. J'ai vécu dans les toilettes pendant douze heures en criant « {w:swear} ».`,
  ], [
    `A 2-inch black wiry hair grew on my ear. Overnight. It looked proud. I named it {w:nickname}.`,
    `I sneezed while carrying groceries and threw out my back and peed a little at the same time.`,
    `Routine colonoscopy: they made me drink a gallon of laxative. I lived on the toilet for twelve hours screaming "{w:swear}".`,
  ]),
  A('back_pain', '🦴', 0, { age: [35, 70] }, [
    `Je me suis bloqué le dos en ramassant {w:object}. J'ai mis vingt minutes à me relever.`,
    `Mon ostéo m'a fait craquer le dos. J'ai entendu {w:sound}. Je me sens neuf, et un peu agressé dans mon intimité vertébrale.`,
    `Je fais maintenant un bruit en m'asseyant. Et en me levant. Et en pensant m'asseoir.`,
  ], [
    `I threw my back out picking up {w:object}. Took me twenty minutes to get up.`,
    `My chiropractor cracked my back. I heard {w:sound}. I feel brand new and slightly assaulted in my spinal privacy.`,
    `I now make a noise when I sit down. And when I stand up. And when I think about sitting.`,
  ]),
  A('barbecue', '🍖', 0, { age: [25, 80] }, [
    `Barbecue entre voisins {w:weather}. Les saucisses étaient noires dehors et crues dedans. Comme mon âme.`,
    `Au barbecue, un oncle a expliqué {w:conspiracy}. Personne n'a osé l'interrompre, il tenait la pince.`,
    `J'ai allumé le barbecue avec beaucoup trop d'alcool à brûler. Je n'ai plus de sourcils mais les merguez sont top.`,
  ], [
    `Neighbourhood barbecue {w:weather}. The sausages were black outside and raw inside. Like my soul.`,
    `At the barbecue an uncle explained {w:conspiracy}. Nobody dared interrupt, he was holding the tongs.`,
    `I lit the barbecue with way too much lighter fluid. No more eyebrows, but the sausages are great.`,
  ]),
  A('holiday_family', '🏖️', 1, { age: [28, 60], has: 'child' }, [
    `Vacances en famille {w:far_place} : [[9|11|14]] heures de route, deux vomis, une crise de nerfs. On recommencera l'an prochain.`,
    `Au camping, les enfants se sont fait des amis et moi un ennemi : le voisin de l'emplacement 42.`,
    `On a passé les vacances {w:at_place} parce que les enfants ont voté. Je n'aurais jamais dû instaurer la démocratie.`,
  ], [
    `Family holiday {w:far_place}: [[9|11|14]] hours of driving, two vomits, one meltdown. We'll do it again next year.`,
    `At the campsite the kids made friends and I made an enemy: the guy on pitch 42.`,
    `We spent the holidays {w:at_place} because the kids voted. I should never have introduced democracy.`,
  ]),
  A('holiday_adult', '🌴', 2, { age: [30, 65] }, [
    `Vacances {w:far_place} en all inclusive. J'ai bu {w:drink} à 10 h du matin sans culpabilité.`,
    `À l'hôtel, un couple a fait l'amour bruyamment dans la chambre voisine toute la semaine. On a fini par leur offrir {w:drink}.`,
    `J'ai attrapé la turista {w:far_place}. J'ai vu le plafond de la salle de bain plus que la plage.`,
  ], [
    `All-inclusive holiday {w:far_place}. I drank {w:drink} at 10 a.m. with zero guilt.`,
    `At the hotel, a couple had loud sex next door all week. We ended up buying them {w:drink}.`,
    `I caught traveller's diarrhoea {w:far_place}. I saw more of the bathroom ceiling than the beach.`,
  ]),
  A('supermarket', '🛒', 0, { age: [22, 90] }, [
    `Je suis allé{|e} faire les courses pour du pain. Je suis ressorti{|e} avec {w:object}, {w:food} et pas de pain.`,
    `Self-checkout : « article inattendu dans la zone d'ensachage » [[6|9|14]] fois. J'ai fini par m'excuser auprès de la machine.`,
    `J'ai choisi la file la plus courte. La dame devant moi a payé en pièces de 1 centime, puis a voulu rendre {w:object}.`,
  ], [
    `I went shopping for bread. I came back with {w:object}, {w:food} and no bread.`,
    `Self-checkout: "unexpected item in bagging area" [[6|9|14]] times. I ended up apologizing to the machine.`,
    `I picked the shortest line. The lady in front paid in pennies, then tried to return {w:object}.`,
  ]),
  A('car_breakdown', '🚗', 0, { age: [22, 80] }, [
    `Ma voiture est tombée en panne {w:weather}. Le dépanneur est arrivé en {w:vehicle}.`,
    `Le garagiste a soulevé le capot et sifflé. Ça m'a coûté [[400|900|1 300]] €, rien que le sifflement.`,
    `Un voyant inconnu s'est allumé sur le tableau de bord. J'ai mis un post-it dessus. Problème réglé.`,
  ], [
    `My car broke down {w:weather}. The tow truck showed up as {w:vehicle}.`,
    `The mechanic opened the hood and whistled. It cost me [[$400|$900|$1,300]], just the whistle.`,
    `A mystery warning light came on on the dashboard. I put a post-it over it. Problem solved.`,
  ]),
  A('doctor_adult', '🩺', 0, { age: [30, 65] }, [
    `Mon médecin m'a dit d'arrêter {w:food} au petit-déj. Je suis allé{|e} voir un autre médecin.`,
    `J'ai tapé mes symptômes sur Internet. Selon le site, je suis mort{|e} depuis mardi. Cause probable : {w:disaster}.`,
    `Le médecin m'a pesé{|e}. Il a dit « hmm ». Je n'ai jamais entendu un « hmm » aussi long.`,
  ], [
    `My doctor told me to stop having {w:food} for breakfast. I went to see another doctor.`,
    `I googled my symptoms. According to the website I've been dead since Tuesday. Probable cause: {w:disaster}.`,
    `The doctor weighed me. He said "hmm". I've never heard such a long "hmm".`,
  ]),
  A('prostate', '🧤', 2, { age: [45, 90], gender: 'm' }, [
    `Toucher rectal chez l'urologue. Il a dit « détendez-vous » avec un doigt dans le cul. J'ai fixé une affiche où posait {w:animal}.`,
    `Je me lève [[trois|quatre|six]] fois par nuit pour pisser trois gouttes. Ma prostate me hait personnellement.`,
    `Le médecin a comparé ma prostate avec {w:food}. J'ai eu faim et peur en même temps.`,
  ], [
    `Prostate exam at the urologist. He said "relax" with a finger up my butt. I stared at a poster of {w:animal}.`,
    `I get up [[three|four|six]] times a night to pee three drops. My prostate hates me personally.`,
    `The doctor compared my prostate to {w:food}. I was hungry and scared at the same time.`,
  ]),
  A('menopause', '🔥', 1, { age: [45, 60], gender: 'f' }, [
    `Bouffée de chaleur en pleine réunion. J'ai ouvert la fenêtre {w:weather} et menacé quiconque la refermerait.`,
    `Ménopause : je transpire comme un rôti, je dors trois heures et j'ai envie d'étrangler {w:animal}.`,
    `Mon gynéco m'a parlé de « nouvelle étape de la vie ». Je lui ai lancé {w:object}. Manqué.`,
  ], [
    `Hot flash mid-meeting. I opened the window {w:weather} and threatened anyone who closed it.`,
    `Menopause: I sweat like a roast, sleep three hours and want to strangle {w:animal}.`,
    `My gynaecologist called it "a new stage of life". I threw {w:object} at him. Missed.`,
  ]),
  A('wine_night', '🍷', 1, { age: [30, 70] }, [
    `Apéro « juste un verre » avec des amis. On a fini {w:time} à chanter {w:song} sur le balcon.`,
    `J'ai fait une dégustation de vins. J'ai craché le premier, avalé les douze suivants.`,
    `J'ai ouvert une bouteille « pour la cuisine ». La cuisine n'en a pas eu.`,
  ], [
    `"Just one drink" with friends. We ended up {w:time} singing {w:song} on the balcony.`,
    `I went to a wine tasting. Spat the first one, swallowed the next twelve.`,
    `I opened a bottle "for cooking". The cooking didn't get any.`,
  ]),
  A('divorce_friend', '🥀', 1, { age: [32, 65] }, [
    `Un ami a divorcé. Il s'est acheté {w:vehicle} et une veste en cuir. Je lui donne six mois.`,
    `Soirée « divorce party » d'une copine : piñata à l'effigie de son ex, on l'a explosée avec {w:object}.`,
    `Mon pote en instance de divorce vit dans son garage avec {w:animal}. Il dit que c'est « temporaire ».`,
  ], [
    `A friend got divorced. He bought {w:vehicle} and a leather jacket. I give him six months.`,
    `A friend's divorce party: piñata shaped like her ex, we smashed it with {w:object}.`,
    `My buddy going through a divorce lives in his garage with {w:animal}. He says it's "temporary".`,
  ]),
  A('lottery', '🎟️', 1, { age: [18, 120] }, [
    `J'ai joué au Loto avec les dates de naissance de toute ma famille. J'ai gagné 2 €. Je les ai rejoués {w:excuse}.`,
    `J'ai gratté [[10|20|35]] tickets. Gain total : un ticket gratuit. Perdu aussi.`,
    `J'ai rêvé que je gagnais au Loto et que je m'achetais {w:vehicle}. Au réveil, on m'avait encore volé mon vélo.`,
  ], [
    `I played the lottery with my whole family's birthdays. Won $2. Played it again {w:excuse}.`,
    `I scratched [[10|20|35]] tickets. Total winnings: one free ticket. Lost that too.`,
    `I dreamed I won the lottery and bought {w:vehicle}. When I woke up my bike had been stolen again.`,
  ]),
  A('hairloss', '👨‍🦲', 0, { age: [28, 60], gender: 'm' }, [
    `Mon front gagne du terrain chaque année. Je l'appelle « la marée ».`,
    `J'ai trouvé une pub pour une greffe de cheveux {w:far_place}. Je l'ai gardée dans mes favoris. Juste au cas où.`,
    `Le coiffeur m'a demandé « je vous fais quoi ? ». J'ai répondu « un miracle ».`,
  ], [
    `My forehead gains ground every year. I call it "the tide".`,
    `I found an ad for a hair transplant {w:far_place}. Bookmarked it. Just in case.`,
    `The barber asked "what are we doing today?". I said "a miracle".`,
  ]),
  A('wrinkle', '🪞', 1, { age: [30, 55] }, [
    `J'ai découvert une ride en forme de point d'interrogation sur mon front. Ma vie, résumée.`,
    `On m'a vouvoyé{|e} {w:at_place} pour la première fois. J'ai vieilli de dix ans dans la journée.`,
    `Une jeune m'a dit que mes références étaient « vintage ». J'ai dû m'asseoir et boire {w:drink}.`,
  ], [
    `I found a question-mark-shaped wrinkle on my forehead. My life, summarized.`,
    `Someone called me "sir/ma'am" {w:at_place} for the first time. I aged ten years in a day.`,
    `A young person said my references were "vintage". I had to sit down and drink {w:drink}.`,
  ]),
  A('pet_adult', '🐕', 0, { age: [22, 90], has: 'pet' }, [
    `Mon animal a mangé {w:object}. Le vétérinaire m'a coûté plus cher que mon loyer.`,
    `Mon animal de compagnie me regarde avec mépris pendant que je pratique {w:hobby}. Il a sans doute raison.`,
    `J'ai fêté l'anniversaire de mon animal avec un gâteau et un chapeau pointu. Il a mordu le chapeau, puis {w:object}.`,
  ], [
    `My pet ate {w:object}. The vet bill was more than my rent.`,
    `My pet looks at me with contempt when I do {w:hobby}. It's probably right.`,
    `I threw my pet a birthday party with cake and a party hat. It bit the hat, then {w:object}.`,
  ]),
  A('pet_gross', '🐾', 2, { age: [22, 90], has: 'pet' }, [
    `Mon chien a vomi sur le tapis, puis a remangé son vomi en me fixant. J'ai remis en question mon amour pour lui.`,
    `Mon chat m'a ramené {w:animal} dans le lit à 4 h du matin. Enfin, ce qu'il en restait. Les entrailles étaient sur l'oreiller.`,
    `Le chien a mangé une chaussette et l'a ressortie trois jours plus tard, entière. Je l'ai lavée. Je la porte.`,
  ], [
    `My dog threw up on the rug then ate it again while staring at me. I questioned my love for him.`,
    `My cat brought {w:animal} into my bed at 4 a.m. What was left of it, anyway. The guts were on my pillow.`,
    `The dog ate a sock and passed it three days later, intact. I washed it. I'm wearing it.`,
  ]),
  A('home_owner_dream', '🏡', 0, { age: [28, 50], noAsset: 'house' }, [
    `J'ai calculé combien d'années de salaire il me faudrait pour acheter une maison. Le calculateur a planté.`,
    `J'ai visité une maison « à rafraîchir ». Il y avait {w:animal} qui vivait dans le salon depuis 1994.`,
    `Mon banquier a ri quand j'ai dit « prêt immobilier ». Un vrai rire, avec les épaules.`,
  ], [
    `I calculated how many years of salary I'd need to buy a house. The calculator crashed.`,
    `I viewed a "fixer-upper". There was {w:animal} that had been living in the living room since 1994.`,
    `My banker laughed when I said "mortgage". A real laugh, with the shoulders.`,
  ]),
  A('weather_complain', '🌧️', 0, { age: [18, 120] }, [
    `J'ai vécu toute la semaine {w:weather}. J'ai parlé de la météo à [[14|22|37]] personnes différentes.`,
    `Je suis sorti{|e} sans parapluie {w:weather}. Je suis rentré{|e} en état liquide.`,
    `La météo annonçait du soleil. Je suis sorti{|e} et je me suis retrouvé{|e} {w:weather}.`,
  ], [
    `I spent the whole week {w:weather}. I discussed the weather with [[14|22|37]] different people.`,
    `I went out without an umbrella {w:weather}. I came home in liquid form.`,
    `The forecast said sunshine. I stepped out and found myself {w:weather}.`,
  ]),
  A('secret_snack', '🍫', 1, { age: [25, 70], has: 'child' }, [
    `Je me suis caché{|e} dans la voiture pour manger {w:food} sans le partager avec les enfants. Meilleur moment de la semaine.`,
    `J'ai mangé les bonbons d'Halloween des enfants et accusé {w:animal}. Ils m'ont cru{|e}. Pour l'instant.`,
    `J'ai fait semblant d'aller « vérifier un truc au garage » pour boire {w:drink} tranquille.`,
  ], [
    `I hid in the car to eat {w:food} without sharing with the kids. Best moment of the week.`,
    `I ate the kids' Halloween candy and blamed {w:animal}. They believed me. For now.`,
    `I pretended to go "check something in the garage" to drink {w:drink} in peace.`,
  ]),
  A('school_gate', '🏫', 1, { age: [28, 50], has: 'child' }, [
    `Le groupe WhatsApp des parents d'élèves a envoyé [[87|143|260]] messages aujourd'hui. Sujet : un bonnet perdu.`,
    `Une maman de l'école m'a soutenu pendant vingt minutes {w:conspiracy}. Elle est présidente de l'APE.`,
    `Kermesse de l'école : j'ai tenu un stand pendant cinq heures, à vendre {w:food} et des crêpes. Je sens encore {w:smell}.`,
  ], [
    `The parents' WhatsApp group sent [[87|143|260]] messages today. Topic: a lost hat.`,
    `A school mom spent twenty minutes insisting {w:conspiracy}. She's PTA president.`,
    `School fair: I ran a stand for five hours selling {w:food} and crêpes. I still have {w:smell} on me.`,
  ]),
  A('date_night_parent', '🕯️', 2, { age: [28, 55], has: 'child' }, [
    `Pour la première fois en trois ans, les enfants dormaient et on était seuls. On s'est endormis tous les deux devant {w:show}, à 21 h 04.`,
    `Câlin coquin interrompu par un enfant qui a demandé « pourquoi papa fait {w:sound} ? ». On a dit que c'était un cauchemar.`,
    `Les enfants sont chez mamie : on a fait l'amour dans la cuisine. Puis on a rangé la cuisine pendant deux heures.`,
  ], [
    `For the first time in three years the kids were asleep and we were alone. We both fell asleep in front of {w:show} at 9:04 p.m.`,
    `Frisky moment interrupted by a kid asking "why is daddy making {w:sound}?". We said it was a nightmare.`,
    `Kids at grandma's: we did it in the kitchen. Then we cleaned the kitchen for two hours.`,
  ]),
  A('wedding_own_regret', '💍', 1, { age: [30, 70], has: 'spouse' }, [
    `J'ai regardé la vidéo de notre mariage. Je danse sur {w:song} comme un poulet électrocuté.`,
    `On a enfin fini de rembourser notre mariage. Juste à temps pour la crise de couple.`,
    `Mon conjoint ronfle, pète et laisse traîner ses chaussettes. Je l'aime. C'est grave docteur ?`,
  ], [
    `I watched our wedding video. I'm dancing to {w:song} like an electrocuted chicken.`,
    `We finally finished paying off our wedding. Just in time for the relationship crisis.`,
    `My spouse snores, farts and leaves socks everywhere. I love them. Is it serious, doc?`,
  ]),
  A('single_30s', '🍷', 1, { age: [30, 50], noHas: ['partner', 'spouse'] }, [
    `Ma tante m'a demandé quand je me marie. J'ai répondu « jamais ». Elle a fait un signe de croix et repris {w:food}.`,
    `Célibataire, j'ai dîné avec {w:food} devant {w:show}. Personne pour me juger. Le rêve.`,
    `Mes amis sont tous en couple avec des enfants. Je suis {l'oncle|la tante} fun qui ramène {w:gift}.`,
  ], [
    `My aunt asked when I'm getting married. I said "never". She crossed herself and took another helping: {w:food}.`,
    `Single, I had dinner with {w:food} in front of {w:show}. Nobody to judge me. The dream.`,
    `My friends are all coupled up with kids. I'm the fun {uncle|aunt} who brings {w:gift}.`,
  ]),
  A('single_sex', '🌶️', 2, { age: [30, 60], noHas: ['partner', 'spouse'] }, [
    `Plan cul de quadra : on a passé plus de temps à parler de nos lombaires que du reste.`,
    `J'ai acheté un sextoy qui fait {w:sound}. Les voisins pensent que j'ai adopté un animal.`,
    `Mon date m'a annoncé au lit qu'il collectionnait {w:object}. J'ai remis mon pantalon à la vitesse de l'éclair.`,
  ], [
    `Middle-aged hookup: we spent more time talking about our lower backs than anything else.`,
    `I bought a sex toy that makes {w:sound}. The neighbours think I adopted a pet.`,
    `In bed, my date announced they collect {w:object}. I put my trousers back on at lightning speed.`,
  ]),
  A('tax_season', '🧾', 1, { age: [22, 90], job: true }, [
    `J'ai fait ma déclaration d'impôts. J'ai compris une case sur douze. J'ai coché celle-là et fêté ça avec {w:drink}.`,
    `Les impôts m'ont envoyé un remboursement de [[4|11|23]] €. J'ai fait une fête {w:at_place}.`,
    `J'ai passé le week-end à trier mes factures dans des boîtes à chaussures. L'une contenait {w:food}.`,
  ], [
    `I did my taxes. I understood one box out of twelve. I ticked that one and celebrated with {w:drink}.`,
    `The tax office sent me a [[$4|$11|$23]] refund. I threw a party {w:at_place}.`,
    `Spent the weekend sorting receipts into shoeboxes. One contained {w:food}.`,
  ]),
  A('cooking_dinner_party', '🍽️', 1, { age: [28, 70] }, [
    `J'ai organisé un dîner. J'ai servi {w:food} façon charbon de bois en prétendant que c'était « fumé ».`,
    `Dîner entre amis : un invité a parlé de son régime pendant trois heures en mangeant tout le fromage et {w:food}.`,
    `Mes invités sont partis à 2 h. J'ai trouvé un inconnu dans la baignoire à 9 h. Il voulait du café et {w:food}.`,
  ], [
    `I hosted a dinner party. I served {w:food}, charred volcano-style, claiming it was "smoked".`,
    `Dinner with friends: a guest talked about their diet for three hours while eating all the cheese and {w:food}.`,
    `My guests left at 2 a.m. I found a stranger in the bathtub at 9 a.m. He wanted coffee and {w:food}.`,
  ]),
  A('food_poison_adult', '🦠', 2, { age: [22, 90] }, [
    `J'ai mangé {w:food} {w:at_place}. Pendant deux jours, je me suis vidé{|e} des deux côtés simultanément. Une prouesse.`,
    `Intoxication alimentaire : j'ai gerbé dans la baignoire tout en chiant dans les toilettes. Mes jambes faisaient le grand écart sur {w:song}.`,
    `J'ai mangé des huîtres douteuses. J'ai vomi sur un pigeon, qui a vomi à son tour sur {w:animal}.`,
  ], [
    `I ate {w:food} {w:at_place}. For two days I emptied out from both ends simultaneously. A feat.`,
    `Food poisoning: I puked into the bathtub while pooping in the toilet. My legs were doing the splits to {w:song}.`,
    `I ate dodgy oysters. I puked on a pigeon, which then puked on {w:animal}.`,
  ]),
  A('hemorrhoids', '🍑', 2, { age: [30, 90] }, [
    `Hémorroïdes : je m'assois sur une bouée gonflable qui représente {w:animal}. Au bureau.`,
    `Le pharmacien a crié « POMMADE POUR LES HÉMORROÏDES ? » devant toute la file. J'ai dit oui, fièrement, en ajoutant {w:food} à mes achats.`,
    `J'ai fait un effort trop violent aux toilettes. Il y a eu {w:sound} et un peu de sang. Mon cul et moi sommes en froid.`,
  ], [
    `Haemorrhoids: I sit on an inflatable ring shaped like {w:animal}. At the office.`,
    `The pharmacist yelled "HAEMORRHOID CREAM?" in front of the whole line. I proudly said yes, and added {w:food} to my purchase.`,
    `I pushed way too hard on the toilet. There was {w:sound} and a little blood. My butt and I aren't speaking.`,
  ]),
  A('night_out_40', '🕺', 1, { age: [38, 55] }, [
    `Je suis sorti{|e} en boîte à 40 ans passés. Le videur m'a demandé si je cherchais mon enfant. J'ai dansé sur {w:song} quand même.`,
    `Soirée entre vieux potes : on a parlé de nos genoux, de nos impôts, puis on a pleuré sur {w:song}.`,
    `J'ai fait la fête jusqu'à 1 h. Il m'a fallu trois jours pour récupérer, et {w:drink} pour faire passer.`,
  ], [
    `I went clubbing past 40. The bouncer asked if I was looking for my kid. I danced to {w:song} anyway.`,
    `Night out with old friends: we talked about our knees, our taxes, then cried to {w:song}.`,
    `I partied until 1 a.m. It took three days to recover, and {w:drink} to wash it down.`,
  ]),
  A('job_burnout', '🔋', 1, { age: [28, 62], job: true }, [
    `J'ai pleuré dans les toilettes du boulot, puis dans l'ascenseur, puis dans la voiture, puis {w:at_place}. Tournée complète.`,
    `Mon boss m'a envoyé un mail à 23 h 47 avec « urgent » écrit [[trois|cinq|huit]] fois. J'ai répondu avec {w:animal} en photo.`,
    `Je me suis surpris{|e} à envier {w:weird_job}. Il faut que je pose des congés.`,
  ], [
    `I cried in the work bathroom, then in the elevator, then in the car, then {w:at_place}. Full tour.`,
    `My boss emailed me at 11:47 p.m. with "urgent" written [[three|five|eight]] times. I replied with a photo of {w:animal}.`,
    `I caught myself envying {w:weird_job}. I need to take some time off.`,
  ]),
  A('job_raise', '📈', 0, { age: [25, 65], job: true }, [
    `J'ai demandé une augmentation. On m'a offert une plante verte, {w:gift} et « de la visibilité ».`,
    `J'ai eu une prime de fin d'année : {w:gift}. Avec le logo de {employer} dessus.`,
    `On m'a nommé{|e} « employé{|e} du mois ». Ma photo est accrochée à côté des toilettes, sous {w:object}.`,
  ], [
    `I asked for a raise. They gave me a potted plant, {w:gift} and "visibility".`,
    `I got a year-end bonus: {w:gift}. With the {employer} logo on it.`,
    `I was named "employee of the month". My photo hangs next to the toilets, under {w:object}.`,
  ]),
  A('office_party_trash', '🍸', 2, { age: [22, 65], job: true }, [
    `Soirée de Noël du boulot : j'ai photocopié mes fesses et je les ai affichées dans l'open space. On m'a reconnu{|e} au grain de beauté. Ma nouvelle réputation : {w:nickname}.`,
    `Au séminaire, le comptable a vomi dans la piscine de l'hôtel. On a tous continué à nager, {w:drink} à la main. Solidarité.`,
    `À la soirée d'entreprise, j'ai dit au DRH ce que je pensais de lui, en détails, avec des gestes. J'ai encore mon poste. Mystère. Mon dernier mot : « {w:insult} ».`,
  ], [
    `Work Christmas party: I photocopied my butt and pinned it up in the open space. They recognized me by the mole. My new nickname: {w:nickname}.`,
    `At the retreat the accountant puked in the hotel pool. We all kept swimming, {w:drink} in hand. Solidarity.`,
    `At the company party I told the HR director what I thought of him, in detail, with gestures. Still have my job. Mystery. My final words: "{w:insult}".`,
  ]),
  A('dentist_adult', '🦷', 1, { age: [25, 90] }, [
    `Le dentiste m'a posé des questions pendant qu'il avait les deux mains dans ma bouche. J'ai répondu « aaargh » à tout, même quand il a parlé de {w:show}.`,
    `Devis du dentiste : avec ça, je pourrais m'acheter {w:vehicle}. Pour une seule dent.`,
    `Le dentiste m'a demandé si je passais le fil dentaire. J'ai menti. Mes gencives ont saigné pour me trahir. Il a dit « {w:exclaim} ».`,
  ], [
    `The dentist asked me questions with both hands in my mouth. I answered "aaargh" to everything, even when he brought up {w:show}.`,
    `Dentist's quote: for that I could buy {w:vehicle}. For one tooth.`,
    `The dentist asked if I floss. I lied. My gums bled to betray me. He said "{w:exclaim}".`,
  ]),
  A('garden', '🌻', 0, { age: [30, 100] }, [
    `J'ai planté des tomates. Les limaces ont organisé un banquet. {w:animal} était invité d'honneur.`,
    `Mon potager a produit une courgette de [[3|5|7]] kilos. On en mange à tous les repas depuis un mois, même avec {w:food}.`,
    `J'ai passé le dimanche à tondre la pelouse {w:weather}. Le voisin a fait pareil, mais mieux. Je le hais.`,
  ], [
    `I planted tomatoes. The slugs threw a banquet. {w:animal} was guest of honour.`,
    `My vegetable patch produced a [[7|11|15]]-pound zucchini. We've eaten it at every meal for a month, even with {w:food}.`,
    `Spent Sunday mowing the lawn {w:weather}. The neighbour did the same, but better. I hate him.`,
  ]),
  A('hobby_new', '🎨', 0, { age: [25, 80] }, [
    `Je me suis découvert une passion pour {w:hobby}. Elle a duré [[trois jours|une semaine|deux week-ends]] et coûté 300 €.`,
    `J'ai rejoint un club. Thème : {w:hobby}. Moyenne d'âge : 74 ans. Je suis la star montante.`,
    `J'ai essayé {w:hobby}. Mon entourage a demandé que j'arrête pour la sécurité de tous.`,
  ], [
    `I discovered a passion for {w:hobby}. It lasted [[three days|a week|two weekends]] and cost $300.`,
    `I joined a club. Theme: {w:hobby}. Average age: 74. I'm the rising star.`,
    `I tried {w:hobby}. The people around me asked me to stop for everyone's safety.`,
  ]),
  A('streaming_binge', '🍿', 0, { age: [18, 90] }, [
    `J'ai regardé une saison entière de {w:show} en une nuit. Netflix m'a demandé si j'étais encore en vie.`,
    `J'ai revu {w:movie} pour la [[8e|12e|20e]] fois. Je connais les répliques. Je les dis avant les acteurs.`,
    `Je me suis endormi{|e} devant {w:show} et j'ai rêvé que j'y participais. J'ai été éliminé{|e} au premier épisode.`,
  ], [
    `I watched a whole season of {w:show} in one night. Netflix asked if I was still alive.`,
    `I rewatched {w:movie} for the [[8th|12th|20th]] time. I know the lines. I say them before the actors.`,
    `I fell asleep watching {w:show} and dreamed I was on it. I got voted off in episode one.`,
  ]),
  A('spam_call', '☎️', 1, { age: [25, 120] }, [
    `On m'a appelé [[6|9|13]] fois aujourd'hui pour me vendre une isolation à 1 €. J'ai fini par demander leur adresse. Ils m'ont envoyé {w:gift}.`,
    `J'ai fait durer un démarcheur téléphonique quarante minutes en lui faisant un exposé sur {w:hobby}. Il a raccroché en pleurant.`,
    `Un démarcheur m'a appelé{|e} pendant que j'étais aux toilettes. Je lui ai décrit la situation, avec {w:sound} en direct. Il ne rappellera plus.`,
  ], [
    `I got called [[6|9|13]] times today about $1 insulation. I ended up asking for their address. They sent me {w:gift}.`,
    `I kept a telemarketer on the line for forty minutes giving him a lecture on {w:hobby}. He hung up crying.`,
    `A telemarketer called while I was on the toilet. I described the situation, with {w:sound} live. He won't call again.`,
  ]),
  A('work_from_home', '🏠', 0, { age: [22, 65], job: true }, [
    `Télétravail : je n'ai pas mis de pantalon depuis lundi. Ma productivité a doublé. Mon hygiène, moins. L'appart dégage {w:smell}.`,
    `En visio, {w:animal} a traversé mon écran. Mon boss a demandé son prénom. Meilleure réunion de l'année.`,
    `J'ai fait une réunion en télétravail depuis mon lit, sous la couette, caméra coupée. J'ai ronflé comme {w:vehicle}.`,
  ], [
    `Working from home: haven't worn trousers since Monday. Productivity doubled. Hygiene, less so. The flat gives off {w:smell}.`,
    `On a video call, {w:animal} walked across my screen. My boss asked its name. Best meeting of the year.`,
    `I took a remote meeting from bed, under the duvet, camera off. I snored like {w:vehicle}.`,
  ]),
  A('stupid_injury', '🚑', 2, { age: [25, 75] }, [
    `Je me suis cassé {w:bodypart} en voulant attraper {w:object} au vol. Aux urgences, ils ont ri jusqu'au plâtre.`,
    `J'ai glissé sur {w:food} dans ma cuisine. Ma tête a fait {w:sound} contre le frigo. J'ai vu des étoiles et {w:celeb}.`,
    `En taillant la haie, je me suis tranché un bout de doigt. Le chien l'a trouvé avant moi. Il l'a mangé avec {w:food}. Bon chien.`,
  ], [
    `I broke my {w:bodypart} trying to catch {w:object} mid-air. In the ER they laughed all the way to the cast.`,
    `I slipped on {w:food} in my kitchen. My head went {w:sound} against the fridge. I saw stars and {w:celeb}.`,
    `Trimming the hedge, I sliced off a fingertip. The dog found it before me. He ate it with {w:food}. Good boy.`,
  ]),
  A('spider_bath', '🕷️', 0, { age: [18, 120] }, [
    `Une araignée grosse comme {w:food} m'attendait dans la baignoire. J'ai vécu dans le salon pendant deux jours.`,
    `J'ai tué une araignée avec {w:object}. Le lendemain, ses cousines étaient là. Vendetta.`,
    `J'ai hurlé si fort à cause d'une araignée que le voisin a appelé la police. Les flics l'ont tuée pour moi avec {w:object}.`,
  ], [
    `A spider as big as {w:food} was waiting in my bathtub. I lived in the living room for two days.`,
    `I killed a spider with {w:object}. The next day its cousins showed up. Vendetta.`,
    `I screamed so loud over a spider that the neighbour called the cops. They killed it for me with {w:object}.`,
  ]),
  A('cleaning_spree', '🧽', 0, { age: [22, 90] }, [
    `Grand ménage de printemps. Sous le canapé : {w:object}, trois chaussettes et {w:food} à l'état fossile.`,
    `J'ai fait le tri dans mes placards. J'ai tout gardé « au cas où ». Même {w:object}.`,
    `J'ai nettoyé le four pour la première fois depuis que j'ai emménagé. J'y ai trouvé une civilisation qui vénérait {w:food}.`,
  ], [
    `Big spring cleaning. Under the couch: {w:object}, three socks and {w:food} in fossil form.`,
    `I decluttered my wardrobes. I kept everything "just in case". Even {w:object}.`,
    `I cleaned the oven for the first time since I moved in. I found a civilization in there that worshipped {w:food}.`,
  ]),
  // ───────────── Seniors 60+ ─────────────
  A('grandkids_visit', '👶', 0, { age: [55, 110], has: 'child' }, [
    `Les petits-enfants sont venus. Ils ont mangé tous les biscuits, cassé {w:object} et sont repartis. Je les adore.`,
    `Mon petit-fils m'a appris un mot nouveau : « {w:nickname} ». Je le dis à tout le monde au marché.`,
    `J'ai gardé les petits-enfants tout le week-end. J'ai dormi [[14|16|20]] heures d'affilée après, en serrant {w:object} dans mes bras.`,
  ], [
    `The grandkids came over. They ate all the cookies, broke {w:object} and left. I adore them.`,
    `My grandson taught me a new word: "{w:nickname}". I say it to everyone at the market.`,
    `I babysat the grandkids all weekend. I slept [[14|16|20]] hours straight afterwards, hugging {w:object}.`,
  ]),
  A('grandkids_spoil', '🍬', 0, { age: [55, 110], has: 'child' }, [
    `J'ai donné aux petits-enfants tout ce que leurs parents interdisent. C'est ma vengeance, trente ans plus tard. Au menu : {w:food} à 22 h.`,
    `J'ai glissé un billet de 20 dans la main de ma petite-fille avec un clin d'œil. Elle m'a dit « {w:compliment} ».`,
    `J'ai offert {w:gift} à mon petit-fils. Il m'a regardé{|e} comme si j'avais offert {w:object}.`,
  ], [
    `I gave the grandkids everything their parents forbid. My revenge, thirty years later. On the menu: {w:food} at 10 p.m.`,
    `I slipped a twenty into my granddaughter's hand with a wink. She said "{w:compliment}".`,
    `I gave my grandson {w:gift}. He looked at me like I'd given him {w:object}.`,
  ]),
  A('grandkids_trash', '🧓', 2, { age: [60, 110], has: 'child' }, [
    `J'ai raconté à mes petits-enfants comment j'ai perdu ma virginité dans {w:vehicle}. Leur mère m'a interdit de garde.`,
    `Mon petit-fils a trouvé mon dentier dans le verre et l'a mis dans sa bouche. On a tous hurlé, lui le plus fort.`,
    `J'ai pété si fort au repas de famille que le bébé a pleuré et le chien a aboyé. J'ai accusé le chien. Puis {w:animal}, qui passait par là.`,
  ], [
    `I told my grandkids how I lost my virginity in {w:vehicle}. Their mother banned me from babysitting.`,
    `My grandson found my dentures in the glass and put them in his mouth. We all screamed, him loudest.`,
    `I farted so loud at the family dinner the baby cried and the dog barked. I blamed the dog. Then {w:animal}, which happened to be passing.`,
  ]),
  A('doctor_senior', '🩺', 0, { age: [60, 120] }, [
    `Rendez-vous chez le médecin. Dans la salle d'attente, j'ai comparé mes ordonnances avec [[trois|cinq|sept]] autres retraités. J'ai gagné. Mon lot : le respect, et {w:food} au goûter.`,
    `Mon médecin a [[12|15|19]] ans de moins que mon petit-fils. Il m'a appelé « mon petit monsieur ».`,
    `Le médecin m'a demandé si j'avais des douleurs. J'ai sorti une liste de deux pages. Douleur numéro un : {w:bodypart}.`,
  ], [
    `Doctor's appointment. In the waiting room I compared prescriptions with [[three|five|seven]] other retirees. I won. My prize: respect, and {w:food} at snack time.`,
    `My doctor looks [[12|15|19]] years younger than my grandson. He called me "young man".`,
    `The doctor asked if I had any pain. I pulled out a two-page list. Pain number one: my {w:bodypart}.`,
  ]),
  A('pills', '💊', 1, { age: [62, 120] }, [
    `Mon pilulier a [[21|28|35]] cases. J'ai avalé les médicaments du mardi un jeudi. Je me sens mardi. Pour fêter ça : {w:drink}.`,
    `J'ai confondu mon médicament pour le cœur avec un bonbon à la menthe. Ou l'inverse. Je verrai bien. J'ai aussi avalé {w:object}, je crois.`,
    `Le pharmacien me connaît par mon prénom, celui de mon chien et le nom de toutes mes maladies.`,
  ], [
    `My pill organizer has [[21|28|35]] slots. I took Tuesday's pills on Thursday. I feel like Tuesday. To celebrate: {w:drink}.`,
    `I mixed up my heart pill with a mint. Or the other way round. We'll see. I think I also swallowed {w:object}.`,
    `The pharmacist knows my first name, my dog's name and the name of every disease I have.`,
  ]),
  A('bingo', '🎱', 0, { age: [60, 120] }, [
    `Loto du club : j'ai gagné {w:gift}. Mme Ginette m'accuse de triche. La guerre est déclarée.`,
    `Au bingo, j'ai crié « carton ! » avant de vérifier. Je n'avais rien. Ils m'ont hué{|e} et lancé {w:food}.`,
    `J'ai joué au loto de la salle des fêtes avec [[8|12|16]] cartons en même temps. Personne ne m'arrête.`,
  ], [
    `Club bingo: I won {w:gift}. Mrs Ginette accuses me of cheating. War is declared.`,
    `At bingo I yelled "BINGO!" before checking. I had nothing. They booed me and threw {w:food}.`,
    `I played the village hall bingo with [[8|12|16]] cards at once. No one can stop me.`,
  ]),
  A('bingo_trash', '🎲', 2, { age: [60, 120] }, [
    `Bagarre au bingo : Mme Ginette m'a planté son stylo dans la main. J'ai répliqué avec mon déambulateur. Elle saigne, je saigne, on rejoue jeudi.`,
    `Au loto du club, un papy a fait une crise cardiaque juste avant le dernier numéro. On a fini la partie avant d'appeler le SAMU. Il avait un carton gagnant.`,
    `J'ai triché au bingo et Raymond l'a vu. Il m'a traité{|e} de « {w:insult} » et m'a craché son dentier dessus.`,
  ], [
    `Fight at bingo: Mrs Ginette stabbed my hand with her pen. I retaliated with my walker. She's bleeding, I'm bleeding, we play again Thursday.`,
    `At club bingo an old man had a heart attack right before the last number. We finished the game before calling 911. He had a winning card.`,
    `I cheated at bingo and Raymond saw. He called me "{w:insult}" and spat his dentures at me.`,
  ]),
  A('tech_senior', '📱', 0, { age: [62, 120] }, [
    `J'ai envoyé un SMS à mon fils en écrivant tout en majuscules. Il a cru que je criais. Je criais. Le sujet : {w:animal} dans mon jardin.`,
    `Mon petit-fils m'a installé {w:app}. J'ai liké toutes les photos d'une inconnue depuis 2014.`,
    `J'ai fait un appel vidéo à ma fille en filmant mon oreille pendant vingt minutes. J'ai conclu par « {w:exclaim} ».`,
    `J'ai cherché « comment ouvrir Internet » sur Internet.`,
  ], [
    `I texted my son in all caps. He thought I was shouting. I was shouting. Topic: {w:animal} in my garden.`,
    `My grandson installed {w:app} for me. I liked every photo a stranger has posted since 2014.`,
    `I video-called my daughter while filming my ear for twenty minutes. I signed off with "{w:exclaim}".`,
    `I searched "how to open the internet" on the internet.`,
  ]),
  A('tech_senior2', '💻', 1, { age: [62, 120] }, [
    `J'ai cliqué sur un mail qui disait que j'avais gagné {w:object}. Mon ordinateur parle maintenant russe.`,
    `J'ai mis mon mot de passe sur un post-it collé à l'écran. Mot de passe : « motdepasse ». Avant, c'était « {w:nickname} ».`,
    `J'ai commenté « BON ANNIVERSAIRE » sous l'avis de décès d'un ancien collègue. Merde.`,
  ], [
    `I clicked an email saying I'd won {w:object}. My computer now speaks Russian.`,
    `I stuck my password on a post-it on the screen. Password: "password". It used to be "{w:nickname}".`,
    `I commented "HAPPY BIRTHDAY" under a former coworker's obituary. Shit.`,
  ]),
  A('tech_senior_trash', '🔞', 2, { age: [62, 120] }, [
    `J'ai voulu montrer des photos de vacances à ma famille sur la télé. Mauvais dossier. Personne n'a dit un mot pendant le reste du repas. Même pas pour {w:food}.`,
    `J'ai découvert les sites de rencontre pour seniors. Un papy m'a envoyé une photo intime. Je crois que c'était {w:bodypart}. J'espère que c'était {w:bodypart}.`,
    `J'ai appelé mon fils en visio par erreur depuis les toilettes. Gros plan. Il est en thérapie.`,
  ], [
    `I wanted to show holiday photos on the TV to my family. Wrong folder. Nobody said a word for the rest of the meal. Not even about {w:food}.`,
    `I discovered senior dating sites. An old guy sent me an intimate photo. I think it was his {w:bodypart}. I hope it was his {w:bodypart}.`,
    `I accidentally video-called my son from the toilet. Close-up. He's in therapy.`,
  ]),
  A('ehpad', '🏥', 0, { age: [75, 120] }, [
    `À la maison de retraite, il y a purée tous les jours. J'ai commencé à sculpter la mienne. Aujourd'hui : {w:animal}.`,
    `Atelier chant à l'Ehpad : on a massacré {w:song} avec beaucoup d'enthousiasme. Un résident a pleuré. De douleur.`,
    `La nouvelle animatrice de l'Ehpad nous parle comme à des bébés. Je lui ai répondu en latin, puis je lui ai lancé {w:food}.`,
  ], [
    `At the retirement home it's mashed potatoes every day. I've started sculpting mine. Today: {w:animal}.`,
    `Singing workshop at the care home: we butchered {w:song} with great enthusiasm. A resident cried. From pain.`,
    `The new care home activities lady talks to us like babies. I answered her in Latin, then threw {w:food} at her.`,
  ]),
  A('ehpad_romance', '💘', 1, { age: [75, 120] }, [
    `Un résident m'a fait la cour à l'Ehpad. Il m'a offert {w:food}. Provenance : la cantine, par la fenêtre des cuisines.`,
    `Scandale à l'Ehpad : on a retrouvé deux résidents dans le même lit. L'un d'eux, c'était moi. L'autre dégageait {w:smell}.`,
    `J'ai un admirateur à la maison de retraite. Il s'assoit à côté de moi au loto et me dit « {w:compliment} ».`,
  ], [
    `A resident courted me at the care home. He gave me {w:food}. Source: the canteen, through the kitchen window.`,
    `Scandal at the care home: two residents found in the same bed. One of them was me. The other gave off {w:smell}.`,
    `I have an admirer at the retirement home. He sits next to me at bingo and says "{w:compliment}".`,
  ]),
  A('ehpad_trash', '🛏️', 2, { age: [75, 120] }, [
    `À l'Ehpad, mon voisin de chambre a fait caca dans la plante verte du couloir. Il dit que c'est de l'engrais. Il n'a pas tort. Le couloir dégage {w:smell}.`,
    `Les aides-soignants m'ont mis une couche. J'ai protesté. Puis j'ai compris pourquoi. Puis j'ai pleuré de rire.`,
    `Mon voisin de table a perdu son dentier dans la soupe. Il l'a cherché à mains nues dans MA soupe en criant « {w:exclaim} ».`,
  ], [
    `At the care home my roommate pooped in the hallway plant. He says it's fertilizer. He's not wrong. The hallway gives off {w:smell}.`,
    `The nurses put a diaper on me. I protested. Then I understood why. Then I cried laughing.`,
    `My table neighbour lost his dentures in the soup. He searched for them barehanded in MY soup, yelling "{w:exclaim}".`,
  ]),
  A('ehpad_escape', '🏃', 1, { age: [75, 120] }, [
    `Je me suis évadé{|e} de l'Ehpad avec un déambulateur. On m'a retrouvé{|e} {w:at_place}, en train de manger {w:food}.`,
    `J'ai organisé un trafic de chocolat à la maison de retraite. Je suis le parrain du deuxième étage. On m'appelle {w:nickname}.`,
    `On a fait une soirée clandestine à l'Ehpad : {w:drink} caché dans les bouteilles de sirop. Trois résidents ont dansé.`,
  ], [
    `I escaped from the care home on a walker. They found me {w:at_place}, eating {w:food}.`,
    `I run a chocolate-smuggling ring in the retirement home. I'm the godfather of the second floor. They call me {w:nickname}.`,
    `We threw a secret party at the care home: {w:drink} hidden in syrup bottles. Three residents danced.`,
  ]),
  A('retirement', '🏖️', 0, { age: [60, 75], job: false }, [
    `Retraite : je me lève à 6 h pour rien, je vais au marché et je râle sur les prix devant {w:food}.`,
    `J'ai découvert {w:hobby} à la retraite. J'y passe [[huit|dix|douze]] heures par jour. Ma femme... enfin, ma famille s'inquiète.`,
    `Je suis à la retraite et je n'ai jamais été aussi débordé{|e}. Mardi : aquagym. Mercredi : {w:hobby}. Jeudi : enterrement.`,
  ], [
    `Retirement: I get up at 6 a.m. for nothing, go to the market and grumble about prices in front of {w:food}.`,
    `I discovered {w:hobby} in retirement. I spend [[eight|ten|twelve]] hours a day on it. My family is worried.`,
    `I'm retired and I've never been busier. Tuesday: water aerobics. Wednesday: {w:hobby}. Thursday: a funeral.`,
  ]),
  A('funerals', '⚰️', 1, { age: [65, 120] }, [
    `Troisième enterrement du mois. Je connais le traiteur par son prénom. Ses petits fours sont bons. Sa spécialité : {w:food} en verrine.`,
    `À un enterrement, j'ai dit « {w:exclaim} » un peu trop fort pendant l'éloge. C'était pourtant sincère.`,
    `J'ai lu la rubrique nécrologique en buvant mon café. Je n'y suis pas. Bonne journée en perspective. J'ai fêté ça avec {w:food}.`,
  ], [
    `Third funeral this month. I know the caterer by name. His canapés are good. His specialty: {w:food} in a shot glass.`,
    `At a funeral I said "{w:exclaim}" a bit too loud during the eulogy. I meant it, though.`,
    `I read the obituaries over coffee. I'm not in them. Shaping up to be a good day. I celebrated with {w:food}.`,
  ]),
  A('funeral_trash', '🪦', 2, { age: [65, 120] }, [
    `À l'enterrement d'un ami, le cercueil est tombé et il a roulé dehors. Il avait l'air plus détendu que nous tous. L'organiste a enchaîné sur {w:song}.`,
    `Au crématorium, j'ai éternué sur les cendres de mon cousin. Il est un peu partout dans mon nez maintenant. J'ai crié « {w:swear} ».`,
    `J'ai pété pendant la minute de silence d'un enterrement. Le curé a fait semblant de rien. Les petits-enfants non. Le bruit : {w:sound}, en plus fort.`,
  ], [
    `At a friend's funeral the coffin fell and he rolled out. He looked more relaxed than the rest of us. The organist moved on to {w:song}.`,
    `At the crematorium I sneezed into my cousin's ashes. He's a bit all over my nose now. I yelled "{w:swear}".`,
    `I farted during the moment of silence at a funeral. The priest ignored it. The grandkids did not. The noise: {w:sound}, only louder.`,
  ]),
  A('senior_driving', '🚙', 1, { age: [70, 120] }, [
    `J'ai roulé à 30 km/h sur l'autoroute avec le clignotant allumé depuis Lyon. Les gens m'ont salué{|e} du doigt. Derrière moi, {w:vehicle} klaxonnait.`,
    `Je me suis garé{|e} sur trois places au supermarché. Personne n'a osé protester, même pas le gros type qui conduisait {w:vehicle}.`,
    `J'ai embouti {w:vehicle} en reculant. J'ai laissé un mot qui disait « {w:exclaim} ».`,
  ], [
    `I drove 20 mph on the highway with my blinker on since the last city. People waved at me with one finger. Behind me, {w:vehicle} was honking.`,
    `I parked across three spaces at the supermarket. No one dared object, not even the big guy driving {w:vehicle}.`,
    `I backed into {w:vehicle}. I left a note that said "{w:exclaim}".`,
  ]),
  A('senior_body', '🦵', 2, { age: [65, 120] }, [
    `Mes poils de nez peuvent maintenant être tressés. Mes oreilles aussi. Mes sourcils ont une vie à eux. On dirait {w:animal}.`,
    `J'ai éternué et j'ai fait pipi, pété et perdu mon dentier dans le même mouvement. Une performance.`,
    `Mes ongles de pied sont si épais qu'il faut une pince coupante de jardin. Un éclat a blessé le chat. Un autre a fini dans {w:food}.`,
  ], [
    `My nose hairs can now be braided. My ear hair too. My eyebrows have a life of their own. They look like {w:animal}.`,
    `I sneezed and peed, farted and lost my dentures in one motion. A performance.`,
    `My toenails are so thick I need garden loppers. A shard injured the cat. Another ended up in {w:food}.`,
  ]),
  A('senior_body_soft', '👴', 0, { age: [65, 120] }, [
    `Je suis monté{|e} dans ma chambre et j'ai oublié pourquoi. Je suis redescendu{|e} et je m'en suis souvenu. Je suis remonté{|e}. Oublié. J'ai fini par manger {w:food} pour me consoler.`,
    `J'ai cherché mes lunettes partout. Elles étaient sur ma tête. Ma deuxième paire aussi. La troisième était dans {w:food}.`,
    `Mes genoux prédisent la météo mieux que la télé. Aujourd'hui : {w:weather}. Ils avaient raison.`,
  ], [
    `I went upstairs and forgot why. Came down and remembered. Went back up. Forgot. I ate {w:food} to console myself.`,
    `I looked everywhere for my glasses. They were on my head. So was my second pair. The third was in {w:food}.`,
    `My knees predict the weather better than the TV. Today: {w:weather}. They were right.`,
  ]),
  A('senior_complain', '👵', 0, { age: [65, 120] }, [
    `J'ai expliqué à un jeune {w:at_place} que de mon temps, {w:food} coûtait trois francs. Il a filmé.`,
    `J'ai écrit une lettre au maire. Objet : {w:animal} dans le parc. Quatrième lettre ce mois-ci.`,
    `J'ai râlé contre la musique des jeunes. Puis j'ai fredonné {w:song} toute la journée.`,
  ], [
    `I explained to a youngster {w:at_place} that back in my day, {w:food} cost three francs. He filmed it.`,
    `I wrote to the mayor. Subject: {w:animal} in the park. Fourth letter this month.`,
    `I grumbled about young people's music. Then hummed {w:song} all day.`,
  ]),
  A('senior_insult', '🗯️', 1, { age: [65, 120] }, [
    `Un ado m'a doublé{|e} dans la file de la boulangerie. Je l'ai traité de « {w:insult} ». Il a eu peur. J'ai 70 ans de pratique.`,
    `À mon âge, je dis ce que je pense : j'ai dit au prêtre qu'il chantait comme {w:animal}.`,
    `J'ai crié « {w:swear} » à la télé pendant le journal. Le chat a quitté la pièce, comme d'habitude.`,
  ], [
    `A teenager cut in front of me at the bakery. I called him "{w:insult}". He was scared. I've had 70 years of practice.`,
    `At my age I say what I think: I told the priest he sings like {w:animal}.`,
    `I yelled "{w:swear}" at the TV during the news. The cat left the room, as usual.`,
  ]),
  A('aquagym', '🏊', 0, { age: [60, 100] }, [
    `Aquagym du mardi : on était [[11|14|18]] mamies et un monsieur. Il a disparu sous les frites en mousse au son de {w:song}.`,
    `À l'aquagym, j'ai perdu le haut de mon maillot. Personne n'a rien remarqué, on n'a plus de lunettes. Le maître-nageur a dit « {w:exclaim} ».`,
    `Le prof d'aquagym nous fait danser sur {w:song}. J'ai des courbatures dans des muscles que j'ignorais.`,
  ], [
    `Tuesday water aerobics: [[11|14|18]] grannies and one gentleman. He disappeared under the pool noodles to the sound of {w:song}.`,
    `At water aerobics I lost my swimsuit top. Nobody noticed, nobody has their glasses anymore. The lifeguard said "{w:exclaim}".`,
    `The aqua teacher makes us dance to {w:song}. I'm sore in muscles I didn't know I had.`,
  ]),
  A('senior_trip', '🚌', 0, { age: [62, 100] }, [
    `Voyage organisé du club : [[9|11|14]] heures de bus pour visiter une fabrique de nougat. Au retour, on a chanté {w:song} pendant six heures.`,
    `En voyage organisé {w:far_place}, j'ai acheté {w:object} à un vendeur de souvenirs. Je ne sais pas pourquoi.`,
    `Le car du club a fait une pause pipi toutes les 40 minutes. On est arrivés le lendemain, {w:weather}.`,
  ], [
    `Club coach trip: [[9|11|14]] hours on a bus to visit a nougat factory. On the way back we sang {w:song} for six hours.`,
    `On a group tour {w:far_place} I bought {w:object} from a souvenir seller. No idea why.`,
    `The club coach stopped for a pee break every 40 minutes. We arrived the next day, {w:weather}.`,
  ]),
  A('senior_hearing', '👂', 0, { age: [68, 120] }, [
    `On m'a dit « bonne journée ». J'ai compris « {w:food} ». J'ai répondu « volontiers ».`,
    `Mon appareil auditif a capté la radio. J'ai entendu {w:song} pendant toute la messe.`,
    `J'ai monté le son de la télé à [[58|72|99]]. Les voisins connaissent par cœur {w:show}.`,
  ], [
    `Someone said "have a nice day". I heard "{w:food}". I replied "yes please".`,
    `My hearing aid picked up the radio. I heard {w:song} through the entire mass.`,
    `I turned the TV volume up to [[58|72|99]]. The neighbours now know {w:show} by heart.`,
  ]),
  A('senior_sex', '💊', 2, { age: [62, 100], has: ['partner', 'spouse'] }, [
    `J'ai pris une petite pilule bleue. L'effet a duré six heures. J'ai dû aller chercher le pain comme ça. La boulangère a dit « {w:exclaim} ».`,
    `Câlin du dimanche avec mon conjoint : on s'est bloqué le dos tous les deux. On a attendu le kiné, enlacés, en écoutant {w:song}.`,
    `Mon conjoint et moi avons redécouvert la passion. Le voisin du dessous a tapé au plafond avec sa canne, puis avec {w:object}.`,
  ], [
    `I took a little blue pill. The effect lasted six hours. I had to go get bread like that. The baker said "{w:exclaim}".`,
    `Sunday cuddle with my spouse: we both threw out our backs. We waited for the physio, entwined, listening to {w:song}.`,
    `My spouse and I rediscovered passion. The downstairs neighbour banged on the ceiling with his cane, then with {w:object}.`,
  ]),
  A('widow', '🕊️', 0, { age: [65, 120], noHas: ['partner', 'spouse'] }, [
    `J'ai parlé à la photo de mon ancien amour au petit-déj. Elle ne m'a toujours pas répondu sur la question de la vaisselle.`,
    `Seul{|e} à la maison, j'ai dîné avec {w:food} devant {w:show}. C'était très bien.`,
    `Je me suis inscrit{|e} à un club de rencontres pour seniors. Premier rendez-vous : un monsieur qui collectionne {w:object}.`,
  ], [
    `I talked to my late love's photo over breakfast. Still no answer on the dishes question.`,
    `Home alone, I had {w:food} for dinner in front of {w:show}. It was lovely.`,
    `I joined a seniors' dating club. First date: a gentleman who collects {w:object}.`,
  ]),
  A('senior_scam', '📞', 1, { age: [65, 120] }, [
    `Un « neveu » que je n'ai pas m'a appelé{|e} pour réclamer de l'argent. Je lui ai demandé le nom de mon chien. Il a raccroché.`,
    `Un démarcheur a voulu me vendre une alarme. Je l'ai gardé deux heures à boire du café et à écouter mes histoires. Il est reparti sans rien.`,
    `J'ai reçu un mail d'un prince qui voulait m'offrir {w:object}. Je lui ai répondu par la poste.`,
  ], [
    `A "nephew" I don't have called asking for money. I asked my dog's name. He hung up.`,
    `A salesman tried to sell me an alarm. I kept him two hours drinking coffee and listening to my stories. He left with nothing.`,
    `I got an email from a prince offering me {w:object}. I replied by mail.`,
  ]),
  A('senior_gossip', '☕', 0, { age: [60, 120] }, [
    `Au marché, j'ai appris que la voisine a un amant, que le boucher triche et que c'en est fini pour {w:celeb}. Pas sûr pour le dernier.`,
    `J'ai passé l'après-midi à la fenêtre à surveiller la rue. Rapport : {w:animal} a traversé deux fois.`,
    `Le club des anciens a voté une motion contre {w:animal}. Unanimité moins une abstention, la mienne.`,
  ], [
    `At the market I learned the neighbour has a lover, the butcher cheats and that it's over for {w:celeb}. Not sure about the last one.`,
    `Spent the afternoon at the window watching the street. Report: {w:animal} crossed twice.`,
    `The seniors' club voted a motion against {w:animal}. Unanimous minus one abstention, mine.`,
  ]),
  A('senior_toilet', '🚽', 2, { age: [65, 120] }, [
    `Constipation de dix jours. Quand c'est enfin venu, j'ai entendu {w:sound} et la cuvette a fissuré.`,
    `J'ai raté les toilettes la nuit. J'ai fait pipi dans le panier à linge. Puis dans la chaussure du dimanche.`,
    `Mon transit est devenu le sujet principal de mes conversations. Le facteur sait tout.`,
  ], [
    `Ten days of constipation. When it finally came, I heard {w:sound} and the bowl cracked.`,
    `I missed the toilet at night. I peed in the laundry basket. Then in my Sunday shoe.`,
    `My bowel movements have become my main topic of conversation. The mailman knows everything.`,
  ]),
  A('senior_hospital', '🏥', 2, { age: [65, 120] }, [
    `Hospitalisé{|e} pour une broutille. J'ai dragué l'infirmier, volé trois desserts et engueulé le chef de service.`,
    `On m'a mis une chemise d'hôpital ouverte dans le dos. Tout le couloir a vu mes fesses. Ils ne s'en remettront pas.`,
    `Le chirurgien m'a dit que j'avais « des artères de jeune homme ». Il mentait, mais j'ai bu à sa santé.`,
  ], [
    `Hospitalized for a trifle. I flirted with the nurse, stole three desserts and told off the head of department.`,
    `They gave me a hospital gown open at the back. The whole corridor saw my butt. They'll never recover.`,
    `The surgeon said I had "the arteries of a young man". He was lying, but I drank to his health.`,
  ]),
  A('centenarian', '🎂', 0, { age: [95, 120] }, [
    `Le maire est venu me féliciter pour mon âge. Je lui ai demandé qui il était. Trois fois.`,
    `J'ai survécu à tout le monde, y compris mon médecin et deux de ses successeurs.`,
    `Le journal local m'a demandé le secret de ma longévité. J'ai répondu « {w:food} et la rancune ».`,
  ], [
    `The mayor came to congratulate me on my age. I asked who he was. Three times.`,
    `I've outlived everyone, including my doctor and two of his successors.`,
    `The local paper asked the secret of my longevity. I said "{w:food} and holding grudges".`,
  ]),
  A('centenarian_trash', '💀', 2, { age: [95, 120] }, [
    `À mon âge, je pète, je rote et je dis « {w:swear} » au maire. On appelle ça « le charme de l'âge ».`,
    `J'ai survécu à trois croque-morts qui attendaient mon décès avec impatience. Le dernier s'est fait écraser par son corbillard.`,
    `L'infirmière m'a demandé si je voulais rédiger mes dernières volontés. J'ai écrit : « Qu'on m'enterre avec {w:food} et un doigt d'honneur. »`,
  ], [
    `At my age I fart, burp and say "{w:swear}" to the mayor. They call it "the charm of old age".`,
    `I've outlived three undertakers who couldn't wait for my death. The last one got run over by his own hearse.`,
    `The nurse asked if I wanted to write my last wishes. I wrote: "Bury me with {w:food} and a middle finger."`,
  ]),
  A('senior_garden', '🌹', 0, { age: [60, 110] }, [
    `Mes rosiers ont gagné le concours du village. Le jury était composé de ma voisine et de son chat.`,
    `J'ai parlé à mes tomates pendant une heure. Elles m'écoutent mieux que mes enfants.`,
    `J'ai surpris {w:animal} en train de dévorer mes salades. On a fait un pacte.`,
  ], [
    `My roses won the village contest. The jury was my neighbour and her cat.`,
    `I talked to my tomatoes for an hour. They listen better than my kids.`,
    `I caught {w:animal} devouring my lettuce. We made a pact.`,
  ]),
  A('senior_dance', '💃', 1, { age: [60, 100] }, [
    `Thé dansant : j'ai fait un tango sur {w:song} avec un monsieur de 88 ans. Il a perdu un chausson en route.`,
    `Au bal des seniors, j'ai bu {w:drink} et fait la chenille. Ma hanche a protesté en morse.`,
    `J'ai rencontré quelqu'un au thé dansant. Il dégage {w:smell} et il danse comme un dieu.`,
  ], [
    `Tea dance: I tangoed to {w:song} with an 88-year-old gentleman. He lost a slipper along the way.`,
    `At the seniors' ball I drank {w:drink} and did the conga. My hip protested in Morse code.`,
    `I met someone at the tea dance. He gives off {w:smell} and dances like a god.`,
  ]),
  A('senior_will', '📜', 1, { age: [65, 120], has: 'child' }, [
    `J'ai menacé mes enfants de léguer ma fortune à {w:animal}. Ils m'appellent tous les jours depuis.`,
    `J'ai refait mon testament [[trois|cinq|huit]] fois cette année. Le notaire me tutoie maintenant.`,
    `J'ai annoncé à mes enfants que j'allais tout dépenser en voyage {w:far_place}. Ils ont blêmi.`,
  ], [
    `I threatened to leave my fortune to {w:animal}. My kids call me every day now.`,
    `I've redone my will [[three|five|eight]] times this year. The notary is on first-name terms with me now.`,
    `I told my kids I'm going to spend it all on a trip {w:far_place}. They went pale.`,
  ]),
  A('senior_cooking', '🥧', 0, { age: [60, 110] }, [
    `J'ai fait ma tarte légendaire pour la famille. Personne n'a osé dire que j'avais mis du sel à la place du sucre.`,
    `J'ai cuisiné pour [[12|20|30]] personnes alors qu'on était quatre. C'est une question de principe.`,
    `Ma recette secrète ({w:food}) mourra avec moi. Mes petits-enfants l'ont trouvée sur Internet.`,
  ], [
    `I made my legendary pie for the family. Nobody dared say I'd used salt instead of sugar.`,
    `I cooked for [[12|20|30]] people when there were four of us. It's a matter of principle.`,
    `My secret recipe ({w:food}) will die with me. My grandkids found it online.`,
  ]),
  A('senior_mass', '⛪', 1, { age: [65, 120] }, [
    `À la messe, je me suis endormi{|e} et j'ai ronflé pendant le sermon. Le curé a haussé le ton. J'ai haussé le ronflement.`,
    `J'ai piqué un fou rire à la messe parce que l'organiste jouait comme {w:sound}. Excommunication imminente.`,
    `Je vais à la messe pour les ragots du parvis, pas pour Dieu. Lui aussi, je pense.`,
  ], [
    `At mass I fell asleep and snored through the sermon. The priest raised his voice. I raised my snore.`,
    `I got the giggles at mass because the organist sounded like {w:sound}. Excommunication imminent.`,
    `I go to mass for the gossip outside, not for God. He does too, I reckon.`,
  ]),
  A('senior_wheelchair', '🦽', 2, { age: [70, 120] }, [
    `J'ai fait une course de fauteuils roulants dans le couloir de l'Ehpad. J'ai percuté l'infirmière en chef. Elle a volé. J'ai gagné.`,
    `Mon déambulateur a pris de la vitesse dans la descente. J'ai fini dans la vitrine de la boulangerie, couvert{|e} de sang et d'éclairs au chocolat.`,
    `J'ai roulé sur le pied d'un jeune qui me manquait de respect. Il a hurlé. J'ai fait marche arrière. Deux fois.`,
  ], [
    `I raced wheelchairs down the care home corridor. I rammed the head nurse. She flew. I won.`,
    `My walker picked up speed on the downhill. I ended up in the bakery window, covered in blood and chocolate éclairs.`,
    `I rolled over the foot of a disrespectful youngster. He screamed. I reversed. Twice.`,
  ]),
  A('senior_memory', '🧠', 0, { age: [70, 120] }, [
    `J'ai appelé mon petit-fils par le nom du chien, puis par celui de mon frère, puis « {w:nickname} ». Il a répondu aux trois.`,
    `Je me souviens parfaitement d'une chanson de 1962 mais pas de ce que j'ai mangé ce midi.`,
    `J'ai raconté la même histoire trois fois au repas. À la troisième, elle avait {w:animal} dedans.`,
  ], [
    `I called my grandson by the dog's name, then my brother's, then "{w:nickname}". He answered to all three.`,
    `I remember a 1962 song perfectly but not what I had for lunch.`,
    `I told the same story three times at dinner. By the third, it had {w:animal} in it.`,
  ]),
  A('senior_money_rich', '💰', 1, { age: [60, 120], money: [1e6, 1e15] }, [
    `Mes héritiers me rendent visite tous les dimanches avec des fleurs et des sourires très crispés.`,
    `J'ai embauché un jeune infirmier à domicile qui me lit {w:show} à voix haute. Il espère être sur le testament.`,
    `J'ai acheté {w:vehicle} plaqué or pour aller à la boulangerie. Je roule à 12 km/h.`,
  ], [
    `My heirs visit every Sunday with flowers and very tense smiles.`,
    `I hired a young home nurse who reads me {w:show} out loud. He hopes to be in the will.`,
    `I bought {w:vehicle}, gold-plated, to drive to the bakery. I go 8 mph.`,
  ]),
  A('senior_poor', '🥫', 1, { age: [62, 120], money: [-1e12, 2000] }, [
    `Ma retraite tombe le 9. Le 10, je mange {w:food} et je chauffe la maison avec un sèche-cheveux.`,
    `J'ai fait les poubelles du marché avec mon caddie. Une mamie m'a piqué une courgette. Ça a fini en pugilat.`,
    `Mes petits-enfants m'ont donné des sous. J'ai fait semblant de refuser pendant trois secondes.`,
  ], [
    `My pension arrives on the 9th. On the 10th I eat {w:food} and heat the house with a hair dryer.`,
    `I scavenged the market bins with my shopping trolley. A granny swiped a zucchini from me. It ended in a brawl.`,
    `My grandkids gave me some money. I pretended to refuse for three seconds.`,
  ]),
  A('senior_newspaper', '📰', 0, { age: [60, 120] }, [
    `J'ai fait les mots croisés du journal en une heure. J'ai inventé [[deux|trois|cinq]] mots. Ils rentraient.`,
    `J'ai découpé un article sur {w:animal} et je l'ai envoyé à toute la famille. Par la poste.`,
    `J'ai écrit au courrier des lecteurs pour dénoncer {w:conspiracy}. Ils l'ont publié. Je suis célèbre au PMU.`,
  ], [
    `I did the newspaper crossword in an hour. I made up [[two|three|five]] words. They fit.`,
    `I cut out an article about {w:animal} and sent it to the whole family. By mail.`,
    `I wrote a letter to the editor exposing {w:conspiracy}. They printed it. I'm famous at the betting café.`,
  ]),
  A('senior_travel_far', '🌍', 1, { age: [60, 95] }, [
    `J'ai fait un voyage {w:far_place} pour mes [[65|70|75]] ans. J'ai envoyé quarante cartes postales et une photo floue.`,
    `Croisière pour retraités : buffet à volonté, bingo, mal de mer. J'ai vomi en élégance.`,
    `J'ai voyagé {w:far_place} avec mon groupe de randonnée. Trois d'entre nous sont rentrés avec une prothèse neuve.`,
  ], [
    `I took a trip {w:far_place} for my [[65th|70th|75th]] birthday. I sent forty postcards and one blurry photo.`,
    `Retiree cruise: all-you-can-eat buffet, bingo, seasickness. I vomited elegantly.`,
    `I travelled {w:far_place} with my hiking group. Three of us came back with new hip replacements.`,
  ]),
  A('senior_drunk', '🍷', 2, { age: [65, 120] }, [
    `Repas de famille : j'ai bu {w:drink} et raconté en détail ma nuit de noces. Ma belle-fille est sortie prendre l'air. Longtemps.`,
    `Au banquet des anciens, j'ai bu trop de vin de noix. J'ai vomi dans le chapeau du maire. Il l'a remis sans s'en rendre compte.`,
    `Pastis à 11 h avec les copains du club. À midi, on a chanté {w:song} debout sur la table de pétanque.`,
  ], [
    `Family dinner: I drank {w:drink} and described my wedding night in detail. My daughter-in-law stepped out for air. For a long time.`,
    `At the seniors' banquet I had too much walnut wine. I puked in the mayor's hat. He put it back on without noticing.`,
    `Pastis at 11 a.m. with the club boys. By noon we were singing {w:song} standing on the bocce table.`,
  ]),
  A('senior_dentures', '🦷', 2, { age: [65, 120] }, [
    `J'ai mordu dans {w:food} et mon dentier est resté planté dedans. J'ai fini le repas en le suçant.`,
    `Mon dentier est tombé du balcon. Un chien l'a ramassé. Il sourit mieux que moi maintenant.`,
    `J'ai éternué si fort que mon dentier a atterri dans le décolleté de la voisine. Elle a gardé.`,
  ], [
    `I bit into {w:food} and my dentures stayed stuck in it. I finished the meal by sucking on it.`,
    `My dentures fell off the balcony. A dog picked them up. He smiles better than me now.`,
    `I sneezed so hard my dentures landed down the neighbour's cleavage. She kept them.`,
  ]),
  A('senior_pet', '🐈', 0, { age: [60, 120], has: 'pet' }, [
    `Mon animal et moi avons le même rythme : sieste à 14 h, gamelle à 18 h, ronflements à 21 h.`,
    `J'ai tricoté un pull pour mon animal. Il l'a porté avec la dignité d'un condamné.`,
    `Je parle plus à mon animal qu'aux humains. Il n'a jamais contredit mes opinions sur {w:celeb}.`,
  ], [
    `My pet and I share a rhythm: nap at 2 p.m., dinner at 6 p.m., snoring at 9 p.m.`,
    `I knitted my pet a sweater. It wore it with the dignity of a condemned man.`,
    `I talk to my pet more than to humans. It has never contradicted my views on {w:celeb}.`,
  ]),
  A('senior_bench', '🪑', 0, { age: [65, 120] }, [
    `J'ai passé la matinée sur un banc à nourrir les pigeons. L'un d'eux m'a reconnu{|e}. On est amis.`,
    `Sur le banc du parc, j'ai commenté la tenue de tous les passants. Verdict : la jeunesse est perdue, sauf {w:animal}.`,
    `J'ai joué à la pétanque {w:weather} avec les anciens. On s'est disputés quarante minutes sur un centimètre.`,
  ], [
    `Spent the morning on a bench feeding pigeons. One of them recognized me. We're friends.`,
    `On the park bench I critiqued every passer-by's outfit. Verdict: youth is lost, except {w:animal}.`,
    `Played pétanque {w:weather} with the old-timers. We argued forty minutes over a centimetre.`,
  ]),
  A('senior_death_thought', '⏳', 1, { age: [75, 120] }, [
    `J'ai choisi mon cercueil sur catalogue. Le vendeur m'a proposé un modèle avec porte-gobelet. J'ai hésité.`,
    `J'ai écrit mon éloge funèbre moi-même. Il y a des blagues sur {w:celeb} et une chanson : {w:song}.`,
    `J'ai fait la liste des gens à qui je survivrai par pure rancune. Elle est longue.`,
  ], [
    `I picked my coffin from a catalogue. The salesman offered a model with a cupholder. I was tempted.`,
    `I wrote my own eulogy. It has jokes about {w:celeb} and a song: {w:song}.`,
    `I listed the people I'll outlive out of pure spite. It's a long list.`,
  ]),
  A('senior_fall', '🤕', 2, { age: [70, 120] }, [
    `Je suis tombé{|e} dans la salle de bain. Je suis resté{|e} quatre heures par terre à compter les carreaux et les poils pubiens oubliés.`,
    `Chute dans l'escalier : j'ai dévalé [[12|15|20]] marches, ma hanche a fait {w:sound}. Les pompiers m'ont trouvé{|e} en train de rire.`,
    `J'ai glissé sur une crotte de chien et me suis cassé {w:bodypart}. J'ai porté plainte contre le chien. Il a fui le pays.`,
  ], [
    `I fell in the bathroom. Stayed four hours on the floor counting the tiles and the forgotten pubes.`,
    `Fell down the stairs: I tumbled [[12|15|20]] steps, my hip went {w:sound}. The firefighters found me laughing.`,
    `I slipped on dog poop and broke my {w:bodypart}. I pressed charges against the dog. He fled the country.`,
  ]),
  A('senior_trash_mouth', '🤬', 2, { age: [70, 120] }, [
    `J'ai crié « {w:swear} » en plein milieu de la pharmacie. Puis j'ai demandé mes suppositoires très poliment.`,
    `Mon petit-fils m'a présenté sa copine. Je lui ai demandé si elle était « une gourgandine ». Silence de mort.`,
    `J'ai dit au médecin : « {w:threat} ». Il m'a prescrit un calmant. Pour lui.`,
  ], [
    `I yelled "{w:swear}" in the middle of the pharmacy. Then asked for my suppositories very politely.`,
    `My grandson introduced his girlfriend. I asked if she was "a trollop". Dead silence.`,
    `I told the doctor: "{w:threat}". He prescribed a sedative. For himself.`,
  ]),
  // ───────────── Tout âge adulte ─────────────
  A('weird_dream', '💭', 0, { age: [18, 120] }, [
    `J'ai rêvé que j'étais marié{|e} avec {w:celeb} et qu'on tenait un stand de crêpes {w:far_place}.`,
    `J'ai rêvé que mon seul super-pouvoir était {w:superpower}. Même en rêve, je suis nul{|le}.`,
    `J'ai rêvé qu'on me poursuivait {w:at_place}. Le poursuivant : {w:animal}. Je me suis réveillé{|e} en sueur, en train de courir dans le lit.`,
  ], [
    `I dreamed I was married to {w:celeb} and we ran a crêpe stand {w:far_place}.`,
    `I dreamed my only superpower was {w:superpower}. Even in my dreams I'm lame.`,
    `I dreamed I was being chased {w:at_place}. The chaser: {w:animal}. I woke up sweating, running in bed.`,
  ]),
  A('superpower', '🦸', 0, { age: [18, 120] }, [
    `Je me suis découvert un talent caché : {w:superpower}. Personne ne me croit.`,
    `J'ai fait une liste de mes super-pouvoirs. Numéro un : {w:superpower}. Numéro deux : dormir n'importe où.`,
    `Mon voisin dit qu'il a un don : {w:superpower}. Je le surveille.`,
  ], [
    `I discovered a hidden talent: {w:superpower}. Nobody believes me.`,
    `I listed my superpowers. Number one: {w:superpower}. Number two: sleeping anywhere.`,
    `My neighbour says he has a gift: {w:superpower}. I'm keeping an eye on him.`,
  ]),
  A('conspiracy_uncle', '🛸', 0, { age: [18, 120] }, [
    `Un inconnu {w:at_place} m'a expliqué pendant vingt minutes {w:conspiracy}. Il avait des schémas.`,
    `Mon oncle a partagé sur Facebook {w:conspiracy}. Quarante personnes ont liké, dont ma grand-mère.`,
    `J'ai lu un article qui disait {w:conspiracy}. J'y ai cru pendant [[trois|dix|trente]] secondes.`,
  ], [
    `A stranger {w:at_place} spent twenty minutes explaining {w:conspiracy}. He had diagrams.`,
    `My uncle shared on Facebook {w:conspiracy}. Forty likes, including my grandma.`,
    `I read an article claiming {w:conspiracy}. I believed it for [[three|ten|thirty]] seconds.`,
  ]),
  A('disaster_local', '🌪️', 1, { age: [18, 120] }, [
    `Ma ville a subi {w:disaster}. Le maire a dit « {w:exclaim} » en conférence de presse. Rassurant.`,
    `Pendant {w:disaster}, j'ai sauvé {w:object} et laissé mon passeport. Priorités.`,
    `Aux infos : {w:disaster}. J'ai acheté [[40|80|120]] rouleaux de PQ par précaution.`,
  ], [
    `My town was hit by {w:disaster}. The mayor said "{w:exclaim}" at the press conference. Reassuring.`,
    `During {w:disaster} I saved {w:object} and left my passport. Priorities.`,
    `On the news: {w:disaster}. I bought [[40|80|120]] rolls of toilet paper just in case.`,
  ]),
  A('crime_small_life', '🦹', 1, { age: [18, 120] }, [
    `J'ai pris une amende pour {w:crime_small}. Je conteste. Par principe.`,
    `Mon vice secret : {w:crime_small}. Je ne m'en confesserai jamais.`,
    `J'ai surpris mon voisin en flagrant délit. Son truc : {w:crime_small}. On a passé un accord de silence.`,
  ], [
    `I got fined for {w:crime_small}. I'm contesting. On principle.`,
    `My secret vice: {w:crime_small}. I'll never confess it.`,
    `I caught my neighbour red-handed. His thing: {w:crime_small}. We made a pact of silence.`,
  ]),
  A('weird_job_meet', '🧑‍🔧', 0, { age: [18, 120] }, [
    `J'ai rencontré quelqu'un qui travaille comme {w:weird_job}. J'ai posé [[douze|trente|cinquante]] questions.`,
    `Mon cousin s'est reconverti : il est désormais {w:weird_job}. Ma tante le présente comme « entrepreneur ».`,
    `À une soirée, j'ai dragué {w:weird_job}. Je n'ai pas osé demander les détails.`,
  ], [
    `I met someone who works as {w:weird_job}. I asked [[twelve|thirty|fifty]] questions.`,
    `My cousin changed careers: he's now {w:weird_job}. My aunt calls him "an entrepreneur".`,
    `At a party I flirted with {w:weird_job}. Didn't dare ask for details.`,
  ]),
  A('smell_mystery', '👃', 1, { age: [18, 120] }, [
    `Mon appart dégage {w:smell} depuis trois jours. J'ai tout vidé. Je soupçonne le mur.`,
    `Dans l'ascenseur, il y avait {w:smell}. Un voisin m'a regardé{|e} avec soupçon. C'était lui, j'en suis sûr{|e}.`,
    `Mes chaussures dégagent {w:smell}. Je les ai mises sur le balcon. Les pigeons sont partis.`,
  ], [
    `My flat has given off {w:smell} for three days. I emptied everything. I suspect the wall.`,
    `There was {w:smell} in the elevator. A neighbour gave me a suspicious look. It was him, I'm sure.`,
    `My shoes give off {w:smell}. I put them on the balcony. The pigeons left.`,
  ]),
  A('gross_find', '🤢', 2, { age: [18, 120] }, [
    `J'ai trouvé {w:gross} dans mon sandwich {w:at_place}. J'avais déjà mangé la moitié.`,
    `Dans le bus, j'ai attrapé la barre. Il y avait {w:gross} dessus. Ma main ne sera plus jamais propre.`,
    `J'ai marché pieds nus sur {w:gross} dans ma propre cuisine. Je ne sais pas qui l'a mis là. J'habite seul{|e}.`,
  ], [
    `I found {w:gross} in my sandwich {w:at_place}. I'd already eaten half.`,
    `On the bus I grabbed the pole. There was {w:gross} on it. My hand will never be clean again.`,
    `I stepped barefoot on {w:gross} in my own kitchen. I don't know who put it there. I live alone.`,
  ]),
  A('insomnia', '🌙', 0, { age: [18, 120] }, [
    `Insomnie : à 3 h du matin, j'ai repensé à une gaffe de 2009 et j'ai eu honte comme au premier jour.`,
    `Je n'arrivais pas à dormir. J'ai fini par {w:activity} jusqu'à l'aube.`,
    `Nuit blanche. J'ai regardé des vidéos sur {w:animal} pendant [[3|4|5]] heures. Je suis expert{|e} maintenant.`,
  ], [
    `Insomnia: at 3 a.m. I remembered a gaffe from 2009 and felt as ashamed as the day it happened.`,
    `Couldn't sleep. I ended up {w:activity} until dawn.`,
    `Sleepless night. I watched videos about {w:animal} for [[3|4|5]] hours. I'm an expert now.`,
  ]),
  A('celeb_spot', '🌟', 0, { age: [18, 120] }, [
    `J'ai croisé {w:celeb} {w:at_place}. J'ai joué l'indifférence pour avoir l'air cool. J'ai tremblé pendant une heure.`,
    `J'ai cru voir {w:celeb} {w:at_place}. C'était un sosie. Je lui ai quand même demandé un autographe.`,
    `{w:celeb} a liké mon commentaire. Je l'ai encadré.`,
  ], [
    `I bumped into {w:celeb} {w:at_place}. I played it cool. I shook for an hour.`,
    `I thought I saw {w:celeb} {w:at_place}. It was a lookalike. I asked for an autograph anyway.`,
    `{w:celeb} liked my comment. I framed it.`,
  ]),
  // ───────────── Prison ─────────────
  A('pr_food', '🍲', 0, { age: [18, 120], prison: true }, [
    `Au réfectoire, on a servi un truc gris qui ressemblait à {w:food}. Il a bougé quand j'ai approché la fourchette.`,
    `Menu du jour à la cantine de la prison : « surprise ». Personne n'a été surpris. C'était encore de la purée, avec {w:food} en option.`,
    `J'ai échangé mon dessert contre {w:object}. Bonne affaire selon les standards d'ici.`,
  ], [
    `In the mess hall they served something grey that looked like {w:food}. It moved when my fork got close.`,
    `Prison canteen menu of the day: "surprise". Nobody was surprised. Mashed potatoes again, with optional {w:food}.`,
    `I traded my dessert for {w:object}. A good deal by local standards.`,
  ]),
  A('pr_cellmate', '🛏️', 1, { age: [18, 120], prison: true }, [
    `Mon codétenu ronfle comme {w:vehicle} et réclame {w:food} dans son sommeil. Je dors avec un œil ouvert.`,
    `Mon codétenu m'a raconté son crime pendant [[deux|quatre|six]] heures. Je crois qu'il en a rajouté. J'espère. Il y avait {w:animal} dans l'histoire.`,
    `Mon codétenu s'est surnommé « {w:nickname} » et exige qu'on l'appelle comme ça. J'obéis. Il fait deux mètres.`,
  ], [
    `My cellmate snores like {w:vehicle} and begs for {w:food} in his sleep. I sleep with one eye open.`,
    `My cellmate told me about his crime for [[two|four|six]] hours. I think he exaggerated. I hope. The story involved {w:animal}.`,
    `My cellmate calls himself "{w:nickname}" and insists everyone does. I comply. He's six-foot-seven.`,
  ]),
  A('pr_cellmate_gross', '🚽', 2, { age: [18, 120], prison: true }, [
    `Les toilettes sont au milieu de la cellule. Mon codétenu chie en me regardant dans les yeux. On est très proches.`,
    `Mon codétenu se cure les ongles de pied avec une cuillère. LA cuillère. On n'en a qu'une. Ce soir, c'est {w:food}.`,
    `Mon codétenu a eu la courante toute la nuit, à trente centimètres de mon oreiller. J'ai vu des choses qu'aucun juge ne m'avait annoncées.`,
  ], [
    `The toilet is in the middle of the cell. My cellmate poops while looking me in the eye. We're very close.`,
    `My cellmate cleans his toenails with a spoon. THE spoon. We only have one. Tonight it's {w:food}.`,
    `My cellmate had the runs all night, a foot from my pillow. I saw things no judge warned me about.`,
  ]),
  A('pr_yard', '🏀', 0, { age: [18, 120], prison: true }, [
    `Promenade : j'ai fait [[200|350|500]] tours de cour en pensant à {w:food}.`,
    `Dans la cour, un détenu m'a donné des conseils sur {w:hobby}. C'est un ancien braqueur, il est très doux.`,
    `J'ai joué au basket dans la cour {w:weather}. J'ai perdu contre un mec qui s'appelle « {w:nickname} ».`,
  ], [
    `Yard time: I walked [[200|350|500]] laps thinking about {w:food}.`,
    `In the yard an inmate gave me tips on {w:hobby}. He's a former armed robber, very gentle.`,
    `Played basketball in the yard {w:weather}. Lost to a guy called "{w:nickname}".`,
  ]),
  A('pr_shower', '🚿', 2, { age: [18, 120], prison: true }, [
    `Douches collectives : j'ai fait tomber le savon. Je l'ai laissé par terre. Il y est toujours. Il y sera toujours. Il dégage {w:smell}.`,
    `Sous la douche de la prison, l'eau était soit glacée soit bouillante. J'ai crié « {w:swear} » en harmonie avec tout le bloc.`,
    `Un mec a pissé sur mes pieds sous la douche en me souriant. J'ai souri en retour. C'est la diplomatie ici.`,
  ], [
    `Group showers: I dropped the soap. I left it on the floor. It's still there. It always will be. It gives off {w:smell}.`,
    `The prison shower was either freezing or scalding. I yelled "{w:swear}" in harmony with the whole block.`,
    `A guy peed on my feet in the shower while smiling at me. I smiled back. That's diplomacy here.`,
  ]),
  A('pr_letter', '✉️', 0, { age: [18, 120], prison: true }, [
    `J'ai reçu une lettre de l'extérieur. Dedans : {w:animal} en photo et zéro nouvelles. Je l'ai relue [[12|30|50]] fois.`,
    `J'ai écrit une lettre d'amour à quelqu'un que j'ai vu une fois {w:at_place}. Pas de réponse. Normal, pas d'adresse.`,
    `Ma famille m'a envoyé {w:gift}. Les gardiens l'ont ouvert, inspecté, et en ont gardé la moitié.`,
  ], [
    `I got a letter from outside. Inside: a photo of {w:animal} and zero news. I reread it [[12|30|50]] times.`,
    `I wrote a love letter to someone I saw once {w:at_place}. No reply. Normal, no address.`,
    `My family sent me {w:gift}. The guards opened it, inspected it and kept half.`,
  ]),
  A('pr_guard', '👮', 1, { age: [18, 120], prison: true }, [
    `Un gardien m'a traité de « {w:insult} ». Je l'ai noté dans mon carnet de vengeance. Page 47.`,
    `Le gardien de nuit écoute {w:song} en boucle dans le couloir. C'est ça, la vraie peine.`,
    `Fouille de cellule surprise : ils ont trouvé {w:object}. Je ne sais pas comment il est arrivé là. Vraiment.`,
  ], [
    `A guard called me "{w:insult}". I wrote it in my revenge notebook. Page 47.`,
    `The night guard plays {w:song} on loop in the corridor. That's the real sentence.`,
    `Surprise cell search: they found {w:object}. I don't know how it got there. Really.`,
  ]),
  A('pr_trade', '🚬', 1, { age: [18, 120], prison: true }, [
    `Ici, la monnaie c'est les cigarettes et les nouilles instantanées. J'ai [[14|27|40]] paquets de nouilles. Je suis riche.`,
    `J'ai négocié {w:food} contre deux paquets de clopes. Le vendeur s'appelle « {w:nickname} » et il a un sourire inquiétant.`,
    `J'ai monté un petit commerce de timbres en cellule. Le directeur ne sait rien. Le directeur est client. Il paie avec {w:food}.`,
  ], [
    `In here, the currency is cigarettes and instant noodles. I have [[14|27|40]] packs of noodles. I'm rich.`,
    `I traded {w:food} for two packs of smokes. The seller is called "{w:nickname}" and has a worrying smile.`,
    `I started a little stamp business in my cell. The warden knows nothing. The warden is a customer. He pays with {w:food}.`,
  ]),
  A('pr_fight', '🥊', 2, { age: [18, 120], prison: true }, [
    `Baston au réfectoire : un type s'est pris un plateau en pleine face. Une dent a atterri dans ma purée. Je l'ai mangée quand même. La purée, pas la dent. Le type a hurlé « {w:swear} ».`,
    `J'ai vu un détenu mordre l'oreille d'un autre. Le bout d'oreille a roulé sous ma chaise. Personne ne l'a réclamé.`,
    `Émeute dans l'aile B : du sang sur les murs, un gardien en slip et {w:object} qui volait. J'ai regardé depuis ma couchette en mangeant des chips.`,
  ], [
    `Mess hall brawl: a guy took a tray to the face. A tooth landed in my mashed potatoes. I ate them anyway. The potatoes, not the tooth. The guy screamed "{w:swear}".`,
    `I saw one inmate bite another's ear. The chunk of ear rolled under my chair. Nobody claimed it.`,
    `Riot in B wing: blood on the walls, a guard in his underwear and {w:object} flying around. I watched from my bunk eating chips.`,
  ]),
  A('pr_tattoo', '🖋️', 2, { age: [18, 120], prison: true }, [
    `Je me suis fait tatouer en cellule avec un moteur de rasoir et de l'encre de stylo. C'était censé être un aigle. C'est {w:animal}. Infecté.`,
    `Un détenu m'a tatoué « {w:nickname} » sur le front. Il était bourré au jus de patate fermenté. Moi aussi.`,
    `Mon tatouage de prison s'est infecté. Il suinte un liquide jaune. Mon codétenu l'appelle « la fontaine ». Elle dégage {w:smell}.`,
  ], [
    `Got a cell tattoo with a razor motor and pen ink. It was meant to be an eagle. It's {w:animal}. Infected.`,
    `An inmate tattooed "{w:nickname}" on my forehead. He was drunk on fermented potato juice. So was I.`,
    `My prison tattoo got infected. It oozes yellow liquid. My cellmate calls it "the fountain". It gives off {w:smell}.`,
  ]),
  A('pr_hooch', '🍶', 2, { age: [18, 120], prison: true }, [
    `On a fabriqué de l'alcool de prison dans un sac poubelle avec des fruits et du pain. Ça a un goût de chaussette fermentée et de regrets.`,
    `J'ai bu du pruno fait maison. J'ai vomi par le nez, vu ma grand-mère décédée et dansé sur {w:song}.`,
    `Notre alambic clandestin a explosé sous le lit. La cellule dégage {w:smell} et le plafond est violet.`,
  ], [
    `We brewed prison hooch in a garbage bag with fruit and bread. It tastes like fermented socks and regret.`,
    `I drank homemade hooch. I puked through my nose, saw my dead grandma and danced to {w:song}.`,
    `Our secret still exploded under the bed. The cell gives off {w:smell} and the ceiling is purple.`,
  ]),
  A('pr_tv', '📺', 0, { age: [18, 120], prison: true }, [
    `Le bloc entier a voté pour regarder {w:show}. J'ai voté contre. J'ai perdu. La démocratie, c'est dur.`,
    `On a regardé {w:movie} dans la salle commune. Un braqueur a pleuré à la fin. Personne n'a rien dit.`,
    `Bagarre pour la télécommande : {w:show} a gagné. Deux blessés légers.`,
  ], [
    `The whole block voted to watch {w:show}. I voted against. I lost. Democracy is hard.`,
    `We watched {w:movie} in the common room. A bank robber cried at the end. Nobody said anything.`,
    `Fight over the remote: {w:show} won. Two minor injuries.`,
  ]),
  A('pr_workshop', '🔧', 0, { age: [18, 120], prison: true }, [
    `Atelier de la prison : j'ai assemblé [[300|800|1 200]] stylos aujourd'hui pour 0,40 € de l'heure. Le rêve.`,
    `On m'a mis{|e} à la buanderie de la prison. J'ai lavé les slips de tout le bloc. Je connais des secrets. Et j'y ai trouvé {w:object}.`,
    `Atelier cuisine en prison : j'ai appris à faire {w:food} avec un fer à repasser et des chips.`,
  ], [
    `Prison workshop: I assembled [[300|800|1,200]] pens today for 40 cents an hour. Living the dream.`,
    `They put me in the prison laundry. I washed the whole block's underwear. I know secrets. And I found {w:object} in there.`,
    `Prison cooking workshop: I learned to make {w:food} with a clothes iron and chips.`,
  ]),
  A('pr_library', '📚', 0, { age: [18, 120], prison: true }, [
    `J'ai lu tous les livres de la bibliothèque de la prison. Il y en avait [[11|17|23]]. Dont trois annuaires et un guide sur {w:hobby}.`,
    `J'ai commencé à étudier le droit pour faire appel. Je suis bloqué{|e} au mot « alinéa ».`,
    `J'ai découvert {w:hobby} grâce à un vieux livre de la bibliothèque. Je suis le meilleur du bloc. Le seul aussi.`,
  ], [
    `I read every book in the prison library. There were [[11|17|23]]. Three were phone books, one was a guide to {w:hobby}.`,
    `I started studying law for my appeal. I'm stuck on the word "subsection".`,
    `I discovered {w:hobby} thanks to an old library book. I'm the best on the block. Also the only one.`,
  ]),
  A('pr_visit', '👥', 1, { age: [18, 120], prison: true }, [
    `Parloir : on m'a rendu visite pendant 30 minutes. On a parlé de la météo. Dehors, les gens vivent {w:weather}, apparemment.`,
    `Personne n'est venu au parloir. J'ai parlé à la vitre pendant vingt minutes. Elle m'a semblé à l'écoute. Je lui ai chanté {w:song}.`,
    `Au parloir, quelqu'un a essayé de faire passer {w:object} dans sa bouche. Les gardiens l'ont sorti. Beurk.`,
  ], [
    `Visiting hour: someone visited me for 30 minutes. We talked about the weather. Outside, people are living {w:weather}, apparently.`,
    `Nobody came to visiting hour. I talked to the glass for twenty minutes. It seemed a good listener. I sang it {w:song}.`,
    `In visiting, someone tried to smuggle {w:object} in their mouth. The guards pulled it out. Gross.`,
  ]),
  A('pr_conjugal', '💋', 2, { age: [18, 120], prison: true }, [
    `Visite conjugale : 45 minutes dans une pièce qui dégage {w:smell} avec un matelas en plastique. On a fait de notre mieux.`,
    `Mon voisin de cellule a eu une visite conjugale. Le bloc entier a entendu. Il a eu une ovation au réfectoire et double ration : {w:food}.`,
    `J'ai demandé une visite conjugale. On m'a envoyé un formulaire de 14 pages. J'ai perdu l'envie à la page 3.`,
  ], [
    `Conjugal visit: 45 minutes in a room with {w:smell} on a plastic mattress. We did our best.`,
    `My cell neighbour got a conjugal visit. The whole block heard. He got a standing ovation in the mess hall and a double serving: {w:food}.`,
    `I requested a conjugal visit. They sent a 14-page form. I lost the urge by page 3.`,
  ]),
  A('pr_nights', '🌙', 0, { age: [18, 120], prison: true }, [
    `La nuit, quelqu'un chante {w:song} dans l'aile C. Tout le bloc reprend le refrain. C'est beau, à sa façon.`,
    `J'ai compté les fissures du plafond : [[214|388|1 012]]. Demain je recompte, au cas où.`,
    `J'ai rêvé que je m'évadais sur {w:vehicle}. Je me suis réveillé{|e} en serrant mon oreiller très fort.`,
  ], [
    `At night someone sings {w:song} in C wing. The whole block joins the chorus. It's beautiful, in its way.`,
    `I counted the cracks in the ceiling: [[214|388|1,012]]. Tomorrow I'll recount, just in case.`,
    `I dreamed I escaped on {w:vehicle}. I woke up hugging my pillow very tight.`,
  ]),
  A('pr_gang', '🐍', 1, { age: [18, 120], prison: true }, [
    `Un gang m'a proposé de les rejoindre. Le rite d'initiation implique {w:food} et beaucoup de cris. J'ai dit que je réfléchissais.`,
    `Le chef du bloc m'a fait passer un message : « {w:threat} ». J'ai fait profil bas pendant une semaine.`,
    `Je suis devenu{|e} le comptable officieux d'un gang. Je tiens les comptes de nouilles. C'est une responsabilité.`,
  ], [
    `A gang invited me to join. The initiation involves {w:food} and lots of shouting. I said I'd think about it.`,
    `The block boss sent me a message: "{w:threat}". I kept my head down for a week.`,
    `I became a gang's unofficial accountant. I keep the noodle books. It's a responsibility.`,
  ]),
  A('pr_snitch', '🐀', 2, { age: [18, 120], prison: true }, [
    `On a découvert qu'un détenu balançait aux gardiens. On l'a retrouvé enroulé dans un matelas, couvert de bleus et de mayonnaise. Personne n'a rien vu.`,
    `Un mouchard s'est fait planter avec une brosse à dents taillée. Il a pissé le sang dans tout le couloir en criant « {w:exclaim} ».`,
    `Le bruit court que je suis une balance. Ce matin, j'ai trouvé un rat mort dans ma chaussure. Et un autre dans ma soupe.`,
  ], [
    `We found out an inmate was snitching to the guards. They found him rolled in a mattress, covered in bruises and mayonnaise. Nobody saw anything.`,
    `A snitch got shanked with a sharpened toothbrush. He gushed blood down the whole corridor yelling "{w:exclaim}".`,
    `Rumour says I'm a snitch. This morning I found a dead rat in my shoe. And another in my soup.`,
  ]),
  A('pr_solitary', '⬛', 1, { age: [18, 120], prison: true }, [
    `Trois jours au mitard. J'ai parlé à une mouche. Elle s'appelle {w:nickname}. On a beaucoup en commun.`,
    `Au mitard, j'ai chanté {w:song} [[80|150|300]] fois. Le gardien m'a supplié d'arrêter.`,
    `Au mitard, j'ai fini par {w:activity} dans le noir complet.`,
  ], [
    `Three days in solitary. I talked to a fly. Its name is {w:nickname}. We have a lot in common.`,
    `In solitary I sang {w:song} [[80|150|300]] times. The guard begged me to stop.`,
    `In solitary I ended up {w:activity} in pitch darkness.`,
  ]),
  A('pr_gym', '💪', 0, { age: [18, 120], prison: true }, [
    `J'ai fait [[300|500|1 000]] pompes aujourd'hui. Je n'ai rien d'autre à faire. Mes bras sont des jambons.`,
    `À la muscu de la prison, un mec soulevait {w:object} au lieu d'une barre. Personne n'a osé lui dire.`,
    `Je suis plus musclé{|e} qu'à aucun moment de ma vie. Merci la justice.`,
  ], [
    `I did [[300|500|1,000]] push-ups today. Nothing else to do. My arms are hams.`,
    `At the prison gym a guy was lifting {w:object} instead of a barbell. Nobody dared tell him.`,
    `I'm more ripped than I've ever been in my life. Thanks, justice system.`,
  ]),
  A('pr_escape_dream', '🥄', 1, { age: [18, 120], prison: true }, [
    `J'ai commencé à creuser le mur avec une cuillère. Au bout d'un mois : 2 mm. À ce rythme, je sors en 2470.`,
    `Mon codétenu a un plan d'évasion qui implique {w:animal}, un drap et {w:food}. Je ne suis pas convaincu{|e}.`,
    `J'ai fabriqué une fausse tête en papier mâché pour mettre dans mon lit. Elle ressemble à {w:celeb}. Le gardien a ri.`,
  ], [
    `I started digging through the wall with a spoon. After a month: 2 mm. At this rate I'm out in 2470.`,
    `My cellmate's escape plan involves {w:animal}, a bedsheet and {w:food}. I'm not convinced.`,
    `I made a papier-mâché dummy head for my bed. It looks like {w:celeb}. The guard laughed.`,
  ]),
  A('pr_chaplain', '✝️', 0, { age: [18, 120], prison: true }, [
    `L'aumônier m'a parlé du pardon. Je lui ai expliqué {w:conspiracy}. On a tous les deux appris des trucs.`,
    `J'ai assisté à la messe de la prison pour les biscuits. Les biscuits étaient bénis. Ils avaient un goût de carton béni.`,
    `J'ai trouvé la foi en prison. Puis je l'ai reperdue au réfectoire.`,
  ], [
    `The chaplain talked to me about forgiveness. I explained to him {w:conspiracy}. We both learned something.`,
    `I went to prison mass for the cookies. They were blessed. They tasted like blessed cardboard.`,
    `I found faith in prison. Then I lost it again in the mess hall.`,
  ]),
  A('pr_psych', '🧠', 1, { age: [18, 120], prison: true }, [
    `Séance avec la psy de la prison : elle m'a demandé ce que je ressentais. J'ai répondu « la faim ».`,
    `La psy m'a demandé de dessiner ma colère. J'ai dessiné le juge en {w:animal}. Elle a dit « intéressant ».`,
    `Atelier « gestion des émotions » : un braqueur a pleuré, un autre a cassé {w:object}. Progrès.`,
  ], [
    `Session with the prison shrink: she asked what I was feeling. I said "hungry".`,
    `The shrink asked me to draw my anger. I drew the judge as {w:animal}. She said "interesting".`,
    `"Managing emotions" workshop: one robber cried, another smashed {w:object}. Progress.`,
  ]),
  A('pr_noise', '🔔', 0, { age: [18, 120], prison: true }, [
    `Appel à 6 h du matin. J'ai répondu « présent{|e} » en dormant. Je rêvais qu'on me servait {w:food}.`,
    `Les portes métalliques claquent toute la nuit. J'ai appris à dormir avec {w:sound} en fond sonore.`,
    `Un détenu tape sur les barreaux en rythme sur {w:song}. Tout le couloir danse dans sa cellule.`,
  ], [
    `Roll call at 6 a.m. I said "present" in my sleep. I was dreaming someone served me {w:food}.`,
    `Metal doors slam all night. I learned to sleep with {w:sound} in the background.`,
    `An inmate drums on the bars in time to {w:song}. The whole corridor dances in their cells.`,
  ]),
  A('pr_smuggle', '📦', 2, { age: [18, 120], prison: true }, [
    `Un détenu a fait entrer un téléphone dans son cul. Il a sonné pendant la fouille. La sonnerie : {w:song}.`,
    `On a reçu de la contrebande par drone. Il s'est écrasé dans la cour, sur la tête d'un gardien. Il saignait du crâne en hurlant « {w:swear} ».`,
    `Mon voisin cache ses clopes dans un endroit que personne n'ose fouiller. Elles sentent bizarre, mais elles fument.`,
  ], [
    `An inmate smuggled a phone up his butt. It rang during the search. Ringtone: {w:song}.`,
    `We got contraband by drone. It crashed in the yard, onto a guard's head. He bled from the skull yelling "{w:swear}".`,
    `My neighbour hides his smokes somewhere nobody dares search. They smell funny, but they smoke.`,
  ]),
  A('pr_parole_hope', '🗓️', 0, { age: [18, 120], prison: true }, [
    `J'ai coché un jour de plus sur le mur. Le mur ressemble maintenant à un code-barres géant.`,
    `J'ai fait la liste de ce que je ferai en sortant. Numéro un : manger {w:food}. Numéro deux : {w:activity}.`,
    `Mon avocat m'a dit de « garder espoir ». Il m'a facturé l'espoir 200 € de l'heure.`,
  ], [
    `I ticked off another day on the wall. The wall now looks like a giant barcode.`,
    `I made a list of things to do when I get out. Number one: eat {w:food}. Number two: {w:activity}.`,
    `My lawyer told me to "stay hopeful". He billed me $200 an hour for the hope.`,
  ]),
  A('pr_gore', '🩸', 2, { age: [18, 120], prison: true }, [
    `Accident à l'atelier : un détenu s'est coupé deux doigts à la scie. Un gardien les a mis dans un pot de cornichons pour l'hôpital.`,
    `Un mec s'est ouvert l'arcade contre le lavabo en glissant sur une savonnette. Le sang a giclé jusqu'au plafond. Le plafond est resté rouge.`,
    `Un détenu a avalé une lame de rasoir pour être transféré à l'infirmerie. Il l'a ressortie par où vous pensez. Il boite.`,
  ], [
    `Workshop accident: an inmate sawed off two fingers. A guard put them in a pickle jar for the hospital.`,
    `A guy split his brow open on the sink after slipping on soap. Blood sprayed to the ceiling. The ceiling stayed red.`,
    `An inmate swallowed a razor blade to get sent to the infirmary. It came out where you'd think. He's limping.`,
  ]),
  A('pr_birthday', '🎂', 1, { age: [18, 120], prison: true }, [
    `Anniversaire en prison : mon codétenu m'a fait un gâteau avec des biscuits écrasés et du dentifrice. En guise de bougie : {w:object}.`,
    `J'ai fêté mon anniversaire en cellule. Le bloc m'a chanté joyeux anniversaire avec des voix de baryton menaçantes.`,
    `Pour mon anniversaire, un gardien m'a laissé{|e} regarder {w:show} dix minutes de plus. Je l'aime. Je le hais.`,
  ], [
    `Prison birthday: my cellmate made me a cake from crushed cookies and toothpaste. For a candle: {w:object}.`,
    `I celebrated my birthday in my cell. The block sang happy birthday in menacing baritones.`,
    `For my birthday a guard let me watch {w:show} ten minutes longer. I love him. I hate him.`,
  ]),
  A('pr_release_talk', '🚪', 1, { age: [18, 120], prison: true }, [
    `Un ancien m'a expliqué comment survivre dehors : « Ne fais jamais confiance à {w:animal}. » Je n'ai pas compris, mais j'ai noté.`,
    `Un détenu libéré hier est déjà revenu ce matin. Motif : {w:crime_small}. On lui a gardé sa couchette.`,
    `J'ai appris en prison plus de techniques louches qu'en vingt ans de vie dehors. Je les oublierai. Promis. Peut-être.`,
  ], [
    `An old-timer explained how to survive outside: "Never trust {w:animal}." I didn't get it, but I took notes.`,
    `An inmate released yesterday was back this morning. Charge: {w:crime_small}. We saved his bunk.`,
    `I've learned more shady tricks in prison than in twenty years outside. I'll forget them. Promise. Maybe.`,
  ]),
  // ───────────── Métiers ─────────────
  A('job_generic', '🗃️', 0, { age: [18, 70], job: true }, [
    `Journée type de {job} : café, mails, réunion, café, crise existentielle, café.`,
    `On m'a demandé à un dîner ce que je fais. J'ai dit « {job} ». La personne a enchaîné sur {w:animal}.`,
    `Le nouveau stagiaire chez {employer} m'a demandé des conseils. J'ai dit « ne fais jamais confiance à l'imprimante ».`,
  ], [
    `Typical day as a {job}: coffee, emails, meeting, coffee, existential crisis, coffee.`,
    `At a dinner someone asked what I do. I said "{job}". They moved straight on to {w:animal}.`,
    `The new intern at {employer} asked me for advice. I said "never trust the printer".`,
  ]),
  A('job_generic_trash', '🖕', 2, { age: [18, 70], job: true }, [
    `J'ai craché dans le café de mon chef. Il l'a trouvé « particulièrement onctueux ». Je recommencerai.`,
    `Chez {employer}, quelqu'un a fait caca dans la photocopieuse. Les copies sont sorties marron. Le mystère reste entier.`,
    `J'ai écrit « {w:insult} » dans le nom de fichier d'un rapport envoyé au client. Il a répondu « merci, très clair ».`,
  ], [
    `I spat in my boss's coffee. He found it "particularly smooth". I'll do it again.`,
    `At {employer} someone pooped in the photocopier. The copies came out brown. The mystery remains.`,
    `I put "{w:insult}" in the file name of a report sent to the client. He replied "thanks, very clear".`,
  ]),
  A('job_cashier', '🛒', 1, { age: [18, 70], job: ['cashier', 'retail'] }, [
    `Un client m'a demandé si {w:object} était en promo. Ce n'est pas un produit qu'on vend. Il l'avait apporté de chez lui.`,
    `J'ai scanné [[1 400|2 200|3 000]] articles aujourd'hui. J'entends des « bip » même sous la douche.`,
    `Une cliente a voulu me parler au « responsable du responsable ». Je lui ai passé le vigile. Ils se sont mariés.`,
  ], [
    `A customer asked if {w:object} was on sale. We don't sell that. He'd brought it from home.`,
    `I scanned [[1,400|2,200|3,000]] items today. I hear beeps even in the shower.`,
    `A customer asked for "the manager's manager". I sent her the security guard. They got married.`,
  ]),
  A('job_waiter', '🍽️', 2, { age: [18, 70], job: ['waiter', 'cook', 'fastfood'] }, [
    `Un client odieux a renvoyé sa soupe trois fois. La quatrième, le chef a éternué dedans. Il a adoré.`,
    `J'ai vu le cuisinier ramasser {w:food} par terre, souffler dessus et le dresser. C'était la table du critique.`,
    `Un client a claqué des doigts pour m'appeler. Je lui ai apporté {w:drink} avec un peu de ma salive en bonus.`,
  ], [
    `A vile customer sent his soup back three times. The fourth time the chef sneezed in it. He loved it.`,
    `I watched the cook pick {w:food} off the floor, blow on it and plate it. It was the critic's table.`,
    `A customer snapped his fingers at me. I brought him {w:drink} with a little of my spit as a bonus.`,
  ]),
  A('job_teacher', '🍎', 0, { age: [22, 70], job: 'teacher' }, [
    `Un élève m'a rendu une copie qui expliquait {w:conspiracy}. Il a eu 14. Bien argumenté.`,
    `J'ai corrigé [[60|90|120]] copies ce week-end. J'ai trouvé une déclaration d'amour, deux menaces et {w:animal} dessiné au stylo bille.`,
    `Un élève m'a appelé{|e} « maman » en classe. Il a 17 ans. Il a déménagé de honte.`,
  ], [
    `A student handed in an essay explaining {w:conspiracy}. He got a B. Well argued.`,
    `I graded [[60|90|120]] papers this weekend. Found a love letter, two threats and {w:animal} drawn in ballpoint.`,
    `A student called me "mom" in class. He's 17. He moved away out of shame.`,
  ]),
  A('job_nurse', '💉', 2, { age: [22, 70], job: ['nurse', 'doctor', 'surgeon'] }, [
    `Aux urgences ce soir : un homme et {w:object}, réunis là où le soleil ne brille pas. Il a juré qu'il avait « glissé ».`,
    `Un patient m'a vomi dessus, puis m'a dit « {w:compliment} ». J'ai été touché{|e}. Et mouillé{|e}.`,
    `Garde de nuit : un doigt coupé, un pied dans un bocal et un monsieur qui voulait juste un sandwich. Normal.`,
  ], [
    `ER tonight: a man with {w:object} stuck where the sun doesn't shine. He swore he "slipped".`,
    `A patient puked on me, then said "{w:compliment}". I was touched. And wet.`,
    `Night shift: one severed finger, a foot in a jar and a gentleman who just wanted a sandwich. Normal.`,
  ]),
  A('job_police', '🚓', 2, { age: [20, 65], job: ['police', 'detective', 'prison_guard'] }, [
    `J'ai fait une planque de [[6|9|14]] heures dans une voiture. J'ai mangé {w:food} et fait pipi dans une bouteille.`,
    `Un suspect m'a dit « {w:threat} ». Je l'ai noté dans le PV, mot pour mot. Le juge a ri.`,
    `J'ai arrêté un mec pour {w:crime_small}. C'était mon cousin. Le repas de Noël va être tendu.`,
  ], [
    `I did a [[6|9|14]]-hour stakeout in a car. I ate {w:food} and peed in a bottle.`,
    `A suspect told me "{w:threat}". I wrote it in the report word for word. The judge laughed.`,
    `I arrested a guy for {w:crime_small}. It was my cousin. Christmas dinner will be tense.`,
  ]),
  A('job_dev', '💻', 0, { age: [20, 65], job: ['developer', 'ai_engineer', 'data_scientist', 'game_dev', 'ux_designer'] }, [
    `J'ai passé la journée à chercher un bug. C'était un point-virgule. J'ai crié « {w:exclaim} » en open space.`,
    `J'ai mis en production un vendredi à 17 h 58. Le week-end a été intense.`,
    `Mon code marche et je ne sais pas pourquoi. Je n'y touche plus jamais. Il a peur de moi, j'ai peur de lui.`,
  ], [
    `I spent the day hunting a bug. It was a semicolon. I yelled "{w:exclaim}" in the open space.`,
    `I deployed to production on a Friday at 5:58 p.m. The weekend was intense.`,
    `My code works and I don't know why. I'll never touch it again. It's afraid of me, I'm afraid of it.`,
  ]),
  A('job_driver', '🚕', 1, { age: [20, 70], job: ['uber_driver', 'driver', 'delivery'] }, [
    `Un client a mangé {w:food} dans ma voiture. Ma banquette dégage {w:smell} depuis.`,
    `J'ai conduit un mec bourré qui m'a raconté sa vie et m'a laissé{|e} une étoile. Merci, connard.`,
    `Un couple s'est engueulé pendant toute la course. À la fin, ils m'ont demandé de trancher. J'ai donné tort aux deux.`,
  ], [
    `A passenger ate {w:food} in my car. My seat has given off {w:smell} ever since.`,
    `I drove a drunk guy who told me his life story and gave me one star. Thanks, asshole.`,
    `A couple argued the whole ride. At the end they asked me to settle it. I said they were both wrong.`,
  ]),
  A('job_driver_puke', '🤮', 2, { age: [20, 70], job: ['uber_driver', 'driver'] }, [
    `Un passager a vomi par la fenêtre ouverte. Le vent a tout ramené à l'intérieur. Sur moi. Sur la carte grise.`,
    `Une passagère a fait pipi sur ma banquette arrière en jurant que c'était {w:drink}. Ça ne sentait pas {w:drink}.`,
    `Deux passagers ont commencé à se peloter à l'arrière. J'ai mis {w:song} à fond et roulé sur tous les dos-d'âne.`,
  ], [
    `A passenger puked out the open window. The wind blew it all back inside. On me. On the registration papers.`,
    `A passenger peed on my back seat swearing it was {w:drink}. It did not smell like {w:drink}.`,
    `Two passengers started making out in the back. I blasted {w:song} and hit every speed bump.`,
  ]),
  A('job_call_center', '🎧', 1, { age: [18, 65], job: ['call_center', 'insurance_agent'] }, [
    `Un client m'a insulté{|e} pendant [[12|20|35]] minutes. J'ai dû finir par « Puis-je vous aider pour autre chose ? ».`,
    `J'ai lu le même script [[80|120|200]] fois aujourd'hui. Je le récite en dormant. Mon conjoint aussi, maintenant.`,
    `Un client m'a appelé{|e} juste pour me raconter sa journée avec {w:animal}. Pas de réclamation. Juste besoin de parler. On a parlé une heure.`,
  ], [
    `A customer insulted me for [[12|20|35]] minutes. I had to end with "Is there anything else I can help with?".`,
    `I read the same script [[80|120|200]] times today. I recite it in my sleep. So does my partner, now.`,
    `A customer called just to tell me about his day with {w:animal}. No complaint. Just needed to talk. We talked for an hour.`,
  ]),
  A('job_clown', '🤡', 2, { age: [18, 80], job: ['clown', 'mascot', 'magician'] }, [
    `Anniversaire d'enfants : un gamin m'a donné un coup de pied dans les couilles et a demandé « encore ! ». Ses parents ont applaudi.`,
    `Dans le costume, il fait 45 °C. J'ai vomi à l'intérieur de la tête de mascotte. J'ai fini le match. Personne n'a rien su.`,
    `Mon numéro de magie a raté : le lapin a chié dans le chapeau, puis sur la mariée.`,
  ], [
    `Kids' birthday: a brat kicked me in the balls and shouted "again!". His parents applauded.`,
    `It's 113°F in the costume. I puked inside the mascot head. I finished the game. Nobody ever knew.`,
    `My magic act failed: the rabbit pooped in the hat, then on the bride.`,
  ]),
  A('job_undertaker', '⚰️', 1, { age: [20, 75], job: ['undertaker', 'coroner', 'crime_cleaner'] }, [
    `Un client défunt avait demandé à être enterré avec {w:object}. On a respecté ses dernières volontés. Ça dépassait du cercueil.`,
    `J'ai entendu {w:sound} venant d'un cercueil. Les gaz. C'était les gaz. Je me le répète encore.`,
    `À un enterrement, la veuve m'a dragué{|e} entre deux sanglots. J'ai donné ma carte. Professionnelle.`,
  ], [
    `A deceased client asked to be buried with {w:object}. We honoured his last wishes. It stuck out of the coffin.`,
    `I heard {w:sound} from a coffin. Gases. It was gases. I keep telling myself.`,
    `At a funeral the widow hit on me between sobs. I gave her my card. Business card.`,
  ]),
  A('job_garbage', '🗑️', 2, { age: [18, 70], job: ['garbage_collector', 'sewer_worker', 'cleaner'] }, [
    `Un sac poubelle a éclaté sur moi. Il contenait des couches de bébé et {w:food} en décomposition depuis Pâques. J'ai la nausée depuis.`,
    `Dans les égouts, j'ai croisé un rat gros comme {w:animal}. Il m'a salué. J'ai salué.`,
    `J'ai trouvé {w:object} dans une poubelle. Je l'ai gardé. Mon salon est fait à 80 % de trouvailles.`,
  ], [
    `A garbage bag burst all over me. It held baby diapers and {w:food} rotting since Easter. I've been nauseous ever since.`,
    `In the sewers I met a rat as big as {w:animal}. It waved. I waved back.`,
    `I found {w:object} in a bin. I kept it. My living room is 80% finds.`,
  ]),
  A('job_accountant', '🧮', 0, { age: [22, 70], job: ['accountant', 'banker', 'admin'] }, [
    `J'ai trouvé une erreur de 3 centimes dans un bilan. J'ai passé la nuit dessus. Meilleure nuit de ma vie.`,
    `Mon collègue a classé un dossier à la mauvaise lettre. On ne lui parle plus.`,
    `Un client a déclaré {w:animal} comme « frais professionnels ». J'ai validé. J'admire l'audace.`,
  ], [
    `I found a 3-cent error in a balance sheet. Spent all night on it. Best night of my life.`,
    `My coworker filed a folder under the wrong letter. We no longer speak to him.`,
    `A client claimed {w:animal} as a "business expense". I approved it. I admire the audacity.`,
  ]),
  A('job_lawyer', '⚖️', 1, { age: [24, 75], job: ['lawyer', 'judge', 'prosecutor'] }, [
    `Mon client a plaidé non coupable avec du sang encore sur les chaussures. On fait avec ce qu'on a.`,
    `J'ai facturé [[14|22|31]] heures dans une journée de 24. La physique n'a pas son mot à dire.`,
    `Un témoin a juré sur la Bible puis a dit « {w:swear} » en voyant le juge. Ambiance.`,
  ], [
    `My client pleaded not guilty with blood still on his shoes. You work with what you've got.`,
    `I billed [[14|22|31]] hours in a 24-hour day. Physics has no say.`,
    `A witness swore on the Bible then said "{w:swear}" when he saw the judge. Mood.`,
  ]),
  A('job_hairdresser', '💇', 0, { age: [18, 70], job: ['hairdresser', 'barber'] }, [
    `Une cliente m'a montré une photo où posait {w:celeb} et dit « pareil ». Elle est ressortie avec une coupe qui rappelait {w:animal}.`,
    `Un client m'a raconté son divorce, sa colonoscopie et sa conviction {w:conspiracy}. En vingt minutes.`,
    `J'ai coupé une frange un peu trop courte. La cliente a pleuré. Puis elle a dit que c'était « audacieux ».`,
  ], [
    `A client showed me a photo of {w:celeb} and said "same". She left with a cut reminiscent of {w:animal}.`,
    `A client told me about his divorce, his colonoscopy and his belief {w:conspiracy}. In twenty minutes.`,
    `I cut a fringe a bit too short. The client cried. Then she called it "bold".`,
  ]),
  A('job_trades', '🔧', 2, { age: [18, 70], job: ['plumber', 'electrician', 'construction', 'mechanic'] }, [
    `Dépannage chez un client : la canalisation était bouchée par {w:gross} et un dentier. J'ai facturé le double.`,
    `J'ai pris une décharge de 220 volts. J'ai senti {w:smell} et vu mes ancêtres. Ils m'ont dit de couper le disjoncteur.`,
    `Sur le chantier, j'ai fait tomber un marteau du 3e étage. Il a atterri à vingt centimètres du chef. Il ne m'a jamais remercié de l'avoir raté.`,
  ], [
    `Call-out at a client's: the pipe was blocked by {w:gross} and a set of dentures. I charged double.`,
    `I took a 220-volt shock. I smelled {w:smell} and saw my ancestors. They told me to flip the breaker.`,
    `On site I dropped a hammer from the 3rd floor. It landed eight inches from the foreman. He never thanked me for missing.`,
  ]),
  A('job_politician', '🎙️', 2, { age: [25, 90], job: ['politician', 'diplomat'] }, [
    `J'ai serré [[400|700|1 100]] mains au marché. J'ai attrapé un rhume et une promesse de vote.`,
    `J'ai embrassé un bébé pour la photo. Il m'a vomi dessus. La photo a fait la une.`,
    `En meeting, j'ai promis {w:object} pour tous. La salle a applaudi. Je ne sais pas comment je vais faire.`,
  ], [
    `I shook [[400|700|1,100]] hands at the market. I caught a cold and a promise of a vote.`,
    `I kissed a baby for the photo. It puked on me. The photo made the front page.`,
    `At a rally I promised {w:object} for everyone. The crowd cheered. No idea how I'll pull it off.`,
  ]),
  A('job_farmer', '🐄', 2, { age: [18, 80], job: ['farmer', 'zookeeper', 'vet'] }, [
    `J'ai aidé une vache à vêler. J'avais le bras dedans jusqu'à l'épaule. Le veau est sorti. Ma dignité est restée dedans.`,
    `{w:animal} m'a craché dessus, puis m'a mordu{|e}, puis a fait caca sur ma botte. Journée normale.`,
    `J'ai glissé dans la fosse à lisier. Je dégage {w:smell} depuis trois jours, malgré [[cinq|huit|douze]] douches.`,
  ], [
    `I helped a cow give birth. Had my arm in up to the shoulder. The calf came out. My dignity stayed in.`,
    `{w:animal} spat on me, then bit me, then pooped on my boot. Normal day.`,
    `I slipped into the slurry pit. I've been giving off {w:smell} for three days, despite [[five|eight|twelve]] showers.`,
  ]),
  // ───────────── Influence ─────────────
  A('fol_hate', '📲', 1, { age: [18, 90], followers: [10000, 1e12] }, [
    `Un hater m'a écrit « {w:insult} » sous chaque post depuis un mois. C'est mon fan le plus fidèle.`,
    `J'ai posté {w:food} en photo. [[2 000|8 000|30 000]] commentaires dont la moitié me souhaitent la mort.`,
    `Une marque m'a proposé 10 000 € pour poser avec {w:object}. J'ai accepté avant la fin de la phrase.`,
  ], [
    `A hater has commented "{w:insult}" under every post for a month. My most loyal fan.`,
    `I posted a photo of {w:food}. [[2,000|8,000|30,000]] comments, half wishing me dead.`,
    `A brand offered me $10,000 to pose with {w:object}. I said yes before they finished the sentence.`,
  ]),
  A('fol_sponsor', '💰', 0, { age: [18, 90], followers: [10000, 1e12] }, [
    `Une marque m'a envoyé {w:object} gratuitement pour que j'en parle. J'ai fait une vidéo de 4 minutes. Je ne sais pas à quoi ça sert.`,
    `Partenariat avec {w:brand} : j'ai dû dire « incroyable » [[12|20|35]] fois en une vidéo.`,
    `J'ai reçu un colis envoyé par {w:brand} avec {w:gift} dedans. Mes abonnés veulent un déballage. Je l'ai déballé sept fois.`,
  ], [
    `A brand sent me {w:object} for free so I'd talk about it. I made a 4-minute video. Still don't know what it's for.`,
    `{w:brand} sponsorship: I had to say "amazing" [[12|20|35]] times in one video.`,
    `I got a package from {w:brand} with {w:gift} inside. My followers want an unboxing. I unboxed it seven times.`,
  ]),
  A('fol_recognized', '🤳', 0, { age: [18, 90], followers: [50000, 1e12] }, [
    `On m'a reconnu{|e} {w:at_place}. On m'a demandé un selfie, puis si je pouvais tenir le sac pendant qu'on va aux toilettes.`,
    `Un fan m'a offert {w:gift} avec mon visage dessus. Je l'ai remercié. J'ai eu peur.`,
    `Des ados m'ont suivi{|e} {w:at_place} en filmant. Je mangeais {w:food}. C'est devenu un mème.`,
  ], [
    `Someone recognized me {w:at_place}. They asked for a selfie, then if I could hold their bag while they used the toilet.`,
    `A fan gave me {w:gift} with my face on it. I thanked them. I was scared.`,
    `Teenagers followed me {w:at_place} filming. I was eating {w:food}. It became a meme.`,
  ]),
  A('fol_trash', '🔥', 2, { age: [18, 90], followers: [10000, 1e12] }, [
    `Mon live a planté au moment où je lâchais {w:sound}. Le clip a fait [[3|7|12]] millions de vues. Ma carrière est relancée.`,
    `J'ai fait un live bourré{|e}. J'ai insulté {w:celeb}, vomi dans un vase et vendu une gourde à mon effigie. Record de ventes.`,
    `Un « fan » m'a envoyé une photo de ses pieds avec une demande en mariage. J'ai refusé. Il m'a envoyé {w:gross}.`,
  ], [
    `My livestream froze just as I let out {w:sound}. The clip got [[3|7|12]] million views. Career revived.`,
    `I did a drunk livestream. I insulted {w:celeb}, puked into a vase and sold a water bottle with my face on it. Record sales.`,
    `A "fan" sent me a photo of their feet with a marriage proposal. I said no. They sent me {w:gross}.`,
  ]),
  A('fol_algo', '📉', 0, { age: [18, 90], followers: [10000, 1e12] }, [
    `L'algorithme m'a lâché{|e} sur {w:app}. Mes vues ont chuté de 80 %. J'ai fait une vidéo pour m'en plaindre. Elle a buzzé.`,
    `J'ai passé [[4|6|9]] heures à monter une vidéo de 30 secondes sur {w:hobby}. Elle a fait moins de vues que mon chat.`,
    `J'ai lancé une trend : {w:activity}. Une semaine plus tard, des gens se blessaient en la faisant.`,
  ], [
    `The algorithm dropped me on {w:app}. Views fell 80%. I made a video complaining about it. It went viral.`,
    `I spent [[4|6|9]] hours editing a 30-second video about {w:hobby}. It got fewer views than my cat.`,
    `I started a trend: {w:activity}. A week later people were hurting themselves doing it.`,
  ]),
  A('fol_drama', '🍿', 1, { age: [18, 90], followers: [10000, 1e12] }, [
    `Un autre influenceur m'a accusé{|e} de lui avoir volé son idée de vidéo sur {w:food}. Guerre ouverte. Mes abonnés adorent.`,
    `J'ai fait une vidéo d'excuses en pleurant, assis{|e} dans ma voiture. Je ne sais toujours pas pour quoi je m'excusais.`,
    `On a ressorti un vieux tweet de moi où je disais aimer {w:food}. Bad buzz. J'ai perdu [[2 000|10 000|40 000]] abonnés.`,
  ], [
    `Another influencer accused me of stealing their video idea about {w:food}. Open war. My followers love it.`,
    `I made a tearful apology video sitting in my car. I still don't know what I was apologizing for.`,
    `Someone dug up an old tweet where I said I liked {w:food}. Backlash. I lost [[2,000|10,000|40,000]] followers.`,
  ]),
  A('fol_fake', '🎭', 1, { age: [18, 90], followers: [10000, 1e12] }, [
    `J'ai posté une photo « au réveil, naturel{|le} » après deux heures de maquillage et [[40|80|150]] essais.`,
    `J'ai fait semblant d'être en vacances {w:far_place} avec un drap bleu et un ventilateur. Personne n'a vu la différence.`,
    `J'ai loué un jet privé une heure pour des photos. Il n'a jamais décollé. J'avais le mal de l'air quand même.`,
  ], [
    `I posted a "just woke up, natural" photo after two hours of makeup and [[40|80|150]] attempts.`,
    `I faked a holiday {w:far_place} with a blue sheet and a fan. Nobody noticed.`,
    `I rented a private jet for an hour for photos. It never took off. I still got airsick.`,
  ]),
  A('fol_dm', '💌', 2, { age: [18, 90], followers: [10000, 1e12] }, [
    `Mes DM débordent : demandes en mariage, menaces, photos de bites, et une mamie qui me demande comment cuisiner {w:food}.`,
    `{w:celeb} m'a envoyé un DM coquin à 3 h du matin. Ou c'était un faux compte. J'ai répondu quand même.`,
    `J'ai reçu [[300|900|2 000]] photos d'entrejambes cette semaine. J'ai commencé un classement. Les gagnants sont en story.`,
  ], [
    `My DMs are overflowing: proposals, threats, dick pics, and a granny asking how to cook {w:food}.`,
    `{w:celeb} sent me a flirty DM at 3 a.m. Or it was a fake account. I replied anyway.`,
    `I got [[300|900|2,000]] crotch photos this week. I started a ranking. The winners are in my story.`,
  ]),
  A('fol_burnout', '😵', 0, { age: [18, 90], followers: [10000, 1e12] }, [
    `J'ai filmé mon petit-déj, ma séance de sport et ma crise d'angoisse. Tout a été monétisé.`,
    `Je n'ai pas posté pendant 48 heures. Mes abonnés ont lancé un avis de recherche.`,
    `Mon psy m'a demandé quand j'ai vécu un moment sans le filmer pour la dernière fois. J'ai filmé ma réponse.`,
  ], [
    `I filmed my breakfast, my workout and my panic attack. All monetized.`,
    `I didn't post for 48 hours. My followers filed a missing-person report.`,
    `My therapist asked when I last lived a moment without filming it. I filmed my answer.`,
  ]),
  A('fol_merch', '👕', 1, { age: [18, 90], followers: [100000, 1e12] }, [
    `J'ai lancé ma ligne de t-shirts avec mon surnom, « {w:nickname} ». Fabriqués on ne sait où. Vendus 49 €.`,
    `Mon parfum est sorti. Il dégage {w:smell}. Rupture de stock en deux heures.`,
    `J'ai sorti une chanson. Les critiques l'ont comparée avec {w:sound}. Disque d'or quand même.`,
  ], [
    `I launched a T-shirt line with my nickname, "{w:nickname}". Made who knows where. Sold for $49.`,
    `My perfume came out. It gives off {w:smell}. Sold out in two hours.`,
    `I released a song. Critics compared it to {w:sound}. Went gold anyway.`,
  ]),
  // ───────────── Addictions ─────────────
  A('add_alcohol', '🍺', 1, { age: [18, 120], addiction: 'alcohol' }, [
    `J'ai commencé la journée avec {w:drink} « pour me réveiller ». Puis un autre « pour me calmer ». Il était 9 h 40.`,
    `J'ai caché des bouteilles dans le réservoir des toilettes, la machine à laver et {w:object}. Je ne sais plus où sont les autres.`,
    `Le caviste me fait la bise et connaît mon anniversaire. C'est un signe, mais lequel ?`,
  ], [
    `I started the day with {w:drink} "to wake up". Then another "to calm down". It was 9:40 a.m.`,
    `I've hidden bottles in the toilet tank, the washing machine and {w:object}. I can't remember where the others are.`,
    `The liquor store guy greets me with a hug and knows my birthday. It's a sign, but of what?`,
  ]),
  A('add_alcohol_trash', '🥴', 2, { age: [18, 120], addiction: 'alcohol' }, [
    `Je me suis réveillé{|e} dans mon vomi, sous la table, avec {w:animal} qui me léchait le visage. Je n'ai pas d'animal.`,
    `J'ai pissé dans le placard en croyant que c'étaient les toilettes. Les chaussures de mon conjoint ont tout pris.`,
    `Trou noir complet. D'après les photos, j'ai fini la soirée {w:at_place}, torse nu, à me battre avec {w:object}.`,
  ], [
    `I woke up in my own vomit, under the table, with {w:animal} licking my face. I don't own an animal.`,
    `I peed in the closet thinking it was the toilet. My partner's shoes took it all.`,
    `Total blackout. According to the photos I ended the night {w:at_place}, shirtless, fighting {w:object}.`,
  ]),
  A('add_tobacco', '🚬', 1, { age: [18, 120], addiction: 'tobacco' }, [
    `J'ai arrêté de fumer [[trois|cinq|douze]] fois cette semaine. Je suis très doué{|e} pour arrêter.`,
    `J'ai fumé sous la pluie, à la porte du bureau, en pantoufles. La pause clope est mon seul vrai collègue.`,
    `J'ai toussé si fort que j'ai craché un truc. On aurait dit {w:food}. J'ai rallumé une clope pour me remettre.`,
  ], [
    `I quit smoking [[three|five|twelve]] times this week. I'm very good at quitting.`,
    `I smoked in the rain outside the office in slippers. The smoke break is my only real coworker.`,
    `I coughed so hard I hacked something up. It looked like {w:food}. I lit another to recover.`,
  ]),
  A('add_tobacco_trash', '🫁', 2, { age: [18, 120], addiction: 'tobacco' }, [
    `Ma toux du matin a réveillé le voisin, le chien du voisin et un mort au cimetière d'à côté.`,
    `J'ai craché un mollard noir et collant sur le trottoir. Un pigeon l'a mangé. Il est mort. On n'en parlera plus.`,
    `Mes doigts sont jaunes, mes dents sont jaunes, mes rideaux sont jaunes. Je suis un Simpson.`,
  ], [
    `My morning cough woke the neighbour, the neighbour's dog and a corpse in the cemetery next door.`,
    `I hocked a black, sticky loogie on the sidewalk. A pigeon ate it. It died. We won't speak of it.`,
    `My fingers are yellow, my teeth are yellow, my curtains are yellow. I'm a Simpson.`,
  ]),
  A('add_drugs', '💊', 2, { age: [18, 120], addiction: 'drugs' }, [
    `Trois jours sans dormir. J'ai nettoyé tout l'appart avec une brosse à dents, puis réorganisé mes chaussettes par humeur.`,
    `J'ai vu {w:animal} me parler depuis la télé. Il m'a donné des conseils boursiers. Je les ai suivis.`,
    `J'ai saigné du nez sur {w:object} en pleine réunion. J'ai dit « allergie ». Personne n'y a cru.`,
  ], [
    `Three days without sleep. I cleaned the whole flat with a toothbrush, then sorted my socks by mood.`,
    `I saw {w:animal} talking to me from the TV. It gave me stock tips. I followed them.`,
    `My nose bled onto {w:object} mid-meeting. I said "allergies". Nobody bought it.`,
  ]),
  A('add_drugs_soft', '🌫️', 1, { age: [18, 120], addiction: 'drugs' }, [
    `Mon dealer m'envoie des vœux d'anniversaire. Mon propre frère, non.`,
    `J'ai promis d'arrêter {w:time}. J'ai tenu jusqu'à la pause déj.`,
    `J'ai passé la journée à fixer {w:object} en ayant l'impression qu'il comprenait mes problèmes.`,
  ], [
    `My dealer sends me birthday wishes. My own brother doesn't.`,
    `I promised to quit {w:time}. I lasted until lunch.`,
    `I spent the day staring at {w:object}, feeling like it understood my problems.`,
  ]),
  A('add_gambling', '🎰', 1, { age: [18, 120], addiction: 'gambling' }, [
    `J'ai parié sur une course de chevaux. J'ai perdu. Mon cheval s'est arrêté pour brouter.`,
    `J'ai joué le loyer au casino en ligne {w:time}. J'ai gagné le double. Puis j'ai tout reperdu en dix minutes.`,
    `Je connais par cœur les résultats de la 3e division moldave. J'ai misé sur tous les matchs.`,
  ], [
    `I bet on a horse race. I lost. The horse stopped to graze.`,
    `I gambled the rent at an online casino {w:time}. Doubled it. Then lost it all in ten minutes.`,
    `I know the Moldovan third division results by heart. I bet on every match.`,
  ]),
  A('add_gambling2', '🃏', 2, { age: [18, 120], addiction: 'gambling' }, [
    `J'ai misé {w:object} au poker. Puis ma montre. Puis mon slip. Je suis rentré{|e} à poil {w:weather}.`,
    `J'ai parié que je pouvais manger {w:food} en une minute. J'ai gagné 50 €. J'ai vomi pour 200 € de frais de pressing.`,
    `J'ai emprunté de l'argent à un type qui s'appelle « {w:nickname} ». Il m'a montré une pince coupante en souriant.`,
  ], [
    `I bet {w:object} at poker. Then my watch. Then my underwear. I walked home naked {w:weather}.`,
    `I bet I could eat {w:food} in a minute. Won $50. Puked up $200 in dry-cleaning fees.`,
    `I borrowed money from a guy called "{w:nickname}". He showed me bolt cutters with a smile.`,
  ]),
  A('add_gambling_scratch', '🎟️', 0, { age: [18, 120], addiction: 'gambling' }, [
    `J'ai gratté [[30|60|100]] tickets aujourd'hui. Le buraliste m'a offert une chaise.`,
    `J'ai mis une pièce dans la machine à sous « juste pour voir ». J'ai vu le lever du soleil.`,
    `J'ai parié sur la météo de demain. Résultat : {w:weather}. J'avais misé sur l'inverse.`,
  ], [
    `I scratched [[30|60|100]] tickets today. The shopkeeper offered me a chair.`,
    `I put a coin in the slot machine "just to see". I saw the sunrise.`,
    `I bet on tomorrow's weather. Result: {w:weather}. I'd bet on the opposite.`,
  ]),
  // ───────────── Propriétaires ─────────────
  A('as_car', '🚗', 0, { age: [18, 120], asset: 'car' }, [
    `J'ai lavé ma voiture. Une heure plus tard, je roulais {w:weather}. Un pigeon a fini le travail.`,
    `J'ai trouvé {w:object} sous le siège de ma voiture. Je ne l'ai jamais vu de ma vie.`,
    `Ma voiture fait {w:sound} quand je tourne à gauche. Je ne tourne plus qu'à droite.`,
  ], [
    `I washed my car. An hour later I was driving {w:weather}. A pigeon finished the job.`,
    `I found {w:object} under my car seat. Never seen it in my life.`,
    `My car makes {w:sound} when I turn left. I now only turn right.`,
  ]),
  A('as_car_parking', '🅿️', 1, { age: [18, 120], asset: 'car' }, [
    `J'ai tourné [[25|40|70]] minutes pour me garer. J'ai fini sur une place handicapé, avec honte et une amende.`,
    `Quelqu'un a rayé ma portière et laissé un mot : « {w:insult} ». Pas de numéro.`,
    `Ma voiture s'est fait embarquer par la fourrière. J'ai payé plus que ce qu'elle vaut pour la récupérer.`,
  ], [
    `I circled for [[25|40|70]] minutes to park. Ended up in a disabled spot, with shame and a ticket.`,
    `Someone keyed my door and left a note: "{w:insult}". No number.`,
    `My car got towed. I paid more than it's worth to get it back.`,
  ]),
  A('as_car_trash', '🚙', 2, { age: [18, 120], asset: 'car' }, [
    `J'ai roulé sur un hérisson. Le bruit, le splotch, les piquants dans le pneu. J'ai pleuré au volant pendant trois kilomètres.`,
    `En été, une cuisse de poulet oubliée a fermenté sous mon siège. Ma voiture sent le charnier.`,
    `J'ai fait l'amour dans ma voiture sur un parking. Un vigile a toqué à la vitre avec une lampe torche et un sourire.`,
  ], [
    `I ran over a hedgehog. The sound, the splat, the quills in the tire. I cried at the wheel for two miles.`,
    `Over the summer a forgotten chicken leg fermented under my seat. My car smells like a mass grave.`,
    `I had sex in my car in a parking lot. A security guard knocked on the window with a flashlight and a grin.`,
  ]),
  A('as_car_road', '🛣️', 0, { age: [18, 120], asset: 'car' }, [
    `Contrôle technique : [[11|17|23]] défauts. Le contrôleur m'a demandé si je roulais avec par conviction.`,
    `J'ai fait le plein. J'ai regardé le prix. J'ai poussé la voiture jusqu'à la maison par principe.`,
    `J'ai chanté {w:song} à tue-tête dans ma voiture au feu rouge. Le conducteur d'à côté filmait.`,
  ], [
    `Vehicle inspection: [[11|17|23]] faults. The inspector asked if I drove it out of conviction.`,
    `I filled up. I looked at the price. I pushed the car home on principle.`,
    `I sang {w:song} at the top of my lungs at a red light. The driver next to me was filming.`,
  ]),
  A('as_car_kids', '🚸', 2, { age: [25, 120], asset: 'car', has: 'child' }, [
    `[[Six|Huit|Onze]] heures de route avec les enfants : « on arrive quand ? » toutes les quatre minutes. J'ai pensé à les vendre.`,
    `Un enfant a vomi {w:food} sur la banquette arrière. L'autre a vomi en voyant le premier. Effet domino.`,
    `J'ai retrouvé une frite fossilisée et {w:object} dans le siège auto. Archéologie familiale.`,
  ], [
    `[[Six|Eight|Eleven]] hours on the road with the kids: "are we there yet?" every four minutes. I considered selling them.`,
    `One kid puked {w:food} on the back seat. The other puked at the sight. Domino effect.`,
    `I found a fossilized fry and {w:object} in the car seat. Family archaeology.`,
  ]),
  A('as_house', '🏠', 0, { age: [18, 120], asset: 'house' }, [
    `La chaudière a lâché {w:weather}. Le chauffagiste viendra « entre lundi et l'été prochain ».`,
    `J'ai découvert {w:animal} qui vivait dans mon grenier. Il paie moins de taxe foncière que moi.`,
    `Le toit fuit au-dessus du lit. J'ai mis {w:object} pour récupérer l'eau. Ça fait {w:sound} toute la nuit.`,
  ], [
    `The boiler died {w:weather}. The heating guy will come "between Monday and next summer".`,
    `I discovered {w:animal} living in my attic. It pays less property tax than I do.`,
    `The roof leaks over the bed. I put {w:object} out to catch the water. It goes {w:sound} all night.`,
  ]),
  A('as_house_reno', '🏗️', 1, { age: [18, 120], asset: 'house' }, [
    `Les travaux de la cuisine devaient durer trois semaines. On en est à [[cinq|huit|quatorze]] mois. L'artisan ne répond plus.`,
    `En cassant un mur, j'ai trouvé un journal de 1953 et {w:object}. Je n'ai pas osé chercher plus loin.`,
    `J'ai payé un artisan pour refaire la salle de bain. Il a posé le carrelage à l'envers. Comment ? Mystère, bordel.`,
  ], [
    `The kitchen remodel was supposed to take three weeks. We're at [[five|eight|fourteen]] months. The contractor has gone dark.`,
    `Knocking down a wall I found a 1953 newspaper and {w:object}. I didn't dare dig further.`,
    `I paid a guy to redo the bathroom. He laid the tiles upside down. How? Fucking mystery.`,
  ]),
  A('as_house_trash', '🐀', 2, { age: [18, 120], asset: 'house' }, [
    `La fosse septique a débordé dans le jardin. Les voisins ont appelé la mairie, puis un exorciste.`,
    `J'ai trouvé un rat mort dans le mur. À l'odeur. Après deux semaines. Il était devenu liquide.`,
    `Les canalisations ont refoulé pendant la fête de mes 40 ans. Il y avait du caca jusqu'au buffet. On a déménagé la fête dans le jardin.`,
  ], [
    `The septic tank overflowed into the garden. The neighbours called the town hall, then an exorcist.`,
    `I found a dead rat in the wall. By the smell. After two weeks. It had gone liquid.`,
    `The pipes backed up during my 40th birthday party. Poop reached the buffet. We moved the party to the garden.`,
  ]),
  A('as_house_garden', '🌳', 1, { age: [18, 120], asset: 'house' }, [
    `J'ai passé le week-end à tondre, tailler et désherber. Lundi, le jardin avait l'air exactement pareil.`,
    `Le voisin a installé un nain de jardin face à ma fenêtre. Je lui ai répondu avec {w:object}. Guerre froide.`,
    `J'ai organisé une crémaillère. Les invités ont cassé {w:object} et vomi dans les hortensias. Ils ont adoré.`,
  ], [
    `Spent the weekend mowing, trimming and weeding. On Monday the garden looked exactly the same.`,
    `The neighbour put a garden gnome facing my window. I replied with {w:object}. Cold war.`,
    `I threw a housewarming. The guests broke {w:object} and puked in the hydrangeas. They loved it.`,
  ]),
  A('as_house_mortgage', '🏦', 1, { age: [18, 120], asset: 'house' }, [
    `J'ai calculé que je finirai de payer la maison à [[87|92|104]] ans. Le banquier a dit « super, on signe ».`,
    `Ma taxe foncière a encore augmenté. J'ai crié « {w:swear} » dans le jardin. Le voisin a crié la même chose.`,
    `Propriétaire depuis un an : je connais le prix de chaque vis chez Leroy Merlin et le prénom du vendeur.`,
  ], [
    `I calculated I'll finish paying off the house at [[87|92|104]]. The banker said "great, let's sign".`,
    `My property tax went up again. I yelled "{w:swear}" in the garden. The neighbour yelled the same.`,
    `Homeowner for a year: I know the price of every screw at the hardware store and the salesman's first name.`,
  ]),
  // ───────────── Trash divers ─────────────
  A('add_alcohol_aa', '🍾', 2, { age: [25, 120], addiction: 'alcohol' }, [
    `Réunion des Alcooliques Anonymes : j'ai apporté {w:drink} « pour l'ambiance ». On m'a raccompagné{|e} à la porte. Gentiment.`,
    `Mon foie m'a envoyé une lettre de démission. Il a mis mes reins en copie.`,
    `Ma tension a explosé et mon nez est devenu violet. Les enfants du quartier m'appellent {w:nickname}.`,
  ], [
    `AA meeting: I brought {w:drink} "for the vibe". They walked me to the door. Gently.`,
    `My liver sent me a resignation letter. It cc'd my kidneys.`,
    `My blood pressure exploded and my nose turned purple. The neighbourhood kids call me {w:nickname}.`,
  ]),
  A('sneeze_disaster', '🤧', 2, { age: [18, 120] }, [
    `J'ai éternué en pleine réunion. Une stalactite de morve est restée accrochée à mon menton pendant que je présentais les chiffres.`,
    `J'ai éternué sur {w:food} juste avant de le servir. Personne n'a rien vu. Bon appétit à tous.`,
    `J'ai éternué si fort qu'un vaisseau a pété dans mon œil. J'ai l'air possédé{|e} depuis trois jours.`,
  ], [
    `I sneezed mid-meeting. A snot stalactite hung from my chin while I presented the numbers.`,
    `I sneezed on {w:food} right before serving it. Nobody saw. Enjoy, everyone.`,
    `I sneezed so hard a blood vessel burst in my eye. I've looked possessed for three days.`,
  ]),
  A('public_toilet', '🚻', 2, { age: [18, 120] }, [
    `Les toilettes {w:at_place} ressemblaient à une scène de crime. Il y avait du caca sur le plafond. LE PLAFOND.`,
    `Dans des toilettes publiques, le mec de la cabine d'à côté m'a demandé du papier. Puis mon prénom. Puis mon numéro.`,
    `J'ai fait pipi dans un urinoir en face de mon ancien prof de maths. Il a dit « {w:exclaim} ». Je ne sais pas comment le prendre.`,
  ], [
    `The bathroom {w:at_place} looked like a crime scene. There was poop on the ceiling. THE CEILING.`,
    `In a public restroom, the guy in the next stall asked for paper. Then my name. Then my number.`,
    `I peed at a urinal next to my old math teacher. He said "{w:exclaim}". Not sure how to take it.`,
  ]),
  A('fart_elevator', '💨', 2, { age: [18, 120] }, [
    `J'ai lâché une caisse silencieuse mais mortelle dans l'ascenseur. Une dame est entrée au 3e. Elle a prié jusqu'au 8e.`,
    `Pendant un rendez-vous important, j'ai voulu péter discrètement. Ce n'était pas qu'un pet. J'ai dû partir en marchant en crabe.`,
    `J'ai pété au cinéma pendant {w:movie}. Toute la rangée a changé de place. J'avais la meilleure vue.`,
  ], [
    `I let out a silent-but-deadly in the elevator. A lady got in on 3. She prayed until 8.`,
    `During an important meeting I tried to fart discreetly. It wasn't just a fart. I had to leave walking like a crab.`,
    `I farted at the cinema during {w:movie}. The whole row moved. Best view in the house.`,
  ]),
  A('gore_kitchen', '🔪', 2, { age: [18, 120] }, [
    `En coupant {w:food}, j'ai tranché le bout de mon doigt. Il a rebondi dans la poêle. J'ai mangé la suite en pleurant.`,
    `La mandoline m'a pris un morceau de pouce. Le sang a giclé sur le carrelage comme un tableau de Pollock. J'ai pris une photo.`,
    `J'ai ouvert une boîte de conserve avec un couteau. Il y a eu du sang, des cris et {w:food} partout. Je n'ai toujours pas mangé.`,
  ], [
    `Slicing {w:food}, I cut off my fingertip. It bounced into the pan. I ate the rest crying.`,
    `The mandoline took a chunk of my thumb. Blood sprayed across the tiles like a Pollock. I took a photo.`,
    `I opened a can with a knife. There was blood, screaming and {w:food} everywhere. I still haven't eaten.`,
  ]),
  A('gore_lawnmower', '🩸', 2, { age: [25, 120] }, [
    `La tondeuse a aspiré ma chaussure. J'ai récupéré la chaussure. Pas le petit orteil. Le jardin est plus vert à cet endroit.`,
    `J'ai tondu un nid de guêpes. Elles m'ont piqué{|e} [[40|70|120]] fois. Je ressemble à un ballon de baudruche.`,
    `Le taille-haie m'a échappé des mains. Il a décapité un nain de jardin et un peu mon oreille. Le nain s'en est mieux remis.`,
  ], [
    `The lawnmower sucked in my shoe. I got the shoe back. Not the pinky toe. The grass is greener there.`,
    `I mowed over a wasps' nest. They stung me [[40|70|120]] times. I look like a party balloon.`,
    `The hedge trimmer slipped. It decapitated a garden gnome and a bit of my ear. The gnome recovered better.`,
  ]),
  A('gym_gore', '🏋️', 2, { age: [18, 70] }, [
    `J'ai lâché un haltère sur mon pied. L'ongle a giclé à deux mètres et s'est collé au miroir. Personne ne l'a enlevé.`,
    `À la salle, un mec a fait tellement d'efforts qu'il a vomi dans la fontaine à eau. On a tous continué à boire. Enfin, pas moi.`,
    `J'ai fait un squat trop lourd et j'ai entendu {w:sound} venant de mon genou. Il plie maintenant dans les deux sens.`,
  ], [
    `I dropped a dumbbell on my foot. The toenail shot six feet and stuck to the mirror. Nobody removed it.`,
    `At the gym a guy strained so hard he puked into the water fountain. Everyone kept drinking. Well, not me.`,
    `I squatted too heavy and heard {w:sound} from my knee. It now bends both ways.`,
  ]),
  A('pimple', '🌋', 2, { age: [18, 60] }, [
    `J'ai percé un bouton dans le miroir de la salle de bain. Le jet a atteint le miroir, le lavabo et la brosse à dents de mon coloc.`,
    `Un point noir géant sur mon nez. Je l'ai pressé. Il en est sorti un ver de pus interminable.`,
    `J'ai un furoncle sur la fesse qui a son propre code postal. Je l'appelle {w:nickname}.`,
  ], [
    `I popped a zit in the bathroom mirror. The jet hit the mirror, the sink and my flatmate's toothbrush.`,
    `A giant blackhead on my nose. I squeezed it. A worm of pus came out, a very long one.`,
    `I have a boil on my butt with its own zip code. I call it {w:nickname}.`,
  ]),
  A('earwax', '👂', 2, { age: [18, 120] }, [
    `L'ORL m'a retiré un bouchon de cérumen gros comme {w:food}. Il l'a mis dans un bocal. Il veut l'exposer.`,
    `J'ai nettoyé mes oreilles avec {w:object}. J'ai trouvé un truc orange. Puis un autre. J'ai arrêté, par peur de trouver mon cerveau.`,
    `Je me suis curé l'oreille au bureau. Ma collègue a vu le résultat. Elle a changé de bureau.`,
  ], [
    `The ENT removed an earwax plug as big as {w:food}. He put it in a jar. He wants to exhibit it.`,
    `I cleaned my ears with {w:object}. Found something orange. Then another. I stopped, afraid I'd find my brain.`,
    `I dug in my ear at the office. My coworker saw the result. She moved desks.`,
  ]),
  A('foot_fungus', '🦶', 2, { age: [18, 120] }, [
    `Mes pieds dégagent {w:smell}. J'ai enlevé mes chaussures chez des amis. Le chat s'est évanoui.`,
    `J'ai une mycose entre les orteils qui a changé de couleur trois fois cette semaine. Elle a l'air de s'amuser.`,
    `J'ai retiré mes chaussettes après une journée {w:weather}. Elles sont restées debout toutes seules.`,
  ], [
    `My feet give off {w:smell}. I took off my shoes at friends'. The cat fainted.`,
    `I have a fungus between my toes that changed colour three times this week. It seems to be having fun.`,
    `I took off my socks after a day {w:weather}. They stayed standing on their own.`,
  ]),
  A('diarrhea_date', '🧻', 2, { age: [18, 60] }, [
    `Premier rendez-vous, crampe intestinale au dessert. J'ai couru aux toilettes. Il y avait une file. J'ai couru plus loin. Pas assez loin.`,
    `Chiasse foudroyante pendant un entretien d'embauche. J'ai serré les fesses, souri et répondu sur ma « gestion du stress ».`,
    `J'ai mangé {w:food} dont la date limite remontait à 2021. Mes toilettes ont demandé un arrêt maladie.`,
  ], [
    `First date, intestinal cramp at dessert. I ran to the toilet. There was a line. I ran further. Not far enough.`,
    `Explosive diarrhoea during a job interview. I clenched, smiled and answered questions on my "stress management".`,
    `I ate {w:food} that expired in 2021. My toilet asked for sick leave.`,
  ]),
  A('sex_noise_neighbors', '🛏️', 2, { age: [18, 70] }, [
    `Les voisins font l'amour tous les soirs à 22 h 15. Le lit tape contre le mur sur le rythme de {w:song}. J'ai fini par apprécier.`,
    `On a fait l'amour si fort que les voisins ont glissé un mot : « Bravo. Mais pas le mardi. »`,
    `Le voisin du dessus crie « {w:exclaim} » à chaque orgasme. Toute la résidence le sait. Le gardien aussi le dit maintenant.`,
  ], [
    `The neighbours have sex every night at 10:15. The bed bangs the wall in time to {w:song}. I've come to enjoy it.`,
    `We had sex so loudly the neighbours left a note: "Well done. But not on Tuesdays."`,
    `The upstairs neighbour yells "{w:exclaim}" every time he finishes. The whole building knows. Now the caretaker says it too.`,
  ]),
  A('sex_toy_found', '🔌', 2, { age: [25, 120] }, [
    `Ma mère est venue faire le ménage chez moi. Elle a trouvé un objet vibrant dans le tiroir. Elle l'a rangé avec les fouets de cuisine.`,
    `Mon sextoy s'est allumé tout seul pendant le repas de famille. Il vibrait sur le parquet de la chambre comme {w:animal}.`,
    `Le douanier a ouvert ma valise devant toute la file. Il a sorti un truc rose. Il a dit « {w:exclaim} ». J'ai dit « cadeau ».`,
  ], [
    `My mom came to clean my place. She found a vibrating object in the drawer. She put it away with the kitchen whisks.`,
    `My sex toy switched on by itself during family dinner. It buzzed across the bedroom floor like {w:animal}.`,
    `The customs officer opened my suitcase in front of the whole line. He pulled out something pink. He said "{w:exclaim}". I said "gift".`,
  ]),
  A('nudist_beach', '🍑', 2, { age: [25, 90] }, [
    `Je me suis trompé{|e} de plage. Elle était naturiste. Un monsieur de 80 ans m'a demandé l'heure, les mains sur les hanches.`,
    `Plage naturiste : j'ai attrapé un coup de soleil à des endroits qui ne voient jamais le jour. Je marche comme un cow-boy.`,
    `Au camping naturiste, la partie de volley était un spectacle de balancements que je n'oublierai jamais.`,
  ], [
    `I went to the wrong beach. It was nudist. An 80-year-old man asked me the time, hands on hips.`,
    `Nudist beach: I got sunburned in places that never see daylight. I walk like a cowboy.`,
    `At the nudist campsite, the volleyball game was a swinging spectacle I'll never forget.`,
  ]),
  A('vomit_transport', '🤮', 2, { age: [18, 120] }, [
    `Dans le train, l'enfant d'en face m'a vomi {w:food} sur les genoux. Sa mère m'a tendu un mouchoir. Un seul.`,
    `Mal de mer sur le ferry : j'ai vomi par-dessus bord. Le vent a renvoyé le tout sur le pont supérieur. Sur un mariage.`,
    `J'ai gerbé dans un sac en papier dans l'avion. Le sac a cédé. Mon voisin a eu un surclassement. Pas moi.`,
  ], [
    `On the train, the kid opposite puked {w:food} into my lap. His mom handed me a tissue. One.`,
    `Seasick on the ferry: I puked over the side. The wind blew it all onto the upper deck. Onto a wedding.`,
    `I barfed into a paper bag on the plane. The bag gave way. My neighbour got an upgrade. I didn't.`,
  ]),
  A('hospital_gown', '🏥', 2, { age: [18, 120] }, [
    `Aux urgences depuis [[6|9|12]] heures. Le mec à côté de moi saigne du crâne et mange {w:food}. On est devenus amis.`,
    `On m'a posé une sonde urinaire. J'ai vu le plafond, puis Dieu, puis l'interne qui rigolait.`,
    `J'ai fait une coloscopie. L'anesthésie m'a fait dire à l'infirmier qu'il avait « un cul de star ». Il a noté ça dans mon dossier.`,
  ], [
    `In the ER for [[6|9|12]] hours. The guy next to me is bleeding from the head and eating {w:food}. We're friends now.`,
    `They put in a urinary catheter. I saw the ceiling, then God, then the intern laughing.`,
    `I had a colonoscopy. The anaesthesia made me tell the nurse he had "a celebrity butt". He wrote it in my file.`,
  ]),
  A('swear_traffic', '🤬', 2, { age: [18, 120] }, [
    `Un cycliste m'a frôlé{|e} et hurlé « {w:insult} ». Je lui ai hurlé « {w:swear} ». On s'est retrouvés au feu rouge suivant. Malaise.`,
    `J'ai klaxonné une voiture au feu. Le conducteur est descendu. Il faisait deux mètres. J'ai fait semblant d'être mort{|e}.`,
    `J'ai insulté un scooter pendant trois rues. C'était mon père.`,
  ], [
    `A cyclist cut me off yelling "{w:insult}". I yelled "{w:swear}" back. We met again at the next red light. Awkward.`,
    `I honked at a car at the light. The driver got out. He was seven feet tall. I played dead.`,
    `I cursed out a scooter for three blocks. It was my dad.`,
  ]),
  A('dog_poop', '💩', 2, { age: [18, 120] }, [
    `J'ai marché dans une crotte de chien pieds nus en sortant de la piscine. Elle était tiède. Je n'ai pas récupéré.`,
    `J'ai ramassé la crotte de mon chien avec un sac troué. Un passant a applaudi ma bravoure.`,
    `Un chien a chié devant moi en me regardant droit dans les yeux. Son maître a dit « {w:exclaim} » et s'est enfui.`,
  ], [
    `I stepped in dog poop barefoot coming out of the pool. It was warm. I have not recovered.`,
    `I picked up my dog's poop with a bag that had a hole. A passer-by applauded my bravery.`,
    `A dog pooped in front of me while staring me straight in the eye. Its owner said "{w:exclaim}" and fled.`,
  ]),
  A('bird_poop_rich', '🦅', 2, { age: [25, 120], money: [1e6, 1e15] }, [
    `Une mouette a chié sur mon costume à 12 000 €. J'ai fait abattre la mouette... en photo. Pour mon avocat.`,
    `J'ai vomi du caviar par-dessus le bastingage de mon yacht. Les poissons ont mangé mieux que la plupart des gens.`,
    `Mon chef privé a préparé {w:food} à la feuille d'or. J'ai chié des paillettes pendant trois jours.`,
  ], [
    `A seagull shat on my $12,000 suit. I had the seagull shot... on camera. For my lawyer.`,
    `I puked caviar over the side of my yacht. The fish ate better than most people.`,
    `My private chef made {w:food} with gold leaf. I pooped glitter for three days.`,
  ]),
  A('poor_trash', '🪙', 2, { age: [20, 120], money: [-1e12, 1000] }, [
    `J'ai volé du papier toilette dans les toilettes du McDo. Trois rouleaux. Dans mon pantalon. J'ai marché comme un pingouin jusqu'à chez moi.`,
    `Mon appart est tellement humide que les champignons du mur sont comestibles. J'en ai fait une omelette. J'ai vu des couleurs.`,
    `J'ai vendu mon sang, mes cheveux et presque un rein. L'acheteur du rein a annulé : « trop d'alcool dedans ».`,
  ], [
    `I stole toilet paper from the McDonald's restroom. Three rolls. In my trousers. I waddled home like a penguin.`,
    `My flat is so damp the wall mushrooms are edible. I made an omelette. I saw colours.`,
    `I sold my blood, my hair and nearly a kidney. The kidney buyer cancelled: "too much booze in it".`,
  ]),
  A('kids_questions_trash', '👶', 2, { age: [25, 60], has: 'child' }, [
    `Mon enfant a demandé à voix haute dans le bus pourquoi le monsieur d'à côté dégageait {w:smell}. Le monsieur a répondu.`,
    `Mon gamin a trouvé une capote usagée au parc et l'a gonflée comme un ballon. Je l'ai désinfecté à la javel. Le gamin, pas le ballon.`,
    `Mon enfant a raconté à la maîtresse que papa et maman font des bruits « comme {w:animal} » la nuit. Convocation lundi.`,
  ], [
    `My kid asked loudly on the bus why the man next to us gave off {w:smell}. The man answered.`,
    `My kid found a used condom at the park and blew it up like a balloon. I disinfected him with bleach. The kid, not the balloon.`,
    `My kid told the teacher that mom and dad make noises "like {w:animal}" at night. Meeting on Monday.`,
  ]),
  A('wedding_night_trash', '💒', 2, { age: [20, 70], has: 'spouse' }, [
    `Nuit de noces : on était tellement bourrés qu'on s'est endormis dans la baignoire de l'hôtel, en robe et en costume, avec {w:food}.`,
    `Pour notre anniversaire de mariage, on a ressorti le costume d'infirmière. Il ne ferme plus. On a ri jusqu'aux crampes.`,
    `Mon conjoint m'a réveillé{|e} avec une surprise coquine. J'ai cru à un cambriolage et je lui ai mis un coup de lampe de chevet.`,
  ], [
    `Wedding night: we were so drunk we fell asleep in the hotel bathtub, in dress and suit, with {w:food}.`,
    `For our anniversary we dug out the nurse costume. It doesn't close anymore. We laughed till we cramped.`,
    `My spouse woke me with a naughty surprise. I thought it was a burglary and whacked them with the bedside lamp.`,
  ]),
  A('waxing', '🕯️', 2, { age: [18, 70] }, [
    `Épilation du maillot à la cire. J'ai hurlé « {w:swear} » si fort que l'esthéticienne d'à côté a lâché sa pince.`,
    `J'ai voulu m'épiler les fesses tout{|e} seul{|e} avec de la cire chaude. Le chat est resté collé. Pas longtemps.`,
    `Le rasoir a glissé pendant que je me rasais là en bas. Sang, panique, pansement. Je marche bizarrement depuis.`,
  ], [
    `Bikini wax. I screamed "{w:swear}" so loud the beautician next door dropped her tweezers.`,
    `I tried waxing my own butt with hot wax. The cat got stuck to it. Not for long.`,
    `The razor slipped while I was shaving down there. Blood, panic, band-aid. I've been walking funny since.`,
  ]),
  A('gyno_uro', '🩺', 2, { age: [20, 90] }, [
    `Chez le médecin, j'ai dû montrer mon intimité à un interne de 23 ans. Il a dit « intéressant ». J'ai pleuré dans la voiture.`,
    `Analyse de selles : j'ai dû faire caca dans un petit pot. J'ai raté le pot. Deux fois.`,
    `Le docteur a enfilé un gant, l'a fait claquer et a dit « on y va ». Je n'étais pas prêt{|e}. On n'est jamais prêt{|e}.`,
  ], [
    `At the doctor's I had to show my privates to a 23-year-old intern. He said "interesting". I cried in the car.`,
    `Stool sample: I had to poop into a little pot. I missed. Twice.`,
    `The doctor put on a glove, snapped it and said "here we go". I wasn't ready. You're never ready.`,
  ]),
  A('lice', '🪲', 2, { age: [25, 60], has: 'child' }, [
    `Les enfants ont ramené des poux. Maintenant toute la famille en a. Même le chien. Même mon conjoint chauve.`,
    `J'ai passé la soirée à écraser des poux entre mes ongles en regardant {w:show}. Ça fait un petit bruit satisfaisant.`,
    `Épidémie de vers intestinaux à l'école. On a tous pris le traitement. Le lendemain, les toilettes étaient un film d'horreur.`,
  ], [
    `The kids brought home lice. Now the whole family has them. Even the dog. Even my bald partner.`,
    `I spent the evening crushing lice between my nails while watching {w:show}. It makes a satisfying little pop.`,
    `Pinworm outbreak at school. We all took the treatment. The next day the toilet was a horror movie.`,
  ]),
  A('bbq_gore', '🔥', 2, { age: [25, 90] }, [
    `L'oncle a voulu ranimer le barbecue avec de l'essence. Boule de feu. Il a perdu ses sourcils, sa moustache et un peu de son ego.`,
    `Au barbecue, une guêpe est entrée dans ma canette. Je l'ai bue. Elle m'a piqué la langue. J'ai parlé comme {w:animal} pendant trois jours.`,
    `La saucisse a explosé sur le grill et m'a brûlé le menton. J'ai une cicatrice en forme de point d'exclamation. Ça me va bien.`,
  ], [
    `My uncle tried reviving the barbecue with gasoline. Fireball. He lost his eyebrows, his moustache and a bit of his ego.`,
    `At the barbecue a wasp got into my can. I drank it. It stung my tongue. I talked like {w:animal} for three days.`,
    `A sausage exploded on the grill and burned my chin. I have an exclamation-mark scar. It suits me.`,
  ]),
  A('christmas_family', '🎄', 2, { age: [18, 120] }, [
    `Repas de Noël : l'oncle bourré a parlé politique, la tante a pleuré, mamie a lâché un pet monumental pendant le bénédicité.`,
    `À Noël, j'ai offert {w:gift} à tout le monde. Même cadeau. Personne n'a apprécié l'ironie.`,
    `La dinde était crue au milieu. Toute la famille a eu la chiasse le 26. Les toilettes ont connu leur pire Noël.`,
  ], [
    `Christmas dinner: drunk uncle talked politics, auntie cried, grandma dropped a monumental fart during grace.`,
    `For Christmas I gave everyone {w:gift}. Same gift. Nobody appreciated the irony.`,
    `The turkey was raw in the middle. The whole family had the runs on the 26th. The toilet had its worst Christmas.`,
  ]),
  A('new_year_trash', '🎆', 2, { age: [18, 70] }, [
    `Réveillon : j'ai embrassé un inconnu à minuit. À minuit cinq, il m'a vomi dessus. Bonne année quand même.`,
    `Un pétard m'a explosé dans la main au Nouvel An. J'ai encore cinq doigts, mais plus d'empreintes digitales. Ça peut servir.`,
    `Résolution de l'année : arrêter {w:food}. Tenue jusqu'au 1er janvier, 14 h 07.`,
  ], [
    `New Year's Eve: I kissed a stranger at midnight. At five past, he puked on me. Happy new year anyway.`,
    `A firecracker went off in my hand at New Year. Still five fingers, but no fingerprints. Could come in handy.`,
    `New Year's resolution: give up {w:food}. Lasted until January 1st, 2:07 p.m.`,
  ]),
  A('therapy', '🛋️', 2, { age: [20, 90] }, [
    `Mon psy m'a demandé de parler de ma mère. J'ai parlé uniquement de mon conflit avec {w:animal} pendant 50 minutes. Il a dit « on progresse ».`,
    `Pendant ma séance de psy, j'ai pleuré, ri, et lâché un pet. Le psy a noté « libération ».`,
    `J'ai payé 80 € pour qu'un psy me dise que mon problème, c'est que je me laisse marcher dessus. Il m'a demandé de payer en liquide.`,
  ], [
    `My therapist asked me to talk about my mother. I talked only about my feud with {w:animal} for 50 minutes. He said "we're making progress".`,
    `During therapy I cried, laughed and farted. The shrink wrote "release".`,
    `I paid $80 for a shrink to tell me my problem is I let people walk all over me. He asked for cash.`,
  ]),
  A('massage_fail', '💆', 2, { age: [25, 90] }, [
    `Massage relaxant : je me suis détendu{|e} au point de péter sur la masseuse. Elle a continué. Une pro.`,
    `Le masseur m'a demandé si je voulais « la totale ». J'ai dit oui sans comprendre. Il m'a épilé les sourcils.`,
    `Au spa, quelqu'un a fait pipi dans le jacuzzi. Je l'ai su parce que c'était moi.`,
  ], [
    `Relaxing massage: I relaxed so much I farted on the masseuse. She kept going. A pro.`,
    `The masseur asked if I wanted "the full works". I said yes without understanding. He plucked my eyebrows.`,
    `At the spa someone peed in the jacuzzi. I know because it was me.`,
  ]),
  A('hiking', '🥾', 2, { age: [20, 80] }, [
    `Randonnée en montagne {w:weather}. Envie pressante au sommet. J'ai utilisé une feuille d'ortie. Erreur. Grosse erreur.`,
    `J'ai fait caca dans la nature et je me suis essuyé{|e} avec {w:object}. Ça m'a semblé une bonne idée sur le moment.`,
    `En rando, une tique s'est installée à un endroit très intime. On l'a appelée {w:nickname}.`,
  ], [
    `Mountain hike {w:weather}. Nature called at the summit. I used a nettle leaf. Mistake. Big mistake.`,
    `I pooped in the wild and wiped with {w:object}. It seemed like a good idea at the time.`,
    `Hiking, a tick settled somewhere very intimate. We named it {w:nickname}.`,
  ]),
  A('hair_in_food', '🦱', 2, { age: [18, 120] }, [
    `J'ai trouvé un long poil frisé dans {w:food} {w:at_place}. Le serveur a dit « c'est la maison qui offre ». J'ai pas demandé quoi.`,
    `J'ai mâché quelque chose de croquant dans ma salade. C'était un ongle. Pas le mien. J'ai fini la salade par principe.`,
    `Le cuisinier s'est gratté les fesses puis a pétri la pâte à pizza. Elle était délicieuse. Je me déteste.`,
  ], [
    `I found a long curly hair in {w:food} {w:at_place}. The waiter said "it's on the house". I didn't ask what.`,
    `I bit into something crunchy in my salad. It was a fingernail. Not mine. I finished the salad on principle.`,
    `The cook scratched his butt then kneaded the pizza dough. It was delicious. I hate myself.`,
  ]),
];
