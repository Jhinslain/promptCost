import { useTranslations } from 'next-intl';
import { Navbar } from './Navbar';
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
  const t = useTranslations('nav');

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:font-bold focus:text-on-accent"
      >
        {t('skip')}
      </a>
      <Navbar />
      <main id="main" className="mx-auto max-w-app px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {intro && <p className="mt-3 text-base leading-relaxed text-muted">{intro}</p>}

        <div className="mt-8">{children}</div>
      </main>
      <Footer />
    </>
  );
}
