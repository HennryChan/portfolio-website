/** Página de un proyecto ("/proyectos/:slug" y "/en/projects/:slug"). */
import { NotFoundView } from "~/components/not-found-view";
import { ProjectView } from "~/components/project/project-view";
import { fullName } from "~/content/profile";
import { getProject } from "~/content/projects";
import { localize } from "~/i18n/localize";
import { localeFromPathname, projectPath } from "~/i18n/paths";
import { ui } from "~/i18n/ui";
import { noIndexMeta, pageMeta } from "~/lib/seo";

import type { Route } from "./+types/project";

/** Metadatos del proyecto; si el slug no existe, una página 404 que no se indexa. */
export function meta({ params, location }: Route.MetaArgs) {
  const locale = localeFromPathname(location.pathname);
  const project = getProject(params.slug);
  if (!project) return noIndexMeta(ui[locale].notFound.title);

  return pageMeta({
    locale,
    title: `${localize(project.name, locale)}, ${fullName}`,
    description: project.summary[locale],
    pathFor: (code) => projectPath(code, project.slug),
    type: "article",
  });
}

/** El proyecto del slug, o la 404 si no existe. */
export default function ProjectRoute({ params }: Route.ComponentProps) {
  const project = getProject(params.slug);
  // key: al pasar de un proyecto al siguiente, la página se monta de nuevo (animaciones incluidas).
  return project ? <ProjectView key={project.slug} project={project} /> : <NotFoundView />;
}
