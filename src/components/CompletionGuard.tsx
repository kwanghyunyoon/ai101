import { useEffect } from "preact/hooks";
import { Progress, localStoragePort } from "../lib/progress";

/**
 * Guards the completion screen so it only "shows when all Lessons are complete"
 * (issue #5). On the client, a Learner who has not finished is redirected to
 * their resume point. Renders nothing; the page content stays server-rendered
 * for crawlers and the no-JS path.
 */
export default function CompletionGuard({
  lessonIds,
  hrefs,
  homeHref,
}: {
  lessonIds: string[];
  hrefs: Record<string, string>;
  homeHref: string;
}) {
  useEffect(() => {
    const progress = new Progress(localStoragePort(), lessonIds);
    if (progress.allComplete()) return;
    const resume = progress.resumePoint();
    window.location.replace(
      resume.kind === "lesson" ? hrefs[resume.lessonId] : homeHref,
    );
  }, []);

  return null;
}
