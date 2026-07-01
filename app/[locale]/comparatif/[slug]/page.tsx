import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { VersusBlock } from '@/components/comparatif/VersusBlock';
import { COMPARISONS, COMPARISON_BY_SLUG } from '@/lib/comparisons';
import { SOURCE_BY_ID, DATA_AS_OF } from '@/lib/data';
import { buildMetadata, jsonLdScript, SITE_URL } from '@/lib/seo';

/** Une page statique par comparaison. */
export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!COMPARISON_BY_SLUG[slug]) return {};
  const t = await getTranslations({ locale, namespace: 'comparatif' });
  return buildMetadata({
    locale,
    path: `/comparatif/${slug}`,
    title: `${t(`cases.${slug}.title`)} | HowManyPrompts`,
    description: t(`cases.${slug}.short`),
    ogQuery: { metric: COMPARISON_BY_SLUG[slug].metric },
  });
}

const INTERNAL = [
  { href: '/', key: 'game' },
  { href: '/combien', key: 'combien' },
  { href: '/glossaire', key: 'glossaire' },
] as const;

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = COMPARISON_BY_SLUG[slug];
  if (!c) notFound();

  const t = await getTranslations({ locale, namespace: 'comparatif' });
  const title = t(`cases.${slug}.title`);
  const verdict = t(`cases.${slug}.verdict`);
  const sources = c.sourceIds.map((id) => SOURCE_BY_ID[id]).filter(Boolean);
  const faq = Array.from({ length: c.faqCount }, (_, i) => ({
    q: t(`cases.${slug}.faq.q${i + 1}`),
    a: t(`cases.${slug}.faq.a${i + 1}`),
  }));

  const url = `${SITE_URL}/${locale}/comparatif/${slug}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: t(`cases.${slug}.short`),
      inLanguage: locale,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      datePublished: DATA_AS_OF,
      dateModified: DATA_AS_OF,
      image: [`${SITE_URL}/api/og?lang=${locale}&metric=${c.metric}`],
      author: { '@type': 'Organization', name: 'HowManyPrompts' },
      publisher: {
        '@type': 'Organization',
        name: 'HowManyPrompts',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'HowManyPrompts', item: `${SITE_URL}/${locale}` },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('title'),
          item: `${SITE_URL}/${locale}/comparatif`,
        },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
  ];

  return (
    <PageShell title={title}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      <Link
        href="/comparatif"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={15} />
        {t('back')}
      </Link>

      {/* Versus */}
      <div className="mt-5 rounded-3xl border border-line bg-surface p-5 sm:p-6">
        <VersusBlock
          metric={c.metric}
          left={{ ...c.left, label: t(`cases.${slug}.leftLabel`) }}
          right={{ ...c.right, label: t(`cases.${slug}.rightLabel`) }}
        />
      </div>

      {/* Verdict */}
      <div className="mt-5 rounded-2xl border-l-2 border-accent bg-accent-soft/40 p-4">
        <div className="text-xs font-bold uppercase tracking-wider text-accent">
          {t('verdictLabel')}
        </div>
        <p className="mt-1 text-base font-semibold leading-relaxed text-text">{verdict}</p>
      </div>

      {/* Sources */}
      {sources.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">
            {t('sourcesLabel')}
          </h2>
          <ul className="mt-2 flex flex-col gap-2">
            {sources.map((s) => (
              <li key={s.id}>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 rounded-2xl border border-line bg-surface p-3 text-sm font-semibold leading-snug transition-colors hover:border-accent"
                  >
                    <ExternalLink size={15} className="mt-0.5 shrink-0 text-accent" />
                    {s.label}
                  </a>
                ) : (
                  <div className="rounded-2xl border border-line bg-surface p-3 text-sm font-semibold leading-snug">
                    {s.label}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            {t('faqLabel')}
          </h2>
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
        </section>
      )}

      {/* Maillage interne */}
      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">{t('moreTitle')}</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {INTERNAL.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex items-center justify-between gap-2 rounded-2xl border border-line bg-surface p-4 text-sm font-semibold text-text transition-colors hover:border-accent"
              >
                <span>{t(`links.${l.key}`)}</span>
                <ArrowRight size={15} className="shrink-0 text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
