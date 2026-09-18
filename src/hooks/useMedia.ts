import { useSyncExternalStore } from 'react';

export function useMedia(query: string, fallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useIsTouch = () => useMedia('(hover: none), (pointer: coarse)');
export const useIsMobile = () => useMedia('(max-width: 47.99rem)');
export const useIsDesktop = () => useMedia('(min-width: 64rem)');
