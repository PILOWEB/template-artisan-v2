/* 10. Formulaire de devis : champs révélés un par un dès que le précédent est
   valide, validation inline, état de succès animé (coche qui se dessine).
   Sans backend : renseignez ENDPOINT_DEVIS pour poster vers votre service. */
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { EMAIL, LISTE_SERVICES, TELEPHONE, TELEPHONE_HREF } from '@/config/site.config';
import { gsap, registerEases } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SplitReveal } from '@/components/ui/SplitReveal';

/** URL de réception du formulaire (Formspree, Netlify, API maison…). Vide = simulation. */
export const ENDPOINT_DEVIS = '';

type Field = 'nom' | 'telephone' | 'prestation' | 'ville' | 'message';
const ORDER: Field[] = ['nom', 'telephone', 'prestation', 'ville', 'message'];

const validate: Record<Field, (v: string) => string | null> = {
  nom: (v) => (v.trim().length >= 2 ? null : 'Votre nom, pour savoir à qui je parle.'),
  telephone: (v) => (/^(\+33|0)[1-9](\s?\d{2}){4}$/.test(v.trim()) ? null : 'Un numéro français à 10 chiffres, s’il vous plaît.'),
  prestation: (v) => (v ? null : 'Choisissez la prestation la plus proche.'),
  ville: (v) => (v.trim().length >= 2 ? null : 'La commune du chantier.'),
  message: (v) => (v.trim().length >= 10 ? null : 'Quelques mots sur le problème ou le projet (10 caractères minimum).'),
};

const LABELS: Record<Field, string> = {
  nom: 'Votre nom',
  telephone: 'Votre téléphone',
  prestation: 'La prestation',
  ville: 'La commune du chantier',
  message: 'Le contexte, en quelques lignes',
};

export function Devis() {
  const reduced = usePrefersReducedMotion();
  const [values, setValues] = useState<Record<Field, string>>({ nom: '', telephone: '', prestation: '', ville: '', message: '' });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Nombre de champs visibles : jusqu'au premier champ invalide inclus
  let visible = 1;
  for (let i = 0; i < ORDER.length; i++) {
    if (validate[ORDER[i]](values[ORDER[i]]) === null) visible = i + 2; else break;
  }
  visible = Math.min(visible, ORDER.length);
  const allValid = ORDER.every((f) => validate[f](values[f]) === null);

  useEffect(() => {
    if (reduced) return;
    registerEases();
    const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${ORDER[visible - 1]}"]`);
    if (el && el.dataset.shown !== '1') {
      el.dataset.shown = '1';
      gsap.fromTo(el, { y: 20, opacity: 0, height: 0 }, { y: 0, opacity: 1, height: 'auto', duration: 0.7, ease: 'out-expo', clearProps: 'height' });
    }
  }, [visible, reduced]);

  useEffect(() => {
    if (status !== 'done' || reduced) return;
    const root = successRef.current!;
    const path = root.querySelector<SVGPathElement>('path')!;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.timeline()
      .fromTo(root, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'out-expo' })
      .to(path, { strokeDashoffset: 0, duration: 0.7, ease: 'in-out-quart' }, '-=0.2')
      .fromTo(root.querySelectorAll('.s-in'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'out-expo', stagger: 0.08 }, '-=0.3');
  }, [status, reduced]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(Object.fromEntries(ORDER.map((f) => [f, true])));
    if (!allValid) return;
    setStatus('sending');
    try {
      if (ENDPOINT_DEVIS) {
        const res = await fetch(ENDPOINT_DEVIS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const set = (f: Field, v: string) => setValues((s) => ({ ...s, [f]: v }));
  const err = (f: Field) => (touched[f] ? validate[f](values[f]) : null);
  const inputCls = 'w-full border-0 border-b border-line bg-transparent px-0 py-3 font-body text-md text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none transition-colors duration-300';

  return (
    <section id="devis" className="relative bg-surface-deep py-24 torn-alt md:py-40" aria-labelledby="devis-title">
      <div className="container-grid">
        <div className="col-span-12 md:col-span-7 md:col-start-2" data-thread>
          <p className="eyebrow mb-6">Demander un devis</p>
          <SplitReveal as="h2" id="devis-title" lines={['Dites-moi ce qui', 'ne va *pas*.']} className="text-xl md:text-2xl" />
          <p className="mt-6 font-body text-base text-ink-soft">Une question à la fois. Je vous rappelle sous 48 h avec un chiffrage ou un créneau.</p>

          {status === 'done' ? (
            <div ref={successRef} className="mt-12 flex items-start gap-6" role="status">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                <circle cx="28" cy="28" r="27" stroke="var(--color-olive)" opacity="0.4" />
                <path d="M16 29l8 8 16-18" stroke="var(--color-olive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="s-in font-display text-lg">Reçu, {values.nom.split(' ')[0]}.</p>
                <p className="s-in mt-2 max-w-md font-body text-base text-ink-soft">Je vous rappelle au {values.telephone} sous 48 h. Si c’est urgent, le téléphone reste le plus court chemin.</p>
                <a className="s-in link-draw mt-4 inline-block font-body text-base" href={TELEPHONE_HREF} data-cursor="Appeler">{TELEPHONE}</a>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-12 space-y-8">
              {ORDER.slice(0, visible).map((f, i) => (
                <div key={f} data-field={f} className="overflow-hidden" style={{ opacity: reduced || i === 0 ? 1 : undefined }}>
                  <label htmlFor={`f-${f}`} className="block font-body text-sm uppercase tracking-[0.14em] text-ochre">
                    <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span> — {LABELS[f]}
                  </label>
                  {f === 'prestation' ? (
                    <select id={`f-${f}`} value={values[f]} onChange={(e) => set(f, e.target.value)} onBlur={() => setTouched((t) => ({ ...t, [f]: true }))} className={`${inputCls} appearance-none`} aria-invalid={!!err(f)} aria-describedby={err(f) ? `e-${f}` : undefined} autoFocus={i > 0}>
                      <option value="">Choisir…</option>
                      {LISTE_SERVICES.map((s) => <option key={s.slug} value={s.slug}>{s.titre}</option>)}
                      <option value="autre">Autre chose</option>
                    </select>
                  ) : f === 'message' ? (
                    <textarea id={`f-${f}`} rows={3} value={values[f]} onChange={(e) => set(f, e.target.value)} onBlur={() => setTouched((t) => ({ ...t, [f]: true }))} className={`${inputCls} resize-none`} placeholder="Une fuite sous l’évier depuis hier, l’eau est coupée." aria-invalid={!!err(f)} aria-describedby={err(f) ? `e-${f}` : undefined} autoFocus />
                  ) : (
                    <input
                      id={`f-${f}`} type={f === 'telephone' ? 'tel' : 'text'} value={values[f]}
                      autoComplete={f === 'nom' ? 'name' : f === 'telephone' ? 'tel' : f === 'ville' ? 'address-level2' : undefined}
                      onChange={(e) => set(f, e.target.value)} onBlur={() => setTouched((t) => ({ ...t, [f]: true }))}
                      className={inputCls} placeholder={f === 'nom' ? 'Marion Dupuis' : f === 'telephone' ? '06 12 34 56 78' : 'Lyon 4e'}
                      aria-invalid={!!err(f)} aria-describedby={err(f) ? `e-${f}` : undefined} autoFocus={i > 0}
                    />
                  )}
                  <p id={`e-${f}`} className={`mt-2 min-h-[1.25rem] font-body text-sm transition-opacity duration-300 ${err(f) ? 'text-accent opacity-100' : 'opacity-0'}`} aria-live="polite">{err(f) ?? ' '}</p>
                </div>
              ))}
              {visible === ORDER.length && (
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <button type="submit" disabled={status === 'sending'} data-cursor="Envoyer" className="inline-flex items-center gap-3 bg-accent px-6 py-4 font-body text-base font-medium text-accent-ink transition-colors duration-500 [transition-timing-function:var(--ease-out-expo)] hover:bg-ink disabled:opacity-60">
                    {status === 'sending' ? 'Envoi…' : 'Envoyer la demande'}
                  </button>
                  {status === 'error' && <p className="font-body text-sm text-accent" role="alert">L’envoi a échoué. Appelez-moi au {TELEPHONE} ou écrivez à {EMAIL}.</p>}
                </div>
              )}
            </form>
          )}
        </div>
        <aside className="col-span-12 mt-16 border-t border-line pt-8 md:col-span-3 md:col-start-10 md:mt-0 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <p className="font-body text-sm uppercase tracking-[0.14em] text-ochre">Plus rapide</p>
          <a href={TELEPHONE_HREF} data-cursor="Appeler" className="link-draw mt-4 inline-block font-display text-lg">{TELEPHONE}</a>
          <p className="mt-4 font-body text-base text-ink-soft">Pour une urgence, appelez directement. Je réponds ou je rappelle dans l’heure.</p>
          <a href={`mailto:${EMAIL}`} className="link-draw mt-6 inline-block font-body text-base">{EMAIL}</a>
        </aside>
      </div>
    </section>
  );
}
