'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';

interface Side {
  emoji: string;
  label: string;
  value: number;
  unit: string;
}

export function VersusBlock({
  title,
  left,
  right,
  verdict,
  source,
}: {
  title: string;
  left: Side;
  right: Side;
  verdict: string;
  source?: string;
}) {
  const locale = useLocale();
  const max = Math.max(left.value, right.value, 0.0001);
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: n < 10 ? 2 : 0 }).format(n);

  const Bar = ({ side, color }: { side: Side; color: string }) => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm font-bold">
        <span className="flex items-center gap-1.5">
          <span className="text-lg">{side.emoji}</span>
          {side.label}
        </span>
        <span className="num text-muted">
          {fmt(side.value)} {side.unit}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-line/70">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${(side.value / max) * 100}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
      </div>
    </div>
  );

  return (
    <div className="rounded-3xl border border-line bg-surface p-5">
      <h3 className="text-lg font-extrabold">{title}</h3>
      <div className="mt-4 flex flex-col gap-4">
        <Bar side={left} color="rgb(148 163 184)" />
        <Bar side={right} color="rgb(var(--accent))" />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">{verdict}</p>
      {source && <p className="mt-2 text-xs text-muted">{source}</p>}
    </div>
  );
}
