import { useRef, type CSSProperties } from "react";

import { gsap, motionQueries, useGSAP } from "~/animation/gsap";
import { layerIds, type Project } from "~/content/types";
import { useT } from "~/i18n/use-locale";

/**
 * Capas del proyecto que tienen al menos una tecnología, de arriba hacia abajo.
 * La página del proyecto la usa para saber si muestra el diagrama.
 */
export function projectLayers(project: Project) {
  return layerIds.flatMap((id) => {
    const items = project.architecture?.[id] ?? [];
    return items.length > 0 ? [{ id, items }] : [];
  });
}

/**
 * Las piezas del proyecto organizadas en las capas del hero.
 * Al entrar en pantalla, las capas pasan de apiladas a separadas.
 */
export function ArchitectureDiagram({ project }: { project: Project }) {
  const t = useT();
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQueries.ok, () => {
        // Las capas parten encimadas hacia arriba y semitransparentes, y bajan hasta su lugar.
        gsap.from(".arch-layer", {
          y: (index: number) => -index * 34,
          opacity: (index: number) => (index === 0 ? 1 : 0.35),
          duration: 1,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="relative space-y-3">
      {projectLayers(project).map(({ id, items }) => (
        <li
          key={id}
          className="arch-layer relative grid gap-4 rounded-2xl border border-[color-mix(in_oklab,var(--layer)_45%,var(--line))] bg-[color-mix(in_oklab,var(--layer)_7%,var(--surface))] px-6 py-5 sm:grid-cols-[11rem_1fr] sm:items-center"
          // --layer: el color de la capa para borde, fondo y marca.
          style={{ "--layer": `var(--layer-${id})` } as CSSProperties}
        >
          <p className="flex items-center gap-3 font-semibold">
            <span aria-hidden="true" className="size-2.5 rounded-sm bg-(--layer)" />
            {t.layers[id]}
          </p>
          <ul className="flex flex-wrap gap-2">
            {items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-line bg-raised px-3 py-1 font-mono text-sm text-code-tech"
              >
                {item}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
