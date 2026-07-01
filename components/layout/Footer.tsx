import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SiteFootprint } from '../ui/SiteFootprint';

export function Footer() {
  const t = useTranslations();

  // Colonne « utiles » (contenu) et colonne « société » (à propos, légal, contact).
  const useful = [
    { href: '/comparatif', label: t('footer.comparatif') },
    { href: '/combien', label: t('footer.compare') },
    { href: '/glossaire', label: t('footer.glossary') },
    { href: '/methodologie', label: t('footer.methodologie') },
    { href: '/sources', label: t('footer.sources') },
  ] as const;
  const society = [
    { href: '/a-propos', label: t('footer.apropos') },
    { href: '/feedback', label: t('footer.feedback') },
    { href: '/mentions-legales', label: t('footer.legal') },
  ] as const;

  const Column = ({
    title,
    items,
  }: {
    title: string;
    items: readonly { href: string; label: string }[];
  }) => (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted">{title}</h3>
      <nav className="mt-3 flex flex-col gap-2 text-sm font-semibold text-muted">
        {items.map((l) => (
          <Link key={l.href} href={l.href} className="transition-colors hover:text-accent-text">
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-app flex-col items-center px-4 py-10 text-center">
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

        <div className="mt-6 grid grid-cols-2 gap-10">
          <Column title={t('footer.colUseful')} items={useful} />
          <Column title={t('footer.colSociety')} items={society} />
        </div>

        <div className="mt-8">
          <SiteFootprint />
        </div>
      </div>
    </footer>
  );
}
