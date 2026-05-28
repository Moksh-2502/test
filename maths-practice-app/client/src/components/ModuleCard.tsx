import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { CourseItem, Progress } from "../types";
import { AccuracyRing } from "./AccuracyRing";

export function ModuleCard({ section, item, progress }: { section: "abacus" | "vedic"; item: CourseItem; progress?: Progress }) {
  const accuracy = progress?.attempted ? Math.round((progress.correct / progress.attempted) * 1000) / 10 : 0;
  const strong = (progress?.attempted ?? 0) >= 30 && accuracy >= 85;
  const needsPractice = (progress?.attempted ?? 0) >= 20 && accuracy < 70;

  return (
    <article className="module-card">
      <div className="module-card-top">
        <span className={`badge badge-${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
        {strong && <span className="badge badge-strong">Strong</span>}
        {needsPractice && <span className="badge badge-practice">Needs practice</span>}
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="module-stats">
        <AccuracyRing value={accuracy} />
        <div><strong>{progress?.correct ?? 0}/{progress?.attempted ?? 0}</strong><span>correct / attempted</span></div>
      </div>
      <Link className="primary-button" to={`/practice/${section}/${item.id}`}>
        <Sparkles size={18} /> Start <ArrowRight size={18} />
      </Link>
    </article>
  );
}
