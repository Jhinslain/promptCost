'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Share2, X, Check, Download } from 'lucide-react';
import { formatCompact, formatYears } from '@/lib/format';
import { METRICS, type MetricId } from '@/lib/data';
import { SCALES } from '@/lib/scales';
import { useGame } from '@/lib/store';

interface ResultCardProps {
  open: boolean;
  metric: MetricId;
  scaleId: string;
  spent: number;
  years: number;
  count: number;
  scaleLabel: string;
  factKey: string;
  onClose: () => void;
}

export function ResultCard({
  open,
  metric,
  scaleId,
  spent,
  years,
  count,
  scaleLabel,
  factKey,
  onClose,
}: ResultCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const setScale = useGame((s) => s.setScale);
  const setMetric = useGame((s) => s.setMetric);

  // Dialogue accessible : Échap ferme, focus déplacé dans la modale à l'ouverture
  // et restauré sur le déclencheur à la fermeture.
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  const yearsStr = formatYears(years, locale);
  // Ce qu'on a « payé » = l'usage annuel d'IA de l'échelle choisie.
  const phrase = t(`scale.spent.${scaleId}`);

  /** URLs construites au clic (accès à window côté client). */
  function links() {
    const origin = window.location.origin;
    const pageUrl = `${origin}/${locale}`;
    const text = t('result.shareText', { phrase, count: formatCompact(count, locale) });
    const og =
      `${origin}/api/og?years=${encodeURIComponent(yearsStr)}&count=${count}` +
      `&metric=${metric}&lang=${locale}&scale=${encodeURIComponent(scaleLabel)}`;
    return { pageUrl, text, og };
  }

  async function share() {
    const { pageUrl, text } = links();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: t('site.name'), text, url: pageUrl });
        return;
      } catch {
        /* annulé → fallback */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${pageUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function openNetwork(net: 'x' | 'whatsapp' | 'linkedin') {
    const { pageUrl, text } = links();
    const e = encodeURIComponent;
    const urls: Record<typeof net, string> = {
      x: `https://twitter.com/intent/tweet?text=${e(text)}&url=${e(pageUrl)}`,
      whatsapp: `https://wa.me/?text=${e(`${text} ${pageUrl}`)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${e(pageUrl)}`,
    };
    window.open(urls[net], '_blank', 'noopener,noreferrer');
  }

  async function downloadImage() {
    try {
      const { og } = links();
      const res = await fetch(og);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = 'howmanyprompts.png';
      a.click();
      URL.revokeObjectURL(href);
    } catch {
      /* ignore */
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-title"
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-t-3xl border border-line bg-surface p-6 pb-8 sm:rounded-3xl"
            initial={reduced ? { opacity: 0 } : { y: '100%', opacity: 0.5 }}
            animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: '100%', opacity: 0 }}
            transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="accent-glow pointer-events-none absolute inset-x-0 top-0 h-40" />

            <button
              ref={closeRef}
              onClick={onClose}
              aria-label={t('common.back')}
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-line bg-bg text-muted transition-colors hover:text-text"
            >
              <X size={18} />
            </button>

            <div className="relative">
              <div
                id="result-title"
                className="text-xs font-bold uppercase tracking-wider text-accent-text"
              >
                {t('result.title')}
              </div>

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 18 }}
                className="num mt-3 text-5xl font-extrabold leading-none text-accent-text sm:text-6xl"
              >
                {formatCompact(spent, locale)}
                <span className="ml-2 text-lg font-bold text-muted">
                  {t('total.promptsSuffix')}
                </span>
              </motion.div>

              <p className="mt-3 text-lg font-bold leading-snug text-text">
                {t('result.headline', { phrase })}
              </p>
              <p className="mt-1 text-sm font-semibold text-muted">
                {t('result.inActions', { count: formatCompact(count, locale) })}
              </p>

              <div className="mt-5 rounded-2xl border border-line bg-bg p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-muted">
                  {t('result.didYouKnow')}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-text">{t(factKey)}</p>
              </div>

              {/* Rejouer : une autre échelle ou une autre ressource */}
              <div className="mt-5 border-t border-line pt-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  {t('result.tryScale')}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SCALES.filter((s) => s.id !== scaleId).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setScale(s.id);
                        onClose();
                      }}
                      className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-bold text-text transition-colors hover:border-accent hover:text-accent-text"
                    >
                      {t(`scale.${s.id}`)}
                    </button>
                  ))}
                </div>
                <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-muted">
                  {t('result.tryMetric')}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {METRICS.filter((m) => m.id !== metric).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setMetric(m.id);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-bold text-text transition-colors hover:border-accent hover:text-accent-text"
                    >
                      <span aria-hidden>{m.emoji}</span>
                      {t(`metric.${m.id}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={share}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-accent text-base font-bold text-on-accent transition-transform active:scale-95"
                >
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                  {copied ? t('result.copied') : t('result.share')}
                </button>

                <div className="grid grid-cols-3 gap-2">
                  {(['x', 'whatsapp', 'linkedin'] as const).map((net) => (
                    <button
                      key={net}
                      onClick={() => openNetwork(net)}
                      className="flex h-10 items-center justify-center rounded-xl border border-line bg-surface text-sm font-bold text-text transition-colors hover:border-accent"
                    >
                      {net === 'x' ? 'X' : net === 'whatsapp' ? 'WhatsApp' : 'LinkedIn'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={downloadImage}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-line bg-surface text-sm font-bold text-text transition-colors hover:border-accent"
                >
                  <Download size={16} />
                  {t('result.downloadImage')}
                </button>

                <button
                  onClick={onClose}
                  className="flex h-11 items-center justify-center rounded-2xl text-sm font-bold text-muted transition-colors hover:text-text"
                >
                  {t('result.continue')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
