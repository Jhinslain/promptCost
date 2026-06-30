import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Footer() {
  const t = useTranslations('footer');

  const links = [
    { href: '/comparatif', label: t('comparatif') },
    { href: '/sources', label: t('sources') },
    { href: '/methodologie', label: t('methodologie') },
    { href: '/a-propos', label: t('apropos') },
    { href: '/mentions-legales', label: t('legal') },
  ] as const;

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-app px-4 py-10">
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-accent">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="mt-6 text-xs text-muted">{t('disclaimer')}</p>
        <p className="mt-1 text-xs text-muted">
          <a
            href="https://majoli.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold transition-colors hover:text-accent"
          >
            {t('by')}
          </a>
        </p>
      </div>
    </footer>
  );
}
