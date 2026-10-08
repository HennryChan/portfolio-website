/**
 * Comprueba que un cambio solo tocó comentarios: compara cada archivo modificado con su versión
 * en git después de quitar comentarios y formato (printer de TypeScript). Sirve para tareas de
 * documentación, donde el comportamiento no debe cambiar.
 *
 * Uso: npm run qa:comments [-- <ref>]   (por defecto compara con HEAD)
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import ts from "typescript";

/** Raíz del proyecto. */
const root = path.resolve(import.meta.dirname, "../..");
/** Versión de git contra la que se compara. */
const ref = process.argv[2] ?? "HEAD";

/**
 * Ejecuta git en la raíz del proyecto.
 * @param {string[]} args
 * @returns {string} La salida, sin espacios al final.
 */
function git(args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trimEnd();
}

try {
  git(["rev-parse", "--verify", `${ref}^{commit}`]);
} catch {
  console.log(`No hay una versión "${ref}" en git con la que comparar.`);
  console.log("Haz el primer commit (o indica otra referencia) y vuelve a ejecutar.");
  process.exit(2);
}

/** Reescribe el código sin comentarios y con formato uniforme. */
const printer = ts.createPrinter({ removeComments: true });

/**
 * El código sin comentarios ni formato. Las expresiones JSX vacías ({/* … *\/}), las comas
 * finales y las líneas en blanco no cambian nada al ejecutar, así que también se quitan.
 * @param {string} file - Ruta relativa, para saber el lenguaje.
 * @param {string} text - Contenido.
 */
function normalize(file, text) {
  if (file.endsWith(".css")) {
    return text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  const kind = file.endsWith(".tsx")
    ? ts.ScriptKind.TSX
    : file.endsWith(".ts")
      ? ts.ScriptKind.TS
      : ts.ScriptKind.JS;
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
  return printer
    .printFile(source)
    .replace(/\{\s*\}(?=\s*[<\n])/g, "")
    .replace(/,(\s*[}\])])/g, "$1")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");
}

/** Archivos de código modificados o nuevos desde la referencia. */
const changed = [
  ...git(["diff", "--name-only", ref, "--"]).split("\n"),
  ...git(["ls-files", "--others", "--exclude-standard"]).split("\n"),
].filter((file) => /\.(tsx?|mjs|js|css)$/.test(file));

/** Archivos cuyo código (no solo comentarios) cambió. */
let codeChanges = 0;
for (const file of new Set(changed)) {
  const current = path.join(root, file);
  if (!existsSync(current)) {
    console.log(`BORRADO  ${file}`);
    codeChanges++;
    continue;
  }
  let before;
  try {
    before = git(["show", `${ref}:${file}`]);
  } catch {
    console.log(`NUEVO    ${file}`);
    codeChanges++;
    continue;
  }
  if (normalize(file, before) !== normalize(file, readFileSync(current, "utf8"))) {
    console.log(`CÓDIGO   ${file}`);
    codeChanges++;
  }
}

console.log(
  codeChanges > 0
    ? `\n${codeChanges} archivo(s) con cambios de código respecto de ${ref}.`
    : `\nSolo cambiaron comentarios respecto de ${ref}.`,
);
process.exitCode = codeChanges > 0 ? 1 : 0;
