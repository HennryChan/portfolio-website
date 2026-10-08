---
trigger: model_decision
description: Al cambiar colores, tipografía, animaciones, el hero 3D, el diseño de una sección o la apariencia de cualquier componente.
---

# Diseño

## Idea central

Una aplicación web tiene cuatro capas: interfaz, API y servicios, datos e infraestructura. Las
capas aparecen en el hero (placas de vidrio en 3D o en SVG), ordenan la sección Stack y organizan
el diagrama de arquitectura de cada proyecto. Siempre llevan los mismos colores. Un color de capa
solo aparece donde representa esa capa.

## Color (tokens en `app/styles/app.css`)

**Tema claro (predeterminado):**

- Fondo `--paper` `#edf0f3`, superficies `#f8f9fb` y `#ffffff`.
- Tinta `--ink` `#162033`, tinta suave `#4d586a`, líneas `#ccd3dc`.

**Tema oscuro, negro de editor como VS Code Dark+:**

- Fondo `#141414`, paneles `#1c1c1c` y `#252526`.
- Texto `#d4d4d4` y `#9d9d9d`, líneas `#2b2b2b`.
- Se llegó a este tema después de probar el azul de terminal de PowerShell. Hennry lo quiere
  limpio, sin saturar y sin que todo sea blanco.

**Colores de sintaxis:** cada tipo de dato lleva siempre el mismo color, como en un editor.

| Token           | Uso                           | Oscuro    | Claro     |
| --------------- | ----------------------------- | --------- | --------- |
| `--code-tech`   | nombres de tecnologías        | `#9cdcfe` | `#001080` |
| `--code-number` | fechas, periodos y duraciones | `#b5cea8` | `#098658` |
| `--code-accent` | prompt `>` del hero y foco    | `#3794ff` | `#006ab1` |
| `--button-bg`   | botón principal               | `#0078d4` | `#162033` |

**Capas** (oscuro / claro):

- UI: `#c586c0` / `#5a4fd8`.
- API: `#4ec9b0` / `#0b8f80`.
- Datos: `#d7ba7d` / `#b8770f`.
- Infraestructura: `#ce9178` / `#d2436f`.

Si cambias un token oscuro, cámbialo también en el bloque `@media (prefers-color-scheme: dark)`.
Ese bloque es el respaldo sin JavaScript.

## Tipografía

- **Mona Sans Variable** para todo, con eje de ancho:
  - `font-wide`: 125 %.
  - `font-semiwide`: 112 %.
- **Cascadia Code** solo para lo que es «código»:
  - la frase del hero, como línea de terminal con cursor;
  - tecnologías, fechas y duraciones;
  - el selector de idioma.
- Escala de Bringhurst: 12, 14, 16, 18, 21, 24, 36, 48, 60 y 72.
- Sin etiquetas en mayúsculas sostenidas ni palabras sueltas resaltadas en los títulos.

## Movimiento

- **Un solo momento orquestado:** la entrada de la portada (clase `.intro`, solo en cargas
  completas), con la frase del hero que se «descifra» desde un hash. El resto es discreto:
  - el texto de «Sobre mí» se enciende con el scroll;
  - las tarjetas de proyecto se apilan;
  - la línea de tiempo se dibuja;
  - el botón magnético.
- **Curvas:** `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)` y `--ease-in-out`
  `cubic-bezier(0.77, 0, 0.175, 1)`. Nunca `ease-in` en interfaz.
- **Duraciones:** menos de 300 ms en interfaz. Botones con `scale(0.97)` al pulsar.
- **Reducir movimiento:** con esa preferencia no hay animaciones de scroll, ni 3D, ni descifrado.
  Todo el contenido se ve completo.
- **Skills útiles:**
  - `emil-design-eng`, `animate` y `review-animations` para decidir y revisar movimiento;
  - `gsap-*` para la implementación;
  - `frontend-design` y `web-design-guidelines` para criterio visual;
  - `accessibility` para auditar.

## Verificación visual

Después de un cambio visible, ejecuta `npm run build && npm run qa:screenshots` y revisa las
capturas en ambos temas, en inglés y en móvil (`/revisar-diseno`).
