/* =============================================================================
   VARIABLES MÉTIER — c'est le seul fichier à modifier pour décliner le template
   à un nouveau client. Tout le contenu de la page est dérivé de ces valeurs.
   ============================================================================= */

export type Metier = 'plomberie' | 'electricite' | 'maconnerie' | 'menuiserie' | 'renovation';

export const NOM_ENTREPRISE = 'Atelier Ferrand';
export const METIER: Metier = 'plomberie';
export const BASELINE = "Plombier-chauffagiste à Lyon, l'eau qui reste à sa place.";
export const VILLE = 'Lyon';
export const ZONE_INTERVENTION = 'Lyon et Métropole, jusqu’à 30 km';
export const TELEPHONE = '04 72 00 00 00';
export const EMAIL = 'contact@atelier-ferrand.fr';
export const ANNEE_CREATION = 2009;
export const NB_CHANTIERS = 1240;
export const COULEUR_ACCENT = '#B4522E';

export const LISTE_SERVICES: readonly Service[] = [
  {
    slug: 'depannage-fuite',
    titre: 'Dépannage & fuites',
    resume: 'Intervention le jour même sur Lyon pour une fuite, un bouchon ou un chauffe-eau à l’arrêt.',
    detail:
      'On commence toujours par chercher la cause, pas seulement le symptôme. Une fuite sous évier, un joint fatigué, un flexible qui suinte : je répare avec des pièces que je garde en stock dans le camion, pour ne pas revenir deux fois.',
    matiere: 'cuivre',
    legende: 'joint refait, plus une goutte',
  },
  {
    slug: 'salle-de-bain',
    titre: 'Salle de bain complète',
    resume: 'De la dépose à la dernière ligne de joint : plomberie, douche à l’italienne, carrelage coordonné.',
    detail:
      'Une salle de bain se pense avec les pentes, les évacuations et les points d’eau avant de choisir le carrelage. Je coordonne les corps d’état pour que le chantier tienne dans les deux à trois semaines annoncées.',
    matiere: 'zellige',
    legende: 'receveur posé à niveau',
  },
  {
    slug: 'chauffage',
    titre: 'Chauffage & chaudière',
    resume: 'Remplacement de chaudière gaz, entretien annuel, désembouage des radiateurs.',
    detail:
      'Une chaudière bien réglée consomme moins et dure plus longtemps. J’installe des modèles à condensation dimensionnés pour le logement, pas surdimensionnés « pour être tranquille ».',
    matiere: 'fonte',
    legende: 'circuit équilibré, radiateur par radiateur',
  },
  {
    slug: 'chauffe-eau',
    titre: 'Chauffe-eau & ballon',
    resume: 'Diagnostic, remplacement et raccordement de ballons électriques ou thermodynamiques.',
    detail:
      'Un ballon se choisit selon le nombre de personnes et la place disponible. Je vérifie le groupe de sécurité, la pression du réseau et l’état des arrivées avant de poser.',
    matiere: 'inox',
    legende: 'groupe de sécurité neuf',
  },
  {
    slug: 'renovation-reseau',
    titre: 'Rénovation de réseau',
    resume: 'Remplacement des canalisations plomb ou acier par du cuivre ou du PER, sans tout casser.',
    detail:
      'Dans les immeubles anciens de la Presqu’île, les colonnes en plomb sont encore fréquentes. Je remplace tronçon par tronçon, en gardant l’eau le soir dans l’appartement.',
    matiere: 'laiton',
    legende: 'colonne remplacée, eau claire',
  },
  {
    slug: 'cuisine',
    titre: 'Raccordements cuisine',
    resume: 'Évier, lave-vaisselle, arrivée gaz : raccordements propres et aux normes.',
    detail:
      'Un raccordement cuisine, c’est vingt minutes quand c’est bien préparé et une journée quand il faut reprendre l’évacuation. Je passe voir avant pour vous dire lequel des deux vous attend.',
    matiere: 'pierre',
    legende: 'siphon accessible, enfin',
  },
];

export const CERTIFICATIONS: readonly string[] = [
  'Qualibat 5112',
  'RGE Qualit’EnR',
  'PG Installateur gaz',
  'Garantie décennale',
];

/** Communes desservies, avec position sur le croquis (angle en degrés, distance 0-1). */
export const COMMUNES: readonly Commune[] = [
  { nom: 'Villeurbanne', angle: 40, distance: 0.35 },
  { nom: 'Caluire-et-Cuire', angle: 95, distance: 0.4 },
  { nom: 'Écully', angle: 150, distance: 0.45 },
  { nom: 'Tassin-la-Demi-Lune', angle: 185, distance: 0.5 },
  { nom: 'Oullins', angle: 235, distance: 0.45 },
  { nom: 'Saint-Fons', angle: 280, distance: 0.6 },
  { nom: 'Vénissieux', angle: 305, distance: 0.55 },
  { nom: 'Bron', angle: 350, distance: 0.6 },
  { nom: 'Vaulx-en-Velin', angle: 20, distance: 0.7 },
  { nom: 'Rillieux-la-Pape', angle: 75, distance: 0.8 },
];

export const HORAIRES: readonly { jours: string; heures: string }[] = [
  { jours: 'Lundi – vendredi', heures: '7h30 – 19h' },
  { jours: 'Samedi', heures: '8h – 13h' },
  { jours: 'Urgences', heures: '7 j / 7' },
];

export const ADRESSE = { rue: '14 rue des Tanneurs', codePostal: '69004', ville: VILLE };

/* ----------------------------------------------------------------------------
   Types (ne pas modifier pour décliner le template)
   ---------------------------------------------------------------------------- */

export type Matiere = 'cuivre' | 'zellige' | 'fonte' | 'inox' | 'laiton' | 'pierre' | 'chene' | 'terre';

export interface Service {
  slug: string;
  titre: string;
  resume: string;
  detail: string;
  /** clé de la texture d'échantillon (public/images/matiere-<matiere>.webp) */
  matiere: Matiere;
  /** légende manuscrite affichée au survol */
  legende: string;
}

export interface Commune {
  nom: string;
  angle: number;
  distance: number;
}

/* Valeurs dérivées ---------------------------------------------------------- */
export const ANNEES_EXPERIENCE = new Date().getFullYear() - ANNEE_CREATION;
export const TELEPHONE_HREF = `tel:+33${TELEPHONE.replace(/\s/g, '').replace(/^0/, '')}`;
export const METIER_LABEL: Record<Metier, string> = {
  plomberie: 'Plombier-chauffagiste',
  electricite: 'Électricien',
  maconnerie: 'Maçon',
  menuiserie: 'Menuisier',
  renovation: 'Entreprise de rénovation',
};
