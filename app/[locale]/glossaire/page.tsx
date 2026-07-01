import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { buildMetadata, jsonLdScript, SITE_URL } from '@/lib/seo';

/** Termes regroupés par thème ; l'ordre suit glossaire.md. */
const GROUPS = [
  {
    cat: 'ai',
    terms: [
      'generativeAI',
      'llm',
      'prompt',
      'token',
      'inference',
      'training',
      'hallucination',
      'contextWindow',
      'parameters',
      'multimodal',
      'agent',
      'reasoning',
      'imageVideo',
    ],
  },
  { cat: 'energy', terms: ['wh', 'kwh', 'datacenter', 'gpu', 'pue', 'twh'] },
  { cat: 'water', terms: ['virtualWater', 'directWater', 'wue', 'waterStress'] },
  { cat: 'climate', terms: ['co2e', 'radiative', 'gridIntensity', 'lca', 'scopes'] },
  { cat: 'reading', terms: ['orderMagnitude', 'medianRange'] },
] as const;

const ALL_TERMS = GROUPS.flatMap((g) => g.terms);

/** Maillage interne. */
const LINKS = [
  { href: '/', key: 'game' },
  { href: '/combien', key: 'combien' },
  { href: '/sources', key: 'sources' },
  { href: '/a-propos', key: 'apropos' },
] as const;

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

  // JSON-LD DefinedTermSet : chaque terme cible une requête « c'est quoi… ».
  const glossaryUrl = `${SITE_URL}/${locale}/glossaire`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: tg('title'),
    url: glossaryUrl,
    inLanguage: locale,
    hasDefinedTerm: ALL_TERMS.map((k) => ({
      '@type': 'DefinedTerm',
      '@id': `${glossaryUrl}#${k}`,
      name: tg(`terms.${k}.term`),
      description: tg(`terms.${k}.def`),
    })),
  };

  return (
    <PageShell title={tg('title')} intro={tg('intro')}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      {/* Navigation par thème (ancres) */}
      <nav className="flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <a
            key={g.cat}
            href={`#${g.cat}`}
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {tg(`cat.${g.cat}`)}
          </a>
        ))}
      </nav>

      <div className="mt-8 flex flex-col gap-10">
        {GROUPS.map((g) => (
          <section key={g.cat} id={g.cat} className="scroll-mt-20">
            <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-text">
              <span className="h-4 w-1 rounded-full bg-accent" aria-hidden />
              {tg(`cat.${g.cat}`)}
            </h2>
            <dl className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {g.terms.map((k) => (
                <div
                  key={k}
                  id={k}
                  className="group scroll-mt-20 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/60"
                >
                  <dt className="flex items-baseline gap-1.5 font-bold text-text">
                    <a
                      href={`#${k}`}
                      className="text-line opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    >
                      #
                    </a>
                    {tg(`terms.${k}.term`)}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    {tg(`terms.${k}.def`)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted">{tg('outro')}</p>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">
          {tg('moreTitle')}
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 text-sm font-semibold text-text transition-colors hover:border-accent"
              >
                <span>{tg(`links.${l.key}`)}</span>
                <ArrowRight size={16} className="shrink-0 text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
