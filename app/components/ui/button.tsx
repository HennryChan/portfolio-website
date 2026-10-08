/**
 * Botones del sitio. buttonClass() da el estilo a cualquier elemento
 * (enlace o botón) y Magnetic agrega el efecto de atracción al puntero.
 * La respuesta al pulsar (escala) está en `.button` de app.css.
 */
import { m, useMotionTemplate, useSpring } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";

import { useMediaQuery, usePrefersReducedMotion } from "~/hooks/use-media-query";
import { cn } from "~/lib/cn";

/** `primary`: la acción principal, con fondo. `secondary`: solo contorno. */
type ButtonVariant = "primary" | "secondary";

/** Colores de cada variante; los del principal salen de las variables --button-* del tema. */
const variants: Record<ButtonVariant, string> = {
  primary: "bg-(--button-bg) text-(--button-fg) hover:bg-(--button-bg-hover)",
  secondary: "border border-line text-ink hover:border-ink",
};

/**
 * Clases de botón para <a>, <Link> o <button>.
 *
 * @param variant - Estilo del botón.
 * @param className - Clases extra (márgenes, alineación…).
 */
export function buttonClass(variant: ButtonVariant = "primary", className?: string): string {
  return cn(
    "button inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold whitespace-nowrap",
    variants[variant],
    className,
  );
}

/**
 * Atrae ligeramente su contenido hacia el puntero. Es decorativo, así que
 * solo se activa con ratón y sin "reducir movimiento".
 */
export function Magnetic({
  children,
  strength = 0.2,
}: {
  children: ReactNode;
  /** Fracción de la distancia al puntero que se mueve el contenido (0.2 = 20 %). */
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduceMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reduceMotion;

  // Resorte: sigue al puntero con algo de inercia y vuelve a su sitio sin rebotar de más.
  const spring = { stiffness: 260, damping: 20, mass: 0.6 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`;

  /** Mueve el contenido hacia el puntero, en proporción a su distancia al centro. */
  function handleMove(event: PointerEvent<HTMLSpanElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  /** Al salir el puntero, vuelve al centro. */
  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.span
      ref={ref}
      className="inline-flex"
      style={enabled ? { transform } : undefined}
      onPointerMove={enabled ? handleMove : undefined}
      onPointerLeave={enabled ? handleLeave : undefined}
    >
      {children}
    </m.span>
  );
}
