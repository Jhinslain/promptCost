import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Le home dir de l'utilisateur contient un package-lock.json parasite :
  // on ancre la racine de tracing sur ce projet.
  outputFileTracingRoot: import.meta.dirname,
};

export default withNextIntl(nextConfig);
