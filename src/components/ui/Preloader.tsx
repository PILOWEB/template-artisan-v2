/* Préchargement : compteur 0 → 100 en serif géante, puis rideau qui se retire
   vers le haut. Joué une fois par session ; sauté si prefers-reduced-motion. */
import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, registerEases } from '@/lib/motion';
import { useAppReady } from '@/hooks/useAppReady';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { NOM_ENTREPRISE } from '@/config/site.config';

const KEY = 'atelier:preloaded';

export function Preloader() {
  const { setReady } = useAppReady();
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(() => {
    try { return sessionStorage.getItem(KEY) !== '1'; } catch { return true; }
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  // Dépendances volontairement limitées : `ready` change pendant la timeline
  // (onStart du rideau) et ne doit surtout pas la tuer.
  useLayoutEffect(() => {
    if (!visible) { setReady(true); return; }
    if (reduced) { setVisible(false); setReady(true); return; }
    registerEases();
    const root = rootRef.current!;
    const num = numRef.current!;
    document.body.style.overflow = 'hidden';
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        try { sessionStorage.setItem(KEY, '1'); } catch { /* stockage indisponible */ }
        setVisible(false);
      },
    });
    tl.to(counter, {
      v: 100, duration: 1.7, ease: 'asym',
      onUpdate: () => { num.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
    })
      .to(num, { yPercent: -30, opacity: 0, duration: 0.5, ease: 'in-quart' }, '-=0.1')
      .to(root, { yPercent: -100, duration: 0.9, ease: 'in-out-quart', onStart: () => setReady(true) }, '-=0.2');
    return () => { tl.kill(); document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, reduced]);

  if (!visible) return null;
  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Chargement"
      className="fixed inset-0 z-[90] flex items-end justify-between bg-ink px-[var(--gutter)] pb-8 text-surface"
      style={{ willChange: 'transform' }}
    >
      <span className="font-body text-sm uppercase tracking-[0.14em] text-surface/60">{NOM_ENTREPRISE}</span>
      <span
        ref={numRef}
        className="display text-4xl leading-none tabular-nums text-surface-deep"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        000
      </span>
    </div>
  );
}
