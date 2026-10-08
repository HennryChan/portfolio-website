import type { CSSProperties } from "react";

import { stack } from "~/content/stack";
import { layerIds, type LayerId, type StackLayer } from "~/content/types";
import { localize } from "~/i18n/localize";
import { useLocale, useT } from "~/i18n/use-locale";

import { SectionHeading } from "../ui/section-heading";

/** El grupo es una de las cuatro capas del hero (y no un tema transversal como seguridad). */
const isLayer = (id: StackLayer["id"]): id is LayerId =>
  (layerIds as readonly string[]).includes(id);

/**
 * Primero las cuatro capas del hero (mismo orden y color); después lo que
 * atraviesa a todas, como la seguridad, en un tono neutro.
 */
export function Stack() {
  const t = useT();
  const layers = stack.filter((group) => isLayer(group.id));
  const crossCutting = stack.filter((group) => !isLayer(group.id));

  return (
    <section id="stack" aria-labelledby="stack-title" className="shell py-28 lg:py-40">
      <SectionHeading id="stack-title" title={t.stack.title} intro={t.stack.intro} />

      <ul className="mt-16 space-y-3 lg:mt-24">
        {layers.map((group) => (
          <StackRow key={group.id} group={group} />
        ))}
      </ul>

      {crossCutting.length > 0 && (
        <>
          <h3 className="mt-14 mb-4 text-sm text-ink-soft">{t.stack.crossCutting}</h3>
          <ul className="space-y-3">
            {crossCutting.map((group) => (
              <StackRow key={group.id} group={group} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/**
 * Una fila del stack: nombre y descripción del grupo, y sus tecnologías
 * en hasta tres listas (uso diario, también, aprendiendo). Las de uso
 * diario van en el color de "variable" del tema de código.
 */
function StackRow({ group }: { group: StackLayer }) {
  const locale = useLocale();
  const t = useT();
  const title = isLayer(group.id) ? t.layers[group.id] : t.stack.groups[group.id];
  // Las capas llevan su color; los temas transversales, un gris neutro.
  const color = isLayer(group.id) ? `var(--layer-${group.id})` : "var(--ink-soft)";

  // Las listas vacías no se muestran.
  const lists = [
    { label: t.stack.daily, items: group.daily, strong: true },
    { label: t.stack.also, items: group.also, strong: false },
    { label: t.stack.learning, items: group.learning ?? [], strong: false },
  ].filter((list) => list.items.length > 0);

  return (
    <li
      className="layer-row relative grid gap-6 overflow-hidden rounded-2xl py-7 pr-6 pl-8 sm:pr-8 sm:pl-10 lg:grid-cols-12 lg:gap-8 lg:py-9"
      style={{ "--layer": color } as CSSProperties}
    >
      <div className="lg:col-span-4">
        <h3 className="text-2xl font-semibold font-semiwide">{title}</h3>
        <p className="mt-2 text-ink-soft">{group.description[locale]}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
        {lists.map((list) => (
          <div key={list.label}>
            <p className="text-sm text-ink-soft">{list.label}</p>
            <ul
              className={`mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-base ${list.strong ? "text-code-tech" : "text-ink-soft"}`}
            >
              {list.items.map((tech) => {
                const name = localize(tech, locale);
                return <li key={name}>{name}</li>;
              })}
            </ul>
          </div>
        ))}
      </div>
    </li>
  );
}
