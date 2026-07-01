import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Game } from '@/components/game/Game';

const SITE_URL = 'https://howmanyprompts.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.convertir' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/convertir`,
      languages: {
        fr: '/fr/convertir',
        en: '/en/convertir',
        'x-default': '/en/convertir',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}/convertir`,
      siteName: 'HowManyPrompts',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      images: [{ url: `/api/og?lang=${locale}`, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/api/og?lang=${locale}`],
    },
  };
}

export default async function ConvertirPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <Game mode="reverse" />
      </main>
      <Footer />
    </>
  );
}
