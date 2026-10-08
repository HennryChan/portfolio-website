/**
 * Levanta la vista previa (scripts/preview.mjs) en segundo plano para las comprobaciones con
 * navegador y la detiene al terminar. Requiere un build previo: `npm run build`.
 */
import { spawn } from "node:child_process";
import path from "node:path";

/** Raíz del proyecto. */
const root = path.resolve(import.meta.dirname, "../..");

/**
 * "portfolio", "/portfolio" o "/portfolio/" → "/portfolio/"; vacío → "/".
 * Misma regla que normalizeBasePath() en react-router.config.ts.
 * @param {string | undefined} value
 */
function normalizeBase(value) {
  const trimmed = value?.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

/**
 * Inicia la vista previa y espera a que responda.
 * @param {{ port?: number }} [options] - Puerto local (4310 por defecto, para no chocar con
 * `npm run preview`, que usa el 4173).
 * @returns {Promise<{ origin: string, base: string, url: (route: string) => string, stop: () => void }>}
 * `url("/en")` arma la dirección completa respetando BASE_PATH.
 */
export async function startPreview({ port = Number(process.env.QA_PORT ?? 4310) } = {}) {
  const child = spawn(process.execPath, [path.join(root, "scripts/preview.mjs")], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: "ignore",
  });
  const origin = `http://localhost:${port}`;
  const base = normalizeBase(process.env.BASE_PATH);
  const stop = () => child.kill();

  // Hasta 10 s para que el servidor responda.
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(`${origin}${base}`);
      if (response.ok) {
        return { origin, base, url: (route) => `${origin}${base}${route.replace(/^\//, "")}`, stop };
      }
    } catch {
      // Todavía no escucha: se vuelve a intentar.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  stop();
  throw new Error(`La vista previa no respondió en ${origin}${base}. ¿Corriste npm run build?`);
}
