/*
 * The Lesson content pipeline's build-time seam.
 *
 * These are plain `zod` schemas with no `astro:content` import, so the schema
 * tests can exercise them directly. `src/content.config.ts` feeds
 * `lessonFrontmatterSchema` to Astro's content collection; `assertUniqueOrder`
 * is the one cross-Lesson rule Astro can't express per-entry, enforced at build
 * time by `src/lib/lessons.ts`.
 */
import { parse as parseYaml } from "yaml";
import { z } from "zod";

/** One answer a Learner can pick, with the explanation shown after they pick it. */
const knowledgeCheckOptionSchema = z
  .object({
    id: z.string().min(1),
    text: z.string().min(1),
    explanation: z.string().min(1, "every option needs its own explanation"),
  })
  .strict();

/** One Knowledge Check question: a prompt, its options, and which option is right. */
const knowledgeCheckQuestionSchema = z
  .object({
    prompt: z.string().min(1),
    options: z.array(knowledgeCheckOptionSchema).min(2),
    correctOptionId: z.string().min(1),
  })
  .strict()
  .refine((q) => q.options.some((o) => o.id === q.correctOptionId), {
    message: "correctOptionId must name one of this question's options",
    path: ["correctOptionId"],
  })
  .refine(
    (q) => new Set(q.options.map((o) => o.id)).size === q.options.length,
    { message: "option ids must be unique within a question", path: ["options"] },
  );

/** Lesson frontmatter: stable id, ordering, time estimate, title, Knowledge Check. */
export const lessonFrontmatterSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  minutes: z.number().int().positive(),
  title: z.string().min(1),
  knowledgeCheck: z.array(knowledgeCheckQuestionSchema).min(3).max(4),
}).strict();

export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>;

/**
 * Parse a raw frontmatter YAML string and validate it. Throws on unparseable
 * YAML or a shape the schema rejects — the two ways a Lesson file can be broken
 * before it ever reaches a route.
 */
export function parseLessonFrontmatter(yaml: string): LessonFrontmatter {
  return lessonFrontmatterSchema.parse(parseYaml(yaml));
}

/**
 * Reject two Lessons claiming the same `order`. Astro validates each Lesson in
 * isolation, so this cross-Lesson check runs at build time from the Lesson
 * loader; a clash throws and fails `astro build`.
 */
export function assertUniqueOrder(
  lessons: ReadonlyArray<{ id: string; data: { order: number } }>,
): void {
  const seen = new Map<number, string>();
  for (const lesson of lessons) {
    const clash = seen.get(lesson.data.order);
    if (clash !== undefined) {
      throw new Error(
        `Duplicate Lesson order ${lesson.data.order}: "${clash}" and "${lesson.id}"`,
      );
    }
    seen.set(lesson.data.order, lesson.id);
  }
}
