// Logique pure de conversion — testée à 100 % (cœur du produit).
import { PER, PERSON_YEAR, type MetricId } from './data';

/**
 * Combien de prompts IA "valent" une action donnée, à une échelle donnée.
 * promptsForAction = value / PER[metric] × population
 */
export function promptsForAction(
  value: number,
  metric: MetricId,
  population: number,
): number {
  return (value / PER[metric]) * population;
}

/** Budget de prompts pour une échelle : PERSON_YEAR × population. */
export function budget(population: number): number {
  return PERSON_YEAR * population;
}

/** Total de prompts dépensés pour un panier { actionValue: quantité }. */
export function totalPrompts(
  items: { value: number; qty: number }[],
  metric: MetricId,
  population: number,
): number {
  return items.reduce(
    (sum, item) => sum + promptsForAction(item.value, metric, population) * item.qty,
    0,
  );
}

/** Progression vers l'objectif (0..1+, peut dépasser 1). */
export function progress(spent: number, goal: number): number {
  if (goal <= 0) return 0;
  return spent / goal;
}

/** Nombre d'"années d'IA" représentées par un nombre de prompts à une échelle. */
export function yearsOfAI(spent: number, population: number): number {
  const perYear = budget(population);
  if (perYear <= 0) return 0;
  return spent / perYear;
}
