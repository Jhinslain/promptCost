'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Coins, Repeat, type LucideIcon } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';

interface ModeItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  /** Couleur du texte / icône (identique à la navbar des pages contenu). */
  color: string;
  /** Fond de l'état actif (rail desktop). */
  activeBg: string;
  /** Couleur du trait d'onglet actif (mobile). */
  underline: string;
  /** Animation de l'icône au survol (signature par jeu). */
  anim: string;
}

/**
 * Navigation entre modes de jeu. Chaque mode est une vraie page (SEO + partage) :
 * « Dépenser » = `/`, « Convertir » = `/convertir`. Couleurs, icônes et
 * animations calquées sur la navbar des pages contenu (cohérence visuelle).
 * Téléphone/tablette : onglets soulignés en haut. Ordinateur (lg+) : rail d'icônes à droite.
 */
export function ModeToggle() {
  const t = useTranslations('reverse');
  const pathname = usePathname();

  const items: ModeItem[] = [
    {
      href: '/',
      label: t('tabSpend'),
      Icon: Coins,
      color: 'text-amber-600 dark:text-amber-400',
      activeBg: 'bg-amber-500/15',
      underline: 'bg-amber-500',
      anim: 'group-hover:-translate-y-0.5 group-hover:rotate-[-8deg]',
    },
    {
      href: '/convertir',
      label: t('tabReverse'),
      Icon: Repeat,
      color: 'text-sky-600 dark:text-sky-400',
      activeBg: 'bg-sky-500/15',
      underline: 'bg-sky-500',
      anim: 'group-hover:rotate-180',
    },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Mobile / tablette : onglets soulignés (lecture « deux pages ») */}
      <div
        role="tablist"
        className="mt-5 flex w-full border-b border-line lg:hidden"
      >
        {items.map((it) => {
          const active = isActive(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              role="tab"
              aria-selected={active}
              aria-current={active ? 'page' : undefined}
              className={`group relative flex flex-1 items-center justify-center gap-2 px-3 pb-3 pt-1 text-sm font-extrabold transition-opacity ${
                it.color
              } ${active ? '' : 'opacity-60 hover:opacity-100'}`}
            >
              <it.Icon
                size={16}
                strokeWidth={2.5}
                className={`relative z-10 shrink-0 transition-transform duration-300 ${it.anim}`}
              />
              <span className="relative z-10">{it.label}</span>
              {active && (
                <motion.span
                  layoutId="mode-underline-mobile"
                  className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full ${it.underline}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
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
              className={`group relative grid h-12 w-12 place-items-center rounded-xl transition-opacity ${
                it.color
              } ${active ? '' : 'opacity-70 hover:opacity-100'}`}
            >
              {active && (
                <motion.span
                  layoutId="mode-pill-desktop"
                  className={`absolute inset-0 rounded-xl ${it.activeBg}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <it.Icon
                size={20}
                strokeWidth={2.5}
                className={`relative z-10 shrink-0 transition-transform duration-300 ${it.anim}`}
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
