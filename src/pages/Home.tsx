import { useRef } from 'react';
import { Hero } from '@/components/sections/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { Metier } from '@/components/sections/Metier';
import { Services } from '@/components/sections/Services';
import { Realisations } from '@/components/sections/Realisations';
import { Methode } from '@/components/sections/Methode';
import { Chiffres } from '@/components/sections/Chiffres';
import { Temoignages } from '@/components/sections/Temoignages';
import { Zone } from '@/components/sections/Zone';
import { Devis } from '@/components/sections/Devis';
import { ScrollThread } from '@/components/ui/ScrollThread';
import { useSeo } from '@/hooks/useSeo';

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  useSeo();
  return (
    <main id="main" ref={mainRef} className="relative">
      <ScrollThread containerRef={mainRef} />
      <Hero />
      <Marquee />
      <Metier />
      <Services />
      <Realisations />
      <Methode />
      <Chiffres />
      <Temoignages />
      <Zone />
      <Devis />
    </main>
  );
}
