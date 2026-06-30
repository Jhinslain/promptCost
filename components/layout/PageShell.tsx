import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';

export function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations('common');

  return (
    <>
      <Header />
      <main className="mx-auto max-w-app px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          {t('back')}
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {intro && <p className="mt-3 text-base leading-relaxed text-muted">{intro}</p>}

        <div className="mt-8">{children}</div>
      </main>
      <Footer />
    </>
  );
}
