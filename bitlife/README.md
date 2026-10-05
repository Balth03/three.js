# BitLife Online 🧬

Simulateur de vie complet dans le navigateur, façon BitLife, en **diorama 3D** (Three.js). Jeu privé, pour deux.
Voir [`DESIGN.md`](DESIGN.md) pour la vision, la direction artistique, l'architecture et la feuille de route.

> **État : étape 1 (vertical slice).** Une vie complète de la naissance à la mort : création de personnage, avatar 3D qui grandit et vieillit, 8 dioramas (maison, appartement, école, université, bureau, hôpital, parc, cimetière), boucle « Vivre une année » avec ~100 événements bilingues, école → université → études sup, 39 métiers, relations (famille, amis, amour, mariage, bébés), argent, santé et maladies, mort et écran de fin, sauvegardes.

## Lancer le jeu

Prérequis : **Node.js ≥ 20** (22 conseillé) et un navigateur de bureau récent (Chrome, Edge ou Firefox).

```bash
git clone -b claude/optimistic-rubin-o745j6 https://github.com/Balth03/three.js bitlife-online
cd bitlife-online/bitlife
npm install
npm run dev
```

Puis ouvrir **http://localhost:5173**.

Version de production (fonctionne hors ligne une fois construite) :

```bash
npm run build
npm run preview
```

## Contrôles (clavier + souris)

| Touche | Action |
|---|---|
| `Espace` | Vivre une année / continuer |
| `1` `2` `3` `4` | Choix de l'événement |
| `Entrée` | Valider |
| `Tab` | Onglet suivant (Carrière, Biens, Relations, Activités) |
| `Échap` | Menu / fermer |
| `F` | Plein écran |
| `M` | Muet |
| `P` | Mode photo (masque l'interface) |
| Souris | Glisser = tourner autour du diorama, molette = zoom |

Paramètre d'URL utile : `?q=low|medium|high` (qualité graphique).

## Commandes de développement

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de dev (Vite) |
| `npm test` | Tests du moteur (Vitest) : déterminisme, 300 vies complètes, sauvegarde |
| `npm run typecheck` | Vérification TypeScript de tout le projet |
| `npm run validate` | Validation des données (textes FR/EN, jetons, chaînes, maladies…) |
| `npm run sim -- 2000` | Simulation de masse pour l'équilibrage (âge de mort, patrimoine, événements jamais vus…) |

## Architecture

```
bitlife/
  apps/client      Vite + TypeScript + Three.js + Preact (UI) + Web Audio
    src/three/     stage (rendu, post-process, caméra), dioramas (générés par code), avatar (personnage procédural)
    src/ui/        écrans et composants (HUD, cartes d'événement, onglets, modales)
    src/game.ts    contrôleur : relie le moteur, la 3D, l'audio et les sauvegardes
  apps/server      (étape 6 : salon privé à deux)
  packages/sim     moteur PUR, sans DOM, déterministe par seed — testé
  packages/shared  types partagés client/serveur (étape 6)
  data/            tout le contenu : pays, noms, métiers, études, maladies, actions, événements
  tools/           validate-data, mass-sim, shot (captures automatiques)
```

Le moteur ne connaît pas le contenu : `data/index.ts` assemble un objet `Content` passé à toutes les fonctions (`createLife`, `ageUp`, `choose`, `doAction`…). Une vie (`Life`) est un objet JSON — c'est la sauvegarde. Même seed + mêmes choix = même vie.

## Ajouter du contenu

### Un événement
Ajouter un objet dans un fichier de `data/events/` (ou créer un fichier et l'enregistrer dans `data/events/index.ts`) :

```ts
{
  id: 'ch_lost_tooth',                       // unique, préfixé par le fichier
  icon: '🦷', cat: 'child',
  scene: { place: 'home', mood: 'happy' },   // mise en scène 3D
  when: { age: [5, 8] },                     // conditions (âge, stats, flags, école, métier, rôles, traits…)
  weight: 10, once: true,
  actor: 'parent',                           // PNJ lié (optionnel)
  text: { fr: ['Tu as perdu ta première dent !'], en: ['You lost your first tooth!'] },   // 2e personne
  choices: [
    { label: { fr: 'Sous l\'oreiller', en: 'Under the pillow' },
      out: [
        { w: 3, text: { fr: 'J\'ai trouvé une pièce !', en: 'I found a coin!' }, fx: { happy: 5, money: 2 } },   // 1re personne
        { w: 1, text: { fr: 'La petite souris m\'a oublié{|e}.', en: 'The tooth fairy forgot me.' }, fx: { happy: -3 } },
      ] },
  ],
}
```

Mini-langage de texte : `{first}`, `{age}`, `{a.first}` (acteur), `{a.rel}` (« ta mère »), `{a.my}` (« ma mère »), `{$amount}` (argent), `{m|f}` (accord selon le genre du joueur, ex. `tombé{|e}`), `{a:il|elle}` (genre de l'acteur), `[[variante A|variante B]]`. Détails : `DESIGN.md` § 8. Puis `npm run validate`.

### Un métier
Dans `data/careers.ts` : titres par niveau (FR/EN, genrés avec `{|e}`), salaire de base (USD/an, converti par pays), prérequis (`edu`, `majors`, `program`, stats), lieu (diorama) et couleur de tenue.

### Un pays
Dans `data/countries.ts` (monnaie, taux, niveaux de prix et de salaires, impôts, espérance de vie, villes, écoles, entreprises) et ses noms dans `data/names.ts`.

### Une activité ou une interaction
`data/actions.ts` (onglets Activités, Carrière, École, Biens) et `data/relactions.ts` (interactions avec un PNJ).

## Captures

Les captures de fin d'étape sont dans `screenshots/`. Pour en générer : `npm run dev`, puis `node tools/shot.mjs screenshots/tmp/x.png`.
