/* Curseur custom : disque en mix-blend-mode difference, inertie lerp 0.15,
   libellé contextuel lu sur l'attribut data-cursor de l'élément survolé.
   Astuce couleur : en mode "difference", un disque #409DB9 sur le papier #F4EFE7
   affiche exactement la terre cuite #B4522E, et s'inverse sur l'encre. */
import { useEffect, useRef, useState } from 'react';
import { useIsTouch } from '@/hooks/useMedia';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function Cursor() {
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState('');
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isTouch) return;
    const el = ref.current!;
    const root = document.documentElement;
    root.classList.add('has-cursor');
    let tx = -100, ty = -100, x = -100, y = -100, raf = 0, shown = false;
    const lerp = reduced ? 1 : 0.15;

    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; x = tx; y = ty; el.style.opacity = '1'; }
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor], a, button, [role="button"]');
      if (!t) { setActive(false); setLabel(''); return; }
      setActive(true);
      setLabel(t.dataset.cursor ?? '');
    };
    const leave = () => { el.style.opacity = '0'; shown = false; };
    const tick = () => {
      x += (tx - x) * lerp; y += (ty - y) * lerp;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(tick);
    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [isTouch, reduced]);

  if (isTouch) return null;
  const size = label ? 84 : active ? 40 : 14;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0"
      style={{ mixBlendMode: 'difference', willChange: 'transform' }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: size, height: size,
          background: '#409DB9',
          transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1), height 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <span
          ref={labelRef}
          className="font-body text-[11px] font-medium uppercase tracking-[0.14em]"
          style={{
            color: '#0B1018',
            opacity: label ? 1 : 0,
            transform: label ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 0.4s cubic-bezier(0.25,1,0.5,1) 0.1s, transform 0.4s cubic-bezier(0.25,1,0.5,1) 0.1s',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
