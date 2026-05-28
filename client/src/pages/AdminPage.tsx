import { GraduationCap, Plus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi, type AdminStudent } from "../api/adminApi";
import { ScorePill } from "../components/ScorePill";

export function AdminPage() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [summary, setSummary] = useState({ classroomAverage: 0, totalStudents: 0, totalAttempts: 0, totalCorrect: 0 });
  const [className, setClassName] = useState("");
  const [enroll, setEnroll] = useState({ classroomId: "", email: "" });
  const [message, setMessage] = useState("");

  async function refresh() {
    const data = await adminApi.summary();
    setStudents(data.students);
    setSummary(data);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main className="page">
      <section className="section-heading">
        <span className="eyebrow">Teacher/admin</span>
        <h1><GraduationCap size={36} /> Classroom management</h1>
      </section>
      <div className="score-grid">
        <ScorePill label="Students" value={summary.totalStudents} />
        <ScorePill label="Average" value={`${summary.classroomAverage}%`} />
        <ScorePill label="Attempts" value={summary.totalAttempts} />
        <ScorePill label="Correct" value={summary.totalCorrect} />
      </div>
      <section className="admin-tools">
        <form onSubmit={async (e) => { e.preventDefault(); await adminApi.createClassroom(className); setClassName(""); setMessage("Classroom created."); }}>
          <h2><Plus size={20} /> Create classroom</h2>
          <input placeholder="Classroom name" value={className} onChange={(e) => setClassName(e.target.value)} />
          <button className="primary-button">Create</button>
        </form>
        <form onSubmit={async (e) => { e.preventDefault(); await adminApi.enroll(enroll.classroomId, enroll.email); setEnroll({ classroomId: "", email: "" }); setMessage("Student enrolled."); }}>
          <h2><UserPlus size={20} /> Enroll student</h2>
          <input placeholder="Classroom ID" value={enroll.classroomId} onChange={(e) => setEnroll({ ...enroll, classroomId: e.target.value })} />
          <input placeholder="Student email" value={enroll.email} onChange={(e) => setEnroll({ ...enroll, email: e.target.value })} />
          <button className="primary-button">Enroll</button>
        </form>
      </section>
      {message && <p className="feedback-panel correct">{message}</p>}
      <section className="recent-panel">
        <h2>Student results</h2>
        {students.map((student) => (
          <div className="student-row" key={student.id}>
            <span>{student.name}<small>{student.email}</small></span>
            <strong>{student.correct}/{student.attempted}</strong>
            <strong>{student.accuracy}%</strong>
            <strong>Best {student.bestStreak}</strong>
          </div>
        ))}
      </section>
    </main>
  );
}
