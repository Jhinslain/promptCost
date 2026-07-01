import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { ACTIONS, METRIC_BY_ID, type MetricId } from '@/lib/data';
import { promptsForAction } from '@/lib/convert';
import { formatCompact } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

const METRICS: MetricId[] = ['elec', 'water', 'co2'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tc = await getTranslations({ locale, namespace: 'compare' });
  return buildMetadata({
    locale,
    path: '/combien',
    title: tc('metaIndexTitle'),
    description: tc('metaIndexDescription'),
  });
}

export default async function CombienIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const tc = await getTranslations({ locale, namespace: 'compare' });

  return (
    <PageShell title={tc('indexTitle')} intro={tc('indexIntro')}>
      {METRICS.map((m) => {
        const rows = [...ACTIONS[m]].sort(
          (x, y) => promptsForAction(x.value, m) - promptsForAction(y.value, m),
        );
        return (
          <section key={m} className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted">
              <span aria-hidden>{METRIC_BY_ID[m].emoji}</span>
              {tc(`metric.${m}`)}
            </h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {rows.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/combien/${a.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 transition-colors hover:border-accent"
                  >
                    <span className="text-2xl" aria-hidden>
                      {a.emoji}
                    </span>
                    <span className="flex-1 truncate text-sm font-semibold text-text">
                      {t(`actions.${a.id}`)}
                    </span>
                    <span className="num shrink-0 text-sm font-extrabold text-accent">
                      {formatCompact(promptsForAction(a.value, m), locale)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </PageShell>
  );
}
