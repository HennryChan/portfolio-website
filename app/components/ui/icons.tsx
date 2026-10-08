/**
 * Íconos de línea en SVG (24 × 24, trazo de 1.75). Toman el color del
 * texto (`currentColor`) y son decorativos (`aria-hidden`): el botón o
 * enlace que los contiene lleva su propio texto o `aria-label`.
 */
import type { SVGProps } from "react";

/** Cualquier atributo de <svg>; los que se pasan reemplazan a los de `base`. */
type IconProps = SVGProps<SVGSVGElement>;

/** Atributos comunes a todos los íconos de línea. */
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Luna: activa el tema oscuro. */
export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

/** Sol: activa el tema claro. */
export function SunIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </svg>
  );
}

/** Dos líneas: abre el menú en pantallas chicas. */
export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

/** Equis: cierra el menú. */
export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/** Dos hojas: copiar al portapapeles. */
export function CopyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
      <path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5" />
    </svg>
  );
}

/** Paloma: confirmación (p. ej. correo copiado). */
export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Flecha que sale de un cuadro: el enlace abre otro sitio. */
export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 5h5v5M19 5l-8 8M17 14v4a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 5 18V8.5A1.5 1.5 0 0 1 6.5 7H10" />
    </svg>
  );
}

/** Medalla: certificación. */
export function BadgeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m9.5 13.8-1.5 7 4-2.2 4 2.2-1.5-7" />
      <path d="m10 9 1.4 1.4L14.2 7.6" />
    </svg>
  );
}

/** Marca del sitio: tres placas apiladas, como las capas del hero. */
export function LogoMark(props: IconProps) {
  return (
    <svg width={28} height={28} viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path d="M16 4 28 10 16 16 4 10Z" fill="var(--layer-ui)" />
      <path d="M16 11.5 28 17.5 16 23.5 4 17.5Z" fill="var(--layer-api)" opacity="0.85" />
      <path d="M16 19 28 25 16 31 4 25Z" fill="var(--layer-infra)" opacity="0.7" />
    </svg>
  );
}
