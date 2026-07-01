// ─────────────────────────────────────────────────────────────────────────────
// SOURCE DE VÉRITÉ : toutes les valeurs chiffrées du site.
// Règle d'or : aucun nombre codé en dur dans les composants. Tout vient d'ici.
// Chaque valeur embarque son unité et un `sourceId` pointant vers SOURCES.
// Chiffres issus de Data.md (recherche croisée 2025-2026, institutions de
// référence : ADEME, US EPA/DOE/EIA, Water Footprint Network, Our World in
// Data, IEA, DEFRA, ICAO…).
// ─────────────────────────────────────────────────────────────────────────────

export type MetricId = 'elec' | 'water' | 'co2';

/** Date de dernière mise à jour des données (recherche croisée). */
export const DATA_AS_OF = '2026-06-30';

/** Hypothèse d'usage intensif : prompts IA par personne et par an. */
export const PERSON_YEAR = 12_000;

/**
 * Coût d'UN prompt texte moyen (modèle type GPT-4o) par métrique,
 * dans l'unité de base de la métrique (Wh, mL, g CO₂e).
 */
export const PER: Record<MetricId, number> = {
  elec: 0.3, // Wh
  water: 0.3, // mL (refroidissement direct)
  co2: 0.2, // g CO₂e
};

/** Fourchette crédible affichée dans la méthodologie. */
export const PER_RANGE: Record<MetricId, { min: number; max: number; note: string }> = {
  elec: { min: 0.24, max: 0.4, note: 'Google 0,24 · Epoch AI 0,30 · OpenAI 0,34' },
  water: { min: 0.26, max: 0.32, note: 'Google 0,26 · OpenAI 0,32 (direct) ; ~1,5 mL avec l\'amont électrique' },
  co2: { min: 0.15, max: 1, note: '~0,15 g opérationnel (réseau ~480 g/kWh) → ~1 g en cycle de vie' },
};

export interface MetricConfig {
  id: MetricId;
  emoji: string;
  unit: string; // unité de base
  /** Accent VIF (aplats, barres, halos) en clair / sombre, format "R G B". */
  accent: { light: string; dark: string };
  /** Accent TEXTE : assez foncé pour passer AA (≥4.5:1) sur fond clair ; en
      sombre = l'accent clair (déjà lisible sur surface foncée). */
  accentText: { light: string; dark: string };
}

// 🎨 SOURCE UNIQUE DES COULEURS D'ACCENT (par métrique, clair/sombre).
// `accent` = couleur de marque vive (aplats/boutons via --on-accent).
// `accentText` = variante foncée pour le TEXTE coloré (contraste AA).
export const METRICS: MetricConfig[] = [
  {
    id: 'elec',
    emoji: '⚡',
    unit: 'Wh',
    accent: { light: '245 166 35', dark: '255 209 102' },
    accentText: { light: '138 83 0', dark: '255 209 102' },
  },
  {
    id: 'water',
    emoji: '💧',
    unit: 'mL',
    accent: { light: '47 155 255', dark: '92 200 255' },
    accentText: { light: '12 110 210', dark: '92 200 255' },
  },
  {
    id: 'co2',
    emoji: '🌍',
    unit: 'g',
    accent: { light: '22 163 74', dark: '52 211 153' },
    accentText: { light: '15 122 55', dark: '52 211 153' },
  },
];

export const METRIC_BY_ID: Record<MetricId, MetricConfig> = Object.fromEntries(
  METRICS.map((m) => [m.id, m]),
) as Record<MetricId, MetricConfig>;

// Les échelles vivent désormais dans lib/scales.ts (budgets de prompts basés
// sur l'usage réel de l'IA, sans multiplicateur de population).

export interface ActionData {
  id: string;
  emoji: string;
  /** Coût de l'action dans l'unité de base de la métrique (pour une personne). */
  value: number;
  sourceId: string;
  /** « grand » = gros geste personnel (gros achat, usage annuel) : DATA2. */
  size?: 'grand';
}

/**
 * Activités par métrique, dans l'unité de base.
 * Gestes unitaires (Data.md §2a / §3a-3b / §4a-4c-4d).
 * Triées par coût croissant à l'affichage (logique dans le composant).
 */
export const ACTIONS: Record<MetricId, ActionData[]> = {
  // ⚡ ÉLECTRICITÉ : Wh par geste
  elec: [
    { id: 'led', emoji: '💡', value: 10, sourceId: 'ademe' },
    { id: 'phone_charge', emoji: '📱', value: 19, sourceId: 'ademe' },
    { id: 'laptop', emoji: '💻', value: 25, sourceId: 'ademe' },
    { id: 'kettle', emoji: '☕', value: 25, sourceId: 'us-doe' },
    { id: 'tv', emoji: '📺', value: 70, sourceId: 'ademe' },
    { id: 'microwave', emoji: '♨️', value: 90, sourceId: 'ademe' },
    { id: 'vacuum', emoji: '🧹', value: 90, sourceId: 'ademe' },
    { id: 'desktop', emoji: '🖥️', value: 100, sourceId: 'ademe' },
    { id: 'hairdryer', emoji: '💇', value: 250, sourceId: 'ademe' },
    { id: 'gaming', emoji: '🎮', value: 400, sourceId: 'ademe' },
    { id: 'laundry', emoji: '🧺', value: 500, sourceId: 'ademe' },
    { id: 'oven', emoji: '🔥', value: 700, sourceId: 'ademe' },
    { id: 'dishwasher', emoji: '🍽️', value: 900, sourceId: 'ademe' },
    { id: 'ac', emoji: '❄️', value: 1000, sourceId: 'ademe' },
    { id: 'dryer', emoji: '🌀', value: 1600, sourceId: 'ademe' },
    { id: 'kettle_full', emoji: '🫖', value: 125, sourceId: 'us-doe' },
    { id: 'ev_charge', emoji: '🔌', value: 18_000, sourceId: 'fueleconomy' },
    // Grands gestes & variantes annuelles (Data.md §2b, kWh/an → Wh)
    { id: 'laptop_year', emoji: '💻', value: 25_000, sourceId: 'ademe' },
    { id: 'lighting_year', emoji: '💡', value: 105_000, sourceId: 'ademe' },
    { id: 'tv_year', emoji: '📺', value: 155_000, sourceId: 'ademe' },
    { id: 'fridge_year', emoji: '🧊', value: 180_000, sourceId: 'ademe' },
    { id: 'ev_year', emoji: '🔋', value: 3_750_000, sourceId: 'fueleconomy' },
    { id: 'home_year', emoji: '🏡', value: 4_300_000, sourceId: 'ademe' },
    { id: 'heating_year', emoji: '🏠', value: 5_000_000, sourceId: 'ademe' },
    // ── DATA2 : grands gestes personnels (magnitude élevée) ──
    { id: 'vacuum_year', emoji: '🧹', value: 20_000, sourceId: 'ademe' },
    { id: 'microwave_year', emoji: '♨️', value: 40_000, sourceId: 'ademe' },
    { id: 'ev_full', emoji: '🚘', value: 60_000, sourceId: 'fueleconomy', size: 'grand' },
    { id: 'laundry_year', emoji: '👕', value: 85_000, sourceId: 'ademe', size: 'grand' },
    { id: 'desktop_year', emoji: '🖥️', value: 140_000, sourceId: 'ademe' },
    { id: 'dishwasher_year', emoji: '🍽️', value: 150_000, sourceId: 'ademe' },
    { id: 'dryer_year', emoji: '💨', value: 180_000, sourceId: 'ademe', size: 'grand' },
    { id: 'freezer_year', emoji: '🥶', value: 250_000, sourceId: 'ademe', size: 'grand' },
    { id: 'pool_pump', emoji: '🏊', value: 1_200_000, sourceId: 'us-eia', size: 'grand' },
    { id: 'ac_year', emoji: '🌬️', value: 1_900_000, sourceId: 'us-eia', size: 'grand' },
    { id: 'water_heater', emoji: '🚿', value: 2_400_000, sourceId: 'us-doe', size: 'grand' },
    { id: 'spa', emoji: '🧖', value: 2_500_000, sourceId: 'us-eia', size: 'grand' },
  ],
  // 💧 EAU : mL (direct = robinet ; virtuelle = production)
  water: [
    { id: 'glass', emoji: '🥤', value: 250, sourceId: 'usgs' },
    { id: 'toilet', emoji: '🚽', value: 6000, sourceId: 'epa-watersense' },
    { id: 'toothbrush', emoji: '🪥', value: 6000, sourceId: 'epa-watersense' },
    { id: 'paper', emoji: '📄', value: 10_000, sourceId: 'wfn-crops' },
    { id: 'almond', emoji: '🌰', value: 12_000, sourceId: 'wfn-crops' },
    { id: 'tomato', emoji: '🍅', value: 13_000, sourceId: 'wfn-crops' },
    { id: 'dishwasher_water', emoji: '🍽️', value: 15_000, sourceId: 'energystar' },
    { id: 'bread_water', emoji: '🍞', value: 40_000, sourceId: 'wfn-crops' },
    { id: 'shower', emoji: '🚿', value: 50_000, sourceId: 'epa-watersense' },
    { id: 'laundry_water', emoji: '🧺', value: 60_000, sourceId: 'epa-watersense' },
    { id: 'apple', emoji: '🍎', value: 70_000, sourceId: 'wfn-crops' },
    { id: 'beer', emoji: '🍺', value: 74_000, sourceId: 'wfn-crops' },
    { id: 'wine_water', emoji: '🍷', value: 110_000, sourceId: 'wfn-crops' },
    { id: 'coffee_water', emoji: '☕', value: 132_000, sourceId: 'wfn-crops' },
    { id: 'bath', emoji: '🛁', value: 150_000, sourceId: 'epa-watersense' },
    { id: 'pasta', emoji: '🍝', value: 165_000, sourceId: 'wfn-crops' },
    { id: 'egg_water', emoji: '🥚', value: 196_000, sourceId: 'wfn-animals' },
    { id: 'milk_water', emoji: '🥛', value: 255_000, sourceId: 'wfn-animals' },
    { id: 'tshirt_water', emoji: '👕', value: 2_500_000, sourceId: 'wfn-cotton' },
    { id: 'burger_water', emoji: '🍔', value: 2_500_000, sourceId: 'wfn-animals' },
    { id: 'chocolate_water', emoji: '🍫', value: 1_700_000, sourceId: 'wfn-crops' },
    { id: 'steak_water', emoji: '🥩', value: 3_080_000, sourceId: 'wfn-animals' },
    { id: 'jeans_water', emoji: '👖', value: 8_000_000, sourceId: 'wfn-cotton' },
    // Grand geste : consommation d'eau domestique sur une année (Data.md §3a)
    { id: 'home_water_year', emoji: '🚰', value: 52_600_000, sourceId: 'eea-water' },
    // ── DATA2 : grands gestes (eau virtuelle, au kg / à l'année) ──
    { id: 'rice_kg', emoji: '🍚', value: 2_497_000, sourceId: 'wfn-crops', size: 'grand' },
    { id: 'cheese_kg', emoji: '🧀', value: 3_200_000, sourceId: 'wfn-animals', size: 'grand' },
    { id: 'leather_shoes', emoji: '👞', value: 14_000_000, sourceId: 'wfn-animals', size: 'grand' },
    { id: 'beef_kg', emoji: '🐄', value: 15_400_000, sourceId: 'wfn-animals', size: 'grand' },
    { id: 'almonds_kg', emoji: '🥜', value: 16_000_000, sourceId: 'wfn-crops', size: 'grand' },
    { id: 'chocolate_kg', emoji: '🍫', value: 17_000_000, sourceId: 'wfn-crops', size: 'grand' },
    { id: 'showers_year', emoji: '🚿', value: 18_000_000, sourceId: 'epa-watersense', size: 'grand' },
    { id: 'coffee_kg', emoji: '🫘', value: 18_900_000, sourceId: 'wfn-crops', size: 'grand' },
    { id: 'wardrobe', emoji: '👗', value: 20_500_000, sourceId: 'wfn-cotton', size: 'grand' },
    { id: 'pool_fill', emoji: '🏊', value: 50_000_000, sourceId: 'epa-watersense', size: 'grand' },
    { id: 'baths_year', emoji: '🛀', value: 54_750_000, sourceId: 'epa-watersense', size: 'grand' },
    { id: 'home_water_year_us', emoji: '🚰', value: 113_000_000, sourceId: 'usgs', size: 'grand' },
  ],
  // 🌍 CO₂ : g CO₂e (transport par km, aliments/objets par unité)
  co2: [
    { id: 'tgv', emoji: '🚄', value: 3, sourceId: 'ademe-impact' },
    { id: 'metro', emoji: '🚇', value: 4, sourceId: 'ademe-impact' },
    { id: 'train', emoji: '🚆', value: 35, sourceId: 'owid-transport' },
    { id: 'veggies', emoji: '🥦', value: 40, sourceId: 'owid-food' },
    { id: 'ev_km', emoji: '🔌', value: 67, sourceId: 'ademe-impact' },
    { id: 'bus', emoji: '🚍', value: 97, sourceId: 'owid-transport' },
    { id: 'banana', emoji: '🍌', value: 103, sourceId: 'owid-food' },
    { id: 'moto', emoji: '🏍️', value: 103, sourceId: 'owid-transport' },
    { id: 'pasta_co2', emoji: '🍝', value: 118, sourceId: 'owid-food' },
    { id: 'car', emoji: '🚗', value: 170, sourceId: 'owid-transport' },
    { id: 'email', emoji: '📧', value: 19, sourceId: 'ademe-impact' },
    { id: 'streaming', emoji: '📺', value: 36, sourceId: 'iea-streaming' },
    { id: 'coffee_co2', emoji: '☕', value: 200, sourceId: 'owid-food' },
    { id: 'egg_co2', emoji: '🥚', value: 280, sourceId: 'owid-food' },
    { id: 'rice', emoji: '🍚', value: 334, sourceId: 'owid-food' },
    { id: 'cheese', emoji: '🧀', value: 720, sourceId: 'owid-food' },
    { id: 'chicken', emoji: '🍗', value: 1480, sourceId: 'owid-food' },
    { id: 'pork', emoji: '🥓', value: 1850, sourceId: 'owid-food' },
    { id: 'book', emoji: '📕', value: 2700, sourceId: 'defra' },
    { id: 'shrimp', emoji: '🦐', value: 4030, sourceId: 'owid-food' },
    { id: 'burger_co2', emoji: '🍔', value: 5000, sourceId: 'owid-food' },
    { id: 'tshirt', emoji: '👕', value: 6000, sourceId: 'ademe-impact' },
    { id: 'steak', emoji: '🥩', value: 10_000, sourceId: 'owid-food' },
    { id: 'sneakers', emoji: '👟', value: 14_000, sourceId: 'mit-sneakers' },
    { id: 'jeans', emoji: '👖', value: 25_000, sourceId: 'ademe-impact' },
    { id: 'smartphone', emoji: '📱', value: 50_000, sourceId: 'apple-env' },
    { id: 'laptop_make', emoji: '💻', value: 250_000, sourceId: 'laptop-lca' },
    { id: 'flight', emoji: '✈️', value: 620_000, sourceId: 'icao' },
    // Grands gestes annuels (Data.md §4b / §4e)
    { id: 'car_year', emoji: '🚙', value: 4_600_000, sourceId: 'us-epa-vehicle' },
    { id: 'footprint_year', emoji: '🌐', value: 9_000_000, sourceId: 'eurostat-footprint' },
    // ── DATA2 : grands gestes personnels (magnitude élevée) ──
    { id: 'cat_year', emoji: '🐈', value: 310_000, sourceId: 'ucla-pets', size: 'grand' },
    { id: 'dog_year', emoji: '🐕', value: 770_000, sourceId: 'ucla-pets', size: 'grand' },
    { id: 'flight_tokyo', emoji: '🛫', value: 1_500_000, sourceId: 'myclimate', size: 'grand' },
    { id: 'transport_year', emoji: '🛣️', value: 2_000_000, sourceId: 'eea-cars', size: 'grand' },
    { id: 'gas_heating', emoji: '🔥', value: 2_500_000, sourceId: 'ademe-impact', size: 'grand' },
    { id: 'meat_diet', emoji: '🍖', value: 2_620_000, sourceId: 'owid-diet', size: 'grand' },
    { id: 'cruise', emoji: '🚢', value: 3_000_000, sourceId: 'icct', size: 'grand' },
    { id: 'world_footprint', emoji: '🌎', value: 4_700_000, sourceId: 'eurostat-footprint', size: 'grand' },
    { id: 'ice_car_make', emoji: '🏭', value: 6_000_000, sourceId: 'zemo', size: 'grand' },
    { id: 'ev_car_make', emoji: '🔋', value: 8_800_000, sourceId: 'zemo', size: 'grand' },
    { id: 'suv_make', emoji: '🛻', value: 17_000_000, sourceId: 'zemo', size: 'grand' },
    { id: 'house_build', emoji: '🏗️', value: 50_000_000, sourceId: 'mit-climate', size: 'grand' },
  ],
};

/** Accès direct à un geste par son id (unique toutes métriques confondues). */
export const ACTION_BY_ID: Record<string, { metric: MetricId; action: ActionData }> =
  Object.fromEntries(
    (Object.keys(ACTIONS) as MetricId[]).flatMap((m) =>
      ACTIONS[m].map((a) => [a.id, { metric: m, action: a }] as const),
    ),
  );

export type SourceCategory = 'ai' | 'elec' | 'water' | 'co2';

export interface SourceData {
  id: string;
  label: string;
  url?: string;
  category: SourceCategory;
}

/** Sources affichées sur /sources, regroupées par catégorie (Data.md §5). */
export const SOURCES: SourceData[] = [
  // IA / numérique
  { id: 'epoch', category: 'ai', label: 'Epoch AI : énergie par requête ChatGPT', url: 'https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use' },
  { id: 'google-cloud', category: 'ai', label: 'Google Cloud : impact environnemental de l\'inférence IA', url: 'https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference' },
  { id: 'openai-altman', category: 'ai', label: 'OpenAI / Sam Altman : « The Gentle Singularity »', url: 'https://blog.samaltman.com/the-gentle-singularity' },
  { id: 'how-hungry', category: 'ai', label: '« How Hungry is AI? » (arXiv 2505.09598)', url: 'https://arxiv.org/abs/2505.09598' },
  { id: 'iea-ai', category: 'ai', label: 'IEA : Energy and AI', url: 'https://www.iea.org/reports/energy-and-ai' },
  { id: 'iea-streaming', category: 'ai', label: 'IEA : empreinte du streaming vidéo', url: 'https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines' },
  { id: 'ecologits', category: 'ai', label: 'EcoLogits / GenAI Impact', url: 'https://ecologits.ai/' },
  { id: 'hf-energy', category: 'ai', label: 'Hugging Face : AI Energy Score / S. Luccioni (énergie image & vidéo)', url: 'https://huggingface.co/blog/sasha/ai-energy-score-v2' },
  { id: 'arxiv-image', category: 'ai', label: '« The Hidden Cost of an Image » (arXiv 2506.17016)', url: 'https://arxiv.org/abs/2506.17016' },
  { id: 'chatgpt-volume', category: 'ai', label: 'OpenAI / TechCrunch : ChatGPT ~2,5 milliards de prompts/jour (2026) ; part de l\'IA générative ~80 % (Demandsage / Statista). Calcul : ChatGPT ~900 Md/an ÷ 0,8 ≈ 1 100 Md pour toute l\'IA générative.', url: 'https://techcrunch.com/2025/08/04/openai-says-chatgpt-users-send-2-5-billion-prompts-a-day/' },

  // Électricité
  { id: 'ademe', category: 'elec', label: 'ADEME : consommation des appareils ménagers', url: 'https://agirpourlatransition.ademe.fr/particuliers/economiser/energie/consommation-appareils-menagers' },
  { id: 'us-eia', category: 'elec', label: 'US EIA : usage électrique des foyers', url: 'https://www.eia.gov/energyexplained/use-of-energy/electricity-use-in-homes.php' },
  { id: 'us-doe', category: 'elec', label: 'US DOE : estimation de la conso des appareils', url: 'https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use' },
  { id: 'fueleconomy', category: 'elec', label: 'US DOE/EPA : fueleconomy.gov (véhicules électriques)', url: 'https://www.fueleconomy.gov/feg/label/learn-more-electric-label.shtml' },
  { id: 'energystar', category: 'elec', label: 'ENERGY STAR : lave-vaisselle & électroménager', url: 'https://www.energystar.gov/products/dishwashers/key_product_criteria' },
  { id: 'eurostat-energy', category: 'elec', label: 'Eurostat : énergie des ménages', url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Energy_consumption_in_households' },
  { id: 'ofgem', category: 'elec', label: 'UK Ofgem : consommation domestique type', url: 'https://www.ofgem.gov.uk/information-consumers/energy-advice-households/average-gas-and-electricity-use-explained' },

  // Eau
  { id: 'wfn-animals', category: 'water', label: 'Water Footprint Network : produits animaux (Mekonnen & Hoekstra)', url: 'https://www.waterfootprint.org/resources/Mekonnen-Hoekstra-2012-WaterFootprintFarmAnimalProducts_1.pdf' },
  { id: 'wfn-crops', category: 'water', label: 'Water Footprint Network : cultures (Mekonnen & Hoekstra 2011)', url: 'https://waterfootprint.org/media/downloads/Mekonnen-Hoekstra-2011-WaterFootprintCrops.pdf' },
  { id: 'wfn-cotton', category: 'water', label: 'Water Footprint Network : coton (Chapagain et al. 2006)', url: 'https://www.waterfootprint.org/resources/Report18.pdf' },
  { id: 'epa-watersense', category: 'water', label: 'US EPA WaterSense : usages domestiques de l\'eau', url: 'https://www.epa.gov/watersense/how-we-use-water' },
  { id: 'usgs', category: 'water', label: 'USGS : usage de l\'eau aux États-Unis (Circular 1441)', url: 'https://pubs.usgs.gov/publication/cir1441' },
  { id: 'eea-water', category: 'water', label: 'European Environment Agency : eau des ménages', url: 'https://www.eea.europa.eu/data-and-maps/indicators/household-energy-consumption/household-water-consumption' },

  // CO₂
  { id: 'myclimate', category: 'co2', label: 'myclimate : calculateur d\'émissions de vol', url: 'https://co2.myclimate.org/en/flight_calculators/new' },
  { id: 'owid-diet', category: 'co2', label: 'Our World in Data : empreinte carbone des régimes alimentaires (Scarborough et al.)', url: 'https://ourworldindata.org/food-choice-vs-eating-local' },
  { id: 'ucla-pets', category: 'co2', label: 'UCLA : empreinte carbone des animaux de compagnie (G. Okin)', url: 'https://newsroom.ucla.edu/releases/the-truth-about-cats-and-dogs-environmental-impact' },
  { id: 'zemo', category: 'co2', label: 'Zemo Partnership : fabrication des véhicules (analyse de cycle de vie)', url: 'https://www.zemo.org.uk/' },
  { id: 'mit-climate', category: 'co2', label: 'MIT Climate Portal : empreinte de la construction d\'une maison', url: 'https://climate.mit.edu/' },
  { id: 'owid-transport', category: 'co2', label: 'Our World in Data : empreinte carbone des transports (DEFRA)', url: 'https://ourworldindata.org/travel-carbon-footprint' },
  { id: 'owid-food', category: 'co2', label: 'Our World in Data : GES par aliment (Poore & Nemecek 2018)', url: 'https://ourworldindata.org/grapher/ghg-per-kg-poore' },
  { id: 'ademe-impact', category: 'co2', label: 'ADEME : Base Empreinte / Impact CO2', url: 'https://impactco2.fr/' },
  { id: 'defra', category: 'co2', label: 'UK DEFRA/DESNZ : facteurs de conversion GES', url: 'https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting' },
  { id: 'eea-cars', category: 'co2', label: 'European Environment Agency : CO₂ des voitures neuves', url: 'https://www.eea.europa.eu/en/analysis/indicators/co2-performance-of-new-passenger' },
  { id: 'icao', category: 'co2', label: 'ICAO : calculateur carbone aérien', url: 'https://icec.icao.int/' },
  { id: 'icct', category: 'co2', label: 'ICCT : transport maritime / croisières', url: 'https://theicct.org/marine-cruising-flying-may22/' },
  { id: 'us-epa-vehicle', category: 'co2', label: 'US EPA : émissions d\'un véhicule type', url: 'https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle' },
  { id: 'apple-env', category: 'co2', label: 'Apple : Product Environmental Reports', url: 'https://www.apple.com/environment/' },
  { id: 'fairphone', category: 'co2', label: 'Fairphone : Life Cycle Assessment', url: 'https://www.fairphone.com/' },
  { id: 'mit-sneakers', category: 'co2', label: 'MIT : empreinte d\'une paire de baskets (Cheah et al. 2013)', url: 'https://news.mit.edu/2013/footwear-carbon-footprint-0522' },
  { id: 'laptop-lca', category: 'co2', label: 'Dell / HP : analyses de cycle de vie (laptop)' },
  { id: 'berners-lee', category: 'co2', label: 'Mike Berners-Lee : « How Bad Are Bananas? » (email / numérique)' },
  { id: 'eurostat-footprint', category: 'co2', label: 'Eurostat : empreinte carbone par habitant', url: 'https://ec.europa.eu/eurostat/' },
];

export const SOURCE_BY_ID: Record<string, SourceData> = Object.fromEntries(
  SOURCES.map((s) => [s.id, s]),
);

/**
 * Empreinte estimée de la *création* de ce site (prudente, vue à la baisse) :
 * somme des prompts IA (texte + raisonnement) pour le concevoir et le coder,
 * convertie via les coûts ci-dessus. Eau et CO₂ au ratio du prompt standard.
 * `asOf` : à recaler avec le vrai nombre de prompts au lancement.
 */
export const SITE_FOOTPRINT = {
  elec: 250, // Wh
  water: 250, // mL (≈ 0,25 L)
  co2: 170, // g CO₂e
  asOf: '2026-06-30',
};

// ─────────────────────────────────────────────────────────────────────────────
// MODE INVERSÉ : « j'ai fait N prompts → voici l'équivalent en gestes ».
// Catalogue de modèles par palier + coût par prompt et par métrique.
// ⚠️ Ordres de grandeur : seuls Google (0,24 Wh) et OpenAI (0,34 Wh) publient
// des valeurs officielles ; les paliers raisonnement/image viennent de
// benchmarks (« How Hungry is AI? », Epoch AI). On affiche la fourchette.
// ─────────────────────────────────────────────────────────────────────────────

export type ModelTier = 'light' | 'standard' | 'reasoning' | 'image';

export interface TierConfig {
  id: ModelTier;
  /** Coût d'un prompt de ce palier, par métrique (Wh, mL, g CO₂e). */
  cost: Record<MetricId, number>;
  /** Fourchette indicative en énergie (Wh), pour la mention d'honnêteté. */
  range: { min: number; max: number };
  sourceId: string;
}

/**
 * Paliers de coût. L'eau suit l'énergie (~1 mL/Wh, cf. PER) et le CO₂ en
 * dérive (~0,67 g/Wh, cf. PER) : on garde le même ratio que le prompt standard.
 */
export const TIERS: TierConfig[] = [
  { id: 'light', cost: { elec: 0.1, water: 0.1, co2: 0.067 }, range: { min: 0.05, max: 0.15 }, sourceId: 'how-hungry' },
  { id: 'standard', cost: { elec: 0.3, water: 0.3, co2: 0.2 }, range: { min: 0.24, max: 0.4 }, sourceId: 'epoch' },
  { id: 'reasoning', cost: { elec: 20, water: 20, co2: 13.3 }, range: { min: 15, max: 30 }, sourceId: 'how-hungry' },
  { id: 'image', cost: { elec: 9, water: 9, co2: 6 }, range: { min: 6, max: 12 }, sourceId: 'how-hungry' },
];

export const TIER_BY_ID: Record<ModelTier, TierConfig> = Object.fromEntries(
  TIERS.map((t) => [t.id, t]),
) as Record<ModelTier, TierConfig>;

export interface ModelConfig {
  id: string;
  /** Nom commercial (non traduit). */
  label: string;
  tier: ModelTier;
}

/** Modèles proposés dans le sélecteur (regroupés par palier à l'affichage). */
export const MODELS: ModelConfig[] = [
  { id: 'gpt55', label: 'GPT-5.5', tier: 'standard' },
  { id: 'gpt41', label: 'GPT-4.1', tier: 'standard' },
  { id: 'claude-sonnet', label: 'Claude Sonnet 4.6', tier: 'standard' },
  { id: 'gemini-pro', label: 'Gemini 3.1 Pro', tier: 'standard' },
  { id: 'gpt5-mini', label: 'GPT-5 mini / nano', tier: 'light' },
  { id: 'gemini-flash', label: 'Gemini 3.5 Flash', tier: 'light' },
  { id: 'gemini-flash-lite', label: 'Gemini 3.5 Flash-Lite', tier: 'light' },
  { id: 'claude-haiku', label: 'Claude Haiku 4.5', tier: 'light' },
  { id: 'gpt5-thinking', label: 'GPT-5 Thinking / Pro', tier: 'reasoning' },
  { id: 'deepseek-r1', label: 'DeepSeek-R1', tier: 'reasoning' },
  { id: 'claude-opus', label: 'Claude Opus 4.8 (thinking)', tier: 'reasoning' },
  { id: 'gemini-thinking', label: 'Gemini 3 (thinking)', tier: 'reasoning' },
  { id: 'grok4', label: 'Grok 4', tier: 'reasoning' },
  { id: 'image-gen', label: 'DALL·E / Imagen / Midjourney', tier: 'image' },
];

export const MODEL_BY_ID: Record<string, ModelConfig> = Object.fromEntries(
  MODELS.map((m) => [m.id, m]),
);

/**
 * Gestes de référence pour traduire une conso en équivalent concret.
 * `perUnit` = coût d'UNE unité (dans l'unité de base de la métrique).
 * `unitKey` pointe vers reverse.units.<unitKey> (libellé localisé, sing./plur.).
 */
export interface EquivRef {
  metric: MetricId;
  emoji: string;
  perUnit: number;
  unitKey: string;
}

export const EQUIV_REFS: EquivRef[] = [
  // ⚡ électricité
  { metric: 'elec', emoji: '🧹', perUnit: 9, unitKey: 'vacuum_min' }, // aspirateur 90 Wh / 10 min
  { metric: 'elec', emoji: '💡', perUnit: 10, unitKey: 'led_h' }, // ampoule LED 10 Wh/h
  { metric: 'elec', emoji: '📱', perUnit: 19, unitKey: 'phone' }, // charge smartphone
  { metric: 'elec', emoji: '📺', perUnit: 70, unitKey: 'tv_h' }, // TV 70 Wh/h
  // 💧 eau
  { metric: 'water', emoji: '🥤', perUnit: 250, unitKey: 'glass' }, // verre d'eau
  { metric: 'water', emoji: '🚽', perUnit: 6000, unitKey: 'toilet' }, // chasse d'eau
  { metric: 'water', emoji: '🚿', perUnit: 50_000, unitKey: 'shower' }, // douche
  // 🌍 CO₂
  { metric: 'co2', emoji: '🚗', perUnit: 0.17, unitKey: 'car_m' }, // voiture 170 g/km → 0,17 g/m
  { metric: 'co2', emoji: '📧', perUnit: 19, unitKey: 'email' }, // email + PJ
  { metric: 'co2', emoji: '📺', perUnit: 0.6, unitKey: 'streaming_min' }, // streaming 36 g/h → 0,6 g/min
];

/**
 * Types d'usage saisis dans le mode inversé (« aujourd'hui j'ai fait… »).
 * Coût d'UNE requête par type, par métrique (eau ≈ énergie, CO₂ = ×0,667).
 * ⚠️ Vidéo : ordre de grandeur très approximatif (peu de chiffres publics).
 */
export interface UsageTypeConfig {
  id: 'text' | 'reasoning' | 'image' | 'video';
  emoji: string;
  cost: Record<MetricId, number>;
  sourceId: string;
}

export const USAGE_TYPES: UsageTypeConfig[] = [
  { id: 'text', emoji: '💬', cost: { elec: 0.3, water: 0.3, co2: 0.2 }, sourceId: 'epoch' },
  { id: 'reasoning', emoji: '🧠', cost: { elec: 20, water: 20, co2: 13.3 }, sourceId: 'how-hungry' },
  { id: 'image', emoji: '🖼️', cost: { elec: 9, water: 9, co2: 6 }, sourceId: 'how-hungry' },
  // Vidéo : ~940 Wh pour un clip ~5 s (Hugging Face / Luccioni). Non-linéaire.
  { id: 'video', emoji: '🎬', cost: { elec: 940, water: 940, co2: 626.7 }, sourceId: 'how-hungry' },
];

/**
 * Pool de « tu aurais pu… » : gestes concrets tirés au sort dans le résultat.
 * `kind` détermine le rendu :
 *  - 'time'     → perUnit = coût d'UNE heure d'activité → durée (s/min/h/j/an)
 *  - 'distance' → perUnit = coût d'UN km → distance (m/km)
 *  - 'count'    → perUnit = coût d'UNE occurrence → nombre de fois
 * Le libellé vit dans reverse.deeds.<id> ({d} = durée/distance, {q} = nombre).
 */
export type DeedKind = 'time' | 'distance' | 'count';

export interface EquivDeed {
  id: string;
  metric: MetricId;
  emoji: string;
  kind: DeedKind;
  perUnit: number;
}

export const EQUIV_DEEDS: EquivDeed[] = [
  // ⚡ énergie : durées d'appareils (Wh par heure d'usage)
  { id: 'led', metric: 'elec', emoji: '💡', kind: 'time', perUnit: 10 },
  { id: 'tv', metric: 'elec', emoji: '📺', kind: 'time', perUnit: 70 },
  { id: 'gaming', metric: 'elec', emoji: '🎮', kind: 'time', perUnit: 400 },
  { id: 'oven', metric: 'elec', emoji: '🔥', kind: 'time', perUnit: 700 },
  { id: 'microwave', metric: 'elec', emoji: '♨️', kind: 'time', perUnit: 1080 }, // 90 Wh / 5 min
  // 💧 eau : douche en durée (~10 L/min → 600 000 mL/h), sinon en nombre
  { id: 'shower', metric: 'water', emoji: '🚿', kind: 'time', perUnit: 600_000 },
  { id: 'glass', metric: 'water', emoji: '🥤', kind: 'count', perUnit: 250 },
  { id: 'toilet', metric: 'water', emoji: '🚽', kind: 'count', perUnit: 6000 },
  // 🌍 CO₂ : streaming en durée (g/h), voiture en distance (g/km), email au nombre
  { id: 'streaming', metric: 'co2', emoji: '📺', kind: 'time', perUnit: 36 },
  { id: 'car', metric: 'co2', emoji: '🚗', kind: 'distance', perUnit: 170 },
  { id: 'email', metric: 'co2', emoji: '📧', kind: 'count', perUnit: 19 },
];
