import { site } from "./site";
import type { Project } from "./types";

/**
 * Proyectos del portafolio. El orden de esta lista es el orden en
 * la portada y el de "Siguiente proyecto". Cada uno genera dos páginas
 * en el build (una por idioma; ver react-router.config.ts).
 * Fuentes: CV (2026), portafolio anterior y páginas públicas de cada proyecto.
 * El último, "Este portafolio", sale del registro de la sesión en que se construyó.
 */
export const projects: Project[] = [
  {
    slug: "pki-reports",
    name: "PKI Reports",
    subtitle: { es: "CEGA Security", en: "CEGA Security" },
    period: "2025–2026",
    role: { es: "Desarrollador full stack", en: "Full stack developer" },
    summary: {
      es: "Plataforma de gestión y reportería de certificados digitales de CEGA Security, en cuya nueva versión participé como desarrollador full stack.",
      en: "CEGA Security's digital certificate management and reporting platform. I worked on its new version as a full stack developer.",
    },
    context: {
      es: "PKI Reports es un producto de CEGA Security que da visibilidad sobre las infraestructuras de certificados digitales (PKI): qué certificados existen, cuándo vencen y en qué estado están. Trabajé en él como parte del equipo de desarrollo durante mi etapa en la empresa.",
      en: "PKI Reports is a CEGA Security product that gives visibility into digital certificate infrastructures (PKI): which certificates exist, when they expire and what state they're in. I worked on it as part of the development team during my time at the company.",
    },
    features: {
      es: [
        "Inventario de certificados con indicadores de vigencia y filtros por estado.",
        "Sincronización con EJBCA y Microsoft CA, y carga de certificados de otros emisores.",
        "Alertas antes de cada vencimiento y reportes exportables a Excel y CSV.",
      ],
      en: [
        "A certificate inventory with expiration indicators and status filters.",
        "Sync with EJBCA and Microsoft CA, plus uploads from other issuers.",
        "Alerts before every expiration and reports you can export to Excel and CSV.",
      ],
    },
    solution: {
      es: [
        "Participé en la nueva versión de la plataforma, de diciembre de 2025 a 2026, en el backend (API REST en .NET 8 con C#, ASP.NET Core, Entity Framework y SQL Server) y en el frontend (React).",
        "Estructuré el backend con Clean Architecture y principios SOLID, separando las capas Domain, Application e Infrastructure para facilitar el mantenimiento y las pruebas.",
        "Optimicé el frontend con code splitting, carga diferida (React.lazy y Suspense) y error boundaries, mejorando FCP, TTI y el peso del bundle.",
        "Escribí pruebas unitarias con xUnit, Moq y FluentAssertions, con reportes de cobertura automáticos (dotnet-coverage y ReportGenerator).",
      ],
      en: [
        "Worked on the platform's new version, from December 2025 to 2026, on the backend (a REST API in .NET 8 with C#, ASP.NET Core, Entity Framework and SQL Server) and the frontend (React).",
        "Structured the backend with Clean Architecture and SOLID principles, splitting the Domain, Application and Infrastructure layers to ease maintenance and testing.",
        "Optimized the frontend with code splitting, lazy loading (React.lazy and Suspense) and error boundaries, improving FCP, TTI and bundle size.",
        "Wrote unit tests with xUnit, Moq and FluentAssertions, with automatic coverage reports (dotnet-coverage and ReportGenerator).",
      ],
    },
    architecture: {
      ui: ["React"],
      api: [".NET 8", "C#", "ASP.NET Core", "Entity Framework", "EJBCA", "Microsoft CA"],
      data: ["SQL Server"],
      infra: ["Azure DevOps", "Docker"],
    },
    results: {
      es: [
        { value: "30 → 70 %", text: "de cobertura de pruebas en las capas Domain y Application" },
      ],
      en: [{ value: "30 → 70%", text: "test coverage in the Domain and Application layers" }],
    },
    links: { live: "https://cegasecurity.com/pkireports/" },
    art: { variant: "certificates", hue: 200 },
  },
  {
    slug: "situr-q",
    name: "SITUR-Q",
    subtitle: {
      es: "Sistema de Información Turística de Quintana Roo",
      en: "Quintana Roo Tourism Information System",
    },
    period: "2023–2024",
    role: { es: "Desarrollador full stack", en: "Full stack developer" },
    summary: {
      es: "Plataforma de la Secretaría de Turismo de Quintana Roo que reúne y publica información sobre la actividad turística del Caribe Mexicano.",
      en: "Quintana Roo Tourism Ministry's platform that gathers and publishes information about tourism in the Mexican Caribbean.",
    },
    context: {
      es: "El SITUR-Q es una plataforma digital, operada por la Secretaría de Turismo, que recolecta, trata, ordena y pone a disposición del público información cuantitativa y cualitativa sobre los distintos componentes de la actividad turística del Caribe Mexicano.",
      en: "SITUR-Q is a digital platform run by the Ministry of Tourism. It collects, processes, organizes and publishes quantitative and qualitative information about every part of the tourism industry in the Mexican Caribbean.",
    },
    links: { live: "https://siturq.gob.mx/" },
    image: {
      src: "siturq",
      ratio: 1703 / 910,
      alt: {
        es: "Página de inicio del SITUR-Q con los destinos de Quintana Roo",
        en: "SITUR-Q home page showing Quintana Roo destinations",
      },
    },
    art: { variant: "analytics", hue: 5 },
  },
  {
    slug: "retur-q",
    name: "RETUR-Q",
    subtitle: {
      es: "Registro Estatal de Turismo de Quintana Roo",
      en: "Quintana Roo State Tourism Registry",
    },
    period: "2023–2024",
    role: { es: "Desarrollador full stack", en: "Full stack developer" },
    summary: {
      es: "Catálogo público de prestadores de servicios turísticos del Caribe Mexicano, con registro y acceso para cada negocio.",
      en: "Public catalog of tourism service providers in the Mexican Caribbean, with registration and sign-in for each business.",
    },
    context: {
      es: "Es el catálogo público de prestadores de servicios turísticos del Caribe Mexicano. Reúne la información general de toda persona física o moral que ofrece un producto o servicio turístico, para dar más seguridad y confianza a turistas y visitantes del estado.",
      en: "It's the public catalog of tourism service providers in the Mexican Caribbean. It gathers general information about every individual or company that sells a tourism product or service, so tourists and visitors can count on more safety and trust.",
    },
    links: { live: "https://returq.siturq.gob.mx/login" },
    image: {
      src: "returq",
      ratio: 1610 / 850,
      alt: {
        es: "Pantalla de inicio de sesión de RETUR-Q para prestadores de servicios turísticos",
        en: "RETUR-Q sign-in screen for tourism service providers",
      },
    },
    art: { variant: "scheduling", hue: 5 },
  },
  {
    slug: "kioscos-chiapas",
    name: "Kioscos Electrónicos",
    subtitle: {
      es: "Gobierno del Estado de Chiapas",
      en: "Government of the State of Chiapas",
    },
    period: "2022–2023",
    role: { es: "Desarrollador full stack", en: "Full stack developer" },
    summary: {
      es: "Sistema integral para kioscos donde la ciudadanía hace trámites y pagos del gobierno de Chiapas sin ir a una oficina.",
      en: "Integrated system for kiosks where citizens complete Chiapas government procedures and payments without going to an office.",
    },
    context: {
      es: "Los kioscos usan la solución de gestión y recaudación de trámites y servicios de eGob®, que permite al gobierno ofrecer la gestión y el pago de trámites desde cualquier lugar, de forma fácil, rápida y segura. La modernización de la recaudación en Chiapas puso en marcha 40 kioscos en espacios públicos del estado.",
      en: "The kiosks run eGob®'s procedures and payments management solution, which lets the government offer procedures and payments from anywhere, quickly, easily and securely. Chiapas's tax collection modernization put 40 kiosks in public spaces across the state.",
    },
    links: {
      article: "https://egob.com/chiapas-moderniza-su-recaudacion-con-kioscos-electronicos/",
    },
    art: { variant: "kiosk", hue: 75 },
  },
  {
    slug: "portafolio",
    name: { es: "Este portafolio", en: "This portfolio" },
    subtitle: {
      es: "Desarrollo dirigido con un agente de IA",
      en: "Built by directing an AI agent",
    },
    period: "2026",
    role: { es: "Dirección del proyecto", en: "Project direction" },
    duration: { es: "Una sola sesión", en: "A single session" },
    team: { es: "Yo y un agente de IA (Claude Code)", en: "Me and an AI agent (Claude Code)" },
    summary: {
      es: "Este sitio, construido en una sola sesión dirigiendo a un agente de IA: yo decidí qué hacer y corregí el rumbo; el agente programó, verificó y documentó.",
      en: "This site, built in a single session by directing an AI agent: I decided what to build and corrected course; the agent wrote, verified and documented the code.",
    },
    context: {
      es: "Construí mi portafolio dirigiendo a un agente de IA de programación, Claude Code, en lugar de escribir cada línea. Yo definí el objetivo, las fuentes y las reglas, aporté datos que el agente no podía conocer y corregí el rumbo. El agente trabajó en modo automático: planeó, programó, verificó y documentó, y al terminar cada etapa me explicaba lo que había decidido. Las cifras de esta página salen del registro de la sesión, y cada etapa se mide desde el mensaje mío que la inicia hasta el que inicia la siguiente (la última, hasta su verificación final), con la revisión incluida.",
      en: "I built my portfolio by directing an AI coding agent, Claude Code, instead of writing every line myself. I set the goal, the sources and the rules, provided details the agent couldn't know, and corrected course. The agent worked in auto mode: it planned, wrote, verified and documented the code, and at the end of each stage it explained what it had decided. The figures on this page come from the session log, and each stage is measured from the message of mine that starts it to the one that starts the next (the last one, until its final check), review time included.",
    },
    features: {
      es: [
        "Sitio en español e inglés con una página por proyecto, prerenderizado como HTML estático para GitHub Pages.",
        "Hero 3D con React Three Fiber que solo se descarga si hay WebGL y la persona no pidió ahorro de datos ni menos movimiento; si no, queda una ilustración SVG.",
        "Tema claro y oscuro con colores de editor de código, animaciones que respetan «reducir movimiento» y metadatos para buscadores y redes.",
      ],
      en: [
        "A Spanish and English site with a page per project, prerendered as static HTML for GitHub Pages.",
        "A 3D hero built with React Three Fiber that only downloads when WebGL is available and the visitor hasn't asked to save data or reduce motion; otherwise an SVG illustration stays in place.",
        "Light and dark themes with code-editor colors, animations that respect “reduce motion”, and metadata for search engines and social networks.",
      ],
    },
    collaboration: {
      es: [
        {
          title: "Yo: dirección",
          items: [
            "Definí el objetivo y los límites: GitHub Pages, React, dos idiomas y una animación atractiva sin saturar.",
            "Pedí un plan antes del código, que el agente buscara skills en skills.sh y una primera versión con datos de ejemplo.",
            "Aporté las fuentes del contenido y respondí lo que el agente no podía saber: el periodo de PKI Reports, el permiso para usar capturas y el correo público.",
            "Decidí qué se publica: sin capturas de PKI Reports, porque no tengo permiso, y sin presentar como mío un producto de CEGA Security.",
            "Revisé los resultados y corregí el rumbo con indicaciones concretas, del tono del texto a la paleta de colores.",
          ],
        },
        {
          title: "El agente: propuestas y ejecución",
          items: [
            "Comparó opciones de publicación y propuso la arquitectura: React Router con prerenderizado, sin servidor.",
            "Instaló 20 skills de skills.sh y escaneó su contenido en busca de comandos o instrucciones riesgosas antes de usarlas.",
            "Programó el sitio y tomó decisiones técnicas y de diseño por su cuenta, apoyándose en la documentación oficial cuando hizo falta.",
            "Cuando le faltaba información, lo dijo: avisó que LinkedIn no se podía leer y dejó vacío lo que no tenía datos.",
            "Verificó su trabajo con tipos, lint, pruebas y 83 capturas de Playwright en ambos temas, ambos idiomas y en móvil.",
            "Documentó todo el código y comprobó con un script que la documentación no cambiara el comportamiento.",
          ],
        },
      ],
      en: [
        {
          title: "Me: direction",
          items: [
            "Set the goal and the boundaries: GitHub Pages, React, two languages and engaging animation without overdoing it.",
            "Asked for a plan before any code, for the agent to look for skills on skills.sh, and for a first version with sample data.",
            "Provided the content sources and answered what the agent couldn't know: the PKI Reports timeline, permission to use screenshots and the public email.",
            "Decided what gets published: no PKI Reports screenshots, since I don't have permission, and no presenting a CEGA Security product as my own.",
            "Reviewed the results and corrected course with specific instructions, from the tone of the copy to the color palette.",
          ],
        },
        {
          title: "The agent: proposals and execution",
          items: [
            "Compared publishing options and proposed the architecture: React Router with prerendering, no server.",
            "Installed 20 skills from skills.sh and scanned their contents for risky commands or instructions before using them.",
            "Built the site and made technical and design decisions on its own, relying on the official documentation when needed.",
            "When information was missing, it said so: it flagged that LinkedIn couldn't be read and left empty whatever had no data.",
            "Checked its work with type checks, lint, tests and 83 Playwright screenshots across both themes, both languages and mobile.",
            "Documented all the code and used a script to confirm the documentation didn't change any behavior.",
          ],
        },
      ],
    },
    process: {
      es: [
        {
          title: "Planeación",
          duration: "49 min",
          text: "Comparamos formas de publicar en GitHub Pages y elegí React. El agente propuso React Router con prerenderizado y, como le pedí, instaló skills de skills.sh (diseño, animación, accesibilidad y SEO) antes de escribir código.",
        },
        {
          title: "Primera versión con datos de ejemplo",
          duration: "1 h 11 min",
          text: "Todo el sitio con contenido ficticio: rutas en dos idiomas, hero 3D, animaciones, formulario de contacto, pruebas y la configuración para publicar en GitHub Pages con GitHub Actions.",
        },
        {
          title: "Contenido real",
          duration: "1 h 56 min",
          text: "Perfil, experiencia y proyectos a partir de mi CV, mi portafolio anterior, mi perfil público de GitHub y las páginas públicas de PKI Reports. El agente me consultó los datos dudosos, como el periodo de PKI Reports y el correo de contacto.",
        },
        {
          title: "El mensaje principal",
          duration: "36 min",
          text: "Cuatro rondas de ajustes al texto de la portada: más concreto, sin presentar como mío un producto de CEGA Security y con el puesto de Ingeniero de Software. Entre las frases que propuso el agente, elegí «Primero entiendo el problema. Después escribo el código.»",
        },
        {
          title: "Identidad visual",
          duration: "33 min",
          text: "Pedí que el modo oscuro se sintiera como un entorno de desarrollo. Probamos el azul de las terminales y nos quedamos con el negro de los editores: colores de sintaxis con un significado fijo (tecnologías, fechas, prompt) y Cascadia Code para los detalles de código.",
        },
        {
          title: "Documentación",
          duration: "37 min",
          text: "Comentarios TSDoc en todo el código: de 304 elementos sin documentar a 0. Un script comparó el código sin comentarios con una copia previa para asegurar que nada cambiara. Al final, el agente borró el código sin uso que encontró, después de que lo aprobé.",
        },
        {
          title: "Este caso de estudio",
          duration: "35 min",
          text: "Reconstruido con los datos del registro de la sesión. Para verificarlo, el agente lanzó un segundo agente que comparó cada afirmación con el registro y con el código, en dos rondas: detectó dos conteos inexactos, una afirmación falsa y dos citas no literales, y señaló fuentes, atribuciones y alcances imprecisos. Las correcciones se aplicaron antes de publicar.",
        },
      ],
      en: [
        {
          title: "Planning",
          duration: "49 min",
          text: "We compared ways to publish on GitHub Pages and I chose React. The agent proposed React Router with prerendering and, as I asked, installed skills from skills.sh (design, animation, accessibility and SEO) before writing any code.",
        },
        {
          title: "First version with sample data",
          duration: "1 h 11 min",
          text: "The whole site with placeholder content: routes in two languages, the 3D hero, animations, the contact form, tests and the setup to publish on GitHub Pages with GitHub Actions.",
        },
        {
          title: "Real content",
          duration: "1 h 56 min",
          text: "Profile, experience and projects from my résumé, my previous portfolio, my public GitHub profile and the public PKI Reports pages. The agent checked uncertain details with me, such as the PKI Reports timeline and the contact email.",
        },
        {
          title: "The main message",
          duration: "36 min",
          text: "Four rounds of edits to the home page copy: more concrete, without presenting a CEGA Security product as my own, and with the title Software Engineer. From the lines the agent proposed, I chose “First I understand the problem. Then I write the code.”",
        },
        {
          title: "Visual identity",
          duration: "33 min",
          text: "I asked for a dark mode that felt like a development environment. We tried terminal blue and settled on editor black: syntax colors with a fixed meaning (technologies, dates, prompt) and Cascadia Code for the code details.",
        },
        {
          title: "Documentation",
          duration: "37 min",
          text: "TSDoc comments across the whole codebase: from 304 undocumented items to 0. A script compared the code without comments against an earlier copy to make sure nothing changed. Finally, the agent removed the unused code it had found, once I approved it.",
        },
        {
          title: "This case study",
          duration: "35 min",
          text: "Rebuilt from the session log. To verify it, the agent launched a second agent that checked every claim against the log and the code, in two rounds: it caught two inaccurate counts, a false claim and two non-literal quotes, and flagged imprecise sources, attributions and scope. The corrections were applied before publishing.",
        },
      ],
    },
    architecture: {
      ui: ["React 19", "TypeScript", "Tailwind CSS 4", "GSAP", "Motion", "React Three Fiber"],
      infra: ["Vite 8", "React Router 8", "Vitest", "Playwright", "GitHub Actions", "GitHub Pages"],
    },
    results: {
      es: [
        {
          value: "< 6 h",
          text: "de la primera pregunta a la versión documentada, en una sola sesión",
        },
        {
          value: "15",
          text: "mensajes míos dirigieron 523 acciones del agente hasta la versión documentada, en su mayoría comandos y lecturas o escrituras de archivos",
        },
        {
          value: "83",
          text: "capturas del sitio que el agente revisó para comprobar el diseño de la versión documentada",
        },
      ],
      en: [
        {
          value: "< 6 h",
          text: "from the first question to the documented version, in a single session",
        },
        {
          value: "15",
          text: "messages from me directed 523 agent actions up to the documented version, mostly commands and file reads or writes",
        },
        {
          value: "83",
          text: "screenshots of the site the agent reviewed to check the design of the documented version",
        },
      ],
    },
    learnings: {
      es: "Dirigir a un agente se parece más a liderar un equipo que a programar: el resultado depende del contexto que le das, de reglas claras y de revisar con criterio. Mis correcciones concretas, como pedir que el texto no pareciera una venta o que el modo oscuro fuera negro, avanzaron más que cualquier instrucción general, y la verificación automática me dejó concentrarme en las decisiones.",
      en: "Directing an agent is closer to leading a team than to programming: the result depends on the context you give it, clear rules and reviewing with judgment. Specific corrections, like asking that the copy not read as a sales pitch or that dark mode be black, moved things further than any general instruction, and automated verification let me focus on the decisions.",
    },
    links: { live: site.url, repo: site.repositoryUrl },
    image: {
      src: "portafolio",
      ratio: 1600 / 900,
      alt: {
        es: "Portada de este sitio en tema oscuro: la frase «Primero entiendo el problema. Después escribo el código.», el nombre y las capas de una aplicación en 3D",
        en: "This site's home page in dark mode: the tagline “Primero entiendo el problema. Después escribo el código.” (“First I understand the problem. Then I write the code.”), the name and the layers of an application in 3D",
      },
    },
    art: { variant: "api", hue: 250 },
  },
];

/**
 * Busca un proyecto por su slug.
 *
 * @param slug - Segmento de la URL; puede faltar si la ruta no lo trae.
 * @returns El proyecto, o `undefined` si no existe (la página muestra la 404).
 */
export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * El proyecto que sigue en la lista; después del último vuelve al primero.
 *
 * @param slug - Slug del proyecto actual.
 */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}
