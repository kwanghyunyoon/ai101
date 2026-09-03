import { getCollection, type CollectionEntry } from "astro:content";
import { assertUniqueOrder } from "../content/schema";

export type Lesson = CollectionEntry<"lessons">;

/**
 * Every Lesson, in teaching order. Called from the Lesson routes, so a
 * duplicate `order` throws here and fails `astro build`.
 */
export async function getLessons(): Promise<Lesson[]> {
  const lessons = (await getCollection("lessons")).sort(
    (a, b) => a.data.order - b.data.order,
  );
  assertUniqueOrder(lessons);
  return lessons;
}
