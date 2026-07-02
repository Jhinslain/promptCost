'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { METRICS } from '@/lib/data';
import { useGame } from '@/lib/store';

export function MetricTabs() {
  const t = useTranslations('metric');
  const tBill = useTranslations('bill');
  const metric = useGame((s) => s.metric);
  const setMetric = useGame((s) => s.setMetric);

  return (
    <div className="flex flex-col gap-2">
      <span className="px-1 text-xs font-bold uppercase tracking-wider text-muted">
        {tBill('choose')}
      </span>
      <div
        role="tablist"
        aria-label={t('label')}
        className="grid grid-cols-3 gap-2 rounded-2xl border border-line bg-surface p-1.5"
      >
        {METRICS.map((m) => {
          const active = m.id === metric;
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={active}
              onClick={() => setMetric(m.id)}
              className="relative flex min-w-0 items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-xs font-bold transition-colors sm:gap-2 sm:px-2 sm:text-sm"
            >
              {active && (
                <motion.span
                  layoutId="metric-pill"
                  className="absolute inset-0 rounded-xl bg-accent-soft"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10 text-base sm:text-lg">{m.emoji}</span>
              <span
                className={`relative z-10 truncate ${active ? 'text-accent-text' : 'text-muted'}`}
              >
                {t(m.id)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
