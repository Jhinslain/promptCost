import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/layout/PageShell';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.feedback' });
  return buildMetadata({
    locale,
    path: '/feedback',
    title: t('title'),
    description: t('description'),
  });
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'feedback' });

  return (
    <PageShell title={t('title')} intro={t('lead')}>
      <div className="max-w-2xl">
        <FeedbackForm />
      </div>
    </PageShell>
  );
}
