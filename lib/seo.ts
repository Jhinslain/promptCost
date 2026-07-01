import type { Metadata } from 'next';

export const SITE_URL = 'https://www.howmanyprompts.com';

/** Sérialise un objet JSON-LD en échappant `<` pour ne jamais casser la balise
 *  `</script>` (défense en profondeur, même si l'entrée est maîtrisée). */
export const jsonLdScript = (obj: unknown): string =>
  JSON.stringify(obj).replace(/</g, '\\u003c');

/**
 * Métadonnées d'une page : titre, description, canonical + hreflang, et carte
 * OpenGraph/Twitter localisée (image `/api/og` dans la bonne langue).
 * `ogQuery` : paramètres OG supplémentaires (ex. `metric=elec`) pour une carte
 * de partage différenciée par page.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  ogQuery,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  ogQuery?: Record<string, string>;
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const params = new URLSearchParams({ lang: locale, ...ogQuery });
  const og = `/api/og?${params.toString()}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        fr: `/fr${path}`,
        en: `/en${path}`,
        'x-default': `/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'HowManyPrompts',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: og, alt: title }],
    },
  };
}
