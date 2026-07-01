import { describe, it, expect } from 'vitest';
import {
  promptsForAction,
  totalPrompts,
  progress,
  yearsOfUse,
  tierTotals,
  pickEquivalent,
  usageTotals,
} from './convert';
import { PERSON_YEAR, EQUIV_REFS, USAGE_TYPES } from './data';

describe('promptsForAction', () => {
  it('divides the action value by the per-prompt cost', () => {
    // Douche 75 000 mL ÷ 0,3 mL = 250 000 prompts (échelle 1).
    expect(promptsForAction(75_000, 'water', 1)).toBeCloseTo(250_000);
  });

  it('scales linearly with population', () => {
    expect(promptsForAction(75_000, 'water', 100)).toBeCloseTo(25_000_000);
  });

  it('handles electricity (0,3 Wh per prompt)', () => {
    expect(promptsForAction(0.3, 'elec', 1)).toBeCloseTo(1);
    expect(promptsForAction(2100, 'elec', 1)).toBeCloseTo(7000);
  });

  it('handles CO2 (0,2 g per prompt)', () => {
    expect(promptsForAction(0.2, 'co2', 1)).toBeCloseTo(1);
  });
});

describe('totalPrompts', () => {
  it('sums quantities across items', () => {
    const items = [
      { value: 0.3, qty: 2 }, // 2 prompts
      { value: 0.6, qty: 1 }, // 2 prompts
    ];
    expect(totalPrompts(items, 'elec', 1)).toBeCloseTo(4);
  });

  it('returns 0 for an empty cart', () => {
    expect(totalPrompts([], 'elec', 1)).toBe(0);
  });
});

describe('progress', () => {
  it('is the spent/goal ratio', () => {
    expect(progress(6000, 12000)).toBe(0.5);
  });
  it('can exceed 1', () => {
    expect(progress(24000, 12000)).toBe(2);
  });
  it('guards against a zero goal', () => {
    expect(progress(10, 0)).toBe(0);
  });
});

describe('yearsOfUse', () => {
  it('converts spent prompts into personal AI-years (vs PERSON_YEAR)', () => {
    expect(yearsOfUse(PERSON_YEAR * 3)).toBeCloseTo(3);
    expect(yearsOfUse(43_500_000)).toBeCloseTo(3625);
  });
});

describe('usageTotals', () => {
  it('sums each usage type × its per-request cost', () => {
    // 100 prompts texte (0,3 Wh) + 1 image (9 Wh) = 39 Wh.
    const totals = usageTotals({ text: 100, image: 1 }, USAGE_TYPES);
    expect(totals.elec).toBeCloseTo(39);
    expect(totals.water).toBeCloseTo(39);
  });

  it('treats missing types as zero', () => {
    expect(usageTotals({}, USAGE_TYPES)).toEqual({ elec: 0, water: 0, co2: 0 });
  });
});

describe('tierTotals', () => {
  it('multiplies the per-prompt cost by the prompt count', () => {
    const cost = { elec: 0.3, water: 0.3, co2: 0.2 };
    expect(tierTotals(100, cost)).toEqual({ elec: 30, water: 30, co2: 20 });
  });
});

describe('pickEquivalent', () => {
  it('picks the largest unit that still yields a quantity ≥ 1', () => {
    // 600 Wh : aspirateur 9 → 66, LED 10 → 60, charge 19 → 31, TV 70 → 8,6.
    // La plus grande unité avec qty ≥ 1 est la TV (qty la plus faible ≥ 1).
    const r = pickEquivalent(600, 'elec', EQUIV_REFS);
    expect(r?.ref.unitKey).toBe('tv_h');
    expect(r?.qty).toBeCloseTo(600 / 70);
  });

  it('falls back to the finest unit when everything is below 1', () => {
    // 4 Wh : aspirateur (9) → 0,44, plus fine que LED/charge/TV.
    const r = pickEquivalent(4, 'elec', EQUIV_REFS);
    expect(r?.ref.unitKey).toBe('vacuum_min');
  });

  it('returns null when no reference matches the metric', () => {
    expect(pickEquivalent(10, 'water', [])).toBeNull();
  });
});
