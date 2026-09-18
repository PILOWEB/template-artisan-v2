import { useEffect } from 'react';
import {
  ADRESSE, ANNEE_CREATION, EMAIL, HORAIRES, METIER_LABEL, METIER, NOM_ENTREPRISE,
  TELEPHONE, VILLE, ZONE_INTERVENTION, COMMUNES, COULEUR_ACCENT,
} from '@/config/site.config';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Title, meta description et données structurées LocalBusiness, dérivés des variables. */
export function useSeo(opts?: { title?: string; description?: string }) {
  useEffect(() => {
    const title = opts?.title ?? `${METIER_LABEL[METIER]} à ${VILLE} — ${NOM_ENTREPRISE}`;
    const description =
      opts?.description ??
      `${NOM_ENTREPRISE}, ${METIER_LABEL[METIER].toLowerCase()} à ${VILLE} depuis ${ANNEE_CREATION}. Intervention ${ZONE_INTERVENTION}. Devis sous 48 h, appel au ${TELEPHONE}.`;
    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:locale', 'fr_FR', 'property');
    setMeta('og:image', `${location.origin}/images/og-image.webp`, 'property');
    setMeta('theme-color', '#F4EFE7');
    document.documentElement.style.setProperty('--accent', COULEUR_ACCENT);

    const id = 'ld-localbusiness';
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'Plumber'],
      name: NOM_ENTREPRISE,
      description,
      telephone: TELEPHONE,
      email: EMAIL,
      foundingDate: String(ANNEE_CREATION),
      address: {
        '@type': 'PostalAddress',
        streetAddress: ADRESSE.rue,
        postalCode: ADRESSE.codePostal,
        addressLocality: ADRESSE.ville,
        addressCountry: 'FR',
      },
      areaServed: [VILLE, ...COMMUNES.map((c) => c.nom)].map((n) => ({ '@type': 'City', name: n })),
      openingHours: HORAIRES.filter((h) => h.jours !== 'Urgences').map((h) => `${h.jours} ${h.heures}`),
      url: typeof location !== 'undefined' ? location.origin : undefined,
    });
  }, [opts?.title, opts?.description]);
}
