'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = ['#f5a623', '#2f9bff', '#16a34a', '#ff6b6b', '#a855f7', '#ffd166'];

/** Pluie de confettis légère (CSS/Framer, sans dépendance). */
export function Confetti({ count = 80 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 53) % 100,
        delay: ((i * 37) % 100) / 200,
        duration: 1.6 + ((i * 17) % 100) / 100,
        color: COLORS[i % COLORS.length],
        rotate: (i * 47) % 360,
        size: 6 + ((i * 13) % 8),
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: '-10vh', x: 0, opacity: 1, rotate: p.rotate }}
          animate={{ y: '110vh', rotate: p.rotate + 360, opacity: [1, 1, 0.8] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            background: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}
