/**
 * Liste ce qui reste à personnaliser dans cette démo (`npm run check:demo`) :
 * - les lignes de src/ marquées pour la démo, et les valeurs d'exemple du template restées en place
 *   (même si leur marqueur a été retiré) : bloquant, code de sortie 1, la CI refuse de déployer ;
 * - les rappels marqués pour la livraison (domaine, vraies photos, fin du mode démo) : listés, non bloquants.
 * Un service désactivé (`actif: false`) n'est pas publié : sa page et les photos que lui seul utilise sont ignorées.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const MARKER = "À REMPLACER";
export const DELIVERY_MARKER = "À LA LIVRAISON";

/** Valeurs d'exemple du template : leur présence trahit une personnalisation oubliée. */
export const SAMPLE_VALUES = [
  "Artisan Exemple",
  "01 23 45 67 89",
  "+33123456789",
  "contact@example.com",
  "rue de l'Exemple",
  "Texte exact d'un vrai avis client",
  "/images/stock/exemple-",
];

const EXTENSIONS = new Set([".ts", ".tsx", ".css", ".svg"]);

/** @typedef {{ file: string, line: number, text: string, kind: "demo" | "livraison" | "exemple" }} Finding */

/**
 * @param {string} text
 * @returns {Finding["kind"] | null}
 */
function kindOf(text) {
  if (text.includes(MARKER)) return "demo";
  if (text.includes(DELIVERY_MARKER)) return "livraison";
  if (SAMPLE_VALUES.some((value) => text.includes(value))) return "exemple";
  return null;
}

/**
 * @param {string} content
 * @param {string} file
 * @returns {Finding[]}
 */
export function findMarkers(content, file) {
  return content.split(/\r?\n/).flatMap((text, index) => {
    const kind = kindOf(text);
    return kind ? [{ file, line: index + 1, text: text.trim(), kind }] : [];
  });
}

/**
 * Entrées du catalogue (lib/services.ts) : slug, clé de la photo de carte, actif ou non.
 * @param {string} source
 * @returns {{ slug: string, photo: string | undefined, actif: boolean }[]}
 */
function serviceEntries(source) {
  return [...source.matchAll(/slug:\s*"([^"]+)"([\s\S]*?)(?=slug:\s*"|$)/g)].map(([, slug, rest]) => ({
    slug,
    photo: rest.match(/photo:\s*"(\w+)"/)?.[1],
    actif: !/actif:\s*false/.test(rest),
  }));
}

/**
 * Clés de STOCK_PHOTOS citées dans un fichier (`STOCK_PHOTOS.cle` ou `STOCK_PHOTOS["cle"]`).
 * @param {string} content
 * @returns {string[]}
 */
const photoKeys = (content) =>
  [...content.matchAll(/STOCK_PHOTOS(?:\.(\w+)|\[\s*"(\w+)"\s*\])/g)].map((match) => match[1] ?? match[2]);

/**
 * Pour chaque ligne de lib/stockPhotos.ts, la clé de l'entrée de STOCK_PHOTOS qui la contient.
 * @param {string} content
 * @returns {(string | undefined)[]}
 */
function entryKeyByLine(content) {
  /** @type {string | undefined} */
  let current;
  return content.split(/\r?\n/).map((line) => {
    const entry = line.match(/^ {2}(\w+):\s*\{/);
    if (entry) current = entry[1];
    else if (/^\S/.test(line)) current = undefined;
    return current;
  });
}

/**
 * Sources du site seulement : ni les tests, ni les utilitaires de test (`test/`), qui citent les valeurs
 * d'exemple sans jamais être publiés, ni la page d'un service désactivé et les photos que lui seul utilise.
 * @param {string} dir
 * @returns {Finding[]}
 */
export function scan(dir) {
  const files = readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && EXTENSIONS.has(path.extname(entry.name)))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .filter((file) => !/\.test\.tsx?$/.test(file))
    .filter((file) => path.relative(dir, file).split(path.sep)[0] !== "test")
    .sort();
  const read = (/** @type {string} */ file) => readFileSync(file, "utf8");

  const servicesFile = path.join(dir, "lib", "services.ts");
  const photosFile = path.join(dir, "lib", "stockPhotos.ts");
  const entries = existsSync(servicesFile) ? serviceEntries(read(servicesFile)) : [];
  const offDirs = entries.filter((entry) => !entry.actif).map((entry) => path.join(dir, "app", entry.slug) + path.sep);
  const isOff = (/** @type {string} */ file) => offDirs.some((offDir) => file.startsWith(offDir));
  const published = files.filter((file) => !isOff(file));

  /** Photos citées par un ensemble de fichiers, plus les photos de carte des services donnés. */
  const keysUsedBy = (/** @type {string[]} */ list, /** @type {boolean} */ actif) =>
    new Set([
      ...list.filter((file) => file !== photosFile).flatMap((file) => photoKeys(read(file))),
      ...entries.filter((entry) => entry.actif === actif).map((entry) => entry.photo),
    ]);
  const usedByPublished = keysUsedBy(published, true);
  const unpublishedKeys = new Set(
    [...keysUsedBy(files.filter(isOff), false)].filter((key) => key && !usedByPublished.has(key)),
  );

  return published.flatMap((file) => {
    const content = read(file);
    const found = findMarkers(content, path.relative(process.cwd(), file));
    if (file !== photosFile || unpublishedKeys.size === 0) return found;
    const keys = entryKeyByLine(content);
    return found.filter((item) => !unpublishedKeys.has(keys[item.line - 1]));
  });
}

/**
 * @param {Finding[]} found
 * @returns {{ blocking: Finding[], delivery: Finding[], exitCode: number }}
 */
export function summarize(found) {
  const blocking = found.filter((item) => item.kind !== "livraison");
  const delivery = found.filter((item) => item.kind === "livraison");
  return { blocking, delivery, exitCode: blocking.length > 0 ? 1 : 0 };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const { blocking, delivery, exitCode } = summarize(scan(path.join(process.cwd(), "src")));
  if (blocking.length === 0) {
    console.log("Aucun contenu d'exemple restant : la démo est prête.");
  } else {
    console.log(`${blocking.length} élément(s) à personnaliser avant de montrer la démo :\n`);
    for (const { file, line, text } of blocking) console.log(`  ${file}:${line}  ${text}`);
  }
  if (delivery.length > 0) {
    console.log(`\n${delivery.length} rappel(s) pour la livraison (non bloquants) :\n`);
    for (const { file, line, text } of delivery) console.log(`  ${file}:${line}  ${text}`);
  }
  process.exitCode = exitCode;
}
