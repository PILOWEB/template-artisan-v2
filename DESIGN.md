# Carnet de chantier — Conception

## 1. Concept créatif (une phrase)

**Le site se lit comme le carnet de chantier de l'artisan : des pages de papier grainé,
des échantillons de matière, des annotations manuscrites, et un fil ocre qui coud
les pages entre elles du premier au dernier écran.**

Tout découle de là : le fil conducteur au scroll est une couture, les services sont
des échantillons de matière empilés sur la table, les chiffres tournent comme un
compteur mécanique d'atelier, la carte de zone est un croquis au crayon.

Option écartée : « la vitrine d'atelier » (photos plein cadre, noir et cuivre).
Plus spectaculaire, mais moins différenciante et moins lisible en urgence sur mobile.

## 2. Système de design

### Couleurs (tokens nommés par usage)

| Token | Valeur | Usage |
|---|---|---|
| `--color-surface` | #F4EFE7 | fond principal (papier) |
| `--color-surface-deep` | #EAE0D2 | fond alterné (sable) |
| `--color-ink` | #241C15 | texte principal |
| `--color-ink-soft` | #241C15 / 68 % | texte secondaire |
| `--color-accent` | `COULEUR_ACCENT` (#B4522E) | actions, curseur, mots italiques |
| `--color-ochre` | #8A6A2F | fil conducteur, filets, numéros |
| `--color-olive` | #4E5A3C | secondaire, états de succès |
| `--color-line` | ochre à 35 % | filets fins (jamais d'ombre portée) |

Contraste : ink sur surface = 13.9:1, accent sur surface = 5.1:1, ochre sur surface = 5.0:1 (AA).

### Typographie

- Display : **Fraunces** (variable, axes opsz/wght/SOFT), interlettrage -0.03em, italique
  sur un mot par phrase.
- Corps : **Inter** (variable), 16 px de base, interlignage 1.6.
- Manuscrit : **Caveat** pour les légendes d'échantillons uniquement.

Échelle modulaire, ratio **1.333** (quarte juste) depuis 16 px :

| Token | Taille | Usage |
|---|---|---|
| `--text-sm` | 12 → 13.5 px | surtitres, mentions |
| `--text-base` | 16 px | corps |
| `--text-md` | 21.3 px | intro, citations |
| `--text-lg` | 28.4 px | H3 |
| `--text-xl` | 37.9 px | H2 mobile |
| `--text-2xl` | 50.5 px | H2 |
| `--text-3xl` | 67.3 px | H1 tablette |
| `--text-4xl` | 89.8 → 120 px | H1, chiffres clés, logo footer (fluide) |

### Espacements (base 8 px)

`--space-1` 8 · `--space-2` 16 · `--space-3` 24 · `--space-4` 32 · `--space-6` 48 ·
`--space-8` 64 · `--space-12` 96 · `--space-16` 128 · `--space-24` 192.

### Grille

12 colonnes, gouttière 24 px, marges `clamp(16px, 5vw, 96px)`. Les blocs s'alignent sur
des colonnes décalées (ex. texte col. 2-6, image col. 8-12) et alternent avec des
bandes pleine largeur. Jamais deux sections consécutives avec la même composition.

### Matière

- Grain papier : SVG `feTurbulence` en overlay fixe, opacité 5 %, `mix-blend-mode: multiply`.
- Bords irréguliers : `clip-path: polygon()` légèrement déformé sur les blocs sable
  et les échantillons.
- Filets ocre 1 px au lieu d'ombres. Aucun `border-radius` uniforme ; coins vifs ou
  légèrement arrondis (2 px) sur les échantillons seulement.

### Mouvement

- Courbes : `CustomEase` nommées `out-expo`, `out-quart`, `in-out-quart`, `spring-soft`,
  jamais `power1.out` par défaut.
- Durées 0,4 à 0,9 s. Cascades 60 ms.
- `prefers-reduced-motion` : `gsap.matchMedia()` court-circuite toutes les timelines,
  tout le contenu est visible sans animation ; Lenis désactivé.

## 3. Maquette section par section

1. **Hero** (100 vh). Grille 12 : surtitre + H1 col. 1-8 en bas à gauche, zone
   d'intervention + deux actions col. 1-5 ; scène 3D col. 6-12 derrière le titre.
   Le H1 se compose mot par mot après le rideau. Indicateur « Faire défiler » à droite.
2. **Bandeau** pleine largeur, sable, texte défilant certifications · zones · années.
3. **Le métier**. Texte col. 2-6 (à la première personne), photo verticale col. 8-12
   décalée vers le haut de 96 px, parallaxe 8 %. Filet ocre vertical col. 7.
4. **Services**. Section épinglée : les échantillons partent en pile, s'ouvrent en
   éventail puis se rangent en grille asymétrique (2 grandes, 4 moyennes).
5. **Réalisations**. Galerie asymétrique : un grand avant/après col. 1-8, deux petits
   col. 9-12 décalés, un troisième col. 3-10 en dessous.
6. **Méthode**. Le fil ocre traverse 4 étapes disposées en zigzag (col. 1-5 puis 7-11),
   chaque nœud s'allume quand le fil l'atteint.
7. **Chiffres**. Bande sable, 3 compteurs mécaniques très grands, alignés à gauche,
   décalés verticalement.
8. **Témoignages**. Section épinglée courte, défilement horizontal infini piloté par
   le scroll, vitesse liée à la vélocité.
9. **Zone**. Croquis SVG col. 7-12 (anneaux concentriques, communes en points),
   liste des communes col. 1-5.
10. **Devis**. Formulaire à révélation progressive col. 2-8, aparté téléphone col. 9-12.
11. **Pied de page**. Logo typographique pleine largeur, horaires, mentions, tel:.
12. **Barre d'appel** fixe en bas, < 1024 px.

## 4. Choix discutables et arbitrages

- **3D procédurale plutôt qu'un GLTF** : poids ≈ 0 ko d'assets, objet piloté par
  `METIER`, pas de pipeline Blender à maintenir pour chaque client. Retenu.
- **Profondeur de champ** : un vrai DoF (postprocessing) coûte ~150 ko et du GPU sur
  portable. Retenu : brouillard chaud + plan de fond flouté, effet perçu équivalent.
- **Scroll hijack témoignages** : épinglage limité à 150 % de viewport pour ne pas
  bloquer le visiteur pressé. Retenu.
- **View transitions** : natives (`Link viewTransition` de React Router 7) avec repli
  sans animation sur Firefox. Retenu plutôt qu'une lib de transition tierce.
