/* En-tête minimal : nom, liens de section, téléphone. Se masque en descendant,
   réapparaît en remontant. */
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { NOM_ENTREPRISE, TELEPHONE, TELEPHONE_HREF } from '@/config/site.config';
import { useAppReady } from '@/hooks/useAppReady';

const LINKS = [['#services', 'Services'], ['#realisations', 'Réalisations'], ['#methode', 'Méthode'], ['#devis', 'Devis']];

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const last = useRef(0);
  const { ready } = useAppReady();
  const { pathname } = useLocation();
  const home = pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last.current && y > 200);
      last.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-[transform,opacity,background-color] duration-500 [transition-timing-function:var(--ease-out-expo)] ${hidden ? '-translate-y-full' : 'translate-y-0'} ${ready ? 'opacity-100' : 'opacity-0'} ${scrolled ? 'bg-surface/85 backdrop-blur-sm' : ''}`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">Aller au contenu</a>
      <div className="gutter flex items-center justify-between py-4 md:py-5">
        <Link to="/" viewTransition className="font-display text-md tracking-[-0.02em]" aria-label={`${NOM_ENTREPRISE}, accueil`}>{NOM_ENTREPRISE}</Link>
        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {LINKS.map(([h, l]) => (
            <a key={h} href={home ? h : `/${h}`} className="link-draw font-body text-sm uppercase tracking-[0.14em]">{l}</a>
          ))}
        </nav>
        <a href={TELEPHONE_HREF} data-cursor="Appeler" className="link-draw font-body text-sm font-medium tabular-nums md:text-base">{TELEPHONE}</a>
      </div>
    </header>
  );
}
