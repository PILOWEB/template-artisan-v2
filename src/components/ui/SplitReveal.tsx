/* Titre découpé mot par mot. Chaque mot monte depuis un masque de ligne avec un
   décalage de 60 ms et un ressort doux. Un mot entouré d'astérisques (*mot*)
   devient l'accent italique. Au redimensionnement, les mots se recomposent
   avec un très léger décalage. */
import { createElement, useLayoutEffect, useMemo, useRef, type ElementType } from 'react';
import { gsap, registerEases, STAGGER } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface Props {
  as?: ElementType;
  lines: string[];
  className?: string;
  /** 'ready' : joue quand `play` passe à true ; 'scroll' : à l'entrée dans le viewport. */
  trigger?: 'ready' | 'scroll';
  play?: boolean;
  delay?: number;
  id?: string;
}

interface Token { text: string; italic: boolean; space: boolean }

/** Découpe en mots ; un mot composé (« Plombier-chauffagiste ») donne deux
    fragments masqués séparément pour que la césure au tiret reste possible. */
function parse(line: string): Token[] {
  const out: Token[] = [];
  const words = line.split(' ').filter(Boolean);
  words.forEach((w, wi) => {
    const italic = /^\*.+\*[,.;:!?]*$/.test(w);
    const clean = italic ? w.replace(/\*/g, '') : w;
    const parts = clean.split(/(?<=-)/);
    parts.forEach((p, pi) => out.push({ text: p, italic, space: pi === parts.length - 1 && wi < words.length - 1 }));
  });
  return out;
}

export function SplitReveal({ as: Tag = 'h2', lines, className = '', trigger = 'scroll', play = true, delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const words = useMemo(() => lines.map(parse), [lines]);
  const played = useRef(false);

  useLayoutEffect(() => {
    if (reduced) return;
    registerEases();
    const el = ref.current!;
    const ws = el.querySelectorAll<HTMLElement>('.w');
    if (!played.current) gsap.set(ws, { yPercent: 110, rotate: 3 });
    if (trigger === 'ready' && !play) return;
    const anim = () => {
      played.current = true;
      gsap.to(ws, { yPercent: 0, rotate: 0, duration: 0.9, ease: 'spring-soft', stagger: STAGGER, delay, overwrite: true });
    };
    let st: ScrollTrigger | undefined;
    if (trigger === 'ready') anim();
    else st = gsap.context(() => { gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true, onEnter: anim } }); }).data[0]?.scrollTrigger;

    // Recomposition légère au resize
    let t: number | undefined;
    const onResize = () => {
      if (!played.current) return;
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        gsap.fromTo(ws, { y: 6, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.45, ease: 'out-expo', stagger: 0.02, overwrite: 'auto' });
      }, 180);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); st?.kill(); };
  }, [reduced, trigger, play, delay]);

  const children = words.map((line, li) => (
    <span key={li} className="block">
      {line.map((w, wi) => (
        <span key={wi} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <span className={`w inline-block will-change-transform ${w.italic ? 'accent-word' : ''}`}>{w.text}</span>
          {w.space ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  ));
  return createElement(Tag, { ref, id, className }, children);
}
