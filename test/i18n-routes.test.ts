import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (p: string) => readFileSync(root + p, "utf8");

// Route-level coverage for i18n (issue #4). The production build runs once in
// test/global-build.ts; this asserts on the generated file tree and rendered
// HTML. The routing helpers' own logic (negotiation, stored-preference
// override, switcher targeting) is unit-tested in i18n-routing.test.ts and
// language-switcher.test.tsx.

describe("prefix resolution", () => {
  it("generates the English home and each Lesson under /en/", () => {
    expect(existsSync(root + "dist/en/index.html")).toBe(true);
    expect(
      existsSync(root + "dist/en/lessons/what-an-llm-actually-is/index.html"),
    ).toBe(true);
  });

  it("prefixes in-app links with the current language", () => {
    const html = read("dist/en/lessons/index.html");
    expect(html).toContain('href="/en/lessons/what-an-llm-actually-is/"');
    expect(read("dist/en/index.html")).toContain('href="/en/"'); // wordmark
  });
});

describe("a configured-but-not-live language", () => {
  it("has no routes and did not break the build", () => {
    // The shared build succeeded; ko/es are configured but not live.
    expect(existsSync(root + "dist/ko")).toBe(false);
    expect(existsSync(root + "dist/es")).toBe(false);
  });
});

describe("/ language router", () => {
  const html = () => read("dist/index.html");

  it("ships a client detection script and a <noscript> fallback to the default", () => {
    expect(html()).toMatch(/<script type="module"[^>]*src="[^"]+"><\/script>/);
    expect(html()).toContain('<meta http-equiv="refresh" content="0; url=/en/">');
  });

  it("resolves the stored preference / Accept-Language in the browser bundle", () => {
    const src = html().match(/src="(\/_astro\/[^"]+\.js)"/)?.[1];
    expect(src).toBeTruthy();
    const bundle = read("dist" + src);
    expect(bundle).toContain("navigator.languages");
    expect(bundle).toContain("location.replace");
    // the stored-preference read is split into its own chunk
    const prefChunk = bundle.match(/from"(\.\/preference\.[^"]+\.js)"/)?.[1];
    expect(prefChunk).toBeTruthy();
    expect(read("dist/_astro/" + prefChunk!.replace("./", ""))).toContain(
      "localStorage",
    );
  });

  it("emits hreflang alternates for live languages only, plus x-default", () => {
    expect(html()).toContain(
      '<link rel="alternate" hreflang="en" href="https://ai101-dwa.pages.dev/en/">',
    );
    expect(html()).toContain('hreflang="x-default"');
    expect(html()).not.toContain("/ko/");
    expect(html()).not.toContain("/es/");
  });
});

describe("app chrome", () => {
  it("shows the language switcher on every page", () => {
    for (const p of [
      "dist/en/index.html",
      "dist/en/lessons/index.html",
      "dist/en/lessons/what-an-llm-actually-is/index.html",
    ]) {
      expect(read(p)).toContain('class="lang-switcher"');
    }
  });

  it("sets <html lang> / dir and per-page hreflang alternates", () => {
    const html = read("dist/en/lessons/what-an-llm-actually-is/index.html");
    expect(html).toContain('<html lang="en" dir="ltr">');
    expect(html).toContain(
      'hreflang="en" href="https://ai101-dwa.pages.dev/en/lessons/what-an-llm-actually-is/"',
    );
    expect(html).toContain('hreflang="x-default"');
  });
});
