/* 12. Barre d'appel fixe en bas, sous 1024 px : appel et devis en un geste. */
import { TELEPHONE_HREF } from '@/config/site.config';

export function CallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-2 border-t border-line bg-surface lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <a href={TELEPHONE_HREF} className="flex items-center justify-center gap-2 bg-accent py-4 font-body text-base font-medium text-accent-ink">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 1h3l1.5 3.5L5.5 6a8 8 0 004.5 4.5l1.5-2L15 10v3a1 1 0 01-1 1C7 14 2 9 2 2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
        Appeler
      </a>
      <a href="#devis" className="flex items-center justify-center py-4 font-body text-base font-medium text-ink">Demander un devis</a>
    </div>
  );
}
