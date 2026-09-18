/* Avant / après : poignée draggable avec inertie (vitesse + friction), plus une
   révélation pilotée par le scroll tant que le visiteur n'a pas pris la main. */
import { useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion';
import { useMotion } from '@/hooks/useMotion';

interface Props {
  avant: string;
  apres: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  aspect?: string;
}

export function BeforeAfter({ avant, apres, alt, width, height, className = '', aspect = '4 / 3' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0.15);
  const state = useRef({ pos: 0.15, vel: 0, dragging: false, touched: false, lastX: 0, lastT: 0, raf: 0 });

  useMotion(({ reduced }) => {
    const el = ref.current!;
    const s = state.current;
    const apply = (p: number) => {
      s.pos = Math.min(0.98, Math.max(0.02, p));
      el.style.setProperty('--pos', `${s.pos * 100}%`);
    };
    apply(reduced ? 0.5 : 0.15);

    // Révélation au scroll : le "après" se dévoile entre 15 % et 65 % selon la position
    let st: ScrollTrigger | undefined;
    if (!reduced) {
      st = ScrollTrigger.create({
        trigger: el, start: 'top 90%', end: 'center 40%', scrub: 0.5,
        onUpdate: (self) => { if (!s.touched) apply(0.15 + self.progress * 0.5); },
      });
    }

    // Drag avec inertie
    const toPos = (clientX: number) => {
      const r = el.getBoundingClientRect();
      return (clientX - r.left) / r.width;
    };
    const loop = () => {
      if (s.dragging) return;
      if (Math.abs(s.vel) < 0.0004) { s.vel = 0; return; }
      apply(s.pos + s.vel);
      s.vel *= 0.9;
      s.raf = requestAnimationFrame(loop);
    };
    const down = (e: PointerEvent) => {
      s.dragging = true; s.touched = true; s.vel = 0;
      s.lastX = e.clientX; s.lastT = performance.now();
      el.setPointerCapture(e.pointerId);
      apply(toPos(e.clientX));
      cancelAnimationFrame(s.raf);
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - s.lastT);
      const r = el.getBoundingClientRect();
      s.vel = ((e.clientX - s.lastX) / r.width) * (16 / dt);
      s.lastX = e.clientX; s.lastT = now;
      apply(toPos(e.clientX));
    };
    const up = (e: PointerEvent) => {
      s.dragging = false;
      try { el.releasePointerCapture(e.pointerId); } catch { /* déjà relâché */ }
      s.raf = requestAnimationFrame(loop);
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      st?.kill();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      cancelAnimationFrame(s.raf);
    };
  }, [], ref);

  const onKey = (e: React.KeyboardEvent) => {
    const s = state.current;
    const step = e.shiftKey ? 0.1 : 0.03;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      s.touched = true;
      const next = e.key === 'ArrowLeft' ? s.pos - step : s.pos + step;
      s.pos = Math.min(0.98, Math.max(0.02, next));
      ref.current!.style.setProperty('--pos', `${s.pos * 100}%`);
      setPos(s.pos);
      gsap.killTweensOf(ref.current!);
    }
  };

  return (
    <div
      ref={ref}
      className={`group relative select-none overflow-hidden touch-pan-y ${className}`}
      style={{ aspectRatio: aspect, ['--pos' as string]: '15%' }}
      data-cursor="Glisser"
    >
      <img src={avant} alt={`${alt}, avant travaux`} width={width} height={height} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ filter: 'saturate(0.6)' }} />
      <div className="absolute inset-0" style={{ clipPath: 'inset(0 0 0 var(--pos))' }}>
        <img src={apres} alt={`${alt}, après travaux`} width={width} height={height} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <span className="pointer-events-none absolute left-4 top-4 bg-ink/80 px-2 py-1 font-body text-sm uppercase tracking-[0.14em] text-surface">Avant</span>
      <span className="pointer-events-none absolute right-4 top-4 bg-surface/85 px-2 py-1 font-body text-sm uppercase tracking-[0.14em] text-ink">Après</span>
      <div
        role="slider"
        aria-label="Comparer avant et après"
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos * 100)}
        tabIndex={0}
        onKeyDown={onKey}
        className="absolute top-0 bottom-0 w-px bg-surface"
        style={{ left: 'var(--pos)' }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-surface bg-ink/70 text-surface backdrop-blur-[2px] transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-110">
          <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden="true"><path d="M6 1 1 5l5 4M14 1l5 4-5 4" stroke="currentColor" strokeWidth="1.25" /></svg>
        </span>
      </div>
    </div>
  );
}
