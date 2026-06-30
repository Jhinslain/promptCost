'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Counter } from '../ui/Counter';
import { formatCompact, formatPercent, formatYears } from '@/lib/format';

interface TotalBarProps {
  spent: number;
  goal: number;
  scaleLabel: string;
}

export function TotalBar({ spent, goal, scaleLabel }: TotalBarProps) {
  const t = useTranslations('total');
  const locale = useLocale();

  const ratio = goal > 0 ? spent / goal : 0;
  const over = ratio >= 1;
  const years = spent / goal; // goal = 1 an d'IA → years = ratio
  const barWidth = Math.min(ratio, 1) * 100;

  return (
    <div className="sticky top-14 z-30 -mx-4 border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto max-w-app">
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-xs font-bold uppercase tracking-wider text-muted">
              {t('goalLabel', { scale: scaleLabel })}
            </div>
            <div className="num text-2xl font-extrabold leading-tight text-text sm:text-3xl">
              <Counter value={spent} format={(n) => formatCompact(n, locale)} />
              <span className="ml-1.5 text-sm font-bold text-muted">
                {t('ofGoal', { goal: formatCompact(goal, locale) })}
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div
              className={`num text-2xl font-extrabold leading-none sm:text-3xl ${
                over ? 'text-accent' : 'text-text'
              }`}
            >
              {over
                ? `${formatYears(years, locale)}×`
                : `${formatPercent(ratio, locale)}%`}
            </div>
            <div className="text-xs font-semibold text-muted">
              {over ? t('yearsLabel', { years: formatYears(years, locale) }) : t('promptsUnit')}
            </div>
          </div>
        </div>

        <div className="relative mt-2.5 h-3 overflow-hidden rounded-full bg-line/70">
          <motion.div
            className={`h-full rounded-full bg-accent ${over ? 'animate-pulse-ring' : ''}`}
            initial={false}
            animate={{ width: `${barWidth}%` }}
            transition={{ type: 'spring', stiffness: 160, damping: 26 }}
          />
        </div>
      </div>
    </div>
  );
}
