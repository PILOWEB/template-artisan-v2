/* Image en parallaxe légère : l'image est agrandie de 12 % et glisse de ±6 %
   pendant que son cadre traverse le viewport. */
import { useRef } from 'react';
import { gsap } from '@/lib/motion';
import { useMotion } from '@/hooks/useMotion';

interface Props {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
  amount?: number;
  torn?: boolean;
}

export function ParallaxImage({ src, alt, className = '', width, height, loading = 'lazy', amount = 6, torn }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useMotion(({ reduced }) => {
    if (reduced) return;
    const img = ref.current!.querySelector('img')!;
    gsap.fromTo(img, { yPercent: -amount }, {
      yPercent: amount, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
    });
  }, [amount], ref);

  return (
    <div ref={ref} className={`relative overflow-hidden ${torn ? 'torn' : ''} ${className}`}>
      <img
        src={src} alt={alt} width={width} height={height} loading={loading} decoding="async"
        className="h-full w-full object-cover will-change-transform"
        style={{ scale: `${1 + amount * 2 / 100}` }}
      />
    </div>
  );
}
