import { useTranslations } from 'next-intl';
import { MessageSquarePlus, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

/**
 * CTA discret « Un avis ? Une erreur ? » vers la page feedback.
 * À placer sous le jeu et sur les pages de données.
 */
export function FeedbackCTA() {
  const t = useTranslations('feedback');
  return (
    <div className="flex justify-center">
      <Link
        href="/feedback"
        className="group flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-accent hover:text-text"
      >
        <MessageSquarePlus size={16} className="text-accent-text" aria-hidden />
        <span>{t('cta.text')}</span>
        <ArrowRight
          size={14}
          className="text-accent-text transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </div>
  );
}
