import FR from 'country-flag-icons/react/3x2/FR';
import GB from 'country-flag-icons/react/3x2/GB';
import US from 'country-flag-icons/react/3x2/US';

const MAP = { fr: FR, gb: GB, us: US } as const;

/**
 * Drapeau en SVG (les emoji drapeaux ne s'affichent pas sur Windows).
 * `region` : 'fr' | 'gb' | 'us'.
 */
export function Flag({
  region,
  className = 'h-3.5 w-auto rounded-[2px]',
}: {
  region: 'fr' | 'gb' | 'us';
  className?: string;
}) {
  const C = MAP[region];
  return <C className={className} />;
}
