import type { Metadata } from 'next';

export const SITE_URL = 'https://howmanyprompts.com';

/**
 * Métadonnées d'une page : titre, description, canonical + hreflang, et carte
 * OpenGraph/Twitter localisée (image `/api/og` dans la bonne langue).
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const og = `/api/og?lang=${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        fr: `/fr${path}`,
        en: `/en${path}`,
        'x-default': `/fr${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'HowManyPrompts',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [og],
    },
  };
}
