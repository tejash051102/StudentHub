import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get('/erp/results').then(({ data }) => setResults(data));
  }, []);

  return (
    <section className="page">
      <div className="page-heading"><div><span className="eyebrow">Marksheets</span><h1>Results</h1><p>Publish marks, GPA, subject performance, and printable marksheets.</p></div><button type="button">Add Result</button></div>
      <section className="course-grid">
        {results.map((result) => (
          <article className="course-card" key={result._id}>
            <span className="course-badge">{result.status}</span>
            <div><h2>{result.examName}</h2><p>{result.student ? `${result.student.firstName} ${result.student.lastName}` : 'Student'} - Semester {result.semester}</p></div>
            <div className="detail-grid"><span>GPA<strong>{result.gpa}</strong></span><span>Subjects<strong>{result.subjects?.length || 0}</strong></span></div>
            <button type="button" className="ghost-button">Print Marksheet</button>
          </article>
        ))}
        {!results.length && <article className="course-card empty-course"><h2>No results published</h2><p>Add exam results to generate marksheets and academic reports.</p></article>}
      </section>
    </section>
  );
}
