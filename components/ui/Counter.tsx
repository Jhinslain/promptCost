'use client';

import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

interface CounterProps {
  value: number;
  format: (n: number) => string;
  className?: string;
}

/** Compteur animé (ease-out cubic) à chaque changement de valeur. */
export function Counter({ value, format, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduced) {
      node.textContent = format(value);
      prev.current = value;
      return;
    }

    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, format, reduced]);

  return <span ref={ref} className={className}>{format(value)}</span>;
}
