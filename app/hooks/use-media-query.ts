import { useCallback, useSyncExternalStore } from "react";

/**
 * Lee una media query de forma segura para el prerenderizado: en el build
 * devuelve `serverValue` y en el navegador se actualiza sola.
 *
 * @param query - Media query de CSS, p. ej. "(min-width: 64rem)".
 * @param serverValue - Valor durante el prerenderizado y la hidratación.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** En el build se asume "reducir movimiento" para no animar nada antes de saberlo. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}
