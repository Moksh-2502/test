import type { GeneratedQuestion } from "../types";

export function QuestionCard({ question }: { question: GeneratedQuestion }) {
  return (
    <section className={`question-card question-${question.displayType}`}>
      <span>{question.prompt}</span>
      {question.displayType === "vertical" && question.operands ? (
        <div className="vertical-problem">
          {question.operands.map((operand, index) => (
            <div key={`${operand}-${index}`}>{index === question.operands!.length - 1 ? "+" : ""}{operand.toLocaleString()}</div>
          ))}
          <div className="answer-line" />
        </div>
      ) : (
        <strong>{question.expression}</strong>
      )}
    </section>
  );
}
