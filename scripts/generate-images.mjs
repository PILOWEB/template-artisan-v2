/* Génère des images WebP procédurales (matières, chantiers, portrait, hero).
   Ce sont des visuels de démonstration : à remplacer par les photos du client,
   en gardant les mêmes noms de fichiers. */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = new URL('../public/images/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// --- bruit de valeur + fbm ---------------------------------------------------
function hash(x, y, seed) {
  let h = (x * 374761393 + y * 668265263 + seed * 1274126177) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
const smooth = (t) => t * t * (3 - 2 * t);
function noise(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
  const u = smooth(xf), v = smooth(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, seed, oct = 4) {
  let s = 0, amp = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += amp * noise(x * f, y * f, seed + i); amp *= 0.5; f *= 2.1; }
  return s;
}
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const clamp = (v) => Math.max(0, Math.min(255, v));

async function render(name, w, h, fn, quality = 76) {
  const buf = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b] = fn(x / w, y / h, x, y);
      const i = (y * w + x) * 3;
      buf[i] = clamp(r); buf[i + 1] = clamp(g); buf[i + 2] = clamp(b);
    }
  }
  await sharp(buf, { raw: { width: w, height: h, channels: 3 } }).webp({ quality }).toFile(OUT + name);
  console.log('•', name);
}

const grain = (x, y, seed, amt = 10) => (hash(x, y, seed) - 0.5) * amt;

// --- matières ----------------------------------------------------------------
const MATIERES = {
  cuivre: (u, v, x, y) => {
    const streak = fbm(u * 3, v * 40, 1) * 0.6 + fbm(u * 8, v * 8, 2) * 0.4;
    const base = mix(hex('#8f4a25'), hex('#d98a55'), streak);
    return base.map((c) => c + grain(x, y, 3, 14));
  },
  zellige: (u, v, x, y) => {
    const n = 6; const gx = (u * n) % 1, gy = (v * n * 1.25) % 1;
    const edge = Math.min(gx, 1 - gx, gy, 1 - gy) < 0.05 ? 1 : 0;
    const tile = hash(Math.floor(u * n), Math.floor(v * n * 1.25), 5);
    const glaze = fbm(u * 12, v * 12, 6);
    const col = mix(mix(hex('#4e5a3c'), hex('#7c8a5c'), tile * 0.6), hex('#e8e2cf'), glaze * 0.35);
    return mix(col, hex('#e6dcc8'), edge * 0.8).map((c) => c + grain(x, y, 7, 8));
  },
  fonte: (u, v, x, y) => {
    const n = fbm(u * 10, v * 10, 8, 5);
    return mix(hex('#2a2622'), hex('#5b544c'), n).map((c) => c + grain(x, y, 9, 22));
  },
  inox: (u, v, x, y) => {
    const streak = fbm(u * 2, v * 60, 10) * 0.7 + fbm(u * 6, v * 6, 11) * 0.3;
    return mix(hex('#8c8a84'), hex('#d9d6cf'), streak).map((c) => c + grain(x, y, 12, 8));
  },
  laiton: (u, v, x, y) => {
    const streak = fbm(u * 40, v * 3, 13) * 0.5 + fbm(u * 5, v * 5, 14) * 0.5;
    return mix(hex('#8a6a2f'), hex('#d9b96a'), streak).map((c) => c + grain(x, y, 15, 12));
  },
  pierre: (u, v, x, y) => {
    const n = fbm(u * 6, v * 6, 16, 5); const spots = fbm(u * 30, v * 30, 17) > 0.62 ? 0.15 : 0;
    return mix(hex('#c9b99a'), hex('#eee4d2'), n - spots).map((c) => c + grain(x, y, 18, 16));
  },
  chene: (u, v, x, y) => {
    const ring = Math.sin((u * 3 + fbm(u * 2, v * 2, 19) * 1.5) * 12) * 0.5 + 0.5;
    return mix(hex('#8a5a2f'), hex('#c9945a'), ring * 0.7 + fbm(u * 20, v * 20, 20) * 0.3).map((c) => c + grain(x, y, 21, 10));
  },
  terre: (u, v, x, y) => {
    const n = fbm(u * 5, v * 5, 22, 5);
    return mix(hex('#9a4526'), hex('#c8734a'), n).map((c) => c + grain(x, y, 23, 18));
  },
};

// --- chantiers avant / après --------------------------------------------------
function avant(seed) {
  return (u, v, x, y) => {
    const plaster = fbm(u * 8, v * 8, seed, 5);
    const crack = Math.abs(fbm(u * 4, v * 4, seed + 40) - 0.5) < 0.012 ? 0.5 : 0;
    const stain = fbm(u * 3, v * 3, seed + 80) > 0.6 ? 0.2 : 0;
    const col = mix(hex('#8e857a'), hex('#c4bbad'), plaster - crack - stain);
    return col.map((c) => c + grain(x, y, seed, 20));
  };
}
function apres(seed, a = '#d9c7a8', b = '#f1e8d8', tiles = 8) {
  return (u, v, x, y) => {
    const gx = (u * tiles) % 1, gy = (v * tiles * 0.75) % 1;
    const edge = Math.min(gx, 1 - gx, gy, 1 - gy) < 0.035 ? 1 : 0;
    const t = hash(Math.floor(u * tiles), Math.floor(v * tiles * 0.75), seed);
    const light = 1 - v * 0.35 + (1 - u) * 0.1;
    const col = mix(mix(hex(a), hex(b), t * 0.5 + fbm(u * 10, v * 10, seed) * 0.3), hex('#f4efe7'), light * 0.15);
    return mix(col, hex('#b9a98c'), edge * 0.5).map((c) => c + grain(x, y, seed + 1, 8));
  };
}

// --- exécution ---------------------------------------------------------------
for (const [name, fn] of Object.entries(MATIERES)) await render(`matiere-${name}.webp`, 720, 900, fn);

await render('chantier-1-avant.webp', 1200, 900, avant(101));
await render('chantier-1-apres.webp', 1200, 900, apres(102, '#7c8a5c', '#e8e2cf', 10));
await render('chantier-2-avant.webp', 900, 900, avant(201));
await render('chantier-2-apres.webp', 900, 900, apres(202, '#d9d6cf', '#8c8a84', 3));
await render('chantier-3-avant.webp', 900, 900, avant(301));
await render('chantier-3-apres.webp', 900, 900, apres(302, '#d98a55', '#f1e8d8', 4));
await render('chantier-4-avant.webp', 1200, 800, avant(401));
await render('chantier-4-apres.webp', 1200, 800, apres(402, '#c9b99a', '#eee4d2', 6));

await render('portrait-metier.webp', 900, 1200, (u, v, x, y) => {
  const vignette = 1 - Math.hypot(u - 0.5, v - 0.45) * 1.1;
  const cloth = fbm(u * 30, v * 30, 500) * 0.25;
  const fig = Math.hypot((u - 0.5) * 1.6, (v - 0.55) * 0.9) < 0.42 ? 1 : 0;
  const col = mix(mix(hex('#3a2e24'), hex('#8a6a2f'), vignette * 0.6 + cloth), hex('#241c15'), fig * 0.55);
  return col.map((c) => c + grain(x, y, 501, 16));
}, 72);

await render('hero-static.webp', 1400, 1000, (u, v, x, y) => {
  const warm = fbm(u * 3, v * 3, 600, 5);
  const ring = Math.abs(Math.hypot((u - 0.62) * 1.3, v - 0.5) - 0.28) < 0.05 ? 0.35 : 0;
  const col = mix(mix(hex('#eae0d2'), hex('#c8734a'), warm * 0.5), hex('#8a6a2f'), ring);
  return col.map((c) => c + grain(x, y, 601, 10));
}, 70);

await render('og-image.webp', 1200, 630, (u, v, x, y) => {
  const warm = fbm(u * 3, v * 3, 700, 4);
  return mix(hex('#f4efe7'), hex('#eae0d2'), warm).map((c) => c + grain(x, y, 701, 8));
}, 70);

console.log('done');
