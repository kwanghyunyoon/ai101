// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { render, cleanup, fireEvent, screen } from "@testing-library/preact";
import HomeProgress from "../src/components/HomeProgress";
import LessonComplete from "../src/components/LessonComplete";
import { PROGRESS_STORAGE_KEY } from "../src/lib/progress";

afterEach(cleanup);
beforeEach(() => window.localStorage.clear());

const lessons = [
  { id: "a", title: "Lesson A", minutes: 5, href: "/en/lessons/a/" },
  { id: "b", title: "Lesson B", minutes: 6, href: "/en/lessons/b/" },
  { id: "c", title: "Lesson C", minutes: 7, href: "/en/lessons/c/" },
];
const setStored = (ids: string[]) =>
  window.localStorage.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify({ completed: ids }),
  );

describe("HomeProgress", () => {
  it("lists every Lesson with a summary, and Start when nothing is done", () => {
    render(<HomeProgress lessons={lessons} doneHref="/en/done/" />);
    expect(screen.getByText("Lesson A")).toBeTruthy();
    expect(screen.getByText("Lesson C")).toBeTruthy();
    expect(screen.getByText("0 of 3 done")).toBeTruthy();

    const button = screen.getByText("Start Lesson 1");
    expect(button.getAttribute("href")).toBe("/en/lessons/a/");
  });

  it("marks completed Lessons and resumes at the first incomplete one", () => {
    setStored(["a"]);
    render(<HomeProgress lessons={lessons} doneHref="/en/done/" />);

    expect(screen.getByText("1 of 3 done")).toBeTruthy();
    const resume = screen.getByText("Resume Lesson 2");
    expect(resume.getAttribute("href")).toBe("/en/lessons/b/");
  });

  it("points the button at the completion screen when all are done", () => {
    setStored(["a", "b", "c"]);
    render(<HomeProgress lessons={lessons} doneHref="/en/done/" />);

    expect(screen.getByText("3 of 3 done")).toBeTruthy();
    expect(screen.getByText("See your completion").getAttribute("href")).toBe(
      "/en/done/",
    );
  });

  it("treats a corrupt stored value as nothing complete", () => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, "{broken");
    render(<HomeProgress lessons={lessons} doneHref="/en/done/" />);
    expect(screen.getByText("0 of 3 done")).toBeTruthy();
    expect(screen.getByText("Start Lesson 1")).toBeTruthy();
  });
});

describe("LessonComplete", () => {
  const hrefs = {
    a: "/en/lessons/a/",
    b: "/en/lessons/b/",
    c: "/en/lessons/c/",
  };

  it("marks the Lesson complete on click", () => {
    render(
      <LessonComplete
        lessonId="a"
        lessonIds={["a", "b", "c"]}
        hrefs={hrefs}
        doneHref="/en/done/"
      />,
    );
    fireEvent.click(screen.getByText("Mark complete → next Lesson"));
    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toContain('"a"');
  });

  it("targets the completion screen after the last Lesson", () => {
    render(
      <LessonComplete
        lessonId="c"
        lessonIds={["a", "b", "c"]}
        hrefs={hrefs}
        doneHref="/en/done/"
      />,
    );
    expect(
      screen.getByText("Finish the Course").getAttribute("href"),
    ).toBe("/en/done/");
  });
});
