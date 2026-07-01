'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ACTIONS, METRIC_BY_ID, PERSON_YEAR, type MetricId } from '@/lib/data';
import { promptsForAction } from '@/lib/convert';
import { formatCompact, formatInt, formatYears } from '@/lib/format';
import { useGame } from '@/lib/store';
import { useTheme } from '../ui/ThemeProvider';

interface ReceiptProps {
  metric: MetricId;
  goal: number;
  scaleLabel: string;
}

/**
 * Le détail de la facture de la catégorie active (électricité / eau / carbone) :
 * ses gestes, son total, son budget. Suit l'onglet métrique.
 */
export function Receipt({ metric, goal, scaleLabel }: ReceiptProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { theme } = useTheme();
  const cart = useGame((s) => s.cart);

  const color = `rgb(${
    theme === 'dark' ? METRIC_BY_ID[metric].accent.dark : METRIC_BY_ID[metric].accent.light
  })`;

  const { items, total } = useMemo(() => {
    const list = ACTIONS[metric]
      .filter((a) => (cart[a.id] ?? 0) > 0)
      .map((a) => ({
        ...a,
        qty: cart[a.id],
        cost: promptsForAction(a.value, metric) * cart[a.id],
      }))
      .sort((x, y) => y.cost - x.cost);
    return { items: list, total: list.reduce((s, l) => s + l.cost, 0) };
  }, [cart, metric]);

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="h-1 w-full" style={{ backgroundColor: color }} />
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-text">
            <span aria-hidden>🧾</span>
            {t(`bill.${metric}`)}
          </h2>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
            style={{ color, backgroundColor: `${color}1f` }}
          >
            {scaleLabel}
          </span>
        </div>

        {items.length === 0 ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">{t('receipt.empty')}</p>
        ) : (
          <ul className="mt-3 flex flex-col">
            {items.map((l) => (
              <li
                key={l.id}
                className="flex items-baseline gap-2 border-b border-dashed border-line py-2 text-sm"
              >
                <span className="shrink-0 text-base" aria-hidden>
                  {l.emoji}
                </span>
                <span className="truncate font-semibold text-text">{t(`actions.${l.id}`)}</span>
                {l.qty > 1 && (
                  <span className="num shrink-0 text-xs font-bold text-muted">
                    ×{formatCompact(l.qty, locale)}
                  </span>
                )}
                <span className="num ml-auto shrink-0 font-bold text-text">
                  {formatCompact(l.cost, locale)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex items-baseline justify-between gap-2 border-t-2 border-text/15 pt-3">
          <span className="text-sm font-extrabold uppercase tracking-wide text-text">
            {t('receipt.total')}
          </span>
          <span className="num text-lg font-extrabold" style={{ color }}>
            {formatCompact(total, locale)}
            <span className="ml-1 text-[11px] font-bold uppercase text-muted">
              {t('total.promptsUnit')}
            </span>
          </span>
        </div>

        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <span className="text-xs font-bold" style={{ color }}>
            {t('total.yearsUse', { years: formatYears(total / PERSON_YEAR, locale) })}
          </span>
          <span className="shrink-0 text-[11px] font-semibold text-muted">
            {t('total.target', {
              scale: scaleLabel,
              goal: goal >= 1_000_000 ? formatCompact(goal, locale) : formatInt(goal, locale),
            })}
          </span>
        </div>
      </div>
    </section>
  );
}
