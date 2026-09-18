/* Enregistrement GSAP + courbes d'accélération maison. Jamais d'ease par défaut. */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

let registered = false;
export function registerEases() {
  if (registered) return;
  registered = true;
  CustomEase.create('out-expo', '0.16, 1, 0.3, 1');
  CustomEase.create('out-quart', '0.25, 1, 0.5, 1');
  CustomEase.create('in-out-quart', '0.76, 0, 0.24, 1');
  CustomEase.create('in-quart', '0.5, 0, 0.75, 0');
  // Ressort doux : léger dépassement puis retour, pour les mots du hero
  CustomEase.create('spring-soft', 'M0,0 C0.14,0 0.24,0.42 0.34,0.78 0.44,1.06 0.56,1.04 0.7,1.01 0.84,0.995 0.92,1 1,1');
  // Accélération asymétrique : départ franc, arrivée longue
  CustomEase.create('asym', 'M0,0 C0.05,0.35 0.15,0.85 0.4,0.95 0.6,1.01 0.8,1 1,1');
  gsap.defaults({ ease: 'out-quart', duration: 0.7 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const DUR = {
  fast: 0.4,
  base: 0.6,
  slow: 0.9,
} as const;

export const STAGGER = 0.06;

export { gsap, ScrollTrigger };
