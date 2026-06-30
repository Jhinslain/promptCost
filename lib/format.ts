// Formatage localisé des nombres + notation compacte pour les très grands nombres.

/**
 * Paliers de notation compacte, par langue (du plus grand au plus petit).
 * FR : on plafonne au « milliard » (Md) pour rester parlant —
 * 9,6e13 → « 96 000 Md » plutôt que « 96 Bn » (cf. SPEC.md idée §10).
 * EN : notation standard M / B / T.
 */
const TIERS: Record<'fr' | 'en', { unit: string; value: number }[]> = {
  fr: [
    { unit: 'Md', value: 1e9 },
    { unit: 'M', value: 1e6 },
  ],
  en: [
    { unit: 'T', value: 1e12 },
    { unit: 'B', value: 1e9 },
    { unit: 'M', value: 1e6 },
  ],
};

/**
 * Formate un nombre de prompts en notation compacte lisible.
 * Ex (fr) : 1 234 → « 1 234 », 1,2e6 → « 1,2 M », 9,6e13 → « 96 000 Md ».
 */
export function formatCompact(n: number, locale: string): string {
  const lang = locale.startsWith('fr') ? 'fr' : 'en';
  const abs = Math.abs(n);

  if (abs < 1_000_000) {
    return formatInt(Math.round(n), locale);
  }

  for (const tier of TIERS[lang]) {
    if (abs >= tier.value) {
      const scaled = n / tier.value;
      const decimals = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
      const num = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      }).format(scaled);
      return `${num} ${tier.unit}`;
    }
  }
  return formatInt(Math.round(n), locale);
}

/** Entier complet avec séparateurs localisés (pour les tooltips). */
export function formatInt(n: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
}

/** Pourcentage lisible (1 décimale sous 10 %, sinon entier). */
export function formatPercent(ratio: number, locale: string): string {
  const pct = ratio * 100;
  const decimals = pct < 10 ? 1 : 0;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(pct);
}

/** Nombre d'années avec un nombre de décimales adapté. */
export function formatYears(years: number, locale: string): string {
  const decimals = years < 1 ? 2 : years < 10 ? 1 : 0;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(years);
}
