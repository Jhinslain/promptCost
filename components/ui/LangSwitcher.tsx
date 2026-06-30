'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import { Flag } from './Flag';

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const next = locale === 'fr' ? 'en' : 'fr';
  // Drapeau de la langue courante (🇫🇷 sur /fr, 🇬🇧 sur /en) ; clic = bascule.
  const region = locale === 'fr' ? 'fr' : 'gb';

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => router.replace(pathname, { locale: next }))}
      aria-label={`Language: switch to ${next.toUpperCase()}`}
      className="grid h-9 w-9 place-items-center rounded-full transition-opacity hover:opacity-80 disabled:opacity-50"
    >
      <Flag region={region} className="h-4 w-auto rounded-[2px]" />
    </button>
  );
}
