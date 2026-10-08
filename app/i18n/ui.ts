/**
 * Textos de la interfaz. El contenido (perfil, proyectos, experiencia)
 * vive en app/content; aquí solo van etiquetas, botones y mensajes.
 * Los componentes los leen con useT().
 */
import type { Locale } from "./paths";

/** Español: define la forma de los textos (UIStrings) que el inglés debe repetir. */
const es = {
  /** Enlace para saltar al contenido; solo aparece al navegar con el teclado. */
  skipToContent: "Saltar al contenido",
  /** Menú de secciones de la cabecera. */
  nav: {
    /** Nombre del menú para lectores de pantalla. */
    label: "Principal",
    projects: "Proyectos",
    stack: "Stack",
    experience: "Experiencia",
    contact: "Contacto",
    /** Se suma al nombre completo en el enlace del logo: "<nombre>, Inicio". */
    home: "Inicio",
  },
  /** Botón del menú en pantallas chicas. */
  menu: {
    open: "Abrir menú",
    close: "Cerrar menú",
  },
  theme: {
    /** Nombre del botón de tema; con `aria-pressed` se anuncia si está activo. */
    label: "Tema oscuro",
  },
  language: {
    label: "Idioma",
    /** Cada idioma con su propio nombre, para lectores de pantalla. */
    names: { es: "Español", en: "English" },
  },
  hero: {
    viewProjects: "Ver proyectos",
    contact: "Escríbeme",
    /** Inicio de la descripción de la ilustración: "Capas…: Interfaz, API y servicios…". */
    layersLabel: "Capas de una aplicación web",
  },
  about: {
    /** Título de la sección; solo lo leen los lectores de pantalla. */
    title: "Sobre mí",
    /** Texto alternativo de la foto. */
    portrait: (name: string) => `Retrato de ${name}`,
  },
  projects: {
    title: "Proyectos",
    /** Pie de cada tarjeta (solo visual: el enlace es el título). */
    viewCase: "Ver caso de estudio",
    role: "Rol",
    stack: "Stack",
  },
  stack: {
    title: "Con qué construyo",
    intro: "Organizado por capas, igual que los sistemas que construyo.",
    /** Títulos de las tres listas de cada grupo. */
    daily: "Uso a diario",
    also: "También trabajo con",
    learning: "Aprendiendo",
    crossCutting: "Transversal a todas las capas",
    /** Nombres de las áreas transversales (crossCuttingIds). */
    groups: { security: "Seguridad", quality: "Calidad y pruebas", ai: "IA aplicada" },
  },
  experience: {
    title: "Experiencia",
    /** En lugar de la fecha de fin del trabajo actual. */
    present: "hoy",
    /** Nombres cortos de los meses, de enero a diciembre. */
    months: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
    education: "Formación y certificaciones",
  },
  contact: {
    title: "¿Construimos algo juntos?",
    email: "Correo",
    copyEmail: "Copiar correo",
    emailCopied: "Correo copiado",
    location: "Ubicación",
    /** Frase con la hora local; recibe la hora ya formateada. */
    localTime: (time: string) => `Ahí son las ${time}`,
    /** Título de la lista de redes. */
    elsewhere: "En otros sitios",
    /** Etiquetas y mensajes del formulario. */
    form: {
      name: "Nombre",
      email: "Correo",
      message: "Mensaje",
      submit: "Enviar mensaje",
      sending: "Enviando…",
      success: "Mensaje enviado. Te responderé pronto.",
      /** Si hay correo configurado, lo ofrece como alternativa. */
      error: (email?: string) =>
        email
          ? `No se pudo enviar el mensaje. Revisa tu conexión y vuelve a intentarlo, o escríbeme a ${email}.`
          : "No se pudo enviar el mensaje. Revisa tu conexión y vuelve a intentarlo.",
      /** Sin servicio configurado (`site.contactForm.endpoint` vacío). */
      demo: "Modo demostración: el formulario aún no está conectado, así que el mensaje no se envió.",
      /** Error de cada campo, debajo del campo. */
      errors: {
        name: "Escribe tu nombre.",
        email: "Escribe un correo válido, por ejemplo nombre@dominio.com.",
        message: "Escribe un mensaje de al menos 20 caracteres.",
      },
    },
  },
  /** Página de cada proyecto. */
  project: {
    back: "Volver a proyectos",
    role: "Rol",
    period: "Periodo",
    duration: "Duración",
    team: "Equipo",
    context: "Contexto",
    features: "Qué hace",
    solution: "Mi aporte",
    collaboration: "Quién hizo qué",
    process: "Cómo se construyó",
    architecture: "Arquitectura",
    architectureIntro: "Las piezas del proyecto, organizadas por capa.",
    results: "Resultados",
    learnings: "Lo que aprendí",
    live: "Visitar sitio",
    article: "Leer nota",
    repo: "Ver código",
    next: "Siguiente proyecto",
  },
  /** Nombres de las cuatro capas: hero, Stack y diagrama de arquitectura. */
  layers: {
    ui: "Interfaz",
    api: "API y servicios",
    data: "Datos",
    infra: "Infraestructura",
  },
  footer: {
    builtWith: "Hecho con React Router, GSAP y Three.js.",
    /** Enlace al caso de estudio del propio sitio (site.caseStudy). */
    caseStudy: "Cómo se hizo este sitio",
    source: "Código fuente",
    backToTop: "Volver arriba",
  },
  /** Página 404. */
  notFound: {
    title: "Esta página no existe",
    body: "Puede que el enlace esté mal escrito o que la página se haya movido.",
    home: "Ir al inicio",
  },
  /** Error inesperado al mostrar una página (ErrorBoundary). */
  error: {
    title: "Algo salió mal",
    body: "Recarga la página para intentarlo de nuevo.",
  },
};

/** Forma de los textos: la del español. TypeScript exige que el inglés tenga las mismas claves. */
export type UIStrings = typeof es;

/** Inglés. */
const en: UIStrings = {
  skipToContent: "Skip to content",
  nav: {
    label: "Main",
    projects: "Projects",
    stack: "Stack",
    experience: "Experience",
    contact: "Contact",
    home: "Home",
  },
  menu: {
    open: "Open menu",
    close: "Close menu",
  },
  theme: {
    label: "Dark theme",
  },
  language: {
    label: "Language",
    names: { es: "Español", en: "English" },
  },
  hero: {
    viewProjects: "View projects",
    contact: "Get in touch",
    layersLabel: "Layers of a web application",
  },
  about: {
    title: "About me",
    portrait: (name: string) => `Portrait of ${name}`,
  },
  projects: {
    title: "Projects",
    viewCase: "Read case study",
    role: "Role",
    stack: "Stack",
  },
  stack: {
    title: "What I build with",
    intro: "Organized by layer, the same way I build systems.",
    daily: "Daily drivers",
    also: "Also comfortable with",
    learning: "Learning",
    crossCutting: "Across every layer",
    groups: { security: "Security", quality: "Quality and testing", ai: "Applied AI" },
  },
  experience: {
    title: "Experience",
    present: "now",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    education: "Education and certifications",
  },
  contact: {
    title: "Shall we build something together?",
    email: "Email",
    copyEmail: "Copy email",
    emailCopied: "Email copied",
    location: "Location",
    localTime: (time: string) => `It's ${time} there`,
    elsewhere: "Elsewhere",
    form: {
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send message",
      sending: "Sending…",
      success: "Message sent. I'll get back to you soon.",
      error: (email?: string) =>
        email
          ? `The message couldn't be sent. Check your connection and try again, or email me at ${email}.`
          : "The message couldn't be sent. Check your connection and try again.",
      demo: "Demo mode: the form isn't connected yet, so the message wasn't sent.",
      errors: {
        name: "Enter your name.",
        email: "Enter a valid email, for example name@domain.com.",
        message: "Write a message of at least 20 characters.",
      },
    },
  },
  project: {
    back: "Back to projects",
    role: "Role",
    period: "Period",
    duration: "Duration",
    team: "Team",
    context: "Context",
    features: "What it does",
    solution: "My contribution",
    collaboration: "Who did what",
    process: "How it was built",
    architecture: "Architecture",
    architectureIntro: "The project's pieces, organized by layer.",
    results: "Results",
    learnings: "What I learned",
    live: "Visit site",
    article: "Read article",
    repo: "View code",
    next: "Next project",
  },
  layers: {
    ui: "Interface",
    api: "API and services",
    data: "Data",
    infra: "Infrastructure",
  },
  footer: {
    builtWith: "Built with React Router, GSAP and Three.js.",
    caseStudy: "How this site was built",
    source: "Source code",
    backToTop: "Back to top",
  },
  notFound: {
    title: "This page doesn't exist",
    body: "The link may be mistyped, or the page may have moved.",
    home: "Go to the home page",
  },
  error: {
    title: "Something went wrong",
    body: "Reload the page to try again.",
  },
};

/** Textos por idioma. En componentes se usa useT(); fuera de React, `ui[locale]`. */
export const ui: Record<Locale, UIStrings> = { es, en };
