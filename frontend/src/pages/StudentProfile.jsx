import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client.js';
import { printHtml } from '../utils/reports.js';

export default function StudentProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get(`/students/${id}/profile`).then(({ data }) => setProfile(data));
  }, [id]);

  if (!profile) {
    return <section className="page"><div className="panel"><p className="muted">Loading student profile...</p></div></section>;
  }

  const { student, attendance, fees, results } = profile;
  const photo = student.profilePhoto || '/assets/studenthub-logo.png';
  const paidFees = fees.filter((fee) => fee.status === 'Paid').length;
  const present = attendance.filter((item) => item.status === 'Present').length;
  const attendanceRate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;

  function printIdCard() {
    printHtml(
      `${student.firstName} ${student.lastName} ID Card`,
      `<div class="card" style="max-width:380px;text-align:center"><img src="/assets/studenthub-logo.png" style="width:80px;height:80px;border-radius:50%"><h1>StudentHub ID Card</h1><h2>${student.firstName} ${student.lastName}</h2><p>${student.rollNumber}</p><p>${student.department} - ${student.course}</p><div style="border:1px solid #12213f;padding:12px;margin:16px auto;width:120px">QR<br>${student.rollNumber}</div></div>`
    );
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Student Profile</span>
          <h1>{student.firstName} {student.lastName}</h1>
          <p>{student.rollNumber} • {student.department} • {student.course}</p>
        </div>
        <Link className="ghost-button" to="/students">Back</Link>
        <button type="button" onClick={printIdCard}>Print ID Card</button>
      </div>

      <section className="profile-grid">
        <article className="panel profile-summary">
          <img className="student-photo-xl" src={photo} alt={`${student.firstName} ${student.lastName}`} />
          <h2>{student.firstName} {student.lastName}</h2>
          <p>{student.email}</p>
          <span className="status-pill">{student.status}</span>
        </article>
        <article className="panel">
          <div className="detail-grid">
            <span>Phone<strong>{student.phone}</strong></span>
            <span>Batch<strong>{student.batch || '-'}</strong></span>
            <span>Semester<strong>{student.semester}</strong></span>
            <span>Guardian<strong>{student.guardian?.name || '-'}</strong></span>
            <span>Attendance<strong>{attendanceRate}%</strong></span>
            <span>Paid Fees<strong>{paidFees}/{fees.length}</strong></span>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel"><h2>Documents</h2><div className="activity-list">{student.documents?.map((doc) => <div className="activity-item" key={doc._id}><span>DC</span><div><strong>{doc.name}</strong><small>{doc.type} • {doc.verified ? 'Verified' : 'Pending'}</small></div></div>)}{!student.documents?.length && <p className="muted">No documents uploaded.</p>}</div></article>
        <article className="panel"><h2>Latest Results</h2><div className="activity-list">{results.slice(0, 4).map((result) => <div className="activity-item" key={result._id}><span>RS</span><div><strong>{result.examName}</strong><small>GPA {result.gpa} • {result.status}</small></div></div>)}{!results.length && <p className="muted">No results available.</p>}</div></article>
      </section>
    </section>
  );
}
