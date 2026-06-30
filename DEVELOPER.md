# Guide développeur — PromptCost

Doc de référence pour comprendre, débugger et étendre le site (ajouter un geste,
une langue, une page, un mode…). À garder à jour quand l'archi change.

---

## 1. Stack & arborescence

- **Next.js 15** (App Router) · **React 19** · **TypeScript strict**
- **next-intl v3** (i18n, routing localisé `/fr` `/en`)
- **Tailwind v3** (thème par variables CSS) · **Framer Motion** (animations) · **Zustand** (état du jeu)
- **Vitest** (tests de la logique pure)

```
app/
  [locale]/
    layout.tsx              # <html>, thème no-flash, metadata home, providers
    page.tsx               # mode « Dépenser » (Game mode="spend")
    convertir/page.tsx     # mode « Convertir » (Game mode="reverse")
    combien/page.tsx       # index des comparaisons (SEO)
    combien/[action]/page.tsx  # 1 page par geste : « X = N prompts » (SEO)
    glossaire/page.tsx     # glossaire (SEO)
    comparatif|sources|methodologie|a-propos|mentions-legales/page.tsx
  api/og/route.tsx         # image OpenGraph dynamique (edge)
  sitemap.ts · robots.ts
components/
  game/      # Game, ModeToggle, MetricTabs, ScaleSelector, ActionGrid, TotalBar, Receipt, ResultCard, ReverseMode
  layout/    # Header, Footer, PageShell
  ui/        # ThemeProvider, ThemeToggle, LangSwitcher, Counter, Confetti, SiteFootprint
lib/
  data.ts    # ⭐ SOURCE DE VÉRITÉ (tous les chiffres)
  convert.ts # logique pure (testée)
  format.ts  # formatage localisé (testé)
  store.ts   # état Zustand
  seo.ts     # helper metadata (canonical, hreflang, OG)
i18n/        # routing + request config
messages/    # fr.json · en.json (toutes les chaînes)
```

**Règle d'or :** aucun nombre codé en dur dans les composants. Tout vient de `lib/data.ts`.

---

## 2. `lib/data.ts` — la source de vérité

| Export | Rôle |
|---|---|
| `PER` | coût d'**un prompt** par métrique (`elec` 0,3 Wh · `water` 0,3 mL · `co2` 0,2 g) |
| `PER_RANGE` | fourchettes affichées dans la méthodo |
| `PERSON_YEAR` | budget de prompts/an/personne (12 000) |
| `METRICS` / `METRIC_BY_ID` | les 3 métriques + emoji + **couleur d'accent** (clair/sombre, format `"R G B"`) |
| `SCALES` | échelles jouables (`population` = multiplicateur du budget) |
| `ACTIONS` | **les gestes** par métrique : `{ id, emoji, value, sourceId }` (`value` dans l'unité de base) |
| `ACTION_BY_ID` | accès direct à un geste par id (pour les pages `/combien`) |
| `SOURCES` / `SOURCE_BY_ID` | sources institutionnelles, avec `category` (`ai`/`elec`/`water`/`co2`) |
| `USAGE_TYPES` | mode inversé : types d'usage (texte/raisonnement/image/vidéo) + coût/requête |
| `EQUIV_DEEDS` | mode inversé : gestes « tu aurais pu… » (`kind`: `time`/`distance`/`count`) |
| `SITE_FOOTPRINT` | empreinte de création du site (bulle footer) |
| `DATA_AS_OF` | date de mise à jour des données |

Le fichier source des chiffres (recherche) est `Data.md`.

---

## 3. Recettes (how-to)

### ➕ Ajouter un geste
1. `lib/data.ts` → `ACTIONS[metric]` : `{ id: 'monGeste', emoji: '…', value: <unité de base>, sourceId: '…' }`
   (Wh pour elec, mL pour water, g CO₂e pour co2. `id` **unique toutes métriques confondues**.)
2. `messages/fr.json` **et** `en.json` → `actions.monGeste` = libellé.
3. (si nouvelle source) voir « Ajouter une source ».
Le geste apparaît automatiquement dans la grille, le tri par coût, la facture, et une page `/combien/monGeste` est générée.

### ➕ Ajouter une source
1. `lib/data.ts` → `SOURCES` : `{ id, category, label, url? }`.
2. Référence-la via `sourceId` sur le geste. Elle s'affiche sur `/sources` (groupée) et au survol du coût du geste.

### 🌍 Ajouter une langue
1. `i18n/routing.ts` → ajouter le code dans `locales`.
2. Créer `messages/<code>.json` (copier `fr.json`, tout traduire).
3. Vérifier `app/[locale]/layout.tsx` (`locale === 'fr' ? 'fr_FR' : …`) et `lib/seo.ts` / `api/og` (`lang`) si on veut un mapping fin.
4. `next-intl` charge la langue via `i18n/request.ts`. hreflang + sitemap se mettent à jour seuls (basés sur `routing.locales`).

### 📄 Ajouter une page de contenu
1. `app/[locale]/<slug>/page.tsx` : `setRequestLocale(locale)`, envelopper dans `<PageShell title intro>`.
2. `generateMetadata` → utiliser `buildMetadata({ locale, path, title, description })` (`lib/seo.ts`) pour canonical + hreflang + OG.
3. Ajouter `<slug>` à `PATHS` dans `app/sitemap.ts`, et un lien dans `components/layout/Footer.tsx` (+ labels `footer.*`).
Les slugs ne sont **pas** traduits (mêmes URLs en `/fr` et `/en`), comme le reste du site.

### 🎮 Ajouter un mode de jeu
1. Créer sa page `app/[locale]/<mode>/page.tsx` rendant `<Game mode="…">` ou un composant dédié.
2. `components/game/ModeToggle.tsx` → ajouter `{ href, label, Icon }` dans `items` (segmenté mobile + rail desktop se mettent à jour seuls).
3. Ajouter les libellés dans `reverse.tab*` / une clé dédiée + le `meta.<mode>`.

### 🔢 Changer une valeur de référence
- Coût d'un prompt : `PER`. Budget : `PERSON_YEAR`. Échelles : `SCALES[].population`.
- Tout se recalcule (factures, jauges, comparaisons, mode inversé).

---

## 4. Mode inversé (`/convertir`)

- **Saisie** : `USAGE_TYPES` (texte/raisonnement/image/vidéo), nombre de requêtes par type (`store.usage`).
- **Total** : `convert.usageTotals(usage, USAGE_TYPES)` → conso par métrique.
- **Résultat** : 3 cartes (1 par métrique). Chaque carte tire un `EQUIV_DEEDS` de cette métrique.
  - `kind: 'time'` → `perUnit` = coût d'**une heure** → `format.splitDuration` (s/min/h/jours/ans), libellé `reverse.deeds.<id>` avec `{d}`.
  - `kind: 'distance'` → `perUnit` = coût d'**un km** → `format.splitDistance` (m/km), `{d}`.
  - `kind: 'count'` → `perUnit` = coût d'**une occurrence** → `{q}` (nombre).
- **« Un autre »** retire un nouveau geste par métrique (aléatoire, lisible).

Ajouter un « tu aurais pu… » : `EQUIV_DEEDS` + `reverse.deeds.<id>` (+ `reverse.durationUnits`/`distanceUnits` si nouvelle unité).

---

## 5. Conventions

- 🚫 **Tiret cadratin `—` interdit** partout. Utiliser `:` (FR : espace avant) ou une virgule. Vérifier avec une recherche de `—`.
- **Accent dynamique** : la variable CSS `--accent` suit la métrique + le thème (posée en JS dans `Game`). Classes `text-accent`, `bg-accent`, `bg-accent-soft`. Sur les pages statiques, l'accent reste celui par défaut (ambre).
- **Nombres** : classe `.num` (tabular-nums). Formatage **toujours** via `lib/format.ts` (`formatCompact`, `formatInt`, `formatQty`, `formatPercent`, `formatYears`, `splitDuration`, `splitDistance`).
- **Pluriels** : ICU dans les messages (`{count, plural, one {…} other {…}}`).
- **Thème** : `ThemeProvider` + script inline no-flash dans `layout.tsx` (`localStorage 'pc-theme'`).
- **Accessibilité** : `aria-label` sur les boutons icônes, `prefers-reduced-motion` respecté (ex. `SiteFootprint`).

---

## 6. Logique pure & tests

`lib/convert.ts` (testé `lib/convert.test.ts`) et `lib/format.ts` (testé `lib/format.test.ts`) ne dépendent d'aucun composant.

- `promptsForAction(value, metric, population)` · `budget(pop)` · `totalPrompts(items, metric, pop)` · `yearsOfAI(spent, pop)`
- `usageTotals(counts, types)` · `tierTotals` · `pickEquivalent`
- `splitDuration(hours)` · `splitDistance(km)` · `formatCompact` (paliers FR `Md` / EN `M·B·T`)

Toute modif de ces fonctions → ajouter/mettre à jour un test.

---

## 7. Partage & SEO

- **OG dynamique** : `app/api/og/route.tsx` accepte `years, count, metric, scale, lang`. La carte de bilan (`ResultCard`) construit l'URL + propose X/WhatsApp/LinkedIn + téléchargement PNG.
- **Metadata** : toujours via `buildMetadata` (`lib/seo.ts`).
- **Pages SEO** : `/combien` (index), `/combien/[action]` (1 par geste), `/glossaire`. Régénérées automatiquement à partir de `ACTIONS`.

---

## 8. Commandes

```bash
npm run dev     # http://localhost:3000
npm run build   # build prod (génère toutes les pages statiques)
npx vitest run  # tests
npx tsc --noEmit
```

> ⚠️ Ne pas lancer `npm run build` pendant que `npm run dev` tourne (conflit `.next`).
