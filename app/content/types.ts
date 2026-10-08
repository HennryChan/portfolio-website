/**
 * Forma de todo el contenido del sitio (perfil, proyectos, stack,
 * experiencia y configuración). Los textos que se leen en pantalla van en
 * ambos idiomas con `Localized`; content.test.ts comprueba que ninguno falte.
 */
import type { Locale } from "../i18n/paths";

/** Un texto (o lista) en cada idioma del sitio. */
export type Localized<T = string> = Record<Locale, T>;

/**
 * Un texto igual en todos los idiomas (un nombre propio, p. ej. "React") o
 * traducido. Se lee con localize() de app/i18n/localize.ts.
 */
export type MaybeLocalized = string | Localized;

/** Las cuatro capas de una aplicación web, de arriba hacia abajo. */
export const layerIds = ["ui", "api", "data", "infra"] as const;
/**
 * Una capa: interfaz, API y servicios, datos o infraestructura. Cada una
 * tiene su color en el tema (--layer-ui, --layer-api…).
 */
export type LayerId = (typeof layerIds)[number];

/**
 * Imagen optimizada con `npm run images`: el archivo images/<src>.png se
 * publica como public/images/<src>-960.webp y <src>-1600.webp.
 */
export interface ContentImage {
  /** Nombre del archivo en images/, sin extensión, p. ej. "siturq". */
  src: string;
  /** Proporción ancho / alto del original, para reservar el espacio antes de cargar. */
  ratio: number;
}

/** Datos de la persona: el hero, "Sobre mí", Contacto y los metadatos salen de aquí. */
export interface Profile {
  /** Primera línea del nombre en el hero. */
  firstName: string;
  /** Segunda línea del nombre en el hero. */
  lastName: string;
  /** Se muestran en lugar de la foto si no hay `portrait`. */
  initials: string;
  /** Puesto: hero, título de la página, datos estructurados e imagen para redes. */
  role: Localized;
  /** Resumen de una o dos frases: hero y descripción para buscadores. */
  tagline: Localized;
  /** Frase breve sobre el nombre, pensada para despertar curiosidad. */
  hook?: Localized;
  /** Certificación o logro que respalda el hero, p. ej. una certificación oficial. */
  credential?: Localized;
  /** Si se omite, el hero no muestra la línea de disponibilidad. */
  availability?: Localized;
  /** Ciudad o región: Contacto y datos estructurados. */
  location: Localized;
  /** Zona horaria IANA para mostrar la hora local en Contacto. */
  timezone: string;
  /** La declaración grande de "Sobre mí", que se "enciende" con el scroll. */
  statement: Localized;
  /** Párrafos breves junto a la foto en "Sobre mí". */
  details: Localized<string[]>;
  /** Datos cortos de "Sobre mí" (base, experiencia, idiomas): `term` es la etiqueta. */
  facts: Localized<
    Array<{
      /** Etiqueta, p. ej. "Base". */
      term: string;
      /** El dato, p. ej. "Yucatán, México". */
      detail: string;
    }>
  >;
  /** Foto recortada con fondo transparente. Sin foto se muestran las iniciales. */
  portrait?: ContentImage;
}

/** Configuración del sitio publicado: dirección, enlaces y servicios externos. */
export interface SiteConfig {
  /** URL pública sin barra final, incluida la ruta del repo si la hay: https://usuario.github.io[/repo] */
  url: string;
  /** Repositorio del sitio: enlace "Código fuente" del pie de página. */
  repositoryUrl: string;
  /** Si se omite, Contacto no muestra el correo. */
  email?: string;
  /** Perfiles en otros sitios: pie de página, Contacto y datos estructurados (`sameAs`). */
  socials: Array<{
    /** Nombre del sitio, p. ej. "GitHub". */
    label: string;
    /** URL del perfil. */
    href: string;
  }>;
  /** Servicio que recibe los mensajes del formulario (Formspree, Web3Forms…). */
  contactForm: {
    /** Vacío = modo demostración (no envía nada). */
    endpoint: string;
    /** Campos extra que exige el servicio, p. ej. { access_key: "…" } en Web3Forms. */
    extraFields?: Record<string, string>;
  };
  /** Ruta al CV dentro de /public por idioma, o null para ocultar el enlace. */
  cv: Localized | null;
  /** Slug del proyecto que cuenta cómo se hizo este sitio; el pie de página lo enlaza. */
  caseStudy?: string;
}

/** Textos de introducción de cada sección de la portada. */
export interface SectionIntros {
  /** Bajo el título "Proyectos". */
  projects: Localized;
  /** Bajo el título "Experiencia". */
  experience: Localized;
  /** Bajo la pregunta de Contacto. */
  contact: Localized;
}

/** Ilustraciones disponibles para un proyecto sin captura (ver project-art.tsx). */
export type ProjectArtVariant =
  "commerce" | "analytics" | "scheduling" | "api" | "kiosk" | "certificates";

/** Un resultado medible: la cifra en grande y una línea que la explica. */
export interface ProjectResult {
  /** La cifra, p. ej. "30 → 70 %". */
  value: string;
  /** Qué significa la cifra. */
  text: string;
}

/** Una etapa del bloque "Cómo se construyó". */
export interface ProjectStep {
  /** Nombre de la etapa. */
  title: string;
  /** Cuánto duró, p. ej. "1 h 11 min". */
  duration?: string;
  /** Qué se hizo y qué se decidió. */
  text: string;
}

/** Una columna del bloque "Quién hizo qué": una de las partes y lo que hizo. */
export interface ProjectColumn {
  /** Quién, p. ej. "Yo: dirección". */
  title: string;
  /** Lo que hizo, una acción por elemento. */
  items: string[];
}

/** Un proyecto: su tarjeta en la portada y su página propia. */
export interface Project {
  /**
   * Identificador en la URL: /proyectos/<slug> y /en/projects/<slug>. Único,
   * en minúsculas y con guiones; cambiarlo rompe los enlaces ya compartidos.
   */
  slug: string;
  /**
   * Nombre corto, el que se muestra en grande. Un nombre propio va como
   * texto simple; uno descriptivo ("Este portafolio"), traducido.
   */
  name: MaybeLocalized;
  /** Nombre completo u organización, debajo del nombre. */
  subtitle?: Localized;
  /** Una o dos frases: tarjeta, descripción para buscadores y enlace "Siguiente proyecto". */
  summary: Localized;
  /** Bloque "Contexto": qué es el proyecto y dónde encaja tu participación. */
  context: Localized;
  // Lo siguiente es opcional: cada dato o sección aparece solo si está definido.
  /** Año o rango, p. ej. "2023–2024". */
  period?: string;
  /** Tu puesto en el proyecto: tarjeta y datos de la página. */
  role?: Localized;
  /** Qué hace el producto (datos públicos), distinto de `solution`: lo que construiste tú. */
  features?: Localized<string[]>;
  /** Cuánto duró tu participación, p. ej. "6 meses". */
  duration?: Localized;
  /** Con quién trabajaste, p. ej. "Equipo de 5 personas". */
  team?: Localized;
  /** Bloque "Mi aporte": lo que hiciste tú, una acción por elemento. */
  solution?: Localized<string[]>;
  /** Bloque "Quién hizo qué": lo que hizo cada parte, en columnas (p. ej. yo y un agente de IA). */
  collaboration?: Localized<ProjectColumn[]>;
  /** Bloque "Cómo se construyó": las etapas del proyecto, en orden. */
  process?: Localized<ProjectStep[]>;
  /**
   * Tecnologías por capa, para el diagrama de arquitectura. La primera de
   * cada capa también resume el stack en la tarjeta.
   */
  architecture?: Partial<Record<LayerId, string[]>>;
  /** Bloque "Resultados": cifras con su explicación (de una a tres se leen mejor). */
  results?: Localized<ProjectResult[]>;
  /** Bloque "Lo que aprendí". */
  learnings?: Localized;
  /**
   * Enlaces externos: sitio en vivo, código y nota o artículo. El botón
   * principal es el sitio en vivo; si no hay, la nota; si tampoco, el código.
   */
  links: {
    /** Sitio publicado; su dominio aparece en la barra de la captura. */
    live?: string;
    /** Repositorio del código. */
    repo?: string;
    /** Nota, artículo o comunicado sobre el proyecto. */
    article?: string;
  };
  /** Captura real del proyecto. */
  image?: ContentImage & {
    /** Texto alternativo: qué se ve en la captura. */
    alt: Localized;
  };
  /** Ilustración que se usa cuando no hay captura. */
  art: {
    /** Escena que se dibuja. */
    variant: ProjectArtVariant;
    /** Tono del color de acento en OKLCH, de 0 a 360. */
    hue: number;
  };
}

/** Áreas que atraviesan todas las capas; se muestran aparte, sin color de capa. */
export const crossCuttingIds = ["security", "quality", "ai"] as const;
/** Un área transversal: seguridad, calidad y pruebas, o IA aplicada. */
export type CrossCuttingId = (typeof crossCuttingIds)[number];

/** Nombre de una tecnología: igual en ambos idiomas, o traducido si hace falta. */
export type Tech = MaybeLocalized;

/** Un grupo de la sección Stack: una capa del hero o un área transversal. */
export interface StackLayer {
  /** Capa o área; decide el nombre y el color del grupo. */
  id: LayerId | CrossCuttingId;
  /** Qué abarca el grupo, en una frase. */
  description: Localized;
  /** "Uso a diario": lo que más dominas; se destaca con color. */
  daily: Tech[];
  /** "También trabajo con": lo que conoces pero usas menos. */
  also: Tech[];
  /** En formación. */
  learning?: Tech[];
}

/** Un trabajo en la línea de tiempo de Experiencia. */
export interface ExperienceItem {
  /** Nombre de la empresa u organización. */
  company: string;
  /** Puesto. */
  role: Localized;
  /** Año y mes, "AAAA-MM". */
  start: string;
  /** "AAAA-MM", o null si es el trabajo actual. */
  end: string | null;
  /** Ciudad; se muestra junto a la empresa. */
  location?: Localized;
  /** Logros y responsabilidades, uno por elemento. */
  highlights: Localized<string[]>;
  /** Tecnologías principales del puesto. */
  stack?: string[];
}

/** Estudios y certificaciones, del más reciente al más antiguo. */
export interface EducationItem {
  /** Título, carrera o certificación. */
  title: Localized;
  /** Escuela o entidad que lo otorga. */
  institution?: string;
  /** Año o rango, p. ej. "2018–2023". */
  period?: string;
}
