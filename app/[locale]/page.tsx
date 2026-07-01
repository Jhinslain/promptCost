import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Game } from '@/components/game/Game';
import { FeedbackCTA } from '@/components/feedback/FeedbackCTA';
import { jsonLdScript, SITE_URL } from '@/lib/seo';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  const tn = await getTranslations({ locale, namespace: 'nav' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'HowManyPrompts',
    url: `${SITE_URL}/${locale}`,
    '@id': `${SITE_URL}/#webapp`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    inLanguage: locale,
    description: t('description'),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:font-bold focus:text-on-accent"
      >
        {tn('skip')}
      </a>
      <Header />
      <main id="main">
        <Game mode="spend" />
        <div className="mx-auto mt-10 max-w-app px-4">
          <FeedbackCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
