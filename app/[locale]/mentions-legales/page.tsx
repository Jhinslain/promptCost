import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/layout/PageShell';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.legal' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `/${locale}/mentions-legales` },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legal' });

  return (
    <PageShell title={t('title')}>
      <div className="flex flex-col gap-4 text-base leading-relaxed text-text">
        <p>{t('p1')}</p>
        <p>{t('p2')}</p>
        <dl className="mt-2 grid gap-3 text-sm">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <dt className="font-bold text-muted">{t('editor')}</dt>
            <dd className="mt-1">
              <a href="https://majoli.io" className="font-semibold text-accent hover:underline">
                Majoli
              </a>
            </dd>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <dt className="font-bold text-muted">{t('data')}</dt>
            <dd className="mt-1 text-muted">2025–2026</dd>
          </div>
        </dl>
      </div>
    </PageShell>
  );
}
