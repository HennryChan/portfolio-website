/**
 * Página de un proyecto: encabezado con nombre, resumen, datos y enlaces;
 * captura (o ilustración); y bloques de contexto, funciones, aporte, quién
 * hizo qué, proceso, arquitectura, resultados y aprendizajes. Cada bloque
 * aparece solo si el proyecto tiene ese contenido. Al final, el enlace al
 * siguiente proyecto.
 */
import type { ReactNode } from "react";
import { Link } from "react-router";

import { getNextProject } from "~/content/projects";
import type { Project } from "~/content/types";
import { localize } from "~/i18n/localize";
import { projectPath } from "~/i18n/paths";
import { useLocale, useT } from "~/i18n/use-locale";
import { cn } from "~/lib/cn";

import { ProjectArt } from "../projects/project-art";
import { ProjectShot } from "../projects/project-shot";
import { SectionLink } from "../section-link";
import { buttonClass } from "../ui/button";
import { ExternalIcon } from "../ui/icons";
import { ArchitectureDiagram, projectLayers } from "./architecture-diagram";

/** Contenido completo del proyecto; la ruta lo monta de nuevo al pasar a otro proyecto. */
export function ProjectView({ project }: { project: Project }) {
  const locale = useLocale();
  const t = useT();
  const next = getNextProject(project.slug);

  // Datos breves (rol, periodo, duración, equipo); los que faltan no se muestran.
  const meta = [
    project.role && { term: t.project.role, detail: project.role[locale] },
    project.period && { term: t.project.period, detail: project.period },
    project.duration && { term: t.project.duration, detail: project.duration[locale] },
    project.team && { term: t.project.team, detail: project.team[locale] },
  ].filter((item) => !!item);

  // El primer enlace disponible es el botón principal; los demás, secundarios.
  const links = [
    project.links.live && { href: project.links.live, label: t.project.live },
    project.links.article && { href: project.links.article, label: t.project.article },
    project.links.repo && { href: project.links.repo, label: t.project.repo },
  ].filter((item) => !!item);

  const features = project.features?.[locale] ?? [];
  const solution = project.solution?.[locale] ?? [];
  const collaboration = project.collaboration?.[locale] ?? [];
  const steps = project.process?.[locale] ?? [];
  const results = project.results?.[locale] ?? [];
  // Mismo nombre que en la tarjeta: la imagen "viaja" de la portada a esta página.
  const media = { viewTransitionName: "project-art" };

  return (
    <main id="main" tabIndex={-1}>
      <article>
        <header className="shell pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
          <SectionLink
            section="projects"
            className="text-sm font-medium text-ink-soft underline decoration-line decoration-2 underline-offset-[6px] hover:text-ink hover:decoration-ink"
          >
            {t.project.back}
          </SectionLink>

          <h1
            className="mt-10 text-5xl font-extrabold tracking-tight font-wide sm:text-6xl lg:text-[6.5rem] lg:leading-[0.95]"
            style={{ viewTransitionName: "project-title" }}
          >
            {localize(project.name, locale)}
          </h1>
          {project.subtitle && (
            <p className="mt-5 text-xl font-semibold font-semiwide lg:text-2xl">
              {project.subtitle[locale]}
            </p>
          )}
          <p className="mt-6 max-w-2xl text-xl text-ink-soft lg:text-2xl">
            {project.summary[locale]}
          </p>

          {meta.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
              {meta.map((item) => (
                <div key={item.term}>
                  <dt className="text-sm text-ink-soft">{item.term}</dt>
                  <dd className="mt-1 font-medium">{item.detail}</dd>
                </div>
              ))}
            </dl>
          )}

          {links.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {links.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={buttonClass(index === 0 ? "primary" : "secondary")}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                  <ExternalIcon width={16} height={16} />
                </a>
              ))}
            </div>
          )}
        </header>

        <div className="shell mt-16 lg:mt-20">
          {project.image ? (
            <ProjectShot project={project} image={project.image} priority style={media} />
          ) : (
            <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface p-3 sm:p-6">
              <ProjectArt variant={project.art.variant} hue={project.art.hue} style={media} />
            </div>
          )}
        </div>

        <div className="shell space-y-24 py-24 lg:space-y-32 lg:py-32">
          <Block title={t.project.context}>
            <p className="text-xl leading-relaxed lg:text-2xl">{project.context[locale]}</p>
          </Block>

          {features.length > 0 && (
            <Block title={t.project.features}>
              <Bullets items={features} />
            </Block>
          )}

          {solution.length > 0 && (
            <Block title={t.project.solution}>
              <Bullets items={solution} />
            </Block>
          )}

          {collaboration.length > 0 && (
            <Block title={t.project.collaboration}>
              <div className="grid gap-12 sm:grid-cols-2 sm:gap-8">
                {collaboration.map((column) => (
                  <div key={column.title}>
                    <h3 className="mb-4 text-xl font-semibold font-semiwide">{column.title}</h3>
                    <Bullets items={column.items} />
                  </div>
                ))}
              </div>
            </Block>
          )}

          {steps.length > 0 && (
            <Block title={t.project.process}>
              <ol className="space-y-5">
                {steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-t border-line pt-5 sm:grid-cols-[3rem_1fr]"
                  >
                    {/* Número de etapa en gris, como los números de línea de un editor. */}
                    <span aria-hidden="true" className="pt-1 font-mono text-sm text-ink-soft">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <h3 className="text-xl font-semibold font-semiwide">{step.title}</h3>
                        {step.duration && (
                          <p className="font-mono text-sm text-code-number">{step.duration}</p>
                        )}
                      </div>
                      <p className="mt-2 text-lg text-ink-soft">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Block>
          )}

          {projectLayers(project).length > 0 && (
            <Block title={t.project.architecture} intro={t.project.architectureIntro}>
              <ArchitectureDiagram project={project} />
            </Block>
          )}

          {results.length > 0 && (
            <Block title={t.project.results}>
              <ul
                className={cn(
                  "grid gap-10 sm:gap-8",
                  results.length >= 3 && "sm:grid-cols-3",
                  results.length === 2 && "sm:grid-cols-2",
                )}
              >
                {results.map((result) => (
                  <li key={result.text}>
                    <p className="text-4xl font-bold tracking-tight whitespace-nowrap font-wide lg:text-5xl">
                      {result.value}
                    </p>
                    <p className="mt-3 text-ink-soft">{result.text}</p>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {project.learnings && (
            <Block title={t.project.learnings}>
              <p className="text-xl leading-relaxed lg:text-2xl">{project.learnings[locale]}</p>
            </Block>
          )}
        </div>

        <nav aria-label={t.project.next} className="border-t border-line">
          <Link
            to={projectPath(locale, next.slug)}
            viewTransition
            className="group shell block py-16 lg:py-24"
          >
            <span className="text-sm text-ink-soft">{t.project.next}</span>
            <span className="mt-3 block text-5xl font-extrabold tracking-tight font-wide transition-transform duration-300 ease-out group-hover:translate-x-2 lg:text-7xl">
              {localize(next.name, locale)}
            </span>
            <span className="mt-4 block max-w-xl text-lg text-ink-soft">
              {next.summary[locale]}
            </span>
          </Link>
        </nav>
      </article>
    </main>
  );
}

/**
 * Un bloque de la página: título a la izquierda (fijo al hacer scroll en
 * escritorio) y contenido a la derecha.
 */
function Block({
  title,
  intro,
  children,
}: {
  title: string;
  /** Una línea bajo el título que explica cómo leer el bloque. */
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-8 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-4">
        <h2 className="text-2xl font-semibold font-semiwide lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          {title}
        </h2>
        {intro && <p className="mt-3 text-ink-soft">{intro}</p>}
      </div>
      <div className="lg:col-span-8">{children}</div>
    </section>
  );
}

/** Lista separada por bordes, con una raya corta delante de cada elemento. */
function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4 text-lg">
      {items.map((item) => (
        <li key={item} className="relative border-t border-line pt-4 pl-8">
          <span aria-hidden="true" className="absolute top-[1.55rem] left-0 h-px w-4 bg-ink" />
          {item}
        </li>
      ))}
    </ul>
  );
}
