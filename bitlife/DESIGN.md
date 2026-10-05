# BitLife Online — Document de design

> Nom de travail : **BitLife Online** (code interne `bl`). Simulateur de vie complet dans le navigateur, en 3D diorama, pour deux joueurs.
> Jeu **strictement privé** (un couple), jamais distribué. Ce document est la source de vérité : court, précis, tenu à jour. Les décisions prises en route sont consignées en bas (§ 14).

---

## 1. Pitch

Tu nais. Un clic sur **« Vivre une année »** (ou `Espace`) et douze mois passent. L'école, les premiers amours, le premier job pourri, la promotion, la bêtise qui t'envoie en prison, le mariage, les enfants, la crise de la cinquantaine, la retraite au soleil, la mort — et ensuite ? Tu continues avec ton enfant.
C'est **BitLife**, fidèlement — mêmes onglets, même ton pince-sans-rire, mêmes réflexes — mais ta vie se **voit** : un monde miniature en 3D, façon diorama tilt-shift, où ton petit personnage en vinyle grandit, vieillit, change de maison, de tenue, d'humeur, sous une caméra qui raconte. Et on peut la vivre **à deux**.

**En une phrase :** *BitLife, mais dans une boîte à musique de dioramas Pixar, et avec ta moitié dans la même ville.*

## 2. Piliers

1. **« Encore une année. »** La boucle Âge+ → cartes → conséquences doit être instantanée, drôle, surprenante. Chaque clic produit quelque chose. Zéro temps mort, zéro lecture obligatoire au chrono.
2. **Fidélité BitLife d'abord.** Un joueur de BitLife doit s'y retrouver en 5 secondes : stats (Bonheur, Santé, Intelligence, Apparence), fil d'actualité par âge, onglets Carrière / Biens / Relations / Activités, popups à choix, petites phrases sèches.
3. **Une vie qui se voit.** Chaque événement a une mise en scène (lieu, émotion, accessoire). L'avatar vieillit visiblement. Les lieux changent. Une capture d'écran doit donner envie.
4. **Le monde se souvient.** Flags, mémoire relationnelle, événements en chaîne, conséquences à 10 ans (« butterfly effect »). Les PNJ ont une histoire, et survivent à ta vie (dynastie, monde persistant).
5. **À deux.** Vies parallèles, vie commune, compétition, coop — dans un salon privé, en une commande.

## 3. Direction artistique

**Style : « diorama cartoon premium ».** Mondes miniatures posés sur des socles flottants, éclairage cinématique doux, personnages « vinyl toy / claymation » (grosses têtes, grands yeux, matières satinées). Références : *Animal Crossing* (lisibilité, chaleur), *Tiny Glade* / *Townscaper* (jouets, lumière), *Monument Valley* (socles, fonds dégradés), *Pikmin 4 / Captain Toad* (tilt-shift), vinyles *Funko/Kidrobot*.

### 3.1 Palette — un thème par âge
Le thème (fond 3D, ciel, sol, accents UI) évolue en douceur avec l'âge (interpolation continue, pas de saut).

| Tranche | Ambiance | Ciel haut → bas | Accent UI | Sol |
|---|---|---|---|---|
| 0–5 Petite enfance | pastels tendres | `#FFE4F1 → #DDF1FF` | `#FF8FC2` | `#BFE8A8` |
| 6–12 Enfance | pastels vifs | `#D7F5FF → #FFF3D6` | `#3FC7A8` | `#9BDB7C` |
| 13–17 Ado | couleurs vives | `#C9B8FF → #FFD1EC` | `#8B5CF6` | `#86D46B` |
| 18–29 Jeune adulte | vif équilibré | `#BFE6FF → #FFE7C7` | `#FF6B6B` | `#8CCB6A` |
| 30–59 Adulte | sobre, profond | `#C8D8EA → #F1E9DA` | `#2F6FD6` | `#86B56A` |
| 60+ Senior | sépia / doré | `#FFE6B8 → #F7D3C1` | `#D98A2B` | `#B9C27A` |

Couleurs de stats (constantes, daltonisme-friendly avec icône + texte) : Bonheur `#FFB703` 😊, Santé `#EF476F` ❤️, Intelligence `#4CC9F0` 🧠, Apparence `#B388EB` ✨, Réputation `#06D6A0`, Karma `#F4A261`.

### 3.2 Lumière et rendu — doses exactes
| Élément | Réglage |
|---|---|
| Tone mapping | `NeutralToneMapping` (Khronos PBR Neutral : conserve les teintes saturées du cartoon), exposition 1.0 |
| Ciel / fond | Dôme dégradé vertical (shader), couleurs du thème d'âge, léger halo derrière le socle |
| Environnement | `RoomEnvironment` passé en PMREM (reflets doux sur le vinyle), intensité 0.6 |
| Lumière | 1 directionnelle chaude (soleil, ombres PCF soft 2048²) + hémisphérique ciel/sol + fill froid faible |
| Ombres de contact | Blob radial sous chaque personnage/objet mobile (ancre visuelle) |
| Tilt-shift | Flou vertical/horizontal séparable, bande nette = 45 % centraux, rayon max 1.6 px (High), 0 en Low |
| Bloom | seuil 0.92, intensité 0.25, rayon moyen — seulement fenêtres/néons/étincelles |
| Vignette | 0.12 (très légère) |
| Grain / aberration | **aucun** par défaut (netteté prioritaire) |
| Anti-aliasing | SMAA (+ MSAA 4× sur le rendu cible quand WebGL2) |
| Matériaux | `MeshStandardMaterial` rugosité 0.55–0.85, couleurs pleines ; personnages en `MeshPhysicalMaterial` (clearcoat 0.3) = aspect vinyle |
| Géométrie | tout est arrondi : `RoundedBoxGeometry`, `LatheGeometry`, capsules, extrusions biseautées. Jamais d'arête vive. |

**Règles de lisibilité :** le personnage principal est toujours l'élément le plus contrasté de l'image ; jamais plus de 3 couleurs saturées dominantes par diorama ; fond toujours plus clair et moins saturé que le socle ; texte UI jamais posé sur la 3D sans carte opaque/vitrée.

### 3.3 Personnages
Grosse tête (≈ 1/2.5 de la hauteur adulte, 1/1.6 bébé), yeux en sphères avec pupille + reflet, sourcils animés, bouche à expressions (sourire, ouverte, triste, « o », grimace), joues roses, nez bouton. Vieillissement par **images-clés de proportions** (bébé 0 → enfant 6 → ado 14 → adulte 22 → mûr 45 → senior 70+) : taille, ratio tête/corps, cheveux qui grisonnent puis blanchissent, lunettes possibles, léger dos voûté. Corpulence (variable continue), tenues par âge/école/métier, coiffures (≥ 8). Animations procédurales : respiration, clignement, regard, sautillement de joie, pleurs (gouttes), cœurs, colère (fumée), « zzz », mort douce (auréole qui s'envole).

### 3.4 UI
Typographie **Fredoka** (titres, boutons) + **Nunito** (texte), OpenDyslexic en option. Boutons « à relief » (ombre portée basse + écrasement au clic), cartes d'événement qui rebondissent à l'entrée, jauges en pilules avec animation de delta (+5 en vert qui flotte), fil d'actualité par âge façon BitLife (« Âge 7 ans »), dock d'onglets en bas autour du gros bouton **Âge +**. Panneau vitré clair, coins 20–28 px, ombres colorées douces. Sons de feedback à chaque interaction.

## 4. Référence BitLife — couverture des mécaniques

Toutes les mécaniques ci-dessous existent dans le jeu final ; la colonne « Étape » dit quand.

| Domaine | Mécaniques | Étape |
|---|---|---|
| Identité | pays, genre, nom, famille (parents, fratrie, grands-parents), ville, stats, traits, signe astral | 1 (6 pays) → 2 (12+) |
| Temps | Âge+, fil par âge, récap d'année, saisons | 1 |
| Mort | vieillesse, maladie, accident, santé 0, écran de fin, résumé, héritage | 1 (base) → 4 (héritier) |
| Éducation | maternelle, primaire, collège, lycée, université (spécialités, notes, prêts, bourses), études sup (droit, médecine, commerce, doctorat), redoublement, décrochage, harcèlement, clubs | 1 (base) → 3 |
| Carrière | job étudiant, temps plein, candidature, entretien, performance, promotion, augmentation, licenciement, démission, retraite | 1 (30 métiers) → 3 (100+) |
| Carrières spéciales | célébrité, influenceur, sportif, politique, militaire, crime organisé, entrepreneur, mini-jeux | 3 |
| Relations | parents, fratrie, amis, camarades, amour (rencontres, rendez-vous, couple, fiançailles, mariage, divorce), enfants, collègues, ennemis, animaux ; interactions (passer du temps, conversation, compliment, cadeau, demander de l'argent, dispute, insulte…) | 1 (base) → 2 |
| Argent | salaire, impôts, coût de la vie, prêts, loterie, héritage | 1 (base) → 2 |
| Biens | immobilier (achat, location, hypothèque, rénovation), véhicules, objets de luxe, bourse, crypto | 2 |
| Santé | maladies (50+), médecin, hôpital, chirurgie, addictions, santé mentale, thérapie, sport, régime | 1 (base) → 2 |
| Crime | 40+ crimes, police, procès, avocat, prison (gangs, émeutes, évasion), casier | 2 |
| Aléatoire | événements aléatoires, dilemmes moraux, absurdes, légendaires, mode Chaos | 1 → 5 |
| Meta | sauvegardes multiples, cimetière des vies, succès, scénarios, défis, mode Dieu | 1 (sauvegardes) → 2 (succès) → 5 |

## 5. Ce qui dépasse BitLife

1. **Diorama 3D vivant** : un socle par lieu (maison, école, bureau, hôpital, cimetière, prison, villa, plage…), transitions animées, saisons, caméra qui accompagne chaque moment.
2. **Avatar 3D qui vieillit** + portraits 3D de chaque PNJ (rendus à la volée dans les listes de relations et sur les cartes).
3. **Narration en scènes** : événements en chaîne, flags persistants, PNJ récurrents (le harceleur du CM2 devient ton patron), arcs de vie, conséquences différées (`schedule`).
4. **Actions ouvertes** (étape 5) : champ « improviser » interprété par règles + mots-clés (pas d'API externe).
5. **Dynasties** : héritier jouable, génétique, arbre généalogique 3D, manoir familial, monde persistant entre vies.
6. **Mode à deux** (§ 9).
7. **Mini-jeux** (opération, plaidoirie, négociation, cuisine, casse, évasion, drague, poker).
8. **Époques** : année de naissance choisie (1950 → 2040), prix, technologies, actualité mondiale qui influencent la vie.

## 6. Liste exhaustive des systèmes

- **Personnage** : stats visibles (Bonheur, Santé, Intelligence, Apparence 0–100), attributs cachés (karma, célébrité, sportivité, discipline, stress, fertilité), traits de personnalité (2–3 parmi 16), talent caché, valeurs, signe astral, génétique (apparence et stats héritées partiellement).
- **Temps** : âge, année civile, saisons (visuelles), agenda annuel (actions limitées par an et par type pour éviter le spam : « tu as déjà médité 3 fois cette année »).
- **Éducation** : étapes par âge, nom d'établissement par pays, note 0–100 influencée par Intelligence et effort, redoublement, décrochage, bac/diplôme, université (spécialités × durées), prêt étudiant / bourse / parents, études supérieures.
- **Carrière** : offres annuelles filtrées (âge, diplôme, spécialité, stats, casier), candidature → entretien (probabilité), niveau et titre, salaire (pays × métier × ancienneté), performance (effort, événements), promotion/augmentation, licenciement, démission, retraite, historique.
- **Économie** : monnaie locale (taux, niveau de prix, niveau de salaires par pays), impôts progressifs simplifiés par pays, coût de la vie après avoir quitté le foyer, dettes ; étape 2 : banque, prêts, bourse cyclique, immobilier, entreprises.
- **Relations** : graphe de PNJ (rôle, jauge 0–100, traits, apparence, âge, métier, vivant/mort), interactions data-driven, dérive annuelle, mémoire (flags par PNJ), amour (rencontres selon âge/orientation, couple → fiançailles → mariage → enfants), décès des proches, deuil.
- **Santé** : dérive par âge et mode de vie, maladies (rhume → chroniques), médecin, mortalité de Gompertz modulée par santé et pays, cause de décès.
- **Événements** : moteur à conditions + poids + rareté + cooldown + `once`, acteurs liés (rôles), choix → issues pondérées par stats, effets, chaînes immédiates et différées, variantes de texte, rendu genré FR/EN.
- **Actions** : catalogue data-driven par onglet, conditions, coût, limite annuelle, issues comme les événements.
- **Succès** (étape 2), **modes** (étape 5), **réseau** (étape 6).

## 7. Architecture technique

```
bitlife/
  apps/client      Vite + TypeScript strict + Three.js (WebGL2) + Preact (UI) + Web Audio
  apps/server      Node + WebSocket : salon privé à 2 (étape 6)
  packages/sim     Moteur de simulation PUR : aucune dépendance DOM, déterministe par seed, testé (Vitest)
  packages/shared  Types partagés client/serveur, protocole réseau (étape 6)
  data/            Contenu : pays, noms, métiers, spécialités, événements, actions, traits (TS typé)
  tools/           validate-data, mass-sim (N vies → rapport d'équilibrage)
```

### 7.1 Moteur (`packages/sim`)
- **État** = un objet `Life` 100 % sérialisable JSON (c'est la sauvegarde). Il contient l'état du RNG (`sfc32`, 4×u32) : *même seed + mêmes choix = même vie*.
- **API** : `createLife(content, opts)`, `ageUp(life, content)` → rapport d'année, `currentEvent(life)`, `choose(life, content, i)` → résolution, `listActions(life, content, tab)`, `doAction(life, content, id, target?)` → résolution, `listJobs`, `apply`, `enrollUni`, `relActions`.
- Le moteur ne connaît pas le contenu : il reçoit un `Content` (données de `data/`). Tout l'équilibrage est dans `data/` ou `data/balance.ts`.
- **Textes** : stockés rendus dans les **deux langues** dans le journal (on peut changer de langue en pleine vie). Les variantes aléatoires sont tirées une fois (même index FR/EN).

### 7.2 Client (`apps/client`)
- `GameController` possède la `Life`, appelle le moteur, publie l'état via des *signals* Preact, déclenche la mise en scène 3D (`Stage`) et l'audio.
- `three/` : `Renderer` (WebGL2, post-process maison : MSAA + SMAA + bloom léger + tilt-shift + vignette), `Stage` (gestion des dioramas, transitions, saisons), `dioramas/*` (générés par code), `Avatar` (personnage procédural paramétré âge/genre/apparence/tenue/expression), `PortraitRenderer` (portraits PNJ hors-écran → data URL, cache), `CameraDirector`.
- **Zéro allocation dans la boucle de rendu** (vecteurs réutilisés, pas de closures par frame), géométries/matériaux partagés et mis en cache.
- `ui/` : composants Preact (écran titre, création, jeu, cartes, onglets, fin, options). `i18n/` : chaînes UI FR/EN.
- `audio/` : SFX synthétisés (Web Audio), musique générative par thème d'âge, « blips » de dialogue.
- `save/` : localStorage versionné (`v`), migrations, 6 emplacements + autosave, export/import JSON. (IndexedDB si la taille dépasse ~2 Mo : étape 4.)
- **Entrées abstraites** : actions nommées (`ageUp`, `choice1..4`, `nextTab`, `menu`, `fullscreen`, `mute`, `photo`) → bindings clavier remappables ; souris native. Le tactile se branchera sur les mêmes actions.

### 7.3 Réseau (étape 6)
Petit serveur Node `ws` lancé par `npm run duo` : salle à code de 4 lettres, 2 joueurs, serveur relais + autoritaire léger (il fait tourner le moteur pour la « vie commune »). Persistance SQLite (fichier). Pas de comptes. Alternative sans serveur : WebRTC avec échange manuel du code d'offre.

## 8. Format des données

Le contenu est écrit en **TypeScript typé** dans `data/` (validation à la compilation + `tools/validate-data`). Les textes sont **inline bilingues** `{ fr, en }`, chaque langue pouvant être une liste de variantes.

### 8.1 Mini-langage de texte
| Syntaxe | Rendu |
|---|---|
| `{first}` `{last}` `{full}` `{age}` `{city}` `{country}` `{school}` `{job}` `{employer}` `{major}` | infos du joueur |
| `{a.first}` `{a.full}` `{a.age}` `{a.rel}` `{a.he}` `{a.him}` | acteur lié (« ta mère », « elle »…) |
| `{$amount}` | variable monétaire formatée dans la monnaie du pays (`$` = argent) |
| `{n}` | variable brute |
| `{m\|f}` | accord selon le genre du joueur : `Tu es tombé{\|e}` / `{il\|elle}` |
| `{a:m\|f}` | accord selon le genre de l'acteur |
| `[[a\|b\|c]]` | variante aléatoire (même tirage en FR et EN) |

### 8.2 Événement
```ts
{
  id: 'child_lost_tooth',
  icon: '🦷', cat: 'child',
  scene: { place: 'home', mood: 'happy', prop: 'coin' },
  when: { age: [5, 8] },              // conditions (âge, stats, flags, école, métier, rôles présents, traits, argent…)
  weight: 10, once: true,             // poids, rareté, cooldown
  actor: 'parent',                    // PNJ lié (optionnel)
  text: { fr: ['Tu as perdu ta première dent !', '…'], en: ['You lost your first tooth!', '…'] },
  choices: [
    { label: { fr: 'La mettre sous l\'oreiller', en: 'Put it under the pillow' },
      out: [ { w: 3, text: {…}, fx: { happy: 6, money: 2 } },
             { w: 1, text: {…}, fx: { happy: -3 } } ] },
  ],
}
```
- `out` : issues pondérées ; `odds: { smarts: 1 }` multiplie le poids par `1 + k·(stat−50)/50` (le talent change les chances).
- `fx` : effets déclaratifs (`happy`, `health`, `smarts`, `looks`, `karma`, `money` [en unités de base, converties par pays], `rel` [jauge de l'acteur], `flag`, `unflag`, `grade`, `perf`, `fired`, `newNpc`, `actorRole`, `actorGone`, `die`, `chain`, `schedule`, `trait`, `fn` [échappatoire code]).
- `auto: true` : simple ligne dans le fil (pas de carte). `chainOnly: true` : déclenché seulement par une chaîne.

### 8.3 Autres données
`countries.ts` (monnaie, taux, niveau de prix/salaires, impôts, noms d'écoles, espérance de vie, villes), `names.ts` (prénoms M/F + noms par pays), `careers.ts` (titres par niveau, prérequis, salaires de base en USD), `majors.ts`, `actions.ts` (activités par onglet), `relactions.ts` (interactions de relation), `traits.ts`, `balance.ts` (toutes les constantes d'équilibrage).

## 9. Mode à deux (étape 6)
Salon privé (code), deux clients. Modes : **Vies parallèles** (même monde, rencontres possibles, mariage entre joueurs qui lie les foyers, enfants jouables par l'un ou l'autre), **Vie commune** (un foyer, votes sur les gros choix, désaccord → événement de couple, budget commun), **Compétition** (même seed, score de vie, duels), **Coop** (défis à deux). Messages, emotes, cadeaux, album souvenirs 3D, sauvegarde commune exportable.

## 10. Contenu sensible
Ton léger/satirique, rien de graphique, rien d'explicite. **Mode « Tout public » par défaut** (les événements marqués `mature` sont masqués ou adoucis) ; mode « Adulte » non graphique. Pas de stéréotypes lourds ; orientations et genres respectés (l'orientation du joueur est choisie ou découverte). Les « lignes d'aide » sont fictives.

## 11. Options & accessibilité
Qualité Low/Med/High (post-process, ombres, pixel ratio), réduction des animations, taille du texte, contraste élevé, police dyslexie, langue FR/EN, volumes musique/SFX, vitesse et auto-avance optionnelle des cartes, remap clavier, aperçu des effets des choix. Aucun chrono par défaut.

## 12. Plan par étapes
1. **Vertical slice 0→30 ans** (et au-delà jusqu'à la mort) : création de personnage, avatar 3D qui vieillit, dioramas maison / école / bureau (+ hôpital, cimetière, université), boucle Âge+ avec **80+ événements**, école/carrière/relations de base, stats, argent, mort, sauvegardes. Beau et addictif.
2. Santé, crime/prison, finances, immobilier, mariage/enfants complets, 12 pays, 400 événements, succès.
3. Carrières avancées + mini-jeux, politique, entrepreneuriat, sport/art, 100 métiers.
4. Dynasties, générations, arbre généalogique 3D, monde persistant, époques.
5. Scènes cinématiques, modes de jeu (Chaos, Scénarios, Défis, Hardcore, Zen, Dieu), mode photo, rétrospective de fin.
6. Mode à deux.
7. Polish massif : équilibrage par 10 000 vies, perf, audio, accessibilité, build de production.

## 13. Risques
| Risque | Parade |
|---|---|
| Volume de contenu (1500 événements) | format compact, variantes, outil de validation, rédaction par lots thématiques, simulation de masse pour repérer les événements jamais vus |
| Répétitivité | cooldowns, `once`, variantes, poids qui dépendent de l'historique, événements rares/légendaires |
| Équilibre (stratégie dominante, cul-de-sac) | `tools/mass-sim` (stats de mort, richesse, diplômes), limites annuelles d'actions |
| Perf 3D sur portable | qualité auto, géométries partagées, ombres statiques, post-process désactivable |
| Taille des sauvegardes (journal) | journal compressé par année, élagage des vieux PNJ, IndexedDB à l'étape 4 |
| Synchronisation à deux | moteur déterministe : on synchronise les **choix**, pas l'état |

## 14. Journal des décisions
- **D1 — Dossier `bitlife/`.** Le dépôt contient déjà un autre projet (jeu de taxi) à la racine ; BitLife Online vit dans `bitlife/`, monorepo autonome, sans toucher au reste.
- **D2 — Preact + signals** pour l'UI (léger, JSX, maintenable), Three.js pur pour la 3D, post-process maison (contrôle total des doses, pas de dépendance lourde).
- **D3 — Données en TypeScript** plutôt qu'en JSON : typage, autocomplétion, échappatoire `fn` pour les cas complexes ; reste « données » (aucune logique moteur dans `data/`).
- **D4 — Textes inline bilingues** `{fr, en}` dans chaque définition (évite les clés orphelines) ; le journal stocke les deux langues déjà rendues.
- **D5 — Montants en unités de base (≈ USD)** dans les données, convertis à l'exécution via le niveau de prix, de salaires et le taux de change du pays ; l'argent du joueur est stocké en monnaie locale.
- **D6 — Genre M/F pour l'accord grammatical**, l'orientation est un paramètre séparé (hétéro/homo/bi) qui pilote les rencontres.
- **D7 — Mortalité de Gompertz** `h(a) = A·e^{B·a}` modulée par la santé et l'espérance de vie du pays, plus mort certaine à santé 0. Paramètres dans `data/balance.ts`.
- **D8 — Limites d'actions annuelles** (agenda) plutôt qu'un système d'énergie : plus proche de BitLife, empêche le spam (gym ×50).
- **D9 — Les vies continuent après 30 ans** dès l'étape 1 (vieillesse, retraite, mort) ; le contenu spécifique s'étoffe aux étapes suivantes.
- **D10 — Portraits PNJ en 3D** rendus hors-écran par le même renderer (cache par PNJ et tranche d'âge) : les listes de relations ne sont jamais du texte nu.
