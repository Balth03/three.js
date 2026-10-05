# NEON·TAG

Laser game 3D en vue subjective, dans le navigateur. Arène néon-UV, brouillard, lasers, gilets qui s'illuminent, musique synthwave générée en direct. Solo contre bots pour l'instant, en ligne à l'étape 4.

Tout (géométrie, textures, sons, musique) est généré par code : aucun asset externe.

> Le design complet, la direction artistique et le plan par étapes sont dans [`DESIGN.md`](DESIGN.md).

## Lancer le jeu

Prérequis : **Node.js 20+** et un navigateur récent avec WebGL2 (Chrome, Edge, Firefox).

```bash
git clone https://github.com/balth03/three.js.git
cd three.js
git checkout claude/nifty-babbage-s0j5fv
cd lasertag
npm install --legacy-peer-deps
npm run dev
```

Ouvre ensuite **http://localhost:5173** et clique sur **JOUER**.

Version de production (fichiers statiques dans `apps/client/dist`, jouable hors-ligne) :

```bash
npm run build
npm run preview
```

## Contrôles

| Action | Clavier / souris | Manette |
|---|---|---|
| Se déplacer | `ZQSD` (AZERTY) ou `WASD` (QWERTY), détecté automatiquement | Stick gauche |
| Viser | Souris | Stick droit |
| Tirer | Clic gauche | RT |
| Visée précise | Clic droit | LT |
| Sprint | `Maj` | L3 |
| Sauter | `Espace` | A |
| S'accroupir / glisser (en sprint) | `Ctrl` ou `C` | B |
| Purger la chaleur | `R` | X |
| Scores | `Tab` | Back |
| Pause | `Échap` | Start |
| Debug (FPS, draw calls…) | `F3` | |

Sensibilité, FOV, qualité graphique, volumes, difficulté et taille des équipes sont dans **Options**.

## Structure

```
lasertag/
  apps/client       Vite + TypeScript + Three.js : rendu, audio, input, HUD/menus
  apps/server       (étape 4) serveur autoritaire Node
  packages/shared   simulation déterministe partagée : mouvement (Rapier KCC), tir, gilets,
                    modes, navigation et IA des bots. Tourne dans le navigateur ET dans Node.
  tools/            générateur + validateur de cartes, match de bots headless, test navigateur
  data/             TOUTES les valeurs d'équilibrage (armes, gilet, mouvement, modes, bots, cartes)
```

## Commandes utiles

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de dev (rechargement à chaud) |
| `npm run typecheck` | vérification TypeScript stricte |
| `npm test` | tests unitaires (hitboxes, mouvement, cadence de tir, déterminisme…) |
| `npm run map:build` | régénère `data/maps/maze.json` depuis `tools/maps/build-maze.ts` |
| `npm run map:validate` | valide toutes les cartes (spawns, atteignabilité, symétrie) |
| `npm run sim:match -- 3 4 pro` | 3 matchs headless 4v4 de bots « Pro » + stats d'équilibrage |
| `node tools/browser/shoot.mjs` | test navigateur automatisé + captures dans `screenshots/` |

## Ajouter du contenu

**Une arme** : copier `data/weapons/photon7.json` (cadence, dégâts par zone, énergie, chaleur, dispersion, recul), l'enregistrer dans `packages/shared/src/data.ts` (`WEAPONS`). La simulation lit tout depuis la définition.

**Une carte** : écrire un générateur sur le modèle de `tools/maps/build-maze.ts` (on décrit une moitié, le script la reflète), ou écrire directement le JSON (format décrit dans `packages/shared/src/map/types.ts` : boîtes, rampes, zones, spawns, lumières, panneaux, points chauds pour les bots). L'enregistrer dans `MAPS`, puis `npm run map:validate`. Les colliders, le rendu et la grille de navigation sont générés depuis ce même fichier.

**Un mode** : ajouter `data/modes/<id>.json` et une classe sur le modèle de `packages/shared/src/modes/tdm.ts` (`update`, `onDeactivation`, phases).

## État : étape 1 (vertical slice)

The Maze, blaster Photon-7, mouvement complet (sprint, saut, glissade, accroupi), tir hitscan avec zones du gilet, désactivation/réactivation, bots avec navigation et personnalités, TDM, musique adaptative, SFX, annonceur, HUD, scores, écran de fin. Les étapes suivantes sont décrites dans `DESIGN.md` §10.
