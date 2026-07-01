# Plan éditorial — section `/dossiers`

> Contenu SEO de fond sur l'IA (au-delà de l'empreinte environnementale), pour construire l'**autorité thématique** du site et capter des requêtes à fort volume. Ton : **équilibré et sourcé** (journalistique, pour/contre, chiffres + sources institutionnelles). FR d'abord, EN ensuite.
>
> Règle de neutralité : on présente les différents points de vue, on cite des sources sérieuses, on évite la position partisane. Là où une opinion est utile, l'isoler dans un encadré **« Notre regard »** distinct du corps factuel.

---

## 1. Architecture & SEO

- **Page hub** `/dossiers` : index éditorial, articles groupés par pilier, mis en avant + récents.
- **4 piliers** (pages pilier longues qui maillent vers les articles du cluster) :
  1. 🧑‍💼 **IA & travail**
  2. 🌍 **IA & environnement** (relie au cœur du site : jeu, `/combien`, glossaire)
  3. ⚖️ **IA, société & controverses**
  4. 🧠 **Comprendre l'IA** (relie au `/glossaire`)
- **Technique** : URLs localisées (`/dossiers/...` + `/en/...`), `hreflang`, JSON-LD `Article` + `BreadcrumbList` + `FAQPage`, OG par article, sommaire ancré, temps de lecture, date + `asOf` de mise à jour, auteur/éditeur (GHIS).
- **Maillage** : chaque dossier lie vers (a) sa page pilier, (b) 2-3 dossiers du même cluster, (c) une page outil (`/`, `/convertir`, `/combien/[geste]`, `/glossaire`). Objectif : transformer le trafic SEO en interactions avec le jeu.
- **Cadence** : viser la complétude d'un pilier à la fois (meilleur signal de topical authority qu'un article isolé par thème).
- **Format** : 1 200–2 000 mots, scommence par une réponse courte (featured-snippet friendly), puis développe ; encadrés chiffres ; FAQ en fin.

---

## 2. Briefs par article

> Pour chaque article : **slug**, intention de recherche + **mots-clés**, **angle**, **plan H2/H3**, **liens internes**, **FAQ** (pour JSON-LD), **sources** à citer.

### Pilier 1 — IA & travail

#### A1. « L'IA va-t-elle remplacer mon métier ? »
- **Slug** : `/dossiers/ia-remplace-emploi` · EN `/en/dossiers/ai-replacing-jobs`
- **Intention** : informationnelle, anxiogène, fort volume. **Mots-clés** : « l'IA va-t-elle remplacer mon travail », « métiers menacés par l'IA », « IA et emploi ».
- **Angle** : nuancer « remplacement » vs « transformation » des tâches ; par secteur ; ce que disent les études (et leurs limites).
- **Plan** : Réponse courte → Remplacer un métier ≠ automatiser des tâches → Ce que montrent les données (WEF, OCDE, ILO, McKinsey, Goldman Sachs) → Métiers les plus exposés vs les plus résilients → Effet net : destructions + créations + transformations → Comment se positionner. **Encadré « Notre regard »**.
- **Liens** : A2, A3, pilier IA & travail, `/convertir`.
- **FAQ** : Combien d'emplois l'IA pourrait-elle supprimer ? Quels métiers sont les plus exposés ? L'IA crée-t-elle aussi des emplois ?
- **Sources** : WEF *Future of Jobs Report*, OCDE *Employment Outlook*, OIT/ILO, McKinsey Global Institute, Goldman Sachs, Stanford HAI *AI Index*.

#### A2. « IA ou expert : quand a-t-on (encore) besoin d'un humain ? »
- **Slug** : `/dossiers/ia-ou-expert` · EN `/en/dossiers/ai-vs-expert`
- **Intention** : décisionnelle (pros, dirigeants). **Mots-clés** : « remplacer un freelance par l'IA », « l'IA peut-elle remplacer un expert », « IA outil ou remplacement ».
- **Angle (le tien, traité de façon équilibrée)** : l'IA est un **multiplicateur** de l'expert, pas un substitut ; là où elle suffit vs là où le jugement humain reste indispensable (responsabilité, contexte, hallucinations, éthique, relation client).
- **Plan** : Réponse courte → Ce que l'IA fait très bien (brouillon, volume, exploration) → Ses limites réelles (hallucinations, absence de responsabilité, biais, contexte métier) → Le bon modèle : expert + IA → Cas concrets par métier (droit, santé, dev, design, compta) → Coût caché du « tout-IA » (reprise, risque). **Encadré « Notre regard »** : pourquoi payer un expert reste souvent plus rentable.
- **Liens** : A1, A4, `/glossaire` (hallucination), `/convertir`.
- **FAQ** : L'IA peut-elle remplacer un avocat / un comptable / un développeur ? Pourquoi l'IA se trompe-t-elle ? Comment combiner expert et IA ?
- **Sources** : Stanford HAI, études sur les hallucinations (benchmarks), MIT Sloan, Harvard Business Review, exemples sectoriels documentés.

#### A3. « Métiers : ce que l'IA transforme vs ce qu'elle remplace »
- **Slug** : `/dossiers/metiers-ia-transformation` · EN `/en/dossiers/jobs-ai-transformation`
- **Mots-clés** : « métiers transformés par l'IA », « tâches automatisables », « avenir du travail IA ».
- **Angle** : grille tâche par tâche (automatisable / augmentée / humaine) plutôt que métier entier.
- **Plan** : Réponse courte → La bonne unité d'analyse = la tâche → Tableau exposition par grandes familles de métiers → Exemples d'augmentation réussie → Ce qui résiste (créativité contextuelle, relationnel, manuel non routinier) → Se former. 
- **Liens** : A1, A4, pilier.
- **Sources** : OCDE (tasks-based), WEF, Frey & Osborne (et ses critiques), recherche académique récente.

#### A4. « Travailler avec l'IA : les compétences qui comptent en 2026 »
- **Slug** : `/dossiers/competences-ia-2026` · EN `/en/dossiers/ai-skills-2026`
- **Mots-clés** : « compétences IA », « apprendre à utiliser l'IA », « prompt engineering utile ».
- **Angle** : pratique, pédagogique ; compétences durables vs effets de mode.
- **Plan** : Réponse courte → Esprit critique & vérification → Cadrage de problème → Bases du prompting → Connaître les limites (sources, biais) → Outils par métier → Pièges. 
- **Liens** : A2, glossaire, `/convertir`.
- **Sources** : WEF (skills), LinkedIn Economic Graph, OCDE.

### Pilier 2 — IA & environnement (cœur du site)

#### B1. « Combien consomme vraiment l'IA ? (énergie, eau, CO₂) »
- **Slug** : `/dossiers/consommation-ia` · EN `/en/dossiers/ai-energy-water-co2`
- **Intention** : fort volume. **Mots-clés** : « combien consomme ChatGPT », « consommation énergie IA », « empreinte eau IA ».
- **Angle** : la synthèse de référence, honnête (impact unitaire faible **mais** échelle mondiale réelle). Page pilier qui chapeaute le jeu et `/combien`.
- **Plan** : Réponse courte (0,3 Wh / 0,3 ml / 0,2 g par prompt) → D'où viennent les chiffres (Google, OpenAI, Epoch, arXiv) → Texte vs raisonnement vs image vs vidéo → L'échelle qui change tout (milliards/jour, data centers) → Mettre en perspective (vs streaming, viande, voiture) → CTA vers le jeu. **Encadré nuance** : ce que ces chiffres ne disent pas (entraînement, amont, eau virtuelle).
- **Liens** : `/`, `/convertir`, `/combien`, glossaire, B2, B3.
- **FAQ** : Combien consomme un prompt ? L'IA consomme-t-elle plus que Google ? Faut-il culpabiliser d'utiliser l'IA ?
- **Sources** : celles de `DATA.md` §5 (IEA, Google, OpenAI, Epoch, arXiv 2505.09598, EcoLogits).

#### B2. « L'IA est-elle écologique ? Le pour et le contre »
- **Slug** : `/dossiers/ia-ecologie-pour-contre` · EN `/en/dossiers/ai-environment-pros-cons`
- **Mots-clés** : « IA et écologie », « l'IA pollue-t-elle », « impact environnemental IA ».
- **Angle** : balance honnête : coûts (énergie, eau, matériaux, data centers) **vs** apports (optimisation réseaux, recherche climat, efficacité). 
- **Plan** : Réponse courte → Le côté coût → Le côté bénéfice → Le vrai débat : croissance des usages → Que faire à son échelle. **Encadré « Notre regard »**.
- **Liens** : B1, B3, `/combien`.
- **Sources** : IEA *Energy and AI*, articles évalués, OWID.

#### B3. « Eau et data centers : ce que l'IA boit vraiment »
- **Slug** : `/dossiers/ia-eau-data-centers` · EN `/en/dossiers/ai-water-data-centers`
- **Mots-clés** : « IA consommation d'eau », « data center eau », « ChatGPT eau ».
- **Angle** : démêler eau directe (refroidissement) vs amont électrique, et la question locale (stress hydrique).
- **Plan** : Réponse courte → Pourquoi un data center consomme de l'eau → Directe vs amont → Le problème est local → Chiffres et ordres de grandeur → Ce qui s'améliore. 
- **Liens** : B1, glossaire (eau virtuelle), `/combien`.
- **Sources** : Google, OpenAI, UC Riverside (Ren), Water Footprint Network, arXiv 2505.09598.

### Pilier 3 — IA, société & controverses

#### C1. « Les grandes controverses de l'IA (panorama) »
- **Slug** : `/dossiers/controverses-ia` · EN `/en/dossiers/ai-controversies`
- **Mots-clés** : « controverses IA », « dangers de l'IA », « problèmes éthiques IA ».
- **Angle** : page pilier qui présente chaque controverse de façon équilibrée et lie vers les articles dédiés.
- **Plan** : Droits d'auteur & données d'entraînement → Deepfakes & désinformation → Biais & discrimination → Vie privée → Concentration du pouvoir / dépendance → Sécurité & risques → Emploi (lien pilier 1). 
- **Liens** : C2, C3, C4, A1, pilier.
- **Sources** : Stanford HAI *AI Index*, AI Now Institute, CNIL, UNESCO *Recommendation on AI Ethics*, EU AI Act.

#### C2. « Deepfakes et désinformation : où en est-on ? »
- **Slug** : `/dossiers/deepfakes-desinformation` · EN `/en/dossiers/deepfakes-misinformation`
- **Mots-clés** : « deepfake c'est quoi », « IA désinformation », « détecter une image générée par IA ».
- **Angle** : comprendre, repérer, se protéger ; sans catastrophisme ni minimisation.
- **Plan** : Réponse courte → Définition → Cas réels → Comment repérer → Réponses (watermarking, régulation, fact-checking) → Limites. 
- **Sources** : UNESCO, EU AI Act, recherches sur la détection, médias de référence.

#### C3. « Pourquoi les IA ont des biais »
- **Slug** : `/dossiers/biais-ia` · EN `/en/dossiers/ai-bias`
- **Mots-clés** : « biais des IA », « discrimination algorithme », « IA raciste sexiste ».
- **Angle** : pédagogique et équilibré : d'où viennent les biais (données, conception), exemples documentés, ce qu'on tente pour les réduire.
- **Plan** : Réponse courte → Origine des biais → Exemples → Pourquoi c'est difficile à corriger → Pistes (audit, diversité des données, régulation). 
- **Sources** : NIST, Stanford HAI, AlgorithmWatch, recherches académiques.

#### C4. « IA et données personnelles : que deviennent vos infos ? »
- **Slug** : `/dossiers/ia-donnees-personnelles` · EN `/en/dossiers/ai-personal-data`
- **Mots-clés** : « IA et vie privée », « ChatGPT données personnelles », « RGPD IA ».
- **Angle** : pratique : ce qui est collecté, vos droits (RGPD), bons réflexes.
- **Plan** : Réponse courte → Ce que les modèles utilisent → Risques → Vos droits (RGPD) → Réglages & bonnes pratiques. 
- **Sources** : CNIL, RGPD, EU AI Act, politiques officielles des fournisseurs.

### Pilier 4 — Comprendre l'IA

#### D1. « Comment fonctionne une IA générative (sans jargon) »
- **Slug** : `/dossiers/comment-fonctionne-ia` · EN `/en/dossiers/how-ai-works`
- **Mots-clés** : « comment fonctionne ChatGPT », « c'est quoi un LLM », « IA générative expliquée ».
- **Angle** : vulgarisation fiable ; relie au glossaire.
- **Plan** : Réponse courte → Données & entraînement → Tokens & prédiction → Pourquoi ça « hallucine » → Ce que ça n'est pas (pas une conscience). 
- **Liens** : glossaire, D2, B1.
- **Sources** : Stanford HAI, documentation des fournisseurs, vulgarisateurs reconnus.

#### D2. « Prompt, token, hallucination : le vocabulaire de l'IA »
- **Slug** : `/dossiers/vocabulaire-ia` · EN `/en/dossiers/ai-glossary-explained`
- **Mots-clés** : « vocabulaire IA », « c'est quoi un prompt », « token IA ».
- **Angle** : complément narratif du `/glossaire` (le glossaire = définitions courtes ; ici = explications avec exemples).
- **Liens** : `/glossaire`, D1, `/convertir`.

#### D3. « IA générative vs IA “classique” : quelle différence ? »
- **Slug** : `/dossiers/ia-generative-vs-classique` · EN `/en/dossiers/generative-vs-traditional-ai`
- **Mots-clés** : « IA générative définition », « différence IA et IA générative ».
- **Plan** : Réponse courte → IA classique (règles, prédiction) → IA générative → Exemples → Pourquoi la confusion. 

---

## 3. Priorisation suggérée

1. **B1** (Combien consomme l'IA) : pilier qui consolide le cœur du site et capte un gros volume.
2. **A1 + A2** (emploi + IA vs expert) : forte demande, ton différenciant, sujets que tu veux porter.
3. **C1** (panorama controverses) : page pilier qui ouvre tout un cluster.
4. **D1** (comment ça marche) : pédagogie, maille avec le glossaire.
5. Compléter chaque cluster ensuite (A3/A4, B2/B3, C2-C4, D2/D3).

## 4. Garde-fous éditoriaux

- **Sourcer chaque affirmation chiffrée** (lien institutionnel), comme sur le reste du site : c'est ta signature de crédibilité.
- **Dater** les articles (`asOf`) : sujets mouvants.
- **Séparer fait et opinion** : encadré « Notre regard » visuellement distinct.
- **Éviter le catastrophisme et l'angélisme** : toujours présenter les deux côtés, surtout emploi et controverses.
- **Mettre à jour** A1/B1/D1 tous les ~6 mois (chiffres et modèles évoluent).
