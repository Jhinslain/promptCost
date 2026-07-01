# DATA 2 — Grands gestes personnels (magnitude élevée)

> Complément de `DATA.md` §4G. Objectif : **remplir vite les grandes échelles** (ChatGPT en 1 jour, toute l'IA en 1 an) avec des gestes **personnels** (gros achat, usage annuel, vacances) — jamais industriels.
>
> Unités app : **Wh**, **mL**, **g CO₂e**. À taguer `size: "grand"` dans `lib/data.ts`. Les valeurs marquées *(ordre de grandeur)* n'ont pas de source institutionnelle unique : à afficher comme approximations.

---

## ⚡ Électricité (Wh)

| Grand geste | Emoji | Wh | Source |
|---|---|---|---|
| Recharger une voiture élec. (1 plein ~60 kWh) | 🔌 | 60 000 | physique |
| 1 an de lessives | 👕 | 85 000 | ADEME |
| 1 an d'éclairage (maison, FR) | 💡 | 105 000 | ADEME |
| 1 an de télé | 📺 | 155 000 | ADEME |
| Réfrigérateur / an | 🧊 | 180 000 | ADEME |
| Sèche-linge / an | 🌀 | 180 000 | ADEME |
| Congélateur / an | 🧊 | 250 000 | ADEME *(ordre de grandeur)* |
| Pompe de piscine / an | 🏊 | 1 200 000 | *(ordre de grandeur, ~1 200 kWh)* |
| Climatisation maison / an | ❄️ | 1 900 000 | US EIA |
| Chauffe-eau électrique / an | 🚿 | 2 400 000 | US DOE *(~2 400 kWh)* |
| Spa / jacuzzi / an | 🛁 | 2 500 000 | *(ordre de grandeur, 1 200–3 600 kWh)* |
| Voiture électrique / an (~24 000 km) | 🚗 | 3 500 000 | US DOE/EPA |
| Électricité du foyer / an (FR) | 🏡 | 4 300 000 | ADEME *(US ~10,8 M)* |
| Chauffage élec. maison / an | 🔥 | 5 000 000 | ADEME |

## 💧 Eau (mL — « virtuelle » sauf mention)

| Grand geste | Emoji | mL | Source |
|---|---|---|---|
| 1 kg de riz | 🍚 | 2 497 000 | WFN |
| 1 burger (total) | 🍔 | 2 500 000 | WFN |
| 1 t-shirt coton | 👕 | 2 500 000 | WFN |
| 1 kg de fromage | 🧀 | 3 200 000 | WFN |
| 1 jean | 👖 | 8 000 000 | WFN |
| Une paire de chaussures en cuir | 👞 | 14 000 000 | *(ordre de grandeur, cuir ~17 000 L/kg)* |
| 1 kg de bœuf | 🥩 | 15 400 000 | WFN |
| 1 kg d'amandes | 🌰 | 16 000 000 | WFN |
| 1 kg de chocolat | 🍫 | 17 000 000 | WFN |
| 1 an de douches (1 pers.) | 🚿 | 18 000 000 | dérivé US EPA (≈50 L × 365) |
| 1 kg de café | ☕ | 18 900 000 | WFN |
| Garde-robe coton (1 jean + 5 t-shirts) | 🧺 | 20 500 000 | WFN |
| Remplir une piscine privée (~50 m³) | 🏊 | 50 000 000 | *(volume type)* |
| Eau domestique / an / pers. (UE) | 🚰 | 52 600 000 | EEA *(US ~113 M)* |
| 1 an de bains quotidiens | 🛁 | 54 750 000 | dérivé US EPA (150 L × 365) |

## 🌍 CO₂ (g CO₂e)

| Grand geste | Emoji | g | Source |
|---|---|---|---|
| Fabriquer 1 smartphone | 📱 | 50 000 | Apple / Fairphone |
| Fabriquer 1 laptop | 💻 | 250 000 | Dell / HP |
| 1 an d'un chat | 🐈 | 310 000 | études (UCLA / Okin) |
| Vol Paris → New York (aller) | ✈️ | 500 000 | ICAO *(CO₂ seul ; A-R ~2,6 M avec forçage radiatif)* |
| 1 an d'un chien (moyen) | 🐕 | 770 000 | études (UCLA / Okin) |
| Vol Paris → Tokyo (aller) | ✈️ | 1 500 000 | myclimate *(éco, 9 700 km)* |
| 1 an de régime très carné (>100 g/j) | 🥩 | 2 620 000 | Our World in Data / Scarborough et al. |
| 1 an de chauffage au gaz (maison) | 🔥 | 2 500 000 | ADEME *(ordre de grandeur)* |
| 1 semaine de croisière | 🚢 | 3 000 000 | ICCT / analyses sectorielles |
| Émissions de sa voiture / an | 🚗 | 4 600 000 | US EPA |
| Fabriquer 1 voiture thermique neuve | 🚙 | 6 000 000 | Zemo Partnership *(5,6 t)* |
| Fabriquer 1 voiture électrique neuve | 🔋 | 8 800 000 | Zemo Partnership |
| Empreinte carbone perso / an (France) | 🌍 | 9 000 000 | Eurostat *(conso ; US ~17,6 M)* |
| Fabriquer 1 gros SUV neuf | 🚙 | 17 000 000 | LCA constructeurs |
| Construire une maison | 🏠 | 50 000 000 | MIT Climate Portal *(50–80 t, cycle de vie)* |

---

## Sources à ajouter sur `/sources`
- **US DOE** — chauffe-eau : https://www.energy.gov/energysaver/water-heating
- **myclimate** — calculateur d'émissions de vol : https://co2.myclimate.org/en/flight_calculators/new
- **Our World in Data** — empreinte carbone des régimes alimentaires (Scarborough et al.) : https://ourworldindata.org/food-choice-vs-eating-local
- **UCLA** — empreinte carbone des animaux de compagnie (étude G. Okin) : https://newsroom.ucla.edu/releases/the-truth-about-cats-and-dogs-environmental-impact
- *(Déjà dans DATA.md : ADEME, US EIA/DOE/EPA, WFN, EEA, Zemo Partnership, MIT Climate Portal, ICCT.)*

## Note d'intégration
Beaucoup de ces gestes existent en **version unitaire** ailleurs (ex. `steak`, `burger`, `flight`) ; ici ce sont les variantes **lourdes** (au kg, à l'année, gros achat). Les regrouper sous un libellé « Gros gestes » ou un filtre, et les faire remonter automatiquement quand l'échelle choisie est grande (ChatGPT/jour, IA mondiale).
