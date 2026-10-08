import type { Profile } from "./types";

/**
 * Datos de la persona: hero, "Sobre mí", Contacto, metadatos e imágenes
 * para redes (`npm run images` lee nombre y rol de aquí).
 * Fuentes: CV (2026) y portafolio anterior.
 */
export const profile: Profile = {
  firstName: "Hennry",
  lastName: "Chan",
  initials: "HC",
  role: {
    es: "Ingeniero de Software",
    en: "Software Engineer",
  },
  tagline: {
    es: "Desarrollo software de principio a fin, de la interfaz a la infraestructura, con foco en la seguridad y en código fácil de mantener. Mi experiencia incluye seguridad digital y sistemas de gobierno digital en México.",
    en: "I build software end to end, from the interface to the infrastructure, with a focus on security and maintainable code. My experience includes digital security and digital government systems in Mexico.",
  },
  hook: {
    es: "Primero entiendo el problema. Después escribo el código.",
    en: "First I understand the problem. Then I write the code.",
  },
  credential: {
    es: "Microsoft Certified: Azure Developer Associate",
    en: "Microsoft Certified: Azure Developer Associate",
  },
  location: {
    es: "Yucatán, México",
    en: "Yucatán, Mexico",
  },
  timezone: "America/Merida",
  statement: {
    es: "Soy ingeniero de software. Desde 2022 construyo APIs y aplicaciones web con .NET, React y SQL Server, y participo en todo el ciclo: análisis, diseño, desarrollo, pruebas y despliegue. También tengo experiencia en seguridad digital: certificados X.509 e integraciones con PKI y HSM.",
    en: "I'm a software engineer. Since 2022 I've built APIs and web applications with .NET, React and SQL Server, and I take part in the whole cycle: analysis, design, development, testing and deployment. I also have experience in digital security: X.509 certificates and PKI and HSM integrations.",
  },
  details: {
    es: [
      "Aplico Clean Architecture, principios SOLID y pruebas automatizadas para que el código sea fácil de mantener y de probar.",
      "Participé en la modernización de un sistema legacy a .NET 10 y React.",
      "Me considero proactivo, organizado y responsable, y disfruto aprender temas nuevos.",
    ],
    en: [
      "I apply Clean Architecture, SOLID principles and automated tests so code stays easy to maintain and to test.",
      "I helped modernize a legacy system to .NET 10 and React.",
      "I'm proactive, organized and responsible, and I enjoy learning new things.",
    ],
  },
  facts: {
    es: [
      { term: "Base", detail: "Yucatán, México" },
      { term: "Experiencia", detail: "Más de 4 años desarrollando software" },
      { term: "Idiomas", detail: "Español nativo, inglés B1" },
    ],
    en: [
      { term: "Based in", detail: "Yucatán, Mexico" },
      { term: "Experience", detail: "4+ years building software" },
      { term: "Languages", detail: "Native Spanish, English (B1)" },
    ],
  },
  // images/portrait.png mide 2109 × 2995 px.
  portrait: { src: "portrait", ratio: 2109 / 2995 },
};

/** Nombre y apellido: título de las páginas, logo, pie de página y datos estructurados. */
export const fullName = `${profile.firstName} ${profile.lastName}`;
