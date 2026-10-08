/** Pruebas de las URL absolutas y de los metadatos para buscadores y redes. */
import { describe, expect, it } from "vitest";

import { site } from "../content/site";
import { homePath } from "../i18n/paths";
import { absoluteUrl, pageMeta } from "./seo";

/** Dirección del sitio sin barra final, como la arma absoluteUrl(). */
const origin = site.url.replace(/\/+$/, "");

describe("absoluteUrl", () => {
  it("termina las páginas en / como las sirve GitHub Pages", () => {
    expect(absoluteUrl("/")).toBe(`${origin}/`);
    expect(absoluteUrl("/en")).toBe(`${origin}/en/`);
    expect(absoluteUrl("/proyectos/pulso")).toBe(`${origin}/proyectos/pulso/`);
  });

  it("deja los archivos sin barra final", () => {
    expect(absoluteUrl("/og-es.png")).toBe(`${origin}/og-es.png`);
  });
});

describe("pageMeta", () => {
  const meta = pageMeta({
    locale: "en",
    title: "Título",
    description: "Descripción",
    pathFor: homePath,
  });

  it("declara la versión canónica y las alternativas por idioma", () => {
    expect(meta).toContainEqual({ tagName: "link", rel: "canonical", href: `${origin}/en/` });
    expect(meta).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "es",
      href: `${origin}/`,
    });
    expect(meta).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: `${origin}/`,
    });
  });

  it("incluye Open Graph con el idioma y la imagen de la página", () => {
    expect(meta).toContainEqual({ property: "og:image", content: `${origin}/og-en.png` });
    expect(meta).toContainEqual({ property: "og:locale", content: "en_US" });
    expect(meta).toContainEqual({ property: "og:locale:alternate", content: "es_LA" });
  });
});
