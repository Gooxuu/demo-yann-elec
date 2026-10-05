import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { DELIVERY_MARKER, MARKER, findMarkers, scan, summarize } from "./check-demo.mjs";

let dir = "";

afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = "";
});

describe("check-demo", () => {
  it("repère chaque ligne marquée, avec son numéro", () => {
    const content = ["const a = 1;", `// ${MARKER} : téléphone`, "const b = 2;", `/* ${MARKER} */`].join("\n");
    expect(findMarkers(content, "infos.ts")).toEqual([
      { file: "infos.ts", line: 2, text: `// ${MARKER} : téléphone`, kind: "demo" },
      { file: "infos.ts", line: 4, text: `/* ${MARKER} */`, kind: "demo" },
    ]);
  });

  it("gère les fins de ligne Windows", () => {
    expect(findMarkers(`a\r\n// ${MARKER}\r\n`, "x.ts")).toEqual([
      { file: "x.ts", line: 2, text: `// ${MARKER}`, kind: "demo" },
    ]);
  });

  it("distingue les rappels pour la livraison", () => {
    expect(findMarkers(`// ${DELIVERY_MARKER} : domaine`, "infos.ts")).toEqual([
      { file: "infos.ts", line: 1, text: `// ${DELIVERY_MARKER} : domaine`, kind: "livraison" },
    ]);
  });

  it("repère une valeur d'exemple restée en place même sans marqueur", () => {
    const content = ['export const PHONE_DISPLAY = "01 23 45 67 89";', 'export const EMAIL = "contact@durand.fr";'].join("\n");
    expect(findMarkers(content, "infos.ts")).toEqual([
      { file: "infos.ts", line: 1, text: 'export const PHONE_DISPLAY = "01 23 45 67 89";', kind: "exemple" },
    ]);
  });

  it("seuls les rappels de livraison laissent passer la démo", () => {
    const delivery = { file: "a.ts", line: 1, text: "x", kind: "livraison" } as const;
    const demo = { file: "b.ts", line: 2, text: "y", kind: "demo" } as const;
    const sample = { file: "c.ts", line: 3, text: "z", kind: "exemple" } as const;
    expect(summarize([delivery])).toEqual({ blocking: [], delivery: [delivery], exitCode: 0 });
    expect(summarize([demo, delivery, sample])).toEqual({ blocking: [demo, sample], delivery: [delivery], exitCode: 1 });
  });

  it("parcourt les sources .ts, .tsx, .css et .svg, sans les tests ni les autres fichiers", () => {
    dir = mkdtempSync(path.join(tmpdir(), "check-demo-"));
    mkdirSync(path.join(dir, "app", "contact"), { recursive: true });
    writeFileSync(path.join(dir, "app", "contact", "page.tsx"), `// ${MARKER}`);
    writeFileSync(path.join(dir, "app", "globals.css"), `/* ${MARKER} */`);
    writeFileSync(path.join(dir, "app", "icon.svg"), `<!-- ${MARKER} -->`);
    writeFileSync(path.join(dir, "app", "page.test.tsx"), `// ${MARKER}`);
    writeFileSync(path.join(dir, "notes.md"), MARKER);

    const files = scan(dir).map((found) => path.relative(dir, path.resolve(found.file)));
    expect(files).toEqual([
      path.join("app", "contact", "page.tsx"),
      path.join("app", "globals.css"),
      path.join("app", "icon.svg"),
    ]);
  });

  it("service désactivé (actif: false) : sa page et ses photos propres ne bloquent pas la démo", () => {
    dir = mkdtempSync(path.join(tmpdir(), "check-demo-"));
    for (const sub of ["lib", path.join("app", "garde"), path.join("app", "retire")]) {
      mkdirSync(path.join(dir, sub), { recursive: true });
    }
    writeFileSync(
      path.join(dir, "lib", "services.ts"),
      [
        "export const SERVICES = [",
        '  { slug: "garde", title: "Gardé", photo: "carteGarde", actif: true },',
        '  { slug: "retire", title: "Retiré", photo: "carteRetire", actif: false },',
        "];",
      ].join("\n"),
    );
    writeFileSync(
      path.join(dir, "app", "garde", "page.tsx"),
      `// ${MARKER} : contenu\nconst CONTENT = { before: STOCK_PHOTOS.gardeAvant, after: STOCK_PHOTOS.commun };`,
    );
    writeFileSync(
      path.join(dir, "app", "retire", "page.tsx"),
      `// ${MARKER} : contenu\nconst CONTENT = { before: STOCK_PHOTOS.retireAvant, after: STOCK_PHOTOS.commun };`,
    );
    writeFileSync(
      path.join(dir, "lib", "stockPhotos.ts"),
      [
        "export const STOCK_PHOTOS = {",
        '  carteGarde: { src: "/images/stock/exemple-carte-garde.svg", alt: "a", credit: "c" },',
        '  carteRetire: { src: "/images/stock/exemple-carte-retire.svg", alt: "a", credit: "c" },',
        "  gardeAvant: {",
        '    src: "/images/stock/exemple-garde-avant.svg",',
        "  },",
        "  retireAvant: {",
        '    src: "/images/stock/exemple-retire-avant.svg",',
        "  },",
        '  commun: { src: "/images/stock/exemple-commun.svg", alt: "a", credit: "c" },',
        "};",
      ].join("\n"),
    );

    const found = scan(dir).map((item) => `${path.relative(dir, path.resolve(item.file))}:${item.line}`);
    expect(found).toEqual([
      `${path.join("app", "garde", "page.tsx")}:1`,
      `${path.join("lib", "stockPhotos.ts")}:2`,
      `${path.join("lib", "stockPhotos.ts")}:5`,
      `${path.join("lib", "stockPhotos.ts")}:10`,
    ]);
  });

  it("ignore les utilitaires de test (src/test/) : ils ne font pas partie du site", () => {
    dir = mkdtempSync(path.join(tmpdir(), "check-demo-"));
    mkdirSync(path.join(dir, "test"), { recursive: true });
    mkdirSync(path.join(dir, "lib"), { recursive: true });
    writeFileSync(path.join(dir, "test", "importFresh.ts"), '/** "Artisan Exemple" → string */');
    writeFileSync(path.join(dir, "lib", "infos.ts"), 'export const BRAND = "Artisan Exemple";');

    const files = scan(dir).map((found) => path.relative(dir, path.resolve(found.file)));
    expect(files).toEqual([path.join("lib", "infos.ts")]);
  });
});
