# BitLife Online 🧬

Simulateur de vie complet dans le navigateur, façon BitLife, en **diorama 3D** (Three.js). Jeu privé, pour deux.
Voir [`DESIGN.md`](DESIGN.md) pour la vision, la direction artistique, l'architecture et la feuille de route.

> **État : version complète (étapes 1 → 7) + extras.** Une vie de la naissance à la mort (et au-delà) dans un diorama 3D qui suit l'âge : **1 700+ événements** bilingues (avec un niveau **Trash** activé par défaut), **114 métiers** (dont carrières spéciales : mafia, espion, hacker, gourou, influenceur, politicien…), **14 pays**, **55 maladies**, **44 crimes** avec procès/prison/évasion, **230+ activités** (30+ par onglet) et **44 interactions**, immobilier, voitures, bourse, prêts, entreprise, **174 succès**, dynasties (jouer ses enfants), époques, scénarios et défis, **mini-jeux** (casse, fuite, évasion, procès, blackjack, chirurgie, cuisine, match, interrogatoire, plaidoirie), cinématiques, mode photo, rétrospective… et le **mode à deux** en salon privé.

### Ce qui va plus loin que BitLife
- **Mode à deux** : vies parallèles (se rencontrer, se marier, faire des bébés ensemble… ou s'empoisonner), **vie commune** (une vie, deux joueurs qui votent), **versus** (même graine, duels avec mise), **coop** (objectifs communs). Chat et émotes.
- **Le Torchon** : la une du journal à scandale sur ta vie, et ta nécrologie avec les témoignages (pas toujours tendres) de tes proches.
- **Mode fantôme** : après la mort, hante tes proches pendant 10 ans (BOUH, possession, cauchemars sanglants, numéros du loto…).
- **Réincarnation** selon le karma (un saint renaît riche dans un pays riche, une ordure… pas).
- **Album souvenirs** : photos du diorama prises automatiquement aux grands moments (et aux moments gore).
- **Rencontres façon appli** (swipe gauche/droite, bios douteuses), **photo d'identité judiciaire** à l'arrestation, **Vie du jour** (même départ pour tout le monde chaque jour, pour comparer vos scores).
- Modes Classique / Zen / Chaos / Hardcore / Dieu, années de naissance de 1950 à 2060 avec événements d'époque.

## Lancer le jeu

Prérequis : **Node.js ≥ 20** (22 conseillé) et un navigateur de bureau récent (Chrome, Edge ou Firefox).

```bash
git clone -b claude/optimistic-rubin-o745j6 https://github.com/Balth03/three.js bitlife-online
cd bitlife-online/bitlife
npm install
npm run dev
```

Puis ouvrir **http://localhost:5173**.

### Jouer à deux

Sur **un** des deux ordinateurs :

```bash
npm run duo
```

Le serveur construit le jeu, puis affiche une adresse (ex. `http://192.168.1.20:8787`). Ouvrez-la **sur les deux ordinateurs** (même réseau local ; à distance, une redirection de port ou un tunnel type Tailscale/ngrok suffit), cliquez **« 💞 Jouer à deux »**, l'un crée le salon, l'autre entre le code à 4 lettres. Les salons survivent à un redémarrage du serveur (fichier `apps/server/data/rooms.json`).

En développement : `npm run dev` + `npm run server` (le client sur le port 5173 se connecte automatiquement au serveur sur 8787).

Version de production (fonctionne hors ligne une fois construite) :

```bash
npm run build
npm run preview
```

## Contrôles (clavier + souris)

| Touche | Action |
|---|---|
| `Espace` | Vivre une année / continuer |
| `1` … `7` | Choix de l'événement |
| `Entrée` | Valider |
| `Tab` | Onglet suivant (Carrière, Biens, Relations, Activités) |
| `Échap` | Menu / fermer |
| `F` | Plein écran |
| `M` | Muet |
| `P` | Mode photo (masque l'interface) |
| Souris | Glisser = tourner autour du diorama, molette = zoom |

Toutes les touches sont **reconfigurables** : Options → Raccourcis clavier.

Paramètres d'URL utiles : `?q=low|medium|high` (qualité graphique), `?server=http://hote:8787` (serveur à deux ailleurs).

Niveau de contenu : Options → Contenu (**Tout public**, **Adulte**, **🔥 Trash** par défaut).

## Commandes de développement

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de dev (Vite) |
| `npm test` | Tests du moteur (Vitest) : déterminisme, 300 vies complètes, crime/prison/dynastie, fantôme/réincarnation, sauvegarde |
| `npm run duo` | Construit le client et lance le serveur à deux (port 8787) |
| `npm run server` | Lance seulement le serveur à deux |
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
  apps/server      serveur à deux (Node + ws) : salons, relais ordonné des opérations, votes, sert le client construit
  packages/sim     moteur PUR, sans DOM, déterministe par seed — testé
  packages/shared  protocole réseau partagé client/serveur
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

Chaque événement / choix / issue peut porter un `rating` (0 tout public, 1 adulte, 2 trash). Guide complet de rédaction : `data/WRITING_GUIDE.md`.

Mini-langage de texte : `{first}`, `{age}`, `{a.first}` (acteur), `{a.rel}` (« ta mère »), `{a.my}` (« ma mère »), `{$amount}` (argent), `{m|f}` (accord selon le genre du joueur, ex. `tombé{|e}`), `{a:il|elle}` (genre de l'acteur), `[[variante A|variante B]]`. Détails : `DESIGN.md` § 8. Puis `npm run validate`.

### Un métier
Dans `data/careers.ts` : titres par niveau (FR/EN, genrés avec `{|e}`), salaire de base (USD/an, converti par pays), prérequis (`edu`, `majors`, `program`, stats), lieu (diorama) et couleur de tenue.

### Un pays
Dans `data/countries.ts` (monnaie, taux, niveaux de prix et de salaires, impôts, espérance de vie, villes, écoles, entreprises) et ses noms dans `data/names.ts`.

### Une activité ou une interaction
`data/actions*.ts` (onglets Activités, Carrière, École, Biens, Relations, Prison) et `data/relactions*.ts` (interactions avec un PNJ). Les crimes sont dans `data/crimes.ts`, les biens et actions en bourse dans `data/economy.ts`, les succès / événements mondiaux / scénarios / défis dans `data/meta.ts`.

## Captures

Les captures de fin d'étape sont dans `screenshots/`. Pour en générer : `npm run dev`, puis `node tools/shot.mjs screenshots/tmp/x.png`.
