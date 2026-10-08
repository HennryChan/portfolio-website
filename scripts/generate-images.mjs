// Genera las imágenes estáticas del sitio:
//   public/images/<nombre>-960.webp y -1600.webp  (a partir de cada archivo en images/)
//   public/og-es.png, public/og-en.png             (vista previa al compartir el enlace, 1200×630)
//   public/apple-touch-icon.png                    (ícono en iOS, 180×180)
// Uso: npm run images  (vuelve a ejecutarlo al agregar fotos o capturas, o al cambiar tu nombre o rol)
import { mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { chromium } from "@playwright/test";
import sharp from "sharp";

import { profile } from "../app/content/profile.ts";

/** Raíz del proyecto. */
const root = path.resolve(import.meta.dirname, "..");

// Fotos y capturas: images/siturq.png → public/images/siturq-960.webp y siturq-1600.webp.
// En el contenido se referencian por su nombre ("siturq"). Las transparencias se conservan.
/** Anchos de cada versión; coinciden con imageUrl() en project-shot.tsx. Nunca se amplía el original. */
const WIDTHS = [960, 1600];
/** Originales (no se publican). */
const originals = path.join(root, "images");
/** Versiones WebP que sí se publican. */
const optimized = path.join(root, "public/images");
await mkdir(optimized, { recursive: true });

for (const file of await readdir(originals)) {
  if (!/\.(png|jpe?g|webp|avif)$/i.test(file)) continue;
  const name = path.parse(file).name;
  for (const width of WIDTHS) {
    const target = path.join(optimized, `${name}-${width}.webp`);
    await sharp(path.join(originals, file))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80, alphaQuality: 90 })
      .toFile(target);
    const kb = Math.round((await stat(target)).size / 1024);
    console.log(`public/images/${name}-${width}.webp (${kb} KB)`);
  }
}

/** Mona Sans, la fuente del sitio (versión variable con eje de ancho). */
const fontFile = path.join(
  root,
  "node_modules/@fontsource-variable/mona-sans/files/mona-sans-latin-wdth-normal.woff2",
);
/** La fuente en base64: va incrustada para que las páginas temporales no dependan de rutas locales. */
const font = (await readFile(fontFile)).toString("base64");

/** Mismos colores que el tema claro de app/styles/app.css. */
const colors = {
  paper: "#edf0f3",
  ink: "#162033",
  inkSoft: "#4d586a",
  ui: "#5a4fd8",
  api: "#0b8f80",
  data: "#b8770f",
  infra: "#d2436f",
};

/** Nombres de las capas en cada idioma, como en app/i18n/ui.ts. */
const labels = {
  es: ["Interfaz", "API y servicios", "Datos", "Infraestructura"],
  en: ["Interface", "API and services", "Data", "Infrastructure"],
};

/**
 * La pila isométrica del hero (misma geometría que stack-illustration.tsx),
 * con las etiquetas como texto SVG.
 * @param {string[]} names - Nombres de las capas, de arriba hacia abajo.
 * @returns {string} El SVG como texto.
 */
function stackSvg(names) {
  const W = 196,
    D = 132,
    T = 10,
    GAP = 62;
  const cos = Math.cos(Math.PI / 6),
    sin = Math.sin(Math.PI / 6);
  const iso = (x, z, dy) => [(x - z) * cos, (x + z) * sin + dy];
  const pts = (list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const layers = [colors.ui, colors.api, colors.data, colors.infra];

  const plates = layers
    .map((color, index) => ({ color, index }))
    .reverse()
    .map(({ color, index }) => {
      const dy = index * GAP;
      const [rx, ry] = iso(W, 0, dy);
      return `
        <polygon points="${pts([iso(W, 0, dy), iso(W, D, dy), iso(W, D, dy + T), iso(W, 0, dy + T)])}" fill="${color}" fill-opacity="0.58"/>
        <polygon points="${pts([iso(W, D, dy), iso(0, D, dy), iso(0, D, dy + T), iso(W, D, dy + T)])}" fill="${color}" fill-opacity="0.4"/>
        <polygon points="${pts([iso(0, 0, dy), iso(W, 0, dy), iso(W, D, dy), iso(0, D, dy)])}" fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-width="1.4"/>
        <line x1="${rx + 6}" y1="${ry}" x2="${rx + 36}" y2="${ry}" stroke="${colors.inkSoft}"/>
        <text x="${rx + 44}" y="${ry + 5}" font-size="14" font-weight="600" fill="${colors.ink}">${names[index]}</text>`;
    })
    .join("");

  return `<svg viewBox="-125 -14 470 386" width="560" xmlns="http://www.w3.org/2000/svg">${plates}</svg>`;
}

/** Estilos comunes de las páginas que se fotografían: la fuente y los colores del tema claro. */
const baseCss = `
  @font-face { font-family: "Mona Sans"; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 200 900; font-stretch: 75% 125%; }
  * { margin: 0; box-sizing: border-box; }
  body { font-family: "Mona Sans", sans-serif; background: ${colors.paper}; color: ${colors.ink}; }
`;

/**
 * Imagen para redes (1200 × 630): nombre, rol y la pila de capas.
 * @param {"es" | "en"} locale
 * @returns {string} La página HTML que se fotografía.
 */
function ogHtml(locale) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    .card { width: 1200px; height: 630px; padding: 72px 80px; display: grid; grid-template-columns: 1fr 560px; align-items: center; }
    h1 { font-size: 132px; line-height: 0.9; font-weight: 800; font-stretch: 125%; letter-spacing: -0.025em; }
    p { margin-top: 36px; font-size: 38px; font-weight: 600; font-stretch: 112%; }
  </style></head><body><div class="card">
    <div><h1>${profile.firstName}<br>${profile.lastName}</h1><p>${profile.role[locale]}</p></div>
    ${stackSvg(labels[locale])}
  </div></body></html>`;
}

/** Ícono para iOS (180 × 180): el logo del sitio sobre el fondo claro. */
const iconHtml = `<!doctype html><html><head><style>${baseCss}
  body { width: 180px; height: 180px; display: grid; place-items: center; }
</style></head><body>
  <svg width="124" height="124" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4 28 10 16 16 4 10Z" fill="${colors.ui}"/>
    <path d="M16 11.5 28 17.5 16 23.5 4 17.5Z" fill="${colors.api}" opacity="0.85"/>
    <path d="M16 19 28 25 16 31 4 25Z" fill="${colors.infra}" opacity="0.7"/>
  </svg>
</body></html>`;

/** Carpeta temporal para las páginas HTML; se borra al terminar. */
const work = await mkdtemp(path.join(tmpdir(), "portfolio-images-"));
/** Chromium de Playwright: dibuja las páginas con la misma tipografía que el sitio. */
const browser = await chromium.launch();

/**
 * Abre una página en Chromium y guarda su captura en public/.
 * @param {string} html - Página completa.
 * @param {string} file - Nombre del archivo de salida dentro de public/.
 * @param {number} width - Ancho en px.
 * @param {number} height - Alto en px.
 */
async function render(html, file, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const source = path.join(work, `${path.basename(file)}.html`);
  await writeFile(source, html);
  await page.goto(pathToFileURL(source).href);
  // La captura espera a que la fuente esté lista.
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, "public", file) });
  await page.close();
  console.log(`public/${file}`);
}

try {
  await render(ogHtml("es"), "og-es.png", 1200, 630);
  await render(ogHtml("en"), "og-en.png", 1200, 630);
  await render(iconHtml, "apple-touch-icon.png", 180, 180);
} finally {
  await browser.close();
  await rm(work, { recursive: true, force: true });
}
