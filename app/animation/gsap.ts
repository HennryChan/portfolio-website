/**
 * Punto único de acceso a GSAP. Registra ScrollTrigger y useGSAP una sola vez
 * y reexporta las mismas instancias, para que todas las secciones (y Lenis,
 * que se sincroniza con el ticker de GSAP) compartan la misma configuración.
 * Los plugins que usa un solo componente se registran en ese componente
 * (p. ej. ScrambleTextPlugin en hero-hook.tsx).
 */
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Los plugins se registran una sola vez y solo en el navegador.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Condiciones de gsap.matchMedia() que se repiten en varias secciones. */
export const motionQueries = {
  /** La persona no pidió reducir el movimiento. */
  ok: "(prefers-reduced-motion: no-preference)",
  /** Pantalla de 64rem (1024 px) o más y sin "reducir movimiento". */
  desktop: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
