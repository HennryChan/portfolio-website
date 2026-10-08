# Portafolio de Hennry Chan: guía para agentes de IA

Sitio personal de Hennry Chan, ingeniero de software, en español e inglés. Es un sitio estático
prerenderizado y se publica en GitHub Pages (https://hennrychan.github.io, repositorio
`HennryChan/HennryChan.github.io`). Lo construyó Claude Code dirigido por Hennry; él sigue con
Antigravity. Todo lo necesario para continuar está en este archivo y en `.agents/`.

## Reglas de trabajo

- **Idioma:** responde y documenta en español. El código conserva sus identificadores en inglés.
- **Antes de dar algo por terminado:** ejecuta `npm run check`. Si cambiaste algo visible, ejecuta
  también `npm run qa:smoke` y `npm run qa:screenshots` y revisa las capturas. El procedimiento
  completo está en `/verificar`. Informa qué verificaste y qué no, con los resultados reales.
- **Pide confirmación antes de:** hacer commits, crear el repositorio, hacer push, borrar archivos,
  instalar o quitar dependencias y cambiar datos personales que se publican.
- **No inventes datos** sobre trabajos, proyectos, fechas o cifras reales. Si falta información,
  pregúntala; si algo no se puede comprobar, no lo publiques.
- **Nunca publiques** el teléfono, el correo del CV ni capturas de PKI Reports (no hay permiso). El
  correo público es dev.hennry.chan@gmail.com.
- **Tono:** PKI Reports es un producto de CEGA Security. Hennry participó en su desarrollo; no lo
  presentes como suyo ni lo "vendas".
- **Citas:** al citar a Hennry en el sitio, parafrasea. Una paráfrasis nunca va entre comillas como
  si fuera textual.
- **Documentación:** todo el código lleva comentarios TSDoc en español y `npm run qa:docs` debe dar 0
  pendientes. Los comentarios explican el porqué, no lo que el código ya dice.

## Stack

React 19 y React Router 8 en modo framework (`ssr: false` más prerenderizado). Vite 8,
TypeScript 5.9 (strict), Tailwind CSS 4 con tokens propios, GSAP 3.15 (ScrollTrigger y
ScrambleText), Motion 14 (LazyMotion, componentes `m.*`), Lenis, React Three Fiber 9 con three.js,
Vitest 5, Playwright, ESLint 10 y Prettier. Requiere Node 22.22 o superior; se recomienda Node 24.

## Mapa del código

```
app/
  content/      datos del sitio: perfil, proyectos, stack, experiencia, textos de sección, sitio
  i18n/         rutas por idioma (paths.ts), textos de la interfaz (ui.ts), localize()
  routes/       portada, página de proyecto y 404 (routes.ts define el mapa)
  components/   hero (SVG + 3D), secciones, tarjetas y páginas de proyecto, cabecera, pie, UI
  hooks/        tema, media queries, sección activa, visibilidad y capacidades del dispositivo
  animation/    configuración única de GSAP y de Motion
  lib/          cn(), metadatos (seo.ts) y validación del formulario (contact.ts)
  styles/       app.css: tokens de color por tema, escala tipográfica y estilos globales
images/         originales de fotos y capturas (no se publican)
public/         lo que se publica tal cual; public/images/*.webp lo genera `npm run images`
scripts/        postbuild (404, sitemap, robots), vista previa, imágenes y qa/ (verificación)
```

- **Rutas:** español en la raíz y en `/proyectos/<slug>`; inglés en `/en` y `/en/projects/<slug>`.
  Cada proyecto de `app/content/projects.ts` genera dos páginas en el build.
- **Contenido:** todo texto visible va en ambos idiomas (`{ es, en }`). Las pruebas de
  `app/content/content.test.ts` fallan si falta uno. `app/content/types.ts` documenta cada campo y
  dónde se muestra.

## Comandos

| Comando                  | Qué hace                                                           |
| ------------------------ | ------------------------------------------------------------------ |
| `npm run dev`            | servidor de desarrollo en http://localhost:5173                    |
| `npm run check`          | tipos, lint, formato, pruebas, documentación y build               |
| `npm run qa:smoke`       | recorre el build con un navegador (requiere `npm run build` antes) |
| `npm run qa:screenshots` | 27 capturas en `qa/capturas/`: ambos temas, idiomas y móvil        |
| `npm run qa:docs`        | lista lo que falta documentar                                      |
| `npm run qa:comments`    | comprueba que un cambio solo tocó comentarios (compara con git)    |
| `npm run images`         | WebP de `images/`, imágenes para redes e ícono de iOS              |
| `npm run preview`        | sirve `build/client` como GitHub Pages                             |

## Estado y pendientes

- No hay commits todavía. El repositorio git local existe (lo creó la plantilla), pero aún no hay
  remoto ni repositorio en GitHub. Para publicar, usa `/publicar`.
- El formulario de contacto está en modo demostración (`site.contactForm.endpoint` vacío). Para
  conectarlo, usa `/conectar-formulario`.
- **Por confirmar con Hennry:**
  - La fecha de fin en CEGA Security: está en octubre de 2026, deducida de su CV.
  - El párrafo "Lo que aprendí" del caso de estudio, redactado en su voz.
  - Si quiere la línea de disponibilidad en el hero.
  - Si el tema oscuro debe ser el predeterminado.
  - El stack de cada proyecto de Grupo Blue Ocean.
- La dependencia `@react-three/drei` ya no se usa. Se puede quitar, previa confirmación.

## Más contexto

- `.agents/rules/`: reglas de contenido, código, diseño y terminal. Se cargan cuando tocan.
- `.agents/workflows/`: los comandos `/verificar`, `/agregar-proyecto`, `/revisar-diseno`,
  `/documentar`, `/publicar`, `/conectar-formulario` y `/caso-de-estudio`.
- `.agents/skills/`: 21 skills de diseño, animación con GSAP, accesibilidad, SEO, rendimiento,
  React Router, Vite, Vitest y Playwright. El inventario está en `.agents/contexto/skills.md`.
- `.agents/contexto/historial.md`: cómo se construyó el sitio, por qué se decidió cada cosa y
  lecciones técnicas que conviene no repetir.
