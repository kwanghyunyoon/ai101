/*
 * Astro integration: after every build, walk the output tree and (over)write
 * `dist/sw.js` with an offline service worker that precaches every emitted page,
 * script, style, and asset for all live languages. See ADR 0001 (fully static)
 * and issue #7 (full offline precache).
 *
 * `public/sw.js` stays a no-op pass-through so `astro dev` still has something to
 * register; this hook replaces it in the build output.
 */

import type { AstroIntegration } from "astro";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPrecacheManifest, fnv1a, type BuildFile } from "./precache";
import { renderServiceWorker } from "./service-worker";
import { DEFAULT_LANGUAGE } from "../i18n/config";
import { localizePath } from "../i18n/routing";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const abs = join(dir, name);
    return statSync(abs).isDirectory() ? walk(abs) : [abs];
  });
}

export function precacheServiceWorker(): AstroIntegration {
  return {
    name: "ai101:precache-sw",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const files: BuildFile[] = walk(outDir).map((abs) => ({
          path: relative(outDir, abs).split(sep).join("/"),
          hash: fnv1a(readFileSync(abs, "latin1")),
        }));

        const manifest = buildPrecacheManifest(files);
        const sw = renderServiceWorker(manifest, {
          preferredShell: localizePath("/", DEFAULT_LANGUAGE),
        });
        writeFileSync(join(outDir, "sw.js"), sw, "utf8");
        logger.info(
          `service worker precaches ${manifest.urls.length} URLs (v${manifest.version})`,
        );
      },
    },
  };
}
