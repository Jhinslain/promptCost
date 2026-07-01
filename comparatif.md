# Comparatif — le « classique » face à l'IA

Le geste habituel face à son équivalent en IA, **côte à côte**. Données statiques et sourcées, verdict honnête.

> **SEO / trafic** : c'est la page la plus « capteuse » du site car elle répond à des questions que les gens tapent vraiment (« ChatGPT vs Google énergie », « empreinte image IA »…).
> - **Page pilier** `/comparatif` : intro + grille de cartes « versus » qui renvoient chacune vers une page dédiée.
> - **Une page par comparaison** `/comparatif/[slug]` (indexable, ciblée sur une requête) : bloc *versus* (2 colonnes, barres proportionnelles, couleur de métrique), **chiffres + sources cliquables**, **verdict** en une ligne, **FAQ** (JSON-LD `FAQPage`), liens internes vers le jeu, `/combien`, `/glossaire`.
> - JSON-LD `Article` + `BreadcrumbList`, hreflang FR/EN, OG par comparaison.
> - Ton : **ni pro-IA ni anti-IA** — on montre les deux côtés, on cite, on tranche prudemment.

---

## 1. Recherche IA vs recherche Google  ⚡
- **Slug** : `/comparatif/ia-vs-google` · EN `/comparison/ai-vs-google-search`
- **Mots-clés** : « ChatGPT vs Google énergie », « l'IA consomme-t-elle plus que Google », « ChatGPT vs Google search energy ». *(Fort volume + intention claire.)*

| 🔎 Recherche Google | 🤖 Prompt IA (texte) |
|---|---|
| ~**0,3 Wh** / requête *(IEA)* | ~**0,3 Wh** / prompt *(Epoch AI, Google, OpenAI)* |

**Verdict** : aujourd'hui, **un prompt texte consomme à peu près autant qu'une recherche Google**. Le fameux « 10× plus » vient d'une ancienne estimation IEA (2,9 Wh) désormais obsolète : les modèles récents ont divisé leur consommation par ~10. Nuance honnête : les requêtes de **raisonnement** ou **multimodales** restent, elles, bien plus lourdes.

**FAQ** : ChatGPT consomme-t-il plus qu'une recherche Google ? D'où vient le chiffre « 10× » ? Une réponse d'IA peut-elle remplacer plusieurs recherches ?
**Sources** : IEA *Energy and AI*, Epoch AI, Google (Gemini).

---

## 2. Image générée par IA vs image existante  ⚡💧
- **Slug** : `/comparatif/image-ia-vs-photo` · EN `/comparison/ai-image-vs-stock-photo`
- **Mots-clés** : « empreinte image IA », « consommation génération image IA », « AI image carbon footprint ».

| 🖼️ Réutiliser une image existante | 🎨 Générer une image par IA |
|---|---|
| ~**0,1 Wh** (téléchargement) *(ordre de grandeur, IEA transfert de données)* | ~**6–12 Wh** *(arXiv 2506.17016, Hugging Face)* |

**Verdict** : générer une image coûte **20 à 40× un prompt texte**, bien plus que réutiliser une image déjà en ligne. Ça reste modeste face à un geste physique (≈ quelques minutes de four), mais c'est **le premier vrai « saut »** de consommation quand on quitte le texte.

**FAQ** : Combien consomme une image générée par IA ? Est-ce pire que télécharger une photo ? Pourquoi une image coûte plus qu'un texte ?
**Sources** : arXiv 2506.17016, Hugging Face (AI Energy Score).

---

## 3. Vidéo générée par IA vs streaming vidéo  ⚡
- **Slug** : `/comparatif/video-ia-vs-streaming` · EN `/comparison/ai-video-vs-streaming`
- **Mots-clés** : « consommation vidéo IA », « énergie génération vidéo IA », « AI video energy ».

| 📺 Regarder de la vidéo (streaming) | 🎬 Générer une vidéo par IA |
|---|---|
| ~**77 Wh / heure** *(IEA)* | ~**940 Wh** pour un clip de ~5 s *(Hugging Face)* |

**Verdict** : générer **5 secondes** de vidéo par IA consomme autant que **~12 heures de streaming**. C'est de loin le poste le plus lourd de l'IA grand public, et sa consommation **n'augmente pas linéairement** (doubler la durée quadruple l'énergie). À utiliser en conscience.

**FAQ** : Combien consomme une vidéo générée par IA ? Est-ce pire que regarder Netflix ? Pourquoi la vidéo IA est si gourmande ?
**Sources** : Hugging Face (Luccioni), IEA.

---

## 4. Poser une question à l'IA vs le geste numérique équivalent  🌍
- **Slug** : `/comparatif/prompt-vs-email` · EN `/comparison/ai-prompt-vs-email`
- **Mots-clés** : « empreinte carbone email », « prompt IA vs email », « CO2 email ».

| 📧 Envoyer un email | 🤖 Prompt IA (texte) |
|---|---|
| ~**4 g** (simple) à **~19 g** (avec pièce jointe) *(Berners-Lee, ADEME)* | ~**0,2 g CO₂** *(médiane du site)* |

**Verdict** : un prompt texte émet **moins qu'un simple email**. De quoi relativiser : nos gestes numériques les plus banals pèsent souvent plus qu'une question à l'IA.

**FAQ** : Un email pollue-t-il plus qu'un prompt IA ? Combien émet un email ?
**Sources** : Mike Berners-Lee (*How Bad Are Bananas?*), ADEME.

---

## 5. (Bonus) IA vs gestes du quotidien — renvoi vers le jeu  🔀
Bloc de synthèse qui renvoie vers l'expérience interactive : « 1 douche = 167 000 prompts », « 1 h de Netflix = 300 prompts »… avec CTA vers **`/`** (le jeu) et **`/combien`**.
- **Mots-clés** : « combien consomme un prompt », « IA vs douche/voiture/burger ».

---

## Idées d'extension (v2)
- **Comparateur dynamique** : l'utilisateur choisit « classique » vs « IA » d'un même usage et voit le résultat en direct (recherche live, génération d'image réelle) — déjà noté dans `Amélioration V1.md` / roadmap.
- Nouvelles comparaisons faciles à ajouter (chacune = une page SEO) : **traduction IA vs service humain**, **résumé IA vs lire l'article**, **assistant vocal vs recherche tapée**, **code généré vs recherche Stack Overflow**.
