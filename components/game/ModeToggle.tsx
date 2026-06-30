'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Wallet, Sparkles, type LucideIcon } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';

interface ModeItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

/**
 * Navigation entre modes de jeu. Chaque mode est une vraie page (SEO + partage) :
 * « Dépenser » = `/`, « Convertir » = `/convertir`. Pour ajouter un mode,
 * il suffit d'ajouter une entrée + sa page.
 * Téléphone/tablette : segmenté en haut. Ordinateur (lg+) : rail d'icônes à droite.
 */
export function ModeToggle() {
  const t = useTranslations('reverse');
  const pathname = usePathname();

  const items: ModeItem[] = [
    { href: '/', label: t('tabSpend'), Icon: Wallet },
    { href: '/convertir', label: t('tabReverse'), Icon: Sparkles },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Mobile / tablette : segmenté en haut */}
      <div className="mt-5 flex w-full gap-1 rounded-2xl border border-line bg-surface p-1.5 lg:hidden">
        {items.map((it) => {
          const active = isActive(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? 'page' : undefined}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="mode-pill-mobile"
                  className="absolute inset-0 rounded-xl bg-accent-soft"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <it.Icon size={16} className={`relative z-10 ${active ? 'text-accent' : 'text-muted'}`} />
              <span className={`relative z-10 ${active ? 'text-accent' : 'text-muted'}`}>
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Ordinateur : rail d'icônes à droite */}
      <nav
        aria-label={t('modeNav')}
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 rounded-2xl border border-line bg-surface/90 p-1.5 shadow-lg shadow-black/5 backdrop-blur lg:flex"
      >
        {items.map((it) => {
          const active = isActive(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-label={it.label}
              aria-current={active ? 'page' : undefined}
              className="group relative grid h-12 w-12 place-items-center rounded-xl transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="mode-pill-desktop"
                  className="absolute inset-0 rounded-xl bg-accent"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <it.Icon
                size={20}
                className={`relative z-10 transition-colors ${
                  active ? 'text-white' : 'text-muted group-hover:text-text'
                }`}
              />
              <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-lg bg-text px-2 py-1 text-xs font-bold text-bg opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                {it.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
