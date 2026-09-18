/* 8. Témoignages : section épinglée courte, défilement horizontal infini
   piloté par le scroll vertical, vitesse et inclinaison liées à la vélocité. */
import { useRef } from 'react';
import { TEMOIGNAGES } from '@/data/content';
import { gsap, ScrollTrigger } from '@/lib/motion';
import { useMotion } from '@/hooks/useMotion';

export function Temoignages() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useMotion(({ reduced, mobile }) => {
    if (reduced) return;
    const track = trackRef.current!;
    const half = () => track.scrollWidth / 2;
    const wrap = gsap.utils.wrap(-half(), 0);
    let base = 0, extra = 0, vel = 0, skew = 0;
    const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'out-quart' });

    const tick = () => {
      extra += vel * 0.00012;          // la vélocité de scroll ajoute de l'élan
      vel *= 0.92;
      extra += 0.35;                   // dérive lente pour rester vivant à l'arrêt
      const x = wrap(-(base + extra));
      gsap.set(track, { x });
      if (!mobile) { skew = gsap.utils.clamp(-6, 6, -vel * 0.004); skewTo(skew); }
    };
    // Sur mobile : pas d'épinglage (le scroll natif reste maître), la piste avance
    // simplement avec la traversée de la section. Sur desktop : épinglage court.
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: mobile ? 'top bottom' : 'top top',
      end: mobile ? 'bottom top' : '+=150%',
      pin: !mobile, scrub: true, anticipatePin: mobile ? 0 : 1,
      onUpdate: (self) => {
        base = self.progress * half() * (mobile ? 0.9 : 1.2);
        vel = self.getVelocity();
      },
      // le ticker ne tourne que lorsque la section est à l'écran
      onToggle: (self) => { if (self.isActive) gsap.ticker.add(tick); else gsap.ticker.remove(tick); },
    });
    return () => { gsap.ticker.remove(tick); st.kill(); };
  }, [], ref);

  const items = [...TEMOIGNAGES, ...TEMOIGNAGES];
  return (
    <section ref={ref} id="temoignages" className="relative flex flex-col justify-center overflow-hidden bg-ink py-20 text-surface md:min-h-screen" aria-labelledby="temoignages-title">
      <div className="container-grid mb-12">
        <div className="col-span-12 md:col-span-6 md:col-start-2">
          <p className="eyebrow mb-6 text-ochre">Ils en parlent</p>
          <h2 id="temoignages-title" className="text-xl text-surface md:text-2xl">Ce que les clients <em className="text-accent">retiennent</em>.</h2>
        </div>
        <p className="col-span-12 mt-4 font-body text-sm uppercase tracking-[0.14em] text-surface/50 md:col-span-3 md:col-start-9 md:mt-2 md:text-right" data-thread>Continuez à faire défiler</p>
      </div>
      <div ref={trackRef} className="flex w-max gap-6 pl-[var(--gutter)] will-change-transform md:gap-10">
        {items.map((t, i) => (
          <figure
            key={i}
            aria-hidden={i >= TEMOIGNAGES.length}
            className={`w-[78vw] shrink-0 border-l border-ochre/60 pl-6 md:w-[34rem] md:pl-8 ${i % 2 ? 'md:mt-12' : ''}`}
          >
            <blockquote className="font-display text-md text-surface md:text-lg" style={{ letterSpacing: '-0.01em' }}>
              «\u00A0{t.texte}\u00A0»
            </blockquote>
            <figcaption className="mt-6 font-body text-sm uppercase tracking-[0.14em] text-surface/60">
              {t.nom} <span className="text-ochre">·</span> {t.lieu}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
