import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { FeedbackCTA } from '@/components/feedback/FeedbackCTA';
import { VersusBlock } from '@/components/comparatif/VersusBlock';
import { COMPARISONS } from '@/lib/comparisons';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.comparatif' });
  return buildMetadata({
    locale,
    path: '/comparatif',
    title: t('title'),
    description: t('description'),
  });
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
      <ul className="grid gap-4 sm:grid-cols-2">
        {COMPARISONS.map((c) => (
          <li key={c.slug} className="min-w-0">
            <Link
              href={`/comparatif/${c.slug}`}
              className="group flex h-full min-w-0 flex-col rounded-3xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
            >
              <h2 className="text-base font-extrabold leading-tight text-text">
                {t(`cases.${c.slug}.title`)}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {t(`cases.${c.slug}.short`)}
              </p>
              <div className="mt-4">
                <VersusBlock
                  metric={c.metric}
                  left={{ ...c.left, label: t(`cases.${c.slug}.leftLabel`) }}
                  right={{ ...c.right, label: t(`cases.${c.slug}.rightLabel`) }}
                />
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-accent-text">
                {t('learnMore')}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Bonus : renvoi vers le jeu */}
      <div className="mt-6 flex flex-col items-start gap-3 rounded-3xl border border-accent/30 bg-accent-soft/40 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-extrabold text-text">{t('bonusTitle')}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{t('bonusText')}</p>
        </div>
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-on-accent transition-transform active:scale-95"
        >
          <Gamepad2 size={16} />
          {t('bonusCta')}
        </Link>
      </div>
      <div className="mt-12">
        <FeedbackCTA />
      </div>
    </PageShell>
  );
}
