/* Enveloppe gsap.matchMedia : chaque composant déclare ses animations dans un
   contexte qui se replie automatiquement (prefers-reduced-motion, mobile) et se
   nettoie au démontage. */
import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { gsap } from '@/lib/motion';
import { registerEases } from '@/lib/motion';

export interface MotionConditions {
  reduced: boolean;
  mobile: boolean;
  touch: boolean;
}

export function useMotion(
  setup: (c: MotionConditions) => void | (() => void),
  deps: DependencyList = [],
  scope?: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    registerEases();
    const mm = gsap.matchMedia(scope?.current ?? undefined);
    mm.add(
      {
        reduced: '(prefers-reduced-motion: reduce)',
        ok: '(prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 47.99rem)',
        desktop: '(min-width: 48rem)',
        touch: '(hover: none)',
        fine: '(hover: hover)',
      },
      (ctx) => {
        const c = ctx.conditions as Record<string, boolean>;
        return setup({ reduced: !!c.reduced, mobile: !!c.mobile, touch: !!c.touch });
      },
    );
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
