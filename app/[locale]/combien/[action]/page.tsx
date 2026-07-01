import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { ACTIONS, ACTION_BY_ID, PER, METRIC_BY_ID, SOURCE_BY_ID } from '@/lib/data';
import { promptsForAction } from '@/lib/convert';
import { formatCompact } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

/** Une page statique par geste (toutes métriques). */
export function generateStaticParams() {
  return Object.keys(ACTION_BY_ID).map((action) => ({ action }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; action: string }>;
}): Promise<Metadata> {
  const { locale, action } = await params;
  const entry = ACTION_BY_ID[action];
  if (!entry) return {};
  const t = await getTranslations({ locale });
  const tc = await getTranslations({ locale, namespace: 'compare' });
  const label = t(`actions.${action}`);
  const cost = formatCompact(promptsForAction(entry.action.value, entry.metric), locale);
  return buildMetadata({
    locale,
    path: `/combien/${action}`,
    title: tc('metaTitle', { label, cost }),
    description: tc('metaDescription', { label, cost, metric: tc(`metric.${entry.metric}`) }),
  });
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string; action: string }>;
}) {
  const { locale, action } = await params;
  setRequestLocale(locale);
  const entry = ACTION_BY_ID[action];
  if (!entry) notFound();
  const { metric, action: a } = entry;

  const t = await getTranslations({ locale });
  const tc = await getTranslations({ locale, namespace: 'compare' });
  const label = t(`actions.${action}`);
  const costStr = formatCompact(promptsForAction(a.value, metric), locale);
  const source = SOURCE_BY_ID[a.sourceId];
  const per = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(PER[metric]);
  const unit = METRIC_BY_ID[metric].unit;
  const related = ACTIONS[metric].filter((x) => x.id !== action).slice(0, 6);

  return (
    <PageShell title={tc('h1', { label, cost: costStr })}>
      <p className="text-base leading-relaxed text-muted">
        {tc('lead', { label, cost: costStr, metric: tc(`metric.${metric}`), per, unit })}
      </p>

      <div className="mt-6 flex items-center gap-4 rounded-3xl border border-line bg-surface p-6">
        <span className="text-5xl" aria-hidden>
          {a.emoji}
        </span>
        <div>
          <div className="num text-4xl font-extrabold text-accent">{costStr}</div>
          <div className="text-sm font-bold text-muted">{tc('unit')}</div>
        </div>
      </div>

      {source && (
        <p className="mt-3 text-xs text-muted">
          {t('common.source')} :{' '}
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              {source.label}
            </a>
          ) : (
            source.label
          )}
        </p>
      )}

      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-base font-bold text-on-accent transition-transform active:scale-95"
      >
        {tc('cta')}
        <ArrowRight size={18} />
      </Link>

      <h2 className="mb-3 mt-10 text-sm font-bold uppercase tracking-wider text-muted">
        {tc('related')}
      </h2>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {related.map((r) => (
          <li key={r.id}>
            <Link
              href={`/combien/${r.id}`}
              className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-3 text-sm font-semibold transition-colors hover:border-accent"
            >
              <span className="text-xl" aria-hidden>
                {r.emoji}
              </span>
              <span className="truncate">{t(`actions.${r.id}`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
