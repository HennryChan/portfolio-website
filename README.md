# Portafolio de Hennry Chan

Portafolio personal de un ingeniero de software, en español e inglés, publicado en GitHub Pages.

La idea visual sale del propio oficio: una aplicación web tiene capas (interfaz, API, datos e
infraestructura). Esas cuatro capas aparecen en el hero como placas de vidrio en 3D, ordenan la
sección de stack y organizan el diagrama de arquitectura de cada proyecto, siempre con los mismos
colores. El tema oscuro usa el negro y los colores de sintaxis de un editor de código.

> **Estado:** el contenido es real (CV 2026, portafolio anterior y páginas públicas de cada
> proyecto). El formulario de contacto sigue en modo demostración hasta conectarle un servicio
> (ver [Formulario de contacto](#formulario-de-contacto)).

El último proyecto del portafolio es el propio sitio: un caso de estudio sobre cómo se construyó
dirigiendo a un agente de IA (Claude Code), con las etapas, los tiempos y las cifras reales de la
sesión (`/proyectos/portafolio`).

## Stack

| Capa        | Herramientas                                                                     |
| ----------- | -------------------------------------------------------------------------------- |
| Base        | React 19, TypeScript, React Router 8 (modo framework, sobre Vite 8)              |
| Renderizado | Sin servidor: cada página se prerenderiza a HTML en el build                     |
| Estilos     | Tailwind CSS 4 con tokens propios para tema claro y oscuro                       |
| Tipografía  | Mona Sans (variable, con eje de ancho) y Cascadia Code, servidas desde el sitio  |
| Animación   | GSAP + ScrollTrigger y ScrambleText, Motion (interfaz), Lenis (scroll suave)     |
| 3D          | React Three Fiber, cargado aparte y solo si el dispositivo puede                 |
| Imágenes    | sharp (WebP en dos tamaños) y Playwright (imágenes para redes y el ícono de iOS) |
| Calidad     | ESLint, Prettier, Vitest; Playwright para revisión visual                        |
| Publicación | GitHub Actions → GitHub Pages                                                    |

## Comandos

```bash
npm install          # instala dependencias (requiere Node 22.22 o superior; recomendado Node 24)
npm run dev          # servidor de desarrollo en http://localhost:5173
npm run build        # genera el sitio estático en build/client
npm run preview      # sirve build/client como lo hace GitHub Pages
npm run typecheck    # tipos de TypeScript
npm run lint         # ESLint
npm run format       # formatea con Prettier (format:check solo revisa)
npm test             # pruebas con Vitest (test:watch las repite al guardar)
npm run images       # fotos y capturas a WebP, imágenes para redes e ícono de iOS

npm run check           # todo junto: tipos, lint, formato, pruebas, documentación y build
npm run qa:smoke        # recorre el build con un navegador (después de npm run build)
npm run qa:screenshots  # capturas en ambos temas, idiomas y móvil, en qa/capturas/
npm run qa:docs         # lista lo que falta documentar
npm run qa:comments     # comprueba que un cambio solo tocó comentarios (compara con git)
```

## Estructura

```
app/
  content/      ← tus datos: perfil, proyectos, stack, experiencia, textos de sección y sitio
  i18n/         rutas por idioma y textos de la interfaz (ES / EN)
  routes/       portada, página de cada proyecto y 404
  components/   hero (3D), secciones, tarjetas, formulario, cabecera y pie
  hooks/        tema, media queries, sección activa y capacidades del dispositivo
  animation/    configuración de GSAP y Motion
  lib/          utilidades: clases, metadatos (SEO) y validación del formulario
  styles/       tokens de diseño y estilos globales
images/         originales de fotos y capturas (no se publican)
public/         lo que se publica tal cual: íconos, imágenes para redes y WebP generados
scripts/        postbuild (404, sitemap, robots), vista previa, imágenes y qa/ (verificación)
.github/        workflow de CI y despliegue
AGENTS.md       guía para agentes de IA (Antigravity, Claude Code, Cursor…)
.agents/        reglas, workflows, skills y contexto para Antigravity
```

### Rutas

| Español             | Inglés                |
| ------------------- | --------------------- |
| `/`                 | `/en`                 |
| `/proyectos/<slug>` | `/en/projects/<slug>` |

Cada página declara su versión en el otro idioma (`hreflang`) y el sitemap las incluye a ambas.

## Tema y colores

Hay tema claro (el predeterminado) y oscuro. Un script en el `<head>` aplica la preferencia
guardada, o la del sistema, antes de pintar la página. Los colores son variables CSS en
`app/styles/app.css`:

- **Capas:** cada capa tiene su color y solo aparece donde representa esa capa.
- **Sintaxis:** como en VS Code (Dark+ y Light+), cada tipo de dato tiene siempre el mismo color.

| Variable        | Se usa en                  | Oscuro    | Claro     |
| --------------- | -------------------------- | --------- | --------- |
| `--code-tech`   | nombres de tecnologías     | `#9cdcfe` | `#001080` |
| `--code-number` | fechas y periodos          | `#b5cea8` | `#098658` |
| `--code-accent` | prompt `>` del hero y foco | `#3794ff` | `#006ab1` |
| `--button-bg`   | botón principal            | `#0078d4` | `#162033` |

## Cómo cambiar el contenido

Todo el contenido vive en `app/content/`. Cada texto tiene su versión `es` y `en`, y las pruebas
fallan si falta alguna. Cada campo está documentado en `app/content/types.ts`, con el lugar del
sitio donde se muestra.

1. **`site.ts`:** URL pública, repositorio, correo, redes, formulario de contacto, CV y
   `caseStudy`, el proyecto que el pie de página enlaza como "Cómo se hizo este sitio".
2. **`profile.ts`:** nombre, rol, presentación, frase del hero, certificación, ubicación, zona
   horaria y foto.
3. **`projects.ts`:** proyectos en el orden en que aparecen. El `slug` forma la URL; `features`
   es lo que hace el producto y `solution`, lo que hiciste tú. Los bloques opcionales
   `collaboration` ("Quién hizo qué") y `process` ("Cómo se construyó", con la duración de cada
   etapa) sirven para casos de estudio como el de este mismo sitio.
4. **`stack.ts`:** tecnologías por capa y áreas transversales (seguridad, calidad, IA).
5. **`experience.ts`:** trabajos (del más reciente al más antiguo) y formación.
6. **`sections.ts`:** frases que presentan Proyectos, Experiencia y Contacto.

Si cambias el nombre o el rol, ejecuta `npm run images` para actualizar las imágenes para redes.

**Foto y capturas:** guarda el original en `images/` (PNG, JPG, WebP o AVIF) y ejecuta
`npm run images`. Después referencia el archivo por su nombre, sin extensión, con la proporción
del original:

```ts
// profile.ts
portrait: { src: "portrait", ratio: 2109 / 2995 },
// projects.ts
image: { src: "siturq", ratio: <ancho> / <alto>, alt: { es: "…", en: "…" } },
```

Los proyectos sin captura muestran una ilustración (`art`).

### Formulario de contacto

Mientras `site.contactForm.endpoint` esté vacío, el formulario funciona en modo demostración y no
envía nada. Para activarlo, crea un formulario en [Formspree](https://formspree.io) o
[Web3Forms](https://web3forms.com) y copia su URL (y la llave, si el servicio la pide) en
`site.ts`.

## Publicar en GitHub Pages

1. Crea un repositorio público llamado `<tu-usuario>.github.io` para que el sitio quede en
   `https://<tu-usuario>.github.io`. Con otro nombre funciona igual, pero la URL lleva el nombre
   del repo; el workflow ajusta la ruta base solo.
2. Revisa `site.url` y `site.repositoryUrl` en `app/content/site.ts`. Si el repo tiene otro
   nombre, `site.url` debe incluirlo (`https://<tu-usuario>.github.io/<repo>`).
3. Sube el código a la rama `main`.
4. En **Settings → Pages**, elige **GitHub Actions** como fuente.

Cada push a `main` revisa tipos, lint, formato y pruebas, compila y publica. Los pull requests
solo se revisan.

## Documentación del código

- Cada archivo empieza explicando para qué sirve; si exporta un solo componente, esa explicación
  es la documentación del componente.
- Componentes, hooks, funciones, constantes y tipos llevan comentarios TSDoc (`/** … */`) en
  español, que el editor muestra al pasar el puntero. Los parámetros que no son obvios llevan
  `@param` y `@returns`.
- Los comentarios explican el porqué (decisiones, límites del navegador, accesibilidad), no lo
  que el código ya dice.
- `app/styles/app.css` explica cada grupo de tokens y cada bloque de estilos.

## Trabajar con agentes de IA (Antigravity)

El proyecto está preparado para seguir con un agente de IA. Antigravity lee esto solo al abrir la
carpeta:

- **`AGENTS.md`:** se carga siempre. Contiene el resumen del proyecto, las reglas de trabajo, los
  comandos y los pendientes.
- **`.agents/rules/`:** reglas por tema. `contenido` y `codigo` se activan al tocar esos archivos;
  `diseno` y `terminal-windows` se activan cuando el agente las considera relevantes.
- **`.agents/workflows/`:** procedimientos que se invocan con `/`:
  - `/verificar`, `/agregar-proyecto`, `/revisar-diseno` y `/documentar`;
  - `/publicar`, `/conectar-formulario` y `/caso-de-estudio`.
- **`.agents/skills/`:** 21 skills de diseño, animación, accesibilidad, SEO, React Router, Vite,
  Vitest y Playwright. Son de terceros y no se suben al repositorio. `.agents/contexto/skills.md`
  explica cómo reinstalarlas.
- **`.agents/contexto/historial.md`:** cómo se construyó el sitio, por qué se decidió cada cosa y
  los errores técnicos que ya se resolvieron.

Si copias el proyecto a otro equipo, copia la carpeta completa: las skills no van en git.

## Accesibilidad y rendimiento

- Con "reducir movimiento" activado no hay animaciones de desplazamiento, la frase del hero
  aparece completa y no se carga la escena 3D: se muestra la ilustración estática.
- El 3D (three.js) se descarga aparte, después de la entrada de la portada y solo con WebGL
  disponible y sin ahorro de datos. Deja de dibujarse cuando el hero sale de la pantalla.
- Todo el contenido viene en el HTML prerenderizado; el JavaScript mejora la experiencia, pero no
  es necesario para leer el sitio.
- Las fotos y capturas se sirven en WebP, en dos tamaños (`srcset`) y con carga diferida.
- El formulario enlaza cada error con su campo, pone el foco en el primero inválido y anuncia el
  resultado del envío a los lectores de pantalla.
