import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/inter';
import '@fontsource/caveat';
import '@/styles/index.css';
import { COULEUR_ACCENT } from '@/config/site.config';
import App from '@/App';

document.documentElement.style.setProperty('--accent', COULEUR_ACCENT);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
