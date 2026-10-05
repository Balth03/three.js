# Guide d'écriture — BitLife Online

Jeu **privé** pour un couple d'adultes. Recréation fidèle de BitLife, en plus trash. Lis aussi `packages/sim/src/types.ts` (types `EventDef`, `Choice`, `Outcome`, `Effect`, `Cond`, `ActorSpec`) et un fichier d'exemple (`data/events/teen.ts`).

## Format
Chaque fichier d'événements exporte un tableau typé :
```ts
import type { EventDef } from '@bl/sim';
export const xxxEvents: EventDef[] = [ { id: 'xx_...', icon: '🔥', cat: '...', rating: 2, scene: {...}, when: {...}, text: {...}, choices: [...] }, ... ];
```
- `id` unique, préfixé (ex. `cr_` crime, `lv_` amour…).
- `text` (énoncé de la carte) à la **2e personne** (« Tu… », « You… »), 2 variantes par langue si possible.
- Les textes d'issues (`out[].text`, `choice.text`) et les événements `auto: true` (lignes du journal sans carte) sont à la **1re personne** (« J'ai… », « I… »). Ils vont dans le journal.
- Bilingue `{ fr, en }`. **Le français est la langue principale** : naturel, drôle, idiomatique, argotique quand ça colle. L'anglais doit aussi être drôle (pas une traduction plate).
- Choix : 2 à 4, libellés courts (2–6 mots). `out: [{ w, odds?, text, fx, mood? }]` : plusieurs issues pondérées = choix risqué ; `odds: { smarts: 1 }` favorise une issue selon la stat.

## Mini-langage de texte
`{first}` `{last}` `{age}` `{city}` `{country}` `{school}` `{job}` `{employer}` `{major}` — `{a.first}` `{a.full}` `{a.age}` `{a.rel}` (« ta mère », dans les énoncés) `{a.my}` (« ma mère », dans les issues à la 1re personne) `{a.he}` `{a.him}` — `{$amount}` (montant déclaré dans `vars: { amount: [min, max] }`, en unités de base ≈ dollars US ; effet `money: 'amount'` ou `'-amount'`) — accords : `{|e}` (genre du joueur : « tombé{|e} »), `{il|elle}`, `{a:il|elle}` (genre de l'acteur) — variantes inline `[[a|b|c]]`. **Aucune autre balise entre accolades** (le validateur rejette).

## Niveau de contenu (`rating`) — OBLIGATOIRE à penser
- `rating: 0` (ou absent) : tout public. Humour léger.
- `rating: 1` : adulte. Alcool, drogue, sexe sous-entendu, gros mots, violence non détaillée, humour noir.
- `rating: 2` : **trash** — demandé explicitement par les joueurs : humour noir/cru/vulgaire sans filtre, politiquement incorrect, gore cartoon assumé (sang qui gicle, membres arrachés, vomi, caca, morts absurdes et sanglantes décrites avec gourmandise façon Happy Tree Friends / South Park / Deadpool), insultes fleuries, sexualité crue **suggérée** (pas de description d'acte détaillée).
- Répartition visée par fichier : ~30 % rating 0, ~30 % rating 1, ~40 % rating 2. Un même thème peut avoir une version soft et une version trash.
- Granularité : `rating` existe aussi sur un **choix** (`choices[i].rating`) et sur une **issue** (`out[i].rating`) — pratique pour ajouter une variante trash à un événement tout public.
- Limites absolues (même en trash) : **rien de sexuel impliquant un personnage mineur** (< 18 ans, ou quand le joueur a moins de 18 ans : pas de sexuel du tout) ; pas d'insultes haineuses visant des groupes réels (origine, religion, orientation, handicap) — on se moque des individus, des institutions, des situations, des riches, des flics, des patrons, de soi-même ; pas de mode d'emploi réel de crime/arme/drogue.

## Effets (`fx`)
Stats ±2..±20 : `happy` `health` `smarts` `looks` `karma` `fame` `athletic` `discipline` `stress` ; `money` (nombre en unités de base, ou variable) ; `rel` (jauge de l'acteur ±5..30) ; `grade` (notes), `perf` (perf au travail) ; `flag: 'xx_qqch'` / `unflag` ; `weight: ±0.05` (corpulence) ; `disease: '<id>'` ; `cure: true` ; `die: { fr: 'écrasé{|e} par un piano', en: 'crushed by a piano' }` (cause de mort, phrase qui suit « Je suis mort(e)… ») ; `actorRole: 'friend'|'partner'|'enemy'|'ex'|'spouse'|'fiance'` ; `actorDie: true` ; `actorGone: true` ; `keep: true` ; `newNpc: { role: 'pet', species: 'dog' }` ; `fired: true` ; `promote: true` ; `quitJob: true` ; `expel: true` ; `moveOut: true` ; `chain: '<id>'` (enchaîne un événement `chainOnly: true` tout de suite) ; `schedule: { key: '<id>', years: 2 }` (plus tard) ; `open: 'jobs'|'dating'|'realestate'|'stocks'` ; **nouveaux** : `arrest: '<crimeId>'` (arrestation → procès), `jail: 3` (prison directe, années), `heat: ±10` (attention de la police), `followers: ±5000`, `addiction: ['alcohol', 20]` (ids : alcohol, tobacco, drugs, gambling), `counter: 'xxx'` (compteur pour succès), `asset: '<assetId>'` (gagner un bien), `loseAsset: 'car'|'house'|true`, `visual: 'gore'|'money'|'police'|'fire'|'confetti'|'hearts'|'poop'|'explosion'|'ghost'` (effet visuel 3D).

## Conditions (`when`)
`age: [min,max]`, `gender`, `stat: { looks: [60,100] }`, `flag`, `noFlag`, `school: 'primary'|'middle'|'high'|'uni'|'any'|'none'`, `degree: 'uni'`, `job: true|false|'cat:health'|'doctor'`, `has: 'lover'|'spouse'|'child'|'parent'|'sibling'|'anyFriend'|'pet'`, `noHas`, `trait`, `money: [min,max]` (base), `movedOut`, `wealth: ['rich']`, `orientation`, **nouveaux** : `prison: true` (événement de prison ; sans ça l'événement ne sort jamais en prison), `record: true` (casier judiciaire), `asset: 'car'|'house'|'boat'|'<id>'`, `followers: [10000, 1e9]`, `addiction: 'alcohol'`, `business: true`, `era: [2005, 2100]` (année civile), `counter: { crimes: [5, 999] }`, `chance: 0.3`.
Acteurs : `actor: 'parent'|'mother'|'father'|'sibling'|'grandparent'|'classmate'|'anyFriend'|'lover'|'spouse'|'child'|'coworker'|'boss'|'enemy'|'ex'` ou `actor: { create: { role: 'acquaintance', age: [-5, 5], gender: 'attracted'|'same'|'opposite'|'any' } }` (créé temporairement, gardé seulement si une issue fait `actorRole`/`keep`).

## Identifiants disponibles
- Lieux (`scene.place`) : home, apartment, school, uni, office, hospital, park, party, cemetery, prison, court, villa, mansion, casino, beach, stadium, studio, castle.
- Humeurs (`scene.mood` / `out.mood`) : happy, sad, shock, angry, love, sleepy, proud, sick, neutral, party, cry.
- Maladies : cold, flu, chickenpox, ear_infection, gastro, strep, acne, broken_arm, sprain, migraine, allergies, asthma, depression, anxiety, insomnia, back_pain, hypertension, diabetes, arthritis, heart_disease, cancer, alzheimer, liver_disease, lung_cancer, std, hemorrhoids, food_poisoning, concussion, burns, missing_finger, ptsd, gout, obesity, pneumonia.
- Crimes (pour `arrest`) : shoplift, burglary, cartheft, weed, mug, robstore, bank, drugtraffic, arson, murder, hitman, embezzle, taxfraud, hack, kidnap, ponzi, racket, drunkdrive, vandal, graffiti.
- Biens (pour `asset`) : h_studio, h_flat, h_house, h_villa, h_mansion, h_castle, c_wreck, c_twingo, c_suv, c_porsche, c_lambo, c_hearse, b_kayak, b_yacht, l_watch, l_ring, l_art, l_nft, l_toilet, l_skeleton.
- Catégories de métiers (`job: 'cat:xxx'`) : service, trade, office, tech, health, edu, law, public, art, media, finance, science, sport, politics, crime, special.
- Traits : extravert, introvert, ambitious, lazy, kind, mean, funny, anxious, calm, creative, romantic, rebel, wellbehaved, sporty, couchpotato, nerd.

## Qualité
Ton BitLife : phrases sèches, chute absurde, détails précis et inattendus. Pas de répétition de blagues entre événements. Chaque événement a une `scene` (lieu + humeur, + `fx` visuel si gore/explosion/argent). Varie `weight` (10 courant, 4 rare, 1 légendaire). `once: true` pour les uniques, `cooldown` sinon. Au moins 4 petites chaînes (flag ou schedule) par fichier.

Vérifie : `cd /home/user/three.js/bitlife && npx tsc -p data --noEmit` puis `npm run validate` (corrige seulement TES erreurs ; d'autres agents écrivent en parallèle d'autres fichiers). Ne modifie aucun autre fichier. Pas de git.
