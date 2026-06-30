# Journal des changements

Récapitulatif de ce qui a été construit/modifié. Du plus récent au plus ancien.
(Détails d'archi : voir `DEVELOPER.md`. Suivi du backlog : `Amélioration V1.md`.)

---

## SEO & pages de contenu (#3)
- **Pages de comparaison** : `/combien` (index trié par coût, groupé par ressource) et `/combien/[geste]` (1 page par geste, 65 × 2 langues) : « Douche 5 min = 167 000 prompts IA », chiffre + source cliquable + CTA + comparaisons liées.
- **Glossaire** : `/glossaire` (Wh, eau virtuelle, forçage radiatif, CO₂e, raisonnement).
- **Metadata** : helper `lib/seo.ts` (`buildMetadata`) : canonical + hreflang + carte OG/Twitter localisée, appliqué à **toutes** les pages (y compris les 5 anciennes sous-pages).
- **Sitemap** étendu (153 pages) + liens **footer** (Comparaisons, Glossaire).

## Partage & viralité (#2)
- **Carte OG dynamique** (`app/api/og`) : score `{years}×` + nb de gestes + échelle + couleur de métrique, en FR/EN.
- **Carte de bilan** : partage natif + **X / WhatsApp / LinkedIn** pré-remplis + **téléchargement PNG** + copie du lien.

## Mode inversé « Convertir » (#1) : page `/convertir`
- Saisie « Aujourd'hui j'ai fait… » par **type** (💬 texte · 🧠 raisonnement · 🖼️ image · 🎬 vidéo) avec steppers.
- Résultat **« Tu aurais pu… »** : 3 cartes (⚡/💧/🌍), grande emoji, équivalent en **durée** (s/min/h/jours/ans) ou **distance** (m/km), bouton **« Un autre »** (aléatoire).
- Données `USAGE_TYPES` + `EQUIV_DEEDS` (Data.md §1b ; vidéo ≈ 940 Wh). Note d'honnêteté derrière un (i).
- Logique pure testée : `usageTotals`, `pickEquivalent`, `splitDuration`, `splitDistance`.

## Modes = pages séparées
- « Dépenser » = `/`, « Convertir » = `/convertir` (vraies routes, SEO + partage).
- `ModeToggle` : navigation par liens, **segmenté sur mobile**, **rail d'icônes à droite sur ordi**, extensible.

## Bulle « empreinte de ce site » (footer)
- Défile toutes les 3 s sur ⚡→💧→🌍 (couleur + équivalent concret), respecte `prefers-reduced-motion`.
- Au clic : texte utilisateur (recherche IA + dev ≈ 250 Wh / 0,25 L / 170 g ; coût par visite négligeable).

## Crédibilité (#4)
- **Source au survol du coût** de chaque geste.
- **Date de mise à jour** des données (`DATA_AS_OF`) sur `/sources`.

## Données (Data.md)
- **65 gestes** (16 élec / 21 eau / 28 CO₂), valeurs réalignées (ADEME, EPA, WFN, OWID…).
- **Sources** recatégorisées (IA / Électricité / Eau / CO₂), ~33 sources ; page `/sources` groupée.

## Factures (jeu « Dépenser »)
- Facture sticky en haut (suit la métrique) + **détail de la facture de la catégorie active** en bas (titrée 🧾 Facture d'électricité / d'eau / Bilan carbone, colorée).
- La facture reste collée en haut au scroll ; le menu (navbar) ne l'est pas.

## Refonte UI (style neal.fun/spend)
- **Grille de cartes-produit** (emoji, titre, prix en prompts, bouton Acheter → stepper), triée par coût, mobile-first.
- **Pas de navbar** : 3 boutons discrets (i / langue / thème) en haut à droite ; marque déplacée dans le footer.
- Bug corrigé : la croix du bilan ne fermait pas (z-index) ; le bilan ne se rouvre plus en changeant d'onglet.

## Conventions & docs
- **Tiret cadratin `—` banni** partout dans le code/contenu (remplacé par `:` ou virgule).
- Mentions légales réduites au strict minimum.
- Docs ajoutées : `DEVELOPER.md` (archi + recettes), `CHANGELOG.md` (ce fichier).

---

## Vérification
À chaque lot : `npx tsc --noEmit`, `npx vitest run` (23 tests verts), `npm run build` (153 pages statiques).
