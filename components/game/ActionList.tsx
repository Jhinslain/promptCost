'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { ACTIONS, type MetricId } from '@/lib/data';
import { promptsForAction } from '@/lib/convert';
import { formatCompact } from '@/lib/format';
import { useGame } from '@/lib/store';

interface ActionListProps {
  metric: MetricId;
}

export function ActionList({ metric }: ActionListProps) {
  const t = useTranslations();
  const locale = useLocale();
  const cart = useGame((s) => s.cart);
  const add = useGame((s) => s.add);
  const remove = useGame((s) => s.remove);

  // Coût d'un geste pour UNE personne : indépendant de l'échelle choisie
  // (l'échelle ne change que l'objectif, pas la dépense). Voir Game.tsx.
  const rows = useMemo(
    () =>
      [...ACTIONS[metric]]
        .map((a) => ({ ...a, cost: promptsForAction(a.value, metric, 1) }))
        .sort((x, y) => x.cost - y.cost),
    [metric],
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">
          {t('actions.title')}
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {rows.map((a, i) => {
          const qty = cart[a.id] ?? 0;
          const label = t(`actions.${a.id}`);
          return (
            <motion.li
              key={`${metric}-${a.id}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.025, 0.3), duration: 0.25 }}
              className={`flex items-center gap-3 rounded-2xl border bg-surface p-3 transition-colors ${
                qty > 0 ? 'border-accent' : 'border-line'
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-2xl">
                {a.emoji}
              </span>

              <div className="min-w-0 flex-1">
                <div className="truncate font-bold text-text">{label}</div>
                <div className="num text-sm font-semibold text-muted">
                  {t('actions.costLabel', { cost: formatCompact(a.cost, locale) })}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <AnimatePresence initial={false}>
                  {qty > 0 && (
                    <motion.button
                      key="minus"
                      initial={{ opacity: 0, scale: 0.5, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: 'auto' }}
                      exit={{ opacity: 0, scale: 0.5, width: 0 }}
                      onClick={() => remove(a.id)}
                      aria-label={t('controls.remove', { action: label })}
                      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bg text-text transition-colors hover:border-accent"
                    >
                      <Minus size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {qty > 0 && (
                    <motion.span
                      key={qty}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="num w-6 text-center text-base font-extrabold text-accent"
                    >
                      {qty}
                    </motion.span>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => add(a.id)}
                  aria-label={t('controls.add', { action: label })}
                  className="grid h-9 w-9 place-items-center rounded-full bg-accent text-white transition-transform active:scale-90"
                >
                  <Plus size={16} />
                </button>
              </div>
            </motion.li>
          );
        })}
      </ul>

      {metric === 'water' || metric === 'co2' ? (
        <p className="px-1 pt-1 text-xs leading-relaxed text-muted">
          {t('actions.virtualNote')}
        </p>
      ) : null}
    </div>
  );
}
