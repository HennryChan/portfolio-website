import type { SiteConfig } from "./types";

/**
 * Configuración del sitio publicado: su dirección (para URL canónicas y
 * el sitemap), correo, redes y el servicio del formulario de contacto.
 */
export const site: SiteConfig = {
  // Si el repo no se llama <usuario>.github.io, agrega su nombre: "https://hennrychan.github.io/<repo>".
  url: "https://hennrychan.github.io",
  repositoryUrl: "https://github.com/HennryChan/HennryChan.github.io",
  email: "dev.hennry.chan@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/HennryChan" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/hennry-chan/" },
  ],
  contactForm: {
    // Formspree: "https://formspree.io/f/<id>"
    // Web3Forms: "https://api.web3forms.com/submit" + extraFields: { access_key: "<llave>" }
    endpoint: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ? "https://api.web3forms.com/submit" : "",
    extraFields: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
      ? { access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY }
      : undefined,
  },
  cv: null,
  caseStudy: "portafolio",
};
