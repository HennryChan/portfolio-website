import { useRef } from "react";

import { gsap, motionQueries, ScrollTrigger, useGSAP } from "~/animation/gsap";
import { education, experience } from "~/content/experience";
import { sectionIntros } from "~/content/sections";
import { useLocale, useT } from "~/i18n/use-locale";

import { SectionHeading } from "../ui/section-heading";

/**
 * Sección de experiencia: línea de tiempo de trabajos (del más reciente al
 * más antiguo) y, debajo, formación y certificaciones. En escritorio el
 * título se queda fijo mientras se recorre la lista.
 */
export function Experience() {
  const locale = useLocale();
  const t = useT();
  const ref = useRef<HTMLElement>(null);

  // La línea de tiempo se dibuja al ritmo del scroll y cada punto se marca al alcanzarlo.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQueries.ok, () => {
        gsap.fromTo(
          ".timeline-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".timeline",
              start: "top 65%",
              end: "bottom 65%",
              scrub: 0.4,
            },
          },
        );
        gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 65%",
            toggleClass: { targets: item, className: "is-reached" },
            // Hasta el final de la página: al seguir bajando, el punto queda marcado.
            end: "max",
          });
        });
      });
      // Sin animación, la línea aparece completa y todos los puntos marcados.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils
          .toArray<HTMLElement>(".timeline-item")
          .forEach((item) => item.classList.add("is-reached"));
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="experience"
      ref={ref}
      aria-labelledby="experience-title"
      className="shell py-28 lg:py-40"
    >
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <SectionHeading
              id="experience-title"
              title={t.experience.title}
              intro={sectionIntros.experience[locale]}
            />
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="timeline relative">
            <div aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line">
              <div className="timeline-fill size-full origin-top bg-ink" />
            </div>

            <ol className="space-y-16">
              {experience.map((job) => (
                <li key={`${job.company}-${job.start}`} className="timeline-item relative pl-10">
                  <span
                    aria-hidden="true"
                    className="timeline-dot absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-line bg-paper"
                  />
                  <p className="font-mono text-sm text-code-number">
                    {formatMonth(job.start, t.experience.months)} –{" "}
                    {job.end ? formatMonth(job.end, t.experience.months) : t.experience.present}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold font-semiwide">{job.role[locale]}</h3>
                  <p className="mt-1 text-ink-soft">
                    {job.location ? `${job.company}, ${job.location[locale]}` : job.company}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {job.highlights[locale].map((highlight) => (
                      <li
                        key={highlight}
                        className="relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-ink-soft"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  {job.stack && job.stack.length > 0 && (
                    <p className="mt-5 font-mono text-sm text-code-tech">{job.stack.join(", ")}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-20 border-t border-line pt-10">
            <h3 className="text-xl font-semibold font-semiwide">{t.experience.education}</h3>
            <ul className="mt-6 space-y-5">
              {education.map((item) => (
                <li key={item.title.es} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-6">
                  <div>
                    <p className="font-medium">{item.title[locale]}</p>
                    {item.institution && <p className="text-ink-soft">{item.institution}</p>}
                  </div>
                  {item.period && (
                    <p className="font-mono text-sm text-code-number sm:pt-1">{item.period}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * "2023-10" → "oct 2023". Tabla propia para que el build y el navegador escriban lo mismo.
 *
 * @param value - Mes en formato "AAAA-MM".
 * @param months - Nombres cortos de los meses en el idioma de la página.
 */
function formatMonth(value: string, months: readonly string[]): string {
  const [year, month] = value.split("-");
  return `${months[Number(month) - 1]} ${year}`;
}
