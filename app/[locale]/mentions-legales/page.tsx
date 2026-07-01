import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/layout/PageShell';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.legal' });
  return buildMetadata({
    locale,
    path: '/mentions-legales',
    title: t('title'),
    description: t('description'),
  });
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
        <h2 className="mt-2 text-lg font-extrabold tracking-tight">{t('privacyTitle')}</h2>
        <p>{t('privacy')}</p>
        <dl className="mt-2 grid gap-3 text-sm">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <dt className="font-bold text-muted">{t('editor')}</dt>
            <dd className="mt-1">
              GHIS (SASU) · RCS Manosque 105 680 078 ·{' '}
              <a href="mailto:contact@ghis.fr" className="font-semibold text-accent-text hover:underline">
                contact@ghis.fr
              </a>
            </dd>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <dt className="font-bold text-muted">{t('director')}</dt>
            <dd className="mt-1">Ghislain Levreau</dd>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <dt className="font-bold text-muted">{t('host')}</dt>
            <dd className="mt-1">
              Vercel Inc., Walnut, CA, USA ·{' '}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent-text hover:underline"
              >
                vercel.com
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </PageShell>
  );
}
