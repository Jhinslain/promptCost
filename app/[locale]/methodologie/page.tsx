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
  const t = await getTranslations({ locale, namespace: 'meta.methodologie' });
  return buildMetadata({
    locale,
    path: '/methodologie',
    title: t('title'),
    description: t('description'),
  });
}

const QA = ['1', '2', '3', '4', '5'] as const;

export default async function MethodologiePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'methodologie' });

  const faq = QA.map((n) => ({ q: t(`q${n}`), a: t(`a${n}`) }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <PageShell title={t('title')} intro={t('intro')}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col gap-3">
        {faq.map((f, i) => (
          <details
            key={i}
            open={i === 0}
            className="group rounded-2xl border border-line bg-surface p-4 [&_summary]:cursor-pointer"
          >
            <summary className="flex items-center justify-between gap-3 text-base font-bold marker:content-['']">
              {f.q}
              <span className="text-accent transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}
