/**
 * Pruebas de las rutas por idioma: de ellas dependen los enlaces, el
 * selector de idioma y las páginas que se generan en el build.
 */
import { describe, expect, it } from "vitest";

import {
  homePath,
  isHomePath,
  localeFromPathname,
  projectPath,
  projectSlugFromPathname,
  sectionPath,
  switchLocalePath,
} from "./paths";

describe("localeFromPathname", () => {
  it("usa español en la raíz y en las rutas sin prefijo", () => {
    expect(localeFromPathname("/")).toBe("es");
    expect(localeFromPathname("/proyectos/pulso")).toBe("es");
  });

  it("usa inglés bajo /en", () => {
    expect(localeFromPathname("/en")).toBe("en");
    expect(localeFromPathname("/en/")).toBe("en");
    expect(localeFromPathname("/en/projects/pulso")).toBe("en");
  });

  it("no confunde rutas que solo empiezan con 'en'", () => {
    expect(localeFromPathname("/entrevistas")).toBe("es");
  });
});

describe("rutas por idioma", () => {
  it("construye la portada y los proyectos en cada idioma", () => {
    expect(homePath("es")).toBe("/");
    expect(homePath("en")).toBe("/en");
    expect(projectPath("es", "pulso")).toBe("/proyectos/pulso");
    expect(projectPath("en", "pulso")).toBe("/en/projects/pulso");
    expect(sectionPath("en", "contact")).toBe("/en#contact");
  });

  it("reconoce la portada con y sin barra final", () => {
    expect(isHomePath("/")).toBe(true);
    expect(isHomePath("/en")).toBe(true);
    expect(isHomePath("/en/")).toBe(true);
    expect(isHomePath("/proyectos/pulso")).toBe(false);
  });

  it("extrae el slug de un proyecto en cualquier idioma", () => {
    expect(projectSlugFromPathname("/proyectos/turno")).toBe("turno");
    expect(projectSlugFromPathname("/en/projects/turno/")).toBe("turno");
    expect(projectSlugFromPathname("/en")).toBeNull();
  });
});

describe("switchLocalePath", () => {
  it("lleva a la misma página en el otro idioma", () => {
    expect(switchLocalePath("/", "en")).toBe("/en");
    expect(switchLocalePath("/en", "es")).toBe("/");
    expect(switchLocalePath("/proyectos/puente", "en")).toBe("/en/projects/puente");
    expect(switchLocalePath("/en/projects/puente", "es")).toBe("/proyectos/puente");
  });

  it("vuelve a la portada si la página no tiene equivalente", () => {
    expect(switchLocalePath("/no-existe", "en")).toBe("/en");
  });
});
