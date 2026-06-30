import { describe, it, expect } from 'vitest';
import { formatCompact, splitDuration, splitDistance } from './format';

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

describe('splitDuration', () => {
  it('scales hours into the most readable unit', () => {
    expect(splitDuration(0.005)).toEqual({ value: 18, unit: 'sec' }); // 18 s
    expect(splitDuration(0.5)).toEqual({ value: 30, unit: 'min' }); // 30 min
    expect(splitDuration(3)).toEqual({ value: 3, unit: 'hour' });
    expect(splitDuration(48)).toEqual({ value: 2, unit: 'day' });
    expect(splitDuration(24 * 365 * 2)).toEqual({ value: 2, unit: 'year' });
  });
});

describe('splitDistance', () => {
  it('uses metres under 1 km, kilometres above', () => {
    expect(splitDistance(0.1)).toEqual({ value: 100, unit: 'm' });
    expect(splitDistance(5)).toEqual({ value: 5, unit: 'km' });
  });
});
