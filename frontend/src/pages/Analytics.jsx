export default function Analytics() {
  const weekly = [68, 74, 71, 82, 88, 85, 91];
  const segments = [
    ['Admissions', '42%', 'blue'],
    ['Attendance', '86%', 'green'],
    ['Course Completion', '78%', 'indigo'],
    ['Data Verification', '94%', 'cyan']
  ];

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Insights</span>
          <h1>Analytics</h1>
          <p>Visualize institution performance, enrollment movement, and academic health.</p>
        </div>
        <button type="button">Export Analytics</button>
      </div>

      <section className="analytics-grid">
        <article className="panel wide-panel">
          <div className="section-title">
            <div>
              <h2>Weekly Attendance</h2>
              <p>Average attendance across all active departments.</p>
            </div>
          </div>
          <div className="line-chart" aria-label="Weekly attendance chart">
            {weekly.map((point, index) => (
              <span key={point + index} style={{ '--height': `${point}%` }}>
                <i />
              </span>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Performance Mix</h2>
          <div className="segment-list">
            {segments.map(([label, value, tone]) => (
              <div key={label} className={`segment tone-${tone}`}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Academic KPIs</h2>
            <p>Summary indicators for leadership review.</p>
          </div>
        </div>
        <div className="kpi-grid">
          <span>Retention Rate<strong>91%</strong></span>
          <span>Average GPA<strong>8.4</strong></span>
          <span>Fee Clearance<strong>76%</strong></span>
          <span>Report Readiness<strong>89%</strong></span>
        </div>
      </section>
    </section>
  );
}
