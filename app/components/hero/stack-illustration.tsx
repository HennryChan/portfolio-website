/**
 * Vista isométrica de las cuatro capas, dibujada en SVG. Es lo primero que
 * se ve (viene en el HTML prerenderizado) y se queda como versión final
 * cuando no hay WebGL o la persona prefiere menos movimiento.
 *
 * Las medidas están en unidades del SVG: cada placa es un rectángulo de
 * W × D sobre el plano (x, z), proyectado con iso() y apilado hacia abajo.
 */
import type { CSSProperties } from "react";

import { layerIds, type LayerId } from "~/content/types";
import { useT } from "~/i18n/use-locale";
import { cn } from "~/lib/cn";

/** Punto [x, y] en coordenadas del SVG. */
type Point = readonly [number, number];

/** Ancho de la placa (eje x). */
const W = 196;
/** Fondo de la placa (eje z). */
const D = 132;
/** Grosor de la placa. */
const T = 10;
/** Separación vertical entre placas. */
const GAP = 62;
/** Largo de la línea que une cada placa con su etiqueta. */
const CALLOUT = 30;

/** Proyección isométrica: los ejes x y z se inclinan 30° sobre la horizontal. */
const COS = Math.cos(Math.PI / 6);
/** Seno de 30°: cuánto baja en pantalla cada unidad de x o z. */
const SIN = Math.sin(Math.PI / 6);
/** Lleva un punto del plano de la placa (x, z) a coordenadas del SVG. */
const iso = (x: number, z: number): Point => [(x - z) * COS, (x + z) * SIN];
/** Baja un punto `dy` unidades: así se apila cada placa debajo de la anterior. */
const shift = ([x, y]: Point, dy: number): Point => [x, y + dy];
/** Convierte una lista de puntos al formato del atributo `points` de <polygon>. */
const points = (list: Point[]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

// Esquinas de la cara superior de una placa, ya proyectadas.
/** Esquina de atrás: la de más arriba en pantalla. */
const BACK = iso(0, 0);
/** Esquina derecha: de aquí sale la línea de la etiqueta. */
const RIGHT = iso(W, 0);
/** Esquina del frente: la de más abajo en pantalla. */
const FRONT = iso(W, D);
/** Esquina izquierda. */
const LEFT = iso(0, D);

/**
 * Área visible del SVG: la pila completa más las líneas de las etiquetas.
 * Las etiquetas HTML se colocan con estas mismas medidas.
 */
export const VIEWBOX = { x: -125, y: -14, width: 455, height: 386 } as const;

/**
 * Rectángulo sobre la cara superior de una placa, ya proyectado.
 *
 * @param x - Inicio en el eje x.
 * @param z - Inicio en el eje z.
 * @param w - Ancho (eje x).
 * @param d - Fondo (eje z).
 * @param dy - Desplazamiento vertical de la placa en la pila.
 */
function isoRect(x: number, z: number, w: number, d: number, dy: number) {
  return points(
    [iso(x, z), iso(x + w, z), iso(x + w, z + d), iso(x, z + d)].map((p) => shift(p, dy)),
  );
}

/**
 * Pequeños detalles sobre cada placa que sugieren qué hace la capa:
 * bloques de una pantalla (UI), conexiones (API), bases de datos (datos)
 * y servidores (infraestructura).
 */
function Detail({
  id,
  dy,
}: {
  /** Capa: decide los detalles. */
  id: LayerId;
  /** Desplazamiento vertical de la placa en la pila. */
  dy: number;
}) {
  const fill = "color-mix(in oklab, var(--c) 34%, transparent)";
  switch (id) {
    case "ui":
      return (
        <g fill={fill}>
          <polygon points={isoRect(18, 16, 160, 22, dy)} />
          <polygon points={isoRect(18, 48, 64, 66, dy)} />
          <polygon points={isoRect(92, 48, 86, 66, dy)} />
        </g>
      );
    case "api":
      return (
        <g
          stroke="color-mix(in oklab, var(--c) 55%, transparent)"
          strokeWidth={2.2}
          strokeLinecap="round"
        >
          {[30, 66, 102].map((z) => {
            const [x1, y1] = shift(iso(22, z), dy);
            const [x2, y2] = shift(iso(174, z), dy);
            return <line key={z} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
      );
    case "data":
      return (
        <g fill={fill}>
          {[28, 82, 136].map((x) => (
            <polygon key={x} points={isoRect(x, 40, 34, 52, dy)} />
          ))}
        </g>
      );
    case "infra":
      return (
        <g fill={fill}>
          {[20, 64, 108, 152].flatMap((x) =>
            [24, 74].map((z) => <polygon key={`${x}-${z}`} points={isoRect(x, z, 26, 34, dy)} />),
          )}
        </g>
      );
  }
}

/**
 * La pila de capas en SVG. Para lectores de pantalla es una sola imagen
 * con la lista de capas; las etiquetas visibles se ocultan para no
 * leerlas dos veces. En la primera carga, placas y etiquetas entran
 * escalonadas (`.intro .iso-plate` y `.intro .iso-callout` en app.css).
 */
export function StackIllustration({ className }: { className?: string }) {
  const t = useT();
  const description = `${t.hero.layersLabel}: ${layerIds.map((id) => t.layers[id]).join(", ")}`;

  return (
    <div className={cn("@container", className)} role="img" aria-label={description}>
      <svg
        viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.width} ${VIEWBOX.height}`}
        className="absolute inset-0 size-full overflow-visible"
        aria-hidden="true"
      >
        {/* De abajo hacia arriba para que cada placa tape a la de debajo. */}
        {[...layerIds].reverse().map((id) => {
          const index = layerIds.indexOf(id);
          const dy = index * GAP;
          // --c: color de la capa; --order: turno en la entrada, de abajo hacia arriba.
          const style = {
            "--c": `var(--layer-${id})`,
            "--order": layerIds.length - 1 - index,
          } as CSSProperties;
          const [rx, ry] = shift(RIGHT, dy);

          return (
            <g key={id} style={style}>
              <g className="iso-plate">
                {/* Caras laterales (derecha e izquierda) y cara superior. */}
                <polygon
                  points={points(
                    [RIGHT, FRONT, shift(FRONT, T), shift(RIGHT, T)].map((p) => shift(p, dy)),
                  )}
                  fill="color-mix(in oklab, var(--c) 58%, transparent)"
                />
                <polygon
                  points={points(
                    [FRONT, LEFT, shift(LEFT, T), shift(FRONT, T)].map((p) => shift(p, dy)),
                  )}
                  fill="color-mix(in oklab, var(--c) 40%, transparent)"
                />
                <polygon
                  points={points([BACK, RIGHT, FRONT, LEFT].map((p) => shift(p, dy)))}
                  fill="color-mix(in oklab, var(--c) 16%, transparent)"
                  stroke="var(--c)"
                  strokeWidth={1.4}
                  strokeLinejoin="round"
                />
                <Detail id={id} dy={dy} />
              </g>
              <line
                className="iso-callout"
                x1={rx + 6}
                y1={ry}
                x2={rx + 6 + CALLOUT}
                y2={ry}
                stroke="var(--ink-soft)"
                strokeWidth={1}
              />
            </g>
          );
        })}
      </svg>

      {/* Etiquetas en HTML para que el texto conserve su tamaño en cualquier pantalla. */}
      {layerIds.map((id, index) => {
        const [rx, ry] = shift(RIGHT, index * GAP);
        // Posición en % del contenedor: el final de la línea, más un pequeño margen.
        const left = ((rx + 6 + CALLOUT + 8 - VIEWBOX.x) / VIEWBOX.width) * 100;
        const top = ((ry - VIEWBOX.y) / VIEWBOX.height) * 100;
        return (
          <span
            key={id}
            aria-hidden="true"
            className="iso-callout absolute max-w-[26%] -translate-y-1/2 text-xs leading-tight font-semibold text-ink @md:text-sm"
            style={
              {
                left: `${left}%`,
                top: `${top}%`,
                "--order": layerIds.length - 1 - index,
              } as CSSProperties
            }
          >
            {t.layers[id]}
          </span>
        );
      })}
    </div>
  );
}
