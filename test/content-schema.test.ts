import { describe, it, expect } from "vitest";
import { stringify as toYaml } from "yaml";
import {
  assertUniqueOrder,
  lessonFrontmatterSchema,
  parseLessonFrontmatter,
} from "../src/content/schema";

// A well-formed Lesson frontmatter. Each invalid case below is this object with
// one thing broken — the shapes a malformed Lesson can take before it reaches a
// route. `astro build` (and CI) run the same schema.
const validFrontmatter = {
  id: "what-an-llm-actually-is",
  order: 1,
  minutes: 6,
  title: "What an LLM actually is",
  knowledgeCheck: [
    {
      prompt: "What is it doing?",
      correctOptionId: "a",
      options: [
        { id: "a", text: "Predicting text", explanation: "Yes — next-chunk prediction." },
        { id: "b", text: "Looking it up", explanation: "No — there is no fact table." },
      ],
    },
    {
      prompt: "Where do the patterns come from?",
      correctOptionId: "a",
      options: [
        { id: "a", text: "Human writing", explanation: "Yes." },
        { id: "b", text: "Hand-typed rules", explanation: "No." },
      ],
    },
    {
      prompt: "Can it write something new?",
      correctOptionId: "a",
      options: [
        { id: "a", text: "Yes, patterns combine", explanation: "Yes." },
        { id: "b", text: "No, it pastes sentences", explanation: "No." },
      ],
    },
  ],
};

describe("lessonFrontmatterSchema", () => {
  it("accepts a well-formed Lesson", () => {
    expect(lessonFrontmatterSchema.safeParse(validFrontmatter).success).toBe(true);
  });

  it("rejects a Knowledge Check question with no matching correct answer", () => {
    const broken = structuredClone(validFrontmatter);
    broken.knowledgeCheck[0].correctOptionId = "does-not-exist";
    expect(lessonFrontmatterSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects an option that is missing its explanation", () => {
    const broken = structuredClone(validFrontmatter);
    // @ts-expect-error deliberately dropping a required field
    delete broken.knowledgeCheck[0].options[1].explanation;
    expect(lessonFrontmatterSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects an option with a blank explanation", () => {
    const broken = structuredClone(validFrontmatter);
    broken.knowledgeCheck[0].options[1].explanation = "";
    expect(lessonFrontmatterSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects a typo'd / unknown frontmatter key", () => {
    const broken = { ...structuredClone(validFrontmatter), estimatedMinutes: 6 };
    expect(lessonFrontmatterSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects unparseable frontmatter YAML", () => {
    expect(() => parseLessonFrontmatter("title: : :\n  - broken")).toThrow();
  });

  it("round-trips valid YAML frontmatter", () => {
    expect(parseLessonFrontmatter(toYaml(validFrontmatter))).toEqual(validFrontmatter);
  });
});

describe("assertUniqueOrder", () => {
  const entry = (id: string, order: number) => ({ id, data: { order } });

  it("passes when every Lesson has a distinct order", () => {
    expect(() =>
      assertUniqueOrder([entry("a", 1), entry("b", 2), entry("c", 3)]),
    ).not.toThrow();
  });

  it("throws when two Lessons share an order", () => {
    expect(() =>
      assertUniqueOrder([entry("a", 1), entry("b", 2), entry("c", 2)]),
    ).toThrow(/Duplicate Lesson order 2/);
  });
});
