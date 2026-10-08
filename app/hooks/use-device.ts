/**
 * Capacidades del dispositivo que deciden si se descarga el hero 3D. Ninguna
 * cambia durante la visita, así que se leen una vez y sin suscripción.
 * Durante el prerenderizado ambas valen false: el HTML trae la ilustración
 * estática y el 3D llega después, solo si el navegador puede dibujarlo.
 */
import { useSyncExternalStore } from "react";

/** Suscripción vacía: los valores de este módulo no cambian mientras la página está abierta. */
const noopSubscribe = () => () => {};

/** Resultado de detectWebGL(), guardado para no crear un contexto WebGL en cada render. */
let webglSupport: boolean | undefined;

/**
 * Prueba WebGL 2 (o, si no, WebGL 1) en un canvas temporal y libera el
 * contexto de inmediato: los navegadores permiten pocos contextos a la vez.
 */
function detectWebGL(): boolean {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      webglSupport = context !== null;
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

/** El navegador puede dibujar WebGL. false durante el prerenderizado. */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(noopSubscribe, detectWebGL, () => false);
}

/**
 * La parte de la Network Information API que se usa aquí. No viene en los
 * tipos de TypeScript porque solo la implementan navegadores basados en Chromium.
 */
interface NetworkInformation {
  /** La persona activó el ahorro de datos en el navegador o el sistema. */
  saveData?: boolean;
}

/** Lee `navigator.connection.saveData`; false si el navegador no lo expone. */
function readSaveData(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return connection?.saveData === true;
}

/** La persona activó el ahorro de datos: no se descarga el 3D. */
export function useSaveData(): boolean {
  return useSyncExternalStore(noopSubscribe, readSaveData, () => false);
}
