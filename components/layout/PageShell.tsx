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
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-app px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {intro && <p className="mt-3 text-base leading-relaxed text-muted">{intro}</p>}

        <div className="mt-8">{children}</div>
      </main>
      <Footer />
    </>
  );
}
