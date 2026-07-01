'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Repeat, Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { LangSwitcher } from '../ui/LangSwitcher';
import { ThemeToggle } from '../ui/ThemeToggle';

/** Les 2 jeux (gauche) : chacun son icône, sa couleur, son animation. */
const GAMES = [
  {
    href: '/',
    key: 'nav.spend',
    Icon: Coins,
    color: 'text-amber-600 dark:text-amber-400',
    activeBg: 'bg-amber-500/15',
    anim: 'group-hover:-translate-y-0.5 group-hover:rotate-[-8deg]',
  },
  {
    href: '/convertir',
    key: 'nav.convert',
    Icon: Repeat,
    color: 'text-sky-600 dark:text-sky-400',
    activeBg: 'bg-sky-500/15',
    anim: 'group-hover:rotate-180',
  },
] as const;

/** Toutes les pages « contenu » + leur libellé. */
const PAGES = [
  { href: '/comparatif', key: 'footer.comparatif' },
  { href: '/combien', key: 'footer.compare' },
  { href: '/glossaire', key: 'footer.glossary' },
  { href: '/methodologie', key: 'footer.methodologie' },
  { href: '/sources', key: 'footer.sources' },
  { href: '/a-propos', key: 'footer.apropos' },
] as const;

const PAGE_KEY: Record<string, string> = Object.fromEntries(PAGES.map((p) => [p.href, p.key]));

/** Les 2 pages les plus utiles selon la page courante (raccourcis en clair). */
const RELATED: Record<string, [string, string]> = {
  '/comparatif': ['/combien', '/glossaire'],
  '/combien': ['/comparatif', '/glossaire'],
  '/glossaire': ['/methodologie', '/sources'],
  '/methodologie': ['/sources', '/glossaire'],
  '/sources': ['/methodologie', '/glossaire'],
  '/a-propos': ['/sources', '/methodologie'],
};
const DEFAULT_RELATED: [string, string] = ['/comparatif', '/glossaire'];

/**
 * Barre d'onglets : à gauche les 2 jeux (colorés, animés), puis les 2 pages
 * les plus utiles selon la page courante, un menu burger pour le reste, et
 * langue + thème. Sticky, translucide.
 */
export function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  // Base de la page courante (gère /combien/[x], /comparatif/[x]).
  const base =
    PAGES.find((p) => pathname === p.href || pathname.startsWith(`${p.href}/`))?.href ?? '';
  const related = (RELATED[base] ?? DEFAULT_RELATED).filter((h) => h !== base);

  return (
    <header
      ref={ref}
      className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-app items-center gap-2 px-3">
        {/* Gauche : les 2 jeux */}
        <nav className="flex shrink-0 items-center gap-1">
          {GAMES.map((g) => {
            const active = isActive(g.href);
            return (
              <Link
                key={g.href}
                href={g.href}
                aria-current={active ? 'page' : undefined}
                aria-label={t(g.key)}
                className={`group flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-extrabold transition-colors ${
                  active ? `${g.activeBg} ${g.color}` : `${g.color} opacity-70 hover:opacity-100`
                }`}
              >
                <g.Icon
                  size={16}
                  strokeWidth={2.5}
                  className={`shrink-0 transition-transform duration-300 ${g.anim}`}
                />
                <span className="hidden min-[420px]:inline">{t(g.key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Milieu : les 2 pages utiles (desktop) */}
        <nav className="hidden flex-1 items-center justify-end gap-0.5 md:flex">
          {related.map((href) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                isActive(href) ? 'text-accent-text' : 'text-muted hover:text-text'
              }`}
            >
              {t(PAGE_KEY[href])}
            </Link>
          ))}
        </nav>

        {/* Droite : langue, thème, burger */}
        <div className="ml-auto flex shrink-0 items-center md:ml-0">
          <LangSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label={t('nav.menu')}
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:text-text"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu burger : toutes les pages */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-xl"
          >
            <div className="mx-auto grid max-w-app gap-1 px-3 py-3 sm:grid-cols-2">
              {PAGES.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  aria-current={isActive(p.href) ? 'page' : undefined}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive(p.href)
                      ? 'bg-accent-soft text-accent-text'
                      : 'text-text hover:bg-line/50'
                  }`}
                >
                  {t(p.key)}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
