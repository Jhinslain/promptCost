'use client';

import { Fragment, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Shuffle, Info } from 'lucide-react';
import {
  USAGE_TYPES,
  EQUIV_DEEDS,
  METRIC_BY_ID,
  type MetricId,
} from '@/lib/data';
import { usageTotals } from '@/lib/convert';
import { formatQty, formatInt, splitDuration, splitDistance } from '@/lib/format';
import { useGame } from '@/lib/store';
import { useTheme } from '../ui/ThemeProvider';

const METRIC_ORDER: MetricId[] = ['elec', 'water', 'co2'];

const INITIAL_DEEDS: Record<MetricId, string> = {
  elec: 'tv',
  water: 'shower',
  co2: 'streaming',
};

export function ReverseMode() {
  const t = useTranslations();
  const locale = useLocale();
  const { theme } = useTheme();

  const usage = useGame((s) => s.usage);
  const setUsage = useGame((s) => s.setUsage);
  const bumpUsage = useGame((s) => s.bumpUsage);

  const [deeds, setDeeds] = useState<Record<MetricId, string>>(INITIAL_DEEDS);
  const [noteOpen, setNoteOpen] = useState(false);

  const totals = useMemo(() => usageTotals(usage, USAGE_TYPES), [usage]);
  const hasInput = totals.elec > 0;

  const colorOf = (m: MetricId) =>
    `rgb(${theme === 'dark' ? METRIC_BY_ID[m].accent.dark : METRIC_BY_ID[m].accent.light})`;

  /** Phrase « tu aurais pu… » : durée, distance ou nombre selon le geste. */
  function deedText(deed: (typeof EQUIV_DEEDS)[number]): string {
    const total = totals[deed.metric];
    if (deed.kind === 'time') {
      const { value, unit } = splitDuration(total / deed.perUnit);
      const u = t(
        `reverse.durationUnits.${unit}.${Math.abs(value) >= 2 ? 'other' : 'one'}`,
      );
      return t(`reverse.deeds.${deed.id}`, { d: `${formatQty(value, locale)} ${u}` });
    }
    if (deed.kind === 'distance') {
      const { value, unit } = splitDistance(total / deed.perUnit);
      const u = t(`reverse.distanceUnits.${unit}`);
      return t(`reverse.deeds.${deed.id}`, { d: `${formatQty(value, locale)} ${u}` });
    }
    return t(`reverse.deeds.${deed.id}`, { q: formatQty(total / deed.perUnit, locale) });
  }

  function another() {
    const next = { ...deeds };
    for (const m of METRIC_ORDER) {
      const ofMetric = EQUIV_DEEDS.filter((d) => d.metric === m);
      // Différent du courant ; les comptages doivent rester lisibles (≥ 0,2),
      // les durées/distances se mettent toujours à l'échelle (s, min, m…).
      const sensible = ofMetric.filter((d) => {
        if (d.id === deeds[m]) return false;
        if (d.kind === 'count') return totals[m] / d.perUnit >= 0.2;
        return true;
      });
      const pool = sensible.length
        ? sensible
        : ofMetric.filter((d) => d.id !== deeds[m]);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) next[m] = pick.id;
    }
    setDeeds(next);
  }

  return (
    <div className="mx-auto flex max-w-app flex-col gap-6 px-4 pb-6">
      {/* SAISIE */}
      <div className="flex flex-col gap-2">
        <span className="px-1 text-xs font-bold uppercase tracking-wider text-muted">
          {t('reverse.todayLabel')}
        </span>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {USAGE_TYPES.map((ut) => {
            const value = usage[ut.id] ?? 0;
            const label = t(`reverse.types.${ut.id}`);
            return (
              <div
                key={ut.id}
                className={`flex flex-col items-center gap-2 rounded-2xl border bg-surface p-3 transition-colors ${
                  value > 0 ? 'border-accent' : 'border-line'
                }`}
              >
                <span className="text-3xl" aria-hidden>
                  {ut.emoji}
                </span>
                <span className="text-center text-xs font-bold leading-tight text-text">
                  {label}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => bumpUsage(ut.id, -1)}
                    aria-label={`- ${label}`}
                    className="grid h-7 w-7 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-text active:scale-90"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    aria-label={label}
                    value={value}
                    onChange={(e) => setUsage(ut.id, Number(e.target.value))}
                    className="num w-10 [appearance:textfield] rounded-lg border border-line bg-bg py-1 text-center text-base font-extrabold text-text outline-none focus:border-accent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => bumpUsage(ut.id, 1)}
                    aria-label={`+ ${label}`}
                    className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-on-accent transition-transform active:scale-90"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RÉSULTAT */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="accent-glow pointer-events-none absolute inset-x-0 top-0 h-40" />
        <div className="relative flex flex-col items-center px-4 py-7 sm:px-5">
          {!hasInput ? (
            <p className="py-8 text-sm font-semibold text-muted">{t('reverse.empty')}</p>
          ) : (
            <>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
                {t('reverse.couldHave')}
              </span>

              {/* 3 catégories côte à côte, une par ressource, reliées par « + » */}
              <div className="mt-5 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
                {METRIC_ORDER.map((m, idx) => {
                  const deed = EQUIV_DEEDS.find((d) => d.id === deeds[m]) ?? EQUIV_DEEDS[0];
                  const color = colorOf(m);
                  return (
                    <Fragment key={m}>
                      {idx > 0 && (
                        <span
                          className="flex select-none items-center justify-center text-2xl font-bold text-muted/50"
                          aria-hidden
                        >
                          +
                        </span>
                      )}
                    <div
                      className="flex flex-1 flex-col items-center rounded-2xl border border-line bg-bg/40 px-3 py-5 text-center"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={deed.id}
                          initial={{ opacity: 0, y: 12, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -12, scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                          className="flex flex-col items-center"
                        >
                          <span
                            className="grid h-20 w-20 place-items-center rounded-full text-4xl"
                            style={{ backgroundColor: `${color}24` }}
                          >
                            {deed.emoji}
                          </span>
                          <p className="mt-3 text-base font-extrabold leading-snug text-text">
                            {deedText(deed)}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                      <span
                        className="num mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                        style={{ color, backgroundColor: `${color}1f` }}
                      >
                        <span aria-hidden>{METRIC_BY_ID[m].emoji}</span>
                        {formatInt(Math.round(totals[m]), locale)} {METRIC_BY_ID[m].unit}
                      </span>
                    </div>
                    </Fragment>
                  );
                })}
              </div>

              <button
                onClick={another}
                className="mt-6 flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold text-on-accent transition-transform active:scale-95"
              >
                <Shuffle size={16} />
                {t('reverse.another')}
              </button>
            </>
          )}

          {/* Note d'honnêteté derrière un (i) */}
          <div className="mt-6 w-full border-t border-line pt-3">
            <button
              onClick={() => setNoteOpen((v) => !v)}
              aria-expanded={noteOpen}
              className="mx-auto flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-text"
            >
              <Info size={14} />
              {t('reverse.noteLabel')}
            </button>
            <AnimatePresence initial={false}>
              {noteOpen && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-auto mt-2 max-w-sm overflow-hidden text-center text-xs leading-relaxed text-muted"
                >
                  {t('reverse.note')}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
