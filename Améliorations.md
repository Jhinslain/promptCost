# Améliorations & backlog d'idées

> Pistes d'évolution pour le projet « 1 Prompt = ? ». Classées par thème, avec un niveau d'effort indicatif (🟢 rapide · 🟡 moyen · 🔴 gros) et un impact estimé. À piocher après la v1.

---

## 1. Quick wins (fort impact / faible effort)

- 🟢 **Compteur de gestes & efficacité** sur la carte de bilan : « année d'IA pliée en **3 gestes** ». Rend le score comparable et compétitif.
- 🟢 **Bouton « Surprends-moi »** : ajoute un geste aléatoire → effet découverte, relance l'interaction.
- 🟢 **Notation compacte** des très grands nombres (`2,5 M`, `96 000 Md`) + tooltip avec le nombre exact. Indispensable aux grandes échelles.
- 🟢 **Haptique mobile** (`navigator.vibrate`) au franchissement de l'objectif + petit son optionnel (off par défaut).
- 🟢 **État dans l'URL** (`?scale=world&metric=water&fr`) : permet de partager une vue précise et améliore le SEO (URLs indexables).
- 🟢 **Micro-fait au lancement** : une carte « le savais-tu ? » avec 1 chiffre choc sourcé, qui change à chaque visite.

## 2. Engagement & gamification

- 🟡 **Mode défi** : « épuise ton année d'IA en le moins de gestes possible » → scoreboard local (meilleur score en `localStorage`).
- 🟡 **Paliers / achievements** débloquables avec petite animation (confettis déjà prévus) : premier million, première année du monde, etc.
- 🟡 **Mode inversé** : « j'ai fait N prompts aujourd'hui → voici l'équivalent concret » (le pendant personnel du jeu actuel).
- 🟡 **Variantes unitaire ⇄ annuel** mises en avant comme un toggle ludique (« Four 1 fois » vs « Four toute l'année ») — exploite directement le `DATA.md`.
- 🔴 **Quiz « devine le coût »** : on montre un geste, l'utilisateur devine le nb de prompts, score final partageable. Très rejouable (prévu en v2 du SPEC).

## 3. Partage & viralité

- 🟡 **Carte de score OG dynamique** (`@vercel/og`) : image générée avec le chiffre + l'échelle + la couleur d'onglet. Boost majeur de partage social.
- 🟡 **Pré-remplir le texte de partage** par réseau (X, LinkedIn, WhatsApp) avec un lien deep-link vers la vue exacte.
- 🔴 **Widget embarquable** (`<iframe>` / script) pour blogs & médias → backlinks SEO + notoriété. Version « mini » d'une comparaison.
- 🟡 **Capture/Export PNG** du résultat (pour stories Instagram, etc.).

## 4. SEO & acquisition

- 🟡 **Pages de comparaison statiques indexables** (« 1 douche = combien de prompts ? ») générées depuis `DATA.md` → des centaines de longue-traîne, fortes en SEO.
- 🟡 **FAQ structurée (JSON-LD `FAQPage`)** sur `/methodologie` : « Combien consomme ChatGPT ? », « L'IA pollue-t-elle ? »… cible les requêtes réelles.
- 🟡 **Glossaire / page pédagogique** (Wh, empreinte eau virtuelle, forçage radiatif) — contenu de fond, bon pour l'autorité.
- 🟢 **`hreflang` + sitemap multilingue** (déjà au SPEC) : vérifier la réciprocité à chaque ajout de langue.
- 🟡 **Open Graph soigné par page** + Twitter Card grande image.

## 5. Données & crédibilité

- 🟢 **Tooltip source au survol de chaque geste** : la source institutionnelle apparaît directement (pas seulement sur `/sources`). Désamorce le scepticisme sur place.
- 🟡 **Badge « fourchette »** sur les valeurs incertaines (bœuf 3 000–7 000 g, vol avec/sans forçage radiatif) — affiche l'honnêteté plutôt que de la cacher.
- 🟡 **Date de dernière mise à jour des données** visible + champ `asOf` dans `data.ts`.
- 🔴 **Intensité carbone temps réel** par pays (API type Electricity Maps) pour la métrique CO₂ → chiffres vivants (v2).
- 🟡 **Sélecteur d'hypothèse** « usage IA » (léger / moyen / intensif) ramené en option avancée, en plus de l'échelle population.

## 6. Accessibilité & i18n

- 🟢 **Respect strict de `prefers-reduced-motion`** : désactive compteurs animés / confettis.
- 🟢 **Contrastes AA** vérifiés dans les 2 thèmes ET pour les 3 couleurs d'onglet (le vert CO₂ et l'ambre élec sont à surveiller sur fond clair).
- 🟢 **Navigation clavier complète** + `aria-label` sur steppers, onglets, partage.
- 🟡 **Formats localisés** (séparateurs de milliers, virgule décimale) déjà prévus — ajouter le pluriel correct par langue (`Intl.PluralRules`).
- 🟡 **Test pseudo-localisation** pour repérer les chaînes codées en dur avant d'ajouter une langue.

## 7. Technique & performance

- 🟢 **Logique de conversion 100 % pure et testée** (`convert.ts`) — le cœur du site, à couvrir entièrement (Vitest).
- 🟢 **Lighthouse ≥ 95** : SSG, images optimisées, pas de layout shift sur la barre sticky.
- 🟡 **Thème sans flash** (script inline / `next-themes`) au premier rendu.
- 🟡 **Analytics sans cookie** (Plausible / Vercel) avec events : `metric_change`, `scale_change`, `goal_reached`, `share_click` → pour piloter les améliorations.
- 🟢 **`data.ts` typé** (`Metric`, `Variant`, `SourceId`) pour éviter toute valeur orpheline sans source.

## 8. Pistes plus lointaines

- 🔴 **Comparateur libre avancé** : saisir n'importe quelle action ou un nombre de prompts → toutes les équivalences + graphiques (v2 du SPEC).
- 🔴 **Recherche live** : lancer en parallèle une recherche Google et une réponse IA, afficher le coût de chaque approche (v2).
- 🔴 **Génération d'image réelle** dans la page (image existante vs image générée par IA) avec mesure du coût (v2).
- 🟡 **Profils d'usage métier** (codeur, étudiant, rédacteur) avec hypothèses de prompts/jour.
- 🟡 **Visualisations** : graphiques animés (bulles, barres), timeline « ta journée numérique ».

## 9. Échelles & populations (sélecteur d'échelle)

Échelles **actives** en v1 (localisées par langue), populations ≈ 2026 :

| Échelle | Population | Source |
|---|---|---|
| 🧍 toi | 1 | — |
| 👥 100 personnes | 100 | — |
| 🏙️ Paris *(fr)* | ~2,1 M | INSEE (2026, ville, en baisse) |
| 🏙️ Londres *(en)* | ~8,9 M | ONS (Greater London, 2026) |
| 🇫🇷 France *(fr)* | ~69,1 M | INSEE (1ᵉʳ janv. 2026) |
| 🇬🇧 Royaume-Uni *(en)* | ~69,9 M | ONS (mi-2026) |
| 🌍 le monde | ~8,3 Md | ONU / Worldometer (2026) |

**Échelles candidates** à ajouter (gameplay plus riche + appui pour de nouvelles langues) — 🟡 effort. Populations ≈, **à sourcer dans `data.ts`** au moment de l'ajout (objet daté `{ value, asOf, source }`) :

| Type | Échelle | Population ≈ |
|---|---|---|
| Ville | un village | ~1 000 |
| Ville | une petite ville | ~20 000 |
| Ville | New York | ~8,5 M |
| Ville | Madrid *(es)* | ~3,4 M |
| Ville | Berlin *(de)* | ~3,8 M |
| Ville | Tokyo | ~14 M (ville) / ~37 M (aire urbaine) |
| Pays | Espagne *(es)* | ~48 M |
| Pays | Allemagne *(de)* | ~84 M |
| Pays | États-Unis | ~342 M |
| Pays | Union européenne | ~449 M |
| Pays | Chine | ~1,41 Md |
| Pays | Inde | ~1,46 Md |

> Règle : pour chaque langue ajoutée, définir sa **capitale** + son **pays** + populations datées et sourcées (INSEE / ONS / Destatis / INE / U.S. Census / ONU selon le cas).

---

### Priorisation suggérée pour un premier lot post-v1
1. Tooltip source par geste (crédibilité) · Notation compacte · Compteur de gestes.
2. Carte OG dynamique + état dans l'URL (viralité).
3. Pages de comparaison statiques + FAQ JSON-LD (SEO).
4. Mode défi (rétention).
