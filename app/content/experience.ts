import type { EducationItem, ExperienceItem } from "./types";

/**
 * Trabajos de la línea de tiempo, del más reciente al más antiguo
 * (content.test.ts lo comprueba). El que tenga `end: null` se muestra como
 * actual y aparece como `worksFor` en los datos estructurados.
 * Fuentes: CV (2026) y portafolio anterior.
 */
export const experience: ExperienceItem[] = [
  {
    company: "CEGA Security",
    role: { es: "Ingeniero de software", en: "Software engineer" },
    start: "2024-09",
    end: "2026-10",
    location: { es: "Mérida, Yucatán", en: "Mérida, Yucatán" },
    highlights: {
      es: [
        "Participé en la nueva versión de PKI Reports, la plataforma de gestión y reportería de certificados de la empresa: API REST en .NET 8 y frontend en React.",
        "Llevé la cobertura de pruebas de 30 % a 70 % en las capas Domain y Application con xUnit, Moq y FluentAssertions.",
        "Implementé pipelines de CI/CD en Azure DevOps con Docker, reduciendo el tiempo de despliegue.",
        "Integré servicios de PKI y HSM (X.509, TLS, OCSP, CRL, CA/RA) y autenticación con JWT, OAuth y OpenID Connect.",
        "Participé en la migración de una aplicación legacy a .NET 10 y React, definiendo los requerimientos y el backlog bajo Scrum.",
      ],
      en: [
        "Worked on the new version of PKI Reports, the company's certificate management and reporting platform: a REST API in .NET 8 and a React frontend.",
        "Raised test coverage from 30% to 70% in the Domain and Application layers with xUnit, Moq and FluentAssertions.",
        "Set up CI/CD pipelines in Azure DevOps with Docker, cutting deployment time.",
        "Integrated PKI and HSM services (X.509, TLS, OCSP, CRL, CA/RA) and authentication with JWT, OAuth and OpenID Connect.",
        "Helped migrate a legacy application to .NET 10 and React, defining requirements and the backlog under Scrum.",
      ],
    },
    stack: [".NET 8", "C#", "React", "SQL Server", "Azure DevOps", "Docker"],
  },
  {
    company: "Grupo Blue Ocean",
    role: { es: "Ingeniero de software", en: "Software engineer" },
    start: "2022-02",
    end: "2024-06",
    location: { es: "Mérida, Yucatán", en: "Mérida, Yucatán" },
    highlights: {
      es: [
        "Desarrollé y mantuve aplicaciones web integrando backend, frontend, bases de datos y servicios externos: el SITUR-Q y el RETUR-Q de Quintana Roo y los kioscos electrónicos del Gobierno de Chiapas.",
        "Diseñé e integré APIs REST y servicios SOAP entre sistemas, con integraciones en producción.",
        "Diseñé y optimicé bases de datos en SQL Server y MySQL, mejorando los tiempos de consulta y respuesta.",
        "Construí interfaces responsivas con React y Laravel, y di mantenimiento correctivo y evolutivo que redujo incidencias.",
      ],
      en: [
        "Built and maintained web applications across backend, frontend, databases and external services: Quintana Roo's SITUR-Q and RETUR-Q, and the Chiapas government's electronic kiosks.",
        "Designed and integrated REST APIs and SOAP services between systems, with integrations running in production.",
        "Designed and tuned SQL Server and MySQL databases, improving query and response times.",
        "Built responsive interfaces with React and Laravel, and handled corrective and evolutionary maintenance that reduced incidents.",
      ],
    },
    stack: ["C#", ".NET", "PHP", "Laravel", "React", "SQL Server", "MySQL"],
  },
];

/** Formación y certificaciones, del más reciente al más antiguo. */
export const education: EducationItem[] = [
  {
    title: {
      es: "Microsoft Certified: Azure Developer Associate",
      en: "Microsoft Certified: Azure Developer Associate",
    },
    institution: "Microsoft",
    period: "2026",
  },
  {
    title: {
      es: "Ingeniería en Sistemas Computacionales, especialidad en Ingeniería de Software",
      en: "B.S. in Computer Systems Engineering, Software Engineering specialization",
    },
    institution: "Instituto Tecnológico Superior del Sur del Estado de Yucatán",
    period: "2018–2023",
  },
  {
    title: {
      es: "Scrum Fundamentals Certified",
      en: "Scrum Fundamentals Certified",
    },
    institution: "SCRUMstudy",
    period: "2022",
  },
];
