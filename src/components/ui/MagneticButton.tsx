/* Bouton magnétique : l'enveloppe suit le pointeur dans un rayon, le texte suit
   un peu moins (parallaxe interne). Rectangle à coins vifs, filet ocre ou fond
   terre cuite ; jamais de pilule bleue. */
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router';
import { gsap } from '@/lib/motion';
import { useIsTouch } from '@/hooks/useMedia';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface Props {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'outline' | 'ghost';
  cursor?: string;
  className?: string;
  external?: boolean;
  onClick?: () => void;
}

const base =
  'group relative inline-flex items-center gap-4 px-6 py-4 font-body text-base font-medium tracking-[-0.01em] transition-colors duration-500 [transition-timing-function:var(--ease-out-expo)]';
const variants = {
  solid: 'bg-accent text-accent-ink hover:bg-ink',
  outline: 'border border-line-strong text-ink hover:border-ink',
  ghost: 'text-ink px-0 py-2 link-draw',
};

export function MagneticButton({ href, children, variant = 'solid', cursor, className = '', external, onClick }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (isTouch || reduced) return;
    const el = ref.current!;
    const inner = el.querySelector<HTMLElement>('.inner')!;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'out-expo' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'out-expo' });
    const ixTo = gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'out-expo' });
    const iyTo = gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'out-expo' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * 0.35); yTo(dy * 0.35); ixTo(dx * 0.12); iyTo(dy * 0.12);
    };
    const leave = () => { xTo(0); yTo(0); ixTo(0); iyTo(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [isTouch, reduced]);

  const cls = `${base} ${variants[variant]} ${className}`;
  const content = (
    <span className="inner inline-flex items-center gap-3 will-change-transform">
      {children}
      {variant !== 'ghost' && (
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true" className="transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1">
          <path d="M0 6h16M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      )}
    </span>
  );

  const isInternal = href.startsWith('/') && !external;
  return (
    <span ref={ref} className="inline-block will-change-transform">
      {isInternal ? (
        <Link to={href} className={cls} data-cursor={cursor} onClick={onClick} viewTransition>{content}</Link>
      ) : (
        <a href={href} className={cls} data-cursor={cursor} onClick={onClick}>{content}</a>
      )}
    </span>
  );
}
