'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter, routing } from '@/i18n/routing';
import { useEffect, useRef, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Flag } from './Flag';

/**
 * Métadonnées par langue : drapeau (SVG, cf. Flag) + nom dans sa propre langue.
 * Ajouter une locale = l'ajouter dans routing.locales + ici (fallback prévu).
 */
const META: Record<string, { region: 'fr' | 'gb' | 'us'; label: string }> = {
  fr: { region: 'fr', label: 'Français' },
  en: { region: 'gb', label: 'English' },
};

const metaFor = (code: string) =>
  META[code] ?? { region: 'gb' as const, label: code.toUpperCase() };

/**
 * Sélecteur de langue : menu déroulant (extensible à N langues) plutôt qu'un
 * simple toggle. Ferme au clic extérieur / Échap ; accessible au clavier.
 */
export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const cur = metaFor(locale);

  function choose(code: string) {
    setOpen(false);
    if (code === locale) return;
    startTransition(() => router.replace(pathname, { locale: code }));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={isPending}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${cur.label}`}
        className="grid h-9 w-9 place-items-center rounded-full transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        <Flag region={cur.region} className="h-4 w-auto rounded-[2px]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-xl"
          >
            {routing.locales.map((code) => {
              const m = metaFor(code);
              const active = code === locale;
              return (
                <li key={code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(code)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors ${
                      active ? 'bg-accent-soft text-accent' : 'text-text hover:bg-line/50'
                    }`}
                  >
                    <Flag region={m.region} className="h-3.5 w-auto rounded-[2px]" />
                    <span className="flex-1 text-left">{m.label}</span>
                    {active && <Check size={14} className="shrink-0" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
