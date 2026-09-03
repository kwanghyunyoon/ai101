import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { lessonFrontmatterSchema } from "./content/schema";

// Lessons are MDX files in src/content/lessons/. The filename (without .mdx) is
// the entry slug and the Lesson's route under /lessons/. Frontmatter is
// validated by lessonFrontmatterSchema, so `astro build` and CI fail on a
// malformed Lesson or Knowledge Check.
const lessons = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/lessons" }),
  schema: lessonFrontmatterSchema,
});

export const collections = { lessons };
