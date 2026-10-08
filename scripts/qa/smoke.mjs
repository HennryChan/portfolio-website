/**
 * Prueba de humo del sitio publicado: sirve el build como GitHub Pages y recorre lo esencial con
 * un navegador real (portada, idiomas, casos de estudio, 404, formulario y pie de página).
 * Termina con código 1 si algo falla. Los envíos del formulario se interceptan: nunca llega un
 * mensaje real al servicio configurado.
 *
 * Uso: npm run build && npm run qa:smoke
 */
import { chromium } from "@playwright/test";

import { ui } from "../../app/i18n/ui.ts";
import { startPreview } from "./preview-server.mjs";

/** Textos de la interfaz: las pruebas buscan botones y enlaces por su nombre visible. */
const es = ui.es;
/** Textos en inglés. */
const en = ui.en;
/** Vista previa del build, levantada solo para esta prueba. */
const preview = await startPreview();
/** Chromium de Playwright. */
const browser = await chromium.launch();
/** Una sola pestaña para todo el recorrido, como una visita real. */
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

/** Errores de consola y respuestas HTTP fallidas (salvo la 404 que se prueba a propósito). */
const problems = [];
page.on("console", (message) => {
  if (message.type() === "error" && !message.location().url.includes("ruta-que-no-existe")) {
    problems.push(message.text());
  }
});
page.on("pageerror", (error) => problems.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400 && !response.url().includes("ruta-que-no-existe")) {
    problems.push(`HTTP ${response.status()} ${response.url()}`);
  }
});
// El formulario nunca envía de verdad: cualquier POST a otro dominio recibe un 200 simulado.
await page.route(
  (url) => !url.href.startsWith(preview.origin),
  (route) =>
    route.request().method() === "POST"
      ? route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
      : route.continue(),
);

/** Comprobaciones que fallaron. */
let failures = 0;

/**
 * Registra el resultado de una comprobación.
 * @param {string} label - Qué se comprobó.
 * @param {boolean} ok - Si pasó.
 * @param {string} [detail] - Dato útil para entender un fallo.
 */
function check(label, ok, detail = "") {
  if (!ok) failures++;
  console.log(`${ok ? "ok   " : "FALLA"} ${label}${detail ? ` — ${detail}` : ""}`);
}

/** Texto del primer <h1> de la página, sin espacios extra. */
const heading = async () => (await page.locator("h1").first().innerText()).replace(/\s+/g, " ");

try {
  // 1. Portada en español.
  let response = await page.goto(preview.url("/"), { waitUntil: "networkidle" });
  check("portada responde 200", response?.status() === 200);
  check("html lang=es", (await page.getAttribute("html", "lang")) === "es");
  check("título de la página", (await page.title()).length > 0, await page.title());

  // 2. Carpeta sin barra final, como GitHub Pages: /en → /en/.
  await page.goto(preview.url("/en"), { waitUntil: "networkidle" });
  check(
    "/en → /en/ en inglés",
    page.url().endsWith("/en/") && (await page.getAttribute("html", "lang")) === "en",
  );

  // 3. Primera tarjeta de proyecto → su caso de estudio.
  await page.goto(preview.url("/"), { waitUntil: "networkidle" });
  const card = page.locator("#projects article h3 a").first();
  const cardTitle = (await card.innerText()).replace(/\s+/g, " ");
  await card.click();
  await page.waitForURL(/\/proyectos\/[^/]+/);
  await page.waitForTimeout(800);
  check("tarjeta → caso de estudio", (await heading()) === cardTitle, page.url());

  // 4. Cambio de idioma dentro del caso de estudio.
  const slug = new URL(page.url()).pathname.match(/proyectos\/([^/]+)/)?.[1];
  await page.locator(`header a[hreflang="en"]`).first().click();
  await page.waitForURL(new RegExp(`/en/projects/${slug}`));
  // React actualiza <html lang> un instante después de que cambia la URL.
  const switched = await page
    .waitForFunction(() => document.documentElement.lang === "en", null, { timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  check("ES → EN conserva el proyecto", switched, page.url());

  // 5. "Siguiente proyecto".
  const nextLink = page.getByRole("navigation", { name: en.project.next }).getByRole("link");
  const nextHref = await nextLink.getAttribute("href");
  await nextLink.click();
  await page.waitForURL((url) => url.pathname.replace(/\/$/, "") === nextHref?.replace(/\/$/, ""));
  await page.waitForTimeout(800);
  check("siguiente proyecto", (await heading()).length > 0, page.url());

  // 6. Cada página del sitemap carga directo (HTML prerenderizado).
  const sitemap = await (await fetch(preview.url("/sitemap.xml"))).text();
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc));
  for (const url of pages) {
    response = await page.goto(preview.url(url.pathname.replace(preview.base, "/")), {
      waitUntil: "domcontentloaded",
    });
    check(`carga directa ${url.pathname}`, response?.status() === 200);
  }

  // 7. Ruta inexistente: 404.html arranca la app y muestra la página 404 propia.
  response = await page.goto(preview.url("/ruta-que-no-existe"), { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  check("404 con página propia", response?.status() === 404 && (await heading()) === es.notFound.title);

  // 8. "Volver a proyectos" lleva a la sección en la portada.
  await page.goto(preview.url(`/proyectos/${slug}/`), { waitUntil: "networkidle" });
  await page.getByRole("link", { name: es.project.back }).click();
  await page.waitForURL((url) => url.hash === "#projects");
  await page.waitForTimeout(1200);
  const top = await page.evaluate(() => document.getElementById("projects")?.getBoundingClientRect().top ?? 999);
  check("volver a proyectos baja hasta la sección", Math.abs(top) < 120, `top=${Math.round(top)}`);

  // 9. Formulario: validación y respuesta (con el envío interceptado).
  await page.goto(preview.url("/"), { waitUntil: "networkidle" });
  await page.getByRole("button", { name: es.contact.form.submit }).click();
  const invalid = await page.locator("[aria-invalid=true]").count();
  check("validación marca los 3 campos vacíos", invalid === 3, `${invalid}`);
  await page.getByLabel(es.contact.form.name).fill("Prueba");
  await page.getByLabel(es.contact.form.email, { exact: true }).fill("prueba@dominio.com");
  await page.getByLabel(es.contact.form.message).fill("Mensaje de prueba automática del sitio.");
  await page.getByRole("button", { name: es.contact.form.submit }).click();
  await page.waitForTimeout(1500);
  const status = await page.getByRole("status").innerText();
  check(
    "el formulario responde",
    status.includes(es.contact.form.success) || status.includes(es.contact.form.demo),
    status,
  );

  // 10. Enlace del pie al caso de estudio del sitio (si está configurado).
  const footerLink = page.locator("footer a", { hasText: es.footer.caseStudy });
  if ((await footerLink.count()) > 0) {
    const href = (await footerLink.getAttribute("href")) ?? "";
    response = await page.goto(preview.origin + href, { waitUntil: "domcontentloaded" });
    check("enlace «Cómo se hizo este sitio»", response?.status() === 200, href);
  }
} finally {
  await browser.close();
  preview.stop();
}

/** Cada error una sola vez. */
const unique = [...new Set(problems)];
console.log(unique.length ? `\nErrores en el navegador:\n${unique.join("\n")}` : "\nSin errores en el navegador.");
process.exitCode = failures > 0 || unique.length > 0 ? 1 : 0;
