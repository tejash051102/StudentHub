import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import api from '../api/client.js';
import StatCard from '../components/StatCard.jsx';

const enrollmentTrend = [
  { month: 'Jan', students: 44 },
  { month: 'Feb', students: 62 },
  { month: 'Mar', students: 48 },
  { month: 'Apr', students: 78 },
  { month: 'May', students: 69 },
  { month: 'Jun', students: 86 },
  { month: 'Jul', students: 74 },
  { month: 'Aug', students: 92 },
  { month: 'Sep', students: 80 },
  { month: 'Oct', students: 96 },
  { month: 'Nov', students: 88 },
  { month: 'Dec', students: 100 }
];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => setDashboard(data));
  }, []);

  const totals = dashboard?.totals || {};
  const attendance = totals.students ? Math.min(98, Math.round((totals.activeStudents / totals.students) * 100)) : 0;

  return (
    <motion.section className="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
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

      <motion.section
        className="hero-panel"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
      >
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
      </motion.section>

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
          <div className="section-title">
            <div>
              <h2>Recent Activities</h2>
              <p>Latest student updates and system notices.</p>
            </div>
          </div>
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

      <div className="dashboard-grid">
      <section className="panel wide-panel">
        <div className="section-title">
          <div>
            <h2>Enrollment Trend</h2>
            <p>Monthly admission and verification summary.</p>
          </div>
          <span className="status-pill">Live</span>
        </div>
        <div className="rechart-shell">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={enrollmentTrend} margin={{ left: -18, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="studenthubEnrollment" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="students"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#studenthubEnrollment)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel quick-panel">
        <h2>Quick Actions</h2>
        <button type="button">Add Student</button>
        <button type="button" className="ghost-button">Create Course</button>
        <button type="button" className="ghost-button">Send Notice</button>
        <div className="notification-card">
          <strong>3 pending verifications</strong>
          <span>Review new student documents before publishing reports.</span>
        </div>
      </section>
      </div>
    </motion.section>
  );
}
