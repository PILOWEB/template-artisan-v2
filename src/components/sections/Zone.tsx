/* 9. Zone d'intervention : croquis SVG (anneaux concentriques dessinés à
   l'entrée, communes en points), liste des communes en regard. */
import { useRef, useState } from 'react';
import { COMMUNES, VILLE, ZONE_INTERVENTION } from '@/config/site.config';
import { SplitReveal } from '@/components/ui/SplitReveal';
import { gsap } from '@/lib/motion';
import { useMotion } from '@/hooks/useMotion';

const R = 220;
const toXY = (angle: number, dist: number) => {
  const a = (angle * Math.PI) / 180;
  return { x: 260 + Math.cos(a) * R * dist, y: 260 - Math.sin(a) * R * dist };
};

export function Zone() {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState<string | null>(null);

  useMotion(({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(ref);
    const rings = q<SVGElement>('.ring');
    rings.forEach((r) => {
      const len = (r as SVGGeometryElement).getTotalLength();
      gsap.set(r, { strokeDasharray: `${len}`, strokeDashoffset: len });
    });
    const tl = gsap.timeline({ scrollTrigger: { trigger: q('svg')[0], start: 'top 75%', once: true } });
    tl.to(rings, { strokeDashoffset: 0, duration: 1.6, ease: 'in-out-quart', stagger: 0.15 })
      .fromTo(q('.dot'), { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.5, ease: 'spring-soft', stagger: 0.05 }, '-=0.9')
      .fromTo(q('.dot-label'), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.05 }, '-=0.6');
  }, [], ref);

  return (
    <section ref={ref} id="zone" className="container-grid relative py-24 md:py-40" aria-labelledby="zone-title">
      <div className="col-span-12 md:col-span-5 md:col-start-1">
        <p className="eyebrow mb-6">Zone d’intervention</p>
        <SplitReveal as="h2" id="zone-title" lines={[`${VILLE} et autour,`, 'à moins d’une *heure*.']} className="text-xl md:text-2xl" />
        <p className="mt-6 font-body text-base text-ink-soft">{ZONE_INTERVENTION}. Au-delà, appelez : selon le chantier, je me déplace.</p>
        <ul className="mt-10 columns-2 gap-6 font-body text-base" role="list">
          {[VILLE, ...COMMUNES.map((c) => c.nom)].map((n) => (
            <li key={n} className="break-inside-avoid py-1">
              <button
                type="button"
                className={`link-draw text-left transition-colors duration-300 ${hover === n ? 'text-accent' : 'text-ink'}`}
                onPointerEnter={() => setHover(n)} onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(n)} onBlur={() => setHover(null)}
              >
                {n}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-12 mt-14 md:col-span-6 md:col-start-7 md:mt-0" data-thread>
        <svg viewBox="0 0 520 520" className="w-full" role="img" aria-label={`Carte stylisée des communes desservies autour de ${VILLE}`}>
          <g fill="none" stroke="var(--color-ochre)" strokeWidth="1">
            {[0.33, 0.66, 1].map((k, i) => (
              <ellipse key={k} className="ring" cx="260" cy="260" rx={R * k} ry={R * k * 0.96} transform={`rotate(${i * 7 - 4} 260 260)`} strokeDasharray={i === 1 ? '6 5' : undefined} opacity={0.35 + i * 0.25} />
            ))}
            <path d="M40 300 C 120 250, 200 320, 300 260 S 460 200, 490 240" stroke="var(--color-olive)" strokeWidth="1.5" opacity="0.5" className="ring" />
          </g>
          {COMMUNES.map((c) => {
            const { x, y } = toXY(c.angle, c.distance);
            const active = hover === c.nom;
            return (
              <g key={c.nom}>
                <circle className="dot" cx={x} cy={y} r={active ? 7 : 4} fill={active ? 'var(--color-accent)' : 'var(--color-ochre)'} style={{ transition: 'r 0.4s var(--ease-out-expo), fill 0.3s' }} />
                <text className="dot-label" x={x + 10} y={y + 4} fontSize="12" fontFamily="var(--font-body)" fill={active ? 'var(--color-accent)' : 'var(--color-ink-soft)'} style={{ transition: 'fill 0.3s' }}>{c.nom}</text>
              </g>
            );
          })}
          <g>
            <circle className="dot" cx="260" cy="260" r={hover === VILLE ? 12 : 9} fill="var(--color-accent)" style={{ transition: 'r 0.4s var(--ease-out-expo)' }} />
            <circle cx="260" cy="260" r="16" fill="none" stroke="var(--color-accent)" opacity="0.5" />
            <text className="dot-label" x="260" y="292" textAnchor="middle" fontSize="15" fontFamily="var(--font-display)" fontStyle="italic" fill="var(--color-ink)">{VILLE}</text>
          </g>
        </svg>
        <p className="hand mt-2 text-right">croquis, pas à l’échelle</p>
      </div>
    </section>
  );
}
