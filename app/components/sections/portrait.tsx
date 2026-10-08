import { profile } from "~/content/profile";
import { cn } from "~/lib/cn";

import { imageUrl } from "../projects/project-shot";

/**
 * Foto recortada (fondo transparente) sobre placas con los colores de las
 * capas. Sin foto (`profile.portrait`), muestra las iniciales.
 */
export function Portrait({
  className,
  label,
}: {
  className?: string;
  /** Texto alternativo de la foto (o de las iniciales, si no hay foto). */
  label: string;
}) {
  const photo = profile.portrait;

  return (
    <figure
      className={cn(
        "relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-line bg-surface",
        className,
      )}
      role={photo ? undefined : "img"}
      aria-label={photo ? undefined : label}
    >
      {/* Tres placas inclinadas con los colores de las capas, detrás de la foto. */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -top-[8%] -right-[18%] h-[46%] w-[95%] rotate-[-14deg] rounded-[1.5rem] bg-layer-ui/25" />
        <div className="absolute top-[30%] -right-[24%] h-[40%] w-[95%] rotate-[-14deg] rounded-[1.5rem] bg-layer-api/20" />
        <div className="absolute top-[64%] -right-[30%] h-[40%] w-[95%] rotate-[-14deg] rounded-[1.5rem] bg-layer-infra/20" />
      </div>

      {photo ? (
        <img
          src={imageUrl(photo, 960)}
          srcSet={`${imageUrl(photo, 960)} 960w, ${imageUrl(photo, 1600)} 1600w`}
          // En escritorio la foto ocupa cerca de un tercio de la pantalla; en móvil, casi todo el ancho.
          sizes="(min-width: 64rem) 30vw, 90vw"
          alt={label}
          width={960}
          height={Math.round(960 / photo.ratio)}
          loading="lazy"
          decoding="async"
          // La máscara desvanece la parte de abajo de la foto sobre el fondo.
          className="absolute inset-x-0 bottom-0 mx-auto h-[94%] w-auto max-w-none [mask-image:linear-gradient(to_bottom,#000_58%,transparent_97%)]"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-7 text-[5.5rem] leading-none font-extrabold tracking-tight text-ink/85 font-wide"
        >
          {profile.initials}
        </span>
      )}
    </figure>
  );
}
