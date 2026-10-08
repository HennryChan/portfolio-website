import type { StackLayer } from "./types";

/**
 * Tecnologías de la sección Stack, agrupadas como las capas del hero.
 * Primero las cuatro capas, en su orden; después lo que atraviesa a todas
 * (content.test.ts comprueba ese orden). Fuente: CV (2026).
 */
export const stack: StackLayer[] = [
  {
    id: "ui",
    description: {
      es: "Lo que la gente ve y usa.",
      en: "What people see and use.",
    },
    daily: ["React", "TypeScript", "JavaScript", "Tailwind CSS"],
    also: ["HTML5", "CSS"],
  },
  {
    id: "api",
    description: {
      es: "La lógica que conecta todo.",
      en: "The logic that connects everything.",
    },
    daily: [
      "C#",
      ".NET 8/10",
      "ASP.NET Core",
      "Entity Framework Core",
      { es: "APIs REST", en: "REST APIs" },
    ],
    also: ["LINQ", "SOAP", "PHP", "Laravel", "Java", "Python"],
  },
  {
    id: "data",
    description: {
      es: "Dónde vive la información y cómo se consulta.",
      en: "Where information lives and how it's queried.",
    },
    daily: ["SQL Server", "MySQL"],
    also: [],
  },
  {
    id: "infra",
    description: {
      es: "Cómo se versiona, se prueba y se publica.",
      en: "How it's versioned, tested and shipped.",
    },
    daily: ["Azure DevOps", "Docker", "Git", "CI/CD"],
    also: ["Azure", "Docker Compose", "GitHub"],
  },
  {
    id: "security",
    description: {
      es: "Identidad, cifrado y certificados en cada capa.",
      en: "Identity, encryption and certificates in every layer.",
    },
    daily: ["X.509", "PKI", "HSM", "JWT", "OAuth 2.0", "OpenID Connect"],
    also: ["TLS/SSL", "OCSP", "CRL"],
  },
  {
    id: "quality",
    description: {
      es: "Pruebas y prácticas que mantienen el código sano.",
      en: "Tests and practices that keep code healthy.",
    },
    daily: ["xUnit", "Moq", "FluentAssertions", "Clean Architecture", "SOLID"],
    also: ["dotnet-coverage", "ReportGenerator", "Scrum"],
  },
  {
    id: "ai",
    description: {
      es: "IA en el flujo de trabajo y dentro de los productos.",
      en: "AI in the workflow and inside products.",
    },
    daily: ["GitHub Copilot", "Claude Code"],
    also: [{ es: "APIs de LLM", en: "LLM APIs" }, "RAG"],
    learning: [{ es: "Fine-tuning con LoRA", en: "LoRA fine-tuning" }],
  },
];
