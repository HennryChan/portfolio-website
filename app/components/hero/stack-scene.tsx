/**
 * Escena 3D del hero: las cuatro capas como placas de vidrio de color.
 * Se carga aparte (three.js pesa) y solo cuando el navegador queda libre.
 * - Flotan con suavidad y siguen al puntero.
 * - Al bajar por la página se separan, como una vista explosionada.
 *
 * Las unidades son las de three.js; PLATE y GAP guardan las mismas
 * proporciones que la ilustración SVG (stack-illustration.tsx).
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import type { LayerId } from "~/content/types";

/** Una placa de la pila, con los datos que la escena no puede leer por sí misma. */
export interface SceneLayer {
  /** Capa que representa; decide los detalles sobre la placa. */
  id: LayerId;
  /** Nombre de la capa en el idioma de la página. */
  label: string;
  /** Color CSS de la capa, leído de las variables del tema (--layer-*). */
  color: string;
}

/** Props de la escena; HeroVisual las calcula a partir del tema y del dispositivo. */
interface StackSceneProps {
  /** Placas de arriba hacia abajo. */
  layers: SceneLayer[];
  /** Color de fondo del canvas: el mismo de la página (--paper). */
  background: string;
  /** Tema oscuro: cambia luces, bordes y sombra. */
  dark: boolean;
  /** false cuando el hero sale de la pantalla: se deja de dibujar. */
  active: boolean;
  /** Pantallas táctiles: placas sin efecto de vidrio y menos resolución, para cuidar la batería. */
  lowPower: boolean;
  /** Se llama después del primer frame dibujado, cuando ya se puede mostrar la escena. */
  onReady: () => void;
  /** Clases del contenedor (posición y fundido). */
  className?: string;
}

/** Medidas de cada placa. Mismas proporciones que la ilustración SVG para que el cambio no se note. */
const PLATE = { width: 3.1, height: 0.16, depth: 2.09 } as const;
/** Separación vertical entre placas en reposo (arriba de la página). */
const GAP = 0.98;
/** Separación vertical cuando la pila está del todo "explosionada". */
const EXPLODED_GAP = 1.42;
/** Ancho mínimo del canvas (px) para mostrar las etiquetas; con menos, se ocultan. */
const MIN_WIDTH_FOR_LABELS = 340;

/** Las etiquetas HTML de cada placa, en el mismo orden que `layers`. */
type LabelRefs = RefObject<Array<HTMLSpanElement | null>>;

/**
 * Canvas con luces, reflejos y la pila de placas, más una etiqueta HTML por
 * capa encima del canvas. Todo es decorativo (aria-hidden): el texto para
 * lectores de pantalla lo da la ilustración SVG que queda debajo.
 */
export default function StackScene(props: StackSceneProps) {
  const { className, active, lowPower, background, dark, layers } = props;
  // Las etiquetas son HTML normal encima del canvas; la escena las mueve en cada frame.
  const labels = useRef<Array<HTMLSpanElement | null>>([]);

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        // Fuera de la pantalla no se dibuja nada.
        frameloop={active ? "always" : "never"}
        // Resolución máxima de 2× (1.5× en pantallas táctiles, para cuidar la batería).
        dpr={[1, lowPower ? 1.5 : 2]}
        // Cámara lejana y con ángulo estrecho: casi una proyección isométrica, como el SVG.
        camera={{ position: [10, 10, 10], fov: 17.5, near: 0.1, far: 100 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[background]} />
        <ambientLight intensity={dark ? 0.45 : 0.7} />
        <directionalLight position={[4, 9, 3]} intensity={dark ? 1.1 : 1.4} />
        <StudioEnvironment intensity={dark ? 0.7 : 1} />
        <Stack {...props} labels={labels} />
      </Canvas>
      {layers.map((layer, index) => (
        <span
          key={layer.id}
          ref={(node) => {
            labels.current[index] = node;
          }}
          className="pointer-events-none absolute top-0 left-0 flex items-center gap-2 text-xs font-semibold whitespace-nowrap text-ink opacity-0 sm:text-sm"
        >
          <span className="h-px w-7 bg-ink-soft" />
          {layer.label}
        </span>
      ))}
    </div>
  );
}

/**
 * La pila animada. En cada frame:
 * 1. separa las placas según el scroll (vista explosionada) y las hace flotar;
 * 2. mueve y difumina la sombra con la placa de abajo;
 * 3. gira el conjunto hacia el puntero;
 * 4. coloca cada etiqueta HTML junto a su placa.
 */
function Stack({
  layers,
  dark,
  lowPower,
  onReady,
  labels,
}: StackSceneProps & {
  /** Etiquetas HTML que se mueven junto a cada placa. */
  labels: LabelRefs;
}) {
  const group = useRef<THREE.Group>(null);
  const plates = useRef<Array<THREE.Group | null>>([]);
  /** Posición del puntero en la ventana, de -1 a 1 en cada eje. */
  const pointer = useRef({ x: 0, y: 0 });
  /** onReady ya se llamó (solo se avisa una vez). */
  const readySent = useRef(false);
  const shadow = useRef<THREE.Mesh>(null);
  /** Vector reutilizado en cada frame para no crear objetos 60 veces por segundo. */
  const anchor = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const stack = group.current;
    if (!stack) return;

    const time = state.clock.elapsedTime;
    // Progreso del scroll en el primer 85 % de la pantalla, suavizado (smoothstep) para que
    // la separación empiece y termine con calma.
    const scroll = THREE.MathUtils.clamp(window.scrollY / (window.innerHeight * 0.85), 0, 1);
    const explode = scroll * scroll * (3 - 2 * scroll);
    const gap = THREE.MathUtils.lerp(GAP, EXPLODED_GAP, explode);
    const middle = (layers.length - 1) / 2;

    plates.current.forEach((plate, index) => {
      if (!plate) return;
      // Cada placa flota con un desfase distinto para que no suban y bajen a la vez.
      const float = Math.sin(time * 0.8 + index * 0.9) * 0.045;
      const target = (middle - index) * gap + float;
      plate.position.y = THREE.MathUtils.damp(plate.position.y, target, 6, delta);
    });

    // La sombra sigue a la placa de abajo y se difumina a medida que las capas se separan.
    const bottom = plates.current[plates.current.length - 1];
    if (shadow.current && bottom) {
      shadow.current.position.y = bottom.position.y - 0.42;
      const spread = 1 + explode * 0.35;
      shadow.current.scale.set(4.6 * spread, 3.4 * spread, 1);
      (shadow.current.material as THREE.MeshBasicMaterial).opacity =
        (dark ? 0.6 : 0.2) * (1 - explode * 0.45);
    }

    // El conjunto gira un poco hacia el puntero y, al separarse, se abre hacia un lado.
    stack.rotation.y = THREE.MathUtils.damp(
      stack.rotation.y,
      pointer.current.x * 0.14 - explode * 0.22,
      3.5,
      delta,
    );
    stack.rotation.x = THREE.MathUtils.damp(stack.rotation.x, pointer.current.y * 0.05, 3.5, delta);

    // Cada etiqueta sigue la esquina derecha de su placa, proyectada a la pantalla.
    const { width, height } = state.size;
    stack.updateMatrixWorld();
    plates.current.forEach((plate, index) => {
      const label = labels.current[index];
      if (!plate || !label) return;
      if (width < MIN_WIDTH_FOR_LABELS) {
        label.style.opacity = "0";
        return;
      }
      anchor
        .set(PLATE.width / 2 + 0.06, 0, -PLATE.depth / 2)
        .applyMatrix4(plate.matrixWorld)
        .project(state.camera);
      const x = (anchor.x * 0.5 + 0.5) * width;
      const y = (-anchor.y * 0.5 + 0.5) * height;
      label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translateY(-50%)`;
      label.style.opacity = "1";
    });

    // Se avisa en el frame siguiente, cuando el primero ya está en pantalla.
    if (!readySent.current) {
      readySent.current = true;
      requestAnimationFrame(onReady);
    }
  });

  const middle = (layers.length - 1) / 2;

  return (
    // Corrida a la izquierda de la pantalla para dejar sitio a las etiquetas, como en el SVG.
    <group ref={group} position={[-0.75, 0.1, 0.75]}>
      {layers.map((layer, index) => (
        <group
          key={layer.id}
          ref={(node) => {
            plates.current[index] = node;
          }}
          position={[0, (middle - index) * GAP, 0]}
        >
          <Plate color={layer.color} dark={dark} lowPower={lowPower} />
          <LayerDetail id={layer.id} color={layer.color} dark={dark} />
        </group>
      ))}
      <SoftShadow ref={shadow} color={dark ? "#000000" : "#162033"} />
    </group>
  );
}

/** Sombra difusa bajo la pila: un degradado radial en un plano, sin pasadas extra de render. */
function SoftShadow({
  ref,
  color,
}: {
  /** La pila mueve, escala y atenúa la sombra en cada frame. */
  ref: RefObject<THREE.Mesh | null>;
  /** Color de la sombra. */
  color: string;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const context = canvas.getContext("2d");
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.55, "rgba(255,255,255,0.45)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position-y={-2}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} color={color} transparent depthWrite={false} opacity={0.2} />
    </mesh>
  );
}

/**
 * Reflejos suaves de un "estudio" generado por código. Evita el <Environment>
 * de drei, que trae cargadores de imágenes HDR que aquí no hacen falta.
 */
function StudioEnvironment({
  intensity,
}: {
  /** Intensidad de los reflejos: más baja en el tema oscuro. */
  intensity: number;
}) {
  const getState = useThree((state) => state.get);

  useEffect(() => {
    const { gl, scene } = getState();
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = generator.fromScene(room, 0.04).texture;
    scene.environment = texture;
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
      texture.dispose();
      room.dispose();
      generator.dispose();
    };
  }, [getState, intensity]);

  return null;
}

/** Geometría compartida por las cuatro placas (con `dispose={null}` para que R3F no la libere). */
const plateGeometry = new THREE.BoxGeometry(PLATE.width, PLATE.height, PLATE.depth);
/** Aristas de la placa, también compartidas: dibujan el contorno. */
const plateEdges = new THREE.EdgesGeometry(plateGeometry);

/**
 * Una placa de vidrio de color con el contorno marcado. Con `lowPower`
 * usa un material opaco sencillo en vez de vidrio con transmisión, que
 * es lo más costoso de dibujar.
 */
function Plate({
  color,
  dark,
  lowPower,
}: {
  /** Color de la capa. */
  color: string;
  /** Tema oscuro: cambia el tono del contorno. */
  dark: boolean;
  /** Material sencillo en vez de vidrio. */
  lowPower: boolean;
}) {
  // Contorno más claro que la placa en el tema oscuro y más oscuro en el claro.
  const edge = useMemo(() => {
    const base = new THREE.Color(color);
    return dark ? base.lerp(new THREE.Color("#ffffff"), 0.35) : base.multiplyScalar(0.7);
  }, [color, dark]);

  return (
    <mesh geometry={plateGeometry} dispose={null}>
      {lowPower ? (
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.05}
          transparent
          opacity={0.82}
        />
      ) : (
        <meshPhysicalMaterial
          color={color}
          roughness={0.22}
          metalness={0}
          transmission={0.55}
          thickness={0.8}
          ior={1.4}
          clearcoat={1}
          clearcoatRoughness={0.18}
          attenuationColor={color}
          attenuationDistance={1.4}
        />
      )}
      <lineSegments geometry={plateEdges} dispose={null}>
        <lineBasicMaterial color={edge} />
      </lineSegments>
    </mesh>
  );
}

/** Formas sobre cada placa que sugieren qué hace la capa (como en el SVG). */
function LayerDetail({
  id,
  color,
  dark,
}: {
  /** Capa: decide las formas. */
  id: LayerId;
  /** Color de la capa; las formas usan un tono más claro. */
  color: string;
  /** Tema oscuro: las formas se aclaran un poco menos. */
  dark: boolean;
}) {
  // Un tono más claro que la placa, para que los detalles se distingan.
  const tone = useMemo(
    () => new THREE.Color(color).lerp(new THREE.Color("#ffffff"), dark ? 0.4 : 0.55),
    [color, dark],
  );
  const y = PLATE.height / 2 + 0.03;
  const material = <meshStandardMaterial color={tone} roughness={0.45} />;

  // Coordenadas locales: x ∈ [-1.55, 1.55], z ∈ [-1.045, 1.045].
  switch (id) {
    case "ui":
      return (
        <group position-y={y}>
          <mesh position={[0, 0, -0.75]}>
            <boxGeometry args={[2.5, 0.05, 0.34]} />
            {material}
          </mesh>
          <mesh position={[-0.75, 0, 0.25]}>
            <boxGeometry args={[1.0, 0.05, 1.05]} />
            {material}
          </mesh>
          <mesh position={[0.55, 0, 0.25]}>
            <boxGeometry args={[1.35, 0.05, 1.05]} />
            {material}
          </mesh>
        </group>
      );
    case "api":
      return (
        <group position-y={y}>
          {[-0.55, 0, 0.55].map((z) => (
            <group key={z} position-z={z}>
              <mesh>
                <boxGeometry args={[2.3, 0.03, 0.05]} />
                {material}
              </mesh>
              {[-1.15, 1.15].map((x) => (
                <mesh key={x} position-x={x}>
                  <sphereGeometry args={[0.09, 16, 12]} />
                  {material}
                </mesh>
              ))}
            </group>
          ))}
        </group>
      );
    case "data":
      return (
        <group position-y={y + 0.08}>
          {[-0.95, 0, 0.95].map((x) => (
            <mesh key={x} position-x={x}>
              <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
              {material}
            </mesh>
          ))}
        </group>
      );
    case "infra":
      return (
        <group position-y={y + 0.06}>
          {[-1.1, -0.37, 0.37, 1.1].flatMap((x) =>
            [-0.42, 0.42].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 0, z]}>
                <boxGeometry args={[0.46, 0.16, 0.5]} />
                {material}
              </mesh>
            )),
          )}
        </group>
      );
  }
}
