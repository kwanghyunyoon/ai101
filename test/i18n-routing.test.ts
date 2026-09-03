import { describe, it, expect } from "vitest";
import {
  alternateLinks,
  lessonPath,
  localizePath,
  negotiateLanguage,
  resolvePreferredLanguage,
  splitLangFromPath,
} from "../src/i18n/routing";
import { LIVE_LANGUAGE_CODES } from "../src/i18n/config";

// The three configured languages; only `en` is live (config.ts). Tests that
// need more than one live language pass `available` explicitly — the day KO/ES
// go live, the behaviour is already proven.

describe("localizePath / splitLangFromPath", () => {
  it("prefixes a logical path with the language", () => {
    expect(localizePath("/", "en")).toBe("/en/");
    expect(localizePath("/lessons/", "ko")).toBe("/ko/lessons/");
    expect(localizePath("/lessons/what-an-llm-actually-is/", "es")).toBe(
      "/es/lessons/what-an-llm-actually-is/",
    );
  });

  it("normalises a logical path that is missing its slashes", () => {
    expect(localizePath("lessons/x", "en")).toBe("/en/lessons/x/");
  });

  it("builds a Lesson route from its entry id", () => {
    expect(lessonPath("what-an-llm-actually-is", "en")).toBe(
      "/en/lessons/what-an-llm-actually-is/",
    );
  });

  it("round-trips a prefixed path back to its language and logical path", () => {
    expect(splitLangFromPath("/ko/lessons/x/")).toEqual({
      lang: "ko",
      path: "/lessons/x/",
    });
    expect(splitLangFromPath("/en/")).toEqual({ lang: "en", path: "/" });
  });

  it("reports no language for an unprefixed path", () => {
    expect(splitLangFromPath("/")).toEqual({ lang: null, path: "/" });
    expect(splitLangFromPath("/lessons/")).toEqual({
      lang: null,
      path: "/lessons/",
    });
  });
});

describe("negotiateLanguage", () => {
  it("matches an Accept-Language header, honouring q-weights", () => {
    expect(
      negotiateLanguage("ko-KR,ko;q=0.9,en;q=0.8", {
        available: ["en", "ko", "es"],
      }),
    ).toBe("ko");
    expect(
      negotiateLanguage("fr;q=0.2,es;q=0.9", { available: ["en", "ko", "es"] }),
    ).toBe("es");
  });

  it("matches a region tag to its base language", () => {
    expect(
      negotiateLanguage(["es-419", "es-MX"], { available: ["en", "es"] }),
    ).toBe("es");
  });

  it("falls back when no preference is available", () => {
    expect(negotiateLanguage("fr,de;q=0.8", { available: ["en"] })).toBe("en");
    expect(negotiateLanguage("", { available: ["en"], fallback: "en" })).toBe(
      "en",
    );
    expect(negotiateLanguage(null, { available: ["en"] })).toBe("en");
  });

  it("skips a configured-but-not-live language and keeps looking", () => {
    // `ko` is configured but not in the live set — a ko-first visitor gets en.
    expect(negotiateLanguage("ko,en;q=0.9", { available: ["en"] })).toBe("en");
  });
});

describe("resolvePreferredLanguage", () => {
  it("prefers a stored language over Accept-Language", () => {
    expect(
      resolvePreferredLanguage({
        stored: "es",
        accept: "en-US,en;q=0.9",
        available: ["en", "es"],
      }),
    ).toBe("es");
  });

  it("ignores a stored language that is no longer live", () => {
    expect(
      resolvePreferredLanguage({
        stored: "ko",
        accept: "es,en;q=0.9",
        available: ["en", "es"],
      }),
    ).toBe("es");
  });

  it("negotiates then falls back when there is no stored language", () => {
    expect(
      resolvePreferredLanguage({
        stored: null,
        accept: "fr",
        available: ["en"],
        fallback: "en",
      }),
    ).toBe("en");
  });
});

describe("alternateLinks", () => {
  const site = "https://ai101.pages.dev";

  it("emits one absolute alternate per live language plus x-default", () => {
    const links = alternateLinks("/lessons/x/", site);
    const hreflangs = links.map((l) => l.hreflang);

    for (const code of LIVE_LANGUAGE_CODES) {
      expect(hreflangs).toContain(code === "es" ? "es-419" : code);
    }
    expect(hreflangs).toContain("x-default");
    expect(links.every((l) => l.href.startsWith("https://ai101.pages.dev/"))).toBe(
      true,
    );
  });

  it("does not emit an alternate for a not-live language", () => {
    const links = alternateLinks("/", site);
    expect(links.some((l) => l.href.includes("/ko/"))).toBe(false);
    expect(links.some((l) => l.href.includes("/es/"))).toBe(false);
  });
});
