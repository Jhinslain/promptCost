import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ExternalLink } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { SOURCES, PER } from '@/lib/data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.sources' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `/${locale}/sources` },
  };
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

      <h2 className="mb-3 mt-8 text-sm font-bold uppercase tracking-wider text-muted">
        {t('actionsTitle')}
      </h2>
      <ul className="flex flex-col gap-2">
        {SOURCES.map((s) => (
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
      <p className="mt-4 text-xs text-muted">{tc('source')}</p>
    </PageShell>
  );
}
