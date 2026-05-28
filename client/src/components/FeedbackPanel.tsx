import { CheckCircle2, XCircle } from "lucide-react";
import type { SubmitResult } from "../types";

export function FeedbackPanel({ result }: { result?: SubmitResult }) {
  if (!result) return <div className="feedback-panel muted">Submit your answer to see instant feedback.</div>;
  return (
    <div className={`feedback-panel ${result.correct ? "correct" : "wrong"}`}>
      {result.correct ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
      <div>
        <strong>{result.correct ? "Correct!" : "Not quite."}</strong>
        {!result.correct && <p>Correct answer: {result.correctAnswer.toLocaleString()}</p>}
        {result.explanation && <p>{result.explanation}</p>}
      </div>
    </div>
  );
}
