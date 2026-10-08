---
description: Publicar o actualizar el sitio en GitHub Pages. Pide confirmación a Hennry antes de cada paso con git o GitHub.
---

# Publicar en GitHub Pages

Ningún paso de este workflow se ejecuta solo. Antes de cada commit, push o creación de
repositorio, muestra lo que vas a hacer y espera el «sí» de Hennry.

1. Verifica que todo esté en orden con `/verificar`. No publiques con pruebas fallando.

2. Revisa qué va al repositorio público con `git status`. No deben aparecer:
   - `.claude/` y `.agents/skills/`: skills de terceros;
   - `qa/`: capturas;
   - `build/` ni `node_modules/`.

   `.gitignore` ya los excluye. `AGENTS.md`, `.agents/rules/`, `.agents/workflows/` y
   `.agents/contexto/` sí se suben (no contienen datos privados). Si Hennry prefiere no subirlos,
   agrégalos a `.gitignore`.

3. **Primer commit** (con confirmación). La rama es `main`:
   `git add -A && git commit -m "Primera versión del portafolio"`

4. **Repositorio en GitHub** (con confirmación):
   - Debe ser público y llamarse `HennryChan.github.io`, para que el sitio quede en
     https://hennrychan.github.io.
   - Con GitHub CLI: `gh repo create HennryChan/HennryChan.github.io --public --source=. --push`.
   - Sin GitHub CLI: Hennry lo crea en github.com y luego:
     `git remote add origin https://github.com/HennryChan/HennryChan.github.io.git && git push -u origin main`.
   - Si usa otro nombre de repositorio, actualiza `site.url` en `app/content/site.ts` (con el
     nombre del repo) antes de subir. El workflow calcula `BASE_PATH` solo.

5. **Activar Pages:** en **Settings → Pages → Source**, Hennry elige **GitHub Actions**. Es un
   paso manual en la web.

6. **Seguir el despliegue** en la pestaña **Actions** (workflow «CI y despliegue»). Cuando termine,
   abre https://hennrychan.github.io y revisa:
   - la portada y un proyecto en cada idioma;
   - la página 404 (una ruta inventada);
   - `/sitemap.xml` y `/robots.txt`.

7. **Para actualizar después:** commit y push a `main`, siempre con confirmación. Cada push revisa,
   compila y publica. Los pull requests solo se revisan.
