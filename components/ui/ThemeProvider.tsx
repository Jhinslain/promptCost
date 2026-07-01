'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { MotionConfig } from 'framer-motion';

type Theme = 'light' | 'dark';

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: 'light', toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Sync with the class set by the no-flash inline script.
  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      try {
        localStorage.setItem('pc-theme', next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  // `reducedMotion="user"` : toutes les animations Framer respectent
  // prefers-reduced-motion (transforme/anime a minima).
  return (
    <Ctx.Provider value={{ theme, toggle }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
