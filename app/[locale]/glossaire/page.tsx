import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/layout/PageShell';
import { buildMetadata } from '@/lib/seo';

const TERMS = ['prompt', 'wh', 'virtualWater', 'co2e', 'radiative', 'reasoning'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tg = await getTranslations({ locale, namespace: 'glossary' });
  return buildMetadata({
    locale,
    path: '/glossaire',
    title: tg('metaTitle'),
    description: tg('metaDescription'),
  });
}

export default async function GlossairePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tg = await getTranslations({ locale, namespace: 'glossary' });

  return (
    <PageShell title={tg('title')} intro={tg('intro')}>
      <dl className="flex flex-col gap-3">
        {TERMS.map((k) => (
          <div key={k} className="rounded-2xl border border-line bg-surface p-4">
            <dt className="font-bold text-text">{tg(`terms.${k}.term`)}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted">{tg(`terms.${k}.def`)}</dd>
          </div>
        ))}
      </dl>
    </PageShell>
  );
}
