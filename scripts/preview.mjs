// Sirve build/client igual que GitHub Pages para probar el resultado final:
//   /ruta          → /ruta/ (301) si existe ruta/index.html
//   /ruta/         → ruta/index.html
//   no encontrado  → 404.html con estado 404 (la app arranca y muestra su página 404)
// Uso: npm run build && npm run preview   (PORT y BASE_PATH son opcionales)
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

/** Carpeta que genera el build. */
const root = path.resolve("build/client");
/** Ruta base del sitio, como en GitHub Pages: "/" o "/<repo>/". */
const base = normalizeBase(process.env.BASE_PATH);
/** Puerto local; 4173 por defecto, como `vite preview`. */
const port = Number(process.env.PORT ?? 4173);

/** Tipo de contenido según la extensión; lo demás se sirve como binario. */
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
  // Datos de las rutas prerenderizadas que genera React Router.
  ".data": "text/x-script",
};

createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? "/", "http://localhost");
  const decoded = decodeURIComponent(pathname);

  if (!decoded.startsWith(base)) return notFound(response);
  const relative = decoded.slice(base.length);
  const target = path.join(root, relative);
  // Rutas como /../ no pueden salir de build/client.
  if (!target.startsWith(root)) return notFound(response);

  const info = await stat(target).catch(() => null);
  if (info?.isFile()) return send(response, target, 200);
  if (info?.isDirectory()) {
    if (!decoded.endsWith("/")) {
      response.writeHead(301, { Location: `${pathname}/` });
      return response.end();
    }
    const index = path.join(target, "index.html");
    if (await isFile(index)) return send(response, index, 200);
  }
  // GitHub Pages también sirve /ruta desde ruta.html.
  if (await isFile(`${target}.html`)) return send(response, `${target}.html`, 200);
  return notFound(response);
}).listen(port, () => {
  console.log(`Vista previa estilo GitHub Pages en http://localhost:${port}${base}`);
});

/**
 * @param {string} file
 * @returns {Promise<boolean>} true si existe y es un archivo (no una carpeta).
 */
async function isFile(file) {
  return (await stat(file).catch(() => null))?.isFile() ?? false;
}

/**
 * Responde con el contenido de un archivo.
 * @param {import("node:http").ServerResponse} response
 * @param {string} file
 * @param {number} status - Código HTTP.
 */
function send(response, file, status) {
  response.writeHead(status, {
    "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
  });
  createReadStream(file).pipe(response);
}

/**
 * Responde 404 con la página de respaldo, como GitHub Pages: la app arranca
 * y muestra su propia página 404.
 * @param {import("node:http").ServerResponse} response
 */
async function notFound(response) {
  const page = path.join(root, "404.html");
  if (await isFile(page)) return send(response, page, 404);
  response.writeHead(404).end("404");
}

/**
 * "portfolio", "/portfolio" o "/portfolio/" → "/portfolio/"; vacío → "/".
 * Misma regla que normalizeBasePath() en react-router.config.ts.
 * @param {string | undefined} value
 */
function normalizeBase(value) {
  const trimmed = value?.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}
