/**
 * Metadatos para buscadores y redes: título, descripción, URL canónica,
 * enlaces hreflang entre idiomas y Open Graph (la tarjeta que se ve al
 * compartir el enlace). Cada ruta los devuelve desde su función `meta`.
 */
import type { MetaDescriptor } from "react-router";

import { fullName } from "~/content/profile";
import { site } from "~/content/site";
import { defaultLocale, locales, ogLocale, type Locale } from "~/i18n/paths";

/**
 * URL absoluta para canonical, hreflang y Open Graph. Las páginas terminan
 * en "/" porque así las sirve GitHub Pages (carpeta con index.html);
 * los archivos (p. ej. /og.png) se dejan tal cual.
 *
 * @param path - Ruta interna que empieza con "/", p. ej. "/en".
 * @returns La URL completa, p. ej. "https://hennrychan.github.io/en/".
 */
export function absoluteUrl(path: string): string {
  const origin = site.url.replace(/\/+$/, "");
  const isFile = /\.[a-z0-9]+$/i.test(path);
  const normalized = isFile || path.endsWith("/") ? path : `${path}/`;
  return `${origin}${normalized}`;
}

/** Datos de una página que existe en todos los idiomas. */
interface PageMeta {
  /** Idioma de la página que se está generando. */
  locale: Locale;
  /** Título de la pestaña y de la tarjeta al compartir. */
  title: string;
  /** Resumen para buscadores y para la tarjeta al compartir. */
  description: string;
  /** Ruta de esta misma página en cada idioma. */
  pathFor: (locale: Locale) => string;
  /** Tipo de Open Graph: "website" para la portada y "article" para cada proyecto. */
  type?: "website" | "article";
}

/**
 * Etiquetas de una página indexable: título, descripción, canonical, una
 * alternativa hreflang por idioma (más x-default, que apunta al español) y
 * Open Graph con la imagen del idioma (og-es.png u og-en.png).
 *
 * @returns Descriptores para la función `meta` de una ruta.
 */
export function pageMeta({
  locale,
  title,
  description,
  pathFor,
  type = "website",
}: PageMeta): MetaDescriptor[] {
  const url = absoluteUrl(pathFor(locale));
  // Generadas con `npm run images` (scripts/generate-images.mjs).
  const image = absoluteUrl(`/og-${locale}.png`);

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    ...locales.map((code) => ({
      tagName: "link" as const,
      rel: "alternate",
      hrefLang: code,
      href: absoluteUrl(pathFor(code)),
    })),
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: absoluteUrl(pathFor(defaultLocale)),
    },
    { property: "og:type", content: type },
    { property: "og:site_name", content: fullName },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: ogLocale[locale] },
    ...locales
      .filter((code) => code !== locale)
      .map((code) => ({ property: "og:locale:alternate", content: ogLocale[code] })),
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

/**
 * Para páginas que no deben aparecer en buscadores (la 404 y los proyectos
 * que no existen): solo el título y `robots: noindex`.
 *
 * @param title - Título de la pestaña.
 */
export function noIndexMeta(title: string): MetaDescriptor[] {
  return [{ title }, { name: "robots", content: "noindex" }];
}
