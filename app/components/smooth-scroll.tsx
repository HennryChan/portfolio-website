/**
 * Lenis suaviza la rueda del ratón y el trackpad. Vive fuera de React
 * (un único scroll para toda la página) y se sincroniza con el reloj de
 * GSAP para que ScrollTrigger y Lenis lean el mismo scroll en cada frame.
 * Con "reducir movimiento" no se crea y el scroll es el nativo.
 */
import Lenis from "lenis";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import { gsap, ScrollTrigger } from "~/animation/gsap";
import { usePrefersReducedMotion } from "~/hooks/use-media-query";

/** La instancia activa de Lenis, o `null` si el scroll es el nativo. */
let instance: Lenis | null = null;
/** Componentes suscritos con useLenis(). */
const listeners = new Set<() => void>();

/** Cambia la instancia y avisa a los componentes que la usan. */
function setInstance(next: Lenis | null) {
  instance = next;
  listeners.forEach((listener) => listener());
}

/** Suscripción para useSyncExternalStore. */
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * La instancia de Lenis para detenerla o reanudarla (p. ej. con el menú
 * abierto). `null` durante el prerenderizado o con "reducir movimiento".
 */
export function useLenis(): Lenis | null {
  return useSyncExternalStore(
    subscribe,
    () => instance,
    () => null,
  );
}

/**
 * Desplaza hasta una sección y le pasa el foco, como haría un ancla nativa.
 * También actualiza el `#hash` de la URL sin agregar una entrada al historial.
 *
 * @param id - id del elemento de destino.
 * @returns false si la sección no existe en esta página.
 */
export function scrollToSection(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  if (instance) {
    instance.scrollTo(target, { duration: 1.1 });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  // tabindex="-1": la sección puede recibir el foco sin entrar al orden del tabulador.
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  window.history.replaceState(window.history.state, "", `#${id}`);
  return true;
}

/** Sube al inicio de la página, con Lenis si está activo. */
export function scrollToTop() {
  if (instance) instance.scrollTo(0, { duration: 1.1 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Crea Lenis al montar la app y lo destruye si la persona activa
 * "reducir movimiento". No agrega elementos al DOM: solo envuelve a
 * `children`.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({
      // Qué tanto se acerca el scroll a su destino en cada frame (más bajo = más suave).
      lerp: 0.12,
      // Lo mueve el ticker de GSAP (abajo), no un requestAnimationFrame propio.
      autoRaf: false,
      // Al seguir un enlace interno, la inercia se detiene.
      stopInertiaOnNavigate: true,
    });
    lenis.on("scroll", ScrollTrigger.update);

    // El ticker de GSAP da el tiempo en segundos; Lenis lo espera en milisegundos.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Sin lagSmoothing: tras un frame lento, GSAP no frena su reloj y el scroll no se queda atrás.
    gsap.ticker.lagSmoothing(0);
    setInstance(lenis);

    return () => {
      gsap.ticker.remove(tick);
      // Valores por defecto de GSAP.
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setInstance(null);
    };
  }, [reduceMotion]);

  return children;
}
