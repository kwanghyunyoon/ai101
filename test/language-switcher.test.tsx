// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { render, cleanup, screen } from "@testing-library/preact";
import LanguageSwitcher from "../src/components/LanguageSwitcher";
import { STORED_LANGUAGE_KEY } from "../src/i18n/preference";

afterEach(cleanup);
beforeEach(() => window.localStorage.clear());

const languages = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
  { code: "es", label: "Español" },
];

describe("LanguageSwitcher", () => {
  it("links each language to the same Lesson under its prefix", () => {
    render(
      <LanguageSwitcher
        currentLang="en"
        logicalPath="/lessons/what-an-llm-actually-is/"
        languages={languages}
      />,
    );

    expect(screen.getByText("한국어").getAttribute("href")).toBe(
      "/ko/lessons/what-an-llm-actually-is/",
    );
    expect(screen.getByText("Español").getAttribute("href")).toBe(
      "/es/lessons/what-an-llm-actually-is/",
    );
  });

  it("marks the current language and does not link away from it needlessly", () => {
    render(
      <LanguageSwitcher
        currentLang="en"
        logicalPath="/"
        languages={languages}
      />,
    );
    expect(screen.getByText("English").getAttribute("aria-current")).toBe("true");
    expect(screen.getByText("한국어").getAttribute("aria-current")).toBeNull();
  });

  it("stores the chosen language when a switcher link is clicked", () => {
    render(
      <LanguageSwitcher
        currentLang="en"
        logicalPath="/lessons/x/"
        languages={languages}
      />,
    );
    screen.getByText("한국어").click();
    expect(window.localStorage.getItem(STORED_LANGUAGE_KEY)).toBe("ko");
  });
});
