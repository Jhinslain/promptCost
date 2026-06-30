'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Info } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LangSwitcher } from '../ui/LangSwitcher';

/**
 * Pas de barre : juste les 3 boutons (info, langue, thème) posés en haut à
 * droite, par-dessus la page, discrets. Le reste des infos vit dans le footer.
 */
export function Header() {
  const t = useTranslations();

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50">
      <div className="flex justify-end px-3 pt-3">
        <div className="pointer-events-auto flex items-center gap-0.5">
          <Link
            href="/methodologie"
            aria-label={t('header.methodology')}
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:text-text"
          >
            <Info size={18} />
          </Link>
          <LangSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
