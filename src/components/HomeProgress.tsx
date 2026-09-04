import { useEffect, useMemo, useState } from "preact/hooks";
import { Progress, localStoragePort } from "../lib/progress";
import { ui, fmt } from "../i18n/ui";

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
  lang,
}: {
  lessons: LessonLink[];
  doneHref: string;
  lang?: string;
}) {
  const t = ui(lang).toc;
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
    ? t.seeCompletion
    : done === 0
      ? fmt(t.start, { n: 1 })
      : fmt(t.resume, { n: resumeIndex + 1 });

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
                {isDone ? t.done : fmt(t.minutes, { minutes: lesson.minutes })}
              </span>
            </li>
          );
        })}
      </ol>

      <p class="toc-summary" role="status">
        {fmt(t.summary, { done, total })}
      </p>

      <a class="primary-action" href={primaryHref}>
        {primaryLabel}
      </a>
    </div>
  );
}
