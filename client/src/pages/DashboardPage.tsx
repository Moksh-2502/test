import { ArrowRight, BookOpen, Brain, Calculator } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { coursesApi } from "../api/coursesApi";
import { progressApi, type ProgressSummary } from "../api/progressApi";
import { AbacusSimulator } from "../components/AbacusSimulator";
import { AccuracyRing } from "../components/AccuracyRing";
import { ScorePill } from "../components/ScorePill";
import type { CourseItem, Progress } from "../types";

export function DashboardPage() {
  const [courses, setCourses] = useState<{ abacus: CourseItem[]; vedic: CourseItem[] }>({ abacus: [], vedic: [] });
  const [summary, setSummary] = useState<ProgressSummary>();
  const [recent, setRecent] = useState<Progress[]>([]);

  useEffect(() => {
    Promise.all([coursesApi.all(), progressApi.all()]).then(([courseData, progressData]) => {
      setCourses({ abacus: courseData.abacus.levels, vedic: courseData.vedic.modules });
      setSummary(progressData.summary);
      setRecent(progressData.recent);
    });
  }, []);

  return (
    <main className="page">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Practice dashboard</span>
          <h1>Choose a track and start sprinting through maths.</h1>
          <div className="score-grid">
            <ScorePill label="Overall" value={`${summary?.correct ?? 0}/${summary?.attempted ?? 0}`} />
            <ScorePill label="Accuracy" value={`${summary?.accuracy ?? 0}%`} />
            <ScorePill label="Best streak" value={summary?.bestStreak ?? 0} />
          </div>
        </div>
        <AbacusSimulator />
      </section>

      <section className="track-grid">
        <Link to="/abacus" className="track-card">
          <Brain size={32} />
          <h2>Smart Brain Abacus</h2>
          <p>{courses.abacus.length} levels, bead practice, formulas, arithmetic, decimals, negatives, and percentage.</p>
          <AccuracyRing value={summary?.abacus.accuracy ?? 0} />
          <span className="track-cta">Start Abacus <ArrowRight size={18} /></span>
        </Link>
        <Link to="/vedic" className="track-card">
          <Calculator size={32} />
          <h2>Vedic Maths</h2>
          <p>{courses.vedic.length} modules covering mental arithmetic techniques and exact drills.</p>
          <AccuracyRing value={summary?.vedic.accuracy ?? 0} />
          <span className="track-cta">Start Vedic Maths <ArrowRight size={18} /></span>
        </Link>
      </section>

      <section className="recent-panel">
        <h2><BookOpen size={22} /> Recent activity</h2>
        {recent.length === 0 ? <p>No practice yet.</p> : recent.map((item) => (
          <div className="activity-row" key={item.id}>
            <span>{item.section} · {item.moduleId}</span>
            <strong>{item.correct}/{item.attempted}</strong>
          </div>
        ))}
      </section>
    </main>
  );
}
