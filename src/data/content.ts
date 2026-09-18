/* Contenus éditoriaux de démonstration (textes crédibles, à adapter par client). */
import { ANNEES_EXPERIENCE, NB_CHANTIERS, VILLE } from '@/config/site.config';

export const METIER_TEXTE = {
  surtitre: 'Le métier',
  titre: ['Vingt ans de', 'tuyaux, et toujours', 'le même geste.'],
  paragraphes: [
    `J’ai appris le métier chez un plombier de la Croix-Rousse qui vérifiait chaque soudure à la main avant de remettre l’eau. Je fais pareil. Depuis ${ANNEES_EXPERIENCE} ans, je travaille seul ou avec un compagnon selon le chantier, jamais avec des équipes que je ne connais pas.`,
    `Une intervention chez vous, c’est un devis clair avant, un chantier propre pendant, et un numéro de téléphone qui répond après. Sur ${NB_CHANTIERS.toLocaleString('fr-FR')} chantiers à ${VILLE}, je n’ai pas trouvé mieux comme méthode.`,
  ],
  signature: 'Julien Ferrand, artisan plombier',
};

export const REALISATIONS = [
  {
    slug: 'salle-de-bain-croix-rousse',
    titre: 'Salle de bain, Croix-Rousse',
    lieu: 'Lyon 4e',
    annee: 2025,
    duree: '3 semaines',
    description: 'Dépose complète, douche à l’italienne, carrelage zellige et robinetterie laiton brossé.',
    avant: '/images/chantier-1-avant.webp',
    apres: '/images/chantier-1-apres.webp',
    taille: 'large' as const,
  },
  {
    slug: 'chaudiere-monplaisir',
    titre: 'Chaufferie, Monplaisir',
    lieu: 'Lyon 8e',
    annee: 2025,
    duree: '2 jours',
    description: 'Remplacement d’une chaudière de 1998 par une condensation 24 kW, réseau désemboué.',
    avant: '/images/chantier-2-avant.webp',
    apres: '/images/chantier-2-apres.webp',
    taille: 'small' as const,
  },
  {
    slug: 'colonne-presquile',
    titre: 'Colonne d’eau, Presqu’île',
    lieu: 'Lyon 2e',
    annee: 2024,
    duree: '5 jours',
    description: 'Remplacement d’une colonne plomb sur quatre étages, sans coupure prolongée.',
    avant: '/images/chantier-3-avant.webp',
    apres: '/images/chantier-3-apres.webp',
    taille: 'small' as const,
  },
  {
    slug: 'cuisine-villeurbanne',
    titre: 'Cuisine ouverte, Villeurbanne',
    lieu: 'Villeurbanne',
    annee: 2024,
    duree: '4 jours',
    description: 'Déplacement de l’évier sur l’îlot, évacuation reprise dans la chape, arrivée gaz sécurisée.',
    avant: '/images/chantier-4-avant.webp',
    apres: '/images/chantier-4-apres.webp',
    taille: 'medium' as const,
  },
];

export const METHODE = [
  {
    numero: '01',
    titre: 'Un appel, un diagnostic honnête',
    texte: 'Au téléphone, je pose les bonnes questions pour savoir si je peux vous dépanner à distance, ou s’il faut venir. Pas de déplacement facturé pour rien.',
  },
  {
    numero: '02',
    titre: 'Un devis écrit, sans surprise',
    texte: 'Chaque poste est détaillé : main-d’œuvre, fournitures, délai. Ce qui est écrit est ce qui est facturé, sauf découverte que l’on valide ensemble.',
  },
  {
    numero: '03',
    titre: 'Un chantier propre, tenu',
    texte: 'Bâches, aspirateur, sacs à gravats évacués chaque soir. Vous gardez l’eau et un point d’eau utilisable pendant les travaux.',
  },
  {
    numero: '04',
    titre: 'Un numéro qui répond après',
    texte: 'Je passe vérifier les réglages quinze jours après la mise en service. Ensuite, le même numéro reste valable, pour dix ans de garantie.',
  },
];

export const CHIFFRES = [
  { valeur: NB_CHANTIERS, suffixe: '', legende: 'chantiers réalisés' },
  { valeur: ANNEES_EXPERIENCE, suffixe: ' ans', legende: 'de métier' },
  { valeur: 48, suffixe: ' h', legende: 'délai moyen de devis' },
];

export const TEMOIGNAGES = [
  {
    nom: 'Marion D.',
    lieu: 'Lyon 1er',
    texte: 'Fuite un dimanche soir, réparée le lundi matin à 8h. Il a même resserré un robinet qui n’avait rien à voir, sans me le facturer.',
  },
  {
    nom: 'Karim et Léa',
    lieu: 'Villeurbanne',
    texte: 'Notre salle de bain a été livrée le jour prévu, et le carreleur qu’il nous a conseillé était aussi soigneux que lui.',
  },
  {
    nom: 'Syndic Beaujolais',
    lieu: 'Lyon 2e',
    texte: 'Colonne remplacée sur quatre étages sans une plainte des copropriétaires. C’est rare, on le note.',
  },
  {
    nom: 'Hélène R.',
    lieu: 'Caluire',
    texte: 'Le devis tenait sur une page, on comprenait chaque ligne. La chaudière tourne depuis deux hivers.',
  },
  {
    nom: 'Thomas B.',
    lieu: 'Oullins',
    texte: 'Il m’a expliqué au téléphone comment couper l’eau avant d’arriver. Ça a évité un plafond chez la voisine.',
  },
];
