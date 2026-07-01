import type { Metadata } from 'next';
import { Fragment } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { FeedbackCTA } from '@/components/feedback/FeedbackCTA';
import { METRICS, PER, PER_RANGE } from '@/lib/data';
import { buildMetadata, jsonLdScript } from '@/lib/seo';

const FLOW = ['s1', 's2', 's3'] as const;
const EXAMPLES = ['shower', 'oven', 'car'] as const;
const SCALES_ROWS = ['you', 'hundred', 'day', 'all'] as const;
const FAQ = ['1', '2', '3', '4', '5', '6'] as const;
const LINKS = [
  { href: '/sources', key: 'sources' },
  { href: '/glossaire', key: 'glossaire' },
  { href: '/comparatif', key: 'comparatif' },
  { href: '/', key: 'game' },
] as const;

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

export default async function MethodologiePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'methodologie' });
  const tm = await getTranslations({ locale, namespace: 'metric' });

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(n);

  const faq = FAQ.map((n) => ({ q: t(`q${n}`), a: t(`a${n}`) }));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const H2 = ({ children }: { children: React.ReactNode }) => (
    <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-text">
      <span className="h-4 w-1 rounded-full bg-accent" aria-hidden />
      {children}
    </h2>
  );

  return (
    <PageShell title={t('title')} intro={t('intro')}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      <div className="flex flex-col gap-10">
        {/* En bref */}
        <section className="flex flex-col gap-3">
          <H2>{t('briefTitle')}</H2>
          <p className="text-base leading-relaxed text-muted">{t('brief')}</p>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            {FLOW.map((s, i) => (
              <Fragment key={s}>
                {i > 0 && (
                  <div className="flex items-center justify-center text-accent-text" aria-hidden>
                    <ArrowRight size={18} className="rotate-90 sm:rotate-0" />
                  </div>
                )}
                <div className="flex flex-1 items-center justify-center rounded-xl border border-line bg-surface p-3 text-center text-xs font-semibold text-text">
                  {t(`flow.${s}`)}
                </div>
              </Fragment>
            ))}
          </div>
        </section>

        {/* Combien consomme un prompt */}
        <section className="flex flex-col gap-3">
          <H2>{t('costTitle')}</H2>
          <p className="text-base leading-relaxed text-muted">{t('costLead')}</p>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {METRICS.map((m) => (
              <div key={m.id} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden>
                    {m.emoji}
                  </span>
                  <span className="text-sm font-bold text-text">{tm(m.id)}</span>
                </div>
                <div className="num mt-2 text-2xl font-extrabold text-accent-text">
                  {fmt(PER[m.id])} {m.unit}
                </div>
                <div className="mt-2 text-xs text-muted">
                  <span className="font-bold">{t('costRange')} :</span>{' '}
                  <span className="num">
                    {fmt(PER_RANGE[m.id].min)}–{fmt(PER_RANGE[m.id].max)} {m.unit}
                  </span>
                </div>
                <div className="mt-1 text-xs leading-snug text-muted">
                  <span className="font-bold">{t('costSources')} :</span> {t(`${m.id}Src`)}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-muted">{t('costNote')}</p>
        </section>

        {/* La formule */}
        <section className="flex flex-col gap-3">
          <H2>{t('formulaTitle')}</H2>
          <p className="rounded-2xl border-l-2 border-accent bg-accent-soft/40 p-4 text-center text-base font-extrabold text-text">
            {t('formula')}
          </p>
          <p className="text-sm font-semibold text-muted">{t('formulaLead')}</p>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map((k) => (
              <div
                key={k}
                className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm font-bold text-text">{t(`ex.${k}G`)}</span>
                <span className="num text-sm text-muted">{t(`ex.${k}C`)}</span>
                <span className="num text-sm font-extrabold text-accent-text">{t(`ex.${k}R`)}</span>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-muted">{t('formulaNote')}</p>
        </section>

        {/* Eau et CO2 virtuels */}
        <section className="flex flex-col gap-3">
          <H2>{t('virtualTitle')}</H2>
          <p className="text-base leading-relaxed text-muted">{t('virtual')}</p>
        </section>

        {/* Les échelles */}
        <section className="flex flex-col gap-3">
          <H2>{t('scalesTitle')}</H2>
          <p className="text-base leading-relaxed text-muted">{t('scalesLead')}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SCALES_ROWS.map((k) => (
              <div key={k} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-bold text-text">{t(`sc.${k}L`)}</span>
                  <span className="num text-sm font-extrabold text-accent-text">{t(`sc.${k}B`)}</span>
                </div>
                <div className="mt-1 text-xs text-muted">
                  <span className="font-bold">{t('scalesBase')} :</span> {t(`sc.${k}Base`)}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-muted">{t('scalesNote')}</p>
        </section>

        {/* Fourchettes */}
        <section className="flex flex-col gap-3">
          <H2>{t('rangeTitle')}</H2>
          <p className="text-base leading-relaxed text-muted">{t('rangeLead')}</p>
          <ul className="flex flex-col gap-2">
            {['rangeFlight', 'rangeBeef'].map((k) => (
              <li
                key={k}
                className="flex gap-2 rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-muted"
              >
                <span className="text-accent-text" aria-hidden>
                  •
                </span>
                {t(k)}
              </li>
            ))}
          </ul>
          <p className="text-sm font-semibold text-text">{t('rangeEnd')}</p>
        </section>

        {/* Entraînement */}
        <section className="flex flex-col gap-3">
          <H2>{t('trainTitle')}</H2>
          <p className="text-base leading-relaxed text-muted">{t('train1')}</p>
          <p className="text-base leading-relaxed text-muted">{t('train2')}</p>
        </section>

        {/* FAQ */}
        <section>
          <H2>{t('faqTitle')}</H2>
          <div className="mt-3 flex flex-col gap-3">
            {faq.map((f, i) => (
              <details
                key={i}
                open={i === 0}
                className="group rounded-2xl border border-line bg-surface p-4 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-center justify-between gap-3 text-base font-bold marker:content-['']">
                  {f.q}
                  <span className="text-accent-text transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="text-xs leading-relaxed text-muted">{t('outro')}</p>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">
            {t('moreTitle')}
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 text-sm font-semibold text-text transition-colors hover:border-accent"
                >
                  <span>{t(`links.${l.key}`)}</span>
                  <ArrowRight size={16} className="shrink-0 text-accent-text" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="mt-12">
        <FeedbackCTA />
      </div>
    </PageShell>
  );
}
