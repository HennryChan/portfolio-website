/**
 * Ilustraciones para los proyectos que todavía no tienen captura real
 * (con captura se usa <ProjectShot>). Cada una tiene tres profundidades
 * (`.art-depth-1` a `-3`) que se separan al pasar el puntero.
 *
 * Todas comparten un lienzo de 640 × 420 y los colores salen de variables
 * CSS (`--art-*` en app.css): cambian con el tema y con el tono de cada
 * proyecto (`hue`).
 */
import type { CSSProperties, JSX } from "react";

import type { ProjectArtVariant } from "~/content/types";
import { cn } from "~/lib/cn";

/** Props de ProjectArt. */
interface ProjectArtProps {
  /** Tipo de producto que se dibuja (tienda, panel, agenda…). */
  variant: ProjectArtVariant;
  /** Tono del color de acento, de 0 a 360 (OKLCH). */
  hue: number;
  /** Clases del SVG. */
  className?: string;
  /** Estilos del SVG; se usa para el nombre de la View Transition. */
  style?: CSSProperties;
}

/**
 * Dibuja la escena del proyecto. Salvo el kiosco (que es un aparato),
 * todas van dentro de una ventana de navegador.
 */
export function ProjectArt({ variant, hue, className, style }: ProjectArtProps) {
  const Scene = scenes[variant];
  return (
    <svg
      viewBox="0 0 640 420"
      className={cn("project-art block h-auto w-full", className)}
      style={{ "--art-hue": hue, ...style } as CSSProperties}
      aria-hidden="true"
    >
      {/* Ventana de navegador: fondo, tres botones y barra de dirección. */}
      {variant !== "kiosk" && (
        <g className="art-depth-1">
          <rect
            x="20"
            y="22"
            width="600"
            height="376"
            rx="16"
            fill="var(--art-bg)"
            stroke="var(--art-line)"
          />
          <g fill="var(--art-line)">
            <circle cx="44" cy="44" r="5" />
            <circle cx="62" cy="44" r="5" />
            <circle cx="80" cy="44" r="5" />
          </g>
          <rect x="112" y="36" width="220" height="16" rx="8" fill="var(--art-panel)" />
          <line x1="20" x2="620" y1="66" y2="66" stroke="var(--art-line)" />
        </g>
      )}
      <Scene />
    </svg>
  );
}

/** Barra con extremos redondeados: representa una línea de texto, un botón o una etiqueta. */
function Bar({
  x,
  y,
  w,
  h = 8,
  fill,
  opacity,
}: {
  /** Borde izquierdo. */
  x: number;
  /** Borde superior. */
  y: number;
  /** Ancho. */
  w: number;
  /** Alto (8 por defecto); los extremos son semicírculos de ese diámetro. */
  h?: number;
  /** Color. */
  fill: string;
  /** Opacidad, de 0 a 1. */
  opacity?: number;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} opacity={opacity} />;
}

/** Texto simulado: la tinta del tema muy transparente. */
const text = "var(--art-text)";
/** Bordes y separadores. */
const line = "var(--art-line)";
/** Acento del proyecto (su `hue`). */
const accent = "var(--art-accent)";
/** El acento muy suave, para fondos y elementos secundarios. */
const soft = "var(--art-accent-soft)";
/** Fondo de paneles y tarjetas. */
const panel = "var(--art-panel)";
/** Fondo de la ventana. */
const bg = "var(--art-bg)";

/** Tienda en línea: filtros a la izquierda, cuadrícula de productos y un aviso flotante. */
function Commerce() {
  return (
    <>
      <g className="art-depth-2">
        <Bar x={44} y={92} w={92} h={10} fill={text} />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect
              x={44}
              y={122 + i * 28}
              width={14}
              height={14}
              rx={4}
              fill={i === 1 || i === 3 ? accent : "none"}
              stroke={line}
            />
            <Bar x={66} y={125 + i * 28} w={58 + (i % 3) * 12} fill={text} />
          </g>
        ))}
        {[0, 1, 2].flatMap((column) =>
          [0, 1].map((row) => {
            const x = 168 + column * 148;
            const y = 86 + row * 150;
            return (
              <g key={`${column}-${row}`}>
                <rect x={x} y={y} width={132} height={136} rx={12} fill={panel} />
                <rect x={x + 8} y={y + 8} width={116} height={76} rx={8} fill={soft} />
                <circle
                  cx={x + 66}
                  cy={y + 46}
                  r={20}
                  fill={accent}
                  opacity={0.9 - (column + row) * 0.12}
                />
                <Bar x={x + 10} y={y + 96} w={78} fill={text} />
                <Bar x={x + 10} y={y + 112} w={36} h={12} fill={accent} />
              </g>
            );
          }),
        )}
      </g>
      <g className="art-depth-3">
        <rect x={432} y={300} width={170} height={74} rx={14} fill={bg} stroke={line} />
        <circle cx={462} cy={337} r={14} fill={accent} />
        <Bar x={486} y={326} w={90} h={9} fill={text} />
        <Bar x={486} y={342} w={56} fill={line} />
      </g>
    </>
  );
}

/** Panel de métricas: tres indicadores, una gráfica de línea con su detalle y una de barras. */
function Analytics() {
  const curve =
    "M 56 330 C 96 318, 120 268, 160 276 S 228 312, 262 256 S 330 214, 360 226 S 388 196, 396 188";
  return (
    <>
      <g className="art-depth-2">
        {[0, 1, 2].map((i) => {
          const x = 40 + i * 192;
          return (
            <g key={i}>
              <rect x={x} y={84} width={176} height={74} rx={12} fill={panel} />
              <Bar x={x + 14} y={100} w={64} fill={text} />
              <Bar x={x + 14} y={120} w={92} h={18} fill={text} />
              <Bar x={x + 116} y={124} w={44} h={12} fill={i === 1 ? accent : soft} />
            </g>
          );
        })}
        <rect x={40} y={174} width={368} height={204} rx={12} fill={panel} />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={56} x2={392} y1={206 + i * 44} y2={206 + i * 44} stroke={line} />
        ))}
        <path d={`${curve} L 396 360 L 56 360 Z`} fill={accent} opacity={0.14} />
        <path d={curve} fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
        <rect x={424} y={174} width={176} height={204} rx={12} fill={panel} />
        {[96, 132, 70, 150, 112, 84].map((height, i) => (
          <rect
            key={i}
            x={442 + i * 25}
            y={360 - height}
            width={16}
            height={height}
            rx={5}
            fill={i === 3 ? accent : soft}
          />
        ))}
      </g>
      <g className="art-depth-3">
        <line x1={262} x2={262} y1={256} y2={360} stroke={accent} strokeDasharray="4 5" />
        <circle cx={262} cy={256} r={7} fill={bg} stroke={accent} strokeWidth={3} />
        <rect x={276} y={206} width={112} height={44} rx={10} fill={bg} stroke={line} />
        <Bar x={290} y={219} w={56} fill={text} />
        <Bar x={290} y={233} w={34} h={7} fill={accent} />
      </g>
    </>
  );
}

/** Agenda: calendario semanal con citas, lista de próximas citas y confirmación de reserva. */
function Scheduling() {
  // Citas en el calendario: [día, franja horaria, destacada].
  const booked: Array<[number, number, boolean]> = [
    [1, 0, true],
    [3, 0, false],
    [0, 1, false],
    [2, 1, true],
    [5, 1, false],
    [1, 2, false],
    [4, 2, true],
    [6, 3, false],
    [2, 4, true],
  ];
  return (
    <>
      <g className="art-depth-2">
        <rect x={40} y={84} width={360} height={294} rx={12} fill={panel} />
        {[0, 1, 2, 3, 4, 5, 6].map((column) => (
          <Bar key={column} x={63 + column * 48} y={96} w={26} fill={text} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((column) => (
          <line
            key={`v${column}`}
            x1={52 + column * 48}
            x2={52 + column * 48}
            y1={116}
            y2={356}
            stroke={line}
          />
        ))}
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <line
            key={`h${row}`}
            x1={52}
            x2={388}
            y1={116 + row * 48}
            y2={116 + row * 48}
            stroke={line}
          />
        ))}
        {booked.map(([column, row, strong]) => (
          <Bar
            key={`${column}-${row}`}
            x={57 + column * 48}
            y={136 + row * 48}
            w={38}
            h={12}
            fill={strong ? accent : soft}
          />
        ))}
        <rect x={416} y={84} width={184} height={294} rx={12} fill={panel} />
        {[0, 1, 2, 3].map((i) => {
          const y = 104 + i * 66;
          return (
            <g key={i}>
              <circle cx={440} cy={y + 18} r={12} fill={i === 0 ? accent : soft} />
              <Bar x={462} y={y + 8} w={84} fill={text} />
              <Bar x={462} y={y + 22} w={56} h={7} fill={line} />
              <Bar x={556} y={y + 11} w={30} h={14} fill={soft} />
            </g>
          );
        })}
      </g>
      <g className="art-depth-3">
        <rect x={286} y={268} width={196} height={90} rx={14} fill={bg} stroke={line} />
        <circle cx={318} cy={313} r={16} fill={accent} />
        <path
          d="M 310 313 l 6 6 l 11 -12"
          stroke={bg}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Bar x={344} y={300} w={110} h={9} fill={text} />
        <Bar x={344} y={318} w={70} fill={line} />
      </g>
    </>
  );
}

/** API: lista de endpoints, editor de código y panel de respuesta, con un botón de acción. */
function Api() {
  // Sangría y ancho de cada línea del código simulado, y los tres colores que se alternan.
  const indent = [0, 1, 1, 2, 2, 2, 1, 1, 2, 1, 0];
  const widths = [86, 120, 64, 100, 76, 132, 58, 96, 110, 72, 40];
  const codeColors = ["oklch(0.78 0.12 var(--art-hue))", "#7d8aa8", "#c9d1e1"];
  return (
    <>
      <g className="art-depth-2">
        <rect x={40} y={84} width={128} height={294} rx={12} fill={panel} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <g key={i}>
            <Bar x={54} y={102 + i * 32} w={28} h={12} fill={i % 3 === 0 ? accent : soft} />
            <Bar x={88} y={104 + i * 32} w={56 - (i % 2) * 14} fill={text} />
          </g>
        ))}
        <rect x={184} y={84} width={256} height={294} rx={12} fill="#141d33" />
        {indent.map((level, i) => (
          <g key={i}>
            <Bar
              x={204 + level * 16}
              y={104 + i * 24}
              w={Math.min(widths[i], 200 - level * 16) * 0.45}
              fill={codeColors[i % 3]}
            />
            <Bar
              x={204 + level * 16 + Math.min(widths[i], 200 - level * 16) * 0.5}
              y={104 + i * 24}
              w={Math.min(widths[i], 200 - level * 16) * 0.5}
              fill={codeColors[(i + 1) % 3]}
              opacity={0.8}
            />
          </g>
        ))}
        <rect x={456} y={84} width={144} height={294} rx={12} fill={panel} />
        <Bar x={472} y={102} w={44} h={16} fill={accent} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Bar
            key={i}
            x={472 + (i % 3 ? 14 : 0)}
            y={136 + i * 26}
            w={60 + ((i * 17) % 40)}
            fill={text}
          />
        ))}
      </g>
      <g className="art-depth-3">
        <rect x={250} y={318} width={210} height={44} rx={22} fill={accent} />
        <Bar x={272} y={335} w={40} h={10} fill={bg} />
        <Bar x={320} y={335} w={110} h={10} fill={bg} opacity={0.7} />
      </g>
    </>
  );
}

/** Kiosco de trámites: pantalla con la lista de servicios, lector de tarjeta y comprobante de pago. */
function Kiosk() {
  // Cuadrícula 5 × 5 del código QR del comprobante (1 = módulo oscuro).
  const qr = [
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
  ];
  return (
    <>
      <g className="art-depth-1">
        <rect x={70} y={30} width={500} height={360} rx={32} fill={panel} />
      </g>
      <g className="art-depth-2">
        <rect x={372} y={62} width={16} height={300} rx={6} fill={line} />
        <rect x={230} y={46} width={150} height={330} rx={18} fill={bg} stroke={line} />
        <rect x={244} y={62} width={122} height={176} rx={8} fill={soft} />
        <Bar x={254} y={74} w={70} h={10} fill={accent} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={254} y={94 + i * 28} width={102} height={22} rx={6} fill={bg} />
            <Bar x={262} y={101 + i * 28} w={52 - (i % 2) * 12} fill={text} />
            <circle cx={344} cy={105 + i * 28} r={4} fill={line} />
          </g>
        ))}
        <Bar x={254} y={214} w={102} h={14} fill={accent} />
        <rect x={256} y={258} width={52} height={6} rx={3} fill={text} />
        <rect x={322} y={250} width={44} height={32} rx={6} fill={text} />
        <circle cx={334} cy={260} r={3} fill={accent} />
        <rect x={244} y={300} width={122} height={60} rx={10} fill={panel} />
        <Bar x={262} y={326} w={86} h={6} fill={line} />
      </g>
      <g className="art-depth-3">
        <rect x={410} y={136} width={150} height={184} rx={14} fill={bg} stroke={line} />
        <circle cx={440} cy={168} r={14} fill={accent} />
        <path
          d="M 433 168 l 5 5 l 10 -11"
          stroke={bg}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Bar x={462} y={160} w={80} h={9} fill={text} />
        <Bar x={462} y={176} w={50} fill={line} />
        <line x1={424} x2={546} y1={200} y2={200} stroke={line} strokeDasharray="4 4" />
        <Bar x={426} y={214} w={110} fill={line} />
        <Bar x={426} y={230} w={88} fill={line} />
        {qr.flatMap((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={426 + c * 11}
                y={252 + r * 11}
                width={9}
                height={9}
                rx={1.5}
                fill={text}
              />
            ) : null,
          ),
        )}
        <Bar x={496} y={294} w={50} h={14} fill={accent} />
      </g>
    </>
  );
}

/** Panel de certificados: seis indicadores, inventario por estado y una alerta de vencimiento. */
function Certificates() {
  const tiles = [0, 1, 2, 3, 4, 5];
  return (
    <>
      <g className="art-depth-2">
        {tiles.map((i) => {
          const x = 40 + (i % 3) * 192;
          const y = 84 + Math.floor(i / 3) * 58;
          const highlight = i === 2;
          return (
            <g key={i}>
              <rect x={x} y={y} width={176} height={48} rx={10} fill={highlight ? soft : panel} />
              <circle cx={x + 16} cy={y + 16} r={4} fill={highlight ? accent : line} />
              <Bar x={x + 28} y={y + 12} w={56 + (i % 2) * 14} h={7} fill={text} />
              <Bar
                x={x + 16}
                y={y + 28}
                w={40 + ((i * 13) % 34)}
                h={12}
                fill={highlight ? accent : text}
              />
            </g>
          );
        })}
        <rect x={40} y={204} width={560} height={176} rx={12} fill={panel} />
        <Bar x={56} y={218} w={48} h={10} fill={accent} />
        <Bar x={114} y={218} w={40} h={10} fill={text} />
        <Bar x={164} y={218} w={46} h={10} fill={text} />
        <Bar x={220} y={218} w={40} h={10} fill={text} />
        <line x1={52} x2={588} y1={238} y2={238} stroke={line} />
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 250 + i * 25;
          const expiring = i === 1;
          return (
            <g key={i}>
              <rect x={56} y={y} width={14} height={14} rx={4} fill={expiring ? accent : line} />
              <Bar x={80} y={y + 3} w={120 + ((i * 37) % 60)} fill={text} />
              <Bar x={300} y={y + 3} w={70} fill={line} />
              <Bar x={420} y={y + 3} w={60} fill={line} />
              <Bar x={520} y={y + 1} w={56} h={12} fill={expiring ? accent : soft} />
            </g>
          );
        })}
      </g>
      <g className="art-depth-3">
        <rect x={372} y={296} width={230} height={70} rx={14} fill={bg} stroke={line} />
        <circle cx={402} cy={331} r={15} fill={accent} />
        <path
          d="M 402 323 v 8 l 6 4"
          stroke={bg}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Bar x={428} y={320} w={120} h={9} fill={text} />
        <Bar x={428} y={336} w={80} fill={line} />
      </g>
    </>
  );
}

/** Escena de cada variante. Agregar una variante en types.ts obliga a dibujarla aquí. */
const scenes: Record<ProjectArtVariant, () => JSX.Element> = {
  commerce: Commerce,
  analytics: Analytics,
  scheduling: Scheduling,
  api: Api,
  kiosk: Kiosk,
  certificates: Certificates,
};
