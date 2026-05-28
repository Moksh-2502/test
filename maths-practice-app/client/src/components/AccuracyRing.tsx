export function AccuracyRing({ value }: { value: number }) {
  const degrees = Math.max(0, Math.min(100, value)) * 3.6;
  return (
    <div className="accuracy-ring" style={{ background: `conic-gradient(#2f9e44 ${degrees}deg, #e6edf5 0deg)` }}>
      <span>{value}%</span>
    </div>
  );
}
