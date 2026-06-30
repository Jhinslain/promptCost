'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Counter } from '../ui/Counter';
import { formatCompact, formatPercent, formatYears } from '@/lib/format';
import { METRIC_BY_ID, type MetricId } from '@/lib/data';

interface TotalBarProps {
  metric: MetricId;
  spent: number;
  goal: number;
  scaleLabel: string;
}

/**
 * Facture collée en haut : la dépense en prompts présentée comme une note
 * d'électricité / d'eau / de carbone. Reste visible pendant qu'on remplit
 * le panier (sticky), façon compteur neal.fun.
 */
export function TotalBar({ metric, spent, goal, scaleLabel }: TotalBarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const cfg = METRIC_BY_ID[metric];

  const ratio = goal > 0 ? spent / goal : 0;
  const over = ratio >= 1;
  const years = spent / goal; // goal = 1 an d'IA → years = ratio
  const barWidth = Math.min(ratio, 1) * 100;

  return (
    <div className="sticky top-0 z-30 px-4">
      <div className="mx-auto max-w-app overflow-hidden rounded-b-2xl border border-t-0 border-line bg-surface/95 shadow-lg shadow-black/[0.06] backdrop-blur-md">
        {/* Liseré accent = signature de la métrique */}
        <div className="h-1 w-full bg-accent" />

        <div className="px-4 py-3">
          {/* En-tête de facture */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-lg" aria-hidden>
                {cfg.emoji}
              </span>
              <span className="truncate text-xs font-extrabold uppercase tracking-wider text-text">
                {t(`bill.${metric}`)}
              </span>
            </div>
            <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent">
              {scaleLabel}
            </span>
          </div>

          {/* Montant */}
          <div className="mt-2 flex items-end justify-between gap-3">
            <div className="num text-2xl font-extrabold leading-none text-text sm:text-3xl">
              <Counter value={spent} format={(n) => formatCompact(n, locale)} />
              <span className="ml-1.5 text-sm font-bold text-muted">
                {t('total.ofGoal', { goal: formatCompact(goal, locale) })}
              </span>
            </div>
            <div
              className={`num shrink-0 text-xl font-extrabold leading-none sm:text-2xl ${
                over ? 'text-accent' : 'text-muted'
              }`}
            >
              {over
                ? `${formatYears(years, locale)}×`
                : `${formatPercent(ratio, locale)}%`}
            </div>
          </div>

          {/* Jauge */}
          <div className="relative mt-2.5 h-2.5 overflow-hidden rounded-full bg-line/70">
            <motion.div
              className={`h-full rounded-full bg-accent ${over ? 'animate-pulse-ring' : ''}`}
              initial={false}
              animate={{ width: `${barWidth}%` }}
              transition={{ type: 'spring', stiffness: 160, damping: 26 }}
            />
          </div>

          <div className="mt-1.5 text-[11px] font-semibold text-muted">
            {over
              ? t('total.yearsLabel', { years: formatYears(years, locale) })
              : t('bill.caption')}
          </div>
        </div>
      </div>
    </div>
  );
}
