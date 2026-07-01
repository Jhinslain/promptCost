import { describe, it, expect } from 'vitest';
import fr from '../messages/fr.json';
import en from '../messages/en.json';

type Json = string | { [k: string]: Json };

/** Aplati les clés d'un objet de messages en chemins pointés. */
function flatten(obj: Json, prefix = '', out: Record<string, string> = {}) {
  if (typeof obj === 'string') {
    out[prefix] = obj;
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    flatten(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

/** Ensemble trié des placeholders ICU `{x}` d'une chaîne. */
const placeholders = (s: string) =>
  [...new Set(s.match(/\{(\w+)\}/g) ?? [])].sort().join(',');

const frFlat = flatten(fr as Json);
const enFlat = flatten(en as Json);

describe('i18n message parity (fr.json ↔ en.json)', () => {
  it('EN has every FR key', () => {
    expect(Object.keys(frFlat).filter((k) => !(k in enFlat))).toEqual([]);
  });

  it('FR has every EN key', () => {
    expect(Object.keys(enFlat).filter((k) => !(k in frFlat))).toEqual([]);
  });

  it('shared keys have matching ICU placeholders', () => {
    const mismatches = Object.keys(frFlat)
      .filter((k) => k in enFlat)
      .filter((k) => placeholders(frFlat[k]) !== placeholders(enFlat[k]));
    expect(mismatches).toEqual([]);
  });
});
