import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { lessonFrontmatterSchema } from "../src/content/schema";
import { splitEntryId } from "../src/lib/lesson-id";

// The per-language MDX tree (issue #13). getLessons() itself needs the Astro
// runtime, so this asserts on the files and the id helper directly; the routing
// integration is covered once `ko` is flipped live.

const root = fileURLToPath(new URL("..", import.meta.url));
const lessonsDir = `${root}src/content/lessons`;
const slugs = (lang: string) =>
  readdirSync(`${lessonsDir}/${lang}`)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();

const frontmatter = (lang: string, slug: string) => {
  const raw = readFileSync(`${lessonsDir}/${lang}/${slug}.mdx`, "utf8");
  const match = /^---\n([\s\S]*?)\n---/.exec(raw);
  if (!match) throw new Error(`no frontmatter in ${lang}/${slug}`);
  return parseYaml(match[1]);
};

describe("splitEntryId", () => {
  it("splits a language prefix off the slug", () => {
    expect(splitEntryId("en/the-five-tools")).toEqual({
      lang: "en",
      slug: "the-five-tools",
    });
    expect(splitEntryId("ko/what-an-llm-actually-is").lang).toBe("ko");
  });
});

describe("Korean edition", () => {
  it("translates every English Lesson, one-to-one by slug", () => {
    expect(slugs("ko")).toEqual(slugs("en"));
  });

  it("keeps frontmatter structure aligned with the English source", () => {
    for (const slug of slugs("en")) {
      const en = frontmatter("en", slug);
      const ko = frontmatter("ko", slug);
      expect(ko.id).toBe(en.id);
      expect(ko.order).toBe(en.order);
      expect(ko.minutes).toBe(en.minutes);
      expect(ko.reviewed).toBe(en.reviewed);
      expect(ko.knowledgeCheck).toHaveLength(en.knowledgeCheck.length);
      ko.knowledgeCheck.forEach((q: any, i: number) => {
        expect(q.options.map((o: any) => o.id).sort()).toEqual(
          en.knowledgeCheck[i].options.map((o: any) => o.id).sort(),
        );
        expect(q.correctOptionId).toBe(en.knowledgeCheck[i].correctOptionId);
      });
    }
  });

  it("passes the same build-time schema as the English Lessons", () => {
    for (const slug of slugs("ko")) {
      const parsed = lessonFrontmatterSchema.safeParse(frontmatter("ko", slug));
      expect(parsed.success, `${slug}: ${parsed.error?.message}`).toBe(true);
    }
  });

  it("is written in Korean, not left in English", () => {
    for (const slug of slugs("ko")) {
      const body = readFileSync(`${lessonsDir}/ko/${slug}.mdx`, "utf8").split(
        "\n---\n",
      )[1];
      expect(/[가-힣]/.test(body), slug).toBe(true);
    }
  });
});
