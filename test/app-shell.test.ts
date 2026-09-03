import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, it, expect, beforeAll } from "vitest";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (p: string) => readFileSync(root + p, "utf8");

// The production build runs once in test/global-build.ts. These assert on the
// rendered output a Learner / maintainer sees — not on component source.

describe("theme tokens (acceptance: no theme-only colour definitions)", () => {
  const css = read("src/styles/global.css");

  const propsIn = (block: string) =>
    new Set([...block.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));

  const sliceRootBlock = (from: number) =>
    css.slice(css.indexOf(":root {", from), css.indexOf("}", css.indexOf(":root {", from)));

  it("defines every dark-mode token on bare :root too", () => {
    const rootProps = propsIn(sliceRootBlock(0));
    const darkProps = propsIn(
      sliceRootBlock(css.indexOf("@media (prefers-color-scheme: dark)")),
    );
    for (const prop of darkProps) {
      expect(rootProps.has(prop), `${prop} missing from :root`).toBe(true);
    }
  });

  it("neutralises non-essential motion under prefers-reduced-motion", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(css).toMatch(/transition-duration:\s*0m?s\s*!important/);
  });
});

describe("PWA manifest", () => {
  const manifest = JSON.parse(read("public/manifest.webmanifest"));

  it("has name and theme colour", () => {
    expect(manifest.name).toBe("AI 101");
    expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("points at an SVG icon that exists and shows the wordmark", () => {
    const icon = manifest.icons.find((i: any) => i.type === "image/svg+xml");
    expect(icon).toBeDefined();
    expect(existsSync(root + "public" + icon.src)).toBe(true);
    expect(read("public" + icon.src)).toContain("AI");
  });
});

describe("rendered app shell", () => {
  let html: string;
  beforeAll(() => {
    // `/` is now a language-routing shell; the app chrome lives under a prefix.
    html = read("dist/en/index.html");
  });

  it("renders header / main / footer landmarks with a skip link", () => {
    expect(html).toMatch(/<header[\s>]/);
    expect(html).toMatch(/<main[\s>]/);
    expect(html).toMatch(/<footer[\s>]/);
    expect(html).toContain('href="#main"');
  });

  it("links the manifest and theme colour", () => {
    expect(html).toContain('rel="manifest"');
    expect(html).toContain('name="theme-color"');
  });

  it("omits the analytics beacon when no token is configured", () => {
    expect(html).not.toContain("cloudflareinsights.com");
  });

  it("ships the service worker file", () => {
    expect(existsSync(root + "dist/sw.js")).toBe(true);
  });
});

describe("offline precache service worker (built)", () => {
  const sw = read("dist/sw.js");

  it("precaches the app shell, every Lesson, and the quiz-bearing HTML", () => {
    expect(sw).toContain('"/en/"');
    expect(sw).toContain('"/en/privacy/"');
    expect(sw).toContain('"/en/done/"');
    expect(sw).toContain('"/en/lessons/what-an-llm-actually-is/"');
    expect(sw).toContain('"/manifest.webmanifest"');
  });

  it("carries a version and drops stale caches on a new deploy", () => {
    expect(sw).toMatch(/const VERSION = "[0-9a-f]{8}"/);
    expect(sw).toContain("caches.delete");
  });

  it("does not try to precache itself", () => {
    expect(sw).not.toContain('"/sw.js"');
  });
});
