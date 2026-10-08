import type { SectionIntros } from "./types";

/**
 * Frases que presentan las secciones de la portada. La de Stack está en
 * los textos de la interfaz (app/i18n/ui.ts) porque describe el diseño de
 * la sección, no a la persona.
 */
export const sectionIntros: SectionIntros = {
  projects: {
    es: "Proyectos de seguridad digital, gobierno y turismo en los que he participado, y este mismo sitio, que construí dirigiendo a un agente de IA.",
    en: "Digital security, government and tourism projects I've worked on, plus this site, which I built by directing an AI agent.",
  },
  experience: {
    es: "Más de cuatro años construyendo software para seguridad digital, gobierno y turismo.",
    en: "Over four years building software for digital security, government and tourism.",
  },
  contact: {
    es: "Cuéntame qué necesitas y te respondo lo antes posible.",
    en: "Tell me what you need and I'll get back to you as soon as I can.",
  },
};
