import { describe, it, expect } from "vitest";
import { ui, fmt } from "../src/i18n/ui";
import { LANGUAGES } from "../src/i18n/config";

// The app's own UI copy (chrome, home, completion, privacy, island labels) for
// every configured language. Lesson content is MDX and covered separately.

const leafKeys = (obj: unknown, prefix = ""): string[] =>
  typeof obj === "object" && obj !== null
    ? Object.entries(obj).flatMap(([k, v]) =>
        typeof v === "object" && v !== null
          ? leafKeys(v, `${prefix}${k}.`)
          : [`${prefix}${k}`],
      )
    : [];

describe("ui()", () => {
  it("returns English as the complete source", () => {
    const en = ui("en");
    expect(en.skipLink).toBe("Skip to content");
    expect(en.knowledgeCheck.correct).toBe("Correct.");
  });

  it("returns a fully Korean string set", () => {
    const ko = ui("ko");
    expect(ko.skipLink).toBe("본문으로 건너뛰기");
    expect(ko.knowledgeCheck.heading).toBe("이해도 점검");
    expect(ko.install.go).toBe("설치");
    // Every leaf is either Korean or deliberately identical to English (a
    // proper noun like "GitHub") — never an untranslated English sentence.
    const en = ui("en");
    for (const key of leafKeys(ko)) {
      const get = (o: any) => key.split(".").reduce((x, k) => x[k], o) as string;
      const value = get(ko);
      const translated = /[가-힣]/.test(value) || value === get(en);
      expect(translated, `${key} still English: ${value}`).toBe(true);
    }
  });

  it("returns a fully Spanish string set", () => {
    const es = ui("es");
    expect(es.skipLink).toBe("Saltar al contenido");
    expect(es.knowledgeCheck.heading).toBe("Comprobación de conocimientos");
    expect(es.install.go).toBe("Instalar");
    // Every leaf is either translated or deliberately identical to English (a
    // proper noun like "GitHub") — never an untranslated English string.
    const en = ui("en");
    const sameAsEnglishIsFine = new Set(["privacy.questionsLink"]);
    for (const key of leafKeys(es)) {
      const get = (o: any) => key.split(".").reduce((x, k) => x[k], o) as string;
      const translated =
        get(es) !== get(en) || sameAsEnglishIsFine.has(key);
      expect(translated, `${key} still English: ${get(es)}`).toBe(true);
    }
  });

  it("falls back to English for a language with no translation", () => {
    expect(ui("qq")).toEqual(ui("en"));
    expect(ui()).toEqual(ui("en"));
  });

  it("keeps every configured language resolvable to the full shape", () => {
    const shape = leafKeys(ui("en")).sort();
    for (const { code } of LANGUAGES) {
      expect(leafKeys(ui(code)).sort()).toEqual(shape);
    }
  });
});

describe("fmt()", () => {
  it("fills named placeholders", () => {
    expect(fmt("{done} of {total} done", { done: 2, total: 6 })).toBe(
      "2 of 6 done",
    );
    expect(fmt("약 {minutes}분", { minutes: 8 })).toBe("약 8분");
  });

  it("leaves an unknown placeholder untouched", () => {
    expect(fmt("hi {name}", {})).toBe("hi {name}");
  });
});
