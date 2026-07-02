// ─────────────────────────────────────────────────────────────────────────────
// ÉCHELLES : budgets de prompts IA basés sur l'usage RÉEL (pas de population).
// Le budget d'une échelle = un nombre de prompts de référence, appliqué tel quel
// (aucun multiplicateur). La barre montre la progression vers ce budget ;
// le multiplicateur/les « années » se comptent toujours vs 1 an d'IA perso.
// ─────────────────────────────────────────────────────────────────────────────

import { PERSON_YEAR } from './data';

export interface ScaleConfig {
  id: string;
  emoji: string;
  /** Budget de référence, en prompts IA. */
  budget: number;
}

/**
 * 3 repères d'usage réel de l'IA sur 1 an (2026), en prompts texte :
 *  🧍 Toi                   = 12 000 prompts (hypothèse usage intensif)
 *  🇺🇸 États-Unis           = ~165 Md/an
 *     (≈ 15 % de l'usage IA mondial, part des États-Unis)
 *  🌍 Toute l'IA générative = ~1 100 milliards/an
 *     (ChatGPT ~900 Md/an ÷ 0,8 de part de marché ≈ 1 100 Md)
 */
export const SCALES: ScaleConfig[] = [
  { id: 'you', emoji: '🧍', budget: PERSON_YEAR },
  { id: 'usa', emoji: '🇺🇸', budget: 165_000_000_000 },
  { id: 'all_ai', emoji: '🌍', budget: 1_100_000_000_000 },
];

export const SCALE_BY_ID: Record<string, ScaleConfig> = Object.fromEntries(
  SCALES.map((s) => [s.id, s]),
);

/** Date de référence des volumes d'usage IA (source : voir SOURCES). */
export const SCALES_AS_OF = '2026';
