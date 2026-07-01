import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Détection de langue + préfixe de locale (les échelles ne dépendent plus
// de la géo : elles reposent sur l'usage réel de l'IA, cf. lib/scales.ts).
const handleI18n = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const res = handleI18n(req);
  // Les domaines de preview *.vercel.app ne doivent pas être indexés (sinon le
  // canonical pointe vers howmanyprompts.com → incohérence + contenu dupliqué).
  const host = req.headers.get('host') ?? '';
  if (host.endsWith('.vercel.app')) {
    res.headers.set('x-robots-tag', 'noindex, nofollow');
  }
  return res;
}

export const config = {
  // Match all paths except API, Next internals, and files with an extension.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
