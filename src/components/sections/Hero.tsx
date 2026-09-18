/* 1. Hero : titre composé mot par mot après le rideau, scène 3D à droite
   (image statique sous 768 px), deux actions atteignables immédiatement. */
import { lazy, Suspense, useRef } from 'react';
import { BASELINE, METIER_LABEL, METIER, NOM_ENTREPRISE, TELEPHONE, TELEPHONE_HREF, VILLE, ZONE_INTERVENTION } from '@/config/site.config';
import { SplitReveal } from '@/components/ui/SplitReveal';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useAppReady } from '@/hooks/useAppReady';
import { useIsMobile } from '@/hooks/useMedia';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { gsap } from '@/lib/motion';
import { useMotion } from '@/hooks/useMotion';

const HeroScene = lazy(() => import('@/components/three/HeroScene'));

function splitBaseline(b: string): string[] {
  // Une ligne par segment séparé par une virgule ; le dernier mot passe en italique accent.
  const parts = b.replace(/\.$/, '').split(',').map((p) => p.trim()).filter(Boolean);
  const last = parts[parts.length - 1].split(' ');
  last[last.length - 1] = `*${last[last.length - 1]}*`;
  parts[parts.length - 1] = last.join(' ');
  return parts;
}

export function Hero() {
  const { ready } = useAppReady();
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const lines = splitBaseline(BASELINE);

  useMotion(({ reduced }) => {
    if (reduced || !ready) return;
    const q = gsap.utils.selector(ref);
    gsap.fromTo(q('.hero-meta'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'out-expo', stagger: 0.08, delay: 0.5 });
    gsap.fromTo(q('.hero-scene'), { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'out-expo', delay: 0.3 });
    gsap.fromTo(q('.hero-scroll'), { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 1.3 });
    gsap.to(q('.hero-scroll-line'), { scaleY: 1, transformOrigin: 'top', duration: 1.2, ease: 'in-out-quart', repeat: -1, repeatDelay: 0.4, yoyo: true });
  }, [ready], ref);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden" aria-labelledby="hero-title">
      {/* Scène 3D / image statique */}
      <div className="hero-scene absolute inset-y-0 right-0 w-full md:left-[38%] md:w-auto" aria-hidden="true">
        {mobile || reduced ? (
          <img src="/images/hero-static.webp" alt="" width={1400} height={1000} fetchPriority="high" className="h-full w-full object-cover opacity-70 md:opacity-100" />
        ) : (
          <Suspense fallback={<img src="/images/hero-static.webp" alt="" width={1400} height={1000} className="h-full w-full object-cover" />}>
            <HeroScene />
          </Suspense>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-transparent md:via-surface/20" />
      </div>

      <div className="container-grid relative z-10 flex min-h-[100svh] flex-col justify-end pb-24 pt-32 md:pb-16">
        <div className="col-span-12 md:col-span-9 lg:col-span-8">
          <p className="hero-meta eyebrow mb-6">{METIER_LABEL[METIER]} · {VILLE}</p>
          <SplitReveal as="h1" id="hero-title" lines={lines} trigger="ready" play={ready} delay={0.25} className="text-2xl sm:text-3xl lg:text-4xl" />
        </div>
        <div className="col-span-12 mt-10 grid grid-cols-1 items-end gap-8 md:col-span-10 md:grid-cols-[1fr_auto] md:gap-12">
          <div className="hero-meta max-w-md font-body text-base text-ink-soft">
            <span className="block text-ink">{NOM_ENTREPRISE}</span>
            Intervention {ZONE_INTERVENTION}. Devis sous 48 h, dépannage le jour même.
          </div>
          <div className="hero-meta flex flex-wrap gap-3">
            <MagneticButton href={TELEPHONE_HREF} cursor="Appeler">Appeler le {TELEPHONE}</MagneticButton>
            <MagneticButton href="#devis" variant="outline" cursor="Devis">Demander un devis</MagneticButton>
          </div>
        </div>
        <div className="hero-scroll absolute bottom-6 right-[var(--gutter)] hidden items-center gap-4 opacity-0 md:flex" data-thread data-cursor="Faire défiler">
          <span className="font-body text-sm uppercase tracking-[0.14em] text-ink-mute">Faire défiler</span>
          <span className="hero-scroll-line block h-12 w-px origin-top scale-y-0 bg-ochre" />
        </div>
      </div>
    </section>
  );
}
