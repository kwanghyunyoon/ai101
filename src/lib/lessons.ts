import { getCollection, type CollectionEntry } from "astro:content";
import { assertUniqueOrder } from "../content/schema";
import { DEFAULT_LANGUAGE } from "../i18n/config";
import { lessonPath } from "../i18n/routing";
import { splitEntryId } from "./lesson-id";

export { splitEntryId };

/** A raw content-collection entry. Its `id` is `<lang>/<slug>`, e.g. `en/the-five-tools`. */
export type LessonEntry = CollectionEntry<"lessons">;

/**
 * One Lesson resolved for a language: the entry to render plus a
 * language-independent `slug` (the routing and Progress key, stable across
 * translations). When a translation for a slug does not exist yet, the entry is
 * the source-language one, so a half-translated edition still renders a
 * complete Course.
 */
export interface Lesson {
  slug: string;
  entry: LessonEntry;
  data: LessonEntry["data"];
}

/**
 * Every Lesson for `lang`, in teaching order, with the source language filling
 * any gap. Called from the Lesson routes, so a duplicate `order` within a
 * language throws here and fails `astro build`.
 */
export async function getLessons(
  lang: string = DEFAULT_LANGUAGE,
): Promise<Lesson[]> {
  const variantsBySlug = new Map<string, Map<string, LessonEntry>>();
  for (const entry of await getCollection("lessons")) {
    const { lang: entryLang, slug } = splitEntryId(entry.id);
    if (!variantsBySlug.has(slug)) variantsBySlug.set(slug, new Map());
    variantsBySlug.get(slug)!.set(entryLang, entry);
  }

  const lessons: Lesson[] = [];
  for (const [slug, variants] of variantsBySlug) {
    const entry = variants.get(lang) ?? variants.get(DEFAULT_LANGUAGE);
    if (!entry) continue;
    lessons.push({ slug, entry, data: entry.data });
  }

  lessons.sort((a, b) => a.data.order - b.data.order);
  assertUniqueOrder(lessons.map((l) => ({ id: l.slug, data: l.data })));
  return lessons;
}

/**
 * The `{ lessonIds, hrefs }` pair every Progress-aware route needs: the ordered
 * slugs and a slug → localized-route map for `lang`.
 */
export function lessonRoutes(
  lessons: readonly Lesson[],
  lang: string,
): { lessonIds: string[]; hrefs: Record<string, string> } {
  return {
    lessonIds: lessons.map((l) => l.slug),
    hrefs: Object.fromEntries(
      lessons.map((l) => [l.slug, lessonPath(l.slug, lang)]),
    ),
  };
}
