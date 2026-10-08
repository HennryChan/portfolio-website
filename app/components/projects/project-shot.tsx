import type { CSSProperties } from "react";

import type { ContentImage, Project } from "~/content/types";
import { localize } from "~/i18n/localize";
import { useLocale } from "~/i18n/use-locale";
import { cn } from "~/lib/cn";

/**
 * URL de una imagen generada por `npm run images`.
 *
 * @param image - Imagen del contenido; `src` es el nombre del archivo en images/ sin extensión.
 * @param width - Ancho de la versión: 960 o 1600 px.
 * @returns Ruta dentro de public/images, con la base del sitio (BASE_URL).
 */
export function imageUrl(image: ContentImage, width: 960 | 1600): string {
  return `${import.meta.env.BASE_URL}images/${image.src}-${width}.webp`;
}

/** Props de ProjectShot. */
interface ProjectShotProps {
  /** Proyecto de la captura: de su enlace en vivo sale el dominio de la barra. */
  project: Project;
  /** Captura del proyecto, con su texto alternativo. */
  image: NonNullable<Project["image"]>;
  /** En la tarjeta la captura acompaña al título: no necesita texto alternativo. */
  decorative?: boolean;
  /** Primera imagen visible de la página: se carga sin esperar. */
  priority?: boolean;
  /** Clases del contenedor. */
  className?: string;
  /** Estilos del contenedor; se usa para el nombre de la View Transition. */
  style?: CSSProperties;
}

/**
 * Captura real dentro de una ventana de navegador con el dominio del
 * proyecto (o su nombre, si no tiene enlace en vivo). Al pasar el puntero
 * por la tarjeta, la ventana se eleva (`.project-shot` en app.css).
 */
export function ProjectShot({
  project,
  image,
  decorative,
  priority,
  className,
  style,
}: ProjectShotProps) {
  const locale = useLocale();
  const host = project.links.live
    ? new URL(project.links.live).host
    : localize(project.name, locale);

  return (
    <figure
      className={cn(
        "project-shot overflow-hidden rounded-[14px] border border-line bg-raised shadow-[0_24px_48px_-28px_rgb(15_23_42/0.45)]",
        className,
      )}
      style={style}
    >
      <div
        aria-hidden="true"
        className="flex items-center gap-1.5 border-b border-line px-3.5 py-2.5"
      >
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="ml-3 truncate rounded-full bg-surface px-3 py-0.5 text-xs text-ink-soft">
          {host}
        </span>
      </div>
      <img
        src={imageUrl(image, 960)}
        srcSet={`${imageUrl(image, 960)} 960w, ${imageUrl(image, 1600)} 1600w`}
        // En escritorio la captura ocupa cerca del 60 % del ancho; en móvil, todo.
        sizes="(min-width: 64rem) 60vw, 100vw"
        alt={decorative ? "" : image.alt[locale]}
        width={1600}
        height={Math.round(1600 / image.ratio)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="block h-auto w-full"
      />
    </figure>
  );
}
