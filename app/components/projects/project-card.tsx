import { Link, useViewTransitionState } from "react-router";

import { layerIds, type Project } from "~/content/types";
import { localize } from "~/i18n/localize";
import { projectPath } from "~/i18n/paths";
import { useLocale, useT } from "~/i18n/use-locale";

import { ProjectArt } from "./project-art";
import { ProjectShot } from "./project-shot";

/** Una tecnología por capa: resume el stack sin listar todo. */
function stackSummary(project: Project): string | null {
  const picks = layerIds.map((id) => project.architecture?.[id]?.[0]).filter(Boolean);
  return picks.length > 0 ? picks.join(", ") : null;
}

/**
 * Tarjeta de un proyecto en la portada: periodo, nombre, resumen, rol y
 * stack a un lado; captura (o ilustración) al otro. Toda la tarjeta es un
 * enlace a la página del proyecto.
 */
export function ProjectCard({ project }: { project: Project }) {
  const locale = useLocale();
  const t = useT();
  const href = projectPath(locale, project.slug);
  // Durante la transición, la imagen y el título "viajan" a la página del proyecto.
  const transitioning = useViewTransitionState(href);
  const media = { viewTransitionName: transitioning ? "project-art" : undefined };
  const stack = stackSummary(project);

  return (
    <article className="project-card group relative grid overflow-hidden rounded-[1.75rem] border border-line bg-surface lg:min-h-[min(38rem,calc(100svh-var(--header-h)-5rem))] lg:grid-cols-12">
      <div className="flex flex-col justify-between gap-10 p-7 sm:p-10 lg:col-span-5 lg:p-12">
        <div>
          {project.period && (
            <p className="mb-3 font-mono text-sm text-code-number">{project.period}</p>
          )}
          <h3
            className="text-4xl font-bold tracking-tight font-wide lg:text-5xl"
            style={{ viewTransitionName: transitioning ? "project-title" : undefined }}
          >
            {/* El enlace cubre toda la tarjeta con ::after. */}
            <Link
              to={href}
              viewTransition
              className="after:absolute after:inset-0 after:rounded-[1.75rem] after:content-['']"
            >
              {localize(project.name, locale)}
            </Link>
          </h3>
          {project.subtitle && <p className="mt-3 font-medium">{project.subtitle[locale]}</p>}
          <p className="mt-5 max-w-md text-lg text-ink-soft">{project.summary[locale]}</p>
        </div>

        <div className="space-y-8">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            {project.role && (
              <div>
                <dt className="text-ink-soft">{t.projects.role}</dt>
                <dd className="mt-1 font-medium">{project.role[locale]}</dd>
              </div>
            )}
            {stack && (
              <div>
                <dt className="text-ink-soft">{t.projects.stack}</dt>
                <dd className="mt-1 font-mono text-code-tech">{stack}</dd>
              </div>
            )}
          </dl>
          {/* Solo visual: el enlace real es el título, que ya cubre la tarjeta. */}
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-2 text-sm font-semibold underline decoration-line decoration-2 underline-offset-[6px] transition-colors duration-200 group-hover:decoration-ink"
          >
            {t.projects.viewCase}
          </span>
        </div>
      </div>

      <div className="relative flex items-center p-3 sm:p-5 lg:col-span-7 lg:p-8">
        {project.image ? (
          <ProjectShot project={project} image={project.image} decorative style={media} />
        ) : (
          <ProjectArt variant={project.art.variant} hue={project.art.hue} style={media} />
        )}
      </div>

      {/* Se oscurece cuando la siguiente tarjeta la cubre (ver Projects). */}
      <div
        aria-hidden="true"
        className="project-shade pointer-events-none absolute inset-0 bg-paper opacity-0"
      />
    </article>
  );
}
