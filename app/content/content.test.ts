/**
 * Pruebas del contenido: atrapan errores que TypeScript no ve, como un
 * texto vacío en un idioma, una imagen sin generar, un slug inválido o
 * fechas fuera de orden.
 */
import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { locales } from "../i18n/paths";
import { education, experience } from "./experience";
import { profile } from "./profile";
import { getNextProject, getProject, projects } from "./projects";
import { sectionIntros } from "./sections";
import { site } from "./site";
import { stack } from "./stack";
import { crossCuttingIds, layerIds, type ContentImage, type Localized } from "./types";

/** Recorre un objeto y devuelve cada valor que tenga la forma { es, en }. */
function localizedValues(value: unknown, path = "root"): Array<[string, Localized<unknown>]> {
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  if (locales.every((code) => code in record)) return [[path, record as Localized<unknown>]];
  return Object.entries(record).flatMap(([key, child]) => localizedValues(child, `${path}.${key}`));
}

/** Texto vacío, lista vacía o valor ausente: cuenta como traducción faltante. */
const isEmpty = (value: unknown) =>
  value === "" ||
  (Array.isArray(value) && value.length === 0) ||
  value === undefined ||
  value === null;

describe("contenido", () => {
  const sources = { profile, projects, stack, experience, education, sectionIntros };

  it.each(Object.entries(sources))("%s tiene todos los textos en ambos idiomas", (_, source) => {
    for (const [path, value] of localizedValues(source)) {
      for (const code of locales) {
        expect(isEmpty(value[code]), `${path}.${code} está vacío`).toBe(false);
      }
      if (Array.isArray(value.es)) {
        expect(
          (value.en as unknown[]).length,
          `${path} tiene distinta cantidad de elementos por idioma`,
        ).toBe(value.es.length);
      }
    }
  });

  it("no quedan datos de la plantilla de ejemplo", () => {
    const all = JSON.stringify({ ...sources, site });
    for (const placeholder of ["Alex Rivera", "ejemplo.com", "tu-usuario", "example.com"]) {
      expect(all, `aún aparece "${placeholder}"`).not.toContain(placeholder);
    }
  });

  it("cada imagen referenciada fue generada con npm run images", () => {
    const images: ContentImage[] = [
      ...(profile.portrait ? [profile.portrait] : []),
      ...projects.flatMap((project) => (project.image ? [project.image] : [])),
    ];
    for (const image of images) {
      for (const width of [960, 1600]) {
        const file = path.resolve("public/images", `${image.src}-${width}.webp`);
        expect(existsSync(file), `falta ${file}`).toBe(true);
      }
      expect(image.ratio).toBeGreaterThan(0);
    }
  });

  it("cada proyecto tiene un slug único y apto para URL", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("la arquitectura de los proyectos solo usa capas conocidas", () => {
    for (const project of projects) {
      for (const layer of Object.keys(project.architecture ?? {})) {
        expect(layerIds).toContain(layer);
      }
      expect(project.art.hue).toBeGreaterThanOrEqual(0);
      expect(project.art.hue).toBeLessThanOrEqual(360);
    }
  });

  it("el stack empieza con las capas del hero, en su orden, y después lo transversal", () => {
    const ids = stack.map((group) => group.id);
    expect(ids.slice(0, layerIds.length)).toEqual([...layerIds]);
    for (const id of ids.slice(layerIds.length)) expect(crossCuttingIds).toContain(id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("la experiencia usa fechas AAAA-MM, de la más reciente a la más antigua", () => {
    for (const job of experience) {
      expect(job.start).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      if (job.end) {
        expect(job.end).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
        expect(job.end >= job.start, `${job.company} termina antes de empezar`).toBe(true);
      }
    }
    const starts = experience.map((job) => job.start);
    expect(starts).toEqual([...starts].sort().reverse());
  });

  it("el caso de estudio que enlaza el pie de página es un proyecto existente", () => {
    if (site.caseStudy) expect(getProject(site.caseStudy)).toBeDefined();
  });

  it("las etapas de cada proceso tienen la misma duración en ambos idiomas", () => {
    for (const { slug, process: steps } of projects) {
      if (!steps) continue;
      const durations = steps.es.map((step) => step.duration);
      expect(
        steps.en.map((step) => step.duration),
        slug,
      ).toEqual(durations);
    }
  });

  it("el siguiente proyecto da la vuelta al final de la lista", () => {
    expect(getNextProject(projects[0].slug).slug).toBe(projects[1].slug);
    expect(getNextProject(projects.at(-1)!.slug).slug).toBe(projects[0].slug);
  });
});
