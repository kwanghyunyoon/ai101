// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, fireEvent, screen } from "@testing-library/preact";
import KnowledgeCheck from "../src/components/KnowledgeCheck";

afterEach(cleanup);

const questions = [
  {
    prompt: "What is an LLM doing when it answers?",
    correctOptionId: "predict",
    options: [
      { id: "predict", text: "Predicting the next chunk of text", explanation: "Correct explanation." },
      { id: "lookup", text: "Looking it up in a database", explanation: "Wrong-answer explanation." },
    ],
  },
];

describe("KnowledgeCheck", () => {
  it("shows positive feedback and the explanation for the correct option", () => {
    render(<KnowledgeCheck questions={questions} />);
    fireEvent.click(screen.getByLabelText("Predicting the next chunk of text"));

    expect(screen.getByText(/Correct\./)).toBeTruthy();
    expect(screen.getByText(/Correct explanation\./)).toBeTruthy();
  });

  it("shows negative feedback and that option's explanation for a wrong option", () => {
    render(<KnowledgeCheck questions={questions} />);
    fireEvent.click(screen.getByLabelText("Looking it up in a database"));

    expect(screen.getByText(/Not quite\./)).toBeTruthy();
    expect(screen.getByText(/Wrong-answer explanation\./)).toBeTruthy();
  });

  it("can be answered again after a wrong answer", () => {
    render(<KnowledgeCheck questions={questions} />);

    fireEvent.click(screen.getByLabelText("Looking it up in a database"));
    const correct = screen.getByLabelText<HTMLInputElement>(
      "Predicting the next chunk of text",
    );
    expect(correct.disabled).toBe(false);

    fireEvent.click(correct);
    expect(screen.getByText(/Correct explanation\./)).toBeTruthy();
  });

  it("never shows a score", () => {
    const { container } = render(<KnowledgeCheck questions={questions} />);
    fireEvent.click(screen.getByLabelText("Predicting the next chunk of text"));
    expect(container.textContent).not.toMatch(/score|\/\s*\d|\d\s*of\s*\d|points?/i);
  });

  it("does not touch storage", () => {
    const used: string[] = [];
    const spy = (key: string) => used.push(key);
    const realGet = Storage.prototype.getItem;
    const realSet = Storage.prototype.setItem;
    Storage.prototype.getItem = function (k: string) {
      spy(k);
      return realGet.call(this, k);
    };
    Storage.prototype.setItem = function (k: string, v: string) {
      spy(k);
      return realSet.call(this, k, v);
    };
    try {
      render(<KnowledgeCheck questions={questions} />);
      fireEvent.click(screen.getByLabelText("Looking it up in a database"));
      fireEvent.click(screen.getByLabelText("Predicting the next chunk of text"));
      expect(used).toEqual([]);
    } finally {
      Storage.prototype.getItem = realGet;
      Storage.prototype.setItem = realSet;
    }
  });
});
