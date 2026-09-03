import { useId, useState } from "preact/hooks";
import type { LessonFrontmatter } from "../content/schema";

type Question = LessonFrontmatter["knowledgeCheck"][number];

/**
 * The end-of-Lesson Knowledge Check. Each question is answered independently and
 * gives immediate feedback: the right option confirms and explains; a wrong
 * option explains why it's wrong and lets the Learner try again. Nothing is
 * scored and nothing is written to storage — a Knowledge Check result is never
 * persisted (spec: no test anxiety).
 */
export default function KnowledgeCheck({
  questions,
}: {
  questions: Question[];
}) {
  return (
    <section class="knowledge-check" aria-labelledby="knowledge-check-heading">
      <h2 id="knowledge-check-heading">Knowledge check</h2>
      <ol class="kc-questions">
        {questions.map((question, i) => (
          <li key={i}>
            <QuestionBlock question={question} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function QuestionBlock({ question }: { question: Question }) {
  const groupName = useId();
  const feedbackId = `${groupName}-feedback`;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const picked = question.options.find((o) => o.id === selectedId) ?? null;
  const isCorrect = picked !== null && picked.id === question.correctOptionId;

  return (
    <fieldset class="kc-question" aria-describedby={feedbackId}>
      <legend>{question.prompt}</legend>

      {question.options.map((option) => (
        <label key={option.id} class="kc-option">
          <input
            type="radio"
            name={groupName}
            value={option.id}
            checked={selectedId === option.id}
            // A correct answer locks the question; a wrong one stays open so the
            // Learner can pick again.
            disabled={isCorrect}
            onChange={() => setSelectedId(option.id)}
          />
          <span>{option.text}</span>
        </label>
      ))}

      <p
        id={feedbackId}
        class={`kc-feedback${picked ? (isCorrect ? " is-correct" : " is-incorrect") : ""}`}
        role="status"
        aria-live="polite"
      >
        {picked && (
          <>
            <strong>{isCorrect ? "Correct." : "Not quite."}</strong>{" "}
            {picked.explanation}
          </>
        )}
      </p>
    </fieldset>
  );
}
