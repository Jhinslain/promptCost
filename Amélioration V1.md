# Améliorations : périmètre V1

> Effort indicatif : 🟢 rapide · 🟡 moyen · 🔴 gros.
> Statut : ✅ fait · 🚧 partiel · ⬜ à faire. (Mis à jour au fil de l'implémentation.)

---

## 1. Mode inversé (fonctionnalité phare) 🔴 : ✅ fait

« **J'ai fait N prompts aujourd'hui : voici l'équivalent concret.** »

- [x] Saisie de l'usage du jour (implémenté **par type** : 💬 texte · 🧠 raisonnement · 🖼️ image · 🎬 vidéo, plutôt que par modèle nommé).
- [x] Résultat en gestes du quotidien, sur les **3 métriques** (⚡/💧/🌍), chacune sa couleur.
- [x] Données dans `data.ts` (`USAGE_TYPES`, `EQUIV_DEEDS`), sourcées (Data.md §1b) + mention « ordres de grandeur » derrière un (i).

> Évolutions vs spec initiale : résultat formulé « **tu aurais pu…** » en **durées** (s/min/h/jours/ans) et **distances** (m/km) plutôt qu'en additions ; **3 cartes côte à côte** ; bouton **« Un autre »** (aléatoire) ; le mode est une **page dédiée** `/convertir` (SEO).

---

## 2. Partage & viralité

- [x] 🟡 **Carte de score OG dynamique** : `api/og` génère l'image avec le chiffre + l'échelle + la couleur de métrique, localisée FR/EN.
- [x] 🟡 **Partage pré-rempli par réseau** : X, WhatsApp, LinkedIn (+ partage natif + copie). *(Lien vers la page ; deep-link encodant l'état exact non fait.)*
- [ ] 🔴 **Widget embarquable** (`<iframe>`) : ⬜ sauté (optionnel).
- [x] 🟡 **Export PNG** du résultat (bouton « Télécharger l'image »).

---

## 3. SEO & acquisition : ✅ fait

- [x] 🟡 **Pages de comparaison statiques** : `/combien` (index) + `/combien/[geste]` (1 par geste, 65 × 2 langues).
- [x] 🟡 **FAQ JSON-LD `FAQPage`** sur `/methodologie`.
- [x] 🟡 **Glossaire** : `/glossaire` (Wh, eau virtuelle, forçage radiatif, CO₂e, raisonnement).
- [x] 🟢 **`hreflang` + sitemap multilingue** (inclut toutes les nouvelles pages).
- [x] 🟡 **Open Graph + Twitter Card** sur **toutes** les pages (helper `lib/seo.ts`).

---

## 4. Données & crédibilité

- [x] 🟢 **Tooltip source par geste** : la source s'affiche au survol du coût (carte du jeu), pas seulement sur `/sources`.
- [x] 🟡 ~~Badge « fourchette »~~ : **non retenu** (l'incertitude est déjà couverte par la méthodo, les sources au survol et le (i) du mode inversé).
- [x] 🟡 **Date de mise à jour des données** (`DATA_AS_OF`) visible sur `/sources`.

---

## 5. Accessibilité & i18n

- [ ] 🟢 **`prefers-reduced-motion` strict** : 🚧 partiel (CSS global + bulle empreinte OK ; animations Framer compteurs/confettis pas encore désactivées).
- [ ] 🟢 **Contrastes AA** dans les 2 thèmes + 3 couleurs d'onglet : ⬜ à auditer.
- [ ] 🟢 **Navigation clavier + `aria-label`** : 🚧 partiel (aria-labels présents sur steppers/onglets/partage ; audit complet à faire).
- [x] 🟡 **Formats localisés + pluriels** (Intl + ICU `plural`).
- [ ] 🟡 **Test pseudo-localisation** : ⬜ à faire.

---

## 6. Technique & performance

- [x] 🟢 **Logique de conversion pure et testée** (`convert.ts`, `format.ts` : 23 tests Vitest).
- [ ] 🟢 **Lighthouse ≥ 95** : ⬜ non mesuré.
- [x] 🟡 **Thème sans flash** (script inline dans `layout.tsx`).
- [ ] 🟡 **Analytics sans cookie** (Plausible/Vercel) + events : ⬜ à faire.
- [x] 🟢 **`data.ts` typé** (`MetricId`, `SourceCategory`, `DeedKind`…).

---

## 7. Échelles & populations (sélecteur d'échelle) : ✅ fait

Localiser les échelles par langue + populations ≈ 2026. Résout au passage l'écart README ↔ `data.ts` (ville 1 M vs 500 k, France 68 M vs 65/69 M).

| Échelle | Population | Source |
|---|---|---|
| 🧍 toi | 1 | : |
| 👥 100 personnes | 100 | : |
| 🏙️ Paris *(fr)* | ~2,1 M | INSEE (2026) |
| 🏙️ Londres *(en)* | ~8,9 M | ONS (Greater London, 2026) |
| 🇫🇷 France *(fr)* | ~69,1 M | INSEE (1ᵉʳ janv. 2026) |
| 🇬🇧 Royaume-Uni *(en)* | ~69,9 M | ONS (mi-2026) |
| 🌍 le monde | ~8,3 Md | ONU / Worldometer (2026) |

---

## Récap

| Section | Statut |
|---|---|
| 1. Mode inversé | ✅ fait |
| 2. Partage & viralité | ✅ fait (sauf widget iframe) |
| 3. SEO & acquisition | ✅ fait |
| 4. Données & crédibilité | ✅ fait (badge fourchette non retenu) |
| 5. Accessibilité & i18n | 🚧 (reste : reduced-motion strict, AA, clavier, pseudo-loc) |
| 6. Technique & perf | 🚧 (reste : Lighthouse, analytics) |
| 7. Échelles localisées | ✅ fait |
