/*
 * Pure path/preference helpers for trilingual routing. No `astro:*`, no DOM —
 * these run in Astro frontmatter, in the bundled browser script on `/`, and in
 * the language switcher island, and are exercised directly by the route tests.
 *
 * A "logical path" is a page's path *without* its language prefix and always
 * starts and ends with `/`: `/`, `/lessons/`, `/lessons/what-an-llm-actually-is/`.
 * `localizePath` maps it onto a language; `splitLangFromPath` is the inverse.
 */

import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  LIVE_LANGUAGE_CODES,
  getLanguage,
} from "./config";

const KNOWN_CODES = LANGUAGES.map((l) => l.code);

/** `/ko/lessons/x/` → `{ lang: "ko", path: "/lessons/x/" }`; `/` → `{ lang: null, path: "/" }`. */
export function splitLangFromPath(pathname: string): {
  lang: string | null;
  path: string;
} {
  const match = /^\/([^/]+)(\/.*)?$/.exec(pathname);
  if (match && KNOWN_CODES.includes(match[1])) {
    return { lang: match[1], path: normalizeLogicalPath(match[2] ?? "/") };
  }
  return { lang: null, path: normalizeLogicalPath(pathname) };
}

/** `("/lessons/x/", "ko")` → `/ko/lessons/x/`. */
export function localizePath(logicalPath: string, lang: string): string {
  const rest = normalizeLogicalPath(logicalPath);
  return rest === "/" ? `/${lang}/` : `/${lang}${rest}`;
}

/** A Lesson's localized route from its entry id: `("what-…", "en")` → `/en/lessons/what-…/`. */
export function lessonPath(lessonId: string, lang: string): string {
  return localizePath(`/lessons/${lessonId}/`, lang);
}

function normalizeLogicalPath(path: string): string {
  let p = path || "/";
  if (!p.startsWith("/")) p = `/${p}`;
  if (!p.endsWith("/")) p = `${p}/`;
  return p.replace(/\/{2,}/g, "/");
}

/**
 * Pick the best available language for a set of ordered preferences — an
 * `Accept-Language` header string (`"ko-KR,ko;q=0.9,en;q=0.8"`) or a
 * `navigator.languages`-style array. A region tag matches its base language
 * (`es-419` → `es`). Falls back to `fallback` when nothing matches.
 */
export function negotiateLanguage(
  preferences: string | readonly string[] | null | undefined,
  opts: { available?: readonly string[]; fallback?: string } = {},
): string {
  const available = opts.available ?? LIVE_LANGUAGE_CODES;
  const fallback = opts.fallback ?? DEFAULT_LANGUAGE;

  for (const tag of parsePreferences(preferences)) {
    const base = tag.toLowerCase().split("-")[0];
    const hit = available.find((code) => code.toLowerCase() === base);
    if (hit) return hit;
  }
  return fallback;
}

function parsePreferences(
  preferences: string | readonly string[] | null | undefined,
): string[] {
  const list = Array.isArray(preferences)
    ? [...preferences]
    : typeof preferences === "string"
      ? preferences.split(",")
      : [];
  return list
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(";");
      const q = params
        .map((p: string) => /^\s*q=([0-9.]+)\s*$/.exec(p))
        .find(Boolean);
      return { tag: tag.trim(), q: q ? Number(q[1]) : 1 };
    })
    .filter((e) => e.tag && e.tag !== "*" && e.q > 0)
    .sort((a, b) => b.q - a.q)
    .map((e) => e.tag);
}

/**
 * Which language a visitor to `/` should land on: a stored preference wins when
 * it is still a live language, otherwise negotiate from `Accept-Language`,
 * otherwise `fallback`.
 */
export function resolvePreferredLanguage(opts: {
  stored?: string | null;
  accept?: string | readonly string[] | null;
  available?: readonly string[];
  fallback?: string;
}): string {
  const available = opts.available ?? LIVE_LANGUAGE_CODES;
  const fallback = opts.fallback ?? DEFAULT_LANGUAGE;

  if (opts.stored && available.includes(opts.stored)) return opts.stored;
  return negotiateLanguage(opts.accept, { available, fallback });
}

/**
 * `hreflang` alternates for a logical path: one absolute URL per live language
 * plus `x-default` pointing at the default language. `site` is `Astro.site`.
 */
export function alternateLinks(
  logicalPath: string,
  site: string | URL,
): { hreflang: string; href: string }[] {
  const origin = new URL(site).origin;
  const links = LIVE_LANGUAGE_CODES.map((code) => ({
    hreflang: getLanguage(code)?.htmlLang ?? code,
    href: origin + localizePath(logicalPath, code),
  }));
  links.push({
    hreflang: "x-default",
    href: origin + localizePath(logicalPath, DEFAULT_LANGUAGE),
  });
  return links;
}
