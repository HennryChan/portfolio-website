/**
 * Revisión visual: sirve el build y toma capturas de la portada y de cada proyecto en tema claro
 * y oscuro, en español e inglés, en escritorio y en móvil. Las guarda en qa/capturas/ (fuera de
 * git) y avisa si hay errores en el navegador o algo más ancho que la pantalla.
 *
 * Uso: npm run build && npm run qa:screenshots [-- <filtro>]
 *   El filtro deja solo las capturas cuyo nombre lo contiene, p. ej. "movil" o "proyecto".
 */
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { chromium } from "@playwright/test";

import { startPreview } from "./preview-server.mjs";

/** Carpeta de salida; se vacía en cada ejecución. */
const out = path.resolve(import.meta.dirname, "../../qa/capturas");
/** Solo las capturas cuyo nombre contiene este texto. */
const filter = process.argv[2] ?? "";

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

/** Vista previa del build, levantada solo para esta revisión. */
const preview = await startPreview();
/** Chromium de Playwright; SwiftShader dibuja WebGL sin GPU, así el 3D sale en las capturas. */
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
/** Errores del navegador y desbordes encontrados. */
const problems = [];
/** Capturas guardadas. */
let taken = 0;

/**
 * Abre una página con tema, idioma y tamaño de pantalla dados.
 * @param {{ route: string, theme: "light" | "dark", width: number, height: number }} options
 */
async function open({ route, theme, width, height }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: theme,
  });
  await context.addInitScript((value) => localStorage.setItem("theme", value), theme);
  const page = await context.newPage();
  page.on("pageerror", (error) => problems.push(`${route}: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`${route}: ${message.text()}`);
  });
  await page.goto(preview.url(route), { waitUntil: "networkidle" });
  // Entrada de la portada (2.6 s) y carga de la escena 3D.
  await page.waitForTimeout(4500);
  return { page, context };
}

/**
 * Guarda una captura con el elemento indicado arriba de la pantalla.
 * @param {import("@playwright/test").Page} page
 * @param {string} name - Nombre del archivo, sin extensión.
 * @param {string} [selector] - Elemento al que se desplaza antes de capturar.
 */
async function shoot(page, name, selector) {
  if (selector) {
    await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element) window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 80);
    }, selector);
    await page.waitForTimeout(900);
  }
  await page.screenshot({ path: path.join(out, `${name}.png`) });
  taken++;
}

/**
 * Busca elementos más anchos que la pantalla (scroll horizontal no deseado).
 * @param {import("@playwright/test").Page} page
 * @param {string} label - Página y tamaño, para el aviso.
 */
async function checkOverflow(page, label) {
  const wide = await page.evaluate(() => {
    const root = document.documentElement;
    // Solo cuenta si la página de verdad se puede desplazar en horizontal.
    if (root.scrollWidth <= root.clientWidth) return [];
    // Lo que un contenedor recorta (overflow distinto de visible) no se ve fuera de la pantalla.
    const clipped = (element) => {
      for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        if (getComputedStyle(parent).overflowX !== "visible") return true;
      }
      return false;
    };
    return [...document.querySelectorAll("body *")]
      .filter((element) => element.getBoundingClientRect().right > root.clientWidth + 1)
      .filter((element) => !clipped(element))
      .slice(0, 3)
      .map((element) => `<${element.tagName.toLowerCase()}> ${element.textContent?.trim().slice(0, 40)}`);
  });
  if (wide.length > 0) problems.push(`${label} se sale de la pantalla: ${wide.join(" | ")}`);
}

/** Escenarios: ruta, tema, tamaño y secciones a capturar. */
const scenarios = [
  ...["dark", "light"].map((theme) => ({
    name: `portada-es-${theme}`,
    route: "/",
    theme,
    width: 1440,
    height: 900,
    sections: ["", "#about", "#projects", "#stack", "#experience", "#contact"],
  })),
  { name: "portada-en-dark", route: "/en", theme: "dark", width: 1440, height: 900, sections: [""] },
  ...["dark", "light"].map((theme) => ({
    name: `portada-movil-${theme}`,
    route: "/",
    theme,
    width: 390,
    height: 844,
    sections: ["", "#projects"],
  })),
];

try {
  // Un escenario por proyecto, a partir de las páginas del sitemap.
  const sitemap = await (await fetch(preview.url("/sitemap.xml"))).text();
  const projectRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(([, loc]) => new URL(loc).pathname.replace(preview.base, "/"))
    .filter((route) => /\/(proyectos|projects)\//.test(route));
  for (const route of projectRoutes) {
    const slug = route.split("/").filter(Boolean).at(-1);
    const locale = route.startsWith("/en/") ? "en" : "es";
    scenarios.push({
      name: `proyecto-${slug}-${locale}-dark`,
      route,
      theme: "dark",
      width: 1440,
      height: 900,
      sections: [""],
    });
  }

  for (const scenario of scenarios) {
    const names = scenario.sections.map((section) =>
      section ? `${scenario.name}-${section.slice(1)}` : scenario.name,
    );
    if (filter && !names.some((name) => name.includes(filter))) continue;

    const { page, context } = await open(scenario);
    for (const [index, section] of scenario.sections.entries()) {
      if (filter && !names[index].includes(filter)) continue;
      await shoot(page, names[index], section || undefined);
    }
    await checkOverflow(page, `${scenario.route} (${scenario.width}px)`);
    await context.close();
  }
} finally {
  await browser.close();
  preview.stop();
}

console.log(`${taken} capturas en ${path.relative(process.cwd(), out) || out}`);
/** Cada problema una sola vez. */
const unique = [...new Set(problems)];
console.log(unique.length ? `\nProblemas:\n${unique.join("\n")}` : "Sin errores ni desbordes.");
process.exitCode = unique.length > 0 ? 1 : 0;
