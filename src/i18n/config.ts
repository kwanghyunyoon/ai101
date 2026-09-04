/*
 * The trilingual language registry.
 *
 * `LANGUAGES` is every language the Course is *configured* for. `LIVE_LANGUAGE_CODES`
 * is the subset that is actually *reachable* — a configured-but-not-live language
 * has no routes generated for it and does not break the build (spec: KO and ES
 * land before public launch). Flip a code into `LIVE_LANGUAGE_CODES` once its
 * translations exist; nothing else needs to change.
 *
 * Pure data with no `astro:*` imports, so the routing helpers and their tests can
 * use it directly.
 */

export interface Language {
  /** URL prefix and content key, e.g. `en` in `/en/lessons/…`. */
  code: string;
  /** Endonym shown in the language switcher, e.g. `한국어`. */
  label: string;
  /** Value for the page's `<html lang>` and `hreflang` alternates. */
  htmlLang: string;
  /** Writing direction for `<html dir>`. */
  dir: "ltr" | "rtl";
}

export const LANGUAGES: readonly Language[] = [
  { code: "en", label: "English", htmlLang: "en", dir: "ltr" },
  { code: "ko", label: "한국어", htmlLang: "ko", dir: "ltr" },
  { code: "es", label: "Español", htmlLang: "es-419", dir: "ltr" },
];

/** The language `/` falls back to when nothing else matches. Always live. */
export const DEFAULT_LANGUAGE = "en";

/*
 * The languages that actually route.
 *
 * `ko` (issue #13) and `es` (issue #14) each have a full AI-drafted translation
 * (all six Lessons + every UI string) but stay out of this list until a named
 * native reviewer has corrected them. Adding a code here is the only change
 * needed to make `/<code>/` routable, add its `hreflang`, and show it in the
 * switcher.
 */
export const LIVE_LANGUAGE_CODES: readonly string[] = ["en"];

export function getLanguage(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

export function isLiveLanguage(code: string): boolean {
  return LIVE_LANGUAGE_CODES.includes(code);
}

/** The live languages, in `LANGUAGES` order. */
export function liveLanguages(): Language[] {
  return LANGUAGES.filter((l) => isLiveLanguage(l.code));
}
