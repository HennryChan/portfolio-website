/**
 * Configuración de React Router: sitio estático (sin servidor) con todas
 * las páginas prerenderizadas en el build, listo para GitHub Pages.
 */
import type { Config } from "@react-router/dev/config";

import { projects } from "./app/content/projects";
import { projectPath } from "./app/i18n/paths";

/**
 * GitHub Pages sirve el sitio en "/" si el repo se llama <usuario>.github.io,
 * o en "/<repo>/" para cualquier otro nombre. El workflow de despliegue
 * define BASE_PATH; en local no hace falta.
 */
const basePath = normalizeBasePath(process.env.BASE_PATH);

/**
 * Páginas que se generan: las rutas fijas (las portadas) más dos por
 * proyecto, una en cada idioma. Cualquier otra ruta la atiende la página
 * de respaldo (404.html, ver scripts/postbuild.mjs).
 */
export default {
  // Sin servidor: cada ruta se prerenderiza a HTML estático durante el build.
  ssr: false,
  basename: basePath,
  async prerender({ getStaticPaths }) {
    const projectPages = projects.flatMap(({ slug }) => [
      projectPath("es", slug),
      projectPath("en", slug),
    ]);
    return [...getStaticPaths(), ...projectPages];
  },
} satisfies Config;

/**
 * "portfolio", "/portfolio" o "/portfolio/" → "/portfolio/"; vacío → "/".
 *
 * @param value - BASE_PATH tal como llega del entorno.
 */
function normalizeBasePath(value: string | undefined): string {
  const trimmed = value?.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}
