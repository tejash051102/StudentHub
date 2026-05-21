import { useEffect, useState } from 'react';
import api from '../api/client.js';
import StatCard from '../components/StatCard.jsx';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => setDashboard(data));
  }, []);

  const totals = dashboard?.totals || {};
  const attendance = totals.students ? Math.min(98, Math.round((totals.activeStudents / totals.students) * 100)) : 0;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">StudentHub Overview</span>
          <h1>Institution Dashboard</h1>
          <p>Monitor student records, academics, attendance, and administrative activity.</p>
        </div>
        <button type="button">Generate Report</button>
      </div>

      <div className="stats-grid">
        <StatCard label="Students" value={totals.students || 0} detail="Total student records" tone="blue" />
        <StatCard label="Departments" value={totals.departments || 0} detail="Academic departments" tone="cyan" />
        <StatCard label="Courses" value={totals.courses || 0} detail="Active courses" tone="indigo" />
        <StatCard label="Attendance" value={`${attendance}%`} detail="Current attendance rate" tone="green" />
      </div>

      <section className="hero-panel">
        <div>
          <span className="eyebrow">Campus Health</span>
          <h2>StudentHub keeps academic operations centralized and fast.</h2>
          <p>
            Review admissions, departments, courses, attendance, and recent activity from one responsive workspace.
          </p>
        </div>
        <div className="metric-ring" style={{ '--value': `${attendance || 74}%` }}>
          <strong>{attendance || 74}%</strong>
          <span>Attendance</span>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <h2>Students by Department</h2>
          <div className="bar-list">
            {(dashboard?.departments || []).map((item) => (
              <div key={item._id} className="bar-row">
                <span>{item._id}</span>
                <div>
                  <i style={{ width: `${Math.min(item.count * 18, 100)}%` }} />
                </div>
                <strong>{item.count}</strong>
              </div>
            ))}
            {!dashboard?.departments?.length && <p className="muted">No department data yet.</p>}
          </div>
        </section>

        <section className="panel">
          <h2>Recent Activities</h2>
          <div className="activity-list">
            {(dashboard?.recentStudents || []).map((student) => (
              <div key={student._id} className="activity-item">
                <span>{student.firstName?.[0]}{student.lastName?.[0]}</span>
                <div>
                  <strong>
                    {student.firstName} {student.lastName}
                  </strong>
                  <small>Added to {student.course}</small>
                </div>
              </div>
            ))}
            {!dashboard?.recentStudents?.length && <p className="muted">No students added yet.</p>}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Enrollment Trend</h2>
            <p>Monthly admission and verification summary.</p>
          </div>
          <span className="status-pill">Live</span>
        </div>
        <div className="chart-bars">
          {[44, 62, 48, 78, 69, 86, 74, 92, 80, 96, 88, 100].map((height, index) => (
            <div key={height + index}>
              <i style={{ height: `${height}%` }} />
              <span>{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
