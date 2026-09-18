/* 4. Services : échantillons de matière. Section épinglée : pile → éventail →
   grille asymétrique. Au survol : la carte se soulève, l'image passe en couleur
   pleine, une légende manuscrite apparaît. Le titre voyage vers la page service
   via view transition. */
import { useRef } from 'react';
import { Link, useViewTransitionState } from 'react-router';
import { LISTE_SERVICES, type Service } from '@/config/site.config';
import { gsap } from '@/lib/motion';
import { useMotion } from '@/hooks/useMotion';
import { SplitReveal } from '@/components/ui/SplitReveal';

function Sample({ s, index }: { s: Service; index: number }) {
  const href = `/services/${s.slug}`;
  const transitioning = useViewTransitionState(href);
  return (
    <Link
      to={href}
      viewTransition
      data-cursor="Voir"
      className={`sample group relative block bg-surface-deep p-3 will-change-transform [transition:translate_0.6s_var(--ease-out-expo),rotate_0.6s_var(--ease-out-expo)] hover:-translate-y-2 hover:-rotate-1 ${index % 3 === 1 ? 'lg:mt-10' : ''}`}
      style={{ clipPath: index % 2 ? undefined : 'polygon(0 0.5%, 99.5% 0, 100% 99.4%, 0.4% 100%)' }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={`/images/matiere-${s.matiere}.webp`} alt="" width={720} height={900} loading="lazy" decoding="async"
          className="h-full w-full object-cover transition-[filter,transform] duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.04]"
          style={{ filter: 'grayscale(0.75) sepia(0.15) contrast(0.95)' }}
        />
        <style>{`.sample:hover img{filter:none !important}`}</style>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="pointer-events-none absolute left-3 top-3 font-body text-sm text-surface/90 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
        <span className="hand pointer-events-none absolute bottom-3 right-3 max-w-[70%] text-right text-surface opacity-0 translate-y-2 transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-100">
          {s.legende}
        </span>
      </div>
      <div className="flex items-start justify-between gap-4 pt-4 pb-2">
        <h3 className="text-md lg:text-lg" style={{ viewTransitionName: transitioning ? 'service-title' : undefined }}>{s.titre}</h3>
        <span className="mt-2 text-ochre transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1" aria-hidden="true">→</span>
      </div>
      <p className="max-w-none pr-4 font-body text-sm text-ink-soft lg:text-base">{s.resume}</p>
    </Link>
  );
}

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useMotion(({ reduced, mobile }) => {
    const grid = gridRef.current!;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.sample'));
    if (reduced) return;
    if (mobile) {
      gsap.fromTo(cards, { y: 40, opacity: 0, rotate: 2 }, {
        y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: 'out-expo', stagger: 0.1,
        scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
      });
      return;
    }
    const gr = grid.getBoundingClientRect();
    const cx = gr.width / 2, cy = gr.height / 2;
    const n = cards.length;
    const offsets = cards.map((c) => {
      const r = c.getBoundingClientRect();
      return { dx: cx - (r.left - gr.left + r.width / 2), dy: cy - (r.top - gr.top + r.height / 2), w: r.width };
    });
    const mid = (n - 1) / 2;
    const pile = (i: number) => ({ x: offsets[i].dx + (i - mid) * 3, y: offsets[i].dy + (i - mid) * -4, rotate: (i - mid) * 2.5, scale: 0.92 });
    const fan = (i: number) => ({ x: offsets[i].dx + (i - mid) * offsets[i].w * 0.5, y: offsets[i].dy + Math.abs(i - mid) * 30 + 24, rotate: (i - mid) * 9, scale: 1 });
    cards.forEach((c, i) => gsap.set(c, { ...pile(i), zIndex: i }));

    // Si la section dépasse la hauteur du viewport, on réduit la grille pour que
    // l'épinglage montre tout l'éventail puis toute la grille.
    const section = ref.current!;
    const fit = Math.min(1, (window.innerHeight - 96) / section.offsetHeight);
    if (fit < 1) gsap.set(grid, { scale: fit, transformOrigin: 'top center', marginBottom: -(grid.offsetHeight * (1 - fit)) });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=170%', pin: true, scrub: 0.8, anticipatePin: 1 },
    });
    tl.to(cards, { x: (i) => fan(i).x, y: (i) => fan(i).y, rotate: (i) => fan(i).rotate, scale: 1, ease: 'in-out-quart', duration: 1, stagger: { each: 0.04, from: 'center' } })
      .to({}, { duration: 0.25 })
      .to(cards, { x: 0, y: 0, rotate: 0, scale: 1, ease: 'in-out-quart', duration: 1.1, stagger: { each: 0.05, from: 'start' }, clearProps: 'zIndex' })
      .to({}, { duration: 0.2 });
  }, [], ref);

  return (
    <section ref={ref} id="services" className="relative bg-surface py-20 md:py-12" aria-labelledby="services-title">
      {/* ancre du fil conducteur : il longe la marge droite pendant l'éventail */}
      <span aria-hidden="true" data-thread className="absolute right-[calc(var(--gutter)/2)] top-1/2 h-px w-px" />
      <div className="container-grid">
        <div className="col-span-12 lg:col-span-3">
          <p className="eyebrow mb-6">Ce que je fais</p>
          <SplitReveal as="h2" id="services-title" lines={['Six prestations,', 'une même *exigence*.']} className="text-xl lg:text-2xl" />
          <p className="hand mt-8 max-w-[14rem]">les échantillons sont sur la table, prenez-en un</p>
        </div>
        <div ref={gridRef} className="col-span-12 mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:col-span-9 lg:mt-0 lg:grid-cols-3 lg:gap-7">
          {LISTE_SERVICES.slice(0, 6).map((s, i) => <Sample key={s.slug} s={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}
