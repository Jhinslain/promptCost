'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-app flex-col items-center px-4 py-20 text-center">
        <div className="num text-7xl font-extrabold text-accent">404</div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-base text-muted">{t('text')}</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-2xl bg-accent px-5 py-3 text-base font-bold text-on-accent transition-transform active:scale-95"
        >
          {t('cta')}
        </Link>
      </main>
      <Footer />
    </>
  );
}
