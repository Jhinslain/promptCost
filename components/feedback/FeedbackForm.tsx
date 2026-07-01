'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Send, CheckCircle2, AlertTriangle, MessageSquare, Plus, Newspaper } from 'lucide-react';

/** Types de retour (doit rester en phase avec app/api/feedback/route.ts). */
const TYPES = [
  { key: 'avis', Icon: MessageSquare },
  { key: 'erreur', Icon: AlertTriangle },
  { key: 'geste', Icon: Plus },
  { key: 'presse', Icon: Newspaper },
  { key: 'autre', Icon: MessageSquare },
] as const;

type Status = 'idle' | 'sending' | 'success' | 'error';

export function FeedbackForm() {
  const t = useTranslations('feedback');
  const locale = useLocale();

  const [type, setType] = useState<(typeof TYPES)[number]['key']>('avis');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = message.trim().length >= 2 && emailValid;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending' || !canSubmit) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, email, website, locale }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      setStatus(res.ok && data.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <CheckCircle2 className="text-emerald-500" size={40} />
        <h2 className="text-lg font-extrabold text-text">{t('successTitle')}</h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* Sélecteur de type */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-bold text-text">{t('typeLabel')}</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(({ key, Icon }) => {
            const active = type === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setType(key)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-accent bg-accent-soft/60 text-text'
                    : 'border-line bg-surface text-muted hover:border-accent'
                }`}
              >
                <Icon size={16} className={active ? 'text-accent-text' : 'text-muted'} aria-hidden />
                {t(`types.${key}`)}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Message */}
      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold text-text">{t('messageLabel')}</span>
        <textarea
          required
          minLength={2}
          maxLength={4000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('messagePlaceholder')}
          className="resize-y rounded-2xl border border-line bg-surface p-4 text-base text-text outline-none transition-colors placeholder:text-muted/70 focus:border-accent"
        />
      </label>

      {/* Email obligatoire */}
      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold text-text">{t('emailLabel')}</span>
        <input
          type="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          aria-required="true"
          className="rounded-2xl border border-line bg-surface p-4 text-base text-text outline-none transition-colors placeholder:text-muted/70 focus:border-accent"
        />
        <span className="text-xs text-muted">{t('emailHint')}</span>
      </label>

      {/* Honeypot : masqué aux humains, piège à bots. */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {status === 'error' && (
        <p className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertTriangle size={16} aria-hidden />
          {t('error')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !canSubmit}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-bold text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send size={16} aria-hidden />
        {status === 'sending' ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
