# Historial del proyecto

Cómo se construyó el sitio y por qué se decidió cada cosa. Sirve para no deshacer decisiones sin
saberlo y para no repetir errores ya resueltos.

## Línea de tiempo

El sitio se construyó el 6 de octubre de 2026, en una sola sesión de Claude Code (Claude Opus 5.5)
dirigida por Hennry. Hora local de Mérida.

| Etapa              | Inicio | Duración   | Qué pasó                                                                                                                                                              |
| ------------------ | ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Planeación         | 16:24  | 49 min     | Opciones para GitHub Pages; Hennry eligió React. React Router con prerenderizado. Se instalaron 20 skills de skills.sh y se revisaron en busca de contenido riesgoso. |
| Primera versión    | 17:13  | 1 h 11 min | Sitio completo con datos de ejemplo: dos idiomas, hero 3D, animaciones, formulario, pruebas y workflow de despliegue.                                                 |
| Contenido real     | 18:24  | 1 h 56 min | Perfil, experiencia y proyectos desde el CV, el portafolio anterior, GitHub y las páginas de PKI Reports. Hennry confirmó el periodo, los permisos y el correo.       |
| Mensaje principal  | 20:21  | 36 min     | Cuatro rondas sobre el texto del hero: más concreto, sin «vender» PKI Reports, puesto «Ingeniero de Software». Se eligió la frase actual.                             |
| Identidad visual   | 20:57  | 33 min     | Primero, el azul de terminal de PowerShell; luego, el negro de editor con colores de sintaxis de VS Code y Cascadia Code.                                             |
| Documentación      | 21:30  | 37 min     | TSDoc en todo el código (de 304 elementos sin documentar a 0), verificado con un comparador de código sin comentarios. Se quitó código sin uso.                       |
| Caso de estudio    | 22:07  | 35 min     | Proyecto «Este portafolio». Un segundo agente verificó las afirmaciones en dos rondas.                                                                                |
| Paso a Antigravity | 22:50  | —          | `AGENTS.md`, `.agents/` (reglas, workflows, skills, contexto) y scripts de `scripts/qa/`.                                                                             |

## Decisiones y por qué

**Plataforma**

- React Router en modo framework con `ssr: false` y prerenderizado. GitHub Pages solo sirve
  archivos estáticos y el HTML prerenderizado es bueno para SEO.
- `404.html` es la página de respaldo de la SPA. GitHub Pages la sirve en cualquier ruta
  desconocida, y la app muestra su propia 404.
- Rutas en español en la raíz e inglés bajo `/en`. Cada página declara su versión en el otro
  idioma (`hreflang`) y el sitemap las incluye.
- `BASE_PATH` existe por si el repositorio no se llama `HennryChan.github.io`. El build anida la
  salida en ese caso, y `scripts/postbuild.mjs` la aplana.

**Contenido**

- El hero empezó siendo genérico. Hennry lo encontró «ambiguo» y pidió algo concreto que
  despertara curiosidad. Tampoco quería que pareciera que vende PKI Reports. El resultado: la frase
  «Primero entiendo el problema. Después escribo el código.», el puesto «Ingeniero de Software»
  (sin «full stack») y la certificación de Azure destacada.
- PKI Reports va sin capturas, porque no hay permiso. Se usa una ilustración SVG de un panel de
  certificados.
- No se publica el teléfono ni el correo del CV. El correo público es dev.hennry.chan@gmail.com.
- El stack tiene áreas transversales (seguridad, calidad, IA) en gris neutro, separadas de las
  cuatro capas.

**Diseño**

- Hennry descartó el azul marino («genérico») y el azul de PowerShell («no es lo que quería»). Lo
  que buscaba era el negro de los editores, con colores consistentes, limpios y no saturados, y que
  no todo fuera blanco.
- El color se usa como en el resaltado de sintaxis: cada tipo de dato con un color fijo.
- Mona Sans con eje de ancho para la tipografía principal. Cascadia Code solo para lo que es
  «código».

**Caso de estudio**

- Va al final de la lista de proyectos y el pie de página lo enlaza (`site.caseStudy`).
- Sus cifras salen del registro de la sesión: hasta la versión documentada, 15 mensajes de Hennry,
  523 acciones del agente y 83 capturas revisadas. No hubo subagentes en la construcción; solo un
  agente verificador del texto.

## Lecciones técnicas (no repetir)

- **`<Html>` de drei** dejó de mostrar etiquetas y provocó el aviso «synchronously unmount a
  root». Se reemplazó por etiquetas DOM proyectadas con `Vector3.project` en `useFrame`.
- **`<Environment>` de drei** traía cargadores EXR y RGBE pesados. Se cambió por `RoomEnvironment`
  y `PMREMGenerator`.
- **`ContactShadows`** dejaba un rectángulo gris recortado en el tema claro. Se reemplazó por un
  plano con un degradado radial (`SoftShadow`).
- **Lint `react-hooks/immutability`** al asignar `scene.environment`: se resolvió leyendo el estado
  con `useThree((s) => s.get)` y `getState()` dentro del efecto.
- **`html { scroll-behavior: smooth }`** hacía que ScrollTrigger restaurara un scroll suave al
  navegar. No se debe usar; el scroll suave lo da Lenis.
- **ScrambleText** convierte `\n` en espacios. Por eso la frase va en un `<span>` por oración. Usa
  `wrap-anywhere`: `break-all` corta palabras en móvil.
- **`role.toLowerCase()`** rompía «.NET» en el título. El formato del título es
  `${fullName} — ${role}`.
- **`eslint-plugin-jsx-a11y`** no es compatible con ESLint 10. Se quitó: la accesibilidad se revisa
  con la skill `accessibility` y en las capturas.
- **Prettier reformatea** líneas largas. Los scripts de edición que buscan texto exacto deben
  contar con eso.

## Dónde quedó la evidencia

- El registro completo de la sesión de Claude Code está fuera del proyecto, en
  `C:\Users\hennr\.claude\projects\C--Users-hennr-Pictures-Portaforlio\`, en el archivo `.jsonl`
  de unos 35 MB. Contiene datos personales (el CV completo, entre otros), así que no debe ir al
  repositorio. Si Hennry quiere conservarlo como respaldo de las cifras del caso de estudio, que lo
  guarde en un lugar privado.
