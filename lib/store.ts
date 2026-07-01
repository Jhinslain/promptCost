import { create } from 'zustand';
import type { MetricId } from './data';

/** Modes de jeu : chacun a sa propre page (/, /convertir, …). */
export type GameMode = 'spend' | 'reverse';

export interface GameState {
  metric: MetricId;
  scaleId: string;
  /** Panier : quantité par actionId. */
  cart: Record<string, number>;
  /** Mode inversé : nombre de requêtes par type d'usage (texte, image…). */
  usage: Record<string, number>;
  reducedMotion: boolean;

  setMetric: (metric: MetricId) => void;
  setScale: (scaleId: string) => void;
  add: (actionId: string) => void;
  remove: (actionId: string) => void;
  /** Retire d'un coup toutes les unités d'un même geste. */
  removeAll: (actionId: string) => void;
  /** Remplace tout le panier (utilisé par « Surprends-moi » pour remplir la jauge). */
  setCart: (cart: Record<string, number>) => void;
  reset: () => void;
  setUsage: (typeId: string, n: number) => void;
  bumpUsage: (typeId: string, delta: number) => void;
  setReducedMotion: (v: boolean) => void;
}

export const useGame = create<GameState>((set) => ({
  metric: 'elec',
  scaleId: 'you',
  cart: {},
  usage: { text: 30, image: 2 },
  reducedMotion: false,

  setMetric: (metric) => set({ metric }),
  setScale: (scaleId) => set({ scaleId }),
  add: (actionId) =>
    set((s) => ({ cart: { ...s.cart, [actionId]: (s.cart[actionId] ?? 0) + 1 } })),
  remove: (actionId) =>
    set((s) => {
      const next = (s.cart[actionId] ?? 0) - 1;
      const cart = { ...s.cart };
      if (next <= 0) delete cart[actionId];
      else cart[actionId] = next;
      return { cart };
    }),
  removeAll: (actionId) =>
    set((s) => {
      const cart = { ...s.cart };
      delete cart[actionId];
      return { cart };
    }),
  setCart: (cart) => set({ cart }),
  reset: () => set({ cart: {} }),
  setUsage: (typeId, n) =>
    set((s) => ({ usage: { ...s.usage, [typeId]: Math.max(0, Math.round(n)) } })),
  bumpUsage: (typeId, delta) =>
    set((s) => ({
      usage: { ...s.usage, [typeId]: Math.max(0, (s.usage[typeId] ?? 0) + delta) },
    })),
  setReducedMotion: (v) => set({ reducedMotion: v }),
}));
