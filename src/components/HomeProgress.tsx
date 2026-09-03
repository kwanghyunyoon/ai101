import { useEffect, useMemo, useState } from "preact/hooks";
import { Progress, localStoragePort, type ResumePoint } from "../lib/progress";

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
 * read from `localStorage` on the client; the astro page ships a plain
 * `<noscript>` list so the Course is still navigable with no JavaScript.
 */
export default function HomeProgress({
  lessons,
  doneHref,
}: {
  lessons: LessonLink[];
  doneHref: string;
}) {
  const ids = useMemo(() => lessons.map((l) => l.id), [lessons]);
  const progress = useMemo(
    () => new Progress(localStoragePort(), ids),
    [ids],
  );

  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [resume, setResume] = useState<ResumePoint>({
    kind: "lesson",
    lessonId: ids[0],
    index: 0,
  });

  useEffect(() => {
    setCompleted(new Set(ids.filter((id) => progress.isComplete(id))));
    setResume(progress.resumePoint());
  }, [ids, progress]);

  const done = completed.size;
  const total = lessons.length;

  const primaryHref =
    resume.kind === "complete" ? doneHref : lessons[resume.index].href;
  const primaryLabel =
    done === 0
      ? "Start Lesson 1"
      : resume.kind === "complete"
        ? "See your completion"
        : `Resume Lesson ${resume.index + 1}`;

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
