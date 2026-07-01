import { NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Réception des feedbacks du site : sélecteur de type + message + email
 * optionnel. Envoi par Resend vers l'adresse de contact, avec reply-to sur
 * l'email du visiteur pour pouvoir répondre directement.
 *
 * Anti-spam léger : honeypot (champ `website` masqué) + limite de débit en
 * mémoire par IP. Pas de captcha.
 */

// Adresses configurables via l'environnement, avec valeurs par défaut.
const TO = process.env.FEEDBACK_TO ?? 'contact@ghis.fr';
const FROM = process.env.FEEDBACK_FROM ?? 'HowManyPrompts <feedback@ghis.fr>';

// Types de retour acceptés (doit rester en phase avec le formulaire client).
const TYPES = ['avis', 'erreur', 'geste', 'presse', 'autre'] as const;
type FeedbackType = (typeof TYPES)[number];

const TYPE_LABELS: Record<FeedbackType, string> = {
  avis: '💬 Avis',
  erreur: '⚠️ Erreur dans un chiffre',
  geste: '➕ Suggestion de geste',
  presse: '📰 Presse',
  autre: 'Autre',
};

const MAX_MESSAGE = 4000;
const MAX_EMAIL = 254;

// Limite de débit : 5 envois par IP sur 10 minutes. En mémoire du process
// (suffisant pour un anti-spam léger ; réinitialisé à chaque redéploiement).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// Validation e-mail volontairement permissive : on ne bloque qu'un format
// manifestement invalide (l'email est de toute façon optionnel).
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_EMAIL;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const website = typeof body.website === 'string' ? body.website : '';
  // Honeypot rempli => bot. On répond « ok » sans rien envoyer.
  if (website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const type = String(body.type ?? '') as FeedbackType;
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const locale = body.locale === 'en' ? 'en' : 'fr';

  if (!TYPES.includes(type)) {
    return NextResponse.json({ ok: false, error: 'invalid_type' }, { status: 400 });
  }
  if (message.length < 2 || message.length > MAX_MESSAGE) {
    return NextResponse.json({ ok: false, error: 'invalid_message' }, { status: 400 });
  }
  if (email !== '' && !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[feedback] RESEND_API_KEY manquante');
    return NextResponse.json({ ok: false, error: 'server_config' }, { status: 500 });
  }

  const label = TYPE_LABELS[type];
  const subject = `[Feedback] ${label}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.5">
      <p><strong>Type&nbsp;:</strong> ${esc(label)}</p>
      <p><strong>Langue&nbsp;:</strong> ${locale}</p>
      <p><strong>Email&nbsp;:</strong> ${email ? esc(email) : '(non fourni)'}</p>
      <hr />
      <p style="white-space:pre-wrap">${esc(message)}</p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject,
      html,
      // Permet de répondre directement au visiteur depuis sa boîte mail.
      ...(email ? { replyTo: email } : {}),
    });
    if (error) {
      console.error('[feedback] Resend error', error);
      return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
    }
  } catch (err) {
    console.error('[feedback] send exception', err);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
