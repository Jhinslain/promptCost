# Glossaire

*Les termes clés pour comprendre les chiffres du site — et l'IA en général.*

> **SEO** : chaque terme cible une requête « c'est quoi… / … définition ». À implémenter avec une **ancre par terme** (`#token`, `#inference`…), un balisage **JSON-LD `DefinedTermSet` / `DefinedTerm`** (et/ou `FAQPage`), et des liens internes vers le jeu, `/combien`, `/a-propos` et `/sources`. Définitions courtes (1–3 phrases) = idéales pour les *featured snippets*.

---

## Comprendre l'IA

**IA générative**
Famille d'IA qui produit du contenu (texte, image, audio, vidéo) à partir d'une requête. Les grands modèles de langage (ChatGPT, Claude, Gemini) en sont la forme la plus répandue.

**LLM (grand modèle de langage)**
*Large Language Model* : un réseau de neurones entraîné sur d'immenses corpus de texte pour prédire le *token* suivant. C'est le moteur des chatbots ; son empreinte se joue surtout à l'**inférence**, à chaque prompt.

**Prompt**
Une requête envoyée à un modèle d'IA. Référence du site : un prompt texte moyen ≈ **0,3 Wh**, **0,3 mL d'eau** et **0,2 g de CO₂**.

**Token**
La plus petite unité de texte manipulée par un modèle (≈ ¾ d'un mot en anglais, souvent moins en français). Les modèles lisent, génèrent et « facturent » par token : **plus il y a de tokens, plus l'inférence consomme**.

**Inférence**
La phase d'utilisation d'un modèle déjà entraîné : chaque prompt déclenche une inférence. C'est elle qu'on chiffre ici, pas l'entraînement.

**Entraînement (training)**
La phase d'apprentissage initiale du modèle, très coûteuse en énergie — mais **unique**, puis amortie sur des milliards de requêtes. Le site chiffre l'inférence, pas l'entraînement.

**Hallucination**
Quand un modèle génère une information fausse mais plausible. C'est la raison principale pour laquelle une **vérification humaine** reste indispensable.

**Fenêtre de contexte (context window)**
La quantité de texte qu'un modèle peut prendre en compte d'un coup (la « mémoire » d'une conversation). Plus elle est remplie, plus l'inférence coûte cher.

**Paramètres**
Les « réglages » internes appris pendant l'entraînement, comptés en milliards. En règle générale, plus un modèle a de paramètres, plus il est capable… et gourmand.

**Multimodal**
Un modèle capable de traiter plusieurs types de données (texte, image, audio, vidéo) dans une même requête.

**Agent IA**
Une IA qui enchaîne plusieurs étapes en autonomie pour accomplir une tâche (donc plusieurs inférences). Utile, mais **multiplie la consommation** par rapport à un prompt unique.

**Modèle de raisonnement**
Un modèle qui « réfléchit » (génère des étapes intermédiaires) avant de répondre. Bien plus coûteux qu'un prompt texte : **~15 à 40 Wh** par requête, soit **50 à 100×** un prompt standard.

**Génération d'image / vidéo**
Produire un média coûte beaucoup plus que du texte : une **image** ≈ 6–12 Wh (20–40× un prompt texte), une **vidéo** ≈ 1 000× (~940 Wh pour un clip de ~5 s).

---

## Énergie

**Wattheure (Wh)**
Unité d'énergie : faire fonctionner un appareil de 1 W pendant 1 h. Une ampoule LED consomme ~10 Wh par heure.

**Kilowattheure (kWh)**
1 000 Wh — l'unité de votre facture d'électricité. Un four électrique consomme ~2 kWh en une heure.

**Data center (centre de données)**
Le bâtiment qui héberge les serveurs où tourne l'IA. Il consomme de l'électricité pour calculer **et** de l'eau pour se refroidir.

**GPU**
Le processeur graphique : le composant qui fait réellement tourner les modèles d'IA. Puissant et énergivore, c'est lui qui domine la consommation à l'inférence.

**PUE (Power Usage Effectiveness)**
Ratio entre l'énergie totale d'un data center et celle réellement utile aux serveurs. ~1,1 (très efficace) à 1,5+ : le complément part surtout dans le refroidissement.

**TWh (térawattheure)**
1 milliard de kWh. C'est l'échelle des consommations nationales ou mondiales — celle où l'IA « pèse » à l'échelle globale.

---

## Eau

**Eau virtuelle**
L'eau utilisée pour **produire** un bien (culture, élevage, fabrication), pas seulement l'eau du robinet. Un burger « contient » ainsi des milliers de litres d'eau virtuelle.

**Eau directe (refroidissement)**
L'eau évaporée sur place pour refroidir les serveurs d'un data center. C'est le chiffre « officiel » communiqué par Google (~0,26 mL/prompt) ou OpenAI (~0,32 mL).

**WUE (Water Usage Effectiveness)**
Litres d'eau consommés par kWh utilisé par un data center. Sert à estimer l'eau « directe » d'un prompt.

**Stress hydrique**
Quand la demande en eau dépasse la ressource disponible localement. Enjeu clé autour de certains data centers implantés en régions sèches.

---

## Climat & CO₂

**CO₂e (équivalent CO₂)**
Tous les gaz à effet de serre ramenés à leur impact exprimé en CO₂, pour pouvoir les additionner.

**Forçage radiatif**
Le réchauffement supplémentaire causé par les vols en altitude (traînées, autres gaz). DEFRA et l'ADEME le comptent (×~1,9) ; l'ICAO compte le CO₂ seul — d'où des chiffres d'avion qui varient du simple au double.

**Intensité carbone du réseau**
Les grammes de CO₂ émis par kWh d'électricité. Très variable selon le pays (faible avec nucléaire/renouvelables, élevée au charbon) ; ~480 g/kWh en moyenne mondiale.

**Analyse de cycle de vie (ACV / LCA)**
Méthode qui compte l'impact « du berceau à la tombe » : fabrication, usage et fin de vie. Elle explique pourquoi l'empreinte d'un objet dépasse sa seule consommation à l'usage.

**Scopes 1 / 2 / 3**
Les périmètres d'émissions : directes (1), liées à l'électricité achetée (2), et tout le reste de la chaîne de valeur (3).

---

## Lire les chiffres

**Ordre de grandeur**
La « taille » approximative d'un nombre (×10, ×100, ×1 000). Sur des données incertaines, c'est plus honnête et plus utile qu'une fausse précision.

**Médiane & fourchette**
Quand les sources divergent, on retient une valeur centrale crédible (médiane) et on affiche l'écart (fourchette) — jamais un chiffre unique faussement précis.

---

*Un terme manque ? Écrivez-nous. Toutes les valeurs citées sont sourcées sur la page **Sources**.*
