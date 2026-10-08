import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Descarga las funciones de Motion después del primer render, sin bloquear la carga. */
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Motion se usa solo para la interfaz (menú, indicador de navegación,
 * estados del formulario). `reducedMotion="user"` respeta la preferencia
 * del sistema en todos los componentes. Con `strict`, usar `motion.*` en vez
 * de `m.*` es un error: así nadie vuelve a meter Motion completo en la carga
 * inicial por accidente.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
