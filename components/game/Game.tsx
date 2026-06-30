'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Shuffle, RotateCcw } from 'lucide-react';
import { ACTIONS, SCALES, METRIC_BY_ID, scalePopulation } from '@/lib/data';
import { budget, totalPrompts, yearsOfAI } from '@/lib/convert';
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

export function Game({ mode }: { mode: 'spend' | 'reverse' }) {
  const t = useTranslations();
  const locale = useLocale();
  const { theme } = useTheme();

  const metric = useGame((s) => s.metric);
  const scaleId = useGame((s) => s.scaleId);
  const cart = useGame((s) => s.cart);
  const add = useGame((s) => s.add);
  const reset = useGame((s) => s.reset);

  const scale = SCALES.find((s) => s.id === scaleId) ?? SCALES[0];
  const population = scalePopulation(scale, locale);
  const scaleLabel = t(`scale.${scale.id}`);

  // Accent CSS variable suit la métrique + le thème (signature visuelle).
  useEffect(() => {
    const cfg = METRIC_BY_ID[metric];
    const value = theme === 'dark' ? cfg.accent.dark : cfg.accent.light;
    document.documentElement.style.setProperty('--accent', value);
  }, [metric, theme]);

  // L'objectif (budget IA) grandit avec l'échelle…
  const goal = budget(population);

  // …mais les gestes restent comptés pour UNE personne (leur propre échelle).
  // Ainsi, changer d'échelle fait bouger la jauge : on voit que les gestes
  // perso d'une personne pèsent autant que l'IA annuelle de tout un groupe.
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

  const years = yearsOfAI(spent, population);

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

  function surprise() {
    const list = ACTIONS[metric];
    // Pseudo-aléatoire stable basé sur l'état courant (pas de Math.random au 1er rendu SSR).
    const idx = (count * 7 + spent) % list.length;
    add(list[Math.floor(idx) % list.length].id);
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
              {mode === 'reverse' ? t('reverse.sub') : t('intro.sub')}
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
            <TotalBar metric={metric} spent={spent} goal={goal} scaleLabel={scaleLabel} />

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
        years={years}
        count={count}
        scaleLabel={scaleLabel}
        factKey={factKey}
        onClose={() => setShowResult(false)}
      />
    </>
  );
}
