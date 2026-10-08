import { useEffect, useState, type RefObject } from "react";

/**
 * true mientras el elemento esté (aunque sea en parte) dentro de la pantalla.
 * El hero lo usa para pausar el 3D cuando sale de la vista.
 *
 * @param ref - Elemento a observar.
 * @param rootMargin - Margen alrededor de la pantalla, como en IntersectionObserver
 * (p. ej. "100px" lo da por visible un poco antes de que entre).
 */
export function useInView(ref: RefObject<Element | null>, rootMargin = "0px"): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
