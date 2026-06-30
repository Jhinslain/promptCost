import { create } from 'zustand';
import type { MetricId } from './data';

export interface GameState {
  metric: MetricId;
  scaleId: string;
  /** Panier : quantité par actionId. */
  cart: Record<string, number>;
  reducedMotion: boolean;

  setMetric: (metric: MetricId) => void;
  setScale: (scaleId: string) => void;
  add: (actionId: string) => void;
  remove: (actionId: string) => void;
  reset: () => void;
  setReducedMotion: (v: boolean) => void;
}

export const useGame = create<GameState>((set) => ({
  metric: 'elec',
  scaleId: 'you',
  cart: {},
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
  reset: () => set({ cart: {} }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
}));
