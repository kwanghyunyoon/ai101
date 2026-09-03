import { describe, it, expect } from "vitest";
import {
  PROGRESS_STORAGE_KEY,
  Progress,
  memoryStoragePort,
  type StoragePort,
} from "../src/lib/progress";

// The `progress` module is exercised entirely through its interface with an
// in-memory fake port — no real `localStorage`, no DOM (issue #5).
const LESSONS = ["one", "two", "three", "four", "five", "six"];

const newProgress = (seed?: Record<string, string>) =>
  new Progress(memoryStoragePort(seed), LESSONS);

const stored = (ids: string[]) => ({
  [PROGRESS_STORAGE_KEY]: JSON.stringify({ completed: ids }),
});

describe("marking a Lesson complete", () => {
  it("makes the Lesson report complete and bumps the count", () => {
    const progress = newProgress();
    expect(progress.isComplete("two")).toBe(false);
    expect(progress.completedCount()).toBe(0);

    progress.markComplete("two");

    expect(progress.isComplete("two")).toBe(true);
    expect(progress.completedCount()).toBe(1);
  });

  it("is idempotent — marking again does not double-count", () => {
    const progress = newProgress();
    progress.markComplete("two");
    progress.markComplete("two");
    expect(progress.completedCount()).toBe(1);
  });

  it("persists across Progress instances sharing a port", () => {
    const port = memoryStoragePort();
    new Progress(port, LESSONS).markComplete("one");
    expect(new Progress(port, LESSONS).isComplete("one")).toBe(true);
  });

  it("ignores an id that is not a Lesson", () => {
    const progress = newProgress();
    progress.markComplete("not-a-lesson");
    expect(progress.completedCount()).toBe(0);
  });
});

describe("summary", () => {
  it("reports done / total", () => {
    const progress = newProgress(stored(["one", "two"]));
    expect(progress.summary()).toEqual({ done: 2, total: 6 });
  });

  it("allComplete is true only once every Lesson is done", () => {
    expect(newProgress(stored(["one"])).allComplete()).toBe(false);
    expect(newProgress(stored(LESSONS)).allComplete()).toBe(true);
  });
});

describe("resume point", () => {
  it("is the first incomplete Lesson in order", () => {
    const progress = newProgress(stored(["one", "two"]));
    expect(progress.resumePoint()).toEqual({
      kind: "lesson",
      lessonId: "three",
      index: 2,
    });
  });

  it("skips a completed Lesson even when a later one is done", () => {
    const progress = newProgress(stored(["one", "three"]));
    expect(progress.resumePoint()).toMatchObject({ lessonId: "two" });
  });

  it("is the completion screen when every Lesson is complete", () => {
    expect(newProgress(stored(LESSONS)).resumePoint()).toEqual({
      kind: "complete",
    });
  });

  it("is the first Lesson when nothing is done", () => {
    expect(newProgress().resumePoint()).toMatchObject({
      lessonId: "one",
      index: 0,
    });
  });
});

describe("nextAfter", () => {
  it("is the following Lesson", () => {
    expect(newProgress().nextAfter("two")).toEqual({
      kind: "lesson",
      lessonId: "three",
      index: 2,
    });
  });

  it("is the completion screen after the last Lesson", () => {
    expect(newProgress().nextAfter("six")).toEqual({ kind: "complete" });
  });
});

describe("a corrupt or empty stored value", () => {
  const cases: Record<string, StoragePort> = {
    "missing key": memoryStoragePort(),
    "empty string": memoryStoragePort({ [PROGRESS_STORAGE_KEY]: "" }),
    "not JSON": memoryStoragePort({ [PROGRESS_STORAGE_KEY]: "{not json" }),
    "a bare number": memoryStoragePort({ [PROGRESS_STORAGE_KEY]: "42" }),
    "wrong shape": memoryStoragePort({
      [PROGRESS_STORAGE_KEY]: JSON.stringify({ completed: "one" }),
    }),
    "non-string entries": memoryStoragePort({
      [PROGRESS_STORAGE_KEY]: JSON.stringify({ completed: [1, null, {}] }),
    }),
  };

  for (const [name, port] of Object.entries(cases)) {
    it(`reads as "nothing complete" and never throws: ${name}`, () => {
      const progress = new Progress(port, LESSONS);
      expect(() => progress.completedCount()).not.toThrow();
      expect(progress.completedCount()).toBe(0);
      expect(progress.resumePoint()).toMatchObject({ lessonId: "one" });
    });
  }

  it("drops stored ids that are no longer Lessons", () => {
    const progress = new Progress(
      memoryStoragePort(stored(["one", "gone", "two"])),
      LESSONS,
    );
    expect(progress.completedCount()).toBe(2);
  });

  it("survives a port whose read throws", () => {
    const throwing: StoragePort = {
      read() {
        throw new Error("SecurityError");
      },
      write() {},
    };
    const progress = new Progress(throwing, LESSONS);
    expect(progress.completedCount()).toBe(0);
    expect(() => progress.markComplete("one")).not.toThrow();
  });
});
