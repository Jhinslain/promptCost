import type { Metadata } from 'next';
import { Fragment } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { formatInt } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

/** Maillage interne : liens vers les pages de référence du site. */
const LINKS = [
  { href: '/sources', key: 'sources' },
  { href: '/methodologie', key: 'methodologie' },
  { href: '/glossaire', key: 'glossaire' },
  { href: '/comparatif', key: 'comparatif' },
  { href: '/combien', key: 'combien' },
] as const;

const FLOW = ['s1', 's2', 's3', 's4'] as const;

/** Barres de mise en perspective (électricité, en Wh). Échelle racine pour rester lisible. */
const BARS = [
  { key: 'prompt', wh: 0.3 },
  { key: 'kettle', wh: 22 },
  { key: 'vacuum', wh: 90 },
  { key: 'oven', wh: 2100 },
] as const;
const MAX_WH = 2100;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.apropos' });
  return buildMetadata({
    locale,
    path: '/a-propos',
    title: t('title'),
    description: t('description'),
  });
}

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'apropos' });

  return (
    <PageShell title={t('title')} intro={t('lead')}>
      <div className="flex flex-col gap-10">
        {/* Notre but */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-extrabold tracking-tight text-text">{t('purposeTitle')}</h2>
          <p className="text-base leading-relaxed text-muted">{t('purpose1')}</p>
          <p className="text-base leading-relaxed text-muted">{t('purpose2')}</p>
        </section>

        {/* D'où viennent les chiffres */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-extrabold tracking-tight text-text">{t('dataTitle')}</h2>
          <p className="text-base leading-relaxed text-muted">{t('data1')}</p>
          <p className="text-base leading-relaxed text-muted">{t('data2')}</p>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            {FLOW.map((s, i) => (
              <Fragment key={s}>
                {i > 0 && (
                  <div className="flex items-center justify-center text-accent" aria-hidden>
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

        {/* Mettre un prompt en perspective */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-extrabold tracking-tight text-text">
            {t('perspectiveTitle')}
          </h2>
          <p className="text-base leading-relaxed text-muted">{t('perspective1')}</p>

          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted">
              {t('chart.title')}
            </div>
            <ul className="mt-3 flex flex-col gap-2.5">
              {BARS.map((b) => {
                const w = Math.max(2, Math.sqrt(b.wh / MAX_WH) * 100);
                const mult = Math.round(b.wh / 0.3);
                return (
                  <li key={b.key} className="flex items-center gap-3 text-sm">
                    <span className="w-24 shrink-0 font-semibold text-text sm:w-32">
                      {t(`chart.${b.key}`)}
                    </span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-line/60">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${w}%` }} />
                    </div>
                    <span className="num w-24 shrink-0 text-right text-xs font-bold text-muted sm:w-28">
                      {b.key === 'prompt'
                        ? t('chart.google')
                        : `${formatInt(b.wh, locale)} Wh · ~${formatInt(mult, locale)}×`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="text-base leading-relaxed text-muted">{t('perspective2')}</p>
        </section>

        {/* Le débat : deux lectures */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-extrabold tracking-tight text-text">{t('debateTitle')}</h2>
          <p className="text-base leading-relaxed text-muted">{t('debateIntro')}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                🟢 {t('campGreen')}
              </div>
              <ul className="mt-2.5 flex flex-col gap-2 text-sm leading-relaxed text-muted">
                {['green1', 'green2', 'green3', 'green4'].map((k) => (
                  <li key={k} className="flex gap-2">
                    <span className="text-emerald-500" aria-hidden>
                      •
                    </span>
                    {t(k)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                🟠 {t('campOrange')}
              </div>
              <ul className="mt-2.5 flex flex-col gap-2 text-sm leading-relaxed text-muted">
                {['orange1', 'orange2', 'orange3', 'orange4'].map((k) => (
                  <li key={k} className="flex gap-2">
                    <span className="text-amber-500" aria-hidden>
                      •
                    </span>
                    {t(k)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* IA et emploi */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-extrabold tracking-tight text-text">{t('jobsTitle')}</h2>
          <p className="text-base leading-relaxed text-muted">{t('jobs1')}</p>
        </section>

        {/* Notre position */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-extrabold tracking-tight text-text">{t('positionTitle')}</h2>
          <p className="rounded-2xl border-l-2 border-accent bg-accent-soft/40 p-4 text-base font-semibold leading-relaxed text-text">
            {t('position1')}
          </p>
        </section>

        {/* Transparence */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-extrabold tracking-tight text-text">
            {t('transparencyTitle')}
          </h2>
          <p className="text-base leading-relaxed text-muted">{t('transparency1')}</p>
        </section>

        {/* Maillage interne */}
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
                  <ArrowRight size={16} className="shrink-0 text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
