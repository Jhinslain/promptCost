import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/layout/PageShell';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.apropos' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `/${locale}/a-propos` },
  };
}

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'apropos' });

  return (
    <PageShell title={t('title')}>
      <div className="flex flex-col gap-4 text-base leading-relaxed text-text">
        <p>{t('p1')}</p>
        <p>{t('p2')}</p>
        <p className="text-muted">
          {t('by')}{' '}
          <a
            href="https://majoli.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-accent hover:underline"
          >
            Majoli
          </a>
          .
        </p>
      </div>
    </PageShell>
  );
}
