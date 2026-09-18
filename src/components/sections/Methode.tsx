/* 6. Méthode : 4 étapes en zigzag, reliées par le fil conducteur. Chaque nœud
   s'allume quand la pointe du fil l'atteint (data-lit posé par ScrollThread). */
import { useRef } from 'react';
import { METHODE } from '@/data/content';
import { SplitReveal } from '@/components/ui/SplitReveal';
import { gsap } from '@/lib/motion';
import { useMotion } from '@/hooks/useMotion';

export function Methode() {
  const ref = useRef<HTMLElement>(null);
  useMotion(({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(ref);
    q('.step').forEach((el) => {
      gsap.fromTo(el.querySelectorAll('.step-in'), { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: 'out-expo', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
    });
  }, [], ref);

  return (
    <section ref={ref} id="methode" className="relative bg-surface-deep py-24 md:py-40" aria-labelledby="methode-title">
      <div className="container-grid">
        <div className="col-span-12 md:col-span-7 md:col-start-2">
          <p className="eyebrow mb-6">Notre méthode</p>
          <SplitReveal as="h2" id="methode-title" lines={['Quatre étapes,', 'toujours dans cet *ordre*.']} className="text-xl md:text-2xl" />
        </div>
        <ol className="col-span-12 mt-20 grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-y-24" role="list">
          {METHODE.map((step, i) => (
            <li key={step.numero} className={`step relative md:col-span-5 ${i % 2 === 0 ? 'md:col-start-1' : 'md:col-start-7'} ${i === 1 || i === 3 ? 'md:-mt-8' : ''}`}>
              <div className="flex items-start gap-6">
                <span
                  data-thread data-thread-node data-lit="false"
                  className="node relative z-10 mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line-strong font-display text-md tabular-nums text-ochre transition-[background-color,color,border-color,transform] duration-500 [transition-timing-function:var(--ease-out-expo)] data-[lit=true]:scale-110 data-[lit=true]:border-accent data-[lit=true]:bg-accent data-[lit=true]:text-accent-ink"
                  aria-hidden="true"
                >
                  {step.numero}
                  <span className="absolute inset-0 rounded-full border border-accent opacity-0 transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-out-expo)] [.node[data-lit=true]_&]:scale-[1.6] [.node[data-lit=true]_&]:opacity-0 [.node[data-lit=true]_&]:[transition-delay:0ms]" />
                </span>
                <div>
                  <span className="sr-only">Étape {step.numero} : </span>
                  <h3 className="step-in text-lg">{step.titre}</h3>
                  <p className="step-in mt-4 font-body text-base text-ink-soft">{step.texte}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
