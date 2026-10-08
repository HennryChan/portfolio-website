/** Reglas de ESLint para TypeScript y hooks de React. El formato lo resuelve Prettier. */
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Recomendadas de JavaScript, TypeScript y React Hooks, más dos reglas propias:
 * variables sin usar como error (salvo las que empiezan con "_") e
 * `import type` obligatorio para lo que solo es un tipo.
 */
export default defineConfig([
  // Archivos generados, dependencias, capturas de QA y la configuración local de los agentes
  // (Claude Code y Antigravity).
  globalIgnores(["build/", ".react-router/", ".claude/", ".agents/", "qa/", "node_modules/"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      // El código corre en el navegador y los scripts y la configuración, en Node.
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
]);
