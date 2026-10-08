import { useRef, type CSSProperties } from "react";

import { gsap, motionQueries, useGSAP } from "~/animation/gsap";
import { projects } from "~/content/projects";
import { sectionIntros } from "~/content/sections";
import { useLocale, useT } from "~/i18n/use-locale";

import { ProjectCard } from "../projects/project-card";
import { SectionHeading } from "../ui/section-heading";

/**
 * Sección de proyectos de la portada: una tarjeta por proyecto, en el
 * orden de app/content/projects.ts. En escritorio las tarjetas se apilan
 * al hacer scroll (`.project-stack-item` es sticky en app.css).
 */
export function Projects() {
  const locale = useLocale();
  const t = useT();
  const ref = useRef<HTMLElement>(null);

  // En escritorio las tarjetas se quedan fijas y la siguiente se apila encima:
  // la de abajo se encoge un poco y se oscurece, como una capa que queda atrás.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQueries.desktop, () => {
        const items = gsap.utils.toArray<HTMLElement>(".project-stack-item");
        items.forEach((item, index) => {
          const next = items[index + 1];
          if (!next) return;
          gsap
            .timeline({
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                // Termina cuando la siguiente tarjeta llega a su posición fija (su `top` sticky).
                end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .to(item.querySelector(".project-card"), { scale: 0.93, ease: "none" }, 0)
            .to(item.querySelector(".project-shade"), { opacity: 0.5, ease: "none" }, 0);
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="projects"
      ref={ref}
      aria-labelledby="projects-title"
      className="shell py-28 lg:py-40"
    >
      <SectionHeading
        id="projects-title"
        title={t.projects.title}
        intro={sectionIntros.projects[locale]}
      />

      <ul className="mt-16 space-y-6 lg:mt-24 lg:space-y-[18vh]">
        {projects.map((project, index) => (
          <li
            key={project.slug}
            className="project-stack-item"
            // --i: posición en la pila; cada tarjeta queda fija un poco más abajo que la anterior.
            style={{ "--i": index } as CSSProperties}
          >
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
