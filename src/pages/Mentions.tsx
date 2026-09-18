import { Link } from 'react-router';
import { ADRESSE, EMAIL, NOM_ENTREPRISE, TELEPHONE } from '@/config/site.config';
import { useSeo } from '@/hooks/useSeo';

export default function Mentions() {
  useSeo({ title: `Mentions légales — ${NOM_ENTREPRISE}` });
  return (
    <main id="main" className="container-grid pb-32 pt-36 md:pt-44">
      <div className="col-span-12 md:col-span-7 md:col-start-2">
        <Link to="/" viewTransition className="link-draw font-body text-sm uppercase tracking-[0.14em] text-ochre">← Accueil</Link>
        <h1 className="mt-8 text-2xl md:text-3xl">Mentions légales</h1>
        <div className="mt-10 space-y-6 font-body text-base text-ink-soft">
          <p><strong className="text-ink">Éditeur.</strong> {NOM_ENTREPRISE}, entreprise individuelle, {ADRESSE.rue}, {ADRESSE.codePostal} {ADRESSE.ville}. Tél. {TELEPHONE}, {EMAIL}. SIRET et numéro de TVA à compléter.</p>
          <p><strong className="text-ink">Hébergement.</strong> À compléter selon l’hébergeur retenu (raison sociale, adresse, téléphone).</p>
          <p><strong className="text-ink">Données personnelles.</strong> Les informations saisies dans le formulaire de devis servent uniquement à vous répondre. Elles ne sont ni revendues ni utilisées à d’autres fins. Vous pouvez demander leur suppression par courriel.</p>
          <p><strong className="text-ink">Cookies.</strong> Ce site n’utilise aucun cookie de suivi.</p>
          <p><strong className="text-ink">Assurances.</strong> Garantie décennale et responsabilité civile professionnelle souscrites auprès d’un assureur à préciser, couvrant la France métropolitaine.</p>
        </div>
      </div>
    </main>
  );
}
