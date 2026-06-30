'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Info } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LangSwitcher } from '../ui/LangSwitcher';

export function Header() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-app items-center justify-between gap-2 px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent-soft text-lg">
            ⚡
          </span>
          <span className="text-lg">
            {t('site.name')}
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/methodologie"
            className="hidden h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm font-semibold transition-colors hover:border-accent sm:flex"
          >
            <Info size={16} />
            {t('header.methodology')}
          </Link>
          <LangSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
