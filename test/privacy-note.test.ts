import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { LIVE_LANGUAGE_CODES } from "../src/i18n/config";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (p: string) => readFileSync(root + p, "utf8");

// The production build runs once in test/global-build.ts. Route-level coverage
// for the privacy note (issue #11).

describe("privacy note", () => {
  it("is generated under every live language prefix", () => {
    for (const code of LIVE_LANGUAGE_CODES) {
      expect(
        existsSync(`${root}dist/${code}/privacy/index.html`),
        `/${code}/privacy/ missing`,
      ).toBe(true);
    }
  });

  it("describes both stored values and states no account / no cookies", () => {
    const html = read("dist/en/privacy/index.html").toLowerCase();
    expect(html).toContain("local storage");
    expect(html).toMatch(/lessons you have finished/);
    expect(html).toContain("language choice");
    expect(html).toContain("no account");
    expect(html).toContain("no cookies");
    expect(html).toContain("cloudflare web analytics");
    expect(html).toContain("aggregate");
  });

  it("is linked from the footer on every page", () => {
    for (const p of [
      "dist/en/index.html",
      "dist/en/lessons/index.html",
      "dist/en/lessons/what-an-llm-actually-is/index.html",
      "dist/en/privacy/index.html",
    ]) {
      const html = read(p);
      const footer = html.slice(html.indexOf("<footer"));
      expect(footer).toContain('href="/en/privacy/"');
    }
  });
});
