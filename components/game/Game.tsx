'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Shuffle, RotateCcw } from 'lucide-react';
import { ACTIONS, METRIC_BY_ID, type MetricId } from '@/lib/data';
import { SCALES, SCALE_BY_ID } from '@/lib/scales';
import { promptsForAction, totalPrompts, yearsOfUse } from '@/lib/convert';
import { formatCompact } from '@/lib/format';
import { useGame } from '@/lib/store';
import { useTheme } from '../ui/ThemeProvider';
import { TotalBar } from './TotalBar';
import { ScaleSelector } from './ScaleSelector';
import { MetricTabs } from './MetricTabs';
import { ActionGrid } from './ActionGrid';
import { Receipt } from './Receipt';
import { ResultCard } from './ResultCard';
import { Confetti } from '../ui/Confetti';
import { ModeToggle } from './ModeToggle';
import { ReverseMode } from './ReverseMode';

const FACT_KEYS = ['facts.f1', 'facts.f2', 'facts.f3', 'facts.f4', 'facts.f5'];

/** Geste d'exemple montré dans l'intro, cohérent avec l'onglet actif. */
const EXAMPLE_BY_METRIC: Record<MetricId, string> = {
  elec: 'oven',
  water: 'shower',
  co2: 'steak',
};

export function Game({ mode }: { mode: 'spend' | 'reverse' }) {
  const t = useTranslations();
  const locale = useLocale();
  const { theme } = useTheme();

  const metric = useGame((s) => s.metric);
  const scaleId = useGame((s) => s.scaleId);
  const cart = useGame((s) => s.cart);
  const setCart = useGame((s) => s.setCart);
  const reset = useGame((s) => s.reset);

  const scale = SCALE_BY_ID[scaleId] ?? SCALES[0];
  const goal = scale.budget; // budget de prompts = valeur de l'échelle, sans multiplicateur
  const scaleLabel = t(`scale.${scale.id}`);

  // Exemple d'intro cohérent avec l'onglet actif (élec → four, eau → douche…).
  const example =
    ACTIONS[metric].find((a) => a.id === EXAMPLE_BY_METRIC[metric]) ?? ACTIONS[metric][0];
  const exampleLabel = t(`actions.${example.id}`);
  const exampleCost = formatCompact(promptsForAction(example.value, metric, 1), locale);

  // Accent CSS variable suit la métrique + le thème (signature visuelle).
  useEffect(() => {
    const cfg = METRIC_BY_ID[metric];
    const value = theme === 'dark' ? cfg.accent.dark : cfg.accent.light;
    document.documentElement.style.setProperty('--accent', value);
  }, [metric, theme]);

  // Les gestes sont comptés pour UNE personne ; changer d'échelle change juste
  // le budget visé par la barre (usage réel de l'IA), pas le coût des gestes.
  const spent = useMemo(() => {
    const items = Object.entries(cart).map(([id, qty]) => {
      const action = ACTIONS[metric].find((a) => a.id === id);
      return { value: action?.value ?? 0, qty };
    });
    return totalPrompts(items, metric, 1);
  }, [cart, metric]);

  const count = useMemo(
    () => Object.values(cart).reduce((s, q) => s + q, 0),
    [cart],
  );

  const years = yearsOfUse(spent);

  // Détection du franchissement de l'objectif.
  const [showResult, setShowResult] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [factKey, setFactKey] = useState(FACT_KEYS[0]);
  const prevRatio = useRef(0);
  const prevKey = useRef(`${metric}:${scaleId}`);

  useEffect(() => {
    const key = `${metric}:${scaleId}`;
    const ratio = goal > 0 ? spent / goal : 0;

    // Changement d'onglet ou d'échelle : on resynchronise sans rouvrir le bilan
    // (sinon revenir sur un onglet déjà « fini » le redéclencherait).
    if (key !== prevKey.current) {
      prevKey.current = key;
      prevRatio.current = ratio;
      return;
    }

    if (prevRatio.current < 1 && ratio >= 1) {
      setFactKey(FACT_KEYS[count % FACT_KEYS.length]);
      setShowResult(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2600);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 40, 30]);
      }
    }
    prevRatio.current = ratio;
  }, [spent, goal, count, metric, scaleId]);

  // « Surprends-moi » : remplit la jauge à ~100 % du budget de l'échelle avec
  // des gestes aléatoires (remplissage glouton : chaque tour consomme une part
  // du reste, jamais plus que le reste → on atterrit juste sur 100 %).
  function surprise() {
    const withCost = ACTIONS[metric].map((a) => ({
      id: a.id,
      cost: promptsForAction(a.value, metric, 1),
    }));
    const cheapest = withCost.reduce((m, o) => (o.cost < m.cost ? o : m));

    const next: Record<string, number> = {};
    let remaining = goal;
    let guard = 0;
    while (remaining >= cheapest.cost && guard < 80) {
      guard += 1;
      const options = withCost.filter((o) => o.cost <= remaining);
      const pick = options[Math.floor(Math.random() * options.length)];
      const chunk = remaining * (0.3 + Math.random() * 0.4); // 30 à 70 % du reste
      const fits = Math.floor(remaining / pick.cost);
      const qty = Math.min(Math.max(1, Math.round(chunk / pick.cost)), fits);
      next[pick.id] = (next[pick.id] ?? 0) + qty;
      remaining -= qty * pick.cost;
    }
    // Dernière touche pour atteindre ~100 % (dépassement < coût du plus petit geste).
    if (remaining > 0) next[cheapest.id] = (next[cheapest.id] ?? 0) + 1;

    setCart(next);
  }

  return (
    <>
      <div className="relative">
        <div className="accent-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-64" />

        <div className="mx-auto max-w-app px-4">
          {/* Intro (s'adapte au mode) */}
          <section className="pt-8 text-center sm:pt-12">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {mode === 'reverse' ? t('reverse.title') : t('intro.lead')}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted sm:text-base">
              {mode === 'reverse'
                ? t('reverse.sub')
                : t('intro.sub', { label: exampleLabel, cost: exampleCost })}
            </p>
          </section>

          <ModeToggle />
        </div>

        {mode === 'reverse' ? (
          <div className="mt-6">
            <ReverseMode />
          </div>
        ) : (
          /* Ce conteneur enveloppe la facture ET le contenu : il donne à la
             facture (sticky) la hauteur de défilement nécessaire pour rester
             collée en haut tant qu'on parcourt le jeu. */
          <div className="mt-6">
            <TotalBar
              metric={metric}
              scaleId={scale.id}
              spent={spent}
              goal={goal}
              scaleLabel={scaleLabel}
            />

            <div className="mx-auto mt-5 flex max-w-app flex-col gap-5 px-4 pb-4">
              <ScaleSelector />
              <MetricTabs />
              <ActionGrid metric={metric} />

              <div className="flex gap-2">
                <button
                  onClick={surprise}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-accent text-base font-bold text-white transition-transform active:scale-95"
                >
                  <Shuffle size={18} />
                  {t('controls.surprise')}
                </button>
                <button
                  onClick={reset}
                  disabled={count === 0}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-4 text-base font-bold text-text transition-colors hover:border-accent disabled:opacity-40"
                >
                  <RotateCcw size={18} />
                  <span className="hidden sm:inline">{t('controls.reset')}</span>
                </button>
              </div>

              <Receipt metric={metric} goal={goal} scaleLabel={scaleLabel} />
            </div>
          </div>
        )}
      </div>

      {confetti && <Confetti />}

      <ResultCard
        open={showResult}
        metric={metric}
        scaleId={scale.id}
        spent={spent}
        years={years}
        count={count}
        scaleLabel={scaleLabel}
        factKey={factKey}
        onClose={() => setShowResult(false)}
      />
    </>
  );
}
