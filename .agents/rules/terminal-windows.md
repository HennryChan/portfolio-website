---
trigger: model_decision
description: Al ejecutar comandos en la terminal de este equipo con Windows (PowerShell o Git Bash), sobre todo builds, servidores y scripts.
---

# Terminal en Windows

Problemas que ya aparecieron en este proyecto y cómo evitarlos:

- **Git Bash convierte los argumentos que empiezan con `/`** en rutas de Windows. Por ejemplo, `/`
  se vuelve `C:/Program Files/Git/`. Antepón `MSYS_NO_PATHCONV=1` al comando, o usa PowerShell.
- **`EBUSY` al compilar:** si la terminal está dentro de `build/client`, el build no puede borrar
  la carpeta. Ejecuta los comandos desde la raíz del proyecto.
- **`EPERM` al renombrar archivos recién creados:** por eso `scripts/postbuild.mjs` copia y borra
  con reintentos en lugar de renombrar. Mantén ese enfoque.
- **Barras invertidas en heredocs:** en Git Bash se pueden perder. Para editar archivos con
  scripts, escribe el script en un archivo en lugar de pasarlo por heredoc.
- **Puertos:**
  - `npm run dev` usa el 5173.
  - `npm run preview` usa el 4173.
  - `qa:smoke` y `qa:screenshots` levantan su propia vista previa en el 4310 (cámbialo con
    `QA_PORT`).
- **Playwright:** si falta el navegador, instálalo con `npx playwright install chromium`. Para que
  el 3D aparezca en las capturas sin GPU, se lanza con
  `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`.
- **La primera carga de `npm run dev`** puede dar «504 Outdated Optimize Dep». Es normal en Vite:
  se arregla recargando la página.
