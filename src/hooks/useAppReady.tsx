/* État "prêt" partagé : le préchargement le passe à true quand le rideau est levé.
   Le hero attend ce signal pour composer son titre. */
import { createContext, useContext, useState, type ReactNode } from 'react';

const Ctx = createContext<{ ready: boolean; setReady: (v: boolean) => void }>({
  ready: false,
  setReady: () => {},
});

export function AppReadyProvider({ children, initial = false }: { children: ReactNode; initial?: boolean }) {
  const [ready, setReady] = useState(initial);
  return <Ctx.Provider value={{ ready, setReady }}>{children}</Ctx.Provider>;
}

export const useAppReady = () => useContext(Ctx);
