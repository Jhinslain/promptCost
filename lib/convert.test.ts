import { describe, it, expect } from 'vitest';
import { promptsForAction, budget, totalPrompts, progress, yearsOfAI } from './convert';
import { PERSON_YEAR } from './data';

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

describe('budget', () => {
  it('is PERSON_YEAR times population', () => {
    expect(budget(1)).toBe(PERSON_YEAR);
    expect(budget(8_000_000_000)).toBe(PERSON_YEAR * 8_000_000_000);
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

describe('yearsOfAI', () => {
  it('converts spent prompts into years for a scale', () => {
    expect(yearsOfAI(PERSON_YEAR * 3, 1)).toBeCloseTo(3);
    expect(yearsOfAI(PERSON_YEAR * 100 * 2, 100)).toBeCloseTo(2);
  });
});
