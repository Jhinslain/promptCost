import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18n = createMiddleware(routing);

// Pays détecté (Vercel) → pays de référence des échelles ville/pays.
const COUNTRY_TO_REGION: Record<string, string> = { FR: 'fr', GB: 'gb', US: 'us' };

export default function middleware(req: NextRequest) {
  const res = handleI18n(req);
  const country = req.headers.get('x-vercel-ip-country');
  const region = country ? COUNTRY_TO_REGION[country] : undefined;
  if (region) {
    // Lu côté client pour choisir Paris/France, Londres/RU ou New York/USA.
    res.cookies.set('pc-region', region, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  }
  return res;
}

export const config = {
  // Match all paths except API, Next internals, and files with an extension.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
