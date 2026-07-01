# Jeu de données — coûts énergie / eau / CO₂

> Source de vérité pour `/lib/data.ts`. Chiffres issus d'une recherche croisée (2025-2026) **uniquement sur des institutions internationales de référence** (voir §5 SOURCES). Chaque ligne porte sa source.
>
> **Unités de l'app :** électricité en **Wh**, eau en **mL**, CO₂ en **g CO₂e**. Variantes annuelles en kWh/an, m³/an, kg ou t CO₂e/an.
> **Variantes :** beaucoup d'items ont une version **unitaire** (un geste) ET **annuelle** (usage sur l'année) — à exposer comme deux entrées liées (ex. « Four 1 h » et « Four — usage annuel »).
>
> ⚠️ **Honnêteté = crédibilité.** Distinguer toujours : eau **directe** (robinet) vs eau **virtuelle** (production d'un aliment/objet). Idem CO₂ : préciser vol avec/sans forçage radiatif, aller vs aller-retour.

---

## 1. Référence par prompt IA (requête texte moyenne, modèle type GPT-4o)

| Métrique | Valeur retenue | Fourchette | Source |
|---|---|---|---|
| Énergie | **0,3 Wh** | 0,24–0,4 Wh | Google 0,24 · Epoch AI 0,30 · OpenAI 0,34 |
| Eau (directe) | **0,3 mL** | 0,26–0,32 mL ; ~1,5 mL avec l'amont électrique | Google 0,26 · OpenAI 0,32 |
| CO₂ | **0,2 g** | 0,15 g (opérationnel, réseau ~480 g/kWh) → ~1 g (cycle de vie) | dérivé 0,3 Wh × intensité réseau |

Requêtes « raisonnement » : ~20 Wh+. Génération d'image : ~6–12 Wh (20–40× le texte). *(Sources : Epoch AI, Google, OpenAI, arXiv 2505.09598.)*

### 1b. Modèles IA — coût par prompt (mode inversé)
> Eau et CO₂ **dérivés au même ratio que le standard** (× valeur Wh ÷ 0,3). Ordres de grandeur : forte variance entre benchmarks ; seuls Google et OpenAI publient des valeurs officielles (modèles standard).

| Palier | Wh / prompt | Fourchette | Modèles (2026) | Source |
|---|---|---|---|---|
| 🪶 Léger | 0,1 | 0,05–0,3 | GPT‑5 mini / nano · Gemini 3.5 Flash / Flash‑Lite · Claude Haiku 4.5 | Google / benchmarks |
| 💬 Standard | 0,3 | 0,24–0,4 | GPT‑5.5 · Claude Sonnet 4.6 · Gemini 3.1 Pro · GPT‑4.1 | Google 0,24 · OpenAI 0,34 |
| 🧠 Raisonnement | 20 | 15–40 | GPT‑5 Thinking / Pro · o‑series · DeepSeek‑R1 · Claude Opus 4.8 (thinking) · Gemini thinking · Grok 4 | « How Hungry is AI? » · Univ. Rhode Island |
| 🖼️ Image | 9 | 6–12 | DALL·E / GPT‑Image · Imagen · Midjourney | arXiv 2506.17016 |
| 🎬 Vidéo | ~940 (clip ~5 s) | non‑linéaire : durée ×2 → énergie ×4 | Sora · Veo · Kling · CogVideoX | Hugging Face (Luccioni) |

Repères : raisonnement ≈ 50–100× le texte standard · image ≈ 20–40× · vidéo ≈ 1 000–3 000×.

---

## 2. ÉLECTRICITÉ (Wh par geste · kWh/an)

### 2a. Gestes unitaires
| Action | Emoji | Wh / geste | Source |
|---|---|---|---|
| Ampoule LED 1 h | 💡 | 10 | ADEME |
| Charger un smartphone | 📱 | 19 | ADEME (7 kWh/an, 1 charge/j) |
| Bouilloire (1 tasse) | ☕ | 25 | physique / US DOE |
| Laptop 1 h | 💻 | 25 | ADEME (25 kWh/an) |
| TV 1 h | 📺 | 70 | ADEME (155 kWh/an, 6 h/j) — *range 70–150 selon taille* |
| Aspirateur 10 min | 🧹 | 90 | ADEME (550 W) — *jusqu'à ~250 pour modèles puissants* |
| Micro-ondes 5 min | ♨️ | 90 | ADEME |
| PC fixe 1 h | 🖥️ | 100 | ADEME (140 kWh/an) |
| Bouilloire (pleine) | 🫖 | 125 | US DOE |
| Sèche-cheveux 10 min | 💇 | 250 | physique (1500 W) |
| 1 h gaming PC | 🎮 | 400 | ADEME / constructeurs |
| Lave-linge (1 cycle) | 👕 | 500 | ADEME |
| Four 1 h | 🔥 | 700 | ADEME (130 kWh/an, 187 cycles) |
| Lave-vaisselle (1 cycle) | 🍽️ | 900 | ADEME |
| Climatisation 1 h | ❄️ | 1 000 | ADEME / US EIA |
| Sèche-linge (1 cycle) | 🌀 | 1 600 | ADEME |
| Recharge voiture élec. (100 km) | 🔌 | 18 000 | US DOE/EPA (fueleconomy.gov) |

### 2b. Variantes annuelles (kWh/an)
| Usage annuel | Emoji | kWh/an | Source |
|---|---|---|---|
| Smartphone (charge/an) | 📱 | 7 | ADEME |
| Aspirateur (an) | 🧹 | 20 | ADEME |
| Laptop (an) | 💻 | 25 | ADEME |
| Micro-ondes (an) | ♨️ | 40 | ADEME |
| Lave-linge (an) | 👕 | 85 | ADEME (198 cycles) |
| Éclairage maison (an, FR) | 💡 | 105 | ADEME — *US : 654/foyer (EIA)* |
| Four (an) | 🔥 | 130 | ADEME |
| PC fixe (an) | 🖥️ | 140 | ADEME |
| Lave-vaisselle (an) | 🍽️ | 150 | ADEME |
| TV (an) | 📺 | 155 | ADEME — *US : 210/foyer (EIA)* |
| Réfrigérateur (an) | 🧊 | 180 | ADEME (combi 315) |
| Sèche-linge (an) | 🌀 | 180 | ADEME |
| Climatisation (an, par unité) | ❄️ | 100–800 | ADEME — *US : ~1 900/foyer (EIA)* |
| Voiture électrique (an, ~24 000 km) | 🔌 | 3 000–4 500 | US DOE/EPA |
| Chauffage élec. (maison/an) | 🏠 | 5 000 | ADEME (2 500 en pompe à chaleur A+++) |
| **Foyer entier (an)** | 🏡 | FR ~4 300 (hors chauffage) · UE 2 500–5 000 · US ~10 800 | ADEME · Eurostat · US EIA |

---

## 3. EAU (mL ; aliments/objets = empreinte « virtuelle », production comprise)

### 3a. Eau directe (robinet)
| Action | Emoji | mL | Source |
|---|---|---|---|
| 1 verre d'eau | 🥤 | 250 | USGS / EPA |
| 1 chasse d'eau | 🚽 | 6 000 | US EPA WaterSense (4,8–6 L) |
| Brossage dents (robinet ouvert) | 🪥 | 6 000 | US EPA WaterSense |
| Lave-vaisselle (1 cycle) | 🍽️ | 15 000 | US EPA / ENERGY STAR |
| Douche 5 min | 🚿 | 50 000 | US EPA (38–75 L selon pommeau) |
| Lave-linge (1 cycle, eau) | 👕 | 60 000 | US EPA (53–114 L) |
| Un bain | 🛁 | 150 000 | US EPA |
| **Conso domestique (pers./an)** | 🚰 | UE ~52 600 L · US ~113 000 L | EEA · USGS |

### 3b. Eau virtuelle (empreinte de production)
| Action | Emoji | mL | Source |
|---|---|---|---|
| 1 feuille de papier A4 | 📄 | 10 000 | WFN (Van Oel & Hoekstra) |
| 1 amande | 🌰 | 12 000 | WFN (Mekonnen & Hoekstra) |
| 1 tomate | 🍅 | 13 000 | WFN |
| 1 tranche de pain | 🍞 | 40 000 | WFN |
| 1 pomme | 🍎 | 70 000 | WFN |
| 1 verre de bière | 🍺 | 74 000 | WFN |
| 1 verre de vin | 🍷 | 110 000 | WFN |
| 1 tasse de café | ☕ | 132 000 | WFN |
| 1 assiette de pâtes/riz | 🍝 | 165 000 | WFN |
| 1 œuf | 🥚 | 196 000 | WFN |
| 1 verre de lait | 🥛 | 255 000 | WFN |
| 1 tablette de chocolat (100 g) | 🍫 | 1 700 000 | WFN |
| 1 t-shirt coton | 👕 | 2 500 000 | WFN (Chapagain et al.) |
| 1 burger (total) | 🍔 | 2 500 000 | WFN |
| 1 jean | 👖 | 8 000 000 | WFN |

*Repères par kg (WFN) : bœuf 15 400 L/kg · fromage ~3 200 · riz 2 497 · blé 1 827 · café 18 900 · amandes ~16 000 · chocolat ~17 000.*

---

## 4. CO₂ (g CO₂e)

### 4a. Transport — par km / par trajet
| Mode | Emoji | g CO₂e | Source |
|---|---|---|---|
| Marche / vélo | 🚶 | ~0 (direct) | OWID |
| TGV (par voyageur-km) | 🚄 | 3 | ADEME |
| Métro / tram (p-km) | 🚇 | 4 | ADEME |
| Eurostar (p-km) | 🚆 | 4 | OWID (DEFRA) |
| Car longue distance (p-km) | 🚌 | 27 | OWID (DEFRA) |
| Train national (p-km) | 🚆 | 35 | OWID (DEFRA) |
| Voiture électrique (km, réseau FR) | 🔌 | 67 | ADEME |
| Bus de ville (p-km) | 🚍 | 97 | OWID (DEFRA) |
| Moto / scooter (km) | 🏍️ | 103 | OWID (DEFRA) |
| Voiture diesel (km) | 🚗 | 142 | ADEME / EEA |
| Vol long-courrier (p-km, avec forçage radiatif) | ✈️ | 148 | OWID (DEFRA) |
| Vol court-courrier intl (p-km, FR) | ✈️ | 154 | OWID (DEFRA) |
| Voiture essence (km) | 🚗 | 170 | OWID (DEFRA) |
| Vol domestique (p-km, FR) | ✈️ | 246 | OWID (DEFRA) |
| Croisière (p-km) | 🚢 | ~250 | ICCT |
| **Vol Paris→New York (aller)** | ✈️ | 620 000 (CO₂ seul, ICAO) · ~1 300 000 (avec forçage radiatif, ADEME) | ICAO · ADEME |

### 4b. Transport — variante annuelle
| Usage annuel | g CO₂e/an | Source |
|---|---|---|
| Voiture (par véhicule, US) | 4 600 000 (4,6 t) | US EPA |
| Empreinte transport perso (UE) | ~2 000 000 | EEA |

### 4c. Alimentation — par portion
| Aliment | Emoji | g CO₂e | Source |
|---|---|---|---|
| Légumes (75 g) | 🥦 | 40 | OWID (Poore & Nemecek) |
| Pomme | 🍎 | 65 | OWID |
| Pain (tranche) | 🍞 | 94 | OWID |
| Banane | 🍌 | 103 | OWID |
| Pâtes (75 g sec) | 🍝 | 118 | OWID |
| Vin (verre 175 mL) | 🍷 | 134 | OWID |
| Café (tasse) | ☕ | 200 | OWID |
| Tofu (75 g) | 🟫 | 237 | OWID |
| Œuf | 🥚 | 280 | OWID |
| Riz (75 g sec) | 🍚 | 334 | OWID |
| Fromage (30 g) | 🧀 | 720 | OWID |
| Lait (verre 250 mL) | 🥛 | 790 | OWID |
| Chocolat noir (25 g) | 🍫 | 1 170 | OWID |
| Poulet (150 g) | 🍗 | 1 480 | OWID |
| Porc (150 g) | 🥓 | 1 850 | OWID |
| Crevettes (150 g) | 🦐 | 4 030 | OWID |
| 1 burger de bœuf | 🍔 | 5 000 | OWID — *fourchette 3 000–7 000* |
| Steak de bœuf (200 g) | 🥩 | 10 000 | OWID (bœuf ~50 kg/kg) |

*Repères par kg (OWID/Poore & Nemecek 2018) : bœuf 60–99 · agneau 40 · fromage 24 · crevettes 27 · porc 12 · poulet 10 · œufs 4,7 · riz 4,5 · légumes 0,5.*

### 4d. Biens & numérique
| Item | Emoji | g CO₂e | Source |
|---|---|---|---|
| 1 email simple | 📧 | 4 | Berners-Lee |
| 1 email + pièce jointe | 📎 | 19 | ADEME |
| Stockage 1 Go cloud / an | ☁️ | 15 | IEA / ADEME |
| 1 h vidéo streaming | 📺 | 36 | IEA (mondiale 2019) |
| 1 livre (broché) | 📕 | 2 700 | DEFRA / LCA |
| 1 t-shirt coton | 👕 | 6 000 | ADEME |
| 1 paire de baskets | 👟 | 14 000 | MIT |
| 1 jean | 👖 | 25 000 | ADEME |
| Fabriquer 1 smartphone | 📱 | 50 000 | Apple PER / Fairphone LCA |
| Fabriquer 1 laptop | 💻 | 250 000 | Dell / HP LCA |

### 4e. Empreinte carbone annuelle par personne (contexte)
| Zone | t CO₂e/an | Source |
|---|---|---|
| Monde | ~4,7 | IEA / OWID |
| Union européenne (conso) | ~9,0 | Eurostat |
| États-Unis | ~17,6 | IEA / WRI |

---

## 4G. Grands gestes personnels (magnitude élevée)

> Actions **lourdes mais personnelles** (usage annuel, gros achat) pour atteindre vite les grandes échelles (ville / pays / monde) sans multiplier les petits clics. À **taguer `size: "grand"`** dans `data.ts` (groupe « gros gestes » ou mis en avant aux grandes échelles). Rien d'industriel : uniquement ce qu'une personne fait, consomme ou achète.

### Électricité (Wh)
| Grand geste | Emoji | Wh | Source |
|---|---|---|---|
| Climatisation maison / an | ❄️ | 1 900 000 | US EIA |
| Voiture électrique / an (~24 000 km) | 🔌 | 3 500 000 | US DOE/EPA |
| Électricité du foyer / an (FR) | 🏡 | 4 300 000 | ADEME *(US ~10,8 M)* |
| Chauffage élec. maison / an | 🔥 | 5 000 000 | ADEME |

### Eau (mL)
| Grand geste | Emoji | mL | Source |
|---|---|---|---|
| Manger 1 kg de bœuf | 🥩 | 15 400 000 | WFN |
| 1 an de douches (1 pers.) | 🚿 | 18 000 000 | dérivé US EPA (≈50 L × 365) |
| Une garde-robe coton (1 jean + 5 t-shirts) | 👖 | 20 500 000 | WFN |
| Eau domestique / an / pers. (UE) | 🚰 | 52 600 000 | EEA *(US ~113 M)* |
| Remplir une piscine privée (~50 m³) | 🏊 | 50 000 000 | ordre de grandeur (volume type) |

### CO₂ (g)
| Grand geste | Emoji | g | Source |
|---|---|---|---|
| Vol Paris → New York (aller-retour) | ✈️ | 2 600 000 | ADEME *(avec forçage radiatif ; 1,3 M en CO₂ seul)* |
| 1 semaine de croisière | 🚢 | 3 000 000 | ICCT / analyses sectorielles (ordre de grandeur) |
| Émissions de sa voiture / an | 🚗 | 4 600 000 | US EPA |
| Fabriquer 1 voiture thermique neuve | 🚙 | 6 000 000 | Zemo Partnership *(5,6 t ; jusqu'à ~17 t gros SUV)* |
| Fabriquer 1 voiture électrique neuve | 🔋 | 8 800 000 | Zemo Partnership |
| Empreinte carbone perso / an (France) | 🌍 | 9 000 000 | Eurostat *(conso ; US ~17,6 M)* |
| Construire une maison | 🏠 | 50 000 000 | MIT Climate Portal *(type 50–80 t sur le cycle de vie)* |

---

## 5. SOURCES (à afficher sur la page `/sources` du site)

**IA / numérique**
- Epoch AI — énergie par requête : https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use
- Google Cloud — impact environnemental de l'inférence : https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference
- OpenAI / Sam Altman — « The Gentle Singularity » : https://blog.samaltman.com/the-gentle-singularity
- « How Hungry is AI? » (arXiv 2505.09598) : https://arxiv.org/abs/2505.09598
- IEA — *Energy and AI* : https://www.iea.org/reports/energy-and-ai
- IEA — empreinte du streaming vidéo (36 g/h) : https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines
- EcoLogits / GenAI Impact : https://ecologits.ai/
- Hugging Face — AI Energy Score / S. Luccioni (énergie image & vidéo) : https://huggingface.co/blog/sasha/ai-energy-score-v2
- « The Hidden Cost of an Image » (arXiv 2506.17016) — énergie génération d'image : https://arxiv.org/abs/2506.17016

**Électricité**
- ADEME — consommation des appareils ménagers (Panel ELECDOM / Guide Topten) : https://agirpourlatransition.ademe.fr/particuliers/economiser/energie/consommation-appareils-menagers
- US EIA — usage électrique des foyers : https://www.eia.gov/energyexplained/use-of-energy/electricity-use-in-homes.php
- US DOE — estimation conso appareils : https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use
- US DOE/EPA — fueleconomy.gov (véhicules électriques) : https://www.fueleconomy.gov/feg/label/learn-more-electric-label.shtml
- ENERGY STAR — lave-vaisselle : https://www.energystar.gov/products/dishwashers/key_product_criteria
- Eurostat — énergie des ménages : https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Energy_consumption_in_households
- UK Ofgem — consommation domestique type : https://www.ofgem.gov.uk/information-consumers/energy-advice-households/average-gas-and-electricity-use-explained

**Eau**
- Water Footprint Network (Mekonnen & Hoekstra, UNESCO-IHE) : https://www.waterfootprint.org/resources/Mekonnen-Hoekstra-2012-WaterFootprintFarmAnimalProducts_1.pdf
- WFN — empreinte des cultures (Mekonnen & Hoekstra 2011) : https://waterfootprint.org/media/downloads/Mekonnen-Hoekstra-2011-WaterFootprintCrops.pdf
- WFN — coton (Chapagain et al. 2006) : https://www.waterfootprint.org/resources/Report18.pdf
- US EPA WaterSense : https://www.epa.gov/watersense/how-we-use-water
- USGS — usage de l'eau aux US (Circular 1441) : https://pubs.usgs.gov/publication/cir1441
- European Environment Agency — eau des ménages : https://www.eea.europa.eu/data-and-maps/indicators/household-energy-consumption/household-water-consumption

**CO₂ — transport & alimentation**
- Our World in Data — empreinte carbone des transports (facteurs DEFRA) : https://ourworldindata.org/travel-carbon-footprint
- Our World in Data — GES par aliment (Poore & Nemecek 2018, *Science*) : https://ourworldindata.org/grapher/ghg-per-kg-poore
- ADEME — Base Empreinte / Impact CO2 : https://impactco2.fr/
- UK DEFRA/DESNZ — facteurs de conversion GES : https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting
- European Environment Agency — CO₂ des voitures neuves : https://www.eea.europa.eu/en/analysis/indicators/co2-performance-of-new-passenger
- ICAO — calculateur carbone aérien : https://icec.icao.int/
- ICCT — transport maritime / croisières : https://theicct.org/marine-cruising-flying-may22/
- US EPA — émissions d'un véhicule type : https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle

**CO₂ — biens & contexte**
- Apple — Product Environmental Reports : https://www.apple.com/environment/
- Fairphone — Life Cycle Assessment : https://www.fairphone.com/
- MIT — empreinte d'une paire de baskets (Cheah et al. 2013) : https://news.mit.edu/2013/footwear-carbon-footprint-0522
- MIT Climate Portal — CO₂ de la construction d'une maison : https://climate.mit.edu/ask-mit/how-much-co2-emitted-building-new-house
- Zemo Partnership — émissions cycle de vie / fabrication des voitures : https://www.zemo.org.uk/
- ICCT — émissions du transport maritime / croisières : https://theicct.org/marine-cruising-flying-may22/
- Mike Berners-Lee — *How Bad Are Bananas?* (email/numérique)
- Eurostat — empreinte carbone par habitant : https://ec.europa.eu/eurostat/

---

### Notes de méthodo à publier (`/methodologie`)
1. **Eau directe vs virtuelle** : une chasse d'eau (~6 L d'eau potable) et un burger (~2 500 L, surtout pluie + irrigation) ne mesurent pas la même chose. Le préciser visuellement.
2. **Vols** : DEFRA/ADEME intègrent le **forçage radiatif** (×~1,9) ; l'ICAO compte le **CO₂ seul**. Toujours indiquer aller vs aller-retour.
3. **Bœuf** : 60 kg CO₂e/kg (moyenne conso) à 99 kg/kg (troupeau allaitant). Donner la fourchette.
4. **Électricité (variantes annuelles)** : valeurs ADEME (France, usages réels mesurés) ; aux US les foyers consomment ~2× plus (EIA).
5. **PER_PERSON_YEAR = 12 000 prompts/an** est une hypothèse « usage intensif » à afficher clairement.
