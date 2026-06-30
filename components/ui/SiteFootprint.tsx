'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { METRIC_BY_ID, type MetricId } from '@/lib/data';
import { useTheme } from './ThemeProvider';

// Séquence ⚡ → 💧 → 🌍 (3 équivalents par métrique), une rotation toutes les 3 s.
const SEQ: { m: MetricId; k: '0' | '1' | '2' }[] = [
  { m: 'elec', k: '0' },
  { m: 'water', k: '0' },
  { m: 'co2', k: '0' },
  { m: 'elec', k: '1' },
  { m: 'water', k: '1' },
  { m: 'co2', k: '1' },
  { m: 'elec', k: '2' },
  { m: 'water', k: '2' },
  { m: 'co2', k: '2' },
];

/**
 * Clin d'œil transparent : l'empreinte de la *création* de ce site, qui défile
 * sur les 3 métriques avec leur couleur. Au clic : la méthode (honnêteté).
 * Respecte prefers-reduced-motion (rotation figée).
 */
export function SiteFootprint() {
  const t = useTranslations('footprint');
  const { theme } = useTheme();

  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % SEQ.length), 3000);
    return () => clearInterval(id);
  }, [reduced]);

  const cur = SEQ[i];
  const color = `rgb(${
    theme === 'dark' ? METRIC_BY_ID[cur.m].accent.dark : METRIC_BY_ID[cur.m].accent.light
  })`;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent"
      >
        <span>{t('prefix')}</span>
        <span className="num inline-flex items-center gap-1 font-bold" style={{ color }}>
          <span aria-hidden>{METRIC_BY_ID[cur.m].emoji}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={i}
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {t(`${cur.m}.${cur.k}`)}
            </motion.span>
          </AnimatePresence>
        </span>
        <Info size={13} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute bottom-full left-0 z-50 mb-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-surface p-4 text-left shadow-xl"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                {t('label')}
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label={t('label')}
                className="text-muted transition-colors hover:text-text"
              >
                <X size={15} />
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text">{t('method')}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{t('perVisit')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
