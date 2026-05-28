import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { coursesApi } from "../api/coursesApi";
import { practiceApi } from "../api/practiceApi";
import { AnswerInput } from "../components/AnswerInput";
import { FeedbackPanel } from "../components/FeedbackPanel";
import { MethodTip } from "../components/MethodTip";
import { QuestionCard } from "../components/QuestionCard";
import { ScorePill } from "../components/ScorePill";
import type { CourseItem, GeneratedQuestion, SubmitResult } from "../types";

export function PracticePage() {
  const params = useParams();
  const section = params.section as "abacus" | "vedic";
  const moduleId = params.moduleId!;
  const [sessionId, setSessionId] = useState("");
  const [item, setItem] = useState<CourseItem>();
  const [question, setQuestion] = useState<GeneratedQuestion>();
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<SubmitResult>();
  const [recent, setRecent] = useState<Array<{ expression?: string; answer: string; correct: boolean }>>([]);
  const [score, setScore] = useState({ correct: 0, attempted: 0, accuracy: 0, streak: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadQuestion(activeSessionId = sessionId) {
    setLoading(true);
    setResult(undefined);
    setAnswer("");
    const next = await practiceApi.question({ sessionId: activeSessionId, section, moduleId });
    setQuestion(next);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  useEffect(() => {
    async function boot() {
      const [courses, session] = await Promise.all([
        coursesApi.all(),
        practiceApi.start({ section, moduleId, mode: "infinite" })
      ]);
      setSessionId(session.sessionId);
      setItem(section === "abacus"
        ? courses.abacus.levels.find((level) => level.id === moduleId)
        : courses.vedic.modules.find((module) => module.id === moduleId));
      await loadQuestion(session.sessionId);
    }
    boot();
  }, [section, moduleId]);

  async function submit() {
    if (!question || result || submitting) return;
    setSubmitting(true);
    try {
      const submitted = await practiceApi.submit({ attemptId: question.attemptId, answer });
      setResult(submitted);
      setScore({
        correct: submitted.sessionScore.correct,
        attempted: submitted.sessionScore.attempted,
        accuracy: submitted.sessionScore.accuracy,
        streak: submitted.progress.currentStreak
      });
      setRecent((items) => [{ expression: question.expression, answer, correct: submitted.correct }, ...items].slice(0, 5));
    } finally {
      setSubmitting(false);
    }
  }

  async function enterAction() {
    if (result) return loadQuestion();
    return submit();
  }

  return (
    <main className="practice-page">
      <header className="practice-header">
        <Link className="ghost-button" to={section === "abacus" ? "/abacus" : "/vedic"}><ArrowLeft size={18} /> Back</Link>
        <div>
          <span className="eyebrow">{section === "abacus" ? "Smart Brain Abacus" : "Vedic Maths"}</span>
          <h1>{item?.title ?? "Practice"}</h1>
        </div>
        <div className="score-grid compact">
          <ScorePill label="Score" value={`${score.correct}/${score.attempted}`} />
          <ScorePill label="Accuracy" value={`${score.accuracy}%`} />
          <ScorePill label="Streak" value={score.streak} />
        </div>
      </header>

      {loading || !question ? <section className="question-card"><strong>Loading question...</strong></section> : <QuestionCard question={question} />}
      <AnswerInput ref={inputRef} value={answer} disabled={submitting || Boolean(result)} onChange={setAnswer} onSubmit={enterAction} />
      <FeedbackPanel result={result} />
      {result && <button className="primary-button next-button" onClick={() => loadQuestion()}>Next question <ArrowRight size={18} /></button>}
      <MethodTip tip={item?.methodTip} />
      <section className="recent-panel">
        <h2>Recent answers</h2>
        {recent.length === 0 ? <p>No answers yet.</p> : recent.map((entry, index) => (
          <div className="activity-row" key={`${entry.expression}-${index}`}>
            <span>{entry.expression}</span>
            <strong className={entry.correct ? "text-good" : "text-bad"}>{entry.answer}</strong>
          </div>
        ))}
      </section>
    </main>
  );
}
