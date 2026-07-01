import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ExternalLink } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { FeedbackCTA } from '@/components/feedback/FeedbackCTA';
import { SOURCES, PER, DATA_AS_OF } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.sources' });
  return buildMetadata({
    locale,
    path: '/sources',
    title: t('title'),
    description: t('description'),
  });
}

export default async function SourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'sources' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  return (
    <PageShell title={t('title')} intro={t('intro')}>
      <section className="rounded-3xl border border-line bg-surface p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">
          {t('perTitle')}
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-accent-soft p-3">
            <div className="text-2xl">⚡</div>
            <div className="num mt-1 font-extrabold">{PER.elec} Wh</div>
          </div>
          <div className="rounded-2xl bg-accent-soft p-3">
            <div className="text-2xl">💧</div>
            <div className="num mt-1 font-extrabold">{PER.water} mL</div>
          </div>
          <div className="rounded-2xl bg-accent-soft p-3">
            <div className="text-2xl">🌍</div>
            <div className="num mt-1 font-extrabold">{PER.co2} g</div>
          </div>
        </div>
      </section>

      {(['ai', 'elec', 'water', 'co2'] as const).map((cat) => (
        <section key={cat} className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            {t(`cat.${cat}`)}
          </h2>
          <ul className="flex flex-col gap-2">
            {SOURCES.filter((s) => s.category === cat).map((s) => (
              <li key={s.id}>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent"
                  >
                    <ExternalLink size={16} className="mt-0.5 shrink-0 text-accent" />
                    <span className="text-sm font-semibold leading-snug">{s.label}</span>
                  </a>
                ) : (
                  <div className="flex items-start gap-2 rounded-2xl border border-line bg-surface p-4">
                    <span className="text-sm font-semibold leading-snug">{s.label}</span>
                    <span className="ml-auto shrink-0 text-xs text-muted">{t('noUrl')}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="mt-6 text-xs text-muted">
        {tc('source')} ·{' '}
        {t('asOf', {
          date: new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
            new Date(DATA_AS_OF),
          ),
        })}
      </p>
      <div className="mt-12">
        <FeedbackCTA />
      </div>
    </PageShell>
  );
}
