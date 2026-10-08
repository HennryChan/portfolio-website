// Prepara build/client para GitHub Pages después de `react-router build`:
//   - 404.html: página de respaldo que arranca la app en cualquier ruta desconocida.
//   - Con BASE_PATH (repo que no se llama <usuario>.github.io), sube las páginas un nivel.
//   - sitemap.xml y robots.txt, a partir de las URL canónicas de cada página prerenderizada.
//   - .nojekyll: evita que Pages ignore archivos que empiezan con "_" si se publica desde una rama.
import { cp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/** Carpeta que se publica en GitHub Pages. */
const out = path.resolve("build/client");
/** Partes de BASE_PATH, p. ej. "/portfolio/" → ["portfolio"]; vacío si el sitio vive en la raíz. */
const baseSegments = (process.env.BASE_PATH ?? "").split("/").filter(Boolean);
/** Borra un archivo o carpeta. Copiar y borrar (en vez de renombrar) evita errores EPERM en Windows con archivos recién creados. */
const remove = (target) => rm(target, { recursive: true, force: true, maxRetries: 5 });

// La página de respaldo pasa a ser 404.html: GitHub Pages la sirve en cualquier ruta que no exista
// y la app se encarga de mostrar la página correcta (o su propia 404).
if (baseSegments.length === 0) {
  await cp(path.join(out, "__spa-fallback.html"), path.join(out, "404.html"));
  await remove(path.join(out, "__spa-fallback.html"));
} else {
  // React Router escribe las páginas en build/client/<base>/ y el respaldo en
  // build/client/index.html. GitHub Pages ya sirve el sitio bajo /<base>/,
  // así que las páginas suben a la raíz del artefacto.
  await cp(path.join(out, "index.html"), path.join(out, "404.html"));
  await remove(path.join(out, "index.html"));
  await cp(path.join(out, ...baseSegments), out, { recursive: true });
  await remove(path.join(out, baseSegments[0]));
}

await writeFile(path.join(out, ".nojekyll"), "");

/**
 * Una entrada del sitemap por cada página indexable (las que no llevan
 * noindex): `loc` es su URL canónica y `alternates`, sus enlaces hreflang.
 */
const pages = [];
for await (const file of walk(out)) {
  const name = path.basename(file);
  if (!name.endsWith(".html") || name === "404.html" || name === "__spa-fallback.html") continue;

  const html = await readFile(file, "utf8");
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  if (/<meta\b[^>]*name="robots"[^>]*content="noindex"/i.test(html)) continue;

  const canonical = links.find((link) => link.rel === "canonical")?.href;
  if (!canonical) continue;
  const alternates = links.filter((link) => link.rel === "alternate" && link.hreflang);
  pages.push({ loc: canonical, alternates });
}

pages.sort((a, b) => a.loc.localeCompare(b.loc));
/** La URL más corta es la portada: de ella sale la raíz del sitio para robots.txt. */
const home = pages.reduce(
  (shortest, page) => (!shortest || page.loc.length < shortest.length ? page.loc : shortest),
  "",
);
/** URL de la raíz del sitio, con barra final. */
const siteRoot = home.endsWith("/") ? home : `${home}/`;

/** sitemap.xml con las alternativas por idioma (xhtml:link), como recomienda Google. */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (page) => `  <url>
    <loc>${xml(page.loc)}</loc>
${page.alternates.map((alt) => `    <xhtml:link rel="alternate" hreflang="${xml(alt.hreflang)}" href="${xml(alt.href)}"/>`).join("\n")}
  </url>`,
  )
  .join("\n")}
</urlset>
`;

await writeFile(path.join(out, "sitemap.xml"), sitemap);
await writeFile(
  path.join(out, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteRoot}sitemap.xml\n`,
);

console.log(
  `postbuild: 404.html, sitemap.xml (${pages.length} páginas) y robots.txt listos en build/client`,
);

/**
 * Recorre una carpeta y sus subcarpetas.
 * @param {string} dir
 * @returns {AsyncGenerator<string>} La ruta de cada archivo.
 */
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

/**
 * Atributos de una etiqueta HTML, con los nombres en minúsculas.
 * @param {string} tag - P. ej. `<link rel="canonical" href="…">`.
 * @returns {Record<string, string>}
 */
function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([a-zA-Z-:]+)="([^"]*)"/g)].map(([, key, value]) => [
      key.toLowerCase(),
      value,
    ]),
  );
}

/**
 * Escapa un texto para usarlo dentro de XML.
 * @param {string} value
 */
function xml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
