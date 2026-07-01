import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { ACTION_BY_ID } from '@/lib/data';
import { COMPARISONS } from '@/lib/comparisons';

const SITE_URL = 'https://www.howmanyprompts.com';

const PATHS = [
  '',
  '/convertir',
  '/combien',
  '/glossaire',
  '/comparatif',
  '/sources',
  '/methodologie',
  '/a-propos',
  '/feedback',
  '/mentions-legales',
  ...COMPARISONS.map((c) => `/comparatif/${c.slug}`),
  ...Object.keys(ACTION_BY_ID).map((id) => `/combien/${id}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PATHS) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date('2026-06-30'),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
  }

  return entries;
}
