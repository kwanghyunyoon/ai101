import { DEFAULT_LANGUAGE } from "../i18n/config";

/*
 * Lesson content entries are MDX under `src/content/lessons/<lang>/<slug>.mdx`,
 * so Astro's glob loader gives them an `id` of `<lang>/<slug>`. This splits that
 * back apart. Kept free of `astro:*` imports so the content tests use it directly.
 */

/** `en/the-five-tools` → `{ lang: "en", slug: "the-five-tools" }`. */
export function splitEntryId(id: string): { lang: string; slug: string } {
  const slash = id.indexOf("/");
  return slash === -1
    ? { lang: DEFAULT_LANGUAGE, slug: id }
    : { lang: id.slice(0, slash), slug: id.slice(slash + 1) };
}
