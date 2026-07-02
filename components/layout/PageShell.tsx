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
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-accent focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-bold focus-visible:text-on-accent"
      >
        {t('skip')}
      </a>
      <Navbar />
      <main id="main" className="mx-auto max-w-app overflow-x-clip px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {intro && <p className="mt-3 text-base leading-relaxed text-muted">{intro}</p>}

        <div className="mt-8">{children}</div>
      </main>
      <Footer />
    </>
  );
}
