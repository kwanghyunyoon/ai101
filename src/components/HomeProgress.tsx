import { useEffect, useMemo, useState } from "preact/hooks";
import { Progress, localStoragePort } from "../lib/progress";

/** One row of the table of contents, resolved to its localized route. */
export interface LessonLink {
  id: string;
  title: string;
  minutes: number;
  href: string;
}

/**
 * The home screen's table of contents, with the Learner's Progress layered on:
 * a completion mark per Lesson, an "N of 6 done" summary, and a primary
 * Start / Resume button. An island (ADR 0003) because the completion state is
 * read from `localStorage` on the client; it renders the full list on the
 * server too, so the Course is navigable before (and without) hydration.
 */
export default function HomeProgress({
  lessons,
  doneHref,
}: {
  lessons: LessonLink[];
  doneHref: string;
}) {
  const ids = useMemo(() => lessons.map((l) => l.id), [lessons]);
  const progress = useMemo(() => new Progress(localStoragePort(), ids), [ids]);

  // Empty until the effect reads storage — the server render and first paint
  // show every Lesson as not-yet-done, which is the correct default.
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCompleted(new Set(progress.completedLessonIds()));
  }, [progress]);

  const done = completed.size;
  const total = lessons.length;
  const resumeIndex = lessons.findIndex((l) => !completed.has(l.id));
  const allDone = resumeIndex === -1;

  const primaryHref = allDone ? doneHref : lessons[resumeIndex].href;
  const primaryLabel = allDone
    ? "See your completion"
    : done === 0
      ? "Start Lesson 1"
      : `Resume Lesson ${resumeIndex + 1}`;

  return (
    <div class="home-toc">
      <ol class="toc">
        {lessons.map((lesson, i) => {
          const isDone = completed.has(lesson.id);
          return (
            <li key={lesson.id} class={`toc-item${isDone ? " is-done" : ""}`}>
              <span class="toc-marker" aria-hidden="true">
                {isDone ? "✓" : i + 1}
              </span>
              <a href={lesson.href}>{lesson.title}</a>
              <span class="lesson-meta">
                {isDone ? "Done" : `about ${lesson.minutes} min`}
              </span>
            </li>
          );
        })}
      </ol>

      <p class="toc-summary" role="status">
        {done} of {total} done
      </p>

      <a class="primary-action" href={primaryHref}>
        {primaryLabel}
      </a>
    </div>
  );
}
