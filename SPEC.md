# Spec produit & technique : « 1 Prompt = ? »
> Document de cadrage destiné à **Claude Code**. Objectif : construire un site web moderne, interactif et pédagogique qui met en perspective le coût environnemental réel d'un prompt IA en le comparant aux gestes du quotidien.
>
> **Nom de travail :** `[NOM_DU_SITE]` (à trancher : pistes : *PromptCost*, *1 Prompt =*, *DropByPrompt*). Remplacer partout avant le build.
> **Langues v1 :** Français + Anglais (système extensible).
> **Hébergement cible :** Vercel : Next.js App Router + middleware (détection géo serveur).
> **Comparatif :** version minimale en v1, version poussée détaillée en v2 (voir §12).

---

## 1. Vision & message

Projet à construire **à partir de zéro** en Next.js, avec une UI/UX très soignée. (Aucun code existant à reprendre : cette spec est la seule source.)

**Pitch :** on donne à l'utilisateur un « budget » de prompts IA (l'usage annuel d'une personne… ou du monde entier), et il le « dépense » en gestes du quotidien (douche, four, vol en avion…). Il réalise tout seul qu'un prompt est minuscule : c'est l'échelle qui compte.

**Ton :** curieux et honnête, **jamais militant**. Les chiffres bruts et les sources font le travail. Un sceptique qui creuse doit trouver des sources sérieuses, pas un parti pris.

**Principes UX :**
- **Mobile-first**, pensé pour le pouce.
- **Très peu de texte** → tout passe par des icônes, emojis, chiffres et animations. Traduisible en changeant un seul fichier de strings.
- **Intuitif** : on comprend en 5 secondes, sans tutoriel.
- **Ludique** : objectif, surprise, score partageable, rejouabilité.

---

## 2. Stack technique

| Domaine | Choix |
|---|---|
| Framework | **Next.js 14+ (App Router)**, React 18, TypeScript strict |
| Styling | **Tailwind CSS** + CSS variables pour le theming (couleur d'onglet + dark/light) |
| Animations | **Framer Motion** (compteurs, transitions de couleur, apparition des éléments, confettis) |
| i18n | **next-intl** (routing `/fr`, `/en`, SEO-friendly, messages JSON par langue) |
| Icônes | Emojis natifs (universels, zéro poids) + **lucide-react** pour l'UI (réglages, partage…) |
| State | React state local + **Zustand** (léger) pour le panier de gestes / échelle / onglet |
| OG images | **@vercel/og** (carte de score dynamique générée par requête) |
| Analytics | **Vercel Analytics** ou **Plausible** (sans cookie, RGPD-friendly) |
| Tests | Vitest (logique de conversion) + Playwright (parcours clé) |
| Lint/format | ESLint + Prettier |
| Déploiement | Vercel (preview par PR) |

---

## 3. Architecture & arborescence

```
/app
  /[locale]
    layout.tsx            # <html lang>, thème, providers i18n, metadata de base
    page.tsx              # One-page principale (le jeu)
    /comparatif
      page.tsx            # Page comparatif (v1 minimale)
    /sources
      page.tsx            # Toutes les sources + méthodologie courte
    /methodologie
      page.tsx            # Détail des calculs (SEO long-tail)
    /a-propos
      page.tsx
    /mentions-legales
      page.tsx
    sitemap.ts            # Sitemap multilingue (hreflang)
    robots.ts
  /api/og/route.tsx       # Génération carte OG dynamique
/components
  /game                   # GameBudget, ScaleSelector, MetricTabs, ActionRow, ProgressBar, ResultCard, ShareButton
  /ui                     # ThemeToggle, LangSwitcher, Counter (animé), Sheet/Modal, Toast, Confetti
  /comparatif             # ComparisonCard, VersusBlock
  /layout                 # Header, Footer
/lib
  data.ts                 # SOURCE DE VÉRITÉ : baseline par prompt + activités + sources (§7)
  convert.ts              # Logique pure de conversion (testée)
  format.ts               # Formatage localisé des nombres (+ notation compacte pour les énormes)
  store.ts                # Zustand
/messages
  fr.json                 # Toutes les strings FR
  en.json                 # Toutes les strings EN
/middleware.ts            # Détection géo → redirection langue par défaut
```

**Règle d'or :** aucune valeur chiffrée codée en dur dans les composants. Tout vient de `/lib/data.ts`. Chaque valeur porte sa source.

---

## 4. Design system

### Thème (clair / sombre)
- Détecté via `prefers-color-scheme`, surchargeable par un **toggle** (persisté en `localStorage`, sans flash : script inline dans `<head>` ou `next-themes`).
- Tokens en CSS variables : `--bg`, `--surface`, `--text`, `--muted`, `--line`, `--accent`.

### Couleur par onglet (identité forte)
La couleur d'accent **change selon la métrique active**, avec **transition douce** (Framer Motion / CSS transition sur les variables) :

| Onglet | Emoji | Accent (clair) | Accent (sombre) |
|---|---|---|---|
| Électricité | ⚡ | `#f5a623` (ambre) | `#ffd166` |
| Eau | 💧 | `#2f9bff` (bleu) | `#5cc8ff` |
| CO₂ | 🌍 | `#16a34a` (vert) | `#34d399` |

Le changement d'onglet **anime tout l'accent** (barre de progression, boutons, chips, halos) : c'est une signature visuelle du site.

### Typographie & layout
- Police variable moderne (Inter / Geist). Gros chiffres en `font-weight: 800`, `letter-spacing` serré.
- Conteneur max ~760px centré. Touch targets ≥ 44px. Coins arrondis généreux (16–22px).
- **Mobile-first** : barre de total **sticky** en haut, liste scrollable, modals plein écran sur mobile.

### Motion (détails qui comptent)
- **Compteur animé** (ease-out cubic) à chaque ajout.
- **Barre de progression** fluide + pulsation quand on dépasse 100 %.
- **Apparition** des lignes en stagger léger.
- **Confettis** + petit *toast* au passage d'un palier / objectif atteint.
- **Haptique** sur mobile (`navigator.vibrate`) au franchissement de l'objectif.
- **Respect de `prefers-reduced-motion`** : désactive les animations non essentielles.
- Option **son** discret (toggle, off par défaut) sur les paliers.

---

## 5. La page principale (one-page)

Structure verticale :

1. **Header** : logo/nom, `LangSwitcher`, `ThemeToggle`, bouton `ⓘ` (méthodologie courte).
2. **Barre de total (sticky)** : objectif (« 1 an d'IA de [échelle] » = N prompts), **barre de progression**, total dépensé / objectif, % puis « X années d'IA » une fois dépassé.
3. **Sélecteur d'échelle** (chips) : 🧍 toi · 👥 100 personnes · 🏙️ une ville · 🇫🇷 [pays] · 🌍 le monde.
   *Mécanique :* `budget = 12 000 prompts/personne/an × population`. Chaque geste = « fait une fois par tout le groupe », donc son coût est aussi × population. **Les ratios restent constants** → toujours jouable, mais les nombres deviennent vertigineux (monde = 96 000 milliards de prompts).
4. **Onglets métrique** : ⚡ / 💧 / 🌍 (change la couleur + la liste + les conversions).
5. **Liste d'actions** triée par coût croissant : emoji, label court, coût en prompts, stepper `− / +`.
6. **Carte de bilan** (modal) au franchissement de l'objectif : « En X gestes tu as dépensé Y années d'IA de [échelle] » + **Partager** (Web Share API + fallback presse-papier) + Continuer.
7. **Footer** (voir §8).

### Logique de conversion (`/lib/convert.ts`, pure & testée)
```
promptsForAction(value, metric, populationMultiplier) = value / PER[metric] * populationMultiplier
budget(populationMultiplier) = PERSON_YEAR * populationMultiplier   // PERSON_YEAR = 12 000
```
`PER = { elec: 0.3 Wh, water: 0.3 mL, co2: 0.2 g }` (voir §7).

---

## 6. i18n, géo & SEO

### Routing & langues
- URLs localisées : `example.com/fr`, `example.com/en` (+ pages : `/fr/comparatif`, `/en/comparison`…).
- **next-intl** : un fichier `messages/{locale}.json` par langue, structure plate et courte (peu de texte → trad facile).
- **Détection géo** via `middleware.ts` : à la racine `/`, lire `Accept-Language` (et l'en-tête géo Vercel si dispo) → redirect 307 vers la langue adaptée. L'utilisateur peut toujours forcer via le `LangSwitcher` (persisté).

### SEO (exigence forte)
- **`hreflang`** réciproques entre toutes les langues + `x-default`.
- **Metadata par page et par langue** : title, description, OpenGraph, Twitter Card, canonical.
- **`sitemap.ts`** multilingue + **`robots.ts`**.
- **JSON-LD (structured data)** : `WebApplication` sur la home, `FAQPage` sur méthodologie/sources, `BreadcrumbList`.
- **OG image dynamique** (`/api/og`) : carte de score partageable (chiffre + échelle + couleur d'onglet).
- **Mots-clés cibles** (à placer dans titres, h1/h2, FAQ : sobrement, sans bourrage) :
  `consommation ChatGPT`, `coût d'un prompt IA`, `empreinte IA eau électricité CO2`, `combien consomme une IA`, `AI energy use per prompt`, `ChatGPT water usage`, `is AI bad for the environment`, `prompt carbon footprint`.
- **Performance = SEO** : viser Lighthouse 95+ (LCP, CLS, INP). SSG des pages, images optimisées, pas de JS bloquant.
- **Accessibilité** : contrastes AA dans les deux thèmes, navigation clavier, `aria-label` sur steppers/boutons, focus visibles.

### Pages SEO du footer
Chaque page = contenu indexable + maillage interne (bon pour le SEO d'un one-page sinon trop léger) :
- `/sources` : liste complète et cliquable de toutes les sources (§7).
- `/methodologie` : comment chaque chiffre est calculé, fourchettes, hypothèses (réseau électrique, eau directe vs amont, eau « virtuelle » des aliments). Format FAQ → JSON-LD.
- `/a-propos` : le pourquoi du projet.
- `/mentions-legales` : légal + politique analytics sans cookie.

---

## 7. Données (source de vérité) : `/lib/data.ts`

> Chiffres issus d'une recherche croisée (2025-2026). Chaque entrée doit embarquer `value`, `unit`, `sourceId`. Les `sourceId` pointent vers le tableau `SOURCES` en bas.

### Référence par prompt (requête texte moyenne, modèle type GPT-4o)
| Métrique | Valeur retenue | Fourchette crédible | Notes |
|---|---|---|---|
| Énergie | **0,3 Wh** | 0,24–0,4 Wh | Médiane : Google Gemini 0,24 · Epoch AI 0,30 · OpenAI 0,34. Requêtes « raisonnement » : ~20 Wh+. |
| Eau | **0,3 mL** (refroidissement direct) | 0,26–0,32 mL direct ; ~1,5 mL avec l'amont électrique | Google 0,26 mL · OpenAI 0,32 mL. |
| CO₂ | **0,2 g** | ~0,15 g opérationnel (réseau mondial ~480 g/kWh) → ~1 g en analyse cycle de vie | Dérivé de 0,3 Wh × intensité réseau. |

### Activités : Électricité (Wh)
| Action | Emoji | Wh | sourceId |
|---|---|---|---|
| Aspirateur 10 min | 🧹 | 165 | energyusecalculator |
| Bouilloire (1 tasse) | ☕ | 22 | energybot |
| 1 h de Netflix (TV) | 📺 | 135 | iea-streaming |
| 1 lessive | 👕 | 600 | energysage |
| Sèche-cheveux 10 min | 💇 | 250 | energysage |
| 1 h gaming PC | 🎮 | 400 | nexamp |
| Lave-vaisselle | 🍽️ | 1200 | bkvenergy |
| Micro-ondes 5 min | ♨️ | 90 | energysage |
| Four 1 h | 🔥 | 2100 | directenergy |
| Charger un smartphone | 📱 | 17 | energyusecalculator |
| 2 toasts | 🍞 | 75 | energybot |
| Ampoule LED 1 h | 💡 | 10 | energyusecalculator |

### Activités : Eau (mL ; aliments = empreinte « virtuelle » production comprise)
| Action | Emoji | mL | sourceId |
|---|---|---|---|
| Douche 5 min | 🚿 | 75 000 | watercalculator |
| Un bain | 🛁 | 150 000 | watercalculator |
| 1 chasse d'eau | 🚽 | 6 000 | epa-watersense |
| 1 burger (total) | 🍔 | 2 500 000 | watercalculator-food |
| Brossage de dents (robinet) | 🪥 | 6 000 | watercalculator |
| 1 lessive (eau) | 👕 | 50 000 | watercalculator |
| 1 café (culture) | ☕ | 140 000 | wfn-hoekstra |
| 1 pomme | 🍎 | 70 000 | watercalculator-food |
| 1 tomate | 🍅 | 13 000 | watercalculator-food |
| 1 amande | 🌰 | 12 000 | wfn-almond |
| 1 verre d'eau | 🥤 | 250 | watercalculator |
| 1 assiette de pâtes | 🍝 | 165 000 | utwente-pasta |

### Activités : CO₂ (g CO₂e)
| Action | Emoji | g | sourceId |
|---|---|---|---|
| 1 km en voiture | 🚗 | 170 | owid-transport |
| 1 km en bus | 🚌 | 100 | owid-transport |
| 1 km en train | 🚆 | 35 | owid-transport |
| 1 burger de bœuf | 🍔 | 3 500 | owid-meat |
| Vol Paris→New York (aller) | ✈️ | 500 000 | curb6-flight |
| 1 email + pièce jointe | 📧 | 50 | berners-lee |
| 1 steak de bœuf | 🥩 | 7 000 | owid-meat |
| 1 jean (fabrication) | 👖 | 16 400 | carbonfact-jeans |
| 1 t-shirt (fabrication) | 👕 | 4 000 | carbonfact-tshirt |
| 1 café | ☕ | 50 | 8billiontrees |
| 1 h vidéo mobile | 📱 | 36 | energise |
| Fabriquer 1 smartphone | 🔋 | 60 000 | apple-lca |

### SOURCES (à afficher sur `/sources`)
- **Epoch AI** : énergie par requête ChatGPT : https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use
- **Google Cloud** : impact environnemental de l'inférence (0,24 Wh / 0,26 mL) : https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference
- **OpenAI / Sam Altman** : « The Gentle Singularity » (0,34 Wh / 0,32 mL) : https://blog.samaltman.com/the-gentle-singularity
- **« How Hungry is AI? »** (arXiv 2505.09598) : https://arxiv.org/abs/2505.09598
- **IEA** : Energy and AI : https://www.iea.org/reports/energy-and-ai
- **EcoLogits / GenAI Impact** : https://ecologits.ai/
- **Our World in Data** : transport & alimentation : https://ourworldindata.org/travel-carbon-footprint · https://ourworldindata.org/less-meat-or-sustainable-meat
- **Water Footprint Network / watercalculator.org** : https://watercalculator.org/water-footprint-of-food-guide/
- **EPA WaterSense** : https://www.epa.gov/watersense
- **Mike Berners-Lee : « How Bad Are Bananas? »** (email/numérique)
- **Carbonfact** (jean, t-shirt) : https://www.carbonfact.com/
- Sites énergie (energysage, energyusecalculator, energybot, directenergy, nexamp, bkvenergy) pour les appareils ménagers.

> ⚠️ Préciser visiblement : aliments/objets = **empreinte eau & CO₂ « virtuelle »** (production comprise), pas l'eau du robinet. Honnêteté = crédibilité.

---

## 8. Footer

- Liens : Comparatif · Sources · Méthodologie · À propos · Mentions légales.
- `LangSwitcher` + `ThemeToggle` (rappel).
- Badge « empreinte de ce site » (clin d'œil transparent).
- Petit bloc de maillage interne (bon SEO).

---

## 9. Page Comparatif : v1 (minimale)

Objectif : montrer **côte à côte**, de façon claire, le « classique » vs « l'IA » sur 2-3 cas phares. Données **statiques et sourcées** (pas de live en v1).

Cas v1 (composant `VersusBlock` : gauche vs droite, barres proportionnelles + chiffres + verdict) :
1. **Recherche Google vs requête IA texte** (énergie). Message nuancé : ordres de grandeur comparables selon les sources : présenter la fourchette honnêtement, sans trancher abusivement.
2. **Image téléchargée (existante) vs image générée par IA** (énergie). Génération ≈ 20–40× une requête texte (~6–12 Wh) ; télécharger une image ≈ quasi nul.
3. **(optionnel) 1 min de vidéo en streaming vs 1 prompt texte.**

Chaque bloc : 2 colonnes animées, couleur selon métrique, source en pied, micro-conclusion d'une ligne. Tout le reste → v2 (§12).

---

## 10. Mes idées en plus (à valider)

- **Carte de score OG dynamique** : chaque résultat génère une image partageable (chiffre + échelle + couleur). Très viral.
- **Deep-link / état dans l'URL** : `?scale=world&metric=water` pour partager une vue précise.
- **« Surprise-moi »** : ajoute un geste aléatoire, effet découverte.
- **Mode « le saviez-vous »** : petites cartes-faits sourcées entre deux interactions (peu de texte, 1 chiffre choc).
- **Widget embarquable** (`<iframe>`) pour blogs/médias → backlinks SEO.
- **Notation compacte** des très grands nombres (ex. « 96 000 Md ») + tooltip avec le nombre exact.
- **Compteur de gestes & « efficacité »** sur la carte finale (« année d'IA pliée en 3 gestes »).
- **Pré-réglage géo du « pays »** : l'échelle 🇫🇷 s'adapte au pays détecté (population locale) → plus personnel.

---

## 11. Qualité, perf & analytics

- **Tests** : `convert.ts` couvert à 100 % (les conversions sont le cœur). Parcours Playwright : ajouter des gestes → atteindre l'objectif → carte → partager.
- **Lighthouse** ≥ 95 partout. Pas de layout shift sur la barre sticky.
- **Analytics sans cookie** (Plausible/Vercel) : events `metric_change`, `scale_change`, `goal_reached`, `share_click`.
- **i18n testé** : aucune string codée en dur hors `/messages`.

---

## 12. Roadmap v2 (à écrire dans le repo, pas à coder maintenant)

**Comparatif poussé & dynamique :**
- **Recherche live** : champ où l'utilisateur tape une requête → on lance *en parallèle* une recherche Google classique et une réponse IA, et on affiche le coût estimé de chaque approche, en direct.
- **Image** : chercher une image existante vs **générer réellement une image par IA** dans la page (via une API de génération), avec mesure/estimation du coût de la génération.
- **Comparateur libre avancé** : l'utilisateur saisit n'importe quelle action ou un nombre de prompts et obtient toutes les équivalences, avec graphiques.
- **Profils d'usage IA réels** : connecter des hypothèses par type d'usage (codeur, étudiant, rédacteur…).
- **Visualisations** : graphiques animés (barres/bulles), timeline « ta journée numérique ».
- **Données vivantes** : intensité carbone du réseau en temps réel selon le pays (API type Electricity Maps).
- **Plus de langues**, plus de gestes, catégories (transport, maison, alimentation, numérique).
- **Partage enrichi** : carte animée / petite vidéo.

---

## 13. Définition de « terminé » (v1)

- [ ] Home jouable (échelle, onglets, liste, barre, carte de bilan, partage) : desktop & mobile.
- [ ] Transitions de couleur par onglet + dark/light auto + toggle.
- [ ] FR + EN complets, détection géo, hreflang, sitemap, robots, JSON-LD.
- [ ] Pages footer : comparatif (v1), sources, méthodologie, à propos, mentions légales.
- [ ] OG image dynamique.
- [ ] Lighthouse ≥ 95, tests conversion + 1 parcours e2e.
- [ ] Toutes les valeurs dans `/lib/data.ts` avec leur source ; aucune valeur en dur.

---

### Questions ouvertes pour [NOM_DU_SITE]
1. **Nom de domaine** définitif + nom du site (impacte logo, OG, metadata).
2. **Échelle « pays »** : un pays fixe (France) ou adaptatif selon la géo de l'utilisateur ?
3. **PERSON_YEAR = 12 000 prompts/an** : OK comme hypothèse « usage intensif » ? (afficher l'hypothèse dans la méthodo.)
4. **Analytics** : Plausible (payant, simple) ou Vercel Analytics ?
5. **Widget embarquable** : à inclure en v1 ou repousser en v2 ?
