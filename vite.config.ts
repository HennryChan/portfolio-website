/** Configuración de Vite: Tailwind CSS, React Router y la ruta base del sitio. */
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

/**
 * `base` antepone la ruta del repo a los archivos del build (JS, CSS,
 * imágenes); `tsconfigPaths` resuelve el alias `~/` de tsconfig.json.
 */
export default defineConfig({
  // Debe coincidir con el `basename` de react-router.config.ts.
  base: normalizeBasePath(process.env.BASE_PATH),
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});

/**
 * "portfolio", "/portfolio" o "/portfolio/" → "/portfolio/"; vacío → "/".
 * Misma regla que en react-router.config.ts.
 *
 * @param value - BASE_PATH tal como llega del entorno.
 */
function normalizeBasePath(value: string | undefined): string {
  const trimmed = value?.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}
