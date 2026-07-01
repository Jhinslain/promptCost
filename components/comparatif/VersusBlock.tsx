'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { METRIC_BY_ID, type MetricId } from '@/lib/data';
import { useTheme } from '../ui/ThemeProvider';

interface Side {
  emoji: string;
  label: string;
  value: number;
  unit: string;
}

/** Deux barres proportionnelles « classique vs IA ». La droite prend la couleur
 *  de la métrique (thème clair/sombre) ; la gauche reste neutre. */
export function VersusBlock({
  left,
  right,
  metric,
}: {
  left: Side;
  right: Side;
  metric?: MetricId;
}) {
  const locale = useLocale();
  const { theme } = useTheme();
  const max = Math.max(left.value, right.value, 0.0001);
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: n < 10 ? 2 : 0 }).format(n);
  const accent = metric
    ? `rgb(${theme === 'dark' ? METRIC_BY_ID[metric].accent.dark : METRIC_BY_ID[metric].accent.light})`
    : 'rgb(var(--accent))';

  const Bar = ({ side, color }: { side: Side; color: string }) => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2 text-sm font-bold">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="text-lg" aria-hidden>
            {side.emoji}
          </span>
          <span className="truncate">{side.label}</span>
        </span>
        <span className="num shrink-0 text-muted">
          {fmt(side.value)} {side.unit}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-line/70">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.max((side.value / max) * 100, 2)}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <Bar side={left} color="rgb(148 163 184)" />
      <Bar side={right} color={accent} />
    </div>
  );
}
