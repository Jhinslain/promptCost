# PromptCost

> Combien consomme *vraiment* un prompt IA ? Un site ludique qui te donne un « budget » de prompts (l'usage annuel d'une personne… ou du monde) et te le fait dépenser en gestes du quotidien (douche, four, vol en avion). On comprend en 5 secondes : un prompt est minuscule — c'est l'échelle qui compte.

Construit à partir de [`SPEC.md`](./SPEC.md). Ton **curieux et honnête, jamais militant** : les chiffres sourcés font le travail.

## Stack

- **Next.js 15** (App Router) · React 19 · TypeScript strict
- **Tailwind CSS** + CSS variables (theming clair/sombre + accent par métrique)
- **Framer Motion** (compteurs, transitions de couleur, confettis)
- **next-intl** (FR / EN, routing `/fr` `/en`, détection géo via middleware)
- **Zustand** (état du jeu)
- **next/og** (carte de score OG dynamique)
- **Vitest** (logique de conversion testée à 100 %)

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000 → redirige vers /fr ou /en
npm run build    # build de production
npm test         # tests de conversion
```

## Architecture

```
app/[locale]/         # one-page (jeu) + comparatif, sources, methodologie, a-propos, mentions-legales
app/api/og/           # carte de score OG dynamique
app/sitemap.ts        # sitemap multilingue (hreflang)
app/robots.ts
components/game/       # Game, TotalBar, ScaleSelector, MetricTabs, ActionList, ResultCard
components/ui/         # ThemeProvider/Toggle, LangSwitcher, Counter, Confetti
components/layout/     # Header, Footer, PageShell
components/comparatif/ # VersusBlock
lib/data.ts           # ⭐ SOURCE DE VÉRITÉ : per-prompt, gestes, échelles, sources
lib/convert.ts        # logique pure (testée)
lib/format.ts         # formatage localisé + notation compacte (96 Md)
lib/store.ts          # Zustand
messages/{fr,en}.json # toutes les strings
i18n/                 # routing + request config next-intl
middleware.ts         # détection langue
```

**Règle d'or :** aucune valeur chiffrée en dur dans les composants. Tout vient de `lib/data.ts`, chaque valeur avec son `sourceId`.

## Modèle de calcul

```
PER = { elec: 0.3 Wh, water: 0.3 mL, co2: 0.2 g }   // coût d'un prompt
PERSON_YEAR = 12 000                                 // hypothèse usage intensif
budget(population)            = PERSON_YEAR × population
promptsForAction(value, m, p) = value / PER[m] × population
```

Les ratios entre gestes restent constants quelle que soit l'échelle → toujours jouable, mais les totaux deviennent vertigineux (monde = 96 000 milliards de prompts).

## Roadmap v2 (non implémentée — voir SPEC.md §12)

**Comparatif poussé & dynamique**
- **Recherche live** : l'utilisateur tape une requête → recherche Google classique vs réponse IA lancées en parallèle, coût estimé de chaque approche en direct.
- **Image** : chercher une image existante vs **générer réellement** une image par IA dans la page (API de génération), avec mesure du coût.
- **Comparateur libre** : saisir n'importe quelle action ou un nombre de prompts → toutes les équivalences avec graphiques.
- **Profils d'usage réels** (codeur, étudiant, rédacteur…).

**Visualisations & données vivantes**
- Graphiques animés (barres/bulles), timeline « ta journée numérique ».
- Intensité carbone du réseau en temps réel par pays (API type Electricity Maps).
- Pré-réglage géo de l'échelle « pays » selon la population locale détectée.

**Diffusion**
- Plus de langues, plus de gestes, catégories (transport, maison, alimentation, numérique).
- Widget embarquable (`<iframe>`) pour blogs/médias → backlinks SEO.
- Partage enrichi (carte animée / petite vidéo).
- Deep-link d'état dans l'URL (`?scale=world&metric=water`).
- Analytics sans cookie (Plausible / Vercel) : events `metric_change`, `scale_change`, `goal_reached`, `share_click`.

## Questions ouvertes (SPEC.md §14)

1. Nom de domaine définitif (placeholder actuel : `promptcost.app`).
2. Échelle « pays » fixe (France) ou adaptative selon la géo.
3. `PERSON_YEAR = 12 000` à confirmer comme hypothèse « usage intensif ».
4. Analytics : Plausible vs Vercel Analytics.
5. Widget embarquable en v1 ou v2.

---

Un projet [Majoli](https://majoli.io). Données indicatives — ordres de grandeur sourcés.
