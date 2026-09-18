import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const LenisContext = createContext<Lenis | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reduced = usePrefersReducedMotion();
  const tickerRef = useRef<((t: number) => void) | null>(null);

  useEffect(() => {
    if (reduced || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const instance = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    tickerRef.current = tick;
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add('lenis');
    setLenis(instance);
    return () => {
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
      instance.destroy();
      document.documentElement.classList.remove('lenis');
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}
