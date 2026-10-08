/**
 * Inventario de documentación. Lista los archivos sin descripción, las declaraciones de primer
 * nivel sin comentario TSDoc (`/** … *\/`) y los miembros de interfaces o tipos sin documentar.
 * Termina con código 1 si falta algo, así que sirve como comprobación antes de terminar un cambio.
 *
 * Uso: npm run qa:docs   (con `-- --all` lista también los archivos completos)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import ts from "typescript";

/** Raíz del proyecto. */
const root = path.resolve(import.meta.dirname, "../..");
/** Carpetas que se revisan completas. */
const folders = ["app", "scripts"];
/** Archivos de configuración de la raíz. */
const rootFiles = ["react-router.config.ts", "vite.config.ts", "vitest.config.ts", "eslint.config.js"];

/**
 * Archivos de código de una carpeta y sus subcarpetas.
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(tsx?|mjs|js)$/.test(entry) && !entry.endsWith(".d.ts") ? [full] : [];
  });
}

/**
 * El nodo tiene un comentario TSDoc justo antes.
 * @param {import("typescript").Node} node
 * @param {string} text - Contenido del archivo.
 */
function hasDoc(node, text) {
  const ranges = ts.getLeadingCommentRanges(text, node.getFullStart()) ?? [];
  return ranges.some((range) => text.slice(range.pos, range.end).startsWith("/**"));
}

/**
 * El nodo tiene cualquier comentario antes (TSDoc o de línea).
 * @param {import("typescript").Node} node
 * @param {string} text - Contenido del archivo.
 */
function hasComment(node, text) {
  return (ts.getLeadingCommentRanges(text, node.getFullStart()) ?? []).length > 0;
}

/**
 * Lo que falta documentar en un archivo.
 * @param {string} file - Ruta absoluta.
 * @returns {string[]}
 */
function audit(file) {
  const text = readFileSync(file, "utf8");
  const kind = file.endsWith(".tsx")
    ? ts.ScriptKind.TSX
    : file.endsWith(".ts")
      ? ts.ScriptKind.TS
      : ts.ScriptKind.JS;
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
  const missing = [];

  // Descripción del módulo: un comentario al inicio o justo antes de la primera declaración.
  const firstStatement = source.statements.find((statement) => !ts.isImportDeclaration(statement));
  const described =
    text.trimStart().startsWith("/") || (firstStatement && hasComment(firstStatement, text));
  if (!described) missing.push("(sin descripción del módulo)");

  for (const statement of source.statements) {
    let name = null;
    let members = [];
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      name = `function ${statement.name.text}`;
    } else if (ts.isInterfaceDeclaration(statement)) {
      name = `interface ${statement.name.text}`;
      members = statement.members;
    } else if (ts.isTypeAliasDeclaration(statement)) {
      name = `type ${statement.name.text}`;
      if (ts.isTypeLiteralNode(statement.type)) members = statement.type.members;
    } else if (ts.isClassDeclaration(statement) && statement.name) {
      name = `class ${statement.name.text}`;
    } else if (ts.isVariableStatement(statement)) {
      const names = statement.declarationList.declarations.map((d) => d.name.getText(source));
      name = `const ${names.join(", ")}`;
    } else if (ts.isExportAssignment(statement)) {
      name = "export default";
    }
    if (!name) continue;

    if (!hasDoc(statement, text)) missing.push(name);
    for (const member of members) {
      if (!hasDoc(member, text)) {
        missing.push(`  · ${name.split(" ")[1]}.${member.name?.getText(source) ?? "?"}`);
      }
    }
  }
  return missing;
}

/** Todos los archivos que se revisan. */
const files = [
  ...folders.flatMap((folder) => walk(path.join(root, folder))),
  ...rootFiles.map((file) => path.join(root, file)),
];
/** Con --all se listan también los archivos sin pendientes. */
const showAll = process.argv.includes("--all");
/** Elementos sin documentar en todo el proyecto. */
let total = 0;

for (const file of files) {
  const missing = audit(file);
  total += missing.length;
  if (missing.length > 0 || showAll) {
    console.log(`\n${path.relative(root, file)}`);
    for (const item of missing) console.log(`  - ${item}`);
  }
}

console.log(`\nSin documentar: ${total} en ${files.length} archivos.`);
process.exitCode = total > 0 ? 1 : 0;
