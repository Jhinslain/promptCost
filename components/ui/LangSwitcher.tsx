'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useTransition } from 'react';

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const next = locale === 'fr' ? 'en' : 'fr';

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => router.replace(pathname, { locale: next }))}
      aria-label="Language"
      className="flex h-9 items-center gap-1 rounded-full px-2 text-sm font-semibold text-muted transition-colors hover:text-text disabled:opacity-50"
    >
      <Globe size={16} />
      {next.toUpperCase()}
    </button>
  );
}
