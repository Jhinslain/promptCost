'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SCALES, scaleEmoji, scalePopulation, scaleLabelKey, type RegionKey } from '@/lib/data';
import { formatCompact } from '@/lib/format';
import { useGame } from '@/lib/store';
import { Flag } from '../ui/Flag';

/** `rkey` = pays de référence (auto : géo via cookie, sinon langue). */
export function ScaleSelector({ rkey }: { rkey: RegionKey }) {
  const t = useTranslations('scale');
  const locale = useLocale();
  const scaleId = useGame((s) => s.scaleId);
  const setScale = useGame((s) => s.setScale);

  return (
    <div className="flex flex-col gap-2">
      <span className="px-1 text-xs font-bold uppercase tracking-wider text-muted">
        {t('label')}
      </span>

      {/* Boutons centrés : une ligne quand ça rentre, sinon passage à la ligne */}
      <div className="flex flex-wrap justify-center gap-2">
        {SCALES.map((s) => {
          const active = s.id === scaleId;
          const pop = scalePopulation(s, rkey);
          return (
            <button
              key={s.id}
              onClick={() => setScale(s.id)}
              aria-pressed={active}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-bold transition-all ${
                active
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line bg-surface text-muted hover:border-accent/50'
              }`}
            >
              {s.id === 'country' ? (
                <Flag region={rkey} className="h-3.5 w-auto rounded-[2px]" />
              ) : (
                <span className="text-base">{scaleEmoji(s, rkey)}</span>
              )}
              {t(scaleLabelKey(s.id, rkey))}
              {pop >= 1000 && (
                <span className="num text-xs font-semibold opacity-60">
                  {formatCompact(pop, locale)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
