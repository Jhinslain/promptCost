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
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-3 focus-visible:z-[60] focus-visible:rounded-lg focus-visible:bg-accent focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-bold focus-visible:text-on-accent focus-visible:shadow-lg"
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
