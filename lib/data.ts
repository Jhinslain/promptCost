// ─────────────────────────────────────────────────────────────────────────────
// SOURCE DE VÉRITÉ — toutes les valeurs chiffrées du site.
// Règle d'or : aucun nombre codé en dur dans les composants. Tout vient d'ici.
// Chaque valeur embarque son unité et un `sourceId` pointant vers SOURCES.
// Chiffres issus d'une recherche croisée 2025-2026 (voir SPEC.md §7).
// ─────────────────────────────────────────────────────────────────────────────

export type MetricId = 'elec' | 'water' | 'co2';

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
  elec: { min: 0.24, max: 0.4, note: 'gemini-0.24 · epoch-0.30 · openai-0.34' },
  water: { min: 0.26, max: 0.32, note: 'google-0.26 · openai-0.32 (direct)' },
  co2: { min: 0.15, max: 1, note: '~0.15 g opérationnel → ~1 g en analyse cycle de vie' },
};

export interface MetricConfig {
  id: MetricId;
  emoji: string;
  unit: string; // unité de base
  /** Accent en mode clair / sombre, format "R G B" pour rgb(var(--accent)). */
  accent: { light: string; dark: string };
}

export const METRICS: MetricConfig[] = [
  { id: 'elec', emoji: '⚡', unit: 'Wh', accent: { light: '245 166 35', dark: '255 209 102' } },
  { id: 'water', emoji: '💧', unit: 'mL', accent: { light: '47 155 255', dark: '92 200 255' } },
  { id: 'co2', emoji: '🌍', unit: 'g', accent: { light: '22 163 74', dark: '52 211 153' } },
];

export const METRIC_BY_ID: Record<MetricId, MetricConfig> = Object.fromEntries(
  METRICS.map((m) => [m.id, m]),
) as Record<MetricId, MetricConfig>;

export interface ScaleConfig {
  id: string;
  emoji: string;
  /** Nombre de "personnes" équivalentes (multiplicateur de population). */
  population: number;
}

/** Échelles jouables. budget = PERSON_YEAR × population. */
export const SCALES: ScaleConfig[] = [
  { id: 'you', emoji: '🧍', population: 1 },
  { id: 'hundred', emoji: '👥', population: 100 },
  { id: 'city', emoji: '🏙️', population: 1_000_000 },
  { id: 'france', emoji: '🇫🇷', population: 68_000_000 },
  { id: 'world', emoji: '🌍', population: 8_000_000_000 },
];

export interface ActionData {
  id: string;
  emoji: string;
  /** Coût de l'action dans l'unité de base de la métrique (pour une personne). */
  value: number;
  sourceId: string;
}

/**
 * Activités par métrique, dans l'unité de base.
 * Triées par coût croissant à l'affichage (logique dans le composant).
 */
export const ACTIONS: Record<MetricId, ActionData[]> = {
  elec: [
    { id: 'led', emoji: '💡', value: 10, sourceId: 'energyusecalculator' },
    { id: 'phone_charge', emoji: '📱', value: 17, sourceId: 'energyusecalculator' },
    { id: 'kettle', emoji: '☕', value: 22, sourceId: 'energybot' },
    { id: 'toast', emoji: '🍞', value: 75, sourceId: 'energybot' },
    { id: 'microwave', emoji: '♨️', value: 90, sourceId: 'energysage' },
    { id: 'netflix', emoji: '📺', value: 135, sourceId: 'iea-streaming' },
    { id: 'vacuum', emoji: '🧹', value: 165, sourceId: 'energyusecalculator' },
    { id: 'hairdryer', emoji: '💇', value: 250, sourceId: 'energysage' },
    { id: 'gaming', emoji: '🎮', value: 400, sourceId: 'nexamp' },
    { id: 'laundry', emoji: '👕', value: 600, sourceId: 'energysage' },
    { id: 'dishwasher', emoji: '🍽️', value: 1200, sourceId: 'bkvenergy' },
    { id: 'oven', emoji: '🔥', value: 2100, sourceId: 'directenergy' },
  ],
  water: [
    { id: 'glass', emoji: '🥤', value: 250, sourceId: 'watercalculator' },
    { id: 'toothbrush', emoji: '🪥', value: 6000, sourceId: 'watercalculator' },
    { id: 'toilet', emoji: '🚽', value: 6000, sourceId: 'epa-watersense' },
    { id: 'almond', emoji: '🌰', value: 12_000, sourceId: 'wfn-almond' },
    { id: 'tomato', emoji: '🍅', value: 13_000, sourceId: 'watercalculator-food' },
    { id: 'laundry_water', emoji: '👕', value: 50_000, sourceId: 'watercalculator' },
    { id: 'apple', emoji: '🍎', value: 70_000, sourceId: 'watercalculator-food' },
    { id: 'shower', emoji: '🚿', value: 75_000, sourceId: 'watercalculator' },
    { id: 'coffee_water', emoji: '☕', value: 140_000, sourceId: 'wfn-hoekstra' },
    { id: 'bath', emoji: '🛁', value: 150_000, sourceId: 'watercalculator' },
    { id: 'pasta', emoji: '🍝', value: 165_000, sourceId: 'utwente-pasta' },
    { id: 'burger_water', emoji: '🍔', value: 2_500_000, sourceId: 'watercalculator-food' },
  ],
  co2: [
    { id: 'train', emoji: '🚆', value: 35, sourceId: 'owid-transport' },
    { id: 'video_mobile', emoji: '📱', value: 36, sourceId: 'energise' },
    { id: 'email', emoji: '📧', value: 50, sourceId: 'berners-lee' },
    { id: 'coffee_co2', emoji: '☕', value: 50, sourceId: '8billiontrees' },
    { id: 'bus', emoji: '🚌', value: 100, sourceId: 'owid-transport' },
    { id: 'car', emoji: '🚗', value: 170, sourceId: 'owid-transport' },
    { id: 'tshirt', emoji: '👕', value: 4000, sourceId: 'carbonfact-tshirt' },
    { id: 'burger_co2', emoji: '🍔', value: 3500, sourceId: 'owid-meat' },
    { id: 'steak', emoji: '🥩', value: 7000, sourceId: 'owid-meat' },
    { id: 'jeans', emoji: '👖', value: 16_400, sourceId: 'carbonfact-jeans' },
    { id: 'smartphone', emoji: '🔋', value: 60_000, sourceId: 'apple-lca' },
    { id: 'flight', emoji: '✈️', value: 500_000, sourceId: 'curb6-flight' },
  ],
};

export interface SourceData {
  id: string;
  label: string;
  url?: string;
}

export const SOURCES: SourceData[] = [
  { id: 'epoch', label: 'Epoch AI — énergie par requête ChatGPT', url: 'https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use' },
  { id: 'google-cloud', label: 'Google Cloud — impact environnemental de l\'inférence IA (0,24 Wh / 0,26 mL)', url: 'https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference' },
  { id: 'openai-altman', label: 'OpenAI / Sam Altman — « The Gentle Singularity » (0,34 Wh / 0,32 mL)', url: 'https://blog.samaltman.com/the-gentle-singularity' },
  { id: 'how-hungry', label: '« How Hungry is AI? » (arXiv 2505.09598)', url: 'https://arxiv.org/abs/2505.09598' },
  { id: 'iea-ai', label: 'IEA — Energy and AI', url: 'https://www.iea.org/reports/energy-and-ai' },
  { id: 'ecologits', label: 'EcoLogits / GenAI Impact', url: 'https://ecologits.ai/' },
  { id: 'owid-transport', label: 'Our World in Data — empreinte carbone des transports', url: 'https://ourworldindata.org/travel-carbon-footprint' },
  { id: 'owid-meat', label: 'Our World in Data — viande & alimentation', url: 'https://ourworldindata.org/less-meat-or-sustainable-meat' },
  { id: 'watercalculator', label: 'watercalculator.org — empreinte eau du quotidien', url: 'https://watercalculator.org/' },
  { id: 'watercalculator-food', label: 'watercalculator.org — empreinte eau des aliments', url: 'https://watercalculator.org/water-footprint-of-food-guide/' },
  { id: 'wfn-hoekstra', label: 'Water Footprint Network (Hoekstra) — eau virtuelle du café', url: 'https://waterfootprint.org/' },
  { id: 'wfn-almond', label: 'Water Footprint Network — empreinte eau de l\'amande', url: 'https://waterfootprint.org/' },
  { id: 'utwente-pasta', label: 'University of Twente — empreinte eau des pâtes', url: 'https://waterfootprint.org/' },
  { id: 'epa-watersense', label: 'EPA WaterSense — chasse d\'eau & robinets', url: 'https://www.epa.gov/watersense' },
  { id: 'berners-lee', label: 'Mike Berners-Lee — « How Bad Are Bananas? » (email / numérique)' },
  { id: 'carbonfact-jeans', label: 'Carbonfact — empreinte carbone d\'un jean', url: 'https://www.carbonfact.com/' },
  { id: 'carbonfact-tshirt', label: 'Carbonfact — empreinte carbone d\'un t-shirt', url: 'https://www.carbonfact.com/' },
  { id: 'apple-lca', label: 'Apple — analyse cycle de vie (fabrication smartphone)', url: 'https://www.apple.com/environment/' },
  { id: 'curb6-flight', label: 'Curb6 / ADEME — empreinte d\'un vol Paris→New York' },
  { id: '8billiontrees', label: '8 Billion Trees — empreinte carbone d\'un café', url: 'https://8billiontrees.com/' },
  { id: 'energise', label: 'Energise — empreinte carbone du streaming vidéo mobile' },
  { id: 'iea-streaming', label: 'IEA — consommation du streaming vidéo', url: 'https://www.iea.org/' },
  { id: 'energysage', label: 'EnergySage — consommation des appareils ménagers', url: 'https://www.energysage.com/' },
  { id: 'energyusecalculator', label: 'Energy Use Calculator — consommation des appareils', url: 'https://energyusecalculator.com/' },
  { id: 'energybot', label: 'EnergyBot — consommation des petits appareils', url: 'https://www.energybot.com/' },
  { id: 'directenergy', label: 'Direct Energy — consommation d\'un four', url: 'https://www.directenergy.com/' },
  { id: 'nexamp', label: 'Nexamp — consommation gaming PC', url: 'https://www.nexamp.com/' },
  { id: 'bkvenergy', label: 'BKV Energy — consommation lave-vaisselle', url: 'https://bkvenergy.com/' },
];

export const SOURCE_BY_ID: Record<string, SourceData> = Object.fromEntries(
  SOURCES.map((s) => [s.id, s]),
);
