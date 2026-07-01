// ─────────────────────────────────────────────────────────────────────────────
// COMPARATIFS « le classique face à l'IA ».
// Chaque comparaison = une page SEO /comparatif/[slug] ciblant une requête.
// Les chiffres et sources vivent ici ; les libellés/verdict/FAQ dans messages.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetricId } from './data';

export interface ComparisonSide {
  emoji: string;
  /** Valeur affichée sur la barre (dans `unit`). */
  value: number;
  unit: string;
}

export interface Comparison {
  slug: string;
  /** Métrique dominante : donne la couleur d'accent des barres. */
  metric: MetricId;
  /** Gauche = le geste « classique ». */
  left: ComparisonSide;
  /** Droite = l'équivalent IA. */
  right: ComparisonSide;
  /** Sources cliquables (ids de SOURCES). */
  sourceIds: string[];
  /** Nombre de questions dans la FAQ (messages comparatif.cases.<slug>.faq.qN/aN). */
  faqCount: number;
}

export const COMPARISONS: Comparison[] = [
  {
    slug: 'ia-vs-google',
    metric: 'elec',
    left: { emoji: '🔎', value: 0.3, unit: 'Wh' },
    right: { emoji: '🤖', value: 0.3, unit: 'Wh' },
    sourceIds: ['iea-ai', 'epoch', 'google-cloud'],
    faqCount: 3,
  },
  {
    slug: 'image-ia-vs-photo',
    metric: 'elec',
    left: { emoji: '🖼️', value: 0.1, unit: 'Wh' },
    right: { emoji: '🎨', value: 9, unit: 'Wh' },
    sourceIds: ['arxiv-image', 'hf-energy'],
    faqCount: 3,
  },
  {
    slug: 'video-ia-vs-streaming',
    metric: 'elec',
    left: { emoji: '📺', value: 77, unit: 'Wh' },
    right: { emoji: '🎬', value: 940, unit: 'Wh' },
    sourceIds: ['hf-energy', 'iea-streaming'],
    faqCount: 3,
  },
  {
    slug: 'prompt-vs-email',
    metric: 'co2',
    left: { emoji: '📧', value: 19, unit: 'g' },
    right: { emoji: '🤖', value: 0.2, unit: 'g' },
    sourceIds: ['berners-lee', 'ademe-impact'],
    faqCount: 2,
  },
];

export const COMPARISON_BY_SLUG: Record<string, Comparison> = Object.fromEntries(
  COMPARISONS.map((c) => [c.slug, c]),
);
