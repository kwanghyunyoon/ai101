import { Progress, localStoragePort } from "../lib/progress";

/**
 * The end-of-Lesson action. Marks this Lesson complete in the Learner's
 * Progress, then moves them to the next Lesson — or the completion screen when
 * this is the last one. The destination is fixed by teaching order, so it
 * renders the same on the server and the client; only the click touches
 * storage.
 */
export default function LessonComplete({
  lessonId,
  lessonIds,
  hrefs,
  doneHref,
}: {
  lessonId: string;
  lessonIds: string[];
  hrefs: Record<string, string>;
  doneHref: string;
}) {
  const progress = new Progress(localStoragePort(), lessonIds);
  const next = progress.nextAfter(lessonId);
  const nextHref = next.kind === "complete" ? doneHref : hrefs[next.lessonId];
  const label =
    next.kind === "complete" ? "Finish the Course" : "Mark complete → next Lesson";

  function onClick(event: Event) {
    event.preventDefault();
    progress.markComplete(lessonId);
    window.location.href = nextHref;
  }

  return (
    <div class="lesson-complete">
      <a class="primary-action" href={nextHref} onClick={onClick}>
        {label}
      </a>
    </div>
  );
}
