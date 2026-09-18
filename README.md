# Carnet de chantier — template de site vitrine pour artisans du bâtiment

Template React 19 + TypeScript + Vite, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis,
Three.js (react-three-fiber). Conçu pour être décliné client par client en ne
modifiant qu'un seul fichier.

Le concept, le système de design et la maquette sont décrits dans [DESIGN.md](./DESIGN.md).

## Décliner le template pour un client

1. Ouvrir `src/config/site.config.ts` et remplacer les variables :
   `NOM_ENTREPRISE`, `METIER`, `BASELINE`, `VILLE`, `ZONE_INTERVENTION`, `TELEPHONE`,
   `EMAIL`, `ANNEE_CREATION`, `NB_CHANTIERS`, `LISTE_SERVICES[]`, `CERTIFICATIONS[]`,
   `COULEUR_ACCENT`, plus `COMMUNES[]`, `HORAIRES[]` et `ADRESSE`.
2. Adapter les textes de démonstration dans `src/data/content.ts` (métier, réalisations,
   méthode, témoignages).
3. Remplacer les images dans `public/images/` en gardant les noms de fichiers :
   `matiere-<matiere>.webp`, `chantier-N-avant.webp` / `chantier-N-apres.webp`,
   `portrait-metier.webp`, `hero-static.webp`, `og-image.webp`.
   Les visuels livrés sont procéduraux (`npm run images` les régénère).
4. Renseigner `ENDPOINT_DEVIS` dans `src/components/sections/Devis.tsx` pour brancher le
   formulaire (Formspree, Netlify Forms, API maison). Vide, l'envoi est simulé.
5. Compléter `src/pages/Mentions.tsx` (SIRET, hébergeur, assureur).

La valeur de `METIER` pilote l'objet 3D du hero (`plomberie`, `electricite`, `maconnerie`,
`menuiserie`, `renovation`) et le libellé affiché dans les balises SEO.

## Commandes

```bash
npm install
npm run dev        # développement
npm run build      # typecheck + build de production dans dist/
npm run preview    # prévisualisation du build
npm run images     # régénère les images WebP de démonstration
```

## Structure

```
src/
  config/site.config.ts     variables métier (seul fichier à éditer pour décliner)
  data/content.ts           textes éditoriaux de démonstration
  styles/index.css          tokens (couleurs par usage, échelle typo 1.333, espacement 8 px)
  lib/motion.ts             GSAP, ScrollTrigger, courbes CustomEase maison
  lib/lenis.tsx             smooth scroll (désactivé si prefers-reduced-motion)
  hooks/                    useMotion (gsap.matchMedia), useSeo (title, meta, LocalBusiness)…
  components/ui/            Cursor, Preloader, SplitReveal, MagneticButton, BeforeAfter,
                            MechanicalCounter, ParallaxImage, ScrollThread
  components/three/         HeroScene (objet procédural par métier)
  components/sections/      les 10 sections de la page d'accueil
  components/layout/        Header, Footer, CallBar
  pages/                    Home, ServicePage (view transition), Mentions
```

## Accessibilité et performance

- `prefers-reduced-motion` : toutes les timelines sont coupées via `gsap.matchMedia`,
  Lenis est désactivé, le contenu reste intégralement lisible.
- Sous 768 px, la scène 3D est remplacée par `hero-static.webp` ; le paquet Three.js
  (≈ 235 ko gzip) n'est jamais téléchargé sur mobile (import dynamique, découpage
  `codeSplitting` dans `vite.config.ts`).
- Sur tactile : pas de Lenis (scroll natif), pas d'épinglage des témoignages, grain
  sans mode de fusion ni animation, aucun `backdrop-filter`, révélation avant/après
  par transformations composées (aucun repaint pendant le geste), tickers GSAP actifs
  uniquement quand la section est à l'écran, `ignoreMobileResize` pour la barre
  d'adresse.
- Curseur custom désactivé sur écrans tactiles.
- Lien d'évitement, focus visibles, slider avant/après pilotable au clavier,
  formulaire avec `aria-invalid` / `aria-describedby`.
- Données structurées `LocalBusiness`, `title` et `meta description` par ville,
  téléphone en lien `tel:`.
