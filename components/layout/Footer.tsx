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
        {/* Marque (déménagée depuis l'ancienne navbar) */}
        <Link href="/" className="inline-flex items-center gap-2 font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent-soft text-lg">
            ⚡
          </span>
          <span className="text-lg">{t('site.name')}</span>
        </Link>
        <p className="mt-1.5 text-sm font-semibold text-muted">{t('site.tagline')}</p>

        <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-accent">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6">
          <SiteFootprint />
        </div>
        <p className="mt-4 text-xs text-muted">{t('footer.disclaimer')}</p>
      </div>
    </footer>
  );
}
