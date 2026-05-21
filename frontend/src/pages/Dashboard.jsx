import { useEffect, useState } from 'react';
import api from '../api/client.js';
import StatCard from '../components/StatCard.jsx';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => setDashboard(data));
  }, []);

  const totals = dashboard?.totals || {};

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Analytics</span>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Students" value={totals.students || 0} detail="Total records" />
        <StatCard label="Active" value={totals.activeStudents || 0} detail="Currently enrolled" />
        <StatCard label="Courses" value={totals.courses || 0} detail="Available programs" />
        <StatCard label="Departments" value={totals.departments || 0} detail="Academic groups" />
      </div>

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
          <h2>Recent Students</h2>
          <div className="compact-list">
            {(dashboard?.recentStudents || []).map((student) => (
              <div key={student._id}>
                <strong>
                  {student.firstName} {student.lastName}
                </strong>
                <span>{student.course}</span>
              </div>
            ))}
            {!dashboard?.recentStudents?.length && <p className="muted">No students added yet.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}
