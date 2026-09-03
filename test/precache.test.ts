import { describe, it, expect } from "vitest";
import { buildPrecacheManifest, fnv1a, type BuildFile } from "../src/lib/precache";
import { renderServiceWorker } from "../src/lib/service-worker";

const files: BuildFile[] = [
  { path: "index.html", hash: "aaaa" },
  { path: "en/index.html", hash: "bbbb" },
  { path: "en/lessons/what-an-llm-actually-is/index.html", hash: "cccc" },
  { path: "en/privacy/index.html", hash: "dddd" },
  { path: "_astro/client.abc.js", hash: "eeee" },
  { path: "manifest.webmanifest", hash: "ffff" },
  { path: "sw.js", hash: "9999" },
];

describe("buildPrecacheManifest", () => {
  it("turns index.html files into directory URLs and sorts them", () => {
    const { urls } = buildPrecacheManifest(files);
    expect(urls).toEqual([
      "/",
      "/_astro/client.abc.js",
      "/en/",
      "/en/lessons/what-an-llm-actually-is/",
      "/en/privacy/",
      "/manifest.webmanifest",
    ]);
  });

  it("never precaches sw.js itself", () => {
    const { urls } = buildPrecacheManifest(files);
    expect(urls).not.toContain("/sw.js");
  });

  it("keeps the version stable when nothing changes", () => {
    expect(buildPrecacheManifest(files).version).toBe(
      buildPrecacheManifest([...files]).version,
    );
  });

  it("changes the version when a precached file's contents change", () => {
    const before = buildPrecacheManifest(files).version;
    const after = buildPrecacheManifest(
      files.map((f) =>
        f.path === "en/lessons/what-an-llm-actually-is/index.html"
          ? { ...f, hash: "changed" }
          : f,
      ),
    ).version;
    expect(after).not.toBe(before);
  });

  it("changes the version when a new page is added", () => {
    const before = buildPrecacheManifest(files).version;
    const after = buildPrecacheManifest([
      ...files,
      { path: "en/lessons/new-one/index.html", hash: "1234" },
    ]).version;
    expect(after).not.toBe(before);
  });

  it("does not react to sw.js changing", () => {
    const a = buildPrecacheManifest(files).version;
    const b = buildPrecacheManifest(
      files.map((f) => (f.path === "sw.js" ? { ...f, hash: "0000" } : f)),
    ).version;
    expect(a).toBe(b);
  });
});

describe("fnv1a", () => {
  it("is stable and differs on different input", () => {
    expect(fnv1a("hello")).toBe(fnv1a("hello"));
    expect(fnv1a("hello")).not.toBe(fnv1a("world"));
  });
});

describe("renderServiceWorker", () => {
  const sw = renderServiceWorker(buildPrecacheManifest(files));

  it("embeds the version and every precached URL", () => {
    expect(sw).toContain(`"${buildPrecacheManifest(files).version}"`);
    expect(sw).toContain('"/en/lessons/what-an-llm-actually-is/"');
    expect(sw).toContain('"/manifest.webmanifest"');
  });

  it("wires install / activate / fetch and drops stale caches", () => {
    expect(sw).toContain('addEventListener("install"');
    expect(sw).toContain('addEventListener("activate"');
    expect(sw).toContain('addEventListener("fetch"');
    expect(sw).toContain("cache.addAll(PRECACHE_URLS)");
    expect(sw).toContain("caches.delete");
  });

  it("falls back to the language shell for offline navigations", () => {
    expect(sw).toContain('const SHELL_URL = "/en/"');
  });

  it("uses the caller's preferred shell when it is precached", () => {
    const out = renderServiceWorker(buildPrecacheManifest(files), {
      preferredShell: "/en/",
    });
    expect(out).toContain('const SHELL_URL = "/en/"');
  });

  it("ignores a preferred shell that was not precached", () => {
    const out = renderServiceWorker(buildPrecacheManifest(files), {
      preferredShell: "/fr/",
    });
    expect(out).toContain('const SHELL_URL = "/en/"');
  });

  it("is syntactically valid JavaScript", () => {
    expect(() => new Function(sw)).not.toThrow();
  });
});
