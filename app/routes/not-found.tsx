/** Cualquier ruta que no existe, en ambos idiomas. */
import { NotFoundView } from "~/components/not-found-view";
import { localeFromPathname } from "~/i18n/paths";
import { ui } from "~/i18n/ui";
import { noIndexMeta } from "~/lib/seo";

import type { Route } from "./+types/not-found";

/** Título en el idioma de la ruta y `noindex`: la 404 no debe aparecer en buscadores. */
export function meta({ location }: Route.MetaArgs) {
  return noIndexMeta(ui[localeFromPathname(location.pathname)].notFound.title);
}

/** Muestra la página 404. */
export default function NotFound() {
  return <NotFoundView />;
}
