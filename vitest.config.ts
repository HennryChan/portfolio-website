import { defineConfig } from "vitest/config";

/**
 * Configuración de las pruebas, aparte de vite.config.ts para no cargar el
 * plugin de React Router. Las pruebas cubren lógica sin interfaz
 * (rutas, SEO, validación y contenido), así que corren en Node.
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["app/**/*.test.ts"],
    environment: "node",
  },
});
