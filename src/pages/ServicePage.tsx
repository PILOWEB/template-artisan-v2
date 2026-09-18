/* Page service : le titre arrive depuis la carte cliquée (view transition). */
import { Link, useParams } from 'react-router';
import { LISTE_SERVICES, METIER_LABEL, METIER, NOM_ENTREPRISE, TELEPHONE, TELEPHONE_HREF, VILLE } from '@/config/site.config';
import { useSeo } from '@/hooks/useSeo';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ParallaxImage } from '@/components/ui/ParallaxImage';
import { useEffect } from 'react';

export default function ServicePage() {
  const { slug } = useParams();
  const s = LISTE_SERVICES.find((x) => x.slug === slug) ?? LISTE_SERVICES[0];
  const autres = LISTE_SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3);
  useSeo({ title: `${s.titre} à ${VILLE} — ${NOM_ENTREPRISE}`, description: `${s.resume} ${METIER_LABEL[METIER]} à ${VILLE}, ${NOM_ENTREPRISE}.` });
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  return (
    <main id="main" className="container-grid pb-32 pt-36 md:pt-44">
      <div className="col-span-12 md:col-span-6 md:col-start-2">
        <Link to="/#services" viewTransition className="link-draw font-body text-sm uppercase tracking-[0.14em] text-ochre">← Toutes les prestations</Link>
        <h1 className="mt-8 text-2xl md:text-3xl" style={{ viewTransitionName: 'service-title' }}>{s.titre}</h1>
        <p className="mt-6 font-body text-md text-ink-soft">{s.resume}</p>
        <p className="mt-6 font-body text-base text-ink-soft">{s.detail}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <MagneticButton href={TELEPHONE_HREF} cursor="Appeler">Appeler le {TELEPHONE}</MagneticButton>
          <MagneticButton href="/#devis" variant="outline" cursor="Devis">Demander un devis</MagneticButton>
        </div>
      </div>
      <div className="col-span-12 mt-12 md:col-span-4 md:col-start-9 md:-mt-8">
        <ParallaxImage src={`/images/matiere-${s.matiere}.webp`} alt={`Matière : ${s.matiere}`} width={720} height={900} className="aspect-[3/4]" torn loading="eager" />
        <p className="hand mt-3 text-right">{s.legende}</p>
      </div>
      <aside className="col-span-12 mt-24 border-t border-line pt-8 md:col-span-10 md:col-start-2">
        <p className="eyebrow mb-6">Aussi</p>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3" role="list">
          {autres.map((a) => (
            <li key={a.slug}><Link to={`/services/${a.slug}`} viewTransition data-cursor="Voir" className="link-draw text-lg">{a.titre}</Link><p className="mt-2 font-body text-base text-ink-soft">{a.resume}</p></li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
