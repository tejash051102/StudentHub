export default function StatCard({ label, value, detail, tone = 'blue' }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-icon">{label.slice(0, 2).toUpperCase()}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}
