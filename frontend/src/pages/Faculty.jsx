import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function Faculty() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    api.get('/erp/faculty').then(({ data }) => setFaculty(data));
  }, []);

  return (
    <section className="page">
      <div className="page-heading"><div><span className="eyebrow">Department-wise Staff</span><h1>Faculty</h1><p>Manage faculty members, assigned departments, courses, and active status.</p></div><button type="button">Add Faculty</button></div>
      <section className="department-grid">
        {faculty.map((member) => <article className="department-card" key={member._id}><div className="department-head"><span>{member.name.slice(0, 2).toUpperCase()}</span><div><h2>{member.name}</h2><p>{member.designation}</p></div></div><div className="detail-grid"><span>Department<strong>{member.department}</strong></span><span>Courses<strong>{member.courses?.length || 0}</strong></span></div><span className="status-pill">{member.status}</span></article>)}
        {!faculty.length && <article className="department-card"><h2>No faculty added</h2><p className="muted">Create department-wise faculty records for better academic management.</p></article>}
      </section>
    </section>
  );
}
