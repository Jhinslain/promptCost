'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SCALES } from '@/lib/scales';
import { formatCompact } from '@/lib/format';
import { useGame } from '@/lib/store';

/**
 * Choix de l'échelle = choix du budget de prompts visé (usage réel de l'IA).
 * Aucune multiplication de population : le budget est la valeur telle quelle.
 */
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

      <div className="flex flex-wrap justify-center gap-2">
        {SCALES.map((s) => {
          const active = s.id === scaleId;
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
              <span className="text-base" aria-hidden>
                {s.emoji}
              </span>
              {t(s.id)}
              <span className="num text-xs font-semibold opacity-60">
                {formatCompact(s.budget, locale)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
