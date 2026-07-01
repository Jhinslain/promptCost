// Logique pure de conversion : testée à 100 % (cœur du produit).
import {
  PER,
  PERSON_YEAR,
  type MetricId,
  type EquivRef,
  type UsageTypeConfig,
} from './data';

/**
 * Combien de prompts IA « valent » une action donnée (pour une personne).
 * promptsForAction = valeur du geste / coût d'un prompt.
 */
export function promptsForAction(value: number, metric: MetricId): number {
  return value / PER[metric];
}

/** Total de prompts dépensés pour un panier { actionValue: quantité }. */
export function totalPrompts(
  items: { value: number; qty: number }[],
  metric: MetricId,
): number {
  return items.reduce((sum, item) => sum + promptsForAction(item.value, metric) * item.qty, 0);
}

/** Progression vers l'objectif (0..1+, peut dépasser 1). */
export function progress(spent: number, goal: number): number {
  if (goal <= 0) return 0;
  return spent / goal;
}

/**
 * Nombre d'« années de TON usage d'IA » qu'un total de prompts représente
 * (ancre personnelle constante : 1 an = PERSON_YEAR prompts, quelle que soit
 * l'échelle sélectionnée).
 */
export function yearsOfUse(spent: number): number {
  if (PERSON_YEAR <= 0) return 0;
  return spent / PERSON_YEAR;
}

// ── Mode inversé ────────────────────────────────────────────────────────────

/**
 * Conso totale (par métrique) d'une journée d'usage : pour chaque type
 * (texte, image…), nombre de requêtes × coût unitaire du type.
 */
export function usageTotals(
  counts: Record<string, number>,
  types: UsageTypeConfig[],
): Record<MetricId, number> {
  const acc: Record<MetricId, number> = { elec: 0, water: 0, co2: 0 };
  for (const ut of types) {
    const n = counts[ut.id] ?? 0;
    acc.elec += n * ut.cost.elec;
    acc.water += n * ut.cost.water;
    acc.co2 += n * ut.cost.co2;
  }
  return acc;
}

/**
 * Conso totale (par métrique) pour `count` prompts d'un palier donné.
 * tierCost = coût d'un prompt par métrique.
 */
export function tierTotals(
  count: number,
  tierCost: Record<MetricId, number>,
): Record<MetricId, number> {
  return {
    elec: count * tierCost.elec,
    water: count * tierCost.water,
    co2: count * tierCost.co2,
  };
}

/**
 * Choisit le geste de référence le plus parlant pour une conso donnée :
 * la plus grande unité qui donne encore une quantité ≥ 1 (nombre lisible) ;
 * si tout est < 1 (conso minuscule), la plus petite unité (plus granulaire).
 * Retourne null si aucune référence pour la métrique.
 */
export function pickEquivalent(
  total: number,
  metric: MetricId,
  refs: EquivRef[],
): { ref: EquivRef; qty: number } | null {
  const candidates = refs
    .filter((r) => r.metric === metric && r.perUnit > 0)
    .map((r) => ({ ref: r, qty: total / r.perUnit }));
  if (candidates.length === 0) return null;

  const atLeastOne = candidates.filter((c) => c.qty >= 1);
  if (atLeastOne.length > 0) {
    // plus petite quantité ≥ 1 = la plus grande unité encore atteignable
    return atLeastOne.reduce((best, c) => (c.qty < best.qty ? c : best));
  }
  // tout est minuscule : on prend l'unité la plus fine (quantité la plus grande)
  return candidates.reduce((best, c) => (c.qty > best.qty ? c : best));
}
