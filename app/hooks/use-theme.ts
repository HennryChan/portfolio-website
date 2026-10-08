/**
 * Tema claro u oscuro. La fuente de verdad es el atributo `data-theme` de
 * `<html>`: lo pone themeInitScript antes de pintar (con la preferencia
 * guardada o, si no hay, la del sistema), lo cambia applyTheme y useTheme
 * solo lo observa. Así el CSS ya conoce el tema antes de que cargue React.
 */
import { useSyncExternalStore } from "react";

/** Temas del sitio; cada uno define sus colores en app/styles/app.css. */
export type Theme = "light" | "dark";

/** Clave en localStorage. themeInitScript usa la misma. */
const STORAGE_KEY = "theme";

/**
 * Se ejecuta en el <head> antes de pintar la página para evitar un destello
 * del tema equivocado. También marca el documento con `.js` y `.intro`.
 */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add("js","intro");try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t}catch(e){}})();`;

/** Tema que tiene ahora el documento. */
function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/** Avisa cada vez que cambia `data-theme` en `<html>`. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/** Tema activo; `null` durante el prerenderizado. */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, readTheme, () => null);
}

/**
 * Cambia el tema y lo guarda para la próxima visita. Si el navegador tiene
 * View Transitions, el cambio se ve como un fundido (reglas
 * `::view-transition-*` en app.css); con "reducir movimiento" es inmediato.
 *
 * @param theme - Tema nuevo.
 */
export function applyTheme(theme: Theme) {
  const update = () => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Navegación privada o almacenamiento bloqueado: el tema dura hasta recargar.
    }
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "startViewTransition" in document) {
    document.startViewTransition(update);
  } else {
    update();
  }
}
