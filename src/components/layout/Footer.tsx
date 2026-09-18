/* 11. Pied de page : grand logo typographique, horaires, mentions, tel:. */
import { Link } from 'react-router';
import { ADRESSE, ANNEE_CREATION, EMAIL, HORAIRES, METIER_LABEL, METIER, NOM_ENTREPRISE, TELEPHONE, TELEPHONE_HREF } from '@/config/site.config';

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-surface pt-20 pb-28 lg:pb-12" aria-label="Pied de page">
      <div className="container-grid">
        <div className="col-span-12 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="font-body text-sm uppercase tracking-[0.14em] text-ochre">Horaires</p>
            <dl className="mt-4 space-y-2 font-body text-base">
              {HORAIRES.map((h) => (
                <div key={h.jours} className="flex justify-between gap-4 border-b border-line py-2">
                  <dt className="text-ink-soft">{h.jours}</dt><dd>{h.heures}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="md:col-span-3 md:col-start-5">
            <p className="font-body text-sm uppercase tracking-[0.14em] text-ochre">Contact</p>
            <a href={TELEPHONE_HREF} data-cursor="Appeler" className="link-draw mt-4 inline-block font-display text-lg">{TELEPHONE}</a>
            <a href={`mailto:${EMAIL}`} className="link-draw mt-2 block w-fit font-body text-base">{EMAIL}</a>
            <address className="mt-4 font-body text-base not-italic text-ink-soft">{ADRESSE.rue}<br />{ADRESSE.codePostal} {ADRESSE.ville}</address>
          </div>
          <nav className="md:col-span-3 md:col-start-10" aria-label="Pied de page">
            <p className="font-body text-sm uppercase tracking-[0.14em] text-ochre">Plan</p>
            <ul className="mt-4 space-y-2 font-body text-base">
              {[['#services', 'Services'], ['#realisations', 'Réalisations'], ['#methode', 'Méthode'], ['#zone', 'Zone d’intervention'], ['#devis', 'Devis']].map(([h, l]) => (
                <li key={h}><a href={h} className="link-draw">{l}</a></li>
              ))}
              <li><Link to="/mentions-legales" viewTransition className="link-draw">Mentions légales</Link></li>
            </ul>
          </nav>
        </div>
        <p className="display col-span-12 mt-20 overflow-hidden whitespace-nowrap text-4xl leading-none text-ink" aria-hidden="true" style={{ fontSize: 'clamp(3rem, 11.5vw, 13rem)', letterSpacing: '-0.045em' }}>
          {NOM_ENTREPRISE}
        </p>
        <div className="col-span-12 mt-6 flex flex-col justify-between gap-2 border-t border-line pt-4 font-body text-sm text-ink-mute md:flex-row">
          <span>{NOM_ENTREPRISE} · {METIER_LABEL[METIER]} depuis {ANNEE_CREATION}</span>
          <span>© {new Date().getFullYear()} · Site conçu comme un carnet de chantier</span>
        </div>
      </div>
    </footer>
  );
}
