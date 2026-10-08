import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

/**
 * Mapa de rutas. Español en la raíz, inglés bajo /en. Ambos idiomas usan
 * los mismos módulos, con un `id` distinto porque React Router no admite
 * dos rutas con el mismo. `*` atrapa todo lo demás y muestra la 404.
 * Las páginas que se generan en el build están en react-router.config.ts.
 */
export default [
  index("routes/home.tsx", { id: "home-es" }),
  route("proyectos/:slug", "routes/project.tsx", { id: "project-es" }),
  ...prefix("en", [
    index("routes/home.tsx", { id: "home-en" }),
    route("projects/:slug", "routes/project.tsx", { id: "project-en" }),
  ]),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
