---
trigger: glob
globs: "**/*.ts, **/*.tsx, **/*.mjs, **/*.js, **/*.css"
---

# Código

## Arquitectura

- **React Router 8 en modo framework con `ssr: false` y prerenderizado.** Cada ruta se genera como
  HTML en el build (`react-router.config.ts`). No hay servidor: nada de loaders o actions que
  dependan de una petición.
- **`BASE_PATH`:** controla el `basename` de React Router y el `base` de Vite. Si el repositorio no
  se llama `<usuario>.github.io`, `scripts/postbuild.mjs` aplana la salida. Las rutas a archivos de
  `public/` se arman con `import.meta.env.BASE_URL`.
- **Idiomas:** las rutas por idioma están en `app/i18n/paths.ts`. Ese archivo no puede depender de
  React ni de Vite, porque lo importa la configuración.
- **Imports:** en `app/content/*` usa rutas relativas (`./site`, `../i18n/paths`). La configuración
  de React Router no resuelve el alias `~/`. En componentes, usa `~/`.
- **Scripts de Node que importan `.ts`:** Node quita los tipos, pero exige extensión explícita en
  los imports relativos. Solo se pueden importar archivos `.ts` que no tengan imports relativos con
  valor. Hoy funcionan `profile.ts` y `ui.ts`.

## Patrones obligatorios

- **GSAP:** importa `gsap`, `ScrollTrigger` y `useGSAP` desde `~/animation/gsap` (registro único).
  - Usa siempre `useGSAP` con `scope` y anima por clase dentro del scope.
  - Usa `gsap.matchMedia()` con `motionQueries.ok` o `motionQueries.desktop`: sin animación cuando
    hay «reducir movimiento».
  - Un plugin que se usa en un solo componente se registra en ese componente, como ScrambleText en
    `hero-hook.tsx`.
- **Motion:** solo componentes `m.*` dentro de `LazyMotion strict`. Usar `motion.*` lanza error. Las
  animaciones de interfaz duran menos de 300 ms, con `ease: [0.23, 1, 0.32, 1]`.
- **Lenis:** está sincronizado con el ticker de GSAP (`app/components/smooth-scroll.tsx`). Para
  desplazar, usa `scrollToSection` o `scrollToTop`. No agregues `scroll-behavior: smooth` en CSS:
  rompe la restauración de ScrollTrigger.
- **Valores del navegador** (media queries, tema, WebGL): léelos con `useSyncExternalStore` y un
  valor para el prerenderizado (ver `app/hooks/`). Nada de `window` durante el render.
- **Tema:** la fuente de verdad es `<html data-theme>`. Lo pone `themeInitScript` antes de pintar.
  Los colores salen de variables CSS (`--paper`, `--ink`, `--layer-*`, `--code-*`), nunca de valores
  fijos en componentes.
- **3D** (`stack-scene.tsx`):
  - Se carga con `lazy` solo si hay WebGL, no hay ahorro de datos ni «reducir movimiento».
  - Usa `RoomEnvironment` y `PMREMGenerator` en vez de `<Environment>` de drei, y etiquetas DOM
    proyectadas en vez de `<Html>` de drei.
  - Las geometrías compartidas llevan `dispose={null}`.
  - `frameloop` pasa a `"never"` cuando el hero sale de pantalla.
- **Accesibilidad:**
  - Botones con `aria-label` si solo tienen ícono.
  - Errores del formulario enlazados con `aria-describedby`.
  - El texto animado lleva su versión completa en `sr-only` y la versión animada con
    `aria-hidden`.

## Estilo

- **Tipos:** TypeScript strict. Usa `import type` para lo que solo es tipo (ESLint lo exige). Las
  variables sin usar empiezan con `_`.
- **Formato:** Prettier (`printWidth` 100) con el plugin de Tailwind, que ordena las clases. No
  ordenes las clases a mano.
- **Clases:** utilidades de Tailwind en el componente. `app/styles/app.css` es solo para tokens,
  estados que dependen del scroll o del puntero, y keyframes.
- **Documentación:** cada archivo empieza explicando para qué sirve. Cada función, componente,
  constante, tipo y campo de interfaz lleva TSDoc en español (`@param` y `@returns` cuando no son
  obvios). Los comentarios explican el porqué. `npm run qa:docs` debe dar 0.
- **Pruebas:** Vitest en entorno Node para la lógica sin interfaz (`app/**/*.test.ts`). Lo visual
  se verifica con `npm run qa:smoke` y `npm run qa:screenshots`.

## Antes de terminar

Ejecuta `npm run check`. Si fue solo documentación, ejecuta además `npm run qa:comments`.
