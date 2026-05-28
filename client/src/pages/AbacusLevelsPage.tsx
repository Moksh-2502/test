import { useEffect, useState } from "react";
import { coursesApi } from "../api/coursesApi";
import { progressApi } from "../api/progressApi";
import { AbacusSimulator } from "../components/AbacusSimulator";
import { ModuleCard } from "../components/ModuleCard";
import type { CourseItem, Progress } from "../types";

export function AbacusLevelsPage() {
  const [levels, setLevels] = useState<CourseItem[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    Promise.all([coursesApi.all(), progressApi.all()]).then(([courseData, progressData]) => {
      setLevels(courseData.abacus.levels);
      setProgress(progressData.progress);
    });
  }, []);

  return (
    <main className="page">
      <section className="section-heading">
        <span className="eyebrow">Smart Brain Abacus</span>
        <h1>Level 0 to Level 7</h1>
      </section>
      <AbacusSimulator />
      <section className="module-grid">
        {levels.map((level) => (
          <ModuleCard key={level.id} section="abacus" item={level} progress={progress.find((item) => item.moduleId === level.id)} />
        ))}
      </section>
    </main>
  );
}
