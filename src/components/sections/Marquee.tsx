/* 2. Bandeau défilant : certifications, zones, années. Bande sable à bords
   irréguliers ; vitesse constante, pause au survol. */
import { useRef } from 'react';
import { ANNEES_EXPERIENCE, CERTIFICATIONS, ZONE_INTERVENTION, NB_CHANTIERS } from '@/config/site.config';
import { gsap } from '@/lib/motion';
import { useMotion } from '@/hooks/useMotion';

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const items = [
    `${ANNEES_EXPERIENCE} ans de métier`,
    ...CERTIFICATIONS,
    ZONE_INTERVENTION,
    `${NB_CHANTIERS.toLocaleString('fr-FR')} chantiers`,
    'Devis sous 48 h',
  ];
  useMotion(({ reduced }) => {
    if (reduced) return;
    const track = ref.current!.querySelector<HTMLElement>('.track')!;
    const tween = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
    const el = ref.current!;
    const slow = () => gsap.to(tween, { timeScale: 0.15, duration: 0.6, ease: 'out-quart' });
    const fast = () => gsap.to(tween, { timeScale: 1, duration: 0.8, ease: 'out-quart' });
    el.addEventListener('pointerenter', slow);
    el.addEventListener('pointerleave', fast);
    return () => { el.removeEventListener('pointerenter', slow); el.removeEventListener('pointerleave', fast); };
  }, [], ref);

  return (
    <div ref={ref} className="torn-alt relative -mt-px overflow-hidden bg-surface-deep py-5" aria-label="Certifications et zones desservies">
      <div className="track flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map((k) => (
          <ul key={k} className="flex items-center" aria-hidden={k === 1}>
            {items.map((it, i) => (
              <li key={i} className="flex items-center gap-8 pr-8 font-display text-md text-ink">
                <span>{it}</span>
                <span className="block h-1.5 w-1.5 rotate-45 bg-ochre" aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
