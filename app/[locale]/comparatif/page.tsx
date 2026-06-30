import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/layout/PageShell';
import { VersusBlock } from '@/components/comparatif/VersusBlock';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.comparatif' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `/${locale}/comparatif` },
  };
}

export default async function ComparatifPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'comparatif' });

  return (
    <PageShell title={t('title')} intro={t('subtitle')}>
      <div className="flex flex-col gap-4">
        <VersusBlock
          title={t('case1.title')}
          left={{ emoji: '🔎', label: t('case1.leftLabel'), value: 0.3, unit: 'Wh' }}
          right={{ emoji: '🤖', label: t('case1.rightLabel'), value: 0.34, unit: 'Wh' }}
          verdict={t('case1.verdict')}
          source="Google · OpenAI · Epoch AI"
        />
        <VersusBlock
          title={t('case2.title')}
          left={{ emoji: '🖼️', label: t('case2.leftLabel'), value: 0.05, unit: 'Wh' }}
          right={{ emoji: '🎨', label: t('case2.rightLabel'), value: 9, unit: 'Wh' }}
          verdict={t('case2.verdict')}
          source="EcoLogits · arXiv 2505.09598"
        />
        <VersusBlock
          title={t('case3.title')}
          left={{ emoji: '📺', label: t('case3.leftLabel'), value: 2.3, unit: 'Wh' }}
          right={{ emoji: '🤖', label: t('case3.rightLabel'), value: 0.3, unit: 'Wh' }}
          verdict={t('case3.verdict')}
          source="IEA · Epoch AI"
        />
      </div>
    </PageShell>
  );
}
