# NEON·TAG — Document de design

> Titre de travail : **NEON·TAG** (code `neon`). Laser game 3D en vue subjective, navigateur, solo contre bots puis en ligne.
> Ce document fait foi. Il reste court ; les décisions sont journalisées en bas (§12).

---

## 1. Pitch

Tu entres dans une arène de laser game du futur : brouillard dense, lumière UV, néons saturés, faisceaux qui fendent la fumée. Ton gilet s'illumine, ton blaster ronronne, la musique cogne. Cinq minutes de duel, de flanc, de vengeance, puis « encore une ».

**En une phrase :** *la lisibilité de Splatoon, la nervosité de Quake, la scène d'un club synthwave, le tout dans un vrai laser game.*

## 2. Piliers

1. **Le tir est un plaisir.** Hitscan précis, retour immédiat (hit-marker, son, gilet adverse qui flashe), recul lisible, aucune latence perçue. Si tirer sur une cible fixe n'est pas satisfaisant, rien d'autre ne compte.
2. **Chaque capture est un fond d'écran.** Brouillard, faisceaux, bloom, sol réfléchissant, couleurs franches. Mais *lisible d'abord* : on sait qui est qui et d'où ça tire.
3. **La musique pilote le monde.** Une horloge de beat unique fait pulser néons, gilets, HUD et mix musical selon l'intensité de la partie.
4. **Sport de lumière, pas de violence.** On « éteint » des gilets. Shutdown dramatique, boot-up héroïque, jamais de gore.
5. **Boucle courte.** Partie en 3–6 min, relance en 1 clic, progression visible.

## 3. Direction artistique — « Néon-UV cinématique »

### 3.1 Palette

| Rôle | Couleur | Hex | Usage |
|---|---|---|---|
| Fond / ombre | Noir violacé | `#07040f` | ciel du plafond, clear color |
| Ambiance UV | Violet profond | `#2a0f5e` → `#5b2bd6` | lumière hémisphérique, brouillard |
| Équipe A | Cyan | `#18e7ff` | gilet, lasers, HUD, base |
| Équipe B | Magenta | `#ff2bd6` | idem |
| Équipe C/D (FFA, futur) | Vert toxique / Jaune acide | `#5dff3a` / `#f4ff2b` | |
| Neutre / interactif | Orange électrique | `#ff8a1f` | bornes d'énergie, pick-ups, danger |
| Signalétique | Blanc chaud | `#fff2e0` | flèches, numéros de secteur |

Règles :
- **Les couleurs d'équipe sont réservées.** Le décor n'utilise jamais le cyan/magenta saturé hors des zones de base ; les murs neutres sont en violet/bleu UV + orange/blanc pour la signalétique. Ainsi un éclat cyan = un allié/un tir allié, toujours.
- **Valeurs HDR** : cœur des lasers à ~8–12 (blanc), halos 2–4, néons décor 1.5–3, murs < 0.1. Le bloom se déclenche par seuil de luminance (bloom « sélectif » par valeur, pas par layer — moins coûteux, toujours cohérent).
- **Silhouettes** : joueurs sombres (noir mat) + bandes lumineuses = contraste maximal contre des murs mi-sombres à motifs.
- **Daltonisme** : chaque équipe a aussi une *forme* (A = chevrons ▲, B = losanges ◆) sur gilet, réticule de touche, marqueurs et HUD. Palettes alternatives (deutéranopie : cyan/orange) dans les options (étape 6).

### 3.2 Lumière et atmosphère
- Tone mapping **AgX**, exposition fixe par arène (+ color grading).
- Brouillard exponentiel teinté UV, plus dense près du sol (brouillard de hauteur, calculé dans les shaders des matériaux).
- **Faux volumétriques** : cônes de lumière additifs (godrays) sous les spots du plafond, poussière lumineuse en particules, faisceaux laser dessinés sur toute leur longueur avec un halo diffus « dans la fumée ».
- **Sol brillant** : réflexion planaire demi-résolution floutée (High/Ultra), reflets des néons étirés ; Low/Med : sol sombre + reflets spéculaires seulement.
- Lumières dynamiques : un *pool fixe* de point lights (flashs de tir/impacts) toujours présents (intensité 0 si libre) → aucune recompilation de shader.

### 3.3 Lasers
Ruban orienté caméra : cœur blanc HDR + halo coloré + voile diffus large (dispersion dans le brouillard). Apparition instantanée, durée 60 ms en plein, puis traînée résiduelle qui s'estompe (~0.5 s) avec scintillement. Impact : étincelles, anneau qui s'étend, flash de lumière, décal fluo qui s'éteint en 4 s.

### 3.4 Gilets et silhouettes
Personnage stylisé (combinaison noire, casque à visière lumineuse), gilet avec zones lumineuses : poitrine, dos, épaules, capteur du casque, blaster. Les zones pulsent sur le beat, flashent blanc quand touchées, clignotent puis s'éteignent au **shutdown** (le corps s'affaisse, les lumières s'éteignent zone par zone), et se rallument en balayage au **boot-up**.

### 3.5 UI
Typographies : **Chakra Petch** (titres) / **Rajdhani** (chiffres, HUD) — chargées via Google Fonts avec repli système (le jeu doit tourner hors-ligne : pas de dépendance bloquante). HUD minimal : réticule dynamique, jauges énergie/chaleur sur le blaster (diégétique) + rappel discret, état du gilet, score d'équipe + chrono en haut, kill-feed, indicateurs de direction des tirs subis, hit-markers.

## 4. Gameplay — valeurs de référence (toutes dans `data/`)

### 4.1 Mouvement (`data/game.json`)
Contrôleur capsule kinématique (Rapier KCC), pas fixe **60 Hz** partagé client/serveur.
- Course 7.2 m/s, sprint 9.6 m/s (pas de tir en sprint — le tir annule le sprint), accroupi 3.6 m/s.
- Accélération sol 70 m/s², friction 9, air-control 18 m/s², gravité 22 m/s², saut 7.4 m/s (≈1.25 m).
- **Glisse** : Ctrl en sprint → impulsion +3 m/s, friction faible 0.8 s, capsule basse.
- Marches auto 0.45 m, pentes ≤ 46°, snap au sol 0.3 m. Coyote time 0.1 s, buffer de saut 0.12 s.

> Révisé après le premier retour de test (voir D11–D17) : course 7.6, sprint 10.2, air-control QuakeWorld (vitesse projetée plafonnée à 0.85 m/s, accél. 12), bunny-hop (pas de friction le tick du saut, auto-hop en maintenant Espace), glissade dès 5.5 m/s (aussi à l'atterrissage si accroupi), slide-jump, accélération en pente, gravité ×1.3 en descente, vitesse max 15 m/s.

### 4.2 Tir (`data/weapons/*.json`)
Blaster de base « **Photon-7** » : auto, 7.5 tirs/s, portée 90 m, énergie 100 (2 / tir), chaleur +7 / tir, surchauffe à 100 → verrou 1.3 s ; `R` = purge manuelle (0.7 s). Clic droit = visée (FOV ×0.75, dispersion ×0.35, déplacement ×0.6).
Dispersion : base 0.35°, +mouvement, +air, +tir continu (bloom de dispersion récupéré en 0.25 s). Recul visuel caméra (pitch) récupéré automatiquement — la visée reste précise.

### 4.3 Gilet et désactivation
Charge du gilet 100. Dégâts par zone : poitrine 20, dos 30 (punit le flanc), épaules 15, capteur casque 34 (« headshot » → light-show), blaster 10 + **brouillage** 0.8 s. Régénération 30/s après 3 s sans touche.
À 0 : **shutdown** 4 s (spectateur de ton gilet éteint + nom de qui t'a éteint), puis respawn à la base avec 2 s d'invulnérabilité (gilet blanc clignotant, ne peut pas tirer pendant 0.4 s).
Énergie : régénération passive jusqu'à 30 % seulement ; plein à la base (zone de recharge) ou aux **bornes** neutres (exposées → risque/récompense, anti-camping naturel).

### 4.4 Hitboxes
Volumes analytiques (sphères/capsules) attachés au squelette du gilet, testés par rayon *hors* Rapier → rewindables facilement pour la lag compensation (étape 4). Le décor est testé par Rapier (raycast). Ordre : rayon → premier mur (Rapier) → hitboxes plus proches que le mur.

### 4.5 Modes
Étape 1 : **TDM** — 2 équipes, 5 min ou 30 désactivations, 1 pt par désactivation, mort subite si égalité (premier point gagne, 60 s max puis égalité).

## 5. Architecture

```
lasertag/
  apps/client        Vite + TS strict + Three.js (WebGL2) — rendu, input, audio, UI
  apps/server        (étape 4) Node, autoritaire, réutilise packages/shared
  packages/shared    Simulation déterministe : mouvement, armes, gilets, modes, bots, carte, nav
  tools/             build/validation de cartes, match headless de bots (équilibrage)
  data/              armes, modes, cartes, bots, constantes de jeu
```

### 5.1 Simulation partagée (le cœur réseau-ready)
`Simulation` (dans `shared`) contient le monde Rapier (statique), les **agents** (joueurs et bots, même structure), le mode de jeu, et avance à pas fixe `step(inputs)`. Chaque agent est piloté par une `InputCmd` (axes, yaw/pitch, boutons) — **qu'elle vienne du clavier, d'un bot ou du réseau**. Les bots sont des « contrôleurs » qui produisent des `InputCmd` à partir de leur perception : ils n'ont aucun accès privilégié (pas de triche).
La simulation émet des **événements** (tir, impact, touche, shutdown, respawn, score, fin) que le client consomme pour VFX/audio/UI — exactement ce qui transitera par le réseau.
Elle tourne en Node (tests, match headless) et dans le navigateur.

### 5.2 Client : systèmes
`Game` orchestre : `Input` (actions abstraites, clavier/souris, manette, tactile ajoutable), `Simulation`, `RenderPipeline` (renderer, post, réflexions, qualité), `ArenaView` (géométrie de la carte depuis les mêmes données que les colliders), `AgentViews` (personnages + gilets), `FirstPerson` (caméra, viewmodel, recul, bob), `Fx` (lasers, étincelles, anneaux, décals — tout en pools), `Audio` (musique adaptative + SFX + annonceur), `Hud`, `Menus`, `DebugOverlay` (F3).
Règle : **0 allocation dans les boucles chaudes** (vecteurs scratch, pools, tableaux réutilisés).

### 5.3 Cartes
Format JSON (`data/maps/*.json`) : boîtes (murs, couvertures, plateformes), rampes, miroirs, zones (bases, recharge), spawns, lumières, décor. Les cartes symétriques sont générées par un script (`tools/maps/build-*.ts`) à partir d'une moitié, puis validées (`tools/maps/validate.ts` : bornes, spawns libres, atteignabilité de tous les spawns et objectifs via la nav-grille, symétrie).
**Navigation** : grille de navigation générée automatiquement au chargement par raycasts verticaux (pas 1 m, multi-niveaux), voisins connectés si dénivelé ≤ marche/rampe et capsule libre. A* + lissage par ligne de vue.

### 5.4 Rendu
WebGL2 via `WebGLRenderer` (WebGPU de Three est prometteur mais le pipeline post-process classique + `postprocessing` reste plus stable et plus rapide en 2026 pour ce cas — renderer isolé dans `render/` pour migrer plus tard).
Post : Bloom mipmap (seuil luminance) → aberration chromatique (impacts) → vignette → grain → tone mapping AgX → SMAA.
Géométrie statique fusionnée par matériau (≈ 10–20 draw calls pour l'arène). Motifs des murs procéduraux dans le shader (triplanaire, `fwidth` anti-aliasing), pas de textures.
Qualité Low/Med/High/Ultra + auto-détection (renderer string + temps de frame mesuré les 3 premières secondes, descente automatique si < 55 FPS).

### 5.5 Audio
Web Audio. **Musique** générative synthwave 124 BPM : couches (pad, basse, kick, snare/clap, hats, arpège, lead) activées selon l'intensité (combats récents, écart de score, temps restant). L'horloge musicale exporte `beat` (0–1 décroissant sur chaque noire) et `bar` → uniformes visuels.
**SFX** synthétisés (aucun sample) : tir (pitch aléatoire ±6 %), impact, touche confirmée, gilet touché, shutdown, boot-up, pas, saut, atterrissage, surchauffe, purge. Spatialisation HRTF (Panner) pour les autres agents, occlusion approximative (raycast → filtre passe-bas). Ducking de la musique sur l'annonceur.
**Annonceur** : étape 1 = `speechSynthesis` (voix grave, débit lent) + stinger synthétisé + texte à l'écran ; étape 5 = vocodeur maison pour une vraie voix robotique contrôlée.

### 5.6 Réseau (étape 4) — protocole prévu
- WebSocket binaire, tick serveur 60 Hz, snapshots 30 Hz, inputs client 60 Hz (redondance des 3 dernières commandes contre la perte).
- **Client → serveur** : `Input{seq, moveX, moveY (i8), yaw, pitch (u16), buttons (u16)}`.
- **Serveur → client** : `Snapshot{tick, ackSeq, agents[id, pos, vel, yaw, pitch, vest, energy, heat, state], events[]}` delta-compressé.
- Prédiction locale du mouvement (même code `shared`) + réconciliation (rejeu des inputs après `ackSeq`) + lissage d'erreur. Autres joueurs : interpolation 100 ms.
- **Lag compensation** : historique de 1 s des poses de hitboxes ; le serveur rembobine à `tick - rtt/2 - interp` pour valider un tir (borné à 200 ms).
- Anti-triche : cadence de tir (≤ data), vitesse max, ligne de vue recalculée côté serveur, énergie/chaleur autoritaires.

## 6. Arènes
1. **The Maze** (étape 1) — 56 × 40 m, plafond 9 m. Bases cyan (ouest) / magenta (est). Trois axes : **couloir nord** (labyrinthe serré, murs-miroirs, combats rapprochés), **centre** (plateforme surélevée 2.4 m avec deux rampes, contrôle de la vue), **galerie sud** (longue ligne de snipe coupée de couvertures basses). Deux **bornes d'énergie** neutres sous la plateforme (risque). Boucles de flanc entre nord et sud par les « chicanes ». Signalétique : secteurs numérotés A1–A3/B1–B3 au néon blanc, flèches vers les bases.
2. Cyber Warehouse · 3. Orbital Station · 4. Neon Jungle · 5. Retro Arcade (étapes 3+).

## 7. Bots
Contrôleurs qui produisent des `InputCmd`. Perception : cône de vision (110°), portée réduite par le brouillard, ligne de vue réelle (raycast), mémoire de la dernière position vue (4 s), audition des tirs proches.
Machine à états : **Patrouille** (points chauds de la carte / objectif) → **Engagement** (strafe, saut occasionnel, maintien de distance selon personnalité) → **Recherche** (dernière position connue) → **Retraite/Recharge** (gilet ou énergie bas → base/borne).
Visée humaine : temps de réaction, erreur initiale qui converge (« flick » puis suivi), tremblement, surestimation du recul — paramétrés par difficulté (Recrue/Pro/Élite/Légende). Personnalités : *Agressif, Prudent, Tireur, Campeur, Farceur*. Noms drôles + répliques (barks) dans le kill-feed.

## 8. Contrôles (PC)
`ZQSD/WASD` (détection AZERTY via `KeyboardEvent.code` → positions physiques, donc les deux marchent sans réglage), souris, clic G tir, clic D visée, `R` purge, `Shift` sprint, `Ctrl`/`C` accroupi/glisse, `Espace` saut, `Tab` scores, `Échap` menu, `F3` debug, `P` photo (étape 6). Manette : stick G/D, RT tir, LT visée, A saut, B accroupi, X purge, L3 sprint ; dead-zone radiale 0.15, courbe de réponse quadratique, vibrations.

## 9. Performance
Cible 60 FPS stables PC milieu de gamme (GTX 1060/RX 580/iGPU récent en Low), 144+ sur bon PC. Budget High : < 150 draw calls, réflexion planaire demi-rés, bloom 5 niveaux. Pools : lasers (64), étincelles (2 048 points), anneaux (32), décals (128), flash lights (6).

## 10. Plan par étapes
1. **Vertical slice** — The Maze, Photon-7, mouvement + hitscan + désactivation, brouillard + lasers + néons + bloom + sol réfléchissant, bots, musique adaptative, HUD, scoreboard, TDM, menu, options de base. ← *en cours*
2. Classes, compétences, pick-ups, rebonds de lasers (miroirs actifs), feeling affiné, 3 modes de plus (FFA, Control Points, Gun Game).
3. IA de bots complète, 3 arènes, campagne solo de base.
4. Serveur en ligne (prédiction/réconciliation, lag comp, lobby, matchmaking, amis, chat), spectateur/killcam.
5. Modes restants, annonceur vocodé, ping, communication, lobby 3D.
6. Méta (niveaux, cosmétiques, défis, succès, saisons, replays), mode photo, options & accessibilité complètes, i18n.
7. Polish massif, QA réseau dégradé, build prod, Docker.

## 11. Risques
| Risque | Parade |
|---|---|
| Brouillard/volumétrique trop coûteux | Faux volumétriques (cônes additifs + brouillard analytique), pas de raymarching ; désactivables par qualité |
| Réflexion planaire coûteuse | Demi/quart de résolution, layer dédié (pas de joueurs lointains/particules), désactivée en Low/Med |
| Lisibilité noyée par le bloom | Couleurs d'équipe réservées, seuil de bloom haut, silhouettes sombres |
| Rapier KCC et multiplayer | Même code et même pas fixe des deux côtés ; tests de déterminisme dans `shared/test` |
| Tests navigateur sans GPU (CI) | Rendu logiciel (SwiftShader) pour captures ; les FPS réels sont mesurés à part |
| `speechSynthesis` absent/variable | Repli : stinger + texte, jamais bloquant |

## 12. Journal des décisions
- **D1** — Le dépôt hébergeait déjà un autre projet (Taxi·Monde) sur cette branche : le laser game vit dans le dossier autonome `lasertag/` (workspace npm indépendant) pour ne rien casser.
- **D2** — WebGL2 + `postprocessing` plutôt que WebGPU (stabilité/perf du post-process ; renderer isolé).
- **D3** — Pas de framework ECS externe : agents en structures plates + systèmes explicites ; suffisant pour 16 joueurs, plus lisible, zéro alloc.
- **D4** — Hitboxes analytiques hors Rapier (rewind trivial pour la lag compensation).
- **D5** — Bloom « sélectif » par seuil de luminance HDR plutôt que par layers (un seul rendu, cohérent avec la DA par valeurs).
- **D6** — Bots dans `shared` → ils tourneront aussi côté serveur pour remplir les parties en ligne.
- **D7** — Étape 1 en 4v4 (toi + 3 bots alliés contre 4 bots) par défaut, réglable de 1v1 à 6v6 : 2 bots seulement rendait l'arène vide. Le « 2 bots » demandé est le minimum (1v1 + 1, ou 1v2).
- **D8** — Mort subite TDM limitée à 60 s pour garder des parties courtes.
- **D9** — Mouvement : saut simple + glisse pour le soldat de base ; double saut / dash réservés aux classes (étape 2) pour donner du sens aux classes.
- **D10** — Énergie à régénération passive plafonnée à 30 % : jamais bloqué, mais la base/les bornes restent un vrai enjeu.
- **D11** — *Retour joueur : « mouvement et tir pas assez satisfaisants, bots trop forts ».* Recherche : « Juice it or lose it » (Jonasson & Purho), hitstop d'Ultrakill (gel 0,1–0,25 s), physique QuakeWorld (air-strafe, bunny-hop), bot de Counter-Strike (GDC : crédible > fort), *grace shots* de BioShock, jetons d'attaque de Doom (2016).
- **D12** — Bug corrigé : le tick où la capsule changeait de taille (accroupi/glissade), le KCC renvoyait un déplacement nul et la vitesse était remise à 0 → la glissade tuait l'élan. La vitesse n'est plus corrigée que sur collisions réelles.
- **D13** — Tir « précis comme un laser » : dispersion de base 0,12°, 1er tir parfait à l'arrêt (≥ 0,32 s sans tirer), bloom max 0,9°. Hitboxes +4,5 cm pour les tirs humains (générosité côté tireur, standard des arena shooters ; même règle pour tous les humains en ligne).
- **D14** — Juice : hit-stop 0,11 s à l'extinction (0,035 s sur casque, désactivable via « réduire les flashs »), chiffres de dégâts en 3D, son de touche qui monte d'un demi-ton à chaque touche consécutive, FOV qui s'élargit avec la vitesse, souffle d'air au-delà de 8 m/s, recul de l'arme plus marqué.
- **D15** — Visée des bots : ils visent la position *perçue avec retard* (90–260 ms) avec une anticipation partielle, une erreur qui se resserre en 0,5–1,4 s, une rotation à gain fini, des rafales avec pauses et une portée max. Bouger bien est donc une vraie défense. Mesures (`tools/sim/bot-aim.ts`, cible à 14 m) : temps pour t'éteindre immobile/en esquive — Recrue 9 s/15 s+, Pro 5,7/9,3 s, Élite 3/5,6 s, Légende 1,9/2 s.
- **D16** — Jetons d'attaque : au plus 1/2/3/4 bots (Recrue→Légende) peuvent tirer sur un même humain en même temps. Premiers tirs volontairement ratés (3/2/1/0).
- **D17** — Auto-hop en maintenant Espace (accessibilité ; le timing parfait n'est plus requis pour garder l'élan).
