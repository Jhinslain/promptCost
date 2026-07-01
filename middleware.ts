import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Détection de langue + préfixe de locale (les échelles ne dépendent plus
// de la géo : elles reposent sur l'usage réel de l'IA, cf. lib/scales.ts).
export default createMiddleware(routing);

export const config = {
  // Match all paths except API, Next internals, and files with an extension.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
