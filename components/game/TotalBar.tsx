'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Counter } from '../ui/Counter';
import { formatCompact, formatInt, formatPercent, formatYears } from '@/lib/format';
import { METRIC_BY_ID, type MetricId } from '@/lib/data';

interface TotalBarProps {
  metric: MetricId;
  scaleId: string;
  spent: number;
  goal: number;
  scaleLabel: string;
}

/**
 * Facture collée en haut, réduite à l'essentiel :
 *   « 43,5 M prompts IA » · « consommeraient autant d'électricité que tes gestes »
 *   → ×N + libellé de l'échelle (ton année d'IA, 100 personnes / an…).
 * Le multiplicateur ET la barre se comptent vs le budget de l'échelle choisie.
 */
export function TotalBar({ metric, scaleId, spent, goal, scaleLabel }: TotalBarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const cfg = METRIC_BY_ID[metric];

  const empty = spent <= 0;
  // Multiplicateur et barre : tout par rapport au budget de l'échelle choisie.
  const ratio = goal > 0 ? spent / goal : 0;
  const over = ratio >= 1;
  const barWidth = Math.min(ratio, 1) * 100;

  return (
    <div className="sticky top-0 z-30 px-4">
      <div className="mx-auto max-w-app overflow-hidden rounded-b-2xl border border-t-0 border-line bg-surface/95 shadow-lg shadow-black/[0.06] backdrop-blur-md">
        <div className="h-1 w-full bg-accent" />

        <div className="px-4 py-3">
          {/* En-tête : ressource + échelle visée */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg" aria-hidden>
              {cfg.emoji}
            </span>
            <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent">
              {scaleLabel}
            </span>
          </div>

          <div className="mt-1.5 flex items-end justify-between gap-3">
            {/* Le chiffre + ce qu'il veut dire (ou l'amorce quand c'est vide) */}
            <div className="min-w-0">
              {empty ? (
                <p className="text-sm font-semibold leading-snug text-muted">
                  {t('total.emptyHint')}
                </p>
              ) : (
                <>
                  <span className="num text-2xl font-extrabold leading-none text-text sm:text-3xl">
                    <Counter value={spent} format={(n) => formatCompact(n, locale)} />
                    <span className="ml-1 text-sm font-bold text-muted">
                      {t('total.promptsSuffix')}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs font-semibold leading-tight text-muted">
                    {t(`total.equiv.${metric}`)}
                  </span>
                </>
              )}
            </div>

            {/* Le choc : ×N (ou 0 %) du budget de l'échelle */}
            <div className="shrink-0 text-right leading-none">
              <div
                className={`num text-xl font-extrabold sm:text-2xl ${
                  over ? 'text-accent' : 'text-muted'
                }`}
              >
                {over ? `×${formatYears(ratio, locale)}` : `${formatPercent(ratio, locale)} %`}
              </div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                {(over ? '' : `${t('total.ofWord')} `) + t(`scale.unit.${scaleId}`)}
              </div>
            </div>
          </div>

          {/* Jauge = progression vers le budget de l'échelle */}
          <div className="relative mt-2.5 h-2 overflow-hidden rounded-full bg-line/70">
            <motion.div
              className={`h-full rounded-full bg-accent ${over ? 'animate-pulse-ring' : ''}`}
              initial={false}
              animate={{ width: `${barWidth}%` }}
              transition={{ type: 'spring', stiffness: 160, damping: 26 }}
            />
          </div>

          {/* Rappel de la cible visée (budget de l'échelle) */}
          <div className="mt-1.5 text-right text-[10px] font-semibold text-muted">
            {t('total.target', {
              scale: scaleLabel,
              goal: goal >= 1_000_000 ? formatCompact(goal, locale) : formatInt(goal, locale),
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
