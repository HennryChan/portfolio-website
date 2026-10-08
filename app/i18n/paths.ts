/**
 * Rutas por idioma. El español vive en la raíz y el inglés bajo /en:
 *   /                    ↔  /en
 *   /proyectos/:slug     ↔  /en/projects/:slug
 *
 * Este módulo no depende de React ni de Vite: también lo usa
 * react-router.config.ts para generar las páginas en el build.
 */

/** Idiomas del sitio, en el orden del selector de idioma. */
export const locales = ["es", "en"] as const;
/** Código de idioma: "es" o "en". */
export type Locale = (typeof locales)[number];
/** Idioma de la raíz del sitio; también es la versión `x-default` para buscadores. */
export const defaultLocale: Locale = "es";

/** Formato de Open Graph (idioma_PAÍS). */
export const ogLocale: Record<Locale, string> = { es: "es_LA", en: "en_US" };

/** Segmento de las páginas de proyecto en cada idioma. */
const projectsSegment: Record<Locale, string> = {
  es: "proyectos",
  en: "projects",
};

/** Página de un proyecto en cualquier idioma, con o sin barra final; captura el slug. */
const projectPattern = /^(?:\/en)?\/(?:proyectos|projects)\/([^/]+)\/?$/;

/**
 * Idioma de una ruta: inglés si está bajo /en (pero no en /entrevistas,
 * por ejemplo); si no, español.
 *
 * @param pathname - Ruta sin la base del sitio, p. ej. "/en/projects/pki-reports".
 */
export function localeFromPathname(pathname: string): Locale {
  return /^\/en(?:\/|$)/.test(pathname) ? "en" : "es";
}

/** Portada de un idioma: "/" o "/en". */
export function homePath(locale: Locale): string {
  return locale === "es" ? "/" : "/en";
}

/**
 * Página de un proyecto en un idioma.
 *
 * @example projectPath("en", "pki-reports") → "/en/projects/pki-reports"
 */
export function projectPath(locale: Locale, slug: string): string {
  const prefix = locale === "es" ? "" : "/en";
  return `${prefix}/${projectsSegment[locale]}/${slug}`;
}

/** Enlace a una sección de la portada, p. ej. "/#projects" o "/en#projects". */
export function sectionPath(locale: Locale, sectionId: string): string {
  return `${homePath(locale)}#${sectionId}`;
}

/** El slug si la ruta es la página de un proyecto; si no, `null`. */
export function projectSlugFromPathname(pathname: string): string | null {
  return projectPattern.exec(pathname)?.[1] ?? null;
}

/** La misma página en el otro idioma; si no hay equivalente, su portada. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const slug = projectSlugFromPathname(pathname);
  return slug ? projectPath(target, slug) : homePath(target);
}

/** La ruta es la portada de algún idioma, con o sin barra final. */
export function isHomePath(pathname: string): boolean {
  return pathname === "/" || /^\/en\/?$/.test(pathname);
}
