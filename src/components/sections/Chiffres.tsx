/* 7. Chiffres clés : trois compteurs mécaniques, alignés à gauche, décalés. */
import { CHIFFRES } from '@/data/content';
import { MechanicalCounter } from '@/components/ui/MechanicalCounter';

export function Chiffres() {
  return (
    <section className="container-grid relative py-24 md:py-36" aria-label="Chiffres clés">
      <div className="col-span-12 md:col-span-3 md:col-start-1" data-thread>
        <p className="eyebrow">En chiffres</p>
      </div>
      <dl className="col-span-12 mt-10 grid grid-cols-1 gap-12 md:col-span-9 md:mt-0 md:grid-cols-3 md:gap-8">
        {CHIFFRES.map((c, i) => (
          <div key={c.legende} className={`border-t border-line pt-6 ${i === 1 ? 'md:mt-16' : ''} ${i === 2 ? 'md:mt-32' : ''}`}>
            <dd className="display text-3xl md:text-4xl">
              <MechanicalCounter value={c.valeur} suffix={c.suffixe} />
            </dd>
            <dt className="mt-3 font-body text-base text-ink-soft">{c.legende}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
