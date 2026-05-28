export function ScorePill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="score-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
