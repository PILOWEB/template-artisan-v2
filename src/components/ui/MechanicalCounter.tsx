/* Compteur mécanique : chaque chiffre est une colonne 0-9 qui défile
   verticalement, comme un compteur d'eau. Déclenché à l'entrée, décalage
   depuis la droite, accélération asymétrique. */
import { useRef } from 'react';
import { gsap } from '@/lib/motion';
import { useMotion } from '@/hooks/useMotion';

interface Props { value: number; suffix?: string; className?: string }

export function MechanicalCounter({ value, suffix = '', className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const formatted = value.toLocaleString('fr-FR');
  const chars = formatted.split('');

  useMotion(({ reduced }) => {
    const cols = ref.current!.querySelectorAll<HTMLElement>('.col');
    if (reduced) { cols.forEach((c) => { c.style.transform = `translateY(-${Number(c.dataset.d) * 10}%)`; }); return; }
    gsap.set(cols, { yPercent: 0 });
    gsap.to(cols, {
      yPercent: (_i: number, el: Element) => -Number((el as HTMLElement).dataset.d) * 10,
      duration: 1.6, ease: 'asym',
      stagger: { each: 0.08, from: 'end' },
      scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
    });
  }, [value], ref);

  return (
    <span ref={ref} className={`inline-flex items-baseline ${className}`} aria-label={`${formatted}${suffix}`}>
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="relative inline-block h-[1em] overflow-hidden leading-none" aria-hidden="true">
            <span className="col flex flex-col will-change-transform" data-d={ch}>
              {Array.from({ length: 10 }, (_, d) => (
                <span key={d} className="block h-[1em] leading-none">{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden="true" className="leading-none">{ch}</span>
        ),
      )}
      {suffix && <span aria-hidden="true" className="ml-1 text-[0.45em] text-ochre">{suffix}</span>}
    </span>
  );
}
