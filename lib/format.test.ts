import { describe, it, expect } from 'vitest';
import { formatCompact } from './format';

// On normalise les espaces insécables (  /  ) que met Intl en FR.
const norm = (s: string) => s.replace(/[  ]/g, ' ');

describe('formatCompact (fr)', () => {
  it('shows full numbers under a million', () => {
    expect(norm(formatCompact(20_000, 'fr'))).toBe('20 000');
    expect(norm(formatCompact(250_000, 'fr'))).toBe('250 000');
  });

  it('uses M for millions', () => {
    expect(norm(formatCompact(1_200_000, 'fr'))).toBe('1,2 M');
    expect(norm(formatCompact(250_000_000, 'fr'))).toBe('250 M');
  });

  it('caps at milliards (Md) for very large numbers', () => {
    expect(norm(formatCompact(12_000_000_000, 'fr'))).toBe('12 Md');
    // Monde : 12 000 × 8e9 = 9,6e13 → « 96 000 Md »
    expect(norm(formatCompact(96_000_000_000_000, 'fr'))).toBe('96 000 Md');
  });
});

describe('formatCompact (en)', () => {
  it('uses M / B / T', () => {
    expect(formatCompact(1_200_000, 'en')).toBe('1.2 M');
    expect(formatCompact(12_000_000_000, 'en')).toBe('12 B');
    expect(formatCompact(96_000_000_000_000, 'en')).toBe('96 T');
  });
});
