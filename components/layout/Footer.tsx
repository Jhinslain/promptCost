import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SiteFootprint } from '../ui/SiteFootprint';

export function Footer() {
  const t = useTranslations();

  const links = [
    { href: '/combien', label: t('footer.compare') },
    { href: '/glossaire', label: t('footer.glossary') },
    { href: '/comparatif', label: t('footer.comparatif') },
    { href: '/sources', label: t('footer.sources') },
    { href: '/methodologie', label: t('footer.methodologie') },
    { href: '/a-propos', label: t('footer.apropos') },
    { href: '/mentions-legales', label: t('footer.legal') },
  ] as const;

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-app px-4 py-10">
        {/* Marque : logo (clair/sombre selon le thème) */}
        <Link href="/" className="inline-flex" aria-label={t('site.name')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt={t('site.name')}
            width={200}
            height={50}
            className="h-9 w-auto dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-dark.svg"
            alt=""
            aria-hidden
            width={200}
            height={50}
            className="hidden h-9 w-auto dark:block"
          />
        </Link>

        <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-accent">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex justify-center">
          <SiteFootprint />
        </div>
      </div>
    </footer>
  );
}
