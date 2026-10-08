# Skills del proyecto

Las 21 skills de `.agents/skills/` son las mismas que usó Claude Code (copia idéntica de
`.claude/skills/`).

- **Formato:** siguen el estándar de Agent Skills, una carpeta con `SKILL.md`, `name` y
  `description`. Antigravity las lee directamente.
- **Cuándo se cargan:** el agente las carga cuando la descripción coincide con la tarea. También se
  pueden pedir por nombre (`/frontend-design`).
- **Git:** son de terceros, así que no se suben al repositorio. `.gitignore` excluye
  `.agents/skills/`.

## Inventario

| Skill                       | Origen                            | Para qué sirve aquí                                              |
| --------------------------- | --------------------------------- | ---------------------------------------------------------------- |
| frontend-design             | anthropics/skills                 | Dirección visual: paleta, tipografía, evitar diseño de plantilla |
| emil-design-eng             | emilkowalski/skills               | Criterio de animación y detalles de interfaz                     |
| animate                     | emilkowalski/skills               | Diseñar una animación nueva paso a paso                          |
| review-animations           | emilkowalski/skills               | Revisar animaciones existentes                                   |
| prototype                   | emilkowalski/skills               | Varias versiones de una pieza de UI para comparar                |
| gsap-core                   | greensock/gsap-skills             | API base de GSAP, `matchMedia`, reducir movimiento               |
| gsap-react                  | greensock/gsap-skills             | `useGSAP`, scope y limpieza en React                             |
| gsap-scrolltrigger          | greensock/gsap-skills             | Animaciones ligadas al scroll                                    |
| gsap-timeline               | greensock/gsap-skills             | Secuencias                                                       |
| gsap-plugins                | greensock/gsap-skills             | Plugins como ScrambleText                                        |
| gsap-performance            | greensock/gsap-skills             | Rendimiento de animaciones                                       |
| accessibility               | addyosmani/web-quality-skills     | Auditoría WCAG 2.2                                               |
| performance                 | addyosmani/web-quality-skills     | Rendimiento de carga                                             |
| seo                         | addyosmani/web-quality-skills     | Metadatos, datos estructurados y sitemap                         |
| web-design-guidelines       | vercel-labs/agent-skills          | Revisión de interfaz con buenas prácticas                        |
| vercel-react-best-practices | vercel-labs/agent-skills          | Rendimiento en React                                             |
| vercel-composition-patterns | vercel-labs/agent-skills          | Composición de componentes                                       |
| vite                        | antfu/skills                      | Configuración de Vite 8                                          |
| vitest                      | antfu/skills                      | Pruebas con Vitest                                               |
| playwright-cli              | microsoft/playwright-cli          | Automatizar el navegador                                         |
| react-router                | plantilla oficial de React Router | Rutas, prerenderizado y modo framework                           |

En la construcción del sitio se invocaron explícitamente `frontend-design`, `gsap-react`,
`gsap-scrolltrigger` y `emil-design-eng`.

## Actualizar o reinstalar

`skills-lock.json`, en la raíz, guarda el origen y el hash de las 20 skills de skills.sh. Para
reinstalar una en Antigravity:

```bash
npx skills add <origen> --skill <nombre>
```

Por ejemplo: `npx skills add greensock/gsap-skills --skill gsap-react`. Si el instalador pregunta
por el agente, elige Antigravity. Las skills deben quedar en `.agents/skills/`.

Antes de usar una skill nueva, revísala: tiene los mismos permisos que el agente. Busca comandos
de red, instrucciones del tipo «ignora las instrucciones anteriores» o pedidos de credenciales.
