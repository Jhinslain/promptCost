'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { ACTIONS, SOURCE_BY_ID, type MetricId } from '@/lib/data';
import { promptsForAction } from '@/lib/convert';
import { formatCompact } from '@/lib/format';
import { useGame } from '@/lib/store';

interface ActionGridProps {
  metric: MetricId;
}

/**
 * Le « rayon » des gestes, façon boutique (inspiré de neal.fun/spend) :
 * une grille de cartes-produit triées par coût, avec image (emoji), titre,
 * argument de vente, prix en prompts et bouton Acheter → stepper.
 * Le coût est toujours celui d'UNE personne (l'échelle ne change que l'objectif).
 */
export function ActionGrid({ metric }: ActionGridProps) {
  const t = useTranslations();
  const locale = useLocale();
  const cart = useGame((s) => s.cart);
  const add = useGame((s) => s.add);
  const remove = useGame((s) => s.remove);

  const rows = useMemo(
    () =>
      [...ACTIONS[metric]]
        .map((a) => ({ ...a, cost: promptsForAction(a.value, metric, 1) }))
        .sort((x, y) => x.cost - y.cost),
    [metric],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">
          {t('actions.title')}
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {rows.map((a, i) => {
          const qty = cart[a.id] ?? 0;
          const label = t(`actions.${a.id}`);
          const bought = qty > 0;
          const source = SOURCE_BY_ID[a.sourceId];
          return (
            <motion.li
              key={`${metric}-${a.id}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.22), duration: 0.25 }}
              className={`group relative flex select-none flex-col overflow-hidden rounded-2xl border bg-surface transition-all duration-200 hover:-translate-y-0.5 ${
                bought
                  ? 'border-accent shadow-md shadow-accent/10 ring-1 ring-accent/30'
                  : 'border-line hover:border-accent/50 hover:shadow-md'
              }`}
            >
              {/* Pastille quantité */}
              <AnimatePresence>
                {bought && (
                  <motion.div
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="num absolute right-2 top-2 z-10 grid h-6 min-w-[1.5rem] place-items-center rounded-full bg-accent px-1.5 text-xs font-extrabold text-white shadow"
                  >
                    ×{qty}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image (emoji) */}
              <button
                type="button"
                onClick={() => add(a.id)}
                aria-label={t('controls.add', { action: label })}
                className="flex aspect-[5/4] items-center justify-center bg-gradient-to-br from-accent-soft to-transparent transition-colors active:bg-accent/15"
              >
                <span className="transition-transform duration-200 group-hover:scale-110">
                  <motion.span
                    key={qty}
                    initial={{ scale: bought ? 0.78 : 1, rotate: bought ? -8 : 0 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 14 }}
                    className="block text-5xl drop-shadow-sm sm:text-6xl"
                  >
                    {a.emoji}
                  </motion.span>
                </span>
              </button>

              {/* Infos */}
              <div className="flex flex-1 flex-col gap-0.5 px-3 pt-2.5">
                <div className="truncate text-sm font-bold leading-tight text-text">
                  {label}
                </div>
                <div
                  className="num mt-1 inline-flex cursor-help items-baseline gap-1 self-start text-[15px] font-extrabold leading-none text-accent"
                  title={source ? `${t('common.source')} : ${source.label}` : undefined}
                >
                  {formatCompact(a.cost, locale)}
                  <span className="text-[10px] font-bold uppercase tracking-wide text-muted">
                    {t('total.promptsUnit')}
                  </span>
                </div>
              </div>

              {/* Acheter / stepper */}
              <div className="p-3 pt-2.5">
                {!bought ? (
                  <button
                    onClick={() => add(a.id)}
                    aria-label={t('controls.add', { action: label })}
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border-2 border-accent text-sm font-extrabold text-accent transition-colors hover:bg-accent hover:text-white active:scale-95"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    {t('actions.buy')}
                  </button>
                ) : (
                  <div className="flex h-9 items-center justify-between rounded-xl bg-accent px-1.5 text-white">
                    <button
                      onClick={() => remove(a.id)}
                      aria-label={t('controls.remove', { action: label })}
                      className="grid h-7 w-7 place-items-center rounded-lg transition-colors hover:bg-white/20 active:scale-90"
                    >
                      <Minus size={16} strokeWidth={2.5} />
                    </button>
                    <span className="num text-sm font-extrabold tabular-nums">{qty}</span>
                    <button
                      onClick={() => add(a.id)}
                      aria-label={t('controls.add', { action: label })}
                      className="grid h-7 w-7 place-items-center rounded-lg transition-colors hover:bg-white/20 active:scale-90"
                    >
                      <Plus size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
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
