import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const ACCENTS: Record<string, string> = {
  elec: '#f5a623',
  water: '#2f9bff',
  co2: '#16a34a',
};
const EMOJIS: Record<string, string> = { elec: '⚡', water: '💧', co2: '🌍' };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const years = searchParams.get('years') ?? '12';
  const count = searchParams.get('count') ?? '7';
  const metric = searchParams.get('metric') ?? 'elec';
  const scale = searchParams.get('scale') ?? '';
  const fr = (searchParams.get('lang') ?? 'fr').startsWith('fr');

  const accent = ACCENTS[metric] ?? ACCENTS.elec;
  const emoji = EMOJIS[metric] ?? EMOJIS.elec;

  const mid = fr
    ? `ans d'IA en ${count} gestes du quotidien`
    : `years of AI in ${count} everyday actions`;
  const scaleLine = scale
    ? fr
      ? `à l'échelle : ${scale}`
      : `scale: ${scale}`
    : '';
  const tagline = fr
    ? 'Combien coûte vraiment 1 prompt IA ?'
    : 'How much does 1 AI prompt really cost?';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#090b10',
          color: '#edf0f5',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 56 }}>{emoji}</span>
          <span style={{ color: '#94a3b8', fontWeight: 700 }}>PromptCost</span>
          {scaleLine ? (
            <span style={{ fontSize: 26, color: accent, fontWeight: 700 }}>· {scaleLine}</span>
          ) : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 24 }}>
          <span style={{ fontSize: 200, fontWeight: 800, color: accent, lineHeight: 1 }}>
            {`${years}×`}
          </span>
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, marginTop: 16, display: 'flex' }}>
          {mid}
        </div>
        <div style={{ fontSize: 30, color: '#94a3b8', marginTop: 8, display: 'flex' }}>
          {tagline}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
