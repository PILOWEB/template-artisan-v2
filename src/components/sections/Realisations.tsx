/* 5. Réalisations : galerie asymétrique, chaque chantier en avant/après. */
import { useRef } from 'react';
import { REALISATIONS } from '@/data/content';
import { BeforeAfter } from '@/components/ui/BeforeAfter';
import { SplitReveal } from '@/components/ui/SplitReveal';
import { gsap } from '@/lib/motion';
import { useMotion } from '@/hooks/useMotion';

const LAYOUT: Record<'large' | 'small' | 'medium', string> = {
  large: 'md:col-span-8 md:col-start-1',
  small: 'md:col-span-4',
  medium: 'md:col-span-8 md:col-start-3',
};

export function Realisations() {
  const ref = useRef<HTMLElement>(null);
  useMotion(({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(ref);
    q('.chantier').forEach((el) => {
      gsap.fromTo(el, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'out-expo', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }, [], ref);

  return (
    <section ref={ref} id="realisations" className="container-grid relative py-24 md:py-40" aria-labelledby="realisations-title">
      <div className="col-span-12 md:col-span-6 md:col-start-6" data-thread>
        <p className="eyebrow mb-6">Réalisations</p>
        <SplitReveal as="h2" id="realisations-title" lines={['Avant, après,', 'et rien à *cacher*.']} className="text-xl md:text-2xl" />
        <p className="mt-6 font-body text-base text-ink-soft">Glissez la poignée. Les photos sont prises à la livraison, sans retouche.</p>
      </div>
      <ul className="col-span-12 mt-16 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12 md:gap-y-20" role="list">
        {REALISATIONS.map((r, i) => (
          <li key={r.slug} className={`chantier ${LAYOUT[r.taille]} ${i === 1 ? 'md:mt-24' : ''} ${i === 2 ? 'md:-mt-12' : ''}`}>
            <BeforeAfter avant={r.avant} apres={r.apres} alt={r.titre} width={1200} height={900} aspect={r.taille === 'small' ? '1 / 1' : r.taille === 'medium' ? '3 / 2' : '4 / 3'} className={i % 2 ? 'torn-alt' : 'torn'} />
            <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
              <h3 className="text-lg">{r.titre}</h3>
              <span className="font-body text-sm uppercase tracking-[0.14em] text-ochre">{r.lieu} · {r.annee}</span>
            </div>
            <p className="mt-2 font-body text-base text-ink-soft">{r.description} <span className="text-ink-mute">Durée : {r.duree}.</span></p>
          </li>
        ))}
      </ul>
    </section>
  );
}
