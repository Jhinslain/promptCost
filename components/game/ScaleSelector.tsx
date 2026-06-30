'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SCALES, scaleEmoji } from '@/lib/data';
import { useGame } from '@/lib/store';

export function ScaleSelector() {
  const t = useTranslations('scale');
  const locale = useLocale();
  const scaleId = useGame((s) => s.scaleId);
  const setScale = useGame((s) => s.setScale);

  return (
    <div className="flex flex-col gap-2">
      <span className="px-1 text-xs font-bold uppercase tracking-wider text-muted">
        {t('label')}
      </span>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SCALES.map((s) => {
          const active = s.id === scaleId;
          return (
            <button
              key={s.id}
              onClick={() => setScale(s.id)}
              aria-pressed={active}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-bold transition-all ${
                active
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line bg-surface text-muted hover:border-accent/50'
              }`}
            >
              <span className="text-base">{scaleEmoji(s, locale)}</span>
              {t(s.id)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
