import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function Attendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get('/erp/attendance').then(({ data }) => setRecords(data));
  }, []);

  const present = records.filter((record) => record.status === 'Present').length;
  const rate = records.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Daily and Monthly Reports</span>
          <h1>Attendance</h1>
          <p>Track presence, late marks, monthly summaries, and low-attendance alerts.</p>
        </div>
        <button type="button">Mark Attendance</button>
      </div>

      <div className="stats-grid">
        <article className="stat-card tone-green"><div className="stat-icon">AT</div><div><span>Attendance Rate</span><strong>{rate}%</strong><small>From recorded entries</small></div></article>
        <article className="stat-card tone-blue"><div className="stat-icon">PR</div><div><span>Present</span><strong>{present}</strong><small>Total present records</small></div></article>
        <article className="stat-card tone-indigo"><div className="stat-icon">AB</div><div><span>Absent</span><strong>{records.filter((record) => record.status === 'Absent').length}</strong><small>Needs review</small></div></article>
        <article className="stat-card tone-cyan"><div className="stat-icon">MO</div><div><span>Monthly Report</span><strong>Ready</strong><small>Exportable summary</small></div></article>
      </div>

      <section className="panel">
        <div className="section-title"><div><h2>Attendance Heatmap</h2><p>Visual monthly presence pattern.</p></div></div>
        <div className="heatmap-grid">
          {Array.from({ length: 35 }, (_, index) => <span key={index} style={{ opacity: 0.25 + ((index * 7) % 70) / 100 }} />)}
        </div>
      </section>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Date</th><th>Course</th><th>Status</th><th>Remarks</th></tr></thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id}>
                  <td>{record.student ? `${record.student.firstName} ${record.student.lastName}` : 'Student'}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.course || '-'}</td>
                  <td><span className="status-pill">{record.status}</span></td>
                  <td>{record.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!records.length && <p className="muted empty-state">No attendance records yet. Start by marking today’s classes.</p>}
        </div>
      </section>
    </section>
  );
}
