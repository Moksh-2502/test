import { useEffect, useState } from "react";
import { coursesApi } from "../api/coursesApi";
import { progressApi } from "../api/progressApi";
import { ModuleCard } from "../components/ModuleCard";
import type { CourseItem, Progress } from "../types";

export function VedicModulesPage() {
  const [modules, setModules] = useState<CourseItem[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    Promise.all([coursesApi.all(), progressApi.all()]).then(([courseData, progressData]) => {
      setModules(courseData.vedic.modules);
      setProgress(progressData.progress);
    });
  }, []);

  return (
    <main className="page">
      <section className="section-heading">
        <span className="eyebrow">Vedic Maths</span>
        <h1>33 mental maths modules</h1>
      </section>
      <section className="module-grid">
        {modules.map((module) => (
          <ModuleCard key={module.id} section="vedic" item={module} progress={progress.find((item) => item.moduleId === module.id)} />
        ))}
      </section>
    </main>
  );
}
