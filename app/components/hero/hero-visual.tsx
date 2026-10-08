import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";

import { layerIds } from "~/content/types";
import { useSaveData, useWebGLSupport } from "~/hooks/use-device";
import { useInView } from "~/hooks/use-in-view";
import { useMediaQuery, usePrefersReducedMotion } from "~/hooks/use-media-query";
import { useTheme } from "~/hooks/use-theme";
import { useT } from "~/i18n/use-locale";
import { cn } from "~/lib/cn";

import { StackIllustration } from "./stack-illustration";
import type { SceneLayer } from "./stack-scene";

/** La escena 3D (three.js) se descarga en un archivo aparte y solo si se va a usar. */
const StackScene = lazy(() => import("./stack-scene"));

/**
 * Primero se ve la ilustración SVG (viene en el HTML). Si el dispositivo
 * puede y la persona no pidió menos movimiento, la escena 3D la reemplaza
 * con un fundido cuando termina la entrada de la portada.
 *
 * No se carga el 3D sin WebGL, con "reducir movimiento" ni con ahorro de
 * datos. En pantallas táctiles se usa una versión más ligera (`lowPower`).
 */
export function HeroVisual({ className }: { className?: string }) {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const saveData = useSaveData();
  const coarsePointer = useMediaQuery("(pointer: coarse)");
  const theme = useTheme();
  const inView = useInView(ref, "100px");
  // `theme !== null`: la página ya se hidrató y se pueden leer los colores del tema.
  const enabled = webgl && !reduceMotion && !saveData && theme !== null;

  /** Ya se puede descargar la escena. */
  const [shouldLoad, setShouldLoad] = useState(false);
  /** La escena dibujó su primer frame: empieza el fundido desde el SVG. */
  const [ready, setReady] = useState(false);

  // En la primera carga, la descarga espera a que pase lo principal de la entrada (1.4 s) y a
  // que el navegador quede libre, para no competir con la primera pintura.
  useEffect(() => {
    if (!enabled) return;
    let idle = 0;
    const delay = document.documentElement.classList.contains("intro") ? 1400 : 0;
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => setShouldLoad(true), { timeout: 800 });
      } else {
        setShouldLoad(true);
      }
    }, delay);
    return () => {
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, [enabled]);

  // Los colores salen de las variables CSS del tema activo.
  const { layers, background } = useMemo(() => {
    if (theme === null) return { layers: [] as SceneLayer[], background: "#000000" };
    const styles = getComputedStyle(document.documentElement);
    return {
      layers: layerIds.map((id) => ({
        id,
        label: t.layers[id],
        color: styles.getPropertyValue(`--layer-${id}`).trim(),
      })),
      background: styles.getPropertyValue("--paper").trim(),
    };
  }, [theme, t]);

  const show3D = enabled && ready;

  return (
    <div
      ref={ref}
      className={cn("relative mx-auto aspect-[455/386] w-full max-w-[40rem]", className)}
    >
      <StackIllustration
        className={cn("absolute inset-0 transition-opacity duration-500", show3D && "opacity-0")}
      />
      {enabled && shouldLoad && (
        <Suspense fallback={null}>
          <StackScene
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-700",
              show3D && "opacity-100",
            )}
            layers={layers}
            background={background}
            dark={theme === "dark"}
            active={inView}
            lowPower={coarsePointer}
            onReady={() => setReady(true)}
          />
        </Suspense>
      )}
    </div>
  );
}
