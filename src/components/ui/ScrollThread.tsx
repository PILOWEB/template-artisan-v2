/* Fil conducteur : un trait ocre qui se dessine au fil du scroll et passe par
   chaque ancre [data-thread] de la page. Dans la section Méthode, les nœuds
   [data-thread-node] s'allument quand la pointe du fil les atteint. */
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsMobile } from '@/hooks/useMedia';

export function ScrollThread({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();

  // useEffect (et non useLayoutEffect) : la ref du conteneur parent n'est attachée qu'après les effets de layout des enfants.
  useEffect(() => {
    if (reduced || mobile) return;
    const svg = svgRef.current!, path = pathRef.current!;
    const main = containerRef.current ?? svg.parentElement!;
    let total = 0;
    let samples: { len: number; y: number }[] = [];
    let nodes: { el: HTMLElement; y: number }[] = [];
    let quick: ((v: number) => void) | null = null;

    const build = () => {
      const mainRect = main.getBoundingClientRect();
      const top = mainRect.top + window.scrollY;
      const width = main.clientWidth;
      const height = main.scrollHeight;
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.style.height = `${height}px`;

      const anchors = Array.from(main.querySelectorAll<HTMLElement>('[data-thread]'))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left - mainRect.left + r.width / 2, y: r.top - mainRect.top + r.height / 2 };
        })
        .sort((a, b) => a.y - b.y);
      if (anchors.length < 2) return;

      // Courbes en S entre ancres : verticale, puis inflexion douce vers la suivante
      let d = `M ${anchors[0].x} ${anchors[0].y}`;
      for (let i = 1; i < anchors.length; i++) {
        const a = anchors[i - 1], b = anchors[i];
        const dy = b.y - a.y;
        d += ` C ${a.x} ${a.y + dy * 0.55}, ${b.x} ${b.y - dy * 0.45}, ${b.x} ${b.y}`;
      }
      path.setAttribute('d', d);
      total = path.getTotalLength();
      path.style.strokeDasharray = `${total}`;
      path.style.strokeDashoffset = `${total}`;

      // Table longueur → y pour trouver la pointe à une hauteur donnée
      const N = 600;
      samples = Array.from({ length: N + 1 }, (_, i) => {
        const len = (total * i) / N;
        return { len, y: path.getPointAtLength(len).y + top };
      });
      nodes = Array.from(main.querySelectorAll<HTMLElement>('[data-thread-node]')).map((el) => {
        const r = el.getBoundingClientRect();
        return { el, y: r.top + window.scrollY + r.height / 2 };
      });
      quick = gsap.quickTo(path, 'strokeDashoffset', { duration: 0.6, ease: 'out-quart' });
      update();
    };

    const lenAtY = (y: number) => {
      let lo = 0, hi = samples.length - 1;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (samples[mid].y < y) lo = mid + 1; else hi = mid; }
      return samples[lo]?.len ?? 0;
    };

    const update = () => {
      if (!samples.length) return;
      const tipY = window.scrollY + window.innerHeight * 0.62;
      const len = lenAtY(tipY);
      quick?.(total - len);
      for (const n of nodes) {
        const lit = tipY >= n.y - 8;
        if (n.el.dataset.lit !== String(lit)) n.el.dataset.lit = String(lit);
      }
    };

    const st = ScrollTrigger.create({ onUpdate: update });
    ScrollTrigger.addEventListener('refresh', build);
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => ScrollTrigger.refresh());
    build();
    return () => { st.kill(); ScrollTrigger.removeEventListener('refresh', build); };
  }, [reduced, mobile, containerRef]);

  if (reduced || mobile) return null;
  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[5] w-full"
      preserveAspectRatio="none"
    >
      <path ref={pathRef} fill="none" stroke="var(--color-ochre)" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}
