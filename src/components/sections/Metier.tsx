/* 3. Le métier : deux colonnes décalées, texte à la première personne,
   photo verticale remontée de 96 px, filet ocre vertical entre les deux. */
import { useRef } from 'react';
import { METIER_TEXTE } from '@/data/content';
import { SplitReveal } from '@/components/ui/SplitReveal';
import { ParallaxImage } from '@/components/ui/ParallaxImage';
import { gsap } from '@/lib/motion';
import { useMotion } from '@/hooks/useMotion';

export function Metier() {
  const ref = useRef<HTMLElement>(null);
  useMotion(({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(ref);
    gsap.fromTo(q('.para'), { y: 28, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: 'out-expo', stagger: 0.12,
      scrollTrigger: { trigger: q('.para')[0], start: 'top 85%', once: true },
    });
    gsap.fromTo(q('.rule-grow'), { scaleY: 0 }, {
      scaleY: 1, transformOrigin: 'top', duration: 1.4, ease: 'in-out-quart',
      scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
    });
  }, [], ref);

  return (
    <section ref={ref} id="metier" className="container-grid relative py-24 md:py-40" aria-labelledby="metier-title">
      <div className="col-span-12 md:col-span-6 md:col-start-2 lg:col-span-5">
        <p className="eyebrow mb-8">{METIER_TEXTE.surtitre}</p>
        <SplitReveal as="h2" id="metier-title" lines={METIER_TEXTE.titre} className="text-xl md:text-2xl" />
        <div className="mt-10 space-y-6 font-body text-md text-ink-soft">
          {METIER_TEXTE.paragraphes.map((p, i) => <p key={i} className="para">{p}</p>)}
        </div>
        <p className="para hand mt-10" aria-label={METIER_TEXTE.signature}>— {METIER_TEXTE.signature}</p>
      </div>
      <div className="relative hidden md:col-span-1 md:block" data-thread>
        <span className="rule-grow rule-v absolute left-1/2 top-0 h-full" />
      </div>
      <div className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:-mt-24 lg:col-span-4 lg:col-start-8">
        <ParallaxImage src="/images/portrait-metier.webp" alt="L'artisan dans son atelier" width={900} height={1200} amount={8} torn className="aspect-[3/4]" />
        <p className="hand mt-4 text-right">l’atelier, rue des Tanneurs</p>
      </div>
    </section>
  );
}
