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
      className="flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm font-semibold text-text transition-colors hover:border-accent disabled:opacity-50"
    >
      <Globe size={16} />
      {next.toUpperCase()}
    </button>
  );
}
